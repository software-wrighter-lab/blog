---
layout: post
title: "DyTopo: Dynamic Topology for Multi-Agent AI"
date: 2026-02-12 06:00:00 -0800
categories: [rust, multi-agent, research]
tags: [rust, multi-agent, topology, routing, llm]
keywords: "dynamic topology, multi-agent systems, sparse graphs, semantic routing, DyTopo, Rust"
author: Software Wrighter
abstract: "When multiple AI agents work together, fixed communication patterns fail at scale. DyTopo rebuilds the graph each round based on semantic similarity between what agents need and what they can offer, preventing context explosion while enabling adaptive collaboration."
video_url: "https://www.youtube.com/shorts/_8_08H97LxM"
video_title: "Smarter Agent Communication"
repo_url: "https://github.com/softwarewrighter/dytopo-rs"
papers:
  - title: "DyTopo: Dynamic Topology Routing for Multi-Agent Reasoning"
    url: "https://arxiv.org/abs/2505.16128"
series: "Machine Learning"
series_part: 2
---

<img src="{{ '/assets/images/posts/block-team.webp' | relative_url }}" class="post-marker" alt="">

When multiple AI agents work together, how should they communicate? Fixed patterns fail at scale. DyTopo rebuilds the communication graph each round based on what agents need and what they can offer.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [DyTopo](https://www.youtube.com/shorts/_8_08H97LxM)<br>[![Video](https://img.youtube.com/vi/_8_08H97LxM/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/_8_08H97LxM) |
| **Paper** | [arXiv:2505.16128](https://arxiv.org/abs/2505.16128) |
| **Code** | [dytopo-rs](https://github.com/softwarewrighter/dytopo-rs) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem: Fixed Topologies Don't Scale

Multi-agent systems need communication patterns. The obvious approaches have problems:

| Topology | Problem |
|----------|---------|
| **All-to-all** | Context explosion---every agent reads every message |
| **Chain** | Bottlenecks---one slow agent blocks everyone |
| **Star** | Single point of failure at the hub |

As agent count grows, fixed topologies either explode in messages or create chokepoints.

## The DyTopo Solution: Dynamic Routing

DyTopo (Dynamic Topology) solves this by reconstructing the communication graph each round. The key insight: **agents know what they need and what they can offer**.

Each round, every agent emits:
- **Query**: What information do I need?
- **Key**: What can I contribute?

The router computes semantic similarity between all keys and queries, then builds a **sparse directed graph**:

```
score(sender → receiver) = cosine(sender.key, receiver.query)
```

High-scoring pairs connect. Low-scoring pairs are ignored. The result: efficient, adaptive communication.

## How It Works

```
Round N:
  1. Manager broadcasts goal
  2. Each agent produces:
     - Query (what I need)
     - Key (what I offer)
     - Draft (my current contribution)
  3. Router embeds keys and queries
  4. Similarity matrix → sparse graph (top-K per receiver)
  5. Messages flow along edges
  6. Trace written to JSONL
```

The topology adapts every round. An agent working on parsing might connect to the syntax expert in round 1, then the error-handling expert in round 2.

## The Implementation: Rust, Zero Python

dytopo-rs is a **fully Rust implementation** with no Python dependencies:

| Crate | Purpose |
|-------|---------|
| `dytopo-core` | Shared types (AgentId, Topology, TraceEvent) |
| `dytopo-embed` | Text embedding (hash-based baseline, semantic planned) |
| `dytopo-router` | Sparse graph construction |
| `dytopo-agents` | Agent implementations |
| `dytopo-orchestrator` | Main execution loop |
| `dytopo-viz` | DOT export for visualization |
| `dytopo-cli` | Command-line interface |

### Why Rust?

1. **Zero-cost abstractions** for performance-critical embedding/routing
2. **Strong type system** catches protocol mismatches at compile time
3. **No Python dependency** for baseline demos
4. **Fearless concurrency** for future parallelization

## Running the Demo

```bash
cargo run -p dytopo-cli -- demo --rounds 3 --agents 5 --topk 2
```

This produces:
- Per-round topology printed to stdout
- `./traces/trace_*.jsonl` for machine-readable analysis
- DOT files for graph visualization

## Current Status

**Milestone 0 is complete**---the system runs end-to-end with stub agents and hash-based embeddings.

| Feature | Status |
|---------|--------|
| Core types and traits | Done |
| Hash embedder (deterministic) | Done |
| Top-K sparse routing | Done |
| Stub agents with templates | Done |
| Orchestrator loop | Done |
| JSONL tracing | Done |
| DOT visualization | Done |

### Planned

- Semantic embeddings (fastembed/candle)
- LLM-backed agents (Ollama integration)
- Inbox summarization for long conversations
- Evaluation harness comparing topologies

## Key Design Decisions

### Why Hash Embeddings First?

The baseline uses deterministic hash-based embeddings:
- **Reproducible** demos for debugging
- **No external dependencies** to download
- Validates the full pipeline before adding ML complexity

Semantic embeddings are planned as drop-in replacements.

### Why Sparse Graphs?

Each agent receives at most `topk` messages per round:
- **Prevents context explosion** as agent count grows
- **Makes communication interpretable**---you can trace why agents connected
- **Matches the paper's approach**

### Why JSONL Traces?

Every event is logged to JSONL:
- **Append-only** for streaming
- **Line-based** for grep/filtering
- **Machine-parseable** for analysis tools
- **Human-readable** for debugging

## Topology Comparison

The system supports multiple topology strategies for comparison:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `dynamic` | DyTopo routing | Adaptive, sparse |
| `fully_connected` | All-to-all | Baseline comparison |
| `chain` | Sequential | Pipeline tasks |
| `star` | Hub-and-spoke | Centralized coordination |

## What's Next

1. **LLM Agent Support** (Milestone 2)---Replace stubs with real reasoning
2. **Semantic Embeddings** (Milestone 1)---Meaningful routing decisions
3. **Evaluation Harness** (Milestone 4)---Quantify DyTopo advantages

## Resources

- [DyTopo Paper (arXiv:2505.16128)](https://arxiv.org/abs/2505.16128) - Li et al., 2025
- [dytopo-rs Repository](https://github.com/softwarewrighter/dytopo-rs)

---

*Dynamic topology lets agents find the right collaborators each round. No context explosion. No bottlenecks. Just efficient, adaptive communication.*

