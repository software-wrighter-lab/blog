---
layout: post
title: "Array Languages #17: What Makes a Practical Language, IMHO"
categories: [languages, language-design]
tags: [array-languages, xetal, x-etal, apl, haskell, rust, language-design, philosophy, static-typing, functional-programming, macros, ergonomics]
keywords: "programming language design philosophy, practical language, static typing, functional programming, small language core, macros and extensions, readability, no ambiguity, X_eTaL"
abstract: "Seventeenth in the Array Languages series, a companion to the sixteenth: my opinions, from experience, about what makes a programming language practical, read back out of X_eTaL's decisions. Read code at the point of use; one meaning per thing and no guessing; errors before the program runs; functional by default and practical where it must be; borrow on purpose and do not copy; keep the core small and grow it only on evidence; and treat the tools as part of the language. Macros and extensions keep the core concise, and the price of that is guarding the macros well."
series: "Array Languages"
series_part: 17
date: 2026-10-23 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (2026-10-22), Mike: the philosophy as its own post, a companion to #16 (published later or together); #16 was already
     ~15 minutes. Read back out of the decisions (blog scratchpad xetal-decisions.md; X_eTaL/work/summarized-decisions.md).
     Quotes: DOC ones are in X_eTaL's committed docs (lang-choices P1/P2, history section 17, adt.md, plan.md Saga 29, D161, wish-list);
     Mike's own words come from the design conversations (not in source control) and are attributed so. "Functional over
     object-oriented" is NOT a recorded statement of Mike's: written as what the language leaves out. Link #16 only once it is
     published (both may go out together). Ergonomics renumbered #18. Julia (Mike, 2026-10-22): the M5 decision, one body checked once vs Julia's per-call specialization;
     Mike's words from the design conversations (2026-10-12). Lead image: Mike's block-philosopher.jpg (2026-10-22, from Dropbox), monochrome, inverts in dark mode. -->

<img src="{{ '/assets/images/posts/block-philosopher.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

The previous post told how X_eTaL's decisions were made, one at a time. Read together, they say what I think a practical programming language should be. This is opinion, not a rule: it comes from my own experience of the languages I have used and the programs I have had to keep working, and other people's experience has led them, reasonably, to other languages. None of it was written down as a manifesto first; it is the pattern the choices make, checked against the record of why each was made.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The principles** | [lang-choices.md, section 1](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md) |
| **The decisions** | the register in [design.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/design.md), section 9 |
| **The series** | [#1: X_eTaL](/2026/10/07/array-languages-xetal/) · [#14: types, lints and errors](/2026/10/20/array-languages-xetal-typing-errors/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Read at the point of use

The first two principles X_eTaL wrote down are about reading. "Code is read more often than written." "A definition is written once and used many times": verbose definitions are fine, and terseness matters where a thing is used. That is why built-ins are words with one underlined letter rather than single letters, why names are plain rather than clever ("no puns, nothing picked for being short and clever"), and why the notation is drawn for the reader while it is typed in ASCII. APL's density was the goal; its special keyboard and its glyphs to memorize were not.

## One meaning per thing, and no guessing

"One key, one job", and "ambiguity is an error": these two rules decided more of X_eTaL's syntax than any other. A row of names always means application, so a train is marked with brackets. Each built-in has one name and no aliases. `_` discards a value and `_u` marks an unused parameter, rather than one underscore doing both. A `!` on a name says it mutates or has an effect. Wherever a feature would have given the same text a second reading, the language marks it instead of guessing.

## Errors before the program runs

I prefer static types to dynamic ones, and checks before running to checks while running. X_eTaL infers every type, so no annotation is required, and refuses a program whose types do not fit before it starts. Julia showed the other road: its functions are compiled again for each combination of argument types they are called with, a specialized copy per kind of call. I did not want that. In the design conversations: "I do not want to necessarily add explicit type notation, I do want type checks at compile time, not run time." So an X_eTaL function has one body, checked once where it is defined, and every call is checked against it before the program runs. Choices are typed values, not strings, because strings in a typed language are, as the plan puts it, "a code smell". The same instinct reached the macros, which are checked too, and the linter, and error messages that point at the line and say why. The worst outcome is an answer that is wrong in silence. No checker removes it entirely: a program can be well typed, lint clean and still compute the wrong thing, and logic errors are found by tests and by reading. What a language can do is close off whole classes of mistake, one at a time, and much of X_eTaL's later growth went into exactly that.

## Functional by default, practical where needed

Values are immutable, functions are curried, combinators are ordinary functions, and a function is a value like any other. But X_eTaL is not a functional language for its own sake: it is strict, with laziness only on a parameter that asks for it, and mutation is allowed, marked with `!`, rather than forbidden ("allow but discourage", in the design conversations). There are no classes and no objects, and records, sums and pattern matching in the ML style were planned and then left out; the language stays array-first.

## Borrow on purpose; do not copy

X_eTaL takes arrays and right-to-left reading from APL, the leading axis and the atop from BQN and J, its types from Haskell, and its macros, lints and diagnostics from Rust. Each borrowing came with a refusal beside it: Haskell's types but not its laziness; Rust's macros but not its `mut` keyword or an `assert!` that stops the program; BQN's atop but not its 0-origin. The question I asked on the first evening was how to "avoid re-inventing Lisp or Haskell (stay array focused)".

## A small core, grown only on evidence

The language changes when a real program needs it to, and not before. The history states the rule: "a workaround copied in more than one place is evidence, and a general mechanism moves down into the core." The design notes on data types put it the other way round: "a new language feature is added only where neither [a macro nor a convention] can do the job." And the rule for everyone else's code is the same: macros and extensions "need justification", and a demo should not use a macro just because it can. The last post's list of refusals is this principle at work.

## Macros and extensions keep the core concise

Extensibility is how the core stays small. Equations, pipelines and integrals are libraries of macros, with no change to the compiler. Regular expressions belong in an extension, from a Rust crate, not in the core. Blender, audio and the database live outside the language entirely, behind extensions.

But it is not free. Macros brought their own growth: macro libraries, hooks, hygiene, contracts, code strings, notations, a parsing library, and lints for macro authors. What kept the language small is that the additions were the mechanism and its guard rails, not the features built with them. The middle ground was deliberate: not Lisp's reader macros, which let a program redefine the language "by accident", and not "the complexity of Rust syn/quote macros", but a macro that declares what it takes and is checked against it.

## The tools are part of the language

A notation drawn as you type, a REPL, an editor that shows the drawn form beside the typed one, a live demo in the browser, errors that point at the line, a linter with fixes, completion: these arrived alongside the features, not after them. Some features exist only for the tools' sake: `_u` was added because a lint directive on every such line was poor ergonomics. A language is used through its tools, so I treat them as part of it.

## The trade

Put together, the philosophy is a trade: a small, readable, statically checked core, and growth pushed out into libraries, macro libraries and extensions, paid for by keeping the extension mechanism disciplined. Whether that trade holds up as the libraries grow is the open question every later post in this series will test.
