---
layout: post
title: "Energy-Based Learning: From Hopfield Networks to JEPA"
date: 2026-05-16 00:15:00 -0700
categories: [machine-learning, research, self-supervised-learning]
tags: [jepa, energy-based-models, hopfield-networks, boltzmann-machines, self-supervised-learning, world-models, yann-lecun]
keywords: "JEPA, Joint Embedding Predictive Architecture, Hopfield network, Boltzmann machine, energy based models, low energy optimization, self supervised learning, I-JEPA, V-JEPA, Yann LeCun"
author: Software Wrighter
abstract: "Energy-based learning frames intelligence as making compatible configurations low energy and incompatible ones high energy. Hopfield networks made memory an energy landscape, Boltzmann machines made that landscape stochastic and learnable, and JEPA carries the idea forward into representation-space prediction."
series: "Machine Learning"
series_part: 8
papers:
  - title: "Neural networks and physical systems with emergent collective computational abilities"
    url: "https://authors.library.caltech.edu/records/w41x7-8bn13"
  - title: "A Learning Algorithm for Boltzmann Machines"
    url: "https://doi.org/10.1207/s15516709cog0901_7"
  - title: "A Tutorial on Energy-Based Learning"
    url: "https://yann.lecun.org/exdb/publis/pdf/lecun-06.pdf"
  - title: "A Path Towards Autonomous Machine Intelligence"
    url: "https://openreview.net/pdf/315d43ba26f55357a84cec9a7ed15a6610094f79.pdf"
  - title: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture"
    url: "https://arxiv.org/abs/2301.08243"
  - title: "Revisiting Feature Prediction for Learning Visual Representations from Video"
    url: "https://arxiv.org/abs/2404.08471"
---

<img src="{{ '/assets/images/posts/block-3d-energy-landscape.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 260px;">

JEPA can sound like a sudden new architecture: predict hidden pieces of the world in representation space, avoid pixel reconstruction, learn useful abstractions, then use those abstractions for planning. But the deeper idea is older and cleaner:

> intelligence can be framed as settling into states that make the world internally consistent.

