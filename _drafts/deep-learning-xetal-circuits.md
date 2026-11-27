---
layout: post
title: "Deep Learning #1: Finding Circuits in GPT-2 Small with X_eTaL"
categories: [machine-learning, deep-learning, interpretability]
tags: [deep-learning, mechanistic-interpretability, circuits, induction-heads, gpt-2, transformerlens, activation-patching, path-patching, xetal, x-etal, array-languages]
keywords: "mechanistic interpretability, transformer circuits, induction heads, previous-token head, GPT-2 Small, activation patching, path patching, head ablation, random controls, held-out seeds, in-context learning circuit, TransformerLens, X_eTaL array language"
abstract: "First in the Deep Learning series: X_eTaL-circuits, a workbench for finding, testing and drawing circuits inside language models, with X_eTaL as the analysis and drawing language. It follows the causal method of A Circuit for In-Context Learning (twin prompts, a continuous margin, interventions against random controls, held-out checks) and validates it on GPT-2 Small's induction circuit: attention scores name candidate heads, ablation and patching test them, path patching tests which head feeds which, and a model map draws the evidence."
series: "Deep Learning"
series_part: 1
date: 2026-11-28 00:15:00 -0800
papers:
  - title: "A Circuit for In-Context Learning"
    url: "https://arxiv.org/abs/2611.05344"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-circuits"
    title: "X_eTaL-circuits"
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT
     Started 2026-11-26 19:30 from X_eTaL-circuits at 4c62236 (saga step 005 edge-effects complete). Step 006
     (held-out edges) was in progress and uncommitted then: its README section says 181 of 186 edges confirm; the
     post gives that as "so far" and uses the committed model map. Re-check README and the map before publishing.
     Numbers are copied from the README's command output. Figures are the repo's own SVGs (drawn by X_eTaL),
     no-invert; the live-demo picture is images/demo.png. X_eTaL code: xetal/Scores/src/Scores.xtl, drawn with the
     repo's pinned bin/xetal render.
     The paper's authors are named in docs/eli5.md; not named here (Mike's go needed). Related projects (the paper's
     code, TransformerLens, BDH) are linked neutrally, as the README does.
     Date 2026-11-28 is tentative. Lead image: a placeholder. Mike: the closing. Intro: Mike's words (2026-11-26).
     Deep Learning #2 is planned from X_eTaL-RSI (Exo, arXiv 2611.00463); no forward link here until it is published.
-->

<img src="{{ '/assets/images/posts/placeholder-deep-learning-xetal-circuits.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

I recently started attending a weekly Deep Learning meetup on Zoom, where each week one person goes through a paper and the others discuss it. The group votes on a paper to study the following week. This series covers some of the papers discussed, for which I went on to create X_eTaL-based repos to explore and demonstrate concepts from each paper.

