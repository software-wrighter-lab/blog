---
layout: post
title: "midi-cli-rs: Music Generation for AI Coding Agents"
date: 2026-02-20 00:00:00 -0800
categories: [tools, rust, ai-agents, vibe-coding]
tags: [rust, midi, music, ai-agents, cli, fluidsynth, vibe-coding, claude-code, personal-software]
keywords: "MIDI, music, sound, audio, music generation, AI agents, Rust, CLI, FluidSynth, mood presets, vibe coding, suspense, jazz, ambient, SoundFont, WAV"
author: Software Wrighter
abstract: "Personal Software via Vibe Coding: a music tool for AI agents. midi-cli-rs provides mood presets (suspense, upbeat, calm, jazz) so agents can generate complete audio compositions from simple commands. No music theory required."
video_url: "https://youtu.be/nDNcbKE8KtE"
video_title: "Music tool for AI Agents, Built in Rust"
repo_url: "https://github.com/softwarewrighter/midi-cli-rs"
series: "Personal Software"
series_part: 2
---

<img src="{{ '/assets/images/posts/block-notes.webp' | relative_url }}" class="post-marker" alt="">

AI coding agents can write code, generate images, and produce text. But what about music? When I needed background audio for explainer videos, I wanted a tool that AI agents could use directly---no music theory required.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [midi-cli-rs Explainer](https://youtu.be/nDNcbKE8KtE)<br>[![Video](https://img.youtube.com/vi/nDNcbKE8KtE/mqdefault.jpg){: .video-thumb}](https://youtu.be/nDNcbKE8KtE) |
| **Examples** | [Listen to Samples](https://softwarewrighter.github.io/midi-cli-rs/) |
| **Code** | [midi-cli-rs](https://github.com/softwarewrighter/midi-cli-rs) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem

Generating music programmatically is hard. Traditional approaches require understanding music theory, MIDI specifications, instrument mappings, and audio synthesis. That's a lot to ask of an AI agent that just needs a 5-second intro.

I wanted something simpler: a CLI tool where an agent could say "give me 5 seconds of suspenseful music" and get a usable WAV file.

## The Solution: Mood Presets

midi-cli-rs solves this with **mood presets**---curated musical generators that produce complete compositions from a single command:

```bash
# Generate a 5-second suspenseful intro
midi-cli-rs preset --mood suspense --duration 5 -o intro.wav

# Upbeat outro with specific key
midi-cli-rs preset -m upbeat -d 7 --key C --seed 42 -o outro.wav
```

Six moods are available:

| Mood | Character |
|------|-----------|
| `suspense` | Low drones, tremolo strings, tension |
| `eerie` | Sparse tones, diminished harmony |
| `upbeat` | Rhythmic chords, energetic |
| `calm` | Warm pads, gentle arpeggios |
| `ambient` | Textural drones, pentatonic bells |
| `jazz` | Walking bass, brushed drums, piano trio |

Each mood generates multi-layer compositions with appropriate instruments, rhythms, and harmonies. The `--seed` parameter ensures reproducibility---same seed, same output. Different seeds produce meaningful variations in melody contour, rhythm patterns, and instrument choices.

## Melodic Variation

The presets don't just randomize notes---they use a **contour-based variation system**. Changing the seed produces melodies that follow different shapes (ascending, descending, arch, wave) while staying musically coherent. This means you can generate multiple versions of a mood and pick the one that fits best.

## How It Works

The tool generates MIDI programmatically, then renders to WAV using FluidSynth:

```
Mood Preset → MIDI Generation → FluidSynth → WAV Output
```

**MIDI generation** uses the `midly` crate to create standard MIDI files. Each preset generates multiple tracks with different instruments, note patterns, and dynamics.

**Audio rendering** calls FluidSynth as a subprocess with a SoundFont (instrument samples). This avoids LGPL licensing complications---subprocess execution doesn't trigger copyleft.

## Note-Level Control

When presets aren't enough, you can specify exact notes:

```bash
# Note format: PITCH:DURATION:VELOCITY[@OFFSET]
midi-cli-rs generate \
    --notes "C4:0.5:80@0,E4:0.5:80@0.5,G4:0.5:80@1,C5:1:90@1.5" \
    -i piano -t 120 -o arpeggio.wav
```

Or use JSON for complex multi-track arrangements:

```bash
echo '{"tempo":90,"instrument":"piano","notes":[
  {"pitch":"C4","duration":0.5,"velocity":80,"offset":0},
  {"pitch":"E4","duration":0.5,"velocity":80,"offset":0.5},
  {"pitch":"G4","duration":1,"velocity":90,"offset":1}
]}' | midi-cli-rs generate --json -o output.wav
```

## Web UI

For interactive composition, there's a browser-based interface:

```bash
midi-cli-rs serve  # Starts on http://127.0.0.1:3105
```

The **Presets tab** lets you adjust mood, key, duration, intensity, and tempo with immediate audio preview. Click the clock button to generate a time-based seed for unique but reproducible results.

The **Melodies tab** provides note-by-note composition with keyboard shortcuts:
- `a-g` for note pitch
- `[` / `]` to adjust duration
- `+` / `-` to change octave
- `Tab` to navigate between notes

## For AI Agents

The CLI is designed for AI agent usage:

1. **Simple commands**: One line generates complete audio
2. **Reproducible**: Seed values ensure consistent output
3. **Self-documenting**: `--help` includes agent-specific instructions
4. **Composable**: Generate tracks separately, combine with ffmpeg

```bash
# AI agent workflow
midi-cli-rs preset -m suspense -d 5 --seed 1 -o intro.wav
midi-cli-rs preset -m upbeat -d 10 --seed 2 -o main.wav
ffmpeg -i intro.wav -i main.wav -filter_complex concat=n=2:v=0:a=1 final.wav
```

## SoundFont Quality Matters

The quality of generated audio depends heavily on the SoundFont used. SoundFonts are collections of audio samples for each instrument---a tiny SoundFont with compressed samples will sound thin and artificial, while a larger one with high-quality recordings produces professional results.

| SoundFont | Size | Quality | License |
|-----------|------|---------|---------|
| TimGM6mb | ~6MB | Basic | GPL v2 |
| GeneralUser GS | ~30MB | Good | Permissive |
| FluidR3_GM | ~140MB | Very Good | MIT |
| MuseScore_General | ~200MB | Excellent | MIT |

For anything beyond quick prototypes, use a quality SoundFont. The difference is dramatic---the same MIDI file can sound like a toy keyboard or a real instrument depending on the samples.

The tool auto-detects SoundFonts in common locations (`~/.soundfonts/`, `/opt/homebrew/share/soundfonts/`, etc.), or specify one explicitly with `--soundfont`.

## Technical Details

Built with Rust 2024 edition using permissively licensed dependencies:

| Crate | Purpose |
|-------|---------|
| midly | MIDI file generation |
| clap | CLI argument parsing |
| serde | JSON serialization |
| rand | Randomization for presets |
| axum | Web server (for `serve` command) |

FluidSynth is called as a subprocess for WAV rendering, keeping the main codebase MIT-licensed.

## Try It

Listen to [sample outputs](https://softwarewrighter.github.io/midi-cli-rs/), or build locally:

```bash
git clone https://github.com/softwarewrighter/midi-cli-rs.git
cd midi-cli-rs
cargo build --release
./target/release/midi-cli-rs preset -m jazz -d 5 -o jazz.wav
```

Requires FluidSynth for WAV output (`brew install fluid-synth` on macOS).

---

> **Disclaimer**
>
> You are responsible for how you use generated audio. Ensure you have the appropriate rights and permissions for any commercial or public use. This tool generates MIDI data algorithmically---how you render and distribute the final audio is your responsibility.
>
> Be aware that algorithmic composition can inadvertently produce sequences similar to existing copyrighted works. Whether you use this tool, AI generation, or compose by hand, you must verify that your output doesn't infringe on existing copyrights before public release or commercial use. Protect yourself legally.

