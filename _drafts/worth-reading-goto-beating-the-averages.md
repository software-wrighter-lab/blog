---
layout: post
title: "Worth Reading #11: What a Language Lets You Say --- Go To Considered Harmful and Beating the Averages"
categories: [books, programming-history]
tags: [worth-reading, papers, dijkstra, goto-considered-harmful, structured-programming, paul-graham, beating-the-averages, lisp, macros, blub-paradox]
keywords: "papers worth reading, Go To Statement Considered Harmful, Edsger Dijkstra, structured programming, Beating the Averages, Paul Graham, Lisp, macros, Blub paradox, Viaweb"
abstract: "Eleventh in the series on what is worth reading: two papers on how a language's constructs shape what programmers can think. Edsger Dijkstra's Go To Statement Considered Harmful (1968), which argues for taking a construct away, and Paul Graham's Beating the Averages (2001), which argues for Lisp's macros."
series: "Worth Reading"
series_part: 11
date: 2027-01-13 00:15:00 -0800
---

<!-- DRAFT (2026-11-03), Mike: papers and articles, not books, added to Worth Reading as future topics; grouping and titles
     suggested and accepted 2026-11-03. Dates are placeholders. Within each post the papers are in order of publication until
     Mike reorders them. What each taught him is Mike: TODO; do not add reasons he has not given, or papers he has not named.
     Lead image: Mike's block-goto-averages.jpg (Dropbox), no-invert. -->

<img src="{{ '/assets/images/posts/block-goto-averages.webp' | relative_url }}" class="post-marker no-invert" alt="A glowing red GOTO arrow plunging into a dark vortex, among tangled cables of binary digits, staircases and ladders, while hammers smash two circuit cubes" style="width: 205px;">

The [prior post](/2027/01/06/worth-reading-worse-is-better-big-ball-of-mud/) in this series was about why the messy thing wins. Mike: TODO, an intro in your words for these papers.

<!--more-->

<div class="resource-box" markdown="1">

| Paper | Author(s), year |
|----------|------|
| **Go To Statement Considered Harmful** | Edsger W. Dijkstra, 1968 |
| **Beating the Averages** | Paul Graham, 2001 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Go To Statement Considered Harmful

Edsger W. Dijkstra, ["Go To Statement Considered Harmful"](https://www.cs.utexas.edu/~EWD/ewd02xx/EWD215.PDF), a letter to *Communications of the ACM* (March 1968). Dijkstra called it "A Case Against the Go To Statement"; the editor, Niklaus Wirth, gave it the title that became a genre. Unrestricted jumps make a program's progress hard to reason about, and the letter helped start structured programming.

Mike: TODO, what it taught you.

## Beating the Averages

Paul Graham, ["Beating the Averages"](https://www.paulgraham.com/avg.html) (2001). Lisp, and its macros in particular, as the competitive advantage behind Viaweb, and the "Blub paradox": a programmer looking down the power continuum sees the weaker languages, but looking up sees only weird languages. Graham's *On Lisp* also comes up in [X_eTaL's pipelines](/2026/10/18/array-languages-xetal-pipelines/), for the anaphoric `aif`.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these papers have in common, or where they disagree.
