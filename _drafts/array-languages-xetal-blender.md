---
layout: post
title: "Array Languages #9: X_eTaL and Blender, Scenes and Animation from Arrays"
categories: [languages, language-design, graphics, tools]
tags: [array-languages, xetal, x-etal, apl, blender, bpy, 3d-graphics, animation, rendering, eevee, gltf, code-generation, extensions]
keywords: "X_eTaL Blender, array language 3D graphics, Blender batch rendering, bpy code generation, EEVEE, glTF export, OBJ export, mesh from arrays, camera orbit animation, X_eTaL-extensions, procedural 3D scenes"
abstract: "Ninth in the Array Languages series: X_eTaL drives Blender. An X_eTaL program writes the Python that Blender runs in the background, works out the geometry as arrays, and gets back renders, animations and 3D files. Here Blender turns to the rest of the series and draws what the other repos compute: arrays becoming a model, the HEX1000 machine's memory, a kernel on two GPUs, a tiny network stage by stage, and a matrix product and a softmax, animated, each from the real data those programs produce."
series: "Array Languages"
series_part: 9
date: 2026-10-15 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<!-- DRAFT, IN PROGRESS (2026-10-14): rebuilt around X_eTaL-extensions/extensions/blender/work/pipeline/preview (Saga 15 step 11 and the
     explainer steps): blender-arrays, fpga-arrays, gpu-arrays, gpu-tinynet (PNG) and matmul-steps, matmul-fly, relu-softmax (MP4), all
     previews from work/, not yet committed in the repo: re-check them, and swap in the final renders when they land. The game material
     belongs to post #6 and is left out (Mike), except the lead image: the runner creep's walk clip, rendered from runner.glb in Blender
     (transparent, 24 frames, animated WebP). Every figure is a zoomable gutter figure explained by the text beside it. -->

