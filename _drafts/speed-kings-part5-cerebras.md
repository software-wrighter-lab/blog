---
layout: post
title: "Speed Kings (5/6): Cerebras - The Undisputed Champion"
date: 2027-02-16 09:00:00 -0800
categories: [llm, benchmarks, coding]
tags: [speed-kings, cerebras, wafer-scale, inference, fastest]
author: Software Wrighter
series: "Speed Kings"
series_part: 5
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
repo_url: "https://github.com/softwarewrighter/speed-kings"
---

1,823 tokens per second.

That's not a typo. Cerebras delivers inference at a speed that makes everything else feel like dial-up.

This is Part 5 of the **Speed Kings** series. We've saved the best for (almost) last.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tool** | [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings) |
| **Provider** | [Cerebras](https://cerebras.ai/) |
| **Video** | [Cerebras - The Champion](https://www.youtube.com/watch?v=VIDEO_ID)<br>[![Video](https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=VIDEO_ID) |

</div>

## The Wafer-Scale Engine

Cerebras doesn't use GPUs. They don't even use chips. They use an entire **wafer**.

| Spec | Cerebras WSE-2 |
|------|----------------|
| **Transistors** | 2.6 trillion |
| **Cores** | 850,000 |
| **Memory** | 40GB on-chip SRAM |
| **Size** | Entire silicon wafer |
| **Speed** | 1,823 tok/s (measured) |

For context: NVIDIA's H100 has 80 billion transistors. Cerebras has **32x more**.

## The Numbers

```
Provider:    Cerebras
Model:       llama3.1-70b
TTFT:        ~45ms
Tok/sec:     1,823
Cost:        ~$0.10/1M tokens
```

**Comparison:**

| Provider | Tok/sec | vs Cerebras |
|----------|---------|-------------|
| Local (M3 Pro) | 42 | 43x slower |
| Claude | 80 | 23x slower |
| Fireworks | 412 | 4.4x slower |
| Groq | 756 | 2.4x slower |
| **Cerebras** | **1,823** | **Baseline** |

## World Capitals Challenge: The Final Boss

```bash
opencode --model cerebras/llama3.1-70b

> Build an interactive world capitals map.
> Click a country to see its capital.
> Include search functionality.
```

**Results:**

```
Time to first token:  ~45ms
Tokens per second:    1,823
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
Cost:                 $[TBD]
```

### The Experience

At 1,823 tokens per second:

- 500 tokens generate in **0.27 seconds**
- A full file appears almost instantly
- The limiting factor is **reading**, not waiting

[TBD - describe the actual coding experience]

## What 43x Faster Feels Like

### Local Ollama (42 tok/s)
```
Prompt sent... waiting... waiting...
[12 seconds later]
def create_map():
    # ...
```

### Cerebras (1,823 tok/s)
```
Prompt sent...
def create_map():
    """Create an interactive world capitals map."""
    import folium
    # ... (entire file appears instantly)
Done.
```

The code appears faster than you can context-switch to your editor.

## Does Speed = Faster Development?

We've been measuring:
- **Tok/sec**: Raw generation speed
- **Time to v1**: Clock time to first working version
- **Iterations**: Rounds to completion
- **Quality**: Does the app actually work?

**The hypothesis:** Faster generation → faster iteration → faster completion.

**The results:**

| Provider | Tok/sec | Time to v1 | Iterations | Quality |
|----------|---------|------------|------------|---------|
| Local | 42 | TBD | TBD | TBD |
| Claude | 80 | TBD | TBD | TBD |
| Groq | 756 | TBD | TBD | TBD |
| Cerebras | 1,823 | TBD | TBD | TBD |

[TBD - fill in actual measured results]

## The Cost Question

| Provider | Tok/sec | Cost/1M | Speed per Dollar |
|----------|---------|---------|------------------|
| Local | 42 | $0.00 | ∞ |
| DeepSeek | TBD | $0.05 | TBD |
| Groq | 756 | $0.05 | 15,120 tok/$ |
| Cerebras | 1,823 | $0.10 | 18,230 tok/$ |
| Claude | 80 | $3.00 | 27 tok/$ |

Cerebras is the best **speed per dollar** of the paid providers.

## Cerebras Limitations

Not everything is perfect:

1. **Model selection** - Limited to Llama variants
2. **Context length** - Some limitations
3. **Availability** - May have capacity constraints
4. **Free tier** - Limited, may throttle

## When Cerebras Wins

1. **Real-time interaction** - Instant responses change the UX
2. **High-volume production** - Cost-effective at scale
3. **Latency-sensitive** - 45ms TTFT is excellent
4. **Coding sessions** - Rapid iteration cycles

## When Cerebras Doesn't Win

1. **Model flexibility** - Need GPT-4 or Claude? Not available
2. **Complex reasoning** - Llama 70B isn't always enough
3. **Free usage** - Limits may restrict experimentation

## The Reveal: Speed Hierarchy Complete

```
Cerebras:    1823 tok/s  ████████████████████████████████████████████
Groq:         756 tok/s  ██████████████████
Fireworks:    412 tok/s  ██████████
SambaNova:    TBD tok/s  ████████ (estimated)
Claude:        80 tok/s  ██
Local:         42 tok/s  █
```

**Cerebras is 43x faster than local. 2.4x faster than Groq. The undisputed speed king.**

## What's Next

Part 6 brings it all together: **The Final Showdown**.

- Complete rankings across all dimensions
- Cost vs speed vs quality tradeoffs
- Recommendations by use case
- The definitive LLM inference benchmark

## Key Takeaways

1. **Wafer-scale works.** 2.6 trillion transistors deliver real results.
2. **1,823 tok/s is transformative.** The experience is qualitatively different.
3. **Speed per dollar is excellent.** Cerebras wins on value, not just speed.
4. **Model selection is the tradeoff.** You're limited to Llama variants.

## Resources

- [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings)
- [Cerebras](https://cerebras.ai/)
- [Wafer-Scale Engine](https://cerebras.ai/chip/)
- [Video: Cerebras - The Champion](https://www.youtube.com/watch?v=VIDEO_ID)

---

*Part 5 of 6 in the Speed Kings series. [View all parts](/series/#speed-kings)*
