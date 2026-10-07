---
layout: post
title: "Array Languages #2: X_eTaL-demos, Programs Worth Watching"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, demos, visualization, wasm, mandelbrot, conway-life, reaction-diffusion, cellular-automata, n-body, image-processing]
keywords: "X_eTaL demos, array programming demos, Life microscope, Mandelbrot, Julia sets, reaction-diffusion, wave tank, cellular automata, Langton's ant, N-body, image pipeline, ternary network, MoE routing, WASM"
abstract: "Second in the Array Languages series: X_eTaL-demos, small programs that produce something worth watching, each shown beside the array transformations that make it. Nine are live in the browser, from the Life microscope to an N-body cluster. What the demos ask of the language, and why the machine-learning ones are moving to a repo of their own."
series: "Array Languages"
series_part: 2
date: 2026-10-08 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-demos/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-demos"
    title: "X_eTaL-demos"
---

<img src="{{ '/assets/images/posts/block-wave-demo.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[The language](/2026/10/07/array-languages-xetal/) came first; this is the shelf of programs that show what it is for. Every demo follows one arc: a small X_eTaL program, a striking result, the array transformations stepped through, and something technically interesting revealed. Nine are live in the browser.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-demos](https://github.com/softwarewrighter/X_eTaL-demos) --- one sub-project per demo, a vendored X_eTaL |
| **Live catalog** | [softwarewrighter.github.io/X_eTaL-demos](https://softwarewrighter.github.io/X_eTaL-demos/) --- every demo in the browser |
| **Prior post** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The arc

The repo holds small programs that produce something worth watching, published as a [live catalog](https://softwarewrighter.github.io/X_eTaL-demos/) in the browser. Every demo follows one arc --- a small program, a striking result, the array transformations stepped through, something technically interesting revealed --- and shows its program beside the result with the shape of every intermediate array.

<figure>
<img src="{{ '/assets/images/posts/xetal-demos-montage.webp' | relative_url }}" class="no-invert" alt="Nine screenshots from the X_eTaL demo catalog: the Life microscope, Mandelbrot, Julia sets, reaction-diffusion, the wave tank, the cellular automata lab, Langton's ant, N-body gravity, and the image pipeline">
<figcaption style="font-size: 0.85em;">The nine demos live in the catalog: Life microscope, Mandelbrot, Julia, reaction-diffusion, wave tank, cellular automata lab, Langton's ant, N-body gravity, image pipeline.</figcaption>
</figure>

Nine are live: the [Life microscope](https://softwarewrighter.github.io/X_eTaL-demos/life-microscope/), Conway's Life with the nine shifted boards and their sum on screen; [Mandelbrot](https://softwarewrighter.github.io/X_eTaL-demos/mandelbrot/), the set appearing step by step, with a point's orbit and a zoom; [Julia sets](https://softwarewrighter.github.io/X_eTaL-demos/julia/), one function, two sets, with c picked on the Mandelbrot map; [reaction-diffusion](https://softwarewrighter.github.io/X_eTaL-demos/reaction-diffusion/), Gray-Scott mazes, coral and spots growing, with one cell's stencil arithmetic shown; the [wave tank](https://softwarewrighter.github.io/X_eTaL-demos/wave-tank/), a double slit, a lens, and ripples where you click; the [cellular automata lab](https://softwarewrighter.github.io/X_eTaL-demos/ca-lab/), Rules 30, 90 and 110 with an editable table, and Life, Brian's Brain and Wireworld as tables; [Langton's ant](https://softwarewrighter.github.io/X_eTaL-demos/langtons-ant/), a highway emerging from chaos, the ant a one-hot mask; [N-body gravity](https://softwarewrighter.github.io/X_eTaL-demos/nbody/), a figure-eight three-body orbit, a binary with planets and a collapsing cluster, every pair at once as a displacement cube; and the [image pipeline](https://softwarewrighter.github.io/X_eTaL-demos/image-pipeline/), blur, Sobel edges, threshold and pooling with editable kernels, the windows made by rotation. The machine-learning demos that started here --- the ternary network, the MoE router, the tiny CNN --- have moved out to [X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML), the subject of a planned post in this series, so that this repo means visual and scientific array programming and nothing else. The image pipeline stays, as the bridge between the two. The repo vendors a pinned snapshot of X_eTaL so nothing moves under a demo, and anything the language lacks is filed as an ask rather than worked around: complex numbers for Mandelbrot, transpose for attention and PCA, a per-operation trace for the microscope, and a slowdown the automata lab found.

## Next in the series

The libraries: eight of them ready, and the macro design that gives the E in the name its second meaning.
