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
     Commands, numbers and examples are from those two, except "Reading the record": real commits on X_eTaL main read 2026-10-18,
     517f7142 (14:44 UTC, correct the record) and c5750cec (08:12 PDT = 15:12 UTC, close 119), their messages and step-file diffs
     quoted exactly (diffs trimmed to the changed lines).
     Lead image: Mike's block-table-jigsaw.jpg (2026-10-18), not inverted (mostly black ink on warm off-white paper). -->

<img src="{{ '/assets/images/posts/block-table-jigsaw.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

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

## Reading the record

An agent's full conversation stays on the machine it ran on. What agentrail commits with the code is the part worth keeping: what was planned and what was done, in a few sentences per step. Anyone can read it, on GitHub or in a clone, without agentrail installed.

### Where the words are

Everything is in the `.agentrail/` folder at the top of the repository. In X_eTaL's, for example, [`.agentrail/steps`](https://github.com/softwarewrighter/X_eTaL/tree/main/.agentrail/steps) holds one folder per step, named by number and slug, `110-macro-contracts`. Four files tell the story:

| File | What it says |
|---|---|
| [`.agentrail/plan.md`](https://github.com/softwarewrighter/X_eTaL/tree/main/.agentrail/plan.md) | the saga's plan, in prose: its goal and what was decided |
| `steps/NNN-slug/prompt.md` | what the step was asked to do, written before it started |
| `steps/NNN-slug/summary.md` | what was done, a few lines written when it finished |
| `steps/NNN-slug/step.toml` | when it finished, the commits it made, or where it was done instead |

So the way to read a step is in that order: the prompt, then the summary, then a glance at the record for when and where. Step 110 of X_eTaL's saga, the macro contracts, reads like this. Its prompt, the plan, begins:

```text
The user (2026-10-17, decided): three contract lines in a macro's doc block, checked by
the macro runner ... ## uses: copied (the default: every name and number token of each
argument appears as a token in the expansion, else error[unused-argument] at the argument
naming the text ignored ...) and ## uses: parsed (the macro parses a notation and takes
responsibility ...). Test-first ...
```

Its summary, what was done:

```text
Macro contracts (MC31, D163): xetal-contract crate (## takes:, ## uses: copied|parsed,
## binds:) checked by the expander around each call; bad-macro-call before the macro runs,
unused-argument after, bad-contract at load; every standard macro annotated; xetal doc
shows takes/uses; spec + goldens; docs. ... Commit 57cff932 pushed.
```

And its record says when, and which commit holds the work:

```text
completed_at = "2026-10-17T16:51:51"
commits = ["57cff93220e03f551567200f8812d78a9f9b1b8a"]
```

On GitHub, the History button on the `.agentrail` folder lists the saga's own commits, one per finished step, `chore: complete step 110 (macro contracts)`, and each commit in `commits` links to the code itself.

### All of it at once

In a clone, `agentrail history` prints every step in order, its status, the first line of its prompt and its summary:

```text
108-plain-names [production] (completed)
  The user (2026-10-17), after a survey of names: rename what reads oddly or de...
  Summary: Plain names (D161): s:r_ange -> s_pread, demos/sub.xtl -> dyadic.xtl, Macros t_h...

109-spatial-pipeline-macro [production] (completed)
  Saga 41 step 5b (docs/plan.md, docs/spatial.md Pipelines, D155): e:p_ipe< in ...
  Summary: Handed to X_eTaL-ML (the user's choice: the pipeline macro lives beside the nn: ...

110-macro-contracts [production] (completed)
  The user (2026-10-17, decided): three contract lines in a macro's doc block, ...
  Summary: Macro contracts (MC31, D163): xetal-contract crate (## takes:, ## uses: copied|p...
```

It does not print dates. For a diary of what was done when, a few lines of shell put each finished step's date beside its summary:

```bash
for d in .agentrail/steps/*/; do
  t=$(sed -n 's/^completed_at = "\(.*\)"/\1/p' "$d/step.toml")
  [ -n "$t" ] && [ -f "$d/summary.md" ] &&
    printf '%s  %s  %s\n' "${t%T*}" "$(basename "$d")" "$(head -c 70 "$d/summary.md")"
done | sort
```

The last three days of X_eTaL, from that:

```text
2026-10-16  100-raw-strings       Raw strings (ST4, D156): lexer r"..." and r#"..."# (verbatim, mult
2026-10-16  106-boxed-macro-text  Boxed broke every macro (expansions captured through the boxed pr
2026-10-17  107-expand-layout     xetal expand and Expand lay a macro's text out as a program past 8
2026-10-17  110-macro-contracts   Macro contracts (MC31, D163): xetal-contract crate (## takes:, ##
2026-10-18  101-spatial-oracle    Done in X_eTaL-libraries as its Saga 12 step 2 (equations-oracle):
2026-10-18  115-shape-lint        The shape lint (shape-mismatch, shape-check-proven, r_equireShape)
2026-10-18  126-errors-located    Saga 27 step 1 done in the readable lane (lanes/readable/.agentrai
```

One thing to read carefully. A step closed out of order carries the date it was recorded, not the date the work was done: step 101 shows the 18th because that is when the record was corrected. Its summary says where the work is, and its record names the commit, `done_elsewhere = "X_eTaL-libraries@8197d52 (Saga 12 step 2)"`, whose own date is when the work happened.

### The correction, told in words

The correction itself reads the same way. It was the first use of the new commands, a minute after the change merged, and its commit message is a plain account of what was set right and where each piece of work really is:

```text
saga: correct the record (steps done elsewhere closed, 111's prompt, 119 reserved)

Using agentrail's new close/edit/reserve (sw-vibe-coding/agentrail-rs
PR #3), each with where the work is, no other step touched:

- 101-104 (Saga 41 steps 2-5): done in X_eTaL-libraries as its Saga 12
  (8197d52, 09143d8, cb430d5, ba03d6a); closed --elsewhere.
- 114 integrals-plan: Saga 42 planned and decided (18c1501f, 6c0bf1c9).
- 115 shape-lint: merged with PR #130 (dc359072).
- 120 doc-comment-glyphs: c005fa16.
- 123 errors-library-calls (ask E5) and 126-130 (Saga 27): done in the
  readable lane, merged with PR #131 (80087dab).
- 119 pages-gh-pages reserved for the local agent: the build moved to
  gh-pages (b025b3d0); switching GitHub Pages' source remains.
- 111 code-strings: prompt corrected to the decided design (c"..." and
  c#"..."#; cr"..." was dropped) and docs/code-strings.md's order.

agentrail status reports no stranded steps; the cursor stays at 111.
```

Half an hour later the local agent switched the Pages setting and closed step 119, and its summary says what it did, in a sentence:

```text
GitHub Pages' source switched from the main workflow to the gh-pages branch (gh api,
2026-10-18 07:40) after the first just publish from main 723cd4eb; the site build moved
there in b025b3d0 (#128, D164).
```

Reserved, done and closed, and each step of it written down in words someone else can read.

## And the full transcripts

The record above is the summary. The whole conversation, every request, reply and command, is kept by the coding agent itself, not by agentrail, and since the work runs in parallel it is spread across machines. With Claude Code:

- **On a Mac or Linux machine,** each session is a file under `~/.claude/projects/`, in a folder named after the repository's path with its slashes turned into dashes. For X_eTaL on my Mac:

  ```text
  ~/.claude/projects/-Users-mike-github-softwarewrighter-X-eTaL/d545dc14-38c5-4323-80b6-15b75c666593.jsonl
  ```

  The Arch Linux machine keeps its own sessions the same way, in its own home folder. Each file holds one JSON object per line, and `jq` pulls out the readable part, the agent's replies with their times:

  ```bash
  jq -r 'select(.type=="assistant") | .timestamp as $t
         | .message.content[]? | select(.type=="text") | "\($t)  \(.text)"' SESSION.jsonl
  ```

  From the X_eTaL session above, on the evening step 110 was being built:

  ```text
  2026-10-17T21:13:22.930Z  Libraries step 1 is done and published. Next in the chain: X_eTaL step 110 (macro contracts).
  **Step 110, macro contracts (in progress):** the `xetal-contract` crate is written and green (10 tests),
  ```

- **In Claude's cloud,** a session runs on a virtual machine that is gone when it ends, so its transcript is not on any disk of mine; it is in the web interface, at claude.ai/code. A commit made there carries a trailer that links back to it, as the correction above does:

  ```text
  Claude-Session: https://claude.ai/code/session_01Etyh3Gka9iV2U9SJkNnmhm
  ```

  The link opens the session for whoever owns it.

Transcripts are long, private and scattered; that is why the saga keeps the summary. The record in the repository says what was planned and done, the commits hold the code, and a transcript, wherever it lives, is there for the rare time the reasoning behind a step matters.

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
