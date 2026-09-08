---
layout: post
title: "Saw #3: agentrail-rs --- From Walking Skeleton to Dual Memory"
date: 2026-03-22 15:15:00 -0800
categories: [rust, cli-tools, ai-agents]
tags: [sharpen-the-saw, rust, cli, icrl, ai-agents, vibe-coding, agentrail, lisp, c-compiler]
keywords: "agentrail, ICRL, in-context reinforcement learning, dual memory, skills, experiences, XSkill, saga, workflow, Rust CLI, AI agents, inference-time learning, knowledge distillation"
author: Software Wrighter
abstract: "agentrail-rs went from walking skeleton to ICRL core loop, dual memory, distillation, and a hybrid orchestrator---all in one weekend. Next up: domain-specific Layer 2 repos, tested against three new projects that require C, Rust, Lisp, and Web UI skills."
series: "Sharpen the Saw Sundays"
series_part: 3
repo_url: "https://github.com/sw-vibe-coding/agentrail-rs"
papers:
  - title: "OmniRL: In-Context Reinforcement Learning Across Multiple Tasks"
    url: "https://arxiv.org/abs/2502.02869"
  - title: "Knowledge Graphs are Implicit Reward Models"
    url: "https://arxiv.org/abs/2601.15160"
  - title: "XSkill: Continual Learning from Experience and Skills in Multimodal Agents"
    url: "https://arxiv.org/abs/2603.12056"
  - title: "An Alternative Trajectory for Generative AI"
    url: "https://arxiv.org/abs/2603.14147"
---

<img src="{{ '/assets/images/posts/block-circular-saw.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Third Sharpen the Saw update. [Last time](/2026/03/15/saw-reg-rs-avoid-compaction-agentrail/) I mentioned agentrail-rs was evolving from `avoid-compaction`, a saga-based context checkpoint tool. This weekend it went from walking skeleton to a working ICRL pipeline with dual memory, distillation, domain executors, and a hybrid orchestrator loop.

