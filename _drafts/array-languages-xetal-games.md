---
layout: post
title: "Array Languages #6: X_eTaL-games, Rules That Are Arrays"
categories: [languages, language-design, games, retrocomputing, tools]
tags: [array-languages, xetal, x-etal, apl, games, cor24, basic, star-trek, horse-race, wasm]
keywords: "X_eTaL games, array language games, horse race APL, Guess the number, Robot chase, Trek adventure, Star Trek BASIC, COR24 BASIC ports, Minesweeper rotations, 2048 compress merge pad, browser terminal"
abstract: "Sixth in the Array Languages series: X_eTaL-games, where every game teaches one array lesson and happens to be playable. Nine are live in the browser --- the horse race this blog started with, four ports of the COR24 BASIC games with Star Trek among them, and tic-tac-toe, Shut the box, Minesweeper and 2048 --- and the repo has moved from adding games to refactoring them onto shared Play, Text, Board and State libraries. Games are where state, input and ordinary programming get exercised, which the visual demos never do."
series: "Array Languages"
series_part: 6
date: 2026-10-12 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-games/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-games"
    title: "X_eTaL-games"
---

<img src="{{ '/assets/images/posts/block-robots-game.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The demos show what array programming looks like; the games show that it can hold state, take input and run a whole program. Every game here teaches one array lesson and happens to be playable: a horse race is one vector of positions advanced by one expression, a Minesweeper count is eight rotations of the mine board added together, a 2048 move is compress, merge, pad.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-games](https://github.com/softwarewrighter/X_eTaL-games) --- one sub-project per game, a vendored X_eTaL |
| **Live catalog** | [softwarewrighter.github.io/X_eTaL-games](https://softwarewrighter.github.io/X_eTaL-games/) --- every game in the browser |
| **The originals** | [TBT #1: a horse race in APL, 1972](/2026/01/29/tbt-apl-horse-race/) · [TBT #8: the COR24 BASIC games](/2026/04/16/tbt-cor24-basic-startrek-trs80-robot-chase/) |
| **Prior post** | [Array Languages #5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Nine games, live

The repo is a sibling of the demos with the same layout and the same vendored snapshot: board games, puzzles, simulations and quizzes whose rules are array-shaped, each playable on the command line and, soon, in the browser. Every game teaches one array lesson and happens to be playable: a horse race is one vector of positions advanced by one expression; robots chasing you all move at once because the move is a single matrix operation; a Minesweeper count is eight rotations of the mine board added together; a 2048 move is compress, merge, pad. Nine are live in the [games catalog](https://softwarewrighter.github.io/X_eTaL-games/): the [horse race](https://softwarewrighter.github.io/X_eTaL-games/horse-race/) --- the program [TBT #1](/2026/01/29/tbt-apl-horse-race/) started this blog with, the whole field as one vector --- and four ports of the COR24 BASIC games: [Guess the number](https://softwarewrighter.github.io/X_eTaL-games/guess/), every possible game at once as a comparison table; [Robot chase](https://softwarewrighter.github.io/X_eTaL-games/robot-chase/), coordinate matrices, simultaneous motion and collision tables; [Trek adventure](https://softwarewrighter.github.io/X_eTaL-games/trek-adventure/), a state machine as data; and [Star Trek](https://softwarewrighter.github.io/X_eTaL-games/trek/) itself, the galaxy as three 8 by 8 planes made in one go, a course as the path of every step at once, phasers hitting every Klingon in one subtraction, the terminal program running unmodified in the browser. Then four where the array lesson is the whole game: [tic-tac-toe](https://softwarewrighter.github.io/X_eTaL-games/tic-tac-toe/), a 3 by 3 board with its lines extracted by indexing and minimax over board states; [Shut the box](https://softwarewrighter.github.io/X_eTaL-games/shut-the-box/), boolean masks over every subset at once and their sums; [Minesweeper](https://softwarewrighter.github.io/X_eTaL-games/minesweeper/), neighborhoods by rotation and a flood fill to a fixed point; and [2048](https://softwarewrighter.github.io/X_eTaL-games/2048/), a move as compress, merge, pad, and the board turned to reuse it. Still to come: lights out, Connect Four, Mastermind, Sudoku, Reversi, the two map-and-sky quizzes, and Battleship.

The repo has moved from adding games to refactoring them: shared Play, Text, Board and State libraries now carry what the games have in common, so that several different games collapse onto the same few array idioms --- rotate and reduce for a neighborhood, masks over all subsets, compress then merge then pad, a coordinate matrix moved all at once, minimax over a set of boards.

<figure>
<img src="{{ '/assets/images/posts/xetal-games-montage.webp' | relative_url }}" class="no-invert" alt="Nine screenshots from the X_eTaL games catalog: the horse race, Guess the number, Robot chase, Trek adventure, Star Trek, tic-tac-toe, Shut the box, Minesweeper, and 2048">
<figcaption style="font-size: 0.85em;">The nine games live in the catalog: the horse race, Guess the number, Robot chase, Trek adventure, Star Trek, tic-tac-toe, Shut the box, Minesweeper, 2048.</figcaption>
</figure>

## What the games ask of the language

The games are the programs that exercise what the visual demos never touch: state carried between moves, a player's input, a terminal. The terminal is the open ask. The command-line programs run unmodified in the browser today by replaying typed lines; a real browser terminal, with interactive input in the playground itself, is on the language's list, and when it lands the games become the demonstration of ordinary, stateful programming that the series has been building toward.

## The series so far

That is the tour so far: [the language](/2026/10/07/array-languages-xetal/), [the demos](/2026/10/08/array-languages-xetal-demos/), [the libraries](/2026/10/09/array-languages-xetal-libraries/), [the extensions](/2026/10/10/array-languages-xetal-extensions/), [the machine learning](/2026/10/11/array-languages-xetal-ml/), and the games. Six repositories, each with one job, and one language under all of them. Two more, for GPUs and FPGAs, are planned and will join the series when they exist.
