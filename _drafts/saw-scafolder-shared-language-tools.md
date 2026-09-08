---
layout: post
title: "Saw (10/?): Scafolder and Shared Language Tooling"
date: 2027-05-10 00:15:00 -0700
categories: [tools, compilers, emulators, languages, rust, productivity]
tags: [sharpen-the-saw, scafolder, code-generation, rust, language-tools, emulators, instruction-sets, ibm-1130, rca-cdp1802, sw-lang-tools, live-demos, simulated-io, iterm2, terminal-workflow, parallel-agents, devgroup, claude, codex, opencode]
keywords: "Scafolder code generator, language tooling, ISA implementation, emulator scaffolding, Rust crates, shared language tools, IBM 1130 emulator, RCA CDP1802 emulator, simulated I/O, cassette tape drive simulation, video output simulation, seven-segment display simulation, printer simulation, paper tape simulation, live demos, iTerm2 tab sorting, terminal watermarks, parallel AI agents, devgroup, unprivileged Linux users, Claude, Codex, opencode"
author: Software Wrighter
abstract: "Scafolder turns the repeated shape of ISA and emulator projects into generated structure: shared crates, shared UI patterns, and shared simulated I/O so the next IBM 1130, RCA CDP1802, or other software-history machine gets to a live visual demo faster. A small iTerm2 tab-sorting script and a tighter devgroup account setup keep parallel agent work navigable and contained."
series: "Sharpen the Saw Sundays"
series_part: 10
---

<img src="/assets/images/posts/block-generator.png" class="post-marker no-invert" alt="Block-print generator" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

Tenth Sharpen the Saw update. [Last time](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/) the theme was *collaboration infrastructure*: glyph entry, editor support, snippet sharing, and pluggable peripheral buses. This week the theme is *scaffolding*: turning a pile of one-off emulator and language prototypes into a repeatable project factory.

The concrete tool is **Scafolder**, a code generator for the shared shape of the Software Wrighter computer-history projects. The broader move is a new GitHub organization, **sw-lang-tools**, where the reusable pieces can live together: generation code, base crates, UI conventions, demo harnesses, and the common machinery that should not be copied by hand into every IBM 1130, RCA CDP1802, or next-machine experiment.

</div>

