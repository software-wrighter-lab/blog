---
layout: post
title: "Rabbit-hole #6: The Sage Bird --- Y Combinators in an Eager Array Language"
categories: [rabbit-hole, programming-languages, deep-dive]
tags: [rabbit-hole, sw-mlpl, mlpl, combinators, y-combinator, z-combinator, fixed-points, sage, birds, aviary, lambda-calculus, recursion, eager-evaluation, functional-programming, array-languages, apl]
keywords: "Y combinator, Z combinator, fixed point, Sage bird, Smullyan, to mock a mockingbird, combinators, sw-MLPL, MLPL, eager evaluation, strict evaluation, recursion without a name, named partial, self-application, B M L, bluebird, mockingbird, lark, demo-combinators, apl2 idioms"
abstract: "A reader searched this blog for the Y combinator and found nothing, which was accurate --- so here is the post. Smullyan's Sage bird is the Y combinator, Y f = f (Y f), but an eager evaluator diverges if you ever call it. sw-MLPL is strict, so the aviary builds the fixed point with a named partial instead: the applicative Sage, the Z combinator in bird costume. Here is the classical construction, why it diverges, how the APL lineage sidesteps the whole problem, why sw-MLPL should stay eager, and a three-step recipe for running a Sage today --- no language changes required."
repo_urls:
  - url: "https://github.com/sw-ml-study/demo-combinators"
    title: "demo-combinators"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
series: "Down the Rabbit-Hole"
series_part: 6
date: 2026-09-21 00:15:00 -0700
---

<img src="{{ '/assets/images/posts/sage-bird-marker.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

