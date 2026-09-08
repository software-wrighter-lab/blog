---
layout: post
title: "How AI Learns Part 1: The Many Meanings of Learning"
date: 2026-02-24 08:00:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, learning, pretraining, fine-tuning, rag, in-context-learning, continuous-learning]
keywords: "LLM learning, pretraining, fine-tuning, Retrieval-Augmented Generation, RAG, in-context learning, ICL, Low-Rank Adaptation, LoRA, adapters, AI memory"
author: Software Wrighter
abstract: "When people say 'AI learned something,' they usually mean one of four very different things. Understanding these time scales---from milliseconds to years---is essential for building AI systems that improve safely over time."
series: "How AI Learns"
series_part: 1
papers:
  - title: "LoRA: Low-Rank Adaptation of Large Language Models"
    url: "https://arxiv.org/abs/2106.09685"
  - title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
    url: "https://arxiv.org/abs/2005.11401"
  - title: "What Can Transformers Learn In-Context?"
    url: "https://arxiv.org/abs/2208.01066"
  - title: "Engram: Conditional Memory via Scalable Lookup"
    url: "https://arxiv.org/abs/2501.09824"
  - title: "Direct Preference Optimization"
    url: "https://arxiv.org/abs/2305.18290"
---

<img src="{{ '/assets/images/posts/block-lamp-post.webp' | relative_url }}" class="post-marker" alt="">

When people say, "AI learned something," they usually mean one of at least four very different things.

Large Language Models (LLMs) do not learn in one single way. They learn at different time scales, in different locations, and with very different consequences. To understand modern AI systems---especially agents---we need to separate these layers.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [ICL Revisited](/2026/02/22/icl-revisited-from-mystery-to-engineering/) \| [RLM](/2026/02/13/rlm-recursive-language-models/) \| [Engram](/2026/02/02/deepseek-papers-part2-engram/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Four Time Scales of Learning

<figure>
<img src="{{ '/assets/images/posts/learning-time-scales.svg' | relative_url }}" alt="Concentric rings showing four time scales of learning: core weights, adapters, external memory, and prompt/context" style="max-width: 600px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Learning happens at different layers with different persistence and speed.</figcaption>
</figure>

### 1. Pretraining (Years)

This is the foundation.

The model trains on massive datasets using gradient descent. The result is a set of weights---billions of parameters---encoding statistical structure of language and knowledge.

This learning:
- Is slow and expensive
- Persists across restarts
- Cannot easily be reversed
- Is vulnerable to interference if modified later

Think of this as **long-term biological memory**.

### 2. Fine-Tuning (Days to Weeks)

Fine-tuning modifies the weights further, but with narrower data.

This includes:
- **Instruction tuning** (following directions)
- **Alignment methods** (Reinforcement Learning from Human Feedback (RLHF), Direct Preference Optimization (DPO))
- **Domain adaptation**
- **Parameter-efficient methods** like Low-Rank Adaptation (LoRA)

This is still weight-based learning.

It persists across restarts. It risks **catastrophic forgetting**. It modifies the brain itself.

### 3. Memory-Based Learning (Seconds to Minutes)

This is where many modern systems shift.

Instead of changing weights, they store information externally:
- **RAG** (Retrieval-Augmented Generation)
- **CAG** (Cache-Augmented Generation)
- **Vector databases**
- **Engram-style memory modules**

The model retrieves relevant memory per query.

**The brain stays stable. The notebook grows.**

This learning:
- Persists across restarts
- Survives model upgrades
- Does not cause forgetting
- Is fast

### 4. In-Context Learning (Milliseconds)

This is temporary reasoning scaffolding.

Information exists only in the prompt window.

It:
- Does not update weights
- Does not persist across sessions
- Is powerful but fragile
- Suffers from **context rot**

This is **working memory**.

## Why This Matters

Most discussions collapse all of this into "the model learned."

But:
- **Updating weights** risks forgetting
- **Updating memory** does not
- **Updating prompts** does not persist
- **Updating adapters** can be modular and reversible

Continuous learning systems must coordinate all four.

## Persistence Comparison

| Mechanism | Persists Across Chat? | Persists Across Restart? | Persists Across Model Change? |
|-----------|----------------------|-------------------------|------------------------------|
| Pretraining | Yes | Yes | No |
| Fine-tune | Yes | Yes | No |
| LoRA | Yes | Yes | Usually |
| Distillation | Yes | Yes | No |
| ICL | No | No | No |
| RAG | Yes | Yes | Yes |
| Engram | Yes | Yes | Yes |
| CAG | Yes | Yes | Yes |

That last column is subtle but powerful for agents.

## References

| Concept | Paper |
|---------|-------|
| LoRA | [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) (Hu et al. 2021) |
| RAG | [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) (Lewis et al. 2020) |
| ICL | [What Can Transformers Learn In-Context?](https://arxiv.org/abs/2208.01066) (Garg et al. 2022) |
| Engram | [Engram: Conditional Memory via Scalable Lookup](https://arxiv.org/abs/2501.09824) (DeepSeek 2025) |
| DPO | [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) (Rafailov et al. 2023) |

## Coming Next

In Part 2, we'll examine the two fundamental failure modes that arise from confusing these layers: **catastrophic forgetting** and **context rot**.

---

*Learning happens in layers of permanence.*
