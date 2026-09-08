---
layout: post
title: "AI Tools #4: Pi --- The Minimal Agent That Stays Out of the Way"
date: 2026-05-16 00:15:00 -0700
categories: [llm, agents, tools]
tags: [pi, coding-agents, minimal-agent, local-llm, ollama, mario-zechner, ai-tools]
keywords: "Pi agent, Mario Zechner, minimal coding agent, four tools, local LLM agent, Ollama agent, Gemma, pi web search, coding agents"
author: Software Wrighter
abstract: "Pi is interesting because it does not try to become an IDE, platform, or operating system. After using it with a local Ollama model and one small package, the useful slant is simpler: a minimal agent loop uses the model's available context efficiently, and the lack of ceremony is the feature."
series: "AI Tools"
series_part: 4
repo_url: "https://github.com/badlogic/pi-mono"
---

<img src="{{ '/assets/images/posts/flowers.webp' | relative_url }}" class="post-marker" alt="">

Four tools. Read, Write, Edit, Bash.

That is the part of Pi that looks like a slogan, but after using it the point feels less like minimalism for its own sake and more like friction control. Pi is not trying to become the center of the development environment. It is a small agent loop that can read files, change files, run commands, and leave the rest of the system alone.

My setup makes that especially visible. I use `mosh` from my MacBook to connect to an Arch Linux server, because it survives network hiccups better than plain `ssh`. On that server I log into an unprivileged user account and run `tmux`, which gives me multiple persistent PTYs. One tmux window runs Pi with `gemma4` on an RTX 3090 with 24 GB of VRAM. Another tmux window is just a shell prompt, or sometimes an Emacs shell.

I use the same general pattern for other coding agents: Claude Code, Codex, Gemini, and opencode using the Z.ai dev plan with GLM-5. That makes Pi's shape easier to compare. The machine, project, shell, and tmux workflow stay mostly constant. What changes is how much agent framework shows up before the model starts doing useful work.

