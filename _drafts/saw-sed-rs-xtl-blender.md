---
layout: post
title: "Saw #17: A Sharper sed, and X_eTaL in Blender for a Computer Museum"
categories: [tools, 3d]
tags: [sharpen-the-saw, sed-rs, rust, cli, x-etal, xetal, blender, 3d-models, ibm-1130, ibm-5100, apl, sw-apl, retrocomputing]
keywords: "Sharpen the Saw, sed-rs, portable sed in Rust, in-place editing, address ranges, X_eTaL Blender extension, 3D models of vintage computers, IBM 1130, IBM 5100, server rack model, virtual computer history museum, sw-apl consoles"
abstract: "Two saws this week. sed-rs, my portable sed in Rust, got a list of asks from using it to edit reva-fork; all five are in the next version, some changed after negotiation. And I am building 3D models of real machines with X_eTaL and Blender, an IBM 1130, an IBM 5100, three Selectric-based consoles and my Lucy server rack, to get better at high-fidelity models for the virtual computer history museum and for the consoles in my sw-apl demos."
series: "Sharpen the Saw Sundays"
series_part: 17
date: 2026-11-01 12:00:00 -0800
repo_urls:
  - url: "https://github.com/sw-cli-tools/sed-rs"
    title: "sed-rs"
  - url: "https://github.com/softwarewrighter/s1130-3D"
    title: "s1130-3D"
  - url: "https://github.com/softwarewrighter/s5100-3D"
    title: "s5100-3D"
  - url: "https://github.com/softwarewrighter/console-3D"
    title: "console-3D"
  - url: "https://github.com/softwarewrighter/lucy-3D"
    title: "lucy-3D"
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
---

