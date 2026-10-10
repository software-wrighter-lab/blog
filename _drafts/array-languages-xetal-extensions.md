---
layout: post
title: "Array Languages #4: X_eTaL-extensions, Extending the Machine"
categories: [languages, language-design, tools, graphics]
tags: [array-languages, xetal, x-etal, apl, extensions, ffi, c-abi, rust, native-code, sqlite, audio, 3d-graphics, voxels, web-server, http, image-processing, linear-algebra]
keywords: "X_eTaL extensions, native extensions, C ABI descriptor, Rust shared library, typed facade, binding macro, Ffi.xtlm, xetal-x bridge host, SQLite, data notebook, audio synthesizer, oscilloscope, native window, 3D scene, voxels, web server, TodoMVC, HTTP fetch, earthquakes, photo lab, SVD, SHA-256, extension ABI V1"
abstract: "Fourth in the Array Languages series: X_eTaL-extensions, the third meaning of Extensible. Eleven small Rust libraries give X_eTaL programs what the interpreter should not reinvent: a database, sound, windows and 3D, a web server and HTTP, image files, fast linear algebra, a clock and hashing. Each sits behind a typed X_eTaL facade written one line per function by a macro, so a program never sees the plumbing. Here are the boundary, what it costs, and twelve demos, from a CO2 data notebook and a synthesizer to an earthquake report and a voxel world."
series: "Array Languages"
series_part: 4
date: 2026-10-10 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-extensions/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
---

<img src="{{ '/assets/images/posts/block-ffi.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<!-- DRAFT for review (2026-10-10), refreshed from X_eTaL-extensions at 811fb99 (the voxel saga done 2026-10-09).
     Check before publishing: the native hook (ask E1) is still filed, not built; regex is still roadmap. -->

<div style="overflow: hidden;" markdown="1">

