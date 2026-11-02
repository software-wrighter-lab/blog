---
layout: post
title: "AI Tools #9: Emacs as an AI Client --- a Gateway and an Agent"
categories: [ai-tools, emacs]
tags: [ai-tools, emacs, elisp, gptel, litellm, llm-gateway, mcp, coding-agents, org-mode, rust, ollama, llama-cpp, local-llm]
keywords: "Emacs AI client, gptel, LiteLLM gateway, LLM cost budgets, Emacs MCP server, Emacs coding agent, emacs-agent, org-mode transcripts, Rust CLI tools, local models in Emacs, Ollama, llama.cpp"
abstract: "Since 2025 Emacs has been one of my AI clients. Two projects make it work. emacs-ai-api puts every model, cloud or local, behind one gateway, with per-project budgets, cost tracking, Rust command-line tools and MCP tool servers, and points Emacs's gptel at it. emacs-agent goes further: a coding agent inside Emacs that keeps every conversation as an Org transcript, so nothing is lost when a context fills up."
series: "AI Tools"
series_part: 9
date: 2026-11-04 00:15:00 -0800
video_url: "https://www.youtube.com/watch?v=e1OoixGDMXs"
video_title: "Emacs MCP Server implementation/discussion"
repo_urls:
  - url: "https://github.com/softwarewrighter/emacs-ai-api"
    title: "emacs-ai-api"
  - url: "https://github.com/softwarewrighter/emacs-agent"
    title: "emacs-agent"
---

<!-- DRAFT (2026-11-02), Mike: "emacs-ai-api, emacs-agent ... not yet blogged about, maybe create a draft post for these -- which
     series? or a new emacs series?" Series: AI Tools (#9), since both are agent tooling; a new Emacs series is the alternative.
     Facts from the READMEs: emacs-ai-api (2025-08 to 2026-01; LiteLLM gateway; OpenAI, Anthropic, Gemini, DeepSeek, Ollama,
     llama.cpp; per-project budgets with virtual keys; gptel config; MCP incl. Playwright and Rust servers; Rust CLIs llm-status,
     llm-history, llm-costs, llm-stats, llm-config; GPL-3.0 with a dual-licensed Rust component; video e1OoixGDMXs, Software
     Wrighter channel, not used in any other post). emacs-agent (2025-09 to 2025-11): elisp front end, Rust back end
     (open_agent_cli_fork) under development, working elisp-only Gemini MCP prototype, org-mode transcripts, TOON format claims
     60% fewer tokens (the README's figure, not measured here); LESSONS_LEARNED.md. Mike: TODO marks his own words/status.
     Lead image: Mike's Emacs Dired screenshot (2026-11-02), top row cropped, no-invert. -->

<img src="{{ '/assets/images/posts/emacs-dired-home.webp' | relative_url }}" class="post-marker no-invert" alt="An Emacs Dired buffer listing a home directory" style="width: 205px;">

[Why I Use #5](/2026/11/01/why-i-use-gnu-tools/) mentioned that since 2025 I have also used Emacs as an AI client. This post is how: two projects, a gateway that gives Emacs one door to every model, and an agent that lives inside Emacs.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The gateway** | [emacs-ai-api](https://github.com/softwarewrighter/emacs-ai-api) |
| **The agent** | [emacs-agent](https://github.com/softwarewrighter/emacs-agent) |
| **Video** | [Emacs MCP Server implementation/discussion](https://www.youtube.com/watch?v=e1OoixGDMXs)<br>[![Video](https://img.youtube.com/vi/e1OoixGDMXs/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=e1OoixGDMXs) |
| **The series** | [AI Tools: every post](/series/#ai-tools) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One gateway for every model

[emacs-ai-api](https://github.com/softwarewrighter/emacs-ai-api) puts every model I use behind a single endpoint, using LiteLLM: OpenAI, Anthropic, Google Gemini and DeepSeek in the cloud, and local models through Ollama and llama.cpp. Emacs talks to that one endpoint through [gptel](https://github.com/karthink/gptel), with a configuration for switching between back ends.

Because every request goes through the gateway, it can keep score:

- **per-project budgets,** each project with its own virtual key, so one experiment cannot spend another's money;
- **Rust command-line tools** to check each provider's status and review usage history, costs and statistics;
- **MCP servers,** so models can use tools, among them Playwright for the browser and servers of my own written in Rust.

Mike: TODO, how you use it day to day (which models through it, and whether the budgets have caught anything).

## An agent inside Emacs

Chat in Emacs is easy with gptel. [emacs-agent](https://github.com/softwarewrighter/emacs-agent) aims at more: a coding agent that works in Emacs buffers rather than a terminal, with file operations, git, MCP tools and several agents at once, and that keeps every conversation, saved to disk as an Org transcript, so nothing is lost when a context fills up. Its design pairs an Emacs Lisp front end with a Rust back end, a fork of an open agent CLI; today the working prototype is Emacs Lisp alone, talking to Gemini, with the Rust back end in progress.

Building it taught some lessons worth keeping, written up in the repository: a model remembers nothing between calls, so the client must resend the system prompt, the tools and any context every time; and a user can suggest a tool, but the model decides whether to use it.

Mike: TODO, where emacs-agent stands now, and whether it, mlplcode and an X_eTaL agent will meet.

## Why Emacs
{: .pos-center}

Mike: TODO, why Emacs as the client rather than a terminal agent (Org transcripts, literate programming, staying in one tool?).
