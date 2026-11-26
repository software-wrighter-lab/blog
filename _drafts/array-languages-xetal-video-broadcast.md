---
layout: post
title: "Array Languages #24: Broadcasting, When Shapes Meet"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, j, bqn, k, numpy, video, teaching, broadcasting, scalar-extension, shape, rank]
keywords: "array programming tutorial, broadcasting, scalar extension, arrays of different shapes, shape mismatch, reshape, transpose, rank operator, outer product table, APL J BQN K NumPy broadcasting rules, array languages video series, X_eTaL video"
abstract: "Twenty-fourth in the Array Languages series: episode 4 of the video series that teaches array programming with X_eTaL. What happens when two arrays meet: a single value extends to every item, arrays of the same shape combine item by item, and in X_eTaL any other pair of shapes is an error. How to say what you mean instead (reshape, transpose, the rank form, table), how APL, J, BQN, K and NumPy draw the line differently, and the trade-off between automatic rules and strict ones."
series: "Array Languages"
series_part: 24
date: 2026-11-27 00:15:00 -0800
# video_url: "Mike: TODO, the episode's YouTube URL once it is published" (post.html embeds it at the end and it joins the Videos tab)
# video_title: "Mike: TODO, from X_eTaL-video out/al-04-broadcast-youtube/title.txt (or oEmbed once public)"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Started 2026-11-25 from X_eTaL-video lessons/al-04-broadcast at saga step 001 (the script, in progress, not yet
     approved): lesson.json's scenes and narration, the README sources table, and data.xtl. Every result here was run
     with the pinned xetal (49c00785) on 2026-11-25 (`bin/xetal run --box`); code drawn with `bin/xetal render`.
     Re-check everything against the approved script and the final narration (scenes and words may change).
     Other array languages: from the script's narration and comparison panel (README: "the author, 2026-11-23").
     The script's "next" scene is still "to be decided with the author", so the post names no next topic.
     Date 2026-11-27 is tentative (11/26 is a TBT Thursday); move it to the day the video goes up.
     To do when the episode is done (me): video_url/video_title, the links-box Video row, al24-* frames from the
     published mp4 as gutter figures (outdent-right in pos-left sections, outdent-left in pos-right; none in the
     first two sections, which sit beside the links box), and the narration check.
     Lead image: placeholder (scripts/placeholder-marker); Mike: a block print. Mike: the closing.
-->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-video-broadcast.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Episode 4 of my video series on array programming is about what happens when two arrays meet. [Episode 3](/2026/11/24/array-languages-xetal-video-shape/) gave every array a shape, a rank and axes. Add two arrays, and the question is what their shapes have to do with each other. Array languages answer it in different ways, and this episode compares them.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **Earlier episodes** | 1: [Why Another Programming Language?](/2026/11/22/array-languages-xetal-video-why/) ([video](https://www.youtube.com/watch?v=NfdzVWjje2Y))<br>2: [From Scalar Loops to Array Operations](/2026/11/23/array-languages-xetal-video-loops/) ([video](https://www.youtube.com/watch?v=YiJYDiD7xqc))<br>3: [Shape, Rank, Axes and Dimensions](/2026/11/24/array-languages-xetal-video-shape/) ([video](https://www.youtube.com/watch?v=JbKMtZZT6AY)) |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A single value

Start with a single value and a vector. One plus the vector adds one to every item: the single value extends to each item. This is called scalar extension.

```xetal
v ← 10 20 30
1 + v   ⍝ 11 21 31
```

It works with any shape. Ten times a matrix multiplies every item by ten, and the result has the matrix's shape. As in episode 3, results are shown boxed, the way `xetal --box` draws them:

```xetal
M ← 2 3 r̲eshape r̲ange 6
10 × M
```
```
┌→───────┐
↓10 20 30│
│40 50 60│
└~───────┘
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The same shape, or an error

Two arrays of the same shape combine item by item: each item meets the item in the same place.

```xetal
1 2 3 + v   ⍝ 11 22 33
M + M
```
```
┌→──────┐
↓2  4  6│
│8 10 12│
└~──────┘
```

Now try the matrix and the vector. `M`{:.language-xetal} has shape `2 3` and `v`{:.language-xetal} has shape `3`. In X_eTaL that is an error, and the message names both shapes:

```xetal
M + v
```
```
error[shape-mismatch]: shapes differ: 2 3 and 3
```

So the whole rule in X_eTaL fits in three lines: one value extends to every item, the same shape goes item by item, and any other shapes are an error.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Why an error?
{: .pos-left}

The rule is short, so a result is easy to predict. A mismatch is often a mistake, and an error shows it at once, naming both shapes. To combine other shapes, you say how.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Saying how
{: .pos-right}

To add the vector to each row, say so. `r̲eshape`{:.language-xetal} repeats the vector to the matrix's shape, and then the shapes match:

```xetal
M + 2 3 r̲eshape v
```
```
┌→───────┐
↓11 22 33│
│14 25 36│
└~───────┘
```

Columns take one more step. `w`{:.language-xetal} has two values, one for each row: reshape it to three by two, then transpose, and each row holds one value. The sum adds down the columns:

```xetal
w ← 100 200
M + o̲\ 3 2 r̲eshape w
```
```
┌→──────────┐
↓101 102 103│
│204 205 206│
└~──────────┘
```

The rank form says the row case another way. The `1` means each row of the matrix, and the small function in braces adds the vector to its argument, `⍵`{:.language-xetal} (a later episode covers functions like this one):

```xetal
1 '{ ⍵ + v } r̲ank M
```
```
┌→───────┐
↓11 22 33│
│14 25 36│
└~───────┘
```

And sometimes you want every pair. `t̲able`{:.language-xetal} combines each item of one vector with each item of the other, so three values and two values give a three by two result:

```xetal
v '+ t̲able w
```
```
┌→──────┐
↓110 210│
│120 220│
│130 230│
└~──────┘
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Other array languages
{: .pos-left}

Other array languages draw this line in different places. `M`{:.language-xetal} has two rows and three columns, so three values match its last axis and two values match its first:

| Language | Matches | `M + 10 20 30` | `M + 100 200` |
|----------|---------|----------------|---------------|
| X_eTaL | the same shape | error | error |
| APL | the same shape | error | error |
| J, BQN | axes from the front | error | 100 to the first row, 200 to the second |
| K | axes from the front (a matrix is a list of rows) | error | 100 to the first row, 200 to the second |
| NumPy | axes from the back | 10 20 30 to each row | error |

Every one of them extends a single value.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The trade-off
{: .pos-right}

Each choice has a cost. Automatic rules are short to write, but a wrong shape can still give an answer. A strict rule asks for one more step, and in return a mismatch shows itself.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## An exercise
{: .pos-left}

Before the next episode, try this in the [browser editor](https://softwarewrighter.github.io/X_eTaL/). Make a times table for one to nine with `t̲able`{:.language-xetal}. Then add ten, twenty and thirty to each row of a matrix, and one hundred and two hundred to each column. (To type it, use the ASCII it is drawn from: `:=` for `←`, `r_eshape` for `r̲eshape`, `*` for `×`, `_r` for `⍵`.)

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

Mike: TODO, a closing in your words.
