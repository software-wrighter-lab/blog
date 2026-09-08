---
layout: post
title: "Sharpen the Saw: Video Workflow Framework"
date: 2027-01-03 09:00:00 -0800
categories: [rust, tools, workflow, vibe-coding]
tags: [rust, video-production, workflow-automation, dag, sharpen-the-saw, personal-software, claude-code, comfyui, tts, flux, stable-video-diffusion]
keywords: "video workflow, Rust, DAG, automation, AI agents, workflow framework, video production, sharpen the saw, TTS, voice cloning, text-to-image, image-to-video, text-to-video, ComfyUI, FLUX, Stable Video Diffusion"
author: Software Wrighter
abstract: "A DAG-based workflow framework in Rust that orchestrates video production pipelines---TTS voice cloning, text-to-image, image-to-video, and procedural music---from YAML definitions, replacing fragile agent instructions with deterministic execution."
series: "Sharpen the Saw Sundays"
series_part: 99
repo_url: "https://github.com/softwarewrighter/video_workflow_rs"
---

<img src="/assets/images/posts/block-framework.png" class="post-marker" alt="">

Every Sunday I try to sharpen my tools---fix recurring friction, automate repetitive tasks, make future work go more smoothly. This week: a workflow framework that orchestrates a full media generation pipeline---text-to-image, TTS voice cloning, image-to-video, text-to-video, and procedural music---all from YAML definitions.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [video_workflow_rs](https://github.com/softwarewrighter/video_workflow_rs) |
| **Short** | Coming soon |
| **Explainer** | Coming soon |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem

I produce two kinds of videos regularly:
- **Shorts**: Portrait mode (1080x1920), under 3 minutes
- **Explainers**: Landscape mode (1920x1080), 1-30 minutes

Both share many steps: title stills, OBS clips, narration generation, intro/outro segments, background music, "like & subscribe" overlays. The process is complex enough that **AI agents routinely drift**:

- Forget steps documented minutes ago
- Hallucinate parameters
- Make the same mistakes repeatedly
- Guess when they should ask

Even with detailed documentation describing common errors and how to avoid them, the agents fail. The context window is too large, the instructions too diffuse, the tooling too permissive.

## The Solution: Workflows as Data

**video-workflow-rs** inverts control. Instead of giving an agent free rein with vague instructions, the framework:

1. **Defines workflows as YAML**---not remembered instructions
2. **Uses DAG-based scheduling**---explicit task dependencies, not sequential guessing
3. **Tracks artifacts**---outputs become inputs for downstream tasks
4. **Supports resume**---skip completed steps on re-run
5. **Integrates GPU services**---TTS, text-to-image, image-to-video, text-to-video
6. **Captures everything** in a manifest for provenance and debugging

## Quick Start

```bash
# Generate a YouTube Short (vertical 1080x1920, ~30 sec)
./scripts/demo-short.sh

# Generate an explainer video (landscape 1920x1080, ~32 sec)
./scripts/demo-explainer.sh
```

Each script runs a complete pipeline: script generation, TTS voice cloning, video assembly.

## GPU Services

The framework integrates with multiple GPU services running via ComfyUI and Gradio. All services share a single NVIDIA RTX 5060 Ti 16GB---run one at a time to avoid OOM.

| Service | Port | Model | Use Case | Time |
|---------|------|-------|----------|------|
| **FLUX** | 8570 | flux1-schnell-fp8 | Text → Image | ~12s |
| **SVD** | 8100 | svd_xt | Image → Video | ~70s (14 frames) |
| **Wan 2.2** | 6000 | wan2.2_ti2v_5B | Text → Video | ~13min (81 frames) |
| **VoxCPM** | 7860 | Voice cloning | Text → Speech | ~5s |

### Text-to-Image (FLUX)

Generate images directly from prompts via the `text_to_image` workflow step:

```yaml
- id: gen_background
  kind: text_to_image
  prompt: "A futuristic coding workspace, dark theme, neon accents"
  output_path: "work/images/background.png"
  orientation: "landscape"
```

Or use the client script directly:
```bash
python scripts/flux_client.py -p "prompt" -o image.png --orientation portrait
```

### Image-to-Video (SVD)

Animate still images using Stable Video Diffusion. Best for natural/organic motion---water, fire, clouds, foliage.

```bash
python scripts/svd_client.py -i image.jpg -o video.mp4 --motion 100 --frames 30
```

| Works Well | Avoid |
|------------|-------|
| Water, waves, ripples | Forward camera travel |
| Fire, smoke, candles | Architectural scenes |
| Foliage, grass, wind | Complex object physics |
| Clouds, sky, aurora | Action sequences |

### Text-to-Video (Wan 2.2)

Generate video directly from text prompts---no input image required:

```bash
python scripts/wan22_client.py -p "A serene forest at sunrise" -o video.mp4 --length 81
```

Output is 2x the latent resolution (landscape: 1664x960, portrait: 960x1664). Generation takes ~13 minutes for 5 seconds of video.

### TTS Voice Cloning (VoxCPM)

Clone a voice from a reference sample using the `tts_generate` workflow step:

```yaml
- id: tts_narration
  kind: tts_generate
  script_path: work/scripts/narration.txt
  output_path: work/audio/narration.wav
  reference_audio: /path/to/reference.wav
  reference_text: "Transcript of reference audio..."
```

### Music Generation (midi-cli-rs)

Generate incidental music for intros/outros with procedural MIDI synthesis:

```bash
midi-cli-rs preset --mood upbeat --duration 5 -o intro.wav
midi-cli-rs preset --mood calm --duration 5 -o outro.wav
midi-cli-rs preset --mood suspense --duration 5 -o dramatic.wav
```

| Mood | Description |
|------|-------------|
| upbeat | Energetic, rhythmic patterns |
| calm | Peaceful, sustained pads |
| suspense | Tense, low drones |
| ambient | Atmospheric, pentatonic |
| eerie | Creepy, sparse tones |

## Workflow Step Types

| Step | Purpose |
|------|---------|
| `ensure_dirs` | Create directories relative to workdir |
| `write_file` | Render template and write text |
| `llm_generate` | Call LLM with template, write output |
| `split_sections` | Extract sections from generated text |
| `run_command` | Execute shell command (allowlisted) |
| `tts_generate` | Voice clone via VoxCPM |
| `text_to_image` | Generate image via FLUX |

Commands are guarded by an allowlist---no accidental `rm -rf` disasters.

## Architecture: Three Components

```
video_workflow_rs/
├── components/
│   ├── vwf-foundation/   # Layer 0: Types, Runtime, DAG, Queue
│   ├── vwf-engine/       # Layer 1-4: Config, Render, Steps, Core
│   └── vwf-apps/         # Layer 5: CLI, Web UI
├── test-projects/
│   ├── sample-short/     # YouTube Short demo
│   └── sample-video/     # Explainer demo
└── scripts/
    ├── flux_client.py    # Text-to-image
    ├── svd_client.py     # Image-to-video
    └── wan22_client.py   # Text-to-video
```

### Dependency Hierarchy (No Cycles)

```
Layer 0: vwf-types (external crates only)
         ↓
Layer 1: vwf-runtime, vwf-dag, vwf-queue
         ↓
Layer 2: vwf-config, vwf-render
         ↓
Layer 3: vwf-steps
         ↓
Layer 4: vwf-core
         ↓
Layer 5: vwf-cli, vwf-web
```

## Resume Support

Skip expensive steps whose outputs already exist:

```bash
vwf run workflow.yaml --workdir work --resume
```

Steps declare `resume_output` for completion checking. Media files are validated via ffprobe duration---no half-written WAV files sneaking through.

## The Crates

### vwf-foundation (4 crates)

| Crate | Purpose |
|-------|---------|
| **vwf-types** | TaskId, ArtifactId, TaskStatus, ArtifactStatus |
| **vwf-runtime** | Runtime trait, FsRuntime, DryRunRuntime, output validation |
| **vwf-dag** | Scheduler, Task, Artifact, State persistence |
| **vwf-queue** | GPU semaphores for TTS/lipsync serialization |

### vwf-engine (4 crates)

| Crate | Purpose |
|-------|---------|
| **vwf-config** | Workflow YAML parsing and validation |
| **vwf-render** | Template `{{var}}` substitution |
| **vwf-steps** | Step implementations (7 types) |
| **vwf-core** | Engine orchestration, RunReport, resume |

### vwf-apps (2 crates)

| Crate | Purpose |
|-------|---------|
| **vwf-cli** | Command-line interface with --resume flag |
| **vwf-web** | Yew/WASM UI (skeleton) |

## Why This Fixes Agent Drift

| Problem | Solution |
|---------|----------|
| Agents forget steps | Steps are data, executed by code |
| Parameters drift | Config is versioned YAML, not improvised |
| Order confusion | DAG scheduler resolves dependencies |
| Hidden failures | Every run produces a manifest |
| Context overload | Each step gets minimal, focused context |
| Expensive re-runs | Resume skips completed steps |

The LLM call becomes **one step among many**, with captured output that other steps can parse and validate.

## Current Status

| Milestone | Status |
|-----------|--------|
| Workflow Runner | Complete |
| Shell Step | Complete |
| TTS Voice Cloning | Complete |
| Text-to-Image (FLUX) | Complete |
| Image-to-Video (SVD) | Complete |
| Text-to-Video (Wan 2.2) | Complete |
| Music Generation | Complete |
| Resume Support | Complete |
| LLM Adapter | Partial (mock only) |
| Web UI | Skeleton |

## The Sharpen-the-Saw Philosophy

This project exists because I was losing hours to agent failures every week. Instead of fighting the same battles repeatedly, I spent time building infrastructure that makes future production smoother.

The ROI is clear:
- **Before**: 30+ minutes debugging agent amnesia per video
- **After**: Workflows execute deterministically, failures are traceable, progress resumes

Sometimes the best coding session is the one that makes all future sessions easier.

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |
| **ComfyUI** | [ComfyUI](https://github.com/comfyanonymous/ComfyUI) |
| **FLUX.1** | [Black Forest Labs](https://blackforestlabs.ai/) |
| **Stable Video Diffusion** | [Stability AI](https://stability.ai/stable-video) |
| **Wan 2.1/2.2** | [Alibaba Wan](https://huggingface.co/Wan-AI) |
| **midi-cli-rs** | [midi-cli-rs](https://github.com/softwarewrighter/midi-cli-rs) (procedural music generation) |
| **FluidSynth** | [FluidSynth](https://www.fluidsynth.org/) (MIDI-to-WAV rendering) |

### SoundFonts for Commercial Use

MIDI-to-WAV rendering requires SoundFont files (.sf2). For commercial video production, use soundfonts with clear licensing:

| SoundFont | License | Notes |
|-----------|---------|-------|
| **GeneralUser GS** | Permissive | [Download](https://schristiancollins.com/generaluser.php) - explicitly allows commercial music production |
| **FluidR3_GM** | MIT | Included with FluidSynth - clear commercial use rights |

Avoid GPL-licensed soundfonts (e.g., TimGM6mb) if you need unambiguous commercial rights for rendered audio.

</div>

---

*Habit 7: Sharpen the Saw. Sometimes the tool you need doesn't exist yet---so you build it.*

