---
layout: post
title: "Small Models (2/6): AI in Your Pocket"
date: 2026-02-01 09:00:00 -0800
categories: [llm, mobile, android]
tags: [mobilellm, android, offline-ai, llama-cpp, privacy]
keywords: "MobileLLM, Eliza, therapist chatbot, offline AI, JNI, Jetpack Compose, GGUF"
author: Software Wrighter
abstract: "AI in your pocket, no internet required. Pocket Eliza++ runs MobileLLM-350M on Android via llama.cpp and JNI, creating a privacy-first therapist chatbot. The 260MB quantized model achieves ~10 tokens/second on mid-range phones."
series: "Small Models, Big Brains"
series_part: 2
video_url: "https://www.youtube.com/shorts/fyEuH1BprLI"
video_title: "AI in Your Pocket"
repo_url: "https://github.com/softwarewrighter/pocket-llm"
papers:
  - title: "MobileLLM (ICML 2024)"
    url: "https://arxiv.org/abs/2402.14905"
---

<img src="{{ '/assets/images/site/post-marker-pot.webp' | relative_url }}" class="post-marker" alt="">

AI on your phone. All day. No internet required.

This is Part 2 of the **Small Models, Big Brains** series. Today we're putting a language model in your pocket with **Pocket Eliza++**---a modern AI therapist that runs completely offline on Android.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [MobileLLM (ICML 2024)](https://arxiv.org/abs/2402.14905) |
| **Code** | [pocket-llm](https://github.com/softwarewrighter/pocket-llm) |
| **Runtime** | [llama.cpp](https://github.com/ggerganov/llama.cpp) |
| **Video** | [AI in Your Pocket](https://www.youtube.com/shorts/fyEuH1BprLI)<br>[![Video](https://img.youtube.com/vi/fyEuH1BprLI/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/fyEuH1BprLI) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## Why Offline Matters

| Benefit | Description |
|---------|-------------|
| **Privacy** | Data never leaves your device |
| **Speed** | No network latency |
| **Cost** | No API fees |
| **Offline** | Works without internet |
| **Battery** | Efficient on-device inference |

Cloud AI is convenient, but sometimes you want a conversation that stays on your device.

## MobileLLM: Meta's Edge Champion

[MobileLLM](https://arxiv.org/abs/2402.14905) is Meta's sub-500M parameter model optimized specifically for on-device inference.

### Architecture Optimizations

| Technique | Benefit |
|-----------|---------|
| **Deep-thin design** | More layers, fewer parameters per layer |
| **SwiGLU activation** | Better performance than ReLU |
| **Embedding sharing** | Saves 30% of parameters |
| **Grouped-query attention** | Faster inference |

The result: a 260MB quantized model (Q4_K_M) that runs smoothly on phones.

## Pocket Eliza++

<img src="{{ '/assets/images/posts/small-models-part2/eliza-taking-notes.gif' | relative_url }}" alt="Eliza taking notes" style="float: right; max-width: 300px; margin: 0 0 1em 1.5em; border-radius: 8px;">

The original ELIZA (1966) used pattern matching to simulate a Rogerian therapist. Pocket Eliza++ uses the same therapeutic approach but with actual language understanding.

### Therapeutic Design

The system prompt instructs the model to:

- Ask one short question at a time
- Never repeat questions
- Vary question types (feelings, motivations, specifics)
- Never give advice or explanations

It's a reflective listener, not a problem solver.

## Technical Stack

```
┌─────────────────────────────────┐
│     Kotlin + Jetpack Compose    │  UI Layer
├─────────────────────────────────┤
│            JNI Bridge           │
├─────────────────────────────────┤
│           llama.cpp             │  Inference Engine
├─────────────────────────────────┤
│    MobileLLM-350M (Q4_K_M)      │  Model (260MB)
└─────────────────────────────────┘
```

- **Model**: MobileLLM-350M quantized to Q4_K_M (260MB GGUF)
- **Runtime**: llama.cpp compiled for Android via NDK
- **Interface**: Kotlin + Jetpack Compose
- **Bridge**: JNI bindings connect Kotlin to native llama.cpp

## Building the App

```bash
# Clone the repository
git clone https://github.com/softwarewrighter/pocket-llm
cd pocket-llm/android-demo

# Clone llama.cpp into native source
git clone https://github.com/ggerganov/llama.cpp.git \
    app/src/main/cpp/llama.cpp

# Download the model (260MB)
mkdir -p app/src/main/assets
curl -L -o app/src/main/assets/MobileLLM-376M-Q4_K_M.gguf \
    "https://huggingface.co/pjh64/MobileLLM-350M-GGUF/resolve/main/MobileLLM-376M-Q4_K_M.gguf"

# Build and install
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Build Requirements

| Requirement | Value |
|-------------|-------|
| Target SDK | 35 (Android 15) |
| Min SDK | 28 (Android 9.0) |
| ABI | arm64-v8a |
| NDK | CMake for native build |
| Kotlin | 2.0.0 |

## Quick CLI Demo

Don't want to build the Android app? Test with Ollama:

```bash
pip install -r requirements.txt
ollama pull smollm:360m
python3 eliza.py
```

## Performance

On a mid-range Android phone (Snapdragon 7 series):

- **First token**: ~500ms
- **Generation**: ~10 tokens/second
- **Memory**: ~400MB RAM
- **Battery**: Minimal impact for short sessions

## Implementation Details

| Metric | Value |
|--------|-------|
| **Languages** | Kotlin (UI), Python (CLI), C++ (JNI) |
| **Source Files** | 6 `.kt`, 4 `.py`, 2 `.cpp` |
| **Estimated Size** | ~1.3 KLOC |
| **Android Target** | SDK 28+ (Android 9.0) |
| **Build System** | Gradle + CMake (NDK) |
| **Key Dependency** | llama.cpp (vendored) |

**Good for you if:** You want to deploy LLMs on Android, learn JNI/NDK integration, or build privacy-focused mobile AI apps.

**Complexity:** Moderate-High. Requires Android Studio, NDK setup, and understanding of JNI bridges. The llama.cpp integration is the tricky part; the Kotlin UI is straightforward Jetpack Compose.

## Key Takeaways

1. **Sub-500M models are phone-ready.** MobileLLM proves useful AI fits in your pocket.

2. **llama.cpp is the universal runtime.** Same engine runs on Mac, Linux, Windows, and Android.

3. **Privacy doesn't require sacrifice.** Offline AI can still be conversational and helpful.

4. **Quantization is essential.** Q4_K_M brings 350M parameters down to 260MB with minimal quality loss.

## What's Next

Part 3 explores the **Hierarchical Reasoning Model (HRM)**---a 27M parameter model that beats o3-mini on abstract reasoning.

## Resources

- [MobileLLM Paper (ICML 2024)](https://arxiv.org/abs/2402.14905)
- [pocket-llm Repository](https://github.com/softwarewrighter/pocket-llm)
- [llama.cpp](https://github.com/ggerganov/llama.cpp)
- [MobileLLM GGUF on HuggingFace](https://huggingface.co/pjh64/MobileLLM-350M-GGUF)
- [Video: AI in Your Pocket](https://youtube.com/shorts/VIDEO_ID)

---

