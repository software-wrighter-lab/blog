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
     a tensor pipeline editor, flying around and manipulating variables in 3D. Inventory pending: scratchpad xetal-tooling.md. FILLED 2026-10-22 from facts checked in this session (xetal 2bdc6a57 --help,
     lint --list = 31, D183-D185, plan.md Saga 33 (designed, not built), the libraries doc site, XETAL_COMMIT pins, PRD non-goal,
     wish list): intro, writing and running, checking, testing (part), documentation, libraries. The rest waits on the inventory.
     xetal 2bdc6a57 subcommands: lex, render, diagram, expand, doc, parse, fmt, migrate, lint, core, type, eval, run, repl, edit.
     Links only to published posts. Lead image: Mike's block-bench-tools.jpg (2026-10-22, from Dropbox), monochrome, inverts in dark mode. -->

<img src="{{ '/assets/images/posts/block-bench-tools.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

A language is used through its tools, and Rust shows how far that can go: one command, `cargo`, builds, tests, benchmarks, documents, formats and lints, and a language server puts the compiler's knowledge in every editor. This post takes stock of X_eTaL's tools against that yardstick: what exists today, what needs work, what is designed or planned, and what is missing.

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

X_eTaL is typed in ASCII and read as notation, so its interactive tools all draw as you type. There are three, sharing one engine:

- **`xetal repl`**, a session in the terminal: each line drawn decorated while it is typed, with history.
- **`xetal edit`**, a full-screen editor in the terminal: the ASCII on the left, the drawn form on the right, and below them the types of the definitions or the first error, updated on every keystroke. Ctrl-R runs the file, Ctrl-L lints it, and Tab completes a name from the catalog, with its type beside it.
- **The [live demo](https://softwarewrighter.github.io/X_eTaL/)**, the same panes in a browser, built in Rust and compiled to WebAssembly, with Run and Lint buttons. It now carries a second view as well, `xetal edit` itself drawn in the page: one editor, two hosts.

For reading a run back, `xetal run --echo` prints a file as a notebook, each statement drawn and followed by its output, and an Emacs mode with Org Babel support runs X_eTaL in literate documents. Rust has no official REPL, and this is where X_eTaL is ahead of its model: the array languages have always been interactive.

## Checking: types, lints, format

- **Types.** Every program is type-checked before it runs; `xetal type` prints what it inferred for each definition, and a type error says where each side got its type ([post #14](/2026/10/20/array-languages-xetal-typing-errors/)). Rust's counterpart is `cargo check`; X_eTaL has no separate check-only command yet, since `xetal type` and the editors do the job.
- **Lints.** `xetal lint` is modeled on clippy: 31 lints in six groups, each with a default level, `--list`, `--explain` for any lint, levels set in ordinary comments, findings as JSON for other tools, and `--fix` for the fixes that are certain, which refuses a file git could not restore. Its counterparts are `cargo clippy` and `cargo fix`.
- **Format.** `xetal fmt` prints the canonical form, every application in parentheses. That answers "how does this line group?" well, but it is not yet a layout tool: rustfmt rewrites a file in a house style, and X_eTaL has nothing that does.
- **Looking inside.** `xetal lex`, `parse`, `expand` (the program after its macros), `core` (the internal form) and `render` (drawn, LaTeX or HTML) show each stage of the compiler, as `cargo expand` and the compiler's own dump flags do for Rust.

## Testing, speed and coverage

What exists is the testing X_eTaL's own development needs. Its examples in documentation comments run as tests, `xetal doc --test`, the way rustdoc runs Rust's. And every X_eTaL repository pins its behavior with golden tests run by [reg-rs](https://github.com/sw-cli-tools/reg-rs), a regression tool for command-line programs, written in Rust and not specific to X_eTaL: each test is a command and its expected output, saved side by side, and a test fails when the output changes. The libraries' Check library supplies assertions for programs that test themselves.

What is missing is a test framework for X_eTaL code itself, the way JUnit or TestNG is for Java: there is no `xetal test`, and no xetalunit. Both are designed, with the decisions recorded: tests are definitions tagged `## @test` in a `tests/` folder, each run in its own session, with `@expect error[...]` for a test that should fail, reported as `cargo test` reports them and as JUnit XML for continuous integration; the assertions become a standard library; and xetalunit, a library of its own, adds fixtures, parameterized cases and reports, in the manner of JUnit 4 and TestNG. None of it is built yet, and it is the testing tool X_eTaL most needs.

TODO (inventory): benchmarks, profiling and coverage: what exists in bench/ and the GPU repository, and what is planned.

## Documentation and cross-reference

Documentation is a strength. A `##` comment above a definition documents it, `###` makes a section heading, and `## >>` marks an example whose output is checked. `xetal doc` reads a program or library with everything it imports and builds a cross-reference: every definition, every use, the source drawn decorated, as JSON or as a static site. The libraries publish theirs as [a site of their own](https://softwarewrighter.github.io/X_eTaL-libraries/doc/), which is X_eTaL's docs.rs, in miniature.

## Libraries and dependencies

A program imports a library with `"n:" u̲se< "Numbers"`, choosing the alias itself, and libraries are found on a search path (`XETAL_PATH`, and a `userlibs/` folder). The sibling repositories depend on X_eTaL by pinning a commit, recorded in a file and checked out by their build, which is Cargo's lock file in spirit and by hand. There is no package manager: the original requirements list one as a non-goal "for now", and a registry with versions and an `xetal add` is on the wish list, unscheduled. This is the largest distance from Rust, whose `cargo add`, crates.io and `Cargo.lock` are half of what makes it pleasant to use.

## Debugging: from d̲bg< to stepping backward

TODO: time-travel, visual debugging, DAP.

## Editors everywhere: a language server

TODO

## Seeing the data: equations, pipelines, arrays in 3D

TODO

## What to build next

TODO: ranked list, grounded in what the repos show is painful or asked for.
