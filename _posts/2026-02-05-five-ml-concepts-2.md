---
layout: post
title: "Five ML Concepts - #2"
date: 2026-02-05 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, gradient-descent, attention, dpo, learning-rate, temperature, ml-concepts]
keywords: "gradient descent, attention mechanism, DPO, direct preference optimization, learning rate, temperature sampling, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Gradient Descent (walk downhill to minimize error), Attention (focus on what matters), DPO (align from preference pairs), Learning Rate (step size tradeoff), Temperature (dial between predictable and creative)."
series: "Five ML Concepts"
series_part: 2
video_url: "https://www.youtube.com/shorts/-Y4T0_vETB4"
video_title: "Five ML Concepts - #2"
papers:
  - title: "An overview of gradient descent optimization algorithms"
    url: "https://arxiv.org/abs/1609.04747"
  - title: "Neural Machine Translation by Jointly Learning to Align and Translate"
    url: "https://arxiv.org/abs/1409.0473"
  - title: "Direct Preference Optimization"
    url: "https://arxiv.org/abs/2305.18290"
  - title: "Cyclical Learning Rates"
    url: "https://arxiv.org/abs/1506.01186"
  - title: "On the Properties of Neural Machine Translation"
    url: "https://arxiv.org/abs/1409.1259"
---

<img src="{{ '/assets/images/posts/block-two.webp' | relative_url }}" class="post-marker no-invert" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #2](https://www.youtube.com/shorts/-Y4T0_vETB4)<br>[![Video](https://img.youtube.com/vi/-Y4T0_vETB4/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/-Y4T0_vETB4) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Gradient Descent** | [An overview of gradient descent optimization algorithms](https://arxiv.org/abs/1609.04747) (Ruder 2016) |
| **Attention** | [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473) (Bahdanau et al. 2014) |
| **DPO** | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) (Rafailov et al. 2023) |
| **Learning Rate** | [Cyclical Learning Rates](https://arxiv.org/abs/1506.01186) (Smith 2015) |
| **Temperature** | [On the Properties of Neural Machine Translation](https://arxiv.org/abs/1409.1259) (Cho et al. 2014) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. Gradient Descent

**A general optimization method used across machine learning.** It improves a model by taking small steps in the direction that reduces error the most.

Many learning algorithms rely on it, especially neural networks.

> Like walking downhill in fog, adjusting each step based on the slope beneath your feet.

### 2. Attention

**A mechanism that lets models weigh different parts of the input by importance.** Instead of treating everything equally, attention highlights what matters most.

This was key to breakthroughs in translation and language models.

> Like reading a sentence and focusing more on the important words.

### 3. DPO (Direct Preference Optimization)

**A method for aligning language models with human preferences.** Unlike RLHF, it trains directly on preference comparisons and avoids an explicit reward model.

This simplifies training while achieving comparable alignment.

> Like learning preferences by observing choices, not by designing a scoring system.

### 4. Learning Rate

**Controls how large each update step is during training.** Too large and learning becomes unstable. Too small and training is slow or gets stuck.

One of the most important hyperparameters to tune.

> Like choosing how fast to walk downhill without losing balance.

### 5. Temperature

**A parameter that controls randomness during text generation.** Low temperature favors predictable, high-probability outputs. Higher temperature increases variety and surprise.

A tradeoff between consistency and creativity.

> Like adjusting a dial from cautious to adventurous.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Gradient Descent** | Walk downhill to minimize error |
| **Attention** | Focus on what matters in the input |
| **DPO** | Align models from preference pairs directly |
| **Learning Rate** | Step size that balances speed and stability |
| **Temperature** | Dial between predictable and creative |

---


*Short, accurate ML explainers. Follow for more.*
