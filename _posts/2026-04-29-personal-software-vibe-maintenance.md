---
layout: post
title: "Personal Software #9: Vibe-Maintenance --- When AI Agents Don't Just Write Code, They Fix Bugs"
date: 2026-04-29 12:00:00 -0700
categories: [ai-tools, cli-tools, embedded]
tags: [vibe-maintenance, vibe-coding, personal-software, ai-coding, ai-agents, cor24, sw-embed, bug-fixes, regression-tests, agentrail, status-dashboard]
keywords: "vibe-maintenance, vibe-coding, AI coding agents, AI bug fixing, sw-embed, COR24, web-sw-cor24-demos, status dashboard, closed-issues heatmap, commit heatmap, regression tests, AgentRail, capacity-limit bumps, codegen bugs, BASIC, Pascal, PL/SW, p-code, OCaml, SNOBOL4, Forth, tinyc, Personal Software, issue tracker"
author: Software Wrighter
abstract: "The corollary to vibe-coding is vibe-maintenance --- AI agents not just writing new code, but fixing bugs in the constellation of demos, compilers, interpreters, and runtimes that the lab has accumulated. Twenty-eight sw-embed repos closed 141 issues in eighteen days. The web-sw-cor24-demos Status tab visualizes that activity as a closed-issues heatmap and a commit heatmap, alongside repo-level Try-it / In-dev badges. The post walks through the four bug-fix patterns the activity reveals (capacity-limit bumps, subtle codegen bugs, surface-level language features rolling in, and cross-cutting tooling bugs), and the human skill the cadence does not eliminate: writing an issue title that names the symptom precisely enough for the agent to act on it."
series: "Personal Software"
series_part: 9
repo_url: "https://github.com/sw-embed/web-sw-cor24-demos"
---

<img src="{{ '/assets/images/posts/block-car-lift.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 240px;">

<div style="overflow: hidden;" markdown="1">

The car is up on the lift. The mechanic is not building a new car; the mechanic is doing maintenance on a car that already runs --- replacing a sensor, chasing a leak, tightening a fitting that worked itself loose. The everyday work of a software lab looks more like that picture than like the more common rendering of "AI builds the thing" --- a lab full of in-progress compilers, runtimes, and demos accumulates bugs faster than it accumulates *features*, and the AI agents that helped write the original code are now spending most of their tokens fixing it.

</div>

<div class="aside-box" markdown="1">

