---
layout: post
title: "Why I Use #4: My Own Tools, From Finding a Project to Shipping Its README"
categories: [tools, process]
tags: [why-i-use, pjmai-rs, agentrail, reg-rs, sw-checklist, markdown-checker, rust, cli, regression-testing, code-metrics, ai-agents, workflow]
keywords: "why I use pjmai-rs, agentrail, reg-rs, sw-checklist, markdown-checker, developer tools written in Rust, project switching, agent sagas, golden-output regression tests, code metrics ratchet, markdown ASCII check"
abstract: "Fourth in the series on the tools I reach for, and the first about tools I wrote. They work at different levels of the same day: pjmai-rs finds where each project lives on each machine and switches to it; agentrail plans and tracks the work as sagas of steps, through parallel work, reprioritizing and detours; reg-rs builds confidence in every change; sw-checklist reins in bad practice and forces readable, modular code; and markdown-checker keeps a README rendering on GitHub."
series: "Why I Use"
series_part: 4
date: 2026-10-31 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-cli-tools/pjmai-rs"
    title: "pjmai-rs"
  - url: "https://github.com/sw-vibe-coding/agentrail-rs"
    title: "agentrail"
  - url: "https://github.com/sw-cli-tools/reg-rs"
    title: "reg-rs"
  - url: "https://github.com/softwarewrighter/sw-checklist"
    title: "sw-checklist"
  - url: "https://github.com/softwarewrighter/markdown-checker"
    title: "markdown-checker"
---

<!-- DRAFT (2026-10-30), Mike: Why I Use #4, planned 10/31: his own tools at different levels, in this order: pjmai-rs
     (find where each project sits on each development system; scpj adds new repos, lspj lists, chpj switches), agentrail (plan,
     track and document sagas/steps; parallel development, reprioritization, detours), reg-rs (confidence when changing,
     refactoring, fixing, adding features), sw-checklist (reins in bad practice; a forcing function for readable, maintainable,
     extensible, modular, loosely coupled code), and markdown-checker (the main README.md has no characters that keep GitHub from
     rendering it). Facts from each repo's README (gh api, 2026-10-30). The pjmai-rs demo video belongs to earlier posts: linked
     through them, not embedded (no reused media). Lead image: placeholder until Mike supplies one. -->

<img src="{{ '/assets/images/posts/placeholder-why-i-use-my-tools.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The first three posts in this series were about languages. This one is about tools I wrote for myself, and I use them at different levels of the same working day: where is the project, what is the next step, did I break anything, is the code still well built, and will its README display. Each is a small command-line program written in Rust.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **pjmai-rs** | [sw-cli-tools/pjmai-rs](https://github.com/sw-cli-tools/pjmai-rs); [TBT #6](/2026/03/05/tbt-pjmai-rs-project-manager/), [history and fuzzy completion](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/) |
| **agentrail** | [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs); [AI Tools #2](/2026/04/23/ai-tools-agentrail-rs-mid-saga-flexibility/), [Saw #15](/2026/10/18/saw-agentrail-correcting-the-record/) |
| **reg-rs** | [sw-cli-tools/reg-rs](https://github.com/sw-cli-tools/reg-rs); [TBT #7](/2026/03/19/tbt-reg-rs-regression-testing/) |
| **sw-checklist** | [softwarewrighter/sw-checklist](https://github.com/softwarewrighter/sw-checklist); [AI Tools #3](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) |
| **markdown-checker** | [softwarewrighter/markdown-checker](https://github.com/softwarewrighter/markdown-checker) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## pjmai-rs: where is the project?

I develop on several machines, and each has its own set of repositories in its own places. [pjmai-rs](https://github.com/sw-cli-tools/pjmai-rs) keeps a registry of them and hooks into the shell, so I can find where any project sits on the machine I am on and go there:

```text
scpj              # scan for git repositories and add the new ones
lspj              # list every project on this system
chpj myproject    # switch to one
```

It also keeps a navigation history (`hypj`) and completes project names fuzzily. [TBT #6](/2026/03/05/tbt-pjmai-rs-project-manager/) tells where the idea came from.

## agentrail: what is the next step?

Once I am in a project, [agentrail](https://github.com/sw-vibe-coding/agentrail-rs) holds the plan. Work is a *saga* of numbered steps, committed with the code, so the plan, its progress and the record of what each step did live in the repository rather than in a chat that a new context will not remember. It was built to keep AI agents on track across fresh contexts, and it does the same for me.

Plans change, so it has to handle more than a straight line: inserting and reordering steps, reopening one, and taking a detour without losing the thread ([AI Tools #2](/2026/04/23/ai-tools-agentrail-rs-mid-saga-flexibility/)), and, now that several agents often work the same family of repositories at once, recording work done in parallel or somewhere else ([Saw #15](/2026/10/18/saw-agentrail-correcting-the-record/)).

## reg-rs: did I break anything?

[reg-rs](https://github.com/sw-cli-tools/reg-rs) creates, discovers, runs and reports on regression tests: run a command, keep its output as the golden result, and fail when the output changes. That is what lets me change code with confidence, whether a refactoring, a fix or a new feature. For the compilers, interpreters and emulators I build, the output is the specification, and a golden test notices what no unit test thought to ask. It has run under most of what this blog has shown lately, from X_eTaL's hundreds of goldens to the Forth kernel that rebuilds itself. [TBT #7](/2026/03/19/tbt-reg-rs-regression-testing/) traces it from C++ to Java to Rust.

## sw-checklist: is it still well built?

[sw-checklist](https://github.com/softwarewrighter/sw-checklist) reins in bad practice. It checks a project against my standards, including size limits that warn first and then fail:

| Measure | Warns over | Fails over |
|---|---:|---:|
| Lines in a function | 25 | 50 |
| Lines in a file | 350 | 500 |
| Functions in a module | 4 | 7 |
| Modules in a crate | 4 | 7 |
| Crates in a project | 4 | 7 |

The limits are a forcing function. Code that stays under them tends to be readable, maintainable, extensible, modular and loosely coupled, because the only way to grow is to split things along their seams. [AI Tools #3](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) covers how it works as a ratchet on AI coding agents, which otherwise grow functions and files without limit.

## markdown-checker: will the README display?

The smallest of them. [markdown-checker](https://github.com/softwarewrighter/markdown-checker) makes sure a project's main README.md contains only plain, printable characters, so that nothing in it keeps GitHub from rendering the page as intended. The usual offenders are the tree-drawing symbols people paste in to show a directory layout; `markdown-checker --fix` replaces them with ASCII equivalents.

## Five levels, one day
{: .pos-center}

Read in order, they follow a working session: find the project, pick up the plan, change the code without breaking it, keep the code in shape, and publish a README that displays.
