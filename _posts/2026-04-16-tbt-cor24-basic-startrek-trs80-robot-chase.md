---
layout: post
title: "TBT #9: UNIVAC Startrek, TRS-80 Adventures, and COR24 BASIC"
date: 2026-04-16 16:30:00 -0700
categories: [tbt, programming-history, retrocomputing]
tags: [throwback-thursday, basic, star-trek, trs-80, univac-1108, cor24, p-code-vm, pascal, integer-basic, retro-gaming, teletype, vibe-coding]
keywords: "UNIVAC 1108 Star Trek BASIC, teletype Red Alert bell, TRS-80 magazine listing, text adventure, COR24 BASIC, integer-only BASIC, line-numbered BASIC, p-code virtual machine, Pascal interpreter, Robot Chase, time-sharing BASIC, retro computing, classic BASIC games"
author: Software Wrighter
abstract: "Three BASIC games from three eras---UNIVAC 1108 Startrek whose Red Alert bell telegraphed Klingon encounters across the teletype room, a 1980s Trek text adventure typed in from a magazine listing on a TRS-80, and Robot Chase added at a friend's request---all running in the browser on an emulated COR24 integer BASIC implemented on a p-code VM written in Pascal."
series: "Throwback Thursday"
series_part: 9
repo_url: "https://github.com/sw-embed/sw-cor24-basic"
---

<img src="{{ '/assets/images/posts/block-spaceships-robots.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Three BASIC games. Three eras. One retro-computing platform.

