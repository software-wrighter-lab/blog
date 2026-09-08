---
layout: post
title: "AI Tools #3: sw-checklist --- Reining In AI Coding Agents With a Code-Metrics Ratchet"
date: 2026-04-27 02:00:00 -0700
categories: [cli-tools, rust, ai-tools]
tags: [sw-checklist, personal-software, rust, cli, code-metrics, accidental-complexity, essential-complexity, brooks, mythical-man-month, no-silver-bullet, hickey, simple-made-easy, tech-debt, ratchet, vibe-coding, ai-coding, tdd, linter, forcing-function]
keywords: "sw-checklist, accidental complexity, essential complexity, Fred Brooks, No Silver Bullet, Mythical Man-Month, Rich Hickey, Simple Made Easy, complect, decomplect, tech debt, ratchet, vibe-coding, AI coding agents, code metrics, function LOC, module coupling, TDD, linter, forcing function, personal software, Rust CLI"
author: Software Wrighter
abstract: "sw-checklist is a personal-software Rust CLI I wrote to rein in AI coding agents: function/file/module/crate size limits enforced as warnings and failures. The post threads Brooks (essential vs accidental complexity) and Hickey (simple vs easy, complect vs decomplect) through that tool. The metrics are an accidental cost, but they pay rent --- AI agents that started out reacting to violations eventually anticipate them, and the long-run code stays focused on essential complexity. The metaphor for tech debt is a ratchet: clicks back are sometimes allowed, but the wrench only turns one way."
series: "AI Tools"
series_part: 3
repo_url: "https://github.com/softwarewrighter/sw-checklist"
---

<img src="{{ '/assets/images/posts/block-twisted-ropes.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

When I say "vibe-coding," the quotes are doing real work. I am not turning the AI loose and accepting whatever lands. I am using AI agents the same way I'd use a sharp tool with a guard on it: deliberately, with constraints that are themselves additional work. The constraints are *accidental* complexity in Brooks's sense --- they come from how I choose to build, not from the problem itself --- and yet I'd argue they are the only reason the code stays focused on the *essential* complexity that actually matters. [sw-checklist](https://github.com/softwarewrighter/sw-checklist) is the personal-software tool I wrote to keep that discipline in the loop.

</div>

<div class="aside-box" markdown="1">

