---
layout: post
title: "Array Languages #19: X_eTaL's Tools, Built, Planned and Wanted"
categories: [languages, language-design, tools]
tags: [array-languages, xetal, x-etal, tooling, repl, editor, linter, formatter, debugger, lsp, dap, profiler, benchmarks, documentation, packages, rust, cargo]
keywords: "X_eTaL tooling, array language REPL, WASM live demo, terminal editor, type checker, linter, formatter, doc tests, benchmarks, code coverage, cross-reference docs, package manager, time-travel debugger, visual debugger, LSP, DAP, equation editor, tensor pipeline editor, 3D variable explorer, Rust cargo tooling"
abstract: "Nineteenth in the Array Languages series: the tools around X_eTaL, measured against Rust's. What exists today, from the REPL and the editors to the type checker, the linter and the documentation site; what needs work; what is designed or planned; and what is still missing: a test runner, benchmarks and coverage, a package system, a language server, a debugger that can step backward, and visual editors for equations, tensor pipelines and arrays in 3D."
series: "Array Languages"
series_part: 19
date: 2026-10-25 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT SKELETON (2026-10-22), Mike: tooling post: REPL (TUI, WASM), type system, linter, and tools that may or may not exist
     (formatter, benchmarker, coverage, docstrings, cross-reference, crate-like dependencies); what exists, needs work, is designed or
     planned, is missing; Rust as the inspiration; wanted: a time-travelling debugger, visual debugging, LSP, DAP, an equation editor,
     a tensor pipeline editor, flying around and manipulating variables in 3D. Inventory pending: scratchpad xetal-tooling.md.
     xetal 2bdc6a57 subcommands: lex, render, diagram, expand, doc, parse, fmt, migrate, lint, core, type, eval, run, repl, edit.
     Links only to published posts. Lead image: PLACEHOLDER; Mike will supply one. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-tooling.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

TODO: intro: a language is used through its tools; Rust's cargo, rustfmt, clippy, rustdoc and rust-analyzer as the yardstick.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The language** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Where the tools stand

TODO: one-page status table: tool, status (exists / needs work / designed / planned / wanted), Rust's counterpart.

## Writing and running: REPL, editors, live demo

TODO

## Checking: types, lints, format

TODO

## Testing, speed and coverage

TODO

## Documentation and cross-reference

TODO

## Libraries and dependencies

TODO

## Debugging: from d̲bg< to stepping backward

TODO: time-travel, visual debugging, DAP.

## Editors everywhere: a language server

TODO

## Seeing the data: equations, pipelines, arrays in 3D

TODO

## What to build next

TODO: ranked list, grounded in what the repos show is painful or asked for.
