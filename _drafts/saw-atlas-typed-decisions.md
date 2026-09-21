---
layout: post
title: "Saw #12: A Model That Decides, and an Index That Knows"
categories: [tools, machine-learning, languages, projects]
tags: [sharpen-the-saw, sw-atlas, demo-decision-model, typed-decision-model, typed-decisions, jev, typesafe, system-one, eliza, sw-mlpl, mlpl, semantic-index, snapshot, calibration, wasm, rust, moe-microscope, sw-campus, retrieval]
keywords: "sw-atlas, demo-decision-model, typed decision model, TDM, Jev, TypeSafe AI, System One model, ELIZA, typed decision, non-generative, Choice, Noul, Scale, decision trace, hashed features, calibration, abstention, browser demo, WASM, sw-MLPL, moe-microscope, semantic index, snapshot, runtime class, Needle, SetFit, LanceDB, offline compute"
abstract: "There is a live demo on the lab bench: a typed decision model --- 33,065 parameters, about 250 KB with its weights, the whole page --- that reads a sentence and returns probabilities over a fixed set of replies, running entirely in the browser, with a trace of every decision behind every reply. It is the smallest working piece of a larger bet: that the work can be done the night before, published as a snapshot of hundreds of kilobytes, and run in the visitor's browser with no server anywhere. sw-atlas points the same primitives at my own corpus, one semantic index over the blog, the repositories, the demos, the campus and the videos. The facts live in the index. The model holds only the language. The deterministic matcher is the floor of the ladder, not the destination."
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
  - url: "https://github.com/sw-ml-study/demo-decision-model"
    title: "demo-decision-model"
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

