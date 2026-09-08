---
layout: post
title: "Speed Kings (3/6): Groq's LPU - Purpose-Built Speed"
date: 2027-02-14 09:00:00 -0800
categories: [llm, benchmarks, coding]
tags: [speed-kings, groq, lpu, inference, cloud]
author: Software Wrighter
series: "Speed Kings"
series_part: 3
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
repo_url: "https://github.com/softwarewrighter/speed-kings"
---

Groq built custom silicon for one purpose: fast LLM inference. Their LPU (Language Processing Unit) promises 10x the speed of GPUs. Does it deliver?

This is Part 3 of the **Speed Kings** series.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tool** | [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings) |
| **Provider** | [Groq](https://groq.com/) |
| **Video** | [Groq's LPU](https://www.youtube.com/watch?v=VIDEO_ID)<br>[![Video](https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=VIDEO_ID) |

</div>

## What's an LPU?

Groq's Language Processing Unit is custom silicon designed for:

| Feature | GPU | LPU |
|---------|-----|-----|
| **Architecture** | General parallel compute | Sequential inference optimized |
| **Memory** | HBM (high bandwidth) | SRAM (deterministic) |
| **Latency** | Variable | Predictable |
| **Batching** | Required for efficiency | Single-stream fast |

The key insight: GPUs are designed for training (parallel). LPUs are designed for inference (sequential).

## The Numbers

```
Provider:    Groq
Model:       llama3-70b
TTFT:        ~89ms
Tok/sec:     ~756
Cost:        ~$0.05/1M tokens
```

Compare to our baselines:

| Provider | Tok/sec | Multiplier vs Local |
|----------|---------|---------------------|
| Local (M3 Pro) | 42 | 1x |
| Claude | 80 | 1.9x |
| Groq | 756 | **18x** |

## World Capitals Challenge

```bash
opencode --model groq/llama3-70b

> Build an interactive world capitals map.
> Click a country to see its capital.
> Include search functionality.
```

**Results:**

```
Time to first token:  ~89ms
Tokens per second:    ~756
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
Cost:                 $[TBD]
```

### The Experience

[TBD - What does 756 tok/s feel like for coding?]

**Observations:**
- Code streams in almost faster than you can read
- Iteration cycles are dramatically shorter
- [TBD - quality observations]

## Rate Limiting Reality

Groq's free tier has strict limits:

| Tier | Requests/min | Tokens/min |
|------|--------------|------------|
| Free | 30 | 6,000 |
| Developer | 30 | 30,000 |
| Production | Custom | Custom |

For real coding sessions, you'll hit limits fast. Budget for the paid tier.

## LPU vs GPU Architecture

### Why LPU is Fast

1. **Deterministic execution** - No batching overhead
2. **SRAM instead of HBM** - Lower latency memory
3. **Single-stream optimization** - One request = full chip
4. **Synchronous dataflow** - Predictable timing

### The Tradeoff

LPU excels at single-user inference but doesn't batch efficiently. For serving millions of users, GPUs might still win on cost-per-token. For interactive coding? LPU is perfect.

## Comparison: Coding Task Performance

| Metric | Local (42 tok/s) | Groq (756 tok/s) |
|--------|------------------|------------------|
| Generate 500 tokens | ~12 seconds | ~0.7 seconds |
| Time to first response | ~15ms | ~89ms |
| Cost for 10K tokens | $0.00 | ~$0.0005 |
| Rate limited? | Never | Possibly |

## Quality Assessment

Speed means nothing if the code is wrong. Let's compare:

| Provider | Tok/sec | Quality Score | Working on v1? |
|----------|---------|---------------|----------------|
| Local | 42 | TBD | TBD |
| Claude | 80 | TBD | TBD |
| Groq | 756 | TBD | TBD |

**Key question:** Does Llama3-70B via Groq match Claude's code quality?

## The Speed Experience

At 756 tokens/second:
- A 500-token response takes <1 second
- You can iterate 10x faster than local
- The bottleneck becomes *thinking*, not *waiting*

This changes the workflow. Instead of:
1. Write prompt → Wait 30s → Read code → Iterate

It becomes:
1. Write prompt → Instantly get code → Try it → Iterate → Iterate → Iterate

**More iterations = better results**, even if each individual response is slightly lower quality.

## When Groq Wins

1. **Rapid prototyping** - Fast iteration cycles
2. **Interactive sessions** - Real-time code generation
3. **Latency-sensitive** - TTFT matters less than throughput
4. **Cost-conscious** - $0.05/1M is cheap

## When Groq Loses

1. **Free tier limits** - Rate limiting kills momentum
2. **Model selection** - Limited to Llama/Mixtral variants
3. **Complex reasoning** - Claude/GPT-4 may still be smarter
4. **Long contexts** - Some limits on context length

## What's Next

Part 4 explores SambaNova and Fireworks---two more cloud providers with different approaches. SambaNova uses RDUs (Reconfigurable Dataflow Units). Fireworks offers serverless inference with model flexibility.

But we're saving the fastest for Part 5: Cerebras. At 1823 tok/s, it's 2.4x faster than Groq.

## Key Takeaways

1. **LPU is real.** 756 tok/s is transformative for interactive coding.
2. **Rate limits matter.** Free tier won't cut it for real work.
3. **Speed changes workflow.** More iterations compensate for any quality gap.
4. **18x faster than local.** The gap is enormous.

## Resources

- [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings)
- [Groq](https://groq.com/)
- [LPU Architecture](https://groq.com/technology/)
- [Video: Groq's LPU](https://www.youtube.com/watch?v=VIDEO_ID)

---

*Part 3 of 6 in the Speed Kings series. [View all parts](/series/#speed-kings)*
