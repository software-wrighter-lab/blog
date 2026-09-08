---
layout: post
title: "Five ML Concepts - #6"
date: 2026-02-09 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, regularization, bert, rope, prompting, positional-encoding, ml-concepts]
keywords: "regularization, L2 weight decay, dropout, BERT, bidirectional encoder, RoPE, rotary positional embeddings, prompting, prompt engineering, positional encoding, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Regularization (constraints to prevent overfitting), BERT (bidirectional masked language modeling), RoPE (position via rotation in attention), Prompting (craft inputs to steer outputs), Positional Encoding (tell model where tokens are)."
series: "Five ML Concepts"
series_part: 6
video_url: "https://www.youtube.com/shorts/ROje4xAMJKg"
video_title: "Five ML Concepts - #6"
papers:
  - title: "BERT: Pre-training of Deep Bidirectional Transformers"
    url: "https://arxiv.org/abs/1810.04805"
  - title: "RoFormer: Enhanced Transformer with Rotary Position Embedding"
    url: "https://arxiv.org/abs/2104.09864"
  - title: "Language Models are Few-Shot Learners"
    url: "https://arxiv.org/abs/2005.14165"
  - title: "Attention Is All You Need"
    url: "https://arxiv.org/abs/1706.03762"
---

<img src="{{ '/assets/images/posts/block-six.webp' | relative_url }}" class="post-marker no-invert" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #6](https://www.youtube.com/shorts/ROje4xAMJKg)<br>[![Video](https://img.youtube.com/vi/ROje4xAMJKg/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/ROje4xAMJKg) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Regularization** | [Dropout: A Simple Way to Prevent Neural Networks from Overfitting](https://jmlr.org/papers/v15/srivastava14a.html) (Srivastava et al. 2014) |
| **BERT** | [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805) (Devlin et al. 2018) |
| **RoPE** | [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864) (Su et al. 2021) |
| **Prompting** | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) (Brown et al. 2020) |
| **Positional Encoding** | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) (Vaswani et al. 2017) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. Regularization

**Techniques that reduce overfitting by adding constraints or penalties during training.** Common examples include L2 weight decay, L1 sparsity, dropout, and early stopping.

The goal is better generalization, not just fitting the training set.

> Like adding friction so a model can't take the easiest overfit path.

### 2. BERT

**Bidirectional Encoder Representations from Transformers.** A transformer encoder trained with masked language modeling: predicting hidden tokens using context from both sides.

It was a major step forward for many NLP tasks after its 2018 release.

> Like filling in blanks by reading the whole sentence, not just the words before it.

### 3. RoPE (Rotary Positional Embeddings)

**A way to represent token position inside attention by rotating query and key vectors as a function of position.** This gives attention information about relative order and distance.

It's widely used in modern transformer models.

> Like turning a dial differently for each position so the model can tell where tokens are.

### 4. Prompting

**Crafting inputs to steer a model toward the output you want.** Small changes in instructions, examples, or format can change behavior significantly.

A key skill for working effectively with language models.

> Like asking a question in just the right way to get a useful answer.

### 5. Positional Encoding

**Transformers need a way to represent token order, because attention alone doesn't include sequence position.** Different methods do this, including learned embeddings and rotary approaches like RoPE.

Without it, "the cat sat on the mat" would be indistinguishable from "mat the on sat cat the."

> Like numbering the pages of a shuffled book so you can read them in order.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Regularization** | Add constraints to prevent overfitting |
| **BERT** | Bidirectional masked language modeling |
| **RoPE** | Position info via rotation in attention |
| **Prompting** | Craft inputs to steer model outputs |
| **Positional Encoding** | Tell the model where tokens are in sequence |

---


*Short, accurate ML explainers. Follow for more.*
