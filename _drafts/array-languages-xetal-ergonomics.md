---
layout: post
title: "Array Languages #18: Small Comforts, X_eTaL's Ergonomics"
categories: [languages, language-design]
tags: [array-languages, xetal, x-etal, apl, ergonomics, lambda, dfn, effects, tolerant-equality, formatter, notebook, doc-tests, alpha, omega, lazy-evaluation, call-by-need, unit, tuples, pattern-matching, lint, language-design]
keywords: "X_eTaL ergonomics, X_eTaL lambda, effect marker, missing-bang lint, tolerant equality, canonical form, xetal fmt, notebook mode, APL2 DISPLAY boxed arrays, doc tests, rustdoc examples, APL dfn alpha omega, shorthand lambda arguments, named parameters, unused parameter, lazy parameter, call by need, niladic function, unit, tuple pattern, wildcard, unused-binding lint"
abstract: "Eighteenth in the Array Languages series: the small things that make X_eTaL comfortable to write, read and trust. Every way a lambda can take its arguments, from ⍺ and ⍵ to the newest, ▁, for an argument a function takes and never uses; effects marked with ! and a lint that renames for you; exact equality with a tolerant one beside it; the canonical form, notebook runs and boxed arrays for seeing what a line means; and documentation examples that run as tests."
series: "Array Languages"
series_part: 18
date: 2026-10-26 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (2026-10-20), refocused on ergonomics (Mike): lambda arguments, ! effects, = and e_q~, fmt/--echo/--box, doc tests.
     Every example except the _u ones run on a clean build of X_eTaL main 0b427a30 and drawn with xetal render.
     _u: X_eTaL 7d811a01 (step 157, L8, D182), CONFIRMED 2026-10-21 on a clean build of 2bdc6a57: every _u row run (42, 6, 10,
     0, 7 with no division; both refusals with the text in the table), linted clean, drawn ▁; the unused-binding warning now
     suggests _u; the tour's k_eep is { a ~_u -> a } and Combinators' K is { x _u -> x } (both from step 157's audit).
     (Earlier: _u was being built and was UNCOMMITTED when this was first written.)
     Publishing: Mike, 2026-10-26: publish today.
     Sources: lang-choices L1-L8, E1, E2, E4, TU3, TU4; design D140 (unused-binding, now superseded by L8); history.md (alpha/omega).
     The _u idea came from Mike's side question on 2026-10-20 (u:n_ope's unused parameter). Follows #17, the philosophy companion to #16 (renumbered 2026-10-22); links only to
     published posts. Lead image: Mike's block-ergo-chair.jpg (2026-10-20), dark, not inverted. -->

<img src="{{ '/assets/images/posts/block-ergo-chair.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

