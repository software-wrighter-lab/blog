---
layout: post
title: "Made Visible #2: MesaOS, the Conventional One"
categories: [systems, languages, rust]
tags: [swtos, mesaos, mlos, sw-mlpl, native3d, visualization, 3d, memory-layout, operating-systems, array-languages, wgpu, json, ring-3, elf, paging]
keywords: "MesaOS, memory layout visualization, physical memory manager, virtual memory manager, HHDM, kernel heap, Ring 3, ELF, limine, sw-MLPL, native3d, columnar contract"
author: Software Wrighter
series: "Made Visible"
series_part: 2
video_url: "https://youtu.be/JnlhHDtXWGg"
video_title: "MesaOS memory layout in 3D"
repo_urls:
  - url: "https://github.com/crackanimad0r/MesaOS"
    title: "MesaOS (upstream)"
  - url: "https://github.com/softwarewrighter/MesaOS"
    title: "MesaOS (my fork)"
abstract: "The second system drawn by the same memory visualizer, and the ordinary one: a 64-bit kernel with a physical frame allocator, virtual memory, a kernel heap and ELF programs in Ring 3. It has exactly the machinery the first system deliberately does without, which is what makes it a real test of whether one picture can serve both."
date: 2026-09-12 00:15:00 -0700
---

<img src="{{ '/assets/images/posts/mesaos-marker.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 210px;">

<div style="overflow: hidden;" markdown="1">

[Part 1](/2026/09/11/made-visible-swtos/) drew SWTOS --- a microkernel with no MMU, where addresses are addresses and isolation is a discipline rather than a mechanism. This is the same viewer, the same data contract and the same array-language middle layer, pointed at a system with all the machinery SWTOS does without.

</div>

**MesaOS** is a 64-bit hybrid kernel: a physical frame allocator, a virtual memory manager, a higher-half direct map, a kernel heap, and ELF programs running in Ring 3 behind a real privilege boundary. **What is drawn here is its memory layout** --- kernel sections, loaded modules, bootloader requests and sparse allocations, laid out as 512 KiB blobs with the empty space summarized rather than drawn.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **MesaOS** (upstream) | [crackanimad0r/MesaOS](https://github.com/crackanimad0r/MesaOS) |
| **MesaOS** (my fork) | [softwarewrighter/MesaOS](https://github.com/softwarewrighter/MesaOS) |
| **How it works** | [Made Visible #1](/2026/09/11/made-visible-swtos/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## MesaOS

<figure>
<img src="{{ '/assets/images/posts/mesaos-layout-loop.gif' | relative_url }}" class="no-invert" alt="Three views of the MesaOS memory layout: kernel sections in place, the same space with a region highlighted, and recolored by kind">
<figcaption>MesaOS: sparse 512 KiB blobs with logarithmic summaries --- kernel sections, modules and bootloader requests, classified the same way.</figcaption>
</figure>

[MesaOS](https://github.com/crackanimad0r/MesaOS) is the conventional one, and that is why it belongs here. It is somebody else's work --- I am running [a fork](https://github.com/softwarewrighter/MesaOS) of it. A 64-bit hybrid kernel with a physical frame allocator, a virtual memory manager, a higher-half direct map, a kernel heap, and ELF programs running in Ring 3 behind a real privilege boundary. Textbook architecture, the kind SWTOS deliberately is not.

<figure class="inline-right no-invert" style="max-width: 330px;">
<a href="https://github.com/softwarewrighter/MesaOS/blob/main/experiments/capture/xclock-demo.webp"><img src="{{ '/assets/images/posts/mesaos-xclock-demo.webp' | relative_url }}" alt="xclock running as a Ring 3 ELF program under MesaOS, its second hand sweeping"></a>
<figcaption>An ELF program in Ring 3, drawing. <a href="https://github.com/softwarewrighter/MesaOS/blob/main/experiments/capture/xclock-demo.webp">Capture</a> from <a href="https://github.com/softwarewrighter/MesaOS">my fork</a>.</figcaption>
</figure>

Which makes it the useful second case. SWTOS has no MMU at all --- addresses are addresses, and isolation is a discipline rather than a mechanism. MesaOS has exactly the machinery SWTOS does without: frames, mappings, and a distinction between what is physically there and what a process is allowed to see. The same picture has to mean something in both.

A note on the name. MesaOS is what the upstream project is called, and the name is well and truly spoken for: `mesaos.com` belongs to an active restaurant point-of-sale product, and it is in use elsewhere besides. So neither the upstream project nor my fork is necessarily keeping it. If you go searching for MesaOS and find yourself reading about kitchen printers, you have not taken a wrong turn --- and if either repository has been renamed by the time you read this, that is why.

## Nothing in the visualizer changed

That is the part worth sitting with. The renderer has no idea what a page table is. It received the same columnar description any producer emits --- spaces, region kinds, owners, offsets, lengths --- and MesaOS filled it with its own vocabulary: kernel sections, modules, bootloader requests, sparse blobs. [Part 1](/2026/09/11/made-visible-swtos/) has the format and the reasoning behind it.

The region names are data. `limine_requests` means nothing to the visualizer, and it does not need to --- it needs a color for it, and the palette covers the union of what the producers emit.
