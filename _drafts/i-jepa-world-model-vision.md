---
layout: post
title: "I-JEPA: Yann LeCun's Vision for World Models"
date: 2027-01-04 09:00:00 -0800
categories: [llm, machine-learning, research]
tags: [i-jepa, jepa, meta, yann-lecun, self-supervised-learning, vision-transformer, world-models]
keywords: "I-JEPA, Joint Embedding Predictive Architecture, Yann LeCun, world models, self-supervised learning, Vision Transformer, abstract representations"
author: Software Wrighter
video_url: ""
repo_url: "https://github.com/facebookresearch/ijepa"
---

<img src="/assets/images/posts/hummingbird-flower.png" class="post-marker" alt="">

Predict representations, not pixels. That's the key insight.

**I-JEPA** (Image-based Joint-Embedding Predictive Architecture) is Yann LeCun's first step toward human-like AI---machines that build internal models of how the world works.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [Self-Supervised Learning from Images (arXiv)](https://arxiv.org/abs/2301.08243) |
| **Code** | [facebookresearch/ijepa](https://github.com/facebookresearch/ijepa) |
| **Blog** | [Meta AI Blog](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) |
| **Video** | Coming soon |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Vision: World Models

Yann LeCun's goal: machines that develop internal models of how the world operates. This enables:

- Faster learning with less data
- Complex task planning
- Adaptation to unfamiliar situations

Current AI learns patterns. World models learn *understanding*.

## The Problem with Current Approaches

### Generative Models (MAE, BERT)

```
Input: [Image with mask]
Output: Reconstructed pixels
```

Problem: Predicting every pixel wastes capacity on unpredictable details. Extra fingers on hands. Wrong textures. Noise.

### Invariance-Based Models (CLIP, SimCLR)

```
Input: [Multiple augmented views]
Output: Same representation for all views
```

Problem: Hand-crafted augmentations bake in biases. The model learns the augmentations, not the world.

## I-JEPA: Predict Representations

```
Input: [Context blocks from image]
Output: Representations of masked target blocks
```

I-JEPA predicts in **abstract representation space**, not pixel space. It learns what matters, ignoring what doesn't.

## Architecture

```
┌─────────────────────────────────────┐
│         Target Encoder              │  Full image → target representations
│         (ViT, EMA updated)          │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│           Predictor                 │  Context + mask → predicted targets
└─────────────────────────────────────┘
                 ↑
┌─────────────────────────────────────┐
│        Context Encoder              │  Visible patches → context
│         (ViT, trained)              │
└─────────────────────────────────────┘
```

| Component | Role |
|-----------|------|
| **Context Encoder** | ViT processing visible image patches |
| **Target Encoder** | ViT processing full image (EMA updated) |
| **Predictor** | Forecasts target representations from context |

### Multi-Block Masking

The key innovation: predict **large semantic blocks** using spatially distributed context.

This forces the model to capture high-level information---object structure, scene layout, semantic content---not pixel details.

## Results

| Metric | I-JEPA |
|--------|--------|
| **Training** | 632M params, 16 A100s, <72 hours |
| **Efficiency** | 2-10x fewer GPU-hours than alternatives |
| **Low-shot** | SOTA with 12 labeled examples/class |
| **Linear probe** | Outperforms pixel reconstruction |
| **Depth/counting** | Superior on low-level vision |

### Comparison

| Approach | Predicts | Problem |
|----------|----------|---------|
| MAE | Pixels | Wastes capacity on noise |
| SimCLR | Invariances | Limited by augmentations |
| **I-JEPA** | **Representations** | Learns semantics |

## Pretrained Models

| Architecture | Resolution | Dataset | Epochs |
|--------------|------------|---------|--------|
| ViT-H/14 | 224×224 | ImageNet-1K | 300 |
| ViT-H/16 | 448×448 | ImageNet-1K | 300 |
| ViT-H/14 | 224×224 | ImageNet-22K | 66 |
| ViT-g/16 | 224×224 | ImageNet-22K | 44 |

## Running I-JEPA

```bash
git clone https://github.com/facebookresearch/ijepa
cd ijepa

# Install dependencies
pip install torch torchvision pyyaml numpy opencv-python

# Single-GPU training
python main.py \
  --fname configs/in1k_vith14_ep300.yaml \
  --devices cuda:0 cuda:1

# Multi-GPU (SLURM)
python main_distributed.py \
  --fname configs/in1k_vith14_ep300.yaml \
  --nodes 2 --tasks-per-node 8
```

## The JEPA Family

I-JEPA spawned a family of architectures:

| Model | Modality | Innovation |
|-------|----------|------------|
| **I-JEPA** | Images | Original architecture |
| **V-JEPA** | Video | Temporal prediction |
| **VL-JEPA** | Vision-Language | Text embedding prediction |

### V-JEPA (Video)

Trained on 2M public videos. No pretrained encoders, no text supervision. Strong motion and appearance understanding.

### VL-JEPA (Vision-Language)

Predicts continuous text embeddings instead of tokens. 50% fewer parameters than standard VLMs. Outperforms CLIP, SigLIP2 on video tasks.

## Why This Matters

1. **World models > pattern matching.** Understanding beats memorization.

2. **Representations > pixels.** Abstract prediction is more efficient.

3. **No augmentation bias.** Learn from data, not hand-crafted transforms.

4. **Efficiency wins.** 10x less compute for better results.

## Key Takeaways

1. **Predict representations, not pixels.** Abstract space captures semantics, ignores noise.

2. **Multi-block masking forces understanding.** Large semantic predictions require real comprehension.

3. **World models are the future.** LeCun's vision points toward truly intelligent systems.

4. **The JEPA family is growing.** Images → Video → Vision-Language → ???

## Resources

- [I-JEPA Paper (arXiv:2301.08243)](https://arxiv.org/abs/2301.08243)
- [GitHub Repository](https://github.com/facebookresearch/ijepa)
- [Meta AI Blog Post](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/)
- [V-JEPA Announcement](https://www.marktechpost.com/2025/02/22/meta-ai-releases-the-video-joint-embedding-predictive-architecture-v-jepa-model/)
- [VL-JEPA Paper](https://arxiv.org/abs/2512.10942)

---

*Predict the representation, not the pixels. That's how you build a world model.*
