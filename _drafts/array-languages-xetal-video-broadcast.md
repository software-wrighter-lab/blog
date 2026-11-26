---
layout: post
title: "Array Languages #24: Broadcasting, When Shapes Meet"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, j, bqn, k, numpy, video, teaching, broadcasting, scalar-extension, shape, rank]
keywords: "array programming tutorial, broadcasting, scalar extension, arrays of different shapes, shape mismatch, reshape, transpose, rank operator, outer product table, APL J BQN K NumPy broadcasting rules, array languages video series, X_eTaL video"
abstract: "Twenty-fourth in the Array Languages series: episode 4 of the video series that teaches array programming with X_eTaL. What happens when two arrays meet: a single value extends to every item, arrays of the same shape combine item by item, and in X_eTaL any other pair of shapes is an error. How to say what you mean instead (reshape, transpose, the rank form, table), how APL, J, BQN, K and NumPy draw the line differently, why NumPy's stretching can give an answer of the wrong shape, and the trade-off between automatic rules and strict ones."
series: "Array Languages"
series_part: 24
date: 2026-11-25 00:30:00 -0800
video_url: "https://www.youtube.com/watch?v=-te7ZGCdIkE"
video_title: "Broadcasting: When Array Shapes Meet: Array Languages #4"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Started 2026-11-25 from X_eTaL-video lessons/al-04-broadcast; updated 2026-11-25 20:25 from the approved script
     (step 001 complete 18:53) and its narration. Every X_eTaL result here was run with the pinned xetal (49c00785)
     (`bin/xetal run --box`); code drawn with `bin/xetal render`. Re-check against the final narration when published.
     Other array languages: from the narration (apl, apl-more, j, j-rank, bqn, k, numpy, numpy-columns, numpy-stretch).
     X_eTaL-video docs/comparing-languages.md had no REPL "Observed" results yet for APL, J, BQN, K, NumPy at that time;
     check it before publishing. No other-language code is shown, only what each does.
     Cubes: al24-cubes-ladder and al24-cubes-stretch from X_eTaL-video work/cubes/*-tight.png (just cubes, Blender 5.3,
     2026-11-25 20:17); the video shows them as silent scenes after the recap and after numpy-stretch.
     Updated 2026-11-25 22:10 for the published video (-te7ZGCdIkE, 6:18): video_url/title, links row, date 11/25
     (the video went up today), the new "same table in X_eTaL" scenes, and gutter frames al24-columns (1:55),
     al24-apl (3:05), al24-same-table (5:00), checked against out/al-04-broadcast-youtube/narration.txt.
     Lead image: Mike's block-stamp.jpg (Dropbox, 2026-11-25), no-invert.
-->

<img src="{{ '/assets/images/posts/block-stamp.webp' | relative_url }}" class="post-marker no-invert" alt="A hand presses a wooden stamp onto a printed grid, the same blue mark in square after square; a second, empty grid on another sheet lies askew beside it" style="width: 205px;">

Episode 4 of my video series on array programming is about what happens when two arrays meet. [Episode 3](/2026/11/24/array-languages-xetal-video-shape/) gave every array a shape, a rank and axes. Add two arrays, and the question is what their shapes have to do with each other. Array languages answer it in different ways, and this episode compares them.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [Broadcasting: When Array Shapes Meet: Array Languages #4](https://www.youtube.com/watch?v=-te7ZGCdIkE)<br>[![Video](https://img.youtube.com/vi/-te7ZGCdIkE/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=-te7ZGCdIkE) |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<figure class="zoomable" style="clear: both; margin: 1.2em 0;">
<img src="{{ '/assets/images/posts/al24-cubes-ladder.webp' | relative_url }}" alt="Arrays as cubes, rendered in Blender: the scalar 7 as a bare number, shape empty; one cube, shape 1; a row of three cubes 10 20 30, shape 3; two rows of three, shape 2 3; a numbered block of cubes, shape 2 3 4; and two separate piles, shape 2 2 2 2">
<figcaption>Arrays as cubes, from scalar to rank 4, as the episode recaps episode 3. X_eTaL works out every cube and number and writes the Blender script; Blender renders it. Click to enlarge.</figcaption>
</figure>

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
{: .pos-center}

The rule is short, so a result is easy to predict. A mismatch is often a mistake, and an error shows it at once, naming both shapes. To combine other shapes, you say how.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Saying how
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al24-columns.webp' | relative_url }}" alt="The episode's slide: M plus the transposed reshape of w, drawn as boxes, 1 2 3 4 5 6 plus 100 100 100 200 200 200 equals 101 102 103 204 205 206">
<figcaption>From the video: a vector down the columns. Click to enlarge.</figcaption>
</figure>

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

Columns take one more step. `w`{:.language-xetal} has two values, one for each row: reshape it to three by two, then transpose, and each row holds one value. The sum adds one value along each row, so each column gets the same two values:

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

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al24-apl.webp' | relative_url }}" alt="The episode's APL slide: M plus 10 20 30 is a RANK ERROR; M plus with axis 2 in brackets adds 10 20 30 to each row">
<figcaption>From the video: APL says a rank error, and an axis in brackets says how. Click to enlarge.</figcaption>
</figure>

Other array languages draw this line in different places. `M`{:.language-xetal} has two rows and three columns, so three values match its last axis and two values match its first:

| Language | Matches | `M + 10 20 30` | `M + 100 200` |
|----------|---------|----------------|---------------|
| X_eTaL | the same shape | error | error |
| APL | the same shape | error | error |
| J, BQN | axes from the front | error | 100 to the first row, 200 to the second |
| K | axes from the front (a matrix is a list of rows) | error | 100 to the first row, 200 to the second |
| NumPy | axes from the back | 10 20 30 to each row | error |

Every one of them extends a single value. Each also has its own way to say how:

- **APL:** both lines are a rank error, since the ranks differ. An axis number in brackets says how: plus on axis 2 puts the vector on each row, and on axis 1 two values go down the columns. The rank operator is another way; rank 1 pairs the vector with each row.
- **J:** two values meet the two rows, one value each, and three values are a length error. To put three values on each row, J uses rank: rank 1 means each row.
- **BQN** follows the same rule as J, and its rank modifier works the same way.
- **K:** a matrix is a list of rows, so two values meet the two rows. "Each right" puts three values on each row.
- **NumPy:** three values meet each row with nothing to add, and two values are an error. To go down the columns, add an axis of length one: the two values become a column, and that column stretches across the matrix.

That stretching has a cost. A column of three plus a row of three gives a three by three table. If you meant item by item, there is no error; you get an answer of the wrong shape.

<figure class="zoomable" style="margin: 1.2em 0;">
<img src="{{ '/assets/images/posts/al24-cubes-stretch.webp' | relative_url }}" alt="Blender cubes: a column of 1 2 3, shape 3 1, plus a row of 1 2 3, shape 1 3, equals a three by three grid of 2 3 4, 3 4 5, 4 5 6, shape 3 3">
<figcaption>NumPy's stretch: a column plus a row makes a table, not an error. Click to enlarge.</figcaption>
</figure>

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The same table in X_eTaL, step by step
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al24-same-table.webp' | relative_url }}" alt="The episode's slide: the transposed reshape 1 1 1, 2 2 2, 3 3 3 plus the reshape 1 2 3 three times equals 2 3 4, 3 4 5, 4 5 6; below it, the same with table">
<figcaption>From the video: stretch each one, then add. Click to enlarge.</figcaption>
</figure>

In X_eTaL nothing stretches by itself. A column plus a row is an error, because the shapes differ:

```xetal
(3 1 r̲eshape 1 2 3) + 1 3 r̲eshape 1 2 3
```
```
error[shape-mismatch]: shapes differ: 3 1 and 1 3
```

So we stretch each one ourselves. Reshape repeats the row three times, down the rows; reshape and transpose repeat the column across. Now both are three by three, and plus adds them item by item. The result is the same table that NumPy gave:

```xetal
(o̲\ 3 3 r̲eshape 1 2 3) + 3 3 r̲eshape 1 2 3
```
```
┌→────┐
↓2 3 4│
│3 4 5│
│4 5 6│
└~────┘
```

`t̲able`{:.language-xetal} does it in one step, and gives the same box: `1 2 3 '+ t̲able 1 2 3`{:.language-xetal}.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The trade-off
{: .pos-center}

Each choice has a cost. Automatic rules are short to write, but a wrong shape can still give an answer. A strict rule asks for one more step, and in return a mismatch shows itself.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Coming up, and an exercise
{: .pos-left}

The next episode is about array idioms: thinking without loops. It takes small problems and solves each one twice, first with a loop, then with whole arrays.

Before then, try this in the [browser editor](https://softwarewrighter.github.io/X_eTaL/). Make a times table for one to nine with `t̲able`{:.language-xetal}. Then add ten, twenty and thirty to each row of a matrix, and one hundred and two hundred to each column. (To type it, use the ASCII it is drawn from: `:=` for `←`, `r_eshape` for `r̲eshape`, `*` for `×`, `_r` for `⍵`.)

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

One thing I find interesting when studying a language is learning its idioms: the short, familiar phrases experienced programmers reach for without thinking. Each language in this episode has its own idiom for "add this to each row", and the next episode introduces some idioms like that.
