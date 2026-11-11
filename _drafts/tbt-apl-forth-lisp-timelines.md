---
layout: post
title: "TBT #14: APL, Forth and Lisp Timelines"
categories: [tbt, programming-history, retrocomputing, languages]
tags: [throwback-thursday, timeline, apl, forth, lisp, ibm-1130, apl-1130, cor24, emulator, computer-history-museum]
keywords: "APL timeline, Forth timeline, Lisp timeline, history of APL, history of Forth, history of Lisp, APL\\1130, Forth on the IBM 1130, Lisp 1.6 on the IBM 1130, IBM 1130 emulator, computer history museum"
abstract: "Three languages I keep coming back to, APL, Forth and Lisp, each now has an interactive timeline beside my live demos of it, running from the 1950s to my own versions today. A look at the three timelines, a table of my implementations and their live demos, and the plan to finish my IBM 1130 emulator and run APL, Forth and Lisp written for the real machine, toward the computer history museum on my research campus."
series: "Throwback Thursday"
series_part: 14
date: 2026-11-12 00:15:00 -0800
repo_urls:
  - url: "https://github.com/sw-vibe-coding/sw-apl-workspaces"
    title: "sw-apl-workspaces"
  - url: "https://github.com/sw-embed/sw-cor24-forth"
    title: "sw-cor24-forth"
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
  - url: "https://github.com/sw-embed/sw-cor24-macrolisp"
    title: "sw-cor24-macrolisp"
  - url: "https://github.com/softwarewrighter/console-3D"
    title: "console-3D"
  - url: "https://github.com/softwarewrighter/s1130-3D"
    title: "s1130-3D"
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
  - url: "https://github.com/sw-embed/web-sw-cor24-forth"
    title: "web-sw-cor24-forth"
  - url: "https://github.com/sw-embed/web-sw-cor24-macrolisp"
    title: "web-sw-cor24-macrolisp"
  - url: "https://github.com/sw-comp-history/ibm-1130-rs"
    title: "ibm-1130-rs"
  - url: "https://github.com/hardwarewrighter/X_eTaL-fpga"
    title: "X_eTaL-fpga"
  - url: "https://github.com/hardwarewrighter/hex1000"
    title: "hex1000"
---

<!-- DRAFT (2026-11-11), Mike: TBT for Thursday 11/12 on the APL, Forth and Lisp timelines; a section each with a thumbnail and
     dialog of the default view; a table (not the links box) of repos and live demos; the planned 1130 work; the campus museum.
     Facts gathered 2026-11-11 (all URLs returned 200): sw-apl site root is the timeline (40 entries, opens at 1970; fea0a79);
     Forth timeline /forth-timeline/ (27 entries, opens at 1970; built in local sw-forth-timeline, no remote, so not linked);
     Lisp timeline /lisp-timeline/ (43 entries, OPENS AT 1956, home link "Back to 1958"); ibm-1130-rs (last commit 10-29: assembler
     game, console panel, 029 keypunch, 1131 console printer; no disk, DM2, Forth or APL\1130 yet; Lisp not in its plans);
     SWTOS Forth demo exists but its repo is unconfirmed, so left out. Screenshots taken from the live sites 2026-11-11.
     Lead image: Mike's block-lisp-apl-forth.jpg (Dropbox), left edge trimmed 100 px, no-invert. -->

<img src="{{ '/assets/images/posts/block-lisp-apl-forth.webp' | relative_url }}" class="post-marker no-invert" alt="A hand-drawn timeline from the 1950s to 1975 with three scenes: 1958 Lisp, a programmer at a large computer with tape drives; 1968 APL, a programmer at a typewriter terminal; 1970 Forth, a radio telescope dish in an observatory" style="width: 340px;">

