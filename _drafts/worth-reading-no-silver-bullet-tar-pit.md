---
layout: post
title: "Worth Reading #9: Essential and Accidental --- No Silver Bullet and Out of the Tar Pit"
categories: [books, programming-history]
tags: [worth-reading, papers, no-silver-bullet, fred-brooks, essential-complexity, accidental-complexity, out-of-the-tar-pit, functional-relational-programming, state]
keywords: "papers worth reading, No Silver Bullet, Fred Brooks, essential complexity, accidental complexity, Out of the Tar Pit, Moseley, Marks, Functional Relational Programming, state"
abstract: "Ninth in the series on what is worth reading, and the first on papers: two on where software's complexity comes from. Fred Brooks's No Silver Bullet (1986), on essential and accidental complexity, and Ben Moseley and Peter Marks's Out of the Tar Pit (2006), which blames state."
series: "Worth Reading"
series_part: 9
date: 2026-12-31 00:15:00 -0800
---

<!-- DRAFT (2026-11-03), Mike: papers and articles, not books, added to Worth Reading as future topics; grouping and titles
     suggested and accepted 2026-11-03. Dates are placeholders. Within each post the papers are in order of publication until
     Mike reorders them. What each taught him is Mike: TODO; do not add reasons he has not given, or papers he has not named.
     Lead image: Mike's block-silver-pit.jpg (Dropbox), no-invert. -->

<img src="{{ '/assets/images/posts/block-silver-pit.webp' | relative_url }}" class="post-marker no-invert" alt="Two panels: No Silver Bullet, a programmer at a glowing flowchart screen in a cluttered, neon-lit room; Out of the Tar Pit, a figure reaching up out of a dark tar pit full of sunken machines" style="width: 205px;">

The [prior post](/2026/12/24/worth-reading-selling-the-dream-samurai-chess/) in this series was the last of the books, for now; this one starts on papers. Mike: TODO, an intro in your words for these papers.

<!--more-->

<div class="resource-box" markdown="1">

| Paper | Author(s), year |
|----------|------|
| **No Silver Bullet** | Fred Brooks, 1986 |
| **Out of the Tar Pit** | Ben Moseley and Peter Marks, 2006 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## No Silver Bullet

Fred Brooks, "No Silver Bullet --- Essence and Accident in Software Engineering" (1986; reprinted in the 1995 edition of *The Mythical Man-Month*, which [#1](/2026/11/05/worth-reading-psychology-mythical-man-month/) covers). Software is hard because of its essential complexity, the problem itself, not only its accidental complexity, the tools and environment, so no single technique will bring an order-of-magnitude gain. [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) leaned on the same line.

Mike: TODO, what it taught you.

## Out of the Tar Pit

Ben Moseley and Peter Marks, "Out of the Tar Pit" (2006). Takes Brooks's split further: most accidental complexity comes from state, and from control flow the problem never asked for. Its answer is Functional Relational Programming, which keeps essential state in relations and derives everything else.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these papers have in common, or where they disagree.
