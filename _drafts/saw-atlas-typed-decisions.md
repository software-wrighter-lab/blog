---
layout: post
title: "Saw #12: A Model That Decides, and an Index That Knows"
categories: [tools, machine-learning, languages, projects]
tags: [sharpen-the-saw, sw-atlas, jev, typesafe, needle, cactus, simple-attention-network, system-one, typed-decisions, semantic-index, wasm, rust, sw-mlpl, moe-microscope, sw-campus, retrieval, calibration, quantization, edge-ml]
keywords: "sw-atlas, Jev, TypeSafe AI, System One model, Needle, Cactus Compute, Simple Attention Network, no feed-forward, typed decision, non-generative, intent classification, semantic index, snapshot, runtime class, WASM, Rust, sw-MLPL, moe-microscope, SetFit, Outlines, SGLang, LanceDB, HippoRAG, LLMRouter, calibration, abstention, INT4, offline compute"
abstract: "There is a class of model that never writes a sentence. You give it a question and a list of things it could be about, and it returns a typed decision --- an intent, some concepts, a confidence --- in a few hundred kilobytes and well under a second. TypeSafe's Jev calls these System One models; Cactus's Needle is an open one you can read. sw-atlas applies the idea to my own corpus: one semantic index over the blog, the repositories, the demos, the campus and the videos, and a small model that turns a visitor's sentence into a decision about it. The facts live in the index. The model holds only the language. The deterministic matcher is the floor of the ladder, not the destination."
series: "Sharpen the Saw Sundays"
series_part: 12
date: 2026-09-20 00:15:00 -0700
papers:
  - title: "Augmenting Self-attention with Persistent Memory"
    url: "https://arxiv.org/abs/1907.01470"
  - title: "Simplifying Transformer Blocks"
    url: "https://arxiv.org/abs/2311.01906"
  - title: "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks"
    url: "https://arxiv.org/abs/1908.10084"
  - title: "Efficient Few-Shot Learning Without Prompts (SetFit)"
    url: "https://arxiv.org/abs/2209.11055"
  - title: "On Calibration of Modern Neural Networks"
    url: "https://arxiv.org/abs/1706.04599"
repo_urls:
  - url: "https://github.com/software-wrighter-lab/sw-atlas"
    title: "sw-atlas"
  - url: "https://github.com/sw-ml-study/moe-microscope"
    title: "moe-microscope"
  - url: "https://github.com/software-wrighter-lab/sw-campus"
    title: "sw-campus"
---

<img src="{{ '/assets/images/posts/sw-atlas-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

I have a hundred and twenty-four blog posts, a hundred and thirty-odd public repositories, a set of live demos, a campus map that indexes them, and seventy-five videos. Somebody asks "where was that thing about running experts from disk?" --- and the honest answer today is that I go and look, because I wrote it.

</div>

<!--more-->

