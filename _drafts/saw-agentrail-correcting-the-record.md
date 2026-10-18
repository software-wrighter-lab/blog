---
layout: post
title: "Saw #15: agentrail, Correcting the Record"
categories: [tools, process]
tags: [sharpen-the-saw, agentrail, agentrail-rs, ai-agents, claude-code, workflow, sagas, provenance, git, rust]
keywords: "Sharpen the Saw, agentrail, agentrail-rs, saga, AI coding agents, stranded steps, close, edit, reserve, unreserve, done elsewhere, provenance, parallel agents, cloud agents, workflow tool, git history"
abstract: "agentrail keeps AI coding agents on a numbered plan, a saga, committed with the code. With several agents now working one family of repositories at once, work started happening where the saga's cursor never goes: in another repository, in a parallel lane, after the plan changed. The existing commands could not record that without corrupting a neighbor's history. So I asked Claude to fix the tool: three new commands, close, edit and reserve, a cursor that never lands on finished work, and a report of stranded steps with the command to fix each."
series: "Sharpen the Saw Sundays"
series_part: 15
date: 2026-10-18 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-vibe-coding/agentrail-rs"
    title: "agentrail-rs"
---

<!-- DRAFT (2026-10-18). Sources: Mike's ~/Downloads/agentrail-correcting-the-record.md and sw-vibe-coding/agentrail-rs PR #3
     ("feat: correct the record: close, edit, reserve; the cursor skips finished work", merged 2026-10-18T14:43Z, +702 -6, 15 files).
     Commands, numbers and examples are from those two; nothing here was run by the blog agent.
     Lead image: PLACEHOLDER (scripts/placeholder-marker); Mike will supply one. -->

<img src="{{ '/assets/images/posts/placeholder-saw-agentrail-correcting-the-record.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

