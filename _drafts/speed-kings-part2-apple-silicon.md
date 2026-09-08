---
layout: post
title: "Speed Kings (2/6): Apple Silicon Unleashed"
date: 2027-02-13 09:00:00 -0800
categories: [llm, benchmarks, coding]
tags: [speed-kings, apple-silicon, mlx, ollama, m3-pro, local-inference]
author: Software Wrighter
series: "Speed Kings"
series_part: 2
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
repo_url: "https://github.com/softwarewrighter/speed-kings"
---

Your MacBook has a secret weapon: unified memory. Can Apple Silicon compete with cloud inference for real coding tasks?

This is Part 2 of the **Speed Kings** series, exploring local inference on Apple Silicon.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tool** | [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings) |
| **Challenge** | World Capitals Interactive Map |
| **Video** | [Apple Silicon Unleashed](https://www.youtube.com/watch?v=VIDEO_ID)<br>[![Video](https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=VIDEO_ID) |

</div>

## The Hardware

**Test Machine:** MacBook Pro M3 Pro
- 12-core CPU (6 performance, 6 efficiency)
- 18-core GPU
- 36GB unified memory
- macOS Sonoma

**Why Apple Silicon Matters:**
- Unified memory = larger models fit
- Metal Performance Shaders = GPU acceleration
- MLX = Apple's ML framework optimized for the hardware

## The Contenders

| Runtime | Framework | Model | Memory |
|---------|-----------|-------|--------|
| Ollama | llama.cpp | DeepSeek-Coder 6.7B | ~9GB |
| Ollama | llama.cpp | Qwen2.5-Coder 7B | ~9GB |
| MLX | mlx-lm | DeepSeek-Coder 6.7B | ~9GB |
| MLX | mlx-lm | Qwen2.5-Coder 7B | ~9GB |

## Ollama vs MLX: The Framework Battle

Both run locally on Apple Silicon. But they're built differently:

| Aspect | Ollama (llama.cpp) | MLX |
|--------|-------------------|-----|
| **Backend** | C++ with Metal | Python with Metal |
| **Optimization** | Cross-platform | Apple-specific |
| **Quantization** | GGUF (various) | Native 4-bit |
| **Ease of Use** | `ollama run model` | Python API |
| **Throughput** | Good | Potentially better |

Let's see if Apple's framework beats the cross-platform solution.

## Test 1: Ollama + DeepSeek-Coder

```bash
ollama run deepseek-coder:6.7b
```

**World Capitals Challenge:**

```
Time to first token:  ~15ms
Tokens per second:    ~42
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
```

### Observations

[TBD - actual run results]

## Test 2: MLX + DeepSeek-Coder

```python
from mlx_lm import load, generate

model, tokenizer = load("deepseek-ai/deepseek-coder-6.7b-instruct")
```

**World Capitals Challenge:**

```
Time to first token:  ~XXms
Tokens per second:    ~XX
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
```

### Observations

[TBD - does MLX beat Ollama?]

## Test 3: Qwen2.5-Coder Comparison

Same tests with Qwen2.5-Coder 7B---a newer model with strong coding benchmarks.

| Runtime | Model | Tok/sec | Quality |
|---------|-------|---------|---------|
| Ollama | Qwen2.5-Coder 7B | TBD | TBD |
| MLX | Qwen2.5-Coder 7B | TBD | TBD |

## The Unified Memory Advantage

With 36GB unified memory, we can run larger models:

| Model Size | Fits in 36GB? | Tokens/sec (est) |
|------------|---------------|------------------|
| 7B (4-bit) | Yes (~9GB) | ~40-50 |
| 13B (4-bit) | Yes (~15GB) | ~25-35 |
| 34B (4-bit) | Yes (~25GB) | ~15-20 |
| 70B (4-bit) | Tight (~45GB) | Swap city |

**The tradeoff:** Bigger models = better quality, slower generation.

## Apple Silicon Results Summary

| Config | Tok/sec | Time to v1 | Quality | Winner? |
|--------|---------|------------|---------|---------|
| Ollama + DS-Coder 6.7B | TBD | TBD | TBD | |
| MLX + DS-Coder 6.7B | TBD | TBD | TBD | |
| Ollama + Qwen2.5 7B | TBD | TBD | TBD | |
| MLX + Qwen2.5 7B | TBD | TBD | TBD | |

## Comparison with Cloud Baselines

| Provider | Tok/sec | Cost | Latency |
|----------|---------|------|---------|
| Local (M3 Pro) | ~42 | $0.00 | ~15ms TTFT |
| Claude | ~80 | $X.XX | ~200ms TTFT |
| DeepSeek API | TBD | $0.05/1M | ~150ms |

**Key insight:** Local is slower but has near-zero latency. For iterative coding, that adds up.

## When Local Wins

Local inference shines when:

1. **Privacy matters** - Code never leaves your machine
2. **Iteration speed** - No API round-trips
3. **Offline work** - Airplane mode compatible
4. **Cost sensitivity** - $0.00 per query

## When Cloud Wins

Cloud inference wins when:

1. **Raw speed** - 1800 tok/s (Cerebras) vs 42 tok/s (local)
2. **Model quality** - Claude/GPT-4 still lead on complex reasoning
3. **Context length** - Cloud models handle longer contexts
4. **No hardware investment** - Works on any machine

## The Real Question

For our world capitals app challenge:

**Does 43x faster generation mean 43x faster development?**

Spoiler: No. But it might mean 2-3x faster. We'll quantify this as we test more providers.

## What's Next

Part 3 explores Groq's LPU (Language Processing Unit)---custom hardware designed specifically for LLM inference. How does purpose-built silicon compare to general-purpose Apple chips?

## Key Takeaways

1. **MLX vs Ollama:** [TBD - which wins on Apple Silicon?]
2. **Unified memory is powerful.** 36GB lets you run serious models locally.
3. **Latency vs throughput.** Local has better latency, cloud has better throughput.
4. **Free is compelling.** $0.00/query changes the calculus.

## Resources

- [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings)
- [MLX](https://github.com/ml-explore/mlx)
- [Ollama](https://ollama.ai/)
- [Video: Apple Silicon Unleashed](https://www.youtube.com/watch?v=VIDEO_ID)

---

*Part 2 of 6 in the Speed Kings series. [View all parts](/series/#speed-kings)*
