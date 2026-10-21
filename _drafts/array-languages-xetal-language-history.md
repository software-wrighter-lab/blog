---
layout: post
title: "Array Languages #16: How X_eTaL Changed Its Mind"
categories: [languages, language-design, process]
tags: [array-languages, xetal, x-etal, apl, language-design, history, decisions, macros, dogfooding, ai-agents]
keywords: "X_eTaL history, language design decisions, why a language changes, dogfooding, reversed decisions, no-ambiguity rule, macros instead of syntax, code strings, plain names, macro contracts, decisions register, lang-choices"
abstract: "Sixteenth in the Array Languages series: three weeks of an array language's history, told as reasons. Almost every change to X_eTaL's syntax and meaning came from one of five pressures, a program it had to run, a sibling repository that needed something, my own hands on the tools, a rule that the grammar may never guess, or a review that said stop. This post follows the record of what changed and why, including the decisions it reversed."
series: "Array Languages"
series_part: 16
date: 2026-10-22 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (2026-10-18). Source: X_eTaL docs/history.md, merged in PR #144 (2026-10-18T19:57Z), covering 2026-09-27 to 10-18;
     its numbers (1,057 commits, 143 merged pull requests, decisions D1 to D174) are as of that document; the normative record is
     docs/design.md section 9 and docs/lang-choices.md. Code: today's Life rule and the code-string call rendered with xetal render
     (X_eTaL main f027bb74); the research-era Life rule is quoted as it was typed in docs/research.txt (historical, never runnable).
     Follows #15 (10/21); links only to posts already published (#1-#11); later posts are "planned". RECHECK history.md before
     publishing: the user said more work is coming.
     RECHECKED 2026-10-21 on X_eTaL 72637325: history.md unchanged since 51b9de49 (10-18). Register now D1-D183 (body updated);
     reversal row added for D182 (_u supersedes D140's no opt-out spelling); notations drawn (D178) added to the arc; integrals
     dropped from the open questions (built, AL #13); a_ssert< (plan.md) and Saga 29 (under review) and Saga 31 (planned) still open.
     Commit and PR counts not used in the body (gh shows 137 merged PRs now vs history.md's 143: counted differently).
     Lead image: Mike's block-changed-mind.jpg (2026-10-19), dark background as is, not inverted. -->

<img src="{{ '/assets/images/posts/block-changed-mind.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

X_eTaL is three weeks old, and it has already changed its mind about its own syntax more than once. That is not a flaw in the process; it is the process. Every change is decided one question at a time, recorded with its reason, and pinned by tests, so the history can be read back. This post reads it back: not what was built, which the earlier posts covered, but why the language moved.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The history** | [docs/history.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/history.md) --- what changed in the syntax, when, and why |
| **The record** | [docs/lang-choices.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md) and the decisions register in [docs/design.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/design.md) |
| **The series** | [#1: X_eTaL](/2026/10/07/array-languages-xetal/) · [#11: equations](/2026/10/17/array-languages-xetal-equations/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## How a change is decided

The way the language is decided explains the way it changed.

- **One question at a time.** On the first day the language was settled as fifty numbered questions and six review items, each put to me and recorded. Every later change has gone the same way: a proposal, often with alternatives, my choice, an entry in `lang-choices.md`, and a row in the decisions register. The register grew from about 20 entries on the first day to 183 by October 21.
- **Tests define the language.** A syntax change starts with a failing test, and the decision is written into the design in the same commit.
- **Ambiguity is an error.** The parser never chooses between two readings, and what a token is comes from the token alone, never from types or context. This rule has decided more syntax questions than any other.
- **Dogfooding files the requests.** From the first week, the sibling repositories, demos, games, libraries, extensions and ML, have filed asks against the core, each with a code, and many decisions cite one.

## The first reversal, on the first day

The idea came first, in a long research conversation: an array language as terse as APL, typed in plain ASCII, where typographic decoration, an underline, a subscript, a raised letter, turns an ordinary letter into a function or a derived one. Its Life rule, as the research wrote it, was:

```text
life = { (+ r_ -1 0 1 t_12 _r) = 3 + _r }
```

The first code departed from the research, and re-reading the research the same day showed where. The decisions that came out of that first day still hold, and two principles from it explain much of what followed: *one key, one job*, and *a single letter cannot stand for every word that starts with it*. So there is no separate class of operators; a reduction is an ordinary function given a quoted function. Namespaces are a leading prefix, chosen by whoever imports a library. A raised `²` is an exponent. Built-ins are words with one underlined letter. Binding is `←` and `=` is always equality. The same rule today, rendered as it is drawn:

```text
ᵘl̲ife ← { ('+ r̲/₁₂ -1 0 1 o̲-₁₂ ⍵) { (⍺ = 3) + ⍵ × ⍺ = 4 } ⍵ }
```

It is also *correct* today, which the research's was not: checked against an APL implementation the next day, a blinker's center died, and the rule became Conway's.

## Five pressures

Looking across three weeks, almost every change came from one of five pressures.

1. **A program the language had to run.** Life forced axes, rotations along them and truth values that count, before most of the language existed.
2. **Dogfooding.** The classic APL programs forced nested arrays; the games forced a machine that can pause for input; the ML work and the demos forced tuples; the equation library forced macro contracts and plain names. The rule is that a workaround copied into more than one place is evidence, and the general mechanism moves into the core.
3. **My own hands on the tools.** Glyph choices, Unicode in strings, the controls of a live page, and the pipeline's two tokens were decided while I was using the tools, not reading about them.
4. **The no-ambiguity rule.** It rejected the research's raised reduce, kept equations out of the grammar, made `'^` an error, and made `|>` and `$` tokens rather than ligatures drawn over other characters.
5. **Release reviews.** A review on the eighth day turned the project from breadth to quality: speed, macros, documentation and, in time, readable errors.

## Decisions it reversed

The language changes its mind in the open: each reversal is recorded with its earlier form.

| When | Was | Became | Why |
|---|---|---|---|
| 09-27 | a raised letter as a namespace | a prefix, `ᵘ` for yours, chosen by the importer | read right to left, the raised forms needed a class of operators; prefixes are typeable and unambiguous |
| 09-27 | one-letter built-ins | words, `o̲-`, `t̲able` | one letter cannot stand for every word that starts with it |
| 09-28 | the research's Life rule | Conway's rule | checked against an APL implementation; a blinker's center died |
| 09-28 | lambda arguments drawn as small l and r | `⍺` and `⍵` | unreadable in my terminal's font |
| 09-30 | source wholly ASCII | strings and comments may hold any Unicode | a library could not greet with its drawn logo; code stays ASCII |
| 10-02 | a WASI target for the terminal | a steppable evaluator | pausing for input fits a machine whose state is data |
| 10-08 | binding a name again shadows it | names bound once | silent shadowing hid mistakes, and a survey found most rebindings were throwaway names |
| 10-12 | automatic macro hygiene | hygiene by choice, with fresh names on request | the renaming guessed at bytes and broke macros that bind a name on purpose |
| 10-17 | `e:q_<` and other short names | plain names, `ᵉe̲q<` | a name must read under any alias |
| 10-17 | a raw code string, `cr"..."`, proposed | `c"..."` and `c#"..."#` only | one level of code is enough |
| 10-20 | an unused parameter named, with a lint directive to silence its warning | `_u`, drawn ▁, a parameter nothing can read | a required but ignored argument had no spelling; the directive said the warning was wrong, not that nothing was there |

## The newest arc: notation inside strings

The last week has been about one problem: mathematical and pipeline notation that is not X_eTaL, and how to admit it without making the grammar ambiguous. The answer each time was a string handed to a macro, and each step made that string safer:

- **Equations as a library, not syntax.** A sum as a paper prints it is a string given to a macro, which checks it and writes array code. The compiler did not change.
- **Raw strings,** so a notation full of quotes and backslashes is readable; another spelling of the same string, not a new type.
- **Plain names,** after the equation macro's first name read as nothing under another alias.
- **Macro contracts,** after an equation reader dropped `^2` and summed the wrong thing in silence: a macro declares what it takes and uses, and the language checks.
- **Code strings,** because a macro's argument is often X_eTaL, but to every tool a plain string is opaque. A `c` in front says the inside is code, so it is drawn as code and read with the rest of the file:

  ```text
  _ ← c"n = 0" i̲f< c"p̲rint! 1◆ 2"
  ```

- **Two pipeline tokens,** `|>` drawn `▷` between stages and `$` drawn `▹` for a stage's label, each a token of its own that is an error in ordinary code.
- **Notations drawn by their library.** A macro side can be declared a notation, and its library can say how to draw it, so an equation written as a string is shown as typeset math wherever the program is drawn.

## What it does not settle

The open questions are written down too: records, enums and matching; complex numbers, which the FFT is waiting for; a data notation for X_eTaL values; and whether `a̲ssert<` should stop the program, as Rust's `assert!` does. Each will be decided the same way: one question, with the reason recorded and a test to hold it.
