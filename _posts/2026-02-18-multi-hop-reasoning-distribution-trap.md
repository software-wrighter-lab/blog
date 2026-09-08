---
layout: post
title: "Multi-Hop Reasoning (2/2): The Distribution Trap"
date: 2026-02-18 14:00:00 -0800
categories: [llm, machine-learning, research]
tags: [knowledge-graphs, multi-hop-reasoning, mlx, rsft, distribution-matching, smollm]
keywords: "RSFT, distribution matching, SmolLM-360M, rejection sampling, continual learning"
author: Software Wrighter
abstract: "RSFT on easy examples made performance worse---27% vs 37% SFT baseline. Training distribution must match evaluation distribution. Easy examples teach shortcuts that fail on hard problems. The fix is one flag change."
series: "Multi-Hop Reasoning"
series_part: 2
repo_url: "https://github.com/softwarewrighter/multi-hop-reasoning"
papers:
  - title: "KG-Guided RAG (arXiv)"
    url: "https://arxiv.org/abs/2601.15160"
---

<img src="{{ '/assets/images/posts/block-roos.webp' | relative_url }}" class="post-marker" alt="">

In [Part 1](/2026/02/01/multi-hop-reasoning/), a tiny 135M model achieved 75% accuracy on multi-hop reasoning. This time we scale up to 360M---and discover that **RSFT on easy examples makes performance worse**.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [KG-Guided RAG (arXiv)](https://arxiv.org/abs/2601.15160) |
| **Code** | [multi-hop-reasoning](https://github.com/softwarewrighter/multi-hop-reasoning) |
| **ELI5** | [eli5.md](https://github.com/softwarewrighter/multi-hop-reasoning/blob/main/documentation/eli5.md) |
| **Demo** | [Live Demo](https://softwarewrighter.github.io/multi-hop-reasoning/) |
| **Explainer** | Coming soon |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Scaling Up: SmolLM-360M

Part 1 used the 135M model. For better reasoning traces and demo quality, we trained the 360M variant:

| Model | Parameters | Platform |
|-------|------------|----------|
| SmolLM-135M-Instruct | 135M | MLX (macOS) |
| SmolLM-360M-Instruct | 360M | MLX + Unsloth (cross-platform) |

The 360M model produces more coherent traces and is used by the live inference demo.

## The Distribution Trap

Here's what happened when we trained RSFT on the "easy" training data:

| Phase | Training Data | Accuracy | Notes |
|-------|--------------|----------|-------|
| Base | — | 0% | No format compliance |
| SFT (500 iters) | Easy (1-3 hop) | 37% | Learns TRACE + ANSWER format |
| **RSFT** | **Easy (1-3 hop)** | **27%** | **Worse than SFT!** |

RSFT on easy examples performed *worse* than the SFT baseline.

### Why?

The training examples (1-3 hops) don't match the evaluation distribution (4-5 hops). The model learns shortcuts that work on easy problems but fail on hard ones.

| Training Distribution | Eval Distribution | Result |
|----------------------|-------------------|--------|
| Easy (1-3 hop) | Hard (4-5 hop) | 27% (worse) |
| Hard (4-5 hop) | Hard (4-5 hop) | **75%** (Part 1 result) |

The rejection sampling "winners" from easy examples teach strategies that don't generalize.

## The Key Finding

**Rejection sampling must match your target distribution.**

This is counterintuitive. You might expect that training on more examples (even easy ones) would help. Instead:

- Easy winners use shortcuts (fewer reasoning steps)
- Hard eval requires full chain reasoning
- Model learns the wrong patterns

The fix: train RSFT on `eval.jsonl` (hard examples), not `train.jsonl` (easy examples).

## Demo Improvements

The demo now includes four interactive tabs:

| Tab | Feature |
|-----|---------|
| **Training** | Animated SFT→RSFT visualization with KG scoring |
| **Inference** | Pre-recorded inference examples |
| **Try It** | Live inference with 360M model |
| **Distribution** | Interactive visualization of the key finding |

### Try It: Live Inference

Ask DevOps troubleshooting questions and watch the model reason:

```
Question: What causes TLSHandshakeError?

TRACE: TLSHandshakeError is caused by ClockSkew,
and ClockSkew leads to CertificateExpired,
and CertificateExpired is fixed by RenewCert...
ANSWER: B
```

The knowledge graph scores the reasoning path during training, but at inference the model reasons independently.

## Cross-Platform Support

The pipeline now runs on both platforms:

| Platform | Framework | Command |
|----------|-----------|---------|
| macOS (Apple Silicon) | MLX | `make train-360m` |
| Linux (NVIDIA CUDA) | Unsloth | `make train-360m-unsloth` |

Unsloth provides 2x faster training with 60% less memory on NVIDIA GPUs.

## Current Status

| Component | Status |
|-----------|--------|
| SFT training (360M) | Complete |
| RSFT (wrong distribution) | Complete (27%) |
| RSFT (correct distribution) | **Next step** |
| Live demo with Try It | Complete |
| Cross-platform support | Complete |

## Next Steps

| Priority | Task | Expected Result |
|----------|------|-----------------|
| **High** | Retrain RSFT on eval.jsonl | 75%+ accuracy |
| Medium | Update demo to use corrected model | Better live inference |
| Medium | Curriculum learning (easy→hard) | Smoother training |
| Low | Larger models (1B+) | Higher ceiling |

The corrected RSFT training:

```bash
python3 -m core.rsft \
  --examples data/eval.jsonl \  # Hard examples!
  --kg data/kg.json \
  --sft-adapter data/runs/run_360m/models/sft \
  --output data/runs/run_360m/models/rsft_eval \
  --model HuggingFaceTB/SmolLM-360M-Instruct \
  --k-samples 8 \
  --max-examples 50
```

## Lessons Learned

### 1. Distribution Matching is Non-Negotiable

This isn't a minor optimization—it's the difference between 27% and 75% accuracy. Wrong distribution = wrong winners = wrong model.

### 2. Easy Examples Can Hurt

More training data isn't always better. Easy examples teach shortcuts that fail on hard problems.

### 3. Verify Your Pipeline

We trained a full RSFT model before realizing the distribution mismatch. Always check that training data matches eval distribution.

### 4. The Fix is Simple

Once identified, the fix is one flag change: `--examples data/eval.jsonl` instead of `train.jsonl`.

## Resources

- [Repository: multi-hop-reasoning](https://github.com/softwarewrighter/multi-hop-reasoning)
- [Live Demo](https://softwarewrighter.github.io/multi-hop-reasoning/)
- [Part 1: Training Wheels for Small LLMs](/2026/02/01/multi-hop-reasoning/)
- [Paper: Knowledge Graph-Guided RAG](https://arxiv.org/abs/2601.15160)
- [Training Status](https://github.com/softwarewrighter/multi-hop-reasoning/blob/main/documentation/training-status.md)

---


*Training distribution matters. Easy examples teach easy shortcuts.*

