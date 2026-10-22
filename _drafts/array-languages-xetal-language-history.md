---
layout: post
title: "Array Languages #16: How X_eTaL Evolved, Decision by Decision"
categories: [languages, language-design, process]
tags: [array-languages, xetal, x-etal, apl, haskell, rust, bqn, j, language-design, history, decisions, macros, trains, lazy-evaluation, tuples, dogfooding]
keywords: "X_eTaL language design, design decisions, APL without an APL keyboard, ASCII source rendered notation, Haskell types, Rust macros lints diagnostics, trains fork atop, lazy parameters, macro hygiene, macro contracts, tuples, features not adopted, language evolution"
abstract: "Sixteenth in the Array Languages series: how X_eTaL became the language it is, decision by decision. APL's arrays and right-to-left reading, typed in ASCII and drawn as notation; Haskell's types but not its evaluation; Rust's macros, lints and error messages; tuples for state that arrays packed badly. Most changes came the way a page fault is resolved: a library, a macro library or an extension tried to do something, failed or found it clumsy, and the language answered with a feature, a choice among alternatives, or a refusal. Here are the choices in order, the few that deserve a story, and the features left out because they would have cluttered the language."
series: "Array Languages"
series_part: 16
date: 2026-10-22 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, REWRITTEN 2026-10-22 (Mike): language evolution, not "changed its mind": the distinctive choices and influences, a
     numbered table of choices, a few in depth, what was refused to stay small, how library/macro-library/extension needs changed
     the language. Target ~15 minutes. Publishing: when Mike decides.
     Sources: X_eTaL origin/main 3fffbd4a: docs/lang-choices.md (decision codes), docs/design.md section 9 (register D1-D185;
     D111 and D113 duplicate text, so 184 distinct), docs/history.md, docs/asks.md (ledger: 38 landed, 12 partly, 20 planned,
     11 declined, 20 new; E5/X15 lag the register), docs/adt.md, docs/code-strings.md, docs/eq-rationale.md, docs/user-macro-design.md,
     PRD. Research report: blog scratchpad xetal-decisions.md; X_eTaL/work/summarized-decisions.md (gitignored). Mike's own words
     come from the design conversations (work/condensed-chat.txt, not in source control): attributed as such, never as recorded
     decisions. Corrections from the research: the Q1-Q50/R1-R6 answers fell on 09-27 Pacific (09-28 UTC) with sub-questions, and
     the questions themselves are in the conversations, not the repo; the register had 20 entries at the end of 09-27 (4d2b8dfa).
     NOT claimed: A+ (never mentioned); K and Uiua as influences (comparison columns only); a crate-like ecosystem (a non-goal for
     now in the PRD; "Packages" on the wish list). Code: the train, the lazy factorial and k_eep run and rendered on X_eTaL 2bdc6a57.
     Links only to published posts. Lead image: Mike's block-changed-mind.jpg, dark, not inverted. -->

<img src="{{ '/assets/images/posts/block-changed-mind.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