<!--more-->

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---generators, editor support, test harnesses, emulators, simulated devices, and live-demo infrastructure---so the feature work on top goes faster.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Scafolder** | Link forthcoming |
| **sw-lang-tools** | Link forthcoming |
| **Prior Post** | [Saw (9/?): Espanso, Kate, ShareX, and Pluggable I2C Devices on COR24](/2026/05/03/saw-espanso-kate-sharex-cor24-i2c-pluggable/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Repeated Shape

The early sw-comp-history projects each started honestly: pick an interesting machine, build enough of an emulator to make it move, build enough of a UI to make it visible, then write the smallest examples that prove the system is alive. That is a good way to learn a machine. It is also a good way to accumulate drift.

The IBM 1130 prototype has one set of project conventions. The RCA CDP1802 prototype has another. Other machines want the same things but keep asking for them with slightly different file layouts, crate boundaries, command names, and browser-demo assumptions. None of that difference is the point of the project. The point is the machine: its instruction set, its memory model, its I/O habits, the way programmers actually experienced it.

So the question changed from "how do I build the next emulator?" to "what is the part of an emulator project I should only design once?"

The answer is larger than a template:

- **Instruction-set structure**: opcode tables, decode helpers, addressing modes, disassembly hooks, trace formatting, and tests that keep those pieces honest.
- **Runtime shell**: a CPU step loop, memory abstraction, reset/load paths, execution limits, breakpoints, and a place for device ticks.
- **Project shape**: crates, docs, examples, CI, demo assets, and release plumbing that should be boring from the first commit.
- **Browser-demo shape**: controls, memory/register views, trace panes, sample programs, visual I/O surfaces, and a deployment target.
- **Shared I/O vocabulary**: cassette tape, paper tape, printer, video, seven-segment LEDs, serial terminals, and other devices that recur across old machines.

Scafolder exists to generate that shape before the machine-specific work begins.

## Sorting the Agent Cockpit

There was also a smaller, very practical sharpening this week: an iTerm2 script that sorts tabs by **watermark**---the end of the working path, usually the repo name.

That sounds minor until the workflow has twenty terminal tabs open, each one hosting an agent interaction in a different repo. At that scale, tab order becomes state. If the IBM 1130 work, CDP1802 work, shared crates, web demos, and generator repos are scattered by open time, every context switch starts with a search problem. If the tabs sort by repo watermark, the terminal layout becomes a map of the active project set.

The script is deliberately small. It does not try to become a session manager. It just reads the tab identity from the visible path watermark and reorders the iTerm2 tabs so related work stays findable. That is enough. With parallel agents running across a subset of the sw-comp-history and sw-lang-tools repos, a few seconds saved per tab switch turns into real attention saved over an afternoon.

This is the same theme as Scafolder at a smaller scale: remove the repeated orientation cost. A generated emulator project removes "where does this file go?" from the next ISA. Sorted iTerm2 tabs remove "which terminal was that repo in?" from the next agent handoff.

## Devgroup: Write Access by Repo

The other parallel-agent change was more structural: the **devgroup** setup now has more unprivileged Linux user accounts, with each account arranged around one writable repo.

Each account can run the agent tool I need for that task---Claude, Codex, or opencode---but its filesystem permissions are intentionally narrow: write access to the repo it owns, read access to the other repos it may need for context. That distinction matters when twenty agents are alive at once. A language repo often needs to read a sibling emulator, demo site, or shared crate; it does not need permission to casually edit all of them.

This is a response to a very real failure mode: when multiple agents have broad write access across many repos, one of them eventually "helps" in the wrong place. It fixes a test by editing a dependency repo. It updates generated output in a sibling project. It follows a relative path out of its assignment and leaves changes somewhere that looked local from inside the terminal session.

Per-repo write boundaries turn that class of mistake into a permissions error instead of a cleanup job. The agent can still inspect neighboring projects, quote APIs, and adapt to the shape of the whole workspace. It just cannot commit accidental edits outside its lane.

That makes the terminal workflow and the filesystem workflow line up: one iTerm2 tab watermark, one Linux user, one writable repo, one agent assignment. The structure is simple enough to use repeatedly, and strict enough that parallelism does not depend on remembering which tab is allowed to touch which files.

## Why a Generator Instead of Another Starter Repo?

A starter repo is a snapshot. It helps once, at creation time, then each child project drifts away. Six months later the starter has better tests, a better demo shell, or a better crate split, and every existing project has to rediscover that improvement manually.

A generator can be a living contract. If the shared shape changes, the generator changes. New projects get the new shape immediately, and existing projects can be compared against it intentionally instead of by memory.

That matters because the next wave of projects is not one emulator. It is a family of language and machine experiments:

- IBM 1130 work that wants a better path from historical source to visible execution.
- RCA CDP1802 work that wants a clean emulator core and demo surface without copying unrelated IBM 1130 assumptions.
- Future software-history machines where the first interesting milestone should be "run a small program and show the I/O", not "spend a week arranging crates".

The generator does not remove the hard parts. It removes the boring uncertainty around the hard parts.

## The sw-lang-tools Split

The supporting repos are moving into **sw-lang-tools** because the reusable layer needs a neutral home. The old pattern was project-local: a helper starts in one emulator, gets useful, and then the next emulator either copies it or silently diverges from it.

The new pattern is library-and-generator first:

| Layer | Belongs in the Shared Tooling |
|-------|-------------------------------|
| Decode-table helpers | Yes |
| Disassembly formatting conventions | Yes |
| Trace/event schemas | Yes |
| Browser demo component patterns | Yes |
| Cassette/printer/display device models | Mostly yes |
| Machine-specific timing quirks | No, but the interface should leave room |
| Historical sample programs | Project-specific |

That boundary is important. The goal is not to flatten every machine into the same emulator. The goal is to stop rebuilding the same scaffolding before the machine's actual personality can show up.

## Faster ISAs, Earlier Demos

The practical payoff is ISA throughput. Every instruction set has its own details, but the implementation workflow usually rhymes:

1. Describe the opcode map.
2. Generate or write the decoder.
3. Attach execution semantics.
4. Add disassembly and trace output.
5. Validate with small programs and known examples.
6. Expose enough state in a browser demo that a reader can see what happened.

When steps 1, 2, 4, 5, and 6 have shared machinery, the project spends more time on step 3: the actual semantics of the machine. That is the part worth hand-coding carefully.

This also changes the blog cadence. A machine-history post is better when it can point at a live thing. Screenshots are fine. Static disassembly is useful. But a reader clicking "Run" and watching state change is a different category of explanation. The sooner a project reaches that state, the sooner the writing can focus on the interesting historical and technical questions instead of the scaffolding.

## Visual I/O as a First-Class Target

The next version of these projects should not stop at registers and memory dumps. Old machines were experienced through devices:

- **Cassette tape drives** for loading, saving, and hearing the rhythm of data movement.
- **Video output** for machines where the display is the program's main surface.
- **Seven-segment LED displays** for tiny systems where a few glowing digits are the whole UI.
- **Printers** for line-oriented systems where output was meant to become paper.
- **Paper tape** for the physical feel of loading and punching programs.
- **Serial terminals** for the common bridge between old software and modern browser demos.

Those devices should not be late extras. They should be part of the generated project shape: a device trait, event stream, UI slot, sample fixture, and screenshot/video path from the beginning. Even if a new emulator starts with a fake device, the seam is there for the real one.

That is the real reason Scafolder belongs in Sharpen the Saw. The tool is not just saving setup time. It is moving the demo bar earlier. A new ISA should get to "here is a program running, here is what it printed, here is what lit up" before the energy of the experiment fades.

## Replacing Prototypes Without Losing Them

There is a risk in unifying prototypes: the prototype was often where the insight happened. A messy emulator might contain the first correct understanding of a weird addressing mode. A one-off demo might encode exactly the UI trick that made a machine understandable.

So "replace" does not mean "throw away." It means re-home the insight:

- Keep the project-specific facts with the project.
- Move the reusable mechanics into shared crates.
- Move the repeatable file layout and boilerplate into Scafolder.
- Preserve working examples as fixtures before rewriting anything.
- Promote the best UI ideas into shared demo components only after they prove useful twice.

The test for the migration is simple: after the rewrite, the IBM 1130 should feel more like the IBM 1130, not less. The RCA CDP1802 should feel more like the CDP1802, not like a generic emulator wearing a new opcode table. Shared tooling should make the specific machine easier to see.

## What's Next

**Scafolder**: Firm up the first generated project shape: workspace layout, base crates, CLI commands, demo shell, sample program fixtures, and the initial device interfaces.

**sw-lang-tools**: Move the reusable generator and base-crate work into the new org, then wire the resource links into this post once the repos are ready to point at.

**Existing prototypes**: Pick one project as the migration test. IBM 1130 is the natural candidate if the goal is a richer historical demo; CDP1802 is the natural candidate if the goal is a compact ISA with visible I/O quickly.

**Visual demos**: Define the first reusable simulated devices: probably a terminal, a seven-segment display, and a tape-like loader before the more elaborate printer/video surfaces.

---

*The point of scaffolding is not to make every project the same. It is to get through the sameness faster, so the old machines can be strange in public.*
