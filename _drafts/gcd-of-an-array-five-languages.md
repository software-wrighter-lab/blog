---
layout: post
title: "One Small Problem, Five Languages: Why X_eTaL Brackets Its Forks"
categories: [languages, language-design]
tags: [xetal, x-etal, apl, j, haskell, lisp, racket, clojure, bqn, tacit, point-free, trains, fork, combinators, leetcode, gcd]
keywords: "LeetCode 1979, find greatest common divisor of array, gcd min max, APL train, J fork, J hook, Haskell liftM2 point-free, Racket gcd, Clojure gcd, X_eTaL train, fork combinator, S' combinator, phoenix, tacit programming"
abstract: "LeetCode 1979 asks for the greatest common divisor of an array's smallest and largest numbers. Conor Hoekstra solved it in sixteen languages; here it is in five, APL, J, Haskell, Lisp and X_eTaL, all asking for the same shape: one argument handed to two functions, their results to a third. APL and J write that fork as three functions side by side; X_eTaL needs brackets around them. This post is about why."
date: 2026-10-19 12:00:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (2026-10-19), from a conversation with an agent about GCD in X_eTaL. No series (Mike: "maybe deep dive or general").
     X_eTaL: run with xetal at X_eTaL 87cc1031 (clean build) and X_eTaL-libraries 357849b (Numbers), shown as xetal render draws it.
     Note: xetal run prints each statement's value; the conversation's p_rint! lines printed twice for that reason, not a quirk.
     APL: GNU APL 2.0 ran the lambda; it rejects the train (SYNTAX ERROR: APL2 has no trains). The train is code_report's (Dyalog),
     not run here. J: J 9.7.1 ran code_report's fork and the two-verb hook. Haskell, Racket, Clojure, BQN: code_report's files,
     quoted, not run here.
     Combinators: B and S from X_eTaL main's lib/Combinators.xtl, run and linted. Step 156 (Phoenix and Psi, c:P_hi) was
     uncommitted when this was written (previewed from a copy: 'u:m_ost 'u:l_east 'n:g_cd c:P_hi gives 2 1 3); once it lands an
     Ed. note can show the one-bird form.
     Lead image: Mike's block-phoenix.jpg (2026-10-19; replaced the screenshot of the five solutions), dark, not inverted. -->

<img src="{{ '/assets/images/posts/block-phoenix.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[LeetCode 1979](https://leetcode.com/problems/find-greatest-common-divisor-of-array/) is a small problem: given an array of numbers, return the greatest common divisor of its smallest and its largest. For `2 5 6 9 10` that is the GCD of 2 and 10, which is 2. (Not the GCD of the whole array, which is 1: the title says "of array", but the problem means its two extremes.)

<!--more-->

In 2021 Conor Hoekstra solved it in [sixteen languages](https://www.youtube.com/watch?v=UVUjnzpQKUo) on his code_report channel, with each solution [on GitHub](https://github.com/codereport/LeetCode). I asked an agent how to write it in X_eTaL, and the answer turned into a question about notation: why does X_eTaL need brackets for something APL and J write with no brackets at all?

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The problem** | [LeetCode 1979: Find Greatest Common Divisor of Array](https://leetcode.com/problems/find-greatest-common-divisor-of-array/) |
| **Sixteen languages** | code_report: [1 Problem, 16 Programming Languages](https://www.youtube.com/watch?v=UVUjnzpQKUo) and [the follow-up](https://www.youtube.com/watch?v=LWgcukcpo9A); the solutions in [codereport/LeetCode](https://github.com/codereport/LeetCode) (`0255_Problem_1.*`) |
| **X_eTaL** | [Numbers](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Numbers/src/Numbers.xtl) (`g_cd`), and trains in [lang-choices.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md) (TR1 to TR4) |
| **The series** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Naming the argument: Lisp

The direct solution names the array and says what to do with it. Hoekstra's Racket:

```racket
(define (find-gcd nums)
  (gcd (apply min nums)
       (apply max nums)))
```

His Clojure is the same, with `gcd` from `clojure.math.numeric-tower`. Nothing here is hard to read, and `nums` appears twice: once for the smallest, once for the largest. Every other solution below is a way of not writing that name.

## Haskell: liftM2

```haskell
import Control.Monad (liftM2)

findGCD = liftM2 gcd minimum maximum
```

There is no argument at all. For functions, `liftM2 f g h` is the function `\x -> f (g x) (h x)`: give the same `x` to `g` and to `h`, then combine their results with `f`. Here that is `gcd (minimum xs) (maximum xs)`. The pattern has names in combinatory logic, the S' combinator, or the Phoenix in Smullyan's birds, and in the array languages it is called a fork.

## APL and J: three functions side by side

In APL `∨` is GCD (on Booleans it is "or", and GCD is how it generalizes). Hoekstra's solution:

```text
findGCD ← ⌈/∨⌊/
```

Three functions in a row, `⌈/` (the largest), `∨` and `⌊/` (the smallest), with nothing between them, form a *train*. A train of three is a fork: `(f g h) x` is `(f x) g (h x)`. That works in Dyalog APL. It does not work in the APL2 dialect that GNU APL implements, which has no trains; there the three are read as ordinary functions and the line is a `SYNTAX ERROR`. The explicit form runs in both:

```text
      {(⌈/⍵)∨⌊/⍵} 2 5 6 9 10
2
```

Trains come from J, where the hook and the fork first appeared (from Iverson and McDonnell's "Phrasal Forms", 1989), and J has the same fork in ASCII: `>./` is the largest, `<./` the smallest, `+.` GCD:

```text
   findGCD =. <./+.>./
   > findGCD each (<2 5 6 9 10),(<7 5 6 8 3),<3 3
2 1 3
```

The fork is not marked anywhere. What makes the three functions a fork is that they are three functions with nothing after them, and how many there are matters: in J two functions side by side are a *hook*, `(f g) y` is `y f (g y)`, a different combinator. So `(<./ >./) 2 5 6 9 10` is not the smaller of the largest; it is each number's smaller with 10:

```text
   (<./ >./) 2 5 6 9 10
2 5 6 9 10
```

BQN, Hoekstra's third array language, has the same fork, `⌈´GCD⌊´`, with a GCD it defines first, since BQN has no GCD primitive.

## X_eTaL: the same fork, in brackets

X_eTaL's GCD is in the Numbers library, Euclid's algorithm applied item by item:

```text
ʰe̲uclid ← { a b → b = 0 ? a̲bs a◆ b ʰe̲uclid a m̲od b }
ˡg̲cd ← { a b → a 'ʰe̲uclid e̲ach b }
```

Imported under the alias `n:` (the importer chooses it; `n:` for Numbers), `12 ⁿg̲cd 8 9 10 0` gives `4 3 2 12`. The LeetCode function, naming its argument as the Lisp does:

```text
"n:" u̲se< "Numbers"
ᵘf̲indGcd ← { nums → ('m̲in r̲/ nums) ⁿg̲cd 'm̲ax r̲/ nums }
```

and as a fork, with no name for the argument:

```text
"n:" u̲se< "Numbers"
ᵘf̲indGcd ← ['m̲in r̲/ ⁿg̲cd 'm̲ax r̲/]
ᵘf̲indGcd 2 5 6 9 10
ᵘf̲indGcd 7 5 6 8 3
ᵘf̲indGcd 3 3
```

```text
2
1
3
```

`'m̲in r̲/` is the minimum reduction (a quoted function given to reduce), `'m̲ax r̲/` the maximum, and `ⁿg̲cd` combines them. Both versions pass the linter without a finding. Take the brackets away and the line is an error:

```text
error[type-mismatch]: expected a number, found Int -> Int
 --> c.xtl:2:1
  |
2 | 'm_in r_/ n:g_cd 'm_ax r_/ 2 5 6 9 10
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  |           --------------------------- this is an Int -> Int
  = help: this is a function still waiting for an argument: give it one, or quote it ('f_) to pass the function itself
```

The fork is also a combinator, and X_eTaL has a library of them: Combinators, Smullyan's birds from *To Mock a Mockingbird*, built into `xetal`. The fork's bird, Curry's Phoenix, is not one of Smullyan's, so the library does not have it yet. Two of his birds make one, though: Φ c f g = S (B c f) g. The Bluebird `B` joins the GCD to the least number, which leaves a function still waiting for its other argument. The Starling `S` hands the same array to that function and to the largest:

```text
"n:" u̲se< "Numbers"
"c:" u̲se< "Combinators"
ᵘm̲ost ← 'm̲ax r̲/
ᵘl̲east ← 'm̲in r̲/
ᵘg̲cdLeast ← 'ᵘl̲east 'ⁿg̲cd ᶜB̲
'ᵘm̲ost 'ᵘg̲cdLeast ᶜS̲ 2 5 6 9 10
'ᵘm̲ost 'ᵘg̲cdLeast ᶜS̲ 7 5 6 8 3
'ᵘm̲ost 'ᵘg̲cdLeast ᶜS̲ 3 3
```

```text
2
1
3
```

This is Haskell's `liftM2 gcd minimum maximum` built from birds: two libraries, two imports, no lambda and no brackets. It is longer for two reasons. The birds take quoted functions, and a quote takes a name, a lambda or a train ([F4](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md)), so the reductions need names; and without a Phoenix the fork takes two birds. The bracketed fork writes the same thing with neither.

## Why the brackets

Without brackets X_eTaL reads that line the only way it reads any line: right to left, each function applied to what is on its right. `'m̲ax r̲/` takes the array and gives 10. `ⁿg̲cd` takes 10 as its right argument and is still waiting for its left one, and nothing gives it one. There is no second reading to fall back on.

That is a choice. A fork needs one thing that plain application cannot do: hand the *same* argument to two functions. Composition does not need it. In X_eTaL `n̲eg a̲bs -5` is already "negate the absolute value", with no brackets, because each function takes the result of the one on its right. Duplicating the argument is the new part, and every language above marks it somehow. The Lisp names the argument and writes the name twice. Haskell calls `liftM2`. APL and J mark it by position: three functions in a row, with no argument between them, are given a meaning they do not have anywhere else, and two in a row are given yet another.

X_eTaL marks the fork with brackets ([TR1](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/lang-choices.md)): `[F G H] x` is `(F x) G (H x)`. The brackets also settle what two functions mean. In X_eTaL `[F G] x` is `F (G x)`, as in BQN and Dyalog, not J's hook (TR2), and the same two functions in brackets give the smaller of the largest:

```text
ᵘf̲indGcd ← ['m̲in r̲/ 'm̲ax r̲/]
ᵘf̲indGcd 2 5 6 9 10
```

```text
10
```

Longer trains group from the right into forks (TR3), and a train turns into ordinary application before it runs, so the evaluator never sees one. One rule decides this: the language never chooses between two readings of the same text. A run of names means application, always, and the one construction that means something else is written so that it looks different.

## Five ways to say it

| Language | Solution | The fork is |
|---|---|---|
| Racket | `(gcd (apply min nums) (apply max nums))` | the argument's name, written twice |
| Haskell | `liftM2 gcd minimum maximum` | a library function, `liftM2` |
| APL (Dyalog) | `⌈/∨⌊/` | three functions in a row |
| J | `<./+.>./` | three functions in a row (two would be a hook) |
| X_eTaL | `['m̲in r̲/ ⁿg̲cd 'm̲ax r̲/]` | brackets |

The array languages are the shortest, and X_eTaL pays two characters for its brackets. In return, a row of names in X_eTaL always means the same thing, and counting the functions never changes it.
