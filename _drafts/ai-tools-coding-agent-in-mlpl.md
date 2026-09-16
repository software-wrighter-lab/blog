---
layout: post
title: "AI Tools #7: A Coding Agent Small Enough to Understand"
categories: [tools, ai-agents, languages, machine-learning]
tags: [ai-tools, coding-agent, mlplcode, sw-mlpl, mlpl, opencode, ollama, qwen2.5-coder, devstral, llm-call, agent-loop, permissions, sandbox, dogfooding, array-languages, literate-programming, org-mode, emacs]
keywords: "coding agent, mlplcode, sw-MLPL, MLPL, OpenCode, agent loop, action protocol, tool dispatch, permissions allow ask deny, sandbox, verify gate, llm_call, Ollama, qwen2.5-coder, Devstral, local LLM, literate programming, org-babel, tangle, dogfooding, capability ledger"
author: Software Wrighter
abstract: "Coding agents are usually described from the outside: a product with a terminal UI, a permission system, a dozen tools, and a model behind it all. mlplcode is the inside, kept small: the whole control loop in sw-MLPL, an array language, with Rust only for the mechanisms the language cannot express and a local model for inference. One LLM primitive, six verbs, about 850 lines of MLPL that matter and 220 of Rust --- and a verifier standing between the model's claim of success and the real thing, because a 7B model will say it ran the tests when it did not."
series: "AI Tools"
series_part: 7
date: 2026-09-16 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-ml-study/demo-coding-agent"
    title: "demo-coding-agent (mlplcode)"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
---

<img src="{{ '/assets/images/posts/coding-agent-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Strip a coding agent down to what it actually does and there is not much left: build a prompt from the task and what has happened so far, ask a model, read the one action it asks for, check whether that action is allowed, do it, add the result to what has happened so far, repeat. Everything else in a product-grade agent --- the terminal UI, sessions, providers, MCP, language servers, subagents --- is engineering layered around that loop.

</div>