**Why this matters** --- "Vibe-coding" gets the headlines because it produces something visible: a new feature, a new demo, a new tool. Vibe-maintenance is the quieter half. It does not show up as a flashy commit message; it shows up as a green "Try it" badge that used to say "In dev," or as a closed-issues heatmap that is busier than the commits one. If your only frame for AI-assisted development is "the agent writes new code," you miss the half of the work where the agent is reading existing code, finding the assumption that was wrong, and patching it. Almost every senior engineer who has tried to use AI agents finds maintenance more useful than greenfield work; the post argues for why, and what the human still has to do.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Status dashboard** | [sw-embed.github.io/web-sw-cor24-demos/#/status](https://sw-embed.github.io/web-sw-cor24-demos/#/status) |
| **Demos repo** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) |
| **Closed-issues report (raw)** | [reports/closed-issues.html](https://github.com/sw-embed/web-sw-cor24-demos/blob/main/reports/closed-issues.html) |
| **Prior Personal Software post** | [Personal Software #8: sw-launcher --- One Ring to Rule Them All](/2026/04/28/personal-software-sw-launcher-one-ring/) |
| **Related AI Tools post** | [AI Tools #3: sw-checklist --- Reining In AI Coding Agents](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Corollary to Vibe-Coding

Vibe-coding, as the term gets used: a human describes intent, an AI agent writes the code, the human accepts or redirects. The implicit assumption is that *new code* is the bottleneck. For a greenfield project, sure --- there is nothing to maintain because there is nothing to maintain *yet*. For a lab whose accumulated output now spans 37 repositories --- assemblers, emulators, cross-compilers, p-code VM, native interpreters for BASIC and Forth and APL and Smalltalk and Macrolisp and SNOBOL4, host tooling, the resident-shell trio, web demos for most of them --- the bottleneck moved a long time ago. New code lands; new code interacts with old code; old code that was fine on its own now has a corner that nobody exercised; an issue gets opened.

Vibe-maintenance is the same loop with a different verb. The human writes an issue title. The agent reads the relevant code, locates the assumption that was wrong, makes a minimal patch, adds a regression test, and closes the issue. The human's job is not to write the code; it is *to write the issue* with enough specificity that the agent has somewhere to start, and to read the diff with enough care that the test does not just pin in the bug under a different name.

The skill the human keeps is not "writing code." It is *symptom description*.

## The Status Tab as Visualization

[web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) is the landing page for the COR24 ecosystem. Its Status tab makes the lab's *operational* state visible at a glance:

- A 37-row table of every repo with a colored badge --- "Try it" (green), "In dev" (yellow), "In plan" (orange), "Future" (red), "n/a" (neutral) --- for repo readiness, web-UI readiness, and AgentRail saga presence.
- An issue chart per repo: open vs. closed counts and a sparkline.
- A **Closed Issues by Repo & Date** heatmap, generated by `scripts/gen-closed-issues.sh` from the GitHub API.
- A **Commits by Repo & Hour** heatmap, the same shape one row down.
- A "Gaps" panel calling out the cross-cutting work the lab has *not* yet done (software floating-point library, native COR24 C compiler, etc.).

The headline number on the closed-issues chart, at the time of writing: **28 repos, 141 issues, 18 days**. Eight closed issues a day, sustained, across two dozen active repos. That is not an output a single human writing code by hand achieves. It is also not an output a single human *reviewing AI-written code* achieves if every issue requires a fresh greenfield design --- it is only achievable because most of those 141 issues were *bugs in code that already existed*, and an agent can fix one of those in a fraction of the time it took to write the original.

The two heatmaps next to each other tell a story: the commits chart shows when work happened (clusters in the morning, fewer at night, weekend bursts when an idea hit); the closed-issues chart shows what work *settled* (each cell is a problem that has a regression test guarding it). The cells are mostly numbered links, so any cell on the chart is one click from a real PR diff. That traceability is the whole point.

## Four Patterns of Vibe-Maintenance

Reading down the closed-issues report by category --- not by repo --- four kinds of fix dominate.

### 1. Capacity-Limit Bumps

The numerically-largest category. A compiler or interpreter has an internal table whose size was *guessed* at first commit (`MAX_PROCS = 32`, `INPUT_BUF_SIZE = 8192`, AST pool of 256 nodes, emit buffer of 32 KiB, string literal table of 32 entries). A real program hits the limit, the agent bumps it, and a follow-up issue raises it again later when an even bigger program lands.

A small sample, all closed in this window, all from `sw-cor24-plsw` and `sw-cor24-pascal`:

- "AST pool exhaustion (256 nodes) causes misleading parse errors."
- "Source buffer (8 KiB) too small for larger programs."
- "Emit buffer (32 KiB) too small for programs with large static data."
- "DEF_MAX (32) too small --- %DEFINE silently dropped when exceeded."
- "Global symbol table limited to 64 entries (SYM_SCOPE_MAX)."
- "Raise MAX_PROCS from 32 to support larger programs."
- "Raise MAX_STRINGS limit from 16 to support larger programs."
- "Raise INPUT_BUF_SIZE from 32768 to support larger programs (third bump)."

Each one is a one-line const change plus a regression test that compiles a representative-sized input. The third-bump issue is the funny one: the limit is no longer a guess, it is a parameter that grows with the corpus. Eventually the right answer is "the table grows dynamically," but the lab's working assumption is that bumping a static limit is a one-cycle fix, while a dynamic table is a one-day refactor that earns its keep only after the same limit has been bumped enough times to justify it. The ratchet is the right tool for this kind of debt.

### 2. Subtle Codegen Bugs

The most interesting category. These are not "the feature is missing"; these are "the feature is silently wrong." A few from the same window:

- `sw-cor24-plsw#8`: "BYTE field reads use signed `lb` instead of unsigned `lbu`." A one-instruction error; values 128--255 sign-extend to negative integers, breaking pattern matching and arithmetic.
- `sw-cor24-plsw#31`: "Function return corrupts r1 -> jmp to PC=0 (programs that call PUT_DEC re-enter `_start`)." A clobbered callee-saved register; the symptom looks like an infinite loop with the program re-running from the top.
- `sw-cor24-pcode#10`: "p24-load: patch_code_relocations incorrectly relocates negative push literals." A pointer-vs-immediate confusion in the linker; small negative integers get rewritten as garbage addresses.
- `sw-cor24-x-tinyc#19`: "Codegen: integer division with negative dividend returns wrong result." The C cross-compiler's sign-handling.
- `sw-cor24-snobol4#13`: "Arithmetic on a pattern-captured string returns garbage on first use." A type-tag bug in the SNOBOL4 interpreter's value union.
- `sw-cor24-pascal#16`: "`write(chr(n))` outputs integer `n` instead of character." Built-in dispatch on the wrong type.
- `sw-cor24-basic#1`: "ABS function silently returns wrong value (parsed as variable A)." The lexer treats `ABS` as a variable rather than a builtin, so `ABS(-3)` parses as `(A) * BS * (-3)` --- a beautifully evil bug whose title carries the entire diagnosis.

These are the issues where vibe-maintenance shines. Each title is a *complete reproducer* in plain English. The agent reads the title, opens the relevant translation unit, finds the wrong instruction or the wrong dispatch, fixes it, writes a one-program regression test, and closes the issue. The human never wrote a line of code; the human wrote a *fifteen-word symptom description*.

### 3. Surface Language Features Rolling In

Each language interpreter ships with a minimum viable feature set, and demos that exercise more of the historical language drag in features that didn't make the first cut:

- **BASIC**: DIM integer arrays, DATA / READ / RESTORE, ON expr GOTO/GOSUB, MOD, bitwise BAND/BOR/BXOR/SHL/SHR, CONT after STOP. (`sw-cor24-basic#2..#7`.)
- **OCaml**: top-level let bindings, multi-line match expressions, mutable refs, records, list combinators (`map`/`fold_left`/`filter`), char literals, block comments, exceptions. (`sw-cor24-ocaml#3..#11`.)
- **Forth**: forth-in-forth gets DO/LOOP, ?DO, WHILE/REPEAT, AGAIN, CONSTANT, VARIABLE, hashed dictionary; `:NONAME`. (`sw-cor24-forth#1..#5`.)
- **SNOBOL4**: SIZE/SUBSTR/CHAR builtins, pattern-replacement assignment, case-preserving INPUT mode. (`sw-cor24-snobol4#1..#10`.)
- **TinyC**: goto + labels, compound literals, designated initializers, `_Noreturn`, `restrict`, `inline`, octal literals, multi-dimensional array declarations. (`sw-cor24-x-tinyc#2..#11`.)

Each of these is the kind of feature that *would* take a human a half-day if they had to read the existing parser, find the right place to extend it, and add the right test fixtures. Vibe-coding compresses that to a half-hour of agent work plus a human-written acceptance criterion. The acceptance criterion is the part that does not get cheaper.

### 4. Cross-Cutting Tooling Bugs

The last category is the meta one: the tooling that *generates* the dashboards itself has bugs. A representative pair from the demos repo's commit log, just in the past two weeks:

- `fix UTC-to-local date conversion in gen-issue-chart, rebuild and deploy pages`
- `fix timezone in activity reports: convert UTC dates/hours to local, regenerate tables`

Two separate "use Local::now() instead of Utc::now()" commits in two different generators. The cells in the heatmap were shifted by a few hours, which made yesterday's work look like today's, which made the dashboard wrong --- subtly, in a way that would only catch the eye of someone who *knew* what they had committed yesterday. The agent fixed both. They are listed in the dashboard the agent generated. The fact that the dashboard works is itself a regression test on its own generators.

## The Skill That Doesn't Go Away

Every category above leans on the same human contribution: a *precise* description of the symptom, often as the issue title.

Compare the two SNOBOL4 issues:

- `#1`: "Missing string builtins: SIZE, SUBSTR, CHAR return 0 for all inputs."
- `#11`: "OUTPUT corruption: concat-OUTPUT in a loop truncates when a different block declares a pattern-match with `:F(forward_label)`."

Both are real titles. Both are diagnoses, not just symptoms --- they tell the agent *exactly* what subsystem to read. `#1` is mechanical: open the builtins table, see that the entries return 0, fix them. `#11` is forensic: the title names the loop, the operator, the block, the directive, and the conditional --- the agent has the entire reproducer one paste away from a test fixture.

The bad version of either title would be "OUTPUT is broken." That title costs the agent half its budget on guessing what "broken" means and produces a fix that may or may not address the real bug.

The skill the lab keeps practicing is *writing the issue at the level of detail the agent needs*. That is roughly the same skill an engineer uses to file a useful bug report against another engineer. The difference is that the audience is faster and cheaper than the engineer; the title is read inside a second, the diff is back inside a minute, and the regression test is attached. The economics of writing good issues, in a vibe-maintenance world, are vastly more favorable than they were when the audience was a human queue with their own backlog.

## The Feedback Loop

<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/block-mobius-strip.webp' | relative_url }}" class="gutter-img-left no-invert" alt="Möbius strip">

The maintenance loop, as it actually runs in this lab, has five steps:

1. **Symptom.** A demo, test, or build fails. A user reports a wrong output. A regression test caught a regression. CI flagged a gate.
2. **Issue.** The human (or another agent) writes a one-line title and a short body that names the conditions. Most of the time the title is enough.
3. **AgentRail saga step.** For non-trivial fixes, the work goes onto an [AgentRail](/2026/04/28/ai-tools-agentrail-rs-mid-saga-flexibility/) step --- a single session does the diff, commits, and runs `agentrail complete`. The session is bounded; the next session is for the next step.
4. **Regression test.** The diff includes a test that pins the bug fixed. `cargo test` / `make test` is the contract. If a future change re-introduces the bug, the test catches it.
5. **Status refresh.** `cargo run -p gen-status` and the closed-issues / commits scripts re-pull from the GitHub API; the heatmap moves; the badge in the table tilts greener.

This is not a novel workflow --- it is what every well-run engineering team does. What is *new* is that the per-issue cost is small enough that the heatmap is *busy*. Eight issues a day across a constellation of personal projects, sustained for weeks, is the kind of cadence that used to require a small team. One human plus AI agents plus the discipline of writing good issues hits it.

The artifact, in the end, is not "the AI fixed 141 bugs." The artifact is the dashboard --- 28 repos getting visibly greener, with each cell on the heatmap a clickable link to the diff that closed it. The lab is *legible*, and being legible makes it possible to do the work at this pace in the first place.

</div>

## Where It Sits in the Personal-Software Toolkit

[sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) keeps the *shape* of the code in line. [sw-launcher](/2026/04/28/personal-software-sw-launcher-one-ring/) keeps the *shape of the load plan and memory budget* in line. [AgentRail](/2026/04/23/ai-tools-agentrail-rs-mid-saga-flexibility/) keeps the *shape of the work* in line --- one saga, one step at a time, with a faithful audit trail. The Status tab is the *operational dashboard* that makes the result of all three legible at a glance. None of those tools, individually, would be enough to keep a 37-repo lab maintainable by one person; together they make vibe-maintenance the steady-state mode of operation.

The car is up on the lift. The mechanic is not building anything new today. The mechanic is going around with a torque wrench, an oil drain, and a parts list, and at the end of the afternoon every gauge is in the green again. AI agents do not change which afternoons that work happens on. They change how many cars fit in the shop.
