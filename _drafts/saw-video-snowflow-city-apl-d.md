---
layout: post
title: "Saw #19: agentrail Stops Filling Repositories, and More"
categories: [tools]
tags: [sharpen-the-saw, agentrail, git, x-etal, xetal, video, console-3d, apl, sw-apl, ibm-pc, procedural, city, machine-learning, fine-tuning]
keywords: "Sharpen the Saw, X_eTaL-video, snowflow, console-3D, sw-apl, IBM PC APL, procedural city, X_eTaL-extensions, X_eTaL-ML, X_eTaL-fine-tuning"
abstract: "Mike: TODO, the abstract once the sections are written."
series: "Sharpen the Saw Sundays"
series_part: 19
date: 2026-11-15 00:15:00 -0800
---

<!-- DRAFT (2026-11-14), Mike: Saw for Sunday 11/15 covering X_eTaL-video, snowflow_demo-fork, console-3D, sw-apl moving from
     demo C to demo D, X_eTaL-extensions' procedural interactive city, and progress in X_eTaL-ML and X_eTaL-fine-tuning.
     SKELETON: facts being gathered. Lead image: Mike's block-lumberjack.jpg (Dropbox, 2026-11-14), no-invert. -->

<img src="{{ '/assets/images/posts/block-lumberjack.webp' | relative_url }}" class="post-marker no-invert" alt="A block print of a lumberjack in a plaid shirt and knit cap cutting through a fallen log with a chainsaw, in a sunlit forest" style="width: 205px;">

Mike: TODO (being researched): an intro.

<!--more-->

## agentrail: session logs out of the repository

[agentrail](https://github.com/sw-vibe-coding/agentrail-rs) keeps an agent's plan, steps and history in the repository it works on, under `.agentrail/`. It also used to keep a snapshot of the agent's whole conversation there, a Claude Code JSONL log saved with every completed step, and that was a long-standing problem. A log quotes every file the agent read and only grows, so committing it with each step stored the whole log again every time, filled the repository with large files nobody needed, and published content that was never meant to be shared.

The fix moves session logs out of the repository, to `~/.agentrail/sessions/` in the user's home directory, one folder per repository. `agentrail complete` still snapshots the log, just not into git. For repositories that already have logs committed, `agentrail sessions migrate` moves them out and stops tracking them. And a new size guard, `agentrail check-size`, which also runs on `next`, `status` and `complete`, warns at 10 MiB and fails at 95 MiB for any file under `.agentrail/` that would be committed, before GitHub's 100 MB limit refuses a push.

Mike: TODO, how long it had bothered you, or how big the repos had grown, if you want to say.

## X_eTaL video

Mike: TODO (being researched).

## Snowflow

Mike: TODO (being researched).

## console-3D

Mike: TODO (being researched).

## APL, from C'80 to D'83

Mike: TODO (being researched).

## A procedural city

Mike: TODO (being researched).

## X_eTaL-ML and fine-tuning

Mike: TODO (being researched).

## Closing

Mike: TODO, a closing in your words.
