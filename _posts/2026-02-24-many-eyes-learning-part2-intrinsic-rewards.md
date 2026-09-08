---
layout: post
title: "Many-Eyes Learning: Intrinsic Rewards and Diversity"
date: 2026-02-24 17:30:00 -0800
categories: [machine-learning, research, vibe-coding]
tags: [reinforcement-learning, exploration, sparse-rewards, scouts, intrinsic-rewards, curiosity]
keywords: "intrinsic rewards, curiosity-driven exploration, count-based novelty, optimistic initialization, exploration strategies, many-eyes learning, scout diversity, Q-learning, shared Q-table, epsilon decay"
author: Software Wrighter
abstract: "Expanding many-eyes learning with intrinsic rewards and a new web visualization. CuriousScout uses count-based novelty, OptimisticScout uses optimistic initialization. The key trade-off: diversity helps during exploration, but once Q-values converge, all scouts should follow the same optimal policy. Strategy quality matters more than diversity in simple environments."
series: "Machine Learning"
series_part: 6
video_url: "https://youtu.be/2KieDPrOl7k"
video_title: "More Eyes, Better Learning"
repo_url: "https://github.com/softwarewrighter/many-eyes-learning"
papers:
  - title: "IRPO: Intrinsic Reward Policy Optimization"
    url: "https://arxiv.org/abs/2601.21391"
  - title: "Reagent: Reasoning Reward Models for Agents"
    url: "https://arxiv.org/abs/2601.22154"
  - title: "Curiosity-driven Exploration by Self-Supervised Prediction"
    url: "https://arxiv.org/abs/1705.05363"
---

<img src="{{ '/assets/images/posts/block-many-eyes.webp' | relative_url }}" class="post-marker" alt="">

In [Part 1](/2026/02/03/many-eyes-learning/), we demonstrated that multiple scouts dramatically improve learning in sparse-reward environments. Five scouts achieved 60% success where a single scout achieved 0%.

