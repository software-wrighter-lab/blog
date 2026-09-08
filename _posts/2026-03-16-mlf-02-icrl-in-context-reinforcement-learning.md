---
layout: post
title: "ML Frontier #02: In-Context Reinforcement Learning"
date: 2026-03-16 00:15:00 -0800
categories: [machine-learning, research, explainers]
tags: [ml-frontier, icrl, reinforcement-learning, transformers, decision-transformer, in-context-learning, ai-agents]
keywords: "in-context reinforcement learning, ICRL, decision transformer, temporal difference learning, OmniRL, reflexion, voyager, RL without training, in-context learning, trajectory examples, reward-based learning, AI agents, prompt-based RL, sequence modeling"
author: Software Wrighter
abstract: "Transformers can learn reinforcement learning policies from trajectory examples in the prompt---no weight updates, no gradient descent. ICRL turns agents from amnesiacs into learners by injecting successful execution traces into context."
series: "Machine Learning Frontier"
series_part: 2
video_url: "https://www.youtube.com/shorts/D4KrvmqOwEY"
video_title: "ML Frontier 2: ICRL (In-Context Reinforcement Learning)"
papers:
  - title: "Decision Transformer: Reinforcement Learning via Sequence Modeling"
    url: "https://arxiv.org/abs/2106.01345"
  - title: "Transformers Learn Temporal Difference Methods for In-Context Reinforcement Learning"
    url: "https://arxiv.org/abs/2405.13861"
  - title: "OmniRL: In-Context Reinforcement Learning Across Multiple Tasks"
    url: "https://arxiv.org/abs/2502.02869"
  - title: "Reflexion: Language Agents with Verbal Reinforcement Learning"
    url: "https://arxiv.org/abs/2303.11366"
  - title: "Voyager: An Open-Ended Embodied Agent with Large Language Models"
    url: "https://arxiv.org/abs/2305.16291"
---

<img src="{{ '/assets/images/posts/block-graph.webp' | relative_url }}" class="post-marker" alt="" style="width: 120px;">

Second ML Frontier episode. This one covers In-Context Reinforcement Learning---how transformers learn decision policies from trajectory examples in the prompt, without weight updates.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | [5 papers covered](#papers) |
| **Video** | [ML Frontier 2: ICRL](https://www.youtube.com/shorts/D4KrvmqOwEY)<br>[![Video](https://img.youtube.com/vi/D4KrvmqOwEY/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/D4KrvmqOwEY) |
| **Related** | [Saw #2: agentrail-rs](/2026/03/15/saw-reg-rs-avoid-compaction-agentrail/) --- practical ICRL application |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What is In-Context Reinforcement Learning?

The model observes sequences of states, actions, and rewards stored in the prompt. Instead of updating weights through gradient descent, the transformer approximates a policy from those trajectory examples.

Think of it like learning to cook by reading a journal of recipes that worked---and ones that didn't---with notes on what went wrong.

## Why Does This Matter?

AI agents often lose procedural knowledge when context is truncated between sessions. They know the goal but forget which API to call, which flags to use, which client library to reference, or how to validate output.

The traditional approach---writing instructions in markdown files---isn't reliable. Agents ignore rules even when they're present. ICRL offers a different path: instead of telling the agent what to do, show it what worked and what didn't, with reward signals attached.

By embedding successful execution traces in the prompt, agents can reuse proven approaches instead of improvising from scratch.

## Research Evidence

### Decision Transformer (Chen et al., 2021)

**Paper:** [arXiv 2106.01345](https://arxiv.org/abs/2106.01345)

**In brief:** The paper that started it all. Instead of training an RL agent with value functions and policy gradients, just frame the problem as sequence prediction. Feed the transformer trajectories of (return-to-go, state, action) and let it predict the next action conditioned on the desired return. The transformer learns a policy by modeling sequences---no Bellman equations needed.

**Why it matters:** Reframed RL as something transformers already do well: sequence modeling.

### Transformers Learn TD Methods (Wang et al., ICLR 2025)

**Paper:** [arXiv 2405.13861](https://arxiv.org/abs/2405.13861)

**In brief:** This paper shows that transformers don't just pattern-match on trajectories---they actually approximate temporal-difference (TD) learning algorithms during the forward pass. The model internally implements something resembling TD updates, without being explicitly trained to do so.

**Why it matters:** Transformers aren't just memorizing trajectories. They're learning the underlying RL algorithm in-context.

### OmniRL (2025)

**Paper:** [arXiv 2502.02869](https://arxiv.org/abs/2502.02869)

**In brief:** OmniRL proposes a transformer architecture that emulates actor-critic RL in-context, improving decision quality across multiple tasks. Rather than specializing in one environment, the model generalizes its in-context RL capabilities across diverse settings.

**Why it matters:** ICRL isn't limited to one task---it scales across environments.

### Reflexion (Shinn et al., NeurIPS 2023)

**Paper:** [arXiv 2303.11366](https://arxiv.org/abs/2303.11366)

**In brief:** Reflexion takes a different angle: instead of embedding raw trajectories, the agent generates verbal reflections on its failures and successes. These self-critiques are stored and injected into future prompts. The agent learns from its own written analysis of what went wrong.

**Why it matters:** Shows that trajectory-based learning doesn't require structured (state, action, reward) tuples---natural language reflections work too.

### Voyager (Wang et al., 2023)

**Paper:** [arXiv 2305.16291](https://arxiv.org/abs/2305.16291)

**In brief:** An open-ended Minecraft agent that builds a skill library from successful code executions. When Voyager solves a task, it stores the working code as a reusable skill. Future tasks can retrieve and compose these skills. The agent explores, learns, and accumulates capabilities without any weight updates.

**Why it matters:** Demonstrates ICRL at scale---an agent that gets better over time by accumulating proven solutions.

## Papers {#papers}

| Date | Paper | Link |
|------|-------|------|
| Jun 2021 | Decision Transformer: RL via Sequence Modeling | [arXiv 2106.01345](https://arxiv.org/abs/2106.01345) |
| Mar 2023 | Reflexion: Language Agents with Verbal Reinforcement Learning | [arXiv 2303.11366](https://arxiv.org/abs/2303.11366) |
| May 2023 | Voyager: Open-Ended Embodied Agent with LLMs | [arXiv 2305.16291](https://arxiv.org/abs/2305.16291) |
| May 2024 | Transformers Learn TD Methods for In-Context RL | [arXiv 2405.13861](https://arxiv.org/abs/2405.13861) |
| Feb 2025 | OmniRL: In-Context RL Across Multiple Tasks | [arXiv 2502.02869](https://arxiv.org/abs/2502.02869) |

## Practical Application: agentrail-rs

This isn't just theory. I'm building [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) to apply ICRL to AI coding agents used for non-coding tasks---TTS generation, video compositing, file manipulation. The tool records trajectories (state, action, result, reward) and injects successful examples into future agent prompts. Early days, but the research says this should work.

See [Saw #2: agentrail-rs](/2026/03/15/saw-reg-rs-avoid-compaction-agentrail/) for more on the engineering side.

## Key Takeaways

| Concept | One-liner |
|---------|-----------|
| **ICRL** | Learn RL policies from trajectory examples in the prompt |
| **No Weight Updates** | The transformer adapts during inference, not training |
| **TD in the Forward Pass** | Transformers approximate RL algorithms internally |
| **Verbal Reflection** | Natural language self-critique works as trajectory data |
| **Skill Libraries** | Accumulate proven solutions for reuse across sessions |

---

*In-Context RL turns agents from amnesiacs into learners. Follow for more ML Frontier episodes exploring research at the edge.*
