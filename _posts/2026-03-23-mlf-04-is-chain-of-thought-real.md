---
layout: post
title: "ML Frontier #04: Is Chain of Thought Real?"
date: 2026-03-23 00:15:00 -0800
categories: [machine-learning, research, explainers]
tags: [ml-frontier, chain-of-thought, reasoning, prompting, latent-reasoning, ai-agents]
keywords: "chain of thought, CoT, reasoning, prompting, latent reasoning, adaptive reasoning, faithfulness, step-by-step reasoning, language models, LLMs, AI agents, conditional reasoning, tool use, reinforcement learning"
author: Software Wrighter
abstract: "Chain of Thought prompting transformed AI reasoning in 2022. By 2026, the frontier has shifted from making CoT better to asking whether it reflects real reasoning at all---and when step-by-step thinking helps versus hurts."
series: "Machine Learning Frontier"
series_part: 4
video_url: "https://www.youtube.com/shorts/mBLFTyh1EKk"
video_title: "ML Frontier 4: Is Chain of Thought Real?"
papers:
  - title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"
    url: "https://arxiv.org/abs/2201.11903"
  - title: "To CoT or not to CoT? CoT Helps Mainly on Math and Symbolic Reasoning"
    url: "https://arxiv.org/abs/2409.12183"
  - title: "Training Large Language Models to Reason in a Continuous Latent Space (COCONUT)"
    url: "https://arxiv.org/abs/2412.06769"
  - title: "s1: Simple Test-Time Scaling"
    url: "https://arxiv.org/abs/2501.19393"
  - title: "Reasoning Models Don't Always Say What They Think"
    url: "https://arxiv.org/abs/2505.05410"
  - title: "Outcome-Based RL Provably Leads Transformers to Reason"
    url: "https://arxiv.org/abs/2601.15158"
  - title: "Latent Chain-of-Thought as Planning: Decoupling Reasoning from Verbalization"
    url: "https://arxiv.org/abs/2601.21358"
  - title: "Latent Reasoning with Supervised Thinking States"
    url: "https://arxiv.org/abs/2602.08332"
  - title: "Diagnosing Pathological Chain-of-Thought in Reasoning Models"
    url: "https://arxiv.org/abs/2602.13904"
  - title: "Reasoning Models Struggle to Control their Chains of Thought"
    url: "https://arxiv.org/abs/2603.05706"
---

<img src="{{ '/assets/images/posts/block-chain-of-thoughts.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 120px;">