This first post is about circuits: the groups of parts inside a language model that work together to produce one behavior. [X_eTaL-circuits](https://github.com/softwarewrighter/X_eTaL-circuits) is a workbench for finding, testing and drawing them, with X_eTaL as the analysis and drawing language. Its first study finds the circuit GPT-2 Small uses to continue a repeated sequence, and tests every part of it by experiment.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [A Circuit for In-Context Learning](https://arxiv.org/abs/2611.05344) (arXiv 2611.05344) |
| **Code** | [X_eTaL-circuits](https://github.com/softwarewrighter/X_eTaL-circuits) |
| **Live demo** | [The model map, every head, the scores](https://softwarewrighter.github.io/X_eTaL-circuits/) |
| **In plain words** | [eli5.md](https://github.com/softwarewrighter/X_eTaL-circuits/blob/main/docs/eli5.md) |
| **Related** | [In-Context Learning Revisited](/2026/02/22/icl-revisited-from-mystery-to-engineering/), [BDH: a visible brain](/2026/02/03/small-models-part4-bdh/) |
| **X_eTaL** | [The language](https://github.com/softwarewrighter/X_eTaL), [try it in your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **The series** | [Deep Learning: every post](/series/#deep-learning) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What a circuit is

A language model reads some words and guesses the next one. Inside, it is a stack of layers. On every layer, **attention heads** look back at earlier words and fetch something useful, and **MLPs** work on what was fetched. GPT-2 Small has 12 layers of 12 heads, 144 heads in all. Each position carries a running record, the **residual stream**, that every part reads and adds to.

Nobody wrote down which part does what; the model learned it. A **circuit** is a set of those parts, and the paths between them, that cooperate on one behavior. Circuits are not separate programs the model switches between. They describe mechanisms inside one fixed, learned computation, and they can only be found by experiment.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The method: change something, measure the margin

The workbench follows the causal method of the paper [A Circuit for In-Context Learning](https://arxiv.org/abs/2611.05344), which looks for the parts that let a model learn made-up labels from a few examples in its prompt:

1. **Twin prompts** that differ in exactly one controlled way, with their tokens lined up.
2. **A continuous measure:** the margin, `log P(correct) - log P(incorrect)`, not just right or wrong.
3. **Interventions:** switch a head off (ablation), or copy its output from one twin into the other (patching), and compare each result with matched random controls.
4. **A circuit graph** whose edges are tested by path patching, then checked on held-out prompts.

> An attention map shows where a model looks. A circuit shows what the model needs.

Before trying this on the paper's models, the workbench checks itself on a circuit that is already well known: GPT-2 Small's **induction heads**. Give it a random list of tokens, then the same list again, and the second time through it predicts each next token easily. It looks back at what came after this token last time, and copies it.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Looking: where a head attends
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl1-head-5-1.svg' | relative_url }}" class="no-invert" alt="Heatmap of GPT-2 Small head 5.1 on a beginning token, eight random tokens, then the same eight again: on the second half each row's strongest cell sits on the token after the earlier copy, a stripe below the diagonal">
<figcaption>Head 5.1's attention, drawn by X_eTaL: a row per query token, a column per key. Click to enlarge.</figcaption>
</figure>

A small Python adapter runs the model through [TransformerLens](https://github.com/TransformerLensOrg/TransformerLens) and saves a **capture**: every head's attention (layer by head by query by key), the last position's logits, and everything needed to repeat the run (the model and its revision, the library versions, the seed, the prompt and its tokens). X_eTaL reads the capture, checks it (no head looks at a future token; each row of attention sums to 1), and draws it.

The prompt here is a beginning token, eight random tokens, then the same eight again. On the first half, head 5.1 rests on the first token. On the second half, each token looks at the token that followed its earlier copy: the stripe below the diagonal. The values X_eTaL reads agree with TransformerLens's own cache within 1e-5 relative.

That is an observation of where the head looks. It is not evidence that the output needs it.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Scoring every head
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl1-induction-scores.svg' | relative_url }}" class="no-invert" alt="A 12 by 12 grid, layer by head, each cell a GPT-2 Small head's induction score; the strongest cells are in layers 5 to 7">
<figcaption>The induction score of every head. Click to enlarge.</figcaption>
</figure>

Each head gets two scores from a repeated prompt. The **previous-token** score is its mean weight from each position to the one before it. The **induction** score is its mean weight from each token of the second copy to the token that followed it in the first. Both are layer by head matrices, which is the kind of thing an array language is for:

```xetal
ˡp̲revious ← { d →
  A ← ᶜᵖa̲ttention d
  n ← f̲irst r̲ev s̲hape A
  A ʰm̲asked f̲loat (r̲ange n) '{ a b → a = b + 1 } t̲able r̲ange n
}

ʰm̲asked ← { A M → 2 '{ S → ('+ r̲/ r̲avel S × M) ÷ '+ r̲/ r̲avel M } r̲ank A }
```

A table of query against key positions makes a mask of the cells one step back; `2 … r̲ank A`{:.language-xetal} takes each head's query by key matrix and averages it under the mask. The induction score is the same with a different mask.

The five leading induction heads, 5.5, 5.1, 6.9, 7.10 and 7.2, are the GPT-2 Small induction heads known from the literature, and the top previous-token head, 4.11, is its known previous-token head. Still, these are candidates.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Testing: which heads the output needs
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl1-confirmed-denoise.svg' | relative_url }}" class="no-invert" alt="A layer by head grid of the share of the gap each confirmed head's output restores on held-out seeds, largest for 6.9, 5.1, 7.2 and 5.5">
<figcaption>Patching: the share of the gap each confirmed head restores, on held-out seeds. Click to enlarge.</figcaption>
</figure>

Each repeated prompt gets a twin whose second copy is fresh tokens, and the measure is the logit difference between the right next token and the twin's. Then one head at a time is switched off (ablation), or its output is copied between the twins (patching), over ten seeds.

An effect counts only if chance cannot explain it. Each head also gets 20 changes to its output of the same size as the real intervention, in random directions. A head passes when its mean effect is at least 5% and larger than every one of its controls. Then the same test runs on ten **held-out** seeds that played no part in choosing heads or the threshold; a head that passes again is **confirmed**.

What survives: switching off 5.1, 4.11, 7.6, 8.5 or 5.5 costs 5 to 22% of the logit difference, far more than a random change of the same size. Restoring any of the five induction heads, or 9.9, 9.6, 10.1 or 0.1, brings back 5 to 15% of what the twin lost. The heads back each other up: removing one costs little, except 5.1.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Which head feeds which
{: .pos-right}

A head is one thing; an **edge** is one head's output reaching a later head's query, key or value, or the final output. GPT-2 Small has 29,089 of them, too many to path-patch one by one. So a gradient approximation estimates them all at once, the 400 with the largest estimated changes are path-patched (each with 20 random controls), and X_eTaL judges which pass:

<figure class="zoomable" style="clear: both; margin: 1.2em 0;">
<img src="{{ '/assets/images/posts/dl1-edges-k.svg' | relative_url }}" class="no-invert" alt="The edges into attention keys that beat their random controls, drawn between GPT-2 Small's layers; most start at head 4.11 and end at the induction heads">
<figcaption>Edges into keys that beat their controls: 4.11 feeds the key of every induction head. Click to enlarge.</figcaption>
</figure>

186 of the 400 edges pass. The previous-token head 4.11 feeds the key of every induction head (5.1, 5.5, 6.9, 7.2, 7.10, and 5.0, 5.8, 7.11, 8.1), restoring 17 to 45% of each one's attention score at the induction target, against controls of 2% at most. Heads 3.7, 5.6 and 2.2 add to it, and 4.7 pushes against it. The induction heads in turn feed the queries of later heads, and ten heads write straight into the logits, two of them against the answer.

That is the textbook induction circuit, found again by experiment: a previous-token head tells each position what came before it, and the induction heads use that to find and copy the next token. On held-out seeds, the check so far confirms 181 of the 186 edges.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The model map
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl1-model-map.svg' | relative_url }}" class="no-invert" alt="GPT-2 Small's model map: a row per layer, a cell per head and one per MLP, heads colored blue for induction and orange for previous token, confirmed heads outlined, the induction circuit's edges drawn between them">
<figcaption>The model map, drawn by X_eTaL. Click to enlarge.</figcaption>
</figure>

The map draws the whole model in one picture: a row per layer, a cell per head and per MLP, the residual stream beside them. Heads are colored by their scores, blue for induction and orange for previous token. A circuit file draws its heads and edges over the map, and the line says how far the evidence has come: dashed for observed (an attention pattern or score only), solid for tested against random controls, thick for confirmed on held-out prompts.

The [live demo](https://softwarewrighter.github.io/X_eTaL-circuits/) has the map (hover a head for its numbers), every head's attention with a layer and head picker, the score grids, an introduction for a first-time reader and a glossary. Every picture there is drawn by X_eTaL, exactly as at the command line.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Why an array language
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/dl1-live-demo.webp' | relative_url }}" alt="The live demo page: GPT-2 Small's model map with heads colored by their scores and the induction circuit drawn over it">
<figcaption>The live demo. Click to enlarge.</figcaption>
</figure>

These are array computations. An attention capture is a layers by heads by queries by keys tensor; a patching sweep is a layer by head effect matrix; a score is a mask and a mean. X_eTaL does the slicing, the statistics, the verdicts and the drawing. The model itself runs in Python through TransformerLens, on purpose: the analysis is in X_eTaL, and the model hooks stay in Python until the results match the paper's own.

The rule throughout: an attention pattern is a suspect, not a culprit. Everything the workbench reports says which kind of evidence it has.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## What comes next in the workbench
{: .pos-center}

GPT-2 Small's induction circuit is the check that the tools work. The studies planned next:

- local models through Ollama: do they learn arbitrary labels from examples, and reverse them?
- Qwen3-4B-Base, the paper's reference model: are its writers, readers, gate and brakes found here too?
- X_eTaL code: does the same mechanism carry over to programming-language examples?
- a tiny trained transformer: in what order do circuit parts appear during training?
- Baby Dragon Hatchling (BDH), a model designed to be inspected: does it make circuits easier to find?

Two of those connect to earlier posts here. The paper's question, how a model learns from examples in its prompt, is the one [In-Context Learning Revisited](/2026/02/22/icl-revisited-from-mystery-to-engineering/) asked from the outside; circuits are the inside view. And BDH, the [Baby Dragon Hatchling](https://github.com/pathwaycom/bdh), is a model I have already coded and written about in [Small Models (4/6): This AI Has a Visible Brain](/2026/02/03/small-models-part4-bdh/) ([my version](https://github.com/softwarewrighter/bdh)): its sparse activations, with most neurons silent for each token, are meant to make what it does visible. GPT-2 Small's circuit had to be found by experiment; the open question is how much of that work a model built to be inspected saves.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

Mike: TODO, a closing in your words.
