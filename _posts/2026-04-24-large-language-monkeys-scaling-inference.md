---
layout: post
title: "Large-Language-Monkeys: Scaling Inference, Not Models"
date: 2026-04-24 00:15:00 -0700
categories: [llm, machine-learning, research]
tags: [machine-learning, large-language-monkeys, repeated-sampling, inference-scaling, verification, swe-bench, small-models, agents, coverage, scaling-laws]
keywords: "Large Language Monkeys, repeated sampling, inference scaling, coverage, pass@k, SWE-bench, DeepSeek-Coder, verification, infinite monkey theorem, majority voting, reward models, Groq, Llama 3, binary search, power law, Brown 2024"
author: Software Wrighter
abstract: "Brown et al. (2024) show that repeatedly sampling a small model --- and letting an automatic verifier pick the best candidate --- can beat single-shot frontier models at a fraction of the cost. DeepSeek-Coder-V2-Instruct jumps from 15.9% to 56% on SWE-bench Lite with 250 samples. Coverage scales log-linearly across four orders of magnitude. This post walks the paper, reproduces the shape of the result on an 8B vs 70B binary_search demo, and asks what changes when inference itself is the scaling axis."
series: "Machine Learning"
series_part: 7
repo_url: "https://github.com/sw-ml-study/Repeated-Sampling"
papers:
  - title: "Large Language Monkeys: Scaling Inference Compute with Repeated Sampling"
    url: "https://arxiv.org/abs/2407.21787"
---

<img src="{{ '/assets/images/posts/block-monkeys-typing.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 340px;">

<div style="overflow: hidden;" markdown="1">

