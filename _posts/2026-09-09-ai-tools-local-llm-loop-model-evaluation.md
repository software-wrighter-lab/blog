---
layout: post
title: "AI Tools #6: Evaluating Local Models in a Plan-Execute-Review Loop"
categories: [ai-agents, llm, rust, tools]
tags: [ai-tools, local-llm, local-llm-loop, opencode, llama-cpp, rust, agents, orchestration, rlm, benchmarks, gpu, vram, quantization, mtp, qwen, gpt-oss, gemma, ornith, model-evaluation]
keywords: "local LLM, local-llm-loop, opencode, llama-server, llama.cpp, plan execute review, orchestrator, planner executor reviewer, Rust harness, agentic coding, tool calling, strict JSON, model evaluation, loop wall-clock, RTX 3060, RTX 5060 Ti, RTX 3090, M1 Max, VRAM, n-cpu-moe, MoE offload, MTP, multi-token prediction, MXFP4, Q4_K_M, MLX, GGUF, Qwen3-Coder, gpt-oss-20b, Gemma-4, Ornith, Qwen3.5, Qwen3.6, Qwen3.8, Devstral, recursive language models"
author: Software Wrighter
abstract: "local-llm-loop is a Rust harness that drives opencode against a local model in a plan, execute, review loop: Rust deterministically owns the plan cursor and history while three separate LLM calls do the planning, the coding, and the verification. This is what has been measured so far across a fleet of machines spanning 12 GB to 64 GB --- which models clear the two hardware-independent gates, how long a complete loop takes on each box, and why tool-use reliability moves wall-clock more than raw tokens per second."
series: "AI Tools"
series_part: 6
date: 2026-09-09 00:15:00 -0700
---

<img src="{{ '/assets/images/posts/gear-brain.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

