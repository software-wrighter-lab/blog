---
layout: post
title: "Deepseek Papers (3/3): Engram Revisited - From Emulation to Implementation"
date: 2026-02-11 00:00:00 -0800
categories: [llm, machine-learning, research]
tags: [deepseek, engram, transformers, memory, hash-table, lora]
keywords: "engram, conditional memory, hash-based memory, O(1) lookup, gating mechanism, long-term recall, HuggingFace integration"
author: Software Wrighter
abstract: "From behavioral emulation to real implementation: integrating hash-based Engram memory with HuggingFace models. The gating mechanism is critical---it learns when to trust memory lookup and when hash collisions would add noise. Engram excels at exact-match retrieval, not generalization."
series: "Deepseek Papers"
series_part: 3
video_url: "https://www.youtube.com/watch?v=TZT_cWWv9Oc"
video_title: "Why Your LLM Memory Needs a Gate"
repo_url: "https://github.com/softwarewrighter/engram-poc"
repo_urls:
  - url: "https://github.com/softwarewrighter/engram-poc"
    title: "engram-poc"
  - url: "https://github.com/weagan/Engram"
    title: "weagan/Engram (reference)"
papers:
  - title: "Engram: Conditional Memory via Scalable Lookup"
    url: "https://arxiv.org/abs/2601.07372"
---

<img src="{{ '/assets/images/posts/block-gate.webp' | relative_url }}" class="post-marker" alt="">

