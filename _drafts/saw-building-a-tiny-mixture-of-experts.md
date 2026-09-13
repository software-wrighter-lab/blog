---
layout: post
title: "Saw #11: Building a Tiny Mixture of Experts Microscope"
categories: [machine-learning, languages, projects]
tags: [sharpen-the-saw, sw-mlpl, mlpl, mixture-of-experts, moe, engram, hrm, trm, freetoken, tiny-llm, embedded, npu, distillation, quantization, dogfooding, array-languages]
keywords: "mixture of experts, MoE, tiny LLM, MicroMoE, moe-microscope, sw-MLPL, FreeToken, expert cache, Engram, HRM, TRM, recursive reasoning, sparse routing, top-1 routing, top-2 routing, load balance, expert specialization, low-rank experts, distillation, INT4, 256 MB, NPU, embedded inference, dogfooding"
author: Software Wrighter
abstract: "A microscope for mixture-of-experts models, built in sw-MLPL: a tiny model --- 7,096 parameters today --- where every part, the router, the experts, the load-balance term, the expert cache, can be watched while it works, and swapped for a different implementation to compare. It exists for two reasons: to be the workbench for tiny language models headed for microprocessors with a few hundred megabytes and a fraction of a TOPS, and to put sw-MLPL under real load so its gaps turn into fixes."
series: "Sharpen the Saw Sundays"
series_part: 11
date: 2026-09-13 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-ml-study/moe-microscope"
    title: "moe-microscope"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
---

<img src="{{ '/assets/images/posts/moe-marker.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The mixture-of-experts models worth reading about have hundreds of billions of parameters, and the ideas inside them are hard to see at that size. A router chooses six experts out of 256, forty-three times per token, and what you can observe from outside is a throughput number. I wanted to watch the mechanism, not the number. So I built one with 7,096 parameters.

</div>

