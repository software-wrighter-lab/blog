---
layout: post
title: "Array Languages #7: X_eTaL-gpu, Array Programs on GPUs Old and New"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, ada-lovelace, blackwell, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, kernel fusion, tree reduction, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, Ada Lovelace, Blackwell, Apple M1 Max, Apple M3 Pro, Tesla P100, Tesla M40, Quadro K4200, Tesla M10, Tesla P4, GTX 1660 Super, RTX 3060, RTX 3060 Laptop GPU, RTX 3090, RTX 4070 Laptop GPU, RTX 5060 Ti, A2, whole-array parallelism, GPU native extension"
abstract: "Seventh in the Array Languages series: X_eTaL-gpu takes X_eTaL programs to GPUs through OpenCL, old and new. A function written in ordinary X_eTaL is now marked for the GPU with a macro, ᵍᵖa̲ccel<, and runs there, lowered from its own source. Measured so far on an M1 Max and an RTX 5060 Ti, large, product-heavy work in big batches runs 25 to 220 times faster than X_eTaL's own evaluator. Against tuned CPU code a small model does not win yet, and the next examples are built to the rule the measurements give: upload little, keep the data on the GPU, and do a lot of arithmetic per byte."
series: "Array Languages"
series_part: 7
date: 2026-10-13 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-gpu/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT, IN PROGRESS: 2026-10-13 morning, the change of direction (Mike): X_eTaL source run on the GPU through a macro, no hand coding;
     plan decision A4b and saga 4 steps 0n to 0q (core-to-xir, run-from-source, accel-macro, models-from-source) ahead of retrieval; top-k done (620058b);
     core-to-xir begun (2e70b04; uncommitted work in progress 2026-10-13 late morning); gpu-pipeline queued after the lowering steps (8bf756c);
     X_eTaL-ML 20676a0 (what its workloads offer the pipeline), 65567f9 (the denoiser's network as one function, u:n_et),
     c5434cc (cnn-digits and micro-gpt batch programs, rows 4 and 5), d09886e (top-k's finite shift).
     X_eTaL-gpu 3a6321e (run from source, 13 demos), 28c91a9 (the lowering landed; twins deleted; README and landing page: "X_eTaL source, lowered"), 7977809 (ML pin c032768).
     Earlier: refreshed 2026-10-12 night from X_eTaL-gpu at bc90eff (sessions and the OpenBLAS comparison: docs/rtx5060-session-results.md,
     docs/gpu-sessions.md; windows done), X_eTaL-ML 1eded2a, then 866c217 (the denoiser committed); X_eTaL-gpu 0c04f21 (the M1 Max against Accelerate: docs/m1max-session-results.md), de299fc (the rule for a compelling example; retrieval after top-k; the GPT width sweep), c130f30 (lookup); top-k in the working tree, not committed, 2026-10-13 morning. Before that: X_eTaL-gpu c67895c (ml-results.md, rtx5060-results.md, rtx5060-ml-results.md,
     rtx5060-binary-results.md, binary-arrays.md; transpose done; plan sagas 5 to 11), X_eTaL-ML fac586c (world model committed), X_eTaL 27b3fd0.
     Focus (Mike, 2026-10-12): effective use of X_eTaL to run ML tasks faster on a GPU, even an old small one, for tasks worth offloading.
     and X_eTaL-ML's docs/gpu-asks.md and plan.md "Combined with X_eTaL-gpu" (0ff84e8).
     More changes are expected before publishing (saga 4's tiny model, then saga 5 on NVIDIA cards): re-check the status
     and numbers then. To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/) once its posts exist.
     The lead image is a Tesla P4 (Pascal), one of Mike's cards. Card groups (Mike, 2026-10-12): first M1 Max, RTX 3090, RTX 5060 Ti, RTX 3060;
     follow-on the M3 Pro, and one or two of P4, A2, P100, M40 (both P100s: 12 and 16 GB; both M40s: 12 and 24 GB); future maybe K4200, 1660 Super, then the rest. -->

<img src="{{ '/assets/images/posts/block-nvidia-green.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

X_eTaL states a computation as whole-array operations, `c ← a + b`, `'+ r̲/ c`, and those operations already say what can run in parallel. X_eTaL-gpu takes that literally: the same typed program runs on the evaluator, one step at a time, or on a GPU as thousands of threads, and gives the same answer. The targets are old and new cards alike, all reached through OpenCL: current RTX cards, and older Maxwell and Pascal data-center cards that the newest CUDA toolkits retire. The goal is the concept, not speed. And the direction is to write nothing but X_eTaL: mark a function for the GPU with a macro, and it runs there.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **Live site** | [what runs today and the measured results](https://softwarewrighter.github.io/X_eTaL-gpu/) · [the documentation](https://softwarewrighter.github.io/X_eTaL-gpu/doc/) |
| **The lowering** | [X_eTaL source to the GPU's form](https://github.com/softwarewrighter/X_eTaL-gpu/tree/main/components/lower) |
| **Prior post** | [Array Languages #6: X_eTaL-games](/2026/10/12/array-languages-xetal-games/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## The direction: a macro, not a translation

A GPU program should be just X_eTaL. That is now how it works: a function written in ordinary X_eTaL is marked for the GPU with a macro, and everything else happens underneath.

### The Accel library

What a GPU can run is a subset of X_eTaL, and the repo keeps that subset as an ordinary, typed and tested library, Accel. Its 22 exports cover what the models need: elementwise arithmetic and masks, reductions, matrix products, attention scores and a weight gradient, the embedding lookup, the convolution's windows, argmax and top-k, a dense layer and a softmax. Each is one array expression:

```text
ˡr̲elu ← { x → x m̲ax 0 }
ˡs̲cores ← { q k → q '+ '× i̲nner o̲\ k }
ˡe̲mbed ← { t ids → ids s̲elect t }
ˡd̲ense ← { x wb → (x '+ '× i̲nner -1 d̲rop wb) + (o̲ffsets t̲ally x) 'r̲ight t̲able r̲avel -1 t̲ake wb }
```

### The macro, `ᵍᵖa̲ccel<`

A program imports the GPU facade and Accel, and marks a function for the GPU. Here is a network layer, from the repo's [accelerate demo](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/extensions/gpu/demos/accelerate.xtl):

```text
"gp:" u̲se< "Gpu"
"ac:" u̲se< "Accel"
ᵘl̲ayer ← "float float" ᵍᵖa̲ccel< "{ x wb → ᵃᶜr̲elu x ᵃᶜd̲ense wb }"
h ← x ᵘl̲ayer wb
```

On the right is the function, written as X_eTaL text on one line. On the left is how each argument is taken, `float` or `int`; an array of integers that the function looks rows up by, such as token ids, is passed as `int`. After that, `ᵘl̲ayer` is called like any other function.

`ᵍᵖa̲ccel<` is a macro, and like every X_eTaL macro it is a function from source text to source text. `xetal expand` shows what it writes:

```text
ᵘl̲ayer ← ({ x wb → ᵍᵖo̲utput 1 ᵍᵖa̲fter ᵍᵖr̲un 0 ᵍᵖa̲fter 2 ᵍᵖb̲ind wb ᵍᵖa̲fter 1 ᵍᵖb̲ind x ᵍᵖa̲fter "{ x wb → ᵃᶜr̲elu x ᵃᶜd̲ense wb }" ᵍᵖl̲ower "accelerate.xtl|float float" })
```

Read from the right, as X_eTaL evaluates: `ᵍᵖl̲ower` hands the function's text to the GPU extension, with the calling file, so the runner reads the same imports, and the arguments' kinds. Then `x` is bound as the first input and `wb` as the second, `ᵍᵖr̲un 0` runs the program on the first OpenCL device, and `ᵍᵖo̲utput 1` reads the result back. `ᵍᵖa̲fter` puts the calls in that order. Nothing in the expansion is GPU code; it is a few calls to the extension.

The extension does the rest. It lowers the function's text through X_eTaL's own compiler crates, for the shapes of the arrays actually bound, once per set of shapes, and keeps the session: a second call with the same shapes reuses the compiled program, and a call with new shapes is lowered again. The repo's tests run a dense layer at two shapes, an embedding lookup with integer ids, and the softmax of attention scores this way on the M1 Max, each giving the evaluator's own value, and they pin the macro's expansion. The [live site](https://softwarewrighter.github.io/X_eTaL-gpu/) shows each of the demo's definitions beside its expansion.

There are limits for now. The function takes one or two named arrays and returns one array, written on one line with no strings inside. Its libraries are the ones the calling file imports. Anything the lowering cannot take is refused with a reason.

The rest of this post is what was built and measured on the way, the pieces the macro stands on.

## One program, three ways to run it

Every example is an X_eTaL program first, and the X_eTaL evaluator is the reference. Underneath is a small accelerator IR, typed arrays with elementwise maps and reductions, which runs two more ways: in a reference interpreter, and as OpenCL on a GPU. All three must give the same arrays, integers exactly and floats within 1e-5.

```text
                X_eTaL program (.xtl)
                        |
          +-------------+-------------+
          v             v             v
      evaluator    IR interpreter   OpenCL on a GPU
          |             |             |
          +-------------+-------------+
                        v
                  the same arrays
```

Now the IR is produced from the X_eTaL source itself. The lowering takes a program's Core, its libraries included, from X_eTaL's own compiler crates and builds the program the device runs; anything outside the subset it handles is refused with a reason naming the construct. Before it existed, each example was also written out in the IR alongside its source, as scaffolding to build and prove each operation one at a time. Those served as the lowering's test oracle: all twelve examples, lowered from source, give the evaluator's answers on the M1 Max, and the written-out versions are gone.

## From a line of X_eTaL to a kernel

Here is where a line of X_eTaL ends up, for one of the examples from the Accel library, the subset of X_eTaL a device can run. This is the path every program now takes:

```text
ˡp̲ipeline ← { x w → ˡs̲um ˡr̲elu x + x × w }
```

The scheduler fuses the whole elementwise chain, a multiply, an add and a ReLU, into one kernel, one work-item per element, and lays out the sum as a tree in local memory:

```c
// k0: 8 elements, one work-item each; computes %xw %s %pos
__kernel void k0(__global const long* b_x, __global const long* b_w, __global long* b_pos) {
    size_t i = get_global_id(0);
    if (i >= 8) return;
    long t_xw = (b_x[i] * b_w[i]);
    long t_s = (b_x[i] + t_xw);
    long t_pos = max(t_s, 0L);
    b_pos[i] = t_pos;
}
```

The tool shows each step: `xetal-gpu kernel` prints the OpenCL C, and `xetal-gpu explain` says which X_eTaL values became which kernels. How a device runs a program, its widths, work-group and tiles, is a schedule kept as one TOML file per device.

</div>

<div class="clearfix" markdown="1">

## What runs today

Two GPUs have run it so far: the M1 Max in my main Mac, through Apple's OpenCL 1.2, and an RTX 5060 Ti in an Arch Linux machine, through NVIDIA's OpenCL. On both, every check agrees with the evaluator: the example programs, reductions from a thousand items to a million, axis reductions, tiled matrix products, a tiny two-layer network, and, new this week, transpose, the convolution's windows, lookup, the embedding gather, and top-k, each row's largest few. That set is now enough for the machine-learning models ahead. Lowering real programs also turned up a real bug: X_eTaL-ML's top-k subtracted 1e300 to take an item out of a row, which is infinity in a GPU's 32-bit floats and turned the row into NaN, while the CPU's 64-bit floats hid it. The idiom now shifts by the row's range, and the runtime refuses a number too large for 32 bits, naming the fix. On the 5060 Ti the checks also pass in 64-bit floats, which Apple's OpenCL lacks. Through the bridge from [post #4](/2026/10/10/array-languages-xetal-extensions/), an X_eTaL program calls the GPU itself.

## When the GPU pays

A GPU is not automatically faster. Every offload pays fixed costs before a single kernel runs:

- **Setting up and compiling.** Creating a device context and compiling the kernels takes about 80 ms on the M1 Max and 150 to 300 ms on the 5060 Ti. With a session, new this week, that is paid once per program rather than once per run.
- **Moving the arrays.** Through the bridge as text, about 0.4 s for a million numbers. From binary files it is far less, but every new batch must still be uploaded to the device.
- **The kernels themselves.** Usually the smallest part: a fraction of a millisecond for everything measured here.

And there is a second question hiding in "faster": faster than what? There are two CPU baselines, and they give very different answers.

### Against X_eTaL's own evaluator

X_eTaL's evaluator is the reference, written for clarity, not speed. Against it, the line falls where you would expect:

<style>
.pays td.v-bad  { background: rgba(214, 69, 65, 0.22); }
.pays td.v-even { background: rgba(230, 170, 30, 0.24); }
.pays td.v-good { background: rgba(46, 160, 67, 0.22); }
</style>

<table class="pays">
<thead><tr><th>Work</th><th>Machine</th><th>X_eTaL evaluator</th><th>GPU</th><th>Against the evaluator</th></tr></thead>
<tbody>
<tr><td>a thousand items</td><td>RTX 5060 Ti</td><td>0.17 s</td><td>1.29 s</td><td class="v-bad">too small: setup costs more than the work</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>M1 Max</td><td>0.19 s</td><td>2.4 s</td><td class="v-bad">loses: moving the numbers costs more than the arithmetic</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>RTX 5060 Ti</td><td>0.25 s</td><td>1.44 s</td><td class="v-bad">loses, the same way</td></tr>
<tr><td>the small ML benchmarks: a dense layer, a wide inner product, a softmax</td><td>M1 Max</td><td>59 to 179 ms</td><td>about 90 ms</td><td class="v-even">about even: setup is nearly all of the GPU’s time</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>M1 Max</td><td>14.5 s</td><td>0.46 s</td><td class="v-good">31 times faster</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>RTX 5060 Ti</td><td>25.0 s</td><td>0.98 s</td><td class="v-good">25 times faster</td></tr>
<tr><td>a 512 by 512 product, the whole checked program</td><td>M1 Max</td><td>28.75 s</td><td>0.13 s</td><td class="v-good">about 220 times faster</td></tr>
<tr><td>a 512 by 512 product, the whole checked program</td><td>RTX 5060 Ti</td><td>55 s</td><td>0.30 s</td><td class="v-good">about 180 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>M1 Max</td><td>9.9 s</td><td>0.11 s</td><td class="v-good">about 90 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>RTX 5060 Ti</td><td>15.1 s</td><td>0.16 s</td><td class="v-good">about 95 times faster</td></tr>
</tbody>
</table>

The GPU times are whole runs, setup included. The world model's kernels alone take 0.09 ms on the M1 Max and 0.24 ms on the 5060 Ti. The evaluator times differ because the machines do.

### Against tuned CPU code

The stronger test is a CPU running optimized code. The GPU repo ran the trained world model, both layers with their biases, ReLU and sigmoid, on both GPUs, each against its own machine's tuned CPU library: NumPy with Apple's Accelerate on the M1 Max, and NumPy with OpenBLAS on the 5060 Ti's 12-thread Xeon, taking the fastest thread count for each batch. Every run gives the same counts. The GPU keeps its kernels and weights resident in a session and uploads each new batch; the times are medians of repeated calls:

<table class="pays">
<thead><tr><th>World model, batch</th><th>M1 Max: Accelerate (ms)</th><th>M1 Max: GPU (ms)</th><th>GPU against CPU</th><th>5060 Ti machine: OpenBLAS (ms)</th><th>RTX 5060 Ti (ms)</th><th>GPU against CPU</th></tr></thead>
<tbody>
<tr><td>1 state</td><td>0.022</td><td>1.54</td><td class="v-bad">0.01 times</td><td>0.073</td><td>0.21</td><td class="v-bad">0.35 times</td></tr>
<tr><td>64 states</td><td>0.10</td><td>1.79</td><td class="v-bad">0.06 times</td><td>0.23</td><td>0.30</td><td class="v-even">0.76 times</td></tr>
<tr><td>256 states</td><td>0.31</td><td>1.78</td><td class="v-bad">0.17 times</td><td>0.47</td><td>0.66</td><td class="v-even">0.72 times</td></tr>
<tr><td>1,936 states, the whole world</td><td>1.29</td><td>2.51</td><td class="v-even">0.51 times</td><td>1.94</td><td>2.97</td><td class="v-even">0.65 times</td></tr>
<tr><td>8,192 states</td><td>4.68</td><td>5.50</td><td class="v-even">0.85 times</td><td>8.64</td><td>10.53</td><td class="v-even">0.82 times</td></tr>
</tbody>
</table>

The world model does not beat the tuned CPU library at any batch size measured, on either machine. The GPU's kernels are fast: for the whole world of 1,936 states the 5060 Ti's kernels take 0.24 ms. But each call also pays for its launches and for uploading the new batch, and that is about as much as the CPU's whole computation. At 8,192 states the 5060 Ti's upload alone takes 9.9 ms, against 8.6 ms for OpenBLAS to do everything. Apple's OpenCL adds about 1.3 ms to every call, even with nothing to upload, which is why the M1 Max is so far behind on small batches. Running a batch already on the device is cheaper, but repeating identical inputs is not real work, and the repo refuses to count it. On both machines the gap narrows as the batch grows, to 0.85 of the CPU’s speed on the M1 Max and 0.82 on the 5060 Ti at 8,192 states.

The reason is the model's size, and the measurements turn it into a rule. To beat a tuned CPU library, an example needs hundreds of operations for every byte it uploads, and tens of milliseconds of CPU work per call to outweigh the GPU's fixed cost per call, about 0.2 ms on the 5060 Ti and 1.3 ms on the M1 Max. That means uploading only small things, token ids, queries or parameters, and keeping the weights, an index or a model's state resident on the device. The world model does about 40 operations per byte uploaded, so it cannot win, and the plan does not chase it. The repo's broader rule still holds, the batch is the array and the work is products, but against a good CPU library the products have to be big enough and the data has to stay put.

It also settles what counts as an example. Every one is a machine-learning use case, inference, retrieval, training, memory or experts, on a GPU without CUDA. Graphics, physics and pure-math demonstrations are left out, since any card runs graphics already.

That is the point of this work. It is not a race with large, new GPUs, or with tuned CPU libraries on small models. It is to show that an array language, extended with a native extension and the macros that write its facade, one line per GPU function, can get real value out of older and smaller GPUs on machine-learning tasks, and to find honestly where that value starts. Against X_eTaL itself it is already large. Against tuned CPU code it needs bigger work, which is where the plan goes next. The order is deliberate: first confidence in the use-cases and the measurements on a few current GPUs, then one or two older data-center cards.

## The ML models on the GPUs

The machine-learning models from [post #5](/2026/10/11/array-languages-xetal-ml/) are the work this is for. X_eTaL-ML writes no GPU code. It hands over each model as a batch X_eTaL program, with its weights and expected outputs, and X_eTaL-gpu runs it on each device, soon from that program's own source through the macro, as the examples already are, at the command line, since the live pages run X_eTaL as WebAssembly, which cannot reach OpenCL.

- **The world model** predicts a ball's next frame from the last three: 432 pixels in, 64 ReLU units, 144 sigmoid pixels out. Over all 1,936 states it predicts 1,897 next frames exactly, and 348 of the 387 it never trained on, with the same counts on the evaluator, both GPUs and OpenBLAS.
- **The benchmarks,** a dense layer, a wide inner product and a softmax, agree on both GPUs within a relative 1e-5. They are small, and at best break even with the evaluator.
- **A learned denoiser,** new in X_eTaL-ML this week, draws 10 by 10 pictures, a disk, a hollow square or a cross, from noise in ten steps, 128 pictures at once, in 6.3 s in the evaluator. Its network is wider, 256 hidden units, and the ten steps are ten calls, so it will show what a session saves inside a loop. It is committed in X_eTaL-ML, and its network has been reshaped into a single function of arrays inside the subset the lowering handles, ready for the macro, with its pictures unchanged byte for byte.
- **Two more batch programs** are ready for the GPU, written as X_eTaL in X_eTaL-ML and checked against their Rust trainers. The Tiny CNN reads the first 1,000 MNIST test digits as one batch, every picture's windows and one product for the whole batch, and gets 971 right, as its trainer does, in about 9 s in the evaluator. MicroGPT scores the first 1,000 names, matching its trainer's loss to 1e-9 and predicting 2,098 of 7,000 next letters, in about 3.5 s. The CNN fits what the lowering is being built to handle; MicroGPT's attention heads join arrays in a way the first version of the lowering will not cover yet.

## Shrinking the fixed costs

Two of the fixes have landed:

- **Binary arrays.** Inputs can be bound from binary files instead of text. For the world model on the 5060 Ti, binding its inputs fell from 460 ms to 13 ms, and the whole process from about 1.06 s to 0.39 s. Results still come back as text.
- **Sessions.** A session compiles once, keeps the kernels and the device buffers, and uploads only the inputs that change: bind the weights once, then rebind each batch and run again with `ᵍᵖr̲erun`. The first call still pays 150 ms or so; the calls after it cost their upload and kernels.

What remains is the upload of each new batch, which the comparison above shows is now the main cost. Two things answer it: work that does more arithmetic per number uploaded, which is what the next examples are built for, and hiding the upload behind the work, which is the next fix.

- **Pipelining, planned.** The aim shifts from how fast one call returns to how many items per second a stream of calls sustains. The batch is cut into chunks, so that while one chunk computes, the next is uploading and the one before is coming back, and the transfers overlap the work instead of waiting for it. The upload itself gets faster too. Today the 5060 Ti moves a 3.3 MB batch in 2.7 ms, about 1.2 GB/s, far below what its PCIe link can carry, with the host converting every number from 64-bit to 32-bit floats along the way. Pinned 32-bit buffers and transfers that do not block are meant to take that conversion off the critical path. `explain` will show the stages, and the measurements will report sustained items per second, first for the world model against OpenBLAS and Accelerate, then for retrieval.

  The ML models give pipelining two kinds of work. The world model is a stream of independent batches of any size, the plain case for chunking. The denoiser has ten dependent steps per batch, so a stream of batches pipelines step by step: one batch at step t while the next is at step t minus 1. Neither needs anything new from the ML side, since how a batch is cut is the schedule's choice, and both give the same answers however it is cut.

## The road from here

First the direction, then the examples built to beat the CPU:

1. **The lowering, done.** X_eTaL source and the shapes of its inputs in, a program in the GPU's form out, through X_eTaL's own crates, with a reason given for anything outside the subset. Every example now runs this way.
2. **Running from source, done.** `xetal-gpu run program.xtl --device opencl:0` runs a program straight from its source. A statement the GPU cannot take, a sort or a `where`, no longer stops the program: the evaluator computes it and hands the result to the GPU as an input, and everything after it runs on the device. `explain` shows the X_eTaL line each kernel came from. Thirteen examples now agree with the evaluator this way on the M1 Max, and on the RTX 5060 Ti under Linux, each lowered from its own source with no changes.
3. **The macro, done.** `ᵍᵖa̲ccel<`, as above: a function written in X_eTaL, marked for the GPU, lowered and run there, its compiled program reused across calls with the same shapes.
4. **The models from their own source, under way now.** The world model and the benchmarks run from X_eTaL-ML's own programs through the macro, and the results tables say they were run from source.
5. **Pipelining.** Chunks of a batch overlapping their upload, compute and download, as above, measured as sustained items per second.
6. **Retrieval against a resident index.** The first example built to beat the CPU's library, written in X_eTaL and run through the macro: an index of hundreds of thousands of documents, each embedded as 256 numbers, kept on the GPU through a session. A batch of queries is scored against all of it with one product, and the best few for each query are kept by a top-k, measured against NumPy's library with fresh queries on every call. Each number uploaded buys a great many comparisons, the shape the rule asks for. Its two operations are done: lookup, the gather every transformer's embedding uses, and top-k. On 256 queries against 100,000 documents on the M1 Max, the top-k kernel takes 122 ms, against 92 ms for the scoring product.
7. **A GPT, swept by width.** X_eTaL-ML's MicroGPT is the trained anchor, but at 4,192 weights it is below every card's crossover. So the same program runs at widths from 16 to 1,024 and from one layer to four, on a batch of prompts with only token ids uploaded and the weights resident, measured in tokens per second against NumPy's library. Where each card overtakes the CPU is then measured, not claimed. The typed-decision classifier is the same block with a classification head.
8. **Training.** A training step, forward, backward and Adam, as one program per step with the weights resident. Training is where products dominate most, and the weights and their gradients stay on the device between steps, so only each batch moves. Each line of a backward pass is a product with a transpose, which is why transpose came first. The tiny GPT trained from scratch, then GPT-2 small fine-tuned on a small corpus, with the memory each card needs.
9. **The CNNs.** The convolution's windows are now in the GPU's form, so the Tiny CNN and CNN training can follow.
10. **A conditional memory** after DeepSeek's Engram, hashed n-grams looked up in a table. On a GPU that is a gather, so the point there is X_eTaL's concision and the table's size, not speed.
11. **A mixture of experts,** first the array way, every expert computing and the router's mask keeping what was chosen, and a sparse version only if that measures too slow.

Each of these will be measured against both baselines, the evaluator and tuned CPU code.

On Apple silicon there is one more question. Apple deprecated OpenCL years ago in favor of Metal, and the M1 Max pays about 1.3 ms a call through it. A planned post explores using Modular's MAX and Mojo in place of OpenCL, running on Metal on the Macs, for another round of performance measurements on the same chips. In the end the language itself takes over the IR and the lowering, and the whole thing becomes one command: `xetal run --device opencl:0 program.xtl`.

## The cards

OpenCL is the one runtime that reaches all of them, old and new. Testing every card takes a long time: most need to be fitted into a machine, and some of those machines are themselves being repaired. So the cards come in three groups.

**First:** the cards being measured now. The M1 Max and the RTX 5060 Ti have run; the 3090 and 3060 follow.

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M1 Max | Apple GPU | 64 GB unified | development; measured; the higher memory bandwidth |
| RTX 5060 Ti | Blackwell | 16 GB | the newest generation of these cards; measured, the first NVIDIA card |
| RTX 3090 | Ampere | 24 GB | the most memory of the NVIDIA cards I’m working with |
| RTX 3060 | Ampere | 12 GB | a mid-range current card; several of them |

**Follow-on:** once the use-cases and measurements are settled on those, a second Apple GPU, and one or two of these older or smaller data-center cards:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M3 Pro | Apple GPU | 18 GB unified | a newer Apple generation, with less memory and less bandwidth |
| Tesla P4 | Pascal | 8 GB | an old, low-power card the newest CUDA toolkits retire |
| A2 | Ampere | 16 GB | a small, low-power data-center card |
| Tesla P100 | Pascal | 12 GB and 16 GB, one of each | an old data-center card the newest CUDA toolkits retire |
| Tesla M40 | Maxwell | 12 GB and 24 GB, one of each | an old data-center card the newest CUDA toolkits retire |

**Future, maybe:** cards that may be tested later, the K4200 and the 1660 Super the most likely:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Quadro K4200 | Kepler | 4 GB | the oldest and smallest of these cards: the case where weights stay on the host |
| GTX 1660 Super | Turing | 6 GB | a small current card |
| Tesla M10 | Maxwell | four GPUs of 8 GB | built to stream many remote desktops, not to run LLMs; each GPU its own device |
| RTX 3060 Laptop GPU | Ampere | 6 GB | in a System76 laptop |
| RTX 4070 Laptop GPU | Ada Lovelace | 8 GB | in an Asus ROG laptop |

Each card runs a program by a schedule file. The 5060 Ti has its own two, in 32-bit and 64-bit floats, with work-groups of 256: the card allows 1,024, but its compiled reduction kernel allows only 256, and the runtime reported that limit rather than failing. The other NVIDIA cards share templates, untested until a card runs them. Nothing in the code changed for the move to Linux. After each group comes a table of what ran where and how fast, and then smaller numbers: 16-bit floats, 8-bit integers and ternary weights.

## What the work asks for

The asks between the repositories show where each layer of the stack still falls short:

- **Of X_eTaL-gpu, from X_eTaL-ML:** run its models from a pinned commit, now done for the world model and the benchmarks; transpose and the convolution's windows, both now done.
- **Of X_eTaL-extensions:** a newer X_eTaL inside the bridge, since the ML libraries use private helpers and tuples its version lacks; and arrays across the bridge in binary, now half done for inputs.
- **Of the language:** the accelerator IR, the lowering to it, and array shapes known when a program is compiled. Rather than wait, the GPU repo has built the lowering itself, through X_eTaL's own crates, and it moves into the language when the language takes it on.

This post will be updated as the models land on the cards.

</div>

---

<p class="ed-note" style="font-size: 0.85em;"><em>[Ed. 2026/10/17: X_eTaL code is now shown rendered throughout, as <code>xetal render</code> draws it, including code written inside strings, rather than partly as typed; names that are about how you type them stay typed. <a href="https://github.com/software-wrighter-lab/blog/commits/main/_posts/2026-10-13-array-languages-xetal-gpu.md">This post's history</a>.]</em></p>
