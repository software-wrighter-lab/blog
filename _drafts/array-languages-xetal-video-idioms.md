---
layout: post
title: "Array Languages #25: Array Idioms, Thinking Without Loops"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, rust, video, teaching, idioms, scan, reduce]
keywords: "array programming tutorial, array idioms, thinking without loops, running totals, scan, adjacent differences, drop, normalize, scalar extension, count occurrences, unique, outer product table, Rust loop versus array idiom, array languages video series, X_eTaL video"
abstract: "Twenty-fifth in the Array Languages series: episode 5 of the video series that teaches array programming with X_eTaL. An idiom is a short phrase for a pattern that keeps coming back. After the idioms met so far (sum, count matches, reverse, rotate), four new ones, each beside the Rust loop it replaces: running totals with scan, adjacent changes by dropping and subtracting, normalizing with an aggregate and scalar extension (and a float), and counting occurrences with unique and an equality table, with what each one costs."
series: "Array Languages"
series_part: 25
date: 2026-11-26 00:15:00 -0800
# video_url: "Mike: TODO, the episode's YouTube URL once it is published" (post.html embeds it at the end and it joins the Videos tab)
# video_title: "Mike: TODO, from X_eTaL-video out/al-05-idioms-youtube/title.txt (or oEmbed once public)"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Started 2026-11-25 23:10 from X_eTaL-video lessons/al-05-idioms (untracked WIP; saga al-05-idioms step 001,
     the script, in progress; nothing narrated or rendered yet). Text follows the scene narration in lesson.json at
     that time; re-check it against the approved script and the final narration.txt. Every X_eTaL line here is from
     data.xtl, drawn with the pinned `bin/xetal render` (49c00785) and run with `bin/xetal run --box`; the Rust
     loops are the lesson's panels. Next episode (2026-11-26 10:26, uncommitted): the language family, APL, J, K, BQN, X_eTaL.
     Date 2026-11-26 is tentative (move it to the day the video goes up). Lead image: Mike's block-strings-blocks.jpg (Dropbox, 2026-11-26),
     made from the lesson README's prompt (a tangled wire loop beside four rows of cubes, one per idiom).
     To do when the episode is done (me): video_url/video_title, the links-box Video row, frames from the published
     mp4 as gutter figures (outdent-right in pos-left sections, outdent-left in pos-right; none in the first two
     sections, which sit beside the links box), any cube renders, the narration check. Mike: the closing.
     Short names aside (Mike, 2026-11-26): from X_eTaL docs/lang-choices.md B2 and N3 (a trailing mark only where APL gave
     it a meaning: r_/, s_\, o_-, o_\), A2 (o_- like APL circle-minus), docs/history.md Q34 (words, not single letters).
-->

<img src="{{ '/assets/images/posts/block-strings-blocks.webp' | relative_url }}" class="post-marker no-invert" alt="A tangled loop of gray wire on the left; on the right the wire runs straight through four rows of glowing blue cubes: a rising staircase, cubes stepping up and down between neighbors, cubes leveled around a center line, and short stacks like a bar chart" style="width: 205px;">

Episode 5 of my video series on array programming is about idioms. [Episode 4](/2026/11/25/array-languages-xetal-video-broadcast/) was about what happens when arrays of different shapes meet. This one is about thinking without loops: small problems you would usually solve with a loop, each solved again with whole arrays.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One pattern for each idiom

An idiom is a short phrase for a pattern that keeps coming back. Each idiom in this episode follows one pattern: first the problem, then a loop that solves it (in Rust), then the idiom, and what it costs.

The examples use three small lists:

```xetal
x ← 3 1 4 1 5 9
s ← 2 4 6 8
votes ← 2 3 2 1 2 3
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Idioms you have met

<div class="aside-box outdent-right" markdown="1">

**Why are a few names one letter and a mark?** Most X_eTaL built-ins are words with one underlined letter: `r̲ev`{:.language-xetal}, `r̲eshape`{:.language-xetal}, `t̲ally`{:.language-xetal}, `d̲rop`{:.language-xetal}. The underline marks a function name (typed as an underscore after the letter, `r_ev`), and a word, because one letter cannot stand for every word that starts with it. A name ends in a mark only where that mark already means something in APL, so just four read like the APL symbols they come from:

| Name | Does | APL |
|------|------|-----|
| `r̲/`{:.language-xetal} (`r_/`) | reduce | `/` |
| `s̲\`{:.language-xetal} (`s_\`) | scan | `\` |
| `o̲-`{:.language-xetal} (`o_-`) | rotate, first axis | `⊖` |
| `o̲\`{:.language-xetal} (`o_\`) | transpose | `⍉` |

The letter names the kind (r for reduce, s for scan); o stands in for APL's circle.

</div>

Some idioms have come up already. Plus reduce sums a list, and a comparison followed by a sum counts the matches:

```xetal
'+ r̲/ x       ⍝ 23
'+ r̲/ x > 3   ⍝ 3
```

Reverse and rotate rearrange the items, and no index appears anywhere:

```xetal
r̲ev x    ⍝ 9 5 1 4 1 3
2 o̲- x   ⍝ 4 1 5 9 3 1
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Running totals: scan
{: .pos-left}

