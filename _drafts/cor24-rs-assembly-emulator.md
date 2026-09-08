---
layout: post
title: "COR24-RS: Learn Assembly in Your Browser"
date: 2027-01-15 14:00:00 -0800
categories: [embedded-systems, rust]
tags: [rust, wasm, assembly, fpga, emulator, education]
keywords: "COR24, assembly language, RISC architecture, FPGA, soft CPU, MakerLisp, Rust, WebAssembly, emulator, embedded systems, educational programming"
author: Software Wrighter
video_url: "https://youtu.be/UeUqSV2GevE"
video_title: "COR24 Assembly Emulator Demo"
abstract: "A Rust-based browser emulator for the COR24 instruction set architecture. Write, step through, and debug assembly code---no installation required. Includes interactive tutorials, coding challenges, and a complete ISA reference."
series: "Embedded Systems"
series_part: 1
repo_url: "https://github.com/sw-embed/cor24-rs"
demo_url: "https://sw-embed.github.io/cor24-rs/"
---

<img src="/assets/images/posts/escher-steps.png" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Learning assembly language feels like climbing an impossible staircase. Each step reveals another layer of complexity---registers, memory addressing, calling conventions. But it doesn't have to be intimidating. The right tools make the invisible visible.

This post introduces **cor24-rs**, a browser-based emulator for the COR24 instruction set architecture. Write assembly, step through instructions, watch registers change. All in your browser, no installation required.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live Demo** | [COR24 Assembly Emulator](https://sw-embed.github.io/cor24-rs/) |
| **Source** | [GitHub](https://github.com/sw-embed/cor24-rs) |
| **Video** | [COR24 Assembly Emulator Demo](https://youtu.be/UeUqSV2GevE)<br>[![Video](https://img.youtube.com/vi/UeUqSV2GevE/mqdefault.jpg){: .video-thumb}](https://youtu.be/UeUqSV2GevE) |
| **MakerLisp** | [makerlisp.com](https://makerlisp.com) (COR24 creators) |
| **COR24 Soft CPU** | [FPGA Implementation](https://makerlisp.com/cor24-soft-cpu) |
| **COR24 Dev Board** | [Hardware Kit](https://makerlisp.com/cor24-dev-board) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

---

## What is COR24?

COR24 (C-Oriented RISC 24-bit) is a soft CPU architecture designed by [MakerLisp](https://makerlisp.com) for educational and embedded applications. Unlike commercial CPUs, COR24 prioritizes learnability over raw performance.

### Origin Story

MakerLisp developed COR24 during the pandemic-era chip shortage. When mass-market microcontrollers became unavailable, they designed their own CPU for FPGAs. The result: a 24-bit RISC architecture that runs at 101 MHz on inexpensive Lattice FPGAs.

The CPU is written in Verilog and released under the MIT license. You can build your own hardware implementation or use the browser emulator to learn the architecture.

---

## Architecture Overview

COR24 keeps things simple. Three general-purpose registers, five special-purpose registers, one condition flag, and instructions that are 1, 2, or 4 bytes long.

### Registers

| Register | Alias | Purpose |
|----------|-------|---------|
| r0 | - | General purpose / return value |
| r1 | - | General purpose / return address |
| r2 | - | General purpose |
| r3 | fp | Frame pointer (special) |
| r4 | sp | Stack pointer (special) |
| r5 | z | Zero value (compare instructions only) |
| r6 | iv | Interrupt vector (special) |
| r7 | ir | Interrupt return (special) |

Only r0, r1, and r2 are truly general-purpose. The others have dedicated roles. The z register provides a constant zero accessible only in compare instructions. The architecture uses a separate condition flag (C) set by compare instructions and tested by branch instructions.

### Memory Model

- **24-bit address space** (16 MB addressable)
- **Byte-addressable** with little-endian ordering
- **Memory-mapped I/O** at 0xFF0000 - 0xFFFFFF
- **Stack grows downward** (standard convention)

### Instruction Categories

| Category | Instructions |
|----------|-------------|
| Arithmetic | `add`, `sub`, `mul` |
| Logic | `and`, `or`, `xor` |
| Shifts | `shl`, `sra`, `srl` |
| Compare | `ceq`, `cls`, `clu` |
| Branch | `bra`, `brf`, `brt` |
| Jump | `jmp`, `jal` |
| Load | `la`, `lc`, `lcu`, `lb`, `lbu`, `lw` |
| Store | `sb`, `sw` |
| Stack | `push`, `pop` |
| Move | `mov`, `sxt`, `zxt` |

Instructions are 1, 2, or 4 bytes (never 3). Register operations are compact (1 byte), immediate operations use 2 bytes, and loading 24-bit addresses requires 4 bytes. Note: data words are 3 bytes (24-bit), but instruction encoding never uses 3 bytes.

---

## The Browser Emulator

**cor24-rs** brings COR24 to the web using Rust compiled to WebAssembly. No downloads, no setup---just open the page and start coding.

### Features

- **Interactive Assembly Editor** - Syntax highlighting, error messages, line numbers
- **Step-by-Step Execution** - Execute one instruction at a time
- **Register & Memory Viewer** - Watch CPU state change in real-time
- **Built-in Examples** - Pre-loaded programs to study and modify
- **Coding Challenges** - Test your assembly skills
- **ISA Reference** - Complete instruction documentation inline

### Example: Fibonacci

Here's a recursive Fibonacci implementation in COR24 assembly:

```asm
_fib:
        push    fp              ; Save frame pointer
        push    r2              ; Save r2
        push    r1              ; Save return address
        mov     fp,sp           ; Set up frame
        add     sp,-3           ; Local variable space
        lw      r2,9(fp)        ; Load argument n

        lc      r0,2            ; Load constant 2
        cls     r2,r0           ; Compare n < 2
        brf     L17             ; Branch if false

        lc      r0,1            ; Return 1
        bra     L16             ; Jump to epilogue

L17:
        mov     r0,r2           ; r0 = n
        add     r0,-1           ; r0 = n - 1
        push    r0              ; Push argument
        la      r0,_fib         ; Load fib address
        jal     r1,(r0)         ; Call fib(n-1)
        add     sp,3            ; Clean up argument
        sw      r0,-3(fp)       ; Save result

        mov     r0,r2           ; r0 = n
        add     r0,-2           ; r0 = n - 2
        push    r0              ; Push argument
        la      r0,_fib         ; Load fib address
        jal     r1,(r0)         ; Call fib(n-2)
        add     sp,3            ; Clean up argument
        lw      r1,-3(fp)       ; Load fib(n-1)
        add     r0,r1           ; r0 = fib(n-1) + fib(n-2)

L16:
        mov     sp,fp           ; Restore stack
        pop     r1              ; Restore return address
        pop     r2              ; Restore r2
        pop     fp              ; Restore frame pointer
        jmp     (r1)            ; Return
```

This demonstrates the full calling convention: prologue/epilogue, argument passing via stack, and recursive calls.

---

## Command Line Tools

Beyond the browser emulator, cor24-rs includes CLI tools for local development:

```bash
# Assemble source to binary
cor24-as program.s -o program.bin

# Run on the emulator
cor24-run program.bin

# With LED visualization
cor24-run program.bin --leds
```

The LED visualization displays memory-mapped I/O as virtual LEDs, useful for blink programs and visual debugging.

---

## Rust to COR24 Pipeline (Experimental)

The project includes experimental support for compiling Rust to COR24:

```
Rust (.rs) → WASM (.wasm) → COR24 Assembly (.s) → Binary
            ↑               ↑
         rustc          wasm2cor24
        (standard)       (this project)
```

Write embedded Rust with `#![no_std]`, compile to WebAssembly, then translate to COR24 assembly. The wasm2cor24 translator handles the stack-based IR conversion.

This approach leverages Rust's existing toolchain---no compiler modifications needed. The wasmparser crate handles WASM parsing, and COR24's stack-oriented design maps reasonably well from WASM's stack machine.

---

## Why Learn Assembly?

Even if you never write production assembly, understanding it changes how you think about code:

1. **Performance intuition** - Know what your high-level code compiles to
2. **Debugging** - Read crash dumps and disassembly when things go wrong
3. **Security** - Understand buffer overflows, ROP chains, exploitation
4. **Embedded systems** - Some hardware requires low-level access
5. **Appreciation** - Respect the layers beneath your abstractions

COR24 is a good learning architecture because it's simple enough to fit in your head but realistic enough to represent real CPU design patterns.

---

## Implementation Details

The emulator core is written in Rust, compiled to WebAssembly via Trunk. Key components:

| Module | Purpose |
|--------|---------|
| `cpu/state.rs` | CPU state management (registers, memory, flags) |
| `cpu/executor.rs` | Instruction execution engine |
| `cpu/decode_rom.rs` | Instruction decode ROM (extracted from hardware Verilog) |
| `assembler.rs` | Two-pass assembler with label resolution |
| `challenge.rs` | Coding challenge definitions |
| `app.rs` | Yew-based web application |

The decode ROM is particularly interesting---it's extracted directly from the hardware Verilog implementation, ensuring the emulator matches the real CPU behavior exactly.

---

## Try It Yourself

**Live Demo:** [sw-embed.github.io/cor24-rs](https://sw-embed.github.io/cor24-rs/)

The demo includes:
- Pre-loaded example programs
- Interactive tutorials
- Coding challenges with automated verification
- Complete ISA reference

Start with the "Hello World" example, then work through the challenges. By the time you complete them, you'll understand registers, memory, stack operations, and function calls.

---

## Key Takeaways

1. **COR24 is a real CPU** - Designed for FPGAs, runs at 101 MHz, MIT licensed
2. **cor24-rs makes it accessible** - Browser-based, no installation required
3. **Assembly isn't scary** - With good tools, you can see every step
4. **Rust + WASM works** - The entire emulator compiles to a web application
5. **Educational architectures exist** - Not everything needs to be x86 or ARM

---

## Resources

- [MakerLisp](https://makerlisp.com) - COR24 creators
- [COR24 Soft CPU](https://makerlisp.com/cor24-soft-cpu) - FPGA implementation details
- [COR24 Dev Board](https://makerlisp.com/cor24-dev-board) - Hardware development board
- [cor24-rs Demo](https://sw-embed.github.io/cor24-rs/) - Live browser emulator
- [cor24-rs Source](https://github.com/sw-embed/cor24-rs) - Full source code

---

*Assembly language is the ground truth. Everything else is abstraction.*

*Questions? Find me on [YouTube @SoftwareWrighter](https://www.youtube.com/@SoftwareWrighter).*
