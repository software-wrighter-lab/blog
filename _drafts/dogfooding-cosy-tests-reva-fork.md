---
layout: post
title: "Dogfooding #3: CoSy Tests reva-fork --- Bug Reports, Fixed or Filed"
categories: [languages, forth, dogfooding]
tags: [dogfooding, forth, reva, reva-fork, cosy, apl, k, rust, wasm, webassembly, regression-tests, golden-tests, bug-reports, porting]
keywords: "dogfooding, reva-fork, Reva Forth in Rust and WebAssembly, CoSy, bug catalog, golden tests, regression tests, FILE:LINE errors, runaway loop guard, Reva 7.0 compatibility, port-check, web REPL"
abstract: "Since Saw #16, reva-fork has shipped a release almost every day, and CoSy, an APL-like language that runs on top of it, has become the way I validate the public repository. A detailed catalog of 26 issues, drawn from years of CoSy's logs, arrived; each is now fixed, filed for the right owner, or pinned by a regression test. Errors that say where, a guard against runaway loops, Reva 7.0 code running unchanged, and a better web REPL. Today's releases, 2026.1106.0 and .1, finish CoSy's latest request: diagnostics that name the word at fault."
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
     wrighter.space/staging URL for 2026.1106.x, and a new reva-fork release (done: reva-fork 2026.1106.1 on GitHub Pages, CoSy cosy-web-2026.1106.0 on staging). Series: Dogfooding #3 (Mike,
     2026-11-06; not Saw on a Friday). Lead image: Mike's logo-cosy-relief.jpg (Dropbox, 2026-10-30), the blue badge that CoSy fork
     #37 adopted; no-invert.
     Sources (read 2026-11-06 morning, after git fetch): reva-fork dev and main, CHANGES.md, VERSION, saga steps; PR #91 (CD
     canvas, merged to dev 11/06, unreleased), PR #92 (fault chain, OPEN). PRIVATE ba-cosy-zip-fork dev: docs/reported-issues-
     resolutions.md, docs/reva-fork-asks.md, docs/cosy-issues.md, tests (f81d232, version 2026.1106.0). Never link the CoSy repo. Mike (2026-11-06): do not name CoSy's author in this post (not sure he is okay with it); describe his code diplomatically, facts only.
     Refreshed 2026-11-06 evening: reva-fork 2026.1106.0 (14:20) and 2026.1106.1 (18:23), main = dev, PRs #91-#98 merged, ask 22 done (#92-#95); CoSy fork main = dev at 2026.1106.0. Live: GitHub Pages at 2026.1106.1; staging cosy-web-2026.1106.0 is 200, reva-web-2026.1106.x staging is 404 (Pages is the Reva demo). Counts: reva-fork goldens 31 (10/25) to 60 on dev; CoSy goldens 39; bomb catalog 26 entries, 14 golden tests. -->

<img src="{{ '/assets/images/posts/logo-cosy-relief.webp' | relative_url }}" class="post-marker no-invert" alt="The CoSy logo: a round blue badge with a gold wireframe hypercube above the word CoSy in pink, framed by leaves and stitching" style="width: 205px;">

