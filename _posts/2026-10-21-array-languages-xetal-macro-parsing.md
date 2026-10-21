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
     2026-10-21: The library section rewritten (Mike: deeper, simpler, good and bad inputs): every example run on X_eTaL 2bdc6a57 and
     X_eTaL-libraries dcb6917 through tests/Probe.xtlm. Saga 16 steps 2-7 PUBLISHED (1587686 Bits, c916a49 Check, 404066f Csv,
     3d79475 Graphs migrated, tests unchanged per each commit; 0b02e8d Dates, 4d62eec Polynomials surveyed, left; reasons from the
     commit messages); pa: users on main counted: Bits Check Csv Equations Graphs Tags. Saga 16 step 1 PUBLISHED: guide.md (7c6f0f9), linked
     (GitHub page verified 200, title checked). PUBLISHED: libs/Ranges (fe54d30, rg:f_or<), linked; PENDING:, the before-and-after demo
     (step 3). Link each only once it is pushed.
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
| **The guide** | [Writing a notation macro with Parsing](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Parsing/docs/guide.md) --- one macro built step by step, each tool in turn |
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

`Parsing`, in X_eTaL-libraries, imported with `"pa:" u̲se< "Parsing"`, is an ordinary library of functions that a macro calls while it reads its text. It was generalized from the equation macro's own helpers, and it has one rule: every piece either uses all of the text it is given, or stops the compile with an error that names the text. It has four kinds of tools.

**Cutting text, bracket-aware.** These never fail. `ch ᵖᵃs̲plit t` cuts at a separator, but only outside parentheses, brackets and braces, so a `+` inside `(a+b)` or `c[i+1]` is left alone:

```text
"+" ᵖᵃs̲plit "(a+b) + c[i+1]"
```

```text
┌→─────────────────┐
│ ┌→────┐ ┌→─────┐ │
│ │(a+b)│ │c[i+1]│ │
│ └─────┘ └──────┘ │
└∊─────────────────┘
```

`ᵖᵃg̲roup?` asks whether a text is exactly one parenthesized group, opening with `(` and closing at its last character and nowhere sooner: `"(a (b) c)"` is one group, and `"(a)(b)"` is not, which is the very check the equation reader lacked.

**Recognizing kinds of text.** Questions answered 1 or 0: a name, a number (`"0.5"` is one, `"2."` is not), a word with its namespace, a function applied.

**Parsers that take a piece apart or refuse.** Each takes a tag, `where`, that says which error code to refuse with and where to point. The library's tests wrap each one in a small macro, so its result and its refusals can be seen:

| Parser | Good input | Gives | Bad input | Refusal |
|---|---|---|---|---|
| a chain, `ᵖᵃp̲arts` | `-a + b - c` | `a`, `b`, `c`; operators `+-`; opens with a minus | `a + - b` | an operator needs a value on each side |
| a binding, `ᵖᵃb̲inding` | `sum i:=0..n` | `sum`, `i`, `0`, `n` | `sum i=0..n` | a binding is a word, an index, `:=` and a range low..high |
| a function applied, `ᵖᵃa̲pplied` | `exp(z[i], 2)` | `exp`; `z[i]`, `2` | `exp(z[i]) + 1` | a function applied is a name, then its arguments in parentheses that end the text |
| a reference, `ᵖᵃr̲eference` | `W[i,j]` | `W`; `i`, `j` | `W[i,j]2` | an array reference ends with its closing bracket; nothing follows it |

Every refusal names the text it could not use, so the user sees what was wrong, not only that something was.

**Guards.** `ᵖᵃc̲haracters` refuses any character outside the notation's alphabet and names it (`not a character of this notation: 2`); `ᵖᵃr̲equire` refuses unless a condition holds; and `ᵖᵃw̲hole` is the safety net, below.

This is how a macro uses it, the reference parser's test macro in full:

```text
⍝│ uses: parsed
ᵐr̲eference< ← { @ t →
  (name, ix) ← "bad-text right" ᵖᵃr̲eference t
  "\"" c̲at name c̲at ": " c̲at ("|" ᵗj̲oin ix) c̲at "\""
}
```

The tag `"bad-text right"` says: refuse with `error[bad-text]`, pointing at the call's right side. A real notation passes its own code, `"bad-equation right"` in the equation library, so its users see the notation's own errors.

To see all of it used together, the library's [guide](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Parsing/docs/guide.md) builds one small notation macro from nothing, `for<`, which reads stepped ranges written the way a paper writes them, `for i:=0..10 by 2`. It reaches for each kind of tool in the order a real macro needs them, cutting the list, reading each binding, checking the optional step, and finally writing the whole parse back to prove nothing was dropped, and it explains the `where` tag in a section of its own. The finished macro is now a small library of its own, [Ranges](https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Ranges), whose one macro is `rg:f_or<`.

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

Since then the library's own authors have used it on the rest of their macro libraries, as dogfooding rather than repair. Four more now read their text through Parsing: Bits, Check, Csv and Graphs, each taking the library's name check or its position search in place of its own copy, and each library's tests came out unchanged. Two of them, Check and Graphs, had been splitting with the Strings library's split, which does not know about brackets; their inputs never hold one, so it fixed nothing today, but now every list-splitting macro uses the same tool.

Two were looked at and left alone, and the reasons are the useful part. Dates checks its characters with an error of its own, `... is not a date: write it yyyy-mm-dd`, and Parsing's character check would have replaced it with a generic one; better wording beats sharing a function. Polynomials reads numbers such as `2.` and `.5`, which Parsing's number check refuses, so moving it would have changed what the notation accepts. A shared tool is worth using where it fits, and not worth forcing where it does not.

The library also carries the bug that started all of this as a [demo](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Parsing/demos/before-after.xtl), the check any reader might write first beside the library's:

```text
term ← "(y - p)^2"
ᵘn̲aiveGroup? ← { t → ("(" m̲atch 1 t̲ake t) ∧ 0 < '+ r̲/ 0 + t m̲ember? ")" }
ᵘn̲aiveGroup? term
ᵖᵃg̲roup? term
y ← 5.0
p ← 3.0
y − p
(y − p) ^ 2
```

```text
1
0
2.0
4.0
```

The naive check sees an opening parenthesis and a closing one somewhere and says the text is a group; `ᵖᵃg̲roup?` says it is not, because the closing parenthesis is not the last character. Read the first way, the term is `y - p`, 2.0; it is `(y - p)^2`, 4.0. The demo also runs in the libraries' [cross-reference site](https://softwarewrighter.github.io/X_eTaL-libraries/doc/), with the Ranges library and its demo.

---

<p class="ed-note" style="font-size: 0.85em;"><em>[Ed. 2026/10/21: Added the Parsing library's before-and-after demo of the bug that started this post, with its output, and a link to the libraries' cross-reference site, both published after this post (X_eTaL-libraries <a href="https://github.com/softwarewrighter/X_eTaL-libraries/commit/d9d157e">d9d157e</a>, <a href="https://github.com/softwarewrighter/X_eTaL-libraries/commit/5e6ba9c">5e6ba9c</a>); this post's <a href="https://github.com/software-wrighter-lab/blog/commits/main/_posts/2026-10-21-array-languages-xetal-macro-parsing.md">history</a>.]</em></p>

