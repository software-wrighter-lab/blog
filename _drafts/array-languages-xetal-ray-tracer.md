---
layout: post
title: "Array Languages #20: A Ray Tracer in X_eTaL, on CPU and GPU"
categories: [programming-languages, array-languages, gpu]
tags: [array-languages, xetal, x-etal, gpu, opencl, ray-tracing, rtx-5060-ti, rendering, macros, arch-linux]
keywords: "X_eTaL ray tracer, array language ray tracing, OpenCL ray tracer, RTX 5060 Ti, Moller-Trumbore, CPU and GPU same source, X_eTaL-gpu, scene DSL macros, uncompressed TIFF frames"
abstract: "Twentieth in the Array Languages series: a ray tracer written as ordinary X_eTaL array code, the same source run on the CPU and, through X_eTaL-gpu's OpenCL path, on an RTX 5060 Ti. The plan, the scene (a thick X with the letters _eTaL rotating around it), the algorithm, and the rules: no host renderer, no CUDA, no copying POV-Ray, and an honest speedup or slowdown. Mike: TODO, update once there is a first image."
series: "Array Languages"
series_part: 20
date: 2026-11-07 00:15:00 -0800
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT (2026-11-06), Mike: "start a new draft for today (series tbd) on using X_eTaL-gpu to implement a ray-tracer, but that
     work is being done first on Arch, so your local clone is not up-to-date yet. I may also test in Apple Silicon CPU/GPU later
     today." Series: Array Languages (where the X_eTaL-gpu posts are), Mike to confirm. Source so far: X_eTaL-gpu origin/main
     890ad37 (2026-11-06 08:06): docs/ray-tracing-plan.md (b630a54, 52db1dd), docs/xetal-libraries-ask.md (RL1-RL4), CHANGES.md.
     Nothing is rendered yet: the plan step is done, ray-source is next; library asks RL1-RL4 await triage. Everything below is the
     PLAN, written as plan; refresh from the repo when the Arch work is pushed. Lead image: placeholder until Mike supplies a
     ray-traced frame. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-ray-tracer.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) runs X_eTaL source on the GPU by lowering it through an intermediate form to OpenCL. A ray tracer is a good test of that: lots of independent pixels, the same arithmetic for each, and a picture at the end that shows at a glance whether it worked. This post is the plan; Mike: TODO, how far the work on Arch has got.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repository** | [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **The plan** | [docs/ray-tracing-plan.md](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/ray-tracing-plan.md) |
| **Earlier** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The first time

I first used ray tracing in the mid-1990s, to make animated fly-throughs around shiny spheres and through pipes; I was the lead developer on IBM's BatchPipes/MVS at the time. I was also a big user of [TSO Pipelines and CMS Pipelines](/2026/02/05/tbt-pipelines-os390/), so I had pipes on my mind. It ran on a CPU, and generating the animation frames was not quick. This time the same kind of rendering is array code, and the question is how much a GPU changes that.

## The rules

The renderer is ordinary X_eTaL array code: camera rays, intersections, the nearest hit, normals, lighting, shadows, reflections and pixel values. The host only supplies arrays, picks the device, runs it and writes files. There is no host implementation of the renderer, no Blender, and no outside rendering engine.

The GPU path is X_eTaL-gpu's existing one, source to intermediate form to OpenCL, first on an RTX 5060 Ti. OpenCL compute does not use the card's RT cores, and the plan does not need CUDA or OptiX.

POV-Ray is the reference for what a ray tracer can do, and for comparing pictures, but nothing is copied from it: it has been AGPL since version 3.7, and the plan avoids GPL and AGPL dependencies.

## The scene

A thick, extruded X stays fixed at the center, and the letters `_eTaL` stand out from it as a rigid vane that turns around the X's vertical axis. The camera does not move. The letters are original outlines, extruded into triangles, over a floor, with one light, so shadows and a reflection show the shape.

It starts smaller: a diagnostic scene of spheres and triangles, then the logo at 640 by 360, then a full turn as 240 frames, about eight seconds at 30 frames a second.

## The algorithm

A pinhole camera, the Möller-Trumbore ray-triangle test, and the nearest positive hit. Ambient and diffuse light first, with hard shadow rays, then one reflection bounce once those agree. Rays, triangles, materials and hits are all fixed-shape arrays, and pixels and triangles are processed in batches so memory never has to hold every pixel against every triangle.

Reusable pieces go into the X_eTaL libraries rather than the GPU repository, as four requests: 3D math, an extrusion and glyph macro, a small scene notation with transform groups, and the ray-tracing functions themselves. The scene notation is a macro that expands into ordinary X_eTaL arrays, not a hidden renderer.

## Measuring it honestly

The same source runs three ways: X_eTaL's evaluator as the reference, the intermediate form's CPU interpreter, and OpenCL on the GPU. Pictures are compared pixel by pixel, with stated tolerances, never by eye. Timings separate setup, warm-up, device time and the whole run, and file writing is left out of any speedup. A slowdown gets reported as one.

The output is uncompressed TIFF, plus raw floating-point arrays for the comparisons.

Mike: TODO, results: the first image, CPU and GPU timings, and Apple Silicon if you test it there.

## Closing

Mike: TODO, a closing in your words.
