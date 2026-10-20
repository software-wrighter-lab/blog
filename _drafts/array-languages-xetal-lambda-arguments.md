---
layout: post
title: "Array Languages #17: ⍺, ⍵ and ▁, How an X_eTaL Lambda Takes Its Arguments"
categories: [languages, language-design]
tags: [array-languages, xetal, x-etal, apl, lambda, dfn, alpha, omega, lazy-evaluation, call-by-need, unit, tuples, pattern-matching, lint, language-design]
keywords: "X_eTaL lambda, APL dfn alpha omega, shorthand lambda arguments, named parameters, unused parameter, lazy parameter, call by need, niladic function, unit, tuple pattern, wildcard, unused-binding lint"
abstract: "Seventeenth in the Array Languages series: every way an X_eTaL lambda can take its arguments. ⍺ and ⍵ for the left and right, as in an APL dfn; named parameters; @ for none at all; ~ for an argument evaluated only if it is used; tuple patterns; and the newest, ▁, for an argument the function takes but never uses, which came out of a side question about an unused parameter and a lint that would not stop warning about it."
series: "Array Languages"
series_part: 17
date: 2026-10-23 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (2026-10-20). Every row except the _u ones run on a clean build of X_eTaL main 0b427a30 and drawn with xetal render.
     PENDING: _u (step 157, decision L8, drawn U+2581 ▁) is being built in X_eTaL and was UNCOMMITTED when this was written.
     Every line with ▁ is PROVISIONAL: when step 157 lands, run each _u row (results in the table come from the X_eTaL agent's
     table, not from a run here), re-render, check the error messages' exact text, and link the commit. Until then, do not publish.
     Sources: lang-choices L1-L8, E1, E2, E4, TU3, TU4; design D140 (unused-binding, now superseded by L8); history.md (alpha/omega).
     The _u idea came from Mike's side question on 2026-10-20 (u:n_ope's unused parameter). Follows #16 (10/22); links only to
     published posts. Lead image: PLACEHOLDER (scripts/placeholder-marker); Mike will supply one. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-lambda-arguments.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

