---
layout: post
title: "Saw #12: A Model That Decides, and an Index That Knows"
categories: [tools, machine-learning, languages, projects]
tags: [sharpen-the-saw, demo-decision-model, typed-decision-model, typed-decisions, jev, typesafe, system-one, eliza, sw-mlpl, mlpl, calibration, wasm, rust, sw-atlas, moe-microscope, sw-campus]
keywords: "demo-decision-model, typed decision model, TDM, Jev, TypeSafe AI, System One model, ELIZA, typed decision, non-generative, Choice, Noul, Scale, decision trace, hashed features, calibration, abstention, browser demo, WASM, sw-MLPL, sw-atlas, moe-microscope, Needle, SetFit, LanceDB"
abstract: "There is a live demo on the lab bench: a typed decision model --- 33,065 parameters, about 250 KB with its weights, the whole page --- that reads a sentence and returns probabilities over a fixed set of replies, running entirely in the browser on sw-MLPL, with a trace of every decision behind every reply and a scrubbable timeline of its own training from random weights. Jev, TypeSafe's closed System One model, is the inspiration; the open-source response to it is wide; this is the lab's own entry, measured honestly --- including a probe of exactly why its replies sometimes miss. When the primitives prove viable, they land in sw-atlas, an index that knows the corpus, and in the campus tour guide. The facts live in the index. The model holds only the language."
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
  - url: "https://github.com/sw-ml-study/demo-decision-model"
    title: "demo-decision-model"
  - url: "https://github.com/software-wrighter-lab/sw-atlas"
    title: "sw-atlas"
---

<img src="{{ '/assets/images/posts/sw-atlas-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

There is a live demo on the lab bench: a trained model --- 33,065 parameters, the whole page about 250 KB with its weights included --- reads your sentence and returns probabilities over a fixed set of replies, running entirely in the browser, with a trace of every decision behind every reply.

</div>

<!--more-->

