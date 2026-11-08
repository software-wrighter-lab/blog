---
layout: post
title: "Saw #18: Fine-Tuning, Manifolds, Ray Tracing, a Debugger, and More"
categories: [tools, machine-learning]
tags: [sharpen-the-saw, x-etal, xetal, fine-tuning, lora, manifolds, geometry, machine-learning, ray-tracing, gpu, reva-fork, forth, console-3d, selectric, apl, macros, currying, partial-application, mhc, weight-space-programming, debugger, dap, lsp, emacs, ide]
keywords: "Sharpen the Saw, X_eTaL fine-tuning, LoRA lessons, rank and scaling, rsLoRA, direct weight editing, X_eTaL manifolds, Poincare ball, geometry of machine learning, ray tracing without Blender, reva-fork ls pp diagnostics, weight-space programming, GPT-6 Astra, mHC"
abstract: "Seven saws this week, each to make later work possible. Two new X_eTaL repositories: one teaching fine-tuning, starting from LoRA, on the way to its variations, its alternatives and editing a model's weights directly; and one exploring manifold math and how it relates to machine learning. Ray tracing in X_eTaL itself, without Blender. And reva-fork got easier to use, with ls, pp and better diagnostics, for future work in CoSy. Animated Selectric terminals for the APL demos, and clearer documentation of idioms and best practice for applying a group. And a debugger for X_eTaL, on the way to LSP and DAP servers for Emacs and IDE plug-ins."
series: "Sharpen the Saw Sundays"
series_part: 18
date: 2026-11-08 00:15:00 -0800
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-fine-tuning"
    title: "X_eTaL-fine-tuning"
  - url: "https://github.com/softwarewrighter/X_eTaL-manifolds"
    title: "X_eTaL-manifolds"
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
  - url: "https://github.com/softwarewrighter/console-3D"
    title: "console-3D"
  - url: "https://github.com/softwarewrighter/s5100-3D"
    title: "s5100-3D"
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
papers:
  - title: "Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights"
    url: "https://rikiyat.github.io/blog/weight-space-programming/"
  - title: "mHC: Manifold-Constrained Hyper-Connections"
    url: "https://arxiv.org/abs/2512.24880"
---

<!-- DRAFT (2026-11-08), Mike: Saw for today: X_eTaL-{fine-tuning,gpu,libraries,manifolds} "to enable future work in LoRA
     variations and alternatives, possibly direct editing of weights, ray-tracing without Blender, and exploring manifold math and
     how it relates to ML", and reva-fork "adding more usability like ls and pp, better error handling and diagnostics, to support
     future work in CoSy". Sources (2026-11-08 morning, fetched): X_eTaL-fine-tuning main 46f90a5 (public, first commit 11-05;
     README; lessons: LoRA hello, LoRA lab, LoRA training, Rank and scaling; docs/research3-5.txt plans); X_eTaL-manifolds main
     3109288 (public, first commit 11-06; README; sphere-hello, manifold-tour, experiment kit, research foundation); ray tracing
     and reva-fork as published in AL #20 and Dogfooding #3 (+ Ed. 2026/11/07). Both new Pages sites return 200. console-3D 189aff9 (11-06, Selectric mechanisms animated on all three consoles); group application per Mike 2026-11-08: the rendering change is X_eTaL D-11 (353a91a8, 032b5a7d, docs/lang-choices.md); the macro(s) are not pushed yet (X_eTaL and -libraries checked 2026-11-08). Pushed 10:19: X_eTaL ddffc61a, docs/several-arguments.md, demos/apply.xtl, userlibs/Apply.xtlm (code below copied from the doc). Lead image:
     Mike's block-manifolds.jpg (Dropbox, 2026-11-08), no-invert. -->

<img src="{{ '/assets/images/posts/block-manifolds.webp' | relative_url }}" class="post-marker no-invert" alt="A dark, twisting space of interwoven bands and arches, with staircases running through it, in teal, red and gold" style="width: 205px;">

