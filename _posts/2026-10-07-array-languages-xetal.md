---
layout: post
title: "Array Languages #1: X_eTaL, an Array Language You Can Read"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, apl2, j, bqn, language-design, static-typing, hindley-milner, typography, notation, rust, wasm, literate-programming, sw-apl, conway-life]
keywords: "X_eTaL, XeTaL, eXperimental Extensible Typed Array Language, array language, APL without glyphs, ASCII APL, typographic decoration, underline function, subscript axis, superscript namespace, Hindley-Milner, statically typed array language, Rust, WASM playground, Conway's Life one-liner, sw-apl"
abstract: "X_eTaL, the eXperimental Extensible Typed Array Language, is an APL-family array language that differs from its ancestors on purpose: statically typed with Hindley-Milner inference, plain ASCII in with typography out, and extensible through libraries, macros and native code. First of a series, one post per repository: this one is the language itself --- the question it asks, how typography became the syntax, what it can do as of October 2026, and the programs inside the repo that prove it."
series: "Array Languages"
series_part: 1
date: 2026-10-07 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
---

<!-- Layout: TITLE/META | r3: TOC, STAMP (logo), INTRO | r4: TOC, REEL (live demo), LINKS | r5: KEYS | sections full width -->

<img src="{{ '/assets/images/posts/xetal-logo.webp' | relative_url }}" class="post-marker no-invert theme-light-only" alt="" style="width: 250px;">
<img src="{{ '/assets/images/posts/xetal-logo-dark.webp' | relative_url }}" class="post-marker no-invert theme-dark-only" alt="" style="width: 250px;">

<div markdown="1">

**X_eTaL** --- the eXperimental Extensible Typed Array Language, said *Ecks-e-tal*, LaTeX reversed --- is an array language in the APL, APL2, J and BQN tradition that differs from its ancestors in three deliberate ways: it is statically typed, its source is plain ASCII rendered as typography, and it is extensible in layers. It is aimed at machine learning, distributed and embedded work.

This is the first of a series, one post per repository. This one is the language: what it asks, how it reads, what it can do as of October 2026, and the programs inside the repo that prove it. The demos, libraries, extensions and ML work each get their own post.

</div>

