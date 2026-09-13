---
layout: post
title: "Saw #11: Building a Tiny Mixture of Experts Microscope"
categories: [machine-learning, languages, projects]
tags: [sharpen-the-saw, sw-mlpl, mlpl, mixture-of-experts, moe, engram, hrm, trm, freetoken, tiny-llm, embedded, npu, distillation, quantization, dogfooding, array-languages, wasm, yew, campus, continual-learning]
keywords: "mixture of experts, MoE, tiny LLM, MicroMoE, moe-microscope, sw-MLPL, FreeToken, expert cache, Engram, HRM, TRM, recursive reasoning, sparse routing, top-1 routing, top-2 routing, load balance, expert specialization, low-rank experts, distillation, INT4, 256 MB, NPU, embedded inference, dogfooding, Campus Docent, in-browser training, WASM, catalog versus weights, continual learning, catastrophic forgetting"
author: Software Wrighter
abstract: "A microscope for mixture-of-experts models, built in sw-MLPL: a tiny model --- 7,096 parameters today --- where every part, the router, the experts, the load-balance term, the expert cache, can be watched while it works, and swapped for a different implementation to compare. It exists for two reasons: to be the workbench for tiny models headed for the browser and for microprocessors with a few hundred megabytes and a fraction of a TOPS, and to put sw-MLPL under real load so its gaps turn into fixes. One candidate application, a docent for the Software Wrighter Research Campus, turned out to want a dictionary rather than a model for now; the microscope's job --- learning and building MoE models --- stands regardless."
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
| **moe-microscope** | [sw-ml-study/moe-microscope](https://github.com/sw-ml-study/moe-microscope) · [wiki](https://github.com/sw-ml-study/moe-microscope/wiki) · [results](https://github.com/sw-ml-study/moe-microscope/blob/main/docs/results/README.md) |
| **Campus** | [Software Wrighter Research Campus](https://software-wrighter-lab.github.io/sw-campus/#/) --- ask the docent in any lobby |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [playground](https://mlpl.softwarewrighter.com/) |
| **FreeToken** | [FlashML-org/FreeToken](https://github.com/FlashML-org/FreeToken) --- the inspiration |
| **Prior posts** | [TRM](/2026/01/31/small-models-part1-tiny-recursive-model/) · [HRM](/2026/02/02/small-models-part3-hrm/) · [Engram](/2026/02/02/deepseek-papers-part2-engram/) · [Engram revisited](/2026/02/11/deepseek-papers-part3-engram-revisited/) |
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="aside-box" markdown="1">

**Why "Saw"?** The name is Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. [This series](/series/#sharpen-the-saw-sundays) is where I routinely add tools and improve the ones I have, on the principle that time spent on the tools comes back many times over in everything built with them. This week two blades are on the stone at once: the microscope is a new tool for examining mixture-of-experts implementations side by side, and building it is how sw-MLPL, the language underneath, gets its next set of fixes and features.

</div>

## Why build it

Two reasons, and the repository exists for both equally.

**A workbench for tiny models that are going to leave the laptop.** The first stop is the browser, as Rust and WebAssembly, where the microscope's visualizations run and where a model of a few thousand parameters is small enough to train while you watch. The end of the road is a microprocessor with something like 256 MB of RAM and half a TOPS of neural accelerator --- a LicheeRV or SG2002-class board, not a GPU. A model that fits there is not a shrunk-down copy of a big one; it is a different set of trade-offs, where memory bandwidth and the cost of launching an expert matter more than arithmetic throughput. I want a place where those trade-offs can be tried at a scale that runs in seconds on a CPU, measured honestly, and then carried down. The same source runs at microscope scale (CPU, seconds, thousands of parameters) and, under `device("mlx") { }`, at lab scale. The embedded board is an inference target for the packed model file, reached by a later runtime, and every design decision here is made with it in view.

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

The dense baseline is one transformer block, 3,812 parameters, trained in sixteen seconds. Replacing its feed-forward layer with four experts and a router gives 7,096 parameters stored --- 1.86 times as many --- while a token touches 3,064, or 1.02 times as many, at the same validation loss. That is the entire promise of a mixture of experts in one row of a table: capacity grows, and the cost per token does not.

Three more results are the kind you only get by being able to see everything:

**Sparse dispatch is exactly the dense model.** Training runs every expert and lets the gate zero the unchosen ones, which keeps autograd simple. Inference gathers each expert's routed rows, runs the expert once on that sub-batch, and scatters the results back. Over 120 windows the two outputs agree to the last bit, while expert row evaluations fall from 13,440 to 3,360. And one honest number alongside: in this interpreter the sparse path is *slower* per window, 0.74 ms against 0.42, because gather, scatter, and loop overhead cost more than the three tiny matmuls they skip. The saving is real in the counts and becomes wall-clock time only with larger experts or a compiled runtime, which is why the results table records counts first. The generation benchmark says the same thing from the other side: roughly 6,000 tokens per second dense, 3,200 top-1, 2,000 top-2, and 3,100 for packed delta experts, all with p95 token latency under 0.6 ms on one laptop.

**Experts can be much cheaper than you think.** Instead of four full experts at 1,072 parameters each, sixteen experts as rank-4 deltas over a shared feed-forward layer --- 128 parameters apiece, all sixteen packed into two matrices so the routed sum is two matmuls. That configuration has the best validation loss in the table, with 2,048 expert parameters against 4,288. Hundreds of experts become affordable, and the big shared matrix stays static, which is exactly the shape a small accelerator likes.

**Data is the lever. Epochs are not.** At 120 training examples, doubling the epochs makes validation loss *worse* for both models, while eight times the data cuts it by two thirds and turns prose into a solved family. The mixture beats the dense model at 480 examples and loses at 960 at twice the training cost, which is the honest state of a four-expert model on this domain.

Every one of those numbers is labeled measured, derived, or estimated in a resource budget whose calculator is pinned to the lessons' own parameter counts. One full expert is 8,576 bytes at f64 and 536 bytes of INT4 payload. The whole four-expert model is 55 KiB.

## A docent for the campus

A synthetic domain is the right place to learn the mechanism, so I also keep an eye out for real applications. One candidate came from the [Software Wrighter Research Campus](https://software-wrighter-lab.github.io/sw-campus/#/) --- the isometric map of the public work from [last week's post](/2026/09/12/software-wrighter-research-campus/). Every lobby has an easel. The easel shows a featured exhibit, and underneath it you can ask a **docent** where something is: *"where can I try array programming?"*, *"show me an early microprocessor."* The obvious tiny-ML design is a MoE classifier trained on the campus catalog --- hashed word features in, an intent and a destination out --- with the catalog supplying the title, breadcrumb, and URL so the model can never invent an exhibit, and retraining in the browser whenever the campus changes.

The key takeaway is that designing it carefully showed it was over-engineering. The campus has a few dozen destinations and a handful of intents. A dictionary of aliases and a keyword table over the catalog --- *array programming → APL*, *COSMAC → RCA 1802*, *minicomputer → IBM 1130* --- answers the same questions deterministically, has the same cannot-hallucinate property for free, needs no training, no weights to go stale, and no versioning of model against catalog. So that is what ships: a campus with a deterministic docent. That is a decision about the campus, not about the microscope --- the tool exists to learn and build MoE models whether or not the campus ever needs one, and this section is here because the exercise sharpened the question the tool is for.

What the exercise did clarify is exactly where a model would earn its place: when the aliases and near-terms outgrow a table. *"An early single-chip processor rather than a whole minicomputer"* is not a keyword match; it is a concept that has to land on the RCA 1802 and not the IBM 1130, and questions like *"an old programming environment associated with IBM systems"* legitimately want two answers ranked. That is a real, small, inspectable MoE problem --- and it is also precisely the shape [Engram](/2026/02/02/deepseek-papers-part2-engram/) conditional memory is good at: hashed n-gram lookup is a learned alias table, so aliases and synonyms could live in cheap deterministic memory while the experts handle the concepts. That research is ongoing here, on the synthetic domain first.

The campus also hands the microscope its best future experiment for free. The 1442 card reader and its radio demonstration are not on the campus yet. When they arrive, the catalog will know immediately and a trained model would not, which is the thing people hear about constantly and never get to see at understandable scale: *the world changed, the application's data knows it, the model doesn't --- now watch the model learn the change*, with catastrophic forgetting as a number in a results row. That experiment is queued, with the 1442 reserved as its test case. Meanwhile what runs in the browser is the microscope itself: the recorded lessons rendered by the generic Rust/Yew/WASM host, and possibly training, since a 7,000-parameter model is small enough to learn in front of you.

## What is still to come

The lessons that exist today are the dense baseline, routing, top-1 and top-2 mixtures, sparse dispatch, low-rank delta experts, the data-scale sweep, an in-repo teacher for distillation, the resource budget, and the generation benchmark. Ahead are the parts that connect most directly to the embedded target: recurrence, the from-scratch Engram with a table-size sweep, distillation at four levels, INT8 and INT4 experts, the capacity-limited expert cache with its hit-rate curve, the CPU/NPU hybrid split, and the packed model file that has to fit in 256 MB --- and, when the campus has grown enough to need it, the MoE docent.

Every one of those is a question with a measurement attached, and every measurement lands in the same table as the ones above. The documentation is organized around that table as three reader journeys --- *I want to understand the idea*, *I want to know whether it works*, *I want to modify or reproduce it* --- with one concept page per mechanism, one laboratory report per experiment, and a results dashboard that states each finding as evidence, interpretation, and limitation. The [wiki](https://github.com/sw-ml-study/moe-microscope/wiki) mirrors the same hierarchy.

Building the smallest useful mixture of experts was never the goal. The goal is to be able to look inside one --- and to have somewhere to stand when the next tiny model needs to run on something small.
