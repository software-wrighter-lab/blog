---
layout: post
title: "Array Languages #22: From Scalar Loops to Array Operations"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, rust, video, teaching, map, filter, reduce]
keywords: "array programming tutorial, scalar loop versus array operation, elementwise operations, map filter reduce, array languages video series, X_eTaL video, Rust iterators versus array languages"
abstract: "Twenty-second in the Array Languages series: episode 2 of the video series that teaches array programming with X_eTaL. From scalar loops to array operations: what a loop says about visiting elements versus what an array operation says about the collection; elementwise transformation, filtering and reduction; Rust iterator chains beside array operations; and composing transformations without writing the iteration."
series: "Array Languages"
series_part: 22
date: 2026-11-24 00:15:00 -0800
# video_url: "Mike: TODO, the episode's YouTube URL once it is published" (post.html embeds it at the end and it joins the Videos tab)
# video_title: "From Scalar Loops to Array Operations: Array Languages #2" (check against X_eTaL-video lessons/<slug>/title.txt)
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Plan started 2026-11-22. Episode 02 is "being made" in X_eTaL-video (docs/array-languages-video-series-plan.md);
     no lessons/al-02-* directory yet. The outline below follows docs/research2.txt "Video 02" (archival, not normative):
     the section text is a plan, to be rewritten from the episode's own script and README facts once they exist.
     Every X_eTaL line shown must come from the episode (run at its pinned X_eTaL), not from research2.
     Date 2026-11-24 is tentative (Mike: video "in a day or two, hopefully"); Made Visible #5 is also dated 11/24.
     To do when the episode is done: video_url/video_title, links-box Video row, al22-* frames from the render,
     a real lead image (Mike supplies; placeholder until then), the closing (Mike).
-->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-video-loops.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Episode 2 of my video series on array programming is about the first change in thinking: from a loop that visits every element to an operation on the whole array. [Episode 1](/2026/11/22/array-languages-xetal-video-why/) asked why another programming language; this one starts the work.

Mike: TODO, a sentence or two in your words on why this episode matters (optional).

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **Episode 1** | [Why Another Programming Language?](/2026/11/22/array-languages-xetal-video-why/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## How versus what

TODO (from the episode): a loop over `2 4 6 8` describes how to visit every element; an array operation describes what happens to the collection. Frame al22-how-what, float right.

## Every element in, every element out

TODO (from the episode): elementwise transformation, multiplying every value by 3. Each input element produces one output element, so the shape is kept. Frame al22-map, float left.

## Selecting

TODO (from the episode): filtering, keeping the values greater than 5. The output can be shorter than the input. Frame al22-filter, float right.

## Many into one

TODO (from the episode): reduction, combining elements with an operation; sum, and also maximum, minimum and logical reductions. Frame al22-reduce, float left.

## Rust can map too

TODO (from the episode): Rust iterator chains beside array operations. The difference is not that Rust cannot map or reduce, but that arrays and their operations are central to an array language's semantics.

## Putting them together

TODO (from the episode): composing the three transformations without writing the iteration at each step, and the exercise at the end (temperatures to Celsius, select the freezing ones, count them).

## Closing

Mike: TODO, a closing in your words.
