---
layout: post
title: "Made Visible #3: MLOS, Where Memory Means Something Else"
categories: [systems, languages, rust, machine-learning]
tags: [swtos, mesaos, mlos, sw-mlpl, native3d, visualization, 3d, memory-layout, operating-systems, array-languages, wgpu, json, weights, kv-cache, residency]
keywords: "MLOS, sw-os-ml, ML operating system, resident model state, weight tiles, KV blocks, residency, tiering, memory layout visualization, sw-MLPL, native3d, columnar contract"
author: Software Wrighter
series: "Made Visible"
series_part: 3
video_url: "https://youtu.be/vRfXYOaxXbo"
video_title: "MLOS storage and memory in 3D"
repo_urls:
  - url: "https://github.com/sw-ml-study/sw-os-ml"
    title: "sw-os-ml (MLOS)"
abstract: "The third system drawn by the same visualizer, and the one that breaks the pattern. MLOS is a Rust kernel whose scarce resource is not flash blocks or physical frames but resident model state --- weights, KV blocks, activations --- treated as kernel objects. Three systems now share one picture while meaning three different things by 'where is it in memory'."
---

<img src="{{ '/assets/images/posts/mlos-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 210px;">

<div style="overflow: hidden;" markdown="1">

[Part 1](/2026/09/11/made-visible-swtos/) drew a microkernel's flash. [Part 2](/2026/09/12/made-visible-mesaos/) drew a conventional kernel's frames and mappings. This one is neither.

</div>

**MLOS** is a Rust kernel that boots in a VM and treats resident model state --- weights, KV blocks, activations --- as kernel objects with residency and tiering, the way Unix treats pages. **What is drawn here is its storage and memory**: weight tiles arranged in layers, colored by the tier they are resident in --- disk, DRAM, or system RAM.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **MLOS** | [sw-ml-study/sw-os-ml](https://github.com/sw-ml-study/sw-os-ml) |
| **How it works** | [Made Visible #1](/2026/09/11/made-visible-swtos/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## MLOS

<figure>
<img src="{{ '/assets/images/posts/mlos-layout-loop.gif' | relative_url }}" class="no-invert" alt="Three views of the MLOS layout: weight tiles in layers, one tile selected, and the same space recolored by storage tier">
<figcaption>MLOS: weight tiles in layers, then one selected, then recolored by tier --- the same viewer, MLOS's own vocabulary.</figcaption>
</figure>

[MLOS](https://github.com/sw-ml-study/sw-os-ml) is the one that breaks the pattern. It is a Rust kernel, it boots in a VM, and its scarce resource is neither flash nor physical frames but *resident model state* --- weights, KV blocks, activations --- which it treats as kernel objects with residency and tiering the way Unix treats pages.

So across the three, "where is it in memory" means three different things: a block offset in a flash device, a physical frame behind a virtual mapping, and a model object that is either resident or not. Different machines, different decades of hardware, different units of accounting.

Same picture, because the question underneath is the same one: what is here, who owns it, and what class of thing is it? That is the point of showing more than one. A visualizer that only ever drew SWTOS would be a SWTOS feature. Drawing systems that share nothing but the question makes it a tool.

## What three systems bought

One system drawn well is a feature of that system. Three systems that share nothing but the question --- what is here, who owns it, what class of thing is it --- make it a tool, and they are the reason the boundary in [part 1](/2026/09/11/made-visible-swtos/) was worth drawing where it was.

The visualizer still does not know what an operating system is. It never learned, across three of them.
