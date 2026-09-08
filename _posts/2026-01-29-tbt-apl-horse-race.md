---
layout: post
title: "TBT #1: My First Program Was a Horse Race"
date: 2026-01-29 09:00:00 -0800
categories: [tbt, programming-history]
tags: [apl, throwback-thursday, retrocomputing, ibm, mainframe, game]
keywords: "IBM 2741, Selectric typeball, 1972, array programming, Kenneth Iverson, GNU APL"
author: Software Wrighter
abstract: "My first program was a horse race game in APL on an IBM mainframe in 1972. This Throwback Thursday post recreates it using GNU APL, exploring array-oriented programming and the ideas that shaped languages from J to NumPy."
series: "Throwback Thursday"
series_part: 1
video_url: "https://www.youtube.com/watch?v=_MkFUwLpnUM"
video_title: "Greek Code, No Lowercase #TBT"
repo_url: "https://github.com/sw-comp-history/apl-horse-race"
---

<img src="{{ '/assets/images/site/post-marker-apl.webp' | relative_url }}" class="post-marker no-invert" alt="">

My first program was a horse race. Written in APL. On a mainframe. In 1972.

This is the first **Throwback Thursday** post---a series where I revisit the technologies, languages, and ideas that shaped how I think about programming.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [apl-horse-race](https://github.com/sw-comp-history/apl-horse-race) |
| **Demo** | [Live Demo](https://sw-comp-history.github.io/apl-horse-race/) |
| **GNU APL** | [gnu.org/software/apl](https://www.gnu.org/software/apl/) |
| **Video** | [Greek Code, No Lowercase #TBT](https://www.youtube.com/watch?v=_MkFUwLpnUM)<br>[![Video](https://img.youtube.com/vi/_MkFUwLpnUM/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=_MkFUwLpnUM) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## APL: A Programming Language

APL was created by Kenneth Iverson at IBM in the 1960s. The name literally means "A Programming Language"---Iverson was a mathematician who designed it as a notation for describing algorithms before it became an actual programming language.

What made APL special:

| Feature | Description |
|---------|-------------|
| **Array-oriented** | Operations work on entire arrays, not single values |
| **Symbolic notation** | Greek letters and mathematical symbols as operators |
| **Interactive** | REPL-style development decades before it was common |
| **Terse** | Complex operations in a few characters |

APL programs look like nothing else:

```apl
POS←POS+?5⍴3
```

This single line adds random values (1-3) to all five horse positions simultaneously. No loops. No iteration. The operation just *happens* across the entire array.

## The IBM 2741 Experience

In 1972, APL\360 ran on IBM mainframes. You accessed it through terminals like the IBM 2741---essentially a modified Selectric typewriter with a special APL typeball.

<figure class="inline-right">
  <img src="{{ '/assets/images/posts/2026-01-29-apl/selectric-typeball.webp' | relative_url }}"
       alt="IBM Selectric APL typeball"
       width="200">
  <figcaption>APL typeball for IBM Selectric</figcaption>
</figure>

The typeball had all the APL glyphs: `⍴ ⍳ ∇ ⎕ ← ⌈ ⌊ ⍵ ⍺ ∘ ⊃ ⊂` and dozens more. You physically typed these symbols. The keyboard layout was completely different from anything you'd seen before.

When you made an error, there was no backspace in the modern sense. You'd overstrike characters or start the line over. Programs were stored in workspaces, saved to tape or disk.

The terminal printed on paper. Every interaction left a physical record.

## The Horse Race Program

Horse race simulations were popular APL demonstrations. They showed off several things:

1. **Random number generation** (`?` roll operator)
2. **Array operations** (updating all positions at once)
3. **Character graphics** (crude but effective visualization)
4. **Interactive output** (watching the race unfold)

Here's the verbose version from the repo:

```apl
∇ RACE;HORSES;POS;FINISH;ROUND;_
  HORSES←'LUCKY  ' 'THUNDER' 'SHADOW ' 'COMET  ' 'BLAZE  '
  POS←5⍴0
  FINISH←15
  ROUND←0
  ⎕←'══════════════════════════════════════════'
  ⎕←'           THE RACE IS ON!'
  ⎕←'══════════════════════════════════════════'
LOOP:ROUND←ROUND+1
  ⎕←'--- ROUND ',(⍕ROUND),' ---'
  POS←POS+?5⍴3
  SHOWHORSES
  →DONE×⍳∨/POS≥FINISH
  →LOOP
DONE:⎕←'WINNER: ',((⊃(POS=⌈/POS)/⍳5)⊃HORSES),'!'
∇
```

### Key APL Idioms

**Array creation:**
```apl
POS←5⍴0    ⍝ Create array of 5 zeros
```

The `⍴` (rho) operator reshapes. `5⍴0` means "reshape 0 into a 5-element array."

**Random numbers:**
```apl
?5⍴3       ⍝ Roll 5 dice, each 1-3
```

The `?` operator is "roll"---like rolling dice. `?5⍴3` rolls five 3-sided dice.

**Finding the winner:**
```apl
(⊃(POS=⌈/POS)/⍳5)⊃HORSES
```

This reads right-to-left:
- `⌈/POS` --- maximum of all positions
- `POS=⌈/POS` --- boolean mask: which horses are at max?
- `/⍳5` --- compress: keep only those indices
- `⊃` --- take the first one
- `⊃HORSES` --- select that horse's name

One line. No loops. Pure array thinking.

## The Idiomatic Version

APL programmers pride themselves on terseness. The idiomatic version does the same thing in fewer characters:

```apl
HORSES←'LUCKY  ' 'THUNDER' 'SHADOW ' 'COMET  ' 'BLAZE  '

∇ SHOW;I
  I←1
N:⎕←(I⊃HORSES),'│',((I⊃POS)⍴'░'),'▓'
  I←I+1
  →N×⍳I≤5
∇

∇ RACE;POS;_
  POS←5⍴0
  ⎕←'THE RACE IS ON!'
L:_←⎕DL 0.3
  POS←POS+?5⍴3
  SHOW
  ⎕←''
  →L×⍳~∨/POS≥15
  ⎕←'WINNER: ',(⊃(POS=⌈/POS)/⍳5)⊃HORSES
∇
```

The entire program fits on a single screen. This was the APL aesthetic: powerful ideas expressed concisely.

## Running It Today

GNU APL implements ISO 13751 (Extended APL) and runs on modern systems:

```bash
# macOS
brew install gnu-apl

# Arch Linux
yay -S gnu-apl

# Run the race
git clone https://github.com/sw-comp-history/apl-horse-race
cd apl-horse-race
apl -f src/race.apl
```

Sample output:

```
══════════════════════════════════════════
           THE RACE IS ON!
══════════════════════════════════════════

--- ROUND 1 ---
LUCKY   │▓▓▓◄
THUNDER │▓▓◄
SHADOW  │▓◄
COMET   │▓▓▓◄
BLAZE   │▓▓◄
```

The horses advance randomly until one crosses the finish line.

## What APL Taught Me

APL shaped how I think about programming in ways that persist today:

**1. Think in arrays, not loops.**

When I see a problem, I ask: can this be expressed as an operation on a whole collection? Languages like NumPy, R, and Julia carry this forward.

**2. Notation matters.**

Good notation can make complex ideas simple. Bad notation obscures them. APL's symbols were controversial, but they made array operations *visible* in ways that verbose syntax doesn't.

**3. The REPL is powerful.**

Interactive development---type an expression, see the result immediately---was central to APL decades before it became fashionable again with Jupyter notebooks and modern REPLs.

**4. Terseness has value.**

Not obfuscation for its own sake, but the ability to see an entire algorithm at once. When your program fits on one screen, you can reason about the whole thing.

## APL's Legacy

APL influenced many languages:

| Language | Year | APL Influence |
|----------|------|---------------|
| **J** | 1990 | Iverson's ASCII-only redesign |
| **K/Q** | 1993 | Powers financial systems at Kx |
| **A+** | 1988 | Morgan Stanley's open-source APL |
| **BQN** | 2020 | Modern APL with cleaner semantics |
| **NumPy** | 2006 | Array operations in Python |
| **R** | 1993 | Vector operations for statistics |

The ideas live on, even if the glyphs don't.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | APL |
| **Source Files** | 2 `.apl` files |
| **Lines of Code** | ~50 lines total |
| **Runtime** | GNU APL |
| **Also Includes** | Documentation, PNG samples for Unicode issues |

**Good for you if:** You want to understand array programming origins, learn basic APL, or experience what programming felt like in the 1970s.

**Complexity:** Low. The program is intentionally simple---a teaching example, not production code. The repo includes extensive documentation explaining every line.

## Why Throwback Thursday?

Programming didn't start with Python and JavaScript. Every abstraction we use today was invented by someone solving a real problem.

TBT posts will explore:
- Languages that shaped my thinking (APL, Lisp, Forth)
- Technologies that were ahead of their time (CMS/TSO Pipelines, dataflow)
- Ideas worth revisiting with modern tools

Understanding where we came from helps us see where we're going.

## Resources

- [apl-horse-race Repository](https://github.com/sw-comp-history/apl-horse-race)
- [GNU APL](https://www.gnu.org/software/apl/)
- [APL Wiki](https://aplwiki.com/)
- [Iverson's Turing Award Lecture: "Notation as a Tool of Thought"](https://www.jsoftware.com/papers/tot.htm)
- [Video: Greek Code, No Lowercase #TBT](https://www.youtube.com/watch?v=_MkFUwLpnUM)

---
