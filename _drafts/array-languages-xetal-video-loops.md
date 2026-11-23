---
layout: post
title: "Array Languages #22: From Scalar Loops to Array Operations"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, rust, video, teaching, map, filter, reduce]
keywords: "array programming tutorial, scalar loop versus array operation, map filter reduce, boolean mask, replicate, reduce, Rust iterator chains versus array languages, array languages video series, X_eTaL video"
abstract: "Twenty-second in the Array Languages series: episode 2 of the video series that teaches array programming with X_eTaL. A loop often does three jobs at once: it transforms each element, keeps some, and combines what it keeps. The episode pulls them apart into whole-array operations (map, filter with a mask and replicate, reduce, and counting with a mask), sets them beside Rust's iterator chains, composes the three in X_eTaL, and previews shape, rank and axes."
series: "Array Languages"
series_part: 22
date: 2026-11-23 00:15:00 -0800
video_url: "https://www.youtube.com/watch?v=YiJYDiD7xqc"
video_title: "From Scalar Loops to Array Operations: Array Languages #2"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Plan started 2026-11-22; filled 2026-11-23 from the published episode (YouTube YiJYDiD7xqc, given by Mike 2026-11-23).
     Facts from X_eTaL-video lessons/al-02-loops (README sources table; data.xtl run at the X_eTaL pin 49c00785) and
     out/al-02-loops-youtube/{title.txt, description.txt, narration.txt}. Title from title.txt (oEmbed not public at drafting).
     Frames al22-* from out/al-02-loops-youtube/al-02-loops-landscape.mp4 at 0:39, 1:18, 1:37, 2:22, 2:58, 3:13.
     Dated 2026-11-23, the day the video went up (was a tentative 11/24).
     Lead image: Mike's block-map-filter-reduce.jpg (Dropbox, 2026-11-23), no-invert. Still to do: the closing (Mike).
-->

<img src="{{ '/assets/images/posts/block-map-filter-reduce.webp' | relative_url }}" class="post-marker no-invert" alt="A linocut of a small workshop assembly line: wooden shapes ride a conveyor under a stamping press, a sorting gate sends some down a chute, and the rest drop into a bin on a scale" style="width: 205px;">

Episode 2 of my video series on array programming is out. [Episode 1](/2026/11/22/array-languages-xetal-video-why/) asked why another programming language; this one starts the work, turning common loops into array operations. It runs about five minutes, and it ends with a preview of the next episode and an exercise.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [From Scalar Loops to Array Operations: Array Languages #2](https://www.youtube.com/watch?v=YiJYDiD7xqc)<br>[![Video](https://img.youtube.com/vi/YiJYDiD7xqc/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=YiJYDiD7xqc) |
| **Episode 1** | [Why Another Programming Language?](/2026/11/22/array-languages-xetal-video-why/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One loop, three jobs

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/al22-one-loop.webp' | relative_url }}" alt="A frame from the episode, One loop, three jobs: a Rust loop over 2, 4, 6, 8 that triples each value and adds the ones greater than 5 to a sum">
<figcaption>One loop, three jobs.</figcaption>
</figure>

The episode starts with a small Rust loop over `2, 4, 6, 8`. It triples each value, keeps the ones greater than 5, and adds up what it keeps: 60. Three jobs are tangled together in one loop body, and they are the three kinds that come up again and again: map, filter and reduce. Scalar-style code describes how to visit every element; array-style code describes what happens to the whole collection.

## Map

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/al22-tripled.webp' | relative_url }}" alt="A frame from the episode, Tripled: values is 2 4 6 8, tripled is 3 times values, and tripled is 6 12 18 24">
<figcaption>Map: three times values.</figcaption>
</figure>

The first job is a map. Every input element produces one output element, so the shape stays the same. X_eTaL says it in one line, with no loop and no index:

```xetal
values := 2 4 6 8
tripled := 3 * values
tripled
```

which gives `6 12 18 24`. (The episode shows each line as X_eTaL draws it, with `←` for `:=` and `×` for `*`; the lines here are as you type them.)

## Filter: a mask, then replicate

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/al22-filter-mask.webp' | relative_url }}" alt="A frame from the episode, Filter: a question for every element: 2 4 6 8 compared with greater than 5 gives the mask 0 0 1 1">
<figcaption>A question for every element.</figcaption>
</figure>

The second job is a filter, in two steps. First, ask every element the same question: `values > 5` is `0 0 1 1`. That is a mask: one means keep, and zero means drop. Then replicate uses the mask to choose, keeping each value as many times as its mask says:

```xetal
(values > 5) r_eplicate values
```

gives `6 8`. The output is shorter than the input, which is what makes a filter different from a map.

## Reduce, and counting with a mask

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/al22-reduce.webp' | relative_url }}" alt="A frame from the episode, Reduce: reduce given plus, max and min over values gives 20, 8 and 2">
<figcaption>Reduce, given plus, max and min.</figcaption>
</figure>

The third job is a reduce, which combines many elements into one. Given plus, it adds them up; given max or min, it finds the largest or smallest:

```xetal
'+ r_/ values
'm_ax r_/ values
'm_in r_/ values
```

gives 20, 8 and 2. Masks and reduce work well together: adding up a mask counts the matches, so `'+ r_/ values > 5` is 2, and reduce given *and* asks whether every value passes, so `'& r_/ values > 1` is 1.

## Rust can map too

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/al22-iterator-chains.webp' | relative_url }}" alt="A frame from the episode, Iterator chains: a Rust iterator chain over values that maps times 3, filters greater than 5 and sums, giving 60">
<figcaption>Iterator chains.</figcaption>
</figure>

Modern languages can describe this too. Rust's iterator chains map, then filter, then sum, and print 60, the same as the loop. The difference is not that Rust cannot map or reduce. In an array language, arrays and their operations are the center of the language.

## Three steps, composed

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/al22-composed.webp' | relative_url }}" alt="A frame from the episode, Three steps, composed: values, tripled, big as tripled greater than 5 replicate tripled, and reduce given plus over big, 60">
<figcaption>The loop's three jobs, one step each.</figcaption>
</figure>

Then the three together: triple the values, keep the ones greater than 5, add them up.

```xetal
big := (tripled > 5) r_eplicate tripled
'+ r_/ big
```

The answer is 60, the same as the loop. Each step is one whole-array operation, and each one has a name.

## Coming up, and an exercise

The episode ends with a short preview of the next one: the shape of an array (how long each axis is), its rank (how many axes it has), and its axes (the directions through it, along which reduce can add). Then an exercise to try before it comes out: take a list of temperatures in Fahrenheit, change each one to Celsius, keep the ones below freezing, and count them, all without a loop. Everything in this post can be tried in the [browser editor](https://softwarewrighter.github.io/X_eTaL/).

Episode 2 is made the same way as [episode 1](/2026/11/22/array-languages-xetal-video-why/), in [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video): every X_eTaL line it shows was run at a pinned version of X_eTaL, and the Rust was compiled and run, before any of it was narrated.

## Closing

I am hoping to cover all the language decisions that went into X_eTaL as I demonstrate array concepts, functional programming, metaprogramming, and related tooling.
