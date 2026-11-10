---
layout: post
title: "Worth Reading #6: Building Languages --- Loeliger, SICP and AMOP"
categories: [books, programming-history]
tags: [worth-reading, books, forth, threaded-interpretive-languages, loeliger, sicp, scheme, metacircular-evaluator, amop, metaobject-protocol, clos, common-lisp]
keywords: "books worth reading, Threaded Interpretive Languages, R. G. Loeliger, Forth, inner interpreter, Structure and Interpretation of Computer Programs, SICP, Abelson, Sussman, Scheme, metacircular evaluator, The Art of the Metaobject Protocol, AMOP, Gregor Kiczales, CLOS, Common Lisp"
abstract: "Sixth in the series on books worth reading: three on building a language from a small core. R. G. Loeliger's Threaded Interpretive Languages (1981), a Forth-like language from the inner interpreter up; Abelson and Sussman's Structure and Interpretation of Computer Programs (1985), which ends by writing Scheme in Scheme; and Kiczales, des Rivières and Bobrow's The Art of the Metaobject Protocol (1991), a Lisp object system a program can reshape from inside."
series: "Worth Reading"
series_part: 6
date: 2026-12-09 00:15:00 -0800
---

<!-- DRAFT (2026-11-02), Mike: "start a new blog post for thursday 11/5, influential books", then "maybe a new series, worth reading".
     Split into posts of 2 to 4 books, about 3 on average, one a week; more books coming (Mike, 2026-11-02). Added the same day at
     Mike's request: Loosely Coupled (Doug Kaye, RDS Press, 2003), The Timeless Way of Building (Alexander, 1979), Gödel, Escher, Bach
     (Hofstadter, 1979); SICP (Abelson and Sussman, 1985), 2026-11-03, when the languages post split into logic (GEB, Mockingbird) and building languages (Loeliger, SICP, AMOP); Flow-Based Programming (Morrison, VNR 1994, first edition), added to #4 on 2026-11-05; Design Thinking (Rowe, 1987), placeholder in #2 on 2026-11-05; Your Code as a Crime Scene (Tornhill, 2015) and Design Patterns for Object-Oriented Software Development (Pree, 1995), both 2026-11-03, when #3 split into the pattern books and the coupling books; The Art of the Metaobject Protocol (Kiczales, des Rivières, Bobrow, 1991), added to the languages post 2026-11-03; Alexander's two books split from Design Patterns and Loosely Coupled. Within each post the books are in order
     of first publication until Mike reorders them by when he read them. What each book taught him is Mike: TODO; do not add reasons
     he has not given. Links point only to published posts that already cite the book or its subject. Lead image: Mike's logo-til-sicp-amop (Downloads, 2026-11-03), no-invert. -->

<img src="{{ '/assets/images/posts/logo-til-sicp-amop.webp' | relative_url }}" class="post-marker no-invert" alt="Gothic towers and staircases built of glowing code, wrapped in ribbons of light and geometric symbols" style="width: 205px;">

The [prior post](/2026/12/02/worth-reading-geb-mockingbird/) in this series was about logic and self-reference. Mike: TODO, an intro in your words for these books.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **Threaded Interpretive Languages** | R. G. Loeliger, 1981 |
| **Structure and Interpretation of Computer Programs** | Abelson and Sussman, with Julie Sussman, 1985 |
| **The Art of the Metaobject Protocol** | Kiczales, des Rivières, Bobrow, 1991 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Threaded Interpretive Languages

R. G. Loeliger, *Threaded Interpretive Languages: Their Design and Implementation* (BYTE Books, 1981). How to build a Forth-like language from an inner interpreter up, on a small machine. My own Forths are [here](/2026/10/24/embedded-forth-from-forth/) and [here](/2026/04/20/embedded-forth-self-hosting-spectrum/).

Mike: TODO, what it taught you.

## Structure and Interpretation of Computer Programs

Harold Abelson and Gerald Jay Sussman, with Julie Sussman, *Structure and Interpretation of Computer Programs* (MIT Press, 1985; second edition 1996), known as SICP. Programming taught in Scheme, ending in interpreters: a metacircular evaluator, Scheme written in Scheme, then a register machine and a compiler for it. I've wanted to write a Lisp [since I first read it decades ago](/2026/04/03/bucket-list-software-tools-landing-page/).

Mike: TODO, what it taught you.

## The Art of the Metaobject Protocol

Gregor Kiczales, Jim des Rivières and Daniel G. Bobrow, *The Art of the Metaobject Protocol* (MIT Press, 1991), known as AMOP. The Common Lisp Object System, opened up: its classes, generic functions and methods are themselves objects, and a program can change how the language behaves by extending them. The book builds a small version of CLOS to show how.

Mike: TODO, what it taught you.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
