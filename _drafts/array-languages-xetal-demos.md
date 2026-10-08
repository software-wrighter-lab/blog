---
layout: post
title: "Array Languages #2: X_eTaL-demos, Programs Worth Watching"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, demos, visualization, wasm, mandelbrot, conway-life, reaction-diffusion, cellular-automata, n-body, image-processing, sandpile, fourier, macros, unix-pipes, tower-of-hanoi]
keywords: "X_eTaL demos, array programming demos, Life microscope, Mandelbrot, Julia sets, reaction-diffusion, wave tank, cellular automata, Langton's ant, abelian sandpile, N-body, Fourier epicycles, image pipeline, stencil macros, Unix pipes in an array language, Tower of Hanoi without recursion, WASM"
abstract: "Second in the Array Languages series: X_eTaL-demos, small programs that produce something worth watching, each shown beside the array transformations that make it. Twelve are live in the browser, from the Life microscope to Fourier epicycles, and they tell one story: whole-array operations express spatial computation. One is built on a macro library of its own, one runs only at the command line as Unix pipe stages, and the Tower of Hanoi, from the language's classics, shows the same moves three ways."
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

[The language](/2026/10/07/array-languages-xetal/) came first; this is the shelf of programs that show what it is for. Every demo follows one arc: a small X_eTaL program, a striking result, the array transformations stepped through, and something technically interesting revealed. Twelve run live in the browser, and a thirteenth at the command line.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-demos](https://github.com/softwarewrighter/X_eTaL-demos) --- one sub-project per demo, pinned to one X_eTaL commit |
| **Live catalog** | [softwarewrighter.github.io/X_eTaL-demos](https://softwarewrighter.github.io/X_eTaL-demos/) --- every demo in the browser |
| **Prior post** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The arc

The [catalog](https://softwarewrighter.github.io/X_eTaL-demos/) opens on a card per demo that answers three questions in a few seconds: what am I looking at, why is it an array expression, and which line of X_eTaL did it. Open one and the program sits beside its result, with the shape of every intermediate array, and the listing on the page is exactly the program X_eTaL ran. Each title links to the idea's history, on Wikipedia or in a short story dialog.

<figure>
<img src="{{ '/assets/images/posts/xetal-demos-montage.webp' | relative_url }}" class="no-invert" alt="Twelve screenshots from the X_eTaL demo catalog: the Life microscope, Mandelbrot, Julia sets, reaction-diffusion, the wave tank, the cellular automata lab, Langton's ant, the abelian sandpile, N-body gravity, Fourier epicycles, the image pipeline, and stencils by macro">
<figcaption style="font-size: 0.85em;">The twelve live demos, in the catalog's order.</figcaption>
</figure>

</div>

<div class="clearfix" markdown="1">

## One story in twelve demos

Read in order, the demos make one argument: whole-array transformations express spatial computation. A grid is an array, a neighborhood is a rotation of it, and a step of a simulation is a few operations applied to every cell at once.

- **[Life microscope](https://softwarewrighter.github.io/X_eTaL-demos/life-microscope/):** Conway's Life with the nine shifted boards and their sum on screen. Rotate, reduce, mask.
- **[Mandelbrot](https://softwarewrighter.github.io/X_eTaL-demos/mandelbrot/)** and **[Julia sets](https://softwarewrighter.github.io/X_eTaL-demos/julia/):** the set appearing step by step, a point's orbit, a zoom; then one function, two sets, with c picked on the Mandelbrot map. Broadcasting and scalar extension.
- **[Reaction-diffusion](https://softwarewrighter.github.io/X_eTaL-demos/reaction-diffusion/)** and the **[wave tank](https://softwarewrighter.github.io/X_eTaL-demos/wave-tank/):** Gray-Scott mazes, coral and spots, with one cell's stencil arithmetic shown; a double slit, a lens and ripples where you click.
- **[Cellular automata lab](https://softwarewrighter.github.io/X_eTaL-demos/ca-lab/)** and **[Langton's ant](https://softwarewrighter.github.io/X_eTaL-demos/langtons-ant/):** Rules 30, 90 and 110 with an editable lookup table, and Life, Brian's Brain and Wireworld as tables; an ant as a one-hot mask, building its highway out of chaos.
- **[Abelian sandpile](https://softwarewrighter.github.io/X_eTaL-demos/sandpile/):** avalanches settling into a fractal. Every cell topples at once: integer division by four, four rotations and an edge mask, with a second plane counting topples. Drop grains anywhere.
- **[N-body gravity](https://softwarewrighter.github.io/X_eTaL-demos/nbody/):** a figure-eight three-body orbit, a binary with planets, a collapsing cluster. Every pair at once, as a displacement cube reduced to forces.
- **[Fourier epicycles](https://softwarewrighter.github.io/X_eTaL-demos/fourier-epicycles/):** circles on circles tracing a star, a heart or your own drawing, with a slider for how many. The transform is an outer product of angles and two matrix products, and one scan gives every circle's center.
- **[Image pipeline](https://softwarewrighter.github.io/X_eTaL-demos/image-pipeline/):** blur, Sobel edges, threshold and pooling, with editable kernels; the windows are made by rotation.
- **[Stencils by macro](https://softwarewrighter.github.io/X_eTaL-demos/stencil-macros/):** the image pipeline's idea, written a new way. The next section is about it.

The sandpile and the epicycles arrived while this series was being written. The machine-learning demos that started here --- a ternary network, a mixture-of-experts router, a tiny CNN --- moved to a repository of their own, which a planned post in this series covers, so that this one means visual and scientific array programming and nothing else.

</div>

<div class="clearfix" markdown="1">

## A demo built on its own macros

An image kernel is a small picture of numbers: a sharpen is `0 -1 0 / -1 5 -1 / 0 -1 0`. The stencils demo writes kernels exactly like that, as text, and a macro library of its own, `Stencil.xtlm`, turns each into code before the program is type-checked:

```text
ᵘs̲harpen ← { p → "0 -1 0  -1 5 -1  0 -1 0" ˢt̲encil< "p" }
ᵘh̲eat ← { p → p + 0.2 × "0 1 0  1 -4 1  0 1 0" ˢt̲encil< "p" }
```

`xetal expand` shows what the compiler sees for the sharpen: one rotation of the picture per nonzero number, times that number, summed.

```text
ᵘs̲harpen ← { p → ((n̲eg (-1 o̲-₁ p)) + (n̲eg (-1 o̲-₂ p)) + (5 × p) + (n̲eg (1 o̲-₂ p)) + (n̲eg (1 o̲-₁ p))) }
```

A 0 writes nothing and a 1 writes no multiply, so each stencil costs exactly the work its kernel asks for, and a kernel that isn't square is rejected when the program is compiled. On the live page you edit a kernel and watch its macro call expand and run in the browser. It is the first demo that proves the *Extensible* in the name with a macro library nobody shipped with the language.

<figure>
<img src="{{ '/assets/images/posts/xetal-stencil-macros.webp' | relative_url }}" class="no-invert" alt="The stencils-by-macro page: a kernel written as a grid of numbers, its expanded code, and the filtered image">
<figcaption style="font-size: 0.85em;"><a href="https://softwarewrighter.github.io/X_eTaL-demos/stencil-macros/">Stencils by macro</a>: edit the kernel, see the expansion, see the result.</figcaption>
</figure>

</div>

<div class="clearfix" markdown="1">

## Unix pipes, in an array language

The thirteenth demo has no page. `cat`, `wc`, `grep`, `uniq`, `sort`, `head` and `tail` are each a small X_eTaL program run as a Unix filter, chained with ordinary pipes:

```bash
xetalcat sample.txt | xetalgrep the | xetalsort | xetalhead -n 3
```

Each stage gives the same bytes as the tool it imitates; the tests compare them on six inputs. It is an odd thing to do with an array language, which is the point: X_eTaL reads standard input, writes standard output, and keeps up --- a shared reader takes 20,000 lines in 0.3 seconds --- so it can sit in a shell pipeline like anything else.

<figure>
<img src="{{ '/assets/images/posts/xetal-pipes.gif' | relative_url }}" class="no-invert" alt="A terminal recording of X_eTaL programs running as Unix pipe stages">
<figcaption style="font-size: 0.85em;">The pipe stages at work, recorded at the command line.</figcaption>
</figure>

</div>

<div class="clearfix" markdown="1">

## The Tower of Hanoi, three ways

One more, from the language's own classics rather than this repository, because it shows the demos' arc in miniature. Move n disks from one peg to another, never a larger on a smaller. All three versions produce the same moves, and the program checks that for every n from 1 to 10.

**1. Recursion, with the pegs as one vector.** Move n − 1 disks aside, move the largest, move the n − 1 back. The two halves reorder the pegs with `s̲elect`, so the reorderings are data rather than extra arguments.

```text
ᵘh̲anoi ← { n pegs →
  n = 0 ? 0 2 r̲eshape 0
  first ← (n − 1) ᵘh̲anoi 1 3 2 s̲elect pegs
  last ← (n − 1) ᵘh̲anoi 3 2 1 s̲elect pegs
  first c̲at (1 2 r̲eshape 2 t̲ake pegs) c̲at last
}
```

**2. Curried, with the combinators.** The textbook's four-argument h(n, from, to, via). Every X_eTaL function is curried, and Smullyan's Cardinal, `ᶜC̲`, swaps two arguments. It reads like the mathematics, but it is the same recursion, and calls with one value on each side make a four-argument call clumsy: `((3 ᵘh̲ 1)_ 3)_ 2`.

**3. Every move at once, with no recursion.** Move k moves disk 1 plus the number of trailing zero bits of k, worked out as a table of remainders. Each disk cycles round the pegs in a direction set by whether n − d is even, so the from and to pegs come out of arithmetic on whole vectors:

```text
ᵘm̲oves ← { n →
  k ← r̲ange (2 ^ n) − 1
  d ← 1 + '+ r̲/₂ 0 = k 'm̲od t̲able 2 ^ r̲ange n
  m ← k d̲iv 2 ^ d
  s ← 1 + 0 = (n − d) m̲od 2
  from ← 1 + (s × m) m̲od 3
  to ← 1 + (s × m + 1) m̲od 3
  o̲\ (2 c̲at t̲ally from) r̲eshape from c̲at to
}
```

The literate document that walks through them puts the trade-off in one line: "The first explains the puzzle; the third is the array program. Seeing them agree is the point." The same file then draws the moves, each frame a table of disk widths, as an animated SVG:

<figure>
<img src="{{ '/assets/images/posts/xetal-hanoi.svg' | relative_url }}" class="no-invert" alt="Four disks moving between three pegs, drawn by the X_eTaL Hanoi program as an animated SVG" style="width: 100%; max-width: 648px;">
<figcaption style="font-size: 0.85em;">Four disks, fifteen moves, drawn by the X_eTaL program itself.</figcaption>
</figure>

</div>

<div class="clearfix" markdown="1">

## How the repo keeps itself honest

Every demo's programs are tested at the command line and its page in headless Chrome, both as regression baselines. The timings of every page's program are kept and checked whenever the repo moves to a new X_eTaL commit, which it now pins by commit rather than copying. Anything the language lacks is filed as an ask, not worked around: the three asks that made Unix pipe stages possible are an example. And when the language changed how libraries name their private helpers, a `h:` namespace that arrived this week, the repo moved to it the same day, using the language's own `xetal migrate`.

</div>

## Next in the series

The libraries: nineteen of them, and six that carry macros of their own.