Fourth ML Frontier episode. In 2022, Chain of Thought changed how we think about AI reasoning. By 2026, the question has shifted from "how to make CoT better" to "is it real reasoning at all?"

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Papers** | [10 papers (2024--2026)](#papers) |
| **Video** | [ML Frontier 4: Is CoT Real?](https://www.youtube.com/shorts/mBLFTyh1EKk)<br>[![Video](https://img.youtube.com/vi/mBLFTyh1EKk/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/mBLFTyh1EKk) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What Chain of Thought Promised

Wei et al. (2022) showed that prompting language models to "think step by step" dramatically improved performance on math, logic, and multi-step reasoning tasks. The idea was simple: instead of jumping straight to an answer, generate intermediate reasoning steps. The model explains its work, and the answer improves.

This became the foundation for everything from coding assistants to scientific reasoning pipelines. But a deeper question was always lurking: are those reasoning steps real?

## The Faithfulness Problem

Recent research shows models can produce plausible-looking reasoning steps that don't reflect their actual internal computation. The chain of thought *looks* like reasoning---it has logical connectives, intermediate conclusions, references to the problem---but the model may have arrived at the answer through entirely different internal pathways.

This is the faithfulness gap. A model's visible reasoning trace can be:

- **Post-hoc rationalization** --- constructing a justification after already deciding the answer
- **Biased by surface features** --- following patterns in the prompt rather than the problem structure
- **Unfaithful to internal state** --- the actual computation happening in the model's hidden layers doesn't match the text it generates

"Reasoning Models Don't Always Say What They Think" ([arXiv 2505.05410](https://arxiv.org/abs/2505.05410)) shows that even models specifically trained to reason via CoT produce traces that are often unfaithful to their actual decision process. A March 2026 follow-up, "Reasoning Models Struggle to Control their Chains of Thought" ([arXiv 2603.05706](https://arxiv.org/abs/2603.05706)), goes further: models can't reliably steer or suppress their reasoning traces even when instructed to. And "Diagnosing Pathological Chain-of-Thought in Reasoning Models" ([arXiv 2602.13904](https://arxiv.org/abs/2602.13904)) catalogs specific failure modes where CoT reasoning becomes actively pathological.

The implication is uncomfortable: when a model shows you its "thinking," you can't assume it's showing you *how* it actually thinks.

## CoT Is Task-Dependent

The research also reveals that Chain of Thought isn't universally beneficial. It helps with:

- **Math and arithmetic** --- multi-step calculations benefit from intermediate results
- **Multi-hop logic** --- problems requiring sequential deductions
- **Complex planning** --- tasks with dependencies between steps

But CoT can actually **hurt** performance on:

- **Pattern recognition** --- tasks where the answer is immediate/intuitive
- **Simple classification** --- forcing step-by-step reasoning adds noise
- **Tasks with misleading structure** --- when the "obvious" reasoning path leads away from the correct answer

A 2024 meta-analysis, "To CoT or not to CoT?" ([arXiv 2409.12183](https://arxiv.org/abs/2409.12183)), confirms this systematically: CoT provides negligible or negative benefit on many task types including commonsense reasoning and factual retrieval. The blanket advice of "always use Chain of Thought" is wrong. The right approach depends on the task.

## Adaptive Reasoning: Knowing When to Think

The field is moving toward **conditional reasoning**---models that decide *when* to think step by step and when to skip it. Wang and Zhou (2024) showed that chain-of-thought reasoning can emerge from models without explicit prompting, suggesting the capability is latent rather than purely prompt-dependent.

This points toward a future where models dynamically allocate reasoning effort:

- Simple questions get immediate answers
- Complex questions trigger step-by-step decomposition
- Ambiguous questions get clarifying sub-questions

"s1: Simple Test-Time Scaling" ([arXiv 2501.19393](https://arxiv.org/abs/2501.19393)) demonstrates this with budget-forcing---a simple mechanism to control how much reasoning a model performs at test time, truncating or extending thinking adaptively. "Outcome-Based RL Provably Leads Transformers to Reason" ([arXiv 2601.15158](https://arxiv.org/abs/2601.15158)) shows that RL training can teach transformers *when* reasoning is needed, not just *how* to reason. The model itself becomes the judge of how much thinking a problem requires.

## Latent Reasoning: Thinking Without Showing

Some of the most interesting current work explores **latent reasoning**---models that reason internally without generating visible steps. Instead of producing a text trace, the model uses its internal representations to perform multi-step computation within the forward pass.

This connects to research on:

- **Implicit chain of thought** --- reasoning encoded in hidden states rather than output tokens
- **Pause tokens** --- giving models extra computation steps without requiring text output
- **Internal scratchpads** --- dedicated hidden-state computation that doesn't appear in the response

COCONUT ([arXiv 2412.06769](https://arxiv.org/abs/2412.06769)) demonstrates this concretely: LLMs reason using continuous hidden states as "thoughts" instead of generating discrete tokens. Two 2026 papers push further: "Latent Chain-of-Thought as Planning" ([arXiv 2601.21358](https://arxiv.org/abs/2601.21358)) decouples reasoning from verbalization entirely, and "Latent Reasoning with Supervised Thinking States" ([arXiv 2602.08332](https://arxiv.org/abs/2602.08332)) trains models to reason through supervised internal states.

If latent reasoning works at scale, it could offer the accuracy benefits of CoT without the token cost or the faithfulness problem---because there's no visible trace to be unfaithful.

## CoT as Part of an Ecosystem

Chain of Thought is no longer a standalone technique. It's one component in a broader ecosystem:

| Component | Role |
|-----------|------|
| **CoT** | Step-by-step decomposition |
| **Tool use** | Offload computation to external systems |
| **Reflection** | Self-critique and error correction |
| **Planning loops** | Multi-turn strategy with backtracking |
| **Reinforcement learning** | Reward signals for reasoning quality |

This makes CoT the bridge concept between language models as *predictors* (next token), as *reasoners* (multi-step logic), and as *agents* (goal-directed behavior). Understanding where CoT works and where it breaks is essential for building systems that combine all three.

## The Open Questions

| Question | Status |
|----------|--------|
| Is CoT faithful to internal computation? | Evidence says often not |
| When should models use CoT? | Task-dependent; adaptive approaches emerging |
| Can models reason without visible steps? | Latent reasoning research is promising |
| Does CoT scale with model size? | Yes, but with diminishing returns on simple tasks |
| Will CoT survive as a technique? | Likely evolves into adaptive/latent forms |

## Papers {#papers}

| Date | Paper | Link |
|------|-------|------|
| Jan 2022 | Chain-of-Thought Prompting Elicits Reasoning in Large Language Models | [arXiv 2201.11903](https://arxiv.org/abs/2201.11903) |
| Sep 2024 | To CoT or not to CoT? CoT Helps Mainly on Math and Symbolic Reasoning | [arXiv 2409.12183](https://arxiv.org/abs/2409.12183) |
| Dec 2024 | Training LLMs to Reason in a Continuous Latent Space (COCONUT) | [arXiv 2412.06769](https://arxiv.org/abs/2412.06769) |
| Jan 2025 | s1: Simple Test-Time Scaling | [arXiv 2501.19393](https://arxiv.org/abs/2501.19393) |
| May 2025 | Reasoning Models Don't Always Say What They Think | [arXiv 2505.05410](https://arxiv.org/abs/2505.05410) |
| Jan 2026 | Outcome-Based RL Provably Leads Transformers to Reason | [arXiv 2601.15158](https://arxiv.org/abs/2601.15158) |
| Jan 2026 | Latent Chain-of-Thought as Planning | [arXiv 2601.21358](https://arxiv.org/abs/2601.21358) |
| Feb 2026 | Latent Reasoning with Supervised Thinking States | [arXiv 2602.08332](https://arxiv.org/abs/2602.08332) |
| Feb 2026 | Diagnosing Pathological Chain-of-Thought in Reasoning Models | [arXiv 2602.13904](https://arxiv.org/abs/2602.13904) |
| Mar 2026 | Reasoning Models Struggle to Control their Chains of Thought | [arXiv 2603.05706](https://arxiv.org/abs/2603.05706) |

---

*Is the reasoning real, or just a good story? Follow for more ML Frontier episodes exploring research at the edge.*
