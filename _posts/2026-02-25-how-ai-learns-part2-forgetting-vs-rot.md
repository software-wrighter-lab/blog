---
layout: post
title: "How AI Learns Part 2: Catastrophic Forgetting vs Context Rot"
date: 2026-02-25 00:15:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, catastrophic-forgetting, context-rot, continuous-learning, attention, memory]
keywords: "catastrophic forgetting, context rot, attention dilution, LLM failure modes, stability plasticity tradeoff"
author: Software Wrighter
abstract: "Two fundamentally different failure modes plague AI systems. Catastrophic forgetting destroys old knowledge when learning new skills. Context rot loses early instructions in long conversations. Different problems, different solutions."
series: "How AI Learns"
series_part: 2
papers:
  - title: "Overcoming Catastrophic Forgetting in Neural Networks"
    url: "https://arxiv.org/abs/1612.00796"
  - title: "A Comprehensive Survey of Continual Learning"
    url: "https://arxiv.org/abs/2302.00487"
  - title: "ELLA: Subspace Learning for Lifelong Machine Learning"
    url: "https://arxiv.org/abs/2410.06408"
  - title: "Share: Shared LoRA Subspaces for Continual Learning"
    url: "https://arxiv.org/abs/2502.00661"
  - title: "Recursive Language Models"
    url: "https://arxiv.org/abs/2412.04619"
---

<img src="{{ '/assets/images/posts/block-crescent.webp' | relative_url }}" class="post-marker" alt="">

There are two fundamentally different failure modes in modern AI systems.

They are often confused. They should not be.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [Sleepy Coder: Routing Prevents Forgetting](/2026/02/18/sleepy-coder-routing-prevents-forgetting/) \| [RLM](/2026/02/13/rlm-recursive-language-models/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Two Failures

<figure>
<img src="{{ '/assets/images/posts/forgetting-vs-rot.svg' | relative_url }}" alt="Split diagram showing catastrophic forgetting (weight interference) vs context rot (attention dilution)" style="max-width: 700px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Two different failure modes require two different solutions.</figcaption>
</figure>

## Catastrophic Forgetting (Weight-Space Failure)

When you fine-tune a model on new tasks, performance on older tasks may degrade.

This happens because gradient descent updates overlap in parameter space. The model does not "know" which weights correspond to which task. It optimizes globally.

**Example:** Fine-tune a model on medical text. Its ability to write code degrades. The new learning overwrote old capabilities.

### Why It Happens

Neural networks store knowledge distributed across many weights. When you update those weights for Task D, you modify the same parameters that encoded Task A. The old knowledge gets overwritten.

This is the **stability vs plasticity tradeoff**:
- **Plasticity:** Learn new things quickly
- **Stability:** Retain old things reliably

You cannot maximize both simultaneously.

### Solutions

| Method | How It Helps |
|--------|--------------|
| **Replay** | Train on old + new data |
| **Subspace regularization** | Constrain weight updates to avoid interference |
| **Shared Low-Rank Adaptation (LoRA) spaces** | Modular updates that don't overwrite base weights |
| **Freezing base weights** | Keep foundation stable, train adapters only |

## Context Rot (Inference-Time Failure)

Context rot is not weight damage.

It happens when:
- Prompts grow too large
- Earlier instructions get diluted
- Attention spreads thin
- The model begins averaging patterns instead of reasoning

**Example:** A 50,000 token conversation. The original system prompt is still there, but the model stops following it. Earlier context gets "forgotten" even though it's technically present.

### Why It Happens

Transformer attention is finite. With limited attention heads and capacity, the model cannot attend equally to everything. As context grows, earlier tokens receive less attention weight.

This creates:
- **Instruction drift:** Original instructions lose influence
- **Pattern averaging:** The model reverts to generic responses
- **Lost coherence:** Multi-step reasoning fails

### Solutions

| Method | How It Helps |
|--------|--------------|
| **Retrieval-based context** | Pull relevant passages, not everything |
| **Recursive Language Models (RLM)** | Rebuild context each step |
| **Summarization** | Compress old context |
| **Memory indexing** | Constant-time lookup instead of linear attention |
| **Structured tool calls** | Offload state to external systems |

## The Critical Distinction

| Aspect | Catastrophic Forgetting | Context Rot |
|--------|------------------------|-------------|
| **Where** | Weights | Prompt window |
| **When** | During training | During inference |
| **Persists?** | Permanently | Session only |
| **Analogy** | Brain damage | Working memory overload |

## Why This Matters

If you confuse these failure modes, you apply the wrong fix.

- **Forgetting problem?** Don't add more context. Fix your training.
- **Context rot problem?** Don't retrain. Fix your context management.

Many "AI agents that forget" discussions conflate both. Modern systems need solutions for *both* simultaneously.

## References

| Concept | Paper |
|---------|-------|
| Catastrophic Forgetting | [Overcoming Catastrophic Forgetting in Neural Networks](https://arxiv.org/abs/1612.00796) (Kirkpatrick et al. 2017) |
| Continual Learning Survey | [A Comprehensive Survey of Continual Learning](https://arxiv.org/abs/2302.00487) (Wang et al. 2023) |
| ELLA | [ELLA: Subspace Learning for Lifelong Machine Learning](https://arxiv.org/abs/2410.06408) (2024) |
| Share | [Share: Shared LoRA Subspaces for Continual Learning](https://arxiv.org/abs/2502.00661) (2025) |
| RLM | [Recursive Language Models](https://arxiv.org/abs/2412.04619) (Zhou et al. 2024) |

## Coming Next

In Part 3, we'll examine **weight-based learning** in detail: pretraining, fine-tuning, LoRA, alignment methods, and distillation.

---

*Different failures need different fixes.*
