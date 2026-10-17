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
     Probe.xtlm, reject-*). Error code is error[bad-text]. Outputs above run here with the pinned xetal. Steps 2 (equations-on-parsing)
     and 3 (tags-on-parsing) PENDING: "Before and after" is still future tense; rewrite when they land. Step 1 status still in-progress. Do not describe any of it as built until its commit exists. Macros to move onto it, as examples:
     Equations (e:e_q<), Pipeline (pipe:p_ipe<, X_eTaL-ML), Stencil (X_eTaL-demos), Tags (X_eTaL-libraries).
     Lead image: Mike's block-composer-stick.jpg (2026-10-17), fourth version (11:58), type set upside down; monochrome, inverts in dark mode. -->

<img src="{{ '/assets/images/posts/block-composer-stick.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

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

<div class="clearfix" markdown="1" style="clear: both;">

<div class="aside-box" style="float: left; clear: none; margin: 0.3em 1.8em 1.2em 0; max-width: 280px;" markdown="1">
**What is a composing stick?** The tool at the top of this post. Before machines set type, a compositor built each line of a page by hand in a composing stick: a small metal tray held in one hand, its width set to the line's measure. Letters, one piece of metal each, were picked from the type case one at a time and set in the stick, then spaced out until the line filled the measure exactly and could be lifted out as one piece. Every character was placed on purpose, and nothing was left loose. That is the idea this post borrows for parsing.
</div>

## Every macro is a parser

An X_eTaL macro takes the text written at its call and returns code. A macro that only rearranges code, such as `i̲f<`, needs no parser. But a macro that embeds a notation does: the equation macro of [post #11](/2026/10/17/array-languages-xetal-equations/) reads a sum as a paper prints it, and the pipeline macro of [post #12](/2026/10/18/array-languages-xetal-pipelines/) reads stages joined by `|>`. Each one cuts its text at operators outside brackets, recognizes names, numbers and references like `W[i,j]`, and has to say clearly when the text is wrong.

Until now each macro library wrote those pieces itself. That is where a silent wrong answer came from: the equation reader took a group in parentheses by dropping its first and last characters without checking that the last one closed it, so `(y[i] - p[i])^2` lost its `2` and summed `y - p`, while its LaTeX printed what was written. The fix was a rule, every reading rule uses all of its text or refuses the call, and the rule is now a library.

## The library

`Parsing`, in X_eTaL-libraries, imported with `"pa:" u̲se< "Parsing"`, is an ordinary library of functions that macro libraries call while they read their text. It was generalized from the equation macro's own helpers, and every piece of it either uses all of its text or refuses the call with `error[bad-text]`, at the place the macro names, with the text it could not use:

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

The split finds the one `+` at the top level, outside the parentheses and brackets, and gives the two terms, `(sum j:=0..M-1 | W[i,j] * x[j])` and `b[i]`; the first term is one group, so its inside can be read as a sum.

## What it refuses

A reference must end at its bracket:

```text
error[bad-text]: a reference is a name, then its indices in brackets that end the text: X[i]2
```

And the whole-text check catches a parser that dropped anything at all, whatever the rule that dropped it. Its test gives it a parse with the last character missing:

```text
error[bad-text]: the parser did not use all of the text: it read a from ab
```

That check is the guard for the whole class of bug. A rule can be wrong in ways nobody thought to test, but if the parse written back is not the text that was written, the call is refused at compile time instead of running.

## The language's part

A library only protects the macros that use it. The stronger fix is in the language: X_eTaL's macro runner could refuse any expansion that leaves part of an argument unused, in every macro, library or not. That check, an unused-argument check, is proposed in X_eTaL's design notes and is a decision still to be made.

## Before and after

Next, the equation macro moves onto the library, with no change in what it does: every test, the differential test and the demos must come out the same. Then the `Tags` library's macros, which read their own small notations, follow, with a whole-text check of their own. The pipeline macro and the integral macros to come are its next users.

</div>
