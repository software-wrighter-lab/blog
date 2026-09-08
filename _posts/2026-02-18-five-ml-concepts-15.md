---
layout: post
title: "Five ML Concepts - #15"
date: 2026-02-18 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, perplexity, catastrophic-forgetting, weight-initialization, curse-of-dimensionality, drift-detection, ml-concepts]
keywords: "perplexity, catastrophic forgetting, weight initialization, curse of dimensionality, monitoring, drift detection, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Perplexity (how surprised by data), Catastrophic Forgetting (new learning erases old), Weight Initialization (starting values matter), Curse of Dimensionality (high-D makes data sparse), Monitoring (track performance and drift)."
series: "Five ML Concepts"
series_part: 15
video_url: "https://www.youtube.com/shorts/lkviAtRMgjc"
video_title: "Five ML Concepts - #15"
papers:
  - title: "Overcoming Catastrophic Forgetting in Neural Networks"
    url: "https://arxiv.org/abs/1612.00796"
  - title: "Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift"
    url: "https://arxiv.org/abs/1810.11953"
  - title: "Understanding the Difficulty of Training Deep Feedforward Neural Networks"
    url: "https://proceedings.mlr.press/v9/glorot10a.html"
---

<img src="{{ '/assets/images/posts/block-fifteen.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #15](https://www.youtube.com/shorts/lkviAtRMgjc)<br>[![Video](https://img.youtube.com/vi/lkviAtRMgjc/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/lkviAtRMgjc) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Perplexity** | [A Neural Probabilistic Language Model](https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf) (Bengio et al. 2003) |
| **Catastrophic Forgetting** | [Overcoming Catastrophic Forgetting in Neural Networks](https://arxiv.org/abs/1612.00796) (Kirkpatrick et al. 2017) |
| **Weight Initialization** | [Understanding the Difficulty of Training Deep Feedforward Neural Networks](https://proceedings.mlr.press/v9/glorot10a.html) (Glorot & Bengio 2010) |
| **Curse of Dimensionality** | [The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/) (Hastie et al. 2009), Chapter 2 |
| **Monitoring & Drift** | [Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift](https://arxiv.org/abs/1810.11953) (Rabanser et al. 2019) |


</div>

## Today's Five

### 1. Perplexity

**A metric for language models that reflects how well the model predicts the next token.** Lower perplexity means better predictive performance.

Perplexity is the exponentiated average negative log-likelihood per token.

> Like a test where lower scores mean you found the answers easier to guess.

### 2. Catastrophic Forgetting

**When training on new tasks causes a model to lose performance on previously learned tasks.** This is a key challenge in continual learning.

Techniques like elastic weight consolidation help preserve important weights.

> Like learning a new phone number and forgetting the old one.

### 3. Weight Initialization

**The starting values of model weights influence how well training progresses.** Poor initialization can cause vanishing or exploding gradients.

Xavier and He initialization are common strategies for setting initial weights appropriately.

> Like starting a race from a good position instead of stuck in a ditch.

### 4. Curse of Dimensionality

**In high-dimensional spaces, data becomes sparse and distances behave differently, making learning harder.** Points that seem close in low dimensions can be far apart in high dimensions.

Feature selection and dimensionality reduction help mitigate this effect.

> Like searching for a friend in a city versus across the entire universe.

### 5. Monitoring & Drift Detection

**Continuously tracking model performance and detecting shifts in input data distributions.** Production models can degrade silently without proper monitoring.

Automated alerts help catch problems before they affect users.

> Like a weather station alerting you when conditions change.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Perplexity** | How surprised the model is by the data |
| **Catastrophic Forgetting** | New learning erases old knowledge |
| **Weight Initialization** | Starting values affect training stability |
| **Curse of Dimensionality** | High dimensions make data sparse |
| **Monitoring & Drift** | Track performance and data changes |

---


*Short, accurate ML explainers. Follow for more.*

