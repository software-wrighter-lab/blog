---
layout: post
title: "Array Languages #3: X_eTaL-libraries, Extending the Vocabulary and the Language"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, libraries, macros, extensibility, metaprogramming, dyalog, j, bqn]
keywords: "X_eTaL libraries, X_eTaL tuples, array language libraries, u_se macro, xtlm macro libraries, source-to-source macros, user-defined macros, procedural macros, Forth parsing words, APL execute, Dyalog dfns, J addons, BQN bqn-libs, Check library, Strings, Sets, Matrix, Random"
abstract: "Third in the Array Languages series: X_eTaL-libraries, where the E in the name gets its first two meanings. Nineteen libraries, 168 functions, every one with tests, a live editable demo and a reference page in a cross-reference site searchable by type; six of them carry macros: date literals checked at compile time, math notation compiled, a graph whose node names become variables. The macros are source-to-source functions written in X_eTaL, type-checked after expansion, and placed here among Rust, Forth and APL's own execute."
series: "Array Languages"
series_part: 3
date: 2026-10-09 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-libraries/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries"
    title: "X_eTaL-libraries"
---

<img src="{{ '/assets/images/posts/block-libraries.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Extensible has three meanings in X_eTaL: libraries extend the vocabulary, macros extend the language, and native extensions extend the machine. This post is the first two, and the repository that holds them. The third gets a planned post of its own.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) · [the macro design notes](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/docs/plan.md) |
| **Live demo** | [softwarewrighter.github.io/X_eTaL-libraries](https://softwarewrighter.github.io/X_eTaL-libraries/) --- every library's demos, editable and runnable |
| **Reference** | [the cross-reference site](https://softwarewrighter.github.io/X_eTaL-libraries/doc/) --- every library, macro library and demo, searchable by name or by type |
| **Prior post** | [Array Languages #2: X_eTaL-demos](/2026/10/08/array-languages-xetal-demos/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Nineteen libraries, live

The standard libraries --- Combinators, Maybe, Stats, Turtle --- are built into the interpreter; this repo holds ordinary X_eTaL files any program imports the same way, with `"t:" u̲se< "Strings"` and then `ᵗu̲pper "hello"`. Nineteen are ready, 168 functions in all, each with tests, demos and a reference page, and each with a recommended alias that clashes with nothing else, in four groups:

| Group | Libraries |
|---|---|
| Foundations | Check (assertions that report as text), Strings, Lists, Sets |
| Data | Csv, Grouping, Search, Statistics, Dates |
| Mathematics | Numbers, Combinatorics, Matrix, Polynomials, Geometry, Graphs, Bits, Random |
| Output | Format, Plot |

Every library has a [live demo](https://softwarewrighter.github.io/X_eTaL-libraries/): its programs editable and runnable in the browser, with the reference, the source and the types one tab away. Many are ports from the libraries of other array languages --- Dyalog's dfns workspace, J's addons, BQN's bqn-libs --- reimplemented from their documented behavior and credited on each library's page. Ordinary libraries are frozen for the launch --- the repo's own note is that nineteen is enough --- with one exception made for a sibling: Plot gained line charts with axes, labels and several lines because the machine-learning repo asked for them. Inside each library, helper functions are now private, spelled with the language's new `h:` prefix, so only the documented functions are exported. And the hand-typed strings of digits and capital letters that several libraries used for parsing are gone, replaced by the language's built-in `⎕D` and `⎕A`.

**Tuples, where they earn it.** X_eTaL got tuples this week, and the repo has already written down when to use them, in a rule decided with me: this is a typed *array* language, so the array is the default. A tuple is worth it only where it adds something an array cannot: type safety, convenience, or notation, and most of all parts of different types, which one array cannot hold. A point in Geometry stays an array, because it gets added to, scaled and rotated with other points, and a tuple can't take arithmetic. An audit of the types of all 168 exported functions found no case yet of different-typed parts, since the domain is mostly numbers and text, but it found two where a tuple's fixed arity pays. Strings' replace takes its pair of texts as a boxed list today, so the wrong count slips through:

```text
"a" "b" "c" ᵗr̲eplace "abc"        ⍝ bbc: the third text is silently ignored
```

As a tuple, `("cat", "dog") ᵗr̲eplace "hot dog"`, a third part would be a type error. Statistics' fit returns its intercept and slope packed in one array; as a tuple, a caller can write `(intercept, slope) ← x ˢˣf̲it y`. Both are planned, not started, because each changes an exported signature and every call site, page, test and baseline with it.

The reference is the newest piece. `xetal doc` builds a [cross-reference site](https://softwarewrighter.github.io/X_eTaL-libraries/doc/) from all fifty files --- every library, macro library and demo --- indexed, every call linked to its definition, and searchable by name or by type, so you can look for a function by the shape of what it takes and returns. Its side bar now groups the files by directory, library by library. The first build showed only signatures and source, because the libraries used plain `#` comments, which the tool ignores; within a day every library was rewritten with `##` documentation comments and `###` sections, so the pages now explain what each function does. The next step is planned, not started: worked examples under each comment that `xetal doc --test` runs and checks, the way the language's own standard libraries already do.

<figure>
<img src="{{ '/assets/images/posts/xetal-libraries-doc.webp' | relative_url }}" class="no-invert" alt="The X_eTaL-libraries cross-reference site: a search box for a name or a type, the files grouped by directory in the side bar, and each library described with its import line">
<figcaption style="font-size: 0.85em;">The <a href="https://softwarewrighter.github.io/X_eTaL-libraries/doc/">cross-reference site</a>, built by <code>xetal doc</code>: search by a name or a type.</figcaption>
</figure>

<figure>
<img src="{{ '/assets/images/posts/xetal-libraries-live.webp' | relative_url }}" class="no-invert" alt="The X_eTaL libraries live demo opening on its Start here page: the libraries down the left, a two-line import example, the three ways X_eTaL extends, and cards for each library by group">
<figcaption style="font-size: 0.85em;">The libraries' <a href="https://softwarewrighter.github.io/X_eTaL-libraries/">live demo</a> opens on a Start here page: one line imports a library, the three ways X_eTaL extends, and a card per library. Pick one and its demos run, editable, in the page.</figcaption>
</figure>

The README makes a distinction worth repeating: the *Extensible* in the name has three sides. Libraries extend the vocabulary; macros extend the language; native extensions extend the machine. This post is the first two; a planned post covers the third.

<div class="clearfix" markdown="1">

## Macros: extending what the language can say

Macros are built, on the language's main branch, and this repository was one of the first to use them. A macro is an ordinary X_eTaL function from source text to source text --- the text on its left and the text on its right, one string back --- kept in a `.xtlm` file beside the library it belongs to and imported with it under one alias. A trailing `<` marks the call, the way Rust marks one with `!`. Expansion happens before the program is compiled, and what comes out is spliced back in, parsed and type-checked like everything else, so a macro can write code but cannot slip an ill-typed program past the checker. `xetal expand` shows the result, and so does an Expand button in the live demo.

Here is the Dates library's macro, rendered, in a program:

```text
"d:" u̲se< "Dates"
landing ← @ ᵈd̲ate< "1969-07-20"
ᵈw̲eekday landing                        ⍝ 7: a Sunday
(@ ᵈd̲ate< "2026-12-25") − @ ᵈd̲ate< "2026-10-03"   ⍝ days to go
```

and here is what `xetal expand` shows the compiler actually sees:

```text
landing ← (-165)
ᵈw̲eekday landing
((20812)) − (20729)
```

The date literals are gone; plain day numbers are left, and nothing parses a date when the program runs. Write `"2026-02-30"` instead and the program never starts: `error[bad-date]: 2026-02-30 is not a date of the calendar`, at compile time, before even the line above it prints.

The repo has a rule for when a macro is warranted, and it is stricter than most languages' habits. Use one only where a function or a guard cannot do the job, which leaves four reasons: the macro needs an argument's *source text* (a function sees only the value); it checks an embedded *notation* when the program is compiled; it chooses *what is compiled*; or it *creates names*. Each of the six domain macros is one of those:

| Macro | Reason | What it does |
|---|---|---|
| `ᵈd̲ate<` | notation | a date literal checked at compile time, its day number written in |
| `ᵖʸp̲oly<` | notation | math notation, `3x^2 - 2x + 1`, compiled to coefficients |
| `ᵍg̲raph<` | names | a graph written by its node names, one variable per node defined |
| `ᵇf̲ields<` | names | named bit fields, a getter and setter each, offsets compiled in |
| `ᶜˢc̲olumns<` | names | a table's columns as named, typed variables |
| `ᵏc̲ases<` | source text | table-driven checks, each named by its own source |

The Graphs one is the clearest case for creating names. A subway map written as `"town" ᵍg̲raph< "airport-bridge-center-docks-exchange, fair-center-garden, docks-harbor"` expands into `airport ← 1`, `bridge ← 2` and so on for every station, plus `town` as the 8 by 8 adjacency matrix, so the rest of the program says `town ᵍl̲evels center` and speaks of stations rather than numbers. No function could do that: a function computes values, never definitions.

What is *not* here is as telling. A Control library of `if`, `unless` and `each` macros was planned and then retired, because the language now ships those as system macros of its own --- `i̲f<`, `u̲nless<`, `e̲ach<`, and a set modeled on Rust's standard ones (`f̲ormat<`, `d̲bg<`, `a̲ssert<`, `p̲anic<`, `i̲nclude<`) --- written in X_eTaL in the language's `lib/System.xtlm`. A regular-expression macro was moved to the extensions repo, where a real regex engine belongs. And the language's own `ᶜY̲<` is in [the first post's recursion table](/2026/10/07/array-languages-xetal/#recursion-six-ways): a macro that turns the Y combinator into plain named recursion at compile time.

**Where these sit among other languages' macros.** They are not C-preprocessor macros, which have no host language and no checking after expansion, and not Lisp, Julia or Template Haskell macros, which work on a syntax tree with quote and unquote. The nearest modern relative is Rust's function-like procedural macro, compiled ahead of its users and type-checked after expansion --- except that X_eTaL hands the macro text, not a token stream. The nearest old one is Forth's parsing words, which run at compile time and are defined in the language itself. Within the APL family, they are execute, `⍎`, moved to compile time and given a type checker. Expansion is hygienic: names a macro introduces are renamed to fresh `g1:` names unless the macro declares that it binds one on purpose.

</div>

## Next in the series

A planned post covers the third meaning of *Extensible*: native extensions, Rust behind an X_eTaL facade, and the extension ABI.
