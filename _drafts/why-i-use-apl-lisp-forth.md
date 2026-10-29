---
layout: post
title: "Why I Use #2: APL, Lisp and Forth, to Demo an Idea"
categories: [languages, programming-history]
tags: [why-i-use, apl, lisp, forth, demos, array-languages, self-hosting, macros, interpreters, x-etal, cor24, reva, cosy]
keywords: "why I use APL, why I use Lisp, why I use Forth, demonstrating concepts, small languages, array notation, self-hosting Forth, code as data, building interpreters, X_eTaL, COR24 Forth, CoSy"
abstract: "Second in the series on the tools I reach for. When I want to build something, I reach for Rust; when I want to demo an idea, I reach for APL, Lisp or Forth, in the order I learned them. What each one lets a demo show, drawn from the posts where they did the showing: APL puts a whole idea on one line, Lisp makes code something a program can take apart, and Forth is small enough to build and to watch build itself. And why building them, in assembler, C, Rust or Forth itself, is part of the fun."
series: "Why I Use"
series_part: 2
date: 2026-10-29 00:15:00 -0700
---

<!-- DRAFT (2026-10-28), Mike: Why I Use #2, planned 10/29, while he reviews #1 (10/28). Mike's own words so far are #1's:
     "From a coding pleasure point of view ... I enjoy building and playing with APL, Forth, and Lisp (which I build in
     assembler, C, or Rust, or in Forth's case, in Forth itself). When I want to demo a concept I reach for APL, Forth, or Lisp."
     The rest is drawn from published posts, written as what each language let those demos show, NOT as Mike's stated
     motivations; Mike to add or correct his reasons (marked "Mike:" below). Links to #1 assume #1 publishes first (10/28).
     Years from TBT #1 (APL, 1972) and TBT #13's timeline (Lisps since 1989). Lead image: Mike's block-apl-lisp-forth.jpg (Dropbox), a color photo-style render (an APL apple, a
     lambda labeled Lisp, the word Forth), no-invert. -->

<img src="{{ '/assets/images/posts/block-apl-lisp-forth.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[The first post in this series](/2026/10/28/why-i-use-rust/) ended on a split: when I want to build an operating system, a programming language or a tool, I reach for Rust; when I want to demo a concept, I reach for APL, Forth, Lisp, or one of my array languages. This one is about the second half, taking the three in the order I learned them: APL, Lisp, then Forth. They are the languages I most enjoy building and playing with, and each lets a demo show something in a way the others cannot.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **APL, the first** | [TBT #1: My First Program Was a Horse Race](/2026/01/29/tbt-apl-horse-race/) |
| **APL, lately** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/), [Voxels](/2026/10/09/voxels-3d-worlds-array-languages/), [Eigencube](/2026/10/08/eigencube-rubiks-cube-linear-algebra/) |
| **Lisp, compared** | [Rabbit-hole #7: the Phoenix combinator](/2026/10/19/rabbit-hole-phoenix-combinator/) |
| **Forth** | [Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/), [Embedded #4](/2026/10/24/embedded-forth-from-forth/), [Saw #16: Reva and CoSy](/2026/10/25/saw-reva-fork-cosy/) |
| **Array Languages** | [sw-mlpl](https://github.com/sw-ml-study/sw-mlpl), [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## APL: the whole idea on one line

APL was my first language: [my first program](/2026/01/29/tbt-apl-horse-race/) was a horse race on an IBM mainframe in 1972. In the demos on this blog it is there when an idea is about a whole collection of things at once: the notation operates on entire arrays, and the result reads close to the mathematics.

The [voxel game post](/2026/10/09/voxels-3d-worlds-array-languages/) shows what that buys a demo. Which faces of a 3D chunk of blocks are exposed to the air is one line: shift the whole chunk one step along each of three axes in each of two directions, and compare. It is the same outer product of rotations as the one-line Game of Life:

```text
life ← {⊃1 ⍵ ∨.∧ 3 4 = +/ +⌿ ¯1 0 1 ∘.⊖ ¯1 0 1 ⌽¨ ⊂⍵}
```

A reader can see the entire algorithm at once, with no loops or index bookkeeping in the way. [Eigencube](/2026/10/08/eigencube-rubiks-cube-linear-algebra/) does the same for a Rubik's cube: the cube as matrices, its moves as linear algebra. And [X_eTaL](/2026/10/07/array-languages-xetal/), the array language I am building in Rust, aims at that density in an array language you can read.

## Lisp: code you can take apart

Lisp's demo is that a program is data. Its code is written as the lists it manipulates, so a program can build, inspect and rewrite code with the same functions it uses for anything else, and macros fall out of that naturally. I have used Lisps since 1989: Scheme, Common Lisp, Racket and Emacs Lisp.

In this blog Lisp has mostly appeared as the point of comparison. In [the Phoenix combinator post](/2026/10/19/rabbit-hole-phoenix-combinator/) the Racket solution names its argument where APL and J compose functions without one, and when X_eTaL's macros were designed, Lisp's reader macros were the thing not to copy: power enough to let a program redefine the language "by accident".

Mike: TODO, a Lisp demo of your own (MacroLisp on COR24, a Lisp in Rust?) and what you reach for Lisp to show.

## Forth: small enough to build, and to watch build itself

Forth is the opposite kind of demo. Where APL hides the machine, Forth puts it on the table: a stack, a dictionary of words, and an interpreter small enough to read in one sitting. That makes it the language for showing how a language works from the inside.

The COR24 Forth posts are built on that. [Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/) moved a kernel from all assembly to mostly Forth, one word at a time; the rabbit-hole posts that followed took apart dictionary lookup, hashing and code generation; and [Embedded #4](/2026/10/24/embedded-forth-from-forth/) ended with a Forth compiler, written in Forth, that rebuilds its own kernel byte for byte.

Forth is also a good host. [CoSy](/2026/10/25/saw-reva-fork-cosy/), Bob Armstrong's APL- and K-like vocabulary, is built on Reva Forth, so a single REPL can show the same fractal drawn the Forth way, recursing, and the array way, as a list.

## Building them is part of the demo

I do not only use these languages; I build them, in assembler, C or Rust, or, in Forth's case, in Forth itself. On this blog that has meant X_eTaL's interpreter in Rust, the COR24 Forth kernel in assembler and then in Forth, and Reva, an x86 Forth, carried to new machines on a virtual machine written in Rust.

Mike: TODO, what building them gives you that using them does not, in your words.
