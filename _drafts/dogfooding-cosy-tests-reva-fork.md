---
layout: post
title: "Dogfooding #3: CoSy Tests reva-fork --- Bob's Bug Reports, Fixed or Filed"
categories: [languages, forth, dogfooding]
tags: [dogfooding, forth, reva, reva-fork, cosy, apl, k, rust, wasm, webassembly, regression-tests, golden-tests, bug-reports, porting]
keywords: "dogfooding, reva-fork, Reva Forth in Rust and WebAssembly, CoSy, Bob Armstrong, bug catalog, golden tests, regression tests, FILE:LINE errors, runaway loop guard, Reva 7.0 compatibility, port-check, web REPL"
abstract: "Since Saw #16, reva-fork has shipped a release almost every day, and CoSy, Bob Armstrong's APL-like language running on top of it, has become the way I validate the public repository. Bob sent a catalog of 26 crashes and bugs from years of his own logs; each is now fixed, filed for the right owner, or pinned by a regression test. Errors that say where, a guard against runaway loops, his Reva 7.0 code running unchanged, and a better web REPL. Mike: TODO, today's release numbers and staging URLs."
series: "Dogfooding"
series_part: 3
date: 2026-11-06 00:15:00 -0800
repo_urls:
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
---

<!-- DRAFT (2026-11-06), Mike: catch up on reva-fork and ba-cosy-zip-fork since Saw #16 (2026-10-25). "I received detailed bug
     documentation and today's work is mainly clean up and adding regression tests for the reported issues. Note that cosy fork
     repo remains private. At this point CoSy is being used to validate the reva-fork public repo." New release today: a
     wrighter.space/staging URL for 2026.1106.x, and a new reva-fork release (Mike: TODO, both). Series: Dogfooding #3 (Mike,
     2026-11-06; not Saw on a Friday). Lead image: Mike's logo-cosy-relief.jpg (Dropbox, 2026-10-30), the blue badge that CoSy fork
     #37 adopted; no-invert.
     Sources (read 2026-11-06 morning, after git fetch): reva-fork dev and main, CHANGES.md, VERSION, saga steps; PR #91 (CD
     canvas, merged to dev 11/06, unreleased), PR #92 (fault chain, OPEN). PRIVATE ba-cosy-zip-fork dev: docs/reported-issues-
     resolutions.md, docs/reva-fork-asks.md, docs/cosy-issues.md, tests (f81d232, version 2026.1106.0). Never link the CoSy repo.
     Counts: reva-fork goldens 31 (10/25) to 56 on dev; CoSy goldens 36; bomb catalog 26 entries, 14 golden tests. -->

<img src="{{ '/assets/images/posts/logo-cosy-relief.webp' | relative_url }}" class="post-marker no-invert" alt="The CoSy logo: a round blue badge with a gold wireframe hypercube above the word CoSy in pink, framed by leaves and stitching" style="width: 205px;">

