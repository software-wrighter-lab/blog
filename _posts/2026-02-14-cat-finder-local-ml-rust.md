---
layout: post
title: "Cat Finder: Personal Software via Vibe Coding"
date: 2026-02-14 12:00:00 -0800
categories: [rust, machine-learning, projects, vibe-coding]
tags: [rust, yolo, onnx, object-detection, computer-vision, cli-tools, vibe-coding, personal-software, claude-code]
keywords: "cat finder, YOLOv8, ONNX Runtime, Rust, object detection, computer vision, local ML, privacy-first, CLI tool, vibe coding, personal software, Claude Code"
author: Software Wrighter
abstract: "Personal Software via Vibe Coding: I needed to find cat photos scattered across my system. Instead of cloud services or app stores, I described what I wanted to Claude Code and got a working Rust CLI tool using YOLOv8 and ONNX Runtime. Privacy-first, locally-run, and mine to modify."
video_url: "https://www.youtube.com/watch?v=pkhSwI97udw"
video_title: "Local Cat Detection in Rust"
repo_url: "https://github.com/sw-ml-study/cat-finder"
series: "Personal Software"
series_part: 1
---

<img src="{{ '/assets/images/posts/cat-finder.webp' | relative_url }}" class="post-marker" alt="">

I needed to find cat photos scattered across my system. Instead of searching the app store, signing up for a cloud service, or uploading my personal photos to someone else's servers, I asked Claude Code to build me the tool I needed. An hour later, I had it.

This is **Personal Software**---software that exists because you needed it, built the way you want it, running entirely under your control.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [cat-finder](https://github.com/sw-ml-study/cat-finder) |
| **Video** | [Cat Finder Explainer](https://www.youtube.com/watch?v=pkhSwI97udw)<br>[![Video](https://img.youtube.com/vi/pkhSwI97udw/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=pkhSwI97udw) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Vibe Coding Approach

**Vibe Coding** is about describing what you want and letting AI handle the implementation details. No boilerplate, no Stack Overflow rabbit holes, no fighting with build systems. You focus on the *what*, the AI handles the *how*.

For Cat Finder, the conversation went something like:

> "I want a CLI tool that scans directories for images containing cats. Run locally, no cloud. Use YOLO for detection. Output just the file paths so I can pipe them to other commands."

Claude Code chose the tech stack (Rust, YOLOv8n, ONNX Runtime), handled the tensor math, figured out the COCO class IDs, and produced a working tool. I guided the direction; the AI wrote the code.

## Why Personal Software?

The traditional options for "find cat photos" would be:

1. **Cloud service**: Upload photos to Google/Apple/Amazon, let them scan everything, hope they respect your privacy
2. **Desktop app**: Find something in an app store, hope it does what you want, deal with subscription fees or ads
3. **Write it yourself**: Spend days learning YOLO integration, tensor formats, image preprocessing

Personal Software offers a fourth path: **describe what you need, get exactly that, own the result completely**.

Cat Finder runs entirely on my machine. No accounts, no uploads, no subscriptions, no ads. The code is mine to modify, extend, or share.

## What Got Built

A Rust CLI tool using **YOLOv8n** (the nano variant) through **ONNX Runtime**:

```
Directory Traversal → Image Preprocessing → YOLO Inference → Cat Detection → Output
```

### The Detection Pipeline

1. **Walk directories** recursively, finding image files (jpg, png, gif, webp, etc.)
2. **Preprocess each image**: resize to 640×640, normalize to 0.0-1.0, convert to NCHW tensor format
3. **Run inference** through the YOLOv8n ONNX model
4. **Parse output** for class ID 15 (cat in COCO ordering) above confidence threshold
5. **Print matching paths** to stdout for easy piping to other tools

### Unix Philosophy

```bash
# stdout: just paths (machine-parseable)
# stderr: logging and progress

cat-finder ~/Photos | xargs -I {} cp {} ~/CatPhotos/
```

This separation enables composable Unix pipelines. The tool does one thing well and plays nicely with others.

## Technology Stack

| Component | Purpose |
|-----------|---------|
| **Rust** | Memory-safe, high-performance core |
| **YOLOv8n** | Lightweight object detection (12MB model) |
| **ONNX Runtime** | Cross-platform inference engine |
| **clap** | CLI argument parsing |
| **ndarray** | Tensor operations |
| **walkdir** | Recursive directory traversal |

Total footprint: ~80MB (runtime + model + binary)

I didn't choose this stack---Claude Code did, based on the requirements. It made good choices.

## Usage

```bash
# Basic usage
cat-finder ~/Photos

# Adjust confidence threshold
cat-finder --confidence 0.5 ~/Photos

# Verbose output with timestamps
cat-finder -v -t ~/Photos

# Copy all cat photos to a new folder
cat-finder ~/Photos | xargs -I {} cp {} ~/CatAlbum/
```

## Honest About Limitations

The README documents failure cases transparently:

| Image Type | Detection Success |
|------------|-------------------|
| Clear photographs | High |
| Artistic/stylized images | Low |
| Cats in clothing | Low |
| Small/partial cats | Variable |
| Low quality/blurry | Variable |

Test results: 7 of 9 cat images detected (77.8% recall). Oil paintings and anthropomorphized cats confuse models trained on photographs. This is documented, not hidden.

## Bonus Features

The project grew organically based on related needs:

**Duplicate Finder**: A second binary for finding duplicate images using size-based filtering followed by SHA-256 checksums.

```bash
find-duplicates ~/Photos
```

**Web Demo**: A Flask-based interface for visual feedback with real-time progress via Server-Sent Events.

These emerged from "while you're at it..." requests during development. Vibe coding makes feature additions nearly frictionless.

## Setup

```bash
git clone https://github.com/sw-ml-study/cat-finder
cd cat-finder
./scripts/setup.sh  # Downloads model, builds project
./cat-finder ~/Photos
```

## The Personal Software Philosophy

**Privacy-first**: All processing happens locally. No cloud APIs, no external services, no data leaving your machine.

**Ownership**: The code is yours. Modify it, extend it, share it, delete it.

**Fit-for-purpose**: Built for exactly what you need, nothing more, nothing less.

**Transparency**: Known limitations documented. No marketing spin.

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **YOLOv8** | [Ultralytics YOLOv8](https://docs.ultralytics.com/) - State-of-the-art object detection |
| **ONNX Runtime** | [ONNX Runtime](https://onnxruntime.ai/) - Cross-platform inference engine |
| **ort crate** | [ort](https://crates.io/crates/ort) - Rust bindings for ONNX Runtime |
| **COCO Dataset** | [COCO Classes](https://docs.ultralytics.com/datasets/detect/coco/) - Class ID 15 = cat |


</div>

---

*You don't always need an app store or a cloud service. Sometimes you just need to describe what you want and let an AI build it for you. That's vibe coding. That's personal software.*

