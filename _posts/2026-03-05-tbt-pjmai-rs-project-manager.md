---
layout: post
title: "TBT #6: PJMAI-RS - A Shell That Knows Your Projects"
date: 2026-03-05 00:15:00 -0800
categories: [tbt, cli-tools, rust]
tags: [tbt, pjmai, rust, cli, project-management, shell, developer-tools]
keywords: "pjmai, project manager, rust cli, shell integration, project switching, developer tools, exit codes, directory navigation"
author: Software Wrighter
abstract: "PJMAI-RS is a Rust CLI tool that maintains a registry of your projects and lets you switch between them instantly with short aliases. The clever part: it uses exit codes to signal a shell wrapper, allowing a subprocess to change your working directory."
series: "Throwback Thursday"
series_part: 6
video_url: "https://www.youtube.com/watch?v=4eWyhWjF3dg"
video_title: "Scaling Up Your Vibe Coding"
repo_url: "https://github.com/sw-cli-tools/pjmai-rs"
---

<img src="{{ '/assets/images/posts/tbt-pjmai-smartphone.webp' | relative_url }}" class="post-marker" alt="">

Every developer has faced this: you remember the repo name, but not the full path. You start typing `cd ~/github/` and then tab-complete your way through three levels of directories, or worse, open a file browser. For a task you do dozens of times a day, that friction adds up.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [PJMAI-RS: Project Context Switching](https://www.youtube.com/watch?v=4eWyhWjF3dg)<br>[![Video](https://img.youtube.com/vi/4eWyhWjF3dg/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=4eWyhWjF3dg) |
| **Repo** | [sw-cli-tools/pjmai-rs](https://github.com/sw-cli-tools/pjmai-rs) |
| **Follow-up** | [Navigation History and Fuzzy Completion](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/) |
| **Motivation** | [Why I Built This](#motivation) |
| **References** | [Historical Context](#historical-context) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div style="clear: both;"></div>

## What is PJMAI-RS?

PJMAI-RS (Project Manager AI - Rust) is a CLI tool that maintains a registry of your project directories. You give each project a short nickname, then switch to it instantly:

```bash
chpj blog     # jump to ~/github/softwarewrighter/blog-planning
chpj api      # jump to ~/work/services/customer-api
chpj notes    # open ~/Documents/notes.md in your editor
```

No more remembering paths. No more tab-completion marathons. Just type the nickname.

## The Shell Integration Problem

Here's the fundamental challenge: CLI tools run as subprocesses. A subprocess cannot change the parent shell's working directory. When your Rust binary calls `chdir()`, it changes *its own* directory, then exits---leaving your shell exactly where it started.

Most tools solve this with wrapper functions that `eval` output or `source` scripts. PJMAI-RS uses a cleaner approach: **exit code signaling**.

| Exit Code | Meaning | Shell Action |
|-----------|---------|--------------|
| 0 | Normal output | Print to console |
| 2 | Directory path | Execute `cd <path>` |
| 3 | File path | Execute `source <path>` |
| 4 | Error | Display error message |
| 5 | Script | Execute `eval <output>` |

A minimal shell wrapper checks the exit code and takes the appropriate action. The Rust binary stays focused on logic; the shell handles environment manipulation.

## Quick Switching Features

### Fuzzy Matching

PJMAI-RS finds projects using cascading match strategies:

1. **Exact match**: `blog` matches `blog`
2. **Prefix match**: `bl` matches `blog`
3. **Substring match**: `log` matches `blog`
4. **Case-insensitive**: `BLOG` matches `blog`

Typos and partial names usually work. If multiple projects match, it lists them.

### Stack Navigation

Sometimes you need to check something in another project, then return:

```bash
chpj webapp       # working on the webapp
pspj api          # push webapp to stack, switch to api
# ... check something ...
popj              # pop back to webapp
```

The stack handles nested pushes. You can dive three projects deep and pop back through each one.

## Per-Project Environments

Each project can define its own environment:

```bash
evpj api NODE_ENV=development    # set env var for this project
evpj api PATH_PREPEND=./bin      # add to PATH when entering
```

Or create a `.pjmai.sh` file in the project root:

```bash
# .pjmai.sh
export DATABASE_URL="postgres://localhost/dev"
source .venv/bin/activate
```

PJMAI-RS uses hash-based approval: the first time it sees a `.pjmai.sh`, it asks for permission and records the hash. Future visits source it automatically. If the file changes, it asks again.

This prevents drive-by script execution while enabling seamless per-project setup.

## Auto-Detection

PJMAI-RS detects common development environments:

| Environment | Detection | Action |
|-------------|-----------|--------|
| Python venv | `.venv/`, `venv/` directories | Activate virtual environment |
| Node.js | `package.json` + `.nvmrc` | Switch Node version |
| Rust | `Cargo.toml` | Set up cargo environment |
| direnv | `.envrc` | Respect direnv configuration |

When you `chpj` to a Python project, it activates the venv. Jump to a Node project, it switches to the right Node version. No manual setup.

## Repository Scanning

Don't want to add projects one by one? Scan for them:

```bash
scpj ~/github     # find all git repos
```

PJMAI-RS walks the directory tree, finds git repositories, parses remote URLs to suggest groups (by GitHub org, for example), and generates unique nicknames. Collisions get suffixes.

A single command can populate your entire project list.

<div class="resource-box" markdown="1">

### Motivation {#motivation}

On one of my development systems I have 200 repositories, and each system I use has a different set of repos. I was spending too much time using cd, du, fd, and ls commands to find and navigate, so I updated my private pjm1 project to this public pjmai-rs project. I want to have AI Agents use this tool to navigate related projects. I want this tool to use AI to analyze status of projects, and more. I want AI Agents to not have to explicitly activate virtual Python environments. I want to restrict AI agents via nono.

</div>

## AI Agent Support

The design explicitly supports AI coding agents:

- **`--json` flag**: Every command outputs machine-readable JSON
- **Context export**: `pjmai context` generates project metadata optimized for system prompts
- **Structured errors**: Errors include suggestions the agent can act on

When an AI agent needs to know "what project am I in?" or "what build commands are available?", it can query PJMAI-RS directly.

## Project Groups

Projects are automatically grouped by directory structure. If you have multiple repos under `~/github/sw-cli-tools/`, they form a group:

```bash
$ shgp
Group: sw-cli-tools
Path: ~/github/sw-cli-tools
Projects: 4

$ shgp --all
Group: sw-cli-tools
Path: ~/github/sw-cli-tools
Projects: 4

  umap2                ~/github/sw-cli-tools/umap
  favicon2             ~/github/sw-cli-tools/favicon
> pjmai-rs             ~/github/sw-cli-tools/pjmai-rs
  sw-cli2              ~/github/sw-cli-tools/sw-cli
```

The `>` marks the current project. Groups are inferred from git remote URLs during scanning, so projects from the same GitHub org cluster together.

## Shell Aliases

After running `pjmai setup`, you get short aliases:

| Alias | Command | Purpose |
|-------|---------|---------|
| `adpj` | add | Add a project |
| `chpj` | change | Switch to a project |
| `lspj` | list | List all projects |
| `rmpj` | remove | Remove a project |
| `shpj` | show | Show project details |
| `mvpj` | rename | Rename a project |
| `pspj` | push | Push and switch |
| `popj` | pop | Pop and return |
| `prpj` | prompt | Current project for shell prompt |
| `scpj` | scan | Scan for repositories |
| `evpj` | env | Set environment config |
| `ctpj` | context | Export context for AI |
| `srcpj` | - | Source .pjmai.sh manually |
| `hlpj` | aliases | Show all aliases |

**Group aliases:**

| Alias | Command | Purpose |
|-------|---------|---------|
| `lsgp` | group list | List all groups |
| `shgp` | group show | Show current/named group |
| `prgp` | group prompt | Current group for shell prompt |

The pattern: two-letter operation + `pj` for projects, + `gp` for groups.

## Why Rust?

Years ago, while learning Rust, I created a private project called pjm1 to explore how a subprocess could signal directory changes to its parent shell. PJMAI-RS is a fork of that project, created for this blog post with additional features.

Rust brings practical benefits:

- **Speed**: Instant startup, fast scanning
- **Distribution**: Single binary, no runtime dependencies
- **Shell completions**: Generated at compile time for Bash, Zsh, Fish, PowerShell
- **Learning**: A good vehicle for understanding systems programming concepts

## The Throwback

The core idea---giving projects nicknames and switching fast---isn't new. I first used something like this around 2000, based on shell scripts by Russ Tremain ([vspms](https://github.com/rustt/vspms)). Those scripts worked well. Over the years I built my own variations: first as shell functions, then a shell script, then pjm1 in Rust, now PJMAI-RS.

What's changed isn't the concept but the context. Modern tooling (clap for arg parsing, serde for serialization, proper exit code signaling) makes the Rust implementation clean. AI agent support makes it relevant to how development workflows are evolving.

## Getting Started

Install with cargo:

```bash
cargo install pjmai
```

Or clone and build:

```bash
git clone https://github.com/softwarewrighter/sw-cli-tools
cd sw-cli-tools/pjmai-rs
cargo install --path .
```

Then configure your shell:

```bash
pjmai setup >> ~/.bashrc   # or ~/.zshrc
source ~/.bashrc
```

Add your first project:

```bash
adpj myproject ~/path/to/project
chpj myproject
```

## Current Status

PJMAI-RS is at version 0.4, completing phase three (full environment configuration).

## What's Next

### Phase 4: Sandboxing

The next major feature is sandboxing for untrusted projects. Three integration paths are planned:

**Nono Integration**

[nono-rs](https://docs.rs/crate/nono-rs/latest) is an anti-sudo tool that intercepts and blocks privileged commands. When you're reviewing untrusted code or letting an AI agent run commands, you don't want accidental (or malicious) `sudo rm -rf /`.

```toml
[[project]]
name = "untrusted-code"
[project.sandbox]
use_nono = true
nono_mode = "deny"  # deny, log, or prompt
```

When you switch to a nono-protected project:

```bash
$ chpj untrusted-code
🔒 Nono active: sudo commands will be blocked
```

The agent can run `cargo build`, `git status`, `ls`---but `sudo` gets intercepted.

**AI Agent Restricted Mode**

For AI coding agents, PJMAI-RS will support restricted PATH configurations:

```bash
$ chpj myproject --agent
🔒 AI Agent mode: restricted PATH active
Allowed: cargo, git, ls, find, grep, pjmai
Blocked: rm, sudo, curl, wget, ssh
```

The agent gets a curated set of safe commands. Everything else is blocked at the shell level.

**Container Integration**

For full isolation, projects can be configured to run inside containers:

```toml
[[project]]
name = "isolated-dev"
[project.container]
type = "docker"  # or podman, lima
image = "rust:1.75-slim"
enter_on_switch = true
```

Switching to the project drops you into the container automatically.

### Phase 5: Multi-Machine Sync

Share your project registry across machines:

- Sync via git repository
- Import/export configurations
- Handle path differences between machines (home directory mappings)

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **PJMAI-RS Repository** | [github.com/softwarewrighter/sw-cli-tools](https://github.com/softwarewrighter/sw-cli-tools) |
| **nono-rs (Anti-Sudo)** | [docs.rs/crate/nono-rs](https://docs.rs/crate/nono-rs/latest) |
| **Clap (CLI Parser)** | [clap.rs](https://clap.rs/) |
| **Shell Exit Codes** | [Exit Status (Wikipedia)](https://en.wikipedia.org/wiki/Exit_status) |

### Historical Context

| Era | Resource | Link |
|-----|----------|------|
| 1980s | **BSD SPMS** | [4.3BSD SPMS README](https://www.tuhs.org/cgi-bin/utree.pl?file=4.3BSD%2Fusr%2Fcontrib%2Fspms%2FREADME) |
| 1980s | **CMU SEI SCM** | [Support Materials for Software Configuration Management](https://www.sei.cmu.edu/documents/5920/Support_Materials_for_Software_Configuration_Management.pdf) |
| 2013 | **vspms** | [github.com/rustt/vspms](https://github.com/rustt/vspms) |

*Note: The `chpj`-style commands were informal add-ons shared between developers, not part of the official SPMS distribution. Documentation from that era is hard to find online.*

</div>

---

*Sometimes the best tools are the ones that remove friction from things you do constantly. Switching projects is one of those things.*

