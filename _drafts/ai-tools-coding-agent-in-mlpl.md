---
layout: post
title: "AI Tools #7: A Coding Agent Small Enough to Understand"
categories: [tools, ai-agents, languages, machine-learning]
tags: [ai-tools, coding-agent, sw-mlpl, mlpl, opencode, ollama, qwen2.5-coder, llm-call, agent-loop, permissions, sandbox, dogfooding, array-languages, emacs, org-babel]
keywords: "coding agent, sw-MLPL, MLPL, OpenCode, agent loop, tool dispatch, action protocol, permissions allow ask deny, sandbox, llm_call, Ollama, qwen2.5-coder, local LLM, planner builder reviewer, org-babel, Emacs, dogfooding, capability ledger"
author: Software Wrighter
abstract: "How little machinery does it take to turn an array language into a coding agent? demo-coding-agent is the experiment: the control loop in sw-MLPL, a local model for inference, and Rust only for the few filesystem and process mechanisms the language cannot express. The target is one LLM primitive, five tools, and one to two hundred lines. OpenCode is the comparison point, not the thing being cloned."
series: "AI Tools"
series_part: 7
date: 2026-09-15 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-ml-study/demo-coding-agent"
    title: "demo-coding-agent"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
---

<img src="{{ '/assets/images/posts/coding-agent-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Strip a coding agent down to what it actually does and there is not much left: build a prompt from the task and what has happened so far, ask a model, read the one action it asks for, check whether that action is allowed, do it, add the result to what has happened so far, repeat. Everything else in a product-grade agent --- the terminal UI, sessions, providers, MCP, language servers, subagents --- is engineering layered around that loop.

</div>

