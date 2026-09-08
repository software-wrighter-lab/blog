---
layout: post
title: "Embedded #2: COR24-RS --- Learn Assembly in Your Browser"
date: 2026-03-22 00:15:00 -0800
categories: [embedded-systems, rust]
tags: [rust, wasm, assembly, fpga, emulator, education, embedded, vibe-coding]
keywords: "COR24, assembly language, RISC architecture, FPGA, soft CPU, MakerLisp, Rust, WebAssembly, emulator, embedded systems, educational programming"
author: Software Wrighter
video_url: "https://www.youtube.com/watch?v=mi7mP-VVhik"
video_title: "Browser-Based Assembly: COR24 RISC Emulator in Rust"
abstract: "A Rust-based browser emulator for the COR24 instruction set architecture. Three tabs---Assembly, C, Rust---all running on the same COR24 CPU in your browser. Includes interactive tutorials, coding challenges, animated tours, self-test mode, realistic UART timing, and a complete ISA reference. No installation required."
series: "Embedded"
series_part: 2
repo_url: "https://github.com/sw-embed/cor24-rs"
demo_url: "https://sw-embed.github.io/cor24-rs/"
---

<img src="{{ '/assets/images/posts/escher-steps.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Learning assembly language feels like climbing an impossible staircase. Each step reveals another layer of complexity---registers, memory addressing, calling conventions. But it doesn't have to be intimidating. The right tools make the invisible visible.

