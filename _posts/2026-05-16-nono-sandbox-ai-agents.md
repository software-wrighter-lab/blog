---
layout: post
title: "AI Tools #5: nono --- Sandboxing Pi Without Breaking the Loop"
date: 2026-05-16 00:15:00 -0700
categories: [security, agents, tools]
tags: [nono, pi, ollama, gemma, qwen, mistral, sandboxing, landlock, seatbelt, ai-agents, local-llm]
keywords: "nono sandbox, Pi agent, Ollama, Gemma, Qwen, Mistral, local LLM agents, Landlock, Seatbelt, AI agent security, kernel sandbox"
author: Software Wrighter
abstract: "nono is attractive because AI coding agents need real boundaries, but making nono, Pi, Ollama, and local models work together took iteration. The usable shape was not to wrap every layer. It was to sandbox Pi, let Pi call Ollama, and then find models that actually act instead of merely describing what they plan to do."
series: "AI Tools"
series_part: 5
repo_url: "https://github.com/lukehinds/nono"
---

<img src="{{ '/assets/images/posts/nature-mural.webp' | relative_url }}" class="post-marker" alt="">

The promise of nono is simple: give an AI coding agent a real sandbox. Not a prompt-level warning. Not a policy reminder. A kernel-enforced boundary around what the process can read, write, delete, and contact.

That is exactly the kind of tool I want in the local-agent workflow from the Pi post. I am running agents on Lucy, my local AI cluster, through `mosh`, `tmux`, unprivileged user accounts, and local models. If those agents are going to edit code and run commands, they need boundaries that do not depend on the model being obedient.

