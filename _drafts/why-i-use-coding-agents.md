---
layout: post
title: "Why I Use #6: Coding Agents --- Claude Code, Codex, Antigravity and OpenCode"
categories: [tools, ai-agents]
tags: [why-i-use, ai-agents, coding-agents, claude-code, codex, gemini, antigravity, agy, opencode, z-ai, glm, skills]
keywords: "why I use coding agents, Claude Code, OpenAI Codex, Gemini CLI deprecated, Google Antigravity CLI agy, OpenCode, Z.ai GLM-5, agent skills, cloud agents, comparing coding agents"
abstract: "Sixth in the series on the tools I reach for: the coding agents. Claude Code, which I have used since 2025, and the others I have worked with alongside it this year: OpenAI's Codex, Google's Gemini CLI, which I preferred the others over, and OpenCode with Z.ai's GLM models. What each is for in my work, how I run them side by side, and why Gemini CLI's replacement, Antigravity, has earned another try."
series: "Why I Use"
series_part: 6
date: 2026-11-02 00:15:00 -0800
---

<!-- DRAFT (2026-10-30), Mike: #6 on coding agents for 11/02, split from #5 (GNU tools): Claude, Codex, Gemini (now Antigravity),
     and opencode (Z.ai, GLM-5.x). Facts from published posts: TBT #13's AI timeline (Claude 2024-, Claude Code 2025-, Codex /
     Gemini / opencode 2026); AI Tools #4 (the same workflow for Claude Code, Codex, Gemini and opencode with the Z.ai dev plan and
     GLM-5); Saw #6 (All Together Now coordinating Claude Code and opencode/GLM-5 agents); AI Tools #6 (opencode driven against
     local models); AI Tools #8 (opencode + GLM-4.7 in February; Claude Code + Claude Opus 5.5 in October; the domain-expert skill,
     a Gemini skill Mike converted); Saw #16 (Claude in the cloud on several repos).
     Rust puzzle: Mike (2026-10-30): a private Rust puzzle he uses to evaluate open-weight models; Antigravity solved it where many
     open models cannot. Not published: do not describe or link it.
     Gemini/Antigravity: Mike's note (2026-10-30), CHECKED against the gemini-cli GitHub announcement (discussion #28017) and the
     Flutter docs' Antigravity CLI page, 2026-10-30. Corrections to the note: the June 18, 2026 shutdown was for individual
     accounts (Google AI Pro, Ultra, free tier); Gemini Code Assist enterprise licenses and API-key use were not affected. agy is
     the command; global config stays under ~/.gemini/ (project config under .agents/); the installer copies Gemini CLI skills, MCP
     servers, agents and GEMINI.md files over. Not verified, so not in the text: "Antigravity 2.0", "closed source, written in Go".
     Mike's reasons filled 2026-11-02 from his message (ChatGPT web for research/architecture/planning; Claude Code for most implementation;
     Codex for non-coding: blogging, flashing microcontrollers, lab equipment over USB (he wrote "SICP?": SCPI assumed), embedded;
     opencode + GLM-5.x for junior coding, web sites, GitHub commit/PR tracking, some vibe-maintenance; no local models in production;
     planned local agent team; Local GPU section (Mike, 2026-11-02): tasks and models as he listed; TRELLIS (Microsoft caps), Whisper, SpeechT5, Stable
     Diffusion, VibeVoice, MuseTalk checked on GitHub / Hugging Face; image-to-video: Wan 2.x (Mike; project spells it Wan, e.g. Wan2.2). NightCafe section per Mike 2026-11-02 (Nano
     Banana 2.1, consistent characters, community and custom templates); no claim about which blog images came from it. FreeToken, Strata, Avalon named by Mike; checked 2026-11-02 by web search, spellings as written). Lead image: Mike's block-terminal-ai.jpg (Dropbox), block print of terminals reading codex, opencode,
     claude and agy (fixed 2026-10-30; first version read agv), green text, no-invert. -->

