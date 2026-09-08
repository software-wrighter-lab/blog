---
layout: post
title: "Five ML Concepts - #28"
date: 2026-03-03 00:15:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, lottery-ticket-hypothesis, sparse-activation, conditional-computation, inference-parallelism, compute-optimality, ml-concepts]
keywords: "lottery ticket hypothesis, neural network pruning, sparse activation, mixture of experts, conditional computation, dynamic routing, inference parallelism, tensor parallelism, pipeline parallelism, compute optimality, Chinchilla scaling laws, efficient scaling, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Lottery Ticket Hypothesis (small winning subnetworks within large models), Sparse Activation (using only part of a model per input), Conditional Computation (dynamically routing inputs for efficiency), Inference Parallelism (distributing inference across devices), Compute Optimality (balancing model size, data, and compute)."
series: "Five ML Concepts"
series_part: 28
video_url: "https://www.youtube.com/shorts/kKafshoP-7s"
video_title: "Five ML Concepts - #28"
papers:
  - title: "The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural Networks"
    url: "https://arxiv.org/abs/1803.03635"
  - title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer"
    url: "https://arxiv.org/abs/1701.06538"
  - title: "Training Compute-Optimal Large Language Models (Chinchilla)"
    url: "https://arxiv.org/abs/2203.15556"
  - title: "Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism"
    url: "https://arxiv.org/abs/1909.08053"
---

<img src="{{ '/assets/images/posts/block-28.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #28](https://www.youtube.com/shorts/kKafshoP-7s)<br>[![Video](https://img.youtube.com/vi/kKafshoP-7s/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/kKafshoP-7s) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Lottery Ticket Hypothesis** | [The Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635) (Frankle & Carlin 2019) |
| **Sparse Activation** | [Sparsely-Gated Mixture-of-Experts](https://arxiv.org/abs/1701.06538) (Shazeer et al. 2017) |
| **Conditional Computation** | [Sparsely-Gated MoE](https://arxiv.org/abs/1701.06538) + [Switch Transformers](https://arxiv.org/abs/2101.03961) |
| **Inference Parallelism** | [Megatron-LM](https://arxiv.org/abs/1909.08053) (Shoeybi et al. 2019) |
| **Compute Optimality** | [Chinchilla Scaling Laws](https://arxiv.org/abs/2203.15556) (Hoffmann et al. 2022) |


</div>

## Today's Five

### 1. Lottery Ticket Hypothesis

**Large neural networks contain smaller subnetworks that, when trained from the right initialization, achieve similar performance.** These "winning tickets" exist before training begins.

The key insight: you can find and train just the winning subnetwork.

> Like finding a winning lottery ticket hidden among many losing ones.

### 2. Sparse Activation

**Only a subset of neurons activate for each input, even in models with many parameters.** This allows large capacity without using everything at once.

Mixture-of-experts architectures explicitly design for this pattern.

> Like a library where only relevant books light up for each query.

### 3. Conditional Computation

**The model dynamically activates only certain components depending on the input.** Different inputs route to different experts or pathways.

This improves efficiency and scalability without proportional compute increase.

> Like routing patients to the right specialist instead of seeing every doctor.

### 4. Inference Parallelism

**Model execution can be split across multiple devices to reduce latency or increase throughput.** Tensor parallelism splits layers; pipeline parallelism splits stages.

Essential for serving large models in production.

> Like dividing a puzzle so multiple people work on it simultaneously.

### 5. Compute Optimality Hypothesis

**Empirical scaling laws suggest performance improves when model size, data, and compute are balanced.** Adding only one resource may not yield optimal gains.

Chinchilla showed many models were undertrained relative to their size.

> Like baking a cake where proportions matter more than just adding extra ingredients.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Lottery Ticket Hypothesis** | Small winning subnetworks hidden in large models |
| **Sparse Activation** | Using only part of a model per input |
| **Conditional Computation** | Dynamically routing inputs for efficiency |
| **Inference Parallelism** | Distributing inference across devices |
| **Compute Optimality** | Balancing model size, data, and compute |

---


*Short, accurate ML explainers. Follow for more.*
