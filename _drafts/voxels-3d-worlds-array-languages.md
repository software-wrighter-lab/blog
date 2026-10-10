---
layout: post
title: "Voxels in an Array Language: A 3D World in Dyalog APL and X_eTaL"
categories: [languages, graphics, games, programming]
tags: [voxels, 3d-graphics, game-development, apl, dyalog-apl, xetal, x-etal, array-languages, game-of-life, cellular-automata, rust, sdl3, rubiks-cube, water-simulation]
keywords: "voxel game, Dyalog APL, avoxelgame, Kyle Croarkin, X_eTaL, X_eTaL-extensions, voxels, chunks, exposed faces, six rotations, Game of Life, Iverson suggestivity, CPU rasterizer, Rust, SDL3 GPU, frustum culling, ray march, endless world, flowing water, lighting, cellular automaton, voxel Rubik's cube"
abstract: "Kyle Croarkin wrote a voxel game in Dyalog APL on a bet with himself that APL's notation would make it easier. The heart of it is one line: a chunk of blocks is an array, and the faces worth drawing come from rotating that array six ways and comparing, the same move as the one-line Game of Life. This post follows the idea into X_eTaL, where a ladder of demos builds a world from one chunk to an endless landscape you can fly over, dig into and flood, drawn by a CPU rasterizer in Rust. By the way, the same voxels also draw a Rubik's cube."
series: "General Technology"
series_part: 6
date: 2026-10-09 12:00:00 -0700
repo_urls:
  - url: "https://github.com/namgyaaal/avoxelgame"
    title: "avoxelgame (original, Dyalog APL)"
  - url: "https://github.com/softwarewrighter/avoxelgame-fork"
    title: "avoxelgame-fork"
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<!-- DRAFT (2026-10-09). To do before publishing:
     - Captures, marked [CAPTURE] below (the user may provide): the original game in Dyalog; an X_eTaL demo or two
       (voxels-world, voxels-dig); the recordings exist on the extensions site.
     - Re-check the demo ladder against X_eTaL-extensions docs/plan.md (Saga 14) and the fork's derived-work.md:
       on 2026-10-09 water, rubik-buttons and rubik-solve were done; light and the game were to do. -->

