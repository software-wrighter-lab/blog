---
layout: post
title: "TBT #15: APL\\360 on an IBM 2741, Printing on Green-Bar Paper"
categories: [tbt, programming-history, retrocomputing, languages]
tags: [throwback-thursday, apl, apl-360, ibm-2741, selectric, green-bar, console-3d, three-js, timeline, computer-history-museum]
keywords: "APL\\360, IBM 2741, IBM 2741 Communications Terminal, Selectric type element, green-bar paper, fan-fold paper, APL terminal emulator, APL in the browser, 3D model, three.js, Blender, APL timeline"
abstract: "The 1970 stop on my APL timeline now runs on an IBM 2741. Typed APL\\360 prints a character at a time, at the 2741's own pace, onto green-bar fan-fold paper, with the sound of the keys and the carriage return, and in 3D on my model of the 2741 from console-3D, its type element turning to each character."
series: "Throwback Thursday"
series_part: 15
# video_url: "Mike: TODO, the TBT video URL once it is published" (post.html embeds it at the end, under "Watch the Video", as in TBT #6)
# video_title: "TODO"
date: 2026-11-19 00:15:00 -0800
repo_urls:
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
  - url: "https://github.com/softwarewrighter/console-3D"
    title: "console-3D"
---

<!-- DRAFT
     Facts gathered 2026-11-19 from sw-apl (commits d54c2a7 a70-printing, e9f5a42 a70-paper,
     999cfeb a70-selectric, e9e94df opens in 3D with a start card; all 2026-11-18) and the
     console-3D README (the 2741 model, just render-2741). Screenshots are headless captures of
     the live https://sw-apl.softwarewrighter.com/demo.html?mode=A on 2026-11-19, Fast on, Sound off.
     D'83 also went live on the timeline 2026-11-16 (b037869); not covered here.
-->

<img src="{{ '/assets/images/posts/block-tbt-apl.webp' | relative_url }}" class="post-marker no-invert" alt="The letters APL in chrome over a neon sunset and a glowing grid, in 1980s synthwave style">

