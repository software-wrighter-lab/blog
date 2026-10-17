---
layout: post
title: "Array Languages #15: A Parsing Library for X_eTaL Macro Writers"
categories: [languages, language-design, tools]
tags: [array-languages, xetal, x-etal, apl, macros, parsing, parser-combinators, errors, ergonomics]
keywords: "X_eTaL macro parsing library, total parsing, parser combinators in an array language, macro argument parsing, unconsumed input error, silent wrong answers, embedded languages, macro hygiene, spans"
abstract: "Fifteenth in the Array Languages series, a plan: a parsing library for people who write X_eTaL macros. Every macro that reads an embedded notation, an equation, a pipeline, a stencil, has had to write its own reader, and a hand-written reader that uses part of its text and drops the rest gives silent wrong answers. A shared library whose parses must reach the end of their input, with errors that point at the place in the text, makes that whole class of bug a compile-time error."
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
     X_eTaL step 110 macro-contracts (uncommitted plan). NOT built yet. Do not describe any of it as built until its commit exists. Macros to move onto it, as examples:
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
| **The language** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

<div class="aside-box" style="float: left; clear: none; margin: 0.3em 1.8em 1.2em 0; max-width: 280px;" markdown="1">
**What is a composing stick?** The tool at the top of this post. Before machines set type, a compositor built each line of a page by hand in a composing stick: a small metal tray held in one hand, its width set to the line's measure. Letters, one piece of metal each, were picked from the type case one at a time and set in the stick, then spaced out until the line filled the measure exactly and could be lifted out as one piece. Every character was placed on purpose, and nothing was left loose. That is the idea this post borrows for parsing.
</div>

## Every macro is a parser

<!-- PLAN: the macros that read a notation today (Equations, Pipeline, Stencil, Tags, the system macros) and how each reads its
     text by hand; what they share (splitting outside brackets, precedence, names, numbers, spans for errors). -->

## What a hand-written reader gets wrong

<!-- PLAN: the Equations case in brief (told in full in #14, which this links once published): a rule that used part of its text;
     why nothing caught it; the reprint check as the library-level guard. -->

## The library

<!-- PLAN, from what lands: where it lives and its name; its pieces (characters, tokens, precedence climbing, separated lists,
     brackets); total by construction (a parse must reach the end of its input); errors with spans into the argument string;
     the reprint as a built-in check. -->

## The language's part

<!-- PLAN: the unused-argument check in the macro runner (approach 10), if decided: an expansion that leaves part of an argument
     unaccounted for is refused at compile time, in every macro, library or not. And the .xtlm lint (approach 11). -->

## Before and after

<!-- PLAN: the same bug, (y[i] - p[i])^2, through a reader built on the library: refused, with the place in the text. One macro
     moved onto the library, its reader before and after. -->

</div>
