---
layout: post
title: "How AI Learns Part 5: Context Engineering & Recursive Reasoning"
date: 2026-02-28 00:15:00 -0800
categories: [machine-learning, ai-agents]
tags: [llm, context, rlm, recursive-language-models, in-context-learning, attention, tool-use]
keywords: "in-context learning, ICL, RLM, recursive language models, context engineering, attention, tool use, context management"
author: Software Wrighter
abstract: "Large context windows are not a complete solution. As context grows, attention dilutes and instructions drift. Recursive Language Models treat context as a dynamic environment, rebuilding focus each step instead of dragging everything forward."
series: "How AI Learns"
series_part: 5
papers:
  - title: "Recursive Language Models"
    url: "https://arxiv.org/abs/2412.04619"
  - title: "What Can Transformers Learn In-Context?"
    url: "https://arxiv.org/abs/2208.01066"
  - title: "Test-Time Training for Language Models"
    url: "https://arxiv.org/abs/2410.13136"
  - title: "Chain-of-Thought Prompting"
    url: "https://arxiv.org/abs/2201.11903"
---

<img src="{{ '/assets/images/posts/block-comet.webp' | relative_url }}" class="post-marker" alt="">

Large context windows are not a complete solution.

As context grows:
- Attention dilutes
- Errors compound
- Reasoning quality degrades

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Related** | [RLM](/2026/02/13/rlm-recursive-language-models/) \| [ICL Revisited](/2026/02/22/icl-revisited-from-mystery-to-engineering/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Context Problem

Transformers have finite attention. With limited attention heads and capacity, the model cannot attend equally to everything. As tokens accumulate:

- Earlier instructions lose influence
- Patterns average toward generic responses
- Multi-step reasoning fails

This is **context rot**---not forgetting weights, but losing signal in noise.

## In-Context Learning (ICL)

The model adapts temporarily via examples in the prompt.

| Aspect | ICL |
|--------|-----|
| **Updates weights?** | No |
| **Persists across sessions?** | No |
| **Speed** | Instant |
| **Mechanism** | Activations, not gradients |

ICL is powerful but ephemeral. It's working memory, not learning.

**Limitation:** As context grows, ICL examples compete with other content for attention.

## Recursive Language Models (RLM)

<figure>
<img src="{{ '/assets/images/posts/rlm-context-loop.svg' | relative_url }}" alt="Circular flow diagram showing LLM connected to Tools, Memory, Context, and Evaluation in a recursive loop" style="max-width: 550px; margin: 0 auto; display: block;">
<figcaption style="text-align: center; font-style: italic; margin-top: 0.5em;">Rebuild context each step instead of dragging it forward.</figcaption>
</figure>

RLMs decompose reasoning into multiple passes. Instead of dragging entire context forward:

1. **Query** relevant memory
2. **Retrieve** what's needed now
3. **Execute** tools
4. **Evaluate** results
5. **Reconstruct** focused context
6. **Repeat**

This treats context as a **dynamic environment**, not a static blob.

### Why RLM Works

Traditional approach:
```
[System prompt + 50k tokens of history + query]
```

RLM approach:
```
[System prompt + retrieved relevant context + current query]
```

Each reasoning step starts fresh with focused attention.

## Context Engineering Techniques

| Technique | How It Helps |
|-----------|--------------|
| **Summarization** | Compress old context, preserve essentials |
| **Chunking** | Process in segments, aggregate results |
| **Retrieval** | Pull relevant content, not everything |
| **Tool offloading** | Store state externally, query on demand |
| **Structured prompts** | Clear sections, explicit priorities |

## Tool Use as Context Management

Tools aren't just for actions---they're for **state management**.

Instead of keeping everything in context:
- Store in files, databases, or structured formats
- Query when needed
- Return focused results

This converts unbounded context into bounded queries.

## The Agent Loop

Modern agents combine these ideas:

```
while not done:
    # 1. Assess current state
    relevant = retrieve_from_memory(query)

    # 2. Build focused context
    context = [system_prompt, relevant, current_task]

    # 3. Reason
    action = llm(context)

    # 4. Execute
    result = execute_tool(action)

    # 5. Update memory
    memory.store(result)

    # 6. Evaluate
    if goal_achieved(result):
        done = True
```

Each iteration rebuilds context. No rot accumulation.

## Test-Time Adaptation

A related technique: temporarily update weights during inference.

| Aspect | Test-Time Learning |
|--------|-------------------|
| **Updates weights?** | Yes, lightly (LoRA) |
| **Persists?** | No (rolled back) |
| **Purpose** | Adapt to input distribution |

This sits between ICL (no updates) and fine-tuning (permanent updates).

## Key Insight

> **Context is not a static buffer. It's a dynamic workspace.**

Systems that treat context as "append everything" will rot. Systems that actively manage context stay coherent.

## References

| Concept | Paper |
|---------|-------|
| RLM | [Recursive Language Models](https://arxiv.org/abs/2412.04619) (Zhou et al. 2024) |
| ICL | [What Can Transformers Learn In-Context?](https://arxiv.org/abs/2208.01066) (Garg et al. 2022) |
| Test-Time Training | [TTT for Language Models](https://arxiv.org/abs/2410.13136) (2024) |
| Chain-of-Thought | [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903) (Wei et al. 2022) |

## Coming Next

In Part 6, we'll connect all of this to **continuous learning**: replay methods, subspace regularization, adapter evolution, and consolidation loops.

---

*Rebuild focus instead of dragging baggage.*