Seven saws this week, all of them about later work: two new X_eTaL repositories, one for fine-tuning and one for manifolds; ray tracing in X_eTaL itself; animated terminals for my APL demos; clearer advice on applying a group; a debugger for X_eTaL, on the way to editors and IDEs; and a friendlier reva-fork.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Fine-tuning** | [X_eTaL-fine-tuning](https://github.com/softwarewrighter/X_eTaL-fine-tuning), [the lessons](https://softwarewrighter.github.io/X_eTaL-fine-tuning/); [Sparks of Weight-Space Programming](https://rikiyat.github.io/blog/weight-space-programming/) |
| **Manifolds** | [X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds), [the pages](https://softwarewrighter.github.io/X_eTaL-manifolds/) |
| **Ray tracing** | [Array Languages #20](/2026/11/07/array-languages-xetal-ray-tracer/); [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu), [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) |
| **Debugger and editors** | X_eTaL's [debugger plan](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/debugger-plan.md) and [editors plan](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/editors-plan.md) |
| **Terminals** | [console-3D](https://github.com/softwarewrighter/console-3D), [s5100-3D](https://github.com/softwarewrighter/s5100-3D) |
| **reva-fork** | [Dogfooding #3](/2026/11/06/dogfooding-cosy-tests-reva-fork/); [the repository](https://github.com/softwarewrighter/reva-fork), [Reva in the browser](https://softwarewrighter.github.io/reva-fork/) |
| **The series** | [Sharpen the Saw: every post](/series/#sharpen-the-saw-sundays) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Fine-tuning, a lesson at a time

<figure class="zoomable" style="float: left; width: 340px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/saw18-fine-tuning-loss.webp' | relative_url }}" class="no-invert" alt="Two line charts of loss per example by rank, 1 to 8, under the scalings alpha over r and alpha over the square root of r: the training loss falls to zero by rank 3, and the held-out loss falls from about 1.0 and levels off">
<figcaption style="font-size: 0.85em;">Loss by rank under the two scalings, from <a href="https://softwarewrighter.github.io/X_eTaL-fine-tuning/rank-and-scaling/">lesson 4</a>. Click to enlarge.</figcaption>
</figure>

[X_eTaL-fine-tuning](https://github.com/softwarewrighter/X_eTaL-fine-tuning) teaches how fine-tuning changes what a trained model does by changing some of its numbers, from a single weight and its error up to low-rank adapters. It grows out of the LoRA explorer in X_eTaL-ML, which shows the math of one adapted layer; here the same libraries sit behind lessons for someone who knows arithmetic and has never trained a network.

Every lesson runs the same way: a question and your prediction, one small experiment, what changed in plain words and measured numbers, then the math and the X_eTaL code, as deep as you want to go. Each has three depths, beginner, explorer and advanced, over the same computation, and the forward pass and a training step can be stepped through, forward and back.

Four lessons so far: LoRA's first example, a LoRA layer's forward pass a stage at a time, one training step in six stages, and a lesson on rank and scaling that sweeps the rank under the two common scalings, alpha / r and alpha / sqrt r.

The plan goes from there to LoRA's variations, then alternatives to it, among them learning without back-propagation, and then direct edits to a model's weights, including an AI doing the editing.

It comes out of my ML study group's discussions: first about fine-tuning, and lately about training weight-space models without back-propagation, and the recent excitement over an LLM editing another model's weights directly: MIT CSAIL's [Sparks of Weight-Space Programming](https://rikiyat.github.io/blog/weight-space-programming/), in which GPT-6 Astra read Qwen3.5-0.8B's weights and changed about 0.016% of them, no gradients, and raised its MATH-500 score from 7.9% to 48.1%. [VentureBeat](https://venturebeat.com/technology/like-gene-editing-for-neural-networks-mit-researchers-used-gpt-6-astra-to-edit-qwens-open-weights-directly-boosting-math-performance) called it "like gene editing for neural networks". There are skeptical readings too, such as [What Is Measured and What Is Anecdote](https://akmaier.substack.com/p/weight-space-programming-what-is), and [Simon Willison](https://simonwillison.net/2026/Nov/3/qwen-can-interpret-model-weights/) found a model on his laptop could interpret weights too. As I read it so far, weight-space programming fixes what a model already has, removing obstacles and errors such as the reasoning loops that held back Qwen's math, rather than adding a capability the model never had. That makes it different from fine-tuning, at least for now; weight-space reprogramming might be a better name.

## Manifolds and machine learning

<figure class="zoomable" style="float: left; width: 230px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/saw18-manifolds.webp' | relative_url }}" class="no-invert" alt="Four wireframe drawings: a sphere with a path between two points, a torus with two marked loops, a Swiss roll with three points, and the Poincare disk with geodesic arcs">
<figcaption style="font-size: 0.85em;">A sphere, a torus, a Swiss roll and the Poincaré disk, drawn by X_eTaL in the <a href="https://softwarewrighter.github.io/X_eTaL-manifolds/manifold-tour/">manifold tour</a>. Click to enlarge.</figcaption>
</figure>

[X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds) asks one question: how does the geometry of a representation, a parameter space or a transformation affect how a model learns and infers? Vectors live in a space with a shape, a gradient points downhill only once you have said how distance is measured, and a learned matrix may be held to a set of permitted ones. Those are choices, and they can be changed one at a time.

It keeps five ideas apart, because each can change without the others: the manifold (what space the data occupy), vector fields (which way a point moves), the metric (how distance and steepness are measured), topology (how the space is connected), and dynamics (how a representation moves during training). Every demo compares at least two geometric choices on the same small problem, and a result that says a geometry cost more and helped nothing is kept and shown.

So far: the first live page, a tour of drawn spaces and the Poincaré ball; an experiment kit with three seeded data sets, a measure of distortion and a nearest-neighbor baseline; and a research foundation of a glossary, a paper catalog and the open questions.

I watch math videos, and manifolds are something I want to learn more about in general. I also want to see how work like DeepSeek's [mHC](https://arxiv.org/abs/2512.24880), manifold-constrained hyper-connections, which I [implemented in February](/2026/02/01/deepseek-papers-part1-mhc/), which keeps a network's residual mixing on a manifold to steady training, relates to them, and whether manifolds can inspire new ways to encode or manipulate training.

## Ray tracing, without Blender

<figure class="zoomable outdent-right" style="width: 150px; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/saw18-ray-glass-preview.webp' | relative_url }}" class="no-invert" alt="Two glass spheres and two glass crystals on a reflective floor between bright panels, rendered on the RTX 5060 Ti at one sample per pixel, with fine stripes across the glass">
<figcaption style="font-size: 0.85em;">Early RTX glass preview.</figcaption>
</figure>

The [last Saw](/2026/11/01/saw-sed-rs-xtl-blender/) used Blender to render 3D models made with X_eTaL. This week X_eTaL renders by itself: a ray tracer written as ordinary array code in X_eTaL-libraries, run on the CPU and, through X_eTaL-gpu, on an RTX 5060 Ti and an M1 Max. Glass, reflections, soft shadows and an animated logo, all in [Array Languages #20](/2026/11/07/array-languages-xetal-ray-tracer/).

## A friendlier reva-fork

<figure class="zoomable" style="float: left; width: 200px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/saw18-reva-cd-demo.webp' | relative_url }}" class="no-invert" alt="reva-fork's CD demo: an IUP canvas with colored marks bouncing off its walls, and a Quit button">
<figcaption style="font-size: 0.85em;">The canvas demo on the live site. Click to enlarge.</figcaption>
</figure>

reva-fork, my port of Reva Forth to Rust and WebAssembly, got easier to use, to support future work in CoSy. Release 2026.1107.0 adds an `ls` word and makes `pp` work without remembering which `needs` line loads it, and earlier releases this week added errors that name the file, line and calling words, and opt-in checks for underflow, bad `execute` and compiling. The details are in [Dogfooding #3](/2026/11/06/dogfooding-cosy-tests-reva-fork/).

It can draw now, too. [IUP](https://iup.sourceforge.io/) is a portable toolkit for building user interfaces, and [CD](https://canvasdraw.sourceforge.io/), short for Canvas Draw, is its companion library for 2D graphics, both from Tecgraf at PUC-Rio in Brazil. Reva programs written for them on Windows now open their windows and draw on their canvases in the browser and the desktop app.

## Animated terminals for the APL demos

<figure class="zoomable outdent-left" style="width: 400px; margin-top: -2.9em;">
<div style="display: flex; gap: 6px; align-items: flex-end;">
<div style="flex: 1; min-width: 0; text-align: center;">
<img src="{{ '/assets/images/posts/saw18-ibm2741.webp' | relative_url }}" class="no-invert" alt="A render of the IBM 2741 terminal, a white Selectric typewriter" style="width: 100%;">
<div style="font-size: 0.75em; line-height: 1.2;">IBM 2741 terminal</div>
</div>
<div style="flex: 1; min-width: 0; text-align: center;">
<img src="{{ '/assets/images/posts/saw18-ibm5100.webp' | relative_url }}" class="no-invert" alt="A render of the IBM 5100 portable computer from the front: a small screen, switches and a tape slot above its keyboard" style="width: 100%;">
<div style="font-size: 0.75em; line-height: 1.2;">IBM 5100</div>
</div>
<div style="flex: 1; min-width: 0; text-align: center;">
<img src="{{ '/assets/images/posts/saw18-ibm1053.webp' | relative_url }}" class="no-invert" alt="A render of the IBM 1130's console printer, dark gray with a blue panel" style="width: 100%;">
<div style="font-size: 0.75em; line-height: 1.2;">IBM 1130 console</div>
</div>
</div>
</figure>

[console-3D](https://github.com/softwarewrighter/console-3D), the models of IBM consoles from the [last Saw](/2026/11/01/saw-sed-rs-xtl-blender/), now moves: the Selectric mechanisms animate on all three consoles, in the browser with three.js. The IBM 5100 has a model of its own, still rough, in [s5100-3D](https://github.com/softwarewrighter/s5100-3D). The aim is to give my APL live demos animated terminals to type on: the Selectric first, then the IBM 5100's screen, and later a TRS-80 screen for APL-80.

## Applying a group: idioms and advice

<div class="aside-box outdent-right wide" markdown="1">

**What is group application?** In X_eTaL every function takes one argument. A two-argument call like `2 ᵘp̲ow 10` is currying: `ᵘp̲ow 2` is already a function, waiting for its right argument, so `ᵘt̲woTo ← ᵘp̲ow 2` names a partial application. Put a partial application in parentheses and apply it, drawn <code><span style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span>ᵘp̲ow 3<span style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> 2</code> or <code><span style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span>'−<span style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> 10</code> (typed `(u:p_ow 3)_ 2` and `('-)_ 10`), and that is applying a group: the parenthesized expression is the function.

</div>

This saw is documentation. I have been refining X_eTaL's notes on idioms and its best-practice recommendations for this corner of the language: how functions take arguments, currying, partial application, and when to reach for a tuple instead.

Part of it is how it looks. An applied group used to be drawn as typed, trailing `_` and all; now it is drawn with both parentheses underlined and no `_`, the same mark an underlined function name gets, so an underline means "function" for a name and for a group alike. Typing it does not change.

Part of it is the advice itself, now written up as [three ways to call a function of several arguments](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/several-arguments.md). Real code is why I started: the ray tracer's shading function takes eight arguments, and [X_eTaL-gpu's logo example](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/examples/ray/logo.xtl) calls it like this.

Written out, the long-hand way: one group applied at a time, nesting a level for every argument after the second. In the drawn form each applied group's parentheses are underlined:

<div class="language-xetal highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="n">linear</span> <span class="o">←</span> <span class="p">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">(</span><span class="n">clip</span> <span class="nc">ʳᵗs̲hade</span> <span class="n">triangles</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> <span class="n">materials</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> <span class="n">logomaterials</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span>
  <span class="n">logolights</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> <span class="n">environment</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> <span class="n">origins</span><span class="p" style="text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px;">)</span> <span class="n">directions</span><span class="p">)</span>
</code></pre></div></div>

<details markdown="1"><summary>As typed</summary>

```xetal
linear := (((((((clip rt:s_hade triangles)_ materials)_ logomaterials)_
  logolights)_ environment)_ origins)_ directions)

```

</details>

With a macro: a small macro library of my own, Apply, whose `ap:a_pply<` takes the function and its arguments in order and writes that same chain when the program is expanded:

<div class="language-xetal highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="s">"ap:"</span> <span class="nd">u̲se&lt;</span> <span class="s">"Apply"</span>
<span class="n">linear</span> <span class="o">←</span> <span class="s">c"ʳᵗs̲hade"</span> <span class="nd">ᵃᵖa̲pply&lt;</span> <span class="n">c</span>"<span class="n">clip</span><span class="o">◆</span> <span class="n">triangles</span><span class="o">◆</span> <span class="n">materials</span><span class="o">◆</span>
  <span class="n">logomaterials</span><span class="o">◆</span> <span class="n">logolights</span><span class="o">◆</span> <span class="n">environment</span><span class="o">◆</span> <span class="n">origins</span><span class="o">◆</span> <span class="n">directions</span>"
</code></pre></div></div>

<details markdown="1"><summary>As typed</summary>

```xetal
"ap:" u_se< "Apply"
linear := c"rt:s_hade" ap:a_pply< c"clip; triangles; materials;
  logomaterials; logolights; environment; origins; directions"

```

</details>

With a tuple, the recommended idiom for three or more arguments. X_eTaL has no overloading, so one name cannot mean both: `rt:s_hade` takes its first value and returns a function, and a version that takes all eight at once as a tuple is a different function, with a name of its own, here `u:s_hadeTuple`. Called that way it is one call, with no nesting, and a tuple of the wrong size is a type error before the program runs:

<div class="language-xetal highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="n">linear</span> <span class="o">←</span> <span class="nf">ᵘs̲hadeTuple</span> <span class="p">(</span><span class="n">clip</span><span class="o">,</span> <span class="n">triangles</span><span class="o">,</span> <span class="n">materials</span><span class="o">,</span> <span class="n">logomaterials</span><span class="o">,</span>
  <span class="n">logolights</span><span class="o">,</span> <span class="n">environment</span><span class="o">,</span> <span class="n">origins</span><span class="o">,</span> <span class="n">directions</span><span class="p">)</span>
</code></pre></div></div>

<details markdown="1"><summary>As typed</summary>

```xetal
linear := u:s_hadeTuple (clip, triangles, materials, logomaterials,
  logolights, environment, origins, directions)

```

</details>

The macro shows what a macro can do; the convention is to write two arguments as `x f y` and give a function of three or more a tuple.


## A debugger, then editors

X_eTaL is getting a debugger, and with it a path into the editors people already use. The plan is a time-traveling debugger built on X_eTaL's steppable evaluator. Because its values are immutable and shared, a checkpoint is cheap, so stepping backward is a matter of keeping checkpoints and replaying from one. It is also meant to step through macro expansions, so a pipeline of equations can be followed stage by stage, with 2D and 3D views of the arrays along the way.

The core landed this week: stops at statements, breakpoints, stepping over, in and out, continue, and the call stack. Then variables and watches, with breakpoints that take conditions and hit counts.

Next it gets two servers that any editor can talk to: `xetal dap`, the Debug Adapter Protocol over the debugger, and `xetal lsp`, the Language Server Protocol over what X_eTaL already has (diagnostics, quick fixes, types and docs on hover, completion, go to definition, formatting). Emacs gets them through its built-in eglot and the dape package; JetBrains IDEs, IntelliJ IDEA and RustRover, through LSP4IJ; and VS Code through an extension, as editor plug-ins rather than a fork of an IDE.

## Closing

Sunday is when I reflect on the work that enables or improves future work. This week that was two new places to learn, fine-tuning and manifolds; a renderer that no longer needs Blender; terminals for the APL demos to come; clearer advice on applying a group; a debugger, and with it a way into the editors I use; and a Forth that is easier to use.