That makes Pi a useful counterweight to the current agent-tooling habit of turning every workflow into a platform.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Pi Mono Repo** | [badlogic/pi-mono](https://github.com/badlogic/pi-mono) |
| **Armin's Extensions** | [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff) |
| **Article** | [Pi: The Minimal Agent](https://lucumr.pocoo.org/2026/1/31/pi/) |
| **Lucy short** | [YouTube](https://www.youtube.com/watch?v=wJvmBYTge7U) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Working Shape

My current Pi setup is not a cloud-agent command center. It is a local model, a default thinking level, and one package:

```json
{
  "defaultModel": "gemma4",
  "defaultProvider": "ollama",
  "lastChangelogVersion": "0.74.0",
  "packages": [
    "npm:@ollama/pi-web-search"
  ],
  "defaultThinkingLevel": "medium"
}
```

That lives at:

```text
~/.pi/agent/settings.json
```

<div class="resource-box" style="float: left; margin: 0 1.2em 0.8em 0; max-width: 390px;" markdown="1">

### Motivation

The practical motivation is Lucy, my local AI cluster ([short video](https://www.youtube.com/watch?v=wJvmBYTge7U)). I want local LLMs to take on simpler development tasks without every small question or edit going out to a frontier model.

That does not mean pretending a local model is equivalent to Claude, Codex, Gemini, or GLM-5 on every task. It means finding the band of work where locality, cost, privacy, and iteration speed matter more than maximum model strength.

I have been using opencode for that local-agent lane, and Pi is another experiment in the same direction. The question is not just whether this agent can solve a task. It is whether this agent makes local-model development feel cheap enough and clear enough that I will use it repeatedly.

The longer-term plan is to fine-tune local models so they get better at my specific tasks over time. I want agents that can learn from their mistakes instead of merely forgetting them after the session ends.

</div>

This is the interesting version of Pi to me: not "look how many integrations this has," but "look how little standing machinery needs to be loaded before the model can start doing useful work." A local Ollama model is enough to keep the loop close. One web-search package is enough to give it a narrow escape hatch when local context is not enough. The rest is just the agent doing agent things against the current working directory.

Pi matters in that context because its loop is small enough to observe. If I want to turn agent experience into future training data, I need transcripts and actions that are easy to understand. A minimal agent loop is not just easier for me to debug today; it is cleaner raw material for tomorrow's local learning pipeline.

## Minimal Does Not Mean Weak

The core tool set is boring:

| Tool | Job |
|------|-----|
| **Read** | Inspect files |
| **Write** | Create or replace files |
| **Edit** | Patch existing files |
| **Bash** | Run commands |

Those four operations cover a surprising amount of software work because most coding-agent work eventually becomes:

1. inspect the repo,
2. make a small change,
3. run the command that proves or falsifies it,
4. repeat.

That is not everything an agent might do. It is, however, the irreducible loop under a lot of the tooling we dress up with dashboards, plugin catalogs, project memories, task graphs, and elaborate orchestration.

The point is not that Pi uses a smaller context window. Pi can use whatever context window the selected model supports. The optimization is that Pi spends less of that window on the agent framework itself. More of the model's available attention can go to the repo, the task, the transcript, and the command output that actually matter.

## What Pi Gets Right

Pi's strength is that it does not make the agent feel more magical than it is. The model can read, edit, and run commands. If the result is wrong, the failure is usually visible in the transcript or the filesystem.

That matters. Agent systems become hard to debug when too much behavior is hidden behind framework policy: tool routers, memory layers, implicit plans, autonomous retries, invisible summarizers. Those pieces can be useful, but they also make the system harder to reason about.

Pi's small surface area gives it three practical advantages:

- **Low ceremony**: starting a session does not feel like launching infrastructure.
- **Good failure shape**: when it gets confused, the mistake is usually local.
- **Efficient context use**: the initial context is not crowded by unused capabilities.
- **Easy composition**: additional behavior can live outside the core loop.

That last point is the important one. Minimal systems survive contact with real work when they have an extension path. Pi's philosophy is not "never add capabilities." It is "do not pre-spend context on every capability someone might want someday."

## Local Models Change the Feel

Using Pi with Ollama changes the social contract of the tool. A local model is not always the smartest model in the room, but it is cheap to call, private by default, and always available when the machine is available.

That makes Pi useful for narrower work than I would hand to a frontier coding agent:

- asking it to inspect a small code path,
- generating a first-pass script,
- trying a quick refactor in a disposable branch,
- keeping a local search/edit/run loop warm while I think.

The settings file captures that stance. `gemma4` via `ollama`, medium thinking, one web-search package. Enough help to be useful. Not enough machinery to become a second project.

## OpenClaw Is Context, Not the Headline

Pi is also part of a broader ecosystem. OpenClaw and related experiments build larger agent experiences on top of Pi-style pieces. That is worth mentioning because it proves the core can be embedded.

But for this post, OpenClaw is not the main point. The main point is that Pi itself is a clean reference design for a coding agent:

```text
model + prompt + four tools + transcript + working directory
```

Everything else should have to justify itself.

## The Slant After Using It

Before using Pi, the obvious story is "minimal agent has only four tools." After using it, the better story is "minimal agents preserve mechanical sympathy by treating context as a working budget."

You know what the agent can touch. You know what it can run. You know where configuration lives. You can look at the settings file and understand the operating posture in ten seconds:

- local model,
- local provider,
- medium reasoning effort,
- one explicit package.

That is a better baseline than most agent frameworks provide. A big model context window is still valuable. Pi's advantage is that it does not fill that window with framework overhead before the problem has earned it.

## Key Takeaways

1. **The useful unit is the loop.** Read, edit, run, observe is the center of coding-agent work.

2. **Minimal cores age well.** The less policy hidden in the core, the easier the system is to debug and extend.

3. **Local models are a different workflow, not just a cheaper backend.** Pi plus Ollama makes small, frequent agent use feel natural.

4. **Context efficiency is an optimization, not a constraint.** Pi can use the model's full context when the task calls for it; it simply starts by spending fewer tokens on itself.

5. **Extensions should orbit the core.** Packages and integrations are useful, but they should not make the agent's basic behavior mysterious.

## Resources

- [Pi Mono Repository](https://github.com/badlogic/pi-mono)
- [Armin's Extensions](https://github.com/mitsuhiko/agent-stuff)
- [Pi: The Minimal Agent](https://lucumr.pocoo.org/2026/1/31/pi/)