**demo-coding-agent** builds the loop in the open and postpones the layers. It is an sw-MLPL project: the control loop, prompt construction, action parsing, permissions, retry, and stop logic are MLPL data and pure functions; a local model answers through the language's own `llm_call` builtin; and Rust supplies only the filesystem and process mechanisms the language cannot express. The question it exists to answer is not *can MLPL call a model* --- it can --- but **can MLPL itself express the control plane of an autonomous software agent?** The target is roughly one LLM primitive, five tools, and one to two hundred lines of MLPL.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **demo-coding-agent** | [sw-ml-study/demo-coding-agent](https://github.com/sw-ml-study/demo-coding-agent) |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [playground](https://sw-ml-study.github.io/sw-mlpl/) |
| **OpenCode** | [anomalyco/opencode](https://github.com/anomalyco/opencode) --- the comparison point |
| **Model** | [qwen2.5-coder](https://ollama.com/library/qwen2.5-coder) on [Ollama](https://ollama.com/) |
| **Prior posts** | [Pi, the minimal agent](/2026/05/16/pi-minimal-agent/) · [nono sandboxing](/2026/05/16/nono-sandbox-ai-agents/) · [local-llm-loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why build one

Two reasons, and they are the same two reasons behind [last week's mixture-of-experts microscope](/2026/09/13/saw-building-a-tiny-mixture-of-experts/).

**To understand the thing by owning a small one.** I use coding agents every day, and the earlier posts in this series looked at them from the outside: [Pi](/2026/05/16/pi-minimal-agent/), which is about as small as a useful agent gets; [nono](/2026/05/16/nono-sandbox-ai-agents/), which boxes one in; and [local-llm-loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/), which measures local models inside a plan-execute-review loop. This one is the loop itself, written so that every decision is visible as data flowing through functions, in a language where the whole program fits on a screen. [OpenCode](https://github.com/anomalyco/opencode) is the architectural reference --- its conceptual core is exactly the loop above --- and the repository is explicit that it is not a port. It is the smallest loop that turns a task into observations, decisions, and file changes.

**To dogfood sw-MLPL on something that is not machine learning.** The ML demos stress tensor semantics. An agent stresses everything else: strings, records, `Result` values, function references, dispatch, sandboxed I/O, and now an extension boundary. Every gap the agent meets goes into a capability ledger with an executable probe, expected versus observed behavior, and the agent it affects --- and stays there, marked unavailable, until upstream ships a change. Nothing is worked around silently. Five findings are recorded from the first week alone: `+` on two strings fails with a diagnostic about arrays; calling a function that does not exist reports the *same* array diagnostic, which hid the fact that `str_starts_with` and `str_trim` do not exist; `write_text` will not create a parent directory; `len` rejects a string list; and the sandbox documentation says symlinks are never followed when the measured behavior is the more useful *symlinks that resolve outside the sandbox are refused*. Four of those are the kind of thing only a program that is not a matrix benchmark finds.

## MLPL owns policy, Rust owns mechanisms

The governing principle is one sentence: **MLPL owns policy, Rust owns mechanisms, a local model owns inference.** Anything the model cannot see in a transcript should not exist.

```text
                 MLPL (agents/*.mlpl)
        +----------------------------------+
        | agent loop                       |
task -->| prompt / context construction    |
        | action protocol parser           |
        | permission policy (allow/ask/deny)|
        | retry / budget / stop logic      |
        +----------------+-----------------+
                         |
              +----------+-----------+
              |                      |
   sw-MLPL builtins          Rust agent-tools extension
   read_text  fs_walk        search (ripgrep crates)
   write_text write_atomic   run (argv allow-list)
   run_script (MLPL only)    git_diff  git_status
              |                      |
              +----------+-----------+
                         |
                     project root
                    (--source-dir)

                    llm_call(url, prompt, model, system)
                         |
                   Ollama / llama.cpp
```

The order of preference for any capability is fixed: an existing sw-MLPL builtin first, then a function in the repository's own narrow Rust extension, then --- last, and only with a probe that proves the gap --- a change to the language. The first agents use no Rust at all, because sw-MLPL already ships sandboxed `read_text`, `write_text`, `fs_walk`, and friends confined to the project root. Search is the one mechanism that goes to Rust from the start: the ripgrep crates give `.gitignore` awareness and binary-file handling that an `fs_walk` loop would have to reinvent.

An agent step is a function from state to state, and the state is one record:

```text
state
  |> build_context
  |> ask_model        (an injected function reference; a scripted fake under test)
  |> parse_action     ("READ src/lib.rs" -> {tool: "read", path: "src/lib.rs"})
  |> authorize        (action + policy -> allow | ask | deny)
  |> execute          (builtin or extension call -> observation)
  |> update_state
```

That is the part I find most interesting about doing this in an array/functional language. A conventional agent accumulates classes --- Agent, Session, Provider, Tool, ToolCall, ToolResult, Permission, ContextManager --- and most of them are containers for state that could just be data. Here an agent is a functional pipeline with feedback, the loop repeats a bounded number of times, and every stop reason --- `DONE`, a denied action, a spent budget --- is a value rather than an exception.

## The model speaks a tiny text protocol

There is no native tool-calling JSON, on purpose. The model answers with exactly one action in plain text:

```text
READ <path>
SEARCH <text>
WRITE <path>
<complete file contents>
END
RUN <command>
DONE <summary>
```

A parser turns each line into a record or an `err(...)`, and the mechanism stays readable in a transcript. It is also the one place the experiment has already pushed back on the language: what you want for actions is a tagged sum value and a `match` on its tag, and MLPL's records-plus-`Result` encoding is recorded as awkward rather than blocking. A stress test of a language is supposed to find things like that.

## More constrained than OpenCode

OpenCode is not sandboxed; its permission system is an interaction and awareness layer around powerful shell and filesystem access. This agent is more constrained, deliberately, in two layers.

**Mechanism confinement** is not up to the model. Every filesystem builtin is confined by sw-MLPL to the `--source-dir` root and refuses anything that resolves outside it, symlinks included. The Rust extension runs only argv arrays that match a fixed allow-list --- `cargo test`, `cargo check`, `cargo clippy`, `cargo fmt`, `git diff`, `git status` --- matched on the argv prefix, never by handing a line to `/bin/sh -c`. There is no primitive that runs a model-generated string as a shell command.

**Policy** is MLPL data:

```text
permissions = {
    read:   "allow",
    search: "allow",
    write:  "ask",
    test:   "allow",
    git:    "ask",
    shell:  "deny"
}
```

`authorize(action, permissions)` is a pure function returning `allow`, `ask`, or `deny`, tested without a model or a filesystem. A denial is recorded as an observation so the model can choose differently. Each agent has its own record --- a planner that can read and search but not write or test, a builder that can write only by asking, a reviewer that can test and read git but not write --- which is OpenCode's useful distinction between full development agents and restricted plan or review agents, done with data instead of a framework.

## Tests need no model

`llm_call` needs a running server, so no test calls it. Every agent takes its model as an injected function reference, and the scripted version replays a fixed transcript of replies, which makes every loop test deterministic and offline. Native mlplunit probes pin the measured behavior of every builtin the agent will depend on: sandboxed reads, walks, writes, and removals; parent-directory and symlink escapes returning `err`; the record that `run_script` returns; the string helpers a prefix protocol needs. `just check` never contacts a model server, so a fork without a GPU still gets a green gate.

Live runs are opt-in `just` recipes against a local Ollama. The floor is `qwen2.5-coder:7b`: it fits an RTX 3060 or a 16 GB Mac with room for context, and it keeps to the one-action protocol, where the 1.5B model drifts out of it. Bigger cards point the same variable at 14B or 32B, and any other provider plugs into the same injection seam --- the loop never learns which server answered.

## One file per capability

The agent is not one program but a sequence of them. Each version is a separate MLPL file that adds one capability to the previous one, so a reader can diff the loop as it grows rather than read the finished thing and guess which lines matter:

| version | shape |
|---------|-------|
| v0 | READ, THINK |
| v1 | READ, SEARCH, THINK |
| v2 | READ, SEARCH, EDIT, TEST |
| v3 | repeat until tests pass |
| v4 | planner, builder, reviewer |
| v5 | budgets, compaction, loop detection |
| v6 | git diff and status, exact patch |
| v7 | driven from an org file in Emacs |

The smallest possible first proof is already a coding agent with one tool:

```text
task   = "Explain the most likely bug in src/lib.rs."
source = unwrap(read_text("src/lib.rs"))
prompt = str_concat("TASK:\n", str_concat(task, str_concat("\n\nSOURCE:\n", source)))
answer = llm_call(HOST, prompt, MODEL, "You are a careful Rust programmer.")
```

Everything after it is iteration policy. And the last row is the one I like most: there is no terminal UI. sw-MLPL has an org-babel backend, so the front end is an org file in Emacs with `#+begin_src mlpl` blocks --- a lighter path to an interactive agent than a TUI, and one that leaves the whole transcript behind as a document.

Deliberately left out, in OpenCode's terms: TUI, MCP, streaming, subagent concurrency, LSP, GitHub integration, session persistence, embeddings or RAG, automatic context compaction, arbitrary shell access. Each would obscure the experiment more than it would teach.

## What it comes to

Strip the loop down and it is what the first paragraph said: build context, ask, parse one action, authorize it, execute it, update the state, repeat until `DONE` or the budget runs out. The agent reads the project, searches it, edits files, runs the tests through an allow-list, and goes around again until they pass --- with every decision a value in a transcript, every mechanism confined by something other than the model's good behavior, and every test of the loop runnable without a model at all.

One LLM primitive, five tools, a couple of hundred lines of an array language. That is the answer to how little machinery it takes, and the reason the answer is worth having is that at this size you can read all of it.
