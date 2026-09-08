---
layout: post
title: "How AI Learns Part 4: Memory-Based Learning"
date: 2026-02-27 00:15:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, rag, cag, engram, vector-database, memory, retrieval]
keywords: "Retrieval-Augmented Generation, RAG, Cache-Augmented Generation, CAG, Engram, vector database, external memory, model editing"
author: Software Wrighter
abstract: "Modern AI systems increasingly rely on external memory. RAG, CAG, and Engram-style modules shift 'learning' away from weights. The brain stays stable. The notebook grows."
series: "How AI Learns"
series_part: 4
papers:
  - title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
    url: "https://arxiv.org/abs/2005.11401"
  - title: "Engram: Conditional Memory via Scalable Lookup"
    url: "https://arxiv.org/abs/2501.09824"
  - title: "REALM: Retrieval-Augmented Language Model Pre-Training"
    url: "https://arxiv.org/abs/2002.08909"
  - title: "Editing Factual Knowledge in Language Models"
    url: "https://arxiv.org/abs/2104.08164"
---

<img src="{{ '/assets/images/posts/block-dog.webp' | relative_url }}" class="post-marker" alt="">

Modern AI systems increasingly rely on external memory.

This shifts "learning" away from parameters.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [Engram](/2026/02/02/deepseek-papers-part2-engram/) \| [Engram Revisited](/2026/02/11/deepseek-papers-part3-engram-revisited/) \| [Multi-hop RAG](/2026/02/01/multi-hop-reasoning/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Memory Paradigm

<figure>
<img src="{{ '/assets/images/posts/memory-based-learning.svg' | relative_url }}" alt="Diagram showing brain (model) connected to notebook (memory) with RAG, CAG, and Engram types" style="max-width: 600px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Store facts outside the brain.</figcaption>
</figure>

## Why External Memory?

Most "learning new facts" should not modify weights.

**Weights are for generalization.** They encode reasoning patterns, language structure, and capability.

**Memory is for storage.** It holds specific facts, documents, and experiences.

If you store everything in weights:
- You create interference
- You risk forgetting
- You must retrain

If you store facts in memory:
- No forgetting
- Fast updates
- Survives model upgrades

## Retrieval-Augmented Generation (RAG)

Documents are embedded into vectors. At query time:

1. **Embed** the query
2. **Search** the vector database
3. **Retrieve** relevant documents
4. **Inject** into prompt
5. **Generate** grounded response

The model does not need to remember facts internally. It retrieves them on demand.

### RAG Benefits

| Benefit | Description |
|---------|-------------|
| **No forgetting** | External storage, not weights |
| **Persistent** | Survives restarts and model changes |
| **Scalable** | Add documents without retraining |
| **Verifiable** | Can cite sources |

### RAG Challenges

- Retrieval precision (wrong docs = bad answers)
- Latency (search takes time)
- Index maintenance
- Chunk boundaries

## Cache-Augmented Generation (CAG)

Instead of retrieving from vector DB, cache previous context or KV states.

**Use cases:**
- Repeated knowledge tasks
- Multi-turn conversations
- Pre-computed context windows

**Benefits over RAG:**
- Often faster (no embedding + search)
- More deterministic
- Good for structured repeated workflows

**Trade-offs:**
- Less flexible
- Cache management complexity

## Engram-Style Memory

Recent proposals (e.g., DeepSeek research) introduce conditional memory modules with direct indexing.

Instead of scanning long context or searching vectors:
- Memory slots indexed directly
- O(1) lookup instead of O(n) attention
- Separates static knowledge from dynamic reasoning

**The goal:** Constant-time memory access that doesn't scale with context length.

This changes the compute story:
- Don't waste attention on "known facts"
- Reserve compute for reasoning
- Avoid context rot

## Model Editing

A related technique: surgically patch specific facts without full fine-tuning.

**Example:** The model says "The capital of Australia is Sydney." You edit the specific association to "Canberra" without retraining.

**Pros:**
- Targeted fixes
- Fast

**Cons:**
- Side effects possible
- Consistency not guaranteed

## The Key Distinction

| Aspect | Weight Learning | Memory Learning |
|--------|-----------------|-----------------|
| **Location** | Parameters | External storage |
| **Persistence** | Model lifetime | Storage lifetime |
| **Forgetting risk** | High | None |
| **Update speed** | Slow (training) | Fast (database) |
| **Survives model change?** | No | Yes |

## When to Use What

| Situation | Approach |
|-----------|----------|
| Need new reasoning capability | Weight-based (fine-tune) |
| Need to know new facts | Memory-based (RAG) |
| Need domain expertise | Weight-based (LoRA) |
| Need to cite sources | Memory-based (RAG) |
| Frequently changing data | Memory-based (RAG/CAG) |

## References

| Concept | Paper |
|---------|-------|
| RAG | [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) (Lewis et al. 2020) |
| Engram | [Engram: Conditional Memory via Scalable Lookup](https://arxiv.org/abs/2501.09824) (DeepSeek 2025) |
| REALM | [REALM: Retrieval-Augmented Pre-Training](https://arxiv.org/abs/2002.08909) (Guu et al. 2020) |
| Model Editing | [Editing Factual Knowledge](https://arxiv.org/abs/2104.08164) (De Cao et al. 2021) |

## Coming Next

In Part 5, we'll examine **context engineering and recursive reasoning**: ICL, RLM, and techniques that prevent context rot during inference.

---

*The brain stays stable. The notebook grows.*