Answering that question well normally costs a large model, a server, and a second or two of somebody else's electricity. **sw-atlas** is a bet that almost all of the work can be done the night before instead, and that what is left over is small enough to run in the visitor's browser without a server anywhere.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-atlas** | [software-wrighter-lab/sw-atlas](https://github.com/software-wrighter-lab/sw-atlas) · [the plan](https://github.com/software-wrighter-lab/sw-atlas/blob/main/docs/plan.md) · [Needle assessment](https://github.com/software-wrighter-lab/sw-atlas/blob/main/docs/needle.md) |
| **Jev** | [TypeSafe AI](https://typesafe.ai/) --- the System One framing |
| **Needle** | [cactus-compute/needle](https://github.com/cactus-compute/needle) --- MIT, weights and trainer open |
| **Related work** | [moe-microscope](https://github.com/sw-ml-study/moe-microscope) · [the docent results](https://github.com/sw-ml-study/moe-microscope/blob/main/docs/reference/docent-results.md) |
| **The corpus** | [the blog](https://blog.softwarewrighter.com/) · [the campus](https://software-wrighter-lab.github.io/sw-campus/#/) · [sw-campus](https://github.com/software-wrighter-lab/sw-campus) |
| **Prior posts** | [A Tiny Mixture of Experts Microscope](/2026/09/13/saw-building-a-tiny-mixture-of-experts/) · [A Campus for the Public Work](/2026/09/12/software-wrighter-research-campus/) |
| **Papers** | [Persistent Memory](https://arxiv.org/abs/1907.01470) · [Simplifying Transformer Blocks](https://arxiv.org/abs/2311.01906) · [Sentence-BERT](https://arxiv.org/abs/1908.10084) · [SetFit](https://arxiv.org/abs/2209.11055) · [Calibration](https://arxiv.org/abs/1706.04599) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A model that does not write

<div class="aside-box outdent-right" markdown="1">

**Why "Saw"?** The name is Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. [This series](/series/#sharpen-the-saw-sundays) is where I routinely add tools and improve the ones I have, on the principle that time spent on the tools comes back many times over in everything built with them. This one sharpens the thing that finds everything else.

</div>

The vocabulary is worth learning even if you never build one, because it names a category that gets lost next to chatbots.

TypeSafe calls Jev a **System One model**, borrowing Kahneman: fast, automatic, non-deliberative. The concrete meaning is that it is **non-generative**. It does not emit tokens one at a time and hope they parse. It samples a **typed decision** in parallel against a schema you supply --- a `Choice` from an enumeration, a `Score`, a `Boolean` --- and returns that, in something like 70 to 500 milliseconds, with a footprint measured in megabytes rather than gigabytes.

That constraint is the whole point. A generative model asked "which of these is the user asking about?" can answer with a hallucinated option, a paragraph of preamble, or valid JSON describing a thing that does not exist. A model whose output *is* the schema cannot. The worst it can do is choose the wrong enum value --- and if it is [calibrated](https://arxiv.org/abs/1706.04599), say so with a low number.

Set against the corpus I actually have, that is the right shape:

```
  visitor's sentence
          |
          v
  +-------------------+        the model's entire output
  |   typed decision  |        intent        : navigate | explain | compare | find
  |                   |        concepts[]    : moe, residency, embedded
  |                   |        resource_kinds: post, repo, video
  |                   |        confidence    : 0.81
  +---------+---------+
            |
            v
  deterministic catalog lookup  <-- the facts live here
            |
            v
  title, abstract, URL, breadcrumb
```

The model never emits prose, a URL, or a resource id. Ordinary code resolves an intent and a set of concepts against the published catalog. **A stale model therefore cannot invent a blog post or a dead link.** That is not a policy I promise to enforce; it is the only thing the output type permits.

## Jev is a product, so what is the open one?

Jev is closed and hosted, which makes it a good description of a category and a poor dependency. The interesting question was which open projects do the same job, and the survey came back with one strong answer and a lot of near misses.

The answer is **[Needle](https://github.com/cactus-compute/needle)** from Cactus Compute: a 26-million-parameter encoder-decoder for function calling, MIT-licensed, with the weights, the data generator, the trainer and the evaluator all in the repository. You give it a question and a list of tools; it ranks the tools and emits a typed call. Swap "tools" for "resource cards from my index" and it is the same problem with different nouns.

The near misses are instructive, because each one is genuinely good at something this corpus does not need:

| Project | What it is | Why not |
|---|---|---|
| **[SetFit](https://arxiv.org/abs/2209.11055)** | few-shot contrastive fine-tuning of a [sentence encoder](https://arxiv.org/abs/1908.10084); retrains on CPU in seconds | the cheapest possible semantic tier, and worth one measurement as a floor --- but Needle's contrastive head gives the same thing from a model already needed |
| **Outlines**, **SGLang** | grammar-constrained decoding; FSMs and CFGs over the logits | these force a *general* model into a schema. A model whose native output is the schema does not need forcing |
| **LanceDB** | embedded, serverless vector database in Rust | 300 resources at 384 dimensions and INT8 is 115 KiB. A flat cosine scan beats any index structure at that size and needs no dependency |
| **HippoRAG 2**, **A-Mem** | infer a knowledge graph from text | this corpus does not need inference. 73 posts declare a `repo_url`, 77 a `video_url`, 64 their papers, 123 a series. The relations are hand-written and already correct |
| **LLMRouter** | KNN and SVM routing over an embedding cache | precisely the cheap baseline tier, in a box. Nothing to adopt, but useful confirmation that the cheap tier is the right first tier |
| **MobileBERT**, **TinyBERT** | 10--30 MB encoders for classification | kept as comparison rows, and as a sanity check that a 26M model earns its weight |

The pattern across all of them is the same, and it is why the plan did not change more than it did: they are retrieval and serving infrastructure for corpora far larger and far more volatile than mine. My corpus is about three hundred hand-curated artifacts that change a few times a week. The scarce resource is not index throughput. It is the visitor's RAM.

## The idea worth stealing: no feed-forward layer

Needle's architecture is a **Simple Attention Network**, and the striking part is what it leaves out. A transformer block is normally attention followed by a feed-forward network, and the FFN is about two thirds of the parameters. Needle drops the FFN entirely --- encoder and decoder are attention, normalization, and a gated residual, and nothing else.

```
  query text                    resource cards
      |                               |
  Embedding  <---- shared ---->  Embedding
      |                               |
  Encoder x12                         |
  (self-attention, GQA + RoPE,        |
   gated residual, NO FFN)            |
      |          \                    v
      |           \             Decoder x8
      |            \            (masked self-attn,
      |             `--------->  cross-attn,
      |                          gated residual, NO FFN)
      v                                |
 contrastive head                      v
 (mean pool, L2 norm)          typed decision
      |
      v
 rank the cards
```

The design argument is that routing a query to a target is *alignment and copying*, not per-position feature transformation --- so the FFN is paying rent it does not earn. And the consequence for a project like mine is larger than the parameter saving:

> **MLPs can be completely dropped from transformer networks, as long as the model relies on an external knowledge source.**

That claim is not only Cactus's. Sukhbaatar and colleagues showed in 2019 that the feed-forward sub-layer can be [merged into attention as persistent memory vectors](https://arxiv.org/abs/1907.01470) --- a set of learned key-value pairs that play the same role --- and the feed-forward layer removed without degrading performance. He and Hofmann went further in [*Simplifying Transformer Blocks*](https://arxiv.org/abs/2311.01906), stripping skip connections, value and projection parameters and normalization layers to reach 15 percent fewer parameters and 15 percent faster training at the same quality. There is a real line of published work here, not just a vendor's design note, and what Needle adds is a trained checkpoint at the far end of it.

If there is no feed-forward layer, there is nowhere for a fact to be memorized. "Facts live in the index, language lives in the weights" stops being a discipline I have to maintain in the training data and becomes a property of the architecture. That is a much stronger guarantee, and it is testable rather than hopeful.

It also has an awkward consequence I had to accept. Mixture-of-experts routes among *feed-forward experts*. A network with no FFN has no experts to route among --- so the MoE work from [last week's microscope](/2026/09/13/saw-building-a-tiny-mixture-of-experts/) comes off this project's critical path and stays where the research belongs. What survives, and matters more here, is the residency question, which never depended on experts: an encoder with twenty attention blocks still has separable layers, and a browser can pull depth in progressively and evict it under pressure just as well as it could experts. The tiered cache is the same idea either way --- what changes is only what the shards contain.

## Two heads, and a ladder

The shape that falls out is one encoder with two heads, and most questions only pay for the first.

```
  question
     |
     v
  encoder  (one pass, always)
     |
     +--> contrastive head --> cosine over resource vectors --> top-k
     |                                                           |
     |                                                           v
     +--> decoder over the question + the top-k cards --> typed decision
                                                          (only when needed)
```

"Where is APL?" is a ranking question; it needs no decoding at all. Decoding is for questions whose answer carries arguments --- comparisons, status about a named subject, filtered finds. That split is also what makes the latency survivable: one encoder pass plus a cosine scan is bounded, and autoregressive decoding is not.

Underneath that is a ladder of **runtime classes**, because the budget is somebody else's laptop and I do not get to choose it:

| Class | RAM | Capability | What runs |
|---|---:|---|---|
| **A0** Minimal | 10 MiB | lexical and graph matching | no model at all |
| **A1** Semantic | 25 MiB | embedding retrieval | precomputed vectors, cosine scan |
| **A2** Intelligent | 64 MiB | intent, ranking, confidence | encoder + contrastive head |
| **A3** Decoding | 128 MiB | arguments, comparison, reranking | encoder + decoder |
| **A4** Enhanced | 256 MiB | prose synthesis | opt-in only, never automatic |

It starts at A0 on every machine, measures itself in a worker, and promotes one class at a time only after the one below it came in inside its budget --- and demotes the moment it does not. Demotion all the way to A0 must lose quality and never correctness. There is no "your machine has 16 GB, so I took 400 MB."

The published artifact is a snapshot of a few megabytes with a hash per file: the catalog, the concept graph, the matcher signals, INT8 embeddings, and the model split into shards cut by *what a runtime class needs* --- core, deep encoder, decoder. Every tensor is aligned to 4 KiB, so an HTTP range request, an mmap page, and an OPFS read are all the same unit and the browser trace can be compared directly against the native one in the microscope.

## The honest scoreboard

Every tier has to earn its place against the one below it, so the project starts by writing down what it has to beat.

The [campus docent work](/2026/09/13/saw-building-a-tiny-mixture-of-experts/) already ran this experiment at small scale, and a deterministic keyword matcher beat the trained model on every measure that counts:

| Run | Paraphrase accuracy | Intent | Unsupported recall | Class |
|---|---:|---:|---:|---|
| **Keyword matcher over all catalog text** | **0.685** | 0.481 | 0.40 | A0 |
| Keyword matcher over aliases and concepts | 0.630 | 0.463 | **1.00** | A0 |
| Trained docent + word vectors | 0.407 | 0.407 | 0.30 | A2 |
| Trained dense docent | 0.296 | 0.481 | 0.30 | A2 |

Two hundred and eighty-four keyword signals, zero parameters, no training. That is the number to beat, and it is written into the plan as a test rather than an aspiration: **a tier ships when it beats 0.685 on the same held-out questions by twenty points**, and not before.

What that scoreboard does *not* say is that the neural tier is a long shot. It says the work to extract value from this approach has not been done yet. Those rows come from a dense model with a feed-forward network, trained on a nine-place campus, before any of the pieces this post is about: no Simple Attention Network, no contrastive head over resource cards, no generated question set at corpus scale, no calibration. Every one of those is a reason the number should move, and moving it is the project.

The corollary is that A0 is never deleted --- but not because I expect to need it forever. It is the floor of a ladder. A visitor on a phone with 2 GiB gets the matcher and a working answer; a visitor on a laptop gets the encoder; the same page, the same index, a different rung. The matcher is what makes it safe to try the model, because there is always something underneath.

## What the microscope is being asked

The two projects divide cleanly: [moe-microscope](https://github.com/sw-ml-study/moe-microscope) owns mechanisms, sw-atlas owns the corpus and the product. The microscope never grows a corpus; Atlas never invents a mechanism. When something proves out there it arrives here hash-pinned, and when Atlas needs something that does not exist it files a work order and ships without it meanwhile.

The first work order is the one that decides the architecture, and it is exactly what a microscope is for: **take the existing dense docent, remove its feed-forward network, hold the parameter count matched, retrain on the same campus corpus, and report what changes.** The no-FFN claim is load-bearing here --- it is what turns "facts live in the index" into an architectural guarantee, and it is why MoE left the critical path. It has not been checked at a scale where every tensor can be printed. Both outcomes are useful: if it holds, this project proceeds on better evidence than a vendor's design note; if it loses, I want to know before building on it rather than after.

The second is the tiered-weight work, reframed. A MicroMoE expert is 1,072 parameters --- 536 bytes at INT4 --- which is far too small for I/O latency to be visible. Atlas's shards are realistically sized because they have to be, so the browser becomes a better workload for the residency question than a synthetic fixture ever was.

## Why bother

Because the alternative is a hosted assistant that costs a second and a server per question, knows my corpus only as well as its last crawl, and can confidently describe a demo I never built.

The thing I want is smaller and stranger: a few megabytes published nightly, a model that cannot memorize a fact and therefore cannot invent one, an index that holds every fact and is regenerated from sources I already maintain by hand, and a deterministic matcher underneath it all that works on any machine and is currently winning.

That is the shape I am building toward: the matcher as the floor, a trained model in the browser wherever the machine can afford one, and a tiered cache that pulls the deeper shards in as they are needed and evicts them when they are not --- the same residency question the microscope has been asking about weights on a disk, asked again about weights in a browser.

None of it is proven yet. The number to beat is written down, the architecture that should beat it is chosen, and the work is to go and do it.

The rest of this week's sharpening was hardware. A new dev machine joins the lab: an HPE ProLiant DL380 Gen10 Plus running Arch Linux, waiting for ML work with 640 GB of Intel PMem 200 DIMMs --- silicon that can act as volatile RAM expansion behind a DRAM cache, as a very fast SSD, or, in App Direct mode, as byte-addressable memory that survives a power cut: one more rung on the same residency ladder this post keeps climbing. FreeToken, whose shape inspired last week's microscope, gets its first run on an RTX 3090's 24 GB. And much of what the lab built on the Mac in recent months is moving across to Arch, the same projects and the same tests, trading MLX for CUDA. None of that is proven yet either. It is all the same habit: stop, sharpen, cut better.
