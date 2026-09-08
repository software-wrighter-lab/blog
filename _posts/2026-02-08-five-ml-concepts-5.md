---
layout: post
title: "Five ML Concepts - #5"
date: 2026-02-08 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, perceptron, pre-training, speculative-decoding, in-context-learning, latent-space, ml-concepts]
keywords: "perceptron, pre-training, speculative decoding, in-context learning, ICL, latent space, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Perceptron (single linear unit ancestor), Pre-training (learn general patterns first), Speculative Decoding (draft fast, verify in parallel), In-Context Learning (adapt from prompt examples), Latent Space (internal representations where similar things cluster)."
series: "Five ML Concepts"
series_part: 5
video_url: "https://www.youtube.com/shorts/8rzKVzfp2PU"
video_title: "Five ML Concepts - #5"
papers:
  - title: "BERT: Pre-training of Deep Bidirectional Transformers"
    url: "https://arxiv.org/abs/1810.04805"
  - title: "Fast Inference from Transformers via Speculative Decoding"
    url: "https://arxiv.org/abs/2211.17192"
  - title: "Language Models are Few-Shot Learners"
    url: "https://arxiv.org/abs/2005.14165"
  - title: "Auto-Encoding Variational Bayes"
    url: "https://arxiv.org/abs/1312.6114"
---

<img src="{{ '/assets/images/posts/block-five.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #5](https://www.youtube.com/shorts/8rzKVzfp2PU)<br>[![Video](https://img.youtube.com/vi/8rzKVzfp2PU/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/8rzKVzfp2PU) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Perceptron** | [The Perceptron: A Probabilistic Model](https://psycnet.apa.org/record/1959-09865-001) (Rosenblatt 1958) |
| **Pre-training** | [BERT: Pre-training of Deep Bidirectional Transformers](https://arxiv.org/abs/1810.04805) (Devlin et al. 2018) |
| **Speculative Decoding** | [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192) (Leviathan et al. 2022) |
| **ICL** | [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) (Brown et al. 2020) |
| **Latent Space** | [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) (Kingma & Welling 2013) |


</div>

<div style="display:none">

</div>

## Today's Five

### 1. Perceptron

**The simplest neural network: a single linear unit with weights and a bias.** It computes a weighted sum and applies a threshold or activation.

It inspired modern neural networks, even though today's models are far more complex.

> Like a single voter weighing inputs before deciding yes or no.

### 2. Pre-training

**Training a model on a large, general dataset before adapting it to a specific task.** This gives the model broad patterns that later training can refine.

BERT, GPT, and most modern LLMs use this approach.

> Like going to medical school before choosing a specialty.

### 3. Speculative Decoding

**A technique where a small, fast model proposes tokens, and a larger model verifies or rejects them in parallel.** This can speed up inference without changing final outputs.

A key optimization for production LLM deployments.

> Like a junior writer drafting text for a senior editor to approve in batches.

### 4. In-Context Learning (ICL)

**When a model adapts its behavior using examples in the prompt, without updating its weights.** It allows flexible task behavior at inference time.

This emergent capability surprised researchers when GPT-3 demonstrated it.

> Like solving a new puzzle after seeing a few worked examples.

### 5. Latent Space

**The internal representations a model learns as it processes data.** In this space, similar inputs tend to be located near each other.

It's not a literal place, but a useful way to think about how models organize information.

> Like a map where cities are arranged by similarity instead of geography.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Perceptron** | Single linear unit---the neural network ancestor |
| **Pre-training** | Learn general patterns before specializing |
| **Speculative Decoding** | Draft fast, verify in parallel |
| **ICL** | Adapt from prompt examples without training |
| **Latent Space** | Internal representations where similar things cluster |

---


## Related Posts

- [In-Context Learning Revisited: From Mystery to Engineering](/2026/02/22/icl-revisited-from-mystery-to-engineering/) — A deeper exploration of how ICL evolved from emergent surprise to engineered capability.

---

*Short, accurate ML explainers. Follow for more.*