Prior to this post, searching this site for "Y combinator" turned up nothing. The search engine was innocent: no post had ever covered it, despite the fact that the repos have carried working fixed-point combinators since August. This short post closes the gap.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Run the birds live** | [mlpl.softwarewrighter.com](https://mlpl.softwarewrighter.com/) --- Load Demo... > Array / APL > Combinators (the birds) |
| **The book** | [To Mock a Mockingbird](https://en.wikipedia.org/wiki/To_Mock_a_Mockingbird) --- Raymond Smullyan's aviary of combinator birds, in puzzle form |
| **Sage, CLI-side** | [sw-ml-study/demo-combinators](https://github.com/sw-ml-study/demo-combinators) --- lessons 17 (`fixed_points`), `src/fixed_points.mlpl`, and the derived-combinators doc |

</div>

## The bird

Raymond Smullyan's [To Mock a Mockingbird](https://en.wikipedia.org/wiki/To_Mock_a_Mockingbird) names the combinators after songbirds, and the Sage is the fixed-point bird: for any function `f`, the Sage produces a value `x` with `f(x) = x`. Composition gives it for free:

```text
Sage = B M L
     = Bluebird . Mockingbird . Lark
     = λf. (λx. f (x x)) (λx. f (x x))
```

That last line is the Y combinator in its classical form, and it satisfies exactly the recursive equation: `Y f = f (Y f)`. Feed it a factorial "body" that takes its own recursion as an argument, and the Sage hands that body back to itself, fully armed --- recursion without a name, no assignment, no `def`.

## The core aviary

In sw-MLPL every bird is an ordinary `def` --- no lambda syntax, no special machinery; the Smullyan name is the notation. The most common flock (this table is deliberately incomplete; [demo-combinators](https://github.com/sw-ml-study/demo-combinators) houses the Dove, Eagle, Phoenix, Lark, Owl and the rest of the aviary):

| Bird | λ-term | What it does | sw-MLPL |
|------|--------|--------------|---------|
| Identity | `λx.x` | returns its argument unchanged | `def u:I(x) { x }` |
| Kestrel | `λx y.x` | constant: holds x, ignores y --- staging | `def u:K(x, y) { x }` |
| Thrush | `λx y.y x` | applies the awaited function to the held value | `def u:T(x, y) { call(y, x) }` |
| Mockingbird | `λx.x x` | self-application | `def u:M(x) { call(x, x) }` |
| Bluebird | `λx y z.x (y z)` | composition | `def u:B(x, y, z) { call(x, call(y, z)) }` |
| Cardinal | `λx y z.x z y` | flips the last two arguments | `def u:C(x, y, z) { call(call(x, z), y) }` |
| Warbler | `λx y.x y y` | duplication | `def u:W(x, y) { call(call(x, y), y) }` |
| Starling | `λx y z.x z (y z)` | the S of the S-K basis: everything derivable from S and K | `def u:S(x, y, z) { call(call(x, z), call(y, z)) }` |
| **Sage** | `λf.(λx.f (x x)) (λx.f (x x))` | the fixed point --- this post's subject | `call(:u:bluebird, :u:mockingbird, :u:lark)` --- built, never forced; see below |

## The catch: eagerness

There is a reason this post is short and the lesson is careful. sw-MLPL is an eager language. The classical Sage, applied to anything, diverges immediately: constructing `(λx. f (x x)) (λx. f (x x))` demands `x x` before `f` is ever called, which demands `x x`, forever. `demo-combinators/src/fixed_points.mlpl` therefore defines the classical Sage as `call(:u:bluebird, :u:mockingbird, :u:lark)` and deliberately never forces it. `docs/derived-combinators.md` records this as a stopping point, not an oversight.

The fix is the one every strict language rediscovers: delay the self-application behind one layer of abstraction. In sw-MLPL the delay is a named partial --- a unary function the evaluator will not call until given a value:

```text
def u:applicative_sage(builder) { "Return the eager-safe fixed point of builder.";
  step = call(:u:z_step, builder);
  call(step, step)
}
```

This is the Z combinator wearing a bird costume, and it runs. [Lesson 17](https://github.com/sw-ml-study/demo-combinators/blob/main/lessons/17-sage-fixed-points.mlpl) builds `factorial` and `fibonacci` as fixed points of their builder functions --- `factorial(6)` and `fibonacci(8)` return correct answers with no recursive name anywhere in scope.

## What the APL lineage does instead

The APL family sidesteps the problem twice. Anonymous self-reference is a language primitive: a Dyalog dfn calls itself with `∇` (`{0=⍵:1 ⋄ ⍵×∇ ⍵-1}` is factorial with no name), BQN blocks have `𝕊`, q has `.z.s` --- the fixed point is built into function semantics, and Y is never needed for practical recursion. And the array style dissolves most recursion entirely: J's power-limit conjunction `^:_` applies a verb until its result stops changing (transitive closure is `+./ .^:_ y`), promoting fixpoint iteration to an operator. sw-MLPL has neither, which is exactly why the APL2-idioms plane --- the homage to that lineage --- is the file that had to reach for a fixed-point combinator in the first place.

## Should sw-MLPL change from eager to lazy?

No --- sw-MLPL should stay eager --- and the reasoning is short. Running the classical Sage requires lazy evaluation: `Y f = f (Y f)` terminates only if the inner `Y f` is not evaluated until someone actually needs it. Strictness is a feature of the APL lineage --- predictable cost, a simple evaluator --- and one bird is not a reason to trade it away. For practical recursion nothing is missing: named defs already self-reference by name, which is exactly how APL\360 and APL2 do it.

And APL2 itself has no lambdas. Anonymous functions are a Dyalog innovation (dfns), and every language that adopted them had to add a self-reference token to go with them --- `∇` in Dyalog, `𝕊` in BQN, `$:` in J, `.z.s` in q --- because a lambda does not solve recursion, it creates the problem APL never had. Named defs plus first-class function values is the APL2 design, on purpose. If anything ever gets added, the lineage-faithful direction is fixpoint iteration over arrays --- J's `^:_` or Dyalog's `⍣≡`, apply a verb until the result stops changing --- not lambda syntax.

## Run a Sage today, without changing anything

The classical bird dies because sw-MLPL opens every envelope the moment it arrives --- it demands `x x` before asking why. So don't hand it an envelope; hand it a phone number. A named partial is a function value that waits to be called, and that one beat of waiting is all the delay the fixed point needs. Three moves, all supported today:

**1. Write a body that receives its recursion as an argument.** The body never names itself; whoever calls it supplies the "me":

```text
def u:fact_body(rec, n) {
  if gt(n, 1) { n * call(rec, n - 1) } else { 1 }
}
```

**2. Tie the knot with the applicative Sage.** Copy `z_recur`, `z_step`, and `applicative_sage` verbatim from [`src/fixed_points.mlpl`](https://github.com/sw-ml-study/demo-combinators/blob/main/src/fixed_points.mlpl) --- or the one-line `u:fix` from `apl2-idioms.mlpl` if a named helper is acceptable:

```text
def u:applicative_sage(builder) {
  step = call(:u:z_step, builder);
  call(step, step)
}
```

**3. Call it.**

```text
fact = u:applicative_sage(:u:fact_body)
call(fact, 6)    # 720, with no recursive name anywhere in scope
```

[Lesson 17](https://github.com/sw-ml-study/demo-combinators/blob/main/lessons/17-sage-fixed-points.mlpl) runs exactly this --- `factorial(6)` and `fibonacci(8)` --- so the plumbing is checked before you trust it. The body stays pure; the machinery is three small defs; the language stays strict.

## Where it lives

- [`demo-combinators/src/fixed_points.mlpl`](https://github.com/sw-ml-study/demo-combinators/blob/main/src/fixed_points.mlpl) --- the classical Sage (unforced) and the applicative Sage (forced), with factorial and fibonacci bodies
- [`demo-combinators/lessons/17-sage-fixed-points.mlpl`](https://github.com/sw-ml-study/demo-combinators/blob/main/lessons/17-sage-fixed-points.mlpl) --- the runnable lesson
- [`sw-mlpl/docs/apl2-idioms.mlpl`](https://github.com/sw-ml-study/sw-mlpl/blob/main/docs/apl2-idioms.mlpl) --- `u:fix`, the same knot tied in the APL2-idioms plane, ending in `call(call(:u:fix, :u:fact_body), 5)`

One line of agent-written commentary survived in that last file, and it is correct: the startup accelerator named Y Combinator is named after this.
