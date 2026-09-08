---
layout: post
title: "Multi-Hop Reasoning (1/2): Training Wheels for Small LLMs"
date: 2026-02-01 12:00:00 -0800
categories: [llm, machine-learning, research]
tags: [knowledge-graphs, multi-hop-reasoning, mlx, apple-silicon, lora, smollm, rejection-sampling]
keywords: "knowledge graphs, RSFT, fine-tuning, SmolLM-135M, scaffolded training"
author: Software Wrighter
abstract: "A 135M parameter model goes from 0% to 75% accuracy in 5 minutes. Using knowledge graph-guided training with rejection sampling, we teach multi-hop reasoning with scaffolding during training, then remove it at inference."
series: "Multi-Hop Reasoning"
series_part: 1
video_url: "https://youtube.com/shorts/jCUomUai-9U"
video_title: "LLM with Training Wheels"
repo_url: "https://github.com/softwarewrighter/multi-hop-reasoning"
papers:
  - title: "KG-Guided RAG (arXiv)"
    url: "https://arxiv.org/abs/2601.15160"
---

<img src="{{ '/assets/images/site/post-marker-gimlet.webp' | relative_url }}" class="post-marker" alt="">

A tiny 135M parameter model goes from 0% to 75% accuracy in 5 minutes of training. The secret? Knowledge graph-guided training with rejection sampling.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [KG-Guided RAG (arXiv)](https://arxiv.org/abs/2601.15160) |
| **Code** | [multi-hop-reasoning](https://github.com/softwarewrighter/multi-hop-reasoning) |
| **ELI5** | [eli5.md](https://github.com/softwarewrighter/multi-hop-reasoning/blob/main/documentation/eli5.md) |
| **Demo** | [Live Demo](https://softwarewrighter.github.io/multi-hop-reasoning/) |
| **Video** | [LLM with Training Wheels](https://youtube.com/shorts/jCUomUai-9U)<br>[![Video](https://img.youtube.com/vi/jCUomUai-9U/mqdefault.jpg){: .video-thumb}](https://youtube.com/shorts/jCUomUai-9U) |
| **Part 2** | [The Distribution Trap](/2026/02/18/multi-hop-reasoning-distribution-trap/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The Problem: Multi-Hop Reasoning

LLMs struggle with questions requiring multiple reasoning steps. "What's the fix for a crash caused by a corrupted config file on a system running outdated firmware?" requires connecting several facts:

1. Corrupted config → need config reset
2. Outdated firmware → need firmware update
3. Crash context → check dependencies between these fixes

Standard fine-tuning teaches pattern matching. Multi-hop reasoning requires following logical chains.

## The Paper's Approach

<div class="training-wheels-box" style="float: right; max-width: 240px; margin: 0 0 1em 1.5em; padding: 1em; background-color: #ffe4e6; border-radius: 8px; text-align: center;">
<img src="{{ '/assets/images/posts/multi-hop-reasoning/training-wheels.webp' | relative_url }}" alt="Training wheels" style="max-width: 180px;" class="no-invert">
<p style="margin: 0.5em 0 0 0; font-style: italic; font-size: 0.9em; color: #333;">Learn with training wheels, remove them after learning completes.</p>
</div>

[Knowledge Graph-Guided RAG](https://arxiv.org/abs/2601.15160) from Princeton proposes using knowledge graphs during training to score reasoning quality---then removing the graph at inference.

The key insight: **train with scaffolding, test without it**.

## My Implementation

The repo implements this for a software troubleshooting domain:

| Component | Details |
|-----------|---------|
| **Knowledge Graph** | ~200 entities, ~600 edges (symptoms, causes, fixes) |
| **Training Data** | MCQs with 1-3 hop paths |
| **Eval Data** | MCQs with 4-5 hop paths (harder) |
| **Model** | SmolLM-135M-Instruct |
| **Framework** | MLX (Apple Silicon native) |

### The Training Pipeline

```
┌─────────────────────────────────────────┐
│  1. SFT: Learn output format            │
│     TRACE: <reasoning>                  │
│     ANSWER: A|B|C|D                     │
├─────────────────────────────────────────┤
│  2. RSFT: Rejection Sampling FT         │
│     - Generate multiple answers         │
│     - Score with knowledge graph        │
│     - Keep only correct traces          │
│     - Train on winners                  │
└─────────────────────────────────────────┘
```

### The Reward Function

The knowledge graph scores outputs during training:

- **R_corr**: +1.0 correct answer, -2.0 incorrect
- **R_path**: Entity coverage (did the trace mention relevant nodes?)
- **P_spam**: -0.5 penalty for repeating entities (prevents gaming)

At inference, the graph is removed. The model must reason from learned patterns.

## Results

| Phase | Accuracy | Training Time |
|-------|----------|---------------|
| Base model | 0% | - |
| After SFT | 30% | ~2 min |
| After RSFT | **75%** | ~3 min |

The critical finding: **distribution matching matters**.

Training on easy examples (1-2 hops) hurt performance on hard eval (4-5 hops). Training on examples matching the eval distribution achieved 75%.

## Running It

```bash
git clone https://github.com/softwarewrighter/multi-hop-reasoning
cd multi-hop-reasoning

# Setup (Apple Silicon)
make setup-mlx

# Full pipeline
make train
```

Results appear in ~5 minutes on an M-series Mac.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | Python |
| **Source Files** | 12 `.py` files |
| **Estimated Size** | ~1.5 KLOC |
| **Framework** | MLX, Transformers |
| **Platform** | Apple Silicon (MLX native) |

**Good for you if:** You want to understand knowledge graph-guided training, experiment with rejection sampling fine-tuning, or see how small models can learn reasoning patterns.

**Complexity:** Moderate. Clean codebase with Make targets for each step. Requires understanding of fine-tuning concepts.

## Key Takeaways

1. **Scaffolded training works.** Use structured feedback during training, remove it at inference.

2. **Distribution matching matters.** Train on examples that match your eval distribution.

3. **Small models can reason.** 135M parameters is enough for 75% accuracy on 4-5 hop questions.

4. **MLX makes iteration fast.** Full pipeline runs in 5 minutes on a MacBook.

## Resources

- [Paper: Knowledge Graph-Guided RAG](https://arxiv.org/abs/2601.15160)
- [Repository: multi-hop-reasoning](https://github.com/softwarewrighter/multi-hop-reasoning)
- [Live Demo](https://softwarewrighter.github.io/multi-hop-reasoning/)
- [Video: LLM with Training Wheels](https://youtube.com/shorts/jCUomUai-9U)

---


*Knowledge graphs as training wheels---helping small models learn to reason, then letting go.*
