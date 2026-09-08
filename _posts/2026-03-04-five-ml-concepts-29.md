---
layout: post
title: "Five ML Concepts - #29"
date: 2026-03-04 00:15:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, neural-collapse, grokking, sharpness-aware-minimization, mechanistic-interpretability, self-training-instability, ml-concepts]
keywords: "neural collapse, class representation geometry, grokking, delayed generalization, SAM, sharpness-aware minimization, flat minima, mechanistic interpretability, neural network circuits, self-training instability, feedback loops, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Neural Collapse (late-stage geometric convergence of class representations), Grokking (sudden generalization after prolonged memorization), SAM (optimizing for flat loss regions under perturbations), Mechanistic Interpretability (analyzing internal circuits of neural networks), Self-Training Instability (feedback loops that amplify errors in self-generated data)."
series: "Five ML Concepts"
series_part: 29
video_url: "https://www.youtube.com/shorts/BekrSjZ7f-4"
video_title: "Five ML Concepts - #29"
papers:
  - title: "Prevalence of Neural Collapse during the terminal phase of deep learning training"
    url: "https://arxiv.org/abs/2008.08186"
  - title: "Grokking: Generalization Beyond Overfitting on Small Algorithmic Datasets"
    url: "https://arxiv.org/abs/2201.02177"
  - title: "Sharpness-Aware Minimization for Efficiently Improving Generalization"
    url: "https://arxiv.org/abs/2010.01412"
  - title: "A Mathematical Framework for Transformer Circuits"
    url: "https://transformer-circuits.pub/2021/framework/index.html"
---

<img src="{{ '/assets/images/posts/block-29.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #29](https://www.youtube.com/shorts/BekrSjZ7f-4)<br>[![Video](https://img.youtube.com/vi/BekrSjZ7f-4/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/BekrSjZ7f-4) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Neural Collapse** | [Prevalence of Neural Collapse](https://arxiv.org/abs/2008.08186) (Papyan et al. 2020) |
| **Grokking** | [Grokking: Generalization Beyond Overfitting](https://arxiv.org/abs/2201.02177) (Power et al. 2022) |
| **SAM** | [Sharpness-Aware Minimization](https://arxiv.org/abs/2010.01412) (Foret et al. 2021) |
| **Mechanistic Interpretability** | [Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) (Anthropic 2021) |
| **Self-Training Instability** | [Understanding Self-Training](https://arxiv.org/abs/2010.02194) (Wei et al. 2020) |


</div>

## Today's Five

### 1. Neural Collapse

**In overparameterized networks trained to zero loss, class representations converge late in training to a symmetric, maximally separated structure.** The last-layer features and classifiers align into a simplex equiangular tight frame.

This geometric phenomenon appears universally across architectures.

> Like students settling into evenly spaced seats by the end of class.

### 2. Grokking

**In some tasks, especially small algorithmic ones, models memorize quickly but only later suddenly generalize.** The jump from memorization to understanding can happen long after training loss reaches zero.

Weight decay and longer training appear necessary for this phase transition.

> Like cramming facts for an exam, then later realizing you truly understand.

### 3. SAM (Sharpness-Aware Minimization)

**Instead of minimizing loss at a single point, SAM minimizes loss under small weight perturbations, finding flatter regions.** Flatter minima tend to generalize better than sharp ones.

The optimizer seeks robustness to parameter noise.

> Like choosing a wide hilltop instead of balancing on a sharp peak.

### 4. Mechanistic Interpretability

**Researchers analyze activations and internal circuits to understand how specific computations are implemented inside models.** The goal is reverse-engineering neural networks into understandable components.

This reveals attention heads, induction heads, and other interpretable patterns.

> Like mapping the wiring of an unknown machine to see how it works.

### 5. Self-Training Instability

**When models train on their own generated data, feedback loops can amplify small errors over time.** Each iteration compounds mistakes, causing distributional drift.

Careful filtering and external grounding help mitigate this.

> Like copying a copy repeatedly until the meaning drifts.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Neural Collapse** | Late-stage geometric convergence of class representations |
| **Grokking** | Sudden generalization after prolonged memorization |
| **SAM** | Optimizing for flat loss regions under perturbations |
| **Mechanistic Interpretability** | Analyzing internal circuits of neural networks |
| **Self-Training Instability** | Feedback loops that amplify errors in self-generated data |

---


*Short, accurate ML explainers. Follow for more.*
