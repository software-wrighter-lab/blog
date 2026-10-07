---
layout: post
title: "Array Languages #7: X_eTaL-gpu, One Array Program on Old GPUs"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, whole-array parallelism"
abstract: "Seventh in the Array Languages series, a placeholder until the repository reaches critical mass: X_eTaL-gpu runs X_eTaL programs on GPUs, including the Kepler-to-Ampere cards that current CUDA toolkits have retired, through OpenCL. Whole-array operations already expose their parallelism, so the same typed program can run on the evaluator or as thousands of GPU threads, with the same answer."
series: "Array Languages"
series_part: 7
date: 2026-10-31 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- PLACEHOLDER (2026-10-07): flesh out once X_eTaL-gpu reaches critical mass. Date is provisional; publish sets it.
     To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/) once its posts exist.
     Outline: the accelerator IR; kernels emitted as OpenCL C 1.2; the host runtime; scheduling; the old cards and why;
     a demo program, its kernel, and the same answer on CPU and GPU; what the language had to give the IR. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-gpu.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

X_eTaL states a computation as whole-array operations, `c ← a + b`, `'+ r̲/ c`, and those operations already say what can run in parallel. X_eTaL-gpu takes that literally: the same typed program runs on the evaluator, one step at a time, or on a GPU as thousands of threads, and gives the same answer. The target is deliberately old hardware: Kepler, Maxwell, Pascal, Turing and Ampere cards that the current CUDA toolkits have retired, reached through OpenCL. The goal is the concept, not speed.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **The language** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What it is

The repository's parts, from its README:

| Part | What it holds |
|---|---|
| Accel library | the subset of X_eTaL a device can run, as an ordinary typed and tested library |
| Accelerator IR | typed arrays, elementwise maps and reductions, with a text form and a reference interpreter |
| OpenCL emitter | the schedule, and OpenCL C 1.2 kernels generated from the IR |
| Host runtime | devices, buffers and kernels: arrays to the device and back |
| `xetal-gpu` | the command-line tool: devices, check, run, kernel, explain |

## Still to come

This post will grow as the repository does: a program, the kernel it becomes, and the same answer from the evaluator and from a card that CUDA no longer supports.