I also vibe-coded a C compiler, several Wiki implementations for a future TBT post, and kept sharpening the saw by incremental development on agentrail-rs---applying ideas from papers on ICL, ICRL, and XSkill. The plan for this week: develop the domain-specific Layer 2 parts for agentrail-rs, using three new projects as test cases---running the new C compiler inside a browser, developing a Macro Lisp in C, and running that Macro Lisp inside a browser. This requires agentrail to carry development skills for C, Rust, Lisp, and Web UI.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Prior Post** | [Saw #2: reg-rs, avoid-compaction, and agentrail](/2026/03/15/saw-reg-rs-avoid-compaction-agentrail/) |
| **Related** | [ML Frontier #02: ICRL](/2026/03/16/mlf-02-icrl-in-context-reinforcement-learning/) |
| **Related** | [AI Tools #1: XSkill](/2026/03/17/ai-tools-xskill-memory-layer-multimodal-agents/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem agentrail Solves

AI coding agents lose operational knowledge between sessions. An agent might figure out the right sequence of commands for a complex task---TTS generation, video compositing, file manipulation---then lose that knowledge when the session ends. Next time, it starts from scratch. Sometimes it succeeds. Sometimes it improvises and fails.

agentrail-rs gives agents structured handoffs, deterministic step execution, and in-context reinforcement learning so they succeed on first attempts instead of guessing.

## What's Working: Beyond the Walking Skeleton

Phase 0 through Phase 5 (partial) are implemented. The CLI has 8 commands that manage the full saga lifecycle:

```bash
agentrail init my-project      # Create a new saga
agentrail plan                  # Show the step sequence
agentrail next                  # Get instructions for the next step
agentrail begin step-name       # Mark a step as in-progress
agentrail complete step-name    # Mark a step as done
agentrail status                # Show saga state
agentrail history               # Show completed steps
agentrail abort                 # Cancel the saga
```

Everything persists to a `.agentrail/` directory: TOML configs, JSON trajectories, JSONL session snapshots. The 24 integration tests all pass, and pre-commit quality gates enforce formatting, lints, and test coverage.

## Two-Layer Architecture

The architecture separates the generic engine from domain-specific knowledge:

**Layer 1 (this repo)** --- task-agnostic inference-time learning:
- Workflow state machine (sagas with typed steps)
- Dual memory following the XSkill pattern: *skills* (strategic workflow documents) and *experiences* (tactical per-run records)
- ICRL injection: retrieve successful experiences and inject them into agent prompts
- Distillation: analyze experience batches, generate and update skill documents

**Layer 2 (separate repos, future)** --- domain-specific knowledge:
- Per-domain repos (e.g., `agentrail-domain-media`, `agentrail-domain-rust`)
- Skill documents, curated experience libraries, executor implementations, validators
- Optional knowledge graphs for reward signals

The separation means the engine never changes when you add a new domain. You just create a new Layer 2 repo with the right skill files and executors.

## The XSkill Connection

The dual-memory pattern comes directly from the [XSkill paper](/2026/03/17/ai-tools-xskill-memory-layer-multimodal-agents/) (arXiv 2603.12056). Their ablation analysis shows that removing either skills or experiences hurts performance---you need both.

In agentrail-rs:

| Memory Type | What It Stores | How It's Used |
|-------------|----------------|---------------|
| **Skills** | Structured workflow documents for a class of tasks | Injected into `agentrail next` to give the agent a strategic playbook |
| **Experiences** | Tactical records from past runs (what worked, what failed) | Injected into `agentrail next` to show the agent what succeeded before |

When you run `agentrail next`, it retrieves relevant skills and past trajectories and includes them in the output. The agent sees both *how to approach this kind of task* (skill) and *what actually worked last time* (experience).

## Research Foundations

The architecture maps to specific research:

| Research | How It's Applied |
|----------|-----------------|
| **ICRL** (Decision Transformer, Reflexion, Voyager) | Agents learn from trajectory examples in context, not weight updates |
| **XSkill** (dual memory) | Skills + experiences, both necessary |
| **Knowledge Graphs as Reward Models** | Graph edges as verifiable reward signals (Phase 4) |
| **Sleepy Coder experiment** | LoRA fine-tuning couldn't beat baseline, validating inference-time approach |

The Sleepy Coder result was pivotal. I'd spent weeks trying to fine-tune a small model for my specific agent tasks. The fine-tuned model performed *worse* than the base model with good prompts. That's what pushed me toward ICRL: don't change the model's weights, change what it sees in context.

## Implementation Progress

| Phase | Description | Status |
|-------|-------------|--------|
| **0** | Walking skeleton (CLI, persistence, tests) | Done |
| **1** | ICRL core loop (task types, trajectory retrieval, experience recording) | Done |
| **2** | Dual memory (Skill/Experience types, injection, `distill` command) | Done (2a, 2d) |
| **3** | Domain repo support (registry, executors, validators) | Done (partial) |
| **4** | Knowledge graph validation (graph-based rewards) | Planned |
| **5** | Hybrid orchestrator (auto-advance deterministic steps, escalate semantic work) | Done (partial) |

Phase 1 added `task_type` to step configs, trajectory retrieval in `agentrail next`, and experience recording with `--reward`/`--actions` flags on `complete`. Phase 2a introduced the `Skill` type with TOML storage and injection into `next` output. Phase 2d added the `distill` command that analyzes experience batches to generate skill documents. Phase 3 brought the domain registry, executor trait, and validator trait. Phase 5 implemented the hybrid orchestrator loop where deterministic steps auto-advance and semantic work gets escalated to the agent.

What remains: Phase 2b/2c (enriched Experience type, experience retrieval by embedding), Phase 3 completion (first real domain repo), and Phase 4 (knowledge graph rewards).

<div class="resource-box" markdown="1">

### Vibe Coding Projects

agentrail-rs is being developed by building extensions to these vibe coding projects---each one is a real test case for domain-specific skills and experiences.

| Project | Link |
|---------|------|
| **cor24-rs** | [sw-embed/cor24-rs](https://github.com/sw-embed/cor24-rs) --- COR24 assembly emulator (Rust, WASM, embedded) |
| **tc24r** | [sw-vibe-coding/tc24r](https://github.com/sw-vibe-coding/tc24r) --- C compiler for COR24 (C, compiler design, browser) |
| **wiki-rs** | [sw-vibe-coding/wiki-rs](https://github.com/sw-vibe-coding/wiki-rs) --- Wiki implementations (Rust, web UI) |

</div>

## What's Next: Domain-Specific Layer 2

The engine (Layer 1) is functional. The next challenge is building real Layer 2 domain repos and proving the architecture works on actual projects. This week I'm testing it against three new projects:

1. **A C compiler running in a browser** --- requires WebAssembly compilation skills
2. **A Macro Lisp implemented in C** --- requires C development and language implementation skills
3. **The Macro Lisp running inside a browser** --- combines all of the above with Web UI skills

This is a deliberate stress test. Each project demands different domain expertise: C, Rust, Lisp, and Web UI. If agentrail-rs can carry skills and experiences across these domains and help the agent succeed on first attempts, the architecture works. If not, I'll learn where it breaks.

## Crate Layout

The project is a Cargo workspace (edition 2024) with clean separation:

| Crate | Role |
|-------|------|
| `agentrail-core` | Domain types: SagaConfig, StepConfig, Skill, Trajectory, HandoffPacket, JobSpec |
| `agentrail-store` | File-based persistence (`.agentrail/`), skill and trajectory storage |
| `agentrail-cli` | Binary with 8 commands + `distill` |
| `agentrail-exec` | Deterministic step executors with domain registry |
| `agentrail-validate` | Output validators with domain registry |

## Papers {#papers}

| Date | Paper | Link |
|------|-------|------|
| Feb 2025 | OmniRL: In-Context RL Across Multiple Tasks | [arXiv 2502.02869](https://arxiv.org/abs/2502.02869) |
| Jan 2026 | Knowledge Graphs are Implicit Reward Models | [arXiv 2601.15160](https://arxiv.org/abs/2601.15160) |
| Mar 2026 | XSkill: Continual Learning from Experience and Skills | [arXiv 2603.12056](https://arxiv.org/abs/2603.12056) |
| Mar 2026 | An Alternative Trajectory for Generative AI | [arXiv 2603.14147](https://arxiv.org/abs/2603.14147) |

---

*Better tools, better agents. Follow for more Sharpen the Saw updates.*
