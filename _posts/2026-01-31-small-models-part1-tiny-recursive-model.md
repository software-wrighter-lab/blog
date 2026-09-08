---
layout: post
title: "Small Models (1/6): 976 Parameters Beat Billions"
date: 2026-01-31 00:00:00 -0800
categories: [llm, machine-learning, research]
tags: [trm, tiny-recursive-model, maze-solving, recursive-reasoning]
keywords: "maze solving, 976 parameters, recursive depth, efficiency, Shakespeare training"
author: Software Wrighter
abstract: "The best LLMs score zero on hard mazes. A model with 976 parameters scores 85%. The Tiny Recursive Model uses think-act cycles with deep supervision, proving iteration beats scale for tasks requiring backtracking and spatial reasoning."
series: "Small Models, Big Brains"
series_part: 1
video_url: "https://www.youtube.com/shorts/O6U06cGkKc4"
video_title: "976 parameters is more than billions?!"
repo_url: "https://github.com/softwarewrighter/train-trm"
papers:
  - title: "Tiny Recursive Model"
    url: "https://arxiv.org/abs/2510.04871"
---

<img src="{{ '/assets/images/site/post-marker-coffee-pot.webp' | relative_url }}?ts=1769815140000" class="post-marker" alt="">

The best large language models score zero on hard mazes. A model with under 1,000 parameters scores 85 percent.

This is Part 1 of the **Small Models, Big Brains** series, exploring how tiny models with clever architectures outperform massive ones on specific tasks.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [Tiny Recursive Model](https://arxiv.org/abs/2510.04871) |
| **Code** | [train-trm](https://github.com/softwarewrighter/train-trm) |
| **Video** | [976 parameters is more than billions?!](https://www.youtube.com/shorts/O6U06cGkKc4)<br>[![Video](https://img.youtube.com/vi/O6U06cGkKc4/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/O6U06cGkKc4) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## Why LLMs Fail at Mazes

Large language models generate one token at a time. They cannot backtrack. One wrong move and the entire solution fails.

Maze solving requires:
- Exploring dead ends
- Backtracking when stuck
- Maintaining spatial awareness
- Planning multiple steps ahead

Autoregressive generation is fundamentally incompatible with these requirements.

## Meet TRM: The Tiny Recursive Model

The Tiny Recursive Model uses under 1,000 parameters. Instead of being bigger, it thinks in loops.

```
Input → Think → Act → Think → Act → ... → Output
```

A simple two-layer network that iterates until the solution emerges.

### The Architecture

TRM alternates between two phases:

| Phase | Purpose |
|-------|---------|
| **Think** | Update internal latent state by processing input, current answer, and previous state |
| **Act** | Update the answer based on the refined latent state |

This process repeats for multiple cycles, progressively improving the output.

```rust
TRMConfig {
    input_dim: 5,
    output_dim: 5,
    hidden_dim: 16,
    latent_dim: 16,
    l_layers: 2,      // Network depth
    h_cycles: 3,      // Outer think-act cycles
    l_cycles: 4,      // Inner think cycles
}
```

## The Secret: Deep Supervision

The key insight isn't just recursion---it's supervising every step, not just the final answer.

Traditional training:
```
Input → [black box] → Final Output → Loss
```

TRM training:
```
Input → Step 1 → Loss₁
      → Step 2 → Loss₂
      → Step 3 → Loss₃
      → ...
      → Final  → Loss_n
```

Every iteration gets feedback. The model learns to make progress at each step.

## Results

| Model | Maze Accuracy |
|-------|---------------|
| GPT-4 | ~0% on hard mazes |
| Claude | ~0% on hard mazes |
| **TRM (976 params)** | **85%** |

Iteration beats scale.

## Running the Code

The [train-trm](https://github.com/softwarewrighter/train-trm) repo provides a complete Rust implementation:

```bash
# Clone and build
git clone https://github.com/softwarewrighter/train-trm
cd train-trm
./scripts/build.sh --release

# Train a model
./scripts/train.sh --epochs 1000 --lr 0.01

# Evaluate
./scripts/eval.sh

# Or launch the web UI
cargo install --locked trunk
./scripts/web-serve.sh
```

The web UI includes interactive maze visualization with solution paths and real-time training charts.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | Rust |
| **Source Files** | 21 `.rs` files |
| **Estimated Size** | ~2.5 KLOC |
| **Also Includes** | HTML (web UI), Shell scripts |
| **Build System** | Cargo + Trunk (WASM) |
| **Dependencies** | ndarray, serde, clap, wasm-bindgen |

**Good for you if:** You want to learn Rust ML from scratch, experiment with recursive architectures, or need a web-based training visualization.

**Complexity:** Moderate. Clean Rust code with good documentation. The neural network is implemented from scratch (no PyTorch/TensorFlow), making it educational but requiring Rust familiarity.

## Key Takeaways

1. **Parameter count isn't everything.** Architecture and training strategy matter more for certain tasks.

2. **Recursion enables backtracking.** By iterating, TRM can explore and refine solutions.

3. **Deep supervision accelerates learning.** Feedback at every step, not just the end.

4. **Task-specific models excel.** TRM isn't a general-purpose LLM---it's optimized for maze-like reasoning.

## What's Next

Part 2 explores **MobileLLM** and running AI completely offline on your Android phone.

## Resources

- [TRM Paper](https://arxiv.org/abs/2510.04871)
- [train-trm Repository](https://github.com/softwarewrighter/train-trm)
- [Video: 976 parameters is more than billions?!](https://www.youtube.com/shorts/O6U06cGkKc4)

---