An X_eTaL lambda is written in braces, and how it takes its arguments is written inside them too. Most of the time that is one letter. ⍺ and ⍵, the left and right argument, came from APL's direct functions, and the rest came one question at a time: what if there is no argument, what if the argument is expensive, what if it is a pair, and, this week, what if the function is handed an argument it has no use for.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The decisions** | [lang-choices.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md): L1 to L8 (lambdas), E1 and E2 (laziness), TU3 and TU4 (patterns) |
| **The lint** | [docs/lint.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lint.md): `unused-binding` |
| **The series** | [#1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Two ways to write a lambda

A lambda either uses the shorthand arguments or names its parameters, never both in one lambda (L5). The shorthand is typed `_l` and `_r` and drawn ⍺ and ⍵; how many of them the body uses decides how many arguments the lambda takes:

```text
ᵘf̲n ← { ⍵ × 2 }
ᵘf̲n 5
```

```text
10
```

```text
ᵘf̲n ← { ⍺ − ⍵ }
3 ᵘf̲n 5
```

```text
-2
```

Named parameters are listed before an arrow, and are drawn as written: `{ x → x × 2 }` and `{ x y → x − y }` are the same two functions. They desugar to nested one-argument lambdas (L4), so a two-argument function is curried.

## ⍺ and ⍵

The shorthand arguments were first drawn as small subscript l and r. They lasted a day: in my terminal's font a subscript l was unreadable, and on the second day they became APL's alpha and omega, which every APL reader already knows as a dfn's left and right argument.

One rule keeps the shorthand honest (L1): `_r` alone makes a one-argument lambda, and `_l` exists only beside `_r`. A left argument with no right one is not a function X_eTaL can call, so the lambda is refused, with the fix:

```text
ᵘf̲n ← { ⍺ × 2 }
```

```text
error[bad-lambda]: a lambda using _l must also use _r; otherwise name the parameters
```

## Nothing: @

A function of no arguments takes `@`, the unit value, and is called with it (L6):

```text
ᵘf̲n ← { @ → 42 }
ᵘf̲n @
```

```text
42
```

It takes only `@`. Called with a number, it is a type error before the program runs, `expected Unit, found a number`. A lambda with no arguments at all, `{ 42 }`, is refused: a lambda needs ⍵, ⍺ and ⍵, named parameters, or `@ →`.

## Ignored: ▁

<!-- PROVISIONAL until step 157 lands: every ▁ line, its results and error text. -->

The newest case came from a side question. A function had to accept an argument and had no use for it:

```text
ᵘn̲ope ← { na → 42 }
```

It runs, and `xetal lint` warns, correctly as far as it can tell: `parameter na is never used`. Until now the only way to say "unused on purpose" was a directive, `# lint: allow unused-binding`, at the end of the line or on the line before. That was a deliberate choice, made when the lint was (D140): no spelling of a name would opt out. It was wordy for a common case, and it said "the warning is wrong here" rather than "there is nothing here to use".

So X_eTaL gets a third shorthand name, `_u`, for a parameter that is taken and dropped (L8). It stands only in a parameter list, may repeat, and is never read: using it in the body is an error that says to name it. The linter never flags it, so no directive is needed. It is drawn as a heavy low line, ▁, a thicker underscore, so that it reads as an empty slot:

```text
ᵘf̲n ← { ▁ → 42 }
ᵘf̲n 5
```

```text
42
```

Why not `_`, which already means "discard"? Because it already has its job: `_ := expr` keeps a value only for its effect, and `(a, _)` skips a part of a pair (TU4). Keeping `_` to values and `_u` to parameters means each spelling has one meaning.

`_u` also fills the gap that L1 leaves. A two-argument function that ignores its right argument has no shorthand, since `{ ⍺ × 2 }` is refused, but it has a short named form that says what it drops:

```text
ᵘf̲n ← { x ▁ → x × 2 }
3 ᵘf̲n 5
```

```text
6
```

## Lazy: ~

Arguments are evaluated before the function runs, right to left (E4), unless a parameter is marked lazy with `~`: then its argument is evaluated where the body first reads it, and never if the body does not (E1). The [Sage bird](/2026/09/21/rabbit-hole-sage-y-combinator/) needs it, since a strict fixed point would recurse forever; here it makes the factorial out of a lambda that receives itself:

```text
"c:" u̲se< "Combinators"
ᵘf̲n ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }
'ᵘf̲n ᶜY̲ 5
```

```text
120
```

Laziness also protects a function from an argument it does not need. The tour's `ᵘk̲eep` returns its left argument; with an ordinary right parameter the caller's `1 ÷ 0` is computed first and stops the program, and with a lazy one it is never computed:

```text
ᵘk̲eep ← { a b → a }  ⍝ lint: allow unused-binding
7 ᵘk̲eep 1 ÷ 0
```

```text
error[division-by-zero]: division by zero
```

```text
ᵘk̲eep ← { a ~b → a }  ⍝ lint: allow unused-binding
7 ᵘk̲eep 1 ÷ 0
```

```text
7
```

With `_u` the two ideas combine. `{ a ~▁ → a }` says three things at once: the right argument is taken, it is dropped, and it is never even computed. No directive, and no division.

## Patterns

A parameter can also be a tuple pattern, which takes a pair apart as it arrives (TU3), and `_` skips a part:

```text
ᵘf̲n ← { (a, b) → a + b }
ᵘf̲n (3, 4)
```

```text
7
```

`{ (a, _) → a }` gives 3 for the same call.

## Every shape

| Shape | Definition | Call | Result |
|---|---|---|---|
| no argument | `ᵘf̲n ← { @ → 42 }` | `ᵘf̲n @` | 42 |
| one, used (shorthand) | `ᵘf̲n ← { ⍵ × 2 }` | `ᵘf̲n 5` | 10 |
| one, used (named) | `ᵘf̲n ← { x → x × 2 }` | `ᵘf̲n 5` | 10 |
| one, ignored | `ᵘf̲n ← { ▁ → 42 }` | `ᵘf̲n 5` | 42 |
| two, used (shorthand) | `ᵘf̲n ← { ⍺ − ⍵ }` | `3 ᵘf̲n 5` | -2 |
| two, used (named) | `ᵘf̲n ← { x y → x − y }` | `3 ᵘf̲n 5` | -2 |
| two, right ignored | `ᵘf̲n ← { x ▁ → x × 2 }` | `3 ᵘf̲n 5` | 6 |
| two, left ignored | `ᵘf̲n ← { ▁ y → y × 2 }` | `3 ᵘf̲n 5` | 10 |
| two, both ignored | `ᵘf̲n ← { ▁ ▁ → 0 }` | `3 ᵘf̲n 5` | 0 |
| ignored, never computed | `ᵘf̲n ← { a ~▁ → a }` | `7 ᵘf̲n 1 ÷ 0` | 7 |
| lazy, used | `ᵘf̲n ← { ~s̲elf n → n ≤ 1 ? 1◆ n × s̲elf n − 1 }` | `'ᵘf̲n ᶜY̲ 5` | 120 |
| unit among named | `ᵘf̲n ← { @ x → x × 2 }` | `@ ᵘf̲n 5` | 10 |
| tuple pattern | `ᵘf̲n ← { (a, b) → a + b }` | `ᵘf̲n (3, 4)` | 7 |
| pattern part skipped | `ᵘf̲n ← { (a, _) → a }` | `ᵘf̲n (3, 4)` | 3 |

And the spellings that are refused, each with the way out:

| Definition | Error |
|---|---|
| `ᵘf̲n ← { ⍺ × 2 }` | `bad-lambda`: a lambda using _l must also use _r; otherwise name the parameters |
| `ᵘf̲n ← { 42 }` | `bad-lambda`: a lambda needs _r, _l and _r, named parameters, or `@ ->` |
| `ᵘf̲n ← { x → x + ⍵ }` | `bad-lambda`: do not mix named parameters with _l / _r |
| `ᵘf̲n ← { ▁ + ⍵ }` | `bad-lambda-arg`: `_u` marks a parameter the lambda never uses; name it |
| `ᵘf̲n ← { x ▁ → ▁ }` | `bad-lambda-arg`: the same |
