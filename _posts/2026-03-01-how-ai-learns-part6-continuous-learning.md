---
layout: post
title: "How AI Learns Part 6: Toward Continuous Learning"
date: 2026-03-01 00:15:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, continuous-learning, replay, ella, share, adapters, consolidation]
keywords: "continuous learning, lifelong learning, replay, Efficient Lifelong Learning Algorithm, ELLA, Share, subspace regularization, adapter evolution, consolidation, Recursive Language Models, RLM, Parameter-Efficient Fine-Tuning, PEFT"
author: Software Wrighter
abstract: "Continuous learning aims to absorb new information and skills over time without losing old capabilities. The key: learn often in memory, consolidate carefully in weights. Periodic consolidation, not constant updates."
series: "How AI Learns"
series_part: 6
papers:
  - title: "ELLA: Subspace Learning for Lifelong Machine Learning"
    url: "https://arxiv.org/abs/2410.06408"
  - title: "Share: Shared LoRA Subspaces for Continual Learning"
    url: "https://arxiv.org/abs/2502.00661"
  - title: "FOREVER: Model-Centric Replay"
    url: "https://arxiv.org/abs/2401.16876"
  - title: "Overcoming Catastrophic Forgetting in Neural Networks"
    url: "https://arxiv.org/abs/1612.00796"
---

<img src="{{ '/assets/images/posts/block-cannon.webp' | relative_url }}" class="post-marker" alt="">

<div style="overflow: hidden;" markdown="1">

Continuous learning aims to:
- Learn new skills
- Retain old skills
- Avoid retraining from scratch
- Avoid catastrophic forgetting

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [Sleepy Coder Part 1](/2026/02/12/sleepy-coder-when-fine-tuning-fails/) \| [Sleepy Coder Part 2](/2026/02/18/sleepy-coder-routing-prevents-forgetting/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Continuous Learning Loop

<figure>
<img src="{{ '/assets/images/posts/continuous-learning-loop.svg' | relative_url }}" alt="Flow diagram showing Agent to Logs to Evaluate to Cluster to Train to Validate to Deploy cycle, with Memory branch" style="max-width: 600px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Periodic consolidation, not constant updates.</figcaption>
</figure>

## The Core Tradeoff

| Goal | Description |
|------|-------------|
| **Plasticity** | Learn new things quickly |
| **Stability** | Retain old things reliably |

You cannot maximize both simultaneously. The art is in the balance.

## Approaches to Continuous Learning

### 1. Replay-Based Methods

Keep (or synthesize) some old data. Periodically retrain on old + new.

**How it works:**
- Store representative examples from each task
- Mix old data into new training batches
- Periodically consolidate

**Recent work:** FOREVER adapts replay timing using "model-centric time" (based on optimizer update magnitude) rather than fixed training steps.

| Pros | Cons |
|------|------|
| Strong retention | Storage costs |
| Conceptually simple | Privacy concerns |
| Well-understood | Data governance complexity |

### 2. Replay-Free Regularization

Constrain weight updates to avoid interference, without storing old data.

**Efficient Lifelong Learning Algorithm (ELLA) (Jan 2026):** Regularizes updates using subspace de-correlation. Reduces interference while allowing transfer.

**Share (Feb 2026):** Maintains a single evolving shared low-rank subspace. Integrates new tasks without storing many adapters.

| Pros | Cons |
|------|------|
| No replay needed | Still active research |
| Privacy-friendly | Evaluation complexity |
| Constant memory | Subtle failure modes |

### 3. Modular Adapters

Keep base model frozen. Train task-specific adapters. Merge or switch as needed.

**Evolution:**
1. **Low-Rank Adaptation (LoRA):** Individual adapters per task
2. **Shared LoRA spaces:** Adapters share subspace
3. **Adapter banks:** Library of skills to compose

| Pros | Cons |
|------|------|
| Modular, versioned | Adapter proliferation |
| Low forgetting risk | Routing complexity |
| Easy rollback | Composition challenges |

### 4. Memory-First Learning

Store experiences in external memory. Only consolidate to weights what's proven stable.

**Pattern:**
- New information → Memory (fast)
- Validated patterns → Adapters (slow)
- Fundamental capabilities → Weights (rare)

This separates the speed of learning from the permanence of changes.

## The Practical Loop

A working continuous learning system:

```
1. Run agent (with Recursive Language Model (RLM) context management)
2. Collect traces: prompts, tool calls, outcomes, failures
3. Score outcomes: tests, static analysis, user signals
4. Cluster recurring failure patterns
5. Train lightweight updates (LoRA/adapters)
6. Validate retention (did old skills degrade?)
7. Deploy modular update (with rollback capability)
```

This is not real-time learning. It's **periodic consolidation**.

Human analogy: **Sleep.** Process experiences, consolidate important patterns, prune noise.

## Time Scales of Update

| Frequency | What Changes | Method |
|-----------|--------------|--------|
| Every query | Nothing (inference only) | - |
| Per session | Memory | Retrieval-Augmented Generation (RAG)/Engram |
| Daily | Adapters (maybe) | Lightweight Parameter-Efficient Fine-Tuning (PEFT) |
| Weekly | Validated adapters | Reviewed updates |
| Monthly | Core weights | Major consolidation |

Most systems should:
- Update memory frequently
- Update adapters occasionally
- Update core weights rarely

## Evaluation Is Critical

Continuous learning without continuous evaluation is dangerous.

**Required:**
- Retention tests (what got worse?)
- Forward transfer tests (what got better?)
- Regression detection
- Rollback capability

Without these, you're flying blind.

## References

| Concept | Paper |
|---------|-------|
| ELLA | [Subspace Learning for Lifelong ML](https://arxiv.org/abs/2410.06408) (2024) |
| Share | [Shared LoRA Subspaces](https://arxiv.org/abs/2502.00661) (2025) |
| FOREVER | [Model-Centric Replay](https://arxiv.org/abs/2401.16876) (2024) |
| EWC | [Overcoming Catastrophic Forgetting](https://arxiv.org/abs/1612.00796) (Kirkpatrick et al. 2017) |

## Coming Next

In Part 7, we'll put it all together: **designing a practical continuous learning agent** with layered architecture, logging, feedback loops, and safety.

---

*Learn often in memory. Consolidate carefully in weights.*
