---
layout: post
title: "TBT #12: The IBM 5100's APLSV --- (B) '75, Birds by Execute, and a Machine That Learns Tic-Tac-Toe"
categories: [tbt, programming-history, retrocomputing, languages]
tags: [apl, aplsv, ibm-5100, ibm-5110, ibm-5120, throwback-thursday, b75, array-languages, combinators, birds, tic-tac-toe, machine-learning, self-play, execute, system-variables, smullyan, rust, wasm, sw-apl]
keywords: "APLSV, IBM 5100, IBM 5110, IBM 5120, APL, B75, (B) '75, execute, quad system variables, system functions, CMKEY, CMD key, sw-apl, combinators, Smullyan, To Mock a Mockingbird, Sage, fixed point, tic-tac-toe, self-play, machine learning, Rust, WASM, workspaces, BIRDS, TTTML"
abstract: "Last week was learning APL at a 2741; this week is using it professionally on the IBM 5100 --- the 1975 desk machine whose APL was APLSV with the time-sharing parts removed. That subtraction and its additions are the whole personality of sw-apl's (B) '75 mode: execute, quad system variables that are real variables, the quad system functions, a keyboard with a CMD key, and no I-beams. Two new workspaces show what the differences buy: BIRDS, the full Smullyan aviary reached through execute --- including the Sage, recursion without a name, in 1975 APL --- and TTTML, a machine that learns tic-tac-toe by playing itself, in about 15,000 bytes that would fit beside everything else in a 5110's 64 KB."
repo_urls:
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
series: "Throwback Thursday"
series_part: 12
---

<img src="{{ '/assets/images/posts/ibm-5100-marker.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

