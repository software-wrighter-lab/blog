---
layout: post
title: "Deep Learning #2: Recursive Self-Improvement, in Small Deterministic Experiments"
categories: [machine-learning, deep-learning, agents]
tags: [deep-learning, recursive-self-improvement, rsi, agents, agent-harness, tool-synthesis, guardian, ski-rental, xetal, x-etal, array-languages]
keywords: "recursive self-improvement, self-improving agent harness, Exo architecture, tool synthesis from history, policy evolution, recursive optimizer, economics of specialization, ski rental, transfer of learned tools, guardian and rollback, frozen model, X_eTaL array language, WebAssembly live experiments"
abstract: "Second in the Deep Learning series: X_eTaL-RSI, small deterministic experiments in recursive self-improvement after Exo: An Architecture for Self-Improving Systems at Runtime. A frozen model's harness rewrites its own tools, then the procedure that rewrites them, with a guardian it cannot touch. Six experiments in X_eTaL: tools learned from the history beat hints; evolving halves production but reviews can cost more; an optimizer that edits itself rescues a bad one but not a good one; improving pays only with reuse (ski rental); general tools transfer to near work; and a layered guardian stops what 'it builds' lets through."
series: "Deep Learning"
series_part: 2
date: 2026-11-30 00:15:00 -0800
papers:
  - title: "Exo: An Architecture for Self-Improving Systems at Runtime"
    url: "https://arxiv.org/abs/2611.00463"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-RSI"
    title: "X_eTaL-RSI"
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT
     Started 2026-11-26 19:45 from X_eTaL-RSI at 8ae0552 (experiments 01, 03-07 done; 02 context optimization
     untracked WIP; uncommitted edits to 03, 04 READMEs and Evolve/Policy). Numbers from the committed experiment
     READMEs (git show HEAD); re-check them before publishing. Figures: headless-Chrome screenshots of the live
     pages 05, 04, 01 (2026-11-26 19:38). Econ code from libs/Econ/src/Econ.xtl, run and drawn with bin/xetal.
     The paper's authors are named in the repo READMEs; not named here (Mike's go needed). The ski-rental bound's
     1988 paper is cited in 05's README; described here without names.
     Date 2026-11-30 is tentative (after Deep Learning #1, 11/28; 11/29 is a Saw Sunday). Lead image: a placeholder.
     Related section (Mike, 2026-11-26): from X_eTaL-RSI docs/related.md (committed), with blog links.
     Mike: the closing; whether the intro should say more about the meetup.
-->

<img src="{{ '/assets/images/posts/placeholder-deep-learning-xetal-rsi.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The second paper from the Deep Learning meetup is [Exo: An Architecture for Self-Improving Systems at Runtime](https://arxiv.org/abs/2611.00463). A frozen model drives an agent harness, and the harness improves itself: its code, memory, tools and prompts are data the agent may rewrite, and so is the policy that decides what to rewrite. No weights change. [X_eTaL-RSI](https://github.com/softwarewrighter/X_eTaL-RSI) asks whether an array language makes that loop cheaper, clearer and easier to verify, with small deterministic experiments you can run in a browser.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [Exo: An Architecture for Self-Improving Systems at Runtime](https://arxiv.org/abs/2611.00463) (arXiv 2611.00463) |
| **Code** | [X_eTaL-RSI](https://github.com/softwarewrighter/X_eTaL-RSI) |
| **Live experiments** | [In your browser (WebAssembly)](https://softwarewrighter.github.io/X_eTaL-RSI/) |
| **Related** | [ICL](/2026/02/22/icl-revisited-from-mystery-to-engineering/), [ICRL](/2026/03/16/mlf-02-icrl-in-context-reinforcement-learning/), [XSkill](/2026/03/17/ai-tools-xskill-memory-layer-multimodal-agents/), [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs), [all-together-now](https://github.com/sw-vibe-coding/all-together-now) |
| **X_eTaL** | [The language](https://github.com/softwarewrighter/X_eTaL), [try it in your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **The series** | [Deep Learning: every post](/series/#deep-learning) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The idea

Exo's harness can rewrite almost everything about itself. A protected layer it cannot change holds an independent **guardian**, an append-only **history**, and the authority to **roll back**. The gains the paper reports are mostly efficiency: work done again costs less, because the system has built itself tools and procedures.

That loop has array-shaped parts:

- a **policy** is a small array program over a fixed, typed set of operations, so rewriting it is array manipulation, and the interpreter, the cost meter and the guardian stay out of its reach;
- the **history** is a table, so "which action sequences repeat, what do they cost, which fail" is an array expression, not a prompt;
- every **change** is a diff of a short program, checked by types and tests before it runs.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Simulations, on purpose

Every experiment runs on a deterministic simulated world, Workshop: gather wood and ore, carry them, make devices, deliver them. The model is Workshop's expert, always right, so the groups differ only in how often the model is called and what each call costs (assumed: 500 tokens a call, 20 for each tool's schema in every prompt, 1500 to write a tool). Simulations show the mechanics of self-improvement; each experiment says plainly that they are not evidence that a model learns.

The groups are ablations: **A** a fixed harness, **B** memory (hints in the prompt), **C** tools, **D** a self-improving harness, **E** a recursive one that also improves how it improves. The repository is six X_eTaL libraries (Econ, Journal, Workshop, Policy, Guardian, Evolve) and an experiment directory each, with checked baselines.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Tools learned from the history
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl2-tool-synthesis.webp' | relative_url }}" alt="The live tool synthesis page: sliders for the longest tool, tools learned, a hint's cost and how often hints are ignored; the tools learned from 142 model calls; tables of calls and tokens for the fixed harness, hints and tools on held-out tasks">
<figcaption>Experiment 01, live: the tools learned and what they save. Click to enlarge.</figcaption>
</figure>

Experiment 01: the fixed harness does eight tasks, and its journal of 142 model calls is the history. The three action sequences worth the most calls saved become tools (the top one is the whole route: go to the forest, gather wood, go to the mine, gather ore, go to the workshop, make). Then four held-out tasks of the same recipe, and four of shifted recipes.

- Tools cut calls by more than half on work like the training (98 to 44), and never change what gets done.
- The same knowledge as **hints** in the prompt reached the same call count, but paid for it in context on every call: 21% more tokens than tools.
- The long route is over-specialized. With 2 wood or 2 ore it never fits, and its schema makes every call dearer (12% more than no tools). Short tools of at most three steps still cut the shifted tasks' calls by 24%.

What transfers is the short, general step, not the whole procedure.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## A harness that keeps revising itself
{: .pos-right}

Experiment 03: twelve batches of three tasks, the recipe shifting twice. The improvement loop learns tools from the last six tasks before every batch, and the guardian reviews each revision.

- Evolving halves production: under half the fixed harness's production tokens. Tools learned once save under 10%, since their route stops fitting at the first shift.
- It adapts with a lag. After a shift, it runs stale tools until a revision fits the new recipe.
- At this toy scale, **reviewing every revision cost more than evolving saved**. Unguarded evolution spent the fewest tokens of all, though the guardian did keep worse candidates out of production.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## An optimizer that edits itself
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl2-recursive-optimizer.webp' | relative_url }}" alt="The live recursive optimizer page: sliders for the optimizer's settings and the meta-level's replay and retune, and cumulative tokens over 24 batches for the fixed harness, a fixed optimizer and one that edits itself">
<figcaption>Experiment 04, live: a fixed optimizer against one that edits itself. Click to enlarge.</figcaption>
</figure>

Exo lets the policy that decides what to rewrite be rewritten too. In experiment 04 the optimizer is a vector of five settings (shortest and longest tool, how many to keep, how many recent tasks to learn from, how often to revise). Group E's meta-level, every third batch, replays the last three batches under its settings and each one a step away, and adopts the cheapest. Nothing improves the meta-level itself: no tower.

- **How the optimizer is tuned matters more than whether the harness evolves.** The best fixed settings save 32% against the fixed harness; poor settings spend more than never evolving.
- Editing pays when it starts badly tuned: E halved what the bad optimizer spends, with a single change, for 4 to 6% in meta-level reads.
- But it is no substitute for good settings. Started well tuned, E never moved and paid 6% for checking. And the meta-level's own settings matter as much: fixing them stops the tower, it does not remove the choice.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## When improving pays: ski rental
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl2-specialization-cost.webp' | relative_url }}" alt="The live specialization cost page: sliders for investment, baseline and saving, and cumulative token curves for the fixed harness, always improving and the cost-aware rule, crossing near the break-even of 5.45 tasks">
<figcaption>Experiment 05, live: the break-even, and three rules. Click to enlarge.</figcaption>
</figure>

Self-improvement is an investment: pay once, save on every later task of the same kind. Experiment 05 makes that concrete: an improvement costs 3000 tokens and cuts a task from 1000 to 450, so it breaks even after 5.45 tasks. The Econ library writes each rule as one array expression, so a whole workload, or a cumulative curve, is one call:

```xetal
"ec:" u̲se< "Econ"
(3000, 1000, 450) ᵉᶜf̲ixed 1 6 7 40        ⍝ 1000 6000 7000 40000
(3000, 1000, 450) ᵉᶜe̲ager 1 6 7 40        ⍝ 3450 5700 6150 21000
(3000, 1000, 450, 6) ᵉᶜa̲fter 1 6 7 40     ⍝ 1000 6000 9450 24300
```

The last line is the **ski-rental** rule: rent until the rent paid equals the price of skis, then buy. Here, run a kind of task at the baseline six times, then improve it. Whatever the workload turns out to be, it never costs more than twice the best choice made in hindsight.

- Improving always is a bad bet on work that does not repeat: 3.45 times the fixed harness when nothing recurs.
- The ski-rental rule never loses to the fixed harness on rare work, and stayed within 1.5 times the best here, but trails "always improve" on routine work.
- Knowing reuse is worth the most: with a 9000-token budget spent where it returns most, it reaches the hindsight cost. Predicting reuse is itself something a self-improving system should learn.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## What transfers
{: .pos-left}

Exo reports that harnesses evolved on one set of tasks ran transfer tasks for about a quarter of a baseline agent's cost. Experiment 06 carries tools to near and far task families:

- A specific tool pays only where it was learned: the route saves 72% on its own recipe, and costs 4% more than no tools anywhere else.
- General tools transfer to near work: three short tools still save 13 to 17% on near recipes, within 5% of a harness that keeps evolving there, with no learning and no reviews.
- A learned harness was no head start off its own recipe, and nothing transferred to a far family whose route the source never saw.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The guardian
{: .pos-right}

In Exo, a guardian outside the agent's reach authorizes each replacement of the harness, but by default it checks only that the replacement builds. Experiment 07 proposes eight candidate policies, six of them defective in different ways:

- "It builds" lets through everything that is a well-formed table: a tool that delivers with no model call (three deliveries no one supervised), ten tools in every prompt, and a budget cut that failed a production task.
- A layered guardian, six checks, stops each defect at its own layer. A circuit breaker restores the last good version, but only after the damage, and the history stays whole.
- A guardian can be wrong the other way: judging regressions on old work, it rejected tools that suited the new work. Judging on recent work fixed that.
- Verifying is not free: 27,000 to 35,000 tokens a candidate here, more than the whole production run at this toy scale. What the layers bought was correctness, not tokens.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Beside what came before
{: .pos-left}

Exo is one more way for an agent to get better without retraining, and I have built or written about several others. The repository's [related-work note](https://github.com/softwarewrighter/X_eTaL-RSI/blob/main/docs/related.md) places each by what changes, where it is kept, who checks it, and whether the improver itself improves:

| Approach | What changes | Checked by | Improver improves |
|----------|--------------|------------|-------------------|
| [ICL](/2026/02/22/icl-revisited-from-mystery-to-engineering/) | the prompt's examples | nothing | no |
| [ICRL](/2026/03/16/mlf-02-icrl-in-context-reinforcement-learning/) | (state, action, reward) traces in the prompt | the reward | no |
| [XSkill](/2026/03/17/ai-tools-xskill-memory-layer-multimodal-agents/) | skills and experiences, as text | nothing explicit | no |
| [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) | trajectories and distilled skills; the saga | validation steps, audit | no (a fixed engine) |
| [all-together-now](https://github.com/sw-vibe-coding/all-together-now) | nothing learned: coordination | compare-and-swap | no |
| Exo | the harness: code, tools, memory, prompts | a guardian (by default: it builds) | yes |
| X_eTaL-RSI | a policy as an array program, and the optimizer's settings | a layered guardian | yes (group E) |

How each connects to the experiments:

- **ICL** is how the frozen model works inside one step; it is not what improves. Nothing persists past the call.
- **ICRL** replays successful traces in the prompt, and its known limit is that "agents ignore rules even when they're present". Group B, hints in the prompt, is that baseline; group C turns the same sequences into tools that run as written, so the gap between B and C measures what is lost when a lesson is advice rather than code.
- **XSkill** builds skill documents from batches of rollouts. Experiment 01 is its accumulation phase with the skill compiled into code, and experiment 07 adds the gate XSkill does not have between accumulating a skill and using it.
- **agentrail-rs**, the saga tool both repositories here are built with ([Saw #3](/2026/03/22/saw-agentrail-rs-icrl-dual-memory/), [AI Tools #2](/2026/04/23/ai-tools-agentrail-rs-mid-saga-flexibility/)), already has much of Exo's protected layer: an append-only saga, an audit against git, snapshots. What it lacks, by design, is self-modification. The Journal library is its trajectory store as columns, and a later experiment could make agentrail's own policy (which trajectories to inject, when to distill) the editable optimizer of group E.
- **all-together-now** ([Saw #4](/2026/03/29/saw-pjmai-reg-emacs-all-together-now/)) does not learn, but it is mechanism Exo needs: an append-only event timeline is the kind of history Exo protects, and running several agents at once is how a guardian would shadow-run a candidate beside the one in production.
- **The time scales of learning** in [How AI Learns](/2026/02/24/how-ai-learns-part1-time-scales/) run from weights to adapters to memory to context. Exo adds a layer none of them is: the harness itself, executable and versioned like code, persistent like memory, cheap to change like context, and checked before use like an adapter ([Part 7](/2026/03/02/how-ai-learns-part7-full-architecture/) asked for exactly those gates).

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## What it adds up to
{: .pos-right}

In these small worlds, self-improvement is real but conditional. It pays when work repeats, when the improver is well tuned, when what is learned is general enough to keep fitting, and when production between revisions is large enough to pay for checking it. Each of those conditions is a number you can compute, and in X_eTaL each is a short expression over the history, run in the same language as the policy it judges.

The experiments still to come in the repository measure costs with a local model instead of assuming them, and optimize the context itself.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

Mike: TODO, a closing in your words.
