---
layout: post
title: "Worth Reading #4: Components and Coupling --- Morrison, Kaye and Tornhill"
categories: [books, programming-history]
tags: [worth-reading, books, flow-based-programming, j-paul-morrison, dataflow, components, loose-coupling, web-services, doug-kaye, adam-tornhill, your-code-as-a-crime-scene, code-forensics, hotspots, temporal-coupling]
keywords: "books worth reading, Flow-Based Programming, J. Paul Morrison, dataflow, black-box components, information packets, Loosely Coupled, Doug Kaye, The Missing Pieces of Web Services, loose coupling, Your Code as a Crime Scene, Adam Tornhill, code forensics, hotspots, temporal coupling, version control history"
abstract: "Fourth in the series on books worth reading: three on how software fits together, and how to see where it does not. J. Paul Morrison's Flow-Based Programming (1994), applications as networks of black-box components passing data along connections; Doug Kaye's Loosely Coupled (2003), on what web services need to work together across companies; and Adam Tornhill's Your Code as a Crime Scene (2015), which reads a code base's version-control history for hotspots and hidden coupling."
series: "Worth Reading"
series_part: 4
date: 2026-11-25 00:15:00 -0800
---

<!-- DRAFT (2026-11-02), Mike: "start a new blog post for thursday 11/5, influential books", then "maybe a new series, worth reading".
     Split into posts of 2 to 4 books, about 3 on average, one a week; more books coming (Mike, 2026-11-02). Added the same day at
     Mike's request: Loosely Coupled (Doug Kaye, RDS Press, 2003), The Timeless Way of Building (Alexander, 1979), Gödel, Escher, Bach
     (Hofstadter, 1979); SICP (Abelson and Sussman, 1985), 2026-11-03, when the languages post split into logic (GEB, Mockingbird) and building languages (Loeliger, SICP, AMOP); Flow-Based Programming (Morrison, VNR 1994, first edition), added to #4 on 2026-11-05; Design Thinking (Rowe, 1987), placeholder in #2 on 2026-11-05; Your Code as a Crime Scene (Tornhill, 2015, added to #3 on 2026-11-03); Design Patterns for Object-Oriented Software Development (Pree, 1995, added 2026-11-03, when #3 split into the pattern books and the coupling books); Alexander's two books split from Design Patterns and Loosely Coupled. Within each post the books are in order
     of first publication until Mike reorders them by when he read them. What each book taught him is Mike: TODO; do not add reasons
     he has not given. Links point only to published posts that already cite the book or its subject. Lead image: Mike's block-flow-loose-scene.jpg (Dropbox, 2026-11-05), no-invert; it replaced block-loosely-scene when Flow-Based Programming joined the post. -->

<img src="{{ '/assets/images/posts/block-flow-loose-scene.webp' | relative_url }}" class="post-marker no-invert" alt="Three panels: a glowing network of components joined by flowing connections; puzzle pieces and gears fitting loosely together; investigators examining code behind crime-scene tape" style="width: 205px;">

The [prior post](/2026/11/18/worth-reading-design-patterns-pree/) in this series was about design patterns in software. Mike: TODO, an intro in your words for these books.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **Flow-Based Programming** | J. Paul Morrison, 1994; 2nd edition 2010 |
| **Loosely Coupled** | Doug Kaye, 2003 |
| **Your Code as a Crime Scene** | Adam Tornhill, 2015 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Flow-Based Programming

<figure class="zoomable" style="float: left; margin: 0.3em 1.2em 0.4em 0; white-space: nowrap;">
<img src="{{ '/assets/images/posts/cover-flow-based-programming.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto; display: inline-block; margin-right: 0.5em;" alt="The cover of the first edition of Flow-Based Programming: A New Approach to Application Development by J. Paul Morrison, its title in a yellow oval on a blue background patterned with FBP and arrows">
<img src="{{ '/assets/images/posts/cover-flow-based-programming-2e.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto; display: inline-block;" alt="The cover of Flow-Based Programming, 2nd Edition: A New Approach to Application Development by J. Paul Morrison, showing a network of boxes connected by arrows">
</figure>

J. Paul Morrison, *Flow-Based Programming: A New Approach to Application Development* (Van Nostrand Reinhold, 1994). I recently read the second edition, *Flow-Based Programming, 2nd Edition: A New Approach to Application Development* (2010). An application as a network of black-box components that share no data and communicate only by passing packets of data along connections, defined outside the components themselves. Morrison developed the approach at IBM in the early 1970s, two decades before the book. The data-flow-first pipelines of [X_eTaL's Flow library](/2026/10/18/array-languages-xetal-pipelines/) are in the same spirit. So are TSO Pipelines and CMS Pipelines, IBM's record-oriented pipes on the mainframe, which I used heavily and recreated in Rust for [TBT #2: Pipelines on OS/390](/2026/02/05/tbt-pipelines-os390/).

I learned an interesting approach to data buffers from it: instead of copying a buffer from program to program, dispatch the programs against changing versions of the buffer.

## Loosely Coupled

<figure class="zoomable" style="float: left; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/cover-loosely-coupled.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto;" alt="The cover of Loosely Coupled: The Missing Pieces of Web Services by Doug Kaye, black puzzle pieces against a fiery orange background">
</figure>

Doug Kaye, *Loosely Coupled: The Missing Pieces of Web Services* (RDS Press, 2003). The hard parts of web services: security, reliable messaging, and long-lived, asynchronous transactions between systems that should know as little about each other as they can. Coupling is one of the things [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) measures.

Mike: TODO, what it taught you.

## Your Code as a Crime Scene

Adam Tornhill, *Your Code as a Crime Scene: Use Forensic Techniques to Arrest Defects, Bottlenecks, and Bad Design in Your Programs* (Pragmatic Bookshelf, 2015). Forensic psychology applied to a code base's version-control history: hotspots, the few files where most of the work and most of the defects land, and temporal coupling, files that change together although nothing in the code says they depend on each other.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