[Saw #16](/2026/10/25/saw-reva-fork-cosy/) introduced reva-fork, my port of the Reva Forth to Rust and WebAssembly, and CoSy, Bob Armstrong's APL-like language, running on top of it. Since then reva-fork has had a release almost every day, and CoSy has become the way I validate the public repository: real code, written by someone else, years before my port existed.

Then Bob sent detailed bug documentation. Today's work is mostly cleanup, and regression tests for every issue he reported.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **reva-fork** | [softwarewrighter/reva-fork](https://github.com/softwarewrighter/reva-fork) |
| **Live demo** | [Reva in the browser](https://softwarewrighter.github.io/reva-fork/) (GitHub Pages) |
| **Staging** | Mike: TODO, today's wrighter.space/staging URL for 2026.1106.x |
| **CoSy** | [cosy.com](https://cosy.com/), its [Forth code](https://cosy.com/4thCoSy/) |
| **The CoSy port** | private for now |
| **Earlier** | [Saw #16: Reva Forth, Ported to Rust and WebAssembly, and CoSy on Top](/2026/10/25/saw-reva-fork-cosy/) |
| **The series** | [Dogfooding: every post](/series/#dogfooding) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A release a day

| Version | What it added |
|---|---|
| 2026.1101.0 | The IUP virtual library and one text UI for the browser, desktop and terminal; the notebook; `help` with real documentation |
| 2026.1101.1 | IUP dialogs and the notebook full screen in a terminal; undo, redo and autosave; turtle drawings saved as files; Upload in the browser |
| 2026.1102.0 | "Reva Fork" branding; saved images everywhere; the Reva 7.0 layer; `--port-check`; errors with FILE:LINE; the runaway-loop guard |
| 2026.1103.0 | The version in one `VERSION` file; a rebuilt web site never runs stale files |
| 2026.1104.0 | Pasted lines run one at a time in the web REPL; a notebook in its own file; a fix for the web demo's text UI |
| 2026.1105.0 | `ms` waits in the browser and the desktop app, so animations draw frame by frame |

Since then, CD canvas graphics for IUP programs have landed on `dev`, not yet in a release. Mike: TODO, today's release and what it adds.

## Errors that say where

Bob's code is large and old, so when something goes wrong the first question is where. Errors now name the file and line, and the file that included it:

```text
inner.f:3 (from outer.f:3): ERROR: unknown word: ...
```

Faults report the word that was running and the stack. A change in review today goes further and names the callers, innermost first:

```text
(in a+0xc <- b <- c, eip ...)
```

Two more make long sessions safer. A stack underflow warns once and carries on, as Reva did, with `--underflow fail` for the old behavior. And a loop that runs for five seconds without asking for input pauses in the browser and the desktop app, with Stop, five seconds more, or keep going; in the terminal, `--max-cpu SECONDS` ends it.

## Bob's code, unchanged

`needs compat/reva70` loads a Reva 7.0 compatibility layer, so Bob's own `Job.f` and `Tui.f` open their window without edits. For code written on Windows, `reva --port-check` finds drive letters, backslash paths, Windows shell commands and `.bat` files, and reports each as FILE:LINE:COL; `--fix DIR` writes migrated copies and never touches the originals.

## A better web REPL

Pasted lines run one at a time, files can be uploaded and then `include`d, a missing file says so, and a rebuilt site never runs stale files. `ms` now waits in the browser, so an animation like this draws one tree at a time:

```forth
: trees 13 2 do i tree-demo 1000 ms loop ;
```

SQLite works the same way in the terminal, the desktop app and the browser.

## Bob's bug catalog

Bob's catalog has 26 entries, drawn from his logs from 2015 to 2019. Each one was reproduced, if it could be, and given an owner: the CoSy port, reva-fork, or Bob's own source.

| Outcome | Entries |
|---|---|
| Works, or fixed | 11 |
| Open, in Bob's source | 3 |
| Not recreatable (the words were renamed or removed) | 6 |
| Unknown | 4 |
| By design (Forth comments do not nest) | 1 |

The three open ones are in Bob's `across` and `allocate`, so they are his to decide, and each has a documented workaround. Today's 14 golden tests pin every entry that can be run, and the three open ones are marked to fail on purpose: when a fix lands, the test says so.

## How CoSy feeds reva-fork

The CoSy port never changes reva-fork directly. When it finds a problem, it reproduces it, decides who owns it, and files an ask against reva-fork: symptom, reproduction, workaround, suggested fix and priority. reva-fork takes the ask as a step in its own plan, and when the fix ships, the CoSy side drops its workaround and closes the ask. Twenty-two asks so far; most are done.

The tests grew along the way: reva-fork's golden tests from 31 to 56, and CoSy's to 36.

## Next

The rest of the current ask: an underflow that stops at the word that caused it, a check before `execute`, and a trace of what compiles. After that, bignums and XML, sockets in the terminal, and packaging. Mike: TODO, anything else you want to name, or a closing in your words.
