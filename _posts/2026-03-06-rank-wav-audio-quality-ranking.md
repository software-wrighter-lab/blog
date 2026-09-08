---
layout: post
title: "rank-wav: Ranking Audio Files by Acoustic Quality"
date: 2026-03-06 00:15:00 -0800
categories: [cli-tools, rust, audio]
tags: [rust, cli, audio, fft, signal-processing, wav]
keywords: "rank-wav, audio ranking, spectral analysis, WAV files, Rust CLI, FFT, acoustic features, sound quality"
author: Software Wrighter
abstract: "rank-wav is a Rust CLI that ranks WAV files by acoustic features like spectral centroid, bandwidth, and RMS energy. It computes 'pleasing' and 'best' scores to help you quickly triage audio samples, synthesis outputs, or sound design variants."
video_url: "https://www.youtube.com/watch?v=F8iP4JLzQ80"
video_title: "Find Your Best Sound Fast"
repo_url: "https://github.com/sw-music-tools/rank-wav-rs"
series: "Personal Software"
series_part: 6
---

<img src="{{ '/assets/images/posts/block-boombox.webp' | relative_url }}" class="post-marker" alt="">

You've generated 50 variations of a synthesized sound. Or you've downloaded a sample pack with hundreds of one-shots. Now what? Listening to each one is tedious. You need a way to rank them—fast.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [rank-wav Demo](https://www.youtube.com/watch?v=F8iP4JLzQ80)<br>[![Video](https://img.youtube.com/vi/F8iP4JLzQ80/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=F8iP4JLzQ80) |
| **Original Repo** | [sw-cli-tools/rank-wav-rs](https://github.com/sw-cli-tools/rank-wav-rs) |
| **Current Dev Repo** | [sw-music-tools/rank-wav-rs](https://github.com/sw-music-tools/rank-wav-rs) |
| **Motivation** | [Why I Built This](#motivation) |
| **Related** | [Music Generation Tools](#related-projects) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div style="clear: both;"></div>

## What is rank-wav?

rank-wav is a Rust CLI that scans directories for WAV files and ranks them by acoustic features correlated with perceived sound quality. It extracts features like RMS energy, spectral centroid, and bandwidth, then computes two scores:

- **Pleasing**: Favors warm, smooth sounds (low brightness, moderate energy)
- **Best**: Favors clear, present sounds (balanced spectrum, strong signal)

```bash
$ rank-wav ./samples --sort pleasing

+---+------------------------+--------+--------+----------+-----------+----------+--------+
| # | File                   | RMS    | ZCR    | Centroid | Bandwidth | Pleasing | Best   |
+---+------------------------+--------+--------+----------+-----------+----------+--------+
| 1 | motif-warm.wav         | 0.0271 | 0.0190 | 763      | 1079      | 0.812    | 0.641  |
| 2 | motif-balanced.wav     | 0.0647 | 0.0480 | 1502     | 1515      | 0.487    | 0.844  |
| 3 | motif-bright.wav       | 0.0361 | 0.0530 | 1782     | 1469      | 0.362    | 0.611  |
+---+------------------------+--------+--------+----------+-----------+----------+--------+
```

## The Features

### Basic Metrics

| Feature | What It Measures | Quality Correlation |
|---------|------------------|---------------------|
| **RMS** | Signal strength/loudness | Present vs weak |
| **ZCR** | Zero-crossing rate | Noisiness |
| **Centroid** | Spectral center of mass | Brightness |
| **Bandwidth** | Spectral spread | Complexity |

### Extended Metrics

With the `-e` flag, rank-wav also computes:

| Feature | What It Measures | Quality Correlation |
|---------|------------------|---------------------|
| **Rolloff** | Frequency below which 85% of energy lies | High-frequency content |
| **Flatness** | How noise-like vs tonal (0-1) | Tonal quality |
| **Crest** | Peak to RMS ratio (dB) | Dynamic range |

## How Scoring Works

### The "Pleasing" Score

The pleasing score favors sounds that are warm and easy to listen to:

- **Lower spectral centroid** (less harsh, less bright)
- **Lower spectral bandwidth** (less complex, more focused)
- **Lower zero-crossing rate** (less noisy)
- **Moderate RMS** (present but not aggressive)

This is useful for: background music, ambient sounds, relaxation audio.

### The "Best" Score

The best score favors sounds that are clear and impactful:

- **Strong RMS** (present, not weak)
- **Moderate spectral centroid** (balanced brightness)
- **Moderate bandwidth** (neither thin nor muddy)
- **Low zero-crossing rate** (clean signal)

This is useful for: sound design, music production, sample selection.

## Use Cases

### Procedural Audio Triage

You've generated 100 variations of a procedural sound. Instead of listening to all of them:

```bash
rank-wav ./generated -r --sort best | head -20
```

Listen to the top 20. If none work, adjust your synthesis parameters and try again.

### Sample Library Organization

A 500-sample library is overwhelming. Rank by pleasing score to find the smoothest, warmest options first:

```bash
rank-wav ./samples -r --sort pleasing --json > ranked.json
```

Then use the JSON to build a playlist of just the top tier.

### A/B Testing Synthesis Parameters

Compare two batches of outputs:

```bash
rank-wav ./batch-a -r --sort best
rank-wav ./batch-b -r --sort best
```

Which batch has higher average scores? That tells you which parameter set produces better results.

<div class="resource-box" markdown="1">

### Motivation {#motivation}

I am trying to automate video production and I want unique music intros/outros for most videos. I do not want to manually specify inputs to music generation or manually review the outputs to choose one. Instead I want an AI Agent to generate different audio wav files, based on an idea or description from me, and the AI Agent can pick the best ones for the preview I review before uploading.

</div>

## Technical Implementation

### Pure Rust

rank-wav uses only Rust crates with no C dependencies:

- **hound** for WAV parsing (8/16/24/32-bit int, 32-bit float)
- **rustfft** for FFT-based spectral analysis
- **clap** for CLI parsing
- **tabled** for formatted output

No system library dependencies—clone, build, and run.

### Windowed FFT

To compute spectral features, rank-wav:

1. Extracts the center segment of the audio (up to 16384 samples)
2. Applies a Hann window to reduce spectral leakage
3. Computes the FFT
4. Calculates centroid, bandwidth, rolloff, and flatness from the magnitude spectrum

### Batch Normalization

All features are normalized relative to the current batch. This means:

- Scores are meaningful within a comparison set
- No need for absolute calibration
- Rankings work regardless of overall loudness

The trade-off: scores from different runs aren't directly comparable.

## Installation

```bash
git clone https://github.com/sw-music-tools/rank-wav-rs
cd rank-wav-rs
cargo install --path .
```

The binary installs as `rank-wav`.

## Example Workflow

```bash
# Scan recursively, sort by best, output JSON
rank-wav ./my-samples -r -e --sort best --json > results.json

# Quick table of top pleasing sounds
rank-wav ./my-samples -r --sort pleasing

# Check a single directory (non-recursive)
rank-wav ./one-shots
```

## Why Not Just Listen?

You should still listen—but to the top candidates, not all of them. rank-wav is a filter that surfaces the most promising files based on acoustic characteristics. It's not a replacement for your ears; it's a tool to make your ears more productive.

## Related Projects

For generating the WAV files that rank-wav ranks:

| Project | Description |
|---------|-------------|
| [midi-cli-rs](https://github.com/softwarewrighter/midi-cli-rs) | CLI for MIDI file manipulation and synthesis |
| [music-pipe-rs](https://github.com/softwarewrighter/music-pipe-rs) | Pipeline for AI-driven music generation |

---

*When you have too many sounds to listen to, let the math do the first pass.*