**moe-microscope** is an sw-MLPL project that builds a tiny mixture-of-experts language model, MicroMoE, from scratch, and lets you look inside every part of it. Each mechanism is a separate, executable lesson that records its own intermediate values, draws them, and measures memory, speed, and quality against a dense baseline. You read the MLPL, change it, rerun it, and watch the numbers and pictures change.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **moe-microscope** | [sw-ml-study/moe-microscope](https://github.com/sw-ml-study/moe-microscope) · [wiki](https://github.com/sw-ml-study/moe-microscope/wiki) |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [playground](https://mlpl.softwarewrighter.com/) |
| **FreeToken** | [FlashML-org/FreeToken](https://github.com/FlashML-org/FreeToken) --- the inspiration |
| **Prior posts** | [TRM](/2026/01/31/small-models-part1-tiny-recursive-model/) · [HRM](/2026/02/02/small-models-part3-hrm/) · [Engram](/2026/02/02/deepseek-papers-part2-engram/) · [Engram revisited](/2026/02/11/deepseek-papers-part3-engram-revisited/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why build it

Two reasons, and the repository exists for both equally.

**A workbench for tiny language models that are going to leave the laptop.** The end of this road is a microprocessor with something like 256 MB of RAM and half a TOPS of neural accelerator --- a LicheeRV or SG2002-class board, not a GPU. A model that fits there is not a shrunk-down copy of a big one; it is a different set of trade-offs, where memory bandwidth and the cost of launching an expert matter more than arithmetic throughput. I want a place where those trade-offs can be tried at a scale that runs in seconds on a CPU, measured honestly, and then carried down. The same source runs at microscope scale (CPU, seconds, thousands of parameters) and, under `device("mlx") { }`, at lab scale. The embedded board is an inference target for the packed model file, reached by a later runtime, and every design decision here is made with it in view.

**Dogfooding sw-MLPL.** A language for machine learning is only proven by writing machine learning in it, and a mixture of experts is a demanding program: a router trained through a gate, a list of models updated by one optimizer, weight sharing across recurrences, gather and scatter on the autograd tape, distillation losses, packed byte I/O. Every place where the language got in the way has become a minimal reproducer, a pinned probe that fails loudly when the upstream fix lands, and a work order for [sw-mlpl](https://github.com/sw-ml-study/sw-mlpl). Twelve of those have been fixed upstream so far --- softmax arity on the tape, user functions inside `grad`, differentiable `gather_rows`, `repeat` inside a traced function, `one_hot` and `argmax` as stop-gradient constants, a loud error instead of a silent zero gradient --- and the first four were fixed the day they were filed. Seven are open. The model got better and so did the language, which is the point of dogfooding.

## The four ideas, at one tiny scale

MicroMoE combines four ideas that normally live at very different scales:

- **Sparse routing** over a bank of small experts: only the top-1 or top-2 experts run for each token, so total parameters and active parameters come apart.
- **Recursion**, from [HRM](/2026/02/02/small-models-part3-hrm/) and [TRM](/2026/01/31/small-models-part1-tiny-recursive-model/): one shared block applied several times, so reasoning depth is bought with repeated compute instead of unique layers.
- **Conditional memory**, from DeepSeek's [Engram](/2026/02/02/deepseek-papers-part2-engram/): the last two or three tokens are hashed to a slot in a table and the stored vector is added through a learned gate, so plain memorization leaves the neural network.
- **Residency**, from [FreeToken](https://github.com/FlashML-org/FreeToken): a mixture of experts solves the compute problem but not the storage problem, so treat memory as a hierarchy and keep an expert cache that follows the router's actual choices.

Those are four *independent* kinds of sparsity --- parameter sharing, conditional compute, conditional memory, residency --- and each is a separate switch with its own lesson that turns it on alone against the dense baseline. That is the design decision that makes the project a microscope rather than a demo: you can ask what recursion buys without also changing the experts, or what an expert cache costs without also changing the model.

```text
                   token ids
                       |
             +---------v---------+
             | token embedding   |
             +---------+---------+
                       |
      recent ids ------+------------------+
                       |          +-------v-------+
                       |          |    Engram     |  hashed 2/3-gram rows,
                       |          |  lookup+gate  |  projection, learned gate
                       |          +-------+-------+
                +------v------------------v------+
                | shared recurrent block         |<----------+
                | rms_norm -> causal attention   |           |
                +---------------+----------------+           |
                         +------v------+                     |
                         |   router    |  logits [T, E]      |
                         +------+------+                     |
                                | top-k mask, gate           |
                         +------v------+                     |
               RAM/file--|expert cache |  LRU over (block,   |
                         +------+------+  expert), bytes     |
                 +--------------+--------------+             |
              expert         expert         expert          |
                 +--------------+--------------+             |
                            combine                          |
                          state update ----------------------+  R times
                                |
                             LM head
```

## What you can watch

The domain is deliberately small: small-integer arithmetic, `rev`/`sort` sequence transformations, tiny MLPL expressions checked against the interpreter itself, and short templated prose. Fifty-two symbols, windows of twenty-eight tokens. Each example carries a task tag the model never sees, which is what makes the interesting question measurable: *do the experts specialize, and along what lines?*

<figure class="no-invert">
<img src="{{ '/assets/images/posts/moe-router-routing.svg' | relative_url }}" alt="The routing microscope: six tokens' router logits, softmax probabilities, one-hot mask, and Switch-style gate as four aligned matrices, with per-expert load, the top-2 mask, entropy, and the load-balance term below">
<figcaption>The router, before training: logits, probabilities, the one-hot choice, and the gate that keeps the chosen expert's probability so the router still gets a gradient.</figcaption>
</figure>

The router is one small linear layer. A token's hidden state goes in, one score per expert comes out, the top-k win. The choice itself is an `argmax` with no gradient, so the gate multiplies the chosen expert's probability into the output --- if raising that probability would have lowered the loss, the router raises it. A load-balance term keeps the first expert that gets slightly better from taking every token, which is otherwise exactly what happens.

<figure class="no-invert">
<img src="{{ '/assets/images/posts/moe-specialization.svg' | relative_url }}" alt="Two heatmaps of task family by expert: the share of each family's answer tokens routed to each of four experts, for top-1 and top-2 routing, with specialization scores of 0.61 and 0.42">
<figcaption>The specialization map. For each task family, the share of its tokens each expert received. The router never saw a family tag; any structure here is emergent.</figcaption>
</figure>

Nobody labels an expert "the arithmetic expert." Specialization is an emergent property of routing plus gradient, and it is not guaranteed --- experts can just as easily split tokens by position or frequency. So the project measures it instead of assuming it. The specialization score is the mean, over families, of the largest share any one expert takes; 0.25 would mean routing ignores the family entirely. Under top-1 it is **0.61**: prose and arithmetic each lean on one expert. Under top-2 it is 0.42, because spreading each token across two experts spreads the map by construction.

## The numbers, honestly

The dense baseline is one transformer block, 3,812 parameters, trained in sixteen seconds. Replacing its feed-forward layer with four experts and a router gives 7,096 parameters stored --- 1.86 times as many --- while a token touches 3,064, or 1.02 times as many. That is the entire promise of a mixture of experts in one row of a table: capacity grows, and the cost per token does not.

Two more results are the kind you only get by being able to see everything:

**Sparse dispatch is exactly the dense model.** Training runs every expert and lets the gate zero the unchosen ones, which keeps autograd simple. Inference gathers each expert's routed rows, runs the expert once on that sub-batch, and scatters the results back. Over 120 windows the two outputs agree to the last bit, while expert row evaluations fall from 13,440 to 3,360. And one honest number alongside: in this interpreter the sparse path is *slower* per window, 0.74 ms against 0.42, because gather, scatter, and loop overhead cost more than the three tiny matmuls they skip. The saving is real in the counts and becomes wall-clock time only with larger experts or a compiled runtime, which is why the results table records counts first.

**Experts can be much cheaper than you think.** Instead of four full experts at 1,072 parameters each, sixteen experts as rank-4 deltas over a shared feed-forward layer --- 128 parameters apiece, all sixteen packed into two matrices so the routed sum is two matmuls. That configuration has the best validation loss in the table so far, with 2,048 expert parameters against 4,288. Hundreds of experts become affordable, and the big shared matrix stays static, which is exactly the shape a small accelerator likes.

And the result that reframes the rest: at 120 training examples, doubling the epochs makes validation loss *worse* for both models, while eight times the data cuts it by two thirds and turns prose into a solved family. Data is the lever. Epochs are not. At this scale the mixture beats the dense model at 480 examples and loses at 960 at twice the training cost, which is the honest state of a four-expert model on this domain, and the reason the interesting configurations are still ahead.

## What is still to come

The lessons that exist today are the dense baseline, routing, top-1 and top-2 mixtures, sparse dispatch, low-rank delta experts, the data-scale sweep, an in-repo teacher for distillation, and a resource budget where every number is labeled measured, derived, or estimated. Ahead are the parts that connect most directly to the embedded target: recurrence, the from-scratch Engram with a table-size sweep, distillation at four levels, INT8 and INT4 experts, the capacity-limited expert cache with its hit-rate curve, the CPU/NPU hybrid split, and the packed model file that has to fit in 256 MB.

Every one of those is a question with a measurement attached, and every measurement lands in the same table as the ones above.

Building the smallest useful mixture of experts was never the goal. The goal is to be able to look inside one --- and to have somewhere to stand when the next tiny model needs to run on something small.
