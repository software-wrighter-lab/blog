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

Gerald M. Weinberg (1971; a silver anniversary edition followed in 1998, but I read the original). Programming as human behavior: programmers working alone and in teams, and egoless programming. All eight of its main ideas stayed with me. In each box, Weinberg's idea is on top and what it meant for me is below:

<div class="grid-4">
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">1</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Egoless programming</div>
<p style="margin: 0 0 0.5em;">Detach from your code, and invite others to find its bugs; the code gets better faster.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>At IBM, on a team developing parts of MVS/XA, we embraced it. We had many code reviews a day, with stakeholders from many departments, and the code was discussed in detail.</p><p style="margin-bottom: 0;">As a developer, I was expected to take the feedback as valuable and educational, not as personal criticism.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">2</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Programming is social</div>
<p style="margin: 0 0 0.5em;">Most programs are written by groups; how a team works matters as much as any one person's skill.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>That was a new idea to me. I had thought writing software was all about telling the hardware what to do.</p><p style="margin-bottom: 0;">Code is read, maintained, debugged, extended and replaced, by many people, possibly including me, later. It should be written for that wider audience, not just to produce running code.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">3</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Read programs</div>
<p style="margin: 0 0 0.5em;">Read other people's programs the way writers read literature, to learn style and to find problems.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">For me it was a daily occurrence, at code reviews of other people's code. Later, open source opened up tons of code to read.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">4</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">You cannot fully test your own program</div>
<p style="margin: 0 0 0.5em;">We do not see the errors in work we have just made, so someone else should review and test it.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>Writing PL/S for MVS, we stepped through every branch both ways, tracked in yellow highlighter on printed assembler listings, delivered by cart after every compile.</p><p style="margin-bottom: 0;">A function tester once accused me of skipping that, when the console showed <code>SEXTENDED TORAGE</code>. My highlighted listing showed exactly where I had stepped through it, oblivious to the insert going in at the wrong offset. I was not the best tester of my own code.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">5</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">A program has to work first</div>
<p style="margin: 0 0 0.5em;">If a program does not have to work, it can meet any other requirement. Fast with the wrong map gets you somewhere sooner, but not where you meant to go.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>Releases I worked on went in that order: version 1 "light the lights", an MVP before the name; version 2 "fix the bugs, add the missing features"; version 3 "make it fast", and "make it better", such as usability, often an afterthought.</p><p style="margin-bottom: 0;">My new projects go the same way: it works, then features, then faster and easier to use.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">6</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">The environment shapes the work</div>
<p style="margin: 0 0 0.5em;">Remove the vending machine where programmers gathered, and you lose the hall talk that solved problems.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Most of my working environments encouraged hall talk, and many problems were solved informally: at a whiteboard, over coffee, or at lunch.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">7</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">People are the hard part</div>
<p style="margin: 0 0 0.5em;">Ability varies widely between programmers, and aptitude tests predict little.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>The hardest part of software development is dealing with people. When I get pushback, I think of "dogs bark at what they don't understand", and the onus is on me to explain it better.</p><p style="margin-bottom: 0;">As an architect, and in technology transfer, I had to tell different audiences different things, for different concerns. It was not straightforward.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">8</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Languages are for people</div>
<p style="margin: 0 0 0.5em;">Judge a language feature by how people read and write it, not only by what the machine needs.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p>Now they are for agents too, human and AI. Lisp, Scheme and Clojure were adopted less than I hoped; many could not get past the parentheses. I have my own likes and dislikes, and no language suits everyone.</p><p style="margin-bottom: 0;">Like the personal computer, I think the personal programming language is coming. I have created several, among them <a href="/2026/10/07/array-languages-xetal/">X_eTaL</a>, <a href="/2026/09/16/ai-tools-coding-agent-in-mlpl/">sw-MLPL</a> and <a href="/2026/10/30/why-i-use-asm-c-plsw/">PL/SW</a>.</p></div>
</div>
</div>

## The Mythical Man-Month

Frederick P. Brooks Jr. (1975; the 1995 anniversary edition adds *No Silver Bullet*). Brooks managed the development of IBM's OS/360, the ancestor of the MVS I later worked on, and the book is what he learned from it. In each box, Brooks's idea is on top and what it meant for me is below:

<div class="grid-4">
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">1</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Brooks's law</div>
<p style="margin: 0 0 0.5em;">Adding people to a late software project makes it later.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">2</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">The mythical man-month</div>
<p style="margin: 0 0 0.5em;">People and months are not interchangeable: every person added adds communication, and the paths between n people grow as n(n-1)/2.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">3</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Conceptual integrity</div>
<p style="margin: 0 0 0.5em;">The most important quality of a system design. It comes from one mind, or a few in agreement: an architect, separate from the implementers.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">4</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">Plan to throw one away</div>
<p style="margin: 0 0 0.5em;">The first system built is a pilot, and you will throw it away anyway; the only question is whether you plan to.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">5</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">The second-system effect</div>
<p style="margin: 0 0 0.5em;">A designer's second system is the most dangerous one: every feature held back from the first goes into it.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">6</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">The surgical team</div>
<p style="margin: 0 0 0.5em;">Organize a team around one chief programmer, with others in support roles, rather than many equals working on the same code.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">7</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">One day at a time</div>
<p style="margin: 0 0 0.5em;">How does a project get to be a year late? One day at a time. Small slips are the ones to watch.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
<div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 0.6em 0.8em; font-size: 0.88em;">
<div style="font-size: 2.4em; font-weight: 700; line-height: 1; color: var(--link-color);">8</div>
<div style="font-weight: 700; margin: 0.3em 0 0.2em;">No silver bullet</div>
<p style="margin: 0 0 0.5em;">Software's hard part is its essential complexity, the problem itself; no tool or technique removes that by an order of magnitude.</p>
<div style="border-top: 1px solid var(--border-color); padding-top: 0.5em;"><p style="margin-bottom: 0;">Mike: TODO, your thoughts, or skip this one.</p></div>
</div>
</div>

Its line between essential and accidental complexity is also one that [sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) leaned on.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
