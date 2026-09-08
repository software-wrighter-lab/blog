---
layout: post
title: "ML Frontier #05: Grokking --- Delayed Generalization"
date: 2026-04-23 00:15:00 -0700
categories: [machine-learning, research, explainers]
tags: [ml-frontier, grokking, generalization, mechanistic-interpretability, weight-decay, phase-transition, deep-learning]
keywords: "grokking, delayed generalization, memorization, overfitting, weight decay, regularization, mechanistic interpretability, progress measures, phase transition, lazy training, rich training, algorithmic datasets, modular arithmetic, Power 2022, Nanda 2023, Omnigrok, small networks, LLM pretraining"
author: Software Wrighter
abstract: "Train a small network past the point of zero training loss and sometimes --- thousands of steps later --- test accuracy suddenly jumps from random to near perfect. The model didn't just memorize; it discovered the rule. This is grokking, and the research explaining it reframes generalization as a phase transition."
series: "Machine Learning Frontier"
series_part: 5
video_url: "https://www.youtube.com/shorts/GVLnOhmHYGc"
video_title: "ML Frontier 5: Grokking"
papers:
  - title: "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets"
    url: "https://arxiv.org/abs/2201.02177"
  - title: "Progress Measures for Grokking via Mechanistic Interpretability"
    url: "https://arxiv.org/abs/2301.05217"
  - title: "Omnigrok: Grokking Beyond Algorithmic Data"
    url: "https://arxiv.org/abs/2210.01117"
  - title: "Grokking as the Transition from Lazy to Rich Training Dynamics"
    url: "https://arxiv.org/abs/2310.06110"
---

<img src="{{ '/assets/images/posts/thinker-grokking.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 120px;">

Fifth ML Frontier episode. You train a small network on a math task. Training loss drops to zero. Test accuracy stays at random chance. Classical intuition says you're done --- the model has overfit. But you keep training, and thousands of steps later, something surprising happens.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | [4 papers](#papers) |
| **Video** | [ML Frontier 5: Grokking](https://www.youtube.com/shorts/GVLnOhmHYGc)<br>[![Video](https://img.youtube.com/vi/GVLnOhmHYGc/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/GVLnOhmHYGc) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Phenomenon

Power et al. (2022) reported something that looked like a bug. They trained small transformers on modular arithmetic tasks and watched training loss crash to zero while test accuracy sat at random chance. By every classical signal, the models had overfit.

Then they left training running. Thousands of optimization steps past convergence --- long after any reasonable early-stopping rule would have halted the run --- test accuracy suddenly jumped from random to nearly perfect. The model hadn't just memorized. It had discovered the underlying rule.

They called this *grokking*: delayed generalization.

## Competing Circuits Inside the Network

Nanda et al. (2023) opened the network up to find out what was actually happening. Using mechanistic interpretability, they tracked the internal structure of a small transformer learning modular addition across training.

What they found: two solutions coexist and compete. A memorization circuit dominates early --- it fits the training data by rote but doesn't generalize. Underneath it, a generalizing solution slowly forms. For modular arithmetic, that solution turns out to be a Fourier-style trigonometric circuit that represents numbers on a circle and adds by rotating.

Generalization wasn't absent during the long plateau. It was being constructed, gradually, while memorization held the foreground.

## Why Regularization Wins

The handoff from memorization to generalization isn't automatic. It needs pressure.

Weight decay is the key. Memorization circuits are large and brittle --- they spread signal across many weights to pin down specific examples. The generalizing circuit is simpler and uses smaller weights. Weight decay taxes the memorization circuit more heavily than the general one, so over many steps it suppresses memorization and lets the simpler solution take over.

Omnigrok (Liu et al., 2022) generalized this picture beyond modular arithmetic, showing grokking-like dynamics across more varied tasks when the right regularization and initialization are in play. Kumar et al. (2024) reframes grokking as a transition from **lazy** training dynamics (features barely move from initialization) to **rich** training dynamics (features reorganize meaningfully) --- tying delayed generalization to well-studied concepts in deep learning theory.

## Generalization as Phase Transition

The uncomfortable lesson: generalization doesn't always emerge smoothly as loss decreases. It can appear suddenly, like a phase transition, after a long latent period where the model looks stuck.

| Phase | Train loss | Test accuracy | What's happening inside |
|-------|------------|---------------|-------------------------|
| Memorization | Drops to ~0 | Random | Network fits training set by rote |
| Plateau | ~0 | Still random | Generalizing circuit slowly forming under regularization pressure |
| Grokking | ~0 | Jumps to ~100% | Generalizing circuit overtakes memorization |

Classical early stopping would have halted training in phase 1 or 2 and declared the model a failure. The generalizing solution existed but hadn't yet taken over the output.

## The Open Question for Large Models

Grokking is most cleanly documented on small networks, small algorithmic datasets, with aggressive weight decay. The frontier question is whether a version of this happens quietly inside large language models during pretraining --- on subsets of their data, on specific capabilities, hidden inside aggregate loss curves that look smooth.

| Question | Status |
|----------|--------|
| Does grokking occur inside large-scale LLMs during pretraining? | Open --- aggregate loss hides per-capability dynamics |
| Is grokking universal or tied to specific regimes? | Evidence leans toward regime-dependent (weight decay + small tasks), but lazy-to-rich framing broadens it |
| Can we detect grokking in practice? | Mechanistic progress measures help on small models; scaling them is open |
| Can we accelerate grokking? | Regularization tuning and initialization choices influence timing |

If LLM pretraining hides local grokking events --- capabilities that appear abruptly after a long latent phase --- then loss curves alone aren't enough to decide when a model is "done." Something richer would be needed to know what it has actually learned.

## Papers {#papers}

| Date | Paper | Link |
|------|-------|------|
| Jan 2022 | Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets (Power et al.) | [arXiv 2201.02177](https://arxiv.org/abs/2201.02177) |
| Oct 2022 | Omnigrok: Grokking Beyond Algorithmic Data (Liu et al.) | [arXiv 2210.01117](https://arxiv.org/abs/2210.01117) |
| Jan 2023 | Progress Measures for Grokking via Mechanistic Interpretability (Nanda et al.) | [arXiv 2301.05217](https://arxiv.org/abs/2301.05217) |
| Oct 2023 | Grokking as the Transition from Lazy to Rich Training Dynamics (Kumar et al.) | [arXiv 2310.06110](https://arxiv.org/abs/2310.06110) |

---

*Generalization can be quiet, slow, and sudden all at once. Follow for more ML Frontier episodes exploring research at the edge.*
