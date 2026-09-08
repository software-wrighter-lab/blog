---
layout: post
title: "RLM: Recursive Language Models for Massive Context"
date: 2026-02-13 00:30:00 -0800
categories: [llm, rust, research]
tags: [rlm, recursive-language-models, context-window, rust, wasm, llm]
keywords: "recursive language models, RLM, context window, large context, MIT, WASM, WebAssembly, Rust, LLM tools"
author: Software Wrighter
abstract: "When data won't fit in a context window, RLM expands the workspace instead. The MIT paper achieves 87-91% accuracy where standard prompting scores 0%. My Rust implementation provides four capability levels from DSL commands to WASM sandboxing to LLM delegation."
video_url: "https://www.youtube.com/watch?v=5DhaTPuyhys"
video_title: "Recursive Language Model implemented, evaluated, explained"
video_urls:
  - "https://www.youtube.com/watch?v=d5gaL4iOdLA"
  - "https://www.youtube.com/watch?v=jMo5AaMRUkM"
  - "https://www.youtube.com/watch?v=oN6XyZdEHqY"
  - "https://www.youtube.com/watch?v=a-p4kojgJtM"
  - "https://www.youtube.com/watch?v=l6OjvtG2Nlk"
video_titles:
  - "Can AI Find a Secret Hidden in War and Peace?"
  - "Custom Sandbox Code: RLM and WASM"
  - "Why I Let an LLM Compile Native Binaries"
  - "Can AI Catch a Killer?"
  - "How AI Reads a Book Too Large for Its Context Window"
repo_url: "https://github.com/softwarewrighter/rlm-project"
papers:
  - title: "Recursive Language Models"
    url: "https://arxiv.org/abs/2512.24601"
series: "Machine Learning"
series_part: 3
---

<img src="{{ '/assets/images/posts/block-mirror-recursion.webp' | relative_url }}" class="post-marker" alt="">

