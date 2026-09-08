---
layout: post
title: "Five ML Concepts - #12"
date: 2026-02-15 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, precision-recall, ood, batch-size, inductive-bias, latency-throughput, ml-concepts]
keywords: "precision, recall, out-of-distribution, OOD, batch size, inductive bias, latency, throughput, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Precision vs Recall (correct positives vs finding all), OOD Inputs (data unlike training), Batch Size (examples per update), Inductive Bias (built-in assumptions), Latency vs Throughput (speed vs capacity)."
series: "Five ML Concepts"
series_part: 12
video_url: "https://www.youtube.com/shorts/jQqyRdQAjPw"
video_title: "Five ML Concepts - #12"
papers:
  - title: "A Baseline for Detecting Misclassified and Out-of-Distribution Examples"
    url: "https://arxiv.org/abs/1610.02136"
  - title: "On Large-Batch Training for Deep Learning"
    url: "https://arxiv.org/abs/1609.04836"
  - title: "Relational Inductive Biases, Deep Learning, and Graph Networks"
    url: "https://arxiv.org/abs/1806.01261"
  - title: "Efficient Large-Scale Language Model Training on GPU Clusters"
    url: "https://arxiv.org/abs/2104.04473"
---

<img src="{{ '/assets/images/posts/block-drummers.webp' | relative_url }}" class="post-marker" style="width: 480px;" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #12](https://www.youtube.com/shorts/jQqyRdQAjPw)<br>[![Video](https://img.youtube.com/vi/jQqyRdQAjPw/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/jQqyRdQAjPw) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Precision/Recall** | [The Truth of the F-Measure](https://www.cs.odu.edu/~mukka/cs795sum09dm/Lecturenotes/Day3/F-measure-YS-26Oct07.pdf) (Sasaki 2007) |
| **OOD Detection** | [A Baseline for Detecting Misclassified and Out-of-Distribution Examples](https://arxiv.org/abs/1610.02136) (Hendrycks & Gimpel 2017) |
| **Batch Size** | [On Large-Batch Training for Deep Learning](https://arxiv.org/abs/1609.04836) (Goyal et al. 2017) |
| **Inductive Bias** | [Relational Inductive Biases, Deep Learning, and Graph Networks](https://arxiv.org/abs/1806.01261) (Battaglia et al. 2018) |
| **Latency/Throughput** | [Efficient Large-Scale Language Model Training on GPU Clusters](https://arxiv.org/abs/2104.04473) (Narayanan et al. 2021) |


</div>

## Today's Five

### 1. Precision vs Recall

**Precision measures how often positive predictions are correct. Recall measures how many actual positives are successfully found.** Improving one often reduces the other.

The tradeoff depends on your application: spam filters favor precision, medical screening favors recall.

> Like a search party: you can find everyone but raise false alarms, or be very certain and miss some people.

### 2. OOD Inputs (Out-of-Distribution)

**Data that differs significantly from what the model saw during training.** Models may fail silently or produce confident but wrong answers.

Detecting OOD inputs is an active research area for safer AI deployment.

> Like asking a chef trained only in Italian food to make sushi.

### 3. Batch Size

**The number of training examples processed before updating model weights.** Larger batches can be more efficient computationally, but may generalize worse.

Finding the right batch size involves balancing speed, memory, and model quality.

> Like grading tests one at a time or waiting to grade a full stack.

### 4. Inductive Bias

**The assumptions built into a model that guide how it learns from data.** Without inductive bias, models cannot generalize beyond training examples.

CNNs assume spatial locality; transformers assume tokens can attend to any position.

> Like expecting nearby houses to have similar prices before looking at the data.

### 5. Latency vs Throughput

**Latency is how long a single request takes. Throughput is how many requests can be handled per second.** Optimizing one often comes at the expense of the other.

Batching improves throughput but increases latency for individual requests.

> Like a restaurant serving one table quickly or many tables at once.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Precision vs Recall** | Correct positives vs finding all positives |
| **OOD Inputs** | Data unlike training distribution |
| **Batch Size** | Examples per weight update |
| **Inductive Bias** | Built-in learning assumptions |
| **Latency vs Throughput** | Speed per request vs total capacity |

---


*Short, accurate ML explainers. Follow for more.*