The [APL timeline](https://sw-apl.softwarewrighter.com/) I wrote about [last week](/2026/11/12/tbt-apl-forth-lisp-timelines/) opens on 1970, and its first live demo is <u>A</u>'70: APL\360 as people typed it then. Until now it printed in a browser font. As of this week it prints the way it did on an IBM 2741: a character at a time, on green-bar paper, with the sound of the keys, and in 3D on a model of the terminal itself.
Mike: TODO, your own memory of a 2741 (or the Selectric terminals you used), if you have one.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the TBT video link and thumbnail, once published |
| **Live demo** | [<u>A</u>'70 on the 2741](https://sw-apl.softwarewrighter.com/demo.html?mode=A) |
| **Timeline** | [APL timeline](https://sw-apl.softwarewrighter.com/) |
| **Code** | [sw-apl](https://github.com/sw-vibe-coding/sw-apl), [console-3D](https://github.com/softwarewrighter/console-3D) |
| **Prior post** | [TBT #14: APL, Forth and Lisp Timelines](/2026/11/12/tbt-apl-forth-lisp-timelines/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The 2741

The IBM 2741 Communications Terminal was a Selectric typewriter turned into a terminal. With an APL type element in it, it was how most people met APL\360 in the late 1960s and early 1970s: you typed a line, the keyboard locked, and the answer came back on the same paper at about fifteen characters a second, the type element spinning and tilting to each character. APL's special symbols were on that element, and the ones that weren't were made by overstriking: one character, a backspace, and another on top of it.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Printing at the 2741's pace

<figure class="zoomable" style="float: right; width: 230px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/tbt15-2741-2d.webp' | relative_url }}" alt="The 2D view of the A'70 demo: a session printed on green-bar paper with sprocket holes down both edges, and the type element waiting at the six-space indent">
<figcaption>The 2D view, on green-bar paper.</figcaption>
</figure>

Now <u>A</u>'70 sends what the session prints to the paper one character at a time, at about fifteen characters a second with a little jitter, and a carriage return takes longer the further the carriage has to travel. An overstrike is struck as its two parts with a backspace between them. The keyboard stays locked until printing finishes, as it did, and ATTN prints the rest at once.

The paper is continuous green-bar, stripes three lines deep, with a sprocket hole every half inch down both edges, all scrolling as it feeds. The line you're typing goes on the paper at the six-space indent, and the type element waits there.

The sound is recorded, not synthesized: a key strike pitched a little by its character, the space bar, and a thud at the return. Two buttons in the bar control it: **Fast** prints everything at once, and **Sound** turns the sound on or off. Each visit opens on a card that starts the session with sound or silently, since a browser won't play sound before a click.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The 2741 in 3D

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/tbt15-2741-life.webp' | relative_url }}" alt="An animation of the Close view: a session typed and printed at the 2741's pace on green-bar paper, )LIBS, )LIB 1, )LOAD 1 LIFE, DESCRIBE, listing the GEN function, RUN 2 printing three generations of a glider, then )CLEAR and blank lines feeding the paper">
<figcaption>The Close view, at the 2741's own pace: <code>)LIBS</code>, <code>)LIB 1</code>, <code>)LOAD 1 LIFE</code>, <code>DESCRIBE</code>, <code>∇GEN[⎕]∇</code> to list Conway's Game of Life in two lines, <code>RUN 2</code> for a glider's first two generations, then <code>)CLEAR</code> and blank lines to feed the paper. About a minute and a half; it loops. Click to enlarge.</figcaption>
</figure>

<figure class="zoomable" style="float: left; width: 230px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/tbt15-2741-whole.webp' | relative_url }}" alt="The Whole view: a 3D model of the IBM 2741, a Selectric-style terminal with an APL keyboard, fan-fold green-bar paper rising from the platen">
<figcaption>The Whole view: my model of the 2741.</figcaption>
</figure>

<u>A</u>'70 now opens in 3D, on my model of the 2741 from [console-3D](https://github.com/softwarewrighter/console-3D), my set of 3D models of historical consoles and terminals. The model is built in Blender and drawn in the browser with three.js. As the session prints, the carrier moves to each column and back at the return, and the type element tilts and turns to each character.

The paper is one continuous strip of fan-fold green-bar, from the platen up past the top, over and down behind, with sprocket holes in both margins and a perforation every 66 lines. Printed lines move up at each line feed.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

<figure class="zoomable" style="float: left; width: 230px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/tbt15-2741-half.webp' | relative_url }}" alt="The Half view: the 2741's APL keyboard with its symbols on the key fronts, the IBM 2741 Communications Terminal badge, and the printed session on the paper above">
<figcaption>The Half view: the APL keyboard and badge.</figcaption>
</figure>

There are three views: **Close**, for reading while you type, the default; **Half**, with the keyboard; and **Whole**, the entire machine. A **2D** button switches back to the flat paper, and your choice is remembered.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Try it

Open [<u>A</u>'70](https://sw-apl.softwarewrighter.com/demo.html?mode=A), choose **Start with sound**, and type a line, say `2 3⍴⍳6` or `+/⍳100`.

There are some anachronistic usability aids. The up arrow instantly brings back your prior input for editing, without animating its printing, until you press backspace to edit the recalled line. And if your keycaps don't have APL decals, as mine do, the **Keyboard** button shows where each APL symbol is and helps you enter it. **Help** lists the rest.

## Closing

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/tbt15-apl-timeline-1970.webp' | relative_url }}" alt="Part of the sw-apl timeline around 1970: the A'70 card, my live demo, with a picture of the 2741 model, labeled 1970: APL\360, with domino, the IBM Program Product, typed on a 2741; nearby cards for 1970 APL*PLUS, ca. 1973 University of Maryland APL on the UNIVAC 1110, 1973 APLSV and 1973 MCM/70">
<figcaption>Part of the APL timeline: the <u>A</u>'70 card, with the 2741.</figcaption>
</figure>

This is part of my ongoing work to build a virtual computer history museum, covering topics like APL, Forth, Lisp, and assemblers; the IBM 1130 and 1800, the UNIVAC 1110, the RCA CDP1802, the IBM 360, IBM 5100, IBM 3279G, and more.

The working demos currently linked from the [timeline](https://sw-apl.softwarewrighter.com/):

- APL\360, [<u>A</u>'70](https://sw-apl.softwarewrighter.com/demo.html?mode=A), on the 2741
- 5100 APL, [<u>B</u>'75](https://sw-apl.softwarewrighter.com/demo.html?mode=B)
- APL80 on the TRS-80, [<u>C</u>'80](https://sw-apl.softwarewrighter.com/demo.html?mode=C)
- IBM PC APL, [<u>D</u>'83](https://sw-apl.softwarewrighter.com/demo.html?mode=D)
- [COR24 APL](https://sw-embed.github.io/web-sw-cor24-apl/)
- [sw-MLPL](https://mlpl.softwarewrighter.com/)
- [X_eTaL](https://softwarewrighter.github.io/X_eTaL/), new array languages

Still to do: University of Maryland APL on the UNIVAC 1100 series, and IBM APL\1130.
