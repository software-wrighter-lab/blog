---
layout: post
title: "How AI Learns Part 3: Weight-Based Learning"
date: 2026-02-26 00:15:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, pretraining, fine-tuning, lora, rlhf, dpo, distillation, alignment]
keywords: "pretraining, fine-tuning, Low-Rank Adaptation, LoRA, Reinforcement Learning from Human Feedback, RLHF, Direct Preference Optimization, DPO, distillation, alignment, Parameter-Efficient Fine-Tuning, PEFT, Supervised Fine-Tuning, SFT, adapters"
author: Software Wrighter
abstract: "Weight-based learning modifies the neural network itself. Pretraining, fine-tuning, LoRA, alignment methods, distillation---each changes the brain permanently. Slow to change, but forms the stable core."
series: "How AI Learns"
series_part: 3
papers:
  - title: "LoRA: Low-Rank Adaptation of Large Language Models"
    url: "https://arxiv.org/abs/2106.09685"
  - title: "Training Language Models to Follow Instructions with Human Feedback"
    url: "https://arxiv.org/abs/2203.02155"
  - title: "Direct Preference Optimization"
    url: "https://arxiv.org/abs/2305.18290"
  - title: "Distilling the Knowledge in a Neural Network"
    url: "https://arxiv.org/abs/1503.02531"
  - title: "Parameter-Efficient Transfer Learning for NLP"
    url: "https://arxiv.org/abs/1902.00751"
---

<img src="{{ '/assets/images/posts/block-thimble.webp' | relative_url }}" class="post-marker" alt="">

Weight-based learning modifies the neural network itself.

It is slow. It is powerful. It is dangerous.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [Sleepy Coder: When Fine-Tuning Fails](/2026/02/12/sleepy-coder-when-fine-tuning-fails/) \| [5MLC #3: LoRA](/2026/02/06/five-ml-concepts-3/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Weight-Based Methods

<figure>
<img src="{{ '/assets/images/posts/weight-based-learning.svg' | relative_url }}" alt="Diagram showing LoRA adapters, distillation flow, and alignment pipeline" style="max-width: 650px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Weight-based learning modifies the brain itself.</figcaption>
</figure>

## Pretraining

This creates the base model.

It encodes language structure, reasoning patterns, and general world knowledge. The process:

- Trains on terabytes of text
- Uses self-supervised learning (predict next token)
- Runs for weeks or months
- Costs millions of dollars

This learning is rarely repeated for cost reasons. The result is a foundation that everything else builds upon.

## Fine-Tuning

Fine-tuning adapts models for specific tasks.

### Standard Fine-Tuning

Adjust some or all weights using task-specific data.

**Pros:**
- Can significantly change behavior
- Works with small datasets

**Cons:**
- Risk of catastrophic forgetting
- Expensive if you modify all weights
- Hard to undo

### Supervised Fine-Tuning (SFT)

Train on instruction → response pairs.

This teaches the model to:
- Follow directions
- Produce helpful outputs
- Maintain conversation structure

**Risk:** Can reduce other capabilities if data is narrow.

### Preference Optimization

Instead of "correct answers," train from comparisons: preferred vs rejected responses.

| Method | Description |
|--------|-------------|
| **Reinforcement Learning from Human Feedback (RLHF)** | Reward model + reinforcement learning |
| **Direct Preference Optimization (DPO)** | Simpler alternative to RLHF |
| **RLAIF** | AI-generated preferences |

**Pros:** Strong style/safety/helpfulness steering

**Cons:** Can drift ("over-align"), may conflict with domain competence

## Parameter-Efficient Fine-Tuning (PEFT)

Instead of changing all weights, inject small trainable modules.

### LoRA (Low-Rank Adaptation)

Insert small low-rank matrices into transformer layers. Only train these matrices.

**Benefits:**
- **Faster training:** Fewer parameters to update
- **Modular:** Can swap adapters
- **Version control:** Different adapters for different tasks
- **Lower forgetting risk:** Base weights frozen

### Other PEFT Methods

- **Prompt tuning:** Learn soft prompts
- **Prefix tuning:** Prepend learned vectors
- **Adapters:** Small bottleneck layers
- **IA³:** Learned vectors that scale activations

### Shared LoRA Subspaces

Multiple tasks share adapter subspaces to reduce interference.

Recent work (ELLA, Share) maintains evolving shared low-rank subspaces that:
- Reduce interference between tasks
- Enable continual learning
- Keep memory constant

## Distillation

Train a smaller model using a larger model as teacher.

| Aspect | Teacher | Student |
|--------|---------|---------|
| Size | Large | Small |
| Cost | High inference | Low inference |
| Knowledge | Full | Compressed |

**Distillation benefits:**
- Speeds up inference
- Often improves consistency
- Can reduce hallucination
- Makes deployment cheaper

This is not runtime learning---it's offline structural learning.

## The Alignment Pipeline

Modern models typically go through:

1. **Pretraining** → General competence
2. **SFT** → Follow instructions
3. **RLHF/DPO** → Align with preferences
4. **Safety fine-tuning** → Reduce harmful outputs

Each step modifies weights. Each step risks forgetting previous capabilities.

## Key Insight

> **Fine-tuning changes the brain. RAG changes the notes on the desk.**

Weight-based learning is the core capability layer. It's slow to change, expensive to update, and risky to modify---but it forms the stable foundation that everything else builds upon.

## References

| Concept | Paper |
|---------|-------|
| LoRA | [LoRA: Low-Rank Adaptation](https://arxiv.org/abs/2106.09685) (Hu et al. 2021) |
| RLHF | [Training LMs with Human Feedback](https://arxiv.org/abs/2203.02155) (Ouyang et al. 2022) |
| DPO | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) (Rafailov et al. 2023) |
| Distillation | [Distilling Knowledge in Neural Networks](https://arxiv.org/abs/1503.02531) (Hinton et al. 2015) |
| Adapters | [Parameter-Efficient Transfer Learning](https://arxiv.org/abs/1902.00751) (Houlsby et al. 2019) |

## Coming Next

In Part 4, we'll explore **memory-based learning**: RAG, CAG, Engram, and other techniques that learn without touching weights.

---

*Change the brain carefully.*
