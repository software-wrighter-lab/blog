---
layout: post
title: "AI Tools #7: A Coding Agent Small Enough to Understand"
categories: [tools, ai-agents, languages, machine-learning]
tags: [ai-tools, coding-agent, sw-mlpl, mlpl, opencode, ollama, qwen2.5-coder, llm-call, agent-loop, permissions, sandbox, dogfooding, array-languages, emacs, org-babel]
keywords: "coding agent, sw-MLPL, MLPL, OpenCode, agent loop, tool dispatch, action protocol, permissions allow ask deny, sandbox, llm_call, Ollama, qwen2.5-coder, local LLM, planner builder reviewer, org-babel, Emacs, dogfooding, capability ledger"
author: Software Wrighter
abstract: "How little machinery does it take to turn an array language into a coding agent? demo-coding-agent is the experiment: the control loop in sw-MLPL, a local model for inference, and Rust only for the few filesystem and process mechanisms the language cannot express. One LLM primitive, six tools, a loop of a few hundred lines --- and a local 7B model that reads a project, adds a function and its test, runs the tests, and is not allowed to say it is done until they pass. OpenCode is the comparison point, not the thing being cloned."
series: "AI Tools"
series_part: 7
date: 2026-09-16 00:15:00 -0700
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

**demo-coding-agent** builds the loop in the open and postpones the layers. It is an sw-MLPL project: the control loop, prompt construction, action parsing, permissions, retry, and stop logic are MLPL data and pure functions; a local model answers through the language's own `llm_call` builtin; and Rust supplies only the filesystem and process mechanisms the language cannot express. The question it exists to answer is not *can MLPL call a model* --- it can --- but **can MLPL itself express the control plane of an autonomous software agent?** The answer is one LLM primitive, six tools, and a loop of a few hundred lines of MLPL --- plus a parser that is longer than the loop, for reasons a real model supplied.

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

**To dogfood sw-MLPL on something that is not machine learning.** The ML demos stress tensor semantics. An agent stresses everything else: strings, records, `Result` values, function references, dispatch, sandboxed I/O, and now an extension boundary. Every gap the agent meets goes into a capability ledger with an executable probe, expected versus observed behavior, and the agent it affects --- and stays there, marked unavailable, until upstream ships a change. Nothing is worked around silently. Nine findings are recorded from the first week alone. `+` on two strings fails with a diagnostic about arrays; calling a function that does not exist reports the *same* array diagnostic, which hid the fact that `str_starts_with` and `str_trim` do not exist; `write_text` will not create a parent directory; `len` rejects a string list; the sandbox documentation says symlinks are never followed when the measured behavior is the more useful *symlinks that resolve outside the sandbox are refused*; `include` resolves paths differently under the interpreter and the test runner. And three that only an agent finds: dispatching on a record's tag takes a nested `if`/`else` chain because there is no `match`; there are no `&&`/`||` operators, so a permission check is written as nested conditionals; and every stdin builtin refuses a terminal, so an MLPL program cannot ask its user a question --- the interactive loop feeds its stdin from a FIFO that `cat /dev/tty` fills, so the language reads a pipe while the lines still come from the keyboard. None of those is the kind of thing a matrix benchmark turns up.

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