<img src="{{ '/assets/images/posts/voxels-fly-xetal.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Kyle Croarkin's [avoxelgame](https://github.com/namgyaaal/avoxelgame) is a voxel game, a world of blocks you walk, fly, dig and build in, written in Dyalog APL. His README says it "started off as a bet with myself that APL notation would provide an easier way to make a voxel game." His [write-up](https://homewithinnowhere.com/posts/2026-03-06-voxel-game.html) is a good account of where the bet paid off and where it didn't. This post follows the idea into X_eTaL, the typed array language I have been building, where it became a ladder of demos that draw a 3D world on the desktop.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The original** | [namgyaaal/avoxelgame](https://github.com/namgyaaal/avoxelgame) --- the game, in Dyalog APL over SDL3; and the author's [Notes on writing a voxel game in Dyalog APL](https://homewithinnowhere.com/posts/2026-03-06-voxel-game.html) |
| **The fork** | [softwarewrighter/avoxelgame-fork](https://github.com/softwarewrighter/avoxelgame-fork) --- the code unchanged, plus a literate walkthrough of the engine and notes |
| **X_eTaL** | [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions) --- the `voxels-*` demos, with [recordings of each](https://softwarewrighter.github.io/X_eTaL-extensions/) |
| **Earlier** | [Eigencube: a Rubik's cube with linear algebra](/2026/10/08/eigencube-rubiks-cube-linear-algebra/) · [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The idea: a world is an array

A voxel world is a grid of blocks, each one a small number: air, stone, grass, sand, water. The world is cut into chunks, and each chunk is a 3D array of those numbers. That is already an array language's home ground, and most of the game's work becomes whole-array expressions instead of loops over blocks.

The first problem is which faces to draw. Every block has six faces, and almost all of them are hidden, pressed against another solid block. A face is worth drawing only when its block is solid and its neighbor in that direction is not. In a loop that is a neighbor lookup per face per block. In an array language it is a shift: move the whole chunk one step along an axis, and compare it with itself.

</div>

<div class="clearfix" markdown="1">

## Dyalog APL: the original

The original keeps its chunks 16 by 128 by 16, "Minecraft-scale" in the author's words, and draws through SDL3's GPU API with a small C library of its own for the plumbing. The exposed faces of a chunk are one line:

```text
exposed←↑[0]{solid>⍵}¨0 1 2∘.{⍵↓[⍺](0<⍵)⌽[⍺]0,[⍺]solid}¯1 1
```

Read from the right. The outer product pairs each of the three axes with each of the two directions, so the inner function runs six times. Each time it adds a plane of air along one axis, rotates by one step or none, and drops the extra plane: the chunk shifted one step, with air coming in from outside. Then `solid>⍵` compares the chunk with each shifted copy. Greater-than on Booleans means "solid here, empty there", which is exactly an exposed face.

The author points out where this came from. It is the same outer product of rotations as the one-line Game of Life that APL programmers may have seen:

```text
life ← {⊃1 ⍵ ∨.∧ 3 4 = +/ +⌿ ¯1 0 1 ∘.⊖ ¯1 0 1 ⌽¨ ⊂⍵}
```

He connects it to what Iverson called *suggestivity*: a good notation makes the expressions from one problem suggest the expressions for another. In his notes, selecting the visible faces is a handful of expressions where other languages take "dozens to a hundred lines", and frustum culling, ray casting, terrain and collision fit the style as well. The exposed-face selection takes about half a millisecond a chunk.

<!-- [CAPTURE] the original game running in Dyalog: the cover image or a frame of play -->

He is just as clear about what didn't fit. Light and water both need "functions over the entire 3d array", which he finds feel off, or go where "the APL paradigm falls apart". His notes end with an open invitation: anyone with an efficient array-style way to spread light or water through a 16 by 128 by 16 chunk should write to him.

The [fork](https://github.com/softwarewrighter/avoxelgame-fork) changes no code. It adds a reading of it: a literate walkthrough of the engine that quotes every block of source with notes, a summary of what works and what is open, and a note on how the code labels its arrays for readers and what that costs.

</div>

<div class="clearfix" markdown="1">

## X_eTaL: the same ideas, different plumbing

[X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions) has a scene extension: a native desktop window, drawn by a CPU rasterizer written in Rust, which an X_eTaL program fills with shaded quads. The voxel demos rebuild the original's ideas on top of it. The ideas carry over, and most of the plumbing doesn't.

Here is the exposed-face test in X_eTaL, as it renders. `o̲-₁` is rotation along the first axis, the counterpart of APL's `⌽[⍺]`, and multiplying by a comparison with the coordinate turns the plane that wrapped around into air:

```text
ˡs̲olid ← { b → (b > 0) × b ≠ 5 }
ˡe̲xposed ← { b →
  s ← ˡs̲olid b
  w ← s > (-1 o̲-₁ s) × X > 0
  e ← s > (1 o̲-₁ s) × X < 15
  d ← s > (-1 o̲-₂ s) × Y > 0
  u ← s > (1 o̲-₂ s) × Y < 15
  n ← s > (-1 o̲-₃ s) × Z > 0
  so ← s > (1 o̲-₃ s) × Z < 15
  6 4096 r̲eshape (r̲avel w) c̲at (r̲avel e) c̲at (r̲avel d) c̲at (r̲avel u) c̲at (r̲avel n) c̲at r̲avel so
}
```

It is the same idea, written longer. X_eTaL has an outer product too, `t̲able`, the counterpart of APL's `∘.`, but this demo spells the six rotations out one per line, and it marks the wrapped plane as air with a comparison where the APL line pads and drops a plane. Water, block 5, doesn't count as solid, so the ground under a lake still shows.

Three things changed, each for a measured reason:

- **Chunks are cubes.** They are 16 by 16 by 16, not 16 by 128 by 16. The face mask costs about the same per cell at either size, so a smaller chunk means an edit remeshes a small cube rather than a tall column.
- **Faces cross into Rust once per change, never per frame.** The bridge between X_eTaL and Rust carries arrays as text, which rules out sending a frame of pixels. A face crosses as five numbers: where its block is, which way it faces, and what the block is. Rust builds the quad, and each frame only the camera crosses.
- **An edit is a row in a list.** X_eTaL values are immutable, with no indexed assignment, so the world can't be written into the way the original sets a block to air in place, with `(blk⌷chunks)←0`. In the endless world a dig is recorded as a row of position and block, and every column is generated with its edits replayed over it. The edit list doubles as the save file.

The benchmark behind the first change, the face mask in X_eTaL at both sizes:

| Chunk | Cells | Face mask |
|---|---|---|
| 16 × 16 × 16 | 4,096 | 1.75 ms |
| 16 × 128 × 16 | 32,768 | 13.25 ms |

### The ladder

The demos build on each other, each one adding a single capability, and each has a recording on the [extensions site](https://softwarewrighter.github.io/X_eTaL-extensions/):

| Demo | What it adds |
|---|---|
| `voxels-chunk` | one 16-cube from a height field, seen from above by a max-reduction down each column |
| `voxels-faces` | the six-rotation mask, drawn as outlines |
| `voxels-solid` | the same faces as shaded quads with a depth buffer |
| `voxels-world` | an island of 32 chunks from value noise: 18,568 faces drawn out of 403,092 possible |
| `voxels-walk` | first person: gravity, jumping, collision, and culling all 32 chunks against the view |
| `voxels-endless` | no edges: terrain computed from coordinates, columns built ahead and dropped behind, fog and a curved horizon |
| `voxels-fly` | flying over the endless world, still colliding with it (the image at the top) |
| `voxels-dig` | picking a block by marching a ray, digging and building, a hotbar and a crosshair |
| `voxels-water` | water that flows and is conserved: a lake drains a layer at a time when its rim is dug |

<!-- [CAPTURE] X_eTaL: voxels-world (the island) or voxels-dig (a hole dug, blocks placed) -->

Running it turned up things the plan didn't predict. The renderer stayed on the CPU: about 13 ms to draw the island's quads was fast enough, so the GPU fallback was never needed. Building a column of the endless world took 40 to 68 ms, which showed as a pause at the world's edge, so the work was split across three frames. And one measurement is a warning about X_eTaL itself: a lambda applied across 400,000 cells took 36 seconds, where plain reshapes of the same data took milliseconds.

### The two walls

<figure style="float: right; clear: none; margin: 0.2em 0 0.6em 1.5em; max-width: 42%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" aria-label="The voxels-water demo: a lake on top of a terraced hill, its rim dug, draining down one face of the hill as a thin stream toward the sea">
<source src="{{ '/assets/videos/voxels-water.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/voxels-water.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;"><code>voxels-water</code>: dig a lake's rim and it drains a layer at a time, down one face of the hill.</figcaption>
</figure>

Light and water are the interesting part, because they are the two problems the original's author says didn't fit. The plan in the extensions repo argues that both walls come mostly from the chunk's height, not from the array style.

Water is now built, and the amount of it is conserved. Each cell of moving water holds an amount, 64 units to a full block, and the direction it is moving. A tick never makes or loses water. It falls first, as much as fits below, then spreads toward cells with less, by at most half the difference, with a larger share the way it was already moving and toward an edge with a drop. The sea is the one source that never empties, and the one sink. When a tick moves nothing, the water rests until something changes. So a lake behaves like a lake: dig its rim and the top layer drains to a thin film and stops at the bottom of the breach, and digging the trench one deeper lets the next layer go. The run-off goes down one face of the hill as a thin stream into the sea. Water is drawn translucent, so what's under it shows through.

Light is still a design with a time budget, not a result:

- **Sky light** stops being a fixpoint. A running or-scan down each column marks every cell under a solid block as shaded, in one pass.
- **Block light**, a torch's glow, becomes bounded: rounds of "the brightest neighbor, minus one", at most 15 rounds over a 16-cube, run only after a change.

A planned post, or an update to this one, will say how light holds up. After it comes the game itself, Gem Hunt: a seeded island, ten gems buried in stone, three minutes to dig them out, and water filling any hole it touches.

</div>

<div class="clearfix" markdown="1">

<img src="{{ '/assets/images/posts/voxels-rubik-solved.webp' | relative_url }}" class="no-invert" alt="A solved Rubik's cube drawn in voxels by the X_eTaL scene extension: white on top, blue in front, red on the left" title="The voxel cube in the scene window, solved" style="float: right; height: 14.5em; width: auto; margin: 0 0 0.5em 1.5em;">

## By the way: a Rubik's cube of voxels

The voxel drawing turned out general enough to point at something that isn't a world. Four of the demos draw a Rubik's cube, its 26 cubelets as voxels. The interesting array there isn't a grid of blocks but a permutation: the cube is 54 stickers, each with a position and the direction it faces, and each quarter turn is a permutation of the 54 computed from the geometry. The demos animate the turns, rotating a layer's nine cubelets a little each frame with one inner product, and add on-screen buttons for them.

The last of the four connects the solver from the [Eigencube post](/2026/10/08/eigencube-rubiks-cube-linear-algebra/), first written for a 2D web page and now a library in X_eTaL-libraries. Scramble makes 20 random turns, Solve finds a solution in two to three seconds, about 150 turns long, and Step and Play animate it on the voxel cube until it is solved. A test checks that the two models, stickers and rotation matrices, agree on 40 random move lists.

</div>
