---
layout: post
title: "Towards Continuous LLM Learning (1): Sleepy Coder - When Fine-Tuning Fails"
date: 2026-02-12 00:30:00 -0800
categories: [llm, machine-learning, research]
tags: [lora, fine-tuning, continual-learning, rust, catastrophic-forgetting]
keywords: "LoRA, fine-tuning, continual learning, catastrophic forgetting, Share algorithm, UWSH, negative result, SVD, Singular Value Decomposition"
author: Software Wrighter
series: "Towards Continuous LLM Learning"
series_part: 1
video_url: "https://youtu.be/YhAbOvWEkzE"
video_title: "LLM Learns While You Sleep"
repo_url: "https://github.com/softwarewrighter/sleepy-coder"
papers:
  - title: "Share: Shared LoRA Subspaces for Continual Learning"
    url: "https://arxiv.org/abs/2602.06043"
  - title: "The Universal Weight Subspace Hypothesis"
    url: "https://arxiv.org/abs/2512.05117"
abstract: "What happens when you fine-tune a model on new tasks? It forgets old ones. This post documents our implementation of the Share algorithm in Rust—using SVD-based subspace extraction to enable continual learning without catastrophic forgetting. Part 1 covers the problem and initial negative results."
---

<img src="{{ '/assets/images/posts/sleeper-dreaming.webp' | relative_url }}" class="post-marker" alt="">

