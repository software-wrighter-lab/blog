---
layout: post
title: "Saw #2: reg-rs, avoid-compaction, and agentrail-rs"
date: 2026-03-15 10:00:00 -0800
categories: [rust, tools, developer-workflow]
tags: [rust, reg-rs, avoid-compaction, agentrail-rs, sharpen-the-saw, cli, developer-tools, ai-agents, regression-testing, workflow]
keywords: "sharpen the saw, reg-rs, avoid-compaction, agentrail-rs, regression testing, context management, ICRL, in-context reinforcement learning, Rust CLI, agent workflow, saga, git-friendly testing, structured handoffs"
author: Software Wrighter
abstract: "Three Rust CLI tools getting foundational upgrades: reg-rs moves to git-friendly text-based test definitions, avoid-compaction structures multi-session AI workflows with saga/step handoffs, and agentrail-rs adds in-context reinforcement learning to push agent reliability from 75% toward deterministic."
series: "Sharpen the Saw Sundays"
series_part: 2
repo_url: "https://github.com/sw-cli-tools/reg-rs"
video_url: "https://www.youtube.com/watch?v=TkdNCJi2jBA"
video_title: "Sharpening 3 Rust Dev Tools"
---

<img src="{{ '/assets/images/posts/block-saw-circle-handle.webp' | relative_url }}" class="post-marker no-invert" alt="">