<img src="{{ '/assets/images/posts/block-td-runner-walk.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The extensions in [post #4](/2026/10/10/array-languages-xetal-extensions/) gave X_eTaL a database, sound, windows and a small 3D renderer of its own. The newest one hands the 3D work to a real tool: Blender. An X_eTaL program describes a scene as arrays, Blender renders it, and what comes back is pictures, video and 3D files. This post is the start of that work, and it will grow as the use-cases do.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The extension** | [X_eTaL-extensions: blender](https://github.com/softwarewrighter/X_eTaL-extensions/tree/main/extensions/blender) --- the facade, the bpy writer, the demos |
| **First look** | [Saw #14](/2026/10/11/saw-guards-lints-macros-blender/) |
| **Prior posts** | [Array Languages #4: X_eTaL-extensions](/2026/10/10/array-languages-xetal-extensions/) · [the voxel world](/2026/10/09/voxels-3d-worlds-array-languages/) |
| **What it shows** | [the GPU, #7](/2026/10/13/array-languages-xetal-gpu/) · [the FPGA, #8](/2026/10/14/array-languages-xetal-fpga/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

<div style="clear: both;"></div>

## The chain

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 44%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-hello-poster.webp' | relative_url }}" aria-label="A terminal recording of the hello demo: the X_eTaL program, the Python launcher and Blender script it writes as text, the run, and the report Blender wrote: objects: Camera Cube Light">
<source src="{{ '/assets/videos/xetal-blender-hello.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-hello.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The hello demo: X_eTaL writes the Python, runs Blender, and reads back what Blender found. Click to enlarge.</figcaption>
</figure>

Blender is scripted in Python, through its `bpy` module, and it can run without a window. So the extension does not call Blender directly. An X_eTaL program writes two Python scripts as text: a short launcher that starts Blender in the background with its factory settings, and the `bpy` script Blender runs inside. The extension writes them to disk, runs the launcher under a timeout, keeps the whole output in a log, and answers with the exit status and the last lines. The program then reads back what was made.

The smallest demo, `hello`, runs the whole chain once, and the recording beside this section shows it at a terminal. The X_eTaL program holds the launcher and the Blender script as two strings of Python, writes them to files, and runs the launcher. Blender starts in the background with its factory settings, the script lists the objects in its starting scene and writes them to a report, and the X_eTaL program reads that report back: `objects: Camera Cube Light`. Nothing is drawn; the point is that every link in the chain works.

```text
X_eTaL  →  blender extension  →  python3  →  Blender, in the background  →  Python inside Blender
```

Two choices shape it. The program generates the `bpy` code itself, rather than handing data to a fixed script, so anything Blender's Python can do is in reach. And the renderer is EEVEE, Blender's fast one. File paths stay inside the working directory, and a Python error inside Blender fails the run.

## Geometry as arrays

The library on top, `Bpy.xtl`, returns pieces of a script as text: an empty scene, cubes, 3D labels, a sun and a sky, a camera, EEVEE settings, a still, a video, exports. The geometry is X_eTaL's. Here is every corner and face of *n* cubes at once, as one mesh:

```text
ˡc̲ubeMesh ← { (cs, size) z →
  n ← 1 s̲elect s̲hape cs
  c̲ol ← { k → r̲avel (k s̲elect₂ cs) '+ t̲able size × k s̲elect₂ corners }
  v ← 2 1 t̲ranspose (3 c̲at 8 × n) r̲eshape (c̲ol 1) c̲at (c̲ol 2) c̲at c̲ol 3
  f ← ((6 × n) c̲at 4) r̲eshape r̲avel (8 × (r̲ange n) − 1) '+ t̲able r̲avel sides
  (v, f)
}
```

The corners are an outer product: each center plus each of a unit cube's eight corners, scaled, one coordinate at a time. The faces are another: each cube's offset into the corner list plus the six sides' corner numbers. No loop over cubes, and a thousand cubes cost the same few lines as one. The numbers go into the script, and Blender builds one mesh from them.

</div>

<div class="clearfix" markdown="1">

## Blender draws the series

The extension's next job is to show the rest of this series rather than tell it. Each picture and video below was made by Blender, from data the other X_eTaL programs produce, so what is on screen is what the code computed. These are previews of explainer videos still being made. The four stills come first, then three short videos, each with a section of its own.

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-blender-arrays.webp' | relative_url }}" class="no-invert" alt="Blender's own process in five stages: a profile of 6 points by 2, corners of 96 by 3, faces of 80 by 4, the finished cannon piece, and sixteen rendered frames">
<figcaption style="font-size: 0.85em;">Arrays become a model: profile, corners, faces, the piece, the renders. Click to enlarge.</figcaption>
</figure>

**Arrays become a model.** This is the extension's own pipeline, left to right. X_eTaL starts from a profile, six points in two columns, and spins it into 96 corners, three coordinates each, then 80 faces of four corners each. Those arrays are all Blender gets: the Python carries them over as numbers, and Blender builds the piece from them and renders it, here as sixteen frames of it turning. The caption at the bottom of the frame says it in one line: X_eTaL computes the arrays, Python carries them, Blender builds and renders.

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-fpga-arrays.webp' | relative_url }}" class="no-invert" alt="HEX1000's RAM as arrays: a snapshot after each key of C0DE+BEEF=, the RAM after the sum as bars, four files of sixteen nibbles, and a seven-segment display reading 17FCd, the same answer as the Tang Nano 9K">
<figcaption style="font-size: 0.85em;">HEX1000 as arrays: its RAM after each key, and the answer. Click to enlarge.</figcaption>
</figure>

**The HEX1000 machine as arrays.** From [post #8](/2026/10/14/array-languages-xetal-fpga/): the calculator's whole memory is four files of sixteen 4-bit nibbles, and this picture draws it. Across the top, one small grid per key of `C0DE+BEEF=`, from reset to the equals sign, shows the memory changing as the program runs. Below, the memory after the sum is drawn as bars, its first file holding the digits D C F 7 1, and the display shows `17FCd`, the answer the Tang Nano 9K gave on real hardware.

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-gpu-arrays.webp' | relative_url }}" class="no-invert" alt="Two vectors x and y as bars, one OpenCL kernel of eight work-items computing 2x + y, and the work spread to an Apple M1 Max in unified memory and an NVIDIA RTX 5060 Ti over PCIe">
<figcaption style="font-size: 0.85em;">One kernel, eight work-items, on two GPUs. Click to enlarge.</figcaption>
</figure>

**Arrays on two GPUs.** From [post #7](/2026/10/13/array-languages-xetal-gpu/): two vectors of eight numbers, `x` and `y`, become `2x + y` in a single fused kernel of eight work-items, one per number. The lines fan out to the two GPUs it ran on, the M1 Max, where the arrays sit in memory the CPU and GPU share, and the RTX 5060 Ti, where they cross PCIe. The row of numbers at the bottom is the evaluator's answer, the one both GPUs must match.

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-gpu-tinynet.webp' | relative_url }}" class="no-invert" alt="A tiny neural network on the GPU, stage by stage: x 4 by 3, times W1 plus b gives z1 4 by 5, relu gives h, times W2 plus b gives z2 4 by 2, softmax gives p 4 by 2; colored cells mark positive, negative and zero values; a bar below shows the 17 GPU launches by kind">
<figcaption style="font-size: 0.85em;">A tiny network on the GPU, stage by stage, and its 17 kernel launches. Click to enlarge.</figcaption>
</figure>

**A tiny network, stage by stage.** The two-layer network from the GPU work, every array drawn with its shape: a batch `x` of 4 by 3, times the weights `W1` plus a bias to give `z1`, the ReLU to give `h`, then `W2` and a softmax to give the probabilities `p`, 4 by 2. Yellow cells are positive, blue negative, and gray the zeros the ReLU made. The bar along the bottom is what the GPU actually did: 17 kernel launches, each as wide as its work, colored by kind, matrix products, elementwise steps, slices, tables and reductions.

<div style="clear: both;"></div>

## Video: a matrix product, item by item

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-matmul-steps-poster.webp' | relative_url }}" aria-label="An animated 3D matrix product: one item of C is a row of A times a column of B, four products added; then the next item; then on the GPU all six items at once, one work-item each">
<source src="{{ '/assets/videos/xetal-blender-matmul-steps.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-matmul-steps.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">A matrix product, item by item, then all at once on the GPU. Click to enlarge.</figcaption>
</figure>

Matrix products are where the GPU pays off, so this video takes a small one apart. The two input matrices sit on two faces of a box, `A` on the left wall and `B` across the top, each cell labeled with its number, and the result `C` grows inside the box where a row of `A` and a column of `B` meet.

It goes in four steps:

1. **One item.** A row of `A` and a column of `B` light up, and a line runs from each pair of cells to the item of `C` they make.
2. **Four products, added.** The pairs multiply, four products in all, and the products stack and add into that one item of `C`.
3. **The next item, and the next.** The highlight moves on, one item at a time, the way a loop on a CPU would compute them.
4. **The GPU's way.** Then all six items of `C` appear at once, each computed by its own work-item, the same arithmetic done in parallel.

The point is the shape of the work: every item of `C` is independent of the others, which is exactly what lets a GPU compute them all at the same time.

<div style="clear: both;"></div>

## Video: the 512 by 512 product

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-matmul-fly-poster.webp' | relative_url }}" aria-label="A fly-through of a 512 by 512 matrix product: 134 million multiply-adds; one item of C as 512 products added from the far end; a work-group as a 16 by 16 tile of C; every item of C, 262,144 sums, a work-group at a time">
<source src="{{ '/assets/videos/xetal-blender-matmul-fly.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-matmul-fly.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The 512 by 512 product from post #7: 134 million multiply-adds. Click to enlarge.</figcaption>
</figure>

The same idea at the size that matters: the 512 by 512 product from [post #7](/2026/10/13/array-languages-xetal-gpu/), the one that ran 31 times faster on the M1 Max than in X_eTaL's evaluator. The inputs are drawn as heat maps on the box's faces, and the result fills the box.

The camera flies through it in four moves:

1. **The whole job.** 512 × 512 × 512: about 134 million multiply-adds, labeled as the box comes into view.
2. **One item of the result.** The camera dives along one line through the box: 512 products, drawn as bars, added one at a time from the far end into a single number.
3. **One work-group.** It pulls back to a 16 by 16 tile of the result, the block of 256 items one GPU work-group computes together, sharing the inputs it reads in fast local memory.
4. **Every item.** Then all 262,144 items of the result, filled in a work-group at a time.

At this size the arithmetic dwarfs the cost of moving the data, which is why products are the work worth sending to a GPU.

<div style="clear: both;"></div>

## Video: ReLU and softmax

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-relu-softmax-poster.webp' | relative_url }}" aria-label="ReLU and softmax animated: a field of positive and negative values where every negative becomes zero; then exponentials, each row's largest value 1; then each row of p 4 by 2 shares out 1">
<source src="{{ '/assets/videos/xetal-blender-relu-softmax.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-relu-softmax.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">ReLU, then softmax: each row shares out 1. Click to enlarge.</figcaption>
</figure>

The last two steps of the tiny network from the still above, animated, with the real numbers it computed on the bars.

1. **ReLU.** The hidden layer is a grid of bars on a plate, positive values standing up in yellow and negative ones in red. Every red bar drops to zero: that is all a ReLU does, and it is one elementwise step on the GPU.
2. **Softmax, step one: shift and exponentiate.** Each row of the output has its largest value subtracted, then every value is exponentiated. Every value is now positive, and the largest in each row is exactly 1.
3. **Softmax, step two: share out 1.** Each row is divided by its own sum, so the two values in each row of `p`, 4 by 2, stack up to exactly 1: the network's two probabilities for each of the four inputs.

Subtracting the largest value first is the standard way to keep the exponentials from overflowing, and it does not change the answer.

<div style="clear: both;"></div>

## What comes next

These previews become finished explainer videos, each from the real data of the repo it explains: HEX1000 running, from its circuit simulation, with a render that refuses to finish unless the display shows the evaluator's answer; HEX1000 being built, its lookup tables flown to their places on the Gowin die; the GPU kernel being built and then running; and a short trailer, one X_eTaL program driving three things, a GPU, an FPGA and Blender. They are made for this series first, and perhaps a narrated YouTube video later. The pattern stays the same throughout: X_eTaL works out the arrays, writes the Python, and Blender does what it is best at.

</div>
