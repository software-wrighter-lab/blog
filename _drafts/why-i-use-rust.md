---
layout: post
title: "Why I Use #1: Rust"
categories: [languages, systems-programming]
tags: [why-i-use, rust, macros, pl-s, borrow-checker, cargo, wasm, embedded, gpu, career, programming-languages]
keywords: "why I use Rust, Rust for systems programming, Rust macros, PL/S executable macros, C preprocessor, borrow checker, Cargo, Rust WebAssembly, embedded Rust, bare metal, RTOS, no garbage collector, Rust compile times, language choice"
abstract: "First in a series on the tools I reach for, and why. One of my first systems languages, IBM's PL/S, had macros that ran during compilation to generate the code to be compiled, far better than the C preprocessor. A career of moving from each language to its improvement went from assembler to PL/S, C and C++, Java and the languages around it, then tries of F#, Go, Julia and Python. Rust, once past the borrow checker, is where it settled: macros I like to use, a good build system, ecosystem and tooling, every target I build for, whole classes of errors prevented without a garbage collector, an interpreter or a JIT. Slow compiles are a fair complaint; here is why they rarely bite me. And why I still reach for APL, Forth and Lisp to demo an idea."
series: "Why I Use"
series_part: 1
date: 2026-10-28 00:15:00 -0700
---

<!-- DRAFT (2026-10-28), Mike: a new series, "Why I Use" (Mike: not TBT, it's Wednesday and Rust isn't that old). Reasons are
     Mike's, from his message of 2026-10-28; nothing about the languages' pros and cons beyond what he said was added. Years
     (PL/S 1981-1999, Rust since 2018) come from TBT #13's published timeline. Lead image: Mike's logo-rust-rusty-gear.jpg
     (Dropbox), outside of the circle made transparent; color, no-invert. -->

<img src="{{ '/assets/images/posts/logo-rust-rusty-gear.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

When I want to build an operating system, a programming language or a tool, I reach for Rust. This is the first post in a series about the tools I reach for and why: not a ranking of languages, but the reasons one of them became my default, from a career of trying to move from each language to something better.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Rust** | [rust-lang.org](https://www.rust-lang.org/) |
| **The longer timeline** | [TBT #13: Many Decades of Learning the Next Thing](/2026/10/01/tbt-timelines-of-tools/) |
| **Built in Rust, lately** | [X_eTaL](/2026/10/07/array-languages-xetal/), [reva-fork](/2026/10/25/saw-reva-fork-cosy/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## It started with macros

One of my first systems programming languages was IBM's PL/S (in its PL/S-III form), which I used from 1981. Its macros were executable: code that ran during compilation and generated the code to be compiled. A macro could look at its arguments, compute, and write exactly the source it wanted. Compared with the alternatives, and the C preprocessor in particular, which only substitutes text, that was much better, and it set a bar I kept measuring later languages against.

## A career of moving to the next improvement

Through my career I kept trying to move from a language to an improvement on it. The path went:

| Step | Languages |
|---|---|
| The start | assembler |
| Systems | PL/S-III |
| The next generation | C and C++ |
| Managed | Java |
| Java's derivatives | Clojure, Forte 4GL, Gosu, Groovy, Kotlin, Scala |
| Tried | F#, Go, Julia, Python |

Each had its quirks, and each had its pros and cons. None of them was the last stop. ([TBT #13](/2026/10/01/tbt-timelines-of-tools/) has the full timeline, with the years.)

## Past the borrow checker

Rust has a well-known hurdle: the borrow checker, which refuses code whose ownership of memory it cannot prove safe. Getting past it takes a while. Once I had, what was on the other side was what I had been looking for:

- **Macros I like to use.** Rust's macros run at compile time and generate code, the PL/S idea again, with declarative macros for patterns and procedural macros that are ordinary Rust programs over the source.
- **A really good build system, ecosystem and tooling.** Cargo builds, tests and fetches dependencies the same way everywhere, and the crates and tools around it are there for nearly anything.
- **The targets I build for:** command-line tools, desktop apps, the web, embedded systems and GPUs.

## Everywhere I want to run

Rust supports Linux, macOS, Windows and more. Below the operating systems it runs on an RTOS or on bare metal. It compiles to WebAssembly, for the browser or the server. One language covers the whole range, from a microcontroller to a web page.

## Whole classes of errors, and no runtime to pay for

Rust prevents entire classes of errors at compile time: memory errors such as use after free, and data races between threads. It does that without a garbage collector, so there are no collection pauses, and without the overhead of a p-code interpreter. It compiles to native code, so there is no need for a JIT.

## The compile times

Yes, people complain that Rust compiles slowly, and that is fair enough. For my situation it rarely bites. I combine Rust projects so that I generally compile only a subset at a time, and I build on beefy systems with many cores and lots of RAM.

## For pleasure, and for demos

Rust is not the only language I enjoy. From a coding-pleasure point of view, Ruby was fun. And I enjoy building and playing with APL, Forth and Lisp, which I build in assembler, C or Rust, or, in Forth's case, in Forth itself ([Embedded #4](/2026/10/24/embedded-forth-from-forth/) is the latest of those).

So the split is simple. When I want to build an operating system, a programming language or a tool, I reach for Rust. When I want to demo a concept, I reach for APL, Forth or Lisp.
