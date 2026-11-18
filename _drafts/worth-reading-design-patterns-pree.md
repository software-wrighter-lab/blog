---
layout: post
title: "Worth Reading #3: Design Patterns and Testing --- the Gang of Four, Pree and Binder"
categories: [books, programming-history]
tags: [worth-reading, books, design-patterns, gang-of-four, object-oriented, wolfgang-pree, metapatterns, frameworks, robert-binder, testing, object-oriented-testing]
keywords: "books worth reading, Design Patterns, Gang of Four, Gamma Helm Johnson Vlissides, object-oriented design, Design Patterns for Object-Oriented Software Development, Wolfgang Pree, metapatterns, hot spots, application frameworks, ET++, Testing Object-Oriented Systems, Robert Binder, object-oriented testing"
abstract: "Third in the series on books worth reading: Alexander's idea, carried into software. The Gang of Four's Design Patterns (1994), patterns inside one program; Wolfgang Pree's Design Patterns for Object-Oriented Software Development (1995), metapatterns and the hot spots where a framework is meant to vary; and Robert Binder's Testing Object-Oriented Systems (1999), on testing such designs with models and patterns."
series: "Worth Reading"
series_part: 3
date: 2026-11-18 00:15:00 -0800
repo_urls:
  - url: "https://github.com/sw-cli-tools/reg-rs"
    title: "reg-rs"
---

<!-- DRAFT (2026-11-02), Mike: "start a new blog post for thursday 11/5, influential books", then "maybe a new series, worth reading".
     Split into posts of 2 to 4 books, about 3 on average, one a week; more books coming (Mike, 2026-11-02). Added the same day at
     Mike's request: Loosely Coupled (Doug Kaye, RDS Press, 2003), The Timeless Way of Building (Alexander, 1979), Gödel, Escher, Bach
     (Hofstadter, 1979); SICP (Abelson and Sussman, 1985), 2026-11-03, when the languages post split into logic (GEB, Mockingbird) and building languages (Loeliger, SICP, AMOP); Flow-Based Programming (Morrison, VNR 1994, first edition), added to #4 on 2026-11-05; Design Thinking (Rowe, 1987), placeholder in #2 on 2026-11-05; Your Code as a Crime Scene (Tornhill, 2015, added to #3 on 2026-11-03); Design Patterns for Object-Oriented Software Development (Pree, 1995, added 2026-11-03, when #3 split into the pattern books and the coupling books); Alexander's two books split from Design Patterns and Loosely Coupled. Within each post the books are in order
     of first publication until Mike reorders them by when he read them. What each book taught him is Mike: TODO; do not add reasons
     he has not given. Links point only to published posts that already cite the book or its subject. Lead image: Mike's block-design-patterns (Downloads, 2026-11-03), no-invert. -->

<img src="{{ '/assets/images/posts/block-design-patterns.webp' | relative_url }}" class="post-marker no-invert" alt="A map of software design pattern icons, a crown, factories, a bridge, an eye, a terminal and more, joined by dashed arrows" style="width: 205px;">

The [prior post](/2026/11/11/worth-reading-alexander-pattern-language-timeless-way/) in this series was about architecture and design. This one is about what software made of Alexander's idea.

I knew some of these authors a little. I worked at IBM's T.J. Watson Research Center in Hawthorne, New York, in the same building as John Vlissides, though I talked with him only once, after *Design Patterns* was published. I also got to read an internally circulated draft of *Design Patterns* before it was published. I met Ralph Johnson at the University of Illinois at Urbana-Champaign, when IBM flew me out with a proposal for a joint project, one IBM later decided not to pursue. And I regularly attended the ACM OOPSLA conferences in the 1990s, where the other authors presented.

<!--more-->

<div class="resource-box" markdown="1">

| Book | Author(s), year |
|----------|------|
| **Design Patterns** | Gamma, Helm, Johnson, Vlissides, 1994 |
| **Design Patterns for Object-Oriented Software Development** | Wolfgang Pree, 1995 |
| **Testing Object-Oriented Systems** | Robert V. Binder, 1999 |
| **The series** | [Worth Reading: every post](/series/#worth-reading) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Design Patterns

<figure class="zoomable" style="float: left; width: 90px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/cover-design-patterns.webp' | relative_url }}" class="no-invert" alt="The cover of Design Patterns: Elements of Reusable Object-Oriented Software by Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides, white with a blue spine and an M. C. Escher print of interlocking birds">
</figure>

Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides, the Gang of Four, *Design Patterns: Elements of Reusable Object-Oriented Software* (1994). Twenty-three object-oriented patterns, named and catalogued after Alexander's example.

I embraced it when I was implementing Java libraries for mainframe record-oriented file systems, using Builder, Facade, Chain of Responsibility and others. This book was very influential on my work, and it improved my skills.

## Design Patterns for Object-Oriented Software Development

<figure class="zoomable" style="float: left; width: 90px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/cover-design-patterns-pree.webp' | relative_url }}" class="no-invert" alt="The cover of Design Patterns for Object-Oriented Software Development by Wolfgang Pree, Addison-Wesley and ACM Press, gold title on black over a deep blue abstract pattern">
</figure>

Wolfgang Pree, *Design Patterns for Object-Oriented Software Development* (Addison-Wesley and ACM Press, 1995). Patterns one level up: metapatterns, a small set that describes the patterns of application frameworks, and hot spots, the places where a framework is meant to vary and be extended, worked through on the C++ GUI framework ET++.

Around the same time I read many patterns books that tried to catalog many more application patterns. Those turned out not to be very relevant to my systems programming, what would later be called platform engineering. Of all of them, Pree's book stood out, and it really resonated with me.

Pree divides any reusable framework into two fundamental parts: frozen spots, which stay the same in every application built on it, and hot spots, where each application varies it. He shows that many of the Gang of Four's 23 patterns are variations on template and hook methods: a template method that holds the frozen part and calls hook methods for the hot spots. I found that very insightful, and directly applicable to my object-oriented analysis and design work.

## Testing Object-Oriented Systems

Robert V. Binder, *Testing Object-Oriented Systems: Models, Patterns, and Tools* (Addison-Wesley, 1999). Testing for object-oriented designs: test models drawn from the design, and test design patterns, catalogued the way design patterns were.

Through my software development career, the number of developers and the number of testers (QA and QE) were often out of balance. We used testers to help implement features when we were short of developers, and developers to write and run tests when we were short of testers. That got me interested in testing techniques and tools. This was the most comprehensive book I could find, and while it covers testing object-oriented code, a lot of it applies to other ways of building software.

It influenced me to create many testing frameworks later: JUnit-like ones for languages such as Forte 4GL, Guidewire Gosu and my own sw-MLPL ([mlplunit](/2026/09/06/saw-mlpl-libraries-extensions-graphics-networking/)). I ported regress, a C++ golden-file CLI testing tool, to Java, and later to Rust, then adapted it for AI coding and testing as [reg-rs](https://github.com/sw-cli-tools/reg-rs). I have also written fuzzers, mocks, spies, dummies, fixtures and more. I am still very interested in testing, and I use various tools every day to make sure my AI coding work is of higher quality and doesn't break when new features or fixes are added.

## Closing

Mike: TODO, a closing in your words: what these books have in common, or where they disagree.
