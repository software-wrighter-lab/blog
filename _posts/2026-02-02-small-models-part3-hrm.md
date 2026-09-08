---
layout: post
title: "Small Models (3/6): Planner + Doer = Genius"
date: 2026-02-02 09:00:00 -0800
categories: [llm, machine-learning, research]
tags: [hrm, hierarchical-reasoning, arc-challenge, planning]
keywords: "ARC challenge, o3-mini, abstract reasoning, 27M parameters, planner-doer architecture"
author: Software Wrighter
abstract: "27 million parameters beats o3-mini on ARC. The Hierarchical Reasoning Model separates planning from execution, mimicking the brain's dual-process theory. It achieves 40% on the hardest reasoning benchmark where most LLMs score under 5%."
series: "Small Models, Big Brains"
series_part: 3
video_url: "https://www.youtube.com/shorts/q_8qX-S9SxA"
video_title: "Planner + Doer = Genius"
repo_url: "https://github.com/softwarewrighter/viz-hrm-ft"
papers:
  - title: "Hierarchical Reasoning Model"
    url: "https://arxiv.org/abs/2506.21734"
---

<img src="{{ '/assets/images/site/post-marker-floral.webp' | relative_url }}" class="post-marker" alt="">

27 million parameters beats o3-mini on ARC.

The hardest reasoning benchmark. Most LLMs score under 5 percent. This tiny model scores 40 percent.

This is Part 3 of the **Small Models, Big Brains** series, exploring the **Hierarchical Reasoning Model (HRM)**---a brain-inspired architecture that separates planning from execution.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [Hierarchical Reasoning Model](https://arxiv.org/abs/2506.21734) |
| **Original Code** | [sapientinc/HRM](https://github.com/sapientinc/HRM) |
| **Visualization** | [viz-hrm-ft](https://github.com/softwarewrighter/viz-hrm-ft) |
| **Video** | [Planner + Doer = Genius](https://www.youtube.com/shorts/q_8qX-S9SxA)<br>[![Video](https://img.youtube.com/vi/q_8qX-S9SxA/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/q_8qX-S9SxA) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The ARC Challenge

The [Abstraction and Reasoning Corpus (ARC)](https://arcprize.org/) tests:

- Abstract reasoning
- Pattern matching
- Spatial logic
- Puzzles requiring real thinking

These aren't problems you can memorize. Each puzzle is unique, requiring genuine understanding of the underlying pattern.

### Why LLMs Struggle

| Challenge | LLM Limitation |
|-----------|----------------|
| Novel patterns | Can't rely on training data |
| Spatial reasoning | Text-based thinking is linearized |
| Multi-step logic | Each step compounds errors |
| Abstraction | Pattern matching isn't generalization |

## Meet HRM: The Hierarchical Reasoning Model

HRM uses just 27 million parameters but achieves remarkable results by mimicking how the brain thinks: **plan first, then act**.

### Two-Module Architecture

```
┌─────────────────────────────────────┐
│           PLANNER                   │
│   Thinks slow and abstract          │
│   Sets goals and strategies         │
└─────────────┬───────────────────────┘
              │ Goals
              ▼
┌─────────────────────────────────────┐
│            DOER                     │
│   Moves fast                        │
│   Takes concrete actions            │
└─────────────────────────────────────┘
```

| Module | Speed | Function |
|--------|-------|----------|
| **Planner** | Slow | Abstract thinking, goal setting |
| **Doer** | Fast | Concrete actions, execution |

This mirrors the brain's dual-process theory: System 1 (fast, intuitive) and System 2 (slow, deliberate).

## Results

| Benchmark | HRM (27M) | o3-mini | GPT-4 |
|-----------|-----------|---------|-------|
| **ARC** | 40% | <40% | <5% |
| Hard Mazes | 99% | - | ~0% |
| Complex Sudoku | 99% | - | - |

A 27M parameter model outperforming models 1000x larger on reasoning tasks.

## The Visualization Tool

The [viz-hrm-ft](https://github.com/softwarewrighter/viz-hrm-ft) repository provides a React app to visualize HRM's reasoning process:

- Watch the Planner form strategies
- See the Doer execute actions
- Visualize the feedback loop between modules
- Simulate fine-tuning on BabyAI tasks

```bash
git clone https://github.com/softwarewrighter/viz-hrm-ft
cd viz-hrm-ft
npm install
npm start
```

## Why Hierarchy Works

### Traditional Flat Models

```
Input → [Single Network] → Output
```

Everything happens in one pass. Complex problems overwhelm the network.

### Hierarchical Models

```
Input → [Planner] → Strategy
                  ↓
Strategy → [Doer] → Action
                  ↓
Action → [Environment] → Feedback
                       ↓
Feedback → [Planner] → Refined Strategy
                     ↓
                    ...
```

The Planner doesn't worry about details. The Doer doesn't worry about strategy. Each module focuses on what it does best.

## Key Insights

1. **Separation of concerns scales.** Splitting planning from execution lets each module specialize.

2. **Iteration enables refinement.** The Planner-Doer loop allows course correction.

3. **Small can beat big.** 27M parameters with good architecture beats 100B+ with brute force.

4. **Brain-inspired design works.** Mimicking cognitive architecture yields better results.

## Comparison with Part 1 (TRM)

| Aspect | TRM | HRM |
|--------|-----|-----|
| Parameters | <1,000 | 27M |
| Architecture | Think-Act cycles | Planner-Doer hierarchy |
| Strength | Maze solving | Abstract reasoning |
| Key insight | Iteration | Hierarchical decomposition |

Both use recursive reasoning, but HRM adds hierarchical structure for more complex tasks.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Primary Language** | TypeScript |
| **Source Files** | 26 `.ts`/`.tsx`, 7 `.js` |
| **Estimated Size** | ~4 KLOC |
| **Framework** | React |
| **Build System** | npm / Create React App |
| **Visualization** | Canvas-based rendering |

**Good for you if:** You want to visualize neural reasoning processes, build interactive ML demos, or learn React with a real project.

**Complexity:** Low-Moderate. Standard React/TypeScript project. No ML training code—this is a visualization tool for understanding the HRM architecture. Easy to extend with new visualizations.

## Key Takeaways

1. **Plan, then act.** Separating strategy from execution mirrors effective human thinking.

2. **Hierarchy enables complexity.** Multi-level reasoning handles problems flat networks can't.

3. **Architecture > Scale** for reasoning tasks.

4. **ARC remains unsolved** by brute-force scaling---clever architectures are the path forward.

## What's Next

Part 4 explores **Baby Dragon Hatchling (BDH)**---a brain-inspired model with visible, interpretable activations.

## Resources

- [HRM Paper](https://arxiv.org/abs/2506.21734)
- [Original HRM Code](https://github.com/sapientinc/HRM)
- [viz-hrm-ft Repository](https://github.com/softwarewrighter/viz-hrm-ft)
- [ARC Prize](https://arcprize.org/)
- [Video: Planner + Doer = Genius](https://youtube.com/shorts/VIDEO_ID)

---

