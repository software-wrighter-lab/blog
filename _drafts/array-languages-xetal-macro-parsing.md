---
layout: post
title: "Array Languages #15: A Parsing Library for X_eTaL Macro Writers"
categories: [languages, language-design, tools]
tags: [array-languages, xetal, x-etal, apl, macros, parsing, parser-combinators, errors, ergonomics]
keywords: "X_eTaL macro parsing library, total parsing, parser combinators in an array language, macro argument parsing, unconsumed input error, silent wrong answers, embedded languages, macro hygiene, spans"
abstract: "Fifteenth in the Array Languages series: a parsing library for people who write X_eTaL macros. Every macro that reads an embedded notation, an equation, a pipeline, a stencil, has had to write its own reader, and a hand-written reader that uses part of its text and drops the rest gives silent wrong answers. A shared library whose parses must reach the end of their input, with errors that point at the place in the text, makes that whole class of bug a compile-time error."
series: "Array Languages"
series_part: 15
date: 2026-10-21 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN (2026-10-17): Mike: "schedule the next draft post for after the linter/type-checker post, a new AL series
     macro writer's parsing library (or similar post title)". After #14 (types, lints and errors, 10/20); date provisional.
     Sources so far: X_eTaL docs/type-check-macros.md approaches 9 (a total-parsing library for macro authors), 10 (an
     unused-argument check in the macro runner; to be decided with Mike), 11 (a lint for .xtlm readers), from b8a6ac3b; the
     Equations case (X_eTaL-libraries ed91e6d, 8a6e796: whole-input rule, closed alphabet, the reprint check) and the blog's
     tmp/equations-findings-2026-10-17.md. 2026-10-17 10:35: X_eTaL-libraries Saga 13 (parsing) planned (92050c8): libs/Parsing,
     alias pa:, a plain .xtl library of total parsers (split outside brackets, balanced group, chain with leading minus, name,
     number, binding i:=a..b, function applied, reference), each all-or-refuse via []R_EJECT, plus a write-back whole-text check;
     steps parsing-library, equations-on-parsing, tags-on-parsing. Named Parsing, not Reading (a Lisp reader macro is different).
     X_eTaL step 110 macro-contracts (uncommitted plan).
     2026-10-17 14:30: Saga 13 step 1 COMMITTED (239dc1b, 14:08): libs/Parsing (src/Parsing.xtl, docs, demos/pieces.xtl, tests incl.
     Probe.xtlm, reject-*). Error code is error[bad-text]. Outputs above run here with the pinned xetal. Steps 2-3 DONE (8c5fd18, merged a3d6a38): refusals carry the caller's
     tag; Equations' goldens unchanged; new reject-result-trailing; Tags write-back. MC31 contracts (X_eTaL 57cff932): unused-argument
     shown with the scratchpad toy Sq.xtlm on a clean build of main. RECHECK before publishing. Do not describe any of it as built until its commit exists. Macros to move onto it, as examples:
     Equations (e:e_q<), Flow (flow:p_ipe<, X_eTaL-ML, its own reader), Stencil (X_eTaL-demos), Tags (X_eTaL-libraries).
     RECHECKED 2026-10-20 on X_eTaL 0b427a30, X_eTaL-libraries 33c2d13 (Parsing unchanged since 8c5fd18), X_eTaL-ML 25901a4: demo
     output shown as run; bad-text matches tests/reject-whole.err; y[i]2 refusal; unused-argument toy; all 16 library macros
     declare ## uses:; Flow does not use pa: (own reader, ## uses: parsed, 16 reject tests, roundtrip test); integrals use pa:.
     Lead image: Mike's block-composer-stick.jpg (2026-10-17), fourth version (11:58), type set upside down; monochrome, inverts in dark mode. -->

<figure style="float: left; width: 205px; margin: 0.8em 2em 1em 0.5em;">
<img src="{{ '/assets/images/posts/block-composer-stick.webp' | relative_url }}" class="post-marker" alt="A compositor's hand setting metal type in a composing stick" style="width: 205px; float: none; margin: 0 !important; padding: 0;">
<figcaption style="font-size: 0.8em; text-align: center; margin-top: 0.3em;">A composing stick.</figcaption>
</figure>

<div style="overflow: hidden;" markdown="1">

A macro in X_eTaL is a function from the text written at its call to the code that replaces it. That makes it easy to embed a notation, an equation as a paper prints it, a pipeline, a stencil, and it makes every such macro a parser. This post is about giving the people who write those parsers a library, so that a reader that skips part of its input is an error, not a wrong answer.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The library** | [Parsing](https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Parsing) in X_eTaL-libraries · [its reference](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Parsing/docs/README.md) |
| **The language** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Every macro is a parser

