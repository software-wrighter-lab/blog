---
layout: post
title: "Array Languages #4: X_eTaL-extensions, Extending the Machine"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, extensions, ffi, c-abi, rust, native-code, sqlite, regex, linear-algebra]
keywords: "X_eTaL extensions, native extensions, C ABI descriptor, Rust shared library, dylib, so, typed facade, xetal-x bridge host, SHA-256, regex, linear algebra, PNG, extension ABI V1"
abstract: "Fourth in the Array Languages series: X_eTaL-extensions, the third meaning of Extensible. Small Rust shared libraries give X_eTaL programs what the interpreter cannot do by itself, behind typed X_eTaL facades, so application code never sees the plumbing. Release 1 is Hello, Clock and SQLite, with a data notebook on Mauna Loa CO2 as its flagship, and a native Canvas window showing arrays as pixels; the ABI, the loader, the bridge host that stands in until the language grows its native hook, and why static types are what make this safe."
series: "Array Languages"
series_part: 4
date: 2026-10-10 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<img src="{{ '/assets/images/posts/block-ffi.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Libraries extend the vocabulary and macros extend the language; this is the third layer, where native code extends the machine. The rule the repo sets for itself: application code sees a typed X_eTaL facade, never FFI plumbing. The program does not know whether a function is X_eTaL, Rust or C underneath.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions) --- the ABI, the loader, the facades; release 1 is Hello, Clock and SQLite |
| **The asks** | [docs/xetal-asks.md](https://github.com/softwarewrighter/X_eTaL-extensions/blob/main/docs/xetal-asks.md) --- what the extensions need from the language |
| **Prior post** | [Array Languages #3: X_eTaL-libraries](/2026/10/09/array-languages-xetal-libraries/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The boundary

The repo holds small Rust shared libraries that give programs what the interpreter cannot do by itself --- a clock, hashing, regular expressions, fast linear algebra, PNG files --- each used from X_eTaL like any other library. Each extension exports one C-ABI descriptor with its name, version and a table of typed functions; a loader validates it and calls the functions, containing errors and panics; and a facade library gives each function an X_eTaL name and type, so `ᵈᵍs̲ha256 "abc"` does not know whether it is X_eTaL, Rust or C underneath. The language does not yet have the native hook, so for now these programs run under a bridge host, `xetal-x`; when the hook lands the facades change and the programs do not. Release 1 is Hello, Clock and SQLite. Hello is the smallest proof of the boundary; Clock gives wall-clock and monotonic time and, as a side effect, measures what the bridge costs; SQLite executes and queries SQLite files and imports CSV, and its flagship demo is a data notebook: the Mauna Loa CO2 record as a CSV in SQLite, SQL doing the grouping, X_eTaL computing the yearly rise, a least-squares line and its residuals, and a histogram. Beyond release 1, Canvas is done as well: a native window that shows arrays as pixels and sends keys and clicks back, with Life as its demo, and a headless mode so window programs test without a screen. On the roadmap: Web, a server where the program takes each request and replies; Image, pictures to and from arrays; and HTTP fetch, with a photo lab and a live earthquake-data demo waiting on them. The extension ABI is a preview, and the repo says so.

## Why the types make this safe

The static types are not a safety feature bolted onto APL. Array-language terseness packs assumptions about rank, element type and arity into a short expression; inference lets the program stay terse while the compiler answers the question *can these pieces actually compose?* --- without annotations on every line. The same types are what keep the extensibility from turning chaotic: libraries compose through them, macro expansions are checked by them, and native facades advertise them.

## Next in the series

Where the machine learning is: the ML demos and their own repo, and how X_eTaL, sw-MLPL and Rosetta M fit together on the way to a later language.
