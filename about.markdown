---
layout: page
title: About Blog
nav_title: About
permalink: /about/
---

# Software Wrighter Lab

A blog exploring AI coding agents, systems programming, and practical machine learning. Comments are not enabled here, but are welcome via [Discord](https://discord.com/invite/Ctzk5uHggZ), YouTube comments per video, and GitHub issues per repo.

{% include toc.html %}

<div class="resource-box" markdown="1">

| Connect | Link |
|---------|------|
| **Discord** | [SW Lab Discord](https://discord.com/invite/Ctzk5uHggZ) |
| **GitHub** | [softwarewrighter](https://github.com/softwarewrighter)<br>[All orgs ↓](#github-orgs) |
| **YouTube** | [@SoftwareWrighter](https://www.youtube.com/@SoftwareWrighter) |

</div>

## About the Author

<div class="author-section" markdown="1">

<img src="{{ '/assets/images/posts/welcome/avatar.webp' | relative_url }}" class="about-avatar no-invert" alt="Mike Wright">

Mike Wright is a software engineer with a passion for exploring the intersection of AI and software development. This blog documents experiments, insights, and practical applications in the rapidly evolving landscape of AI-assisted programming.

</div>

<style>
.author-section {
  display: flow-root; /* Contains the avatar float locally so it
                        doesn't leak into the next section, without
                        clearing the outer TOC/link-box floats. */
}

.about-avatar {
  float: left;
  width: 150px;
  margin: 0 1.5rem 1rem 0;
  border-radius: 8px;
}

@media (max-width: 480px) {
  .about-avatar {
    float: none;
    display: block;
    margin: 0 auto 1rem auto;
  }
}
</style>

## Topics Covered

- **AI Coding Agents & Multi-Agent Orchestration** — Claude Code, opencode/GLM-5, and building systems like [All-Together-Now](https://github.com/sw-vibe-coding/all-together-now) that coordinate multiple agents through mailboxes, shared wikis, and per-user OS-level isolation.
- **The COR24 Embedded Stack** — A retro-inspired compiler ecosystem on custom FPGA hardware: p-code VMs, a self-hosting toolchain, and language implementations (Pascal, PL/SW, SNOBOL4, BASIC, APL, Fortran, Prolog, and more).
- **Systems Programming in Rust** — Supporting tools: [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) (saga workflows), reg-rs (regression testing), [rust-to-prolog](https://github.com/sw-vibe-coding/rust-to-prolog), [fuzzit](https://github.com/sw-cli-tools/fuzzit) (LLM-guided fuzz testing), wiki-rs.
- **Practical Machine Learning** — [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl): a DSL for ML experiments covering tokenizers, tiny language models, attention, training loops, and an Apple MLX backend.
- **Language-Building Techniques** — Reference implementations, cross-compilation, self-hosting, and vendoring — how to build a compiler stack that stands on itself. See [language-building-tech.md](https://github.com/sw-embed/web-sw-cor24-demos/blob/main/docs/language-building-tech.md).
- **Emacs & Developer Ergonomics** — SVG-based graphics in Emacs buffers (PaperBanana styling), slides, charts, and presentation tooling.
- **Sharpen the Saw Sundays** — Weekly snapshots of investment in tools, infrastructure, and toolchains, so the feature work on top goes faster.
- **Throwback Thursday (TBT)** — Revisiting classic programming languages and techniques: UNIVAC time-sharing games, TRS-80 BASIC listings, vector-graphics arcade, APL, and programming history.
- **Vibe Coding** — Describing what you want, letting AI agents do the translation, iterating. The opposite of typing magazine listings in by hand.

## GitHub Organizations {#github-orgs}

Projects are split across focused GitHub organizations by theme:

<style>
.org-link {
  display: inline-block;
  text-align: center;
  text-decoration: none;
}

.org-link:hover .org-name {
  text-decoration: underline;
}

.org-avatar {
  display: block;
  width: 96px;
  height: 96px;
  border-radius: 10px;
  margin: 0 auto 0.5em auto;
}

.org-name {
  display: block;
  font-weight: 600;
  white-space: nowrap;
}

#github-orgs ~ table td,
#github-orgs ~ table th {
  padding: 18px 20px;
  vertical-align: middle;
}

#github-orgs ~ table td:first-child,
#github-orgs ~ table th:first-child {
  width: 1%;
  text-align: center;
}
</style>

| Organization | Focus |
|--------------|-------|
| <a href="https://github.com/orgs/sw-cli-tools/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-cli-tools.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-cli-tools</span></a> | Command-line tools (fuzzit and friends) |
| <a href="https://github.com/orgs/sw-comp-history/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-comp-history.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-comp-history</span></a> | Computing history and retrocomputing artifacts |
| <a href="https://github.com/orgs/sw-emacs/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-emacs.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-emacs</span></a> | Emacs packages and SVG-based graphics experiments |
| <a href="https://github.com/orgs/sw-embed/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-embed.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-embed</span></a> | Embedded stacks — hardware, compilers, and languages across multiple targets (COR24 today, other platforms as they come online) |
| <a href="https://github.com/orgs/sw-langtools/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-langtools.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-langtools</span></a> | Programming language tooling: parsers, compilers, interpreters |
| <a href="https://github.com/orgs/sw-ml-study/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-ml-study.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-ml-study</span></a> | Machine-learning projects, including sw-MLPL |
| <a href="https://github.com/orgs/sw-vibe-coding/repositories" class="org-link no-external-icon"><img src="https://github.com/sw-vibe-coding.png?size=192" class="org-avatar" alt=""><span class="org-name">sw-vibe-coding</span></a> | Vibe-coded AI-agent projects: All-Together-Now, agentrail-rs, rust-to-prolog, reg-rs |

<p class="orgs-footnote"><em>These are a subset of active GitHub organizations — more may be added as new project themes emerge.</em></p>

<style>
.orgs-footnote {
  margin-top: 0.8em;
  font-size: 0.9em;
  color: var(--text-secondary, #666);
}
</style>
