---
layout: post
title: "Five ML Concepts - #27"
date: 2026-03-02 00:15:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, continual-learning, elastic-weight-consolidation, replay-buffers, parameter-routing, memory-augmented-networks, model-editing, ml-concepts]
keywords: "elastic weight consolidation, EWC, Fisher information, catastrophic forgetting, replay buffers, experience replay, parameter routing, mixture of experts, memory-augmented networks, external memory, model editing, knowledge editing, continual learning, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Elastic Weight Consolidation (protecting important parameters during new task learning), Replay Buffers (mixing past examples to prevent forgetting), Parameter Routing (activating task-specific parameter subsets), Memory-Augmented Networks (external memory modules for neural networks), Model Editing (targeted weight updates without full retraining)."
series: "Five ML Concepts"
series_part: 27
video_url: "https://www.youtube.com/shorts/K7ucT7NV45g"
video_title: "Five ML Concepts - #27"
papers:
  - title: "Overcoming catastrophic forgetting in neural networks (EWC)"
    url: "https://arxiv.org/abs/1612.00796"
  - title: "Experience Replay for Continual Learning"
    url: "https://arxiv.org/abs/1811.11682"
  - title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer"
    url: "https://arxiv.org/abs/1701.06538"
  - title: "Neural Turing Machines"
    url: "https://arxiv.org/abs/1410.5401"
  - title: "Editing Large Language Models: Problems, Methods, and Opportunities"
    url: "https://arxiv.org/abs/2305.13172"
---

<img src="{{ '/assets/images/posts/block-27.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #27](https://www.youtube.com/shorts/K7ucT7NV45g)<br>[![Video](https://img.youtube.com/vi/K7ucT7NV45g/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/K7ucT7NV45g) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Elastic Weight Consolidation** | [Overcoming catastrophic forgetting](https://arxiv.org/abs/1612.00796) (Kirkpatrick et al. 2017) |
| **Replay Buffers** | [Experience Replay for Continual Learning](https://arxiv.org/abs/1811.11682) (Rolnick et al. 2019) |
| **Parameter Routing** | [Sparsely-Gated Mixture-of-Experts](https://arxiv.org/abs/1701.06538) (Shazeer et al. 2017) |
| **Memory-Augmented Networks** | [Neural Turing Machines](https://arxiv.org/abs/1410.5401) (Graves et al. 2014) |
| **Model Editing** | [Editing Large Language Models](https://arxiv.org/abs/2305.13172) (Yao et al. 2023) |


</div>

## Today's Five

### 1. Elastic Weight Consolidation

**Adding a penalty that discourages changing parameters important to previous tasks.** Importance is estimated using Fisher information from prior training.

This helps models learn new tasks without catastrophic forgetting.

> Like protecting well-worn neural pathways while building new ones.

### 2. Replay Buffers

**Storing examples from earlier tasks and mixing them into new training.** Past data is replayed alongside current examples during optimization.

This reinforces previous knowledge while learning new data.

> Like reviewing old flashcards while studying new material.

### 3. Parameter Routing

**Activating different subsets of model parameters depending on the task or input.** Mixture-of-experts and conditional computation route inputs to specialized weights.

Enables specialization without fully separate models.

> Like having different experts handle different questions.

### 4. Memory-Augmented Networks

**Adding external memory modules that neural networks can read from and write to.** The model learns to store and retrieve information during inference.

Extends beyond purely weight-based memory to explicit storage.

> Like giving a calculator access to a notepad.

### 5. Model Editing

**Targeted weight updates to modify specific behaviors without full retraining.** Locate and adjust the parameters responsible for particular facts or behaviors.

Allows fast corrections and knowledge updates post-training.

> Like editing a specific entry in an encyclopedia instead of rewriting the whole book.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Elastic Weight Consolidation** | Protecting important parameters during new learning |
| **Replay Buffers** | Mixing past examples to prevent forgetting |
| **Parameter Routing** | Activating task-specific parameter subsets |
| **Memory-Augmented Networks** | External memory modules for neural networks |
| **Model Editing** | Targeted weight updates without full retraining |

---


*Short, accurate ML explainers. Follow for more.*
