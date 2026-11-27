---
layout: post
title: "Array Languages #26: APL, J, K, BQN and X_eTaL, the Language Family"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, j, k, bqn, video, teaching, notation, combinators, tacit-programming]
keywords: "array languages family, APL J K BQN compared, array language notation, tacit programming, function composition, combinators, ASCII notation, static types in an array language, X_eTaL rendered source, array languages video series"
abstract: "Twenty-sixth in the Array Languages series: episode 6 of the video series that teaches array programming with X_eTaL, a tour of the array-language family. APL made arrays the vocabulary; J explored an ASCII notation and composition; K a compact vocabulary; BQN a modern notation and combinators. X_eTaL takes inspiration from all of them and makes different choices: statically checked types, ASCII source drawn with typography, and an emphasis on functional composition. Compared by notation, evaluation order, composition, array structure, typing and tooling."
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
     Started 2026-11-26 20:05, BEFORE episode 6 exists: X_eTaL-video has no al-06 lesson or saga yet (last commit
     9ccdf70, al-05 published). Sources: docs/array-languages-video-series-plan.md (06, APL J K BQN and X_eTaL, 10 min,
     moved up 2026-11-26), docs/research2.txt "Video 07" (its narration and the six comparison axes), al-05's
     next-episode slide (APL arrays as the vocabulary; J ASCII notation, composition; K a compact vocabulary; BQN a
     modern notation, combinators; X_eTaL checked types, rendered ASCII source), and AL #24 for K's list of rows.
     Rewrite against the lesson's script and narration once they exist; add each language's code from the lesson
     (and comparing-languages.md's REPL results). No other-language code here yet: a local GNU APL/J/K check hung.
     The X_eTaL lines were run with X_eTaL-video's pinned bin/xetal (49c00785) and drawn with bin/xetal render.
     Date 2026-11-27 is tentative. Lead image: a placeholder (prompt suggested to Mike 2026-11-26). Mike: the closing.
-->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-video-family.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Episode 6 of my video series on array programming tours the family X_eTaL belongs to. [Episode 5](/2026/11/26/array-languages-xetal-video-idioms/) solved small problems twice, with a loop and with whole arrays. This one steps back to the languages that worked out how to think that way: APL, then J and K, then BQN, and last X_eTaL, and what each one chose.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, the episode link and thumbnail, once published |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **Related posts** | [How X_eTaL Evolved, Decision by Decision](/2026/10/22/array-languages-xetal-language-history/), [What Makes a Practical Language](/2026/10/23/array-languages-xetal-philosophy/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A family, not a replacement

X_eTaL is not a replacement for any one of these languages. Each made choices the others did not, and X_eTaL borrows from all of them while making some of its own. The episode compares them on six things:

- **notation:** symbols, ASCII words, or something in between;
- **evaluation order:** how an expression is read;
- **function composition:** how small functions combine into bigger ones;
- **array structure:** what an array is (a rectangle of items, or lists of lists);
- **typing:** what is checked, and when;
- **tooling:** what you edit, and what you see.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## APL: arrays as the vocabulary

APL showed that a programming language could treat arrays, and the mathematical transformations on them, as its basic vocabulary. Its functions are symbols, one glyph each, and most of what this series has shown so far, from reduce and scan to rotate and transpose, started there. The short names X_eTaL keeps with a mark, like `r̲/`{:.language-xetal} and `o̲\`{:.language-xetal}, are the places where it kept APL's own symbol.

Mike: TODO from the lesson, APL's code for the episode's example.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## J: ASCII notation and composition
{: .pos-left}

J explored writing the same ideas in plain ASCII, with powerful ways to combine functions without naming their arguments. Episode 4 used J's rank to say "each row"; this episode looks at its composition.

Mike: TODO from the lesson.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## K: a compact vocabulary
{: .pos-right}

K emphasized a small vocabulary and very concise expressions. As episode 4 showed, a K matrix is a list of rows, which shapes how its functions meet each other.

Mike: TODO from the lesson.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## BQN: a modern notation and combinators
{: .pos-left}

BQN revisited many array-language ideas with a modern notation and an explicit set of combinators, the building blocks for combining functions.

Mike: TODO from the lesson.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## X_eTaL: different choices
{: .pos-right}

X_eTaL takes inspiration from this family but makes different choices: statically checked types, ASCII source drawn with typography, and a deliberate emphasis on functional composition.

The source is plain ASCII. Here is the mean of a list, written as a train, a fork of three functions in brackets, as you would type it:

```
x := 3 1 4 1 5 9
['+ r_/ / t_ally] x
```

And the same program as X_eTaL draws it:

```xetal
x ← 3 1 4 1 5 9
['+ r̲/ ÷ t̲ally] x   ⍝ 3.8333333333333335
```

It is one program, not two. The underline marks a function name, `:=` is drawn as `←`, and `/` between numbers is drawn as `÷`. The text stays simple for editors, diffs and search; the drawing carries more meaning to the reader.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-center}

Mike: TODO, a closing in your words.
