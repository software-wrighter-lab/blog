---
layout: post
title: "Array Languages #8: X_eTaL-fpga, Array Programs as Circuits"
categories: [languages, language-design, fpga, hardware]
tags: [array-languages, xetal, x-etal, apl, fpga, verilog, gowin, tang-nano, tang-primer, yosys, nextpnr, apicula, hardware-description, tms1000, uart]
keywords: "X_eTaL FPGA, array language to hardware, Verilog-2005 emitter, netlist, cycle simulator, space versus time, lanes, reduction tree, clocked circuits, UART, HEX1000, TMS1000, 4-bit machine, calculator, Sipeed Tang Nano, Tang Primer, Gowin FPGAs, Yosys, nextpnr, Apicula, openFPGALoader"
abstract: "Eighth in the Array Languages series: X_eTaL-fpga turns X_eTaL programs into circuits. An add on eight numbers becomes eight adders, a sum becomes a tree of adders or one adder used over eight clocks, and a step function over a state vector becomes registers. Every circuit is checked against the evaluator's answer, bit for bit, through layers of simulation and the standard Verilog tools. HEX1000, a 4-bit calculator machine in the spirit of the TMS1000, already calculates in X_eTaL and can be tried in a browser. The work now runs on a Mac and an Arch Linux machine, and hardware testing has begun on a Tang Nano 9K, ahead of the first X_eTaL circuit on a real board."
series: "Array Languages"
series_part: 8
date: 2026-10-14 00:15:00 -0700
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-14 from hardwarewrighter/X_eTaL-fpga: a4a07b3 (docs/boards.md, 2026-10-12) and UNCOMMITTED work in the
     working tree, since committed (67b9892: the Verilog tools, 17 modules, one emitter bug; docs/hardware.md; `just fit`), then 2026-10-14 morning:
     473160b and ebf7768 (HEX1000 in X_eTaL, and its calculator: 33 sequences; Radix's overflow fixed), c6d0a26 and 717e9fe (two lanes, sw on the Mac
     and board on Arch; hardware starts on the Nano 9K, 1K sizing deferred), 5759fb9 (docs/linux-nvidia.md, Arch setup);
     main 22dd31a (HEX1000 to try: terminal, browser, tape), 7eb9176 (browser performance), 376f7f3 (machine-rtl, then web-perf, then radixes),
     a264e08 (no recursion in libs/); board/flow 5a6e4be, de428d4, 9d550a6 (Nano 9K tools; fixture verified in SRAM, then flash; X_eTaL on the board pending).
     The live site hardwarewrighter.github.io/X_eTaL-fpga/ is public though the repo is private. Mac only (Mike, 2026-10-14):
     Arch Linux and the boards are next. Earlier: refreshed 2026-10-12 (last commit 2026-10-08; saga 3 nibble-machine
     active: steps isa, radix-lib, doc-site done; machine-lib next). More changes are expected over the next two days.
     The repo is PRIVATE (GitHub): no repo link or repo_urls until it is public.
     Boards (Mike, 2026-10-11): Sipeed Tang Nano and Tang Primer, 1K, 4K, 9K, 20K, 25K; the repo's README names only a Tang Nano 1K or 4K.
     Nothing has run on an FPGA yet; the Verilog tools now run on the Mac (uncommitted, 2026-10-14): re-check before publishing.
     To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/). -->

<img src="{{ '/assets/images/posts/block-tang-primer.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The same whole-array program that runs on the X_eTaL evaluator, or as threads on a GPU in [post #7](/2026/10/13/array-languages-xetal-gpu/), can also be a circuit. X_eTaL-fpga makes it one: `c ← a + b` on eight 16-bit numbers becomes eight adders, `'+ r̲/ v` becomes a tree of adders, and a machine written as a step function over a state vector becomes registers, a decoder and an ALU. As with the GPU work, the goal is the concept: one typed array program realized as time, as parallel threads, or as physical space, with the same answer.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live site** | [X_eTaL-fpga](https://hardwarewrighter.github.io/X_eTaL-fpga/) --- the libraries' documentation, and [HEX1000 to try in the browser](https://hardwarewrighter.github.io/X_eTaL-fpga/calc/) |
| **The repo** | X_eTaL-fpga, in the hardwarewrighter organization --- private for now; linked here once it is public |
| **The GPU side** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **The language** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## One program, four ways to run it

