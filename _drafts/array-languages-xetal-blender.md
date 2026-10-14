---
layout: post
title: "Array Languages #9: X_eTaL and Blender, Scenes and Animation from Arrays"
categories: [languages, language-design, graphics, tools]
tags: [array-languages, xetal, x-etal, apl, blender, bpy, 3d-graphics, animation, rendering, eevee, gltf, code-generation, extensions]
keywords: "X_eTaL Blender, array language 3D graphics, Blender batch rendering, bpy code generation, EEVEE, glTF export, OBJ export, mesh from arrays, camera orbit animation, X_eTaL-extensions, procedural 3D scenes"
abstract: "Ninth in the Array Languages series: X_eTaL drives Blender. An X_eTaL program writes the Python that Blender runs in the background, works out the geometry as arrays, and gets back renders, animations and 3D files. It has already made the tower-defense game's animated pieces. Next it turns to the rest of the series: videos of an X_eTaL program becoming a Blender model, a calculator machine running on an FPGA, and a kernel running on a GPU, each built from the real data those repos produce."
series: "Array Languages"
series_part: 9
date: 2026-10-15 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-14 from X_eTaL-extensions Saga 15: steps 1 to 10 done (the extension, Bpy, cubes, release,
     shapes, actions, td-models, game-assets, gate-speed, td-sheets; last c620482, 6db1bc1); step 11 blender-pipeline IN PROGRESS (uncommitted),
     the video planned for THIS post; steps 13 to 18 (257639a, 71abf4e): explainer videos of HEX1000 and the GPU work, then a trailer.
     The cubes demo and its orbit video belong to Saw #14 only; the TD pieces' lineup frame belongs to post #6: this post gets new videos, marked [VIDEO].
     Media in this post: gutter figures with class zoomable (the site's lightbox, _includes/lightbox.html), each explained in its section. -->

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
| **What it shows** | [the GPU, #7](/2026/10/13/array-languages-xetal-gpu/) · [the FPGA, #8](/2026/10/14/array-languages-xetal-fpga/) · [the tower-defense pieces](https://softwarewrighter.github.io/X_eTaL-extensions/blender/td/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The chain

<figure class="zoomable" style="float: right; clear: none; margin: 0.2em 0 0.6em 1.5em; max-width: 44%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-hello-poster.webp' | relative_url }}" aria-label="A terminal recording of the hello demo: the X_eTaL program, the Python launcher and Blender script it writes as text, the run, and the report Blender wrote: objects: Camera Cube Light">
<source src="{{ '/assets/videos/xetal-blender-hello.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-hello.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The hello demo: X_eTaL writes the Python, runs Blender, and reads back what Blender found. Click to enlarge.</figcaption>
</figure>

Blender is scripted in Python, through its `bpy` module, and it can run without a window. So the extension does not call Blender directly. An X_eTaL program writes two Python scripts as text: a short launcher that starts Blender in the background with its factory settings, and the `bpy` script Blender runs inside. The extension writes them to disk, runs the launcher under a timeout, keeps the whole output in a log, and answers with the exit status and the last lines. The program then reads back what was made.

The smallest demo, `hello`, runs the whole chain once, and the recording beside this section shows it at a terminal. The X_eTaL program holds the launcher and the Blender script as two strings of Python, writes them to files, and runs the launcher. Blender starts in the background with its factory settings, the script lists the objects in its starting scene and writes them to a report, and the X_eTaL program reads that report back: `objects: Camera Cube Light`. Nothing is drawn; the point is that every link in the chain works.

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

## What it has made so far

<figure class="zoomable" style="float: left; clear: none; margin: 0.2em 1.5em 0.6em 0; max-width: 42%;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" poster="{{ '/assets/images/posts/xetal-blender-td-models-poster.webp' | relative_url }}" aria-label="A recording of the twelve tower-defense pieces built by X_eTaL in Blender, each shown in turn playing its named animation clips: idle, fire, walk and hit">
<source src="{{ '/assets/videos/xetal-blender-td-models.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/xetal-blender-td-models.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The twelve tower-defense pieces, each playing its clips: idle, then fire for towers, walk and hit for creeps. Click to enlarge.</figcaption>
</figure>

Since the first scene the library has grown into a small toolkit. Pieces are built from parts that hang from a pivot, so a turret turns about its own axis: boxes, cylinders, cones, spheres and tori from Blender's builders, plus shapes worked out in X_eTaL as arrays, an octahedron and a lathe. Parts can glow. And models can carry named animations, idle, walk, fire and hit, exported as clips inside a `.glb` file and checked by reading the file back.

The first real customer was another repo. The tower-defense game in [post #6](/2026/10/12/array-languages-xetal-games/) asked for 3D towers and creeps, and Blender made twelve of them with their animation clips, rendered and published on the [extensions site](https://softwarewrighter.github.io/X_eTaL-extensions/blender/td/). The recording beside this section is the `td-models` demo: each piece in turn, playing the clips it carries. A tower idles and then fires, its barrel kicking back or its crystal swelling; a creep idles, walks with its feet in pairs and its body bobbing, and flinches when hit. Every part and every keyframe came from X_eTaL arrays; Blender built and rendered them.

<figure class="zoomable" style="float: right; clear: none; margin: 0.2em 0 0.6em 1.5em; max-width: 30%;">
<img src="{{ '/assets/images/posts/xetal-blender-cannon-3-turn.webp' | relative_url }}" class="no-invert" alt="A four by four sheet of sixteen frames: the level-three cannon tower turning a full circle, 22.5 degrees a frame, on a transparent background">
<figcaption style="font-size: 0.85em;">The level-three cannon's turn sheet: sixteen frames, one picture. Click to enlarge.</figcaption>
</figure>

Since then it also makes each piece's fallback sheets for a page without WebGL: sixteen frames of the piece turning, and eight frames of it seen from the game's own isometric angle, each sheet one short Blender render joined into a single picture, listed with its checksum beside the models. The sheet beside this paragraph is the level-three cannon's turn sheet: read left to right and top to bottom, the turret comes round 22.5 degrees a frame on a transparent background, so a page can step through the frames as a flipbook when it cannot draw the model in 3D.

<div style="clear: both;"></div>

## The pipeline, in Blender

<!-- [VIDEO] The blender-pipeline video (extensions Saga 15 step 11, in progress): an X_eTaL program becoming its Python, Blender building the model part by part beside the lines that make each part, the .glb, the renders and the clips. -->

The video for this post is being made now, by the extension itself, from real artifacts: one of the tower-defense pieces as it is written in X_eTaL, the Python launcher and Blender script that program writes, Blender running it in the background, and the model built part by part, each part appearing beside the X_eTaL and Python lines that made it, through to the exported `.glb`, the renders, the sheets and the animations. It is 1080p, with captions in the scene and a cue sheet so it can be narrated later.

## Blender for the rest of the series

The same toolkit then turns to the other repos, to show their work rather than tell it. Each video is built from data those repos produce, read at pinned commits, so what is on screen is what the code did:

- **HEX1000 running,** from [post #8](/2026/10/14/array-languages-xetal-fpga/): `C0DE+BEEF=` arriving over the serial line bit by bit, the key matrix, the program counter hopping through a ROM page in its shift-register order, the accumulator, RAM and ALU, and the digits strobed out to a 3D calculator's display, all driven from the circuit simulation's trace. The render refuses to finish unless the display shows the evaluator's answer.
- **HEX1000 being built:** its X_eTaL step function, the generated Verilog, the netlist, and its 2,828 lookup tables and 791 flip-flops flown to their places on the Gowin die and routed, then the bitstream going into a modeled Tang Nano 9K.
- **The GPU being built,** from [post #7](/2026/10/13/array-languages-xetal-gpu/): a program lowered to the accelerator IR, the elementwise chain fused into one real OpenCL kernel, and the schedules for the M1 Max and the RTX 5060 Ti.
- **The GPU running:** arrays uploaded, over PCIe to the RTX and in place in the M1 Max's unified memory, work-groups spread across the compute units, a reduction folding in local memory, and the result read back and checked, timed by the GPU's own profiling.
- **A 60-second trailer** cut from them: one X_eTaL program, and three things it drives, a GPU, an FPGA and Blender.

They are made for this series first and perhaps a narrated YouTube video later. Blender is also good at things this post has not reached yet, physics among them, and those stay on the list. The pattern stays the same throughout: X_eTaL works out the arrays, writes the Python, and Blender does what it is best at.

</div>