<div class="resource-box" style="width: 330px; max-width: 330px; box-sizing: border-box;" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL](https://github.com/softwarewrighter/X_eTaL) --- Rust, MIT, specified by its test suite |
| **Try it** | [the playground](https://softwarewrighter.github.io/X_eTaL/) · [the syntax poster](https://softwarewrighter.github.io/X_eTaL/poster/) · [X_eTaL in fifteen minutes](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/literate/beginner.org) |
| **Reference** | [the documentation site](https://softwarewrighter.github.io/X_eTaL/doc/) --- every library and built-in, searchable by name or by type |
| **Read** | [literate documents](https://softwarewrighter.github.io/X_eTaL/literate/) · [why another language](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/why-another-language.md) · [reply to the APL skeptics](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/xetal-apl-skeptics-response.md) |
| **Checked against** | [sw-vibe-coding/sw-apl](https://github.com/sw-vibe-coding/sw-apl), APL\360 live |
| **The thread** | [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) · [Made Visible #4](/2026/09/25/made-visible-rosetta-m/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<figure style="float: left; clear: none; margin: 0 1.5em 0.6em 0; max-width: 32%;">
<img src="{{ '/assets/images/posts/xetal-live-demo.webp' | relative_url }}" class="no-invert" alt="The X_eTaL live demo: ASCII source on the left, the decorated rendering on the right, inferred types below">
<figcaption style="font-size: 0.85em;"><a href="https://softwarewrighter.github.io/X_eTaL/">The playground</a>: what you type, what you see, and what the type checker says, one pane each.</figcaption>
</figure>

<div class="aside-box" style="float: left; clear: left; margin: 0.3em 1.8em 1.2em 0;" markdown="1">
**How to read a name.** No underline: a variable. First letter underlined: a function. A raised letter in front: the library it came from --- `u` for yours, `c` for a library you imported as `c`. A lowered number after a function: the axis it works along. A raised number on a value: a power. You type `r_ev` and see r̲ev; you type `r_/_2` and see r̲/₂. Expressions read right to left, as in APL.
</div>

<div class="clearfix" style="clear: both; padding-top: 0.5em;" markdown="1">

## The question it asks

The README puts it in one sentence: *what would APL look like if it were designed today for composition, readability, tooling, and machine learning?* The APL family is terse and expressive and depends on a glyph alphabet that needs special keyboards, fonts and memorized symbols. The ASCII descendants, J and K, traded the glyphs for digraphs that are hard to read. None of them offer a regular way to move between a readable long form and a terse one, and none are statically typed. X_eTaL is one specific answer in that design space, and the project's own words for what it is not: it is not meant to replace anything, and performance, native compilation and GPU backends are explicit non-goals.

<div class="aside-box" markdown="1">

**This series.** [Array Languages](/series/#array-languages) walks the X_eTaL repositories one at a time: the language, then its demos, its libraries, its native extensions, the machine-learning work the whole thing exists for, and its games. Each post stands alone; together they are the state of the project in October 2026. Two more repositories, one for GPUs and one for FPGAs, are planned, and will get posts of their own when they exist.

</div>
\nThe audience it names is three people: the author and anyone else exploring notation design; learners, who get progressive disclosure from long names down to terse stems; and AI coding agents, which implement the language under a strict test-driven process. That last one is not a joke. The repository was built in its first week by coding agents working through [agentrail](https://github.com/sw-vibe-coding/agentrail-rs) sagas against a spec that is a directory of test cases, under two rules that are written down: never resolve an ambiguity heuristically, and never special-case Life.

</div>

## Why static types, in an array language

The static types are not a safety feature bolted onto APL. Array-language terseness packs assumptions about rank, element type and arity into a short expression; inference lets the program stay terse while the compiler answers the question *can these pieces actually compose?* --- without annotations on every line. The same types are what keep the extensibility from turning chaotic: libraries compose through them, macro expansions are checked by them, and native facades advertise them.

## Typography is the syntax

<figure>
<a href="https://softwarewrighter.github.io/X_eTaL/poster/"><img src="{{ '/assets/images/posts/xetal-syntax-poster.webp' | relative_url }}" class="no-invert" alt="The X_eTaL syntax poster: name decorations, importing a library, definitions, applying versus passing functions, axes, power, lambdas, system names, the question mark, ASCII input against rendered form, and trains"></a>
<figcaption style="font-size: 0.85em;">The syntax poster, generated from the language's own renderer so it cannot drift from it; <a href="https://softwarewrighter.github.io/X_eTaL/poster/">the web version</a> is live. Each panel is one decoration or rule and what it means, down to trains; one panel is what you type against what you see.</figcaption>
</figure>

APL's glyphs carry meaning in the shape of the symbol. X_eTaL moves that meaning into the *typography of the name* and keeps the keyboard ordinary. The raw-to-rendered table from the README is the language in miniature:

| You type | You see | It means |
|---|---|---|
| `r_ev` | r̲ev | reverse, a built-in function |
| `o_-_2` | o̲-₂ | rotate along axis 2 |
| `'+ r_/ A` | '+ r̲/ A | APL's `+/A`: pass `+` as a value, reduce with it |
| `u:s_quare` | ᵘs̲quare | a function you defined |
| `c:K_` | ᶜK̲ | K from the combinator library you imported as `c` |
| `_l`, `_r` | α, ω | the left and right arguments of a lambda |
| `x := 3` | x ← 3 | binding; `=` is always equality |
| `x^2` | x² | a power |

Three rules do most of the work. An underlined first letter makes a name a function, so the reader never wonders whether `rev` is data or an operation. A leading superscript is a namespace, so every imported name says where it came from, at the point of use. A trailing subscript on a function is its axis, visually attached to the thing it modifies. The decorations are not comments or hints; the parser reads them. And because the source is ASCII, every tool you already have works on it: git diffs it, grep finds it, and any editor edits it. The decorated form is a rendering, not a different program.

The capstone is Conway's Life, which in APL is a famous one-liner, and here is checked against sw-apl's APL\360 as the reference:

```text
ᵘl̲ife ← { ('+ r̲/₁₂ -1 0 1 o̲-₁₂ ⍵) { (⍺ = 3) + ⍵ × ⍺ = 4 } ⍵ }
```

Read right to left: rotate the board ⍵ by every offset in `-1 0 1` along both axes, sum the results along both axes, and a cell lives next when its neighborhood count is 3, or it is alive and the count is 4. `ᵘl̲ife² blinker` runs it twice; function power is a superscript too. Everything in that line was typed in ASCII --- `u:l_ife`, `r_/_12`, `_r` --- and rendered; the table above is the key.

## What it can do today

The pipeline is complete: lexer, parser, formatter, a Core intermediate form, Hindley-Milner type inference, and a strict evaluator. What sits on it, as of this writing:

- **Arrays.** Dense, 1-origin, with strings, scalar extension, and the structural built-ins --- reshape, catenate, take, drop, where, select, and the rest.
- **Higher-order built-ins.** Reduce, scan, each, table, inner product, compose, swap, and power, with axis subscripts on any function; replicate, encode and decode, catenate along any axis, and whole-array match.
- **Trains.** Forks, atops and hooks in square brackets, `[f̲ g̲ h̲] x` meaning `(f̲ x) g̲ (h̲ x)`, with the tacks, and errors that say what the train means at the point it fails.
- **Nested arrays.** String strands, enclose and disclose, partition and map, printed the way APL2's DISPLAY draws boxes. An empty array remembers the kind of its items, as APL2's prototype does, so `""` is an empty string and not an empty list of numbers.
- **Types.** Hindley-Milner inference over the whole program; the playground shows every expression's type below the code. Int and Float are distinct, ÷ always gives a Float, and `=` is exact while `e̲q~` is tolerant.
- **Functions.** Lambdas with `_l` and `_r`, named parameters, guards one per line, recursion, and *selective laziness*: a `~` parameter is not evaluated until used, which is what lets the Y combinator run.
- **Libraries.** `"c:" u̲se< "Combinators"` imports a library under a prefix you choose. Built-in: Stats, Combinators (Smullyan's birds), Maybe, TTTML and Turtle; user libraries go in a folder.
- **Macros.** A `.xtlm` file holds functions from source text to source text, run before compilation and type-checked after; `xetal expand` shows what each call became. The system macros are themselves written in X_eTaL: `i̲f<`, `u̲nless<`, `e̲ach<`, and a set modeled on Rust's standard ones, `f̲ormat<`, `d̲bg<`, `a̲ssert<`, `p̲anic<`, `i̲nclude<`, `c̲fg<`, `l̲ine<`, `f̲ile<`. Expansion is hygienic.
- **Errors of your own.** `"code" ⎕S̲IGNAL "message"` raises a typed error, and `default ⎕W̲ARN "code" "message"` raises one a handler may resume from. `t̲ry<`, `c̲atch<` and `f̲inally<` give the familiar syntax, as system macros over typed built-ins, and a handler answers with one of four outcomes: `r̲ecover<` with a value of the body's type, `r̲etry<` the body, `h̲alt<` and pass the error on, or `c̲ontinue<` from the point of failure with the warning's value. `"1 d_iv 0" t̲ry< "@ r_ecover< \"-1\""` is −1; `xetal expand` shows it becomes `'{ @ → 1 d̲iv 0 } ⎕T̲RAP '{ e → ⎕R̲ECOVER (−1) }`.
- **Docs and tests in the language.** `##` doc comments, examples under them run as doc tests, `@test` unit tests, and `xetal doc`, which builds a searchable reference site: search by name, or by type the way Hoogle does, so `Num a => a -> a -> a` finds `+`.
- **Pictures.** `⎕G̲RID` and `⎕P̲ATH` produce SVG, animated by frames, shown with `⎕S̲HOW`. Big grids become PNG frames; there is a Mandelbrot zoom.
- **Files, keyboard, numbers, trigonometry.** Enough I/O to write real programs.
- **Tooling.** A command-line `xetal` with lex, render, parse, fmt, core, type, eval and run; a terminal editor with the ASCII pane next to the decorated pane; a REPL that decorates each line as you type; notebook runs; `xetal diagram`, which draws annotated SVGs of a program; LaTeX output checked by KaTeX; an Emacs mode and an Org Babel backend; and the WASM playground on GitHub Pages.

And a library, which is where the namespace decoration earns its keep --- the raised ˡ marks what the library exports, and a bare name stays private:

```text
ˡm̲ean ← { (f̲loat '+ r̲/ ⍵) ÷ f̲loat t̲ally ⍵ }  ⍝ Int or Float numbers
s̲quare ← { ⍵ × ⍵ }                  ⍝ private: not visible outside
d̲eviations ← { v → (f̲loat v) − ˡm̲ean v }
ˡv̲ariance ← { v → ˡm̲ean s̲quare d̲eviations v }
ˡs̲d ← { (ˡv̲ariance ⍵) ^ 0.5 }     ⍝ the standard deviation
```

<div class="clearfix" markdown="1">

## What sets it apart

Against **general-purpose languages**:

- **Macros written in the language.** Source in, source out, before compilation; type-checked after; hygienic; shown by `xetal expand`. The system macros that most languages build into the compiler --- formatted strings, a debug print, assertions, file inclusion, conditional compilation --- are ordinary X_eTaL in a library.
- **Errors with more outcomes than a catch block.** `t̲ry<`, `c̲atch<` and `f̲inally<` look familiar, but the handler can recover with a typed value, retry the body, pass the error on, or continue the program from where it failed. Retry and continue come from APL2's and Dyalog's traps and are rare in mainstream languages; with the outcome type-checked against the body, rarer still. And the syntax is a library of macros: the semantics live in typed built-ins.
- **Native code behind typed facades.** Extensions are Rust shared libraries that export a C-ABI descriptor; a facade gives each function an X_eTaL name and type, so a call never shows the plumbing. A planned post in this series covers them.
- **Docs, doc tests and unit tests built in,** with a reference site you can search by type.
- **Effects in the name.** A trailing `!` marks mutation or an effect, `?` a predicate, `<` a macro; the lexer enforces it.

Against **APL, J, K, BQN and Dyalog**:

- **Typography instead of glyphs,** read by the parser: an underline makes a function, a raised letter its library, a lowered digit its axis.
- **Static Hindley-Milner types,** with array types that ignore rank as APL does --- a type names only the element type --- a real Bool, and exact `=` beside tolerant `e̲q~`. Every classic APL is dynamic; typed array languages such as Dex and Futhark do not use APL notation.
- **Ambiguity is an error,** and each meaning has one spelling. The parser never picks a reading from context.
- **Lazy parameters on a strict default,** which the next section puts to work.

</div>

<div class="clearfix" markdown="1">

## Recursion, six ways

The clearest way to see what these features buy is to write one function --- factorial --- every way the language allows, and run each. All six below were run through `xetal`; the results are what it printed.

**1. Named recursion: 3628800.** A definition can call its own name. Simplest and cheapest.

```text
ᵘf̲act ← { n → n ≤ 1 ? 1◆ n × ᵘf̲act n − 1 }
```

**2. The Y combinator, self strict: `error[stack-overflow]`.** The library's Y is `Y f = f (Y f)`. A strict language evaluates `Y f` before calling `f`, so it unfolds forever. It type-checks, and fails when it runs.

```text
ᵘf̲act ← { s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }
'ᵘf̲act ᶜY̲ 10
```

**3. Y, self lazy: 3628800.** One character, `~`, makes the self parameter lazy, so `Y f` unfolds only when it is used. Each recursive call forces a deferred value.

```text
ᵘf̲act ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }
'ᵘf̲act ᶜY̲ 10
```

**4. Y, with no name at all: 3628800.** An anonymous lambda recurses without ever being named: the quote passes the lambda as a value, and Y supplies the recursion.

```text
'{ ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 } ᶜY̲ 10
```

**5. The textbook Y: `error[infinite-type]`, or 3628800 with `--untyped`.** The type checker refuses self-application, `x x`, as Haskell's and OCaml's do. `--untyped` is the escape hatch that lets the classic version run.

```text
ᵘY̲ ← { f̲ → { x̲ → f̲ x̲ 'x̲ } '{ x̲ → f̲ x̲ 'x̲ } }
```

**6. Named self, by a macro: 3628800.** The macro writes the name in place of the self parameter. `xetal expand` shows that the compiler sees plain named recursion, version 1, with no laziness and no combinator left to run.

```text
"u:f_act" ᶜY̲< "{ ~s_elf n -> n <= 1 ? 1; n * s_elf n - 1 }"
⍝ xetal expand:  u:f_act := { n -> n <= 1 ? 1; n * u:f_act n - 1 }
```

Read down the list and each language feature changes what the same idea does. Strict evaluation is why the naive Y overflows; one character, `~`, fixes it; quoting lambdas allows recursion with no name; static types refuse the self-application that Lisp or JavaScript would accept; and a macro erases the whole apparatus at compile time and leaves the cheapest version behind. The comparisons outside the family are instructive too: Dyalog APL's dfns have `∇`, built-in recursion with no name, where X_eTaL gets there through Y and a lazy parameter; Lisp would do the macro version on a syntax tree, where X_eTaL does it on text and type-checks the output; and Rust or Haskell need a wrapper type before the textbook Y will compile at all.

</div>

<div class="clearfix" markdown="1">

## The programs inside the repo

**The origin demos**, `demos/` in the language repo: the programs the language was specified against, one per idea. `tour.xtl` touches every implemented feature with its output beside each line; `life.xtl` is the capstone; `factorial`, `square`, `rotate`, `arrays`, `higher-order`, `fixed-point`, `combinators` and `monads` each prove one feature; `stats.xtl` and `hello-library.xtl` exercise libraries; `keys.xtl` the keyboard; and the three `tttml` files are the tic-tac-toe learner, its training and a game against it.

**The classics**, `demos/classics/`: twenty programs an APL programmer may have seen, each as a literate document --- the sieve, GCD, Fibonacci, Collatz, Hanoi, quicksort and the sorting family, Pascal's triangle, run-length encoding, histogram, shortest path, matrix multiply, a cellular automaton, Mandelbrot, turtle graphics, and Life drawn as pictures. They are the proof that the surface is enough. The sieve, verbatim:

```text
ᵘs̲ieve ← { v →
  0 = t̲ally v ? v
  p ← f̲irst v
  (p × p) > 'm̲ax r̲/ v ? v
  rest ← 1 d̲rop v
  p c̲at ᵘs̲ieve (w̲here 0 ≠ rest m̲od p) s̲elect rest
}
ᵘs̲ieve 1 d̲rop r̲ange 100
```

</div>

## Where the language is going

The README calls it early and specified by its test suite as it is built, and the plan is public, down to a launch checklist. Done since this series was first drafted: the slowdown in table and inner product that came with steppable higher-order operations is closed --- one benchmark went from 8.3 seconds to 0.81 --- and a gate now fails any build that gets more than 15 percent slower; the macros are on the main branch; error handling is complete, from `⎕S̲IGNAL` to `t̲ry<` and all four outcomes; and the documentation site is published. Newer still are the pieces for interactive and graphical programs: events from the host, tables read from TOML files, and libraries for SVG pictures and 3D geometry. Their first user is a [Rosetta stone](https://softwarewrighter.github.io/X_eTaL/rosetta/) page that shows one idiom in six array languages, BQN, GNU APL, J, ngn/k, Uiua and X_eTaL, on a stone that rolls through 22 idioms, drawn entirely by an X_eTaL program. Treat its idioms as a first draft: a separate project, [compare-idioms](https://github.com/softwarewrighter/compare-idioms), is running the classic idiom collections in each language's own interpreter to check which really carry over, and that checking has not yet fed back into the stone. The repositories are all tagged at v0.1.0, and the launch release is planned as v0.2.0.

Still ahead before the launch: finishing the browser terminal, whose pane and screen control work but which the games and demos have yet to adopt; a front-door page for the whole family of repositories; readable type errors; a short course; and the web release. Deferred until after the launch, on purpose: algebraic data types, complex numbers, Unicode as source, a package manager, and the native hook that will let extensions run without a bridge.

## Try it

Nothing to install: [the playground](https://softwarewrighter.github.io/X_eTaL/) opens on the tour, one commented file touching every feature, decorated beside its ASCII with the types underneath. Locally it needs Rust and `just`:

```text
just tour
just eval "'+ r_/_2 2 3 r_eshape r_ange 6"    # '+ r̲/₂ 2 3 r̲eshape r̲ange 6  gives  6 15
just life
just repl
just edit demos/life.xtl
```

A `.xtl` file with a `#!/usr/bin/env xetal` line runs on its own. The recommended font is JuliaMono, free, with every character the decorated form uses at consistent heights. The README checks the alternatives: DejaVu Sans Mono also has them all; Menlo has all but the lamp; JetBrains Mono and BQN386 have most but lack the small raised letters and the combining underline; and Monaco breaks six of them, so avoid it. And the name: the logo is itself valid source, `X_ e:T a:L` --- an underlined function X, and two namespace prefixes drawn raised.

## Next in the series

The demos repo, programs worth watching; the libraries, where the E in the name gets its first two meanings; the native extensions, where it gets its third; the machine-learning work the whole thing is for; and the games, where state and input get their turn.