The order of preference for any capability is fixed: an existing sw-MLPL builtin first, then a function in the repository's own narrow Rust extension, then --- last, and only with a probe that proves the gap --- a change to the language. The MLPL coding run below uses no Rust at all: sw-MLPL already ships sandboxed `read_text`, `write_text`, `fs_walk`, and friends confined to the project root, and `RUN mlpl <path>` runs a test file through the language's own `run_script` and reads back its status and per-test results. The Rust extension, `agent-tools`, does only what the language genuinely cannot: search on the ripgrep crates, honoring `.gitignore`, with bounded `path:line:text` output; and a runner for exactly `cargo test`, `cargo check`, `cargo clippy`, `cargo fmt`, `git diff`, and `git status`, inside the project root, with a two-minute timeout and bounded output. It is a few hundred lines of Rust behind the same extension ABI the other sw-MLPL demos use, and it is what lets the same loop work a Rust crate.

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
PATCH <path>
OLD
<exact existing lines>
NEW
<replacement lines>
END
RUN <command>
DONE <summary>
```

A parser turns each reply into a record --- `{tool: "patch", path, old, new}` --- or an `err(...)`, and the mechanism stays readable in a transcript. `PATCH` is pure MLPL over `read_text`, `str_find`, and `write_atomic`: the `OLD` block must occur exactly once, and zero or several occurrences are observations, not edits. The parser is longer than the loop --- 412 lines against 339 --- because it is hardened against what real models do, each habit pinned by a test: it drops everything from a fabricated `OBSERVATION:` line onward once the action is complete, drops a copied `ACTION:` header, tolerates a blank line before an opening code fence and a fence-only line after `END`, and turns a malformed reply into a `PARSE ERROR:` observation the model sees on its next turn instead of a crash. It is also the one place the experiment has already pushed back on the language: what you want for actions is a tagged sum value and a `match` on its tag, and MLPL's records-plus-`Result` encoding is recorded as awkward rather than blocking. A stress test of a language is supposed to find things like that.

## More constrained than OpenCode

OpenCode is not sandboxed; its permission system is an interaction and awareness layer around powerful shell and filesystem access. This agent is more constrained, deliberately, in two layers.

**Mechanism confinement** is not up to the model. Every filesystem builtin is confined by sw-MLPL to the `--source-dir` root and refuses anything that resolves outside it, symlinks included. The Rust extension runs only argv arrays that match a fixed allow-list --- `cargo test`, `cargo check`, `cargo clippy`, `cargo fmt`, `git diff`, `git status` --- matched on the argv prefix, never by handing a line to `/bin/sh -c`. There is no primitive that runs a model-generated string as a shell command.

**Policy** is MLPL data:

```text
permissions = {
    read:   "allow",
    search: "allow",
    write:  "ask",
    run:    "allow",
    git:    "ask",
    shell:  "deny"
}
```

`authorize(action, permissions)` is a pure function returning `allow`, `ask`, or `deny`, tested row by row without a model or a filesystem. `RUN` is classified by its first word: `mlpl` stays pure MLPL, `cargo` falls under `run`, `git` under `git`, and anything else is `shell` --- which is denied, and which `shell: "allow"` still refuses, because there is no mechanism underneath it to allow. `PATCH` is a `write`. An `ask` resolves through an injected decision function: at a terminal the agent prints the proposed action --- for a WRITE, the whole body --- and approves only `y` or `yes`; with no terminal on stdin it decides no, so a piped or scripted run never writes. A denial ends the run and names the refused action, so the model cannot probe the policy by retrying.

Two more guards run before authorization, both pure functions over the state. A WRITE to an existing file this run has not READ is refused with *read it before writing it*, which stopped the model editing blind. A reply identical to the previous one is observed as `REPEATED ACTION` rather than executed, and a third identical reply stops the run with reason `stuck`. Each agent has its own record --- a planner that can read and search but not write or test, a builder that can write only by asking, a reviewer that can test and read git but not write --- which is OpenCode's useful distinction between full development agents and restricted plan or review agents, done with data instead of a framework.

## Watch it code

The task: add `u:mul` and its test to a tiny MLPL project, run the tests, and finish when they pass. The model: `qwen2.5-coder:7b`, on a laptop, through Ollama. Writes approved, budget twelve steps.

<figure class="no-invert">
<video src="{{ '/assets/videos/coding-agent-loop.mp4' | relative_url }}" autoplay muted loop playsinline preload="auto" aria-label="Terminal recording of the coding agent reading the MLPL example, writing u:mul and its test, running the tests, and finishing"></video>
<figcaption>Six steps: read, write, read, write, run, done. The model replies are replayed from the saved <code>qwen2.5-coder:7b</code> transcript; the parser, the file writes, and the test run happen for real. Recorded with <a href="https://github.com/charmbracelet/vhs">VHS</a>.</figcaption>
</figure>

The run is the loop doing exactly what the diagram says. `READ lib.mlpl`. `WRITE lib.mlpl` with `u:add` kept verbatim and `u:mul` added beneath it. `READ tests/test_add.mlpl`. `WRITE` it back with the includes intact and a second test. `RUN mlpl tests/test_add.mlpl`, which comes back as an observation with one line per test:

```text
status: ok
passed: add sums two numbers
passed: mul multiplies two numbers
```

Then `DONE`. The transcript is saved as a fixture, the example project is restored, and the same flow is proven offline by a test with a scripted model, so the demo cannot quietly stop working. The recording above is that replay: `just replay` plays the saved transcript through the real loop in any terminal, no model server needed, and `just mlpl-demo` runs the task live.

The same task, same prompt, same guards, run once against each model: `qwen2.5-coder:7b` (4.7 GB) finishes in seven steps in about ninety seconds; `devstral:24b` (14 GB) and `devstral-small-2:24b` (15 GB) each finish in the minimum six, with no wasted step and no syntax slips --- and Devstral 2 was the first model to reach for `PATCH` instead of rewriting the whole library file, unprompted. The 7B model is the floor because it fits a 12 GB card; Devstral is the upgrade tier. With the extension built, the loop works a Rust crate the same way: read `src/lib.rs`, `PATCH` a `#[cfg(test)]` module onto the end so the rest of the file is untouched, `RUN cargo test` through the allow-listed runner, and `DONE` only when the observation shows `test result: ok`.

