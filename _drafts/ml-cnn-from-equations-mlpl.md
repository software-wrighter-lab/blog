---
layout: post
title: "Machine Learning #9: Teaching an Array Language to Say CNN"
categories: [machine-learning, languages, rust]
tags: [machine-learning, sw-mlpl, mlpl, cnn, convolution, array-languages, apl, reduction, sliding-window, broadcasting, axis-labels, autograd, conv2d]
keywords: "CNN, convolutional neural network, convolution, cross-correlation, array language, sw-MLPL, MLPL, APL, windows, sliding window, moving average, stencil, trailing-axis broadcasting, multi-axis reduction, named axis reduction, axis labels, reduce, matmul, im2col, conv2d, autograd, trainable convolution, Zhao 2018"
author: Software Wrighter
abstract: "A CNN layer is defined with three nested summations. Saying that in an array language takes four pieces of vocabulary that sw-MLPL did not have: a sliding-window rearrangement, broadcasting a small kernel against a large stack of patches, reduction over several axes at once, and reduction by axis name. This is what each one lets you write, with a fifth --- differentiating through the window --- that turns the result from a convolution you can compute into one you can train."
series: "Machine Learning"
series_part: 9
papers:
  - title: "A Faster Algorithm for Reducing the Computational Complexity of Convolutional Neural Networks"
    url: "https://doi.org/10.3390/a11100159"
repo_urls:
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
  - url: "https://github.com/sw-ml-study/demo-ml-utils"
    title: "demo-ml-utils"
---

<img src="{{ '/assets/images/posts/nesting-dolls.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

