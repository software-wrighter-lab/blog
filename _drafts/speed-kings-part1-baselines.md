---
layout: post
title: "Speed Kings (1/6): Establishing the Baselines"
date: 2027-02-12 09:00:00 -0800
categories: [llm, benchmarks, coding]
tags: [speed-kings, opencode, ollama, claude, deepseek, glm4, vibe-coding]
author: Software Wrighter
series: "Speed Kings"
series_part: 1
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
repo_url: "https://github.com/softwarewrighter/speed-kings"
---

How fast can an LLM build a real app? Not toy benchmarks---a working interactive world capitals map.

Same challenge. Same tool (OpenCode). Different providers. Let's establish our baselines.

This is Part 1 of the **Speed Kings** series, where we benchmark LLM inference across hardware and providers using a real coding task.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tool** | [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings) |
| **Challenge** | World Capitals Interactive Map |
| **Video** | [Establishing Baselines](https://www.youtube.com/watch?v=VIDEO_ID)<br>[![Video](https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=VIDEO_ID) |

</div>

## The Challenge: World Capitals Map

A consistent coding task for every provider:

**Requirements:**
- Interactive world map
- Click a country → see its capital
- Search by country or capital name
- Clean, responsive UI

**Why this task?**
- Complex enough to require real reasoning
- Visual output (easy to verify)
- Multiple implementation paths (tests creativity)
- ~500-1000 lines of code (meaningful but bounded)

## The Tool: OpenCode

We're using [OpenCode](https://github.com/opencode-ai/opencode) to interact with each LLM. Same prompts, same workflow, different backends.

```bash
# Switch providers by changing the model
opencode --model ollama/deepseek-coder:6.7b
opencode --model claude-3-5-sonnet
opencode --model deepseek-chat
opencode --model glm-4
```

## What We're Measuring

| Metric | What It Tells Us |
|--------|------------------|
| **Time to First Working Version** | How fast can it ship? |
| **Total Iterations** | How many back-and-forths to get it right? |
| **Tokens Generated** | Raw output volume |
| **Tokens/Second** | Inference speed |
| **Cost** | What did this run cost? |
| **Quality Score** | Does the app actually work? (1-10) |

## Baseline 1: Local Ollama

**Model:** DeepSeek-Coder 6.7B (~9GB)
**Hardware:** M3 Pro, 36GB RAM

```
Provider:    Local (Ollama)
Model:       deepseek-coder:6.7b
TTFT:        ~15ms
Tok/sec:     ~42
Cost:        $0.00
```

### The Run

```bash
opencode --model ollama/deepseek-coder:6.7b

> Build an interactive world capitals map.
> Click a country to see its capital.
> Include search functionality.
```

**Result:** [TBD - actual timing and quality]

### Observations

- **Strengths:** Zero cost, low latency, private
- **Weaknesses:** Slower generation, smaller context
- **Surprise:** [TBD]

## Baseline 2: Claude

**Model:** Claude 3.5 Sonnet
**Provider:** Anthropic API

```
Provider:    Anthropic
Model:       claude-3-5-sonnet
TTFT:        ~200ms
Tok/sec:     ~80
Cost:        ~$0.XX per run
```

### The Run

Same prompt, same expectations.

**Result:** [TBD]

### Observations

- **Strengths:** Strong reasoning, good code quality
- **Weaknesses:** API latency, cost
- **Surprise:** [TBD]

## Baseline 3: DeepSeek

**Model:** DeepSeek Chat
**Provider:** DeepSeek API

```
Provider:    DeepSeek
Model:       deepseek-chat
TTFT:        ~150ms
Tok/sec:     ~XXX
Cost:        ~$0.05/1M tokens (very cheap)
```

### The Run

**Result:** [TBD]

### Observations

- **Strengths:** Cost-effective, good coding ability
- **Weaknesses:** [TBD]
- **Surprise:** [TBD]

## Baseline 4: Z.ai GLM-4

**Model:** GLM-4
**Provider:** Zhipu AI

```
Provider:    Z.ai (Zhipu)
Model:       glm-4
TTFT:        ~XXXms
Tok/sec:     ~XXX
Cost:        ~$0.XX per run
```

### The Run

**Result:** [TBD]

### Observations

- **Strengths:** [TBD]
- **Weaknesses:** [TBD]
- **Surprise:** [TBD]

## Baseline Summary

| Provider | Model | Tok/sec | Time to v1 | Iterations | Cost | Quality |
|----------|-------|---------|------------|------------|------|---------|
| Local | DeepSeek-Coder 6.7B | ~42 | TBD | TBD | $0.00 | TBD |
| Claude | 3.5 Sonnet | ~80 | TBD | TBD | $X.XX | TBD |
| DeepSeek | deepseek-chat | TBD | TBD | TBD | $X.XX | TBD |
| Z.ai | GLM-4 | TBD | TBD | TBD | $X.XX | TBD |

## The Baseline Question

Before we explore faster hardware, we need to understand:

1. **Is local "good enough"?** 42 tok/s is slow, but it's free.
2. **Does quality correlate with speed?** Faster generation ≠ better code.
3. **Where's the cost/quality sweet spot?** DeepSeek is cheap. Is it good?

## What's Next

Part 2 takes the challenge to Apple Silicon with MLX. Can local inference compete with cloud when you optimize for the hardware?

But first---a hint of what's coming:

```
Cerebras:    1823 tok/sec
Local:       42 tok/sec
Difference:  43x faster
```

Can that speed difference translate to faster app development? We'll find out.

## Key Takeaways

1. **Same task, different providers.** Apples-to-apples comparison.
2. **Real coding, not benchmarks.** The world capitals app is our north star.
3. **Speed isn't everything.** Quality and cost matter too.
4. **Baselines set the stage.** Now we know what "normal" looks like.

## Resources

- [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings)
- [OpenCode](https://github.com/opencode-ai/opencode)
- [Video: Establishing Baselines](https://www.youtube.com/watch?v=VIDEO_ID)

---

*Part 1 of 6 in the Speed Kings series. [View all parts](/series/#speed-kings)*
