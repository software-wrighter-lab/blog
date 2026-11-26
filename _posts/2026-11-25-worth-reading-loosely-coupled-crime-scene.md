---
layout: post
title: "Worth Reading #4: Components and Coupling --- Morrison, Kaye, Tornhill, and Richardson"
categories: [books, programming-history]
tags: [worth-reading, books, flow-based-programming, j-paul-morrison, dataflow, components, loose-coupling, web-services, doug-kaye, adam-tornhill, your-code-as-a-crime-scene, code-forensics, hotspots, temporal-coupling]
keywords: "books worth reading, Flow-Based Programming, J. Paul Morrison, dataflow, black-box components, information packets, Loosely Coupled, Doug Kaye, The Missing Pieces of Web Services, loose coupling, Your Code as a Crime Scene, Adam Tornhill, code forensics, hotspots, temporal coupling, version control history, Microservices Patterns, Chris Richardson, microservices"
abstract: "Fourth in the series on books worth reading: three on how software fits together, and how to see where it does not. J. Paul Morrison's Flow-Based Programming (1994), applications as networks of black-box components passing data along connections; Doug Kaye's Loosely Coupled (2003), on what web services need to work together across companies, read beside Chris Richardson's Microservices Patterns (2018); and Adam Tornhill's Your Code as a Crime Scene (2015), which reads a code base's version-control history for hotspots and hidden coupling."
series: "Worth Reading"
series_part: 4
date: 2026-11-25 00:15:00 -0800
---

<img src="{{ '/assets/images/posts/block-flow-loose-scene.webp' | relative_url }}" class="post-marker no-invert" alt="Three panels: a glowing network of components joined by flowing connections; puzzle pieces and gears fitting loosely together; investigators examining code behind crime-scene tape" style="width: 205px;">

The [prior post](/2026/11/18/worth-reading-design-patterns-pree/) in this series was about design patterns in software. This post covers another set of loosely related books that have influenced my approach to platform development.

With AI accelerating the discovery of exploits, the industry needs better architecture: more resilient systems that can patch vulnerabilities more quickly. My early exposure to MVS Dynamic Reconfiguration introduced me to the idea of keeping software running as the hardware changes underneath it, and I've been on a quest ever since to build systems that do not fail.

The ideas in these books help in building systems that are easier to change with confidence. Monolithic, tightly coupled, Big Ball of Mud architectures are brittle and hard to test, and therefore hard to change safely. Understanding how to assemble systems better, and how to test and diagnose them, seems very important to me.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **Flow-Based Programming** | J. Paul Morrison, 1994; 2nd edition 2010 |
| **Loosely Coupled** | Doug Kaye, 2003 |
| **Your Code as a Crime Scene** | Adam Tornhill, 2015 |
| **See also** | [*Microservices Patterns*](https://www.manning.com/books/microservices-patterns), Chris Richardson, 2018 |
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

After reading the first edition I discovered JavaSpaces and Linda, which gave me new ideas about distributed data processing.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Loosely Coupled

<figure class="zoomable" style="float: left; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/cover-loosely-coupled.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto;" alt="The cover of Loosely Coupled: The Missing Pieces of Web Services by Doug Kaye, black puzzle pieces against a fiery orange background">
</figure>

Doug Kaye, *Loosely Coupled: The Missing Pieces of Web Services* (RDS Press, 2003). The hard parts of web services: security, reliable messaging, and long-lived, asynchronous transactions between systems that should know as little about each other as they can. Coupling is one of the things [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) measures.

<figure class="zoomable" style="float: right; margin: 0.3em 0 0.4em 1.2em;">
<img src="{{ '/assets/images/posts/cover-microservices-patterns.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto; box-shadow: 0 0 0 1px rgba(0,0,0,0.15);" alt="The cover of Microservices Patterns: With examples in Java by Chris Richardson, from Manning, with a figure in historical costume">
</figure>

Kaye's book predates microservices by about a decade, but the case it makes for loosely coupled, independently evolving services is the same one microservices architecture later built on. For that later view, see Chris Richardson's [*Microservices Patterns*](https://www.manning.com/books/microservices-patterns) (Manning, 2018).

Part of the appeal of loosely coupled services, and of microservices, is that a small service can be written in a language that makes it quick to deploy, and later rewritten in a more secure or higher-performance language as needed. Small, testable services are easier to maintain, patch and extend.

Decades-old monoliths are still in use precisely because their tight coupling makes changes hard to implement, difficult to verify and risky to deploy. Rewriting a large, complex system has its own problems: the [second-system effect](/2026/11/04/worth-reading-psychology-mythical-man-month/) Brooks warned about. Small, testable, composable services could be less prone to it.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Your Code as a Crime Scene

<figure class="zoomable" style="float: left; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/cover-your-code-as-a-crime-scene.webp' | relative_url }}" class="no-invert" style="height: 120px; width: auto; box-shadow: 0 0 0 1px rgba(0,0,0,0.15);" alt="The cover of Your Code as a Crime Scene by Adam Tornhill, from the Pragmatic Programmers, with a magnifying glass over lines of code, foreword by Michael Feathers">
</figure>

Adam Tornhill, *Your Code as a Crime Scene: Use Forensic Techniques to Arrest Defects, Bottlenecks, and Bad Design in Your Programs* (Pragmatic Bookshelf, 2015). Forensic psychology applied to a code base's version-control history: hotspots, the few files where most of the work and most of the defects land, and temporal coupling, files that change together although nothing in the code says they depend on each other.

As an operating system developer at IBM, I was involved in studies that analyzed the bugs in our code. One of the worst and most frequent causes was an inexperienced programmer making changes to a large, complex component. Later, as a technology transfer engineer at IBM's T.J. Watson Research Center, I worked with computer scientist Ram Chillarege on [Orthogonal Defect Classification](https://en.wikipedia.org/wiki/Orthogonal_defect_classification). Later, at Silicon Valley startups, I used the code from this book to analyze code bases and the bugs we tracked.

Today I still use ODC concepts when I analyze the bugs that escape from my AI coding agent projects, to give feedback to the agents. I really want AI coding agents to learn from their mistakes and to prevent similar ones in the future.

## Closing

These books come together in a back-burner project of mine: a distributed system that can be monitored, debugged and patched, with automatic rollback. AI coding agents and my growing toolbox are bringing me closer to building and demonstrating it. Forte Software's Conductor was an inspiration, as an early example of this kind of robust distributed system. So was Paul Graham's use of Lisp to add features and fixes dynamically to a running system.
