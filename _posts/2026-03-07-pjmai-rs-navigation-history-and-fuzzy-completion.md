---
layout: post
title: "pjmai-rs: Navigation History and Fuzzy Completion"
date: 2026-03-07 00:15:00 -0800
categories: [cli-tools, rust]
tags: [pjmai, rust, cli, project-management, shell, developer-tools, personal-software]
keywords: "pjmai, project manager, rust cli, shell integration, project switching, navigation history, fuzzy completion, subdirectory navigation, stack management, tab completion"
author: Software Wrighter
abstract: "New pjmai-rs features: navigation history to revisit recent projects, smarter fuzzy tab completion, subdirectory navigation, and improved stack management. Building on the TBT post with practical workflow enhancements."
series: "Personal Software"
series_part: 7
repo_url: "https://github.com/sw-cli-tools/pjmai-rs"
---

<img src="{{ '/assets/images/posts/block-contemplate.webp' | relative_url }}" class="post-marker" alt="">

Since the [TBT post on pjmai-rs](/2026/03/05/tbt-pjmai-rs-project-manager/), development has continued. This post covers the new features that make project navigation even faster.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [sw-cli-tools/pjmai-rs](https://github.com/sw-cli-tools/pjmai-rs) |
| **Background** | [TBT: PJMAI-RS](/2026/03/05/tbt-pjmai-rs-project-manager/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Navigation History

The new `hypj` command (or `pjmai history`) shows where you've been:

```bash
hypj
# Output:
# 1. webapp      ~/code/webapp
# 2. api         ~/code/api
# 3. config      ~/code/config
# 4. docs        ~/code/docs
```

Jump directly to a history entry:

```bash
hypj 3    # Jump to config (entry 3)
```

This is faster than remembering project names when you're bouncing between several repos.

## Stack Management

The push/pop workflow now has explicit stack visibility:

```bash
stpj              # Show current stack
stpj clear        # Clear the stack (with confirmation)
```

When you use `chpj` (direct navigation) instead of push/pop, the stack is automatically cleared. This prevents confusion when mixing navigation styles.

The `popj` command now shows context:

```bash
popj
# Output: Returning to webapp (1 remaining)
```

## Subdirectory Navigation

Navigate directly into subdirectories with tab completion:

```bash
chpj myproject<TAB>           # Complete project name
chpj myproject <TAB>          # Complete subdirs: src, tests, docs
chpj myproject src/<TAB>      # Complete nested: lib, bin
chpj myproject src/lib<ENTER> # cd to ~/code/myproject/src/lib
```

Both space and slash syntax work:

```bash
chpj myproject src lib        # Space-separated
chpj myproject src/lib        # Slash-separated
```

Helpful error messages:

```bash
chpj myproject nonexistent
# Error: subdirectory 'nonexistent' not found in project 'myproject'

chpj myproject README.md
# Error: 'README.md' is a file, not a directory
```

## Smarter Fuzzy Completion

Tab completion now uses tiered matching:

1. **Prefix matches first**: `web` → `webapp`, `webapi`
2. **Segment matches second**: After `-` boundaries, so `api` matches `my-api`
3. **Substring matches last**: `app` finds `webapp`

Within each tier, results are sorted by **most recently used**. The project you switched to five minutes ago appears before one you haven't touched in weeks.

## Bulk Operations

Two new flags for batch management:

```bash
rmpj --all        # Remove all projects (with confirmation)
scpj --reset      # Clear registry and re-scan (fresh start)
```

The scan command also handles nickname collisions better now. Instead of numeric suffixes (`webapp2`), it uses owner-prefixed names (`acme-webapp`) based on the git remote.

## New Commands Summary

| Command | Alias | Description |
|---------|-------|-------------|
| `pjmai history [N]` | `hypj` | Show or jump to navigation history |
| `pjmai stack show` | `stpj` | Show the project stack |
| `pjmai stack clear` | `stpj clear` | Clear the stack |
| `pjmai remove --all` | `rmpj --all` | Remove all projects |
| `pjmai scan --reset` | `scpj --reset` | Fresh re-scan |

## What's Next

The focus continues on making project context switching invisible. Upcoming work:

- **Nono integration**: Sandboxing untrusted projects
- **AI agent restricted mode**: Curated PATH for autonomous agents
- **Multi-machine sync**: Share project registry across machines

---

*The best developer tools are the ones you stop noticing.*