This week's sharpening was on a tool rather than a project. agentrail keeps AI coding agents on track with a saga, a numbered plan committed with the code, and it has worked well while one agent works one repository in order. That is no longer how I work: this week a local agent, several cloud agents and chat sessions shared one family of repositories, handing steps to each other and merging each other's pull requests. The saga started to say things that were not true, and the tool had no honest way to correct them. So I asked Claude to fix the tool.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The change** | [agentrail-rs PR #3](https://github.com/sw-vibe-coding/agentrail-rs/pull/3) --- close, edit, reserve; the cursor skips finished work |
| **The tool** | [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Earlier** | [Saw #3: agentrail-rs](/2026/03/22/saw-agentrail-rs-icrl-dual-memory/) · [AI Tools #2: insert, reorder, reopen](/2026/04/23/ai-tools-agentrail-rs-mid-saga-flexibility/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## The saga, and its cursor

An agent starts every session with `agentrail next`, marks the step `begin`, does the work, commits, and runs `agentrail complete`. That records the commit, a summary and a trajectory, then moves the cursor to the next step. The saga is a record of the git history, and the next session trusts it.

That model assumes the work happens in order, here, by the agent holding the cursor.

## How the record drifted

On X_eTaL, the typed array language this blog's Array Languages series follows, the saga had grown to 150 steps, and three things had happened to it:

1. **Work moved to another repository.** Four steps of the equation work, 101 to 104, were finished in X_eTaL-libraries after the library moved there. In X_eTaL's saga they were still `pending`, and the cursor had moved on to 111.
2. **Work was done in a parallel lane.** Five steps of readable error messages were done in a lane with its own saga and merged in one pull request. The main saga still listed them as `pending`, ahead of the cursor.
3. **The plan changed after a step was written.** Step 111's prompt described a raw form of the new code strings, `cr"..."`, that was later dropped from the design.

None of that is unusual once several agents share a project. Each one is a step whose record no longer matches the history.

## Why the existing commands could not fix it

agentrail already had commands for changing the plan mid-saga, `insert`, `reorder` and `reopen`, all of which protect completed steps. That is right, because completed steps anchor the git history. But the protection also boxed in the stranded steps:

- **`reorder 101 --to 111`** refuses, because steps 105 to 110 between them are completed, and completed steps never renumber.
- **`reopen 100`, then `complete`,** moves the cursor to 101, but it rewrites step 100's completion time to today and appends today's commit to step 100's record. Completing 101 then credits X_eTaL's latest commit with work that lives in another repository. It corrupts two records to fix one.
- **Hand-editing a step's file** is forbidden by the project's own rules, and rightly: the saga is append-only state, and a hand edit is how the record and the history drift apart silently.

The `reopen` route was tried first on a copy of the saga, and the result diffed: step 100 picked up a new timestamp and an unrelated commit. That was enough to decide that the tool, not the saga, needed fixing.

And there was a second bug in the same place: `complete` advanced to the step after the current one whether or not that step was already done, so the cursor could land on finished work.

## What changed

Three commands, one fix to the cursor, and one new report.

| Command | What it is for |
|---|---|
| `agentrail close N --summary S (--commit REF … \| --elsewhere WHERE)` | complete one step out of order, recording where the work is |
| `agentrail edit N --prompt P` | replace the prompt of a step not yet done |
| `agentrail reserve N --for OWNER` / `unreserve N` | hand a step to someone else before the work starts |

### `close`: a step done elsewhere

```bash
agentrail close 101 --summary "Spatial oracle, done in the libraries repo" \
  --elsewhere "X_eTaL-libraries@0f82f93"

agentrail close 126 --summary "Readable errors, lane readable" \
  --commit 7c1e0a2          # a commit in this repository
```

`close` marks a pending, in-progress or blocked step completed, out of order, and makes the agent say where the work is: `--commit`, repeatable, for commits in this repository, resolved to full SHAs so `agentrail audit` can match them; or `--elsewhere` for anything else, stored with the step as `done_elsewhere`. Passing neither is an error. `close` never records the current commit on its own and never touches another step. If the closed step is the current one, the cursor moves on.

### `edit`: a step whose plan changed

```bash
agentrail edit 111 --prompt docs/code-strings-step-111.md
```

This replaces the prompt and the description `status` shows. A completed step's prompt is history, so `edit` refuses one; reopen it first.

### `reserve`: preventing the drift

```bash
agentrail reserve 111 --for "cloud agent, PR to follow"
# ... later, after merging their PR:
agentrail close 111 --summary "Code strings" --commit <merge-sha>
```

When a step goes to someone else, another lane, a cloud agent, another repository, it is reserved before the work starts. The cursor skips a reserved step, `complete` never lands on it, and `status` shows it as `[r] … (reserved for cloud agent)`. Closing it ends the reservation; `unreserve` takes it back.

### The cursor, and stranded steps

`complete` now advances to the next open step, one that is neither completed nor reserved, and says what it skipped. If none is left, it creates the next step after the highest number.

And `status` and `next` now list every pending, unreserved step behind the cursor, because nothing will ever bring the cursor back to it, with the fix for each:

```text
Stranded: 4 pending step(s) behind the cursor (111):
  101-spatial-oracle
  102-spatial-capture
  103-spatial-lowering
  104-spatial-latex
  Done elsewhere?  agentrail close N --summary ... --commit REF | --elsewhere WHERE
  Someone else's?  agentrail reserve N --for OWNER
  Still to do?     agentrail reorder N --to M (if no completed step lies between)
```

A silent inconsistency becomes a visible to-do with the command attached.

## The rules behind it

- **Make the agent say where.** The one thing a record of work must never do is invent where the work came from. `close` refuses to guess, so the record says "done in X_eTaL-libraries at 0f82f93", not "done at whatever commit happened to be checked out".
- **Touch one step.** Every correction changes exactly the step it names. Completed steps still never renumber, and nothing rewrites a neighbor's history.
- **Prevent as well as repair.** `close` repairs, `reserve` prevents, and the stranded report finds what slipped through.
- **Keep every existing saga working.** The two new fields, `reserved_for` and `done_elsewhere`, are optional and left out of the file when unset, so existing step files load and save back byte for byte, which a test checks. Older agentrail binaries ignore the fields.
- **Teach the agents.** agentrail hands every project a shared set of agent instructions, and the recovery part now says: correct the record with commands, never by hand-editing or by reopening a neighbor, and reserve a step when you hand it off.

## By the numbers

- 3 new commands, 1 fix to the cursor, 1 new report, in one pull request of about 700 lines.
- 11 new tests; the workspace's 192 tests pass, with clippy and rustfmt clean.
- Tried first on a copy of X_eTaL's real 150-step saga: the report found the 4 stranded steps, and `close` changed only the step it named.

## The lesson

A workflow tool that keeps agents honest has to make it easy to be honest about work it did not see. Once several agents share a project, "done somewhere else" is a normal state, not an exception. The record needs a way to say so, and the tool should require the evidence.

</div>
