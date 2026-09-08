---
layout: post
title: "Towards Continuous LLM Learning (2): Routing Prevents Forgetting"
date: 2026-02-18 12:00:00 -0800
categories: [llm, machine-learning, research]
tags: [share-algorithm, continual-learning, rust, lora, sleepy-coder, svd]
keywords: "Share algorithm, continual learning, catastrophic forgetting, LoRA routing, SVD, coefficient training"
author: Software Wrighter
abstract: "Part 2 of implementing the Share algorithm: after fixing critical bugs (zero-gradient saddle point, half-parameter training), routing-based coefficient selection achieves zero regressions. Result handling improved 40% to 50%. We're 60% through verifying the paper's claims."
series: "Towards Continuous LLM Learning"
series_part: 2
repo_url: "https://github.com/softwarewrighter/sleepy-coder"
papers:
  - title: "Share: Shared LoRA Subspaces for Continual Learning"
    url: "https://arxiv.org/abs/2602.06043"
  - title: "The Universal Weight Subspace Hypothesis"
    url: "https://arxiv.org/abs/2512.05117"
---

<img src="{{ '/assets/images/posts/block-ink-bottle.webp' | relative_url }}" class="post-marker" alt="">

In [Part 1](/2026/02/12/sleepy-coder-when-fine-tuning-fails/), naive LoRA fine-tuning caused catastrophic forgetting. Now we're implementing the Share algorithm properly---and we're about 60% of the way to verifying the paper's claims.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [sleepy-coder](https://github.com/softwarewrighter/sleepy-coder) |
| **Part 1** | [When Fine-Tuning Fails](/2026/02/12/sleepy-coder-when-fine-tuning-fails/) |
| **ELI5** | [eli5.md](https://github.com/softwarewrighter/sleepy-coder/blob/main/docs/eli5.md) |
| **Share Paper** | [arXiv:2602.06043](https://arxiv.org/abs/2602.06043) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Paper Claims vs Implementation Status

We're systematically verifying the claims from the Share and UWSH papers:

| Paper Claim | Infrastructure | Demonstrated? |
|-------------|----------------|---------------|
| Shared basis via SVD | Complete | **Yes** |
| ~100x parameter reduction | Complete (76x) | **Yes** |
| Task routing beats averaging | Tested (Exp 1b) | **Partial** |
| Prevents catastrophic forgetting | Tested (Exp 1b) | **Partial** |
| Sequential learning | Not tested | **No** |
| UWSH subspace stability | Not tested | **No** |

**Overall: ~60% complete.** Infrastructure is solid. Routing tested. Sequential learning remains.

## What We Built

The full Share algorithm implementation:

- **Phase 1**: SVD-based subspace extraction from 51 LoRA adapters (60% variance threshold)
- **Phase 2**: Coefficient-only training with frozen basis (83K params vs 1.6M full LoRA)
- **Phase 3**: Basis merging and updates
- **Routing**: Error pattern classification for coefficient selection

## Bug Fixes That Unlocked Progress

Two critical bugs blocked proper Phase 2 training:

### Bug 1: Zero-Gradient Saddle Point

Both coefficient matrices initialized to zero:
```
eps_beta = 0, eps_alpha = 0
→ delta_W = 0 @ 0 = 0
→ zero gradients, no learning
```

**Fix**: Dual small-random initialization.

### Bug 2: Half-Parameter Training

LoRA-style initialization only trained one coefficient set:
```
Before: 112/224 parameters getting gradients
After:  224/224 parameters getting gradients
```

**Fix**: Both coefficient matrices need random initialization.

## Experiment 1b: Routing Works

With gradient-trained v4 coefficients and proper routing:

| Strategy | Pass Rate | BC | RH | TB | Regressions |
|----------|-----------|----|----|----|----|
| Baseline (no LoRA) | 46.7% | 70% | 40% | 30% | -- |
| Averaged | 50.0% | 70% | 40% | 40% | 1 |
| **Routed** | **50.0%** | **70%** | **50%** | **30%** | **0** |

**Result handling improved 40% → 50%.** Zero regressions. This is the first positive transfer from Share coefficients.

## The Forgetting Heatmap

We applied each coefficient **individually to all 30 koans**:

```
Koan       BL  mut_bc dbl_mt ret_lr mis_cl mis_hs mis_or opt_ok res_me ROUTED
bc_001-009 P   P      P      P      P      P      P      P      P      P
bc_003,5,10.   .      .      .      .      .      .      .      .      .
rh_002     .   .     +GAIN   .      .     +GAIN  +GAIN  +GAIN  +GAIN  +GAIN
rh_008     P  -LOST  -LOST  -LOST  -LOST  -LOST  -LOST  -LOST  -LOST   P
tb_005     P   P      P      P      P     -LOST   P      P      P      P
```

**Key finding**: rh_008 regresses under *every* coefficient applied globally. But routing **saves it** by falling back to the base model when no pattern matches.

This is exactly what the Share paper predicts: task-specific coefficients improve targeted patterns without interfering with unrelated ones.

## What the Papers Claim vs What We've Verified

### Verified

1. **Shared basis via SVD** --- We extract principal components from 51 adapters. Works.

2. **76x parameter reduction** --- 83K coefficient parameters vs 1.6M full LoRA. Verified.

3. **Routing prevents forgetting** --- Zero regressions with routed inference. The fragile rh_008 koan survives because it falls back to base model.

4. **Positive transfer possible** --- Result handling improved 40% → 50% with routed coefficients.

### Not Yet Verified

1. **Sequential learning** --- The core continual learning claim. Train task 1 → eval → train task 2 → eval (verify task 1 still passes). This is next.

2. **UWSH subspace stability** --- Do different adapter subsets converge to similar subspaces? Grassmann distance measurement needed.

## Next Experiments

| Priority | Experiment | Target |
|----------|------------|--------|
| **High** | Sequential learning curve | No degradation on prior tasks |
| **High** | Fix k_alpha=32 (paper recommends) | Match paper exactly |
| Medium | UWSH verification | >70% subspace overlap |
| Medium | Add rank update vectors | Full algorithm |

## The Architecture

```
Day:   Agent attempts to fix Rust errors
       ↓
       Successes and failures logged
       ↓
Night: Train coefficients (frozen basis)
       ↓
       83K params per task
       ↓
Eval:  Route to appropriate coefficients
       ↓
       Pattern-matched inference
       ↓
(repeat)
```

The key insight: **train small, route smart**. The shared basis captures common structure. Per-task coefficients specialize without interference.

## Resources

- [sleepy-coder Repository](https://github.com/softwarewrighter/sleepy-coder)
- [Part 1: When Fine-Tuning Fails](/2026/02/12/sleepy-coder-when-fine-tuning-fails/)
- [Paper Checklists](https://github.com/softwarewrighter/sleepy-coder/blob/main/docs/paper-checklists.md)
- [Share Paper (arXiv:2602.06043)](https://arxiv.org/abs/2602.06043)
- [UWSH Paper (arXiv:2512.05117)](https://arxiv.org/abs/2512.05117)

---


*60% of the way to verifying the papers. Sequential learning is next.*

