---
layout: post
title: "AI Tools #2: AgentRail Mid-Saga --- Insert, Reorder, Reopen, Recover"
date: 2026-04-23 00:15:00 -0700
categories: [ai-agents, cli-tools, rust]
tags: [ai-tools, agentrail, rust, cli, ai-agents, vibe-coding, dogfooding, workflow, saga, parallel-development]
keywords: "agentrail, AgentRail, mid-saga, insert, reorder, reopen, audit, snapshot, archive, maintenance mode, AI coding agents, parallel development, saga workflow, dogfooding, git history, recovery, ICRL, Rust CLI, AI Tools"
author: Software Wrighter
abstract: "Sagas assume linear plans. Daily use across parallel repos assumes surprises. The April AgentRail features --- insert/reorder/reopen, audit/snapshot, maintenance mode --- are what you only design after you actually live with the tool."
series: "AI Tools"
series_part: 2
repo_url: "https://github.com/sw-vibe-coding/agentrail-rs"
---

<img src="{{ '/assets/images/posts/block-switchyard.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 240px;">

<div style="overflow: hidden;" markdown="1">

AgentRail's Phase 0--5 feature list looked complete on paper. Then I started running it every day, across parallel repos, and every real-world friction point produced a new command. This post is a tour of what daily use teaches you that planning doesn't.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Daily-use repos** | [sw-embed](https://github.com/orgs/sw-embed/repositories) · [sw-vibe-coding](https://github.com/orgs/sw-vibe-coding/repositories) · [sw-ml-study](https://github.com/orgs/sw-ml-study/repositories) |
| **Prior posts** | [AI Tools #1: XSkill](/2026/03/17/ai-tools-xskill-memory-layer-multimodal-agents/)<br>[Saw #3: agentrail-rs Dual Memory](/2026/03/22/saw-agentrail-rs-icrl-dual-memory/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Plan-Bending Problem

A saga is a linear sequence of steps: plan it, walk it, finish it. That model works when the plan survives contact with reality. Two things tend to ruin it:

- **A dependent repo breaks** halfway through step 5. You need to bounce over, fix it, and come back --- without abandoning the saga you were in.
- **A step reveals a flaw in a later step.** Step 3 uncovers something that means step 7 has to change, or needs to happen *before* step 4, or needs to be re-done after you thought it was done.

With only `begin` / `complete`, the options are bad: abandon the saga and re-plan, or pretend the detour didn't happen and let the plan drift out of sync with what you actually did. Neither preserves the thing sagas are for: a faithful, auditable record of what was done.

The April features exist because this kept happening, every day, across multiple repos.

## `insert` / `reorder` / `reopen`: Mid-Saga Flexibility

Three commands, each mapped to a real pattern:

<table>
  <colgroup>
    <col style="width: 16em;">
    <col>
  </colgroup>
  <thead>
    <tr><th>Command</th><th>Scenario</th></tr>
  </thead>
  <tbody>
    <tr>
      <td style="white-space: nowrap;"><code>agentrail insert --after N</code></td>
      <td>A surprise lands (blocker, bug in dependent repo, unplanned dependency). Slot a new pending step at N+1; later pending/in-progress steps shift up by one.</td>
    </tr>
    <tr>
      <td style="white-space: nowrap;"><code>agentrail reorder N --to M</code></td>
      <td>Priorities change. Move a pending or in-progress step; intervening steps shift the other way.</td>
    </tr>
    <tr>
      <td style="white-space: nowrap;"><code>agentrail reopen N</code></td>
      <td>A completed or blocked step turns out to be wrong. Transition it back to in-progress, clear <code>completed_at</code>, re-focus the cursor.</td>
    </tr>
  </tbody>
</table>

The invariant that makes this safe:

**Completed steps never renumber.** They are anchored to git history via their `commits` array. Any operation that would renumber a completed step is rejected. Reopen preserves the step's `commits` so the git-history linkage stays intact.

This is why `insert` and `reorder` only move *pending* and *in-progress* steps. The past is immutable; the future is negotiable.

## Cursor Preemption

A small but important follow-up. When `insert` drops a blocker at slot N+1, the cursor used to stay attached to its original step by identity --- the new step was there, but `agentrail next` still surfaced the old focus. Same story for `reorder` pulling a later step forward.

Both now apply a preemption rule: **if the new or moved step lands at or ahead of the cursor's slot, focus follows it.** Steps placed behind the cursor are still queued without disturbing focus. The result: `agentrail next` shows you the thing you just said was more urgent, instead of making you re-focus manually.

## Maintenance Mode: `add` + Ad-Hoc Tasks

Not every session is a planned saga. Sometimes the shape of the work is a *todo stream*, not a roadmap:

- User types a task.
- Agent calls `agentrail add` to create a step.
- Agent runs `begin` / work / `complete`.
- Repeat.

`agentrail add --slug <slug> --prompt <text>` records the step without going through the plan-first flow. Combined with a CLAUDE.md maintenance protocol, this turns AgentRail into a daily driver for ad-hoc work, not just a tool for staged roadmaps. Agents can also use `add` mid-session to enqueue related work they discovered but shouldn't pursue right now.

<style>
  /* Stagger sections occupy 3 cols of a 5-col grid (60% of width):
       stagger-0 = cols 1-3 (left 60%)
       stagger-1 = cols 2-4 (middle 60%)
       stagger-2 = cols 3-5 (right 60%)
     These images sit in the 40% gutter next to the stagger paragraph:
       .gutter-img-left  → fills cols 1-2 next to a right-justified stagger-2 section
       .gutter-img-right → fills cols 4-5 next to a left-justified stagger-0 section */
  .post-content .stagger { position: relative; }
  .gutter-img-left,
  .gutter-img-right {
    position: absolute;
    top: 0;
    /* 66.67% of a 60%-wide section = 40% of the container (= 2 of 5 cols) */
    width: 66.67%;
    max-width: none;
    /* Cap height to section (so it can't overflow into the next section) but
       preserve aspect ratio — object-fit: contain scales the image down and
       letterboxes rather than cropping. */
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }
  .gutter-img-left  { right: calc(100% + 1.25rem); }
  .gutter-img-right { left:  calc(100% + 1.25rem); }
  @media (max-width: 900px) {
    /* Stagger collapses at this width, so fall back to in-flow centered image */
    .gutter-img-left,
    .gutter-img-right {
      position: static;
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 0.5em auto 1em;
    }
  }
</style>

## When Things Go Wrong: `audit` + `snapshot`

<img src="{{ '/assets/images/posts/block-red-signal.webp' | relative_url }}" class="gutter-img-left no-invert" alt="">

These two were motivated by a real incident: an agent deleted untracked `.agentrail/` files. Nothing in the reflog. No recovery path. That one hurt enough to build infrastructure for.

**`agentrail snapshot`** writes a git commit of `.agentrail/` (and `.agentrail-archive/` when present) under `refs/agentrail/snapshots/<timestamp>`. Implementation detail that matters: it uses `GIT_INDEX_FILE` pointed at a throwaway temp file, so the user's real index is never touched --- no staged-file surprises, `git status` is unchanged before and after, and pre-commit hooks don't race. Because a named ref holds the commit, blobs survive `git gc`. Restore is left to the user via plain git: `git restore --source=<ref> -- .agentrail .agentrail-archive`. AgentRail never writes to the working tree on your behalf.

**`agentrail audit`** compares git history against saga history and reports three categories: matched commits, orphan commits (in git but not claimed by any step), and orphan steps (claimed commits that don't exist). With `--emit-commands`, it prints a shell script of `agentrail add` lines seeded from commit subjects --- a reconstruction scaffold you review before running.

Two schema changes make audit exact instead of heuristic:

- `StepConfig.commits: Vec<String>` is populated by `complete` from HEAD, so step <-> commit linkage is recorded at the moment of truth.
- `SagaConfig.retroactive: bool` lets you mark a saga as reconstructed-after-the-fact, so audits treat its commits as claimed.

One related bug worth calling out. `agentrail add --commit <ref>` used to record whatever string you passed --- short hashes, tags, `HEAD~N`. Audit compares against full 40-char SHAs from `git log %H`, so non-canonical entries never matched and every short-hash commit was flagged as an orphan. A retroactive saga in `sw-cor24-snobol4` produced 8 phantom orphans this way. Fixed by routing every `--commit` value through `git rev-parse --verify <ref>^{commit}` and storing only the full SHA. Unresolvable refs now fail at `add` time with a clear error, instead of silently producing orphans at audit time.

## `archive`: Closing One Saga, Opening the Next

<img src="{{ '/assets/images/posts/block-curves-trains.webp' | relative_url }}" class="gutter-img-right no-invert" alt="">

`agentrail archive` moves `.agentrail/` into `.agentrail-archive/<name>-<timestamp>/` and clears the way for a new `init`. Optional `--reason` writes `archive-reason.txt` alongside. Collisions get a `-2`, `-3` suffix. It sounds small; in practice it's what makes AgentRail work across many small sagas in the same repo instead of one ever-growing one.

## `gen-agents-doc`: Portable Rules

Dogfooding across N repos only works if the safety rules travel. `agentrail gen-agents-doc` writes `AGENTS.example.md` --- a self-contained template covering the session protocol, `.agentrail/` handling rules, and `audit` recovery guidance. Drop it in any project, rename to `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, whatever your agent reads. The template is embedded via `include_str!`, so the binary is self-sufficient.

## What Dogfooding Teaches

<img src="{{ '/assets/images/posts/block-puppy-food-bowl.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

Three patterns keep recurring in the April commit log:

| Pattern | Example |
|---------|---------|
| Surprises need a *slot*, not a restart | `insert` / `reorder` / `reopen` |
| Recovery tools must exist *before* you need them | `audit` / `snapshot` --- built after an incident, not during one |
| Bootstrapping friction kills adoption across repos | `setup` / `gen-agents-doc` / `archive` |

The meta-lesson: the only way to find these problems is to use the tool on real work, every day, across the kind of messy, parallel, interrupt-driven development that real projects actually look like. A plan-first feature list will never surface the cursor-preemption bug, the short-hash audit false-positives, or the "I need a todo stream, not a roadmap" mode. Only use does.

Next up: porting these conventions into a couple of the other sw-vibe-coding repos so more of the saga history is recoverable by default.

---

*AgentRail is one command at a time. Follow for more AI Tools posts on the small tools that keep agents honest.*
