---
layout: post
title: "Five ML Concepts - #1"
date: 2026-02-04 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, backpropagation, transformer, mamba, hallucination, embedding, ml-concepts]
keywords: "backpropagation, transformer architecture, Mamba SSM, hallucination, embeddings, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Backpropagation (learning by flowing error backward), Transformers (attention over all tokens), Mamba (linear-time sequence modeling), Hallucination (confident nonsense), and Embeddings (meaning as coordinates)."
series: "Five ML Concepts"
series_part: 1
video_url: "https://www.youtube.com/shorts/Zu3zreN8c0Q"
video_title: "Five ML Concepts - #1"
papers:
  - title: "Attention Is All You Need"
    url: "https://arxiv.org/abs/1706.03762"
  - title: "Mamba: Linear-Time Sequence Modeling"
    url: "https://arxiv.org/abs/2312.00752"
  - title: "Survey of Hallucination in NLG"
    url: "https://arxiv.org/abs/2202.03629"
  - title: "Word2Vec"
    url: "https://arxiv.org/abs/1301.3781"
---

<img src="{{ '/assets/images/posts/block-one.webp' | relative_url }}" class="post-marker no-invert" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #1](https://www.youtube.com/shorts/Zu3zreN8c0Q)<br>[![Video](https://img.youtube.com/vi/Zu3zreN8c0Q/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/Zu3zreN8c0Q) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Backprop** | [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0) (Rumelhart, Hinton, Williams 1986) |
| **Transformer** | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) (Vaswani et al. 2017) |
| **Mamba** | [Mamba: Linear-Time Sequence Modeling](https://arxiv.org/abs/2312.00752) (Gu & Dao 2023) |
| **Hallucination** | [Survey of Hallucination in NLG](https://arxiv.org/abs/2202.03629) (Ji et al. 2023) |
| **Embedding** | [Word2Vec](https://arxiv.org/abs/1301.3781) (Mikolov et al. 2013) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. Backpropagation

**Back propagation of errors.** It's how neural networks learn---flowing error backward through the network to adjust each weight.

Without it, modern deep learning wouldn't be practical.

> Think of it like retracing your steps to see which earlier choices caused the mistake.

### 2. Transformer

**The architecture behind GPT, Claude, and most modern language models.** Instead of processing words one at a time, transformers use attention to weigh relationships between all tokens.

This enables parallel training and rich context awareness.

> Like understanding a sentence by seeing how every word relates to every other.

### 3. Mamba (State Space Models)

**A newer alternative to transformers** that processes sequences in linear time instead of quadratic.

This allows scaling to very long documents with much lower memory use.

> Like a smart conveyor belt that carries forward only what matters.

### 4. Hallucination

**When a model generates confident-sounding nonsense.** It happens because language models predict plausible next words, not true facts.

They optimize for likelihood, not correctness.

> Like a student who writes confidently without verifying sources.

### 5. Embedding

**Turning words, images, or concepts into vectors of numbers.** Similar meanings end up close together in this space.

This lets math capture semantic relationships.

> Think of it as a coordinate system for meaning.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Backprop** | Learn by flowing error backward |
| **Transformer** | Attention over all tokens at once |
| **Mamba** | Linear-time sequence modeling |
| **Hallucination** | Confident nonsense from likelihood optimization |
| **Embedding** | Meaning as coordinates in vector space |

---


*Short, accurate ML explainers. Follow for more.*