Last week's [TBT #11](/2026/09/17/tbt-apl-360-revisited/) covered APL\360 itself --- the typeball, the six-space prompt, the clean-room interpreter --- so this week stays on the new work: sw-apl's second mode, modelled on the APL of the IBM 5100 family, finished over the past week, and the two workspaces it made possible.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Try it live** | [sw-apl.softwarewrighter.com](https://sw-apl.softwarewrighter.com/) --- opens in (B) '75; `)LOAD 1 BIRDS`, then `HOWBIRDS`; or `)LOAD 1 TTTML`, then `PLAY 1` |
| **Repo** | [sw-vibe-coding/sw-apl](https://github.com/sw-vibe-coding/sw-apl) --- `docs/mode-b.md` is the (B) plan, built from IBM's manuals |
| **IBM documents** | [5110 APL Reference](https://www.bitsavers.org/pdf/ibm/5110/SA21-9303-0_IBM_5110_APL_Reference_Manual_Dec1977.pdf) (SA21-9303-0, 1977) · [5100 APL Reference](https://www.bitsavers.org/pdf/ibm/5100/SA21-9213-2_IBM_5100_APL_Reference_Manual_May1976.pdf) (SA21-9213-2, 1976) |
| **Prior post** | [TBT #11: APL\360 Revisited](/2026/09/17/tbt-apl-360-revisited/) |
| **Today's companion** | [Rabbit-hole #6: The Sage Bird](/2026/09/21/rabbit-hole-sage-y-combinator/) --- the same fixed-point story in sw-MLPL |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What IBM shipped in 1975

The block print at the top of this post is a derivative of Sandstein's photograph of the 5100 at the Museum für Kommunikation Bern, used under [CC BY-SA 3.0](/assets/docs/attribution/cc-by-sa-3.0.html) --- [attribution and changes](/assets/docs/attribution/tbt-aplsv-birds-tttml.html).

In September 1975 IBM announced the 5100: a fifty-pound briefcase with a CRT, a tape drive, a BASIC/APL switch, and APL --- the first time APL ran on something you could carry to a client and use without a mainframe in the building. IBM described its APL as APLSV with the parts removed that only make sense on a time-shared system of many terminals, plus commands for the machine's own tape, diskette and printer. The 5110 and the 5120 followed, and each reference manual carries an appendix listing exactly what was removed and added.

Those appendices are the backbone of sw-apl's (B) '75 mode. The mode is built from the 5110's manual (SA21-9303-0, December 1977) --- the later of the two, the one the 5120 ran, the one every 5100 workspace loads on --- with the 5100's differences noted where they matter. No APL manual survives for the 5120 at all; only maintenance and logic documents do, so the 5110's manual governs. The mode is called (B) '75, and only that: IBM's product names in the repo say which manuals it came from, never what it is.

## The differences are the personality

Where (A) '70 recreates APL\360 as it was, (B) '75 is that language after IBM's 1975 edits. Each difference is small; together they change what the machine feels like:

|  | (A) '70 --- APL\360 | (B) '75 --- the 5100 family |
|---|---|---|
| Execute | none | `⍎B` evaluates a character expression |
| Format | none | `⍕B` and `A⍕B`, width-and-precision pairs |
| Settings | `)ORIGIN`, `)DIGITS`, `)WIDTH` commands | `⎕IO`, `⎕CT`, `⎕PP`, `⎕PW`, `⎕RL`, `⎕LX`, `⎕AV` --- real variables |
| System functions | none | `⎕CR`, `⎕FX`, `⎕EX`, `⎕NL`, `⎕NC`, `⎕CC` |
| Groups | yes | no |
| I-beams | yes | none --- the quad variables own those values now |
| Quad name | `⎕IO` is quad *beside* a name: SYNTAX ERROR | quad before a letter is one name |
| Clock | real time, many users | `⎕TS` is 1900 0 0 0 0 0 0 --- one user, no clock |

The subtlest differences are the best. The settings are no longer commands but quad variables, which means they are values: they can be read into expressions, made local to a function, and written by indexed assignment --- `⎕TS[1]←1977`, straight from the manual --- so a function can set its own origin and put it back. A quad before a letter is a single name in (B), where (A) still rejects `⎕IO` as it always did. And the output rules differ: (B)'s clear workspace starts at `⎕PP` 5 and `⎕PW` 64, and prints whole numbers up to ten digits in full whatever the precision says --- the manual's rule, not APL\360's.

New this week, from those differences: output appears as it is written. A function's result shows under the settings in force where it was *produced*, not where it lands in the session --- because in (B) the settings are variables, a program can change them mid-run, and the transcript keeps each line honest about which rules printed it. The on-page keyboard gained a mode of its own too: a shared layout, and (B)'s CMD key, the way the 5100's own keyboard held the APL symbols --- CMD with the top row gives the glyphs, CMD with backspace edits the line. The 5110's compatibility variables (`⎕AI`, `⎕DL`, `⎕TS`, `⎕TT`, `⎕UL`) hold the manual's fixed values, machine's-honesty intact. Shared variables (`⎕SVO`) are documented and deliberately not built: on the real family they were the only road to tape, diskette and printer, and this machine has none of those.

## Birds, by execute

The reason to build all of this is `⍎`. Classic APL has no first-class functions: a function cannot be handed to another function, named or otherwise. (A)'s BIRDS workspace --- [combinators after Smullyan](/2026/09/21/rabbit-hole-sage-y-combinator/) --- gets around that honestly and crudely, staging a fixed vocabulary of stand-ins (`IOTA`, `REV`, `CEIL`) and interpreting the birds over those names only.

(B) needs no stand-ins. In '75, a function goes to a bird **by name or glyph, as characters**, and execute calls it --- any function, primitive or defined:

```text
      '⌽ ⍳' B 5
5 4 3 2 1
      'FACT ⌈' B 3.2
24
      '-' C 10 3
¯7
      HOWBIRDS
```

`HOWBIRDS` replays the whole aviary at the session, one line at a time, and `NOTHERE` lists what is still missing. The finest bird in the box is the same one from this week's rabbit hole: the **Sage**. In (B), a bird's function is given its own self-call as characters:

```text
      ∇R←F Y X;SELF
[1]   ⍝ THE FIXED POINT OF F. F IS DYADIC: ITS LEFT ARGUMENT IS
[2]   ⍝ HOW TO CALL ITSELF, AS CHARACTERS, SO IT RECURSES WITHOUT
[3]   ⍝ ITS OWN NAME.
[4]   SELF←'''',F,''' Y'
[5]   R←⍎'SELF ',F,' X'
[6]   ∇
      'FSTEP' Y 6
720
```

A function that recurses **without its own name**, in 1975 APL, on a machine IBM sold as a briefcase. The trick is the same one [Rabbit-hole #6](/2026/09/21/rabbit-hole-sage-y-combinator/) tells in sw-MLPL --- delay the self-application, tie the knot --- but the delay here is a string and an execute, which is what 1975 had instead of lambdas and partials. Two languages, same bird, fifty years apart.

## TTTML: learning in 12,000 bytes

The second new workspace is (B)-only, because it is a stress test of the whole mode: **TTTML**, a machine that learns tic-tac-toe by playing itself, then plays you.

```text
      )LOAD 1 TTTML
SAVED 20.41.27 09/22/26
      PLAY 1
```

It learns one number per board position --- not per position-and-move --- and counts a position and its seven rotations and reflections as one, keyed as a base-3 number. Self-play, with a little random exploration to keep it honest, reaches about 750 such positions: two vectors of 750 numbers, 12,000 bytes, with the functions and board tables under 3 KB more. It ships already trained --- `PLAY 1` and you move first as X, `PLAY 2` and it does --- and `TRIAL N` measures it against a random player, won, lost and drawn, each side. `TRAIN N` makes it forget and learn again in front of you.

The constraint is the fun: it all has to fit in a 5110's 64 KB beside your own work, and it does, with most of the machine's memory still free. The lab's other learning machines are bigger --- a 33,065-parameter ELIZA in sw-MLPL, traced decision by decision --- but the instinct is the same one TTTML shows in 1975 clothes: a table of values, a lot of self-play, and nothing you cannot print and read.

## Try it

```text
      )LIB 1
 LIFE      RACE      EDIT      BIRDS     TTTML
      )LOAD 1 BIRDS
      HOWBIRDS
      )LOAD 1 TTTML
      PLAY 1
```

In the browser at [sw-apl.softwarewrighter.com](https://sw-apl.softwarewrighter.com/) --- the page opens in (B) '75, the tabs switch modes, and the keyboard at the bottom has every glyph including the new CMD layer, so a phone works. On your own machine, `sw-apl --mode 75`, or `sw-apl-server --mode 75` with `aplterm` for the full 2741-in-a-window experience --- and `just demo 75` for both at once.

Two modes, two relationships to APL: the year you learned it, and the year you used it for a living. (A) keeps the 2741 honest. (B) keeps IBM's appendices honest --- every difference on the list above is checked against the manual that shipped with the machine.
