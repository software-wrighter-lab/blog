---
layout: post
title: "Worth Reading #1: The People Who Write Software --- Weinberg and Brooks"
categories: [books, programming-history]
tags: [worth-reading, books, weinberg, psychology-of-computer-programming, egoless-programming, fred-brooks, mythical-man-month, brooks-law, no-silver-bullet]
keywords: "books worth reading, The Psychology of Computer Programming, Gerald Weinberg, egoless programming, The Mythical Man-Month, Fred Brooks, Brooks's law, No Silver Bullet"
abstract: "First in a new series on the reading that shaped my approach to software development, chosen because it stood out and has not dated. Two books on the people who write software: Gerald Weinberg's The Psychology of Computer Programming (1971), on programmers alone and in teams, and Fred Brooks's The Mythical Man-Month (1975), on why adding people to a late project makes it later."
series: "Worth Reading"
series_part: 1
date: 2026-11-05 00:15:00 -0800
---

<!-- DRAFT (2026-11-02), Mike: "start a new blog post for thursday 11/5, influential books", then "maybe a new series, worth reading".
     Split into posts of 2 to 4 books, about 3 on average, one a week; more books coming (Mike, 2026-11-02). Added the same day at
     Mike's request: Loosely Coupled (Doug Kaye, RDS Press, 2003), The Timeless Way of Building (Alexander, 1979), Gödel, Escher, Bach
     (Hofstadter, 1979); SICP (Abelson and Sussman, 1985), 2026-11-03, when the languages post split into logic (GEB, Mockingbird) and building languages (Loeliger, SICP, AMOP); Your Code as a Crime Scene (Tornhill, 2015) and Design Patterns for Object-Oriented Software Development (Pree, 1995), both 2026-11-03, when #3 split into the pattern books and the coupling books; The Art of the Metaobject Protocol (Kiczales, des Rivières, Bobrow, 1991), added to the languages post 2026-11-03; Alexander's two books split from Design Patterns and Loosely Coupled. Within each post the books are in order
     of first publication until Mike reorders them by when he read them. What each book taught him is Mike: TODO; do not add reasons
     he has not given. Links point only to published posts that already cite the book or its subject. Lead image: Mike's block-psych-myth (Downloads, 2026-11-03), no-invert. -->

<img src="{{ '/assets/images/posts/block-psych-myth.webp' | relative_url }}" class="post-marker no-invert" alt="A glowing book cover: a brain, half folds and half circuitry, ringed by mythical creatures, a phoenix, a dragon, a unicorn, a fairy and a griffin" style="width: 205px;">

This series is a way to acknowledge, and share, what I have read that influenced my approach to software development, and much of that goes beyond coding. I have read many, many books on every aspect of software development; the ones in this series are the ones that stood out and stayed with me. A lot of their ideas are timeless, not tied to a particular fad or fashion in software development.

This first post is about two books on the people who write software.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **The Psychology of Computer Programming** | Gerald M. Weinberg, 1971 |
| **The Mythical Man-Month** | Frederick P. Brooks Jr., 1975 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Psychology of Computer Programming

Gerald M. Weinberg (1971; a silver anniversary edition followed in 1998, but I read the original). Programming as human behavior: programmers working alone and in teams, and egoless programming.

All eight of its main ideas stayed with me.

**Egoless programming.** A programmer who treats a program as part of themselves defends its bugs; one who detaches from it invites others to find them, and the code gets better faster. At IBM, on a team developing parts of MVS/XA, we embraced it. We had many code reviews a day, with stakeholders from many departments, and the code was discussed in detail. As a developer, I was expected to take the feedback as valuable and educational, not as personal criticism.

**Programming is social.** Most programs are written by groups, so how a team is organized and how it communicates matter as much as any one person's skill. That was a new idea to me when I read it. I had thought that writing software was all about telling the hardware what to do. I came to see that code is read, maintained, debugged, extended and replaced, and that it holds the attention of many people, possibly including me, later. It should be written for that wider audience, not just to produce running code.

**Read programs.** Weinberg opens by arguing that programmers should read other people's programs the way writers read literature, to learn style and to find problems. For me it was a daily occurrence, at code reviews of other people's code. Later, open source opened up tons of code to read.

**You cannot fully test your own program.** We tend not to see the errors in work we have just made, so someone else should review and test it. When I developed PL/S code for MVS, we had to step through the code and test every branch condition both ways, a kind of manual code-coverage testing. We tracked it with a yellow highlighter on printed assembler listings: thick printouts, delivered by cart after every compile, printed in duplicate for code review. Once a function tester accused me of skipping that step, because the console showed `SEXTENDED TORAGE` where `EXTENDED STORAGE` was expected. I pulled out my highlighted listing and showed exactly where I had stepped through that code, oblivious to the insert of `MAIN` or `EXTENDED` going in at the wrong offset. So I was not the best at function testing my own code.

**A program has to work first.** In his story, a program judged on speed and size is beaten by one that produces correct results: if a program does not have to work, it can meet any other requirement. Mike: TODO, a sentence of your own.

**The environment shapes the work.** When management removed a vending machine where programmers gathered, productivity fell, because the informal talk there was where problems got solved. Mike: TODO, a sentence of your own.

**People differ enormously.** Ability varies widely between programmers, and aptitude tests predict little; motivation, experience and training explain more. Mike: TODO, a sentence of your own.

**Languages are for people.** Weinberg judges language features by how people read and write them, not only by what the machine needs. Mike: TODO, a sentence of your own.

## The Mythical Man-Month

Frederick P. Brooks Jr. (1975; the 1995 anniversary edition adds *No Silver Bullet*). Brooks's law, that adding people to a late software project makes it later, and the line between essential and accidental complexity that [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) leaned on.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
