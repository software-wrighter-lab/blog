---
layout: post
title: "Array Languages #27: Reading and Writing X_eTaL, the Whole Syntax on One Page"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, syntax, notation, typography, video, teaching, lambdas, trains, tacit-programming, combinators, macros]
keywords: "X_eTaL syntax, reading array language code, name decorations, underlined function names, superscript namespaces, subscript axes, superscript power, lambdas alpha omega, tuple patterns, guards, system names, ASCII source rendered typographically, trains fork hook atop, X_eTaL syntax poster, array languages video series"
abstract: "Twenty-seventh in the Array Languages series: episode 7 of the video series that teaches array programming with X_eTaL, how to read and write it. The whole syntax fits on one poster: decorations that say what a name is and where it came from, imports, definitions and binding, applying a function or passing it as a value, axes as subscripts, power as a superscript, lambdas and tuple patterns, system names, the guard, ASCII as typed against the drawn form, and trains. Every example as X_eTaL draws it, and run."
series: "Array Languages"
series_part: 27
date: 2026-12-05 00:15:00 -0800
# video_url: "Mike: TODO, episode 7's YouTube URL once it is published"
# video_title: "Mike: TODO, from X_eTaL-video lessons/al-07-*/title.txt (or oEmbed once public)"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Started 2026-11-28 ahead of the video: X_eTaL-video has no al-07 lesson yet (series plan: 07 "Reading and writing
     X_eTaL", 12 min, later; planned sources intro-xetal, t-reading, t-names). Built on X_eTaL's syntax poster (the
     README's syntax guide, pages/poster/index.html, drawn by xetal render --html), panel by panel, as episode 6's
     preview of episode 7 walks it. Revise to the episode once its lesson exists.
     Lead image: the README's syntax poster (X_eTaL images/xetal-syntax-poster.png, 1600x1916, with the trains panel),
     Mike's choice 2026-11-28; AL #1 shows an older version (1681 tall) as a figure, not as its lead.
     Figures: crops of the poster's panels from X_eTaL-video work/al-06-tour/poster/ (names, defs, apply, trains).
     Every X_eTaL line drawn with X_eTaL-video's pinned bin/xetal render, and run with scripts/xt run (results in the ⍝
     comments); types from bin/xetal type. Poster differences: its ᶜK̲ 42 17 gives a function (K applied to the strand
     42 17); the post uses 42 ᶜK̲ 17, which gives 42. ᵘl̲ife⁴ board, f̲ x and the system names are shown drawn only, not run (no board or f defined; ⎕N̲GET needs a file).
     Mike: video URL and frames once episode 7 exists; closing; date (2026-12-05 tentative).
-->

<img src="{{ '/assets/images/posts/al27-syntax-poster-lead.webp' | relative_url }}" class="post-marker no-invert" alt="X_eTaL's syntax poster, Syntax you can see: eleven dark panels with colored code, from name decorations, imports and definitions through applying or passing, axes, power, lambdas, system names, the guard and ASCII input, to a row of train cards" style="width: 205px;">

