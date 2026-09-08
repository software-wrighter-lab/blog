---
layout: post
title: "TBT #8: wiki-rs --- Six Wikis, One Engine, Thirty Years of History"
date: 2026-03-26 00:15:00 -0800
categories: [tbt, rust, web]
tags: [tbt, wiki, rust, wasm, yew, axum, sqlite, git, vibe-coding]
keywords: "wiki, WikiWikiWeb, Ward Cunningham, TiKi, VQWiki, TiddlyWiki, GitHub Wiki, Rust, WebAssembly, Yew, Axum, SQLite, git storage, wiki history, flat file, browser storage"
author: Software Wrighter
abstract: "Six wiki implementations in Rust, tracing thirty years of storage evolution from flat files to git commits. What started as a throwback project became infrastructure for multi-agent AI coordination---with a Compare-and-Swap API that lets multiple AI agents safely share state through wiki pages."
series: "Throwback Thursday"
series_part: 8
repo_url: "https://github.com/sw-vibe-coding/wiki-rs"
demo_url: "https://sw-vibe-coding.github.io/wiki-rs/"
video_url: "https://www.youtube.com/watch?v=sy2Thj9R714"
video_title: "wiki-rs: Six Wikis, One Engine"
---

<img src="{{ '/assets/images/posts/block-windows1.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

<span style="font-size: 1.2em;">I set out to demonstrate the history of wiki implementations---six storage architectures spanning thirty years, from Ward Cunningham's flat files to git-backed commits. ***I ended up with a new approach to coordinating AI agents.***</span>