A convolutional layer arrives in the literature as a triple sum. Zhao, Wang, Wang and Liu, [*A Faster Algorithm for Reducing the Computational Complexity of Convolutional Neural Networks*](https://doi.org/10.3390/a11100159) (*Algorithms*, 2018), §2.1, defines one output cell:

</div>

```text
               Q      M_w    N_w
  y[r,x,y]  =  ∑      ∑      ∑     W[r,q,u,v] · X[q, x+u, y+v]
              q=1    u=1    v=1
```

| Symbol | Range | Meaning |
|---|---|---|
| `r` | output filters | selects the output feature map |
| `q` | input channels | selects the input feature map |
| `u`, `v` | kernel rows, columns | position inside the kernel window |
| `x`, `y` | output positions | position in the output feature map |
| `Q`, `M_w`, `N_w` | — | input channels, kernel height, kernel width |

<div class="aside-box" markdown="1">

**TL;DR** --- five additions to sw-MLPL, and what each one lets you write:

| Keyword | What it enables |
|---------|-----------------|
| `windows(x, sizes)` | Every sliding neighborhood as an array --- convolution, moving averages, stencils, any local operator, with no index arithmetic |
| trailing-axis broadcasting | One small kernel meets a whole stack of patches without being copied out to match |
| `reduce(:op, a, [2,3,4])` | Several summations collapsed in one pass, in any order |
| `reduce(:op, a, "channel")` | Axes chosen by meaning instead of position |
| `grad` through `windows` | The convolution stops being something you compute and becomes something you train |

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) |
| **Playground** | [mlpl.softwarewrighter.com](https://mlpl.softwarewrighter.com/) --- **[Ed. to be finalized]** confirm stable carries these before publishing |
| **The demos** | [sw-ml-study/demo-ml-utils](https://github.com/sw-ml-study/demo-ml-utils) |
| **The paper** | Zhao, Wang, Wang & Liu, [*Algorithms* 11(10):159, 2018](https://doi.org/10.3390/a11100159) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

Two notes before the code, because both are places a transcription quietly stops matching its source. This is **cross-correlation**: `X[q, x+u, y+v]`, not `x-u, y-v`, so the kernel is never flipped. Every mainstream framework does this and calls it convolution, and the native `conv2d` builtin agrees, but it is worth naming. And the **paper counts from 1 while the array language counts from 0** --- `q = 1..Q` is `0..Q-1` in code, and reduction axis numbers are 0-based too.

## `windows` --- neighborhoods become values

The hard term is `X[q, x+u, y+v]`. That index arithmetic says: for every output position, look at the small block of input around it. Written as loops, you manage the position counters and the offsets yourself, and the shape of the thing you are working on never appears in the source at all.

```mlpl
patches = windows(x, [3, 3])
```

A `[channel, image_y, image_x]` input becomes `[out_y, out_x, channel, 3, 3]`: a grid with one cell per output position, each cell holding an entire `channel × 3 × 3` neighborhood. The offsets are gone from the source and have become structure in the array.

**What it enables beyond convolution.** Any operator defined on a neighborhood is now a two-step expression --- take the windows, reduce them:

```mlpl
moving_avg = reduce(:add, windows(x, [5]), 1) / 5
```

Blur kernels, edge detectors, pooling, Game of Life neighbor counts, finite-difference stencils, moving-window statistics --- all the same shape of statement. It windows the trailing axes and leaves earlier ones alone, so a channel or batch axis rides along untouched, and it takes an optional stride when you want the windows to skip rather than slide by one.

## Broadcasting --- one kernel, every patch

Now the multiply. A kernel is `[channel, kernel_y, kernel_x]`; the patches are `[out_y, out_x, channel, kernel_y, kernel_x]`. The same small kernel applies at every position, which is what "shared weights" means in a CNN.

Trailing-axis broadcasting lets those meet directly:

```mlpl
weighted = kernel * patches
```

The kernel's three axes line up against the patches' last three, and it is reused across the leading position axes rather than copied. **The benefit is the copy that does not happen.** Without it you must first replicate the kernel out to the full shape of the patch stack --- for a modest `[8,32,32]` input that is over a million redundant values built and multiplied so the shapes would match. The equation says one kernel is applied everywhere; broadcasting is what lets the code say that too.

## Multi-axis reduction --- three sums, one statement

What remains is the summing, over channel, kernel row and kernel column at once.

One axis at a time, that is three nested calls, read inside-out and in reverse:

```mlpl
y = reduce(:add, reduce(:add, reduce(:add, weighted, 4), 3), 2)
```

The nesting also implies an order the mathematics does not have: `∑_q ∑_u ∑_v` is three interchangeable sums, not three stacked passes. Reduction over a vector of axes says it once:

```mlpl
y = reduce(:add, weighted, [2, 3, 4])
```

One pass, rank drops by three, order irrelevant. Beyond convolution this is the ordinary case of summing a tensor down to what you actually want --- totals across batch and spatial axes while keeping channels, and so on --- without stacking calls to get there.

## Named axes --- meaning instead of position

Integers still make the reader do bookkeeping. Which axis was 2?

```mlpl
y = reduce(:add, weighted, "channel")
```

The paper's `q`, `u`, `v` are placeholders you decode from surrounding prose. `channel`, `kernel_y`, `kernel_x` are not. And unlike a comment, a label is checked: name an axis that does not exist and you get an error rather than a wrong answer. Labels also survive the operations that reshape and filter an array, so a name attached early still means something several steps later.

## The layer, in one line

```mlpl
@formula "y[r,x,y] = ∑(q=1..Q) ∑(u=1..M_w) ∑(v=1..N_w) W[r,q,u,v] · X[q, x+u, y+v]"
def u:conv_layer(x, w, kh, kw) {
    "One convolutional layer: window, multiply, reduce.";
    reduce(:add, w * windows(x, [kh, kw]), ["channel", "kernel_y", "kernel_x"])
}
```

Window, multiply, reduce. The annotation carries the source equation as data --- readable at runtime, so the mathematics travels with the function instead of in a comment that drifts away from it.

## It is also the fast version

The reasonable worry is that this is a teaching toy you abandon for real work. Laying the windows out as a matrix and letting `matmul` contract them:

```mlpl
cols = reshape(windows(x, [kh, kw]), [oy * ox, c * kh * kw]);
y    = matmul(cols, reshape(kernel, [c * kh * kw]))
```

On an `[8,32,32]` input against `[16,8,3,3]` filters this runs in **1.198 ms** against the hand-written native `conv2d` builtin's **1.230 ms**, and agrees with it *exactly* rather than within a tolerance. The readable spelling is not the slow one.

## And then you can train it

**[Ed. to be finalized]** *Differentiating through `windows` is the last piece; confirm before publishing.*

Computing a convolution is half of what a CNN needs. The other half is a gradient flowing back through it, so the kernel can be learned rather than supplied. With `windows` differentiable, the same expression that reads like the paper's equation can sit inside a training loop --- and a reader who has followed the arithmetic this far has already seen every operation the backward pass has to reverse.

## Why this was worth doing

`conv2d` already existed. None of these were needed to *compute* a convolution.

What they change is that the layer can be written so that someone who has read the paper recognizes the code, and someone who has read the code can reconstruct the paper. The offsets became an array. The three sums became one reduction. The axes acquired names. The kernel stopped being copied. None of it changes the arithmetic --- it changes whether the notation and the executable form are the same object, or two things you hope stay in sync.
