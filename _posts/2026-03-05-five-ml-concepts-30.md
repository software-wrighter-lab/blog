---
layout: post
title: "Five ML Concepts - #30: The Journey So Far"
date: 2026-03-05 00:15:00 -0800
categories: [llm, machine-learning, explainers]
tags: [five-ml-concepts, ml-concepts, series-milestone, machine-learning-education]
keywords: "machine learning concepts, ML education, 30-second explainers, backpropagation, scaling laws, dropout, distribution shift, RAG, reward hacking, neural networks, deep learning, alignment, deployment, five ML concepts series, frontier ML thinking"
author: Software Wrighter
abstract: "Episode 30 marks a milestone: 145 machine learning concepts covered across 30 episodes. From backpropagation to scaling laws, dropout to distribution shift, RAG to reward hacking. This retrospective celebrates the journey and announces what's next: Frontier ML Thinking—one concept, two minutes, deeper implications."
series: "Five ML Concepts"
series_part: 30
video_url: "https://www.youtube.com/shorts/JDtrfiBecNo"
video_title: "Five ML Concepts - 30"
---

<img src="{{ '/assets/images/posts/block-30.webp' | relative_url }}" class="post-marker" alt="">

30 episodes. 145 machine learning concepts.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Full Series** | [Five ML Concepts Episodes 1-29](/series/#five-ml-concepts) |
| **Video** | [Five ML Concepts #30](https://www.youtube.com/shorts/JDtrfiBecNo)<br>[![Video](https://img.youtube.com/vi/JDtrfiBecNo/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/JDtrfiBecNo) |
| **Papers Index** | [Complete Concept Index](#complete-concept-index) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Journey So Far

For the past thirty episodes, we've explored **145 machine learning concepts** in under 30 seconds each.

**From backpropagation to scaling laws.**
From dropout to distribution shift.
From RAG to reward hacking.

We covered:
- **Foundations** — the building blocks of neural networks and learning algorithms
- **Failure modes** — how models break, overfit, forget, and hallucinate
- **Deployment realities** — what happens when models meet production
- **Alignment challenges** — ensuring models do what we actually want

## What's Changing

Machine learning is evolving rapidly. The foundational primitives are now well-established—the concepts we covered form a stable vocabulary.

But new research is reshaping how we *apply* these primitives:
- Memory and retrieval architectures
- Reasoning and planning systems
- Sparsity and efficiency at scale
- Robustness and generalization
- Alignment and safety

30 seconds per concept was a good start. But some ideas deserve more depth.

## What's Next: Frontier ML Thinking

Starting soon: **Frontier ML Thinking**.

One concept. Two minutes. Deeper implications.

We'll explore the cutting edge—ideas from papers published in the last 12 months that build on the foundations we've covered.

## If You're New Here

Start with [Five ML Concepts Episodes 1–29](/series/#five-ml-concepts). Each episode covers five concepts in five minutes total. The full series provides a foundation in modern machine learning vocabulary.

## If You've Been Here the Whole Time

You're ready for the frontier.

---

## Why the Papers Look "Old"

When I tabulated the papers behind the **145 concepts** in this series, something looked odd: almost none of the cited papers were from the last two years.

This is not a mistake—it's a feature of how ML knowledge evolves.

### Seminal papers don't keep getting re-written

Most concepts in this series are *primitives*: backpropagation, transformers, RAG, dropout, calibration, and so on. Each primitive has an **origin paper** that introduced it. Once the primitive exists, later research focuses on:
- Scaling it
- Combining it with other ideas
- Benchmarking it
- Making it more efficient
- Making it safer

That kind of work produces *new papers*, but not new "origin papers."

### What this reveals about the field

The core intellectual breakthroughs of modern ML largely occurred between **2016 and 2022**. The frontier has since shifted from inventing new primitives to:
- **Memory and retrieval systems**
- **Continual learning**
- **Agent architectures**
- **Tool use and planning**
- **Sparsity and efficiency at scale**
- **Alignment and safety**

That's exactly what **Frontier ML Thinking** will explore: ideas from papers published in the last 12 months that build on these foundations.

---

## Complete Concept Index

All 145 concepts organized chronologically by seminal paper year.

<div class="concept-index" markdown="1">

### Pre-1990
{: .era-heading}

<img src="{{ '/assets/images/posts/1950s-rotary-phone.webp' | relative_url }}" class="decade-icon" alt="1950s" title="1950s Rotary Phone"><img src="{{ '/assets/images/posts/1950s-chevy.webp' | relative_url }}" class="decade-icon" alt="1950s" title="1950s Chevy"><img src="{{ '/assets/images/posts/1950s-poodle-dress.webp' | relative_url }}" class="decade-icon" alt="1950s" title="1950s Poodle Dress">

#### 1958
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Perceptron | [Post 5](/2026/02/08/five-ml-concepts-5) &#124; [Video 5](https://www.youtube.com/shorts/8rzKVzfp2PU) &#124; (1958) [The Perceptron](https://psycnet.apa.org/record/1959-09865-001) |

<img src="{{ '/assets/images/posts/1960s-rocket.webp' | relative_url }}" class="decade-icon" alt="1960s" title="1960s Rocket"><img src="{{ '/assets/images/posts/1960s-mustang.webp' | relative_url }}" class="decade-icon" alt="1960s" title="1960s Mustang"><img src="{{ '/assets/images/posts/1960s-miniskirt.webp' | relative_url }}" class="decade-icon" alt="1960s" title="1960s Miniskirt">

#### 1960s
{: .year-heading}

| |
|-|
| None |

<img src="{{ '/assets/images/posts/1970s-calculator.webp' | relative_url }}" class="decade-icon" alt="1970s" title="1970s Calculator"><img src="{{ '/assets/images/posts/1970s-contach.webp' | relative_url }}" class="decade-icon" alt="1970s" title="1970s Countach"><img src="{{ '/assets/images/posts/1970s-bell-bottoms.webp' | relative_url }}" class="decade-icon" alt="1970s" title="1970s Bell Bottoms">

#### 1970s
{: .year-heading}

| |
|-|
| None |

<img src="{{ '/assets/images/posts/1980s-ibm-pc.webp' | relative_url }}" class="decade-icon" alt="1980s" title="1980s IBM PC"><img src="{{ '/assets/images/posts/1980s-DeLorean.webp' | relative_url }}" class="decade-icon" alt="1980s" title="1980s DeLorean"><img src="{{ '/assets/images/posts/1980s-powersuit.webp' | relative_url }}" class="decade-icon" alt="1980s" title="1980s Power Suit">

#### 1986
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Backpropagation | [Post 1](/2026/02/04/five-ml-concepts-1) &#124; [Video 1](https://www.youtube.com/shorts/Zu3zreN8c0Q) &#124; (1986) [Learning representations by back-propagating errors](https://www.nature.com/articles/323533a0) |
| RNN | [Post 11](/2026/02/14/five-ml-concepts-11) &#124; [Video 11](https://www.youtube.com/shorts/95ng2EmBTbA) &#124; (1986) [Learning representations](https://www.nature.com/articles/323533a0) |

#### 1989
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Universal Approximation | [Post 13](/2026/02/16/five-ml-concepts-13) &#124; [Video 13](https://www.youtube.com/shorts/WPAk79_UONE) &#124; (1989) [Approximation by Superpositions](https://www.sciencedirect.com/science/article/abs/pii/0893608089900208) |

<img src="{{ '/assets/images/posts/1990s-laptop.webp' | relative_url }}" class="decade-icon" alt="1990s" title="1990s Laptop"><img src="{{ '/assets/images/posts/1990s-supra.webp' | relative_url }}" class="decade-icon" alt="1990s" title="1990s Supra"><img src="{{ '/assets/images/posts/1990s-grunge.webp' | relative_url }}" class="decade-icon" alt="1990s" title="1990s Grunge">

### 1990s
{: .era-heading}

#### 1995
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Cross-Validation | [Post 7](/2026/02/10/five-ml-concepts-7) &#124; [Video 7](https://www.youtube.com/shorts/YLgwkSiSOWw) &#124; (1995) [A Study of Cross-Validation](https://www.jstor.org/stable/2965703) |

#### 1997
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| LSTM | [Post 22](/2026/02/25/five-ml-concepts-22) &#124; [Video 22](https://www.youtube.com/shorts/kLnD_wn7tLc) &#124; (1997) [Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf) |

#### 1998
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Early Stopping | [Post 13](/2026/02/16/five-ml-concepts-13) &#124; [Video 13](https://www.youtube.com/shorts/WPAk79_UONE) &#124; (1998) [Early Stopping - But When?](https://page.mi.fu-berlin.de/prechelt/Biblio/stop_neurips98.pdf) |

<img src="{{ '/assets/images/posts/2000s-flip-phone.webp' | relative_url }}" class="decade-icon" alt="2000s" title="2000s Flip Phone"><img src="{{ '/assets/images/posts/2000s-Hummer.webp' | relative_url }}" class="decade-icon" alt="2000s" title="2000s Hummer"><img src="{{ '/assets/images/posts/2000s-y2k.webp' | relative_url }}" class="decade-icon" alt="2000s" title="2000s Y2K Fashion">

### 2000s
{: .era-heading}

#### 2000
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Ensembling | [Post 18](/2026/02/21/five-ml-concepts-18) &#124; [Video 18](https://www.youtube.com/shorts/osj1GQxG4uo) &#124; (2000) [Ensemble Methods](https://link.springer.com/chapter/10.1007/3-540-45014-9_1) |

#### 2002
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Cold Start Problems | [Post 14](/2026/02/17/five-ml-concepts-14) &#124; [Video 14](https://www.youtube.com/shorts/OOB56_OARnk) &#124; (2002) [Addressing Cold Start](https://dl.acm.org/doi/10.1145/2365952.2365972) |

#### 2003
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Perplexity | [Post 15](/2026/02/18/five-ml-concepts-15) &#124; [Video 15](https://www.youtube.com/shorts/lkviAtRMgjc) &#124; (2003) [A Neural Probabilistic Language Model](https://www.jmlr.org/papers/volume3/bengio03a/bengio03a.pdf) |

#### 2006
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Autoencoders | [Post 19](/2026/02/22/five-ml-concepts-19) &#124; [Video 19](https://www.youtube.com/shorts/ppoONTOdqJQ) &#124; (2006) [Reducing Dimensionality](https://www.science.org/doi/10.1126/science.1127647) |
| ROC / AUC | [Post 14](/2026/02/17/five-ml-concepts-14) &#124; [Video 14](https://www.youtube.com/shorts/OOB56_OARnk) &#124; (2006) [An Introduction to ROC Analysis](https://www.sciencedirect.com/science/article/abs/pii/S016786550500303X) |

#### 2007
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Precision vs Recall | [Post 12](/2026/02/15/five-ml-concepts-12) &#124; [Video 12](https://www.youtube.com/shorts/jQqyRdQAjPw) &#124; (2007) [The Truth of the F-Measure](https://www.cs.odu.edu/~mukka/cs795sum09dm/Lecturenotes/Day3/F-measure-YS-26Oct07.pdf) |

#### 2009
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| A/B Testing Models | [Post 16](/2026/02/19/five-ml-concepts-16) &#124; [Video 16](https://www.youtube.com/shorts/HdFa9C3ahkw) &#124; (2009) [Controlled Experiments](https://www.exp-platform.com/Documents/GusijDMKD.pdf) |
| Bias-Variance Tradeoff | [Post 8](/2026/02/11/five-ml-concepts-8) &#124; [Video 8](https://www.youtube.com/shorts/iR4DYyzcdk8) &#124; (2009) [Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/) |
| Correlation vs Causation | [Post 19](/2026/02/22/five-ml-concepts-19) &#124; [Video 19](https://www.youtube.com/shorts/ppoONTOdqJQ) &#124; (2009) [Causality](https://www.cambridge.org/core/books/causality/B0046844FAE10CBF274D4ACBDAEB5F5B) |
| Covariate Shift | [Post 19](/2026/02/22/five-ml-concepts-19) &#124; [Video 19](https://www.youtube.com/shorts/ppoONTOdqJQ) &#124; (2009) [Dataset Shift in ML](https://mitpress.mit.edu/9780262170055/) |
| Curriculum Learning | [Post 19](/2026/02/22/five-ml-concepts-19) &#124; [Video 19](https://www.youtube.com/shorts/ppoONTOdqJQ) &#124; (2009) [Curriculum Learning](https://dl.acm.org/doi/10.1145/1553374.1553380) |
| Curse of Dimensionality | [Post 15](/2026/02/18/five-ml-concepts-15) &#124; [Video 15](https://www.youtube.com/shorts/lkviAtRMgjc) &#124; (2009) [Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/) |
| Distribution Shift | [Post 11](/2026/02/14/five-ml-concepts-11) &#124; [Video 11](https://www.youtube.com/shorts/95ng2EmBTbA) &#124; (2009) [Dataset Shift in ML](https://direct.mit.edu/books/edited-volume/3098/Dataset-Shift-in-Machine-Learning) |
| Why ML Is Fragile | [Post 18](/2026/02/21/five-ml-concepts-18) &#124; [Video 18](https://www.youtube.com/shorts/osj1GQxG4uo) &#124; (2009) [Distribution Shift](https://arxiv.org/abs/1903.12261) |
| Why More Data Beats Better Models | [Post 22](/2026/02/25/five-ml-concepts-22) &#124; [Video 22](https://www.youtube.com/shorts/kLnD_wn7tLc) &#124; (2009) [Unreasonable Effectiveness of Data](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/35179.pdf) |

<img src="{{ '/assets/images/posts/2010s-smartphone.webp' | relative_url }}" class="decade-icon" alt="2010s" title="2010s Smartphone"><img src="{{ '/assets/images/posts/2010s-tesla.webp' | relative_url }}" class="decade-icon" alt="2010s" title="2010s Tesla"><img src="{{ '/assets/images/posts/2010s-athleisure.webp' | relative_url }}" class="decade-icon" alt="2010s" title="2010s Athleisure">

### 2010s
{: .era-heading}

#### 2010
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Transfer Learning | [Post 4](/2026/02/07/five-ml-concepts-4) &#124; [Video 4](https://www.youtube.com/shorts/10fb0EjFND8) &#124; (2010) [A Survey on Transfer Learning](https://ieeexplore.ieee.org/document/5288526) |
| Weight Initialization | [Post 15](/2026/02/18/five-ml-concepts-15) &#124; [Video 15](https://www.youtube.com/shorts/lkviAtRMgjc) &#124; (2010) [Understanding Difficulty of Training](https://proceedings.mlr.press/v9/glorot10a.html) |

#### 2011
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Spurious Correlations | [Post 14](/2026/02/17/five-ml-concepts-14) &#124; [Video 14](https://www.youtube.com/shorts/OOB56_OARnk) &#124; (2011) [Unbiased Look at Dataset Bias](https://ieeexplore.ieee.org/document/5995347) |

#### 2012
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| CNN | [Post 10](/2026/02/13/five-ml-concepts-10) &#124; [Video 10](https://www.youtube.com/shorts/lVPnKvi9VdA) &#124; (2012) [ImageNet Classification with Deep CNNs](https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html) |
| Data Leakage | [Post 24](/2026/02/27/five-ml-concepts-24) &#124; [Video 24](https://www.youtube.com/shorts/a_TolJdrnpM) &#124; (2012) [Leakage in Data Mining](https://dl.acm.org/doi/10.1145/2020408.2020496) |

#### 2013
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Adversarial Examples | [Post 25](/2026/02/28/five-ml-concepts-25) &#124; [Video 25](https://www.youtube.com/shorts/eK1t1DW9iTY) &#124; (2013) [Intriguing properties of neural networks](https://arxiv.org/abs/1312.6199) |
| Embedding | [Post 1](/2026/02/04/five-ml-concepts-1) &#124; [Video 1](https://www.youtube.com/shorts/Zu3zreN8c0Q) &#124; (2013) [Word2Vec](https://arxiv.org/abs/1301.3781) |
| Gradient Clipping | [Post 14](/2026/02/17/five-ml-concepts-14) &#124; [Video 14](https://www.youtube.com/shorts/OOB56_OARnk) &#124; (2013) [Difficulty of Training RNNs](https://arxiv.org/abs/1211.5063) |
| Latent Space | [Post 5](/2026/02/08/five-ml-concepts-5) &#124; [Video 5](https://www.youtube.com/shorts/8rzKVzfp2PU) &#124; (2013) [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) |
| Representation Learning | [Post 25](/2026/02/28/five-ml-concepts-25) &#124; [Video 25](https://www.youtube.com/shorts/eK1t1DW9iTY) &#124; (2013) [Representation Learning: A Review](https://arxiv.org/abs/1206.5538) |
| VAEs | [Post 20](/2026/02/23/five-ml-concepts-20) &#124; [Video 20](https://www.youtube.com/shorts/OklW3RTV3I4) &#124; (2013) [Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) |

#### 2014
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Adam | [Post 4](/2026/02/07/five-ml-concepts-4) &#124; [Video 4](https://www.youtube.com/shorts/10fb0EjFND8) &#124; (2014) [Adam: Stochastic Optimization](https://arxiv.org/abs/1412.6980) |
| Attention | [Post 2](/2026/02/05/five-ml-concepts-2) &#124; [Video 2](https://www.youtube.com/shorts/-Y4T0_vETB4) &#124; (2014) [Neural Machine Translation](https://arxiv.org/abs/1409.0473) |
| Dropout | [Post 9](/2026/02/12/five-ml-concepts-9) &#124; [Video 9](https://www.youtube.com/shorts/C5ICKluukxI) &#124; (2014) [Dropout: Prevent Overfitting](https://jmlr.org/papers/v15/srivastava14a.html) |
| Encoder-Decoder | [Post 10](/2026/02/13/five-ml-concepts-10) &#124; [Video 10](https://www.youtube.com/shorts/lVPnKvi9VdA) &#124; (2014) [Sequence to Sequence Learning](https://arxiv.org/abs/1409.3215) |
| GRU | [Post 21](/2026/02/24/five-ml-concepts-21) &#124; [Video 21](https://www.youtube.com/shorts/P8OO48Nu6ik) &#124; (2014) [Gated Recurrent Neural Networks](https://arxiv.org/abs/1412.3555) |
| Memory-Augmented Networks | [Post 27](/2026/03/02/five-ml-concepts-27) &#124; [Video 27](https://www.youtube.com/shorts/K7ucT7NV45g) &#124; (2014) [Neural Turing Machines](https://arxiv.org/abs/1410.5401) |
| Mode Collapse | [Post 24](/2026/02/27/five-ml-concepts-24) &#124; [Video 24](https://www.youtube.com/shorts/a_TolJdrnpM) &#124; (2014) [Generative Adversarial Nets](https://arxiv.org/abs/1406.2661) |
| Overfitting | [Post 3](/2026/02/06/five-ml-concepts-3) &#124; [Video 3](https://www.youtube.com/shorts/U-_yZZdZurU) &#124; (2014) [Dropout](https://jmlr.org/papers/v15/srivastava14a.html) |
| Regularization | [Post 6](/2026/02/09/five-ml-concepts-6) &#124; [Video 6](https://www.youtube.com/shorts/ROje4xAMJKg) &#124; (2014) [Dropout](https://jmlr.org/papers/v15/srivastava14a.html) |
| Temperature | [Post 2](/2026/02/05/five-ml-concepts-2) &#124; [Video 2](https://www.youtube.com/shorts/-Y4T0_vETB4) &#124; (2014) [Properties of Neural MT](https://arxiv.org/abs/1409.1259) |

#### 2015
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Batch Normalization | [Post 16](/2026/02/19/five-ml-concepts-16) &#124; [Video 16](https://www.youtube.com/shorts/HdFa9C3ahkw) &#124; (2015) [Batch Normalization](https://arxiv.org/abs/1502.03167) |
| Distillation | [Post 10](/2026/02/13/five-ml-concepts-10) &#124; [Video 10](https://www.youtube.com/shorts/lVPnKvi9VdA) &#124; (2015) [Distilling Knowledge](https://arxiv.org/abs/1503.02531) |
| Label Smoothing | [Post 25](/2026/02/28/five-ml-concepts-25) &#124; [Video 25](https://www.youtube.com/shorts/eK1t1DW9iTY) &#124; (2015) [Rethinking Inception](https://arxiv.org/abs/1512.00567) |
| Learning Rate | [Post 2](/2026/02/05/five-ml-concepts-2) &#124; [Video 2](https://www.youtube.com/shorts/-Y4T0_vETB4) &#124; (2015) [Cyclical Learning Rates](https://arxiv.org/abs/1506.01186) |
| Tokenization | [Post 3](/2026/02/06/five-ml-concepts-3) &#124; [Video 3](https://www.youtube.com/shorts/U-_yZZdZurU) &#124; (2015) [Subword Units](https://arxiv.org/abs/1508.07909) |

#### 2016
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Activation Functions | [Post 4](/2026/02/07/five-ml-concepts-4) &#124; [Video 4](https://www.youtube.com/shorts/10fb0EjFND8) &#124; (2016) [Deep Learning Book](https://www.deeplearningbook.org/) |
| Benchmark Leakage | [Post 17](/2026/02/20/five-ml-concepts-17) &#124; [Video 17](https://www.youtube.com/shorts/Xk2hkc0bgi4) &#124; (2016) [Rethinking Inception](https://arxiv.org/abs/1512.00567) |
| Checkpointing | [Post 13](/2026/02/16/five-ml-concepts-13) &#124; [Video 13](https://www.youtube.com/shorts/WPAk79_UONE) &#124; (2016) [Sublinear Memory Cost](https://arxiv.org/abs/1604.06174) |
| Epoch | [Post 18](/2026/02/21/five-ml-concepts-18) &#124; [Video 18](https://www.youtube.com/shorts/osj1GQxG4uo) &#124; (2016) [Deep Learning Book](https://www.deeplearningbook.org/) |
| Gradient Descent | [Post 2](/2026/02/05/five-ml-concepts-2) &#124; [Video 2](https://www.youtube.com/shorts/-Y4T0_vETB4) &#124; (2016) [Overview of Gradient Descent](https://arxiv.org/abs/1609.04747) |
| Inference | [Post 9](/2026/02/12/five-ml-concepts-9) &#124; [Video 9](https://www.youtube.com/shorts/C5ICKluukxI) &#124; (2016) [Deep Learning Book](https://www.deeplearningbook.org/) |
| Learning Rate Schedules | [Post 23](/2026/02/26/five-ml-concepts-23) &#124; [Video 23](https://www.youtube.com/shorts/jzCxPAX80zY) &#124; (2016) [SGDR: Warm Restarts](https://arxiv.org/abs/1608.03983) |
| Loss Surface Sharpness | [Post 23](/2026/02/26/five-ml-concepts-23) &#124; [Video 23](https://www.youtube.com/shorts/jzCxPAX80zY) &#124; (2016) [Large-Batch Training](https://arxiv.org/abs/1609.04836) |
| Reward Hacking | [Post 24](/2026/02/27/five-ml-concepts-24) &#124; [Video 24](https://www.youtube.com/shorts/a_TolJdrnpM) &#124; (2016) [Concrete Problems in AI Safety](https://arxiv.org/abs/1606.06565) |
| Softmax | [Post 11](/2026/02/14/five-ml-concepts-11) &#124; [Video 11](https://www.youtube.com/shorts/95ng2EmBTbA) &#124; (2016) [Deep Learning Book](https://www.deeplearningbook.org/) |
| Train/Validation/Test Split | [Post 16](/2026/02/19/five-ml-concepts-16) &#124; [Video 16](https://www.youtube.com/shorts/HdFa9C3ahkw) &#124; (2016) [Deep Learning Book](https://www.deeplearningbook.org/) |

#### 2017
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Batch Size | [Post 12](/2026/02/15/five-ml-concepts-12) &#124; [Video 12](https://www.youtube.com/shorts/jQqyRdQAjPw) &#124; (2017) [Large-Batch Training](https://arxiv.org/abs/1609.04836) |
| Calibration | [Post 13](/2026/02/16/five-ml-concepts-13) &#124; [Video 13](https://www.youtube.com/shorts/WPAk79_UONE) &#124; (2017) [On Calibration](https://arxiv.org/abs/1706.04599) |
| Catastrophic Forgetting | [Post 15](/2026/02/18/five-ml-concepts-15) &#124; [Video 15](https://www.youtube.com/shorts/lkviAtRMgjc) &#124; (2017) [Overcoming Catastrophic Forgetting](https://arxiv.org/abs/1612.00796) |
| Conditional Computation | [Post 28](/2026/03/03/five-ml-concepts-28) &#124; [Video 28](https://www.youtube.com/shorts/kKafshoP-7s) &#124; (2017) [Sparsely-Gated MoE](https://arxiv.org/abs/1701.06538) |
| Context Window | [Post 7](/2026/02/10/five-ml-concepts-7) &#124; [Video 7](https://www.youtube.com/shorts/YLgwkSiSOWw) &#124; (2017) [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| Elastic Weight Consolidation | [Post 27](/2026/03/02/five-ml-concepts-27) &#124; [Video 27](https://www.youtube.com/shorts/K7ucT7NV45g) &#124; (2017) [Overcoming Catastrophic Forgetting (EWC)](https://arxiv.org/abs/1612.00796) |
| Gradient Noise | [Post 20](/2026/02/23/five-ml-concepts-20) &#124; [Video 20](https://www.youtube.com/shorts/OklW3RTV3I4) &#124; (2017) [SGD as Approximate Bayesian Inference](https://arxiv.org/abs/1704.04289) |
| Loss Function | [Post 3](/2026/02/06/five-ml-concepts-3) &#124; [Video 3](https://www.youtube.com/shorts/U-_yZZdZurU) &#124; (2017) [Survey of Loss Functions](https://arxiv.org/abs/1701.00160) |
| Miscalibration | [Post 25](/2026/02/28/five-ml-concepts-25) &#124; [Video 25](https://www.youtube.com/shorts/eK1t1DW9iTY) &#124; (2017) [On Calibration](https://arxiv.org/abs/1706.04599) |
| Mixed Precision | [Post 8](/2026/02/11/five-ml-concepts-8) &#124; [Video 8](https://www.youtube.com/shorts/iR4DYyzcdk8) &#124; (2017) [Mixed Precision Training](https://arxiv.org/abs/1710.03740) |
| MoE | [Post 11](/2026/02/14/five-ml-concepts-11) &#124; [Video 11](https://www.youtube.com/shorts/95ng2EmBTbA) &#124; (2017) [Sparsely-Gated MoE](https://arxiv.org/abs/1701.06538) |
| OOD Inputs | [Post 12](/2026/02/15/five-ml-concepts-12) &#124; [Video 12](https://www.youtube.com/shorts/jQqyRdQAjPw) &#124; (2017) [Detecting Misclassified Examples](https://arxiv.org/abs/1610.02136) |
| Optimization vs Generalization | [Post 16](/2026/02/19/five-ml-concepts-16) &#124; [Video 16](https://www.youtube.com/shorts/HdFa9C3ahkw) &#124; (2017) [Rethinking Generalization](https://arxiv.org/abs/1611.03530) |
| Overconfidence | [Post 16](/2026/02/19/five-ml-concepts-16) &#124; [Video 16](https://www.youtube.com/shorts/HdFa9C3ahkw) &#124; (2017) [On Calibration](https://arxiv.org/abs/1706.04599) |
| Parameter Routing | [Post 27](/2026/03/02/five-ml-concepts-27) &#124; [Video 27](https://www.youtube.com/shorts/K7ucT7NV45g) &#124; (2017) [Sparsely-Gated MoE](https://arxiv.org/abs/1701.06538) |
| Positional Encoding | [Post 6](/2026/02/09/five-ml-concepts-6) &#124; [Video 6](https://www.youtube.com/shorts/ROje4xAMJKg) &#124; (2017) [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| Self-Attention | [Post 7](/2026/02/10/five-ml-concepts-7) &#124; [Video 7](https://www.youtube.com/shorts/YLgwkSiSOWw) &#124; (2017) [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| Sparse Activation | [Post 28](/2026/03/03/five-ml-concepts-28) &#124; [Video 28](https://www.youtube.com/shorts/kKafshoP-7s) &#124; (2017) [Sparsely-Gated MoE](https://arxiv.org/abs/1701.06538) |
| Transformer | [Post 1](/2026/02/04/five-ml-concepts-1) &#124; [Video 1](https://www.youtube.com/shorts/Zu3zreN8c0Q) &#124; (2017) [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| Uncertainty Estimation | [Post 20](/2026/02/23/five-ml-concepts-20) &#124; [Video 20](https://www.youtube.com/shorts/OklW3RTV3I4) &#124; (2017) [Uncertainties in Bayesian DL](https://arxiv.org/abs/1703.04977) |
| Warmup | [Post 24](/2026/02/27/five-ml-concepts-24) &#124; [Video 24](https://www.youtube.com/shorts/a_TolJdrnpM) &#124; (2017) [Accurate Large Minibatch SGD](https://arxiv.org/abs/1706.02677) |
| Why Interpretability Is Hard | [Post 20](/2026/02/23/five-ml-concepts-20) &#124; [Video 20](https://www.youtube.com/shorts/OklW3RTV3I4) &#124; (2017) [Rigorous Science of Interpretability](https://arxiv.org/abs/1702.08608) |

#### 2018
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| BERT | [Post 6](/2026/02/09/five-ml-concepts-6) &#124; [Video 6](https://www.youtube.com/shorts/ROje4xAMJKg) &#124; (2018) [BERT: Pre-training](https://arxiv.org/abs/1810.04805) |
| Concept Drift vs Data Drift | [Post 17](/2026/02/20/five-ml-concepts-17) &#124; [Video 17](https://www.youtube.com/shorts/Xk2hkc0bgi4) &#124; (2018) [Learning under Concept Drift](https://ieeexplore.ieee.org/document/8496795) |
| Inductive Bias | [Post 12](/2026/02/15/five-ml-concepts-12) &#124; [Video 12](https://www.youtube.com/shorts/jQqyRdQAjPw) &#124; (2018) [Relational Inductive Biases](https://arxiv.org/abs/1806.01261) |
| Loss Landscapes | [Post 14](/2026/02/17/five-ml-concepts-14) &#124; [Video 14](https://www.youtube.com/shorts/OOB56_OARnk) &#124; (2018) [Visualizing Loss Landscape](https://arxiv.org/abs/1712.09913) |
| Pre-training | [Post 5](/2026/02/08/five-ml-concepts-5) &#124; [Video 5](https://www.youtube.com/shorts/8rzKVzfp2PU) &#124; (2018) [BERT](https://arxiv.org/abs/1810.04805) |

#### 2019
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Data Augmentation | [Post 26](/2026/03/01/five-ml-concepts-26) &#124; [Video 26](https://www.youtube.com/shorts/DDsrO5oYXa8) &#124; (2019) [Survey on Data Augmentation](https://journalofbigdata.springeropen.com/articles/10.1186/s40537-019-0197-0) |
| Double Descent | [Post 25](/2026/02/28/five-ml-concepts-25) &#124; [Video 25](https://www.youtube.com/shorts/eK1t1DW9iTY) &#124; (2019) [Deep Double Descent](https://arxiv.org/abs/1912.02292) |
| GPT | [Post 7](/2026/02/10/five-ml-concepts-7) &#124; [Video 7](https://www.youtube.com/shorts/YLgwkSiSOWw) &#124; (2019) [Language Models are Unsupervised Multitask Learners](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) |
| Inference Parallelism | [Post 28](/2026/03/03/five-ml-concepts-28) &#124; [Video 28](https://www.youtube.com/shorts/kKafshoP-7s) &#124; (2019) [Megatron-LM](https://arxiv.org/abs/1909.08053) |
| Lottery Ticket Hypothesis | [Post 28](/2026/03/03/five-ml-concepts-28) &#124; [Video 28](https://www.youtube.com/shorts/kKafshoP-7s) &#124; (2019) [The Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635) |
| Manifold Hypothesis | [Post 26](/2026/03/01/five-ml-concepts-26) &#124; [Video 26](https://www.youtube.com/shorts/DDsrO5oYXa8) &#124; (2019) [Intro to VAEs](https://arxiv.org/abs/1906.02691) |
| Monitoring & Drift Detection | [Post 15](/2026/02/18/five-ml-concepts-15) &#124; [Video 15](https://www.youtube.com/shorts/lkviAtRMgjc) &#124; (2019) [Detecting Dataset Shift](https://arxiv.org/abs/1810.11953) |
| Replay Buffers | [Post 27](/2026/03/02/five-ml-concepts-27) &#124; [Video 27](https://www.youtube.com/shorts/K7ucT7NV45g) &#124; (2019) [Experience Replay](https://arxiv.org/abs/1811.11682) |
| Weight Decay | [Post 17](/2026/02/20/five-ml-concepts-17) &#124; [Video 17](https://www.youtube.com/shorts/Xk2hkc0bgi4) &#124; (2019) [Decoupled Weight Decay](https://arxiv.org/abs/1711.05101) |

<img src="{{ '/assets/images/posts/2020s-vr-headset.webp' | relative_url }}" class="decade-icon" alt="2020s" title="2020s VR Headset"><img src="{{ '/assets/images/posts/2020s-cybertruck.webp' | relative_url }}" class="decade-icon" alt="2020s" title="2020s Cybertruck"><img src="{{ '/assets/images/posts/2020s-streetwear.webp' | relative_url }}" class="decade-icon" alt="2020s" title="2020s Streetwear">

### 2020s
{: .era-heading}

#### 2020
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Diffusion Models | [Post 8](/2026/02/11/five-ml-concepts-8) &#124; [Video 8](https://www.youtube.com/shorts/iR4DYyzcdk8) &#124; (2020) [Denoising Diffusion](https://arxiv.org/abs/2006.11239) |
| Few-shot Learning | [Post 10](/2026/02/13/five-ml-concepts-10) &#124; [Video 10](https://www.youtube.com/shorts/lVPnKvi9VdA) &#124; (2020) [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) |
| Fine-tuning | [Post 3](/2026/02/06/five-ml-concepts-3) &#124; [Video 3](https://www.youtube.com/shorts/U-_yZZdZurU) &#124; (2020) [Survey on Transfer Learning](https://arxiv.org/abs/1911.02685) |
| ICL (In-Context Learning) | [Post 5](/2026/02/08/five-ml-concepts-5) &#124; [Video 5](https://www.youtube.com/shorts/8rzKVzfp2PU) &#124; (2020) [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) |
| Neural Collapse | [Post 29](/2026/03/04/five-ml-concepts-29) &#124; [Video 29](https://www.youtube.com/shorts/BekrSjZ7f-4) &#124; (2020) [Prevalence of Neural Collapse](https://arxiv.org/abs/2008.08186) |
| Preference Learning | [Post 18](/2026/02/21/five-ml-concepts-18) &#124; [Video 18](https://www.youtube.com/shorts/osj1GQxG4uo) &#124; (2020) [Learning to Summarize](https://arxiv.org/abs/2009.01325) |
| Prompting | [Post 6](/2026/02/09/five-ml-concepts-6) &#124; [Video 6](https://www.youtube.com/shorts/ROje4xAMJKg) &#124; (2020) [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) |
| RAG | [Post 10](/2026/02/13/five-ml-concepts-10) &#124; [Video 10](https://www.youtube.com/shorts/lVPnKvi9VdA) &#124; (2020) [Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401) |
| Scaling Laws | [Post 17](/2026/02/20/five-ml-concepts-17) &#124; [Video 17](https://www.youtube.com/shorts/Xk2hkc0bgi4) &#124; (2020) [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) |
| Self-Training Instability | [Post 29](/2026/03/04/five-ml-concepts-29) &#124; [Video 29](https://www.youtube.com/shorts/BekrSjZ7f-4) &#124; (2020) [Understanding Self-Training](https://arxiv.org/abs/2010.02194) |
| Shortcut Learning | [Post 13](/2026/02/16/five-ml-concepts-13) &#124; [Video 13](https://www.youtube.com/shorts/WPAk79_UONE) &#124; (2020) [Shortcut Learning in DNNs](https://arxiv.org/abs/2004.07780) |

#### 2021
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Failure Analysis | [Post 19](/2026/02/22/five-ml-concepts-19) &#124; [Video 19](https://www.youtube.com/shorts/ppoONTOdqJQ) &#124; (2021) [Practical ML for CV](https://www.oreilly.com/library/view/practical-machine-learning/9781098102357/) |
| Human-in-the-Loop Systems | [Post 20](/2026/02/23/five-ml-concepts-20) &#124; [Video 20](https://www.youtube.com/shorts/OklW3RTV3I4) &#124; (2021) [Human-in-the-Loop ML](https://www.manning.com/books/human-in-the-loop-machine-learning) |
| Latency vs Throughput | [Post 12](/2026/02/15/five-ml-concepts-12) &#124; [Video 12](https://www.youtube.com/shorts/jQqyRdQAjPw) &#124; (2021) [Efficient Large-Scale Training](https://arxiv.org/abs/2104.04473) |
| LoRA | [Post 3](/2026/02/06/five-ml-concepts-3) &#124; [Video 3](https://www.youtube.com/shorts/U-_yZZdZurU) &#124; (2021) [LoRA: Low-Rank Adaptation](https://arxiv.org/abs/2106.09685) |
| Mechanistic Interpretability | [Post 29](/2026/03/04/five-ml-concepts-29) &#124; [Video 29](https://www.youtube.com/shorts/BekrSjZ7f-4) &#124; (2021) [Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) |
| Quantization | [Post 9](/2026/02/12/five-ml-concepts-9) &#124; [Video 9](https://www.youtube.com/shorts/C5ICKluukxI) &#124; (2021) [Survey of Quantization Methods](https://arxiv.org/abs/2103.13630) |
| RoPE | [Post 6](/2026/02/09/five-ml-concepts-6) &#124; [Video 6](https://www.youtube.com/shorts/ROje4xAMJKg) &#124; (2021) [RoFormer](https://arxiv.org/abs/2104.09864) |
| SAM | [Post 29](/2026/03/04/five-ml-concepts-29) &#124; [Video 29](https://www.youtube.com/shorts/BekrSjZ7f-4) &#124; (2021) [Sharpness-Aware Minimization](https://arxiv.org/abs/2010.01412) |
| VLM | [Post 4](/2026/02/07/five-ml-concepts-4) &#124; [Video 4](https://www.youtube.com/shorts/10fb0EjFND8) &#124; (2021) [CLIP](https://arxiv.org/abs/2103.00020) |

#### 2022
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| Chain of Thought | [Post 11](/2026/02/14/five-ml-concepts-11) &#124; [Video 11](https://www.youtube.com/shorts/95ng2EmBTbA) &#124; (2022) [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903) |
| Compute Optimality Hypothesis | [Post 28](/2026/03/03/five-ml-concepts-28) &#124; [Video 28](https://www.youtube.com/shorts/kKafshoP-7s) &#124; (2022) [Chinchilla](https://arxiv.org/abs/2203.15556) |
| Constitutional AI | [Post 26](/2026/03/01/five-ml-concepts-26) &#124; [Video 26](https://www.youtube.com/shorts/DDsrO5oYXa8) &#124; (2022) [Constitutional AI](https://arxiv.org/abs/2212.08073) |
| Cost vs Quality Tradeoffs | [Post 18](/2026/02/21/five-ml-concepts-18) &#124; [Video 18](https://www.youtube.com/shorts/osj1GQxG4uo) &#124; (2022) [Efficient Transformers](https://arxiv.org/abs/2009.06732) |
| Emergent Behavior | [Post 23](/2026/02/26/five-ml-concepts-23) &#124; [Video 23](https://www.youtube.com/shorts/jzCxPAX80zY) &#124; (2022) [Emergent Abilities](https://arxiv.org/abs/2206.07682) |
| Flash Attention | [Post 9](/2026/02/12/five-ml-concepts-9) &#124; [Video 9](https://www.youtube.com/shorts/C5ICKluukxI) &#124; (2022) [FlashAttention](https://arxiv.org/abs/2205.14135) |
| Goodhart's Law | [Post 26](/2026/03/01/five-ml-concepts-26) &#124; [Video 26](https://www.youtube.com/shorts/DDsrO5oYXa8) &#124; (2022) [Goodhart's Law and ML](https://arxiv.org/abs/2210.01911) |
| Grokking | [Post 29](/2026/03/04/five-ml-concepts-29) &#124; [Video 29](https://www.youtube.com/shorts/BekrSjZ7f-4) &#124; (2022) [Grokking](https://arxiv.org/abs/2201.02177) |
| KV Cache | [Post 8](/2026/02/11/five-ml-concepts-8) &#124; [Video 8](https://www.youtube.com/shorts/iR4DYyzcdk8) &#124; (2022) [Fast Transformer Decoding](https://arxiv.org/abs/2211.05102) |
| RLHF | [Post 9](/2026/02/12/five-ml-concepts-9) &#124; [Video 9](https://www.youtube.com/shorts/C5ICKluukxI) &#124; (2022) [Training with Human Feedback](https://arxiv.org/abs/2203.02155) |
| Shadow Deployment | [Post 17](/2026/02/20/five-ml-concepts-17) &#124; [Video 17](https://www.youtube.com/shorts/Xk2hkc0bgi4) &#124; (2022) [Reliable ML](https://www.oreilly.com/library/view/reliable-machine-learning/9781098106218/) |
| Speculative Decoding | [Post 5](/2026/02/08/five-ml-concepts-5) &#124; [Video 5](https://www.youtube.com/shorts/8rzKVzfp2PU) &#124; (2022) [Fast Inference via Speculative Decoding](https://arxiv.org/abs/2211.17192) |
| Superposition | [Post 4](/2026/02/07/five-ml-concepts-4) &#124; [Video 4](https://www.youtube.com/shorts/10fb0EjFND8) &#124; (2022) [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html) |

#### 2023
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| DPO | [Post 2](/2026/02/05/five-ml-concepts-2) &#124; [Video 2](https://www.youtube.com/shorts/-Y4T0_vETB4) &#124; (2023) [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) |
| GQA | [Post 7](/2026/02/10/five-ml-concepts-7) &#124; [Video 7](https://www.youtube.com/shorts/YLgwkSiSOWw) &#124; (2023) [GQA: Training Generalized Multi-Query](https://arxiv.org/abs/2305.13245) |
| Hallucination | [Post 1](/2026/02/04/five-ml-concepts-1) &#124; [Video 1](https://www.youtube.com/shorts/Zu3zreN8c0Q) &#124; (2023) [Survey of Hallucination](https://arxiv.org/abs/2202.03629) |
| Jailbreaks | [Post 21](/2026/02/24/five-ml-concepts-21) &#124; [Video 21](https://www.youtube.com/shorts/P8OO48Nu6ik) &#124; (2023) [Jailbroken](https://arxiv.org/abs/2307.02483) |
| Mamba | [Post 1](/2026/02/04/five-ml-concepts-1) &#124; [Video 1](https://www.youtube.com/shorts/Zu3zreN8c0Q) &#124; (2023) [Mamba: Linear-Time Sequence Modeling](https://arxiv.org/abs/2312.00752) |
| Model Editing | [Post 27](/2026/03/02/five-ml-concepts-27) &#124; [Video 27](https://www.youtube.com/shorts/K7ucT7NV45g) &#124; (2023) [Editing LLMs](https://arxiv.org/abs/2305.13172) |
| Model Steerability | [Post 22](/2026/02/25/five-ml-concepts-22) &#124; [Video 22](https://www.youtube.com/shorts/kLnD_wn7tLc) &#124; (2023) [Controllable Generation](https://arxiv.org/abs/2305.17014) |
| Planning vs Prediction | [Post 21](/2026/02/24/five-ml-concepts-21) &#124; [Video 21](https://www.youtube.com/shorts/P8OO48Nu6ik) &#124; (2023) [AI/ML Gap](https://arxiv.org/abs/2310.02029) |
| Prompt Injection | [Post 21](/2026/02/24/five-ml-concepts-21) &#124; [Video 21](https://www.youtube.com/shorts/P8OO48Nu6ik) &#124; (2023) [Prompt Injection Attack](https://arxiv.org/abs/2306.05499) |
| RSFT | [Post 22](/2026/02/25/five-ml-concepts-22) &#124; [Video 22](https://www.youtube.com/shorts/kLnD_wn7tLc) &#124; (2023) [Scaling Mathematical Reasoning](https://arxiv.org/abs/2308.01825) |
| Tool Use | [Post 23](/2026/02/26/five-ml-concepts-23) &#124; [Video 23](https://www.youtube.com/shorts/jzCxPAX80zY) &#124; (2023) [Toolformer](https://arxiv.org/abs/2302.04761) |

#### 2024
{: .year-heading}

| Concept | Links (Post, Video, Paper) |
|---------|-------|
| MLA | [Post 8](/2026/02/11/five-ml-concepts-8) &#124; [Video 8](https://www.youtube.com/shorts/iR4DYyzcdk8) &#124; (2024) [DeepSeek-V2](https://arxiv.org/abs/2405.04434) |

#### 2025 and Beyond
{: .year-heading}

Since 2024, no widely-adopted new fundamental ML concepts have emerged. Research has shifted from inventing primitives to composing, scaling, and applying them. Papers from 2025–2026 will be covered in our new series: **[Frontier ML Thinking](/series/#frontier-ml-thinking)**—one concept, two minutes, deeper implications.

</div>

---

*Thank you for following along. The journey continues.*