The part worth knowing is how it got to six clean steps, because the first five live attempts failed, each in an instructive way, and each changed exactly one thing. The model rewrote a file without its `def`. It put a fabricated `OBSERVATION: wrote ...` inside its own WRITE. It wrapped file bodies in code fences. Given a concrete example path in the prompt, it copied that path verbatim for every action and spent the whole budget on missing-directory errors. And in three of the five attempts it replied `DONE`, claiming the tests passed, **without ever having run them.**

That last habit is why the loop has a verify gate. `DONE` is accepted only when an injected `verify` function finds the evidence in the history --- at least one successful WRITE and, after the last WRITE, a RUN observation with `status: ok` and no failed test. Otherwise the model is told `NOT VERIFIED` and the loop continues. What the failures taught, in one line: a 7B model follows a text protocol only with placeholder examples, a rule against writing its own observations, and a loop that refuses unverified success. Fabricated observations are the dominant failure, and the verifier is what makes the demo honest.

## Tests need no model

`llm_call` needs a running server, so no test calls it. Every agent takes its model as an injected function reference, and the scripted version replays a fixed transcript of replies, which makes every loop test deterministic and offline. Seventy-three native mlplunit tests pin the builtins, the parser, the guards, the permission table, and the loop: sandboxed reads, walks, writes, and removals; parent-directory and symlink escapes returning `err`; every stop reason; the ask decision on both its paths; parse-error recovery; and the whole add-a-function-and-test flow, driven by a scripted transcript model that picks its reply by counting the actions already in the prompt. `just check` never contacts a model server, so a fork without a GPU still gets a green gate.

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

Everything after it is iteration policy. And the last row is the one I like most: there is no terminal UI. sw-MLPL has an org-babel backend, so the front end is an org file in Emacs with `#+begin_src mlpl` blocks --- a lighter path to an interactive agent than a TUI, and one that leaves the whole transcript behind as a document. The same idea runs the other way too: the plan is a literate org document that explains every MLPL file of the agent with executable, tangle-checked source blocks, so the explanation and the program cannot drift apart.

Deliberately left out, in OpenCode's terms: TUI, MCP, streaming, subagent concurrency, LSP, GitHub integration, session persistence, embeddings or RAG, automatic context compaction, arbitrary shell access. Each would obscure the experiment more than it would teach.

## What it comes to

Strip the loop down and it is what the first paragraph said: build context, ask, parse one action, authorize it, execute it, update the state, repeat until `DONE` or the budget runs out. The agent reads the project, edits files, runs the tests, and goes around again until they pass --- with every decision a value in a transcript, every mechanism confined by something other than the model's good behavior, a verifier standing between the model's claim of success and the real thing, and every test of the loop runnable without a model at all.

One LLM primitive, six tools, a loop of a few hundred lines in an array language, and a parser that is longer than the loop because it has met real models. That is the answer to how little machinery it takes, and the reason the answer is worth having is that at this size you can read all of it.