wiki-rs started as a throwback project: vibe-code the evolution of wiki storage to have my own private wikis. But when I needed multiple AI agents to share state during a complex multi-repo refactoring, the server-based wikis turned out to be the answer---with a Compare-and-Swap API for safe concurrent edits.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Live Demo** | [wiki-rs (3 client-side wikis)](https://sw-vibe-coding.github.io/wiki-rs/) |
| **Source** | [GitHub](https://github.com/sw-vibe-coding/wiki-rs) |
| **Video** | [wiki-rs: Six Wikis, One Engine](https://www.youtube.com/watch?v=sy2Thj9R714)<br>[![Video](https://img.youtube.com/vi/sy2Thj9R714/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=sy2Thj9R714) |
| **Agent Wiki** | [Sample synced page](https://github.com/sw-vibe-coding/wiki-rs/wiki/AgentStatus) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Throwback

I was a reader of Ward Cunningham's original WikiWikiWeb in the late 1990s. The concept was radical at the time: a website where any visitor could edit any page, with no approval process, no gatekeeping. Pages linked to each other with `CamelCase` words. If a page didn't exist, the link showed up differently---click it, and you created it. The entire system ran on flat files.

In the early 2000s at Sun Microsystems, I started installing wikis for my teams. The first was **TiKi**, a Ruby-based wiki---CGI scripts, flat-file storage, pre-Rails era. It was fragile but functional. Later I moved to **VQWiki**, a Java servlet-based wiki that could deploy as a WAR file and supported both file and database storage. VQWiki was reliable enough for engineering teams to depend on.

Along the way I used **TiddlyWiki** for personal projects---an entire wiki in a single HTML file, no server required. And these days I use **GitHub Wikis** for public projects, which are just git-backed markdown repositories.

Each of these represents a different answer to the same question: *where do the pages live?*

## The Storage Question

Every wiki engine has to answer this:

| Era | Engine | Storage | Trade-off |
|-----|--------|---------|-----------|
| 1995 | WikiWikiWeb | Flat files | Simple, no dependencies, no versioning |
| ~2002 | TiKi (Ruby) | CGI + flat files | Easy deployment, fragile under load |
| ~2002 | VQWiki (Java) | Servlet + file/DB hybrid | Reliable, but heavyweight |
| 2004 | TiddlyWiki | Single HTML file | Zero server, but limited scalability |
| Modern | GitHub Wiki | Git repository | Full versioning, but requires git |

The storage architecture determines everything about a wiki: how it scales, how it versions, how it deploys, whether it needs a server, and how portable the data is.

## wiki-rs: Six Approaches in Rust

I wanted to build all of these approaches in one codebase to see how they compare. wiki-rs implements six wiki variants, all sharing the same UI and wiki engine, differing only in storage:

| Variant | Storage | Server Required? | Demo |
|---------|---------|:-:|:-:|
| **Ephemeral** | In-memory HashMap | No | [Live](https://sw-vibe-coding.github.io/wiki-rs/) |
| **Browser Memory** | localStorage | No | [Live](https://sw-vibe-coding.github.io/wiki-rs/) |
| **Export/Import** | JSON file download/upload | No | [Live](https://sw-vibe-coding.github.io/wiki-rs/) |
| **Server File** | Axum + flat `.md` files | Yes | Local |
| **Server DB** | Axum + SQLite | Yes | Local |
| **Server Git** | Axum + git commits | Yes | Local |

The three client-side wikis run entirely in the browser via WebAssembly---no server, no installation. The three server wikis use Axum and require a local backend.

## Shared Engine, Pluggable Storage

The architecture uses two storage traits:

- **`WikiStorage`** (sync) --- for WASM frontends where async isn't available
- **`AsyncWikiStorage`** (async) --- for server backends

Each wiki variant is a thin wrapper (~30 lines) that implements the appropriate trait and calls the shared `render_wiki()` entry point. The wiki engine---parsing, rendering, link resolution, editing---is identical across all six.

The full codebase is 11 crates in a Cargo workspace, totaling ~2,600 lines of Rust.

## Wiki Engine Features

The engine handles the essentials:

- **Wiki links**: `[[PageName]]` and `[[PageName|display text]]`
- **Red links**: nonexistent pages show as red; clicking creates the page
- **Markdown**: headings, bold, italic, code blocks, lists (via pulldown-cmark)
- **Page aging**: five visual tiers (Fresh, Recent, Stale, Old, Ancient) based on when a page was last edited---complete with yellowing, parchment gradients, and folded-corner effects
- **Sub-wiki theming**: five color themes detected by page title prefix (e.g., `Tech/Rust` gets the Ocean theme)
- **XSS protection**: raw HTML filtered out; wiki links inside backticks aren't expanded

## Import: VQWiki and TiddlyWiki

Since I have old wiki content in both VQWiki and TiddlyWiki formats, the project includes markup converters for both:

- **VQWiki importer**: converts VQWiki's custom markup (`!!!` headings, `'''bold'''`, `[link|url]`) to standard wiki markdown
- **TiddlyWiki importer**: extracts tiddlers from TiddlyWiki HTML files and converts their markup

Both converters have test suites validating the markup transformations.

## What I Learned

Building six variants of the same wiki clarified the trade-offs:

**Ephemeral** is great for demos and testing. No persistence means no state bugs, but close the tab and everything's gone.

**Browser localStorage** is surprisingly useful for personal wikis. No server, data persists across sessions, and the 5-10 MB limit is plenty for text. The limitation is portability---the data lives in one browser on one machine.

**Export/Import** solves portability. Download the wiki as JSON, email it, upload it elsewhere. But there's no real-time versioning.

**Server File** is the closest to the original WikiWikiWeb. Flat `.md` files that you can read, grep, and back up with any tool. Simple and transparent, but no built-in versioning.

**Server SQLite** adds transactions, queries, and atomic operations. The trade-off is opacity---your wiki is inside a database file, not human-readable files.

**Server Git** is the most powerful. Every edit is a git commit with full history, diff, blame, and branch support. But it's also the most complex and has the highest overhead per edit.

## From Throwback to AI Coordination

A pattern I follow with these projects: think of a cool technology I used in the past, figure out how to recreate it in some demonstrable way, and think about how it could benefit from AI features---or how an AI agent could benefit from a modern tool based on the technology.

While working on an ambitious multi-repo project with multiple AI agents, I needed to act as coordinator between agents to implement a major refactoring. Each agent worked in its own repo, but they had shared dependencies, sequencing constraints, and status updates that needed to flow between them. I was the bottleneck---manually relaying context from one agent session to another.

I wondered if there was a way to delegate this coordination to an AI agent. And then I realized: my server-based wikis were already designed to share structured information. A wiki could serve as the shared state layer---goals, dependencies, requests, status, context---all on editable pages that any agent could read and update.

The problem: multiple agents editing the same wiki pages simultaneously will corrupt each other's work. So I added a **Compare-and-Swap (CAS) API** to the wiki server. Each edit includes the page's current version hash. If the page changed since the agent last read it, the write is rejected and the agent must re-read, merge, and retry. This gives you serialized concurrent edits without locking---the same pattern databases use for optimistic concurrency.

Then I needed a way to monitor and document what the agents were doing. So I added a tool to **export the CAS wiki as a snapshot to a GitHub Wiki**. Now the coordination state is visible, versioned, and browsable on GitHub---a living record of how the agents collaborated.

During early testing, one agent overwrote another agent's request on a shared page---a classic lost-update problem. The affected agent eventually noticed (its request had vanished), but the damage was done. That's exactly what CAS prevents at the API level. But it also showed that structural serialization isn't enough---agents can still make *semantic* conflicts even when their writes don't collide. So I asked the wiki-rs agent to add a feature to help serialize semantic changes too, ensuring agents merge intent rather than just bytes.

This is where throwback meets frontier: a thirty-year-old concept (the wiki), rebuilt in Rust, extended with concurrency primitives, and put to work as infrastructure for multi-agent AI coordination.

## Quality

The project was built with a TDD red/green/refactor process:
- 50 integration tests across unit, API, and Playwright browser tests
- Zero clippy warnings
- 69/69 on the sw-checklist quality gates

---

*The wiki is thirty years old and still the simplest way to organize knowledge. What's on yours?*
