---
layout: post
title: "Saw #18: Fine-Tuning, Manifolds, Ray Tracing, Animated Terminals, and a Friendlier Reva"
categories: [tools, machine-learning]
tags: [sharpen-the-saw, x-etal, xetal, fine-tuning, lora, manifolds, geometry, machine-learning, ray-tracing, gpu, reva-fork, forth, console-3d, selectric, apl, macros]
keywords: "Sharpen the Saw, X_eTaL fine-tuning, LoRA lessons, rank and scaling, rsLoRA, direct weight editing, X_eTaL manifolds, Poincare ball, geometry of machine learning, ray tracing without Blender, reva-fork ls pp diagnostics"
abstract: "Six saws this week, each to make later work possible. Two new X_eTaL repositories: one teaching fine-tuning, starting from LoRA, on the way to its variations, its alternatives and editing a model's weights directly; and one exploring manifold math and how it relates to machine learning. Ray tracing in X_eTaL itself, without Blender. And reva-fork got easier to use, with ls, pp and better diagnostics, for future work in CoSy. Animated Selectric terminals for the APL demos, and a macro for a shorter way to apply a group."
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
---

<!-- DRAFT (2026-11-08), Mike: Saw for today: X_eTaL-{fine-tuning,gpu,libraries,manifolds} "to enable future work in LoRA
     variations and alternatives, possibly direct editing of weights, ray-tracing without Blender, and exploring manifold math and
     how it relates to ML", and reva-fork "adding more usability like ls and pp, better error handling and diagnostics, to support
     future work in CoSy". Sources (2026-11-08 morning, fetched): X_eTaL-fine-tuning main 46f90a5 (public, first commit 11-05;
     README; lessons: LoRA hello, LoRA lab, LoRA training, Rank and scaling; docs/research3-5.txt plans); X_eTaL-manifolds main
     3109288 (public, first commit 11-06; README; sphere-hello, manifold-tour, experiment kit, research foundation); ray tracing
     and reva-fork as published in AL #20 and Dogfooding #3 (+ Ed. 2026/11/07). Both new Pages sites return 200. console-3D 189aff9 (11-06, Selectric mechanisms animated on all three consoles); group application per Mike 2026-11-08: the rendering change is X_eTaL D-11 (353a91a8, 032b5a7d, docs/lang-choices.md); the macro(s) are not pushed yet (X_eTaL and -libraries checked 2026-11-08). Lead image:
     placeholder until Mike supplies one. -->