This post introduces **cor24-rs**, a browser-based emulator for the COR24 instruction set architecture. Write assembly, step through instructions, watch registers change. All in your browser, no installation required.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live Demo** | [COR24 Assembly Emulator](https://sw-embed.github.io/cor24-rs/) |
| **Source** | [GitHub](https://github.com/sw-embed/cor24-rs) |
| **Video** | [Browser-Based Assembly: COR24 RISC Emulator in Rust](https://www.youtube.com/watch?v=mi7mP-VVhik)<br>[![Video](https://img.youtube.com/vi/mi7mP-VVhik/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=mi7mP-VVhik) |
| **MakerLisp** | [makerlisp.com](https://makerlisp.com) (COR24 creators) |
| **COR24 Soft CPU** | [FPGA Implementation](https://makerlisp.com/cor24-soft-cpu) |
| **COR24 Dev Board** | [Hardware Kit](https://makerlisp.com/cor24-dev-board) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

---

## What is COR24?

COR24 (C-Oriented RISC 24-bit) is a soft CPU architecture designed by [MakerLisp](https://makerlisp.com). The design priorities were simplicity, speed, and a good impedance match to C compilers on low-density FPGAs---no legacy requirements, no committee compromises. The "C-Oriented" in the name is literal: architectural decisions were informed by what a practical C compiler needs from this class of processor.

### Origin Story

MakerLisp developed COR24 as a replacement for the eZ80, which was the best option they could find for their class of small embedded problems. During the pandemic-era chip shortage, mass-market microcontrollers became unavailable, so they designed their own CPU for FPGAs. The result: a 24-bit RISC architecture that runs at 101 MHz on inexpensive Lattice FPGAs---a simple, fast, and rational alternative built from the ground up with no legacy baggage.

The CPU is written in Verilog and released under the MIT license. It's both a practical embedded solution for small computing problems and an excellent architecture for learning CPU fundamentals. You can build your own hardware implementation or use the browser emulator to explore the architecture.

---

## Architecture Overview

COR24 keeps things simple. Three general-purpose registers, five special-purpose registers, one condition flag, and instructions that are 1, 2, or 4 bytes long.

### Registers

| Register | Purpose |
|----------|---------|
| r0 | General purpose / return value |
| r1 | General purpose / return address |
| r2 | General purpose |
| fp | Frame pointer (special) |
| sp | Stack pointer (special) |
| z | Constant zero (compare instructions only) |
| iv | Interrupt vector (special) |
| ir | Interrupt return (special) |

Only r0, r1, and r2 are truly general-purpose. The named registers (fp, sp, z, iv, ir) have dedicated roles. The z register provides a constant zero accessible only in compare instructions (`ceq r0, z`, `clu z, r0`, `cls r0, z`)---it is not a general-purpose register and cannot be used in mov, ALU, or load/store instructions. The architecture uses a separate condition flag (C) set by compare instructions and tested by branch instructions.

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

Instructions are 1, 2, or 4 bytes (never 3). Register-only operations are compact (1 byte). Loading 8-bit constants (sign- or zero-extended) uses 2-byte instructions (`lc`, `lcu`). Loading full 24-bit values---whether addresses or integers that don't fit in 8 bits---requires 4-byte instructions (`la`). Note: data words are 3 bytes (24-bit), but instruction encoding never uses 3 bytes.

### The Dev Board

<img src="{{ '/assets/images/posts/block-s2-d2-board.webp' | relative_url }}" class="post-marker" alt="COR24 dev board detail showing S2, D2, Reset, and Power">

The COR24-TB dev board exposes the CPU's I/O in a hands-on layout. The S2 button is a user switch---press it and the CPU sees an input event your assembly code can poll or respond to. D2 is a user LED wired to a memory-mapped output address, so your code can toggle it directly with a store instruction. The board breaks out UART connectors for serial communication, with hardware support for an internal interrupt when data arrives---meaning your program doesn't have to busy-wait on the serial port. Beyond these, the board has six additional GPIO pins intended for a four-wire SPI interface and a two-wire I2C bus. MakerLisp is actively developing bit-bang I2C support (temperature sensor reading is next), followed by an I2C real-time calendar clock, a 4-position 7-segment display via SPI, and SD card access via SPI. A Reset button and Power LED round out the essentials.

The emulator models the S2 button, D2 LED, and UART with interrupt support, so programs written for the browser run the same way on real hardware.

<div style="clear: both;"></div>

---

## The Browser Emulator

**cor24-rs** brings COR24 to the web using Rust compiled to WebAssembly. No downloads, no setup---just open the page and start coding.

### Features

- **Three Tabs** - Assembly, C, and Rust pipelines, all running on the same COR24 CPU
- **Interactive Assembly Editor** - Syntax highlighting, error messages, line numbers
- **Step-by-Step Execution** - Execute one instruction at a time with log-scale speed control
- **Register & Memory Viewer** - Watch CPU state change in real-time with highlighted changes
- **Instruction Trace** - Last 100 executed instructions visible in the web UI
- **11 Assembler Examples** - Pre-loaded programs including Blink LED, Fibonacci, Countdown, Variables, and Assert
- **12 Rust Pipeline Demos** - From simple add to UART echo with interrupts
- **2 C Pipeline Examples** - Fibonacci and Sieve of Eratosthenes via MakerLisp's CC24 compiler
- **Coding Challenges** - Test your assembly skills with suggested exercises
- **ISA Reference** - Complete instruction documentation inline with CPU state, interrupts, and memory map
- **Interactive Tutorial** - Comprehensive introduction covering registers, instructions, I/O, and idioms
- **Self-Test Mode** - `?selftest` URL parameter runs all 15 examples automatically with pass/fail reporting
- **Animated Tours** - `?showme-asm`, `?showme-c`, `?showme-rust` walk through each pipeline
- **Realistic UART Timing** - TX busy for 10 cycles per character; dropped characters when writing without polling

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
# Assemble and run in the debugger
cor24-dbg program.s

# Or assemble and run directly
cor24-run program.s

# With LED visualization
cor24-run program.s --leds
```

The CLI debugger (`cor24-dbg`) supports breakpoints, step execution, UART I/O, LED/button simulation, and instruction trace. The `--uart-never-ready` flag forces TX to never clear, useful for testing polling behavior.

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

COR24 is simple enough to fit in your head but realistic enough to represent real CPU design patterns. And unlike purely educational architectures, it's also a practical platform for small embedded problems---the kind of work that used to require an eZ80 or similar microcontroller.

---

## Implementation Details

The emulator core is written in Rust, compiled to WebAssembly via Trunk. Key components:

| Module | Purpose |
|--------|---------|
| `cpu/state.rs` | CPU state management (registers, memory, flags) |
| `cpu/executor.rs` | Instruction execution engine with realistic UART timing |
| `cpu/decode_rom.rs` | Instruction decode ROM (extracted from hardware Verilog) |
| `assembler.rs` | Two-pass assembler with as24-compatible syntax enforcement |
| `challenge.rs` | Coding challenge definitions |
| `selftest.rs` | Automated test runner for all 15 examples |
| `app.rs` | Yew-based web application (3 tabs, animated tours) |

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

1. **COR24 is a real CPU** - Designed for FPGAs, runs at 101 MHz, MIT licensed, practical for embedded work
2. **cor24-rs makes it accessible** - Browser-based, no installation required
3. **Assembly isn't scary** - With good tools, you can see every step
4. **Rust + WASM works** - The entire emulator compiles to a web application
5. **Simple doesn't mean toy** - COR24's design prioritizes C compiler compatibility and practical embedded I/O, not just teaching

---

## Resources

- [MakerLisp](https://makerlisp.com) - COR24 creators
- [COR24 Soft CPU](https://makerlisp.com/cor24-soft-cpu) - FPGA implementation details
- [COR24 Dev Board](https://makerlisp.com/cor24-dev-board) - Hardware development board
- [cor24-rs Demo](https://sw-embed.github.io/cor24-rs/) - Live browser emulator
- [cor24-rs Source](https://github.com/sw-embed/cor24-rs) - Full source code

---

*Assembly language is the ground truth. Everything else is abstraction.*
