---
layout: post
title: "Saw #13: A Second Host in the Cloud, a Word Cloud, and Three Benches to Set Up"
categories: [tools, projects, embedded, machine-learning, languages]
tags: [sharpen-the-saw, osdev, github-profile, documentation, literate-programming, org-mode, org-babel, mlos, sw-os-ml, cloud-sessions, claude-code, x86-64, arm64, portability, wordcloud, rust, sw-apl, apl, sw-apl-workspaces, self-study, rosetta-m, m-poc, sw-mlpl, mlpl, sw-atlas, typed-decisions, demo-decision-model, docent, reasoning-from-scratch, qwen3, sw-tos, cor24, i2c, spi, emulator, mcu, study-group]
keywords: "Sharpen the Saw, OSDev.org, #osdev IRC, code walkthrough, literate programming, Emacs org-mode, org-babel, GitHub profile README, social preview cards, MLOS, sw-os-ml, Claude Code cloud sessions, parallel development workflow, x86-64 port, ARM64, two-host portability, wordcloud, Rust CLI, sw-apl, APL course, sw-apl-workspaces, Rosetta M, m-poc, sw-MLPL, sw-atlas, Docent matcher, typed decision model, Jev, demo-decision-model, reasoning-from-scratch, Qwen3, sw-tos, 32-bit MCU, COR24-TB, I2C, SPI, emulator, ML study group, electronics"
abstract: "This week's sharpening is mostly benches. Claude in the cloud recreated my development environment on a Linux host and now works the x86-64 side of MLOS while this Mac keeps the ARM side; a small Rust tool draws word clouds for future posts; the APL self-study course became a library the interpreter loads; a new ML language is under way, its notation still evolving and its name held back until there is a demo; the Docent matcher in sw-atlas is about to learn from the typed decision model; every GitHub landing page and social card got a pass; and I finally have a seat in #osdev and on OSDev.org. Ahead: two Zoom calls, and the benches they need --- sw-tos on a 32-bit MCU, APL on a small Linux board, and I2C and SPI device tests on COR24-TB and its emulator."
series: "Sharpen the Saw Sundays"
series_part: 13
date: 2026-09-27 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-ml-study/sw-os-ml"
    title: "sw-os-ml (MLOS)"
  - url: "https://github.com/softwarewrighter/wordcloud"
    title: "wordcloud"
  - url: "https://github.com/sw-vibe-coding/sw-apl-workspaces"
    title: "sw-apl-workspaces"
  - url: "https://github.com/sw-ml-study/m-poc"
    title: "m-poc (Rosetta M)"
  - url: "https://github.com/software-wrighter-lab/sw-atlas"
    title: "sw-atlas"
  - url: "https://github.com/sw-ml-study/demo-decision-model"
    title: "demo-decision-model"
  - url: "https://github.com/sw-ml-study/reasoning-from-scratch"
    title: "reasoning-from-scratch"
  - url: "https://github.com/sw-embed/sw-cor24-emulator"
    title: "sw-cor24-emulator"
---

