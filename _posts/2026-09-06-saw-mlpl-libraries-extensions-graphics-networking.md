---
layout: post
title: "Saw #10: sw-MLPL General-Purpose Features, Libraries, Extensions, Graphics, and Networking"
categories: [languages, machine-learning, projects]
tags: [sharpen-the-saw, sw-mlpl, mlpl, array-languages, apl, rust, wasm, compilers, extensions, wgpu, http, sqlite, mlx, cuda, linear-algebra, category-theory, abstract-algebra, design-patterns, combinators]
keywords: "sw-MLPL, MLPL, array language, APL, APL2, BQN, J, Rust, WASM, compile to Rust, language extensions, C ABI, cdylib, wgpu, native3d, HTTP server, HTTP client, SQLite, TodoMVC, mlplunit, include, libraries, linear algebra, abstract algebra, category theory, design patterns, combinators, functional pipelines, file processing, Safetensors, GGUF, MLX, Metal, CUDA, Candle, Engram, autograd"
author: Software Wrighter
abstract: "Four months of sw-MLPL work across fifteen repositories: 2,720 commits since June. The core language grew the general-purpose surface an array ML language normally lacks --- strings, records, sandboxed byte and filesystem I/O, JSON/TOML decoding, first-class function references, partial application, guaranteed-teardown error handling, and a compile-to-Rust path. Around it, thirteen companion repositories exercise that surface on mathematics, general programming, and ML tooling, and a native extension repository adds wgpu graphics, an HTTP client and server, and SQLite through a versioned C ABI."
series: "Sharpen the Saw Sundays"
series_part: 10
date: 2026-09-06 00:15:00 -0700
---

<img src="{{ '/assets/images/posts/saw-mlpl-ecosystem.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Apologies for the gap --- this is the first Saw post since [Saw #9](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/) in early May. Summer vacation, refactoring this blog, and more projects than there was time for took the months in between.

Most of that project time went to [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) and the repositories around it: 2,720 commits since 1 June across fifteen repositories, 1,508 of them in the language itself.

</div>

<div class="aside-box" markdown="1">

**TL;DR**