Libraries extend the vocabulary and macros extend the language. This is the third layer, where native code extends the machine. The rule the repo sets for itself: application code sees a typed X_eTaL facade, never FFI plumbing. A program doesn't know whether a function is X_eTaL, Rust or C underneath.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions) --- eleven extensions, the ABI, the loader, the facades |
| **The demos** | [the demos, recorded](https://softwarewrighter.github.io/X_eTaL-extensions/) --- each with how to run it yourself |
| **Reference** | [the docs](https://softwarewrighter.github.io/X_eTaL-extensions/doc/) --- every facade, shared library and demo, cross-referenced with its types |
| **Prior post** | [Array Languages #3: X_eTaL-libraries](/2026/10/09/array-languages-xetal-libraries/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The boundary

An extension is a small Rust shared library. It exports one C-ABI descriptor: its name, its version, and a table of typed functions. A loader validates the descriptor and calls the functions, and an error or a panic inside one comes back as an error, not a crash. On the X_eTaL side, a facade library gives each native function an X_eTaL name and type. Writing an extension is plain Rust, with the boundary generated:

```rust
use xetal_ext_sdk::{OwnedError, Value, text};

fn shout(args: &[Value]) -> Result<Value, OwnedError> {
    Ok(Value::Text(text(&args[0])?.to_uppercase()))
}

xetal_ext_sdk::xetal_extension! {
    name: "hello",
    version: env!("CARGO_PKG_VERSION"),
    functions: {
        shout: 1, "Char -> Char", "The text in upper case.";
    }
}
```

The facade is where the three meanings of *Extensible* meet. Every facade function is one line, a call to a binding macro, `Ffi.xtlm`, that writes the function from its signature. The macros of [the previous post](/2026/10/09/array-languages-xetal-libraries/) write the plumbing for the native code of this one:

```text
"ffi:" u̲se< "Ffi"
"s_hout : text -> text"        ᶠᶠⁱb̲ind< "hello/shout"
"s_um : float -> float"        ᶠᶠⁱb̲ind< "hello/sum"
```

and a program imports the facade like any library:

```text
"hx:" u̲se< "Hello"
ʰˣs̲hout "x_etal"                       ⍝ X_ETAL, upper-cased in Rust
ʰˣs̲um (r̲ange 10) '× t̲able r̲ange 10    ⍝ 3025.0: a 10 by 10 array, summed in Rust
```

X_eTaL can't call native code by itself yet. That hook is filed with the language and planned there, so for now these programs run under a bridge host, `xetal-x`: X_eTaL's own command line, every subcommand the same, plus extensions. Arguments and results cross as text. When the hook lands, the facades change and the programs don't.

Crossing as text has a cost, and the clock extension measures it. On a laptop the bridge makes about 220,000 calls a second and carries about 2.6 million numbers a second out and back. A sum of 100,000 numbers takes about as long in X_eTaL as it does in Rust over the bridge, because most of the time goes to formatting the numbers as text. So the bridge pays off for work that is heavy per element, such as an SVD, an image codec or a database query, and not for a sum.

</div>

<div class="clearfix" markdown="1">

## Eleven extensions, by what they reach

Release 1 was Hello, Clock and SQLite. There are now eleven, and between them they reach most of what a program needs from outside an interpreter:

| Area | Extension | What it gives X_eTaL | Built on |
|---|---|---|---|
| database | SQLite | execute and query SQLite files; import CSV | rusqlite |
| audio | Audio | decode Ogg Vorbis, MP3 and WAV; play files or arrays; read what plays as arrays | symphonia, cpal |
| graphics | Canvas | a native window that shows arrays as pixels and sends keys and clicks back | winit, softbuffer |
| 3D | Scene | lines, points and shaded quads in a native window, a camera, a depth buffer, fog, light | winit, softbuffer |
| networking | Web | an HTTP server on loopback: the program takes each request and replies | axum, tokio |
| networking | HTTP | bounded downloads, with limits on size, time and redirects | ureq |
| images | Image | PNG and JPEG to and from arrays; resizing | image |
| math | Linalg | solve, inverse, determinant, least squares, eigenvalues, SVD | nalgebra |
| system | Clock | wall-clock and monotonic time | std |
| system | Digest | SHA-256 and CRC-32 of text and files | sha2, crc32fast |
| proof | Hello | the smallest working boundary | --- |

Each one has its facade, its Rust tests and golden tests of every facade function, demo and error message. The 3D renderer is a CPU rasterizer written in Rust, drawing into a native window, with no GPU API. Regular expressions are the one extension still on the roadmap.

</div>

<div class="clearfix" markdown="1">

## The demos

The pattern in the demos is the same each time: the extension does what it is for, and X_eTaL does the arithmetic on whole arrays. Twelve of them are below, and each tile links to its recording and how to run it.

<style>
.ext-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 1em 0 1.4em; }
.ext-grid a { display: block; text-decoration: none; }
.ext-grid img { display: block; width: 100%; height: auto; border-radius: 4px; }
.ext-grid span { display: block; text-align: center; font-size: 0.85em; margin-top: 0.3em; }
@media (max-width: 600px) { .ext-grid { grid-template-columns: repeat(2, 1fr); } }
</style>

<div class="ext-grid">
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#sqlite-notebook"><img src="{{ '/assets/images/posts/xetal-ext-sqlite-notebook.webp' | relative_url }}" class="no-invert" alt="The data notebook: CO2 at Mauna Loa in SQLite, the yearly rise and a least-squares line computed in X_eTaL"><span>data notebook</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#web-life"><img src="{{ '/assets/images/posts/xetal-ext-web-life.webp' | relative_url }}" class="no-invert" alt="Conway's Life in a browser page, stepped by the X_eTaL program once per request"><span>Life on the web</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#web-todomvc"><img src="{{ '/assets/images/posts/xetal-ext-web-todomvc.webp' | relative_url }}" class="no-invert" alt="TodoMVC served by an X_eTaL program, its items kept in SQLite"><span>TodoMVC</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#image-photo-lab"><img src="{{ '/assets/images/posts/xetal-ext-image-photo-lab.webp' | relative_url }}" class="no-invert" alt="A photo of Buzz Aldrin on the Moon rebuilt from its SVD at three ranks"><span>photo lab</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#http-quakes"><img src="{{ '/assets/images/posts/xetal-ext-http-quakes.webp' | relative_url }}" class="no-invert" alt="The earthquake report at the command line: the USGS feed checked, grouped and analyzed"><span>earthquakes</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#audio-spectrum"><img src="{{ '/assets/images/posts/xetal-ext-audio-spectrum.webp' | relative_url }}" class="no-invert" alt="The music visualizer: spokes in a 3D window following the music"><span>visualizer</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#audio-synth"><img src="{{ '/assets/images/posts/xetal-ext-audio-synth.webp' | relative_url }}" class="no-invert" alt="The synthesizer's eight bars as a spectrogram"><span>synthesizer</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#audio-scope"><img src="{{ '/assets/images/posts/xetal-ext-audio-scope.webp' | relative_url }}" class="no-invert" alt="The oscilloscope: left and right waveforms under the playhead"><span>oscilloscope</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#canvas-life"><img src="{{ '/assets/images/posts/xetal-ext-canvas-life.webp' | relative_url }}" class="no-invert" alt="Life drawn as pixels in a native window"><span>Life in a window</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#scene-voxels-light"><img src="{{ '/assets/images/posts/xetal-ext-scene-voxels-light.webp' | relative_url }}" class="no-invert" alt="A voxel world at night, lit by lamps"><span>voxel light</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#scene-voxels-game"><img src="{{ '/assets/images/posts/xetal-ext-scene-voxels-game.webp' | relative_url }}" class="no-invert" alt="Gem Hunt: the voxel world with the gem count, the time and the distance to the nearest gem across the top"><span>Gem Hunt</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-extensions/#scene-voxels-rubik-solve"><img src="{{ '/assets/images/posts/xetal-ext-scene-voxels-rubik-solve.webp' | relative_url }}" class="no-invert" alt="The voxel Rubik's cube partway through a 152-move solution, with its turn and control buttons"><span>cube solver</span></a>
</div>

- **Database: the data notebook.** The Mauna Loa CO2 record goes into SQLite as a CSV. SQL selects and groups, and X_eTaL computes the yearly rise, a least-squares line and its residuals, and a histogram:

  ```text
  "sq:" u̲se< "Sqlite"
  db sq:i̲mport "co2=demos/data/co2-mlo-annual.csv"
  m ← db sq:n̲ums "select year, mean from co2 order by year"
  c ← 2 s̲elect₂ m
  d ← (1 d̲rop c) − -1 d̲rop c
  ```

- **Networking: X_eTaL on the web.** One page is Life, stepped by the X_eTaL program once per request and drawn as SVG. Another is TodoMVC with plain HTML forms, its items kept in SQLite, the filter turned into SQL and the page written by X_eTaL.
- **Networking: an earthquake report.** A week of the USGS earthquake feed is checked against its SHA-256 and loaded into SQLite. X_eTaL computes the Gutenberg-Richter b-value, 1.16 from the 114 quakes of magnitude 4.5 and up, and draws a world map of where they were. A twin of the demo reads the live feed.
- **Images and math: the photo lab.** A photo of Buzz Aldrin on the Moon is an array. Blur, sharpen and edges are rotations of it summed, the idiom of Life again. Sepia toning is one inner product with a 3 by 3 matrix. The SVD rebuilds it from its largest 5, 20 and 50 parts, keeping 94%, 98% and 99% of its energy.
- **Audio: a visualizer, a synthesizer and an oscilloscope.** The visualizer reads the samples under the playhead and turns them into a spectrum with one inner product each against cosine and sine tables. The synthesizer runs it the other way: X_eTaL computes every sample of eight bars of music, chords as a table of sines, and the extension plays each bar while the next is made. The oscilloscope draws the waveform as it plays, triggered like a real scope.
- **Graphics: Life in a window.** The first window demo, arrays shown as pixels.
- **3D: the voxel world and the cube.** A world of blocks you can walk, fly, dig, flood and light, and a game, Gem Hunt, on top. They have [a post of their own](/2026/10/09/voxels-3d-worlds-array-languages/). So does the voxel Rubik's cube, which the [Eigencube](/2026/10/08/eigencube-rubiks-cube-linear-algebra/) solver now drives.

</div>

<div class="clearfix" markdown="1">

## Why the types make this safe

The static types are not a safety feature bolted onto APL. Array-language terseness packs assumptions about rank, element type and arity into a short expression. Inference lets the program stay terse while the compiler answers the question *can these pieces actually compose?* --- without annotations on every line. At this boundary the types do one more job. Each native function's X_eTaL type is written once, in its facade line, so the type checker sees a call to Rust the same way it sees a call to X_eTaL, and the golden tests pin every facade's types. The same types keep the rest of the extensibility from turning chaotic: libraries compose through them, and macro expansions are checked by them.

## Next in the series

A planned post covers where the machine learning is: the ML demos and their own repo.

</div>
