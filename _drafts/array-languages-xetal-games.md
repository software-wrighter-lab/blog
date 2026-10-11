---
layout: post
title: "Array Languages #6: X_eTaL-games, Rules That Are Arrays"
categories: [languages, language-design, games, tools]
tags: [array-languages, xetal, x-etal, apl, games, dogfooding, idioms, entity-component-system, cor24, basic, star-trek, horse-race, wasm]
keywords: "X_eTaL games, array language idioms, dogfooding a language, outer product, inner product, reduction, scan, compress, rotate, fixed point, grade, masks, trains, GF(2), entity-component system as arrays, horse race APL, Star Trek BASIC, Minesweeper, 2048, Sudoku, lights out, falling blocks, asteroids"
abstract: "Sixth in the Array Languages series: X_eTaL-games, where every game illustrates an array-language idea and happens to be playable. Nineteen are live in the browser, from the horse race this blog began with to falling blocks and asteroids, and each one maps to a concept: a vector moved by one expression, an outer product of comparisons, rotation and reduction, compress, a fixed point, a product mod 2, an entity-component system as one matrix. The games are also how the language gets dogfooded: they hold state, take input and keep time, and what they cannot do yet goes back to the language as an ask."
series: "Array Languages"
series_part: 6
date: 2026-10-12 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-games/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-games"
    title: "X_eTaL-games"
---

<img src="{{ '/assets/images/posts/block-robots-game.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<!-- DRAFT for review, refreshed 2026-10-11 from X_eTaL-games (19 games live; the repo README's status paragraph still says nine). -->

<div style="overflow: hidden;" markdown="1">