<!-- DRAFT (2026-11-01), Mike: a short Saw post: "a sed saw and a xtl-blender saw". sed-rs (sw-cli-tools/sed-rs; main f52ba15,
     0.2.0 on 2026-10-25; uncommitted Cargo changes locally) and reva-fork docs/sed-rs-asks.md (2026-11-01: 1 -i[SUFFIX], 2 address
     ranges and first-match-only, 3 literal patterns -F, 4 --strict, 5 --diff). Mike: "I'm not implementing all of the asks, but
     some of them". Resolved 2026-11-01 from sed-rs docs/reva-fork-response.md
     (uncommitted, in testing; not linked until pushed): all five in 0.3.0, negotiated as written; --expect=N added. 3D: lucy-3D (25U rack; three views per Mike 2026-11-01: empty, early (3 servers), later (more); README 8400cd0 shows all three renders; gutter image is images/lucy-early.png from it; 2026-10-31 to
     11-01), s1130-3D (IBM 1131 CPU desk console; X_eTaL + Blender, named parts, .glb/.blend/.obj; switches, hatch), s5100-3D (IBM
     5100; WIP), console-3D (fb79c47: IBM 1053, 2741, 5471 on shared Selectric helpers; TRS-80 to be added, per Mike). Mike's plan: four APLs in sw-apl, '68 APL\1130 (IBM's first APL for sale) with a 1053 console, a 2741 console for the ca. '70 APL\360 demo (a later release, not the first; Mike corrected '68 on 2026-11-01),
     a 5100 for the '75 5100 demo, and a TRS-80 / IBM 5471 for a future APL-80 demo. Date: today is Sunday 11/01; -0800 since
     12:00 is after the 2 a.m. change (the publish script restamps 00:15 with the right offset). Lead image: Mike's
     block-3d-chainsaw.jpg (Dropbox), paper made transparent, inverts
     in dark mode (Mike asked, 2026-11-01). -->

<img src="{{ '/assets/images/posts/block-3d-chainsaw.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

Two saws this week, one small and one large. The small one is sed-rs, my portable `sed` in Rust, which got a list of requests from being used in earnest. The large one is 3D: modeling real machines with X_eTaL and Blender, to get good enough at it for a museum.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sed-rs** | [sw-cli-tools/sed-rs](https://github.com/sw-cli-tools/sed-rs); the [asks from reva-fork](https://github.com/softwarewrighter/reva-fork/blob/dev/docs/sed-rs-asks.md) |
| **IBM 1130** | [s1130-3D](https://github.com/softwarewrighter/s1130-3D) |
| **IBM 5100** | [s5100-3D](https://github.com/softwarewrighter/s5100-3D) |
| **The consoles** | [console-3D](https://github.com/softwarewrighter/console-3D) (1053, 2741, 5471) |
| **Lucy's rack** | [lucy-3D](https://github.com/softwarewrighter/lucy-3D) |
| **The pipeline** | [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions) (the Blender extension) |
| **For** | [the research campus](/2026/09/12/software-wrighter-research-campus/), [sw-apl](https://github.com/sw-vibe-coding/sw-apl) |
| **The series** | [Sharpen the Saw: every post](/series/#sharpen-the-saw-sundays) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The sed-rs saw

I wrote [sed-rs](https://github.com/sw-cli-tools/sed-rs) because the Mac's BSD `sed` and GNU `sed` on Linux do not agree, and I wanted one that behaves the same on both. Using it to edit reva-fork's files produced a [list of asks](https://github.com/softwarewrighter/reva-fork/blob/dev/docs/sed-rs-asks.md), each with the case that hit it:

1. **In-place editing with a backup** (`-i.orig`), written atomically, and leaving every file untouched if the script fails. A rejected script once truncated `CHANGES.md` through a shell redirect, and the empty file was committed.
2. **Address ranges and "first match only"** (`10,20`, `/start/,/end/`, `0,/re/`).
3. **Literal patterns** (`-F`), for edits full of `( ) [ ] . * +`, which in Forth, Rust and Markdown is most of them.
4. **`--strict`**, so an edit that matched nothing fails instead of looking like success.
5. **`--diff`**, to show what changed without a separate `diff`.

<div class="aside-box" style="float: left; width: 36%; margin: 0.3em 1.8em 1.2em 0;" markdown="1">

**Why Sharpen the Saw?** --- Stephen Covey's *[The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People)* (1989) ends with Habit 7, "Sharpen the Saw": a woodcutter too busy sawing to stop and sharpen the blade works harder and cuts less. The first six habits are about doing the work; the seventh is about renewing what does it. This series tracks the weekly investment in my tools themselves, so the work done with them goes faster.

</div>

All five made it into sed-rs 0.3.0, now in testing, but not all as asked. Some were negotiated:

- **`s//…/` does not reuse the last pattern,** as GNU's does; it keeps its old meaning, so ask 2's example repeats the pattern instead.
- **Literal mode is not quite "nothing is special".** `\n`, `\t`, `\\` and an escaped delimiter still work, because inserting lines needs `\n`. And `-F` makes only the substitutions literal, not the addresses.
- **No default warning** for an edit that matched nothing, only `--strict`. Filters that normalize test output often contain substitutions that do not match, and a warning would flood them.
- **One addition:** `--expect=N`, which fails unless exactly N replacements were made, so a pattern that is too broad is caught as well as one that matches nothing.

Whatever the flags, a failed script or check now leaves every file untouched. Existing users are protected: 68 recorded invocations from the previous version replay unchanged, apart from two intended changes, and 4,000 generated cases check the new code against a frozen copy of the old.

## The Blender saw

<figure class="zoomable" style="float: right; clear: right; width: 40%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/lucy-early-rack.webp' | relative_url }}" class="no-invert" alt="A render of the Lucy rack in its early layout: a black open-frame 25U rack with a 1U server and a 2U server at the top and a blue 4U storage chassis at the bottom, on a gray floor">
<figcaption style="font-size: 0.85em;">Lucy's rack, early: three servers, rendered by Blender from X_eTaL. Click to enlarge.</figcaption>
</figure>

The other saw is 3D modeling with X_eTaL and its Blender extension. X_eTaL builds the model as code, the extension hands it to Blender, and Blender writes `.blend`, `.glb` and `.obj` files with named parts, so a switch or a door can be found and moved in an interactive scene. Four projects are teaching me where the pipeline is weak:

- **[An IBM 1130](https://github.com/softwarewrighter/s1130-3D),** the 1131 CPU desk console, with its data switches, buttons, panels and a hatch that opens.
- **[An IBM 5100](https://github.com/softwarewrighter/s5100-3D),** the portable from the mid-1970s, built up in measured, reference-checked steps.
- **[The consoles](https://github.com/softwarewrighter/console-3D):** the IBM 1053 console of the 1130 and 1800, the IBM 2741 APL terminal, and the IBM 5471, the printer-keyboard of the System/3. All three are built on the Selectric typing mechanism, so they share their construction helpers. A TRS-80 is to be added.
- **[Lucy's rack](https://github.com/softwarewrighter/lucy-3D),** a 25U server rack modeled from photos of [my home AI cluster](/2026/02/28/lucy-20-percent-ai-cluster-upgrade/), in three views: empty, early (three servers) and later (more servers).

The goal is higher-fidelity models for two places. The first is the virtual Computer History Museum on [my research campus](/2026/09/12/software-wrighter-research-campus/). The second is [sw-apl](https://github.com/sw-vibe-coding/sw-apl), where I plan to show four APLs, each with the machine it ran on, which is where the console models come in:

| APL | Era | Console |
|---|---|---|
| APL\1130 | 1968, IBM's first APL for sale | IBM 1130 with a 1053 printer console |
| APL\360 | ca. 1970, a later release with added features | an IBM 2741 terminal |
| IBM 5100 APL | 1975 | the IBM 5100 itself |
| APL-80 | future demo | a TRS-80, and an IBM 5471 |