[`local-llm-loop`](https://github.com/softwarewrighter/local-llm-loop) is a small Rust harness that drives [opencode](https://opencode.ai) against a **local** model in an autonomous plan, execute, review loop. Give it a spec file --- a goal plus architectural decisions --- and it asks a model to produce a design and a list of steps, then works through them.

</div>

<div class="aside-box" markdown="1">

**TL;DR**

| | |
|---|---|
| **Shape** | Three separate LLM calls --- plan, code, verify --- with Rust deterministically owning the plan cursor, step history, and splicing between them. A mixture of deterministic and probabilistic parts, inspired by the [RLM](/2026/02/13/rlm-recursive-language-models/) approach |
| **Two gates** | A model must clear native tool-calling that llama.cpp parses, **and** strict-JSON output. Both are hardware-independent, and they eliminate most small general models |
| **Measured on** | A fleet of 8--9 machines: RTX 3060 12 GB, 5060 Ti 16 GB, 3090 24 GB, M1 Max 64 GB |
| **Fastest complete loop** | gpt-oss-20b MXFP4 on the 5060 Ti, **1m13s** to a `cargo test`-green crate |
| **Main finding** | Tool-use reliability moves wall-clock more than tokens per second. A model that one-shots each envelope beats a faster model that retries |
| **Caveat** | This ranks **speed only**, in this harness. Quality ranking is future work |

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **local-llm-loop** | [softwarewrighter/local-llm-loop](https://github.com/softwarewrighter/local-llm-loop) |
| **opencode** | [opencode.ai](https://opencode.ai) |
| **Related** | [RLM: Recursive Language Models](/2026/02/13/rlm-recursive-language-models/) · [Pi minimal agent](/2026/05/16/pi-minimal-agent/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The loop

The binary is named `bootstrap`. In its `orchestrate` mode it turns a spec into a plan, then iterates the steps: a tool-using model implements each step, and a supervising model reviews the result and decides what happens next.

```
spec.txt
  │
  ▼
LLM(plan) ──► Plan{design, steps[]} ──► plan.json
  │
  ▼   (Rust owns the cursor + history)
loop over steps:
  LLM(execute, tools) ──► StepResult      ──► step-NN-result.json
  LLM(review)         ──► ReviewDecision  ──► step-NN-review.json
       │
       ├─ continue → advance cursor
       ├─ insert   → splice new steps after cursor
       ├─ skip     → drop next step
       └─ stop     → halt for human
```

The division of labour is the point. Every LLM call is a stateless `opencode run`; all the context it needs --- goal, design, prior summaries, the current step --- is passed in the prompt, and the Rust side owns the state. That is what makes insert, skip, and replan deterministic rather than something the model has to remember to do. Roles hand off through sentinel-delimited JSON, and every artifact is persisted.

The harness is model-agnostic: it shells out to `opencode run --model <provider/model>`, so any model opencode can reach works. Everything below was served by a local `llama-server`, with the model loaded once and reused across every call.

## The two gates

Before speed matters at all, a model has to clear two hardware-independent gates: **native tool-calling that llama.cpp parses**, and **strict-JSON output**.

Most larger MoE and dense coders at 26B and above clear both. Smaller general models often fail one:

| Model | Fails on |
|-------|----------|
| Qwen2.5-Coder | Tool-call delimiter |
| Qwen3-8B, Qwen3-14B | JSON |
| Phi-4 | No tool calls |

Two results cut against size as the predictor. A purpose-trained coder, **Ornith-1.0-9B, clears both gates at 9B**. And **gpt-oss-20b fails the JSON gate unaided**, but the harness's `emit` self-heal channel carries it through anyway.

## What a complete loop costs

Every run below produced a `cargo test`-green crate from the same greeter spec. Ordered fastest to slowest:

| Model | Box (VRAM) | Placement | Loop wall-clock |
|-------|-----------|-----------|----------------:|
| gpt-oss-20b MXFP4 | 5060 Ti · 16 GB | whole (FP4) | **1m13s** |
| Ornith-1.0-9B + MTP | 5060 Ti · 16 GB | resident + MTP | 2m15s |
| Qwen3-Coder-30B-A3B | 3090 · 24 GB | whole | ~3m30s |
| gpt-oss-20b | M1 Max · 64 GB | whole | 3m34s |
| Ornith-1.0-9B + MTP | 3060 · 12 GB | resident + MTP | 4m29s |
| Ornith-1.0-9B | 5060 Ti · 16 GB | resident | 4m42s |
| Ornith-1.0-35B (MLX) | M1 Max · 64 GB | whole | 6m06s |
| Qwen3-Coder-30B-A3B | 5060 Ti · 16 GB | `--n-cpu-moe` | 6m38s |
| Qwen3-Coder-30B-A3B | 3060 · 12 GB | `--n-cpu-moe` | 7m20s |
| Qwen3.6-35B-A3B-MTP | M1 Max · 64 GB | whole + MTP | 8m01s |
| Gemma-4-26B-A4B | 5060 Ti · 16 GB | `--n-cpu-moe` | 9m02s |
| Ornith-1.0-35B | 5060 Ti · 16 GB | `--n-cpu-moe` | 9m56s |
| Ornith-1.0-9B | 3060 · 12 GB | resident | 10m58s |
| Qwen3.6-35B-A3B | 3060 · 12 GB | `--n-cpu-moe` | 13m40s |
| Qwen3.6-27B (dense) | 5060 Ti · 16 GB | offload | ~75 min |

Two things this shows. A **fast small model beats a slow big one across hardware tiers**: Ornith-9B+MTP on the 12 GB box (4m29s) edges the same model on the 16 GB box without MTP, and nearly matches gpt-oss on the M1 Max. And on the 12 GB 3060 alone the spread is **3×** --- 4m29s to 13m40s --- driven by multi-token prediction and how many tokens the model thinks, not by parameter count.

By VRAM tier: 12 GB runs the dense 9B whole plus its MTP head, and A3B MoE coders up to 35B via `--n-cpu-moe` with experts in RAM; 16 GB runs MoE coders up to 30B with light offload; 24 GB fits 30--35B whole; 64 GB fits anything, and MLX decodes about 1.35× GGUF on Apple Silicon.

## Where the time goes

Per-phase timings were recovered from `.bootstrap/` artifact timestamps on the M1 Max --- the orchestrator does not log durations, and the GPU runs recorded throughput rather than phase timing.

| Phase | Qwen3.6-35B-A3B-MTP | gpt-oss-20b |
|-------|--------------------:|------------:|
| Model load → ready | ~4 s | ~4 s |
| Plan (1 call) | 1m32s | 1m35s |
| Code (per step, avg) | ~78 s | ~36 s |
| Review (per step, avg) | ~51 s | ~24 s |
| Retries / self-heals | **0** | 6 retries + 1 `emit` fix |
| **Total** | **8m01s** (3 steps) | **3m34s** (2 steps) |

**Model load is not the bottleneck.** On the M1 Max both a 21 GB MoE and an 11 GB MoE reach ready in about 4 seconds.

**Plan is the single most expensive call.** It runs against a cold prompt cache and is the longest single generation, since it produces the full design and step list at once.

**Retries dominate.** Qwen3.6-MTP writes more per step and is slower per call, but lands each step in one attempt with zero retries. gpt-oss-20b is roughly twice as fast per call but wobbles on the JSON envelope --- 6 retries plus one `emit` self-correction. The same split appears across the GPU runs: Gemma-4-26B ran with zero retries, qwen3-8b needed 12 in-context re-prompts, and Devstral-24B spent over 39 minutes on the plan alone. A model that one-shots each envelope beats a faster model that retries.

## August 2026 candidates on the M1 Max

Three models were attempted:

| Model | Configuration | Outcome |
|-------|---------------|---------|
| Laguna S 2.1 | 118B-A8B `UD-IQ3_XXS`, 16k | Tool and plan gates pass; stalls in step 2, leaves non-compiling code after 13m03s |
| Nemotron 3.5 Lightning 30B-A3B | Mamba-heavy `Q4_0`, 32k | Native tools pass; structured planner fails 3/3 attempts |
| Qwen3.8-27B | Dense hybrid `Q4_K_M`, 32k | Full loop, clippy, and 3/3 tests pass; 2h43m57s wall-clock |

Only Qwen3.8 completed a loop. Its wall-clock includes at least two observed laptop-sleep gaps, so it is not a clean throughput number; the completed code-quality result stands.

### Three versions of the same model

Qwen3.5, 3.6 and 3.8 at 27B were run identically --- text-only `Q4_K_M`, 32k context, full Metal offload, q8_0 KV, flash attention, same spec.

| Model | Gate prefill / decode | Planner and loop |
|-------|----------------------:|------------------|
| Qwen3.5-27B | 104.8 / 12.1 t/s | Plan first try; full loop 2h24m21s; 2/2 tests. Very verbose |
| Qwen3.6-27B | 100.8 / 12.4 t/s | Plan failed 3/3, 6,321 planner output tokens; terminal after 11m25s |
| Qwen3.8-27B | 114.1 / 12.4 t/s | Plan on attempt 2; full loop; 3/3 tests + clippy; fixed a runtime parser bug it found |

Decode rates are effectively tied, so agent behaviour rather than inference throughput determined the outcome. The expectation that 3.6 would use fewer tokens is not supported here: it produced 6,321 output tokens during planning and never produced a valid plan, and its 11-minute figure is time to failure, not a faster loop. Qwen3.6 also did not recover from rejected absolute-path writes.

## Scope of these numbers

These rank **speed only** --- time to a `cargo test`-green crate. Quality ranking is future work. A prompt or tool-policy change could move any of these results, so they are measurements of specific models in this harness, not a general model ranking.

The open question for the 12 GB tier is whether it is better aimed at admin and non-coding agent tasks --- log triage, file operations, summaries, scheduled jobs --- rather than authoring code.