Startrek on a UNIVAC 1108 teletype in the '70s. A Trek text adventure typed in from a computer magazine on a TRS-80 in the '80s. And Robot Chase, added just last week at a friend's request. All three now run in the browser on an emulated [COR24 BASIC](https://github.com/sw-embed/sw-cor24-basic)---a line-numbered, integer-only, 1970s-style time-sharing BASIC built on a p-code VM written in Pascal.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 BASIC Demos](https://sw-embed.github.io/web-sw-cor24-basic/) |
| **Games** | *startrek*, *trek-adventure*, *robot-chase* |
| **BASIC Interpreter** | [sw-embed/sw-cor24-basic](https://github.com/sw-embed/sw-cor24-basic) |
| **Web Runtime** | [sw-embed/web-sw-cor24-basic](https://github.com/sw-embed/web-sw-cor24-basic) |
| **Prior Post** | [TBT #8: Wiki Systems](/2026/03/26/tbt-wiki-rs-six-wikis/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## UNIVAC 1108 Startrek: The Bell That Gave You Away

The first version of [Star Trek](https://en.wikipedia.org/wiki/Star_Trek_%28text_game%29) I ever played ran on a [UNIVAC 1108](https://en.wikipedia.org/wiki/UNIVAC_1100/2200_series) time-sharing system, dialed into from a [teletype](https://en.wikipedia.org/wiki/Teleprinter) terminal. You typed commands, the ship's status came back as ALL CAPS tabular output, and the teletype's mechanical print head hammered out every line of the 8×8 galactic map one character at a time.

The game used an 8×8 galaxy of quadrants, each with its own 8×8 sector grid, populated with Klingons, starbases, and stars. You commanded the Enterprise: warp around, fire phasers and torpedoes, dock for repairs, and save the Federation before your energy or time ran out.

But the detail nobody forgets: **the `BELL` character.** Every teletype in the room had a solenoid-driven bell. When your ship entered a quadrant containing Klingons, the Star Trek program printed:

```
*** RED ALERT *** *** RED ALERT ***
```

...preceded by ASCII BEL (`CHR$(7)`), which rang the bell on your terminal. Loudly. Across the entire room.

Which meant everyone in the terminal room could tell exactly who was playing Star Trek. This was at college, where the UNIVAC 1108 was also where you did your programming homework---and the bell was supposed to be the game warning *you* about Klingons, but in practice it also let every other student in the room know you were not, in fact, finishing that assignment.

My COR24 version (`startrek.bas`) keeps the command loop, the galaxy, and the Red Alert banner. The one thing it sadly *doesn't* reproduce is the bell itself: `CHR$(7)` in a browser tab is silent, and the solenoid-driven clack of a shared teletype doesn't port. You'll have to imagine the sound.

## TRS-80 Trek Adventure: The Vibe of a Magazine Listing

A half-decade later, the home computer era produced a different kind of Trek game: **text adventures** distributed as **BASIC source listings in computer magazines**. On a [TRS-80](https://en.wikipedia.org/wiki/TRS-80)---in my case, my dad's old Model I---you read the listing, typed it in line by line (`100 DIM A$(50)`, `110 PRINT "BRIDGE"`, on for hundreds of lines), saved to cassette, and prayed you hadn't mistyped a variable name. Debug night was the same night you got the game. If it didn't run, you walked back through every line number until you found the typo.

For `trek-adventure.bas`, I didn't have an actual magazine listing to work from. So I did what the era didn't have: **vibe coding, baby.** I described the game I wanted---a text adventure in integer-only line-numbered BASIC, starting on the bridge of the Enterprise, menu-driven in the 80s-magazine style, with a tight little puzzle about boarders, a phaser, a key card, a tribble, a relay coupler, and a decaying orbit---and the AI wrote one. No original source, no translation, no finger down a magazine page. Just a description and iteration.

The AI leaned into the bit. The resulting file opens with a REM block claiming a provenance that never existed:

```
104 REM STAR TREK: DECAYING ORBIT - A TEXT ADVENTURE.
105 REM TRANSLATED FROM A QBASIC/GW-BASIC MAGAZINE LISTING
106 REM INTO INTEGER-ONLY COR24 BASIC V1. COMMANDS ARE
107 REM NUMERIC MENUS; TARGETS ARE NUMBERS SHOWN IN THE
108 REM ROOM DESCRIPTIONS.
```

There is no magazine listing. The vibe *is* the listing. Numbered menus, numeric targets pulled from room descriptions, a handful of endings, state on a 24-bit integer VM---the game feels exactly like something that could have shipped in a 1982 issue of *80 Micro*, because that's what I asked for. No `?SN ERROR` at 3am, no cassette rewinding, no walking every line number hunting a typo. The grunt work moved up a layer of abstraction; the feel stayed put.

## Robot Chase: Added on Request

Every retro project eventually picks up a side quest. A friend asked whether I could also do [Robot Chase](https://en.wikipedia.org/wiki/Robots_%28BSD_game%29) (sometimes called *Daleks* or just *Robots*)---the classic 1980s terminal game where you're trapped on a grid with robots that step one square toward you every turn, and your only hope is to make them collide into each other or into wreckage.

It's a small game with a lot of character:

- 16×16 board, 12 robots.
- Numpad-style movement: `7 8 9 / 4 5 6 / 1 2 3`---`5` waits a turn.
- Three emergency teleports per game. `99` resigns.
- `10` gives a 4×4 long-range-scan summary, collapsing the board into regional robot counts so you can plan routes.
- Collide a robot with another robot or with wreckage, and the tile becomes a `*` wreck. Touch a robot or a wreck yourself, and you lose.

COR24 BASIC is integer-only and has no clock, so the [PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) seed comes from whatever the variable `R` holds when you start the game. First run, `R=0` → deterministic default seed 5237. Subsequent runs pick up the previous game's residual `R`, which in practice gives you a different board each time. Pure, old-school deterministic pseudo-randomness. No `time()`, no `/dev/urandom`, just whatever integer happens to be sitting in `R`.

My version runs as `robot-chase.bas`.

## Why COR24 BASIC?

All three games run on [COR24 BASIC v1](https://github.com/sw-embed/sw-cor24-basic), which is deliberately **time-sharing-era BASIC**, not a modern dialect. The design target is the experience of UNIVAC 1100-series terminal BASIC: line numbers, integer arithmetic, single-letter variables, `GOSUB`/`RETURN`, `GOTO`, interactive `LIST` and `RUN`. No floats, no strings beyond `CHR$(n)` inside `PRINT`, no structured programming. Just enough to type a program into a terminal and watch it go.

The implementation is a four-layer stack:

| Layer | What It Is |
|-------|------------|
| **Layer 3** | BASIC interpreter (tokenizer, parser, dispatch) |
| **Layer 2** | BASIC runtime (I/O, line storage, stacks, PEEK/POKE) |
| **Layer 1** | [P-code](https://en.wikipedia.org/wiki/P-code_machine) virtual machine (language-neutral abstract machine) |
| **Layer 0** | COR24 hardware / emulator |

The interpreter is a [Pascal](https://en.wikipedia.org/wiki/Pascal_%28programming_language%29) program compiled to p-code by `p24p`, assembled by `pa24r` into `.p24` bytecode, and run on `pv24t` (the p-code VM). The p-code machine handles arithmetic, stacks, calls, and memory; the BASIC runtime on top of it handles line-numbered statements and interactive editing.

This matters for the games because **integer-only BASIC on a 24-bit word is a real constraint.** No floating-point Klingon positioning, no shortcut RNGs, no lazy string parsing. You write the game like you're writing it in 1975---arrays of integers, careful arithmetic, explicit line numbers, `GOSUB` instead of functions---and the emulator gives it back to you pixel-true in a browser tab.

## Try the Demos

[sw-embed.github.io/web-sw-cor24-basic](https://sw-embed.github.io/web-sw-cor24-basic/) runs the entire stack in WebAssembly. Pick a program from the examples list, click **RUN**, and the integer-only BASIC interpreter---running on a Pascal-compiled p-code VM---plays the game in your browser:

| Demo | What You Get |
|------|--------------|
| **`startrek.bas`** | The 8×8 galaxy, phaser and torpedo combat, starbase docking, energy management. The command loop and the quadrant display are faithful to the 1970s teletype experience---minus the bell. |
| **`trek-adventure.bas`** | Numbered-menu text adventure starting on the bridge of the Enterprise. Save the ship, stop the boarders, keep the orbit from decaying. |
| **`robot-chase.bas`** | The 16×16 board with 12 robots, numpad movement, teleports, long-range scan. Collide the robots into each other and yourself into none of them. |

All three are line-numbered BASIC source you can inspect, edit, re-run, and (if you want) port to your own time-sharing-era BASIC. The listings are MIT-licensed in [sw-cor24-basic/examples](https://github.com/sw-embed/sw-cor24-basic/tree/main/examples).

Three eras, one interpreter, one browser tab. The bell is silent now, but the galaxy still needs defending.

---

*TBT: what we built with, what we still build from.*