<img src="{{ '/assets/images/posts/block-terminal-ai.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [prior post](/2026/11/01/why-i-use-gnu-tools/) in this series was about GNU's tools, which I have used for decades. This one is about the newest row on [my timeline of tools](/2026/10/01/tbt-timelines-of-tools/), and the fastest-moving: coding agents. Claude Code since 2025, and this year Codex, Gemini and OpenCode beside it, with Gemini CLI's replacement, Antigravity, now getting another try.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Claude Code** | [claude.com/claude-code](https://claude.com/claude-code) |
| **Codex** | [OpenAI Codex](https://openai.com/codex/) |
| **Antigravity** | [antigravity.google](https://antigravity.google/); the [Gemini CLI shutdown notice](https://github.com/google-gemini/gemini-cli/discussions/28017) |
| **OpenCode** | [OpenCode.ai](https://opencode.ai); models from [Z.ai](https://z.ai) |
| **Earlier posts** | [AI Tools: every post](/series/#ai-tools) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One workflow, several agents

I run every agent the same way: the same machine, the same project, the same shell and tmux session, so what changes between them is the agent and not the setup ([AI Tools #4](/2026/05/16/pi-minimal-agent/)). That makes them easier to compare, and it lets several work at once. [All Together Now](/2026/04/12/saw-agent-coordination-fuzzit-vendoring/) coordinated Claude Code and OpenCode agents in one web UI, and the agents now work on Arch Linux machines, one user per agent.

## Claude Code

Claude Code is the one I have used longest, since 2025, and the one I use most. It was the agent that restarted the stuck sound-effects project in [AI Tools #8](/2026/10/29/ai-tools-domain-expert-skill/), where February's attempt with another agent had stalled, and Claude in the cloud worked on several repositories at once to move [the Reva and CoSy forks](/2026/10/25/saw-reva-fork-cosy/) over one weekend. Two things matter most in how I use it now: skills, sets of instructions an agent loads for one kind of task, and agents running in the cloud in parallel.

I use Claude Code to implement most of my software projects.

## Codex

<div class="aside-box outdent-right wide" markdown="1">

**What is SCPI?** Standard Commands for Programmable Instruments, a text command language for test and measurement equipment, defined in 1990 on top of the IEEE 488.2 standard. Power supplies, function generators, oscilloscopes and multimeters from most vendors accept it, over USB, Ethernet, GPIB or a serial port. Commands are short words in a tree, each instrument adds its own branches, and a question mark turns a command into a query.

</div>

OpenAI's coding agent, the command-line side of ChatGPT. I use Codex for work that is not mainly coding. Blogging is one, sometimes split between Claude and Codex. Hardware is another: flashing microcontrollers, developing embedded software, and talking to lab equipment over USB with SCPI commands. Codex sets up the bench from a script:

- **power supply:** voltage, current limit and output, such as `VOLT 3.3`, `CURR 0.5`, `OUTP ON`
- **function generator:** waveform, frequency and amplitude, such as `FUNC SQU`, `FREQ 1000`, `VOLT 2`
- **oscilloscope:** time base, channel scale and trigger level, such as `:TIM:SCAL 0.001`, `:CHAN1:SCAL 1`, `:TRIG:EDGE:LEV 1.5`
- **multimeter:** a reading, such as `MEAS:VOLT:DC?`

Those are typical forms; each instrument's exact commands are in its programming manual, and `*IDN?` asks any of them which instrument it is.

## Gemini, now Antigravity

I have used the Gemini CLI in the past, but preferred the other CLIs over it. Now Google has replaced it with Antigravity, and I am trying it again. It has already passed one test that matters to me: I keep a Rust puzzle, which I have not published, that I use to evaluate open-weight models, and Antigravity solved it where many open models cannot. On June 18, 2026 the Gemini CLI [stopped serving requests](https://github.com/google-gemini/gemini-cli/discussions/28017) for individual accounts (Google AI Pro, Google AI Ultra and the free tier), with the Antigravity CLI as its replacement. Enterprise Gemini Code Assist licenses and API-key use were not affected.

What that means in practice:

- **The command is `agy`,** not `gemini`. Scripts and CI jobs that call `gemini` need changing.
- **The configuration mostly carried over.** Antigravity's installer finds the Gemini CLI directory and copies its skills, MCP servers, agents and `GEMINI.md` files across, and its global configuration still lives under `~/.gemini/`; per-project configuration moves to an `.agents/` directory.
- **It is an agent, not a wrapper.** The new CLI shares its agent harness with Google's Antigravity desktop platform and runs multi-step work, tests and skills in the shell.

The models underneath are still Gemini.

## OpenCode, with Z.ai's GLM

[OpenCode](https://opencode.ai) is the open one: an agent that can drive many models. I use it with [Z.ai](https://z.ai)'s GLM models on its developer plan. It wrote the first attempt at the sound-effects project with GLM-4.7 in February, it ran beside Claude Code under All Together Now with GLM-5, and because it can point at any model, it is the harness I used to test [local models in a plan, execute and review loop](/2026/09/09/ai-tools-local-llm-loop-model-evaluation/). It is also the architectural reference for [the coding agent I wrote in MLPL](/2026/09/16/ai-tools-coding-agent-in-mlpl/).

Today I use OpenCode with Z.ai's GLM-5.x models for junior coding tasks, for updating web sites, for keeping track of GitHub commits and pull requests, and sometimes for [vibe-maintenance](/2026/04/29/personal-software-vibe-maintenance/).

## What my local GPUs do now
{: .pos-left}

Local models do plenty of other work for me, just not coding yet. I download open-weight models from [Hugging Face](https://huggingface.co) and run each on whichever of my GPUs has enough VRAM for it:

| Task | Model |
|---|---|
| Text to image | [Stable Diffusion](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) (Stability AI) |
| Image to 3D model | [TRELLIS](https://github.com/microsoft/TRELLIS) (Microsoft) |
| Speech to text | [Whisper](https://github.com/openai/whisper) (OpenAI) |
| Text to speech | [SpeechT5](https://github.com/microsoft/SpeechT5) and [VibeVoice](https://github.com/microsoft/VibeVoice) (Microsoft) |
| Voice cloning | VibeVoice, from a short voice sample |
| Lip-syncing a face to speech | [MuseTalk](https://github.com/TMElyralab/MuseTalk) (Tencent Music's Lyra Lab) |
| Image to video | [Wan 2.x](https://github.com/Wan-Video/Wan2.2) (Alibaba) |

## NightCafe, in the cloud
{: .pos-right}

For images and video I also use [NightCafe](https://creator.nightcafe.studio/explore), a site that hosts many, many image and video models in the cloud. I use it for text to image, image editing and image to video, and Nano Banana 2.1 most of all. Two of its features matter to me: consistent characters, which keep the same character across many images, and templates, both the community's and custom ones of my own.

## How I choose
{: .pos-center}

I have no measurements to justify these choices. They are what I have settled into:

| For | I use |
|---|---|
| Research, architecture, high-level planning | ChatGPT, on the web |
| Implementing most software projects | Claude Code |
| Non-coding work, blogging (shared with Claude), hardware and embedded work | Codex |
| Junior coding tasks, web site updates, GitHub commit and pull-request tracking, some maintenance | OpenCode with GLM-5.x |
| Trying again, after it passed my Rust puzzle | Antigravity |

I still do not rely on local models to produce code or documentation. But I am still planning a local team of AI coding agents running on distributed local CPUs, and it is closer than it was: recent work such as [FreeToken](https://arxiv.org/abs/2608.16157), [Strata](https://simeononsecurity.com/articles/strata-opencode-local-coding-agent-16gb/) and [Avalon](https://github.com/freriadoc/Avalon) lets decent coding models, built on mixture-of-experts and speculative decoding, run on the smaller GPUs I have. I expect to use it for toy projects first, and then perhaps for daily development.

The goal for that team is that it gets better. I want the local agents to learn from feedback nightly, by fine-tuning on the day's work, toward a self-improving virtual development team. Someday that learning may move from nightly postmortems to continuous learning, the subject of my [Towards Continuous LLM Learning](/series/#towards-continuous-llm-learning) series.