We started by training models to *act* like they had memory. Then we found an open source implementation that does it for real. This is what we learned.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [arXiv:2601.07372](https://arxiv.org/abs/2601.07372) |
| **Our Code** | [engram-poc](https://github.com/softwarewrighter/engram-poc) |
| **Reference** | [weagan/Engram](https://github.com/weagan/Engram) |
| **Video** | [Engram Revisited](https://www.youtube.com/watch?v=TZT_cWWv9Oc)<br>[![Video](https://img.youtube.com/vi/TZT_cWWv9Oc/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=TZT_cWWv9Oc) |
| **Playlist** | [All Engram Videos](https://www.youtube.com/playlist?list=PLKjvVAEaR4isTOri5dlPRIUK8Uy0jotX6) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Journey

### Phase 1: Behavioral Emulation

[Part 2](/2026/02/02/deepseek-papers-part2-engram/) described our first approach: LoRA fine-tuning to make a model *behave* like it has memory. Train on patterns, and the model learns to respond consistently.

| Metric | Baseline | LoRA-tuned |
|--------|----------|------------|
| Accuracy | 8.6% | 14.1% |
| Improvement | - | +63% relative |

It worked, but the architecture was unchanged. We were approximating Engram benefits, not implementing them.

### Phase 2: The Discovery

Then we found [weagan/Engram](https://github.com/weagan/Engram) on GitHub---real hash-based memory in ~300 lines of Python:

```python
class EnhancedEngramModule(nn.Module):
    def __init__(self, table_size=50000, d_model=512):
        # Large learnable memory table
        self.memory_table = nn.Parameter(torch.zeros(table_size, d_model))

        # Gate decides when to trust memory
        self.gate = nn.Sequential(
            nn.Linear(d_model * 2, d_model),
            nn.ReLU(),
            nn.Linear(d_model, 1),
            nn.Sigmoid()
        )

    def forward(self, hidden_states, input_ids):
        # O(1) hash lookup
        indices = self.multi_head_hash(input_ids)
        retrieved = F.embedding(indices, self.memory_table)

        # Gated injection
        gate_score = self.gate(torch.cat([hidden_states, retrieved], dim=-1))
        return hidden_states + gate_score * retrieved
```

The key insight: **the gate decides when to trust the lookup**. Not every token needs memory.

### Phase 3: Integration with HuggingFace

We ported the module to work with HuggingFace models:

```
SmolLM-135M (frozen)
        ↓
EnhancedEngramModule (per layer)
  - 50K slot memory table
  - O(1) hash-based lookup
  - Learned gating
        ↓
Output
```

The proof it works---O(1) lookup regardless of sequence length:

| Sequence Length | Lookup Time | Expected if O(n) |
|-----------------|-------------|------------------|
| 64 tokens | 0.15 ms | - |
| 2048 tokens | 2.77 ms | 4.8 ms |

Sub-linear scaling proves constant-time hash lookup.

## The Reality Check

Here's where it gets interesting. Real Engram memory **excels at some tasks and hurts others**.

### Where Engram Helps

| Task Type | Baseline | Engram | Change |
|-----------|----------|--------|--------|
| Acronym expansion | 25% | 75% | +200% |
| Element symbols | 33% | 67% | +103% |
| Long-term fact recall | 90% | 100% | +11% |

For **exact-match lookups** with structured keys, Engram dominates.

### Where Engram Hurts

| Task Type | Baseline | Engram | Change |
|-----------|----------|--------|--------|
| World capitals | 83% | 67% | -19% |
| Pattern completion | 14% | 11% | -21% |

For tasks where the base model already knows the answer, Engram's hash collisions add noise.

## The Key Insight

**Engram is a specialized tool, not a general enhancement.**

| Use Engram For | Don't Use Engram For |
|----------------|----------------------|
| FAQ responses | Creative generation |
| Terminology lookup | Novel combinations |
| Entity facts | Context-dependent answers |
| Code boilerplate | Reasoning tasks |

The gating mechanism is critical: it must learn to **suppress memory when it doesn't help**. Without proper gating, hash collisions inject noise into every token.

## Obstacles Encountered

### 1. Hash Collisions

Different inputs can map to the same memory slot. The gate must learn to ignore irrelevant retrievals.

### 2. Parameter Explosion

50K slots × 768 dimensions × 30 layers = 1.2B additional parameters. We had to inject selectively (every 4th layer) to stay practical.

### 3. Training Dynamics

Memory tables start at zero. They need higher learning rates (10x) to develop meaningful representations before the model learns to use them.

### 4. Evaluation Mismatch

Our pattern completion task wasn't ideal for hash-based memory. Engram shines on exact-match retrieval, not generalization.

## Combined Approach

The best results came from combining both methods:

```
Base Model (SmolLM-135M)
        ↓
EnhancedEngramModule
  - Long-term fact storage
  - O(1) lookup for known patterns
        ↓
LoRA Adapters
  - Pattern completion
  - Domain-specific behaviors
        ↓
Output
```

This gives you:
- **Long-term memory** from hash tables
- **Pattern consistency** from behavioral training
- **Flexibility** to disable either component

## What We Learned

1. **Emulation vs Implementation**: LoRA fine-tuning approximates memory behavior; hash tables implement it. Both have their place.

2. **Gating is Essential**: The learned gate prevents hash collisions from degrading performance. Never use Engram without gating.

3. **Match Task to Tool**: Hash-based memory excels at exact lookups, not pattern generalization. Use it where applicable.

4. **Selective Application**: Don't inject Engram everywhere. Target layers and use cases where it helps.

5. **The Gate as a Safety Valve**: When the gate learns to output near-zero for a task, that's the model telling you Engram doesn't help there. Listen to it.

## Resources

- [Engram Paper (arXiv:2601.07372)](https://arxiv.org/abs/2601.07372)
- [engram-poc Repository](https://github.com/softwarewrighter/engram-poc) - Our implementation
- [weagan/Engram](https://github.com/weagan/Engram) - Reference implementation
- [Engram Revisited Video](https://www.youtube.com/watch?v=TZT_cWWv9Oc)
- [Engram Video Playlist](https://www.youtube.com/playlist?list=PLKjvVAEaR4isTOri5dlPRIUK8Uy0jotX6)
- [Part 1: mHC](/2026/02/01/deepseek-papers-part1-mhc/)
- [Part 2: Engram Introduction](/2026/02/02/deepseek-papers-part2-engram/)

## Series Recap

| Part | Topic | Key Insight |
|------|-------|-------------|
| 1 | mHC | Doubly-stochastic constraints bound signal amplification |
| 2 | Engram Intro | O(1) lookup beats recomputing through attention |
| 3 | Engram Revisited | Use Engram where applicable; gate to avoid worse results |

---


*Hash-based memory is powerful but specialized. The gate decides when to use it---and when not to.*
