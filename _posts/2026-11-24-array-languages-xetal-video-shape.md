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
video_url: "https://www.youtube.com/watch?v=JbKMtZZT6AY"
video_title: "Shape, Rank, Axes and Dimensions: Array Languages #3"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<img src="{{ '/assets/images/posts/block-typesetting.webp' | relative_url }}" class="post-marker no-invert" alt="A linocut of a letterpress workbench: a single piece of type, a line of type in a composing stick, a page of type locked in an iron frame, and locked pages stacked in a rack" style="width: 205px;">

Episode 3 of my video series on array programming moves past lists. [Episode 2](/2026/11/23/array-languages-xetal-video-loops/) turned loops into map, filter and reduce over whole lists, and a list is only one kind of array. Every array has a shape, a rank and axes, and this episode is about all three.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [Shape, Rank, Axes and Dimensions: Array Languages #3](https://www.youtube.com/watch?v=JbKMtZZT6AY)<br>[![Video](https://img.youtube.com/vi/JbKMtZZT6AY/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=JbKMtZZT6AY) |
| **Earlier episodes** | 1: [Why Another Programming Language?](/2026/11/22/array-languages-xetal-video-why/) ([video](https://www.youtube.com/watch?v=NfdzVWjje2Y))<br>2: [From Scalar Loops to Array Operations](/2026/11/23/array-languages-xetal-video-loops/) ([video](https://www.youtube.com/watch?v=YiJYDiD7xqc)) |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Challenges** | LeetCode [1672](https://leetcode.com/problems/richest-customer-wealth/), [1351](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Shape and rank

A scalar is a single value. It has no axes, so its shape is an empty list. X_eTaL can draw a result in a box, and the box shows that clearly: the `⊖` on the top edge marks a list with no items, and the `~` on the bottom marks a list of numbers.

```xetal
s̲hape 42
```
```
┌⊖┐
│ │
└~┘
```

A vector has one axis. `r̲avel`{:.language-xetal} turns the scalar into a vector of one item, and its shape is a list holding one number, 1:

```xetal
s̲hape r̲avel 42
```
```
┌→┐
│1│
└~┘
```

Rank is the number of axes, which is the length of the shape: tally the shape and you have it. X_eTaL will soon have it built in; until then, the episode defines it. `ᵘ`{:.language-xetal} marks a name the user defined, and `⍵`{:.language-xetal} is the argument on the right:

```xetal
ᵘr̲ankOf ← { t̲ally s̲hape ⍵}
ᵘr̲ankOf 42         ⍝ 0
ᵘr̲ankOf r̲avel 42   ⍝ 1
```

A matrix has two axes, rows and columns:

```xetal
M ← 2 3 r̲eshape r̲ange 6
s̲hape M     ⍝ 2 3
ᵘr̲ankOf M   ⍝ 2
```

`M`{:.language-xetal} is `1 2 3` over `4 5 6`, with shape `2 3`. It holds six values, but its rank is 2. Add one more axis and two tables, each three by four, make an array of shape `2 3 4` and rank 3. Higher ranks follow the same rule.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Along an axis

Each axis has a number. In a matrix, axis 1 runs down the rows, and axis 2 runs along each row. Many operations work along an axis, and in X_eTaL a subscript after the name picks which one. (The code here is shown as X_eTaL draws it, as the video does. To try it in the [browser editor](https://softwarewrighter.github.io/X_eTaL/), type the ASCII it is drawn from: `:=` for `←`, `r_/_2` for `r̲/₂`, `*` for `×`, and `#` for `⍝`.)

```xetal
'+ r̲/ M     ⍝ 5 7 9
'+ r̲/₁ M   ⍝ 5 7 9
'+ r̲/₂ M   ⍝ 6 15
```

Reduce works along axis 1 unless told otherwise, so the first two both give `5 7 9`, the sums down the columns. With subscript 2 it sums along each row instead: `6 15`.

Rotate, reverse and transpose work the same way. `1 o̲-₁ M`{:.language-xetal} rotates along axis 1, so the rows trade places; `1 o̲-₂ M`{:.language-xetal} shifts each row left by one, giving `2 3 1` over `5 6 4`. `r̲ev₂ M`{:.language-xetal} reverses each row. And `o̲\ M`{:.language-xetal}, transpose, reverses the order of the axes: rows become columns, and the `2 3` matrix becomes `3 2`.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Three dimensions
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al23-transposed.webp' | relative_url }}" alt="A frame from the episode, Rank three, transposed: the shape of T with axes 2 and 3 swapped is 2 4 3, and the shape of 3 1 2 transpose T is 3 4 2">
<figcaption>Rank three, transposed. Click to enlarge.</figcaption>
</figure>

The same subscripts work on the rank 3 array:

```xetal
T ← 2 3 4 r̲eshape r̲ange 24
s̲hape '+ r̲/₁ T   ⍝ 3 4
s̲hape '+ r̲/₃ T   ⍝ 2 3
```

Reduce along axis 1 adds the two tables together, a `3 4` result. Reduce along axis 3 sums each row, a `2 3` result. Transpose reverses all three axes, so `2 3 4` becomes `4 3 2`; with two subscripts, `o̲\₂₃`{:.language-xetal}, it swaps just those two (`2 4 3`); and a list on the left of `t̲ranspose`{:.language-xetal} can put the axes in any order (`3 1 2 t̲ranspose T`{:.language-xetal} has shape `3 4 2`).

Ravel goes the other way, turning any array back into a vector: `r̲avel T`{:.language-xetal} is the 24 values in order, rank 1 again. With subscript 2, `r̲avel₂ M`{:.language-xetal} unrolls a matrix column by column: `1 4 2 5 3 6`.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Two challenges, along axes
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al23-richest.webp' | relative_url }}" alt="A frame from the episode, A challenge: the richest customer: accounts is a 3 by 2 matrix, plus-reduce along axis 2 gives 6 10 8, and the max of that is 10">
<figcaption>The richest customer. Click to enlarge.</figcaption>
</figure>

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

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Tensors
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al23-tensors.webp' | relative_url }}" alt="A frame from the episode, Tensors: images is 32 480 640 3 reshape 0, its shape is 32 480 640 3, and rankOf images is 4">
<figcaption>A batch of images, rank 4. Click to enlarge.</figcaption>
</figure>

In machine learning, arrays like these are called tensors. A color image might have shape `480 640 3`: height, width and three color channels. Stack 32 of them and the batch gains an axis, shape `32 480 640 3`, rank 4, and `'× r̲/ s̲hape images`{:.language-xetal} counts its 29,491,200 values. A GPU works on many values at once, and shape and axes tell it how a tensor is laid out. The ideas are the same ones, and later episodes come back to tensors.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## How the video draws the code
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al23-rotate-boxed.webp' | relative_url }}" alt="A frame from the episode, Rotate: M and 1 rotate along axis 1 of M, then 1 rotate along axis 2 of M giving 2 3 1 over 5 6 4, each result drawn in a box">
<figcaption>Results boxed by xetal. Click to enlarge.</figcaption>
</figure>

The code on the slides isn't typeset by hand. You type X_eTaL in plain ASCII, `M := 2 3 r_eshape r_ange 6`, and X_eTaL's own `xetal render` draws it as notation: `M ← 2 3 r̲eshape r̲ange 6`{:.language-xetal}. The underlined letter marks a name as a function, the `_2` becomes the subscript axis in `r̲/₂`{:.language-xetal}, and the `#` of a remark becomes `⍝`.

The video is built in [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video), which pins one build of X_eTaL so the slides always match the language they show. Before a lesson renders, its build script collects every line of X_eTaL in the lesson and runs them through `xetal render --html`. That returns each line as HTML spans, one class for each kind of token:

```html
<span class="c-symbol">'+</span> <span class="c-builtin">r̲/₂</span> M    <span class="c-comment">⍝ 6 15</span>
```

The renderer, written with [Remotion](https://www.remotion.dev/), gives each class its color (built-in functions blue, numbers gold, remarks gray), and a line that doesn't lex as X_eTaL stops the build instead of reaching the screen. The arrays drawn as grids come from X_eTaL too: the lesson's data file is run with the same pinned xetal, and the slides draw the numbers it prints. The code blocks in this post are colored the same way. The blog's highlighter follows the same token classes as `xetal render --html`.

The boxes come from X_eTaL too, drawn the way APL2's DISPLAY drew them: `xetal --box` boxes every result, and `d̲isplay`{:.language-xetal} boxes one. A matrix shows how to read them:

```
┌→────┐
↓1 2 3│
│4 5 6│
└~────┘
```

That's `M`. The `→` on the top edge marks the last axis, the one that runs along each row, and the `↓` on the left edge marks the first axis, down the rows. A vector gets only the `→`, so the number of arrows is the rank, and the `~` on the bottom edge means the items are numbers. An empty list gets `⊖` instead of `→`, as `s̲hape 42`{:.language-xetal} showed. The episode's slides show their results boxed this way, as in the rotate beside this section.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Coming up, and an exercise
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al23-broadcast.webp' | relative_url }}" alt="A frame from the episode, One value, or the same shape: 10 times M, and M plus M">
<figcaption>The preview of broadcasting. Click to enlarge.</figcaption>
</figure>

The next episode is about broadcasting: how an operation combines arrays of different shapes. The preview starts with the simplest case. `10 × M`{:.language-xetal} multiplies every item by ten, because a single value extends to every item, and `M + M`{:.language-xetal} combines two arrays of the same shape item by item. In X_eTaL that is the whole rule, and other shapes are an error.

Array languages draw this line in different places. APL extends a single value too, and an axis can say how a vector meets a matrix. J and BQN match axes from the front, so each item of a vector goes with one row; K works much the same way, since there a matrix is a list of rows. NumPy, for Python, matches axes from the back. The next episode puts them side by side.

The exercise: a video clip has 300 frames, each 480 by 640 with three colors. Work out its shape and its rank, then count its values. Everything in this post can be tried in the [browser editor](https://softwarewrighter.github.io/X_eTaL/).

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

In future videos I plan to include more interesting coding problems and better visualizations as I add more tools to help with code experimentation and understanding.