Three languages I keep coming back to are APL, Forth and Lisp. I have now added an interactive timeline beside my live demos of each: the language's history from the 1950s on, with my own versions marked where they belong. Each timeline is a horizontal strip, about eleven years to a view. Scroll sideways to go earlier or later.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **APL** | [sw-apl](https://github.com/sw-vibe-coding/sw-apl), [sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces) |
| **Forth** | [sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth), [reva-fork](https://github.com/softwarewrighter/reva-fork) |
| **Lisp** | [sw-cor24-macrolisp](https://github.com/sw-embed/sw-cor24-macrolisp) |
| **3D models** | [console-3D](https://github.com/softwarewrighter/console-3D), [s1130-3D](https://github.com/softwarewrighter/s1130-3D) |
| **The series** | [Throwback Thursday: every post](/series/#throwback-thursday) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## APL Timeline

<figure class="zoomable" style="float: left; width: 280px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/tbt14-apl-timeline.webp' | relative_url }}" class="no-invert" alt="The APL timeline's opening view, 1970 to 1980: APL\360 with domino, my A'70 live demo; APLSV; the IBM 5100, my B'75 live demo; SHARP APL; the 1977 APL standard; APL80 on the TRS-80, coming soon">
<figcaption style="font-size: 0.85em;">Part of the APL timeline. Click to enlarge.</figcaption>
</figure>

[A timeline of APL](https://sw-apl.softwarewrighter.com/) is now the front page of my APL site. It has 40 entries and opens on 1970. Iverson's notation and APL\360 are to the left; to the right are APLSV, SHARP APL, the standard, the IBM PC and APL2, and on to my own array languages.

My live demos sit on it as eras: A'70, APL\360 typed on a 2741, and B'75, APLSV on the IBM 5100, with C'80, APL80 on a TRS-80, and D'83, the IBM PC, still to come. APL\1130 in 1968, on the 1130's console typewriter, is marked as a future demo. Clicking a live entry opens that demo.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>
## Forth Timeline

<figure class="zoomable" style="float: right; width: 280px; margin: 0.3em 0 0.4em 1.2em;">
<img src="{{ '/assets/images/posts/tbt14-forth-timeline.webp' | relative_url }}" class="no-invert" alt="The Forth timeline's opening view: Forth on the IBM 1130, ca. 1968, a future demo; Forth at NRAO; FORTH, Inc.; the Forth Interest Group; Forth-79">
<figcaption style="font-size: 0.85em;">Part of the Forth timeline. Click to enlarge.</figcaption>
</figure>

[A timeline of Forth](https://sw-embed.github.io/web-sw-cor24-forth/forth-timeline/) sits beside my browser Forth for COR24. It has 27 entries and also opens on 1970. Chuck Moore's FORTH took shape on an IBM 1130 at Mohasco, around 1968, and was named, five letters, by 1970. Then come Forth at the NRAO radio telescope, FORTH, Inc. in 1973, the Forth Interest Group and fig-Forth in 1978, and Forth-79.

My Forths are on it too: COR24 Forth, proto-forth-wasm, Forth in SWTOS and reva-fork. Forth on the IBM 1130 is marked as a future demo.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>
## Lisp Timeline

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/tbt14-lisp-timeline.webp' | relative_url }}" class="no-invert" alt="The Lisp timeline's opening view, 1957 to 1968: FORTRAN, ALGOL, Lisp at MIT, COBOL, McCarthy's 1960 paper, the LISP 1.5 Programmer's Manual, Maclisp, BBN-LISP">
<figcaption style="font-size: 0.85em;">Part of the Lisp timeline. Click to enlarge.</figcaption>
</figure>

[A timeline of Lisp](https://sw-embed.github.io/web-sw-cor24-macrolisp/lisp-timeline/) sits beside my browser Lisp for COR24, with 43 entries. It opens earlier than the other two, at Lisp's beginning: John McCarthy at MIT in 1958 and his 1960 paper, then the LISP 1.5 Programmer's Manual, Maclisp, BBN-LISP and on.

Its 1130 entry is Lisp 1.6 on the IBM 1130, from 1972, by Guy L. Steele Jr. at Boston Latin School, marked as a future demo. My Tiny Macro Lisp on COR24 is live; Lisp in SWTOS is still to come.

## My APLs, Forths and Lisps

| Language | Repository | Live demo |
|---|---|---|
| APL | [sw-apl](https://github.com/sw-vibe-coding/sw-apl): a clean-room APL in Rust, and [sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces) | [sw-apl](https://sw-apl.softwarewrighter.com/) |
| APL | [sw-cor24-apl](https://github.com/sw-embed/sw-cor24-apl): APL for COR24, in C | [web-sw-cor24-apl](https://sw-embed.github.io/web-sw-cor24-apl/) |
| Forth | [sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth): a tiny Forth for COR24 | [web-sw-cor24-forth](https://sw-embed.github.io/web-sw-cor24-forth/) |
| Forth | [sw-fth-wasm](https://github.com/sw-vibe-coding/sw-fth-wasm): proto-forth-wasm, a proto-Forth workbench | [sw-fth-wasm](https://sw-vibe-coding.github.io/sw-fth-wasm/) |
| Forth | [reva-fork](https://github.com/softwarewrighter/reva-fork): Reva Forth on 64-bit hosts and WebAssembly | [Reva in the browser](https://softwarewrighter.github.io/reva-fork/) |
| Lisp | [sw-cor24-macrolisp](https://github.com/sw-embed/sw-cor24-macrolisp): Tiny Macro Lisp for COR24 | [web-sw-cor24-macrolisp](https://sw-embed.github.io/web-sw-cor24-macrolisp/) |

The COR24 versions are also gathered on the [COR24 demos page](https://sw-embed.github.io/web-sw-cor24-demos/).

## Next: the IBM 1130

<figure class="zoomable outdent-left" style="width: 260px; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/tbt14-ibm1130-console.webp' | relative_url }}" class="no-invert" alt="A 3D render of the IBM 1130: the 1131 CPU desk console with its lights panel, the 1053 console printer and keyboard, and the blue-doored cabinet beside it">
<figcaption style="font-size: 0.85em;">s1130-3D model. Click to enlarge.</figcaption>
</figure>

All three timelines point at the same machine. APL\1130, Forth and Lisp 1.6 all ran on the IBM 1130, and each is marked as a future demo.

My [IBM 1130 emulator](https://sw-comp-history.github.io/ibm-1130-rs/) ([TBT #5](/2026/02/26/ibm-1130-system-emulator/)) has an assembler game, the console panel, an 029 keypunch and the console printer so far, but no disk yet. Work is planned to complete it and run, if possible, actual APL, Forth and Lisp code written for the 1130.

It will also draw on my 3D models, [console-3D](https://github.com/softwarewrighter/console-3D) for the 1053 console printer and [s1130-3D](https://github.com/softwarewrighter/s1130-3D) for the 1131 console, to animate the console, keypunch, printer, disk and the rest. The goal is to update the Computer History Museum on my [research campus](/2026/09/12/software-wrighter-research-campus/).

## Closing

<figure class="zoomable outdent-right" style="width: 260px; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/tbt14-tang-primer.webp' | relative_url }}" class="no-invert" alt="A block print of a Sipeed Tang FPGA board: a row of header pins, the FPGA chip under a TANG label, USB connectors and capacitors">
<figcaption style="font-size: 0.85em;">Primer FPGA. Click to enlarge.</figcaption>
</figure>

Recently I've been attending user groups for APL and for Forth, and I belong to a Lisp meetup group. I'm working toward improving my 1130 emulator so that it can run actual APL, Forth and Lisp. Once that works, I plan to create an FPGA version of the 1130.

I'm following the approach I took with [makerlisp.com](https://makerlisp.com/)'s COR24-TB FPGA development board, for which I wrote [an emulator](/2026/03/22/cor24-rs-assembly-emulator/). This time I'm starting with the emulator, and then creating my own FPGA design, using [X_eTaL-fpga](https://github.com/hardwarewrighter/X_eTaL-fpga), as I did for [HEX1000](https://hackaday.io/project/207074-hex1000), two hex calculators loosely based on TI's 4-bit TMS1000 calculator chip, one with a UART interface ([live demo](https://hardwarewrighter.github.io/X_eTaL-fpga/calc/)) and the other with physical buttons and LED digits ([hardware](https://github.com/hardwarewrighter/hex1000)).