A language is learned through its big ideas and lived in through its small ones. This post is about the small ones in X_eTaL: how a lambda takes its arguments, including a new way to say that it ignores one; how a function that prints says so in its name; how two numbers are compared; how to see what a line of right-to-left code really means; and how an example in a comment becomes a test. The newest came from a side question this week.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The decisions** | [lang-choices.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md): L1 to L8 (lambdas), E1 and E2 (laziness), TU3 and TU4 (patterns), T3 (equality) |
| **The lints** | [docs/lint.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lint.md): `unused-binding`, `missing-bang`, `needless-bang` |
| **The tools** | the [README](https://github.com/softwarewrighter/X_eTaL#readme): `xetal fmt`, `xetal run --echo` and `--box`, `xetal doc --test` |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A lambda's arguments

### Two ways to write a lambda

A lambda either uses the shorthand arguments or names its parameters, never both in one lambda (L5). The shorthand is typed `_l` and `_r` and drawn ⍺ and ⍵; how many of them the body uses decides how many arguments the lambda takes:

```xetal
ᵘf̲n ← { ⍵ × 2 }
ᵘf̲n 5
```

```text
10
```

```xetal
ᵘf̲n ← { ⍺ − ⍵ }
3 ᵘf̲n 5
```

```text
-2
```

Named parameters are listed before an arrow, and are drawn as written: `{ x → x × 2 }` and `{ x y → x − y }` are the same two functions. They desugar to nested one-argument lambdas (L4), so a two-argument function is curried.

### ⍺ and ⍵

The shorthand arguments were first drawn as small subscript l and r. They lasted a day: in my terminal's font a subscript l was unreadable, and on the second day they became APL's alpha and omega, which every APL reader already knows as a dfn's left and right argument.

One rule keeps the shorthand honest (L1): `_r` alone makes a one-argument lambda, and `_l` exists only beside `_r`. A left argument with no right one is not a function X_eTaL can call, so the lambda is refused, with the fix:

```xetal
ᵘf̲n ← { ⍺ × 2 }
```

```xetal
error[bad-lambda]: a lambda using _l must also use _r; otherwise name the parameters
```

### Nothing: @

A function of no arguments takes `@`, the unit value, and is called with it (L6):

```xetal
ᵘf̲n ← { @ → 42 }
ᵘf̲n @
```

```text
42
```

It takes only `@`. Called with a number, it is a type error before the program runs, `expected Unit, found a number`. A lambda with no arguments at all, `{ 42 }`, is refused: a lambda needs ⍵, ⍺ and ⍵, named parameters, or `@ →`.

### Ignored: ▁

The newest case came from a side question. A function had to accept an argument and had no use for it:

```xetal
ᵘn̲ope ← { na → 42 }
```

It runs, and `xetal lint` warns, correctly as far as it could tell, that the parameter is never used. Until this week the only way to say "unused on purpose" was a directive, `# lint: allow unused-binding`, at the end of the line or on the line before. That was a deliberate choice, made when the lint was (D140): no spelling of a name would opt out. It was wordy for a common case, and it said "the warning is wrong here" rather than "there is nothing here to use".

So X_eTaL now has a third shorthand name, `_u`, for a parameter that is taken and dropped (L8, [7d811a0](https://github.com/softwarewrighter/X_eTaL/commit/7d811a01)). It stands only in a parameter list, may repeat, and is never read: using it in the body is an error that says to name it. The linter never flags it, so no directive is needed, and the warning for an ordinary unused name now says what to write instead:

```xetal
warning[unused-binding]: parameter `na` is never used; write `_u` for a parameter nothing reads at nope.xtl:1:14
```

 It is drawn as a heavy low line, ▁, a thicker underscore, so that it reads as an empty slot:

```xetal
ᵘf̲n ← { ▁ → 42 }
ᵘf̲n 5
```

```text
42
```

Why not `_`, which already means "discard"? Because it already has its job: `_ := expr` keeps a value only for its effect, and `(a, _)` skips a part of a pair (TU4). Keeping `_` to values and `_u` to parameters means each spelling has one meaning.

`_u` also fills the gap that L1 leaves. A two-argument function that ignores its right argument has no shorthand, since `{ ⍺ × 2 }` is refused, but it has a short named form that says what it drops:

```xetal
ᵘf̲n ← { x ▁ → x × 2 }
3 ᵘf̲n 5
```

```text
6
```

That is the Kestrel, the bird that keeps its first argument, and X_eTaL's own Combinators library now writes it this way:

```xetal
ˡK̲ ← { x ▁ → x }
```

### Lazy: ~

Arguments are evaluated before the function runs, right to left (E4), unless a parameter is marked lazy with `~`: then its argument is evaluated where the body first reads it, and never if the body does not (E1). The [Sage bird](/2026/09/21/rabbit-hole-sage-y-combinator/) needs it, since a strict fixed point would recurse forever; here it makes the factorial out of a lambda that receives itself:

```xetal
"c:" u̲se< "Combinators"
ᵘf̲n ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }
'ᵘf̲n ᶜY̲ 5
```

```text
120
```

Laziness also protects a function from an argument it does not need, and with `▁` the two combine. The tour's `ᵘk̲eep` returns its left argument and drops its right. Dropped but not lazy, the caller's `1 ÷ 0` is still computed first, and stops the program:

```xetal
ᵘk̲eep ← { a ▁ → a }
7 ᵘk̲eep 1 ÷ 0
```

```xetal
error[division-by-zero]: division by zero
```

Dropped and lazy, as the tour writes it, the argument is never computed at all:

```xetal
ᵘk̲eep ← { a ~▁ → a }
7 ᵘk̲eep 1 ÷ 0
```

```text
7
```

`{ a ~▁ → a }` says three things at once: the right argument is taken, it is dropped, and it is never even computed. Before `_u`, the tour wrote `{ a ~b → a }` with a lint directive above it.

### Patterns

A parameter can also be a tuple pattern, which takes a pair apart as it arrives (TU3), and `_` skips a part:

```xetal
ᵘf̲n ← { (a, b) → a + b }
ᵘf̲n (3, 4)
```

```text
7
```

`{ (a, _) → a }` gives 3 for the same call.

### Every shape

| Shape | Definition | Call | Result |
|---|---|---|---|
| no argument | `ᵘf̲n ← { @ → 42 }` | `ᵘf̲n @` | 42 |
| one, used (shorthand) | `ᵘf̲n ← { ⍵ × 2 }` | `ᵘf̲n 5` | 10 |
| one, used (named) | `ᵘf̲n ← { x → x × 2 }` | `ᵘf̲n 5` | 10 |
| one, ignored | `ᵘf̲n ← { ▁ → 42 }` | `ᵘf̲n 5` | 42 |
| two, used (shorthand) | `ᵘf̲n ← { ⍺ − ⍵ }` | `3 ᵘf̲n 5` | -2 |
| two, used (named) | `ᵘf̲n ← { x y → x − y }` | `3 ᵘf̲n 5` | -2 |
| two, right ignored | `ᵘf̲n ← { x ▁ → x × 2 }` | `3 ᵘf̲n 5` | 6 |
| two, left ignored | `ᵘf̲n ← { ▁ y → y × 2 }` | `3 ᵘf̲n 5` | 10 |
| two, both ignored | `ᵘf̲n ← { ▁ ▁ → 0 }` | `3 ᵘf̲n 5` | 0 |
| ignored, never computed | `ᵘf̲n ← { a ~▁ → a }` | `7 ᵘf̲n 1 ÷ 0` | 7 |
| lazy, used | `ᵘf̲n ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }` | `'ᵘf̲n ᶜY̲ 5` | 120 |
| unit among named | `ᵘf̲n ← { @ x → x × 2 }` | `@ ᵘf̲n 5` | 10 |
| tuple pattern | `ᵘf̲n ← { (a, b) → a + b }` | `ᵘf̲n (3, 4)` | 7 |
| pattern part skipped | `ᵘf̲n ← { (a, _) → a }` | `ᵘf̲n (3, 4)` | 3 |

And the spellings that are refused, each with the way out:

| Definition | Error |
|---|---|
| `ᵘf̲n ← { ⍺ × 2 }` | `bad-lambda`: a lambda using _l must also use _r; otherwise name the parameters |
| `ᵘf̲n ← { 42 }` | `bad-lambda`: a lambda needs _r, _l and _r, named parameters, or `@ ->` |
| `ᵘf̲n ← { x → x + ⍵ }` | `bad-lambda`: do not mix named parameters with _l / _r |
| `ᵘf̲n ← { ▁ + ⍵ }` | `bad-lambda-arg`: `_u` marks a parameter the lambda never uses (`{ x _u -> x }`); name it to use it, and write `_r` or `_l` in a shorthand lambda |
| `ᵘf̲n ← { x ▁ → ▁ }` | `bad-lambda-arg`: the same |

## Effects are marked: !

A function that prints, reads, draws or changes something has a `!` at the end of its name, `p̲rint!` and `r̲oll!` among the built-ins, so a reader can tell from a call alone whether it does anything besides return a value. The linter holds programs to it. A function that calls an effect without saying so:

```xetal
ᵘs̲ay ← { x → p̲rint! x }
_ ← ᵘs̲ay "hello"
```

```xetal
warning[missing-bang]: function `u:s_ay` calls `p_rint!`, an effect, but its name has no `!`: write `u:s_ay!` at bang.xtl:1:1
```

`xetal lint --fix` renames it, at its definition and at every use in the file, in one edit:

```xetal
ᵘs̲ay! ← { x → p̲rint! x }
_ ← ᵘs̲ay! "hello"
```

The opposite slip, a `!` on a function that does nothing but compute, is `needless-bang`. It is in the pedantic group, allowed by default, and reported with `-W pedantic`.

## Exact, and tolerant beside it

`=` is exact (T3). It is IEEE equality and nothing else, so it is transitive, and it says what floating point does:

```xetal
(0.1 + 0.2) = 0.3
(0.1 + 0.2) e̲q~ 0.3
0.1 + 0.2
```

```text
0
1
0.30000000000000004
```

APL compares within a tolerance set by a system variable, and every comparison in a program depends on its current value. X_eTaL keeps the exact comparison as the default and puts the tolerant one beside it as a function of its own, `e̲q~`, with a fixed relative tolerance of about 1e-14. Which comparison is meant is written at the comparison, and nothing elsewhere can change it.

## Seeing what a line means

Right-to-left reading with no precedence is simple to state and easy to misread at first. Three tools show what a line means. `xetal fmt` prints its canonical form, every application in parentheses:

```xetal
'+ r̲/ 1 + 2 3 × 4
m ← 2 3 r̲eshape r̲ange 6
'+ r̲/₁ m
```

```xetal
('+ r_/ (1 + (2 3 * 4)))
m := (2 3 r_eshape (r_ange 6))
('+ r_/_1 m)
```

The first line is 22: `2 3 × 4` is `8 12`, plus 1 is `9 13`, and the sum of those is 22. `xetal run --echo` runs a file as a notebook, each statement drawn and followed by what it printed, the way an APL session shows input indented above its output:

```xetal
      m ← 2 3 r̲eshape r̲ange 6
      m
1 2 3
4 5 6
      '+ r̲/₁ m
5 7 9
```

And `--box` draws every array the way APL2's `DISPLAY` does, with its shape on the frame: `→` along a row, `↓` down the rows, `~` for numbers:

```text
┌→────┐
↓1 2 3│
│4 5 6│
└~────┘
┌→────┐
│5 7 9│
└~────┘
```

## Examples that are tests

A `##` comment above a definition documents it, and `xetal doc` builds a cross-referenced site from those comments, as rustdoc does for a crate. Inside one, `>>` marks an example and the lines after it are what it prints:

```xetal
⍝│ m_ean v: the arithmetic mean of v.
⍝│ >> "a:" u_se< "Avg"
⍝│ >> a:m_ean 1 2 3 4
⍝│ 2.5
ˡm̲ean ← { v → ('+ r̲/ v) ÷ f̲loat t̲ally v }
```

`xetal doc --test` runs every example and compares:

```xetal
doc tests in Avg.xtl: 2 examples
l:m_ean >> "a:" u_se< "Avg" ... ok
l:m_ean >> a:m_ean 1 2 3 4 ... ok
doc test result: ok. 2 passed; 0 failed
```

An example whose output no longer matches fails, with both versions shown, so documentation cannot drift from the code it describes:

```xetal
---- l:m_ean >> a:m_ean 1 2 3 4
--- expected
2.4
--- actual
2.5
doc test result: FAILED. 1 passed; 1 failed
error[doc-test-failed]: 1 doc example(s) failed in bad/Avg.xtl
```

The standard libraries are documented this way: fifteen of the Combinators library's birds carry an example, and each one is a doc test.