The first new problem is running totals: each item becomes the sum of everything up to it. A loop keeps a total and saves it after each step:

```rust
let mut total = 0;
for v in &x {
    total += v;
    out.push(total);
}
```

In X_eTaL this is a scan. Plus scan keeps every running sum, and the last one is the whole sum:

```xetal
'+ s̲\ x
```
```
┌→────────────┐
│3 4 8 9 14 23│
└~────────────┘
```

Scan works with any function. Max scan keeps the largest value so far:

```xetal
'm̲ax s̲\ x
```
```
┌→──────────┐
│3 3 4 4 5 9│
└~──────────┘
```

The trade-off: scan keeps every step, not only the last.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Adjacent changes: shift and subtract
{: .pos-right}

Next, adjacent changes: how much each item differs from the one before it. A loop starts at the second item and looks back one:

```rust
for i in 1..x.len() {
    out.push(x[i] - x[i - 1]);
}
```

The idiom shifts the list instead of looking back. Drop the first item, then drop the last, and the two lists line up, each item beside the one before it:

```xetal
1 d̲rop x    ⍝ 1 4 1 5 9
-1 d̲rop x   ⍝ 3 1 4 1 5
```

Subtract them item by item. The result has one item fewer than the list. Compare instead, and you find every rise:

```xetal
(1 d̲rop x) − -1 d̲rop x   ⍝ -2 3 -3 4 4
(1 d̲rop x) > -1 d̲rop x   ⍝ 0 1 0 1 1
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Normalize values: an aggregate, then each item
{: .pos-left}

Next, normalize values: subtract the average from every item. A loop needs two passes, the first to find the average and the second to subtract it:

```rust
let mean = s.iter().sum::<f64>() / n;
for v in &s {
    out.push(v - mean);
}
```

The idiom is an aggregate, then an item-by-item step. Reduce and divide give the average, a single value, and scalar extension from episode 4 does the rest:

```xetal
('+ r̲/ s) ÷ t̲ally s                ⍝ 5.0
(f̲loat s) − ('+ r̲/ s) ÷ t̲ally s   ⍝ -3.0 -1.0 1.0 3.0
```

One detail: division gives a float, and these items are integers. In X_eTaL the two do not mix, so without `f̲loat`{:.language-xetal} it is an error:

```xetal
s − ('+ r̲/ s) ÷ t̲ally s
```
```
error[type-mismatch]: expected Int, found Float
```

`f̲loat`{:.language-xetal} turns the integers into floats first.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Count occurrences: unique and a table
{: .pos-right}

Last, count occurrences: how many times each value appears. A loop keeps a map from each value to its count:

```rust
let mut counts = HashMap::new();
for v in &votes {
    *counts.entry(v).or_insert(0) += 1;
}
```

The idiom starts with unique, which gives each value once, in the order they first appear:

```xetal
u̲nique votes   ⍝ 2 3 1
```

Equals table compares each value with every vote, so each row marks where one value appears:

```xetal
(u̲nique votes) '= t̲able votes
```
```
┌→──────────┐
↓1 0 1 0 1 0│
│0 1 0 0 0 1│
│0 0 0 1 0 0│
└~──────────┘
```

Sum along each row, and you have the counts: 2 appears three times, 3 twice and 1 once.

```xetal
'+ r̲/₂ (u̲nique votes) '= t̲able votes   ⍝ 3 2 1
```

The trade-off: the table has a cell for every value and every vote. For a long list, that is a lot of cells.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## More than a shorter loop
{: .pos-center}

An array idiom is more than a shorter spelling of a loop. It captures a pattern that keeps coming back. Once you see the pattern, you can reason about the whole operation, reuse it and test it, and often make it faster apart from the program that uses it. The goal is not to remove every loop. The goal is to say the problem at the most useful level.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Coming up, and an exercise
{: .pos-left}

The next episode tours the family of array languages: APL first, then J and K, then BQN, and last X_eTaL, and what each one chose.

Before then, try this in the [browser editor](https://softwarewrighter.github.io/X_eTaL/). Take `3 1 4 1 5 9`. Find its sum and its largest value. Find its running totals. Count the values greater than three. Then find the adjacent differences. (To type it, use the ASCII it is drawn from: `:=` for `←`, `r_/` for `r̲/`, `s_\` for `s̲\`, `d_rop` for `d̲rop`.)

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

Mike: TODO, a closing in your words.
