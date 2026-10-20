---
layout: post
title: "Array Languages #14: Types, Lints and Errors in X_eTaL"
categories: [languages, language-design, tools]
tags: [array-languages, xetal, x-etal, apl, types, type-inference, lint, errors, macros, ergonomics]
keywords: "X_eTaL type checking, array language type inference, xetal lint, compile-time errors versus run-time errors, silent wrong answers, macro errors, shape checks, error messages, ergonomics"
abstract: "Fourteenth in the Array Languages series: how X_eTaL tries to turn mistakes into errors as early as possible. A type error before the program runs is good, a run-time error is worse, and a silent wrong answer is the worst, and writing the equations post turned up three of those in a day-old macro library. This post follows the ladder rung by rung, with a real example of each, and ends with what changed so that class of mistake cannot come back."
series: "Array Languages"
series_part: 14
date: 2026-10-20 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
---

<!-- DRAFT (written 2026-10-17 afternoon). Every output below was run that day: X_eTaL e436d6ce (target/release/xetal) for run,
     type, lint, lint --fix, lint --list, lint --explain; X_eTaL-libraries' pinned xetal 823adbd3 for Equations (8a6e796/92050c8,
     19 reject tests) and Parsing (239dc1b); X_eTaL-ML b8a6ac3b for Pipeline (step 022, 14 reject tests, UNCOMMITTED at the
     time: RECHECK). Error locations trimmed where the run printed a scratch path.
     Sources: X_eTaL docs/lint.md (11 lints, 5 groups), docs/type-check-macros.md (approaches 8-11), the blog's
     tmp/equations-findings-2026-10-17.md. UPDATED 2026-10-17 evening on X_eTaL main (clean export at eb82c117, built): the type error
     now has file:line, source, both operands and a help line (shown); 29 lints in 6 groups (docs/lint.md at 6c0bf1c9); macro contracts
     MC31/D163 (57cff932): unused-argument shown with a toy Sq.xtlm in the scratchpad. RECHECK all outputs before publishing.
     PLANNED UPDATE (2026-10-18, Mike: describe how the linter will look into code strings; X_eTaL step 112 still landing, an hour
     or two out; write from what is committed then, run every example on a clean build):
     - New section after "Macros check their own text": "Looking inside a string". Today a macro's argument is one Char vector to
       every tool, so a mistake in X_eTaL written inside a string surfaces only after expansion, placed back by the expander's byte map.
       A code string, c"...", declares its inside is X_eTaL (ST5, step 111, landed: rendered as code; |> drawn ▷, $ labels drawn ▹).
       Step 112: the inside lexed, parsed, linted and type-checked with the file, before any macro runs, errors at their place inside
       the string. Show one real lint inside a c"..." (e.g. redundant-lambda or unused-binding in a stage) and one type error inside
       a stage (an unknown name, a Char where a number is needed), each with its located message.
     - The type check is partial, by design: a stage is checked as a lambda over the names the macro binds (## binds: it), so what
       holds for every it; the join between stages is still checked on the expansion, or earlier by the shape lint. Say so.
     - 2026-10-18 evening: step 112 MERGED (X_eTaL #146, D176). As built: every code string LEXED with the file; parsed, linted and
       code-checked (partial type check) only where the macro takes code (## takes: code); a code string on a text/notation side
       (a pipeline) is lexed only. Write the section from docs/code-strings.md "As built (D176)" and runs on a clean build.
     - 2026-10-19: 31 lints in 6 groups on main (docs/lint.md). Two for code strings: string-kind (style, warn: a plain or raw string on a
       ## takes: @ code side, or c"..." on a text side; fix: add or drop the c) and code-check (correctness, DENY: the inside of a code
       string on a code side, checked before expansion as the body of a lambda over its names). Found probing integrals: a c"..." given
       to Equations (a text side) fails in the LEXER ("bad-number: a . must be followed by digits", from 0..1) before string-kind can
       suggest dropping the c: raise with the X_eTaL agent; show the fixed message if it lands. Type errors from notation macros
       underline the whole call, not the term inside the string (Int array x Float integral): also for "What is still rough".
     - string-kind lint + ## takes: code (MC31 extended): code passed as a plain string, or a code string passed to a notation
       (an equation), is flagged with its fix (add or drop the c). Show it.
     - Equations stay plain strings: their strings are notation (## takes: text notation, ## draws: e:t_ex<, MC32, step 154), drawn
       as math, guarded by the Parsing whole-text check: the ladder has a rung for each kind of string.
     - Update the ladder table: a row "inside a code string, before the macro runs: the linter and type checker".
     - Keep the "after expansion" behavior as the "before", like the type-error message.
     The parsing library is #15 (10/21): refer to it as "a planned post", no link, until #15 is published.
     Mike's framing (2026-10-17): "type errors good; runtime errors bad; blog posts should be correct (unless we are blogging
     about error handling".
     Lead image: Mike's block-checking.jpg (2026-10-17), background as is, not inverted. -->

<img src="{{ '/assets/images/posts/block-checking.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

A mistake in a program can surface at four times: when the program is checked, before it runs; when a lint reads it; when it runs; or never, as an answer that is quietly wrong. X_eTaL is designed to push every mistake as early on that list as it can. This post climbs that ladder one rung at a time, with a real example of each, and then tells what happened when a new library slipped to the bottom rung.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The language** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL) · [its lints](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lint.md) |
| **The libraries** | [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) |
| **The thread** | [#11: equations](/2026/10/17/array-languages-xetal-equations/) · [#12: pipelines](/2026/10/18/array-languages-xetal-pipelines/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>


## The ladder

| When | What catches it | Example below |
|---|---|---|
| before the program runs | the type checker | a whole number divided by a decimal |
| before the program runs | a macro checking its own text | an equation or a pipeline written wrong |
| when asked | the linter | a lambda that only passes its argument on |
| while the program runs | a check written into the code | an index outside its array, a broken shape promise |
| never | nothing | three equations that summed the wrong thing |

The higher a mistake is caught, the cheaper it is: an error before the program runs costs a moment, an error while it runs may throw away work already done, and a wrong answer costs whatever was built on it.

## Types first

X_eTaL infers the type of every name before a program runs, and refuses a program whose types do not fit. Ask it what it inferred:

```text
$ xetal type mean.xtl
u:m_ean : Float -> Float
```

Here is a program with a mistake in its last line: a 2 by 2 array of whole numbers divided by a decimal.

```text
a ← 2 2 r̲eshape 1 2 3 4
s ← 2.0
p̲rint! 100
a ÷ s
```

```text
$ xetal run type.xtl
error[type-mismatch]: expected Int, found Float
 --> type.xtl:4:1
  |
4 | a / s
  | ^^^^^
  | - `a` is an Int
  |     - `s` is a Float
  |
1 | a := 2 2 r_eshape 1 2 3 4
  |      -------------------- `a` gets its type here
  |
2 | s := 2.0
  |      --- `s` gets its type here
  = note: `/` has type Num a => a -> a -> Float
  = help: Int and Float do not mix: `f_loat n` makes a Float of an Int, `f_loor x` or `c_eiling x` an Int of a Float
```

The `100` on the line before is never printed: the program is refused before it starts. That is the rung a mistake should land on. And the message does the rest of the work: where, which name is which type, where each got its type, and how to convert. That message is new this week. Until a few days ago the same mistake was reported as `expected Int, found Float at 47..52`, a range of bytes, with no line, no source and no hint; writing this post found it, and it was rewritten. Writing `a ÷ 2.0` works, because a number written in the program takes whichever type it is needed as; a name already bound as a whole number does not change type, so `(f̲loat a) ÷ s` is how to say it.

## Macros check their own text

A macro that reads a notation checks it when the program is compiled, and refuses a call it cannot read, at the call:

```text
"Y[o,h,w] | O Ho Wo" ᵉe̲q< "sum c:=0..C - 1, sum h:=0..1 | X[c,h,w]"
error[bad-equation]: an index is bound once: c, h, o, h, w
```

```text
@ ᵖⁱᵖᵉp̲ipe< "x |> 3"
error[bad-pipeline]: a stage is a function (nn:r_elu, [f_ g_], '{ x -> ... }) or an expression naming the previous value it (or a name bound before it): 3
```

The equation library has nineteen tests of such refusals, the pipeline library fourteen. They are the type checker's rung for the notations the type checker cannot see inside, because to the language a notation is just a string.

## Lints

`xetal lint` reads a program for things that are legal but probably not meant. It has thirty-one lints in six groups, from `correctness` and `suspicious` to `pedantic`, each with a default level, and each one explains itself with `xetal lint --explain`. Two of them:

```text
u:n̲egAll ← { v → '{ x → n̲eg x } m̲ap v }
warning[redundant-lambda]: this lambda only passes its arguments to `n_eg`: write `'n_eg` at lint.xtl:1:22
```

```text
u:c̲lip ← { v → (t̲ally v) ? v; 0 r̲eshape 0 }
warning[int-condition]: this guard's condition is an Int, which fails at run time unless it is 1 or 0: write the comparison meant, as `0 < n` or `0 != n` at ic.xtl:1:20
```

The second is a lint about the next rung down: a guard on a count works while the count is 0 or 1, and stops the program the first time it is 2. Where a fix is certain, `xetal lint --fix` makes it, and it refuses to touch a file git could not restore:

```text
$ xetal lint --fix fixme.xtl
fixed 1 finding(s) in fixme.xtl
u:n̲egAll ← { v → 'n̲eg m̲ap v }
```

The libraries are kept lint clean, and findings can also be written as JSON, one per line, so an editor can show where they are.

## Checked while running

Some mistakes only the data can show. Then the check is written into the code, and it stops the program with everything needed to find the cause, never a silent wrong read. The equation macro checks every subscript it reads:

```text
error[index]: X axis 1: index 2 is outside 0..1 (from c)
error[rank]: X[c,h+r] indexes 2 axes, but X has rank 3
```

And a pipeline stage that promises a shape is checked against it:

```text
@ ᵖⁱᵖᵉp̲ipe< "x |> 2 × it : y [n] |> y + 1"
error[shape]: stage 2 (y): shape 4, expected 3
```

These are better than wrong answers and worse than errors before running. Where the extents are known before the program runs, as they are in every one of these examples, a shape check planned in X_eTaL could move them up a rung.

## A silent wrong answer

Writing the equations post meant trying equations the library had not been tested on. With `y` of `1 2 3 4` and `p` of `1.5 2 2 4`, three gave wrong answers with no error anywhere:

| Summand | Gave | Should have |
|---|---|---|
| `(y[i] - p[i])^2` | 0.5, the sum of `y − p` | given 1.25 |
| `y[i]2` | 10 | been refused |
| `y[i] % 2` | 10, the `% 2` gone | been refused |

Worse, the LaTeX the same call returned showed the square, so the printed math and the computed value disagreed, which is the one thing the library promised could not happen.

The cause was in the macro's reader, the code that takes its string apart. A term starting with a parenthesis was read by dropping its first and last characters, without checking that the last one was the closing parenthesis, so `(y[i] - p[i])^2` lost its `2`. A reference like `y[i]` was read from the first `[` to the last `]`, without checking that the `]` ended the term, so whatever followed it vanished. Nothing checked that every character had been used.

It was fixed the same morning, in three layers. Every rule of the reader now uses all of its text or refuses the call. Only the notation's own characters may appear, so `%` is refused by name. And every call is now read three ways from one grammar, as the value, as the LaTeX and as a plain reprint, and the reprint is compared with what was written: a rule that dropped a character, any rule, now makes the call fail when the program is compiled. A differential test now also generates random equations and checks each against the same computation written by hand.

## What changes so it cannot happen again

The fix covered one library. The class of bug, a reader that uses part of its text and drops the rest, can happen in any macro that reads a notation, and more of them are coming. Three changes go further, from narrow to broad:

- **The pipeline macro was written to the rule from the start,** with a test for each kind of text it refuses, the equation library's three cases among them, and a macro, `ᵖⁱᵖᵉt̲ext<`, that writes back what it read.
- **A parsing library for macro writers,** whose every piece uses all of its text or refuses, with the reprint check built in, so a new macro does not have to learn this lesson again. It has been written, and it is the subject of a planned post.
- **A check in the language itself,** now built. A macro declares a contract in its documentation, how it is called and whether it copies its text into its expansion or parses it. For a macro that copies, the default, the macro runner checks that every name and number of the call's text reaches the expansion, and refuses the call otherwise. A toy macro that forgets the power:

```text
@ q:s̲quare< "3 ^ 2"
error[unused-argument]: q:s_quare< did not use 2 of the text on its right; a macro that copies its text writes every name and number of it (## uses: copied)
```

A macro that parses a notation, such as the equation and pipeline macros, says `## uses: parsed`, and for those the reprint check is the guard. Either way, the mistake that started this lands on the top rung.

## What is still rough

The ladder is right; the rungs are being made comfortable one message at a time, as the type error above shows. Shape and rank are still checked mostly while the program runs; a shape lint that proves them before it runs, from the extents a program writes down, is the next rung up for them.

