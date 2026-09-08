---
layout: post
title: "Neural-Net-RS: An Educational Neural Network Platform"
date: 2026-02-14 18:00:00 -0800
categories: [rust, machine-learning, projects, vibe-coding]
tags: [rust, neural-networks, backpropagation, wasm, cli-tools, vibe-coding, personal-software, claude-code, education]
keywords: "neural network, Rust, backpropagation, XOR problem, WebAssembly, WASM, machine learning education, vibe coding, personal software, Claude Code"
author: Software Wrighter
abstract: "Personal Software for education: a neural network platform where every step is visible---no framework magic. CLI with progress bars, web UI with real-time loss charts, WASM for browser execution. Built via Vibe Coding to watch XOR training reveal why hidden layers matter."
repo_url: "https://github.com/sw-ml-study/neural-net-rs"
video_url: "https://www.youtube.com/watch?v=UNrzf4Wgbv4"
video_title: "Watch a Neural Network Learn"
papers:
  - title: "Understanding the Difficulty of Training Deep Feedforward Neural Networks"
    url: "https://proceedings.mlr.press/v9/glorot10a.html"
series: "Machine Learning"
series_part: 4
---

<img src="{{ '/assets/images/posts/block-graph.webp' | relative_url }}" class="post-marker" alt="">

I wanted a neural network implementation where every step is visible---no framework magic hiding the math. Something I could use to teach the fundamentals, with a CLI for quick experiments and a web UI for visual demonstrations. Claude Code built it.

