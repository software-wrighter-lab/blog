---
layout: post
title: "Array Languages #23: Shape, Rank, Axes and Dimensions"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, video, teaching, shape, rank, axes, transpose, tensors, leetcode]
keywords: "array programming tutorial, array shape and rank, axes, scalar vector matrix, reduce along an axis, rotate, reverse, transpose, ravel, tensors, LeetCode array challenges, array languages video series, X_eTaL video"
abstract: "Twenty-third in the Array Languages series: episode 3 of the video series that teaches array programming with X_eTaL. Every array has a shape, a rank and axes: scalars, vectors, matrices and a rank 3 array; reduce, rotate, reverse and transpose along a chosen axis; ravel back to a list; two LeetCode challenges solved along axes; why machine learning calls these arrays tensors; and a preview of broadcasting."
series: "Array Languages"
series_part: 23
date: 2026-11-24 00:15:00 -0800
# video_url: "Mike: TODO, the episode's YouTube URL once it is published" (post.html embeds it at the end and it joins the Videos tab)
# video_title: "Shape, Rank, Axes and Dimensions: Array Languages #3" (check against X_eTaL-video out/al-03-shape-youtube/title.txt)
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Started 2026-11-23 from X_eTaL-video lessons/al-03-shape: the script Mike approved (23ed733, step 001), its 26
     scenes in lesson.json, the README sources table, and data.xtl, whose every output here was run with the pinned
     xetal (49c00785) on 2026-11-23 (`scripts/xt run lessons/al-03-shape/data.xtl`). Not yet narrated or rendered.
     Code is shown as rendered (`bin/xetal render`), per AGENTS.md; results as ⍝ remarks, each run.
     Left out on purpose: the preview-dialects scene (APL, J, BQN, K, NumPy broadcasting rules), which the README marks
     "to be checked by the author"; and the code_report credit for LeetCode 1351, a third party, pending Mike's go.
     Re-check against the final script before publishing (scenes may change in the words and voice steps).
     Date 2026-11-24 is tentative; Made Visible #5 is also dated 11/24.
     To do when the episode is done (me): video_url/video_title from the youtube title.txt, the links-box Video row,
     al23-* frames from the render, floated beside the sections as in AL #22.
     Lead image: Mike's block-typesetting.jpg (Dropbox, 2026-11-23), no-invert. Mike: the closing.
-->

<img src="{{ '/assets/images/posts/block-typesetting.webp' | relative_url }}" class="post-marker no-invert" alt="A linocut of a letterpress workbench: a single piece of type, a line of type in a composing stick, a page of type locked in an iron frame, and locked pages stacked in a rack" style="width: 205px;">