As with the GPU, every example is an X_eTaL program first, and the evaluator is the reference. Each also has a hand-written twin in a small accelerator IR, and every realization must reproduce the evaluator's answer bit for bit: the IR's interpreter, a simulation of the circuit's netlist, and the generated Verilog.

```text
                X_eTaL program (.xtl)
                        |
      +---------+-------+--------+-----------+
      v         v                v           v
  evaluator  IR interpreter   netlist sim  Verilog
      |         |                |           |
      +---------+-------+--------+-----------+
                        v
                  the same arrays
```

The hardware models are ordinary X_eTaL libraries. Fixed gives two's complement numbers of a stated width, so the evaluator computes exactly what a 16-bit adder would. Datapath holds the example programs at that width. Here is its sum, a tree computed level by level: `h_alve` adds the first half of a vector to the second, wrapping to the width at every adder, and `p_ower` applies it once per level of the tree:

```text
ʰh̲alve ← { w v →
  e ← v c̲at ((t̲ally v) m̲od 2) r̲eshape 0
  h ← (t̲ally e) d̲iv 2
  w ᶠˣw̲rap (h t̲ake e) + h d̲rop e
}
ˡs̲um ← { w x →
  levels ← '+ r̲/ (2 ^ o̲ffsets 63) < t̲ally x
  f̲irst levels '{ v → w ʰh̲alve v } p̲ower x
}
```

There is no recursion in it. An earlier version halved the vector by calling itself, and the repo has since removed unnecessary recursion from its libraries: the sum, the harnesses that clock a circuit, and the runner of the Radix specification are now each `p_ower` applied to one step.

## Space or time

The interesting decision is how much of a computation becomes space and how much becomes time. The schedule chooses the number of lanes. With eight lanes, the sum of eight numbers is combinational: a tree of adders, done in no clocks at all. With one lane it adds one number per clock, with a counter and a register, done after eight clocks. Both come from the same program, and both are pinned as generated Verilog. The eight-lane add is as plain as it sounds:

```verilog
// vector_add: generated by xetal-fpga from an X_eTaL program; do not edit.
// Spatial schedule: 8 lane(s), combinational.
module vector_add (
  input  wire [127:0] in_a,
  input  wire [127:0] in_b,
  output wire [127:0] out_c
);
  ...
  wire signed [15:0] n16 = n0 + n8;
  wire signed [15:0] n17 = n1 + n9;
  ...
```

</div>

<div class="clearfix" markdown="1">

## Circuits with state

The second stage added clocks. Clocked circuits are step functions in X_eTaL, a state in and a state out, and the Clocked library holds the specifications: a counter, an accumulator, a shift register, a sequence detector and a RAM, with a harness that clocks them. The IR, the netlist, the simulator and the Verilog all learned registers, input streams, ROMs and a RAM's write port. Then came a serial port: a UART's transmitter and receiver, written as step functions and looped back, from X_eTaL to a clocked circuit. Testbenches check every clock and write waveforms to look at.

## Checked in software, layer by layer

Nothing here has touched a board yet, so everything is checked in software first, and the checks go deep. Each layer must give the evaluator's answer:

| Layer | What runs | Checked by | Status |
|---|---|---|---|
| 1. the specification | the X_eTaL program | the X_eTaL evaluator | done |
| 2. the IR | the program in the accelerator IR | the IR's interpreter | done |
| 3. the netlist | the scheduled cells | the repo's own cycle simulator | done |
| 4. the Verilog | the emitted Verilog | Icarus Verilog's testbenches, Verilator's lint, Yosys's synthesis | done this week, on the Mac |
| 5. Gowin cells | what Yosys maps to the FPGA's lookup tables, flip-flops and block RAM | Yosys, with a report of what each module takes on a Tang Nano 1K | done this week, on the Mac |
| 6. Gowin cells, simulated | that mapped netlist, run | a cell-level simulator | planned |
| 7. the bitstream | the placed, routed and packed file for a board | unpacked back to Verilog by Project Apicula, then simulated | planned |

Layers 4 and 5 are new. The standard open tools now run on the Mac, and all 17 of the repo's pinned modules pass Icarus Verilog's self-checking testbenches, Verilator's lint and Yosys's synthesis. The tools earned their place at once: they found a bug in the Verilog emitter, which is fixed. Layers 6 and 7 close the gap between "the Verilog is right" and "the board will do it", before a board is ever involved.