But the path to a usable setup was not "install nono, run Pi, done." It took a while to find a working combination of nono, Pi, Ollama, and an LLM that could do useful work without getting wedged.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **nono website** | [nono.sh](https://nono.sh/) |
| **nono code** | [lukehinds/nono](https://github.com/lukehinds/nono) |
| **nono docs** | [docs.nono.sh](https://docs.nono.sh) |
| **Pi repo** | [badlogic/pi-mono](https://github.com/badlogic/pi-mono) |
| **Lucy short** | [YouTube](https://www.youtube.com/watch?v=wJvmBYTge7U) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Goal

The goal was not theoretical sandbox purity. It was more practical:

1. run Pi inside a constrained environment,
2. let Pi use Ollama for a local model,
3. allow enough filesystem access for useful development,
4. prevent obvious damage or secret exposure,
5. keep the loop small enough that failures are understandable.

That last point matters. Sandboxing an agent is not useful if the agent becomes too constrained to act, too confused to use its tools, or too wrapped in indirection to debug.

## The Iteration Tax

The first cost was permission tuning.

nono is a capability boundary. That is the point. But agent work is full of little side effects: reading project files, writing scratch files, running commands, following symlinks, touching caches, calling helper binaries, connecting to a local model server, and sometimes discovering that the next thing it needs is outside the allowlist.

That creates a tuning loop:

```text
run agent
watch it fail
inspect what was denied
adjust permissions
run again
```

<div class="resource-box" style="float: left; margin: 0 1.2em 0.8em 0; max-width: 390px;" markdown="1">

### Motivation

Recently I have had several experiences where a model --- Claude, Gemma4 --- unilaterally decided to remove a file or directory it did not understand.

That is astonishingly cavalier when the target was recently created and not yet tracked by git. There is no easy reflog recovery for a directory that never made it into the repository.

The contrast is strange: Claude constantly asks permission for simple, undoable things, but a model can still destroy local work if the command gets through. That starts to feel like security theater: prompts that throttle usage by causing more round trips, not structural safety.

I considered putting an rm wrapper earlier in PATH that just says no. But what stops a model from running /usr/bin/rm directly?

**nono does.**

</div>

Some failures are good. They prove the sandbox is doing its job. Other failures are friction: the agent cannot reach the local service it needs, cannot write where the tool expects, or gets confused by an environment that is almost but not quite normal.

This is where nono gets real. The hard part is not believing in sandboxing. The hard part is finding the permission set that is narrow enough to matter and wide enough to work.

## When Models Talk Instead of Act

The second cost was model behavior.

I repeatedly hit a local-model failure mode where the model would describe what it was going to do instead of actually doing it. It would outline a plan, explain the next command, or narrate the intended edit, but not drive the tool loop forward, even after repeated cajoling to just do it.

That is a different problem from sandboxing. nono can enforce filesystem and process boundaries, but it cannot make a weak model become an effective coding agent. If the model does not reliably convert intent into tool calls, the safest sandbox in the world just protects a process that is not doing much.

That distinction is important:

| Failure | Layer |
|---------|-------|
| Cannot read/write needed path | Sandbox permissions |
| Cannot reach Ollama | Process/network/environment shape |
| Describes the plan but does not act | Model/tool-use behavior |
| Makes bad edits | Model capability or task fit |

The debugging loop has to identify which layer is failing. Otherwise every problem looks like a nono problem.

## The Wrapper That Did Not Work

Along the way, an AI suggested a clever-looking approach: use nono to run a Pi-aware Ollama command.

That sounded plausible. Put the model invocation itself inside the sandbox-aware command path. Make the pieces explicitly aware of each other. More integration should mean more control, right?

In practice, that seemed to cause problems. The extra wrapping made it harder to reason about who was responsible for what. Was nono constraining Pi? Was it constraining Ollama? Was Pi talking to the model server in the expected way? Was the model command itself now part of the agent's tool surface?

The better shape was simpler:

```text
nono runs Pi
Pi calls Ollama
Ollama serves the model
```

That preserves the boundary where I actually wanted it: around the agent process and its filesystem behavior. Ollama remains the model service. Pi remains the agent loop. nono remains the sandbox.

## The Usable Shape

The most usable setup so far is:

- run Pi under nono,
- let Pi call Ollama normally,
- use `gemma4`,
- keep the permissions narrow but not theatrical,
- iterate on the deny/fail cases until the agent can actually work.

`gemma4` worked better for me than the Qwen and Mistral models I tried in this workflow. That is not a universal benchmark result. It is a practical observation from this setup: nono plus Pi plus Ollama needs a model that can keep the tool loop moving.

This also changes what "model evaluation" means. I do not only care whether a model can answer coding questions. I care whether it can participate in a constrained edit/run/debug loop:

- does it use tools instead of only describing tools?
- does it recover from denied access?
- does it ask for narrower permission changes or thrash?
- does it keep edits small enough to inspect?
- does it learn from command output within the session?

Those are agent-behavior questions, not just language-model questions.

## The Model Search Is Part of the Work

I probably need to try many models before finding the right local-agent set.

There are two different targets:

1. models that perform useful tasks out of the box,
2. models that are small enough, regular enough, and steerable enough to fine-tune.

The first target is about immediate productivity. The second is about Lucy's longer-term role: local models that get better at my repos, my tools, and my recurring failure modes over time.

That may point toward smaller models, not because smaller is automatically better, but because smaller models are more practical to iterate on locally. A model that is slightly weaker out of the box but easier to fine-tune may be more valuable than a stronger local model that is too expensive to adapt.

## Small Models, More Attempts

There is also an inference-time angle.

Some problems do not require one perfect answer from one large model. They can be attacked by repeated attempts from a smaller model, especially when there is a verifier: tests, type checks, linters, golden outputs, or a human reviewing a small diff.

That is the same broad lesson as the repeated-sampling work I wrote about in [Large-Language-Monkeys](/2026/04/24/large-language-monkeys-scaling-inference/): a smaller model plus multiple attempts plus a verifier can sometimes match or beat a larger one-shot model.

For local agents, the tradeoff becomes concrete:

| Approach | Likely tradeoff |
|----------|-----------------|
| Large model, one attempt | faster wall-clock, higher per-call cost |
| Small model, many attempts | slower wall-clock, possibly lower energy/cost |
| Small model, fine-tuned over time | upfront training work, better local fit |

The energy question is not automatic. A small model looping badly can waste time and power. But a small model that makes cheap attempts against a good verifier may be the better local computation shape.

That is why nono matters here. If I am going to let smaller local models iterate, fail, and try again, I want the iteration loop to happen inside a boundary.

## What nono Is Really Buying

nono is not making the model smarter. It is making the experiment safer.

That safety changes what I am willing to try. I can give an agent a real shell and a real project while still narrowing the blast radius. I can test local models that may be clumsy. I can preserve transcripts and failures for later training. I can let the loop run longer without treating every mistake as a potential catastrophe.

That is the practical value: sandboxing turns local-agent experimentation from reckless into routine.

## Key Takeaways

1. **Sandboxing is an integration problem, not just a security checkbox.** The permissions have to match the agent's real workflow.

2. **The cleanest setup was layered, not clever.** nono runs Pi; Pi calls Ollama; Ollama serves the model.

3. **Model behavior dominates quickly.** Some models plan instead of act, and sandboxing cannot fix that.

4. **The account boundary matters too.** I am combining unprivileged Linux accounts, one agent per repo, with nono so the system prevents actual errors my LLMs repeatedly make: no more erasing files without recourse, no more multiple agents modifying the same repo without coordination, and push access only from a coordinator-agent account.

5. **Gemma4 was the most usable of the models I tried in this loop.** Qwen and Mistral were less effective in this particular setup.

6. **The long game is local learning.** Sandboxed, observable agent runs can become the raw material for fine-tuning models that learn from repeated mistakes.

## Resources

- [nono Website](https://nono.sh/)
- [nono GitHub Repository](https://github.com/lukehinds/nono)
- [nono Documentation](https://docs.nono.sh)
- [Pi Mono Repository](https://github.com/badlogic/pi-mono)
