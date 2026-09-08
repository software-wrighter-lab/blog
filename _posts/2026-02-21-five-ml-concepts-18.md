---
layout: post
title: "Five ML Concepts - #18"
date: 2026-02-21 00:00:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, preference-learning, ensembling, ml-fragility, epoch, cost-quality-tradeoffs, ml-concepts]
keywords: "preference learning, ensembling, ML fragility, epoch, cost vs quality tradeoffs, machine learning concepts, 30-second explainers"
author: Software Wrighter
abstract: "Five ML concepts in under 30 seconds each: Preference Learning (train from comparisons), Ensembling (combine models for robustness), ML Fragility (breaks on distribution shift), Epoch (one pass through data), Cost vs Quality (bigger isn't always better)."
series: "Five ML Concepts"
series_part: 18
video_url: "https://www.youtube.com/shorts/osj1GQxG4uo"
video_title: "Five ML Concepts - #18"
papers:
  - title: "Learning to summarize from human feedback"
    url: "https://arxiv.org/abs/2009.01325"
  - title: "Distribution Shift"
    url: "https://arxiv.org/abs/1903.12261"
  - title: "Efficient Transformers: A Survey"
    url: "https://arxiv.org/abs/2009.06732"
---

<img src="{{ '/assets/images/posts/block-eighteen.webp' | relative_url }}" class="post-marker" alt="">

5 machine learning concepts. Under 30 seconds each.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | Links in References section |
| **Video** | [Five ML Concepts #18](https://www.youtube.com/shorts/osj1GQxG4uo)<br>[![Video](https://img.youtube.com/vi/osj1GQxG4uo/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/osj1GQxG4uo) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="references-section" markdown="1">

## References

| Concept | Reference |
|---------|-----------|
| **Preference Learning** | [Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325) (Stiennon et al. 2020) |
| **Ensembling** | [Ensemble Methods in Machine Learning](https://link.springer.com/chapter/10.1007/3-540-45014-9_1) (Dietterich 2000) |
| **ML Fragility** | [Distribution Shift](https://arxiv.org/abs/1903.12261) (Quinonero-Candela et al. 2009) |
| **Epoch** | [Deep Learning](https://www.deeplearningbook.org/) (Goodfellow et al. 2016), Chapter 8 |
| **Cost vs Quality** | [Efficient Transformers: A Survey](https://arxiv.org/abs/2009.06732) (Tay et al. 2022) |


</div>

## Today's Five

### 1. Preference Learning

**Instead of learning from fixed labels, models are trained from comparisons between outputs.** This helps align model behavior with human judgments.

The approach works well when absolute quality is hard to define but relative preferences are easier to express.

> Like learning to cook by asking which dish tastes better.

### 2. Ensembling

**Ensembling combines predictions from multiple models.** Different models make different errors, and combining them can improve robustness.

Common strategies include voting, averaging, and stacking models together.

> Like asking several experts and averaging their opinions.

### 3. Why ML Is Fragile

**Models rely on statistical patterns learned from data.** When those patterns shift, performance can degrade quickly.

This fragility emerges because models optimize for training distributions, not arbitrary future scenarios.

> Like a spell checker that works on common words but struggles with unusual ones.

### 4. Epoch

**An epoch is one complete pass through the training dataset.** Multiple epochs allow the model to refine its weights over repeated passes.

Training typically continues for many epochs until validation performance stops improving.

> Like reading a textbook from beginning to end more than once.

### 5. Cost vs Quality Tradeoffs

**Increasing model size or compute often improves performance, but also increases cost and latency.** Engineers balance quality against budget and responsiveness.

Production systems often use smaller, faster models rather than the largest available.

> Like choosing between a luxury car and an economy car depending on your needs.

## Quick Reference

| Concept | One-liner |
|---------|-----------|
| **Preference Learning** | Train from comparisons, not labels |
| **Ensembling** | Combine models for robustness |
| **ML Fragility** | Statistical models break on distribution shift |
| **Epoch** | One pass through training data |
| **Cost vs Quality** | Bigger isn't always better in production |

---


*Short, accurate ML explainers. Follow for more.*