Episode 3 of my video series on array programming moves past lists. [Episode 2](/2026/11/23/array-languages-xetal-video-loops/) turned loops into map, filter and reduce over whole lists, and a list is only one kind of array. Every array has a shape, a rank and axes, and this episode is about all three.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **Earlier episodes** | [1: Why another language?](/2026/11/22/array-languages-xetal-video-why/), [2: Loops to array operations](/2026/11/23/array-languages-xetal-video-loops/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Shape and rank

A scalar is a single value. It has no axes: its shape is an empty list, so its rank is zero. A vector has one axis; `3 1 4 1 5` has shape `5` and rank 1. Rank is the length of the shape, so `t̲ally s̲hape`{:.language-xetal} gives it.

A matrix has two axes, rows and columns:

```xetal
M ← 2 3 r̲eshape r̲ange 6
s̲hape M          ⍝ 2 3
t̲ally s̲hape M   ⍝ 2
```

`M`{:.language-xetal} is `1 2 3` over `4 5 6`, with shape `2 3`. It holds six values, but its rank is 2. Add one more axis and two tables, each three by four, make an array of shape `2 3 4` and rank 3. Higher ranks follow the same rule.

## Along an axis

Each axis has a number. In a matrix, axis 1 runs down the rows, and axis 2 runs along each row. Many operations work along an axis, and in X_eTaL a subscript after the name picks which one. (The code here is shown as X_eTaL draws it, as the video does. To try it in the [browser editor](https://softwarewrighter.github.io/X_eTaL/), type the ASCII it is drawn from: `:=` for `←`, `r_/_2` for `r̲/₂`, `*` for `×`, and `#` for `⍝`.)

```xetal
'+ r̲/ M     ⍝ 5 7 9
'+ r̲/₁ M   ⍝ 5 7 9
'+ r̲/₂ M   ⍝ 6 15
```

Reduce works along axis 1 unless told otherwise, so the first two both give `5 7 9`, the sums down the columns. With subscript 2 it sums along each row instead: `6 15`.

Rotate, reverse and transpose work the same way. `1 o̲-₁ M`{:.language-xetal} rotates along axis 1, so the rows trade places; `1 o̲-₂ M`{:.language-xetal} shifts each row left by one, giving `2 3 1` over `5 6 4`. `r̲ev₂ M`{:.language-xetal} reverses each row. And `o̲\ M`{:.language-xetal}, transpose, reverses the order of the axes: rows become columns, and the `2 3` matrix becomes `3 2`.

## Three dimensions

The same subscripts work on the rank 3 array:

```xetal
T ← 2 3 4 r̲eshape r̲ange 24
s̲hape '+ r̲/₁ T   ⍝ 3 4
s̲hape '+ r̲/₃ T   ⍝ 2 3
```

Reduce along axis 1 adds the two tables together, a `3 4` result. Reduce along axis 3 sums each row, a `2 3` result. Transpose reverses all three axes, so `2 3 4` becomes `4 3 2`; with two subscripts, `o̲\₂₃`{:.language-xetal}, it swaps just those two (`2 4 3`); and a list on the left of `t̲ranspose`{:.language-xetal} can put the axes in any order (`3 1 2 t̲ranspose T`{:.language-xetal} has shape `3 4 2`).

Ravel goes the other way, turning any array back into a vector: `r̲avel T`{:.language-xetal} is the 24 values in order, rank 1 again. With subscript 2, `r̲avel₂ M`{:.language-xetal} unrolls a matrix column by column: `1 4 2 5 3 6`.

## Two challenges, along axes

The episode tries the ideas on two short coding challenges from LeetCode.

[Richest Customer Wealth](https://leetcode.com/problems/richest-customer-wealth/) (1672): each row is a customer and each column a bank account. Sum along axis 2 for each customer's total, then take the largest:

```xetal
accounts ← 3 2 r̲eshape 1 5 7 3 3 5
'+ r̲/₂ accounts           ⍝ 6 10 8
'm̲ax r̲/ '+ r̲/₂ accounts   ⍝ 10
```

The answer is 10.

[Count Negative Numbers in a Sorted Matrix](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/) (1351): compare the grid with zero for a mask of ones and zeros, then reduce along both axes at once, with subscript `₁₂`:

```xetal
grid ← 3 4 r̲eshape 3 2 1 -1 1 1 -1 -2 -1 -1 -2 -3
'+ r̲/₁₂ grid < 0   ⍝ 7
```

There are 7.

## Tensors

In machine learning, arrays like these are called tensors. A color image might have shape `480 640 3`: height, width and three color channels. Stack 32 of them and the batch gains an axis, shape `32 480 640 3`, rank 4, and `'× r̲/ s̲hape images`{:.language-xetal} counts its 29,491,200 values. A GPU works on many values at once, and shape and axes tell it how a tensor is laid out. The ideas are the same ones, and later episodes come back to tensors.

## Coming up, and an exercise

The next episode is about broadcasting: how an operation combines arrays of different shapes. The preview starts with the simplest case. `10 × M`{:.language-xetal} multiplies every item by ten, because a single value extends to every item, and `M + M`{:.language-xetal} combines two arrays of the same shape item by item. In X_eTaL that is the whole rule, and other shapes are an error.

The exercise: a video clip has 300 frames, each 480 by 640 with three colors. Work out its shape and its rank, then count its values. Everything in this post can be tried in the [browser editor](https://softwarewrighter.github.io/X_eTaL/).

## Closing

Mike: TODO, a closing in your words.
