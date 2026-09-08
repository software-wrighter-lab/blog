---
layout: post
title: "Small Models (5/6): Max AI Per Watt"
date: 2026-02-04 09:00:00 -0800
categories: [llm, benchmarks, efficiency]
tags: [tinyllama, llama, pythia, stablelm, fine-tuning, speculative-decoding]
keywords: "TinyLlama, Llama-3.2-1B, StableLM, Pythia, one billion parameters, Low-Rank Adaptation, LoRA, speculative decoding, efficient LLM"
author: Software Wrighter
abstract: "One billion parameters: the sweet spot for AI. Big enough to reason, small enough to run anywhere. Comparing TinyLlama, Llama-3.2-1B, StableLM, and Pythia with LoRA fine-tuning in minutes and speculative decoding for 2-3x speedups."
series: "Small Models, Big Brains"
series_part: 5
video_url: "https://www.youtube.com/shorts/B4uKx-DL1HY"
video_title: "Max AI Per Watt"
repo_url: "https://github.com/softwarewrighter/billion-llm"
papers:
  - title: "LoRA"
    url: "https://arxiv.org/abs/2106.09685"
  - title: "Speculative Decoding Paper"
    url: "https://arxiv.org/abs/2211.17192"
---

<img src="{{ '/assets/images/posts/brain-puzzle.webp' | relative_url }}" class="post-marker" alt="">

One billion parameters. The sweet spot for AI.

Big enough to reason. Small enough to run anywhere. Maximum capability per watt.