## HEX1000: a 4-bit machine

The current stage is a whole machine. HEX1000 is a 4-bit machine in the spirit of the TMS1000, Texas Instruments' 4-bit microcontroller of the 1970s: an original design of about the same size and complexity, not a replica. It keeps the TMS1000's shape: a 4-bit accumulator, a 64 by 4-bit RAM, a ROM of 1,024 eight-bit instructions in 16 pages, and a program counter that steps as a feedback shift register rather than a binary counter. Its ROM program makes it a calculator, hexadecimal first, then octal and decimal, and it talks to a terminal over the UART.

The specification came first. The Radix library is an eight-digit calculator in any radix, written as plain X_eTaL, and the machine's ROM program has to match it key for key.

HEX1000 now runs and calculates, in X_eTaL. The machine is written as its state, a step function that runs one instruction, a harness that runs it, and an assembler. Its ROM program is an eight-digit hexadecimal calculator, adding, subtracting and multiplying, about 330 of HEX1000's own instructions on 7 pages, reading a key matrix and driving the display digit by digit. All 33 test key sequences give the specification's display. The slowest takes 16,406 instructions, about 1.2 ms at the machine's 13.5 million instructions a second. The tests also caught the specification itself: multiplying FFFFFFFF by FFFFFFFF overflowed a 64-bit integer inside the Radix library, which now multiplies in two halves.

It can be tried now: at a terminal, in a [browser page](https://hardwarewrighter.github.io/X_eTaL-fpga/calc/), and as a recorded terminal session. The browser version is slow, and the reason is instructive: the page runs X_eTaL's own engine compiled to WebAssembly, about 4.7 times slower than natively, and that engine interprets the X_eTaL program that in turn interprets HEX1000, about 1,800 of the engine's steps for each HEX1000 instruction. An interpreter running an interpreter is the price of having the machine specified in X_eTaL, and making the page faster is planned.

Next comes the machine as a circuit: lowered, simulated with its calculator program, every key sequence reproduced, the Verilog pinned, and a measure of what it takes on a board. Then the faster browser page, then octal and decimal.

## The boards

The work now runs on two machines in parallel: the software on a Mac, and the boards on an Arch Linux machine, where they are plugged in. And hardware testing has begun, before HEX1000.

The first board is a Tang Nano 9K. The open toolchain is wrapped in the repo's own commands to synthesize, place, pack and load a design, with guarded pin assignments for the board. The first design on it is a test fixture, not yet X_eTaL: an LED counter and a serial loopback, simulated before it was built. On the real board it identified itself over JTAG, loaded into the FPGA's working memory with its checksum confirmed, blinked its LED, reset from its button, and echoed 542 bytes back over the serial line at 115,200 baud. It was then written to the board's flash, which also checked out, and after unplugging and plugging the board back in, it came up on its own and echoed 541 bytes without being reloaded.

Next on the board is the same blink and echo written in X_eTaL, the first circuit from an X_eTaL program on real hardware, and then HEX1000.

The boards are Sipeed's Tang boards, all built on Gowin FPGAs, and Gowin's chip family decides both what a board can hold and what software it needs:

| Family | Boards | The open flow: Yosys, nextpnr, Apicula, openFPGALoader |
|---|---|---|
| GW1N | Tang Nano 1K, 4K and 9K | supported |
| GW2A | Tang Nano 20K, Tang Primer 20K | supported |
| GW5A | Tang Primer 25K | not yet: Gowin's own IDE until the open flow covers it |

They are small. The Tang Nano 1K has 1,152 four-input lookup tables, 864 flip-flops and 72 Kbit of block RAM; the Primer 25K, the largest here, about 23,000 of each and about a megabit of block RAM. Fitting HEX1000 onto the smallest board, the 1K, comes later, and the larger 20K boards are for larger machines.

The plan for the boards follows the checks: wrappers that synthesize, place, pack and load a design; a constraints file for each board; the cell-level simulator and the bitstream round trip from the table above; then HEX1000 on a board, keys in and digits out over a serial line, driven from the host with the same test key sequences the evaluator checks; and the vector datapath at several lane counts, to measure the space-time trade-off in real lookup tables and registers.

The boards are also hard to damage. Loading a design into the FPGA's working memory is the default, and it is volatile: a power cycle brings back whatever was there before. Writing to the board's flash happens only when asked.

This post will be updated as the machine comes together.

</div>
