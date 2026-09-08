---
layout: post
title: "Rabbit-hole #1: Poor Man's Rust-to-Unsupported-ISA Translator"
date: 2026-03-13 14:00:00 -0800
categories: [embedded-systems, rust]
tags: [rust, assembly, msp430, cor24, embedded, compiler, translation]
keywords: "Rust, COR24, MSP430, assembly, cross-compilation, unsupported target, ISA translation, embedded systems, RISC, no_std, FPGA"
author: Software Wrighter
video_url: ""
video_title: ""
abstract: "How to compile Rust for a CPU that rustc doesn't support---by targeting one it does. Uses MSP430 as a 16-bit stepping stone to generate code for the 24-bit COR24 RISC architecture, then traces the full pipeline from source to registers."
series: "Down the Rabbit-Hole"
series_part: 1
repo_url: "https://github.com/sw-embed/cor24-rs"
demo_url: "https://sw-embed.github.io/cor24-rs/"
---

<img src="{{ '/assets/images/posts/block-rabbit-hole.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

You want to write Rust for a CPU that `rustc` doesn't know about. There's no LLVM backend, no target triple, no supported tier. You could write a compiler backend from scratch---or you could cheat.

This post traces the rabbit hole from Rust source code down to registers on the [COR24](https://makerlisp.com), a 24-bit RISC CPU that exists on real FPGA hardware. The trick: target a CPU that `rustc` *does* support (MSP430, a 16-bit TI microcontroller), then translate the assembly output.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live Demo** | [COR24 Assembly Emulator](https://sw-embed.github.io/cor24-rs/) |
| **Source** | [GitHub](https://github.com/sw-embed/cor24-rs) |
| **MakerLisp** | [makerlisp.com](https://makerlisp.com) (COR24 creators) |
| **Disclaimer** | [Proof of concept only](#disclaimer) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

---

## The Problem

COR24 is a 24-bit RISC soft CPU designed by [MakerLisp](https://makerlisp.com) for FPGAs. It has 3 general-purpose registers, a 24-bit address space, and runs at 101 MHz on inexpensive Lattice FPGAs. It's MIT-licensed, well-documented, and has real hardware you can buy.

But LLVM doesn't have a COR24 backend. Neither does GCC. Writing a full compiler backend could take a lot more effort. We need another way in.

---

## The Trick: Borrow a Target

`rustc` supports MSP430, a 16-bit TI microcontroller, via LLVM's MSP430 backend. It's a nightly-only target (`msp430-none-elf`), but it works. The key insight: MSP430's instruction set is close enough to COR24 that a *translator* can bridge the gap.

The full pipeline:

```
Rust Source (.rs)
     ↓  rustc --target msp430-none-elf --emit asm
MSP430 Assembly (.msp430.s)
     ↓  msp430-to-cor24 translator
COR24 Assembly (.cor24.s)
     ↓  COR24 assembler
Machine Code → COR24 Emulator (or real FPGA hardware)
```

No custom compiler. No modified LLVM. Just Rust's nightly toolchain and a ~1,800-line translator written in Rust. This is a proof-of-concept---an educational demo, not a production tool for real COR24 hardware.

<div class="resource-box" markdown="1">

### Disclaimer {#disclaimer}

This is a proof-of-concept and educational demo. The MSP430-to-COR24 translator is not intended for production use on real COR24 hardware. It demonstrates that the approach is feasible, not that it's complete or reliable. If you're building something real on COR24, use the native assembler and toolchain from [MakerLisp](https://makerlisp.com).

</div>

---

## Level 1: The Compiler Optimizes Away Your Code

Let's start simple. Three numbers, one add:

```rust
#![no_std]

const RESULT_ADDR: u16 = 0x0100;

#[inline(never)]
#[no_mangle]
pub fn demo_add() -> u16 {
    let a: u16 = 100;
    let b: u16 = 200;
    let c: u16 = 42;
    a + b + c  // Returns 342
}

#[no_mangle]
pub unsafe fn start() -> ! {
    let result = demo_add();
    core::ptr::write_volatile(RESULT_ADDR as *mut u16, result);
    loop {}
}
```

Compile to MSP430 and the rabbit hole opens immediately. Here's what `rustc` emits for `demo_add`:

```asm
demo_add:
    mov     #342, r12
    ret
```

Two instructions. LLVM constant-folded `100 + 200 + 42` into `342` at compile time. The addition doesn't exist in the output---the compiler proved the answer is always the same and replaced the computation with a constant load.

The translator converts this to COR24:

```asm
demo_add:
    la      r0, 0x000156    ; load 342 (24-bit)
    jmp     (r1)            ; return via r1
```

Run it in the emulator (`scripts/demo-add.sh`):

```
Executed 3 instructions
CPU halted (self-branch detected)

=== Registers ===
  r0:  0x000156  (     342)
```

Two instructions in `demo_add`, three total to reach halt. The "add" demo that doesn't add.

---

## Level 1.5: More Variables Than Registers

What happens when Rust needs more live variables than COR24 has registers? MSP430 has 12 general-purpose registers. COR24 has 3. The translator has to spill the extras to the stack.

The `accumulate` function keeps 5 values alive simultaneously:

```rust
#[inline(never)]
#[no_mangle]
pub unsafe fn accumulate(seed: u16) -> u16 {
    let a = seed + 1;
    let b = a + seed;
    let c = b + a;
    let d = c + b;
    let e = d + c;
    let result = a ^ b ^ c ^ d ^ e;
    mem_write(RESULT_ADDR, result as u8);
    uart_putc(a);
    uart_putc(b);
    uart_putc(c);
    uart_putc(d);
    uart_putc(e);
    loop {}
}
```

The MSP430 assembly uses registers `r6` through `r10`---five registers that don't exist on COR24:

```asm
accumulate:
    push    r6
    push    r7
    push    r8
    push    r9
    push    r10             ; save 5 callee-saved registers
    mov     r12, r10        ; seed
    mov     r10, r6
    inc     r6              ; a = seed + 1
    add     r6, r10         ; b = a + seed
    mov     r10, r9
    add     r6, r9          ; c = b + a
    ...
```

The translator maps these to frame-pointer-relative stack slots, each 3 bytes (one COR24 word). Where MSP430 writes `mov r10, r6`, COR24 must load from one spill slot, operate, and store to another:

```asm
accumulate:
    sw      r0, 30(fp)     ; spill seed (r10 → offset 30)
    lw      r0, 6(fp)      ; save spill slot for r6
    push    r0
    ...
    lw      r0, 18(fp)     ; load r10 (seed)
    sw      r0, 6(fp)      ; copy to r6 slot
    lw      r0, 6(fp)      ; load r6
    add     r0, 1          ; a = seed + 1
    sw      r0, 6(fp)      ; store r6 back
    ...
    la      r0, 0xFF0000   ; RESULT_ADDR
    ; call mmio_write
    push    r1
    la      r2, mmio_write
    jal     r1, (r2)       ; jal saves return addr in r1
    pop     r1
```

It's verbose---the COR24 output is much longer than the MSP430 input. But it's correct. The emulator confirms the computation with 148 instructions and the XOR result stored to memory at `0x0100`.

---

## Level 2: The Compiler Writes Your Destructor

Rust's Drop trait guarantees cleanup when a value goes out of scope. Does that work on a CPU with no OS, no allocator, no runtime?

```rust
pub struct Guard { addr: u16 }

impl Guard {
    #[inline(never)]
    #[no_mangle]
    pub fn guard_new(addr: u16) -> Guard {
        unsafe { mem_write(addr, 1); }  // mark: alive
        Guard { addr }
    }
}

impl Drop for Guard {
    #[inline(never)]
    fn drop(&mut self) {
        unsafe { mem_write(self.addr, 0); }  // mark: gone
    }
}

#[no_mangle]
pub unsafe fn start() -> ! {
    {
        let _g = Guard::guard_new(STATUS_ADDR);
        // STATUS_ADDR = 1 (guard is alive)
    }
    // STATUS_ADDR = 0 (compiler called drop here)

    mem_write(STATUS_ADDR, 0xFF);  // proof we continued
    loop {}
}
```

Look at the MSP430 assembly for `start`---the compiler inserted the drop call:

```asm
start:
    sub     #2, r1              ; allocate stack space
    mov     #256, r12           ; STATUS_ADDR
    call    #guard_new          ; create guard → writes 1
    mov     #256, 0(r1)         ; store Guard on stack
    mov     r1, r12             ; pass &Guard to drop
    call    #<Guard::drop>      ; compiler-inserted! → writes 0
    mov     #256, r12
    mov     #255, r13
    call    #mem_write          ; writes 0xFF
.LBB4_1:
    jmp     .LBB4_1             ; halt
```

The `call #<Guard::drop>` on line 6 is the compiler honoring the Drop contract. You didn't write that call---`rustc` did. Memory at `STATUS_ADDR` goes: `0 → 1 → 0 → 0xFF`, proving the destructor ran at the right moment.

The translated COR24 assembly preserves this structure---each `call` becomes a `jal` (jump-and-link), which saves the return address in `r1`:

```asm
start:
    sub     sp, 3               ; allocate stack space
    la      r0, 0x000100        ; STATUS_ADDR
    ; call guard_new
    push    r1
    la      r2, guard_new
    jal     r1, (r2)            ; create guard → writes 1
    pop     r1
    ...
    ; call <Guard::drop>        ; compiler-inserted!
    push    r1
    la      r2, <Guard::drop>
    jal     r1, (r2)            ; → writes 0
    pop     r1
```

RAII works on bare metal, on an architecture the Rust compiler has never heard of.

---

## Level 3: Interrupts via `asm!` Passthrough

Here's where it gets interesting. COR24's interrupt mechanism uses hardware registers that MSP430 doesn't have:

- **iv**: Interrupt vector---CPU jumps here when an interrupt fires
- **ir**: Interrupt return---saved PC to return to after the ISR
- **`jmp (ir)`**: Return from interrupt

There's no MSP430 equivalent---the LLVM backend has no concept of these registers. But Rust's `asm!` macro combined with the translator's passthrough mechanism can handle it.

The `demo_echo_v2` example splits the problem: application logic in pure Rust, interrupt plumbing in `asm!` passthrough:

```rust
#![feature(asm_experimental_arch)]

/// Application logic --- pure Rust, compiled normally
#[inline(never)]
#[no_mangle]
pub fn to_upper(ch: u16) -> u16 {
    if ch >= 0x61 && ch <= 0x7A {
        ch & 0xDF  // clear bit 5
    } else {
        ch
    }
}

#[inline(never)]
#[no_mangle]
pub unsafe fn handle_rx() {
    let ch = mmio_read(UART_DATA);
    if ch == 0x21 {               // '!'
        mmio_write(HALT_FLAG, 1);
    } else {
        uart_putc(to_upper(ch));
    }
}
```

The ISR wrapper uses `asm!` with a `@cor24:` prefix that the translator passes through verbatim:

```rust
#[no_mangle]
pub unsafe fn isr_handler() {
    // Save COR24 state (asm! --- no Rust equivalent)
    core::arch::asm!(
        "; @cor24: push r0",
        "; @cor24: push r1",
        "; @cor24: push r2",
        "; @cor24: mov r2, c",      // save condition flag
        "; @cor24: push r2",
    );

    handle_rx();  // ← pure Rust, compiled through the pipeline

    // Restore state and return from interrupt
    core::arch::asm!(
        "; @cor24: pop r2",
        "; @cor24: clu z, r2",      // restore condition flag
        "; @cor24: pop r2",
        "; @cor24: pop r1",
        "; @cor24: pop r0",
        "; @cor24: jmp (ir)",       // return from interrupt
        options(noreturn)
    );
}
```

The `"; @cor24: ..."` lines look like MSP430 comments (so `rustc` ignores them), but the translator recognizes the prefix and emits them as real COR24 instructions. In the final COR24 assembly:

```asm
isr_handler:
    push r0
    push r1
    push r2
    mov r2, c                     ; save condition flag
    push r2
    ; call handle_rx              ← compiled Rust
    push    r1
    la      r2, handle_rx
    jal     r1, (r2)              ; jal saves return addr in r1
    pop     r1
    pop r2
    clu z, r2                     ; restore condition flag
    pop r2
    pop r1
    pop r0
    jmp (ir)                      ← hardware interrupt return
```

The `start` function sets up the interrupt vector and enables UART reception:

```rust
core::arch::asm!(
    "; @cor24: la r0, isr_handler",
    "; @cor24: mov iv, r0",         // iv = interrupt vector register
    "; @cor24: lc r0, 1",
    "; @cor24: la r1, 0xFF0010",    // UART interrupt enable register
    "; @cor24: sb r0, 0(r1)",       // enable UART RX interrupt
);
```

Type a letter, the hardware fires an interrupt, the ISR saves registers, calls `handle_rx` (compiled Rust), converts to uppercase, echoes it via UART, restores registers, and returns. The boundary between Rust and hardware is exactly where you'd expect it.

---

## What the Translator Actually Does

The `msp430-to-cor24` translator (~1,800 lines of Rust) handles the mechanical differences:

| Concern | MSP430 | COR24 | Translation |
|---------|--------|-------|-------------|
| **Word size** | 16-bit | 24-bit | Stack slots: 2 bytes → 3 bytes |
| **Registers** | r12-r14 (args) | r0-r2 (args) | Direct mapping |
| **Spilled regs** | r4-r11 (MSP430) | None (3 GPRs only) | Frame-pointer relative loads/stores |
| **I/O addresses** | 16-bit (0xFF00) | 24-bit (0xFF0000) | Address remapping |
| **Call convention** | `call #func` / `ret` | `jal r1, (r2)` / `jmp (r1)` | Uses COR24's jump-and-link |
| **Tail calls** | `call` + `ret` pattern | `jmp (r2)` | Direct jump, no link |
| **Entry point** | Section order | Reset vector at addr 0 | `la r0, start` + `jmp (r0)` |

**COR24's calling convention** centers on the `jal` (jump-and-link) instruction. `jal r1, (r2)` jumps to the address in `r2` and saves the return address in `r1`. The callee returns with `jmp (r1)`. Since the translator re-uses `r1` for the return address, it saves and restores `r1` around each call with `push r1` / `pop r1`. COR24's native C compiler convention uses a standard prologue (`push fp; push r2; push r1; mov fp,sp`) and passes arguments on the stack---the translator doesn't follow that full protocol, but it does use the same `jal`/`jmp (r1)` mechanism for call and return.

The entry point handling is worth noting. `rustc` emits functions in alphabetical section order, so the panic handler often lands at address 0. Every demo uses a `#[no_mangle] pub unsafe fn start() -> !` as its entry point---a convention I chose for this project. The translator looks for a `start` label and emits a reset vector prologue (`la r0, start` + `jmp (r0)` at address 0), mimicking how real microcontrollers boot. This isn't a Rust or MSP430 convention; it's a project-level rule that keeps the translator simple and every demo consistent.

---

## Try It Yourself

```bash
# Prerequisites
rustup toolchain install nightly
rustup target add msp430-none-elf --toolchain nightly

# Clone and build
git clone https://github.com/sw-embed/cor24-rs.git
cd cor24-rs/rust-to-cor24

# Run the add demo (full pipeline)
bash scripts/demo-add.sh

# Run the UART hello demo
bash scripts/demo-uart-hello.sh

# Or compile any demo project
cargo run --bin msp430-to-cor24 -- --compile demos/demo_drop
```

Each demo script traces the full pipeline: Rust source → MSP430 assembly → COR24 assembly → emulator output with register dumps.

---

## Key Takeaways

1. **You don't need a compiler backend** to target a new architecture. If a similar-enough target exists, a translator can bridge the gap.

2. **The Rust compiler is surprisingly good** at bare-metal code. Constant folding, dead code elimination, and Drop all work correctly even when the output gets re-targeted to an architecture LLVM has never seen.

3. **`asm!` passthrough is the escape hatch.** Hardware-specific operations (interrupt setup, condition flag save/restore) bypass the translation layer entirely using comment-prefix conventions.

4. **The pipeline is auditable.** Every intermediate artifact (`.msp430.s`, `.cor24.s`, register dumps) is human-readable. You can trace any behavior from source to silicon.

---

*The rabbit hole goes deeper. Next time: what happens when the 16-bit intermediate can't express a 24-bit value.*
