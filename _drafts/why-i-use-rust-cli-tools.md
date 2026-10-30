---
layout: post
title: "Why I Use #8: fd, ripgrep, skim and dua --- Rust at the Prompt"
categories: [tools, terminals]
tags: [why-i-use, rust, cli, fd, ripgrep, rg, skim, fzf, fuzzy-finder, dua, find, grep, du, gitignore]
keywords: "why I use fd, ripgrep, rg, skim, sk, fzf in Rust, fuzzy finder, dua, dua-cli, Rust command-line tools, find replacement, grep replacement, du replacement, gitignore aware search, interactive disk usage, cargo install"
abstract: "Eighth in the series on the tools I reach for: four command-line tools written in Rust. fd, ripgrep and dua take the place of GNU's find, grep and du: fd and ripgrep search the way a programmer usually means, skipping what git ignores, and dua shows where the disk went and lets me clean it up interactively. skim is a Rust fuzzy finder in the style of fzf, for picking one line out of many as you type."
series: "Why I Use"
series_part: 8
date: 2026-11-04 00:15:00 -0800
---

<!-- DRAFT (2026-10-30), Mike: split from #7 (iTerm2, tmux, mosh) as he suggested: "Rust-based (fd, rg, dua) as a follow-on".
     skim added at Mike's request (2026-10-30: "there is a rust version of fzf (fuzzy find) add that"): skim, command sk, repo
     skim-rs/skim (gh api 2026-10-30; lotabout/skim redirects there). Mike (2026-10-30): he uses skim on some Arch systems, and fzf on
     Arch too. Both installed on this Mac with Homebrew on 2026-10-30: sk 5.9.0, fzf 0.74.5. fzf itself is Go, so skim is not a GNU replacement like the other three.
     "(and similar)": candidate list below, from what is installed, for Mike to trim. Facts from published posts: TBT #6
     (pjmai-rs: "too much time using cd, du, fd, and ls commands to find and navigate"); #1 (Rust); #5 (GNU findutils, grep,
     coreutils' du). Checked on this Mac (2026-10-30): fd 10.4.2 and dua 2.34.0 from cargo (~/.cargo/bin); ripgrep 15.2.0 from
     Homebrew, first on PATH, with a second rg in ~/.cargo/bin; just 1.58.0 from Homebrew. Not installed: eza, bat, zoxide, fzf,
     dust, hyperfine, tokei, starship, delta, skim (sk). Defaults described (gitignore, hidden files, dua i) are each project's documented
     behavior, not measurements; no speed claims without a measurement. Lead image: placeholder, due 2026-11-04. -->

<img src="{{ '/assets/images/posts/placeholder-why-i-use-rust-cli-tools.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [prior post](/2026/11/03/why-i-use-iterm2-tmux-mosh/) was about getting to a prompt and keeping it. This one is about four commands I type at it, all written in Rust. Three of them, fd, ripgrep and dua, replace GNU tools from [#5](/2026/11/01/why-i-use-gnu-tools/), and each is better at the job I actually have, which is usually searching a source tree. The fourth, skim, is a Rust fuzzy finder in the style of fzf.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **fd** | [github.com/sharkdp/fd](https://github.com/sharkdp/fd) |
| **ripgrep** | [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) |
| **skim** | [github.com/skim-rs/skim](https://github.com/skim-rs/skim) |
| **dua** | [github.com/Byron/dua-cli](https://github.com/Byron/dua-cli) |
| **Why Rust** | [Why I Use #1: Rust](/2026/10/28/why-i-use-rust/) |
| **The GNU originals** | [Why I Use #5: GNU Tools](/2026/11/01/why-i-use-gnu-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Not instead of GNU, beside it

I still install GNU's find, grep and du, and scripts still use them, because they are everywhere and their options are a standard. fd, ripgrep and dua are for typing: defaults chosen for someone searching code, so the common case needs no options at all.

Mike: TODO, confirm: GNU in scripts, Rust tools interactively? Or have they replaced GNU's in scripts too?

## fd: find, the way I mean it

[fd](https://github.com/sharkdp/fd) finds files by name. Where `find . -name '*.rs'` needs a path, a test and quoting, `fd -e rs` does the same search. By default it skips hidden files and anything listed in `.gitignore`, so a search of a Rust project does not wade through `target/`, and it searches by regular expression with colored output.

```text
fd -e rs              # every Rust source file in this project
fd Cargo.toml         # every crate
fd -e md -x wc -w     # word count of every Markdown file, in parallel
```

fd was one of the commands I was typing too often when I wrote [pjmai-rs](/2026/03/05/tbt-pjmai-rs-project-manager/): with 200 repositories spread differently across each machine, I was spending too much time with `cd`, `du`, `fd` and `ls` just to find where a project was.

Mike: TODO, your own most-used fd invocations.

## ripgrep: grep for source trees

[ripgrep](https://github.com/BurntSushi/ripgrep), `rg`, searches file contents. It is recursive by default and, like fd, skips hidden files, binary files and whatever `.gitignore` excludes, so `rg pattern` in a project searches the project and not its build output.

```text
rg 'fn main'          # every main in the project
rg -t rust unsafe     # only in Rust files
rg -l TODO            # just the names of files with a TODO
```

Mike: TODO, why rg over `grep -r` for you, and whether you use it inside Emacs (rg.el, deadgrep, or `M-x grep` with rg as the command).

## skim: pick one as you type

[skim](https://github.com/skim-rs/skim), whose command is `sk`, is a fuzzy finder: give it a list of lines, type a few letters in any order, and it narrows the list as you type until the one you want is at the top. It is a Rust implementation in the style of fzf, which is written in Go. I use skim on some of my Arch machines and fzf on Arch too. Either composes with the tools above, which produce the lists:

```text
fd -e rs | sk              # pick a Rust file by a few letters of its name
rg -l TODO | sk            # pick one of the files with a TODO
```

Fuzzy matching is also how [pjmai-rs completes project names](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/): type part of a name and the closest match wins.

Mike: TODO, how you use them: shell key bindings for history and file search, piping into `sk`, or skim as a Rust library inside your own tools. And what decides skim or fzf on a given machine.

## dua: where did the disk go?

[dua](https://github.com/Byron/dua-cli) is disk usage analysis: what `du` answers, sorted so the biggest offenders are obvious. Its interactive mode, `dua i`, is the reason I use it: browse the tree by size, mark what to delete, and delete it, without composing an `rm` by hand.

Mike: TODO, the usual culprits on your machines. Rust `target/` directories? Model weights on Lucy?

## How I install them

On the Mac, fd and dua came from `cargo install`, and ripgrep from Homebrew (with a second copy in `~/.cargo/bin` behind it on the PATH). skim and fzf are on the Arch machines, and on the Mac from Homebrew (`brew install sk fzf`).

Mike: TODO, cargo or Homebrew as your rule, how they get onto the Arch machines (pacman or cargo), and where skim is installed.

## And similar: candidates
{: .pos-center}

<!-- Mike: trim to what you actually use. Only just is installed on this Mac; the rest are common Rust CLI tools listed as
     prompts, not claims. -->

- **just**, a command runner: a `justfile` of named recipes instead of a Makefile's build rules (installed: 1.58.0)
- **eza** for `ls`, **bat** for `cat`, **dust** for `du`, **zoxide** for `cd`, **hyperfine** for benchmarking, **tokei** for counting lines of code, **delta** for git diffs, **starship** for the prompt

Mike: TODO, a closing in your words: what these have in common, and how they connect back to [#1](/2026/10/28/why-i-use-rust/).