**Why this matters** --- It is easy to confuse "the AI is fast" with "the AI is producing good code." Without forcing functions --- code metrics, a linter, a TDD loop --- a generative agent will happily emit a 600-line file with 12 functions per module and 9 modules per crate, none of which are technically wrong, all of which are technically a mess. The interesting question is not whether to spend on accidental complexity, but *which* accidental complexity earns its keep.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-checklist** | [softwarewrighter/sw-checklist](https://github.com/softwarewrighter/sw-checklist) |
| **No Silver Bullet (Wikipedia)** | [en.wikipedia.org/wiki/No_Silver_Bullet](https://en.wikipedia.org/wiki/No_Silver_Bullet) |
| **Rich Hickey --- Simple Made Easy** | [infoq.com/presentations/Simple-Made-Easy](https://www.infoq.com/presentations/Simple-Made-Easy/) |
| **Related Personal Software post** | [pjmai-rs: Navigation History and Fuzzy Completion](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Brooks: Essential vs Accidental Complexity

Fred Brooks's *No Silver Bullet* (1986, later folded into the 20th-anniversary edition of *The Mythical Man-Month*) draws the line that has framed this argument for forty years:

- **Essential complexity** is the complexity inherent in the problem itself. Modeling tax law is hard because tax law is hard. There is no clever framework that erases the irregularities of the rules.
- **Accidental complexity** is the complexity introduced by the tools, languages, and processes we use to attack the problem. CRUD boilerplate, build-system friction, framework idioms --- none of it is part of the problem; all of it is part of the cost of solving the problem with the tools at hand.

Brooks's punchline was that decades of progress had eaten most of the *accidental* complexity (assemblers, then high-level languages, then garbage collection, then better debuggers), and that future productivity gains would have to come from attacking *essential* complexity --- which is much harder, because it sits inside the problem and refuses to be abstracted away.

That framing still holds. What it does not say --- and what is the interesting modern question --- is that *not all accidental complexity is waste*. Some of it is investment. Some of it pays rent.

## Hickey: Simple vs Easy, Complect vs Decomplect

Rich Hickey's *Simple Made Easy* (Strange Loop 2011) sharpens the same axis from a different angle. Restating it briefly --- and this is my paraphrase, not a quote:

- **Simple** is *un-complected*: one role, one task, one concept, not braided with anything else. The Latin root is *simplex* --- one fold.
- **Easy** is *familiar* and *near-at-hand*: requires little new learning, fits the muscles you already have.
- **Complex** is *complected* --- braided, interleaved, two or more concerns sharing a single piece of code.

Hickey's central claim is that we mistake *easy* for *simple*. Reaching for the familiar tool is easy, but it often produces complected code: classes that hold both state and identity, functions that mix decisions with effects, modules that interleave domain logic with transport. Easy now, complex later. *Simple*, by contrast, is often *not* easy --- it requires more upfront thought to keep concerns separated --- but the resulting code is decomplected and stays decomplected as it grows.

Brooks tells you *what kind* of complexity you are paying. Hickey tells you *how the payment compounds*. Together they suggest a strategy: accept some accidental cost up front if and only if the payment buys you *simple* --- decomplected, single-role --- code.

## The Investment Thesis

This is the move I want to defend: *some accidental complexity is the cheapest known way to preserve the focus on essential complexity*.

A linter is accidental. It rejects code that the language would otherwise compile. The cost is real --- the AI agent burns tokens fixing line lengths, the human burns minutes reading diagnostics. The payment is that the next reader can recognize patterns instantly because the surface is uniform.

A TDD loop is accidental. It demands two passes for every line of behavior --- the test that fails, then the code that makes it pass. The cost is doubled output. The payment is that essential changes become localized: when the model of the world is wrong, the test names tell you exactly which assumption broke.

Code metrics are accidental. There is nothing wrong, in the language sense, with a 600-line file or a module that holds 12 functions. The payment is that thresholds force the *next* level of decomposition --- a 25-line function ceiling makes you name the sub-step; a 4-functions-per-module warning makes you ask whether two of those functions are really one thing braided with another. Hickey would call that *decomplecting*.

In all three cases the accidental complexity is paying rent on essential clarity.

## sw-checklist as a Forcing Function on AI Agents

[sw-checklist](https://github.com/softwarewrighter/sw-checklist) is a Rust CLI I run against a project to check conformance. It auto-detects project type --- Rust crate, workspace, CLI tool, web UI --- and runs the appropriate checks. The interesting checks for this post are the *modularity* ones:

| Check | Warn | Fail |
|-------|-----:|-----:|
| Function lines of code | > 25 | > 50 |
| File lines of code | > 350 | > 500 |
| Functions per module | > 4 | > 7 |
| Modules per crate | > 4 | > 7 |
| Crates per project | > 4 | > 7 |

The numbers themselves are debatable. What is not debatable is what they do to the *agent's* behavior over time. There are two regimes:

- **Reactive.** The agent writes whatever it wants, runs the checklist, sees a failure on "module X has 9 functions," and rewrites to split. This costs tokens. It also produces good code --- the split is often the decomplecting step that the agent would have skipped on its own.
- **Anticipatory.** Eventually the agent starts splitting *before* the checklist runs. New code lands closer to the thresholds on the first pass, with named sub-modules and small functions, because the agent has internalized the constraint as a writing style rather than a post-hoc fix-up.

The transition is the interesting moment. It does not happen on day one. It happens after enough cycles that the model has built up a gradient toward the shape of the constraint. From then on, the accidental cost shrinks because the agent is no longer paying for re-writes --- it is writing decomplected code on the first try.

The linter and the TDD loop have the same shape. Each one is an accidental cost up front and a *style* eventually. Each one decomplects a different axis: the linter normalizes the surface, TDD localizes the model, sw-checklist enforces the decomposition.

## The Ratchet

<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/block-ratchet-wrench.webp' | relative_url }}" class="gutter-img-left no-invert" alt="Ratchet wrench">

Tech debt grows when *anything* is allowed to slide. The naive policy --- "we'll clean it up later" --- reliably produces a heap. The opposite policy --- "no debt, ever" --- reliably produces paralysis.

The policy I aim for is a ratchet:

- The wrench turns one way.
- Sometimes a tooth slips back --- a temporary hack, a function over the threshold, a test marked `ignore` while a bigger refactor lands.
- The next click *must* be forward. Slips are bounded; the trend is monotone.

A ratchet does not promise that every commit reduces debt. It promises that the *cumulative* direction is reduction. That promise is enforceable: at every cycle, ask "is the metric better or worse than last commit?" and refuse to merge a regression unless it is consciously, visibly, paying for a larger forward turn.

This is the connecting tissue between the Brooks framing and the day-to-day. If accidental complexity is investment, the ratchet is what protects the investment from being clawed back by the next sprint's deadline.

</div>

## De-complexifying as a Practice

Pull the threads together:

1. Brooks: distinguish accidental from essential complexity, and *spend on accidental cost* only where it preserves essential clarity.
2. Hickey: aim for *simple* (decomplected), not just *easy* (familiar). The two are not the same and confusing them is how complected code grows.
3. The investment thesis: linter, TDD, and code metrics are accidental costs that pay rent in decomplecting --- they make essential complexity stay visible.
4. The forcing function: AI agents respond to constraints first reactively, then anticipatorily. The sooner the constraint is in the loop, the sooner the agent's output moves from messy-and-correct to focused-and-correct.
5. The ratchet: tech debt may slip a tooth but the wrench only turns one way. Cumulative direction matters more than per-commit purity.

The phrase I keep coming back to is *de-complexify*. It is not the same as *simplify*. Simplifying is reducing scope; de-complexifying is keeping the same scope while pulling the strands apart so each strand has one job. Hickey's word for the move is *decomplect*. Brooks would call the result a code base where the essential complexity is *visible* and the accidental complexity is *bounded*.

Vibe-coding done well is exactly that: AI agents producing focused, decomplected code, fast, because the constraints are doing the de-complexifying work in the background and the agent has learned to write inside them.

The constraints cost something. They are accidental complexity. They are also the only way I have found to keep the essential complexity in view long enough to actually solve it. sw-checklist is one piece of that personal-software toolkit --- a small CLI whose only job is to make the next decomplecting step impossible to ignore.
