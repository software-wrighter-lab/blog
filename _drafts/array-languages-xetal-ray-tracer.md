---
layout: post
title: "Array Languages #20: A Ray Tracer in X_eTaL, on CPU and GPU"
categories: [programming-languages, array-languages, gpu]
tags: [array-languages, xetal, x-etal, gpu, opencl, ray-tracing, rtx-5060-ti, rendering, glass, macros, arch-linux]
keywords: "X_eTaL ray tracer, array language ray tracing, OpenCL ray tracer, RTX 5060 Ti, glass sphere, area light, CPU and GPU same source, X_eTaL-gpu, X_eTaL-libraries, scene DSL macros, uncompressed TIFF frames"
abstract: "Twentieth in the Array Languages series: a ray tracer written as ordinary X_eTaL array code, the same source run on the CPU and, through X_eTaL-gpu's OpenCL path, on an RTX 5060 Ti. In two days on Arch Linux it went from a plan to a glass sphere under an area light, reflections and shadows, an animated logo, and a 1280 by 512 frame that took ten minutes on the CPU and about a second on the GPU. Mike: TODO, Apple Silicon results if you get them."
series: "Array Languages"
series_part: 20
date: 2026-11-07 00:15:00 -0800
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
---

<!-- DRAFT (2026-11-06, refreshed 2026-11-07 noon), Mike: ray tracer in X_eTaL-gpu, worked first on Arch (large12); more changes
     before publishing; Apple Silicon maybe. Sources: X_eTaL-gpu main 2107140 (2026-11-06 23:16): CHANGES.md, docs/ray-tracing-plan.md,
     site-assets/ray/{logo,logo-still,logo-gpu,image-pair}/README.md + manifest.json + timings.txt. X_eTaL-libraries main bdacede
     (2026-11-07 10:10): RL1-RL7 commits, docs/rendered-scenes.md, libs/*/docs/presentation-*.html (PNGs extracted from these; the
     work/ dir is gitignored, Mike 2026-11-07). Live demos: softwarewrighter.github.io/X_eTaL-libraries/#Scene/logo, #RayTrace/diagnostic,
     #Glass/lens-area (Mike's URLs). Numbers: CPU still 1280x512 1 spp, 32 strips, 4 workers, render_wall_seconds 606.7; GPU still
     same size, RTX 5060 Ti, second resident run 890.943 ms device, 1213.376 ms total, setup 5003.902 ms; NOT a matched benchmark
     (different library revision, strips), per the GPU README. Animation: 24 frames 160x64, CPU, render_wall_seconds 2349.7.
     Lead image: the Scene/logo presentation render (Mike, 2026-11-07), replacing the placeholder. -->

<img src="{{ '/assets/images/posts/ray-scene-logo.webp' | relative_url }}" class="post-marker no-invert" alt="X_eTaL in extruded letters, a white X and orange eTaL, reflected in a glossy floor under a dark sky" style="width: 260px;">

[X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) runs X_eTaL source on the GPU by lowering it through an intermediate form to OpenCL. A ray tracer is a good test of that: lots of independent pixels, the same arithmetic for each, and a picture at the end that shows at a glance whether it worked. In two days, on Arch Linux, it went from a plan to the picture above.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live demos** | [Scene/logo](https://softwarewrighter.github.io/X_eTaL-libraries/#Scene/logo), [RayTrace/diagnostic](https://softwarewrighter.github.io/X_eTaL-libraries/#RayTrace/diagnostic), [Glass/lens-area](https://softwarewrighter.github.io/X_eTaL-libraries/#Glass/lens-area) |
| **Ray tracing on the GPU** | [X_eTaL-gpu](https://softwarewrighter.github.io/X_eTaL-gpu/) (site), [repository](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **The libraries** | [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries): Vector3, Extrusion, Scene, RayTrace, Glass |
| **The plan** | [docs/ray-tracing-plan.md](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/ray-tracing-plan.md) |
| **Earlier** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The first time

I first used ray tracing in the mid-1990s, to make animated fly-throughs around shiny spheres and through pipes; I was the lead developer on IBM's BatchPipes/MVS at the time. I was also a big user of [TSO Pipelines and CMS Pipelines](/2026/02/05/tbt-pipelines-os390/), so I had pipes on my mind. It ran on a CPU, and generating the animation frames was not quick. This time the same kind of rendering is array code, and the question is how much a GPU changes that.

## The rules

The renderer is ordinary X_eTaL array code: camera rays, intersections, the nearest hit, normals, lighting, shadows, reflections and pixel values. The host only supplies arrays, picks the device, runs it and writes files. There is no host implementation of the renderer, no Blender, and no outside rendering engine.

The GPU path is X_eTaL-gpu's existing one, source to intermediate form to OpenCL, on an RTX 5060 Ti. OpenCL compute does not use the card's RT cores, and none of this needs CUDA or OptiX. POV-Ray is a reference for what a ray tracer can do, but nothing is copied from it.

## Libraries first

The reusable parts went into [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) as requests the GPU repository filed and the libraries delivered, in order: 3D vector math (Vector3), contour extrusion with original letter shapes (Extrusion), named scene arrays and rigid group animation (Scene), the opaque ray tracer itself (RayTrace), sphere geometry, bounded glass transport (Glass), and then sampling, thin lenses and area lights.

Each library has a live demo with a recorded render above an editable program. Run computes a quick version in the browser; the recorded image is a slower offline render of the same scene at full size.

<figure class="zoomable">
<img src="{{ '/assets/images/posts/ray-diagnostic.webp' | relative_url }}" class="no-invert" alt="An orange cube and a blue octahedron on a glossy gray floor, with hard shadows and reflections, under a dark blue sky">
<figcaption style="font-size: 0.85em;">The <a href="https://softwarewrighter.github.io/X_eTaL-libraries/#RayTrace/diagnostic">RayTrace diagnostic</a>: 640 by 426, 4 samples per pixel. Click to enlarge.</figcaption>
</figure>

## Glass

<figure class="zoomable">
<img src="{{ '/assets/images/posts/ray-glass-lens-area.webp' | relative_url }}" class="no-invert" alt="A clear glass sphere floating above a pale floor under a bright rectangular area light, casting a soft shadow">
<figcaption style="font-size: 0.85em;">The <a href="https://softwarewrighter.github.io/X_eTaL-libraries/#Glass/lens-area">Glass lens/area demo</a>: 640 by 360, 64 samples per pixel. Click to enlarge.</figcaption>
</figure>

A glass sphere under an area light, with a thin-lens camera and 64 samples per pixel. Glass is the slow case: light refracts and reflects at each surface, so every pixel follows a path, capped at 16 bounces here, and the area light makes the shadow soft. Even 64 samples leave some noise around the glass and the shadow; images like this take hours on the CPU, which is why they are rendered offline.

## The logo, on CPU and on GPU

<figure class="zoomable">
<img src="{{ '/assets/images/posts/ray-logo-gpu.webp' | relative_url }}" class="no-invert" alt="The X_eTaL logo as a weather vane: a white X on a post, with an arrow and the letters eTaL along its shaft, over a long gray floor">
<figcaption style="font-size: 0.85em;">The logo at 1280 by 512, rendered on the RTX 5060 Ti. Click to enlarge.</figcaption>
</figure>

The scene became a weather vane: the X fixed on its post, and the letters `_eTaL` along a shaft and arrow. The same 1280 by 512 frame, one sample per pixel:

| | Where | Time |
|---|---|---|
| CPU | X_eTaL's evaluator, 32 strips on four workers | about 10 minutes (607 s wall) |
| GPU | RTX 5060 Ti through OpenCL, second run with the scene already on the card | about 1.2 s (0.89 s on the device) |

The GPU's first run spent about five seconds on setup. These are single observations, not a benchmark, and the two renders used different library revisions, so the repository makes no speedup claim from them; a matched comparison is still to come. What has been matched is correctness: the same generated program at 8 by 4 agrees with the evaluator to better than 1.7e-7, and the 4 by 4 diagnostic matches exactly on the CPU and to within 1e-5 on the RTX.

<figure class="zoomable" style="width: 340px;">
<img src="{{ '/assets/images/posts/ray-logo-vane.webp' | relative_url }}" class="no-invert" alt="An animation of the X_eTaL weather vane turning around its post">
<figcaption style="font-size: 0.85em;">24 frames at 160 by 64, rendered on the CPU in about 39 minutes, shown at twice size.</figcaption>
</figure>

## Measuring it honestly

Pictures are compared pixel by pixel, with stated tolerances, never by eye. Timings separate setup, device time and the whole run, and file writing is left out. The outputs are uncompressed TIFF and lossless PNG, with the exact source of every render kept beside it.

Mike: TODO, Apple Silicon results if you get them, and anything that changes before publishing.

## Closing

Mike: TODO, a closing in your words.