Nothing to clone or install: it is at [the typed decision lab](https://sw-ml-study.github.io/demo-decision-model/). This week's sharpening is that model --- why it exists, what it already proves, what it admits it cannot do, and where it goes once it works. The short version of the thesis: **decisions, not sentences, are what software actually wants from small models.**

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Typed decision lab** | [sw-ml-study/demo-decision-model](https://github.com/sw-ml-study/demo-decision-model) · [live demo](https://sw-ml-study.github.io/demo-decision-model/) --- Choice, Noul and Scale as sw-MLPL primitives; ELIZA as demo 01, every decision traced |
| **Jev** | [TypeSafe AI](https://typesafe.ai/) --- the System One framing |
| **Builds toward** | [software-wrighter-lab/sw-atlas](https://github.com/software-wrighter-lab/sw-atlas) · [the plan](https://github.com/software-wrighter-lab/sw-atlas/blob/main/docs/plan.md) · [moe-microscope](https://github.com/sw-ml-study/moe-microscope) · [the campus](https://software-wrighter-lab.github.io/sw-campus/#/) |
| **Prior posts** | [A Tiny Mixture of Experts Microscope](/2026/09/13/saw-building-a-tiny-mixture-of-experts/) · [A Campus for the Public Work](/2026/09/12/software-wrighter-research-campus/) |
| **Papers** | [Persistent Memory](https://arxiv.org/abs/1907.01470) · [Simplifying Transformer Blocks](https://arxiv.org/abs/2311.01906) · [Sentence-BERT](https://arxiv.org/abs/1908.10084) · [SetFit](https://arxiv.org/abs/2209.11055) · [Calibration](https://arxiv.org/abs/1706.04599) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A model that does not write

<div class="aside-box outdent-right" markdown="1">

**Why "Saw"?** The name is Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. [This series](/series/#sharpen-the-saw-sundays) is where I routinely add tools and improve the ones I have, on the principle that time spent on the tools comes back many times over in everything built with them. This week it sharpened the smallest tool with the longest reach.

</div>

The vocabulary is worth learning even if you never build one, because it names a category that gets lost next to chatbots.

TypeSafe's **Jev** is the inspiration: a **System One model**, borrowing Kahneman --- fast, automatic, non-deliberative. The concrete meaning is that it is **non-generative**. It does not emit tokens one at a time and hope they parse. It samples a **typed decision** in parallel against a schema you supply --- a `Choice` from an enumeration, a `Score`, a `Boolean` --- and returns that with a confidence, in TypeSafe's published numbers something like 70 to 500 milliseconds, with a footprint measured in megabytes rather than gigabytes. Jev is closed and hosted: a good description of a category, a poor dependency.

The lab's entry is [demo-decision-model](https://github.com/sw-ml-study/demo-decision-model), a Typed Decision Model built in [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl), small enough that every parameter, probability, and branch can be printed. Three primitives and one capability: **Choice** returns a probability per option, the selected id, a confidence, and a margin; **Noul** returns one probability in `[0, 1]` for a proposition; **Scale** returns a distribution over an *ordered* scale plus its expectation; and **Memory** --- not a primitive --- is structured state the program keeps outside the model, which decisions address. All three are specified in the contract; the demo ships the first of them, and Noul and Scale are queued as numbered work behind it, once the thin slice has earned its footing. There is deliberately no fourth primitive, and in particular no:

```text
generate(prompt) -> String        <-- not present, and never will be
```

That constraint is the whole point. A generative model asked "which of these is the user asking about?" can answer with a hallucinated option, a paragraph of preamble, or valid JSON describing a thing that does not exist. A model whose output *is* the schema cannot. The worst it can do is choose the wrong enum value --- and if it is [calibrated](https://arxiv.org/abs/1706.04599), say so with a low number. Ordinary program code owns every threshold, every side effect, and every string a user ever sees. The model reports belief; the program decides what to do about it.

ELIZA is demo 01, and it is a forcing function rather than the point. It is the smallest realistic application that needs all three primitives and memory at once, it comes with a free, exact oracle --- the 1966 rules label the training data --- and every word it speaks is canned, chosen from a bounded set the program built. The learned model replaces only the machinery that decides *which* canned response to use. The first slice answers it with Choice alone; Noul, Scale, and memory arrive as the engine deepens, which is exactly why ELIZA was picked. "The model cannot invent an output outside the permitted space" therefore stops being a slogan and becomes something a test can enforce.

## The open response to Jev

Jev is not the only fish in the sea for long. The open-source response to a closed model in a category this attractive arrived quickly, and it is wide --- tool-selecting encoders, grammar-constrained decoding, embedded vector stores, graph builders, routers. The table is the short version of the survey; the honest footnote under all of it is that the demo reproduces Jev's *stated contract and calibration objective*, not any of these architectures, and depends on none of these projects. Where a number is theirs, it is labelled; everything else is measured on the lab's bench.

| Project | What it is | What it is to this work |
|---|---|---|
| **[Needle](https://github.com/cactus-compute/needle)** | a 26-million-parameter encoder-decoder for tool selection, MIT, weights and trainer open | the corpus-scale option for ranking resource cards; nothing the 33,065-parameter demo needs |
| **[SetFit](https://arxiv.org/abs/2209.11055)** | few-shot contrastive fine-tuning of a [sentence encoder](https://arxiv.org/abs/1908.10084); retrains on CPU in seconds | the cheapest semantic tier, worth one measurement as a floor |
| **Outlines**, **SGLang** | grammar-constrained decoding; FSMs and CFGs over the logits | for forcing a *general* model into a schema; a model whose native output is the schema does not need forcing |
| **LanceDB** | embedded, serverless vector database in Rust | 300 resources at 384 dimensions and INT8 is 115 KiB; a flat cosine scan beats any index structure at that size and adds no dependency |
| **HippoRAG 2**, **A-Mem** | infer a knowledge graph from text | the lab's corpora declare their own relations --- repos, videos, papers, series --- by hand, already correct |
| **LLMRouter** | KNN and SVM routing over an embedding cache | precisely the cheap baseline tier, in a box; nothing to adopt, useful confirmation the cheap tier is right |
| **MobileBERT**, **TinyBERT** | 10--30 MB encoders for classification | comparison rows, and a sanity check that a trained model earns its weight |

## Demo 01: ELIZA, end to end

The point of the repository is that nothing is hidden, so here is the whole pipeline: where the data comes from, what training actually is, how the model reaches the browser, and what it measures --- including the parts that went badly.

### The data is free

ELIZA's 1966 rules are an exact, deterministic oracle. They decide, for any input, which class of reply applies, so they label training data with no human effort and no disagreement --- the rare case where ground truth costs nothing.

Everything ELIZA-specific lives in one place: `eliza.mlpl` holds the nine response classes --- GREET, FAMILY, FEELING, DESIRE, DREAM, COMPUTER, YES, NO, FALLBACK, with FALLBACK a trained class carrying its own examples rather than a leftover bucket --- the canned replies, the 1966-style keyword matcher that serves as the yardstick, and the templates the training corpus is generated from. That corpus is 232 sentences. Nothing outside that file ever learns these words; a repository script checks the abstraction boundary, because the acceptance test for the primitives is that demo 02 --- the campus tour guide --- reuses `lib/` without dragging ELIZA along.

Held back from training are the probe sets: sixty realistic things people actually type to a therapist --- hedges, questions, loss, work, sleep, hostility, thanks, goodbye --- and thirty-six wild ones: memes, keyboard noise, everyday nonsense.

### Training in sw-MLPL

`train.mlpl` is one Choice question over the nine classes. A sentence is lowercased and cleaned, split into words, and poured into 1,024 hashed slots --- one for each word and word-bigram --- each slot carrying a learned 32-dimension embedding; a masked mean pool averages the slots; a linear head maps the pool to nine logits. The whole model is three arrays, and every parameter can literally be printed: 1,024 × 32 embeddings, plus 32 × 9 head weights, plus 9 biases --- 32,768 + 288 + 9 = **33,065**.

Training is 200 steps of gradient descent at learning rate 0.05, from seeded random init, entirely inside sw-MLPL: the gradients, the optimizer, the loss. (The parameters live in the caller's globals rather than as arguments, because a model cannot be passed into the autodiff gradient --- one of the capability probes below exists precisely to check that this works.) Before the run is allowed to call itself done, it reports the learned model against the 1966 keyword matcher on the same splits, per class, and writes a row to the results table --- memory, speed, and quality, or the row is not written.

Parity between the two paths is a test, not a hope: the forward pass that trains and the inference path that loads a saved weights record are asserted to agree, so what was trained is exactly what ships.

### Into the browser

`export.mlpl` writes the trained arrays out; the Rust side loads that bundle with a model implementation parity-checked against the MLPL numbers; the whole thing compiles to WebAssembly. The page --- weights included --- is about 250 KB gzipped, which is to say: smaller than most hero images.

The page speaks only canned strings; the model decides which. Every decision emits a `decision-trace-v1` record, and the trace view shows, for every reply, the candidates the model was offered, the probability it gave each, and the one it chose --- whose provenance rule is enforced, not hoped for: the answer is one of the offered candidates, or the trace says so. A link can carry the conversation: `?say=my+mom+never+listens+to+me` opens the canonical session already answered.

### What it measures --- and what it admits

| Measured | Value |
|---|---:|
| Parameters | 33,065 |
| Whole demo page, weights included | ~250 KB gzipped |
| Latency per decision | ~1.3 ms |
| Validation accuracy | 0.879 |
| Margin over the 1966 keyword matcher on the same split | **+0.483** |

That last row is the one to dwell on, because the lab's standing rule is that every trained tier must beat the deterministic thing below it or ship as the deterministic thing instead. The thin slice clears its own matcher by nearly half a point of accuracy. Same bench, same discipline: write down what the tier must beat, and let the number decide.

Just as important is what the demo admits it cannot do. A dialog probe ran those sixty realistic and thirty-six wild utterances through the exact model the page runs, and graded the replies by hand: about 45 percent nonsensical on realistic inputs, 58 on wild ones --- and, the damning part, *sure* while wrong. Seventeen of the twenty-seven bad realistic replies came back at 0.85 confidence or higher. `I don't know` shares a hashed slot with a trained feature, reaches the model reading as something else entirely, and comes back COMPUTER at 0.86. The probe names the causes one by one --- hash collisions making unseen words impersonate trained ones, untrained slots diluting the mean pool, nine classes with no "none of these" escape hatch, a saturation-trained head that pushes everything to 1.00 --- and the remaining fixes are queued as numbered work, not vibes: an escape-hatch class, collision repair, regularization, and longer training-budget runs standing in for the hour.

One fix is already live. The page now shows training, not just inference: a scrubbable timeline from seeded random weights to ten seconds of full-batch Adam --- snapshots at 0, 1, 2, 5 and 10 seconds, what each bought on an M1 Max --- where picking a snapshot re-decides the entire conversation with the model exactly as it was then, beside that snapshot's measured numbers and a chart of validation accuracy against confidence on the probe inputs. Overconfidence becomes something you can scrub through, not just read about.

Underneath all of it, four standalone probes answer the sw-MLPL capability questions the design depends on --- parameters frozen outside the gradient, a two-argument scorer differentiated through, an experiment sweep living inside a function, optimizer state persisting across runs --- all green.

## Where it goes next

**sw-atlas** first. Somebody asks where that thing about running experts from disk was, and today the honest answer is that I go and look, because I wrote it: a hundred and twenty-four posts, a hundred and thirty-odd repositories, seventy-five videos, a campus that indexes them. Atlas points the same primitives at that corpus --- one semantic index over everything the lab publishes, regenerated nightly from sources already maintained by hand, published as a snapshot of hundreds of kilobytes. The model reads a visitor's sentence and returns intent, concepts, and a confidence; ordinary code resolves them against the catalog. The model never emits prose, a URL, or a resource id, so **a stale model cannot invent a blog post or a dead link** --- that is not a policy I promise to enforce; it is the only thing the output type permits. The campus matcher's 0.685 on held-out questions stays written down as the number every tier must beat.

The campus tour guide comes after, and it is paused until this work proves viable --- that ordering is the whole point of a sharpening week. It is also where Noul and Scale are slated to arrive: a tour guide lives on one-probability questions --- *is this artifact about what the visitor asked for?* --- and ordered ones --- *how well does this match?* --- so the docent rebuild in the moe-microscope line of work is their natural first customer. When the primitives are calibrated enough to branch on, the docent gets rebuilt on them; moe-microscope's mechanisms return only where they earn their place, and the parameter-matched no-feed-forward question --- whether [facts can live in the index](https://arxiv.org/abs/1907.01470) as a property of the [architecture](https://arxiv.org/abs/2311.01906) rather than a discipline --- stays parked on the shelf with the microscope until then.

## Why bother

Because the alternative is a hosted assistant that costs a second and a server per question, knows my corpus only as well as its last crawl, and can confidently describe a demo I never built.

The thing I want is smaller and stranger: a few hundred kilobytes published nightly, a model that cannot memorize a fact and therefore cannot invent one, and a deterministic matcher underneath it all that works on any machine. The demo is the first piece, running in a tab, showing its work.

None of it is proven yet. The number to beat is written down, the architecture that should beat it is chosen, and the work is to go and do it.

The rest of this week's sharpening was hardware. A new dev machine joins the lab: an HPE ProLiant DL380 Gen10 Plus running Arch Linux, waiting for ML work with 640 GB of Intel PMem 200 DIMMs --- silicon that can act as volatile RAM expansion behind a DRAM cache, as a very fast SSD, or, in App Direct mode, as byte-addressable memory that survives a power cut: one more rung on the same residency ladder this post keeps climbing. FreeToken, whose shape inspired the microscope, gets its first run on an RTX 3090's 24 GB. And much of what the lab built on the Mac in recent months is moving across to Arch, the same projects and the same tests, trading MLX for CUDA. None of that is proven yet either. It is all the same habit: stop, sharpen, cut better.