<img src="{{ '/assets/images/posts/placeholder-saw-fine-tuning-manifolds-ray-reva.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Six saws this week, all of them about later work: two new X_eTaL repositories, one for fine-tuning and one for manifolds; ray tracing in X_eTaL itself; animated terminals for my APL demos; a macro for applying a group; and a friendlier reva-fork.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Fine-tuning** | [X_eTaL-fine-tuning](https://github.com/softwarewrighter/X_eTaL-fine-tuning), [the lessons](https://softwarewrighter.github.io/X_eTaL-fine-tuning/) |
| **Manifolds** | [X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds), [the pages](https://softwarewrighter.github.io/X_eTaL-manifolds/) |
| **Ray tracing** | [Array Languages #20](/2026/11/07/array-languages-xetal-ray-tracer/); [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu), [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) |
| **Terminals** | [console-3D](https://github.com/softwarewrighter/console-3D) |
| **reva-fork** | [Dogfooding #3](/2026/11/06/dogfooding-cosy-tests-reva-fork/); [the repository](https://github.com/softwarewrighter/reva-fork), [Reva in the browser](https://softwarewrighter.github.io/reva-fork/) |
| **The series** | [Sharpen the Saw: every post](/series/#sharpen-the-saw-sundays) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Fine-tuning, a lesson at a time

[X_eTaL-fine-tuning](https://github.com/softwarewrighter/X_eTaL-fine-tuning) teaches how fine-tuning changes what a trained model does by changing some of its numbers, from a single weight and its error up to low-rank adapters. It grows out of the LoRA explorer in X_eTaL-ML, which shows the math of one adapted layer; here the same libraries sit behind lessons for someone who knows arithmetic and has never trained a network.

Every lesson runs the same way: a question and your prediction, one small experiment, what changed in plain words and measured numbers, then the math and the X_eTaL code, as deep as you want to go. Each has three depths, beginner, explorer and advanced, over the same computation, and the forward pass and a training step can be stepped through, forward and back.

Four lessons so far: LoRA's first example, a LoRA layer's forward pass a stage at a time, one training step in six stages, and a lesson on rank and scaling that sweeps the rank under the two common scalings, alpha / r and alpha / sqrt r.

The plan goes from there to LoRA's variations, then alternatives to it, among them learning without back-propagation, and then direct edits to a model's weights, including an AI doing the editing.

Mike: TODO, why fine-tuning now, if you want to say.

## Manifolds and machine learning

[X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds) asks one question: how does the geometry of a representation, a parameter space or a transformation affect how a model learns and infers? Vectors live in a space with a shape, a gradient points downhill only once you have said how distance is measured, and a learned matrix may be held to a set of permitted ones. Those are choices, and they can be changed one at a time.

It keeps five ideas apart, because each can change without the others: the manifold (what space the data occupy), vector fields (which way a point moves), the metric (how distance and steepness are measured), topology (how the space is connected), and dynamics (how a representation moves during training). Every demo compares at least two geometric choices on the same small problem, and a result that says a geometry cost more and helped nothing is kept and shown.

So far: the first live page, a tour of drawn spaces and the Poincaré ball; an experiment kit with three seeded data sets, a measure of distortion and a nearest-neighbor baseline; and a research foundation of a glossary, a paper catalog and the open questions.

Mike: TODO, what drew you to manifolds.

## Ray tracing, without Blender

The [last Saw](/2026/11/01/saw-sed-rs-xtl-blender/) used Blender to render 3D models made with X_eTaL. This week X_eTaL renders by itself: a ray tracer written as ordinary array code in X_eTaL-libraries, run on the CPU and, through X_eTaL-gpu, on an RTX 5060 Ti and an M1 Max. Glass, reflections, soft shadows and an animated logo, all in [Array Languages #20](/2026/11/07/array-languages-xetal-ray-tracer/).

## A friendlier reva-fork

reva-fork, my port of Reva Forth to Rust and WebAssembly, got easier to use, to support future work in CoSy. Release 2026.1107.0 adds an `ls` word and makes `pp` work without remembering which `needs` line loads it, and earlier releases this week added errors that name the file, line and calling words, and opt-in checks for underflow, bad `execute` and compiling. The details are in [Dogfooding #3](/2026/11/06/dogfooding-cosy-tests-reva-fork/).

## Animated terminals for the APL demos

[console-3D](https://github.com/softwarewrighter/console-3D), the models of IBM consoles from the [last Saw](/2026/11/01/saw-sed-rs-xtl-blender/), now moves: the Selectric mechanisms animate on all three consoles, in the browser with three.js. The aim is to give my APL live demos animated terminals to type on: the Selectric first, then the IBM 5100's screen, and later a TRS-80 screen for APL-80.

## A shorter way to apply a group

In X_eTaL, a parenthesized expression can be applied as a function: typed `(u:p_ow 3)_ 2`. Until now it was drawn as typed, trailing `_` and all. Now it is drawn with both parentheses underlined and no `_`, the same mark an underlined function name gets, so an underline means "function" for a name and for a group alike. Typing it, and the plain-text round trip, do not change.

I'm also working on a macro, or macros, for a more concise idiom for applying a group. Mike: TODO, what the idiom looks like, once it lands.

## Closing

Mike: TODO, a closing in your words.
