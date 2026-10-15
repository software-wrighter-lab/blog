---
layout: post
title: "Array Languages #9: X_eTaL and Blender, Scenes and Animation from Arrays"
categories: [languages, language-design, graphics, tools]
tags: [array-languages, xetal, x-etal, apl, blender, bpy, 3d-graphics, animation, rendering, eevee, gltf, code-generation, extensions]
keywords: "X_eTaL Blender, array language 3D graphics, Blender batch rendering, bpy code generation, EEVEE, glTF export, OBJ export, mesh from arrays, camera orbit animation, X_eTaL-extensions, procedural 3D scenes"
abstract: "Ninth in the Array Languages series: X_eTaL drives Blender. An X_eTaL program works out a scene as arrays, every object's place, size and color, every key it moves to, the camera's path and the captions, and a small library writes those arrays into Python as numbers for a fixed player script that Blender runs. Literate documents in progress show the whole path, X_eTaL to Python to a Blender render. Then Blender draws the rest of the series: arrays becoming a model, the HEX1000 machine's memory, a kernel on two GPUs, a tiny network stage by stage, and a matrix product and a softmax, animated."
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
     (transparent, 24 frames, animated WebP). Every figure is a zoomable gutter figure explained by the text beside it.
     2026-10-15 13:00: fe4f698 committed and pushed Video.xtl, the three final videos (now used here) and relu-softmax.org and matmul.org;
     the literate PAGES were still 404 on GitHub Pages at 13:00: verify both links before publishing.
     Earlier: relu-softmax is now the FINAL render (extensions/blender/videos/relu-softmax.webm, untracked) and has a literate
     document, docs/literate/relu-softmax.org (untracked): its page https://softwarewrighter.github.io/X_eTaL-extensions/literate/relu-softmax.html is LINKED BUT NOT LIVE YET (404); Mike: the literate pages go to GitHub Pages late morning 10/15, this post publishes that afternoon:
     verify it is pushed before publishing.
     2026-10-15: Video.xtl, alias vd: (renamed from Film.xtl; untracked in the extensions repo; link it once committed) and the org-mode literate documents for Blender (in progress;
     link them early in the post when they land; docs/literate/water.org is the existing model). -->

<figure style="float: left; width: 205px; margin: 0.8em 2em 1em 0.5em;">
<a href="/2026/10/12/array-languages-xetal-games/"><img src="{{ '/assets/images/posts/block-td-runner-walk.webp' | relative_url }}" class="post-marker no-invert" alt="The runner, a green tower-defense creep, walking" style="width: 205px; float: none; margin: 0 !important; padding: 0;"></a>
<figcaption style="font-size: 0.8em; text-align: center; margin-top: 0.3em;">The runner, one of the tower-defense creeps, walking: its <code>walk</code> clip, rendered by Blender. From the <a href="/2026/10/12/array-languages-xetal-games/">games post</a>.</figcaption>
</figure>

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

<div class="clearfix" markdown="1" style="clear: both;">

## From arrays to a video

