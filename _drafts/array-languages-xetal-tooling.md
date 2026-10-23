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
     a tensor pipeline editor, flying around and manipulating variables in 3D. Inventory pending: scratchpad xetal-tooling.md. FILLED 2026-10-22/23 from facts checked in this session and the tooling inventory (scratchpad xetal-tooling.md) (xetal 2bdc6a57 --help,
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

| Area | Tool | Status | Rust's counterpart |
|---|---|---|---|
| Interactive | REPL, `xetal edit`, the live demo, notebooks | built | (no official REPL) |
| Checking | `xetal type`, located errors | built | `cargo check`, rustc's errors |
| | `xetal check` for a whole project | missing | `cargo check` |
| | `xetal lint`, `--fix`, `--explain` | built | clippy, `cargo fix` |
| | a formatter that keeps comments | needs work | rustfmt |
| Testing | doc tests, reg-rs goldens, the Check library | built | `cargo test` doc tests |
| | `xetal test` and xetalunit | designed | `cargo test` |
| | property tests for X_eTaL code, coverage | missing | proptest, cargo-llvm-cov |
| Speed | benchmarks with a regression gate | built (no statistics) | criterion |
| | a profiler at the level of X_eTaL functions | missing | flamegraph |
| Docs | `xetal doc`: cross-reference, search, examples tested | built | rustdoc |
| | one index across every repository's docs | missing | docs.rs |
| Libraries | `u̲se<`, a search path, commits pinned by hand | built | Cargo.lock, by hand |
| | a package manager and registry | not planned yet | cargo, crates.io |
| Debugging | `d̲bg<` | built | `dbg!` |
| | a stepping debugger, stepping back | designed | rr, CodeLLDB |
| | DAP, breakpoints | missing | CodeLLDB |
| Editors | Emacs mode | built (no lint) | rust-mode |
| | a language server | wanted | rust-analyzer |
| Visual | equation and pipeline composer | partly built | — |
| | arrays in 3D, live | missing | — |

## Writing and running: REPL, editors, live demo

X_eTaL is typed in ASCII and read as notation, so its interactive tools all draw as you type. There are three, sharing one engine:

- **`xetal repl`**, a session in the terminal: each line drawn decorated while it is typed, with history.
- **`xetal edit`**, a full-screen editor in the terminal: the ASCII on the left, the drawn form on the right, and below them the types of the definitions or the first error, updated on every keystroke. Ctrl-R runs the file, Ctrl-L lints it, and Tab completes a name from the catalog, with its type beside it.
- **The [live demo](https://softwarewrighter.github.io/X_eTaL/)**, the same panes in a browser, built in Rust and compiled to WebAssembly, with Run and Lint buttons. It now carries a second view as well, `xetal edit` itself drawn in the page: one editor, two hosts.

For reading a run back, `xetal run --echo` prints a file as a notebook, each statement drawn and followed by its output, and an Emacs mode with Org Babel support runs X_eTaL in literate documents. Rust has no official REPL, and this is where X_eTaL is ahead of its model: the array languages have always been interactive.

## Checking: types, lints, format

- **Types.** Every program is type-checked before it runs; `xetal type` prints what it inferred for each definition, and a type error says where each side got its type ([post #14](/2026/10/20/array-languages-xetal-typing-errors/)). Rust's counterpart is `cargo check`; X_eTaL has no separate check-only command yet, since `xetal type` and the editors do the job.
- **Lints.** `xetal lint` is modeled on clippy: 31 lints in six groups, each with a default level, `--list`, `--explain` for any lint, levels set in ordinary comments, findings as JSON for other tools, and `--fix` for the fixes that are certain, which refuses a file git could not restore. Its counterparts are `cargo clippy` and `cargo fix`.
- **Format.** `xetal fmt` prints the canonical form, every application in parentheses. That answers "how does this line group?" well, but it is not a formatter yet: it prints to the screen only, and it drops every comment, so it cannot be run over a real file. A formatter that keeps comments and lays code out in a house style, as rustfmt does, is on the wish list and in no plan.
- **Looking inside.** `xetal lex`, `parse`, `expand` (the program after its macros), `core` (the internal form) and `render` (drawn, LaTeX or HTML) show each stage of the compiler, as `cargo expand` and the compiler's own dump flags do for Rust.

## Testing, speed and coverage

What exists is the testing X_eTaL's own development needs: X_eTaL alone has 267 golden tests and 499 test cases for its implementation. Its examples in documentation comments run as tests, `xetal doc --test`, the way rustdoc runs Rust's. And every X_eTaL repository pins its behavior with golden tests run by [reg-rs](https://github.com/sw-cli-tools/reg-rs), a regression tool for command-line programs, written in Rust and not specific to X_eTaL: each test is a command and its expected output, saved side by side, and a test fails when the output changes. The libraries' Check library supplies assertions for programs that test themselves.

What is missing is a test framework for X_eTaL code itself, the way JUnit or TestNG is for Java: there is no `xetal test`, and no xetalunit. Both are designed, with the decisions recorded: tests are definitions tagged `## @test` in a `tests/` folder, each run in its own session, with `@expect error[...]` for a test that should fail, reported as `cargo test` reports them and as JUnit XML for continuous integration; the assertions become a standard library; and xetalunit, a library of its own, adds fixtures, parameterized cases and reports, in the manner of JUnit 4 and TestNG. None of it is built yet, and it is the testing tool X_eTaL most needs.


Speed is measured, but only roughly. Sixteen benchmark programs run with `just bench`, and `just bench-check` fails the build when one is more than 15 percent slower than its recorded baseline, so a large slowdown is caught before it lands. But it reports the best of a few wall-clock runs, with none of criterion's warm-up and statistics, and it is a tool for the implementation, not a `xetal bench` anyone can point at their own library. Profiling exists only one level down: `perf` on the Rust interpreter shows which Rust functions are slow, not which X_eTaL functions. And there is no coverage tool at all, for X_eTaL programs or for the interpreter.

## Documentation and cross-reference

Documentation is a strength. A `##` comment above a definition documents it, `###` makes a section heading, and `## >>` marks an example whose output is checked. `xetal doc` reads a program or library with everything it imports and builds a cross-reference: every definition, every use, the source drawn decorated, as JSON or as a static site. X_eTaL and most of its sibling repositories publish theirs, the libraries' [among them](https://softwarewrighter.github.io/X_eTaL-libraries/doc/): X_eTaL's docs.rs, in miniature and in pieces. What is missing is the piece docs.rs is for: one index across all of them. It was planned and is not built, and the extensions publish no documentation site at all.

## Libraries and dependencies

A program imports a library with `"n:" u̲se< "Numbers"`, choosing the alias itself, and libraries are found on a search path (`XETAL_PATH`, and a `userlibs/` folder). The sibling repositories depend on X_eTaL by pinning a commit, recorded in a file and checked out by their build, which is Cargo's lock file in spirit and by hand. There is no package manager: the original requirements list one as a non-goal "for now", and a registry with versions and an `xetal add` is on the wish list, unscheduled. This is the largest distance from Rust, whose `cargo add`, crates.io and `Cargo.lock` are half of what makes it pleasant to use.

## Debugging: from d̲bg< to stepping backward

Today's debugging tool is the one Rust programmers reach for first: `d̲bg<`, X_eTaL's `dbg!`, which prints an expression with its file, line and value, and returns the value. For the rest, a debugger is designed and not built. The design has `xetal debug FILE` showing the drawn program with the expression being evaluated marked and each value laid out beside it, with keys to step into, over, out, and back, in the terminal and in the browser alike. An earlier plan adds a trace tree, the value, type and shape of every node, and `xetal explain`, which prints how a line's right-to-left evaluation unfolded. No work has started on either, and there are no breakpoints anywhere.

What makes the design realistic is a piece built for another reason. To let a program wait for input in the browser, X_eTaL's evaluator was made steppable: its whole state, what it is evaluating, what it will do with the result and every binding, is data, so it can stop after any number of steps and go on. That is most of what a debugger needs, and it is what makes stepping *backward* plausible: keep the states, or record the inputs and replay to any earlier point, as rr does for native programs. Programs can already be replayed: a fixed seed for randomness, and a recorded file of input events.

Two pieces are not even designed: breakpoints, and the Debug Adapter Protocol, which would let VS Code, Neovim and Emacs drive an X_eTaL debugger as they drive CodeLLDB for Rust.

## Editors everywhere: a language server

X_eTaL's editors are its own: `xetal edit`, the live demo, and an Emacs mode that highlights and draws the notation but does not yet lint or complete. A language server would put the same knowledge in every editor, as rust-analyzer does for Rust: errors as you type, the type of whatever the cursor is on, completion, go to definition, find every use, rename, and the linter's fixes as code actions. It is on the wish list and in no plan. Most of its parts exist already: located diagnostics, the linter's findings as JSON with their fixes, the completion engine the editors use, and the cross-reference `xetal doc` builds, which already knows every definition and every use. What is missing is the server that answers an editor's questions with them, and the extensions for VS Code and Neovim on top.

## Seeing the data: equations, pipelines, arrays in 3D

An array language is about data, and the most interesting tools would show it.

- **An equation editor.** The first one exists, in X_eTaL-ML's pipelines page: "Compose your own" offers the equation grammar at the caret, sums, integrals, Greek names, shows the typed text beside the drawn math, and runs or expands it. It draws when asked, not as you type, and it lives on that one page. The next step is drawing and checking on every keystroke, in the live demo and the editor too.
- **A tensor pipeline editor.** The same composer takes Flow pipelines, and the pipelines demo shows each layer four ways. What is missing is what makes pipelines worth editing: each stage's shape shown and checked as it is typed, and the arrays between stages there to inspect. X_eTaL-ML's microscope pages already show chosen intermediate arrays beside the source, but each page is built by hand for one demo.
- **Arrays in 3D.** The pieces are nearby: X_eTaL-extensions has a 3D scene with an orbit camera, and Blender renders flights through arrays as videos. None of it attaches to a running program. What I want is to fly around a program's arrays, a rank-3 array as a volume and a matrix as a surface, change a value, and watch everything that depends on it recompute; and, joined to the debugger, to do it at any paused moment.

## What to build next

In the order that would help most, judging by what the repositories show is painful or asked for:

1. **`xetal test` and xetalunit**, a test framework shaped for a functional array language rather than copied from JUnit: assertions that show where two arrays differ, table-driven cases as arrays, library doubles in place of dependency injection, spies, and fast unit tests; and property-based tests alongside, laws checked on generated arrays. It is designed and not started, and every repository tests X_eTaL code only indirectly today.
2. **A formatter that keeps comments.** Small, and overdue.
3. **The stepping debugger**, then stepping back, then DAP. Its foundation is already built.
4. **A language server**, assembled mostly from parts that exist.
5. **`xetal check`, a profiler for X_eTaL code, statistics for the benchmarks, coverage.**
6. **The visual tools:** the equation editor as you type, the pipeline editor with shapes, the 3D explorer.
7. **Packages**, once I decide whether X_eTaL wants them: so far, libraries pinned by commit have been enough.
