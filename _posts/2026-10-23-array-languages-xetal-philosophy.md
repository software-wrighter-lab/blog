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
     object-oriented" is NOT a recorded statement of Mike's: written as what the language leaves out. #16 published 2026-10-22; linked. Ergonomics renumbered #18. Julia (Mike, 2026-10-22): the M5 decision, one body checked once vs Julia's per-call specialization;
     Mike's words from the design conversations (2026-10-12). Lead image: Mike's block-philosopher.jpg (2026-10-22, from Dropbox), monochrome, inverts in dark mode. -->

<img src="{{ '/assets/images/posts/block-philosopher.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[The previous post](/2026/10/22/array-languages-xetal-language-history/) told how X_eTaL's decisions were made, one at a time. Read together, they say what I think a practical programming language should be. This is opinion, not a rule, drawn from my experience: the languages I have used and the programs I have had to keep working. Other people's experience has led them, reasonably, to other languages. YMMV. None of it was written down as a manifesto first; it is the pattern the choices make, checked against the record of why each was made.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The principles** | [lang-choices.md, section 1](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md) |
| **The decisions** | the register in [design.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/design.md), section 9 |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Read at the point of use

<figure class="zoomable" style="float: right; clear: right; width: 45%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/xetal-phil-typed-drawn.webp' | relative_url }}" class="no-invert" alt="The live demo's two panes: the ASCII as typed, u:a_vg := ['+ r_/ / t_ally], u:k_eep := { a ~_u -> a }, u:s_ay! := { s -> p_rint! s }, with ## comments, and the same program drawn: the u: prefix as a superscript, built-ins with one underlined letter, arrows for := and ->, and ÷ for /">
<figcaption style="font-size: 0.85em;">The same lines as typed in ASCII (above) and as drawn for the reader (below), in the live demo. Click to enlarge.</figcaption>
</figure>

The first two principles X_eTaL wrote down are about reading. "Code is read more often than written." "A definition is written once and used many times": verbose definitions are fine, and terseness matters where a thing is used. That is why built-ins are words with one underlined letter rather than single letters, why names are plain rather than clever ("no puns, nothing picked for being short and clever"), and why the notation is drawn for the reader while it is typed in ASCII. APL's density was the goal; its special keyboard and its glyphs to memorize were not.

## One meaning per thing, and no guessing

<figure class="zoomable" style="float: right; clear: right; width: 45%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/xetal-phil-one-meaning.webp' | relative_url }}" class="no-invert" alt="A table, One spelling, one meaning: typed, drawn and what each means. A bracketed train is a train, a bare row of names is application; r_/ is a built-in by its one name; _ := p_rint! hi discards a value; ~_u, drawn as a low bar, is a parameter taken and never read; ~s_elf is a lazy parameter; a name ending in ! has an effect or mutates">
<figcaption style="font-size: 0.85em;">Each spelling has one job, as typed and as drawn. Click to enlarge.</figcaption>
</figure>

"One key, one job", and "ambiguity is an error": these two rules decided more of X_eTaL's syntax than any other. A row of names always means application, so a train is marked with brackets. Each built-in has one name and no aliases. `_` discards a value and `_u` marks an unused parameter, rather than one underscore doing both. A `!` on a name says it mutates or has an effect. Wherever a feature would have given the same text a second reading, the language marks it instead of guessing.

## Errors before the program runs
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-phil-type-error.webp' | relative_url }}" class="no-invert" alt="The live demo: the mean, ['+ r_/ / t_ally], applied to 3 5 7 9 and then to 1.5 2.5 4.0; the run stops before it starts with error[type-mismatch]: expected Int, found Float, pointing at line 4 and the Float argument, with help on f_loat, f_loor and c_eiling">
<figcaption style="font-size: 0.85em;">A Float vector given to an Int-only mean: refused before anything runs, at the line, with the fix. Click to enlarge.</figcaption>
</figure>

I prefer static types to dynamic ones, and checks before running to checks while running. X_eTaL infers every type, so no annotation is required, and refuses a program whose types do not fit before it starts. Julia showed the other road: its functions are compiled again for each combination of argument types they are called with, a specialized copy per kind of call. I did not want that. In the design conversations: "I do not want to necessarily add explicit type notation, I do want type checks at compile time, not run time." So an X_eTaL function has one body, checked once where it is defined, and every call is checked against it before the program runs. Choices are typed values, not strings, because strings in a typed language are, as the plan puts it, "a code smell". The same instinct reached the macros, which are checked too, and the linter, and error messages that point at the line and say why. The worst outcome is an answer that is wrong in silence. No checker removes it entirely: a program can be well typed, lint clean and still compute the wrong thing, and logic errors are found by tests and by reading. What a language can do is close off whole classes of mistake, one at a time, and much of X_eTaL's later growth went into exactly that.