X_eTaL is an array language in the APL tradition that you can type on an ordinary keyboard. Its source is plain ASCII, `r_ev` with an underscore after a letter, and the tools draw it as notation, `r̲ev` with the letter underlined, `←` for `:=`, `⍺` and `⍵` for a lambda's arguments, as you type. From APL it takes arrays as the only data, right-to-left reading with no precedence, and quads for the system. From BQN and J, the leading axis and the atop. From Haskell it takes the types, inference and numeric classes, but not the evaluation: X_eTaL is strict, with laziness only where a parameter asks for it. From Rust it takes the macros, raw strings, doc tests, a clippy-style linter and error messages that point at the line. Functions are curried, every function takes its function arguments first, and Smullyan's birds are a library. And where state did not fit in arrays, it took tuples. K and Uiua appear on X_eTaL's comparison stone, not as sources of its design.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The decisions** | [lang-choices.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md) and the register in [design.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/design.md) (section 9, D1 to D185) |
| **The history** | [history.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/history.md) and the [asks ledger](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/asks.md) |
| **The series** | [#1: X_eTaL](/2026/10/07/array-languages-xetal/) · [#14: types, lints and errors](/2026/10/20/array-languages-xetal-typing-errors/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## How it changed: page faults

The first evening settled the core, one question at a time: fifty numbered questions, a few sub-questions and six review items, each answered by me and recorded as a decision. The register of decisions had 20 entries at the end of that first day and has 185 three and a half weeks later. Almost none of the later ones came from a plan. They came the way a page fault is resolved: a program tried to do something, and the language either could not or made it clumsy. A library needed an error of its own; a macro dropped part of its text and nobody noticed; a training loop packed three arrays into one vector to get them through a loop. Each time the language answered in one of three ways: a feature, a choice among alternatives written down with the reasons, or a refusal.

The mechanism is a ledger. Every sibling repository, the libraries, the machine learning, the extensions, the games, files its needs as asks with a code, and X_eTaL answers each one: landed, planned, or declined with a reason. Today the ledger holds 38 landed, 12 partly landed, 20 planned, 11 declined and 20 not yet decided. The rule the history states is short: "a workaround copied in more than one place is evidence, and a general mechanism moves down into the core."

## The choices, in order

| # | Choice | Why, or instead of what |
|---|---|---|
| 1 | Source is ASCII; decoration is display only | APL needs a special keyboard; J and K's digraphs are hard to read |
| 2 | An underlined letter makes a name a function: `r_ev` | letters mainly; no overstrike; one underline per name |
| 3 | Built-ins are words, `r_eshape`, one name each | a single letter cannot stand for every word that starts with it; no aliases |
| 4 | Right to left, no precedence; `:=` drawn as `←` | APL's reading, typed in ASCII |
| 5 | Namespaces are typed prefixes, `u:`, `l:`, drawn raised; the importer picks the alias | prefixes are typeable and unambiguous |
| 6 | One arity per function; dyadic use is currying | instead of APL's ambivalent functions |
| 7 | A quoted function is an operand: `'+ r_/ v`; function arguments first | instead of a separate class of operators |
| 8 | Leading axis by default | as in J and BQN, instead of APL's last axis |
| 9 | Index origin 1, not configurable | APL's origin, without `⎕IO` |
| 10 | `=` is exact; `e̲q~` compares with a fixed tolerance | instead of APL's `⎕CT` setting |
| 11 | Hindley-Milner inference, Haskell-style numeric classes, checked before running | Haskell's types, with no annotations required |
| 12 | Strict evaluation, with `~` for a lazy parameter | so the Y combinator works without making everything lazy |
| 13 | Trains in brackets: `[F G H]` a fork, `[F G]` an atop | instead of implicit trains, and instead of J's hook |
| 14 | Values are immutable; a name with `!` is mutable | instead of a `mut` keyword |
| 15 | Macros are names ending in `<`; imports are `"k:" u̲se< "Lib"` | instead of a `use` keyword; the alias is always required |
| 16 | Lambda arguments drawn `⍺` and `⍵` | the first drawing, subscript l and r, was unreadable in a terminal font |
| 17 | Nested arrays with a static `Box` type, shown like APL2's `DISPLAY` | static depth, so the type checker still sees the structure |
| 18 | Strings and comments may hold any Unicode; code stays ASCII | so a library could greet with its drawn logo |
| 19 | Smullyan's birds as a library | combinators as ordinary functions |
| 20 | A steppable evaluator, so a program can wait for input in the browser | chosen over re-running per line and over a sleeping worker; no WASI build |
| 21 | Macro libraries, `.xtlm`, exporting under `m:` | asked for by the libraries, ML and extensions alike |
| 22 | System macros written in X_eTaL, modeled on Rust's: `f̲ormat<`, `d̲bg<`, `a̲ssert<` | which ones: "the test Rust's std uses" |
| 23 | Errors of one's own: signal, trap, retry, recover | a library asked for assert, raise and catch; typed, not an untyped exception |
| 24 | Doc comments with examples that run as tests | as rustdoc runs them |
| 25 | `h:` for a library's private names | a private helper could silently hide a future built-in |
| 26 | Tuples, `(w, m, v, k)`, taken apart by patterns only | a training state of several arrays had been packed into one vector |
| 27 | Names bound once per scope | instead of shadowing, which hid mistakes |
| 28 | A linter, levels in ordinary comments, fixes git can undo | clippy's model |
| 29 | Macro hygiene by choice, with fresh names on request | instead of automatic renaming, which guessed wrong |
| 30 | One body per function, checked once | instead of a copy per argument type, as Julia makes |
| 31 | Raw strings, `r"..."`, by Rust's rules | multi-line macro arguments without escapes |
| 32 | Equations and pipelines as libraries of macros | no compiler change; kept out of the grammar |
| 33 | Plain names: `ᵉe̲q<`, not a pun | a name must read under any alias |
| 34 | Macro contracts: `## takes:`, `## uses:`, `## binds:` | after a macro dropped part of its text in silence |
| 35 | Errors at file, line and column, with the spot underlined | as rustc does |
| 36 | Code strings, `c"..."`, checked as X_eTaL | a macro's X_eTaL argument was opaque to every tool |
| 37 | A macro's notation drawn by its own library | an equation shown as typeset math |
| 38 | `_u`, drawn `▁`, for a parameter nothing reads | instead of a lint directive on every such line |

Rows 1 to 19 were settled in the first days; the rest arrived as the libraries and other repositories found something missing. A few deserve more than a row.

## Laziness, only where asked for

I wanted the Y combinator to work in its textbook shape, `Y f = f (Y f)`. In a strict language that recurses forever before it does anything, and the usual fix is a different combinator, Z, which hides the recursion behind an extra lambda. The other fix is to make the whole language lazy, as Haskell is, and pay for it everywhere. Neither was what I wanted. The answer was a mark on one parameter: `~` makes that argument lazy, evaluated where the body first reads it and never if it does not. Everything else stays strict. The factorial, from a lambda that receives itself:

```text
ᵘf̲n ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }
'ᵘf̲n ᶜY̲ 5
```

That gives 120. The same mark later turned out to be useful for an argument a function does not need at all, below.

## Trains, marked

Trains came early: a fork, three functions where the outer two see the argument and the middle one joins their results, and an atop. APL and J write a train as functions side by side, and what it means depends on how many there are. In J, two functions in a row are a hook, a different combinator from three. X_eTaL marks a train with brackets instead, and takes BQN's and Dyalog's atop for two:

```text
ᵘa̲vg ← ['+ r̲/ ÷ t̲ally]
```

That is the mean, the sum divided by the count. The brackets cost two characters, and buy one rule: a row of names without them always means application, right to left. A train becomes ordinary application before it runs, so the evaluator never sees one. Named dyadic trains were asked for and declined: a named two-argument function is a lambda.

## Names bound once

At first, binding a name again made a new binding that hid the old one, as in most functional languages. Two weeks in, a survey of X_eTaL and its sibling repositories found 235 bindings that a stricter rule would break, and 106 of them were throwaway names. Shadowing had been hiding mistakes. The rule became: a name without `!` is bound once per scope, `_ := expr` keeps a value only for its effect, and in an interactive session `[]E_X` removes a name so it can be bound again. Each sibling repository got a notice listing its sites to change.

## Macros: from hooks to hygiene to contracts

Macros started as one hard-coded import macro. The libraries, the machine learning and the extensions all asked for macro libraries of their own, and that is where most of the language's later growth came from. Three changes in particular came straight out of library work.

**Hygiene.** At first a macro's names were renamed automatically, Scheme's way, so they could not collide with the caller's. Building the Tags library broke it: when a macro took its argument apart, the renaming changed a name it wrote but not the reference to it, because it had to guess from bytes which text the macro had copied. Hygiene became a choice, as in Common Lisp: a macro asks for a fresh name when it needs one, and lints catch the captures the renaming used to prevent.

**Contracts.** The Equations library summed `(y[i] - p[i])^2` as `y[i] - p[i]`: its reader dropped the `^2`, and the answer was wrong in silence. The response had a limit set on purpose: I did not want "a whole other meta language", only to "prevent preventable errors". A macro now declares how it is called, `## takes:`, and whether it copies its text or parses it, `## uses:`. For a copying macro the runner checks that every name and number of the call reaches the expansion; for a parsing one, a new Parsing library makes every reader use all of its text or refuse.

**Code strings and notations.** A macro's argument that is itself X_eTaL was one string to every tool: not drawn, not formatted, not linted. A `c` in front, `c"..."`, now says its inside is code, so it is drawn and checked like the rest of the file. And a macro side can be declared a notation, drawn by its own library, which is how an equation written as a string appears as typeset math.

## Tuples, and no more

The machine learning repository packed a training state, 99 weights and Adam's two running averages, into one vector of 298 numbers to get it through a loop, and a demo packed a game's state the same way. Tuples arrived for that: `(w, m, v, k)`, taken apart by patterns and never confused with arrays. The rule I gave them was narrow: use a tuple only when it adds value over an array. Records, sum types and pattern matching in the ML style were planned next and then not wanted: the language stays array-first and small.

## `_u`, for an argument nothing reads

A function that must accept an argument and ignore it, a combinator such as the Kestrel, or a lazy guard that is never forced, used to need a name and a lint directive to silence the unused-name warning: the warning was wrong, and the source had to say so. Now `_u`, drawn `▁`, is a parameter nothing can read, so there is nothing to warn about. With `~` it is also never computed:

```text
ᵘk̲eep ← { a ~▁ → a }
```

`7 ᵘk̲eep 1 ÷ 0` gives 7, and the division never happens.

## What it refused, to stay small

Most of what X_eTaL left out was left out to keep it from growing without a reason. Some of the refusals, with the reason recorded at the time:

- **A notation string, `n"..."`**, beside the code string: "declined as a creeping feature". It would have cost a lexer kind, a formatter case and a lint to carry one fact the macro's contract already states.
- **A raw code string, `cr"..."`, and nested code strings:** one kind of code string, one level deep, was enough.
- **Keywords.** No `mut` and no `use`: mutation is a `!` on a name, and an import is a macro. "Avoid introducing keywords" was the rule from the first evening.
- **Aliases for built-ins:** one name per built-in, so there is one thing to learn and to read.
- **Equations in the grammar:** a library of macros instead, with no change to the compiler.
- **Records, sums and matching in the ML style:** not wanted; the language stays array-first.
- **Lisp's reader macros, and macros in the style of Rust's syn and quote:** the first lets a program redefine the language by accident, the second is more machinery than the problem needs; contracts sit in between.
- **Macros used because they can be:** a macro in a demo, or an extension, has to earn its place.
- **A copy of each function per argument type, as Julia makes:** one body, checked once.
- **Shapes in types:** asked for three times, declined three times; array types do not carry their rank, and shapes are checked when the program runs.
- **Regular expressions in the core:** a library can bring them, from a Rust crate.
- **APL's del editor, and a build that needs Node:** a terminal editor in Rust, and nothing else in the build.
- **Implicit trains and J's hook:** a second reading for a row of names; the brackets keep one. **Named dyadic trains:** a lambda says it. **Haskell's sections:** a function given one argument is an error with the fixes named.
- **Settings for the index origin and the comparison tolerance,** which APL has: X_eTaL fixes the origin at 1 and puts the tolerance in a function of its own, `e̲q~`, so no setting changes what a program means.

## Still open

Some questions are written down and left open, each to be decided the same way: whether `a̲ssert<` should stop the program, as Rust's `assert!` does; algebraic data in an array-first form; complex numbers, which the FFT is waiting for; macros defined in a program itself rather than only in a macro library it imports; and how libraries are shared. For now there is no package manager: libraries come in through `u̲se<`, with an alias chosen by the program, and the sibling repositories are the ecosystem.
