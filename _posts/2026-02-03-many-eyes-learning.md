---
layout: post
title: "Solving Sparse Rewards with Many Eyes"
date: 2026-02-03 09:00:00 -0800
categories: [llm, machine-learning, research]
tags: [reinforcement-learning, exploration, sparse-rewards, scouts, dqn]
keywords: "sparse rewards, multi-agent exploration, scout-based learning, DQN, exploration strategies, information bottleneck"
author: Software Wrighter
abstract: "Single explorer: 0% success. Five explorers: 60% success. Sparse rewards are an information problem, not a compute problem. Using multiple scouts with different exploration strategies, we gather diverse discoveries that benefit a shared learner."
video_url: "https://www.youtube.com/shorts/KgtiBy4rdm4"
video_title: "Given enough eyeballs..."
repo_url: "https://github.com/softwarewrighter/many-eyes-learning"
papers:
  - title: "IRPO"
    url: "https://arxiv.org/abs/2601.21391"
  - title: "Reagent"
    url: "https://arxiv.org/abs/2601.22154"
series: "Machine Learning"
series_part: 1
---

<img src="{{ '/assets/images/posts/many-eyes-monster.gif' | relative_url }}" class="post-marker" alt="">

Single explorer: 0% success. Five explorers: 60% success.

Learning often fails not because models are slow, but because they **see too little**. In sparse-reward environments, a single explorer is likely to miss the rare feedback entirely. The solution? **Put many eyes on the problem.**

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [Intrinsic Rewards and Diversity](/2026/02/24/many-eyes-learning-part2-intrinsic-rewards/) |
| **Papers** | [IRPO](https://arxiv.org/abs/2601.21391) · [Reagent](https://arxiv.org/abs/2601.22154) |
| **Code** | [many-eyes-learning](https://github.com/softwarewrighter/many-eyes-learning) |
| **ELI5** | [eli5.md](https://github.com/softwarewrighter/many-eyes-learning/blob/main/docs/eli5.md) |
| **Video** | [Given enough eyeballs...](https://www.youtube.com/shorts/KgtiBy4rdm4)<br>[![Video](https://img.youtube.com/vi/KgtiBy4rdm4/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/KgtiBy4rdm4) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The Problem: Sparse Rewards Create Blindness

As IRPO formalizes: in sparse-reward RL, **the true policy gradient is basically uninformative most of the time**. No reward signal → no gradient signal.

A 7x7 grid with a single goal demonstrates this perfectly:

- Random agent success rate: ~9%
- With limited training (75 episodes), a single learner exploring alone **never finds the goal**

This isn't a compute problem. It's an **information problem**.

<div class="references-float" markdown="1">

| Challenge | Effect | Paper Connection |
|-----------|--------|------------------|
| Rare rewards | Weak gradient signal | IRPO's core problem statement |
| Single explorer | Limited coverage | Why multiple scouts help |
| Random exploration | Misses valuable states | Why intrinsic rewards matter |
| No feedback structure | Can't distinguish "almost right" from "nonsense" | Reagent's motivation |


</div>

## The Solution: Many Eyes

Instead of one explorer, use multiple **scouts**---independent exploratory agents that gather diverse information.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Scout 1   │  │   Scout 2   │  │   Scout N   │
│ (strategy A)│  │ (strategy B)│  │ (strategy N)│
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       v                v                v
┌─────────────────────────────────────────────────┐
│              Experience Buffer                   │
└─────────────────────────────────────────────────┘
                       │
                       v
┌─────────────────────────────────────────────────┐
│               Shared Learner                     │
└─────────────────────────────────────────────────┘
```

Each scout explores with its own strategy. Their discoveries are aggregated to improve a shared learner.

## Results

On a 7x7 sparse grid with 75 training episodes:

| Method | Success Rate |
|--------|-------------|
| Random baseline | 9% |
| **Single scout** | **0%** |
| Many eyes (3 scouts) | 40% |
| **Many eyes (5 scouts)** | **60%** |

Same total environment steps. Dramatically better outcomes.

## Why It Works

### Single Scout Fails Because:

In IRPO terms: **sparse reward → sparse gradient signal → no learning**.

1. Random exploration rarely reaches the goal (~9%)
2. Insufficient successful trajectories
3. DQN can't learn from sparse positive examples
4. The policy gradient has near-zero magnitude

### Many Eyes Succeeds Because:

IRPO's key insight: **multiple exploratory policies manufacture signal**.

1. **More coverage**: Different scouts explore different regions (intrinsic rewards drive novelty-seeking)
2. **More discoveries**: Higher probability of reaching goal (scouts find extrinsic reward)
3. **Signal routing**: Scout discoveries update the shared learner (surrogate gradient in IRPO, experience pooling in many-eyes)
4. **Better gradients**: Aggregated experience provides meaningful learning signal

## Scout Strategies (Intrinsic Rewards)

IRPO uses **intrinsic rewards** to drive exploration. The many-eyes-learning project implements several strategies:

| Strategy | Intrinsic Motivation | IRPO Connection |
|----------|---------------------|-----------------|
| **Epsilon-greedy** | Random action with probability ε | Simple exploration noise |
| **Curious** | Bonus for novel states: `1/√(count+1)` | Count-based intrinsic reward |
| **Optimistic** | High initial Q-values | Optimism under uncertainty |
| **Random** | Pure random baseline | Maximum entropy exploration |

```python
# CuriousScout intrinsic reward (simplified)
def intrinsic_reward(self, state):
    count = self.state_counts[state]
    return self.bonus_scale / sqrt(count + 1)
```

Scouts can be **homogeneous** (same strategy, different seeds) or **heterogeneous** (different strategies). IRPO supports swapping intrinsic reward functions---many-eyes makes this concrete with pluggable scout types.

## Running the Demo

```bash
git clone https://github.com/softwarewrighter/many-eyes-learning
cd many-eyes-learning

# Setup
uv venv .venv
source .venv/bin/activate
uv pip install -e ".[dev]"

# Interactive CLI demo
python experiments/cli_demo.py

# Full experiment
python experiments/run_experiment.py --episodes 75 --scouts 1 3 5

# Generate plots
python experiments/plot_results.py
```

Results appear in ~5-10 minutes on a laptop.

## Diversity Experiment

Does **diversity of strategies** matter, or just **number of scouts**?

| Configuration | Success Rate |
|--------------|--------------|
| 5 random scouts | 20% |
| 5 epsilon-greedy scouts | 40% |
| 5 diverse scouts (mixed strategies) | 40% |

**Finding**: In simple environments, strategy quality matters more than diversity. Epsilon-greedy beats random regardless of diversity.

## Key Insight

> *The problem isn't that learning is slow. The problem is that learning is blind.*

Many eyes make learning better.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | Python |
| **Source Files** | ~12 `.py` files |
| **Estimated Size** | ~1.5 KLOC |
| **Framework** | PyTorch, NumPy |
| **Platform** | CPU (no GPU required) |

**Good for you if:** You want to understand exploration in RL, experiment with sparse-reward environments, or see a clean implementation of scout-based learning.

**Complexity:** Low-Moderate. Clean codebase with CLI demos. Runs on a laptop in minutes.

## Design Philosophy

The project prioritizes **clarity over performance**:

- Single-file implementations where practical
- Minimal dependencies
- Sequential mode is first-class (parallel optional)
- Reproducible experiments with fixed seeds

### Simplifications from IRPO

Full IRPO computes Jacobians to route gradients from exploratory policies back to the base policy. Many-eyes-learning simplifies this:

| IRPO | Many-Eyes-Learning |
|------|---------------------|
| Jacobian chain rule | Experience pooling |
| Surrogate gradient | Standard DQN updates |
| Learned intrinsic rewards | Hand-designed strategies |

The core insight remains: **scouts explore with intrinsic motivation, discoveries benefit the shared learner**. The math is simpler, the demo runs on a laptop, and the concept is clear.

## Key Takeaways

1. **Sparse rewards create information bottlenecks.** Learning fails not from lack of compute, but lack of signal.

2. **More eyes = more information.** Multiple scouts increase coverage and discovery rate.

3. **Diversity helps, but quality matters more.** In simple environments, good exploration strategy beats diversity.

4. **Same compute, better outcomes.** Many-eyes improves sample efficiency, not wall-clock speed.

## The Papers Behind Many-Eyes

This project builds on two recent papers that attack the same fundamental problem: **sparse rewards starve learning of signal**.

### IRPO: Intrinsic Reward Policy Optimization

[IRPO](https://arxiv.org/abs/2601.21391) (Cho & Tran, UIUC) formalizes the scouts concept mathematically.

**The core insight:** In sparse-reward RL, the true policy gradient is basically uninformative most of the time. No reward signal → no gradient signal. Learning stalls.

**IRPO's solution:**

```
┌─────────────────────────────────────────────────┐
│  1. Train exploratory policies (scouts)         │
│     using INTRINSIC rewards                     │
├─────────────────────────────────────────────────┤
│  2. Scouts discover EXTRINSIC rewards           │
│     through exploration                         │
├─────────────────────────────────────────────────┤
│  3. Route extrinsic signal back to base policy  │
│     via surrogate gradient (Jacobian chain)     │
└─────────────────────────────────────────────────┘
```

| IRPO Concept | What It Means |
|--------------|---------------|
| **Intrinsic rewards** | "Explore what's new" - reward novelty |
| **Exploratory policies** | Scouts driven by intrinsic motivation |
| **Surrogate gradient** | Trade bias for signal - approximate gradient that actually has magnitude |
| **Base policy** | The learner that benefits from scout discoveries |

**How many-eyes-learning demonstrates this:**

- **Scouts** implement intrinsic motivation (CuriousScout uses count-based novelty bonuses)
- **Multiple exploration strategies** create diverse coverage
- **Aggregated experience** routes discoveries to the shared DQN learner
- **Simplified gradient routing** - we pool experiences rather than compute full Jacobians

### Reagent: Reasoning Reward Models for Agents

[Reagent](https://arxiv.org/abs/2601.22154) (Fan et al., CUHK/Meituan) takes a different approach: make feedback **richer and more structured**.

**The problem with sparse rewards:** They can't distinguish "almost right, failed at the end" from "complete nonsense." Both get the same zero reward.

**Reagent's solution:** Build a Reasoning Reward Model that emits:

| Signal | Purpose |
|--------|---------|
| `<think>` | Explicit reasoning trace |
| `<critique>` | Targeted natural-language feedback |
| `<score>` | Overall scalar reward |

This provides **dense-ish supervision without hand-labeling every step**.

**How many-eyes-learning relates:**

- Both papers recognize sparse rewards as an **information problem**
- Reagent enriches the reward signal; IRPO multiplies the exploration
- Many-eyes takes the IRPO path: **more explorers finding the sparse signal**
- Future work could combine both: scouts + richer feedback per trajectory

### The Shared Meta-Lesson

Both papers are saying the same thing:

> **Sparse signals are a tragedy. Let's smuggle in richer ones.**

- IRPO: via intrinsic-reward exploration gradients
- Reagent: via language-based reward feedback

Many-eyes-learning demonstrates the IRPO intuition in a simple, visual, reproducible way.

## Resources

- [IRPO Paper (arXiv:2601.21391)](https://arxiv.org/abs/2601.21391)
- [Reagent Paper (arXiv:2601.22154)](https://arxiv.org/abs/2601.22154)
- [many-eyes-learning Repository](https://github.com/softwarewrighter/many-eyes-learning)
- [Results Documentation](https://github.com/softwarewrighter/many-eyes-learning/blob/main/docs/results.md)
- [Architecture Documentation](https://github.com/softwarewrighter/many-eyes-learning/blob/main/docs/architecture.md)

---

*Sparse rewards are an information problem. Many eyes provide the solution.*
