---
layout: post
title: "Worth Reading #3: Patterns, Coupling and Code Forensics"
categories: [books, programming-history]
tags: [worth-reading, books, design-patterns, gang-of-four, object-oriented, loose-coupling, web-services, doug-kaye, adam-tornhill, your-code-as-a-crime-scene, code-forensics, hotspots, temporal-coupling]
keywords: "books worth reading, Design Patterns, Gang of Four, Gamma Helm Johnson Vlissides, object-oriented design, Loosely Coupled, Doug Kaye, The Missing Pieces of Web Services, loose coupling, Your Code as a Crime Scene, Adam Tornhill, code forensics, hotspots, temporal coupling, version control history"
abstract: "Third in the series on books worth reading: three on how software fits together, and how to see where it does not. The Gang of Four's Design Patterns (1994), patterns inside one program; Doug Kaye's Loosely Coupled (2003), on what web services need to work together across companies; and Adam Tornhill's Your Code as a Crime Scene (2015), which reads a code base's version-control history for hotspots and hidden coupling."
series: "Worth Reading"
series_part: 3
date: 2026-11-19 00:15:00 -0800
---

<!-- DRAFT (2026-11-02), Mike: "start a new blog post for thursday 11/5, influential books", then "maybe a new series, worth reading".
     Split into posts of 2 to 4 books, about 3 on average, one a week; more books coming (Mike, 2026-11-02). Added the same day at
     Mike's request: Loosely Coupled (Doug Kaye, RDS Press, 2003), The Timeless Way of Building (Alexander, 1979), Gödel, Escher, Bach
     (Hofstadter, 1979); Your Code as a Crime Scene (Tornhill, 2015, added to #3 on 2026-11-03); Alexander's two books split from Design Patterns and Loosely Coupled. Within each post the books are in order
     of first publication until Mike reorders them by when he read them. What each book taught him is Mike: TODO; do not add reasons
     he has not given. Links point only to published posts that already cite the book or its subject. Lead image: placeholder-worth-reading-design-patterns-loosely-coupled.webp -->

<img src="{{ '/assets/images/posts/placeholder-worth-reading-design-patterns-loosely-coupled.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [prior post](/2026/11/12/worth-reading-alexander-pattern-language-timeless-way/) in this series was about Christopher Alexander's patterns for buildings. Mike: TODO, an intro in your words for these books.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **Design Patterns** | Gamma, Helm, Johnson, Vlissides, 1994 |
| **Loosely Coupled** | Doug Kaye, 2003 |
| **Your Code as a Crime Scene** | Adam Tornhill, 2015 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Design Patterns

Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides, the Gang of Four, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994). Twenty-three object-oriented patterns, named and catalogued after Alexander's example.

Mike: TODO, what it taught you.

## Loosely Coupled

Doug Kaye, *Loosely Coupled: The Missing Pieces of Web Services* (RDS Press, 2003). The hard parts of web services: security, reliable messaging, and long-lived, asynchronous transactions between systems that should know as little about each other as they can. Coupling is one of the things [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) measures.

Mike: TODO, what it taught you.

## Your Code as a Crime Scene

Adam Tornhill, *Your Code as a Crime Scene: Use Forensic Techniques to Arrest Defects, Bottlenecks, and Bad Design in Your Programs* (Pragmatic Bookshelf, 2015). Forensic psychology applied to a code base's version-control history: hotspots, the few files where most of the work and most of the defects land, and temporal coupling, files that change together although nothing in the code says they depend on each other.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
