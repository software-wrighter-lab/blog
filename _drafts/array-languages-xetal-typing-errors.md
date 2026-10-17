---
layout: post
title: "Array Languages #14: Types, Lints and Errors in X_eTaL"
categories: [languages, language-design, tools]
tags: [array-languages, xetal, x-etal, apl, types, type-inference, lint, errors, macros, ergonomics]
keywords: "X_eTaL type checking, array language type inference, xetal lint, compile-time errors versus run-time errors, silent wrong answers, macro errors, shape lint, error messages, ergonomics"
abstract: "Fourteenth in the Array Languages series, a plan: how X_eTaL tries to turn mistakes into errors as early as possible. A type error before the program runs is good, a run-time error is worse, and a silent wrong answer is the worst, and writing the Equations post turned up three of those in a day-old macro library. This post follows the ladder: types, lints, macro checks, run-time checks, and what the language changes so a whole class of silent failure cannot happen."
series: "Array Languages"
series_part: 14
date: 2026-10-20 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
---

<!-- DRAFT, A PLAN (2026-10-17): Mike: "type errors good; runtime errors bad; blog posts should be correct (unless we are
     blogging about error handling--a good idea; plan the next AL series draft to be on Typing, linting, errors/ergonomics,
     for publishing after the planned posts so far". After #13 (integrals, 10/19); date provisional.
     Sources to read before writing: X_eTaL docs/lang-choices.md (T1-T6 types, Haskell-style numeric typing, value restriction),
     docs/design.md, Saga 40 (xetal lint: names and renames D148-D150, --fix and --format json D144, redundant-lambda D143),
     docs/type-check-macros.md (approach 8, the shape lint, D155), MC23 and D158 (Boxed broke every macro expansion), X_eTaL-gpu's
     ask G13 ("every run-time finding comes with the earlier check it could have been"), and the blog's
     tmp/equations-findings-2026-10-17.md (three silent wrong answers in Equations' summand reader, its causes, the proposals).
     Do not claim any fix exists until its commit does. Lead image: PLACEHOLDER (scripts/placeholder-marker); Mike will supply one. -->

<img src="{{ '/assets/images/posts/placeholder-xetal-typing-errors.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

A mistake in a program can surface at four times: when the program is checked, when a lint reads it, when it runs, or never, as an answer that is quietly wrong. X_eTaL is designed to push every mistake as early on that list as it can. This post is about that ladder, and about what happened when a new library slipped to the bottom rung.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The language** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The libraries** | [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## The ladder

<!-- PLAN: four rungs, with one real example each, every one run and quoted from its tool:
     1. a type error before running (an Int divided by a Float variable: error[type-mismatch], and why the literal case works);
     2. a lint (xetal lint: a redundant lambda, a name, --fix);
     3. a run-time error that names everything (Equations' error[index] and error[rank]);
     4. a silent wrong answer (below). -->

## Types first

<!-- PLAN: what X_eTaL checks before a program runs: inferred types, numeric classes, Int versus Float, the value restriction;
     `xetal type`; a type error located at the code that caused it. Ergonomics: errors in macro output are located at the call,
     not in the string; what would help. -->

## Lints

<!-- PLAN: xetal lint (Saga 40): what it flags, --fix, JSON output, how the libraries keep themselves lint clean; the shape lint
     (D155) as the next rung: proving a shape contract before the program runs, so a run-time check becomes a compile-time one. -->

## Macros check their arguments

<!-- PLAN: []R_EJECT at the argument (Equations' ten rejection tests), hygiene and fresh names ([]G_ENSYM), raw strings with
     errors located inside them, and D158: the Boxed setting that turned every macro expansion into a box drawing. -->

## A silent wrong answer

<!-- PLAN: the story from writing #11 (tmp/equations-findings-2026-10-17.md): (y[i] - p[i])^2 summed y - p, y[i]2 and y[i] % 2
     dropped their tails, the LaTeX said otherwise; how it was found (trying more ML equations for the post), the cause (a reader
     that consumed part of its input), and the fix as it lands: the library's whole-input rule, a closed alphabet, coverage and
     differential tests, and the language-level changes (total parsing for macros, an unconsumed-argument check), if decided. -->

## What changes so it cannot happen again

<!-- PLAN: only what is committed by publishing time; the rest as plans, clearly marked. -->

</div>