This is Part 5 of the **Small Models, Big Brains** series, comparing four models at the 1B parameter point.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [billion-llm](https://github.com/softwarewrighter/billion-llm) |
| **TinyLlama** | [jzhang38/TinyLlama](https://github.com/jzhang38/TinyLlama) |
| **Llama 3.2** | [ai.meta.com/llama](https://ai.meta.com/llama/) |
| **Pythia** | [EleutherAI/pythia](https://github.com/EleutherAI/pythia) |
| **Video** | [Max AI Per Watt](https://www.youtube.com/shorts/B4uKx-DL1HY)<br>[![Video](https://img.youtube.com/vi/B4uKx-DL1HY/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/B4uKx-DL1HY) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## Why One Billion?

| Range | Reality |
|-------|---------|
| Below 1B | Models struggle with complex reasoning |
| Above 1B | Hardware requirements increase significantly |
| **At 1B** | **Maximum capability per watt** |

1B parameters is where you get:
- Real language understanding
- Ability to follow instructions
- Fine-tuning in minutes on a laptop
- Deployment anywhere (phone, Raspberry Pi, browser)

## The Contenders

| Model | Params | Key Strength | Training Data |
|-------|--------|--------------|---------------|
| **TinyLlama** | 1.1B | Overtrained on 3T tokens | Community |
| **Llama-3.2-1B** | 1B | Official Meta ecosystem | Meta |
| **StableLM-1.6B** | 1.6B | Multilingual, 2T tokens | Stability AI |
| **Pythia-1B** | 1.08B | 154 research checkpoints | EleutherAI |

## TinyLlama: The Overtraining Champion

TinyLlama breaks the rules. The Chinchilla scaling laws suggest training tokens should scale with parameters. TinyLlama uses **100x more data** than optimal.

```
Chinchilla-optimal for 1B: ~30B tokens
TinyLlama actual:          3T tokens (3,000B)
```

The result? A tiny model that punches well above its weight.

## Benchmarks

From the [billion-llm](https://github.com/softwarewrighter/billion-llm) repository:

| Model | MMLU | HumanEval | Speed | Memory |
|-------|------|-----------|-------|--------|
| TinyLlama | 25.3% | 12.2% | Fast | 2.2GB |
| Llama-3.2-1B | 32.1% | 18.5% | Fast | 2.4GB |
| StableLM-1.6B | 30.8% | 15.1% | Medium | 3.2GB |
| Pythia-1B | 26.4% | 10.3% | Fast | 2.2GB |

Llama-3.2-1B leads on quality. TinyLlama offers the best value when you factor in the open training recipe.

## LoRA Fine-Tuning in Minutes

All these models can be fine-tuned on a laptop using [LoRA](https://arxiv.org/abs/2106.09685):

```bash
cd billion-llm
python finetune_demo.py --model tinyllama --epochs 3
```

LoRA adds small trainable adapters without modifying base weights:

```
Base Model (frozen): 1.1B parameters
LoRA Adapters:       ~4M parameters (0.4%)
Training time:       5-10 minutes on M1 Mac
```

## Speculative Decoding: 2-3x Speedup

Use a fast 1B model to draft tokens, verify with a slower 7B model:

```
Draft (1B):   "The quick brown fox" → [jumps, over, the, lazy]
Verify (7B):  Accept [jumps, over, the] → Reject [lazy] → Generate [sleepy]
```

The 1B model generates candidates quickly. The 7B model only needs to verify, not generate from scratch.

```bash
python speculative_demo.py
```

Results: **2-3x speedup** on autoregressive generation.

## Hardware Requirements

| Setup | What You Can Run |
|-------|------------------|
| CPU only | All models (slower, INT4 quantized) |
| 4GB VRAM | All models (INT4 quantized) |
| 8GB VRAM | All models (FP16) |
| Apple Silicon | All models (MPS acceleration) |

## Quick Start

```bash
git clone https://github.com/softwarewrighter/billion-llm
cd billion-llm

# Setup
uv venv && source .venv/bin/activate
uv pip install -r requirements.txt

# Download models
python download_models.py

# Run benchmarks
python benchmark.py

# Interactive comparison
python demo_chat.py --compare tinyllama llama3.2-1b
```

## Which Model Should You Choose?

```
├── Need Meta ecosystem compatibility? → Llama-3.2-1B
├── Need multilingual support?         → StableLM-1.6B
├── Need research reproducibility?     → Pythia-1B (154 checkpoints)
├── Need maximum performance/size?     → TinyLlama
└── Just getting started?              → Any of them work!
```

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | Python |
| **Source Files** | 8 `.py` files |
| **Estimated Size** | ~1.4 KLOC |
| **Framework** | Transformers, PyTorch |
| **Build System** | uv / pip |
| **Key Features** | Benchmarking, LoRA fine-tuning, speculative decoding |

**Good for you if:** You want to benchmark small LLMs, learn LoRA fine-tuning, experiment with speculative decoding, or compare models head-to-head.

**Complexity:** Low. Clean Python scripts with HuggingFace Transformers. Each script is standalone—run benchmarks, chat demos, or fine-tuning independently. Well-documented with shell scripts for common tasks.

## Key Takeaways

1. **1B is the efficiency sweet spot.** Below this, capability drops. Above, hardware costs rise.

2. **Overtraining works.** TinyLlama proves you can compensate for size with data.

3. **LoRA makes fine-tuning accessible.** Customize models on consumer hardware.

4. **Speculative decoding is free speed.** Use small models to accelerate large ones.

5. **All roads lead to open weights.** Every model here is fully open.

## What's Next

Part 6 explores the **2-3B efficient frontier**---Phi-2, Gemma, and SmolLM pushing the limits of small model capability.

## Resources

- [billion-llm Repository](https://github.com/softwarewrighter/billion-llm)
- [TinyLlama](https://github.com/jzhang38/TinyLlama)
- [Llama 3.2](https://ai.meta.com/llama/)
- [Pythia](https://github.com/EleutherAI/pythia)
- [LoRA Paper](https://arxiv.org/abs/2106.09685)
- [Speculative Decoding Paper](https://arxiv.org/abs/2211.17192)
- [Video: Max AI Per Watt](https://youtube.com/shorts/VIDEO_ID)

---