That is the energy-based thread. Hopfield networks gave it a physical metaphor. Boltzmann machines made it probabilistic and learnable. LeCun's energy-based models generalized it into a modeling principle. JEPA is one modern answer to the question that fell out of that lineage: what should the model assign low energy to?

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Hopfield** | [Neural networks and physical systems with emergent collective computational abilities](https://authors.library.caltech.edu/records/w41x7-8bn13) |
| **Boltzmann machine** | [A Learning Algorithm for Boltzmann Machines](https://doi.org/10.1207/s15516709cog0901_7) |
| **Energy-based learning** | [A Tutorial on Energy-Based Learning](https://yann.lecun.org/exdb/publis/pdf/lecun-06.pdf) |
| **JEPA position paper** | [A Path Towards Autonomous Machine Intelligence](https://openreview.net/pdf/315d43ba26f55357a84cec9a7ed15a6610094f79.pdf) |
| **I-JEPA** | [Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture](https://arxiv.org/abs/2301.08243) |
| **V-JEPA** | [Revisiting Feature Prediction for Learning Visual Representations from Video](https://arxiv.org/abs/2404.08471) |

</div>

## Hopfield: Memory as a Valley

Hopfield's 1982 paper is usually introduced as associative memory. Store a set of patterns. Give the network a noisy or partial pattern. Let the recurrent dynamics run. If the stored pattern is strong enough and the starting point is close enough, the system settles into the nearest remembered pattern.

The important conceptual move is that recall is not a lookup table. It is motion downhill.

Each network state has an energy. Stable memories are low-energy basins. The update rule decreases energy until the system reaches an attractor. That gives you a physical picture of computation: a memory is not merely an addressable record; it is a basin in a landscape. Recognition is the act of falling into the right basin.

That picture matters because it joins three ideas that still show up in modern representation learning:

- **Representation**: a pattern is encoded as a state of many simple units.
- **Inference**: computation is the process of finding a compatible low-energy state.
- **Robustness**: damaged or partial input can still land in the same attractor.

Hopfield networks are limited, but the metaphor is durable. A model can know something by making the correct configuration easier to settle into than the incorrect ones.

## Boltzmann: Search the Landscape, Learn the Landscape

The Boltzmann machine keeps the energy landscape but adds stochasticity. Instead of deterministically falling into the nearest basin, units update probabilistically, with low-energy states more likely than high-energy states. Temperature controls how much the system explores.

That one change makes the architecture feel less like a fixed memory and more like a generative model. The machine can sample states. It can represent uncertainty. Most importantly, it has a learning story: adjust weights so observed data configurations become lower energy than configurations the model dreams up on its own.

The core contrast is:

| Model | Low-energy states mean |
|-------|------------------------|
| Hopfield network | Stored memories / attractors |
| Boltzmann machine | Likely configurations under the learned distribution |
| Energy-based model | Compatible pairs, structures, or decisions |

This is the first bridge toward the modern language. A good model is not merely a function that maps input to output. It is a system that scores configurations. Learning reshapes the score surface so correct configurations become cheap and incorrect ones become expensive.

## Energy-Based Models: A General Scoring Rule

LeCun's energy-based learning tutorial generalizes the pattern:

```
E(x, y)
```

The model assigns a scalar energy to a proposed pair. If `x` is an input and `y` is a candidate answer, the model should give low energy to compatible pairs and high energy to incompatible pairs. Prediction becomes optimization:

```
y* = argmin_y E(x, y)
```

That is a broad frame. Classifiers can be read this way. Structured prediction can be read this way. Planning can be read this way. The energy function is not required to be a normalized probability distribution. That matters because normalization is often the expensive or impossible part.

But energy models have a practical problem: if you tell the model only to make good answers low energy, it may make everything low energy. Useful learning needs a way to avoid collapse. Classical Boltzmann machines use negative samples. Contrastive methods compare positives and negatives. Other methods use architectural constraints, regularizers, variance terms, stop-gradients, masking, or target encoders.

This collapse problem is one of the quiet background reasons JEPA is interesting.

## JEPA: Low Energy in Representation Space

JEPA moves the prediction target out of raw observation space.

Instead of asking a model to reconstruct every missing pixel or token, it asks the model to predict the representation of hidden or future content from the representation of visible context. In I-JEPA, a context block from an image predicts the embeddings of target blocks. In V-JEPA, video context predicts video features. The prediction is not "what exact pixels were missing?" but "what abstract state should be true there?"

That changes the energy question:

| Generative reconstruction | JEPA-style prediction |
|---------------------------|-----------------------|
| Match raw pixels/tokens | Match latent representations |
| Spend capacity on high-frequency detail | Spend capacity on semantic structure |
| Model every unpredictable nuisance | Discard what is not useful or predictable |
| Often likelihood-like | Energy / compatibility-like |

This is the old energy idea in a new location. The low-energy state is no longer a binary memory pattern or a sampled visible/hidden configuration. It is a compatible relationship between context representation, target representation, and sometimes an action or latent variable.

For world models, that is the attraction: the model does not have to generate the whole future frame. It needs to represent the aspects of the future that matter for understanding and control. The "energy" is the mismatch between predicted latent state and target latent state.

## The Lineage

The through-line is not that Hopfield networks literally became JEPA. The architectures are different. The training machinery is different. The scale is different.

The through-line is the habit of thought:

1. Treat cognition as finding compatible configurations.
2. Give configurations a scalar score.
3. Make good configurations low energy.
4. Use dynamics, sampling, gradient descent, or a learned predictor to reach those low-energy states.
5. Move the space of optimization upward, from raw bits to useful representations.

Hopfield shows that memory can be a basin. Boltzmann machines show that probabilistic learning can reshape those basins. Energy-based learning abstracts the basin into a scoring function. JEPA asks the model to build basins in latent space, where the predictable structure of the world lives more cleanly than in pixels.