The first working piece of that bet is smaller than the plan and already running: [the typed decision lab](https://sw-ml-study.github.io/demo-decision-model/). Nothing to clone or install --- a trained model of 33,065 parameters, the whole page about 250 KB gzipped with weights included, reads your sentence and returns probabilities over a fixed set of replies, and a trace view shows every decision behind every reply.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-atlas** | [software-wrighter-lab/sw-atlas](https://github.com/software-wrighter-lab/sw-atlas) · [the plan](https://github.com/software-wrighter-lab/sw-atlas/blob/main/docs/plan.md) · [Needle assessment](https://github.com/software-wrighter-lab/sw-atlas/blob/main/docs/needle.md) |
| **Typed decision lab** | [sw-ml-study/demo-decision-model](https://github.com/sw-ml-study/demo-decision-model) · [live demo](https://sw-ml-study.github.io/demo-decision-model/) --- Choice, Noul and Scale as sw-MLPL primitives; ELIZA as demo 01, every decision traced |
| **Jev** | [TypeSafe AI](https://typesafe.ai/) --- the System One framing |
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

TypeSafe calls Jev a **System One model**, borrowing Kahneman: fast, automatic, non-deliberative. The concrete meaning is that it is **non-generative**. It does not emit tokens one at a time and hope they parse. It samples a **typed decision** in parallel against a schema you supply --- a `Choice` from an enumeration, a `Score`, a `Boolean` --- and returns that with a confidence, in TypeSafe's published numbers something like 70 to 500 milliseconds, with a footprint measured in megabytes rather than gigabytes.

The lab builds the same category from scratch in [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl), with three primitives and one capability: **Choice** returns a probability per option, the selected id, a confidence, and a margin; **Noul** returns one probability in `[0, 1]` for a proposition; **Scale** returns a distribution over an *ordered* scale plus its expectation; and **Memory** --- not a primitive --- is structured state the program keeps outside the model, which decisions address. There is deliberately no fourth primitive, and in particular no:

```text
generate(prompt) -> String        <-- not present, and never will be
```

That constraint is the whole point. A generative model asked "which of these is the user asking about?" can answer with a hallucinated option, a paragraph of preamble, or valid JSON describing a thing that does not exist. A model whose output *is* the schema cannot. The worst it can do is choose the wrong enum value --- and if it is [calibrated](https://arxiv.org/abs/1706.04599), say so with a low number.

ELIZA is demo 01, and it is a forcing function rather than the point. It is the smallest realistic application that needs all three primitives and memory at once, it comes with a free, exact oracle --- the 1966 rules label the training data --- and every word it speaks is canned, chosen from a bounded set the program built. The learned model replaces only the machinery that decides *which* canned response to use. "The model cannot invent an output outside the permitted space" therefore stops being a slogan and becomes something a test can enforce.

## Jev is closed; the open response is wide

Jev is closed and hosted, which makes it a good description of a category and a poor dependency. TypeSafe has published its *behavior* --- unstructured state in, predefined typed outputs with probabilities, many questions answered in parallel against one state, a two-stage path for high-cardinality choices, RLCD training aimed at calibration --- but not the architecture, the training algorithm, or the weights.

The open-source response arrived quickly, and it is wide. [The table below](#the-open-response-to-jev) is the short version of the survey: each project is genuinely good at something this corpus does not need, and none of them is a dependency of the demo, which reproduces Jev's stated contract and calibration objective --- and none of its architecture. Where a number is theirs, it is labelled; everything else is measured on my bench.

### The open response to Jev

| Project | What it is | What it is to this work |
|---|---|---|
| **[Needle](https://github.com/cactus-compute/needle)** | a 26-million-parameter encoder-decoder for tool selection, MIT, weights and trainer open | the sw-atlas-scale option for ranking resource cards; nothing the 33,065-parameter demo needs |
| **[SetFit](https://arxiv.org/abs/2209.11055)** | few-shot contrastive fine-tuning of a [sentence encoder](https://arxiv.org/abs/1908.10084); retrains on CPU in seconds | the cheapest semantic tier, worth one measurement as a floor |
| **Outlines**, **SGLang** | grammar-constrained decoding; FSMs and CFGs over the logits | for forcing a *general* model into a schema; a model whose native output is the schema does not need forcing |
| **LanceDB** | embedded, serverless vector database in Rust | 300 resources at 384 dimensions and INT8 is 115 KiB; a flat cosine scan beats any index structure at that size and adds no dependency |
| **HippoRAG 2**, **A-Mem** | infer a knowledge graph from text | this corpus does not need inference: 73 posts declare a `repo_url`, 77 a `video_url`, 64 their papers, 123 a series, all hand-written and already correct |
| **LLMRouter** | KNN and SVM routing over an embedding cache | precisely the cheap baseline tier, in a box; nothing to adopt, useful confirmation the cheap tier is right |
| **MobileBERT**, **TinyBERT** | 10--30 MB encoders for classification | comparison rows, and a sanity check that a trained model earns its weight |

The pattern across all of them is the same: retrieval and serving infrastructure for corpora far larger and far more volatile than mine. My corpus is about three hundred hand-curated artifacts that change a few times a week. The scarce resource is not index throughput. It is the visitor's RAM.

## What the demo already proves

The first slice --- one Choice question, nine ELIZA reply classes --- is trained, measured, and public, and the scoreboard is written down before the celebrating starts:

| Measured | Value |
|---|---:|
| Parameters | 33,065 |
| Whole demo page, weights included | ~250 KB gzipped |
| Latency per decision | ~1.3 ms |
| Validation accuracy | 0.879 |
| Margin over the keyword matcher on the same split | **+0.483** |

That last row is the one to dwell on. The campus docent work found the opposite --- a deterministic keyword matcher beat the trained model on every measure --- so the docent shipped and the model stayed research. The thin slice flips it: on its split, the trained Choice model beats its own keyword matcher by nearly half a point of accuracy. Same bench, same discipline of writing down what a tier must beat, first sign that the idea pays.

Just as important is what the demo admits it cannot do. A dialog probe ran sixty realistic and thirty-six wild utterances through the exact model the page runs, and graded the replies by hand: about 45 percent nonsensical on realistic inputs, 58 on wild ones --- and, the damning part, *sure* while wrong. Seventeen of the twenty-seven bad realistic replies came back at 0.85 confidence or higher. `I don't know` shares a hashed slot with a trained feature, reaches the model reading as something else entirely, and comes back COMPUTER at 0.86. The probe names the causes one by one --- hash collisions making unseen words impersonate trained ones, untrained slots diluting the mean pool, nine classes with no "none of these" escape hatch, a saturation-trained head that pushes everything to 1.00 --- and the fixes are queued as numbered work, not vibes: an escape-hatch class, collision repair, regularization, and a training timeline that snapshots weights at 0 s, 1 s, 5 s and 10 s so overconfidence becomes visible as it grows, with budget runs at 10 seconds, 1 minute, 5 minutes and 10 minutes standing in for the hour.

Underneath all of it, four standalone probes answer the sw-MLPL capability questions the design depends on --- parameters frozen outside the gradient, a two-argument scorer differentiated through, an experiment sweep living inside a function, optimizer state persisting across runs --- all green. And every decision the page makes is emitted against a versioned trace schema whose provenance rule is enforced, not hoped for: the model's answer is one of the offered candidates, or the trace says so.

## Where it goes: an index that knows

The demo holds nine canned replies. sw-atlas points the same primitives at my corpus --- the three-hundred-odd artifacts, indexed nightly:

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

The published artifact is a snapshot of hundreds of kilobytes with a hash per file --- catalog, concept graph, matcher signals, INT8 embeddings --- served nightly, and a ladder of runtime classes underneath it: it starts at a lexical-and-graph matcher on every machine, measures itself in a worker, and promotes one class at a time only after the class below came in inside its budget, demoting the moment it does not. Demotion all the way down must lose quality and never correctness. The scoreboard carries over unchanged: a tier ships when it beats the 0.685 the campus matcher scores on the same held-out questions by twenty points, and not before.

The architecture reading behind it stays on the shelf, honestly labelled. A line of published work --- feed-forward layers [merged into attention as persistent memory](https://arxiv.org/abs/1907.01470), and [transformer blocks](https://arxiv.org/abs/2311.01906) stripped to 15 percent fewer parameters at the same quality --- suggests "facts live in the index" can be a property of the architecture rather than a discipline, and Needle is a trained checkpoint at the far end of that line. The demo does not depend on any of it; the experiment that would confirm it, a parameter-matched no-FFN retrain, is written up as a work order for [moe-microscope](https://github.com/sw-ml-study/moe-microscope), which is paused right now, and waits.

## Why bother

Because the alternative is a hosted assistant that costs a second and a server per question, knows my corpus only as well as its last crawl, and can confidently describe a demo I never built.

The thing I want is smaller and stranger: a few hundred kilobytes published nightly, a model that cannot memorize a fact and therefore cannot invent one, an index that holds every fact and is regenerated from sources I already maintain by hand, and a deterministic matcher underneath it all that works on any machine. The demo is the first piece of that, running in a tab, showing its work.

The shape I am building toward: the matcher as the floor, a trained model in the browser wherever the machine can afford one, and a tiered cache that pulls the deeper pieces in as they are needed and evicts them when they are not.

None of it is proven yet. The number to beat is written down, the architecture that should beat it is chosen, and the work is to go and do it.

The rest of this week's sharpening was hardware. A new dev machine joins the lab: an HPE ProLiant DL380 Gen10 Plus running Arch Linux, waiting for ML work with 640 GB of Intel PMem 200 DIMMs --- silicon that can act as volatile RAM expansion behind a DRAM cache, as a very fast SSD, or, in App Direct mode, as byte-addressable memory that survives a power cut: one more rung on the same residency ladder this post keeps climbing. FreeToken, whose shape inspired last week's microscope, gets its first run on an RTX 3090's 24 GB. And much of what the lab built on the Mac in recent months is moving across to Arch, the same projects and the same tests, trading MLX for CUDA. None of that is proven yet either. It is all the same habit: stop, sharpen, cut better.
