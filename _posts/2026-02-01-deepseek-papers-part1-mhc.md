---
layout: post
title: "Deepseek Papers (1/3): mHC - Training Stability at Any Depth"
date: 2026-02-01 00:00:00 -0800
categories: [llm, machine-learning, research]
tags: [deepseek, mhc, transformers, apple-silicon, cuda]
keywords: "training stability, deep networks, initialization, normalization, vanishing gradients"
author: Software Wrighter
abstract: "Implementing Deepseek's mHC (Manifold-Constrained Hyper-Connections) paper. Using Sinkhorn-Knopp iteration to create doubly-stochastic matrices, mHC maintains training stability at 48 layers where standard hyper-connections explode. Cross-platform validation on Apple Silicon and NVIDIA."
series: "Deepseek Papers"
series_part: 1
video_urls:
  - "https://youtube.com/shorts/fh21_zIK2ZE"
  - "https://www.youtube.com/watch?v=MYTXVYDtCEU"
  - "https://youtube.com/shorts/BOuBFn5e1gA"
video_titles:
  - "DeepSeek's mHC Fix for Gradient Explosion"
  - "Deep Networks Fixed by Deepseek mHC"
  - "Sinkhorn on Blackwell (mHC part 2)"
repo_url: "https://github.com/softwarewrighter/mHC-poc"
papers:
  - title: "mHC: Manifold-Constrained Hyper-Connections"
    url: "https://arxiv.org/abs/2512.24880"
---

<img src="{{ '/assets/images/site/post-marker-stamp.webp' | relative_url }}" class="post-marker" alt="">

Deepseek publishes papers. I implement them. This paper tackles a fundamental transformer problem: training stability in deep networks.

This post covers my implementation of **mHC** (Manifold-Constrained Hyper-Connections)---running on both Apple Silicon and NVIDIA GPUs.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [arXiv:2512.24880](https://arxiv.org/abs/2512.24880) |
| **Code** | [mHC-poc](https://github.com/softwarewrighter/mHC-poc) |
| **ELI5** | [eli5-mHC.md](https://github.com/softwarewrighter/mHC-poc/blob/main/docs/eli5-mHC.md) |
| **ELI4** | [eli4-mHC.md](https://github.com/softwarewrighter/mHC-poc/blob/main/docs/eli4-mHC.md) |
| **Video 1** | [mHC Demo](https://youtube.com/shorts/fh21_zIK2ZE)<br>[![Video](https://img.youtube.com/vi/fh21_zIK2ZE/mqdefault.jpg){: .video-thumb}](https://youtube.com/shorts/fh21_zIK2ZE) |
| **Video 2** | [mHC Explained](https://www.youtube.com/watch?v=MYTXVYDtCEU)<br>[![Video](https://img.youtube.com/vi/MYTXVYDtCEU/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=MYTXVYDtCEU) |
| **Video 3** | [mHC Results](https://youtube.com/shorts/BOuBFn5e1gA)<br>[![Video](https://img.youtube.com/vi/BOuBFn5e1gA/mqdefault.jpg){: .video-thumb}](https://youtube.com/shorts/BOuBFn5e1gA) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The Problem: Deep Networks Explode

Residual connections revolutionized deep learning. Skip connections let gradients flow through hundreds of layers. But there's a catch.

Standard residual connections:
```
output = layer(input) + input
```

This works, but the signal accumulates. With many layers, small amplifications compound into instability.

**Hyper-Connections (HC)** tried to fix this by learning connection weights:
```
output = α₁ × layer(input) + α₂ × input
```

Better expressiveness, but learned weights can still cause explosion. At 48 layers, HC becomes unstable.

## The mHC Solution: Doubly-Stochastic Constraints

mHC constrains the connection weights using **Sinkhorn-Knopp iteration**---a mathematical technique that ensures weights form a doubly-stochastic matrix.

What does "doubly-stochastic" mean?
- Each row sums to 1
- Each column sums to 1

This bounds the total signal flow. No matter how deep the network, amplification stays controlled.

```python
# Sinkhorn-Knopp iteration (simplified)
def make_doubly_stochastic(weights, iterations=5):
    for _ in range(iterations):
        weights = weights / weights.sum(dim=0)  # Column normalize
        weights = weights / weights.sum(dim=1)  # Row normalize
    return weights
```

## Results: Stability at Depth

The [mHC-poc](https://github.com/softwarewrighter/mHC-poc) repo stress-tests this with a depth sweep:

| Depth | Baseline | HC | mHC |
|-------|----------|-----|------|
| 12 layers | Stable | Stable | Stable |
| 24 layers | Struggling | Stable | Stable |
| 48 layers | Oscillating | **Explodes** | **Stable** |

At 48 layers:
- **HC** gain proxy: 10²⁷ (catastrophic amplification)
- **mHC** gain proxy: 10⁻⁰·⁶ (bounded, healthy)

HC's final loss at 48 layers: **5.54** (never learns)
mHC's final loss at 48 layers: **0.0002** (perfect convergence)

## Cross-Platform Validation

The implementation runs on both Apple Silicon (MLX) and NVIDIA (PyTorch/CUDA):

| Metric | MLX (Apple) | CUDA (NVIDIA) |
|--------|-------------|---------------|
| Gain Proxy (24L) | -0.6 | -0.602 |
| Gradient Stability | Stable | Stable |
| NaN Events | 0 | 0 |

Identical results confirm the Sinkhorn-Knopp projection works correctly on both platforms.

## Running the mHC Demo

```bash
git clone https://github.com/softwarewrighter/mHC-poc
cd mHC-poc

# Apple Silicon (MLX)
uv venv && source .venv/bin/activate
uv pip install -r mlx/requirements.txt
bash scripts/run_depth_sweep.sh

# NVIDIA (CUDA)
cd cuda
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt
bash scripts/run_cuda_depth_sweep.sh
```

Results go to `runs/` with plots showing loss, gradient norms, and gain proxy across depths.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | Python |
| **Source Files** | 29 `.py`, 3 `.sh`, 10 `.yaml` |
| **Estimated Size** | ~2.5 KLOC |
| **Frameworks** | MLX, PyTorch |
| **Platforms** | Apple Silicon, NVIDIA CUDA |
| **Key Features** | Depth sweep, cross-platform validation, visualization |

**Good for you if:** You want to understand mHC's stability benefits, compare MLX vs PyTorch implementations, or experiment with residual connection variants.

**Complexity:** Moderate. Well-documented with ELI5 explanations in `docs/`. Requires understanding of residual connections and matrix constraints.

## Key Takeaways

1. **mHC solves deep network instability.** Doubly-stochastic constraints bound signal amplification at any depth.

2. **Cross-platform matters.** The repo runs on Apple Silicon and NVIDIA, validated to produce identical results.

3. **Deepseek publishes useful research.** Their papers address real problems with practical solutions.

## What's Next

Part 2 covers **Engram**---Deepseek's approach to reducing redundant computation through conditional memory.

## Resources

- [mHC Paper (arXiv:2512.24880)](https://arxiv.org/abs/2512.24880)
- [mHC-poc Repository](https://github.com/softwarewrighter/mHC-poc)
- [mHC Video Demo](https://youtube.com/shorts/fh21_zIK2ZE)
- [mHC Explained](https://www.youtube.com/watch?v=MYTXVYDtCEU)
- [mHC Results](https://youtube.com/shorts/BOuBFn5e1gA)

---


*Implementing papers is the best way to understand them. Clone the repo and run the demo yourself.*
