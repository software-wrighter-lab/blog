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
     motivations; Mike to add or correct his reasons (marked "Mike:" below).
     Birds section (Mike, 2026-10-28): sw-apl docs/birds.md (27fc0e1); MacroLisp run on the live web REPL (build 21a8477): birds
     (42 7 9 6 -6 -7 25 11), Z fact 6 = 720, textbook Y = stack overflow, Y with a delay macro = 720; X_eTaL aside: both Sage forms run in xetal 2bdc6a57 (720), rendered by xetal render (the macro's lambda as a
     c"..." code string so it is drawn); Phoenix: lib/Combinators.xtl l:P_hi (X_eTaL base repo, not X_eTaL-libraries); [u:d_ouble + u:i_nc] 3 and
     'u:d_ouble 'u:i_nc '+ c:P_hi 3 both run (10) in xetal 2bdc6a57. APL\360 LIFE run in sw-apl --mode 70 (blinker
     flips and back); the dfn Life line is Dyalog (Mike: sw-apl gives CHARACTER ERROR on it); Forth run on reva-fork dev
     (03fd93f+): 42 7 9 6 -6 -7 25 11, Y via self-application = 720. Links to #1 assume #1 publishes first (10/28).
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
| **The birds** | sw-apl's [BIRDS workspace](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/birds.md); [MacroLisp, live](https://sw-embed.github.io/web-sw-cor24-macrolisp/) ([repo](https://github.com/sw-embed/sw-cor24-macrolisp)); [reva-fork](https://github.com/softwarewrighter/reva-fork) |
| **Array Languages** | [sw-mlpl](https://github.com/sw-ml-study/sw-mlpl), [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## APL: the whole idea on one line

APL was my first language: [my first program](/2026/01/29/tbt-apl-horse-race/) was a horse race on an IBM mainframe in 1972. In the demos on this blog it is there when an idea is about a whole collection of things at once: the notation operates on entire arrays, and the result reads close to the mathematics.

The [voxel game post](/2026/10/09/voxels-3d-worlds-array-languages/) shows what that buys a demo. Which faces of a 3D chunk of blocks are exposed to the air is one line: shift the whole chunk one step along each of three axes in each of two directions, and compare. It is the same outer product of rotations as the one-line Game of Life, in Dyalog APL:

```text
life ← {⊃1 ⍵ ∨.∧ 3 4 = +/ +⌿ ¯1 0 1 ∘.⊖ ¯1 0 1 ⌽¨ ⊂⍵}
```

That line needs a modern APL: the braces make a direct function, and `⊂` and `¨` work on nested arrays, none of which APL\360 had. My own APL, sw-apl, runs APL\360 as it was in 1970, where the same idea is a defined function that adds up the eight rotations by hand:

```text
∇R←LIFE W;N
N←(1⌽W)+(¯1⌽W)+(1⊖W)+(¯1⊖W)+(1⊖1⌽W)+(1⊖¯1⌽W)+(¯1⊖1⌽W)+(¯1⊖¯1⌽W)
R←(N=3)∨W∧N=2
∇
```

A cell lives next time if it has three live neighbors, or if it is alive and has two. Given a vertical line of three cells, a "blinker", `LIFE` turns it horizontal, and `LIFE LIFE` turns it back. In sw-apl:

```text
      G←5 5⍴0
      G[2;3]←1
      G[3;3]←1
      G[4;3]←1
      G
0 0 0 0 0
0 0 1 0 0
0 0 1 0 0
0 0 1 0 0
0 0 0 0 0
      LIFE G
0 0 0 0 0
0 0 0 0 0
0 1 1 1 0
0 0 0 0 0
0 0 0 0 0
      LIFE LIFE G
0 0 0 0 0
0 0 1 0 0
0 0 1 0 0
0 0 1 0 0
0 0 0 0 0
```

A reader can see the entire algorithm at once, with no loops or index bookkeeping in the way. [Eigencube](/2026/10/08/eigencube-rubiks-cube-linear-algebra/) does the same for a Rubik's cube: the cube as matrices, its moves as linear algebra. And [X_eTaL](/2026/10/07/array-languages-xetal/), the array language I am building in Rust, aims at that density in an array language you can read.

## Lisp: code you can take apart

Lisp's demo is that a program is data. Its code is written as the lists it manipulates, so a program can build, inspect and rewrite code with the same functions it uses for anything else, and macros fall out of that naturally. I have used Lisps since 1989: Scheme, Common Lisp, Racket and Emacs Lisp.

In this blog Lisp has mostly appeared as the point of comparison. In [the Phoenix combinator post](/2026/10/19/rabbit-hole-phoenix-combinator/) the Racket solution names its argument where APL and J compose functions without one, and when X_eTaL's macros were designed, Lisp's reader macros were the thing not to copy: power enough to let a program redefine the language "by accident".

My own Lisp, MacroLisp, does the demonstrating in the birds below.

## Forth: small enough to build, and to watch build itself
{: .pos-center}

Forth is the opposite kind of demo. Where APL hides the machine, Forth puts it on the table: a stack, a dictionary of words, and an interpreter small enough to read in one sitting. That makes it the language for showing how a language works from the inside.

The COR24 Forth posts are built on that. [Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/) moved a kernel from all assembly to mostly Forth, one word at a time; the rabbit-hole posts that followed took apart dictionary lookup, hashing and code generation; and [Embedded #4](/2026/10/24/embedded-forth-from-forth/) ended with a Forth compiler, written in Forth, that rebuilds its own kernel byte for byte.

Forth is also a good host. [CoSy](/2026/10/25/saw-reva-fork-cosy/), Bob Armstrong's APL- and K-like vocabulary, is built on Reva Forth, so a single REPL can show the same fractal drawn the Forth way, recursing, and the array way, as a list.

## One idea, three languages: the birds
{: .pos-left}

<div class="aside-box outdent-right wide" markdown="1">

**The Phoenix in X_eTaL.** The fork is built into the language as a bracketed train, `[F G H] x` is `(F x) G (H x)`, and the same Combinators library, in X_eTaL's standard [`lib/Combinators.xtl`](https://github.com/softwarewrighter/X_eTaL/blob/main/lib/Combinators.xtl), has it as a bird, `ᶜP̲hi`, Curry's S′:

```xetal
ᵘd̲ouble ← { x → 2 × x }
ᵘi̲nc ← { x → x + 1 }
[ᵘd̲ouble + ᵘi̲nc] 3            ⍝ 10
'ᵘd̲ouble 'ᵘi̲nc '+ ᶜP̲hi 3     ⍝ 10
```

Both give 10, double 3 plus 3 plus one ([Rabbit-hole #7](/2026/10/19/rabbit-hole-phoenix-combinator/) used the Phoenix for a GCD).

</div>

Combinators make a good test of what a language lets a demo show. In Raymond Smullyan's *To Mock a Mockingbird* each combinator is a bird: the Kestrel keeps its first argument, the Bluebird composes two functions, the Starling feeds one argument to two functions, and the Sage, Y, gives a function its own fixed point, which is recursion without a name. [Rabbit-hole #6](/2026/09/21/rabbit-hole-sage-y-combinator/) chased the Sage through an eager array language. My APL, sw-apl, has the aviary as a workspace, [BIRDS](https://github.com/sw-vibe-coding/sw-apl/blob/main/docs/birds.md), and the same birds fly in my Lisp and in Forth:

| Bird | λ-term | APL (sw-apl) | Lisp (sw-cor24-macrolisp) | Forth (reva-fork) | Result |
|---|---|---|---|---|---|
| I, Idiot | `λx.x` | `I 42` | `(I 42)` | `42 I` | 42 |
| K, Kestrel | `λx y.x` | `7 K 9` | `((K 7) 9)` | `7 9 K` | 7 |
| KI, Kite | `λx y.y` | `7 KI 9` | `((KI 7) 9)` | `7 9 KI` | 9 |
| C, Cardinal | `λx y z.x z y` | `'-' C 10 3` | `(((C sub) 10) 3)` | `10 3 ' - C` | ¯7 |
| W, Warbler | `λx y.x y y` | `'×' W 5` | `((W mul) 5)` | `5 ' * W` | 25 |
| S, Starling | `λx y z.x z (y z)` | `'+⌽' S ⍳5` | `(((S add) inc) 5)` | `5 ' 1+ ' + S` | |

(The Starling's arguments differ between the columns, so its results do too: `6 6 6 6 6` in APL, 11 in the other two.)

Each language shows the birds in its own way. APL\360 cannot hand one function to another at all, so BIRDS names a function by its glyph and dispatches on it, and hands a dyadic bird its function by dynamic scope; the later APL with execute calls a function by its name. In MacroLisp the birds are closures, curried one argument at a time, exactly as the λ-terms read:

```scheme
(define K (lambda (x) (lambda (y) x)))
(define S (lambda (f) (lambda (g) (lambda (x) ((f x) (g x))))))
```

In Forth a function is an execution token, `' name`, called with `execute`, and the birds rearrange the stack:

```text
: K  ( x y -- x ) drop ;
: S  ( x g f -- f[x,g[x]] ) >r over swap execute r> execute ;
```

The Sage is where the three part ways. All three languages are strict: they evaluate an argument before the function that takes it. The textbook Y computes its own self-application as an argument, so a strict language never stops computing it. In MacroLisp on the emulated COR24 it runs until `Stack overflow at 0xFEDFFF`. The strict version, Z, wraps the self-application in a lambda so it waits until it is called, and a macro can do the wrapping and keep Y's textbook shape:

```scheme
(defmacro delay (e) `(lambda (v) (,e v)))
(define Y (lambda (f) ((lambda (x) (f (delay (x x))))
                       (lambda (x) (f (delay (x x)))))))
(define fact (Y (lambda (self) (lambda (n) (if (< n 2) 1 (* n (self (- n 1))))))))
(fact 6)   ; 720
```

Forth has no closures, so it cannot build a function that returns a function. It does what the Mockingbird does instead, and hands the step itself:

```text
: Y  ( n step -- r ) dup execute ;
: fstep ( n self -- n! )
  over 1 > if over 1- over dup execute nip * else 2drop 1 then ;
6 ' fstep Y .   \ 720
```

sw-apl's Sage, in the APL with execute, does the same: the step is given its own name as characters. Three languages, one idea, and each version shows something the others hide: APL how little the idea needs, Lisp the idea exactly as the λ-calculus writes it, Forth what it costs on a machine with only a stack.

## Building them is part of the demo
{: .pos-right}

<div class="aside-box outdent-left" markdown="1">

**The Sage in X_eTaL.** X_eTaL is strict too, but a lambda's parameter can be made lazy with `~`, so its Combinators library's Sage, `ᶜY̲`, works without the Z detour, and a lambda recurses with no name at all ([Array Languages #1](/2026/10/07/array-languages-xetal/) has six ways to write it):

```xetal
"c:" u̲se< "Combinators"
'{ ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 } ᶜY̲ 6   ⍝ 720
```

The Sage as a macro, `ᶜY̲<`, ties the knot when the program is expanded, so what runs is plain named recursion:

```xetal
"u:f_act" ᶜY̲< c"{ ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }"
ᵘf̲act 6   ⍝ 720
```

</div>


I do not only use these languages; I build them, in assembler, C or Rust, or, in Forth's case, in Forth itself. On this blog that has meant X_eTaL's interpreter in Rust, the COR24 Forth kernel in assembler and then in Forth, and Reva, an x86 Forth, carried to new machines on a virtual machine written in Rust.

Mike: TODO, what building them gives you that using them does not, in your words.