**mlplcode** is that loop, built in the open, with the layers left off. It is the coding-agent demo in the [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) family, named in the spirit of [OpenCode](https://github.com/anomalyco/opencode), and it follows one rule: **MLPL owns every decision, Rust owns only the mechanisms MLPL cannot express, and a local model owns inference.** The question it answers is not *can MLPL call a model* --- it can --- but *can an array language express the control plane of an autonomous coding agent?* The answer is yes, in about 850 lines of MLPL --- 75 small functions --- backed by 220 lines of Rust, and the interesting part is what those lines had to contain. (The full count, tests and all, is broken down at the end.)

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **mlplcode** | [sw-ml-study/demo-coding-agent](https://github.com/sw-ml-study/demo-coding-agent) |
| **Read it as a book** | [mlplcode.org](https://github.com/sw-ml-study/demo-coding-agent/blob/main/docs/mlplcode.org) --- every function, with prose · [HTML]({{ '/assets/docs/mlplcode.html' | relative_url }}) · [PDF]({{ '/assets/docs/mlplcode.pdf' | relative_url }}) |
| **Worked example** | [the transcript](https://github.com/sw-ml-study/demo-coding-agent/blob/main/fixtures/transcripts/mlpl-mul-qwen2.5-coder-7b.txt) of a 7B model adding a function and its test · [the project it edited](https://github.com/sw-ml-study/demo-coding-agent/tree/main/examples/tiny-mlpl-project) |
| **The loop** | [agents/loop.mlpl](https://github.com/sw-ml-study/demo-coding-agent/blob/main/agents/loop.mlpl) · [protocol.mlpl](https://github.com/sw-ml-study/demo-coding-agent/blob/main/agents/protocol.mlpl) · [permissions](https://github.com/sw-ml-study/demo-coding-agent/blob/main/docs/permissions.md) |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [playground](https://sw-ml-study.github.io/sw-mlpl/) · [findings filed](https://github.com/sw-ml-study/demo-coding-agent/blob/main/docs/sw-mlpl-capabilities.md) |
| **OpenCode** | [anomalyco/opencode](https://github.com/anomalyco/opencode) --- the comparison point |
| **Models** | [qwen2.5-coder](https://ollama.com/library/qwen2.5-coder) · [devstral](https://ollama.com/library/devstral) on [Ollama](https://ollama.com/) |
| **Prior posts** | [Pi, the minimal agent](/2026/05/16/pi-minimal-agent/) · [nono sandboxing](/2026/05/16/nono-sandbox-ai-agents/) · [local-llm-loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why build one

Two reasons, and they are the same two reasons behind [last week's mixture-of-experts microscope](/2026/09/13/saw-building-a-tiny-mixture-of-experts/).

**To understand the thing by owning a small one.** I use coding agents every day, and the earlier posts in this series looked at them from the outside: [Pi](/2026/05/16/pi-minimal-agent/), which is about as small as a useful agent gets; [nono](/2026/05/16/nono-sandbox-ai-agents/), which boxes one in; and [local-llm-loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/), which measures local models inside a plan-execute-review loop. This one is the loop itself, written so that every decision is visible as data flowing through pure functions, in a language where the whole program can be read in an afternoon. OpenCode is the architectural reference --- its conceptual core is exactly the loop above --- and this is explicitly not a port of it.

**To dogfood sw-MLPL on something that is not machine learning.** The ML demos stress tensor semantics. An agent stresses everything else: strings, records, `Result` values, function references, dispatch, sandboxed I/O, and an extension boundary. Every gap the agent met went to the language's maintainer as a finding with an executable probe, expected versus observed behavior, and the agent it affected. Nine were filed. **Five shipped the same day**: `+` now concatenates strings, `len` works on string lists, an undefined function says so instead of producing an array error, `make_dir` exists, and a documentation line about symlinks is right. The one that hurt most was the undefined-function diagnostic, because it hid the fact that `str_trim` and `str_starts_with` did not exist; the parser carries its own trim. Still open, and worked around in the open: `include` resolves differently under the test runner and the CLI; a six-way choice needs six nested `if`s because there is no `else if` or `match`; and every stdin builtin refuses a terminal, so the interactive loop asks for write approval through a FIFO that the wrapper fills from `/dev/tty`. None of those is the kind of thing a matrix benchmark turns up.

## The loop

One step per model turn, over a single state record --- the task, the transcript so far, the files touched, the budget:

1. **Build the prompt.** The task, then every earlier `ACTION:` / `OBSERVATION:` pair, then *choose the next action*.
2. **Ask the model.** The model is a function passed in. Live, it is `llm_call` against Ollama; under test, a scripted reply.
3. **Parse the reply** into exactly one action. Anything else becomes a `PARSE ERROR` observation and the turn ends.
4. **Guard.** A reply identical to the last one is flagged, and stops the run as `stuck` the third time. A write or patch to a file this run has not read is refused with *read it first*.
5. **Authorize.** Look the tool up in the permission record: `allow`, `ask`, or `deny`. `ask` goes to a decision function --- a terminal prompt, always yes, or always no. `deny` ends the run.
6. **Execute.** Read, atomic write, exact-match patch, `run_script` for an MLPL test file, or the Rust extension for ripgrep search and allow-listed `cargo`/`git`. Never a shell. A failure is an `ERROR` observation, not a crash.
7. **Record.** Append the action and its observation to the transcript, note the touched file, count the repeat.
8. **On `DONE`, verify.** Accept only if a file was edited and a test run passed after the last edit; otherwise the model sees `NOT VERIFIED` and keeps going.

The run stops with a reason as a value --- `done`, `denied`, `budget`, or `stuck` --- never an exception. As a pipeline:

```text
state
  |> build_context
  |> ask_model        (injected: llm_call live, a scripted reply under test)
  |> parse_action     ("READ src/lib.mlpl" -> {tool: "read", path: "src/lib.mlpl"})
  |> guard
  |> authorize        (action + policy -> allow | ask | deny)
  |> execute          (builtin or extension call -> observation)
  |> update_state
```

That is the part I find most interesting about doing this in an array/functional language. A conventional agent accumulates classes --- Agent, Session, Provider, Tool, ToolCall, ToolResult, Permission, ContextManager --- and most of them are containers for state that could just be data. Here an agent is a functional pipeline with feedback, and all of it is in [`agents/loop.mlpl`](https://github.com/sw-ml-study/demo-coding-agent/blob/main/agents/loop.mlpl), about 340 lines.

## The model speaks a tiny text protocol

There is no native tool-calling JSON, on purpose. The model answers with exactly one action in plain text, six verbs:

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

A reply is one string; the parser turns it into a record such as `{tool: "read", path: "src/lib.mlpl"}` or an error naming the reason, and nothing downstream ever sees the raw text again. `PATCH` is pure MLPL over `read_text`, `str_find`, and `write_atomic`: the `OLD` block must occur exactly once, and zero or several occurrences are observations, not edits.

The parser is longer than the loop --- about 410 lines against 340 --- because it has met real models, and each habit it tolerates is pinned by a test: it drops everything from a fabricated `OBSERVATION:` line onward once the action is complete, drops a copied `ACTION:` header, tolerates a blank line before an opening code fence and a fence-only line after `END`, and turns a malformed reply into an observation the model sees on its next turn instead of a crash.

## More constrained than OpenCode

OpenCode is not sandboxed; its permission system is an interaction and awareness layer around powerful shell and filesystem access. mlplcode is more constrained, deliberately, in two layers.

**Mechanism confinement** is not up to the model. Every filesystem builtin is confined by sw-MLPL to the `--source-dir` root and refuses anything that resolves outside it, symlinks included. The Rust extension, `agent-tools`, does only what the language genuinely cannot: search on the ripgrep crates, honoring `.gitignore`, with bounded output; and a runner for exactly `cargo test`, `cargo check`, `cargo clippy`, `cargo fmt`, `git diff`, and `git status`, inside the project root, with a two-minute timeout. The whole extension is about 220 lines of Rust. There is no shell anywhere.

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

`authorize(action, permissions)` is a pure function returning `allow`, `ask`, or `deny`, tested row by row without a model or a filesystem. `RUN` is classified by its first word: `mlpl` stays pure MLPL, `cargo` falls under `run`, `git` under `git`, and anything else is `shell` --- which is denied, and which `shell: "allow"` still refuses, because there is no mechanism underneath it to allow. At a terminal the agent prints the proposed action --- for a WRITE, the whole body --- and approves only `y` or `yes`; with no terminal on stdin it decides no, so a piped or scripted run never writes. A denial ends the run and names the refused action, so the model cannot probe the policy by retrying.

## Watch it code

The task: add `u:mul` and its test to a one-function MLPL project, run the tests, finish when they pass. The model: `qwen2.5-coder:7b`, which fits a 12 GB card, through Ollama on a laptop.

<figure class="no-invert">
<video src="{{ '/assets/videos/coding-agent-loop.mp4' | relative_url }}" autoplay muted loop playsinline preload="auto" aria-label="Terminal recording of mlplcode reading the MLPL example, writing u:mul and its test, running the tests, and finishing"></video>
<figcaption>Six steps: read, write, read, write, run, done. The model replies are replayed from the saved <code>qwen2.5-coder:7b</code> transcript; the parser, the file writes, and the test run happen for real. Recorded with <a href="https://github.com/charmbracelet/vhs">VHS</a>.</figcaption>
</figure>

`READ lib.mlpl`. `WRITE lib.mlpl` with `u:add` kept verbatim and `u:mul` added beneath it. `READ tests/test_add.mlpl`. `WRITE` it back with the includes intact and a second test. `RUN mlpl tests/test_add.mlpl`, which comes back as an observation with one line per test:

```text
status: ok
passed: add sums two numbers
passed: mul multiplies two numbers
```

Then `DONE`. The [transcript](https://github.com/sw-ml-study/demo-coding-agent/blob/main/fixtures/transcripts/mlpl-mul-qwen2.5-coder-7b.txt) is a committed fixture, the example project is restored afterwards, and the same flow is proven offline by a test with a scripted model, so the demo cannot quietly stop working. The recording above is that replay --- `just replay` plays the saved transcript through the real loop in any terminal, no model server needed, and shows the same six steps every time.

## What the model actually did

It took six live attempts to get that clean run, and each attempt changed exactly one thing.

The model wrote a fabricated `OBSERVATION:` block inside its own reply, then declared `DONE` claiming the tests passed when nothing had run. **Three of the six attempts failed that way.** The fix was not a prompt tweak. The loop takes an injected verify function, and `DONE` is accepted only when the transcript contains a successful edit followed by a test run that passed with no failure named; otherwise the model is told `NOT VERIFIED` and keeps working. Without this the demo would lie.

It wrapped file bodies in markdown fences and dropped the `END` line. It copied a concrete example path from the prompt verbatim into every action and spent the whole budget on missing-directory errors. It sent the same failing write three times in a row. Each of those got a tolerance or a guard, with the test written first: fence lines are stripped, a write to a file the run has not read is refused, an identical reply is flagged once and stops the run as `stuck` the third time, and the system prompt lost its worked example and gained `<path>` placeholders. What the failures taught, in one line: a 7B model follows a text protocol only with placeholder examples, a rule against writing its own observations, and a loop that refuses unverified success.

With those in place, the same task against larger models: `devstral:24b` did it in the minimum six steps once the parser learned to drop the `ACTION:` header it echoed, and `devstral-small-2:24b` did the same --- and was the first model to reach for `PATCH` rather than rewriting the file. On a Rust crate, asked to add a unit test and make `cargo test` pass through the extension, Devstral Small 2 took four steps. The 7B model omitted `use super::add`, hit the compile error, and thrashed on stale patches until the budget ended --- a Rust knowledge gap, not a protocol slip, and the guards stopped it at the budget with no false `DONE`.

One run is worth describing. The demo's cleanup had reverted a fixture fix of mine, so the model's first `cargo test` failed with cargo's own message about a stray workspace member. It read `Cargo.toml`, added the empty `[workspace]` table cargo suggested, reran, and passed. A correct repair of a fault that was ours.

And one kept example, because every other demo restores the files it touches. Asked to write a hello-world module and its test from scratch, Devstral Small 2 first invented `//` comments and left `def` off every function, because it had never seen MLPL. Told to read the example project's two files first, it wrote this, and the test passed, in six steps:

```text
# A simple greeting module.

def u:hello(name) {
  "Return a greeting string.";
  str_concat("hello, ", name)
}
```

That is the honest shape of a small model on an unfamiliar language: it imitates what it reads. Give it something to read.

## Tests need no model

`llm_call` needs a running server, so no test calls it. The model is a function passed in, not a client wired in: a live run binds the Ollama host, model name, and system prompt into a one-argument function; a test binds a fixed reply, or an echo function that returns the prompt so the test can assert on exactly what the model would have seen. Eighty-four native mlplunit tests pin the builtins, the parser, the guards, the permission table row by row, and the loop --- every stop reason, the ask decision on both its paths, parse-error recovery, and the whole add-a-function-and-test flow, driven by a scripted transcript model that picks its reply by counting the actions already in the prompt. `just check` never contacts a model server, so a fork without a GPU still gets a green gate.

## Read it as a book

The whole agent is written up as a literate document, [`mlplcode.org`](https://github.com/sw-ml-study/demo-coding-agent/blob/main/docs/mlplcode.org): every MLPL file, function by function, with the prose before each function and the function in an org-babel block that tangles back to the committed source. `just check` proves the tangle matches byte for byte, so the explanation cannot describe code that no longer exists. It opens with a ten-minute MLPL primer whose blocks you can evaluate in place, using sw-MLPL's own org-babel backend, and it exports to [HTML]({{ '/assets/docs/mlplcode.html' | relative_url }}), [PDF]({{ '/assets/docs/mlplcode.pdf' | relative_url }}), text, and Markdown without evaluating anything.

That is also why there is no terminal UI. sw-MLPL runs `#+begin_src mlpl` blocks in Emacs, so the interactive front end is an org file --- a lighter path than a TUI, and one that leaves the whole transcript behind as a document.

Deliberately not here, in OpenCode's terms: TUI, MCP, multiple providers, streaming, subagent concurrency, LSP, GitHub integration, session persistence, embeddings or RAG, automatic context compaction, arbitrary shell access. Each would obscure the experiment more than it would teach.

## What it comes to

Two example projects, one MLPL and one Rust, get a function and a passing test added by a local model through a loop you can read in an afternoon. Everything the model does passes through one authorization function and one verifier, every mechanism is confined by something other than the model's good behavior, every guard exists because a transcript showed it was needed, and every test of the loop runs without a model at all.

One LLM primitive, six verbs, about 850 lines of an array language. The loop is the agent; the rest is policy, and policy is data.

<div class="aside-box wide" markdown="1">

**Where the lines go.** Counted from the repository on the day of publication; *code* excludes blank and comment lines. MLPL has no block comments, so each function's one-line docstring is counted separately.

| What | MLPL code | of which docstrings | Rust code | Notes |
|---|---:|---:|---:|---|
| **The agent** --- `loop`, `protocol`, `tools`, `model` | 946 | 68 | | loop 313 · parser 388 · tools 182 · model injection 63; includes 25 lines of test doubles (`ask_scripted`, `ask_echo`, `decide_yes/no`, `verify_always`) |
| **Essential, net** | **853** | | **220** | the agent minus its docstrings and test doubles; the Rust is the search and allow-listed runner, four files |
| Runners and replay --- `run_loop`, `replay_loop`, `run_replay` | 145 | 4 | | the CLI entry, model warm-up, and the transcript replay behind the recording |
| The v0 lesson --- `v0_read_think`, `run_v0` | 33 | 3 | | read one file, ask once: the smallest possible first proof |
| Tests | 817 | | 83 | 84 mlplunit tests in ten files; one Rust contract test for the extension |
| Probes | 55 | | | five standalone reproducers for the findings ledger |
| Example projects the agent edits | 18 | | | one MLPL function and its test; the Rust crate is two files |
| Prompts | | | | 53 lines of plain text in two files |
| Comments and blanks, all MLPL above | 10 comment · 89 blank | | 31 comment · 41 blank | |

So "1,200 lines" is every line in `agents/`; the loop a reader has to understand is the 853, and nearly as many lines again exist to prove it without a model.

</div>