The demos show what array programming looks like. The games show what it can carry: state from one move to the next, a player's input, a clock. Every game here illustrates one array-language idea and happens to be playable, so this post is a map from games to concepts, and from the concepts back to the language they test.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-games](https://github.com/softwarewrighter/X_eTaL-games) --- one sub-project per game, each with its rules as a library |
| **Live catalog** | [all nineteen games](https://softwarewrighter.github.io/X_eTaL-games/) in the browser · [the code, cross-referenced](https://softwarewrighter.github.io/X_eTaL-games/doc/) |
| **The originals** | [TBT #1: a horse race in APL, 1972](/2026/01/29/tbt-apl-horse-race/) · [TBT #8: the COR24 BASIC games](/2026/04/16/tbt-cor24-basic-startrek-trs80-robot-chase/) |
| **Prior post** | [Array Languages #5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## Nineteen games, live

Each game's rules are a small X_eTaL library, and its page shows only what X_eTaL prints or draws: the game in a terminal, its scripted run as a notebook, and the source. Each tile links to its page:

<style>
.games-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 1em 0 1.4em; }
.games-grid a { display: block; text-decoration: none; }
.games-grid img { display: block; width: 100%; height: auto; border-radius: 4px; }
.games-grid span { display: block; text-align: center; font-size: 0.85em; margin-top: 0.3em; }
@media (max-width: 600px) { .games-grid { grid-template-columns: repeat(2, 1fr); } }
</style>

<div class="games-grid">
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/horse-race/"><img src="{{ '/assets/images/posts/xetal-games-horse-race.webp' | relative_url }}" class="no-invert" alt="The horse race game's page in the X_eTaL games catalog"><span>horse race</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/guess/"><img src="{{ '/assets/images/posts/xetal-games-guess.webp' | relative_url }}" class="no-invert" alt="The guess the number game's page in the X_eTaL games catalog"><span>guess the number</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/robot-chase/"><img src="{{ '/assets/images/posts/xetal-games-robot-chase.webp' | relative_url }}" class="no-invert" alt="The robot chase game's page in the X_eTaL games catalog"><span>robot chase</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/trek-adventure/"><img src="{{ '/assets/images/posts/xetal-games-trek-adventure.webp' | relative_url }}" class="no-invert" alt="The Trek adventure game's page in the X_eTaL games catalog"><span>Trek adventure</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/trek/"><img src="{{ '/assets/images/posts/xetal-games-trek.webp' | relative_url }}" class="no-invert" alt="The Star Trek game's page in the X_eTaL games catalog"><span>Star Trek</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/tic-tac-toe/"><img src="{{ '/assets/images/posts/xetal-games-tic-tac-toe.webp' | relative_url }}" class="no-invert" alt="The tic-tac-toe game's page in the X_eTaL games catalog"><span>tic-tac-toe</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/shut-the-box/"><img src="{{ '/assets/images/posts/xetal-games-shut-the-box.webp' | relative_url }}" class="no-invert" alt="The shut the box game's page in the X_eTaL games catalog"><span>shut the box</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/minesweeper/"><img src="{{ '/assets/images/posts/xetal-games-minesweeper.webp' | relative_url }}" class="no-invert" alt="The Minesweeper game's page in the X_eTaL games catalog"><span>Minesweeper</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/2048/"><img src="{{ '/assets/images/posts/xetal-games-2048.webp' | relative_url }}" class="no-invert" alt="The 2048 game's page in the X_eTaL games catalog"><span>2048</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/sudoku/"><img src="{{ '/assets/images/posts/xetal-games-sudoku.webp' | relative_url }}" class="no-invert" alt="The Sudoku game's page in the X_eTaL games catalog"><span>Sudoku</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/lights-out/"><img src="{{ '/assets/images/posts/xetal-games-lights-out.webp' | relative_url }}" class="no-invert" alt="The lights out game's page in the X_eTaL games catalog"><span>lights out</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/capitals/"><img src="{{ '/assets/images/posts/xetal-games-capitals.webp' | relative_url }}" class="no-invert" alt="The capitals game's page in the X_eTaL games catalog"><span>capitals</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/stargazer/"><img src="{{ '/assets/images/posts/xetal-games-stargazer.webp' | relative_url }}" class="no-invert" alt="The stargazer game's page in the X_eTaL games catalog"><span>stargazer</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/dungeon/"><img src="{{ '/assets/images/posts/xetal-games-dungeon.webp' | relative_url }}" class="no-invert" alt="The dungeon game's page in the X_eTaL games catalog"><span>dungeon</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/maze/"><img src="{{ '/assets/images/posts/xetal-games-maze.webp' | relative_url }}" class="no-invert" alt="The maze game's page in the X_eTaL games catalog"><span>maze</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/scroller/"><img src="{{ '/assets/images/posts/xetal-games-scroller.webp' | relative_url }}" class="no-invert" alt="The side-scroller game's page in the X_eTaL games catalog"><span>side-scroller</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/blocks/"><img src="{{ '/assets/images/posts/xetal-games-blocks.webp' | relative_url }}" class="no-invert" alt="The falling blocks game's page in the X_eTaL games catalog"><span>falling blocks</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/racer/"><img src="{{ '/assets/images/posts/xetal-games-racer.webp' | relative_url }}" class="no-invert" alt="The racer game's page in the X_eTaL games catalog"><span>racer</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-games/asteroids/"><img src="{{ '/assets/images/posts/xetal-games-asteroids.webp' | relative_url }}" class="no-invert" alt="The asteroids game's page in the X_eTaL games catalog"><span>asteroids</span></a>
</div>

</div>

<div class="clearfix" markdown="1">

## Each game, one idea

This is the point of the repo: a game is chosen because its rules are array-shaped, and each one makes a concept concrete. Read down the middle column and it is a short course in array programming.

| Game | The array idea | Terms it exercises |
|---|---|---|
| [Horse race](https://softwarewrighter.github.io/X_eTaL-games/horse-race/) | the whole field as one vector, advanced by one expression | vector, random roll, reduction |
| [Guess the number](https://softwarewrighter.github.io/X_eTaL-games/guess/) | every candidate against every guess, so every game at once | outer product (table), comparison, mask |
| [Robot chase](https://softwarewrighter.github.io/X_eTaL-games/robot-chase/) | all robots move at once; collisions as one product | coordinate matrix, sign as a fork, inner product |
| [Trek adventure](https://softwarewrighter.github.io/X_eTaL-games/trek-adventure/) | the story as a table of rows chosen by masks | table, mask, state machine as data |
| [Star Trek](https://softwarewrighter.github.io/X_eTaL-games/trek/) | the galaxy as planes; a course as every step at once | rank-3 array, path as a matrix, windows by selection |
| [Tic-tac-toe](https://softwarewrighter.github.io/X_eTaL-games/tic-tac-toe/) | lines by indexing; every move rated at once | indexing, inner product, minimax |
| [Shut the box](https://softwarewrighter.github.io/X_eTaL-games/shut-the-box/) | masks over all 512 subsets at once | Boolean mask, subset sums by inner product |
| [Minesweeper](https://softwarewrighter.github.io/X_eTaL-games/minesweeper/) | a cell's count as eight rotations added | rotate, reduce, flood fill to a fixed point |
| [2048](https://softwarewrighter.github.io/X_eTaL-games/2048/) | a move as compress, merge, compress; the board turned to reuse it | compress, train, power of a function |
| [Sudoku](https://softwarewrighter.github.io/X_eTaL-games/sudoku/) | every cell's candidates as one array, every unit counted at once | rank-3 tensor, sums over units, fixed point |
| [Lights out](https://softwarewrighter.github.io/X_eTaL-games/lights-out/) | a press as a row of a matrix; solved by elimination | matrix product mod 2, GF(2) |
| [Capitals](https://softwarewrighter.github.io/X_eTaL-games/capitals/) | every distance at once, the nearest by grade | outer product, grade, SVG as text |
| [Stargazer](https://softwarewrighter.github.io/X_eTaL-games/stargazer/) | every star's brightness band by one table | table lookup, 2,887 points placed at once |
| [Dungeon](https://softwarewrighter.github.io/X_eTaL-games/dungeon/) | you, the monsters and the items as rows of one matrix | entity-component system as arrays |
| [Maze](https://softwarewrighter.github.io/X_eTaL-games/maze/) | a maze carved by a scan; a first-person view looked up at every depth at once | scan, flood to a fixed point, lookup |
| [Falling blocks](https://softwarewrighter.github.io/X_eTaL-games/blocks/) | a piece turned by reversing and transposing; full rows by an and-reduction | reverse, transpose, compress |
| [Side-scroller](https://softwarewrighter.github.io/X_eTaL-games/scroller/) | gravity and collision for every body at once, ticked by the clock | whole-column systems, a mask used as a number |
| [Racer](https://softwarewrighter.github.io/X_eTaL-games/racer/) | every car against every track segment; places by comparing every pair | outer product, reduction |
| [Asteroids](https://softwarewrighter.github.io/X_eTaL-games/asteroids/) | shots and rocks spawned and despawned in the free slots | masks, outer product of hits, replicate |

A few of those ideas, in the games' own code:

```text
places ← 1 + '+ r̲/₂ 0 + p '< t̲able p   ⍝ racer: each car's place, every pair compared
piece ← o̲\ r̲ev piece                   ⍝ falling blocks: a quarter turn
full ← '∧ r̲/₂ W                        ⍝ falling blocks: which rows are full
W ← (n̲ot full) r̲eplicate W             ⍝ ... and the board without them
x ← x × (1 − hit) + snap × hit         ⍝ side-scroller: a mask used as a number
runs ← ('+ s̲\ ends) − ends             ⍝ maze: runs of a row, by one scan
```

The same few shapes recur across games that look nothing alike: rotate and reduce for a neighborhood, a table of every pair, compress to keep what survives, a fixed point to finish a flood. That recurrence is what the shared libraries capture, Board, Play, Text, State, Svg and Ecs, each game using the ones it needs.

</div>

<div class="clearfix" markdown="1">

## An entity-component system as arrays

The newest games, the dungeon, side-scroller, racer and asteroids, share one idea from game engines, written array first. A world is one matrix: a row per entity, a column for each component's fields, and a column saying whether the slot is alive. A system is a whole-column expression over every entity with the components it needs, at once. Spawning is writing into the free slots a mask finds. A macro library writes a world's layout, its getters, setters and masks, from one line:

```text
"h" ᵉᶜc̲omponents< "pos:2 hp atk kind chase heal gold player goal"
```

It is the series' two meanings of *Extensible* again: a library for the systems, and a macro for the layout.

## Games in the other repos

Two more games live outside this repo, next to the machinery they show off:

| Game | Where | The array idea |
|---|---|---|
| [Gem Hunt](https://softwarewrighter.github.io/X_eTaL-extensions/#scene-voxels-game) | X_eTaL-extensions, a native 3D window | a voxel world as arrays: faces found by six rotations, sunlight by one scan down each column, a dig recorded as a row |
| [The voxel Rubik's cube](https://softwarewrighter.github.io/X_eTaL-extensions/#scene-voxels-rubik-solve) | X_eTaL-extensions | each quarter turn a permutation of 54 stickers computed from the geometry, with buttons to turn, scramble and solve |
| [Eigencube](https://softwarewrighter.github.io/X_eTaL-demos/eigencube/) | X_eTaL-demos, in the browser; its solver now a library in X_eTaL-libraries | cubelets as vectors and turns as rotation matrices; a batch of cubes as one array, every turn of every cube one product |

Both have posts of their own: [the voxel world and Gem Hunt](/2026/10/09/voxels-3d-worlds-array-languages/), and [the Eigencube](/2026/10/08/eigencube-rubiks-cube-linear-algebra/), whose solver also drives the voxel cube. And [TTTML](/2026/09/24/tbt-aplsv-birds-tttml/), the tic-tac-toe machine that learns by playing itself, is a demo in the language repo.

## Dogfooding the language

The games are also how the language gets tested on ordinary programs. A demo computes and draws. A game keeps state between moves, reads a player's input, answers clicks, keeps time, loads its data from files, and has to stay fast enough to play. Each of those has pushed on the language:

- **What the games brought in.** Clicks as events for the map games, a clock for the side-scroller, game data in TOML files, and a terminal on every page where the game reads your moves. The terminal is being built in the language as its own saga.
- **What they still ask for.** A functional update that returns an array with a few items changed, which every turn-based game wants and which the voxel world in [the extensions post](/2026/10/10/array-languages-xetal-extensions/) asked for too. Functions defined inside a lambda. Named trains of two arguments. Numbers, not just text, from data files. And speed: an inner product cost about 100 ns per multiply-add when last measured, and a game notices.
- **What they check.** Every scripted game states its guarantees with `a̲ssert<`, every page is played in headless Chrome against the command line's output, and a benchmark fails if any game gets more than 15% slower.

When an ask lands, the game drops its workaround. When it does not, the game shows exactly what the language is missing.

## The series so far

That is the tour: [the language](/2026/10/07/array-languages-xetal/), [the demos](/2026/10/08/array-languages-xetal-demos/), [the libraries](/2026/10/09/array-languages-xetal-libraries/), [the extensions](/2026/10/10/array-languages-xetal-extensions/), [the machine learning](/2026/10/11/array-languages-xetal-ml/), and the games. Six repositories, each with one job, and one language under all of them. Two more, for GPUs and FPGAs, are planned and will join the series when they exist.

</div>
