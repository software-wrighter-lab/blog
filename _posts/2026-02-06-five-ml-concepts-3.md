---
layout: post
title: "Five ML Concepts - #3"
date: 2026-02-06 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, loss-function, overfitting, fine-tuning, lora, tokenization, ml-concepts]
keywords: "loss function, overfitting, fine-tuning, LoRA, low-rank adaptation, tokenization, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Loss Function (how far off predictions are), Overfitting (memorizing vs learning), Fine-tuning (specializing pre-trained models), LoRA (efficient adaptation with small matrices), Tokenization (breaking text into digestible pieces)."
series: "Five ML Concepts"
series_part: 3
video_url: "https://www.youtube.com/shorts/U-_yZZdZurU"
video_title: "Five ML Concepts - #3"
papers:
  - title: "A Survey of Loss Functions for Deep Neural Networks"
    url: "https://arxiv.org/abs/1701.00160"
  - title: "A Survey on Transfer Learning"
    url: "https://arxiv.org/abs/1911.02685"
  - title: "LoRA: Low-Rank Adaptation of Large Language Models"
    url: "https://arxiv.org/abs/2106.09685"
  - title: "Neural Machine Translation of Rare Words with Subword Units"
    url: "https://arxiv.org/abs/1508.07909"
---

<img src="{{ '/assets/images/posts/block-three.webp' | relative_url }}" class="post-marker no-invert" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #3](https://www.youtube.com/shorts/U-_yZZdZurU)<br>[![Video](https://img.youtube.com/vi/U-_yZZdZurU/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/U-_yZZdZurU) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Loss Function** | [A Survey of Loss Functions for Deep Neural Networks](https://arxiv.org/abs/1701.00160) (Janocha & Czarnecki 2017) |
| **Overfitting** | [Dropout: A Simple Way to Prevent Neural Networks from Overfitting](https://jmlr.org/papers/v15/srivastava14a.html) (Srivastava et al. 2014) |
| **Fine-tuning** | [A Survey on Transfer Learning](https://arxiv.org/abs/1911.02685) (Zhuang et al. 2020) |
| **LoRA** | [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) (Hu et al. 2021) |
| **Tokenization** | [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909) (Sennrich et al. 2015) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. Loss Function

**A formula that measures how far off the model's predictions are from the correct answers.** It quantifies the gap between what the model predicted and what it should have predicted.

Training a neural network means minimizing this function.

> Like a scorecard that tells the model how badly it messed up.

### 2. Overfitting

**When a model learns the training data too well, including noise and outliers, and fails on new data.** The model performs great on examples it has seen but poorly on anything new.

One of the most common pitfalls in machine learning.

> Like memorizing the answers to a test instead of understanding the subject.

### 3. Fine-tuning

**Taking a pre-trained model and training it further on a specific task or dataset.** Instead of training from scratch, you start from a model that already understands language or images, then specialize it.

This makes powerful models accessible without massive compute budgets.

> Like teaching a chef who already knows cooking to specialize in sushi.

### 4. LoRA (Low-Rank Adaptation)

**An efficient fine-tuning method that trains a small number of added parameters instead of the full model.** It inserts small trainable matrices into each layer while keeping the original weights frozen.

This dramatically reduces the memory and compute needed for fine-tuning.

> Like adding sticky notes to a textbook instead of rewriting the whole thing.

### 5. Tokenization

**The process of breaking text into smaller units called tokens that a model can process.** Most modern models use subword tokenization, splitting words into common pieces rather than individual characters or whole words.

It determines what the model actually "sees" and affects everything from vocabulary size to multilingual performance.

> Like chopping sentences into bite-sized pieces a model can digest.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Loss Function** | How far off the model's predictions are |
| **Overfitting** | Memorizing the test instead of learning the subject |
| **Fine-tuning** | Specializing a pre-trained model for a new task |
| **LoRA** | Efficient fine-tuning with small added matrices |
| **Tokenization** | Breaking text into the pieces a model actually reads |

---


*Short, accurate ML explainers. Follow for more.*
