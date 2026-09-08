---
layout: post
title: "music-pipe-rs: Unix Pipelines for MIDI Composition"
date: 2026-02-24 00:00:00 -0800
categories: [tools, rust, ai-agents, vibe-coding]
tags: [rust, midi, music, ai-agents, cli, unix-pipes, vibe-coding, personal-software]
keywords: "MIDI, music, sound, audio, music generation, Unix pipes, composable tools, Rust, CLI, generative music, algorithmic composition, Euclidean rhythm, motif, scale, humanize, DAW"
author: Software Wrighter
abstract: "Personal Software continues. music-pipe-rs takes the Unix philosophy to MIDI composition---small tools connected by pipes. Start with a seed, generate motifs, transform, visualize, convert to MIDI. Deterministic output from a single seed at the pipeline head."
repo_url: "https://github.com/softwarewrighter/music-pipe-rs"
series: "Personal Software"
series_part: 4
---

<img src="{{ '/assets/images/posts/block-ship.webp' | relative_url }}" class="post-marker" alt="">

After building midi-cli-rs for quick mood-based generation, I wanted something more surgical. What if music generation worked like Unix commands---small tools connected by pipes?

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [music-pipe-rs](https://github.com/softwarewrighter/music-pipe-rs) |
| **Related** | [midi-cli-rs](/2026/02/20/midi-cli-rs-music-for-ai-agents/) |
| **Next** | [Web Demo and Multi-Instrument](/2026/02/28/music-pipe-rs-unix-composition/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Unix Philosophy for Music

Most generative music tools are monolithic. You get one application with a closed workflow. If you want to inspect intermediate results, you can't. If you want to swap one transformation for another, you rebuild everything.

Unix solved this decades ago: small tools that do one thing well, connected by pipes. Each tool reads from stdin, writes to stdout. You can inspect any point in the pipeline with `head`, filter with `grep`, transform with `jq`.

music-pipe-rs applies this philosophy to MIDI composition.

## A Pipeline in Action

```bash
seed 12345 | motif --notes 16 --bpm 120 | humanize | to-midi --out melody.mid
```

Four stages:
1. **seed** establishes the random seed for the entire pipeline
2. **motif** generates a melodic pattern (using the pipeline seed)
3. **humanize** adds timing and velocity variation (using the same seed)
4. **to-midi** converts the event stream to a standard .mid file

The output plays in any DAW.

## Seed-First Architecture

The `seed` stage goes at the head of the pipeline:

```bash
# Explicit seed for reproducibility
seed 12345 | motif --notes 16 | humanize | to-midi --out melody.mid

# Auto-generated seed (printed to stderr)
seed | motif --notes 16 | humanize | to-midi --out melody.mid
# stderr: seed: 1708732845
```

All downstream stages read the seed from the event stream. No `--seed` arguments scattered across the pipeline. One seed, set once, used everywhere.

This means:
- **Same seed = identical output** across all random stages
- **Different seed = different composition** with same structure
- **Reproducibility is trivial**: just save the seed number

## JSONL: The Intermediate Format

Between stages, events flow as JSONL (JSON Lines). Each line is a complete event:

```json
{"type":"Seed","seed":12345}
{"type":"NoteOn","t":0,"ch":0,"key":60,"vel":80}
{"type":"NoteOff","t":480,"ch":0,"key":60}
```

This format is human-readable and tool-friendly:

```bash
# See the first 10 events
seed 42 | motif --notes 8 | head -10

# Count how many NoteOn events
seed 42 | motif --notes 16 | grep NoteOn | wc -l

# Pretty-print with jq
seed 42 | motif --notes 4 | jq .
```

No binary formats to decode. No proprietary protocols. Just text.

## Visualization with viz

The `viz` stage prints a sparkline to stderr while passing events through:

```bash
seed 12345 | motif --notes 16 | viz | humanize | to-midi --out melody.mid
```

Output on stderr:
```
▃▅▇▅▃▁▂▄▆▇▆▄▂▁▃▅
```

For more detail, use piano roll mode:

```bash
seed 12345 | motif --notes 16 | viz --roll
```

```
 G6 │···█············│
F#6 │·····█··········│
 F6 │····█···········│
 G5 │·██·········█···│
 F5 │···········█····│
 E5 │·········██···█·│
 C5 │█·····███····█·█│
```

The visualization goes to stderr; the JSONL events continue to stdout. You can inspect the music without breaking the pipeline.

## Available Stages

| Stage | Type | Description |
|-------|------|-------------|
| `seed` | Start | Establish random seed for pipeline |
| `motif` | Generate | Create melodic patterns |
| `euclid` | Generate | Euclidean rhythm generation |
| `transpose` | Transform | Shift notes by semitones |
| `scale` | Transform | Constrain notes to a scale |
| `humanize` | Transform | Add timing/velocity variation |
| `viz` | Inspect | Print sparkline visualization |
| `to-midi` | Output | Convert to .mid file |

Each stage is a separate binary. Mix and match as needed.

## Euclidean Rhythms

The `euclid` stage generates Euclidean rhythms---mathematically optimal distributions of hits across steps:

```bash
# 3 hits distributed across 8 steps (Cuban tresillo)
seed | euclid --pulses 3 --steps 8 --note 36 | to-midi --out kick.mid

# 4-on-the-floor kick pattern
seed | euclid --pulses 4 --steps 16 --note 36 | to-midi --out four-floor.mid
```

These patterns appear in music worldwide because they "feel right"---the spacing is as even as possible.

## Scale Locking

The `scale` stage constrains notes to a musical scale:

```bash
seed 42 | motif --notes 16 | scale --root C --mode minor | to-midi --out c-minor.mid
```

No wrong notes. Every pitch fits the harmonic context.

## Layering Streams

Generate drum and melody separately, then combine:

```bash
{
    seed 100 | euclid --pulses 4 --steps 16 --note 36 --ch 9;
    seed 100 | motif --notes 16 | scale --root C --mode pentatonic;
} | to-midi --out layered.mid
```

Channel 9 is General MIDI drums. Same seed ensures coherence between parts. Both streams merge into a single MIDI file.

## Why Not Just Use midi-cli-rs?

Different tools for different needs:

| Tool | Strength | Use Case |
|------|----------|----------|
| **midi-cli-rs** | Quick mood presets | "Give me 5 seconds of jazz" |
| **music-pipe-rs** | Compositional control | "Generate a motif, constrain to scale, add swing" |

midi-cli-rs is high-level: pick a mood, get music. music-pipe-rs is low-level: build compositions from primitive operations.

Both are useful. Both work with AI coding agents.

## The Personal Software Pattern

This continues the theme: build small tools that compose well. Don't try to solve everything in one application. Let Unix handle orchestration.

The best part? Standard tools still work. `head`, `grep`, `jq`, `wc`---all participate in the pipeline. No special music knowledge required to inspect the data.

---

> **Disclaimer**
>
> You are responsible for how you use generated audio. Ensure you have the appropriate rights and permissions for any commercial or public use. This tool generates MIDI data algorithmically---how you render and distribute the final audio is your responsibility.
>
> Be aware that algorithmic composition can inadvertently produce sequences similar to existing copyrighted works. Whether you use this tool, AI generation, or compose by hand, you must verify that your output doesn't infringe on existing copyrights before public release or commercial use. Protect yourself legally.
