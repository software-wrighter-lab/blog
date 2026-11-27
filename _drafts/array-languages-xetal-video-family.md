---
layout: post
title: "Array Languages #26: APL, J, K, BQN and X_eTaL, the Language Family"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, j, k, bqn, video, teaching, notation, scan, trains, tacit-programming, type-inference]
keywords: "array languages family, APL J K BQN compared, array language notation, tacit programming, function composition, combinators, ASCII notation, static types in an array language, X_eTaL rendered source, array languages video series"
abstract: "Twenty-sixth in the Array Languages series: episode 6 of the video series that teaches array programming with X_eTaL, a tour of the array-language family. APL made arrays and math the vocabulary; J explored an ASCII notation and function composition; K a compact vocabulary; BQN a modern notation and combinators. The same small problems in all five: running totals, reverse, right-to-left reading and a mean written as a train; then dynamic types against X_eTaL's static, inferred ones, and X_eTaL source as typed and as drawn."
series: "Array Languages"
series_part: 26
date: 2026-11-27 00:15:00 -0800
# video_url: "Mike: TODO, the episode's YouTube URL once it is published" (post.html embeds it at the end and it joins the Videos tab)
# video_title: "Mike: TODO, from X_eTaL-video out/al-06-*-youtube/title.txt (or oEmbed once public)"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Rewritten 2026-11-27 08:40 from X_eTaL-video lessons/al-06-tour/lesson.mjs, UNCOMMITTED work in progress
     (08:25; saga step 004 al-06-script in progress; no narration audio, render or upload yet). Section order and
     wording follow the lesson's scenes and narration. Re-check against the lesson when it is committed.
     X_eTaL lines run with the pinned bin/xetal (49c00785) and drawn with bin/xetal render. The other languages'
     lines checked here on 2026-11-27: GNU APL 2.0 (scan, reverse, 2×3+4), J 9.7.1, ngn/k (b9eeb91), Kona, CBQN
     (2bf102f), all matching. Not checkable locally: the APL train (+/÷≢), since GNU APL has no trains and sw-apl
     no ≢. Checked by Mike on TryAPL (Dyalog, TryAPL 3.8.1) 2026-11-27 09:10: 3.833333333. The APL2 form (+/x)÷⍴x checked in GNU APL and sw-apl: 3.833333333. Kona gives 3 for {(+/x)%#x} (integer %); ngn/k 3.8333. Told Mike.
     No frames yet (gutter figures once the video renders). Lead image block-apl-trees (Mike, 2026-11-27). Mike: video URL, closing.
-->

<img src="{{ '/assets/images/posts/block-apl-trees.webp' | relative_url }}" class="post-marker no-invert" alt="A woodblock print on a cream scroll: five trees of glowing blue cubes rise from one tangle of shared roots, from a gnarled old tree hung with small glyph ornaments, through two slim angular trees and a tall neat one, to a small sapling; an arrow-shaped stream beneath them flows right to left" style="width: 205px;">

Episode 6 of my video series on array programming is a tour of the array-language family. [Episode 5](/2026/11/26/array-languages-xetal-video-idioms/) was about idioms, short phrases for patterns that keep coming back. This one is about the languages behind those idioms: APL, J, K, BQN and X_eTaL, side by side on the same small problems.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Try APL** | [TryAPL](https://tryapl.org/) |
| **Try BQN** | [BQN REPL](https://mlochbaum.github.io/BQN/try.html) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **Related posts** | [How X_eTaL Evolved, Decision by Decision](/2026/10/22/array-languages-xetal-language-history/), [What Makes a Practical Language](/2026/10/23/array-languages-xetal-philosophy/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Five languages

- **APL** showed that a language could treat arrays and math as its basic vocabulary.
- **J** explored an ASCII notation, and powerful function composition.
- **K** kept a compact vocabulary, and short expressions.
- **BQN**, after them, revisited many of these ideas with a modern notation and combinators.
- **X_eTaL** takes ideas from this family, but makes different choices: checked types, ASCII source drawn with typography, and composition.

X_eTaL is not a replacement for any one of them. It borrows from the family, then makes its own choices.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Running totals in five languages

Start with running totals, from the last episode. Every language here has a scan. The spelling differs; the answer is the same.

```
APL      +\3 1 4 1 5 9
J        +/\ 3 1 4 1 5 9
K        +\3 1 4 1 5 9
BQN      +`3‿1‿4‿1‿5‿9
```

```xetal
x ← 3 1 4 1 5 9
'+ s̲\ x   ⍝ 3 4 8 9 14 23
```

All five give `3 4 8 9 14 23`. BQN writes a list with ligatures, `3‿1‿4‿1‿5‿9`, where the others use spaces.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Notation: reverse
{: .pos-left}

Reverse shows the notation. APL and BQN use a glyph, a circle with a bar. J and K use ASCII symbols. X_eTaL uses a word, with its first letter underlined.

```
APL      ⌽3 1 4 1 5 9
BQN      ⌽3‿1‿4‿1‿5‿9
J        |. 3 1 4 1 5 9
K        |3 1 4 1 5 9
```

```xetal
r̲ev x   ⍝ 9 5 1 4 1 3
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Right to left
{: .pos-right}

All five read from right to left, with no precedence among functions. So three plus four comes first, then two times seven gives fourteen. In J and K, times is typed as a star.

```
APL      2×3+4
J        2*3+4
K        2*3+4
BQN      2×3+4
```

```xetal
2 × 3 + 4   ⍝ 14
```

X_eTaL's source has the star too; it is drawn as `×`.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## A mean, as a train
{: .pos-left}

A train joins functions without naming the argument. Sum, divided by count, is the mean. APL, J and BQN write it as a train; X_eTaL writes the same fork in square brackets. K writes a small function instead, with a named argument, `x`.

```
APL      (+/÷≢)3 1 4 1 5 9
J        (+/ % #) 3 1 4 1 5 9
BQN      (+´÷≠)3‿1‿4‿1‿5‿9
K        {(+/x)%#x}3 1 4 1 5 9
```

```xetal
['+ r̲/ ÷ t̲ally] x   ⍝ 3.8333333333333335
```

The APL train is Dyalog APL's, from 2014. APL2-style APLs such as GNU APL have no trains, so there the mean names its argument, as in K: `(+/x)÷⍴x` gives 3.833333333.

One catch if you try the K line: which K you run matters. ngn/k gives 3.8333333333333335, but Kona, an older open-source K, divides two integers into an integer and gives 3.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Types, checked before it runs
{: .pos-right}

The four older languages check types as the program runs. X_eTaL infers a type for every function first. Name the mean, and X_eTaL works out that it takes integers and gives a float:

```xetal
ᵘm̲ean ← ['+ r̲/ ÷ t̲ally]
```

```
u:m_ean : Int -> Float
```

A program that gives it floats is rejected before it runs:

```xetal
['+ r̲/ ÷ t̲ally] f̲loat x
```

```
error[type-mismatch]: expected Int, found Float
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## The family at a glance
{: .pos-center}

| | Notation | Reading order | Trains | Types |
|---|---|---|---|---|
| **APL** | glyphs | right to left | yes | dynamic |
| **J** | ASCII | right to left | yes | dynamic |
| **K** | ASCII | right to left | no | dynamic |
| **BQN** | glyphs | right to left | yes | dynamic |
| **X_eTaL** | ASCII, drawn | right to left | yes | static |

Glyphs or ASCII; right to left in every one; trains in four of them, counting X_eTaL's brackets; types checked as the program runs, or before. X_eTaL is the one with static types.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## ASCII in, decorated out
{: .pos-left}

The episode ends where X_eTaL differs most visibly. Here is the mean as you type it, in plain ASCII:

```
u:m_ean := ['+ r_/ / t_ally]
```

And as X_eTaL draws it:

```xetal
ᵘm̲ean ← ['+ r̲/ ÷ t̲ally]
```

The underlines mark functions. The slash for divide is drawn as a division sign, and `:=` as an arrow. The small mark before the name says it belongs to this program. It is one program, not two: the text stays simple for editors, diffs and search, and the drawing carries more to the reader. Reading and writing X_eTaL itself, names and decorations and what each one promises, is where the series goes next.

Before the next episode, try this: find the mean of 3 1 4 1 5 9 in two of these languages. [TryAPL](https://tryapl.org/), the [BQN REPL](https://mlochbaum.github.io/BQN/try.html) and [X_eTaL in your browser](https://softwarewrighter.github.io/X_eTaL/) all run without installing anything.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-right}

Mike: TODO, a closing in your words.
