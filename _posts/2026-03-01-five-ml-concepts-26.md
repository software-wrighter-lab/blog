---
layout: post
title: "Five ML Concepts - #26"
date: 2026-03-01 00:15:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, data-augmentation, caching-strategies, constitutional-ai, goodharts-law, manifold-hypothesis, ml-concepts]
keywords: "data augmentation, training transformations, caching strategies, inference latency, constitutional AI, AI alignment, Goodhart's law, optimization metrics, manifold hypothesis, dimensionality reduction, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Data Augmentation (expanding training data with transformations), Caching Strategies (reducing latency by reusing computation), Constitutional AI (training models to follow explicit principles), Goodhart's Law (optimizing metrics distorts objectives), Manifold Hypothesis (data lies on lower-dimensional structures)."
series: "Five ML Concepts"
series_part: 26
video_url: "https://www.youtube.com/shorts/DDsrO5oYXa8"
video_title: "Five ML Concepts - #26"
papers:
  - title: "A survey on Image Data Augmentation for Deep Learning"
    url: "https://journalofbigdata.springeropen.com/articles/10.1186/s40537-019-0197-0"
  - title: "Constitutional AI: Harmlessness from AI Feedback"
    url: "https://arxiv.org/abs/2212.08073"
  - title: "Goodhart's Law and Machine Learning: A Structural Perspective"
    url: "https://arxiv.org/abs/2210.01911"
  - title: "An Introduction to Variational Autoencoders"
    url: "https://arxiv.org/abs/1906.02691"
---

<img src="{{ '/assets/images/posts/block-26.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #26](https://www.youtube.com/shorts/DDsrO5oYXa8)<br>[![Video](https://img.youtube.com/vi/DDsrO5oYXa8/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/DDsrO5oYXa8) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Data Augmentation** | [A survey on Image Data Augmentation](https://journalofbigdata.springeropen.com/articles/10.1186/s40537-019-0197-0) (Shorten & Khoshgoftaar 2019) |
| **Caching Strategies** | Systems engineering practice (no canonical paper) |
| **Constitutional AI** | [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (Bai et al. 2022) |
| **Goodhart's Law** | [Goodhart's Law and Machine Learning](https://arxiv.org/abs/2210.01911) (Sevilla et al. 2022) |
| **Manifold Hypothesis** | [An Introduction to Variational Autoencoders](https://arxiv.org/abs/1906.02691) (Kingma & Welling 2019) |


</div>

## Today's Five

### 1. Data Augmentation

**Creating additional training examples using label-preserving transformations.** Rotate, flip, crop, or color-shift images without changing what they represent.

Effectively increases dataset size and improves generalization.

> Like practicing piano pieces at different tempos to build flexibility.

### 2. Caching Strategies

**Storing previous computation results to reduce repeated work and latency.** Cache embeddings, KV states, or frequently requested outputs.

Essential for production inference at scale.

> Like keeping frequently used books on your desk instead of the library.

### 3. Constitutional AI

**Training models to follow explicit written principles alongside other alignment methods.** The constitution provides clear rules for behavior.

Models critique and revise their own outputs against these principles.

> Like giving someone written house rules instead of vague instructions.

### 4. Goodhart's Law

**When a measure becomes a target, it can stop being a good measure.** Optimizing for a proxy metric can diverge from the true objective.

A core challenge in reward modeling and evaluation design.

> Like studying only for the test instead of learning the subject.

### 5. Manifold Hypothesis

**The idea that real-world data lies on lower-dimensional structures within high-dimensional space.** Images of faces don't fill all possible pixel combinations.

This structure is what representation learning exploits.

> Like faces varying along a few key features instead of every pixel independently.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Data Augmentation** | Expanding training data with transformations |
| **Caching Strategies** | Reducing latency by reusing computation |
| **Constitutional AI** | Training models to follow explicit principles |
| **Goodhart's Law** | Optimizing metrics distorts objectives |
| **Manifold Hypothesis** | Data lies on lower-dimensional structures |

---


*Short, accurate ML explainers. Follow for more.*