An X_eTaL macro takes the text written at its call and returns code. A macro that only rearranges code, such as `i̲f<`, needs no parser. But a macro that embeds a notation does: the equation macro of [post #11](/2026/10/17/array-languages-xetal-equations/) reads a sum as a paper prints it, and the pipeline macro of [post #12](/2026/10/18/array-languages-xetal-pipelines/) reads stages joined by `|>`. Each one cuts its text at operators outside brackets, recognizes names, numbers and references like `W[i,j]`, and has to say clearly when the text is wrong.

<div class="aside-box" style="float: left; width: 36%; margin: 0.3em 1.8em 1.2em 0;" markdown="1">
**What is a composing stick?** The tool in the picture at the top of this post. Before machines set type, a compositor built each line of a page by hand in a composing stick: a small metal tray held in one hand, its width set to the line's measure. Letters, one piece of metal each, were picked from the type case one at a time and set in the stick, then spaced out until the line filled the measure exactly and could be lifted out as one piece. Every character was placed on purpose, and nothing was left loose. That is the idea this post borrows for parsing.
</div>

Until now each macro library wrote those pieces itself. That is where a silent wrong answer came from: the equation reader took a group in parentheses by dropping its first and last characters without checking that the last one closed it, so `(y[i] - p[i])^2` lost its `2` and summed `y - p`, while its LaTeX printed what was written. The fix was a rule, every reading rule uses all of its text or refuses the call, and the rule is now a library.

## The library

`Parsing`, in X_eTaL-libraries, imported with `"pa:" u̲se< "Parsing"`, is an ordinary library of functions that macro libraries call while they read their text. It was generalized from the equation macro's own helpers, and every piece of it either uses all of its text or refuses the call, under the macro's own error code and at the place the macro names, with the text it could not use:

- **Pieces of text:** cut at a separator, but only at the top level, outside parentheses, brackets and braces; find the top-level operators of a chain; tell whether a text is one parenthesized group, which means its opening parenthesis closes at the last character and nowhere sooner, the very check the equation reader lacked.
- **Kinds of text:** a name, a number, a word with its namespace, a function applied, `f(...)`.
- **Parsers:** a chain and its operators, with a leading minus; a binding such as `sum i:=0..n - 1`; a function applied and its arguments; a reference, `A[i,j]`, as a name and its indices.
- **Refusals:** a closed alphabet, so a character the notation does not use is refused by name; and a whole-text check, which writes a parse back and compares it with the text.

The library's demo takes the right side of a dense layer with its bias apart, piece by piece, as a macro does before it writes any code:

```text
call ← "(sum j:=0..M-1 | W[i,j] * x[j]) + b[i]"
"+" ᵖᵃs̲plit call
ᵖᵃg̲roup? d̲isclose f̲irst "+" ᵖᵃs̲plit call
```

```text
┌→─────────────────────────────────────────┐
│ ┌→──────────────────────────────┐ ┌→───┐ │
│ │(sum j:=0..M-1 | W[i,j] * x[j])│ │b[i]│ │
│ └───────────────────────────────┘ └────┘ │
└∊─────────────────────────────────────────┘
1
```

The split finds the one `+` at the top level, outside the parentheses and brackets, and gives the two terms, `(sum j:=0..M-1 | W[i,j] * x[j])` and `b[i]`; the first term is one group, so its inside can be read as a sum.

## What it refuses


A refusal carries the calling macro's own error code, so a notation built on the library keeps its voice. Through the equation macro, a reference must end at its bracket:

```text
"L[] | " ᵉe̲q< "sum i:=0..n - 1 | y[i]2"
error[bad-equation]: an array reference ends with its closing bracket; nothing follows it: y[i]2
```

And the whole-text check catches a parser that dropped anything at all, whatever the rule that dropped it. The library's own test gives it a parse with the last character missing, through a small probe macro whose code is `bad-text`:

```text
error[bad-text]: the parser did not use all of the text: it read a from ab
```

That check is the guard for the whole class of bug. A rule can be wrong in ways nobody thought to test, but if the parse written back is not the text that was written, the call is refused at compile time instead of running.

## The language's part

A library only protects the macros that use it, so the language now checks every macro too. A macro declares a contract in the documentation above its definition: how it is called, and whether it copies its text into its expansion or parses it. For a macro that copies, the default, the macro runner checks that every name and number of the call's text reaches the expansion. A toy macro that forgets the power of what it was given:

```text
@ q:s̲quare< "3 ^ 2"
error[unused-argument]: q:s_quare< did not use 2 of the text on its right; a macro that copies its text writes every name and number of it (## uses: copied)
```

A macro that parses a notation cannot be checked that way, since its expansion is not a copy of its text, so it says `## uses: parsed`, and the parsing library's whole-text check is its guard. Every macro in the libraries now declares which kind it is.

## Before and after

The equation macro has moved onto the library. Its own group, chain, binding, function, reference and splitting helpers are gone, replaced by calls to `pa:`, and nothing it does changed: every test, the differential test that generates random equations, and the demos came out the same. Moving it found one more case its old reader had let through: a result with text after its brackets, `Y[o]2`, was read as `Y[o]`. It is now refused. The `Tags` library's macros moved too, and now write each declaration back and compare it with the text.

The integrals added to the equation macro since ([post #13](/2026/10/19/array-languages-xetal-integrals/)) read their bounds and bodies through it as well. The pipeline macro, Flow in X_eTaL-ML, has a reader of its own, written to the same rule from the start: it declares `## uses: parsed`, its tests refuse sixteen kinds of wrong text, and a round-trip test checks that what it writes back is what was written.