## Functional by default, practical where needed
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/xetal-phil-lazy-curried.webp' | relative_url }}" class="no-invert" alt="The live demo: u:f_act defined with the Combinators macro c:Y_< from a lambda with a lazy self parameter, u:f_act 5 giving 120, and a curried u:a_dd given one argument to make u:i_nc, which gives 2 3 4 on 1 2 3">
<figcaption style="font-size: 0.85em;">Named recursion through a lazy self parameter, and a curried function given one argument. Click to enlarge.</figcaption>
</figure>

Values are immutable, functions are curried, combinators are ordinary functions, and a function is a value like any other. But X_eTaL is not a functional language for its own sake: it is strict, with laziness only on a parameter that asks for it, and mutation is allowed, marked with `!`, rather than forbidden ("allow but discourage", in the design conversations). There are no classes and no objects, and records, sums and pattern matching in the ML style were planned and then left out; the language stays array-first.

## Borrow on purpose; do not copy
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-phil-borrowed.webp' | relative_url }}" class="no-invert" alt="A table, Borrowed and left behind. APL: arrays, right-to-left reading and density taken; a special keyboard and glyphs to memorize not. BQN and J: the leading axis and the atop taken; BQN's 0-origin not. Haskell: inferred static types taken; laziness everywhere not. Rust: macros, lints and diagnostics taken; the mut keyword and an assert! that stops the program not">
<figcaption style="font-size: 0.85em;">What each influence gave, and what was left behind. Click to enlarge.</figcaption>
</figure>

X_eTaL takes arrays and right-to-left reading from APL, the leading axis and the atop from BQN and J, its types from Haskell, and its macros, lints and diagnostics from Rust. Each borrowing came with a refusal beside it: Haskell's types but not its laziness; Rust's macros but not its `mut` keyword or an `assert!` that stops the program; BQN's atop but not its 0-origin. The question I asked on the first evening was how to "avoid re-inventing Lisp or Haskell (stay array focused)".

## A small core, grown only on evidence
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/xetal-phil-asks.webp' | relative_url }}" class="no-invert" alt="A bar chart of what the sibling repositories asked of the language: 39 landed, 12 partly landed, 26 planned, 11 declined, 16 not yet triaged; 104 asks from seven repositories, from X_eTaL's docs/asks.md at 9f7d43f, 2026-10-23">
<figcaption style="font-size: 0.85em;">The asks ledger: changes requested by real programs, each with a repro, and some declined. Click to enlarge.</figcaption>
</figure>

The language changes when a real program needs it to, and not before. The history states the rule: "a workaround copied in more than one place is evidence, and a general mechanism moves down into the core." The design notes on data types put it the other way round: "a new language feature is added only where neither [a macro nor a convention] can do the job." And the rule for everyone else's code is the same: macros and extensions "need justification", and a demo should not use a macro just because it can. The last post's list of refusals is this principle at work.

## Macros and extensions keep the core concise
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-phil-layers.webp' | relative_url }}" class="no-invert" alt="Four nested layers, Growth pushed outward: the core (arrays, built-ins, inferred types, and the macro mechanism with its guard rails); libraries of ordinary X_eTaL functions; macro libraries (equations, pipelines, integrals, parsing, combinators); and extensions, Rust crates for regular expressions, Blender, audio and the database">
<figcaption style="font-size: 0.85em;">Where growth goes: out of the core and into libraries, macro libraries and extensions. Click to enlarge.</figcaption>
</figure>

Extensibility is how the core stays small. Equations, pipelines and integrals are libraries of macros, with no change to the compiler. Regular expressions belong in an extension, from a Rust crate, not in the core. Blender, audio and the database live outside the language entirely, behind extensions.

But it is not free. Macros brought their own growth: macro libraries, hooks, hygiene, contracts, code strings, notations, a parsing library, and lints for macro authors. What kept the language small is that the additions were the mechanism and its guard rails, not the features built with them. The middle ground was deliberate: not Lisp's reader macros, which let a program redefine the language "by accident", and not "the complexity of Rust syn/quote macros", but a macro that declares what it takes and is checked against it.

## The tools are part of the language
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/xetal-phil-lint.webp' | relative_url }}" class="no-invert" alt="The live demo after Lint: a Fix 2 button in the toolbar, the drawn program, and two warnings: parameter b is never used, write _u for a parameter nothing reads; and u:s_ay calls p_rint!, an effect, but its name has no !, write u:s_ay!">
<figcaption style="font-size: 0.85em;">The linter in the live demo: two warnings, each saying what to write, and a button that applies both. Click to enlarge.</figcaption>
</figure>

A notation drawn as you type, a REPL, an editor that shows the drawn form beside the typed one, a live demo in the browser, errors that point at the line, a linter with fixes, completion: these arrived alongside the features, not after them. Some features exist only for the tools' sake: `_u` was added because a lint directive on every such line was poor ergonomics. A language is used through its tools, so I treat them as part of it.

## The trade
{: .pos-center}

Put together, the philosophy is a trade: a small, readable, statically checked core, and growth pushed out into libraries, macro libraries and extensions, paid for by keeping the extension mechanism disciplined. Whether that trade holds up as the libraries grow is the open question every later post in this series will test.