What if your AI coding assistant could learn from its mistakes? Not just for one session, but across training cycles. We built exactly that---and fifty-one adapters later, learned the mistake was trying to teach it at all.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [Sleepy Coder](https://youtu.be/YhAbOvWEkzE)<br>[![Video](https://img.youtube.com/vi/YhAbOvWEkzE/mqdefault.jpg){: .video-thumb}](https://youtu.be/YhAbOvWEkzE) |
| **Code** | [sleepy-coder](https://github.com/softwarewrighter/sleepy-coder) |
| **Share Paper** | [arXiv:2602.06043](https://arxiv.org/abs/2602.06043) |
| **UWSH Paper** | [arXiv:2512.05117](https://arxiv.org/abs/2512.05117) |
| **Part 2** | [Routing Prevents Forgetting](/2026/02/18/sleepy-coder-routing-prevents-forgetting/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Dream: Day/Night Learning

AI coding agents have a memory problem. They fix a bug today, then make the same mistake next week. Every session starts from the same frozen model. Nothing carries forward.

The idea was elegant: build an agent that improves overnight.

```
DAY CYCLE (Inference)
  Agent attempts to fix Rust compiler errors
  Successes and failures are logged
        ↓
NIGHT CYCLE (Training)
  Fine-tune on failure patterns using LoRA
  Create specialized adapters
        ↓
EVAL
  Test against benchmark
  Measure improvement
        ↓
(repeat)
```

During the day, the agent works and we log its failures---the error messages, the broken code, and the fixes that worked. Overnight, we fine-tune the model on those failures. Each morning, a new checkpoint should wake up a little better than before.

We based this on two papers from the Johns Hopkins team (Kaushik, Vaidya, Chaudhari, Chellappa, Yuille):

1. **Share LoRA Subspaces** (arXiv:2602.06043) --- Learn a shared low-rank basis across tasks, then train only coefficients (76x fewer parameters per task)

2. **UWSH** (arXiv:2512.05117) --- The Universal Weight Subspace Hypothesis suggests neural networks converge to shared spectral subspaces

The theory was sound. The implementation worked. The results were devastating.

## The System

The Sleepy Coder agent runs in a Rust runtime, fixing compiler errors on 30 "koans" (small coding exercises) across 5 error families:

- **Borrow Checker**: Ownership and lifetime errors
- **Type Bounds**: Missing trait implementations
- **Result Handling**: Option/Result conversions
- **Type Mismatches**: Incompatible types
- **Missing Items**: Undefined functions or modules

The base model: **Qwen2.5-Coder-1.5B-Instruct** --- small enough to train on a single GPU, capable enough to pass most koans without any fine-tuning.

## The Journey: From Hope to Reality

### Chapter 1: Naive LoRA

First attempt: standard fine-tuning on failure patterns.

| Metric | Before | After |
|--------|--------|-------|
| Pass Rate | 73.3% | 60.0% |
| Change | --- | -13.3% |

Catastrophic forgetting. The model learned the new patterns but forgot how to do everything else.

### Chapter 2: The Paper Chase

We found the Share paper promising "continual learning without forgetting." The UWSH paper provided theoretical backing: neural networks naturally converge to shared low-rank subspaces.

Key insight from Share:
> Train ONLY the coefficients. Keep the basis FROZEN.

This meant ~21,000 trainable parameters instead of ~1.6 million. A 76x reduction.

### Chapter 3: The Proper Implementation

<div class="definition-box" markdown="1">
**SVD: Singular Value Decomposition** breaks a matrix into components that reveal its underlying structure. In Share, SVD finds the common "directions" that multiple LoRA adapters share---a compressed basis that captures what they have in common.
</div>

We rebuilt everything:

- **Phase 1:** Extract shared basis from 51 adapters via SVD
- **Phase 2:** Train only coefficient vectors (frozen basis)
- **Phase 3:** Merge and update basis periodically

We trained 51 pattern-specific adapters. We followed the algorithm precisely.

### Chapter 4: The Stubborn Seven

No matter what we tried, 7 tasks kept failing:

| Task | The Problem |
|------|-------------|
| bc_003 | Mutable borrow while immutable exists |
| bc_005 | Double mutable borrow |
| bc_010 | Returning reference to local data |
| tb_002 | Missing Clone trait |
| tb_007 | Missing Hash trait |
| tb_008 | Missing Ord trait |
| rh_004 | Option to Result conversion |

These require deep understanding of Rust's ownership system---something a 1.5B model can't reliably learn.

### Chapter 5: The Final Score

| Approach | Pass Rate | vs Baseline | Regressions |
|----------|-----------|-------------|-------------|
| Baseline (no training) | 73.3% | --- | 0 |
| Naive LoRA | 60.0% | -13.3% | Many |
| Targeted LoRA (7 patterns) | 63.3% | -10% | 4+ |
| Replay buffer | 70.0% | -3.3% | 2 |
| Phase 2 coef-only (10K params) | 66.7% | -6.6% | 2 |
| **Share Full (Ph2+Ph3)** | **73.3%** | **0%** | **0** |

The Share algorithm did exactly what it claimed: it prevented forgetting. But it couldn't improve beyond baseline because **there was nothing to improve.**

## What Went Wrong

### 1. The Model Already Knows

The base model already passes 73% of patterns. Training on these patterns doesn't add knowledge---it dilutes what's there.

### 2. Training Causes Forgetting

Even training only on the 7 failure patterns (44 examples) caused 4 new regressions. The model's knowledge is interconnected.

### 3. Averaging Destroys Specialization

The Share paper assumes task routing at inference---selecting the right coefficients for each task. We averaged coefficients, which negated any specialization.

### 4. More Adapters Made It Worse

| Adapter Count | Pass Rate |
|---------------|-----------|
| 6 adapters | 73.3% |
| 51 adapters | 70.0% |

More adapters meant more subspace dilution when averaging. The signal got lost in the noise.

## The Critical Insight

**LoRA fine-tuning cannot improve a capable base model for tasks it already handles reasonably well.**

The model's knowledge is interconnected. Even 10,000 trainable parameters (0.0007% of the model) can break things. The baseline represents the ceiling, not the floor.

## What We Learned

1. **Read the room.** If your base model passes 73%, maybe it doesn't need fine-tuning. Maybe it needs better prompts.

2. **Negative results are results.** 51 failed experiments taught us more than a successful one would have.

3. **Catastrophic forgetting is real.** Small models especially can't absorb new knowledge without losing old.

4. **Share prevents forgetting, not ignorance.** The algorithm does what it claims---it just can't create knowledge from nothing.

5. **Sometimes the answer is "don't."** The best LoRA adapter for this task is no adapter.

6. **Task routing vs averaging matters.** The Share paper assumes you select coefficients based on task type, not blend them together.

7. **AI coding agents cut corners.** When implementing research papers, AI agents repeatedly stopped before completing all phases of the algorithm. I had to direct the agent to re-read the papers many times before it implemented them correctly.

## Paths Forward

Since fine-tuning doesn't work here, alternatives:

| Approach | Tradeoff |
|----------|----------|
| Prompt engineering | No weight changes, limited by context |
| Multi-turn repair | Uses base model reasoning, slower |
| Larger model (7B+) | More capacity to absorb knowledge |
| Task routing with Share | Select coefficients, don't average |
| Model ensemble | Multiple models, pick best output |
| Accept baseline | 73% may be good enough |

## The Numbers

```
Experiments run:        51 adapters, multiple algorithms
Parameters trained:     From 10K to 1.6M per adapter
Best achieved:          73.3% (matches baseline)
Target:                 ≥76.7%
Conclusion:             Target not achievable with LoRA
```

## Resources

- [sleepy-coder Repository](https://github.com/softwarewrighter/sleepy-coder)
- [Share LoRA Subspaces Paper (arXiv:2602.06043)](https://arxiv.org/abs/2602.06043)
- [UWSH Paper (arXiv:2512.05117)](https://arxiv.org/abs/2512.05117)

---


*Sometimes the most valuable research shows what doesn't work. Fifty-one adapters later, we know: let sleeping models lie.*

