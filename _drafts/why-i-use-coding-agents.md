---
layout: post
title: "Why I Use #6: Coding Agents --- Claude Code, Codex, Antigravity and opencode"
categories: [tools, ai-agents]
tags: [why-i-use, ai-agents, coding-agents, claude-code, codex, gemini, antigravity, agy, opencode, z-ai, glm, skills]
keywords: "why I use coding agents, Claude Code, OpenAI Codex, Gemini CLI deprecated, Google Antigravity CLI agy, opencode, Z.ai GLM-5, agent skills, cloud agents, comparing coding agents"
abstract: "Sixth in the series on the tools I reach for: the coding agents. Claude Code, which I have used since 2025, and the others I have worked with alongside it this year: OpenAI's Codex, Google's Gemini CLI, which I preferred the others over, and opencode with Z.ai's GLM models. What each is for in my work, how I run them side by side, and why Gemini's replacement, Antigravity, is worth another try."
series: "Why I Use"
series_part: 6
date: 2026-11-02 00:15:00 -0700
---

<!-- DRAFT (2026-10-30), Mike: #6 on coding agents for 11/02, split from #5 (GNU tools): Claude, Codex, Gemini (now Antigravity),
     and opencode (Z.ai, GLM-5.x). Facts from published posts: TBT #13's AI timeline (Claude 2024-, Claude Code 2025-, Codex /
     Gemini / opencode 2026); AI Tools #4 (the same workflow for Claude Code, Codex, Gemini and opencode with the Z.ai dev plan and
     GLM-5); Saw #6 (All Together Now coordinating Claude Code and opencode/GLM-5 agents); AI Tools #6 (opencode driven against
     local models); AI Tools #8 (opencode + GLM-4.7 in February; Claude Code + Claude Opus 5.5 in October; the domain-expert skill,
     a Gemini skill Mike converted); Saw #16 (Claude in the cloud on several repos).
     Gemini/Antigravity: Mike's note (2026-10-30), CHECKED against the gemini-cli GitHub announcement (discussion #28017) and the
     Flutter docs' Antigravity CLI page, 2026-10-30. Corrections to the note: the June 18, 2026 shutdown was for individual
     accounts (Google AI Pro, Ultra, free tier); Gemini Code Assist enterprise licenses and API-key use were not affected. agy is
     the command; global config stays under ~/.gemini/ (project config under .agents/); the installer copies Gemini CLI skills, MCP
     servers, agents and GEMINI.md files over. Not verified, so not in the text: "Antigravity 2.0", "closed source, written in Go".
     Mike's own reasons are marked "Mike: TODO". Lead image: Mike's block-terminal-ai.jpg (Dropbox), block print of terminals reading codex, opencode,
     claude and agy (fixed 2026-10-30; first version read agv), green text, no-invert. -->

<img src="{{ '/assets/images/posts/block-terminal-ai.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [last post](/2026/11/01/why-i-use-gnu-tools/) in this series was about GNU's tools, which I have used for decades. This one is about the newest row on [my timeline of tools](/2026/10/01/tbt-timelines-of-tools/), and the fastest-moving: coding agents. Claude Code since 2025, and this year Codex, Gemini and opencode beside it, with Gemini's replacement, Antigravity, next to try.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Claude Code** | [claude.com/claude-code](https://claude.com/claude-code) |
| **Codex** | [OpenAI Codex](https://openai.com/codex/) |
| **Antigravity** | [antigravity.google](https://antigravity.google/); the [Gemini CLI shutdown notice](https://github.com/google-gemini/gemini-cli/discussions/28017) |
| **opencode** | [opencode.ai](https://opencode.ai); models from [Z.ai](https://z.ai) |
| **Earlier posts** | [AI Tools: every post](/series/#ai-tools) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One workflow, several agents

I run every agent the same way: the same machine, the same project, the same shell and tmux session, so what changes between them is the agent and not the setup ([AI Tools #4](/2026/05/16/pi-minimal-agent/)). That makes them easier to compare, and it lets several work at once. [All Together Now](/2026/04/12/saw-agent-coordination-fuzzit-vendoring/) coordinated Claude Code and opencode agents in one web UI, and the agents now work on Arch Linux machines, one user per agent.

## Claude Code

Claude Code is the one I have used longest, since 2025, and the one I use most. It was the agent that restarted the stuck sound-effects project in [AI Tools #8](/2026/10/29/ai-tools-domain-expert-skill/), where February's attempt with another agent had stalled, and Claude in the cloud worked on several repositories at once to move [the Reva and CoSy forks](/2026/10/25/saw-reva-fork-cosy/) over one weekend. Two things matter most in how I use it now: skills, sets of instructions an agent loads for one kind of task, and agents running in the cloud in parallel.

Mike: TODO, why Claude Code is the one you use most, in your words.

## Codex

OpenAI's coding agent, which I have used this year alongside the others.

Mike: TODO, what you use Codex for, and how it compares.

## Gemini, now Antigravity

I have used the Gemini CLI in the past, but preferred the other CLIs over it. Now Google has replaced it with Antigravity, and I plan to try it again. On June 18, 2026 the Gemini CLI [stopped serving requests](https://github.com/google-gemini/gemini-cli/discussions/28017) for individual accounts (Google AI Pro, Google AI Ultra and the free tier), with the Antigravity CLI as its replacement. Enterprise Gemini Code Assist licenses and API-key use were not affected.

What that means in practice:

- **The command is `agy`,** not `gemini`. Scripts and CI jobs that call `gemini` need changing.
- **The configuration mostly carried over.** Antigravity's installer finds the Gemini CLI directory and copies its skills, MCP servers, agents and `GEMINI.md` files across, and its global configuration still lives under `~/.gemini/`; per-project configuration moves to an `.agents/` directory.
- **It is an agent, not a wrapper.** The new CLI shares its agent harness with Google's Antigravity desktop platform and runs multi-step work, tests and skills in the shell.

The models underneath are still Gemini.

## opencode, with Z.ai's GLM

[opencode](https://opencode.ai) is the open one: an agent that can drive many models. I use it with [Z.ai](https://z.ai)'s GLM models on its developer plan. It wrote the first attempt at the sound-effects project with GLM-4.7 in February, it ran beside Claude Code under All Together Now with GLM-5, and because it can point at any model, it is the harness I used to test [local models in a plan, execute and review loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/). It is also the architectural reference for [the coding agent I wrote in MLPL](/2026/09/16/ai-tools-coding-agent-in-mlpl/).

Mike: TODO, why opencode and GLM (cost, openness, local models?), and which GLM-5.x you use now.

## How I choose
{: .pos-center}

Mike: TODO, a closing in your words: which agent for which kind of work, or why you keep several.