This is **Personal Software** for education: a complete neural network training platform with multiple interfaces, all from a single Rust codebase.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [neural-net-rs](https://github.com/sw-ml-study/neural-net-rs) |
| **Video** | [Neural-Net-RS Explainer](https://www.youtube.com/watch?v=UNrzf4Wgbv4)<br>[![Video](https://img.youtube.com/vi/UNrzf4Wgbv4/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=UNrzf4Wgbv4) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why Build Your Own Neural Network?

Frameworks like PyTorch and TensorFlow are production-ready, but they hide the fundamentals. When teaching or learning, you want to see:

- How weights and biases actually change during training
- Why XOR needs a hidden layer when AND doesn't
- What backpropagation really computes

Neural-Net-RS exposes all of this. No autograd magic---every gradient is computed explicitly. No tensor abstractions---just matrices with clear row-major storage.

## What Got Built

A modular Rust workspace with multiple interfaces to the same core:

```
neural-net-rs/
├── matrix/              # Linear algebra foundation
├── neural-network/      # Core ML implementation
├── neural-net-cli/      # Command-line interface
├── neural-net-server/   # REST API with SSE streaming
└── neural-net-wasm/     # WebAssembly for browser
```

**One codebase, three ways to interact:**
- **CLI**: Train from terminal with progress bars
- **Web UI**: Visual training with real-time loss charts
- **WASM**: Run entirely in browser, no server needed

## The Classic Problems

The platform includes 8 built-in examples that teach ML concepts progressively:

| Problem | Architecture | Key Concept |
|---------|--------------|-------------|
| AND, OR | 2→2→1 | Linear separability |
| **XOR** | 2→3→1 | Why hidden layers matter |
| Parity3 | 3→6→1 | Scaling non-linearity |
| Quadrant | 2→8→4 | Multi-class classification |
| Adder2 | 4→8→3 | Learning arithmetic |
| Iris | 4→8→3 | Real-world dataset |
| Pattern3x3 | 9→6→4 | Visual pattern recognition |

### The XOR Problem

XOR is the canonical neural network problem. AND and OR are linearly separable---a single line can divide the outputs. XOR isn't. You *need* a hidden layer.

```
AND: (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1  ← One line separates
XOR: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0  ← No line works
```

Watch XOR training and you see why neural networks are powerful: they learn to create intermediate representations that make non-linear problems separable.

## Implementation Details

### Feed-Forward with Backpropagation

```rust
pub struct Network {
    pub layers: Vec<usize>,      // [input, hidden..., output]
    pub weights: Vec<Matrix>,    // Learned connections
    pub biases: Vec<Matrix>,     // Per-neuron offsets
    pub learning_rate: f64,      // Training step size
}
```

**Forward pass**: Each layer computes `activation(weights × input + bias)`

**Backward pass**: Gradients flow backward using the chain rule, updating weights to reduce error.

The sigmoid activation function maps any input to (0, 1):

```
σ(x) = 1 / (1 + e^(-x))
```

### Custom Matrix Library

Educational clarity over maximum performance:

```rust
pub struct Matrix {
    rows: usize,
    cols: usize,
    data: Vec<f64>,  // Row-major storage
}
```

Operations: dot product, transpose, element-wise multiply, map. Everything visible, nothing hidden.

### Checkpoint System

Training can be interrupted and resumed:

```bash
# Train for 5000 epochs, save checkpoint
neural-net-cli train xor --epochs 5000 --checkpoint model.json

# Resume from checkpoint
neural-net-cli train xor --epochs 10000 --resume model.json
```

Checkpoints include version metadata to prevent loading incompatible models.

## CLI Usage

```bash
# List available examples
neural-net-cli examples

# Train XOR with progress bar
neural-net-cli train xor --epochs 10000 --learning-rate 0.5

# Predict with trained model
neural-net-cli predict model.json --input "0,1"

# Run web UI
neural-net-cli serve --port 8080
```

The CLI uses `indicatif` for real-time progress bars:
```
Training XOR [=========>   ] 7500/10000 (75%) Loss: 0.0023
```

## Web Interface

The server embeds all assets at compile time---one binary serves everything:

- **Training panel**: Select problem, set hyperparameters, watch loss decrease
- **Network visualization**: See layer structure and connection strengths
- **Prediction panel**: Test the trained model interactively
- **Loss chart**: Real-time plotting via Server-Sent Events

Two training modes:
- **Local (WASM)**: Runs entirely in browser
- **Remote (API)**: Server-side with streaming progress

## Technology Choices

| Component | Purpose |
|-----------|---------|
| **Rust** | Performance, safety, single-binary distribution |
| **Axum** | Lightweight async web framework |
| **wasm-bindgen** | Rust → WebAssembly compilation |
| **Indicatif** | Terminal progress bars |
| **Serde** | JSON serialization for checkpoints |

The WASM module is ~248KB after optimization.

## Test Coverage

136+ tests across the workspace:
- Matrix operations (unit tests)
- Network training (integration tests)
- CLI commands (integration tests)
- Server endpoints (integration tests)
- WASM bindings (unit tests)

Zero clippy warnings. Reproducible results via seeded RNG.

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **Backpropagation** | [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0) (Rumelhart et al. 1986) |
| **Multi-Layer Perceptron** | [Multilayer perceptron](https://en.wikipedia.org/wiki/Multilayer_perceptron) (Wikipedia) |
| **XOR Problem** | [Perceptrons](https://mitpress.mit.edu/9780262534772/perceptrons/) (Minsky & Papert 1969) |
| **Weight Initialization** | [Understanding the Difficulty of Training Deep Feedforward Neural Networks](https://proceedings.mlr.press/v9/glorot10a.html) (Glorot & Bengio 2010) |
| **Inspired by** | [codemoonsxyz/neural-net-rs](https://github.com/codemoonsxyz/neural-net-rs) |


</div>

## The Vibe Coding Process

This project grew through iterative conversation with Claude Code:

1. "Build a basic neural network in Rust with backpropagation"
2. "Add a CLI with progress bars"
3. "Add a web UI with real-time training visualization"
4. "Compile to WASM so it runs in the browser"
5. "Add checkpoint save/resume"
6. "Include classic ML examples with educational documentation"

Each request built on the previous. The AI handled architecture decisions, chose appropriate crates, and maintained test coverage throughout.

---

*When you want to understand how neural networks actually work, sometimes you need to see every weight update. That's what this platform provides---education through transparency.*