| Area | What landed |
|------|-------------|
| **General-purpose language** | Strings, records, sandboxed byte and filesystem I/O, JSON/TOML decode with limits, first-class function references, `call`, partial application, `bracket` teardown, structural equality, reflection, APL2 introspection |
| **Compile to Rust** | Control flow, user functions, records, Results, strings, bit-ops, file I/O and the string family all lower to the compiled path; coverage gate added |
| **Libraries** | `demo-mlpl-libraries` proves reusable MLPL modules; today's mechanism is static source composition via sandboxed `include` |
| **Demos** | Thirteen companion repos across mathematics, general programming, and ML tooling |
| **Graphics** | `native3d` --- wgpu line and point scenes, retained across every interactive demo, driven from MLPL |
| **Networking** | Bounded HTTP client, callback-free HTTP server, confined SQLite, and a persistent TodoMVC served from MLPL |
| **Extension boundary** | Versioned C ABI, panic containment, arrays/handles/records across the boundary. `use <package>`, dynamic loading, and compiled-provider startup remain open contracts |

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) |
| **Playground (stable)** | [mlpl.softwarewrighter.com](https://mlpl.softwarewrighter.com/) |
| **Playground (latest)** | [sw-ml-study.github.io/sw-mlpl](https://sw-ml-study.github.io/sw-mlpl/) |
| **Extensions** | [demo-extensions](https://github.com/sw-ml-study/demo-extensions) |
| **Libraries** | [demo-mlpl-libraries](https://github.com/sw-ml-study/demo-mlpl-libraries) · [mlplunit](https://github.com/softwarewrighter/mlplunit) |
| **Abstract algebra site** | [sw-ml-study.github.io/demo-abstract-algebra](https://sw-ml-study.github.io/demo-abstract-algebra/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The general-purpose surface

sw-MLPL began as an array and tensor language for machine learning. Most of the language work since June has been the general-purpose programming surface that an ML-first array language does not start with, grouped roughly as it landed:

| Group | Builtins and features |
|-------|----------------------|
| Strings and records | `str_len` / `str_slice` / `str_find` / `str_split`, record literals and field access, `has_field` / `record_get` / `record_keys` |
| Functions as values | first-class references generalized from `:u:name` to `:namespace:name`, `call(f, args...)`, `Partial` as a runtime value, `each` / `table`, `atop` / `over` composition, higher-order `reduce(:op, x)` |
| Errors and control | `bracket(setup, use, teardown)` with a full error plane, Result combinators, `?` composition, `global_set` |
| Bytes and files | sandboxed `read_bytes` / `write_bytes` / `append_bytes`, bounded range reads with `file_size`, `fs_walk` / `read_text` / `write_text` / `remove_path`, `file_metadata`, `scan_length_prefixed`, `reinterpret`, a little-endian typed reader family |
| Decoding | `parse_json` and `parse_toml` with `max_depth` / `max_bytes` / `max_elements` caps, duplicate-key rejection, opt-in Result reconstruction, `parse_native` |
| Testing and reflection | structural `equal` / `repr`, `@test` registration, `tests()` / `test_info()` / `annotations()` |
| APL2 lineage | `depth` / `disp` / `size` / `tally`, `transpose_axes`, `at`, `expunge`, blocked box display for rank-3 and rank-4 arrays |

A second track compiles MLPL to Rust. Since June the compiled path gained if/else and real returns, while loops and mutable variables, user functions, record literals and field access, `ok`/`err` Results, strings, comparisons, the bit-op family, the `str_*` family, `read_bytes` and `file_size`, `write_bytes` and `append_bytes`, `read_stdin`, `print`/`eprint`, `exit`, and `include` resolution in `mlpl-build` --- plus a coverage gate to keep the two paths honest about their differences.

The pattern behind most of these is documented in the project's own companion-repository notes: a downstream repository states an executable need, and the core grows the smallest surface that satisfies it. `mlplunit`, the xUnit-style test framework, drove structural equality, `include`, callables, test metadata and reflection, `bracket`, typed events, the filesystem API, `run_script`, and `parse_json`.

## Libraries

[`demo-mlpl-libraries`](https://github.com/sw-ml-study/demo-mlpl-libraries) is the proving ground for reusable modules written in MLPL and consumed by MLPL applications in other repositories. Its first integration target is `demo-extensions`, whose camera, geometry, and application helpers were being copied between demos rather than shared.

The supported mechanism today is static source composition:

```mlpl
include "vendor/swml/result.mlpl"
```

`include` is sandboxed beneath the application's `--source-dir`, expands in source order, ignores duplicate loads, and rejects cycles. Package-style distribution is not built; the repository is explicit that this is the current mechanism rather than the final one.

## Using it: mathematics, general programming, ML

Thirteen companion repositories exercise the language on real material. Each states an ownership boundary --- what MLPL does, and where a native tool or external oracle takes over --- and records what it cannot yet express as an upstream request rather than working around it.

**Mathematics.** [`demo-linear-algebra`](https://github.com/sw-ml-study/demo-linear-algebra) runs from feature vectors and dot products through least squares, PCA, LoRA, and attention; its foundation, matrix, systems/rank/conditioning, and factorization units are each accepted with their own reports. [`demo-abstract-algebra`](https://github.com/sw-ml-study/demo-abstract-algebra) builds on one observation --- a finite binary operation on `n` elements *is* an `n × n` array --- and ships a [browser Cayley table explorer](https://sw-ml-study.github.io/demo-abstract-algebra/) plus a spike running the interpreter on the page; its guided course is planned, not built. [`demo-category-theory`](https://github.com/sw-ml-study/demo-category-theory) has thirty-two lessons implemented and checked, where both sides of a law run over the same finite inputs and a failed law shows a concrete counterexample.

**General programming.** [`demo-algorithms`](https://github.com/sw-ml-study/demo-algorithms) (267 commits) covers searching, sorting, graphs, numerics, dynamic programming, serialization, and matrices, favouring whole-array operations with explicit loops as a last resort. [`demo-data-structures`](https://github.com/sw-ml-study/demo-data-structures) separates reusable implementations, worked examples, and conformance tests. [`demo-design-patterns`](https://github.com/sw-ml-study/demo-design-patterns) implements all twenty-three Gang of Four patterns functionally, classifying each as runnable, constrained, closed/tagged, or feature-gated rather than claiming a clean mapping. [`demo-combinators`](https://github.com/sw-ml-study/demo-combinators) uses Smullyan's bird-named combinators to exercise named function values and uniform `call` invocation. [`demo-functional-pipelines`](https://github.com/sw-ml-study/demo-functional-pipelines) takes composition cues from Ramda without reproducing its API. [`demo-file-processing`](https://github.com/sw-ml-study/demo-file-processing) goes from hexdump and byte statistics through WAV round trips, bounded range analysis, MP3/ID3 and Ogg inspection to an extension-backed MP3-to-Ogg capstone, with 125 native tests. [`demo-memory`](https://github.com/sw-ml-study/demo-memory) asks how a system finds the small part of memory that matters, starting at hash-table probe behaviour and heading toward caches, filters, retrieval, and sparse attention.

**ML tooling.** [`demo-ml-utils`](https://github.com/sw-ml-study/demo-ml-utils) (169 commits) does bounded inspection, validation, visualization, conversion, and quantization for Safetensors, GGUF, and tensor-only checkpoints --- header inspection uses range reads and `file_size`, so memory follows the header budget rather than artifact size. [`demo-ml-microscope`](https://github.com/sw-ml-study/demo-ml-microscope) builds on `emit_frame(name, step, value)`, which streams a whole numeric tensor and returns it unchanged, to expose named intermediate values as a recorded timeline.

## Graphics and networking through native extensions

[`demo-extensions`](https://github.com/sw-ml-study/demo-extensions) adds native capability without putting each domain in the language runtime. A Rust `cdylib` exports one C-ABI symbol; a loader validates it and registers it under a private namespace; a shipped `module.mlpl` facade re-exposes it publicly. The programming model is an MLPL module rather than an FFI call API.

**Graphics.** The `native3d` extension provides generic line and point scenes rendered with wgpu, plus a reusable MLPL camera, picking, geometry, and application loop. The demos are MLPL-owned: a bulk-array wireframe cube, tic-tac-toe with MLPL rules and minimax, and a finite-grid Life model with presets. All interactive demos now initialize one retained scene and use stable-ID patches for geometry and style changes, with view updates for camera, help, and status. A bounded point-cloud path was added with a deterministic headless renderer alongside the wgpu one.

**Networking.** Three providers: a bounded HTTP/HTTPS client with shared middleware-policy validation, a callback-free local HTTP server, and a confined parameterized SQLite provider. The server's execution model keeps the inversion explicit --- Rust owns the socket and HTTP framing but never calls into MLPL. MLPL polls one owned request, calls an ordinary MLPL handler, and supplies one owned response:

```text
server  = _web.listen(config, middleware_toml)
request = _web.next_request(server, 100)
response = u:web_dispatch_request(request, handler)
_web.respond(server, request.id, response)
_web.close(server)
```

On top of that sits a small MLPL web framework and a persistent TodoMVC serving browser CRUD from MLPL. The underscore names are the private provider contract; the public `web` facade owns their final spelling once package import lands.

**What is and is not proven.** sw-MLPL exposes a static scalar registry and a byte-compatible C-descriptor adapter, and both its built-in `hello:answer()` and the downstream `_hello:answer()` provider are proven through the interpreter. Dense arrays in both directions, opaque persistent handles, and structured record returns are proven across the real downstream descriptor, with extension signatures surfaced in `:describe` and `help`. `use <package>` import, compilation, dynamic loading, and compiled-provider startup remain tracked contracts, and the repositories treat a local mock as insufficient evidence.

## Also landed

Outside the areas above: MLX now executes on the Apple GPU with a resident optimizer keeping weights and moments on-device; a Candle/cudarc CUDA backend went from spike to a working `device("cuda")` vertical slice including a LoRA fine-tune; an Engram implementation gained a forward pass, tape differentiation, in-chain insertion, and an `engram_stats` builtin; and the visualization side added a `dataflow(nodes, edges)` structural SVG renderer and SMIL-animated widgets.
