---
layout: post
title: "music-pipe-rs: Web Demo and Multi-Instrument Arrangements"
date: 2026-02-28 00:15:00 -0800
categories: [tools, rust, vibe-coding]
tags: [rust, midi, music, cli, unix-pipes, vibe-coding, personal-software, web-demo, garageband]
keywords: "music-pipe-rs, MIDI, music, sound, audio, generative music, algorithmic composition, Euclidean rhythm, Bach, Baroque, GarageBand, multi-instrument, web demo, seq command, Unix pipes, DAW"
author: Software Wrighter
abstract: "Continuing the music-pipe-rs story: a web demo with Bach and Baroque arrangements, the seq command for explicit note sequences, and GarageBand integration. Plus the generative music resources that inspired this project."
repo_url: "https://github.com/softwarewrighter/music-pipe-rs"
demo_url: "https://softwarewrighter.github.io/music-pipe-rs/"
video_url: "https://www.youtube.com/watch?v=obPamoOVS4s"
video_title: "Music Pipes: Unix Tools for Makers and AI Agents"
series: "Personal Software"
series_part: 5
---

<img src="{{ '/assets/images/posts/block-music-sheet.webp' | relative_url }}" class="post-marker" style="width: 240px;" alt="">

Since the [initial music-pipe-rs post](/2026/02/24/music-pipe-rs-unix-pipelines-for-midi/), the project has grown. There's now a web demo with playable examples, a new `seq` stage for explicit note sequences, and multi-instrument arrangements that work in GarageBand.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [YouTube](https://www.youtube.com/watch?v=obPamoOVS4s) |
| **Live Demo** | [music-pipe-rs Samples](https://softwarewrighter.github.io/music-pipe-rs/) |
| **Source** | [GitHub](https://github.com/softwarewrighter/music-pipe-rs) |
| **Previous** | [Unix Pipelines for MIDI](/2026/02/24/music-pipe-rs-unix-pipelines-for-midi/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Web Demo

The [live demo](https://softwarewrighter.github.io/music-pipe-rs/) showcases pre-built examples with playable audio:

| Tab | Style | Description |
|-----|-------|-------------|
| **Bach Toccata (Organ)** | Classical | Multi-voice church organ with octave doubling and pedal bass |
| **Bach Toccata (8-bit)** | Chiptune | Gyruss-inspired arcade version with square wave |
| **Bach-esque** | Algorithmic | Procedurally generated baroque-style background music |
| **Baroque Chamber** | Ensemble | Six-channel piece with strings, harpsichord, and recorder |

Each tab shows the pipeline script alongside playable audio. See exactly what commands produce each result.

## The seq Stage

The new `seq` stage allows explicit note sequences instead of algorithmic generation:

```bash
seed | seq "C4/4 D4/4 E4/4 F4/4 G4/2" | to-midi --out scale.mid
```

Notation: `NOTE/DURATION` where duration is in beats. Combine with other stages:

```bash
seed | seq "D5/4 C#5/8 R/4 B4/4" | transpose --semitones 5 | humanize | to-midi --out melody.mid
```

The `R` represents rests. This enables transcribing existing melodies or composing precise phrases.

## Multi-Instrument Arrangements

The Baroque chamber piece demonstrates six-channel composition:

```bash
{
    seed 42 | seq "..." --ch 0 --patch 48;  # Strings melody
    seed 42 | seq "..." --ch 1 --patch 6;   # Harpsichord
    seed 42 | seq "..." --ch 2 --patch 74;  # Recorder
    # ... additional voices
} | humanize | to-midi --out baroque.mid
```

Each instrument gets its own channel and General MIDI patch. The same seed ensures timing coherence across parts.

## GarageBand Integration

Import the MIDI files directly into GarageBand:

1. Generate arrangement: `./examples/trio-demo.sh`
2. Open GarageBand, create new project
3. Drag the `.mid` file into the workspace
4. GarageBand creates tracks for each channel
5. Assign software instruments to taste

The demo includes a jazz trio arrangement:
- **Piano**: Bluesy melody with chords and swing
- **Bass**: Walking bass line with acoustic bass patch
- **Drums**: Hi-hat, snare, kick with dynamic variation

All generated from pipeline scripts.

## Inspiration

This project was inspired by research into generative music tools and techniques:

<div class="references-section" markdown="1">

## References

| Topic | Link |
|-------|------|
| **Analog Synthesizers** | [Code Self Study](https://forum.codeselfstudy.com/t/analog-synthesizers/2511) |
| **Drum Synthesis** | [JavaScript Drum Synthesis](https://www.nickwritesablog.com/drum-synthesis-in-javascript/) |
| **Generative Music** | [Code Self Study](https://forum.codeselfstudy.com/t/generative-music/2512) |
| **Music Projects** | [Software and Hardware](https://forum.codeselfstudy.com/t/music-projects-software-and-hardware/2434) |
| **FOSS Music Tools** | [Open Source Music Production](https://forum.codeselfstudy.com/t/free-and-open-source-software-i-use-for-music-production/2694) |
| **Eurorack Programming** | [Patch.Init() Tutorial](https://forum.codeselfstudy.com/t/program-your-very-own-eurorack-module-with-patch-init/2869) |
| **Opusmodus** | [Algorithmic Composition in Lisp](https://opusmodus.com/) |


</div>

The key insight from Opusmodus: algorithmic composition isn't random music---it's programmable composition. Motif transformation, rule systems, deterministic generation. music-pipe-rs brings these ideas to Unix pipes.

## What's Next

The pipeline architecture makes extension natural:

- **More generators**: Markov chains, L-systems, cellular automata
- **More transforms**: Inversion, retrograde, quantization
- **Live mode**: Real-time MIDI output with clock sync

Each new capability is just another stage in the pipeline.

---

> **Disclaimer**
>
> You are responsible for how you use generated audio. Ensure you have the appropriate rights and permissions for any commercial or public use. This tool generates MIDI data algorithmically---how you render and distribute the final audio is your responsibility.
>
> Be aware that algorithmic composition can inadvertently produce sequences similar to existing copyrighted works. Whether you use this tool, AI generation, or compose by hand, you must verify that your output doesn't infringe on existing copyrights before public release or commercial use. Protect yourself legally.