Episode 7 of my video series on array programming is about reading and writing X_eTaL. Episode 6 ended with a preview of it: the whole syntax, on one page. That page is X_eTaL's syntax poster, and this post walks through it, panel by panel.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | Mike: TODO, episode 7 once published |
| **The poster** | [X_eTaL: syntax you can see](https://softwarewrighter.github.io/X_eTaL/poster/) |
| **All the videos** | [X_eTaL-video's page](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **Related posts** | [X_eTaL, an Array Language You Can Read](/2026/10/07/array-languages-xetal/), [Small Comforts, X_eTaL's Ergonomics](/2026/10/26/array-languages-xetal-ergonomics/), [APL, J, K, BQN and X_eTaL](/2026/11/27/array-languages-xetal-video-family/) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Syntax you can see

X_eTaL's source is plain ASCII, typed on an ordinary keyboard. What you read is the same program drawn with typography: an underline, a raised letter, a lowered number. The decorations are not styling. Each one says something about the program, so a glance tells you what a name is, where it came from, and how it is used.

The poster puts all of it on one page, and every sample on it is drawn by X_eTaL itself, so it cannot drift from the language. Here it is in order.

## Name decorations

A name's decorations say what it is:

```xetal
r̲ev                                                ⍝ underlined first letter: a function
ᵘs̲quare                                            ⍝ a raised prefix: where it came from
x                                                  ⍝ no underline: a value
```

`r̲ev`{:.language-xetal} is a built-in function, reverse. `ᵘs̲quare`{:.language-xetal} is a function too, and the raised `ᵘ` says it is this program's own. `x` is a value. Color helps as well: built-ins are blue, the program's own functions green, a library's cyan.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Imports and definitions
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al27-poster-defs.webp' | relative_url }}" class="no-invert" alt="The poster's import and definition panels: the Combinators library imported under c:, K from it marked with a raised c, square, limit and x defined, and the four raised prefixes u, l, h and m with what each means">
<figcaption>The poster's import and definition panels. Click to enlarge.</figcaption>
</figure>

Importing a library picks the prefix its names will wear:

```xetal
"c:" u̲se< "Combinators"
42 ᶜK̲ 17                                           ⍝ 42
```

The raised `ᶜ` on `ᶜK̲`{:.language-xetal} tells the reader which import to look in. K, the constant combinator, keeps its left argument.

Definitions bind with an arrow, typed `:=`. A plain `=` compares:

```xetal
ᵘs̲quare ← { ⍵ × ⍵ }
limit ← 100
x ← 3
ᵘs̲quare x                                          ⍝ 9
x = 3                                              ⍝ 1
```

A function's prefix says where it lives: `ᵘs̲quare`{:.language-xetal} is the program's own, `ˡm̲ean`{:.language-xetal} a library's export, `ʰj̲oin`{:.language-xetal} a helper private to its file, and `ᵐw̲hen<`{:.language-xetal} a macro library's export. A variable takes no prefix.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Apply or pass
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al27-poster-apply.webp' | relative_url }}" class="no-invert" alt="The poster's apply-or-pass panel: f x applies f to x; a quoted f passed to each; plus reduced along axis 2 of A">
<figcaption>Apply, or pass with a quote. Click to enlarge.</figcaption>
</figure>

Writing a function before its argument applies it. Quoting it passes it as a value, to another function:

```xetal
ᵘs̲quare x                                          ⍝ apply: 9
'ᵘs̲quare e̲ach 1 2 3                                ⍝ pass: 1 4 9
```

That one rule replaces APL's separate class of operators. Reduce is an ordinary function that takes a function:

```xetal
A ← 2 3 r̲eshape r̲ange 6
'+ r̲/ A                                            ⍝ 5 7 9
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Axes and power
{: .pos-left}

A subscript attaches an axis to the function it changes. Reduce works along the first axis by default; `₂` makes it work along the second:

```xetal
'+ r̲/ A                                            ⍝ 5 7 9
'+ r̲/₂ A                                           ⍝ 6 15
```

Transpose with no axes reverses all of them; with two, it swaps just those:

```xetal
B ← 2 3 4 r̲eshape r̲ange 24
s̲hape o̲\ B                                         ⍝ 4 3 2
s̲hape o̲\₂₃ B                                       ⍝ 2 4 3
```

A superscript is a power. On a value it is an exponent; on a function it means apply it that many times:

```xetal
x²                                                 ⍝ 9
ᵘl̲ife⁴ board                                       ⍝ life, four generations on
```

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Lambdas, and the guard
{: .pos-right}

Braces make an anonymous function. Its arguments are APL's alpha and omega, `⍺` on the left and `⍵` on the right, typed `_l` and `_r`:

```xetal
3 { ⍺ + ⍵ } 4                                      ⍝ 7
```

A lambda can name its argument, and a tuple pattern takes a pair apart:

```xetal
{ (a, b) → (b, a) } (1, 2)                         ⍝ (2, 1)
```

The guard is `?`. Before it, a condition; after it, the result when the condition holds; then `◆` (typed `;`), and what to do otherwise:

```xetal
ᵘf̲act ← { n → n ≤ 1 ? 1 ◆ n × ᵘf̲act n − 1 }
ᵘf̲act 5                                            ⍝ 120
```

Context tells the two uses of `?` apart: at the end of a name, as in `e̲mpty?`{:.language-xetal}, it is part of the name.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## System names
{: .pos-left}

<figure class="zoomable outdent-right" style="width: 45%; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/al27-poster-names.webp' | relative_url }}" class="no-invert" alt="The poster's first panel, name decorations: rev, square with a raised u, K with a raised c, pi with a raised m, and x, with what each decoration means">
<figcaption>The poster's first panel: what a name's decorations say. Click to enlarge.</figcaption>
</figure>

APL's quad marks the system's own facilities: files, input, drawing. The function underline still applies:

```xetal
⎕N̲GET                                              ⍝ read a file
```

`⎕N̲PUT`{:.language-xetal} writes one, `⎕R̲EAD`{:.language-xetal} reads a typed line, and `⎕G̲RID`{:.language-xetal} and `⎕S̲HOW`{:.language-xetal} draw. The quad is typed `[]`.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## ASCII in, drawn out
{: .pos-center}

Everything above is what you read. Here is what you type:

| Typed | Drawn | Meaning |
|---|---|---|
| `r_ev` | `r̲ev`{:.language-xetal} | a function: the underscore follows the letter it underlines |
| `u:s_quare` | `ᵘs̲quare`{:.language-xetal} | a prefix before the colon is raised |
| `r_/_2` | `r̲/₂`{:.language-xetal} | an underscore and a number after the name: an axis |
| `u:l_ife^4` | `ᵘl̲ife⁴`{:.language-xetal} | a caret: a power |
| `[]R_EAD` | `⎕R̲EAD`{:.language-xetal} | brackets: the quad |
| `_l`, `_r` | `⍺`, `⍵` | a lambda's arguments |
| `:=`, `;` | `←`, `◆` | binding, and the statement separator |

The program is the ASCII; the drawing is a view of it. The browser editor shows both side by side, as you type.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Trains
{: .pos-center}

<figure class="zoomable" style="margin: 0 0 1em;">
<img src="{{ '/assets/images/posts/al27-poster-trains.webp' | relative_url }}" class="no-invert" alt="The poster's trains panel: cards for atop, dyadic atop, fork, dyadic fork, hook, self, tacks, longer trains and quoted trains, each with its rule and an example">
<figcaption>The poster's trains panel. Click to enlarge.</figcaption>
</figure>

Square brackets compose functions without naming the argument: a train, as in APL, J and BQN. Before one value a train is monadic; between two, dyadic. The rule for each shape, and an example of each, run:

| Train | Means | Example |
|---|---|---|
| Atop | `[f̲ g̲] x`{:.language-xetal} is `f̲ g̲ x`{:.language-xetal} | `[n̲eg a̲bs] -3 4`{:.language-xetal} gives `-3 -4` |
| Dyadic atop | `x [f̲ g̲] y`{:.language-xetal} is `f̲ (x g̲ y)`{:.language-xetal} | `7 [n̲eg −] 2`{:.language-xetal} gives `-5` |
| Fork | `[f̲ g̲ h̲] x`{:.language-xetal} is `(f̲ x) g̲ (h̲ x)`{:.language-xetal} | `['+ r̲/ ÷ t̲ally] 1 2 3 4`{:.language-xetal} gives `2.5` |
| Dyadic fork | `x [f̲ g̲ h̲] y`{:.language-xetal} is `(x f̲ y) g̲ (x h̲ y)`{:.language-xetal} | `5 [+ × −] 3`{:.language-xetal} gives `16` |
| Hook | `[i̲d f̲ g̲] x`{:.language-xetal} is `x f̲ (g̲ x)`{:.language-xetal} | `[i̲d − n̲eg] 5`{:.language-xetal} gives `10` |
| Self | `[i̲d f̲ i̲d] x`{:.language-xetal} is `x f̲ x`{:.language-xetal} | `[i̲d × i̲d] 5`{:.language-xetal} gives `25` |
| Tacks | `x [l̲eft f̲ r̲ight] y`{:.language-xetal} is `x f̲ y`{:.language-xetal} | `7 [l̲eft − r̲ight] 2`{:.language-xetal} gives `5` |
| Longer | forks grouped from the right | `[f̲irst c̲at 'm̲ax r̲/ c̲at t̲ally] 3 1 4`{:.language-xetal} gives `3 4 3` |
| Quoted | a train passed as a value is monadic | `'[t̲ally d̲isclose] e̲ach "ab" "cde" "f"`{:.language-xetal} gives `2 3 1` |

X_eTaL has no separate hook rule, as J does: a hook is a fork whose left function is identity.

<div style="clear: both; text-align: center; margin: 2.6em 0 1.8em; opacity: 0.45;">
<img src="{{ '/assets/images/posts/block-hr-rule.webp' | relative_url }}" class="theme-light-only no-invert" alt="" style="width: 45%;">
<img src="{{ '/assets/images/posts/block-hr-rule-dark.webp' | relative_url }}" class="theme-dark-only no-invert" alt="" style="width: 45%;">
</div>

## Closing
{: .pos-right}

Mike: TODO, a closing in your words.