"Large Language Monkeys" is Brown et al.'s (2024) nod to the infinite-monkey theorem, reframed for inference-time compute: if you let a model take many attempts at a problem --- and you have an automatic verifier to pick the right one --- the odds of at least one attempt being correct climb faster than almost any intuition predicts. Coverage (the fraction of problems solved by *any* sample) scales log-linearly with the number of samples over **four orders of magnitude**. Small models stop being second-class. Inference becomes a first-class scaling axis.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Paper** | [arXiv 2407.21787](https://arxiv.org/abs/2407.21787) (Brown et al., 2024) |
| **Code (forked)** | [sw-ml-study/Repeated-Sampling](https://github.com/sw-ml-study/Repeated-Sampling) |
| **Code (original)** | [weagan/Repeated-Sampling](https://github.com/weagan/Repeated-Sampling) |
| **Demo notebook** | [llm_monkeys_function_demo.ipynb](https://github.com/sw-ml-study/Repeated-Sampling/blob/main/llm_monkeys_function_demo.ipynb) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Reframing

The last decade of scaling has been about *making the model bigger* --- more parameters, more training data, more pretraining compute. Inference, by contrast, has stayed boringly fixed: prompt in, answer out, one attempt, take it or leave it.

This paper asks: what if the *attempts* are a scaling axis?

| Traditional scaling | Inference-time scaling |
|---------------------|------------------------|
| Bigger model | More attempts per problem |
| More training data | Repeated sampling |
| Single-shot answer | Multi-sample + verification |

The mental model shifts from *"the model knows the answer"* to *"the model generates candidate answers; we search for a correct one."* Under that lens, an LLM isn't an oracle --- it's a stochastic proposer wired to a verifier.

## The Core Loop

Strip it to essentials:

```
for i in 1..N:
    sample_i = model(prompt, temperature=T)
    score_i  = verifier(sample_i)
return best(sample_i)
```

Two components:

1. **Generator** — an LLM producing candidate solutions. Temperature drives diversity.
2. **Verifier / selector** — unit tests (code), symbolic checker (math), heuristic scorer. Picks the right answer from the pile.

The verifier is the load-bearing piece. When it's cheap and deterministic (code → run tests; math proof → check with Lean), repeated sampling is devastatingly effective. When it isn't (essays, subjective tasks, open-ended reasoning), the scaling story gets thornier.

## What the Numbers Look Like

The paper's headline result on SWE-bench Lite:

| Setup | Solve rate |
|-------|-----------:|
| DeepSeek-Coder-V2-Instruct, 1 sample | 15.9% |
| DeepSeek-Coder-V2-Instruct, 250 samples | **56.0%** |
| Single-sample SOTA at time of writing | 43.0% |

Repeated sampling from a *non-frontier* model blew past the frontier single-sample SOTA on one of the hardest real-world coding benchmarks. Not by a little --- by 13 percentage points.

The cost story hits even harder:

| Configuration | Solve rate | Cost |
|---------------|-----------:|-----:|
| DeepSeek-Coder-V2-Instruct × 5 samples | 29.62% | **$10.80** |
| GPT-4o × 1 sample | 24.00% | $39 |
| Claude 3.5 Sonnet × 1 sample | 26.70% | $51 |

Five DeepSeek attempts beat one attempt from each frontier model at roughly **4× lower cost**. Repeated sampling changes the economics of deploying AI on verifiable tasks.

## The Coverage Scaling Law

The paper models coverage (`c`, probability at least one of `k` samples is correct) as an **exponentiated power law**:

<div style="text-align: center; font-family: Georgia, 'Times New Roman', serif; font-size: 1.3em; font-style: italic; margin: 1.25em 0;">
  c(k) &nbsp;≈&nbsp; exp(a &middot; k<sup>b</sup>)
</div>

where `k` is the number of samples and `a`, `b` are fitted parameters. Across GSM8K, MATH, MiniF2F, SWE-bench Lite, and CodeContests, coverage scales log-linearly with the sample count over four orders of magnitude. On CodeContests with Gemma-2B, coverage climbs from **0.02% at 1 sample to 7.1% at 10k samples** --- that's more than a 350× improvement, purely from adding attempts.

The shape matters. A log-linear curve means every *multiplicative* increase in samples yields a fixed *additive* gain in coverage. Doubling samples → constant boost in solve rate. This is a scaling *law*, not a diminishing-returns saturation. It's why the paper's title matters: enough monkeys, enough time, and Shakespeare emerges from chance. The quantitative claim is that the "enough" is measurable and predictable.

<style>
  /* Stagger sections occupy cols 1-3 / 2-4 / 3-5 of a 5-col grid (60% width).
     Gutter images fill the remaining 2 cols (40%) next to the stagger paragraph. */
  .post-content .stagger { position: relative; }
  .gutter-img-left,
  .gutter-img-right {
    position: absolute;
    top: 0;
    /* 66.67% of a 60%-wide section = 40% of the container = 2 of 5 cols */
    width: 66.67%;
    max-width: none;
    /* Match paragraph height exactly; scale-to-fit without cropping */
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }
  .gutter-img-left  { right: calc(100% + 1.25rem); }
  .gutter-img-right { left:  calc(100% + 1.25rem); }
  @media (max-width: 900px) {
    .gutter-img-left,
    .gutter-img-right {
      position: static;
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 0.5em auto 1em;
    }
  }
</style>

## Weak Models, Smart Sampling

<img src="{{ '/assets/images/posts/block-flying-monkeys-brain-statue.webp' | relative_url }}" class="gutter-img-left no-invert" alt="">

The most important empirical finding for practitioners: *smaller models outperform larger ones at matched compute*, on the right tasks.

On FLOP-matched comparisons across MATH, GSM8K, and MiniF2F, Llama-3-8B-Instruct with more samples achieves higher coverage than Llama-3-70B-Instruct --- at the *same* total inference FLOPs. The 8B model, sampled more aggressively, beats the 70B sampled once.

There are caveats:

- **CodeContests is an exception** — the 70B model stays more cost-effective; the smaller-wins pattern is task-dependent.
- **Verifier quality gates everything.** Coverage gains don't translate into solve-rate gains without a sharp verifier.
- **Majority voting and reward models plateau** beyond a few hundred samples in domains lacking automatic verification. Selection, not generation, is the bottleneck.

But for code, math, and formal proofs --- the workloads where you can *prove* correctness of an individual sample --- the "more small samples" strategy is cheaper *and* better.

## Reproducing the Shape: Binary Search Fix

The accompanying notebook (forked to [sw-ml-study/Repeated-Sampling](https://github.com/sw-ml-study/Repeated-Sampling), original by [weagan](https://github.com/weagan/Repeated-Sampling)) makes the paper's claim tangible on a small budget.

The task: fix a buggy `binary_search` that has an off-by-one (`lo < hi` instead of `<=`) and must return the **first occurrence** of duplicates. Tested against 24 hidden cases.

Two configurations:

- **Big model**: `llama-3.3-70b-versatile`, temperature 0.0, 1 sample.
- **Small model**: `llama-3.1-8b-instant`, temperature 0.8, N samples (where N ∈ {1, 5, 10, 15}).

The core loop:

```python
all_fixes, all_results, coverage = [], [], []

# Generate
for i in range(max(sample_counts)):
    fix = generate_fix(BINARY_SEARCH_TASK, SMALL_MODEL, temperature=0.8)
    all_fixes.append(fix)

# Verify each
for fix in all_fixes:
    passed, _ = test_function(fix, BINARY_SEARCH_TASK)
    all_results.append(passed)

# Cumulative coverage at each N
for n in sample_counts:
    coverage.append(any(all_results[:n]))
```

Separation of generation from verification is the shape of every repeated-sampling system you'll build after this: a batch of stochastic proposers, a deterministic scorer, a selection pass.

### Observed results

- 70B × 1 sample: passes (375 characters of code).
- 8B × 15 samples: **3 out of 15 pass** (20%), but since "coverage" is "at least one passes," the 8B model *wins at every tested N*.
- Cost: 70B @ 1 = $0.00034; 8B @ 15 = $0.00047 (marginally more, for a 15× robustness margin); 8B @ 10 = $0.00031 (cheaper than the single 70B call).

### The temperature sweep

Running 10 samples of the 8B model across six temperatures:

| Temperature | Success rate (10 samples) |
|:-:|:-:|
| 0.0 | 0% |
| 0.5 | 50% |
| **0.8** | **60%** |
| 1.0 | 30% |
| 1.2 | 40% |

Temperature 0.8 is the sweet spot. Colder, and the model produces the same wrong answer every time --- all monkeys compose identical gibberish, so coverage stays at zero. Hotter, and diversity starts corrupting the structure faster than it finds the solution --- monkeys hammering ∞ Shakespeares in parallel but none completing a line. Exploration vs. exploitation, in one experiment, with a neat inverted-U.

This is a pedagogical gem: a single knob controls the trade-off and the wrong setting invalidates the whole approach.

## Where This Connects

Once you see LLMs as stochastic proposers + verifiers, a lot of modern infrastructure makes more sense:

- **CI/CD coding agents.** Tests are the verifier; parallel agent attempts are the samples. "Run the test suite 10 times with 10 different patches" is *exactly* repeated sampling.
- **Multi-agent orchestration.** Each agent is one monkey. Diversity across agents (different prompts, tools, temperatures) is the dispersion that fuels coverage.
- **Tool-augmented LLMs.** Tools execute, execution results verify, model iterates. Three laps around the generator/verifier loop.
- **Cascading models.** Cheap model attempts many times → if all fail, escalate to an expensive model. Cost-tuned coverage scaling.

The paper is, quietly, a manifesto for a particular kind of system: *stop buying smarter models, start building smarter ways to use the ones you have*.

## What Breaks

The limitations are worth naming:

| Issue | Consequence |
|-------|-------------|
| **No verifier** | Majority voting and reward-model scoring plateau beyond a few hundred samples; coverage doesn't translate to solve rate |
| **i.i.d. sampling** | The paper does *not* explore diversity-forcing strategies (re-prompting, retrieval, temperature schedules) --- that's future work |
| **No feedback loop** | Each sample is independent; failed samples don't inform later ones. Agent systems that do use feedback are already departing from pure repeated sampling |
| **Latency** | Total wall-clock time grows unless samples run in parallel. Inference infrastructure has to favor throughput over per-request latency --- a different shape than chatbot serving |
| **Task-dependence** | CodeContests shows the 70B still wins; smaller-beats-larger isn't universal |

Selection is the choke point. Generation scales logarithmically "for free"; turning coverage into answers needs a verifier that itself scales.

## Why It Matters

Three shifts follow from taking this paper seriously:

1. **Smaller models become more useful.** A 7B–13B model with a good verifier and parallel infrastructure can out-solve a 70B–400B single-shot on verifiable workloads.
2. **Systems beat individual models.** The pipeline (generator + verifier + selector + orchestrator) is the product. The model is a component.
3. **Compute orchestration is a core skill.** Batching, scheduling, cost-aware sample allocation, adaptive early-stopping --- these are more leverage-able than model choice on most production workloads.

The paper's closing framing --- *intelligence = search + verification over stochastic outputs* --- isn't a complete theory of intelligence. But it's a useful reduction for the subset of problems where correctness is checkable: which turns out to be a surprisingly large and growing fraction of what we ask LLMs to do.

## What's Next

Open directions the paper gestures at:

- **Learned verifiers.** What happens when the scorer itself is a model, trained to rank candidates? (Reward models plateau; can better selectors scale?)
- **Self-consistency voting** as a middle-ground between pure verification and reward models.
- **Tool-augmented sampling**: samples don't just propose text, they propose *actions* that get executed and verified.
- **Adaptive sample budgets**: spend more where uncertainty is high, less where the first sample already looks good.

The repeated-sampling axis is new enough that most of the engineering is yet to be done. The scaling law is the load-bearing result; the systems that exploit it are still being built.

---

*The paper title is a reference, but not a joke --- with enough attempts and a reliable scorer, an arbitrarily weak model becomes reliable. The leverage is in the scorer. The monkeys are easy.*