This post explores **how scouts explore**: intrinsic rewards that drive novelty-seeking behavior, and what happens when you mix different exploration strategies.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [many-eyes-learning](https://github.com/softwarewrighter/many-eyes-learning) |
| **Part 1** | [Solving Sparse Rewards with Many Eyes](/2026/02/03/many-eyes-learning/) |
| **Video** | [Many-Eyes Learning: Watch AI Scouts Explore](https://youtu.be/2KieDPrOl7k)<br>[![Video](https://img.youtube.com/vi/2KieDPrOl7k/mqdefault.jpg){: .video-thumb}](https://youtu.be/2KieDPrOl7k) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Recap: The Many-Eyes Architecture

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

Scouts are **information gatherers**, not independent learners. They explore with different strategies, pool their discoveries, and a shared learner benefits from the combined experience.

## New Scout Strategies

### CuriousScout: Count-Based Novelty

IRPO formalizes **intrinsic rewards** as the mechanism that drives scout exploration. CuriousScout implements count-based curiosity:

```python
class CuriousScout(Scout):
    def __init__(self, bonus_scale: float = 1.0):
        self.state_counts = defaultdict(int)
        self.bonus_scale = bonus_scale

    def intrinsic_reward(self, state):
        count = self.state_counts[state]
        return self.bonus_scale / sqrt(count + 1)
```

**How it works:**
- Track how many times each state has been visited
- Reward = `bonus_scale / √(count + 1)`
- Novel states get high rewards; familiar states get diminishing returns

**The intuition:** A curious scout is drawn to unexplored territory. The first visit to a state is exciting (reward = 1.0). The fourth visit is mundane (reward = 0.5). This creates natural pressure to explore widely.

### OptimisticScout: Optimism Under Uncertainty

A different philosophy: assume unknown states are valuable until proven otherwise.

```python
class OptimisticScout(Scout):
    def __init__(self, optimism: float = 10.0):
        self.optimism = optimism

    def initial_q_value(self):
        return self.optimism  # Instead of 0
```

**How it works:**
- Initialize all Q-values to a high value (e.g., 10.0)
- The agent is "optimistic" about unvisited state-action pairs
- As it explores and receives actual rewards, Q-values decay toward reality

**The intuition:** If you've never tried something, assume it might be great. This drives exploration without explicit novelty bonuses.

### Strategy Comparison

| Strategy | Mechanism | Best For |
|----------|-----------|----------|
| **Random** | Uniform random actions | Baseline, maximum coverage |
| **Epsilon-Greedy** | Random with probability ε, greedy otherwise | Balancing exploit/explore |
| **CuriousScout** | Novelty bonus for unvisited states | Systematic coverage |
| **OptimisticScout** | High initial Q-values | Early exploration pressure |

## The Diversity Experiment

Does **mixing strategies** help, or is it enough to have **multiple scouts with the same good strategy**?

### Setup

- 7x7 sparse grid, 100 training episodes
- All configurations use exactly 5 scouts (fair comparison)
- 5 random seeds for statistical significance

### Configurations

1. **Homogeneous Random**: 5 identical random scouts
2. **Homogeneous Epsilon**: 5 identical epsilon-greedy scouts (ε=0.2)
3. **Diverse Mix**: Random + 2 epsilon-greedy (ε=0.1, 0.3) + CuriousScout + OptimisticScout

### Results

| Configuration | Success Rate |
|--------------|-------------|
| Random baseline | 7% |
| Homogeneous random | 20% |
| **Homogeneous epsilon** | **40%** |
| **Diverse mix** | **40%** |

### Analysis

**Finding: Strategy quality matters more than diversity in simple environments.**

- Epsilon-greedy (homogeneous or mixed) outperforms pure random
- Diverse mix performs **the same** as homogeneous epsilon-greedy
- Having 5 good scouts beats having 5 diverse but weaker scouts

**Why doesn't diversity help here?**

In a simple 7x7 grid, the exploration problem is primarily about **coverage**, not **strategy complementarity**. Five epsilon-greedy scouts with different random seeds already explore different regions due to stochastic action selection.

Diversity likely provides more benefit in:
- Complex environments with multiple local optima
- Tasks requiring different behavioral modes
- Environments with deceptive reward structures

## Web Visualization

The web visualization demonstrates Many-Eyes Learning with real-time parallel scout movement. *(The upcoming video walks through this demo---the post focuses on the underlying mechanism.)*

![Many-Eyes Web Visualization]({{ '/assets/images/posts/many-eyes-screenshot.webp' | relative_url }})

### How It Works

The web version uses **Q-learning with a shared Q-table** (simpler than DQN for clarity). All scouts contribute to the same Q-table---the core "many eyes" concept: more explorers = faster Q-value convergence.

| Scout | Role | Epsilon | Behavior |
|-------|------|---------|----------|
| Random | Baseline | 1.0 (constant) | Always random, never follows policy |
| Scouts 1-N | Learning Agents | 0.5-0.8 → 0.01 | Epsilon-greedy with decay |

### Exploration Modes

The UI provides a dropdown to select different exploration strategies:

| Mode | Heatmap Diversity | Learning Performance |
|------|-------------------|---------------------|
| **Shared Policy** | Low (identical paths) | **Best** (lowest avg steps) |
| **Diverse Paths** | High (distinct paths) | Worse (biases override optimal) |
| **High Exploration** | High | Worst (never fully exploits) |
| **Boltzmann** | Moderate | Moderate |

### The Diversity vs Performance Trade-off

There's a fundamental trade-off between visual diversity and learning performance:

- **Shared Policy wins on performance**: The "many eyes" benefit comes from diverse *exploration during learning* (finding the goal faster). But once Q-values converge, all scouts should follow the *same optimal policy*.

- **Diverse Paths sacrifices performance for visuals**: Scout-specific directional biases (Scout 1 prefers right, Scout 2 prefers down) create visually interesting heatmaps but suboptimal behavior.

- **High Exploration never converges**: Fixed 50% random actions means scouts never fully exploit the learned policy.

**Key insight**: For best learning, use **Shared Policy**. Use other modes to visualize how different exploration strategies affect the learning process, but expect higher average steps.

### Learning Phases

| Phase | Episodes | Avg Steps | Behavior |
|-------|----------|-----------|----------|
| Random | 1-5 | ~70 | All scouts exploring randomly |
| Early Learning | 5-15 | 40-60 | Policy starts forming |
| Convergence | 15-30 | 15-25 | Clear optimal path emerges |
| Stable | 30+ | 12-18 | Near-optimal with random scout noise |

### Why "Average Steps to Goal"?

Success rate is coarse-grained---with 5 scouts, only 6 values are possible (0%, 20%, 40%, 60%, 80%, 100%). After ~10 episodes, all scouts typically reach the goal. **Average steps** shows continued policy refinement, dropping from ~70 (random) to ~8 (optimal).

### Running the Visualization

```bash
./scripts/serve.sh   # Open http://localhost:3200
```

- **Yew/WASM frontend** with FastAPI backend
- Speed control from 1x to 100x
- Replay mode to step through recorded training

## What's Next

Potential future directions:

| Direction | Why It Matters |
|-----------|----------------|
| **Larger environments** | Test scaling to 15x15, 25x25 grids |
| **Scout communication** | Real-time sharing vs passive pooling |
| **Adaptive intrinsic rewards** | Learn the reward function (closer to full IRPO) |
| **Multi-goal environments** | Multiple sparse rewards to discover |

## Key Takeaways

1. **Intrinsic rewards drive exploration.** CuriousScout and OptimisticScout implement different philosophies: novelty bonuses vs optimistic initialization.

2. **Strategy quality > diversity** in simple environments. Five good scouts beat five diverse but weaker scouts.

3. **Diversity during learning, convergence after.** The "many eyes" benefit comes from diverse *exploration during learning*. Once Q-values converge, all scouts should follow the same optimal policy.

4. **Shared Q-table enables collective learning.** All scouts contribute to one Q-table---more explorers means faster convergence.

5. **Visual diversity costs performance.** Modes like "Diverse Paths" create interesting heatmaps but suboptimal behavior. Use "Shared Policy" for best learning results.

## References

| Concept | Paper |
|---------|-------|
| IRPO | [Intrinsic Reward Policy Optimization](https://arxiv.org/abs/2601.21391) (Cho & Tran 2026) |
| Reagent | [Reasoning Reward Models for Agents](https://arxiv.org/abs/2601.22154) (Fan et al. 2026) |
| ICM | [Curiosity-driven Exploration](https://arxiv.org/abs/1705.05363) (Pathak et al. 2017) |

---

*Diverse exploration, convergent execution. Many eyes see more, but the best path is the one they all agree on.*
