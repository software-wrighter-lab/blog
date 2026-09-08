---
layout: post
title: "Sleepy Coder: Teaching AI Agents to Learn from Their Mistakes"
date: 2027-01-05 00:00:00 -0800
categories: [llm, machine-learning, research]
tags: [sleepy-coder, continual-learning, lora, fine-tuning, ai-agents, rust]
keywords: "sleepy coder, continual learning, LoRA, parameter-efficient fine-tuning, AI coding agents, sleep learning, Share paper, UWSH"
author: Software Wrighter
series: ""
series_part:
video_url: ""
repo_url: "https://github.com/softwarewrighter/sleepy-coder"
---

<img src="/assets/images/posts/sleeper-dreaming.png" class="post-marker" alt="">

What if your AI coding assistant could learn from its mistakes---not just for one session, but across training cycles?

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [Share: Shared LoRA Subspaces](https://arxiv.org/abs/2602.06043) |
| **Code** | [sleepy-coder](https://github.com/softwarewrighter/sleepy-coder) |
| **Video** | Coming soon |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## References

| Concept | Reference |
|---------|-----------|
| **Share** | [Shared LoRA Subspaces for almost Strict Continual Learning](https://arxiv.org/abs/2602.06043) (Kaushik et al., Johns Hopkins 2026) |
| **UWSH** | [Universal Weight Subspace Hypothesis](https://arxiv.org/abs/2512.05117) (Kaushik et al., Johns Hopkins 2025) |
| **LoRA** | [Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) (Hu et al., Microsoft 2021) |

<div style="display:none">

</div>

## The Problem

AI coding agents have a memory problem. They fix a bug today, then make the same mistake next week. Every session starts from the same frozen model. Nothing carries forward.

Current agents are stateless learners---they can use tools, follow instructions, and generate code, but they don't improve from experience. The model that struggles with borrow checker errors on Monday is equally confused by Friday.

## Sleep Learning

The idea is simple: learn while you sleep.

**Day phase**: The agent works on coding tasks. We log its failures---the error messages, the broken code, and the fixes that eventually worked.

**Sleep phase**: Overnight, we fine-tune the model on those failures using parameter-efficient methods (LoRA).

**Eval phase**: We test for improvement on new tasks and regression on old ones. Only if tests pass do we promote the new checkpoint.

Each morning, a new model wakes up a little better than before.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DAY LOOP  │     │ SLEEP LOOP  │     │  EVAL LOOP  │
│ (Rust Agent)│ --> │(Python Train)│ --> │ (Rust Eval) │
└─────────────┘     └─────────────┘     └─────────────┘
       |                   |                   |
       v                   v                   v
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│episodes.sqlite│   │  adapter/   │     │metrics.jsonl│
│  (capture)  │     │(LoRA weights)│    │  (results)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Why This Might Work

Two recent papers from Johns Hopkins University (Kaushik, Chaudhari, Vaidya, Chellappa, Yuille, 2025-2026) suggest this approach is grounded in solid theory:

### Share: Shared LoRA Subspaces

The [Share paper](https://arxiv.org/abs/2602.06043) shows that continual LoRA training can work with a single evolving shared low-rank basis. Instead of keeping separate adapters for each task, you:

1. Build a shared basis from past task adapters (via SVD)
2. Store only tiny per-task coefficients
3. Expand the basis when new tasks don't fit

This dramatically reduces storage and enables knowledge transfer between related tasks.

### UWSH: Universal Weight Subspace Hypothesis

The [UWSH paper](https://arxiv.org/abs/2512.05117) goes further: models of the same architecture naturally converge to similar low-dimensional spectral subspaces. These subspaces are stable across tasks, initializations, and even modalities.

The implication: continual learning might mostly be coefficient updates in a frozen basis, not constant retraining.

## The Architecture

Sleepy Coder uses a dual-language design:

**Rust** handles the agent runtime, episode capture, and evaluation. Rust gives us determinism and reproducibility---critical for measuring improvement.

**Python** handles training, embeddings, and visualization. The HuggingFace/PEFT ecosystem makes parameter-efficient fine-tuning straightforward.

### Task System

We use "Rust Koans"---small buggy code snippets that exercise common error patterns:

| Error Family | Example |
|-------------|---------|
| Borrow checker | Moved values, dangling borrows |
| Lifetimes | Missing annotations |
| Trait bounds | Missing implementations |
| Result handling | Unwrap/? misuse |
| Type mismatch | Iterator types, generics |

Each task has buggy code, expected error, and correct fix---enabling automated evaluation.

### Episode Capture

Every agent interaction is logged:

```rust
pub struct Episode {
    pub task_id: String,
    pub error_signature: String,  // normalized
    pub diff_unified: String,     // the fix
    pub passed: bool,
    pub steps_to_green: u32,
    // ...
}
```

Error signatures are normalized to enable clustering and repeat detection.

### Gated Promotion

Not every training run produces a better model. We gate deployment on:

- **Repeat error rate**: Does the agent make the same mistakes?
- **Steps to green**: How many attempts to solve tasks?
- **Regression check**: Does a frozen suite still pass?

Only models that improve without regressing get promoted.

## Current Status

This project is work in progress. The infrastructure is largely built, but we don't have conclusive results yet.

**Done:**
- [ ] Agent runtime (Rust)
- [ ] Episode capture (SQLite)
- [ ] Task generator (Rust Koans)
- [ ] LoRA training pipeline (Python)
- [ ] Evaluation harness (Rust)

**In Progress:**
- [ ] Running multi-day experiments
- [ ] Measuring repeat error rates
- [ ] Testing Share-style consolidation

**Open Questions:**
- How many sleep cycles before measurable improvement?
- Does the shared basis approach scale?
- What's the optimal task curriculum?

## Why This Matters

If sleep learning works, it changes how we think about AI agents:

1. **Agents could specialize** to your codebase, your error patterns, your style
2. **Mistakes become training data**, not just frustration
3. **Small models could outperform large ones** on familiar tasks
4. **Continual improvement** replaces periodic retraining

This is what "learning from experience" should mean for AI.

## What's Next

We're running experiments now. Follow for updates as we collect results.

The code is open source---contributions welcome.

---

*Sleepy Coder: Parameter-efficient continual learning for AI coding agents.*
