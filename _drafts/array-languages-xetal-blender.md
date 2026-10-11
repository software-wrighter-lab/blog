---
layout: post
title: "Array Languages #9: X_eTaL and Blender, Scenes and Animation from Arrays"
categories: [languages, language-design, graphics, tools]
tags: [array-languages, xetal, x-etal, apl, blender, bpy, 3d-graphics, animation, rendering, eevee, gltf, code-generation, extensions]
keywords: "X_eTaL Blender, array language 3D graphics, Blender batch rendering, bpy code generation, EEVEE, glTF export, OBJ export, mesh from arrays, camera orbit animation, X_eTaL-extensions, procedural 3D scenes"
abstract: "Ninth in the Array Languages series: X_eTaL drives Blender. An X_eTaL program writes the Python that Blender runs in the background, works out the geometry as arrays, and gets back rendered stills, videos and 3D files. The first scene answers how big a thousand is; the use-cases ahead are scenes, animation, possibly physics, and rendering."
series: "Array Languages"
series_part: 9
date: 2026-10-15 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<!-- DRAFT (2026-10-11), started from X_eTaL-extensions Saga 15 (blender):
     steps 1 (blender-ext) and 2 (bpy-gen) committed; step 3 (blender-cubes) done, its video already published with Saw #14
     (assets/videos/saw-blender-orbit.mp4, the demo's own work/cubes/out/orbit.mp4). demos/cubes.xtl was not yet pushed
     on 2026-10-11: link the demo's source once it is; step 4 (release) to do.
     Many new Blender use-cases are planned: add each as it lands (see "What comes next"). -->

<img src="{{ '/assets/images/posts/block-3d-head.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

The extensions in [post #4](/2026/10/10/array-languages-xetal-extensions/) gave X_eTaL a database, sound, windows and a small 3D renderer of its own. The newest one hands the 3D work to a real tool: Blender. An X_eTaL program describes a scene as arrays, Blender renders it, and what comes back is pictures, video and 3D files. This post is the start of that work, and it will grow as the use-cases do.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The extension** | [X_eTaL-extensions: blender](https://github.com/softwarewrighter/X_eTaL-extensions/tree/main/extensions/blender) --- the facade, the bpy writer, the demos |
| **First look** | [Saw #14](/2026/10/11/saw-guards-lints-macros-blender/) |
| **Prior posts** | [Array Languages #4: X_eTaL-extensions](/2026/10/10/array-languages-xetal-extensions/) · [the voxel world](/2026/10/09/voxels-3d-worlds-array-languages/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The chain

Blender is scripted in Python, through its `bpy` module, and it can run without a window. So the extension does not call Blender directly. An X_eTaL program writes two Python scripts as text: a short launcher that starts Blender in the background with its factory settings, and the `bpy` script Blender runs inside. The extension writes them to disk, runs the launcher under a timeout, keeps the whole output in a log, and answers with the exit status and the last lines. The program then reads back what was made.

```text
X_eTaL  →  blender extension  →  python3  →  Blender, in the background  →  Python inside Blender
```

Two choices shape it. The program generates the `bpy` code itself, rather than handing data to a fixed script, so anything Blender's Python can do is in reach. And the renderer is EEVEE, Blender's fast one. File paths stay inside the working directory, and a Python error inside Blender fails the run.

## Geometry as arrays

The library on top, `Bpy.xtl`, returns pieces of a script as text: an empty scene, cubes, 3D labels, a sun and a sky, a camera, EEVEE settings, a still, a video, exports. The geometry is X_eTaL's. Here is every corner and face of *n* cubes at once, as one mesh:

```text
ˡc̲ubeMesh ← { (cs, size) z →
  n ← 1 s̲elect s̲hape cs
  c̲ol ← { k → r̲avel (k s̲elect₂ cs) '+ t̲able size × k s̲elect₂ corners }
  v ← 2 1 t̲ranspose (3 c̲at 8 × n) r̲eshape (c̲ol 1) c̲at (c̲ol 2) c̲at c̲ol 3
  f ← ((6 × n) c̲at 4) r̲eshape r̲avel (8 × (r̲ange n) − 1) '+ t̲able r̲avel sides
  (v, f)
}
```

The corners are an outer product: each center plus each of a unit cube's eight corners, scaled, one coordinate at a time. The faces are another: each cube's offset into the corner list plus the six sides' corner numbers. No loop over cubes, and a thousand cubes cost the same few lines as one. The numbers go into the script, and Blender builds one mesh from them.

</div>

<div class="clearfix" markdown="1">

## The first scene: how big is a thousand?

<figure style="float: right; clear: none; margin: 0.2em 0 0.6em 1.5em; max-width: 45%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" aria-label="Blender's render of an X_eTaL scene: one cube labeled 1, a ten by ten slab labeled 100 and a ten by ten by ten block labeled 1000, the camera orbiting once around them">
<source src="{{ '/assets/videos/saw-blender-orbit.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The cubes demo: 1, 100 and 1,000 cubes, built as arrays by X_eTaL and rendered by EEVEE, the camera orbiting once.</figcaption>
</figure>

The first demo is a size comparison in the xkcd style: one cube, a 10 by 10 slab of a hundred, and a 10 by 10 by 10 block of a thousand, side by side and labeled. The cells of each block come from one expression over its index range, and the camera turns once around them in ten seconds, evenly, so the video loops. The block of a thousand alone is 8,000 vertices.

Blender draws thin outlines on every edge and keeps the labels turned toward the camera, and a render from scratch takes about five minutes, most of it the outlines. The same run writes the scene as files to open elsewhere: `.glb` for glTF viewers and the web, `.obj` with its materials, and `.blend` for Blender itself.

Tests run Blender too. One pins the Python the library writes. Another sends two cubes and a label through Blender end to end and checks what came back: 16 vertices, 12 faces, the objects, a still and each export.

</div>

<div class="clearfix" markdown="1">

## What comes next

<!-- TODO: fill in as each new Blender use-case lands in X_eTaL-extensions (Saga 15 and after). -->

The extension's release step comes first: recordings, its page and the catalog. After that, many new Blender use-cases are planned, along these lines:

- **Scenes:** more than cubes, toward more advanced meshes and effects.
- **Animation:** more than a camera on an orbit.
- **Physics,** possibly: Blender can simulate, and X_eTaL can set the scene up.
- **Rendering:** stills, video and 3D files as the outputs a program asks for.

The pattern stays the same: X_eTaL works out the arrays, writes the Python, and Blender does what it is best at.

</div>
