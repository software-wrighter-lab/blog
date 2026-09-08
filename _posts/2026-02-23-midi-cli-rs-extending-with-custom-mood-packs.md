---
layout: post
title: "midi-cli-rs: Extending with Custom Mood Packs"
date: 2026-02-23 14:00:00 -0800
categories: [tools, rust, ai-agents, vibe-coding]
tags: [rust, midi, music, ai-agents, cli, plugins, extensibility, vibe-coding, personal-software]
keywords: "MIDI, music, sound, audio, music generation, plugins, mood packs, TOML, extensibility, Rust, CLI, custom moods, synthwave, chillout, electronic, generative music"
author: Software Wrighter
abstract: "Personal Software grows. midi-cli-rs now supports custom mood packs---TOML files that extend built-in moods with your own musical variations. No Rust required. Define tempo, key, intensity, and let the generators handle the rest."
video_url: "https://www.youtube.com/watch?v=f13s4K60mV8"
video_title: "Drop-in Mood Packs: No Code Required"
repo_url: "https://github.com/softwarewrighter/midi-cli-rs"
series: "Personal Software"
series_part: 3
---

<img src="{{ '/assets/images/posts/block-galaxy.webp' | relative_url }}" class="post-marker" alt="">

Personal Software doesn't stop at "it works." It evolves. After building midi-cli-rs for AI agents to generate music, I wanted more moods---without recompiling Rust every time.

