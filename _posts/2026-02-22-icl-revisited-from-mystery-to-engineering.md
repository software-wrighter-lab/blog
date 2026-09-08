---
layout: post
title: "In-Context Learning Revisited: From Mystery to Engineering"
date: 2026-02-22 00:00:00 -0800
categories: [machine-learning, llm, research]
tags: [in-context-learning, icl, transformers, meta-learning, gpt, few-shot-learning]
keywords: "in-context learning, ICL, transformers, meta-learning, few-shot learning, GPT-3, induction heads, gradient descent"
author: Software Wrighter
abstract: "ICL evolved from emergent surprise (2020) to mechanistic understanding (2022) to engineered capability (2026). Transformers implement implicit gradient descent during inference---they learn without weight updates. The frontier: models learning from their own feedback. Not magic. Meta-learning in plain sight."
video_url: "https://www.youtube.com/shorts/zWKmRxChRlA"
video_title: "Learning More About In-Context Learning"
papers:
  - title: "Language Models are Few-Shot Learners"
    url: "https://arxiv.org/abs/2005.14165"
  - title: "What Explains In-Context Learning in Transformers?"
    url: "https://arxiv.org/abs/2202.12837"
  - title: "Transformers Learn In-Context by Gradient Descent"
    url: "https://arxiv.org/abs/2212.07677"
  - title: "Improving Interactive In-Context Learning from Natural Language Feedback"
    url: "https://arxiv.org/abs/2602.16066"
series: "Machine Learning"
series_part: 5
---

<img src="{{ '/assets/images/posts/block-framework.webp' | relative_url }}" class="post-marker" alt="">

It was 2020 when GPT-3 shocked everyone. It could learn from examples in the query---without updating its weights. We called it In-Context Learning. But was it magic, or was it doing something deeper?

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [ICL Revisited](https://www.youtube.com/shorts/zWKmRxChRlA)<br>[![Video](https://img.youtube.com/vi/zWKmRxChRlA/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/zWKmRxChRlA) |
| **Papers** | [4 References](#references) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Phase 1: The Empirical Discovery (2020)

The GPT-3 paper showed that large models could perform few-shot learning. Give them examples, and they generalize. No gradient updates. No retraining. Just forward passes.

The surprising part was that **scaling alone** seemed to unlock it.

### Paper: Language Models are Few-Shot Learners

**ELI5:** Show a big language model a few examples of a task in your prompt, and it figures out how to do the task---without any retraining. Nobody told it to do this. It just emerged when models got big enough.

**Main idea:** Scale unlocks emergent capabilities. ICL was discovered, not designed.

## Phase 2: Mechanistic Explanations (2022)

By 2022, researchers began probing the internal mechanisms. Several papers proposed that transformers implement **implicit meta-learning**. The model appears to learn during inference by performing gradient-descent-like operations internally.

### Paper: What Explains In-Context Learning in Transformers?

**ELI5:** When you give a transformer examples, its attention layers do something that looks like fitting a simple linear model to those examples---on the fly, during the forward pass. It's not memorizing; it's computing a mini-solution.

**Main idea:** ICL works because attention can simulate linear regression internally.

### Paper: Transformers Learn In-Context by Gradient Descent

**ELI5:** The transformer's forward pass is secretly doing something similar to training. The attention mechanism acts like one step of gradient descent over the examples you provided. Learning happens inside inference.

**Main idea:** ICL is implicit gradient descent---learning hidden inside prediction.

## Phase 3: Engineering the Effect

Once researchers understood that ordering and structure affect ICL, prompt design became less of an art and more of an optimization problem. The quality and arrangement of demonstrations directly shape performance.

ICL became tunable. Researchers could now deliberately improve it rather than just observe it.

## Phase 4: Interactive ICL (2026)

Recent work pushes this further. Models are trained to predict natural language critiques and feedback. If a model can predict what a teacher would say, it can internalize that signal. External correction becomes an internal capability.

### Paper: Improving Interactive In-Context Learning from Natural Language Feedback

**ELI5:** Train a model to guess what feedback a human would give. Now the model has internalized the "teacher" and can improve itself without needing the actual teacher present. Self-correction without weight updates.

**Main idea:** Models can learn to learn from feedback, making ICL interactive and self-improving.

## Beyond Language

Newer work applies ICL to neuroscience discovery, showing that the mechanism is not limited to text tasks. It becomes a flexible reasoning substrate across domains. That's when you know a concept has matured.

## The Arc

| Phase | Era | Key Insight |
|-------|-----|-------------|
| **Discovery** | 2020 | Emerges from scale |
| **Explanation** | 2022 | Implicit gradient descent |
| **Engineering** | 2023-24 | Prompt design as optimization |
| **Self-improvement** | 2026 | Learning from feedback |

## The Deeper Insight

In-Context Learning started as an emergent surprise. Now it's becoming an engineered learning substrate inside transformers.

It was not magic. It was **meta-learning hiding in plain sight**.

<div class="references-section" markdown="1">

## References

| Paper | Link |
|-------|------|
| Language Models are Few-Shot Learners (GPT-3) | [arXiv:2005.14165](https://arxiv.org/abs/2005.14165) |
| What Explains In-Context Learning in Transformers? | [arXiv:2202.12837](https://arxiv.org/abs/2202.12837) |
| Transformers Learn In-Context by Gradient Descent | [arXiv:2212.07677](https://arxiv.org/abs/2212.07677) |
| Improving Interactive ICL from Natural Language Feedback | [arXiv:2602.16066](https://arxiv.org/abs/2602.16066) |


</div>

---

*ICL started as "whoa, it works." Now we understand "why it works." Next: engineering it deliberately.*

