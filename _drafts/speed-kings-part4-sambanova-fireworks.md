---
layout: post
title: "Speed Kings (4/6): SambaNova & Fireworks - The Challengers"
date: 2027-02-15 09:00:00 -0800
categories: [llm, benchmarks, coding]
tags: [speed-kings, sambanova, fireworks, rdu, serverless, inference]
author: Software Wrighter
series: "Speed Kings"
series_part: 4
video_url: "https://www.youtube.com/watch?v=VIDEO_ID"
repo_url: "https://github.com/softwarewrighter/speed-kings"
---

Two more contenders enter the ring. SambaNova's RDU (Reconfigurable Dataflow Unit) promises enterprise-grade inference. Fireworks offers serverless flexibility. How do they stack up?

This is Part 4 of the **Speed Kings** series.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tool** | [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings) |
| **Providers** | [SambaNova](https://sambanova.ai/), [Fireworks](https://fireworks.ai/) |
| **Video** | [The Challengers](https://www.youtube.com/watch?v=VIDEO_ID)<br>[![Video](https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=VIDEO_ID) |

</div>

## The Contenders

| Provider | Hardware | Focus | Pricing Model |
|----------|----------|-------|---------------|
| **SambaNova** | RDU (Reconfigurable Dataflow Unit) | Enterprise, high throughput | Enterprise contracts |
| **Fireworks** | Optimized GPU clusters | Serverless, flexibility | Pay-as-you-go |

## SambaNova: Enterprise Muscle

### What's an RDU?

SambaNova's Reconfigurable Dataflow Unit is custom silicon that:

- Reconfigures for different model architectures
- Optimizes memory access patterns
- Scales to massive batch sizes
- Targets enterprise deployments

```
Provider:    SambaNova
Model:       llama3-70b
TTFT:        ~XXXms
Tok/sec:     ~XXX
Cost:        Enterprise pricing
```

### World Capitals Challenge

```bash
opencode --model sambanova/llama3-70b

> Build an interactive world capitals map.
> Click a country to see its capital.
> Include search functionality.
```

**Results:**

```
Time to first token:  [TBD]
Tokens per second:    [TBD]
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
```

### Observations

[TBD - SambaNova experience]

### Enterprise Focus

SambaNova targets:
- High-volume production workloads
- Compliance-sensitive industries
- Custom model deployments
- SLA-backed performance

For individual developers, access may be limited. For enterprises, it's a serious contender.

---

## Fireworks: Serverless Flexibility

### The Serverless Model

Fireworks offers:
- No infrastructure to manage
- Pay only for what you use
- Model cold starts (but they're fast)
- Wide model selection

```
Provider:    Fireworks
Model:       llama-v3p1-70b-instruct
TTFT:        ~120ms
Tok/sec:     ~412
Cost:        ~$0.20/1M tokens
```

### World Capitals Challenge

```bash
opencode --model fireworks/llama-v3p1-70b-instruct

> Build an interactive world capitals map.
> Click a country to see its capital.
> Include search functionality.
```

**Results:**

```
Time to first token:  ~120ms
Tokens per second:    ~412
Time to v1:           [TBD]
Iterations:           [TBD]
Quality:              [TBD]/10
Cost:                 $[TBD]
```

### Observations

[TBD - Fireworks experience]

### Model Flexibility

Fireworks' strength is model variety:

| Category | Available Models |
|----------|------------------|
| Chat | Llama 3.1, Mixtral, Qwen |
| Code | CodeLlama, DeepSeek-Coder |
| Embedding | Various |
| Custom | Bring your own |

---

## Head-to-Head Comparison

| Metric | SambaNova | Fireworks |
|--------|-----------|-----------|
| Tok/sec | TBD | ~412 |
| TTFT | TBD | ~120ms |
| Cost/1M | Enterprise | ~$0.20 |
| Model variety | Limited | Wide |
| Access | Enterprise | Open |

### For Our Coding Task

| Provider | Time to v1 | Iterations | Quality | Cost |
|----------|------------|------------|---------|------|
| SambaNova | TBD | TBD | TBD | TBD |
| Fireworks | TBD | TBD | TBD | TBD |

---

## Comparison with Previous Contenders

| Provider | Tok/sec | Cost/1M | Best For |
|----------|---------|---------|----------|
| Local (M3 Pro) | 42 | $0.00 | Privacy, offline |
| Claude | 80 | ~$3.00 | Quality |
| DeepSeek | TBD | $0.05 | Budget |
| Groq | 756 | $0.05 | Speed |
| SambaNova | TBD | Enterprise | Scale |
| Fireworks | 412 | $0.20 | Flexibility |

---

## When SambaNova Wins

1. **Enterprise scale** - Millions of requests/day
2. **Custom deployments** - Private model hosting
3. **SLA requirements** - Guaranteed performance
4. **Compliance** - Regulated industries

## When Fireworks Wins

1. **Flexibility** - Wide model selection
2. **Serverless** - No infrastructure
3. **Experimentation** - Try different models easily
4. **Cost predictability** - Pay-as-you-go

## The Speed Hierarchy (So Far)

```
Groq:        756 tok/s  ████████████████████
Fireworks:   412 tok/s  ███████████
Claude:       80 tok/s  ██
Local:        42 tok/s  █
```

But we haven't seen the fastest yet...

## What's Next

Part 5 reveals the speed king: **Cerebras**. At 1823 tokens per second, it's 2.4x faster than Groq and **43x faster than local**.

We've established the field. Now it's time for the main event.

## Key Takeaways

1. **SambaNova is enterprise-focused.** Great for production, harder to access for individuals.
2. **Fireworks offers flexibility.** Wide model selection, serverless simplicity.
3. **Neither is the fastest.** But both have their place in the ecosystem.
4. **The speed king is coming.** Cerebras awaits in Part 5.

## Resources

- [Speed Kings CLI](https://github.com/softwarewrighter/speed-kings)
- [SambaNova](https://sambanova.ai/)
- [Fireworks AI](https://fireworks.ai/)
- [Video: The Challengers](https://www.youtube.com/watch?v=VIDEO_ID)

---

*Part 4 of 6 in the Speed Kings series. [View all parts](/series/#speed-kings)*