Every picture and video in this post comes out of the same pipeline, and it is short to describe. An X_eTaL program works out a scene as arrays: every object's place, size and color, the seconds it is on screen, every key it moves to, the camera's path, and the captions. A library, [`Video.xtl`](https://github.com/softwarewrighter/X_eTaL-extensions/blob/main/extensions/blender/lib/Video.xtl), turns each of those arrays into a line of Python that carries it as plain numbers. And a fixed Python script, the player, reads the numbers and makes the objects and keyframes in Blender, which renders the frames. The player decides nothing: what a video shows is all in the numbers X_eTaL computed.

The library documents itself with examples that run, so each function shows exactly what it writes. Here is one, a group of boxes, each a row of a table: where its middle is, its width, depth and height, its color from 0 to 255, and how brightly it glows. One white bar, two units tall, standing on the floor:

```text
"vd:" u̲se< "Video"
("bar", 1 10 r̲eshape 0 0 1 1 1 2 255 255 255 1) ᵛᵈb̲oxes 0
```

and the line of Python it writes, which the player turns into the bar:

```text
boxes('bar', nums('0.0 0.0 1.0 1.0 1.0 2.0 1.0 1.0 1.0 1.0', 10), 'solid')
```

Other examples check the details a video needs: `vd:l_inear 255 128 0` converts an sRGB color to the linear values Blender's renderer works in, `1.0 0.2195197180748679 0.0`, and `vd:c_ontrast` measures how readable a caption will be against its plate, 21 for white on black, the most a color pair can have.

The whole path is written up as literate documents in Emacs Org mode, where the prose, the X_eTaL code, the Python it produces and the rendered result sit together, each block run to produce what follows it. Two cover the videos in this post, both built with no hand-written Python:

- [**ReLU and softmax, arrays to video**](https://softwarewrighter.github.io/X_eTaL-extensions/literate/relu-softmax.html): the network's arrays from the GPU work's Accel library, softmax a step at a time, the animation at a high level and then in detail, the captions and camera, the tables turned into Python, the fixed player Blender runs, and the render.
- [**Matrix multiply, arrays to video**](https://softwarewrighter.github.io/X_eTaL-extensions/literate/matmul.html): one product a step at a time, then 134 million of them as a fly-through, with every product worked out first and then animated.

They sit in the extensions repo's [collection of literate documents](https://softwarewrighter.github.io/X_eTaL-extensions/literate/), beside one on [water that drains](https://github.com/softwarewrighter/X_eTaL-extensions/blob/main/docs/literate/water.org) in the voxel world.

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

<div style="clear: both;"></div>

### Arrays become a model

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-blender-arrays.webp' | relative_url }}" class="no-invert" alt="Blender's own process in five stages: a profile of 6 points by 2, corners of 96 by 3, faces of 80 by 4, the finished cannon piece, and sixteen rendered frames">
<figcaption style="font-size: 0.85em;">Arrays become a model: profile, corners, faces, the piece, the renders. Click to enlarge.</figcaption>
</figure>

This is the extension's own pipeline, left to right, and it is here because it is the whole idea of the post in one frame. X_eTaL starts from a profile, six points in two columns, and spins it into 96 corners, three coordinates each, then 80 faces of four corners each. Those arrays are all Blender gets: the Python carries them over as numbers, and Blender builds the piece from them and renders it, here as sixteen frames of it turning.

The caption along the bottom of the frame says it in one line: X_eTaL computes the arrays, Python carries them, Blender builds and renders.

<div style="clear: both;"></div>

### HEX1000 as arrays

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-fpga-arrays.webp' | relative_url }}" class="no-invert" alt="HEX1000's RAM as arrays: a snapshot after each key of C0DE+BEEF=, the RAM after the sum as bars, four files of sixteen nibbles, and a seven-segment display reading 17FCd, the same answer as the Tang Nano 9K">
<figcaption style="font-size: 0.85em;">HEX1000 as arrays: its RAM after each key, and the answer. Click to enlarge.</figcaption>
</figure>

From [post #8](/2026/10/14/array-languages-xetal-fpga/). The calculator's whole memory is four files of sixteen 4-bit nibbles, and this picture draws that memory as the machine computes `C0DE+BEEF=`.

Across the top is one small grid per key, from reset to the equals sign, so you can watch the memory change as the program runs. Below, the memory after the sum is drawn as bars, its first file holding the digits D C F 7 1. On the right, the display shows `17FCd`. It is shown because it is the same answer the Tang Nano 9K gave on real hardware: Blender is drawing the X_eTaL specification, and the board agreed with it.

<div style="clear: both;"></div>

### One kernel on two GPUs

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-gpu-arrays.webp' | relative_url }}" class="no-invert" alt="Two vectors x and y as bars, one OpenCL kernel of eight work-items computing 2x + y, and the work spread to an Apple M1 Max in unified memory and an NVIDIA RTX 5060 Ti over PCIe">
<figcaption style="font-size: 0.85em;">One kernel, eight work-items, on two GPUs. Click to enlarge.</figcaption>
</figure>

From [post #7](/2026/10/13/array-languages-xetal-gpu/). This is the smallest possible GPU program, shown because it makes one point visible: the same X_eTaL line runs unchanged on two very different GPUs.

On the left, two vectors of eight numbers, `x` and `y`, drawn as bars, become `2x + y` in a single fused kernel, the purple band, with eight work-items, one per number. The lines fan out to the two GPUs it ran on. On the Apple M1 Max the arrays sit in memory the CPU and GPU share. On the NVIDIA RTX 5060 Ti they have to cross the PCIe bus first. The row of numbers along the bottom is X_eTaL's own evaluator's answer, the one both GPUs must match exactly.

<div style="clear: both;"></div>

### A tiny network, stage by stage

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-blender-gpu-tinynet.webp' | relative_url }}" class="no-invert" alt="A tiny neural network on the GPU, stage by stage: x 4 by 3, times W1 plus b gives z1 4 by 5, relu gives h, times W2 plus b gives z2 4 by 2, softmax gives p 4 by 2; colored cells mark positive, negative and zero values; a bar below shows the 17 GPU launches by kind">
<figcaption style="font-size: 0.85em;">A tiny network on the GPU, stage by stage, and its 17 kernel launches. Click to enlarge.</figcaption>
</figure>

Also from post #7: the two-layer neural network the GPU work runs, every array drawn with its shape. It is shown because it is where the GPU work is heading, machine learning, and because it makes a forward pass something you can see rather than a page of numbers.

Read it left to right. A batch `x` of four examples with three features each is multiplied by the weights `W1` and given a bias, making `z1`, four by five. The ReLU zeroes the negatives, making `h`. A second layer, `W2` and its bias, makes `z2`, four by two, and the softmax turns each row into two probabilities, `p`. Yellow cells are positive, blue negative, and gray the zeros the ReLU made.

The bar along the bottom is what the GPU actually did to compute it: 17 kernel launches, each drawn as wide as its work and colored by kind, matrix products, elementwise steps, slices, tables and reductions.

<div style="clear: both;"></div>

## Video: a matrix product, item by item

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-matmul-steps-poster.webp' | relative_url }}" aria-label="An animated 3D matrix product, A 3 by 4 times B 4 by 2: A on the left wall, B on the ceiling, C on the back wall, every product in the cube between; item by item, then all six at once">
<source src="{{ '/assets/videos/xetal-blender-matmul-steps.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-matmul-steps.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">A matrix product, item by item, then all at once on the GPU. Click to enlarge.</figcaption>
</figure>

A matrix product is the work a GPU does most, in a network's layers, in attention and in graphics, so this video takes a small one apart. It is the GPU work's matmul demo: `A`, 3 by 4, times `B`, 4 by 2. `A` stands on the left wall, `B` on the ceiling and the result `C` on the back wall, and the cube between them holds every product. Its [literate document](https://softwarewrighter.github.io/X_eTaL-extensions/literate/matmul.html) explains how each part was made.

1. **One item.** A row of `A` and a column of `B` light up. Their four products appear in the cube, each with lines back to its two factors.
2. **Added into `C`.** The four products fly into one item of `C` and become its sum.
3. **The next item, quicker.** The first item is slow; the next ones go faster, one after another, the way a loop on a CPU would compute them.
4. **All at once.** Then all six items light at the same time: on a GPU, every item of `C` is a work-item of its own.

The point is the shape of the work: each item of `C` needs one row and one column and nothing else, which is exactly what lets a GPU compute them all at the same time.

<div style="clear: both;"></div>

## Video: the 512 by 512 product

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-matmul-fly-poster.webp' | relative_url }}" aria-label="A fly-through of a 512 by 512 matrix product: the whole scale, a 16 by 16 work-group tile and the rows and columns it reads, one work-item's 512 products along a beam summed from far to near, then C filling a work-group at a time">
<source src="{{ '/assets/videos/xetal-blender-matmul-fly.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-matmul-fly.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The 512 by 512 product from post #7: 134 million multiply-adds. Click to enlarge.</figcaption>
</figure>

The same construct at the size that matters: the 512 by 512 product from [post #7](/2026/10/13/array-languages-xetal-gpu/), the one that ran 31 times faster on the M1 Max than in X_eTaL's evaluator. Each wall now holds 262,144 cells, and the cube 134 million multiply-adds. It is also in the [matrix-multiply document](https://softwarewrighter.github.io/X_eTaL-extensions/literate/matmul.html).

1. **The scale.** The camera starts far out, to show how much there is.
2. **One work-group.** It flies in to a 16 by 16 tile of `C`, the block one GPU work-group computes together, and the rows of `A` and columns of `B` that tile reads.
3. **One work-item.** Then in to a single item: its 512 products stand as bars along a beam through the cube, and a running sum moves from the far end to the near one, where it becomes that one item of `C`.
4. **Every item.** Then `C` fills in, a work-group at a time.

At this size the arithmetic dwarfs the cost of moving the data, which is why products are the work worth sending to a GPU.

<div style="clear: both;"></div>

## Video: ReLU and softmax

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<video autoplay muted loop playsinline preload="metadata" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-relu-softmax-poster.webp' | relative_url }}" aria-label="ReLU and softmax animated: z1 as orange positive and blue negative bars on a glass floor, the negatives turning red and shrinking to zero; then softmax's four steps on z2, ending as four columns of two shares, each exactly 1 tall">
<source src="{{ '/assets/videos/xetal-blender-relu-softmax.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-relu-softmax.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">ReLU, then softmax: each row shares out 1. Click to enlarge.</figcaption>
</figure>

The last two steps of the tiny network from the still above, animated with the real values the network computed. This video has its own [literate document](https://softwarewrighter.github.io/X_eTaL-extensions/literate/relu-softmax.html), which explains every step of how it was made.

1. **ReLU, 0 to 11 seconds.** The first layer's output `z1`, 4 by 5, stands as bars on a glass floor: twenty values, positive ones orange and standing up, the nine negative ones blue and hanging below. The negatives turn red and shrink to zero, leaving only their outlines. What is left is `h`, the ReLU's output: the negatives gone, everything else unchanged.
2. **Softmax, 11.5 to 30 seconds.** The second layer's output `z2`, a row of two scores for each of the four examples, stands as four pairs of bars, and softmax's four steps happen to all of them at once: subtract each row's largest value, raise e to each value, add up each row, shown as a white bar, and divide by that sum.
3. **The result.** Each row ends as one column of its two shares, every column exactly 1 tall: `p`, the network's two probabilities for each example.

The point is the shape of the computation: which values change, which do not, and why softmax's results add up to 1, told by the arrays themselves. Subtracting the largest value first keeps the exponentials from overflowing, and it does not change the answer.

<div style="clear: both;"></div>

## Further out: a render farm

Rendering is the slow part. A video is hundreds of frames, and each frame is its own render, so the work splits naturally: frame 1 does not wait for frame 2. The plan is another extension that hands the Blender work to a render farm instead of the one machine running the program, a cluster of Arch Linux servers with a mix of GPUs, each rendering its share of the frames in parallel. To an X_eTaL program it would look the same as rendering locally: the same Python, the same scene, just more machines doing the frames.

It fits the series. The GPU work in [post #7](/2026/10/13/array-languages-xetal-gpu/) is about getting value out of a mixed collection of GPUs, old and new, and a render farm is another use for the same cards. This is a plan, not yet started.

## Further out: machine learning, step by step

The larger goal is to start from the math. Take an ML equation, or a whole ML transformation pipeline, and produce an interactive 3D visualization of each step and each interim result, showing in painful detail what is actually happening:

- **A CNN's triple sum,** the convolution [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended on, every product and every partial sum where you can see it.
- **Mixture-of-experts dispatch:** each token scored, its top experts chosen, and its work routed to them and gathered back.
- **An Engram lookup:** recent tokens hashed into a memory table and the retrieved rows gated into the model.

And eventually every part of a modern LLM runtime, across many use-cases, inference and fine-tuning both. The ReLU, softmax and matrix-product videos above are the first small steps in that direction. Since the X_eTaL programs computing these steps are the same ones running on the GPUs in [post #7](/2026/10/13/array-languages-xetal-gpu/), each picture would show real values, not an illustration.

## Even further out: a distributed X_eTaL

The longest-term aim reaches past Blender and past any one machine: X_eTaL as a distributed language, running on a custom, virtualized, ML-oriented guest operating system. There it would manage what a large model's runtime has to juggle, the weights, the caches, the activations and the routing, across a mixed cluster of compute and storage: CPUs, GPUs, custom FPGAs and NPUs, SSDs, hard drives and the networks between them. The GPU, FPGA and render-farm work in this series are the first pieces of that, each one putting a different kind of hardware behind the same array language.

## What comes next

These previews become finished explainer videos, each from the real data of the repo it explains: HEX1000 running, from its circuit simulation, with a render that refuses to finish unless the display shows the evaluator's answer; HEX1000 being built, its lookup tables flown to their places on the Gowin die; the GPU kernel being built and then running; and a short trailer, one X_eTaL program driving three things, a GPU, an FPGA and Blender. They are made for this series first, and perhaps a narrated YouTube video later. The pattern stays the same throughout: X_eTaL works out the arrays, writes the Python, and Blender does what it is best at.

</div>