Welcome back to the [Sharpen the Saw](/series/#sharpen-the-saw-sundays) series, where I maintain existing tools, vibe-code new ones, and try new approaches to development workflows. Three tools, one pattern: each one hit a ceiling that required rethinking how it stores and shares information. This week covers reg-rs migrating from binary to text-based test definitions, avoid-compaction structuring multi-session AI agent workflows, and agentrail-rs adding reinforcement learning from an agent's own success history.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repos** | [sw-cli-tools/reg-rs](https://github.com/sw-cli-tools/reg-rs), [softwarewrighter/avoid-compaction](https://github.com/softwarewrighter/avoid-compaction), [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Video** | [Sharpening 3 Rust Dev Tools](https://www.youtube.com/watch?v=TkdNCJi2jBA) |
| **References** | [Links and Resources](#references) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## reg-rs: Three Improvements to Regression Testing

[reg-rs](https://github.com/sw-cli-tools/reg-rs) captures command output as golden baselines and flags regressions on re-run. This round of sharpening addressed three friction points: clunky commands, opaque binary storage, and noisy output.

### Shell Aliases

The full command syntax (`reg-rs run -p my_test -v`) gets old fast. Shell aliases in `source-rg.sh` cut it to 4 characters with tab completion in zsh and bash:

| Alias | Action | Example |
|-------|--------|---------|
| `rnrg` | Run tests | `rnrg my_test -v` |
| `adrg` | Create test | `adrg my_test 'echo hi'` |
| `lsrg` | List tests | `lsrg` |
| `shrg` | Show details | `shrg my_test -vv` |
| `uprg` | Rebase baselines | `uprg my_test` |
| `rsrg` | Reset results | `rsrg my_test` |
| `rmrg` | Remove test | `rmrg old_test` |
| `mgrg` | Migrate .tdb to .rgt | `mgrg` |
| `strg` | Status dashboard | `strg` |

Muscle memory builds fast. `hlrg` prints the full cheat sheet with examples.

### Git-Friendly .rgt Format

The legacy `.tdb` format stored tests in SQLite binary files. `git diff` showed noise, merge conflicts were unresolvable, and new developers needed setup scripts. Regression tests are documentation---they define what your CLI *actually does*---so hiding them in binary blobs defeated the purpose.

The new `.rgt` format splits each test across git-tracked text files:

| File | Contents | Tracked? |
|------|----------|----------|
| `test.rgt` | TOML spec (command, timeout, preprocessing) | Yes |
| `test.out` | Expected stdout baseline | Yes |
| `test.err` | Expected stderr (only if non-empty) | Yes |
| `test.tdb` | Runtime cache | No (gitignored) |

A test definition reads like documentation:

```toml
command = "myapp --version"
timeout = 10
exit_code = 0
desc = "Version string format check"
preprocess = "jq --sort-keys"
diff_mode = "json"
```

`reg-rs create` now writes `.rgt` directly---no intermediate `.tdb` step. Existing tests migrate with `mgrg`. PR reviewers see exactly what changed and why, `git clone` inherits every test, and merge conflicts resolve with standard tools.

### Output Verbosity Controls

Previously, running tests dumped SQL debug info and full diffs regardless of context. Now output scales to what you need:

| Flag | Output |
|------|--------|
| *(none)* | Summary line: `3 passed, 1 failed (of 4 total)` |
| `-v` | + failure details (diff counts per test) |
| `-vv` | + full diff output |
| `-q` | Nothing---exit code only |

Exit codes are now meaningful too: `0` for all pass, `1` for regressions detected, `2` for errors. This makes reg-rs usable in CI pipelines where you check `$?` rather than parse output.

<div class="resource-box" markdown="1">

**Sharpen the Saw** --- Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) is about preserving and enhancing your greatest asset: yourself and your tools. In software, that means taking time to fix accumulated friction, update dependencies, and learn new frameworks---even when shipping features feels more urgent. The payoff compounds: every hour spent sharpening saves many more down the line.

</div>

## avoid-compaction: Structured Multi-Session Agent Workflows

[avoid-compaction](https://github.com/softwarewrighter/avoid-compaction) solves a problem anyone using AI coding agents hits eventually: context death. Long conversations get automatically compacted---the system summarizes older messages to make room for new ones, losing decisions, constraints, and procedural knowledge along the way.

### The Insight

Rather than fighting compaction with longer context windows, avoid-compaction embraces frequent restarts as a feature. Each restart gives the agent a full, fresh context window. The trick is making handoffs explicit and structured so nothing is lost between sessions.

### The Saga/Step Model

Work is organized into **sagas** (projects) composed of **steps** (focused units of work):

```
.avoid-compaction/
  saga.toml                    # name, status, current step
  plan.md                      # evolving project plan
  planned-steps.md             # upcoming steps preview
  steps/001-add-routes/
    step.toml                  # status, description, context files
    prompt.md                  # what the agent was told to do
    summary.md                 # what the agent actually did
  steps/002-add-tests/
    ...
```

Each session follows the same loop:

1. New Claude session starts with fresh context
2. Agent runs `next` to see the current step's prompt and context
3. Agent does the work
4. Agent runs `complete` with a summary and next-step definition
5. User restarts Claude
6. Next session picks up exactly where the last left off

### Why This Matters

The difference is reliability. Without structured handoffs, session 4 of a complex feature often forgets constraints from session 1. The agent improvises, makes contradictory decisions, or redoes work. With avoid-compaction:

- **Every session starts with full context** for its specific task
- **Summaries accumulate** so later sessions can reference earlier decisions
- **The plan evolves** as work reveals new insights
- **Nothing is lost** to compaction---it's all in the filesystem

### Current Improvements

The tool is going through a refactoring sequence to meet code quality standards:

1. **Merging small command modules** into larger, cohesive modules
2. **Extracting shared display logic** into reusable formatters
3. **Workspace conversion** to split concerns across crates
4. **Session crate extraction** for reusable JSONL handling

Each spike is low-to-medium risk, guided by the principle that smaller modules with clear responsibilities are easier to test, review, and extend.

## agentrail-rs: Learning from Success

[agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) is the evolution of avoid-compaction, adding a critical capability: **In-Context Reinforcement Learning (ICRL)**. Where avoid-compaction structures handoffs, agentrail-rs teaches agents from their own history.

### The 75% Problem

I use AI coding agents for more than coding---TTS audio generation, video compositing, file manipulation, and other multi-step production tasks. In practice, agents succeed about 75% of the time on these workflows. The failures aren't random---they're procedural: the agent forgets which API to call, which flags to use, which client library to reference, or how to validate output.

The traditional approach---writing instructions in markdown files like `AGENTS.md` or `CLAUDE.md`---isn't reliable. Even when rules, instructions, and prohibitions are present, agents often ignore them. Claude, when called out, will say *"You're right, I should have done that"*---and a few moments later make the same kind of mistake. Bigger prompts and more examples hit diminishing returns. The agent needs to learn from *reward-based examples*---both good and bad---delivered in-context, not static documentation it may or may not follow. That's the core idea behind ICRL: show the agent what worked, what didn't, and let the rewards guide its next attempt.

### How ICRL Works

After each step, agentrail-rs records a trajectory:

```
state → action → result → reward
```

Successful trajectories are stored at `.agentrail/trajectories/{task_type}/run_NNN.json`. When the agent hits the same task type in a new session, the CLI retrieves the top N successful trajectories and injects them into the prompt: *"Here's how you succeeded at this before."*

The agent reads its own success patterns and self-corrects---no weight updates, no fine-tuning, no training pipeline. Just examples from its own history, delivered in context.

### Four Step Types

agentrail-rs distinguishes what needs an agent from what doesn't:

| Step Type | Who Executes | Example |
|-----------|-------------|---------|
| **Meta** | Agent | Prepare handoff packets with success examples |
| **Production** | Agent | Execute semantic work using prepared context |
| **Deterministic** | Machine | Run TTS generation, video composition (no agent needed) |
| **Validation** | Machine | Check outputs, record rewards for ICRL |

Deterministic steps can't fail due to agent forgetfulness---they're hard-specified. Validation steps create the reward signals that make ICRL work.

### Architecture

The project is structured as a five-crate Cargo workspace:

| Crate | Purpose | Status |
|-------|---------|--------|
| `agentrail-core` | Domain model, trajectories, handoff packets | Complete |
| `agentrail-store` | Persistence (saga, step, trajectory, session) | Complete |
| `agentrail-cli` | CLI commands | Stub |
| `agentrail-exec` | Deterministic job executors | Stub |
| `agentrail-validate` | Output validators | Stub |

The core and store crates are done. The next phase wires up the CLI, then deterministic execution, then the full ICRL retrieval and injection loop.

### The Expected Payoff

Once the trajectory system is live (I just started vibe-coding it today), agents working on repetitive task types should see reliability climb from ~75% toward deterministic. Each success makes the next attempt more likely to succeed, without any manual intervention. The goal is a self-improving loop: agents learn their own procedures through experience.

## Three Problems, Three Approaches

These projects aren't related by a common architecture or shared abstraction. They're related because each one solves a different productivity problem I keep hitting:

- **reg-rs** catches regressions that slip in whenever a feature is added or a fix applied---the kind of silent breakage that unit tests don't cover because they test behavior, not actual output.
- **avoid-compaction** is a direct reaction to Claude Code auto-compacting multiple times per day, with noticeable performance degradation after each compaction. Structured restarts with explicit handoffs beat a slowly decaying context window.
- **agentrail-rs** tackles the opposite problem: not forgetting, but *improvising*. LLMs are probabilistic, and Claude keeps trying new (failing) approaches to routine tasks instead of sticking with the proven-working ones it has used and documented before. ICRL feeds successful trajectories back into context so the agent repeats what works.

Different problems, different solutions, same goal: spend less time fighting tools and more time building.

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **reg-rs** | [github.com/sw-cli-tools/reg-rs](https://github.com/sw-cli-tools/reg-rs) |
| **avoid-compaction** | [github.com/softwarewrighter/avoid-compaction](https://github.com/softwarewrighter/avoid-compaction) |
| **agentrail-rs** | [github.com/sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Decision Transformer** | [Chen et al., 2021](https://arxiv.org/abs/2106.01345) --- framing RL as sequence modeling |
| **Transformers Learn TD Methods** | [Wang et al., ICLR 2025](https://arxiv.org/abs/2405.13861) --- transformers simulate temporal-difference learning in-context |
| **OmniRL** | [2025](https://arxiv.org/abs/2502.02869) --- transformer architecture emulating actor-critic RL in-context |
| **Reflexion** | [Shinn et al., NeurIPS 2023](https://arxiv.org/abs/2303.11366) --- verbal self-reflection for agent improvement |
| **Voyager** | [Wang et al., 2023](https://arxiv.org/abs/2305.16291) --- open-ended learning agent with skill library |
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |

</div>

---

*Habit 7: Sharpen the Saw. Spend less time fighting tools, more time building.*
