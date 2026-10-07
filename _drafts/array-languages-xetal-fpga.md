---
layout: post
title: "Array Languages #8: X_eTaL-fpga, One Array Program as a Circuit"
categories: [languages, language-design, fpga, hardware]
tags: [array-languages, xetal, x-etal, apl, fpga, verilog, gowin, tang-nano, yosys, nextpnr, apicula, hardware-description]
keywords: "X_eTaL FPGA, array language to hardware, Verilog-2005 emitter, netlist cycle simulator, Tang Nano 4K, Gowin open flow, Yosys, nextpnr, Apicula, openFPGALoader, space versus time lanes"
abstract: "Eighth in the Array Languages series, a placeholder until the repository reaches critical mass: X_eTaL-fpga turns X_eTaL programs into circuits. An elementwise add on eight numbers becomes eight adders, a reduction becomes a tree of adders, and a step function over a state vector becomes registers and an ALU, built with the open Gowin flow onto a $20 Tang Nano 4K."
series: "Array Languages"
series_part: 8
date: 2026-10-31 00:15:00 -0700
---

<!-- PLACEHOLDER (2026-10-07): flesh out once X_eTaL-fpga reaches critical mass. Date is provisional; publish sets it.
     The repo hardwarewrighter/X_eTaL-fpga is PRIVATE today (GitHub 404): add repo_urls and a link once it is public.
     To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/), which may carry the hardware side.
     Outline: from array operation to netlist; the cycle simulator; Verilog emitted; lanes, space versus time;
     the Tang Nano 4K and the open toolchain; a calculator as a step function; the same answer in software and in silicon. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-fpga.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The same whole-array program that runs on the X_eTaL evaluator, or as threads on a GPU, can also be a circuit. X_eTaL-fpga makes it one: `c ← a + b` on eight 16-bit numbers becomes eight adders, `'+ r̲/ v` becomes a tree of adders, and a calculator written as a step function over a state vector becomes registers, a decoder and an ALU. The open Gowin flow --- Yosys, nextpnr, Apicula and openFPGALoader --- puts it on a $20 Tang Nano 4K. As with the GPU work, the goal is the concept: one typed array program, realized as sequential time, parallel threads or physical space, with the same answer.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | X_eTaL-fpga, in the hardwarewrighter organization (to be published) |
| **The language** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What it is

From the repository's README: a small accelerator IR; a netlist with a cycle simulator; a Verilog-2005 emitter; a schedule that decides how much of a computation is space and how much is time, in lanes; and the open Gowin toolchain to the board. It lives in a different organization on purpose. The software side maps array programs onto hardware someone else designed; this side uses the array program to describe the hardware itself.

## Still to come

This post will grow as the repository does: one program, its netlist, the simulated cycles, and the board giving the answer the evaluator gave.
