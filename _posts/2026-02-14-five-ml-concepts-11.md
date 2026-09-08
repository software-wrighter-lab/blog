---
layout: post
title: "Five ML Concepts - #11"
date: 2026-02-14 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, rnn, chain-of-thought, softmax, moe, distribution-shift, ml-concepts]
keywords: "RNN, recurrent neural network, LSTM, long short-term memory, GRU, gated recurrent unit, chain of thought, CoT, softmax, MoE, mixture of experts, distribution shift, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: RNN (sequential processing with memory), Chain of Thought (step-by-step reasoning), Softmax (scores to probabilities), MoE (route inputs to specialists), Distribution Shift (training vs deployment mismatch)."
series: "Five ML Concepts"
series_part: 11
video_url: "https://www.youtube.com/shorts/95ng2EmBTbA"
video_title: "Five ML Concepts - #11"
papers:
  - title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"
    url: "https://arxiv.org/abs/2201.11903"
  - title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer"
    url: "https://arxiv.org/abs/1701.06538"
---

<img src="{{ '/assets/images/posts/block-pipers.webp' | relative_url }}" class="post-marker" style="width: 480px;" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #11](https://www.youtube.com/shorts/95ng2EmBTbA)<br>[![Video](https://img.youtube.com/vi/95ng2EmBTbA/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/95ng2EmBTbA) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **RNN** | [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0) (Rumelhart et al. 1986) |
| **Chain of Thought** | [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) (Wei et al. 2022) |
| **Softmax** | [Deep Learning](https://www.deeplearningbook.org/) (Goodfellow et al. 2016), Chapter 6 |
| **MoE** | [Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer](https://arxiv.org/abs/1701.06538) (Shazeer et al. 2017) |
| **Distribution Shift** | [Dataset Shift in Machine Learning](https://direct.mit.edu/books/edited-volume/3098/Dataset-Shift-in-Machine-Learning) (Quiñonero-Candela et al. 2009) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. RNN (Recurrent Neural Network)

**Networks designed for sequential data that maintain a hidden state carrying information across time steps.** This makes them useful for language, time series, and audio.

LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units) are improved variants that better handle long-range dependencies.

> Like reading a story while keeping mental notes about characters and plot as you go.

### 2. Chain of Thought

**A prompting technique that encourages step-by-step reasoning in language models.** Instead of producing an answer immediately, the model generates intermediate steps.

This can improve performance on math, logic, and multi-step problems.

> Like showing your work on a math test instead of just writing the final answer.

### 3. Softmax

**Converts a vector of scores into a probability distribution where each output falls between zero and one, and all outputs sum to one.** It is commonly used in classification models.

Softmax makes raw scores easier to interpret as probabilities.

> Like turning test scores into percentages that add up to 100%.

### 4. MoE (Mixture of Experts)

**Instead of one large network, the model contains many smaller expert networks with a routing mechanism that selects which experts process each input.** This allows models to scale capacity while keeping computation efficient.

Only a subset of experts activates for any given input.

> Like a hospital with specialists where a receptionist directs you to the right doctor.

### 5. Distribution Shift

**Occurs when deployment data differs from training data, causing a model trained on one environment to perform poorly in another.** Common causes include seasonal changes, user behavior shifts, or new populations.

Monitoring for drift and retraining helps maintain performance.

> Like a weather model trained on summer data struggling to predict winter storms.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **RNN** | Sequential processing with memory across time |
| **Chain of Thought** | Step-by-step reasoning in prompts |
| **Softmax** | Scores to normalized probabilities |
| **MoE** | Route inputs to specialized experts |
| **Distribution Shift** | Training vs deployment data mismatch |

---


*Short, accurate ML explainers. Follow for more.*