[Saw #16](/2026/10/25/saw-reva-fork-cosy/) introduced reva-fork, my port of the Reva Forth to Rust and WebAssembly, and [CoSy](https://cosy.com/), an APL-like language, running on top of it. Since then reva-fork has had a release almost every day, and CoSy has become the way I validate the public repository: real code, written for Reva well before my port existed.

Then detailed bug documentation arrived. Today's work is mostly cleanup, and regression tests for every reported issue.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **reva-fork** | [softwarewrighter/reva-fork](https://github.com/softwarewrighter/reva-fork) |
| **Live demos** | [Reva in the browser](https://softwarewrighter.github.io/reva-fork/) (2026.1106.1, GitHub Pages), [CoSy in the browser](https://wrighter.space/staging/cosy-fork/cosy-web-2026.1106.0/) (2026.1106.0, on my staging site: not GitHub Pages, since the port is still private and its licensing unclear) |
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
| 2026.1106.0 | Graphics for IUP programs: CD canvases and timers in the browser and the desktop app; diagnostics that name the word at fault |
| 2026.1106.1 | README and docs brought up to date, with a canvas demo on the live site (`needs ui/cd-demo cd-demo`) and a new docs/diagnostics.md |

## Errors that say where

CoSy is a substantial body of Forth, so when something goes wrong, the first useful answer is where. Errors now name the file and line, and the file that included it:

```text
inner.f:3 (from outer.f:3): ERROR: unknown word: ...
```

Faults report the word that was running and the stack, and since today they name the callers too, innermost first:

```text
(in a+0xc <- b <- c, eip ...)
```

Today's releases add opt-in checks for the harder cases, each with a CLI flag and a `?diagnose=` page option:

- **`--underflow fail-at-word`** stops in the word that underflowed, even when a later push hides it: `: f1 drop drop ; : f2 f1 1 ;` then `1 f2` stops in `f1+0xa <- f2`.
- **`--check-execute`** stops an `execute` of something that is not code, naming who executed it, where `0 execute` used to fault at address 0.
- **`--trace-compile`** shows each word compiled into a definition, and which words compiled it.

Two more make long sessions safer. A stack underflow warns once and carries on, as Reva did, with `--underflow fail` for the old behavior. And a loop that runs for five seconds without asking for input pauses in the browser and the desktop app, with Stop, five seconds more, or keep going; in the terminal, `--max-cpu SECONDS` ends it.

## Existing code, unchanged

`needs compat/reva70` loads a Reva 7.0 compatibility layer, so CoSy's `Job.f` and `Tui.f` open their window without edits. For code written on Windows, `reva --port-check` finds drive letters, backslash paths, Windows shell commands and `.bat` files, and reports each as FILE:LINE:COL; `--fix DIR` writes migrated copies and never touches the originals.

## A better web REPL

Pasted lines run one at a time, files can be uploaded and then `include`d, a missing file says so, and a rebuilt site never runs stale files. `ms` now waits in the browser, so an animation like this draws one tree at a time:

```forth
: trees 13 2 do i tree-demo 1000 ms loop ;
```

SQLite works the same way in the terminal, the desktop app and the browser.

## The bug catalog

<figure class="zoomable outdent-left" style="width: 240px;">
<img src="{{ '/assets/images/posts/block-relay-moth.webp' | relative_url }}" class="no-invert" alt="A moth resting on the copper coil of an old electromechanical relay">
<figcaption style="font-size: 0.85em;">"First actual case of bug being found": the moth in the Harvard Mark II's relay, 1947.</figcaption>
</figure>

The catalog has 26 entries, drawn from CoSy's logs from 2015 to 2019. Each one was reproduced, where it could be, and given an owner: the CoSy port, reva-fork, or CoSy's own source.

| Outcome | Entries |
|---|---|
| Works, or fixed | 11 |
| Open, in CoSy's own source | 3 |
| Not recreatable (the words were renamed or removed) | 6 |
| Unknown | 4 |
| By design (Forth comments do not nest) | 1 |

The three open ones are in CoSy's `across` and `allocate`, outside the port, and each has a documented workaround. Today's 14 golden tests pin every entry that can be run, and the three open ones are marked to fail on purpose: when a fix lands, the test says so.

## How CoSy feeds reva-fork

The CoSy port never changes reva-fork directly. When it finds a problem, it reproduces it, decides who owns it, and files an ask against reva-fork: symptom, reproduction, workaround, suggested fix and priority. reva-fork takes the ask as a step in its own plan, and when the fix ships, the CoSy side drops its workaround and closes the ask. Twenty-two asks so far, and most are done; the four diagnostics above were ask 22, finished today.

The tests grew along the way: reva-fork's golden tests from 31 to 60, and CoSy's to 39.

## Next

I'm winding down work on reva-fork and CoSy for a while. Several other X_eTaL projects are ramping up: ray tracing on the CPU and GPU, and machine learning, with fine-tuning and manifolds. I'm also working on some Hackaday hardware projects, with FPGAs and analog circuits.
