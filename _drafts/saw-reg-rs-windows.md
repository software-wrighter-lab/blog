---
layout: post
title: "Saw #20: reg-rs on Windows, Enabling Windows Installers (for Reva and CoSy)"
categories: [tools]
tags: [sharpen-the-saw, reg-rs, windows, ci, github-actions, rust, testing, reva-fork, cosy, installers]
keywords: "Sharpen the Saw, reg-rs Windows, regression testing on Windows, Rust cross-platform CI, GitHub Actions Windows runner, File::lock, Child::kill, rusqlite bundled, reva-fork installers, CoSy Windows installer"
abstract: "A short saw: reg-rs, my regression-testing tool, now builds and runs on Windows, so reva-fork can test on a Windows VM in CI on its way to desktop installers for Linux, macOS and Windows, and a Windows installer for my private CoSy fork. Three small changes did it: std's file lock in place of a Unix-only crate, Child::kill in place of kill -9, and SQLite compiled in."
series: "Sharpen the Saw Sundays"
series_part: 20
date: 2026-11-22 00:15:00 -0800
repo_urls:
  - url: "https://github.com/sw-cli-tools/reg-rs"
    title: "reg-rs"
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
---

<!-- DRAFT (2026-11-22), Mike: a quick, short saw for today on reg-rs Windows support, for reva-fork CI on a Windows VM,
     toward desktop installers (Linux, macOS, Windows) and a Windows installer for Mike's private CoSy fork.
     Facts from reg-rs branch fix/windows-support: 0376410 (File::lock, Child::kill), ef8fc65 (clippy, Rust 1.100),
     f6297ad (CI workflow ubuntu/macos/windows, rusqlite bundled on Windows, README Windows section). At drafting the
     branch was not yet on GitHub (ls-remote empty). reva-fork plan e2f1030 (steps 77-79: local-ci with Windows on
     GitHub Actions, local-desktop-installers, local-installer-tests; GitHub Actions, no paid signing, .deb/.rpm, no AppImage).
     Lead image: Mike's block-windows.jpg (Dropbox, 2026-11-22). -->

<img src="{{ '/assets/images/posts/block-windows.webp' | relative_url }}" class="post-marker no-invert" alt="A flat illustration of many kinds of windows overlapping on a sage background: a plain modern frame, a carved Gothic arch, an arched stained-glass window, a white double-hung sash, a diamond-paned leaded casement and a large dark-framed picture window" style="width: 205px;">

This week's saw is a short one, and a little sideways. [reva-fork](https://github.com/softwarewrighter/reva-fork) is heading for desktop installers on Linux, macOS and now Windows, the first step toward a Windows installer for my private CoSy fork. Testing that on a Windows VM in CI meant my regression tester, [reg-rs](https://github.com/sw-cli-tools/reg-rs), had to run on Windows first.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **reg-rs** | [reg-rs](https://github.com/sw-cli-tools/reg-rs), [TBT: its history](/2026/03/19/tbt-reg-rs-regression-testing/) |
| **reva-fork** | [reva-fork](https://github.com/softwarewrighter/reva-fork), [Saw #16](/2026/10/25/saw-reva-fork-cosy/) |
| **The series** | [Sharpen the Saw: every post](/series/#sharpen-the-saw-sundays) |
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why Windows now

reva-fork runs Reva's Forth unchanged on a small x86 virtual machine written in Rust, with [CoSy](https://cosy.com/) on top ([Saw #16](/2026/10/25/saw-reva-fork-cosy/)). Its plan now has three steps for the desktop: CI on GitHub Actions that covers Windows, desktop installers, and tests of those installers. The choices so far: GitHub Actions, no paid code signing, and .deb and .rpm packages for Linux rather than an AppImage.

reva-fork's gate, `just check`, runs its golden tests with reg-rs, and the Windows job has to run them too, in Git Bash. I had only used reg-rs on Linux and macOS, and it did not build on Windows.

## Three small changes

- **File locking.** reg-rs locks its SQLite database while it records results. The crate it used compiled Unix-only C (`fcntl`), and it also pulled in an old `nix` that no longer builds on macOS against the current `libc`. Rust's standard library has had `File::lock` since 1.89, so the crate is gone.
- **Timeouts.** A test that runs too long was stopped with `kill -9`, which Windows does not have. Now the wait loop polls `try_wait` and stops the command with `Child::kill`, and a new test checks that a timed-out command really stops.
- **SQLite.** Windows has no system SQLite to link against, so on Windows rusqlite compiles it in (its `bundled` feature).

Test commands still run through `sh -c` on every OS; on Windows that is Git Bash's `sh`, so existing test scripts keep working. A new GitHub Actions workflow runs the full build (format, clippy, tests, build of every component) on Ubuntu, macOS and Windows. Rust 1.100's new clippy lints got fixed along the way.

## Closing

This change enables porting more of my work to Windows. Most of my tools are Rust, and reg-rs is how I test them, so with it running on a Windows CI runner, any of my projects can add Windows to its checks and see what breaks before anyone installs it.