<img src="{{ '/assets/images/posts/saw-13-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Thirteenth Sharpen the Saw update. [Last time](/2026/09/20/saw-atlas-typed-decisions/) the saw was a model that decides rather than writes, and an index that knows what the lab has published. This week the sharpening is mostly *benches*: places to stand while cutting. A second host in the cloud for the x86-64 half of an operating system, a word-cloud tool for the posts themselves, a course that lives inside an interpreter, a pass over every front door on GitHub, a first seat among the OS developers on OSDev.org, and three benches that two upcoming Zoom calls will need set up before I can show anything on them.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **MLOS** | [sw-ml-study/sw-os-ml](https://github.com/sw-ml-study/sw-os-ml) --- the ML operating system; ARM on this Mac, x86-64 in the cloud |
| **Cloud sessions** | [Claude Code cloud environments](https://code.claude.com/docs/en/cloud-environments) --- the second host, and the parallel workflow |
| **wordcloud** | [softwarewrighter/wordcloud](https://github.com/softwarewrighter/wordcloud) --- a Rust CLI: words in, PNG or SVG out |
| **APL course** | [sw-vibe-coding/sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces) · [sw-apl](https://github.com/sw-vibe-coding/sw-apl) |
| **Rosetta M** | [sw-ml-study/m-poc](https://github.com/sw-ml-study/m-poc) · [live](https://sw-ml-study.github.io/m-poc/) · [yesterday's post](/2026/09/25/made-visible-rosetta-m/) |
| **Atlas and the Docent** | [software-wrighter-lab/sw-atlas](https://github.com/software-wrighter-lab/sw-atlas) · [sw-ml-study/demo-decision-model](https://github.com/sw-ml-study/demo-decision-model) · [Jev](https://typesafe.ai/) |
| **Reasoning** | [sw-ml-study/reasoning-from-scratch](https://github.com/sw-ml-study/reasoning-from-scratch) --- Raschka's book, ported to sw-MLPL |
| **The benches ahead** | [sw-embed/sw-tos](https://github.com/sw-embed/sw-tos) · [sw-embed/sw-cor24-emulator](https://github.com/sw-embed/sw-cor24-emulator) · [Saw #9: pluggable I2C on COR24](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/) |
| **Prior post** | [Saw #12: A Model That Decides, and an Index That Knows](/2026/09/20/saw-atlas-typed-decisions/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="aside-box" markdown="1">

**Why "Saw"?** The name is Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. [This series](/series/#sharpen-the-saw-sundays) is where I account for the time spent on tools, environments and habits rather than on the work itself --- and this week, on the benches the work has to sit on.

</div>

## A second host, in the cloud

[MLOS](/2026/09/13/made-visible-mlos/) is three weeks old. It is a Rust kernel that treats resident model state --- weights, KV blocks, activations --- as kernel objects with residency and tiering, and until this week it had one host: this Mac, booting under Virtualization.framework on ARM64. This week the plan grew two sagas, an x86-64 port and *two-host portability*, and that second host is where the sharpening is.

The second host is a Linux machine in the cloud that I do not own, maintain, or set up. Claude in the cloud recreated my development environment there --- installed my tools and an emulator --- on its own; whatever it wrote down to do that lives in its metadata, not in my repository. I had used this during an invitation beta; now it is integrated into web-based Claude, which is what moved it from a thing I tried to a thing I use. The cloud session works the Linux x86-64 side of MLOS while I work the ARM side here on the Mac, at the same time.

The saw is the *parallel development workflow*: two hosts, two architectures, one tree, with an agent on the one I am not sitting at. The portability saga is the test of it, because a port that only ever gets built on one machine is not a port.

What I should be doing to sharpen it further:

- **Give each host a branch to own.** The cloud session owns the x86-64 bring-up branch; the Mac owns ARM. Merges happen through the same checks, not through memory of what worked where.
- **Ask for the recipe.** The cloud environment is rebuilt from what the agent knows, not from anything I can read. Getting that setup written into the repository, where a contributor with a Linux box could run it, is worth a session of its own.
- **Reuse the arrangement for the MCU benches.** An emulator on a Linux host that an agent can drive is exactly what the COR24 and sw-tos work below will want.

## A word cloud, for the posts

<figure style="float: right; margin: 0 0 1em 1.5em; max-width: 58%;">
<img src="{{ '/assets/images/posts/saw-13-wordcloud.webp' | relative_url }}" class="no-invert" alt="A word cloud of this week's topics: MLOS, sw-MLPL, cloud session, reasoning-from-scratch, sw-apl, COR24-TB, and the rest">
<figcaption style="font-size: 0.85em;">This week, as a word cloud --- drawn by the tool this section is about, from a list of weighted words on the command line.</figcaption>
</figure>

The smallest saw of the week is a tool for the blog itself: [wordcloud](https://github.com/softwarewrighter/wordcloud), a Rust command-line program that takes words on the command line --- `word=weight` for explicit sizes, or ordered, equal or random sizing --- and writes a PNG or an SVG. Named palettes or a list of hex colors, any background or a transparent one, a fraction of words drawn vertically, a seed for reproducible layouts. Under a thousand lines across five files; clap, ab_glyph and the image crate do the heavy lifting, and DejaVu Sans Bold is bundled so the output is the same on every machine.

It was vibe-coded, and it earns a Saw slot for the same reason ShareX and Espanso did back in [Saw #9](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/): a post needs an image at the top, and the more of those images I can make from the text of the post itself, the more posts get written. The figure beside this paragraph is the tool's first real output --- the week's topics, weighted by how much of the week they took.

Next for it: read a post's front matter and draw its tags directly, and an SVG that respects the site's dark theme so the same cloud reads in both.

<div style="clear: both;"></div>

## A course that lives inside the interpreter

[sw-apl](https://github.com/sw-vibe-coding/sw-apl) models historical APLs --- APL\360, the '68 subset, APLSV, and now B75 --- and it has been the most active repository on the machine this month, with workspace *modes*, libraries by mode, `)COPY`, `)LIBS`, `)HELP`, a 2741 terminal emulation with overstrikes, and an APL385 font in the web demo. The sharpening is what happened beside it: [sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces), started on Thursday, is *library 2* --- a workspace library the interpreter loads with `--lib` --- and its contents are a self-study APL course, lessons 1 through 14 with example functions, plus drill tables and topic workspaces (`INDEX`, `STRUCTURE`, `SHOW`).

The saw is the packaging. A course that is a library means the interpreter serves the lessons: load one, read it, run its functions, `)COPY` what you want to keep. There is no separate document to drift out of step with the language, because the course is written in the language. It is also the shape the other courses on the campus want --- the [abstract algebra course](https://github.com/sw-ml-study/demo-abstract-algebra) already grades its eleven lessons in sw-MLPL --- and it is the shape I want for the study group below.

## A language to be named later

[Yesterday's post](/2026/09/25/made-visible-rosetta-m/) was Rosetta M, the m-poc mock-up built on [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl). The work that follows it is a new ML programming language. It has a name; I am not publishing the name until the language does something --- an MVP demo --- and that is not yet. What has to happen first is the notation. It is not nailed down, and it has to evolve before there is anything to demo.

The saw is the discipline of that order: notation first, then a demo, then the name. Naming a language before it runs invites everyone, me included, to argue about the name instead of the notation.

## Teaching the Docent to decide

[Saw #12](/2026/09/20/saw-atlas-typed-decisions/) introduced two things: the typed decision model, a 33,065-parameter model that reads a sentence and returns probabilities over a fixed set of replies, in the browser, with a trace; and sw-atlas, one semantic index over everything the lab publishes. This week they started to meet.

The atlas has a *matcher* --- given a question, find the exhibit --- and the atlas-baseline saga has been building its measuring stick: 308 paraphrased questions with known answers, an evaluation harness, and a scoreboard step that is where the saga sits now. The Docent, the campus tour guide, is the matcher's user. What the typed decision work brings is the [Jev](https://typesafe.ai/) framing: a decision is a choice over a *typed* set of outcomes, made by a small model that can abstain, and traced so the choice can be inspected. Using that work to enhance the Docent's matcher --- a typed decision over the atlas's concepts, abstention included --- is the experiment. demo-decision-model already has a measurement against sw-atlas, its demo 02, and the ELIZA rebuild there (8,462 inputs labelled by Weizenbaum's own DOCTOR script) is where the typed-question mechanics have been worked out.

The saw: the eval harness came before the model. The 308 questions and the scoreboard exist so that when the typed matcher replaces the baseline, the number moves or it does not, and either way I know.

The matcher is the near goal. The far one is why the atlas exists at all: a complete index into all of my work --- posts, campus exhibits, repositories, videos --- so that an AI agent can walk it periodically, find the incomplete content and the broken links, suggest improvements, and help me finish things and add wings and buildings to the [campus](https://software-wrighter-lab.github.io/sw-campus/). The Docent answers a visitor's question; the same index should let an agent answer mine: *what here is unfinished?*

## Front doors, and a place to talk operating systems

Two more saws, both sharpened today. The first is the set of front doors. With an AI agent doing the legwork, I went through every landing page I own on GitHub --- the user profile, every organization's profile, and most of the repository descriptions --- and the "social" preview cards that show up when a link is shared. None of that is the work, and all of it is what a visitor sees first. An atlas that indexes everything is only useful if the front of each building says what is inside, and until today a good many did not.

The second is a room I had not been in. I registered `softwarewrighter` on the `#osdev` IRC channel and made a profile and my first posts on [OSDev.org](https://wiki.osdev.org/), the forum and wiki where people who write operating systems from scratch compare notes. Three kernels in the lab --- [sw-tos](/2026/09/11/made-visible-swtos/), [MesaOS](/2026/09/12/made-visible-mesaos/) and [MLOS](/2026/09/13/made-visible-mlos/) --- have so far been built in the company of an AI agent and a blog. The MCU port, the x86-64 port and the layout viewer are all things other OS developers have opinions about, and the saw is being somewhere those opinions can reach me.

The first opinion has already arrived, and it is about MLOS's documentation. The source comments in [sw-os-ml](https://github.com/sw-ml-study/sw-os-ml) are verbose --- possibly too verbose --- and there is nothing between them and the README that a newcomer can read in one sitting. What I owe OSDev.org, then, is a concise code walkthrough: a terse document that explains MLOS in order, without the detail. Beyond that, and in the shape several of the lab's other projects have already taken, Emacs org-mode with Babel --- literate documents that explain the OS in understandable chunks, showing the code that matters for each chunk and hiding the rest. The microgpt port, the MoE microscope and the coding agent each got one of those this month; MLOS has not, and it is the one that was just asked for it.


## Two calls, three benches

Two Zoom calls are coming up --- an electronics group and the ML study group --- and each one wants a bench I do not have set up yet.

**For the electronics call**, three things, in increasing order of how much work is left:

1. **I2C and SPI device testing on COR24-TB and its emulator.** [Saw #9](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/) laid out pluggable I2C devices for the [COR24 emulator](https://github.com/sw-embed/sw-cor24-emulator) --- a device trait, TMP101, DS3231 and an EEPROM as the first set, SPI as phase two. The emulator side has not moved since August; the board has the real buses. The bench I want is the same device test running against the emulator and against the board, with the board's answer as the oracle. That is the same two-host idea as MLOS, one level down.
2. **[sw-tos](https://github.com/sw-embed/sw-tos) on a 32-bit MCU.** The microkernel that [Made Visible #1](/2026/09/11/made-visible-swtos/) drew now has an SD card root listing and a FAT32 shell command, and it publishes its storage layout for the shared viewer. Porting it to one or more 32-bit microcontrollers is the next place it can go.
3. **A language on a small Linux-capable board.** sw-apl, specifically --- the interpreter, its 2741 emulation and the course library, on a board small enough to hand around on a call.

**For the ML study group**, the bench is [reasoning-from-scratch](https://github.com/sw-ml-study/reasoning-from-scratch): Sebastian Raschka's book, ported chapter by chapter to sw-MLPL. Ten days in it has a capability ledger with probes, the MATH data loader, answer extraction and expression equivalence, an evaluation harness, a tokenizer imported from `tokenizer.json` with fixture parity, a Qwen3 forward pass checked on a tiny configuration, and cached generation that is bit-identical to recomputation and not yet faster. Six findings went back to sw-MLPL along the way; the [demo-extensions](https://github.com/sw-ml-study/demo-extensions) repo grew a large-download surface, a digest primitive and a byte-level BPE tokenizer to support it. That is what I am preparing for the study group.

## Also on the bench

- **sw-MLPL** landed differentiable `sqrt`, `sin`, `cos` and `pow`, `take`/`gather` fixes, a per-parameter Adam step counter, bf16/f16 dtypes, bulk `unpack`, and moved the backward pass into its own crate. The latest addition is syntax-colored MLPL in literate HTML output.
- **moe-microscope** added lessons for the dense baseline, routing and sparse dispatch, a data-scale sweep, a resource-budget calculator, a recurrent block, Engram and a selective SSM, plus a literate org-mode reading.
- **microgpt-mlpl** ported Karpathy's microgpt in a day, byte-identical to the Rust port, 1000 Adam steps in about 0.8 s, with faithful, idiomatic and compact variants side by side.
- **Three operating systems, one layout contract.** sw-tos, MesaOS and MLOS all emit the same columnar memory-and-storage layout JSON now, and demo-extensions renders any of them in the native3d viewer --- the [Made Visible](/series/#made-visible) series' shared picture, formalized.
- **sw-campus** taught the Docent about the MoE microscope and hung an IBM 1130 wing painting with linked exhibits.

## What sharpening looks like this week

The question I set out to answer was *what should I be doing to sharpen the saw*, given all of the above. The honest list:

1. **Keep both hosts building.** The x86-64 port lives or dies on whether the cloud session and the Mac keep passing the same checks on the same tree.
2. **Give the MCU benches the same treatment.** A cloud host with the COR24 emulator, so the device tests run there too and the board is only needed for the oracle run.
3. **Write the device tests before the call, not the devices.** TMP101 and DS3231 against the emulator first; the board confirms.
4. **Keep the courses in the language.** APL lessons in workspaces, reasoning chapters in sw-MLPL, both loadable and both run by the test suite.
5. **Evolve the notation** for the new language until it can carry an MVP demo, and hold the name until then.
6. **Move the Docent's number**, typed matcher versus baseline on the 308 questions --- and keep the index complete, because the review agent is only as good as what the atlas knows about.
7. **Keep the front doors current.** The profiles, descriptions and cards were updated once; they need to change when the work does, and that is a job the review agent above can carry.
8. **Show up in #osdev, and answer the first request.** A terse code walkthrough for MLOS, then org-mode literate documents that explain it in chunks --- because the comments, however careful, are not a way in.
9. **Draw the next marker with the tool.** If wordcloud reads a post's tags, the marker for Saw #14 is a command, not a session.

## Possible next steps

- The x86-64 MLOS port booting under an emulator in a cloud session, with the Mac's ARM build passing the same gate.
- A concise code walkthrough for MLOS, and its first org-mode literate document.
- COR24 SPI as a real phase two, with the first SPI device on the emulator and the board.
- sw-tos on a first 32-bit MCU target, then the storage layout emitter running there too.
- A `--from-post` flag on wordcloud that reads Jekyll front matter.
- The reasoning port's cached generation actually faster than recomputation, and the study group's first chapter session.
- The new language's MVP demo, and with it the name.