The solution: a plugin system that lets anyone create custom mood packs using simple TOML files.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Examples** | [Listen to Samples](https://softwarewrighter.github.io/midi-cli-rs/) |
| **Wiki** | [Plugin Documentation](https://github.com/softwarewrighter/midi-cli-rs/wiki/Plugins-and-Extensibility) |
| **Video** | [Plugin Moods Explainer](https://www.youtube.com/watch?v=f13s4K60mV8)<br>[![Video](https://img.youtube.com/vi/f13s4K60mV8/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=f13s4K60mV8) |
| **Code** | [midi-cli-rs](https://github.com/softwarewrighter/midi-cli-rs) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem with Built-in Only

The original midi-cli-rs shipped with a handful of mood presets: suspense, eerie, upbeat, calm, ambient, jazz. Useful, but limited. What if you want synthwave? Chillout? Something faster or in a different key?

Hardcoding every possible mood isn't practical. And asking users to modify Rust source code isn't friendly.

## Three Levels of Extensibility

| | Level | What You Get | What You Change | Skill Required |
|:---:|-------|--------------|-----------------|----------------|
| <span style="color:green">✓</span> | **Built-in Moods** | 9 curated generators | Nothing---use as-is | None |
| <span style="color:green">✓</span> | **Plugin Moods** | Parameter variations | TOML config files | Text editing |
| <span style="color:red">✗</span> | **Custom Generators** | New musical patterns | Rust source code | Programming (future) |

This post covers **Plugin Moods**---the middle tier. You can preset combinations of tempo, key, and intensity, but you're still using the built-in generators' musical logic. Want a "smooth-jazz" preset (slower, mellower)? Plugin mood. Want bebop or Latin jazz with different chord progressions? That requires a custom generator.

Custom generators (writing new Rust code) will be covered in a future post when the plugin editor ships.

## The Plugin Architecture

Custom moods live in `~/.midi-cli-rs/moods/` as TOML files. Each file is a "mood pack" that can define multiple moods. The CLI discovers them automatically.

Here's how it works:

```
~/.midi-cli-rs/
└── moods/
    ├── electronic.toml    # Your synthwave, techno, etc.
    ├── cinematic.toml     # Epic, tension, wonder
    └── seasonal.toml      # Holiday themes
```

## Creating a Mood Pack

A plug-in mood pack has two parts: pack metadata and mood definitions.

```toml
[pack]
name = "electronic"
version = "1.0.0"
author = "Your Name"
description = "Electronic music styles"

[[moods]]
name = "synthwave"
base_mood = "upbeat"
default_tempo = 118
default_key = "Am"
default_intensity = 65
description = "80s synthwave vibes"
tags = ["electronic", "retro"]

[[moods]]
name = "chillout"
base_mood = "ambient"
default_tempo = 85
default_key = "Em"
default_intensity = 40
description = "Relaxed electronic"
```

Each mood **delegates** to a built-in generator (`base_mood`) but overrides specific parameters. You get the musical logic of the built-in mood with your customizations applied.

## Available Base Moods

Your custom moods can extend any of the nine built-in generators:

| Base Mood | Character |
|-----------|-----------|
| `suspense` | Tense, building |
| `eerie` | Dark, unsettling |
| `upbeat` | Energetic, positive |
| `calm` | Peaceful, slow |
| `ambient` | Atmospheric, textural |
| `jazz` | Swing, improvisation |
| `chiptune` | 8-bit, retro gaming |
| `orchestral` | Classical instruments |
| `show` | Broadway, theatrical |

## Configuration Options

Each mood definition supports these overrides:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | CLI name (required) | `"synthwave"` |
| `base_mood` | Built-in to extend (required) | `"upbeat"` |
| `default_tempo` | BPM | `118` |
| `default_key` | Musical key | `"Am"`, `"C"`, `"Eb"` |
| `default_intensity` | 0-100 energy level | `65` |
| `description` | Human-readable description | `"80s vibes"` |
| `tags` | Discovery tags | `["electronic", "retro"]` |

## How Seeds Create Variation

Seeds aren't random---they're deterministic variation selectors. The same mood + same seed always produces identical output. But different seeds create observable musical differences across multiple dimensions:

| Parameter | Variation Range |
|-----------|-----------------|
| Tempo | ±15% from base |
| Layer inclusion | Which instruments appear |
| Melodic contour | 16 different phrase shapes |
| Note density | 0.6x to 1.4x |
| Rest probability | 0% to 35% silence |
| Phrase length | 3-8 notes |
| Velocity | -15 to +15 offset |

The system uses hash-based mixing with unique salts for each parameter. This means adjacent seeds (42 vs 43) produce completely different outputs---no gradual transitions between seeds.

When you combine plugin moods with seed variation, you get a matrix: your custom tempo/key/intensity settings applied across different seed-driven variations of the underlying generator's patterns.

## Using Custom Moods

Once your TOML file is in place, the mood appears automatically:

```bash
# List all moods (built-in + plugins)
midi-cli-rs moods

# Generate with your custom mood
midi-cli-rs preset -m synthwave -d 5 -s 42 -o output.wav
```

The seed system still works---same mood + same seed = identical output.

## Example: Electronic Pack

Here's a complete pack with four electronic moods:

```toml
[pack]
name = "electronic"
version = "1.0.0"
description = "Electronic music styles"

[[moods]]
name = "synthwave"
base_mood = "upbeat"
default_tempo = 118
default_key = "Am"
default_intensity = 65

[[moods]]
name = "chillout"
base_mood = "ambient"
default_tempo = 85
default_key = "Em"
default_intensity = 40

[[moods]]
name = "techno"
base_mood = "upbeat"
default_tempo = 130
default_key = "Dm"
default_intensity = 85

[[moods]]
name = "8bit"
base_mood = "chiptune"
default_tempo = 140
default_key = "C"
default_intensity = 70
```

Drop this in `~/.midi-cli-rs/moods/electronic.toml` and you have four new moods.

## What's Next

This plugin system handles **mood variations**---different tempos, keys, and intensities applied to existing generators. A future update will add a **plugin editor** for creating entirely new musical patterns without writing Rust.

For now, the delegation model covers most use cases: want faster jazz? Darker ambient? Major-key suspense? Create a TOML file and you're done.

## The Personal Software Pattern

This follows the Personal Software philosophy: start with something that works, then extend it as needs emerge. The plugin system wasn't in the original design. It grew from actual use---wanting more moods without recompiling.

Good personal software leaves room to grow.

---

> **Disclaimer**
>
> You are responsible for how you use generated audio. Ensure you have the appropriate rights and permissions for any commercial or public use. This tool generates MIDI data algorithmically---how you render and distribute the final audio is your responsibility.
>
> Be aware that algorithmic composition can inadvertently produce sequences similar to existing copyrighted works. Whether you use this tool, AI generation, or compose by hand, you must verify that your output doesn't infringe on existing copyrights before public release or commercial use. Protect yourself legally.