What happens when your data won't fit in a context window? RLM expands the workspace instead of cramming everything into limited memory. This post covers the MIT paper, my Rust implementation, and six video demonstrations.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [arXiv:2512.24601](https://arxiv.org/abs/2512.24601) |
| **Code** | [rlm-project](https://github.com/softwarewrighter/rlm-project) |
| **Playlist** | [RLM Implementations](https://www.youtube.com/playlist?list=PLKjvVAEaR4itAgRBOJGi-B2CCY2-Wvgem) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem: Context Limits

Large language models have a hard limit. They can only process so much text at once.

Imagine a cookie jar that holds 100 cookies. What if you need to search through ten thousand? When you force too much in, the model forgets things---this is called **context rot**.

Bigger models help, but the limit always exists. We need a different approach.

## The RLM Solution

Recursive Language Models flip the problem. Instead of bigger jars, use better tools.

The data stays in a **context box**. The model gets tools to peek inside:

| Tool | Purpose |
|------|---------|
| `slice` | Get a character range |
| `find` | Search for text |
| `regex` | Pattern matching |
| `count` | Count occurrences |
| `llm_query` | Ask a sub-LLM to analyze a chunk |

Small, focused, deliberate. The model thinks about what it needs, then asks for just that.

### The Results

From the MIT paper---on tasks that don't fit in context:

| Approach | Accuracy |
|----------|----------|
| Standard prompting | 0% |
| RLM | 87-91% |

Results hold across GPT-4, Claude, Llama, Mistral, and Gemini.

## My Implementation: Four Capability Levels

I built a Rust implementation with four capability levels:

| Level | Name | Description |
|-------|------|-------------|
| L1 | DSL | Built-in commands (find, regex, count) |
| L2 | WASM | LLM generates Rust → compiles to WebAssembly sandbox |
| L3 | CLI | LLM generates Rust → compiles to native binary |
| L4 | LLM | Recursive delegation to sub-LLMs |

Each level trades off safety for capability:
- **L1** is instant but limited to predefined operations
- **L2** runs custom code but in a sandboxed environment
- **L3** breaks free for large datasets that would timeout in WASM
- **L4** uses LLM reasoning for semantic analysis

## The Video Series

Six videos demonstrate RLM in action:

### 1. RLM Explained

[![RLM Explained](https://img.youtube.com/vi/5DhaTPuyhys/mqdefault.jpg)](https://www.youtube.com/watch?v=5DhaTPuyhys)

The foundational video. Covers the MIT paper, the cookie jar analogy, and benchmark results showing 0% → 91% accuracy improvement.

**Key insight:** Expand the workspace, not the context.

---

### 2. War and Peace Demo

[![War and Peace Demo](https://img.youtube.com/vi/d5gaL4iOdLA/mqdefault.jpg)](https://www.youtube.com/watch?v=d5gaL4iOdLA)

Can AI read all of War and Peace to find a hidden secret? The full text is 3.2 MB with 65,666 lines---way too big for any context window.

RLM finds "the password to Prince Andrei's secret vault" in just **2 iterations** using only 3,000 tokens. That's 100% savings compared to sending the full document.

---

### 3. WASM Sandboxing

[![WASM Sandboxing](https://img.youtube.com/vi/jMo5AaMRUkM/mqdefault.jpg)](https://www.youtube.com/watch?v=jMo5AaMRUkM)

What if your LLM could write custom analysis code on the fly? Level 2 demonstrates WebAssembly sandboxing.

The LLM writes Rust code that compiles to WASM and runs in a secure sandbox. Demos include:
- Error ranking in logs
- Response time percentiles
- Unique IP counting

Trade-offs: ASCII only, 64MB memory limit, subset of Rust.

---

### 4. Native CLI Binaries

[![Native CLI Binaries](https://img.youtube.com/vi/oN6XyZdEHqY/mqdefault.jpg)](https://www.youtube.com/watch?v=oN6XyZdEHqY)

When 5,000 lines would timeout in WASM, Level 3 breaks free. Native Rust binaries process massive datasets with no limits.

Four CLI demos:
- **Error ranking**: Hash map counts error types
- **Unique IPs**: Hash set finds distinct addresses
- **Percentiles**: Sort and index for p50/p95/p99
- **Word frequency**: Tokenize, filter stop words, count

---

### 5. Detective Mystery Demo

[![Detective Mystery Demo](https://img.youtube.com/vi/a-p4kojgJtM/mqdefault.jpg)](https://www.youtube.com/watch?v=a-p4kojgJtM)

A murder at the manor. Seven suspects. Dozens of clues. Can an LLM solve it?

Level 4 delegates reasoning to sub-LLMs. Instead of code execution, the model calls other models to:
- Analyze witness statements
- Compare alibis
- Draw conclusions

Watch as L4 examines each suspect and identifies the killer.

---

### 6. Large Context Processing

[![Large Context Processing](https://img.youtube.com/vi/l6OjvtG2Nlk/mqdefault.jpg)](https://www.youtube.com/watch?v=l6OjvtG2Nlk)

War and Peace is 3MB---far too large for any context window. This video shows Level 4 extracting noble family relationships from the entire novel.

The process:
1. L3 extracts relationship sentences (father, mother, son, daughter...)
2. L4 analyzes filtered data with sub-LLMs
3. Final output: structured family trees

Three million characters → structured family trees in ~90 seconds.

---

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Client    │────▶│  RLM Server     │────▶│  Root LLM   │
│  /visualize │     │  (Rust/Axum)    │     │  (DeepSeek) │
└─────────────┘     └────────┬────────┘     └─────────────┘
                             │
                    ┌────────▼────────┐
                    │ Command Executor │
                    │  slice, find,   │
                    │  regex, count,  │
                    │  llm_query...   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Ollama  │  │  Ollama  │  │  Ollama  │
        │ (local)  │  │ (remote) │  │ (other)  │
        └──────────┘  └──────────┘  └──────────┘
              Sub-LM Pool (for llm_query)
```

## Quick Start

```bash
cd rlm-orchestrator

# Configure providers in config.toml
export DEEPSEEK_API_KEY="your-key"

# Run the server
cargo run --bin rlm-server

# Open visualizer
open http://localhost:8080/visualize
```

## The Cookie Jar Analogy

Think of it like this:

- **Old way:** Dump everything on the table, then dig through the mess
- **RLM way:** Use a scoop---grab just the cookies you need

The key insight is simple: **expand the workspace, not the context.**

## Resources

- [RLM Paper (arXiv:2512.24601)](https://arxiv.org/abs/2512.24601) - Zhang, Kraska, Khattab (MIT CSAIL)
- [rlm-project Repository](https://github.com/softwarewrighter/rlm-project)
- [rlm-project Wiki](https://github.com/softwarewrighter/rlm-project/wiki)
- [RLM Implementations Playlist](https://www.youtube.com/playlist?list=PLKjvVAEaR4itAgRBOJGi-B2CCY2-Wvgem)
- [ELI5: What is RLM?](https://github.com/softwarewrighter/rlm-project/blob/main/docs/rlm-eli5.md)

---

*When context windows aren't enough, RLM gives your LLM tools to explore. Six videos, four capability levels, one insight: expand the workspace, not the context.*

