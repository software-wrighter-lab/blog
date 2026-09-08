---
layout: post
title: "Lucy 20%: Upgrading My Home AI Cluster"
date: 2026-02-28 00:15:00 -0800
categories: [homelab, ai, hardware]
tags: [lucy, ai-cluster, rtx-3090, voice-cloning, text-to-image, text-to-video, local-ai, homelab, voxcpm, flux, wan]
keywords: "Lucy AI, home AI cluster, RTX 3090, local AI, voice cloning, VoxCPM, FLUX schnell, text-to-image, text-to-video, Wan 2.2, SVD, X99 motherboard, homelab, AI hardware, 24GB VRAM"
author: Software Wrighter
abstract: "Expanding my home AI cluster from 10% to 20% brain power with a new X99 motherboard and RTX 3090. Adding VoxCPM voice cloning, FLUX text-to-image, and Wan 2.2 text-to-video capabilities."
video_url: "https://www.youtube.com/shorts/wJvmBYTge7U"
video_title: "Home Lab AI Cluster: Lucy Levels Up"
series: "General Technology"
series_part: 3
---

<img src="{{ '/assets/images/posts/block-beehive.webp' | relative_url }}" class="post-marker" alt="">

Lucy is getting an upgrade. I'm adding an X99 motherboard with an RTX 3090 to expand my AI cluster from 10% to 20% brain power.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [Lucy 20% Upgrade](https://www.youtube.com/shorts/wJvmBYTge7U)<br>[![Video](https://img.youtube.com/vi/wJvmBYTge7U/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/wJvmBYTge7U) |
| **Previous** | [Lucy 10%](https://www.youtube.com/shorts/610E1i-koE0)<br>[![Video](https://img.youtube.com/vi/610E1i-koE0/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/610E1i-koE0) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## New Hardware: Queenbee

The cluster uses bee-themed naming. The new node is called **queenbee**:

| Component | Specification |
|-----------|---------------|
| **Motherboard** | X99 |
| **CPU** | Intel Xeon E5-2660 v4 (28 threads) |
| **RAM** | 64 GB DDR4 ECC |
| **GPU** | RTX 3090 (24GB VRAM) |
| **Storage** | 1TB NVMe SSD + 4TB HDD |

## New AI Capabilities

With queenbee online, Lucy gains several new abilities:

| Capability | Model | What It Does |
|------------|-------|--------------|
| **Voice Cloning** | VoxCPM | High-quality text-to-speech with voice cloning |
| **Text-to-Image** | FLUX schnell | Fast image generation from text prompts |
| **Text-to-Video** | Wan 2.2 | Generate video clips from text descriptions |
| **Image-to-Video** | SVD | Animate still images into video |

## The Active Cluster

Currently active for AI workloads:

| Node | Role | GPU |
|------|------|-----|
| **hive** | MuseTalk lip-sync | 2x P40 (48GB total) |
| **queenbee** | Generative AI workloads | RTX 3090 (24GB) |

Together, they handle the full pipeline: generate images, animate them to video, add lip-synced speech, and produce the final output. See the full apiary inventory below.

## Why Local AI?

Running AI locally means:

- **Privacy** - Data never leaves my network
- **No API costs** - Unlimited generations after hardware investment
- **Customization** - Full control over models and parameters
- **Learning** - Deep understanding of how these systems work

The 24GB of VRAM on the 3090 opens up models that wouldn't fit on smaller cards. FLUX schnell produces high-quality images in seconds. VoxCPM creates natural-sounding speech that can clone voices from short audio samples.

## Bee-Themed Host Names

The full apiary (current and planned nodes):

| Host | System | CPU | Cores | RAM | GPU |
|------|--------|-----|-------|-----|-----|
| **apiary** | HPE DL360 G10 | 1x Xeon Gold 5188 | 12C/24T | 188G | - |
| **bees** | HPE DL360 G9 | 2x E5-2650 v4 | 24C/48T | 128G | - |
| **brood** | HPE DL380 G9 | 2x E5-2680 v4 | 28C/56T | 64G | 2x P100-16G |
| **colony** | Supermicro 6028U | 2x E5-2680 v3 | 24C/48T | TBD | 2x K80-24G |
| **drones** | HPE DL380 G9 | 2x E5-2620 v4 | 16C/32T | 256G | - |
| **hive** | HPE DL380 G9 | 2x E5-2698 v3 | 32C/64T | 128G | 2x P40-24G |
| **honeycomb** | HPE DL180 G9 | 1x E5-2609 v4 | 8C/8T | TBD | - |
| **queenbee** | X99 | 1x E5-2660 v4 | 14C/28T | 64G | RTX 3090-24G |
| **swarm** | HPE DL380 G9 | 2x E5-2698 v3 | 32C/64T | 374G | 2x P100-12G |
| **workers** | HPE DL560 G8 | 4x E5-4617 v1 | TBD | 640G | TBD |

*Notes: Some nodes pending upgrade or configuration. Workers may upgrade to 4x E5-4657L v2 (48C/96T). Honeycomb needs unbrick. K80 GPUs are old and difficult to configure (limited CUDA version support)—will be replaced with M40 GPUs.*

## Power and Control

Remote management is essential for a home datacenter. The HPE servers include **iLO** (Integrated Lights-Out) for out-of-band access to BIOS, diagnostics, monitoring, and power control—even when the OS is down.

| Category | Technology | Purpose |
|----------|------------|---------|
| **Remote Management** | HPE iLO | BIOS access, diagnostics, monitoring, power control |
| **IP KVM** | JetKVM, Sipeed KVM | Console access for non-HPE servers (planned) |
| **Power Monitoring** | Kill-A-Watt, clones | Per-outlet power consumption tracking |
| **Smart Outlets** | Home Assistant + Zigbee | Remote power control, scheduling, automation |
| **Additional Circuits** | Bluetti LFP power stations | Extra capacity to run more servers, remote control via BT/WiFi/Zigbee |

The combination of iLO and smart outlets means I can remotely power-cycle any server, access its console, and monitor power draw—all from my phone or Home Assistant dashboard. The Bluetti stations primarily provide additional circuits so I can run more servers simultaneously—home electrical limits are a real constraint. More LFP power stations will be needed to power Lucy at 100%.

## Networking

Each server has 3 or more NICs, segmented by purpose:

| Speed | Purpose | Switch |
|-------|---------|--------|
| **1G** | iLO/KVM management | 1G switch |
| **2.5G** | SSH, SCP, Chrome Remote Desktop | 2x 2.5G switches |
| **10G fiber** | Server-to-server data transfer (large models) | 10G switch |

The 10G backbone is essential for moving multi-gigabyte model files between nodes. Loading a 70B parameter model over 1G would take forever—10G fiber makes it practical. The 2.5G network handles interactive work and smaller transfers (using USB NICs where needed), while the 1G management network stays isolated for out-of-band access.

Additional networking notes:

- **WiFi 7** for wireless connectivity
- **Managed switches with VLANs** planned for better network segmentation
- **Linux network bonding** experiments to increase aggregate transfer rates
- **Sneaker net** - most servers have hot-swap SAS SSDs and hard drives, so physically moving drives between nodes is sometimes the fastest option for very large transfers

## What's Next

The 20% milestone is just a step. Future upgrades could include:

- Additional GPU nodes for parallel processing
- Larger language models for local inference
- Real-time video generation pipelines
- Integration with more specialized models

The bee hive keeps growing.

---


*Building AI infrastructure one node at a time.*
