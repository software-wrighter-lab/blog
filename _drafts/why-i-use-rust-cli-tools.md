---
layout: post
title: "Why I Use #8: fd, ripgrep, skim, dua and bat --- Rust at the Prompt"
categories: [tools, terminals]
tags: [why-i-use, rust, cli, fd, ripgrep, rg, skim, fzf, fuzzy-finder, dua, bat, find, grep, du, cat, gitignore, pipelines]
keywords: "why I use fd, ripgrep, rg, skim, sk, fzf in Rust, fuzzy finder, dua, bat vs cat, combining fd rg sk bat, fuzzy finder preview, dua-cli, Rust command-line tools, find replacement, grep replacement, du replacement, gitignore aware search, interactive disk usage, cargo install"
abstract: "Eighth in the series on the tools I reach for: five command-line tools written in Rust, and how they combine. fd, ripgrep and dua take the place of GNU's find, grep and du: fd and ripgrep search the way a programmer usually means, skipping what git ignores, and dua shows where the disk went and lets me clean it up interactively. skim is a Rust fuzzy finder in the style of fzf, for picking one line out of many as you type, and bat is cat with syntax highlighting, which also makes the preview pane when they are piped together."
series: "Why I Use"
series_part: 8
date: 2026-11-04 00:15:00 -0800
---

<!-- DRAFT (2026-10-30), Mike: split from #7 (iTerm2, tmux, mosh) as he suggested: "Rust-based (fd, rg, dua) as a follow-on".
     skim added at Mike's request (2026-10-30: "there is a rust version of fzf (fuzzy find) add that"): skim, command sk, repo
     skim-rs/skim (gh api 2026-10-30; lotabout/skim redirects there). Mike (2026-10-30): he uses skim on some Arch systems, and fzf on
     Arch too; "I used to use fzf, but since I like Rust, I switched to sk". Both installed on this Mac with Homebrew on 2026-10-30: sk 5.9.0, fzf 0.74.5. fzf itself is Go, so skim is not a GNU replacement like the other three.
     bat and "Together" added at Mike's request (2026-10-30: "show these examples in the post, i.e., how to combine these, also
     bat vs cat?"). bat is NOT installed on this Mac (Homebrew bat 0.26.1, github.com/sharkdp/bat, same author as fd); its
     behavior is from its docs. Combined examples were run on this Mac (2026-10-30) with sk --filter standing in for the
     interactive picker, except the two that need bat or a live terminal: the bat preview (taken from sk --help's own example)
     and live grep (sk -i -c, skim's README). Measured: fd '^target$' finds 0 under ~/github/hardwarewrighter (gitignored);
     with -I it finds hex1000/target (268.64 MB) and X_eTaL-fpga/target (1.11 GB), 1.38 GB total, per dua.
     "(and similar)": candidate list below, from what is installed, for Mike to trim. Facts from published posts: TBT #6
     (pjmai-rs: "too much time using cd, du, fd, and ls commands to find and navigate"); #1 (Rust); #5 (GNU findutils, grep,
     coreutils' du). Checked on this Mac (2026-10-30): fd 10.4.2 and dua 2.34.0 from cargo (~/.cargo/bin); ripgrep 15.2.0 from
     Homebrew, first on PATH, with a second rg in ~/.cargo/bin; just 1.58.0 from Homebrew. Not installed: eza, bat, zoxide, fzf,
     dust, hyperfine, tokei, starship, delta, skim (sk). Defaults described (gitignore, hidden files, dua i) are each project's documented
     behavior, not measurements; no speed claims without a measurement; "faster for me" is Mike's own (2026-10-30), about him at the CLI, not a benchmark. Lead image: placeholder, due 2026-11-04. -->

<img src="{{ '/assets/images/posts/placeholder-why-i-use-rust-cli-tools.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [prior post](/2026/11/03/why-i-use-iterm2-tmux-mosh/) was about getting to a prompt and keeping it. This one is about five commands I type at it, all written in Rust, and how they combine. Three of them, fd, ripgrep and dua, take the place of GNU tools from [#5](/2026/11/01/why-i-use-gnu-tools/) at my command line, and each is better at the job I actually have, which is usually searching a source tree. The other two work alongside them: skim, a fuzzy finder in the style of fzf, and bat, which takes the place of cat.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **fd** | [github.com/sharkdp/fd](https://github.com/sharkdp/fd) |
| **ripgrep** | [github.com/BurntSushi/ripgrep](https://github.com/BurntSushi/ripgrep) |
| **skim** | [github.com/skim-rs/skim](https://github.com/skim-rs/skim) |
| **dua** | [github.com/Byron/dua-cli](https://github.com/Byron/dua-cli) |
| **bat** | [github.com/sharkdp/bat](https://github.com/sharkdp/bat) |
| **Why Rust** | [Why I Use #1: Rust](/2026/10/28/why-i-use-rust/) |
| **The GNU originals** | [Why I Use #5: GNU Tools](/2026/11/01/why-i-use-gnu-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Not instead of GNU, beside it

I still install GNU's find, grep and du, and scripts still use them, because they are everywhere and their options are a standard. I do not require the AI coding agents that write scripts for me to use the Rust alternatives. At the command line, though, I prefer the Rust commands, because they are faster for me. Their defaults are chosen for someone searching code, so the common case needs no options at all.

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

[skim](https://github.com/skim-rs/skim), whose command is `sk`, is a fuzzy finder: give it a list of lines, type a few letters in any order, and it narrows the list as you type until the one you want is at the top. It is a Rust implementation in the style of fzf, which is written in Go. I used to use fzf, but since I like [Rust](/2026/10/28/why-i-use-rust/), I switched to skim. It does not replace find or xargs; it sits between them. fd or find produces the list, skim picks from it, and xargs or any other command acts on the pick:

```text
fd -e rs | sk              # pick a Rust file by a few letters of its name
rg -l TODO | sk            # pick one of the files with a TODO
fd -e rs | sk -m | xargs wc -l   # line counts for just the files I mark
```

Fuzzy matching is also how [pjmai-rs completes project names](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/): type part of a name and the closest match wins.

Mike: TODO, how you use skim: shell key bindings for history search (see [#7 on shell history](/2026/11/03/why-i-use-iterm2-tmux-mosh/)) and file search, piping into `sk`, or as a Rust library inside your own tools.

## dua: where did the disk go?

[dua](https://github.com/Byron/dua-cli), for disk usage analyzer, does more than du. It answers what `du` does, sorted so the biggest offenders are obvious, and its interactive mode, `dua i`, lets me browse the tree by size, mark what to delete, and delete it, without composing an `rm` by hand.

Mike: TODO, the usual culprits on your machines. Rust `target/` directories? Model weights on Lucy?

## bat: cat, for reading

`cat` concatenates files; most of the time I use it to read one. [bat](https://github.com/sharkdp/bat), from the author of fd, is built for reading: syntax highlighting, line numbers, markers in the margin for lines changed since the last git commit, and a pager for anything longer than the screen. When its output goes to a pipe or a file instead of a terminal, it drops all of that and behaves like plain `cat`, so it is safe in the middle of a pipeline.

```text
bat src/main.rs           # highlighted, numbered, paged
bat -r 40:60 src/main.rs  # just lines 40 to 60
bat -A README.md          # show tabs, line endings and other invisible characters
```

That last one is the check [markdown-checker](/2026/10/31/why-i-use-my-tools/) automates: characters you cannot see that stop a README rendering.

Mike: TODO, whether you use bat, and where (Mac, Arch, as a skim preview).

## Together
{: .pos-center}

Each of these does one job, and their output is plain lines, so they pipe into each other: fd and ripgrep produce lists, skim picks from a list, bat shows what is picked, and xargs or any other command acts on it.

Pick a file by a few letters of its name, then open it:

```text
$EDITOR "$(fd -e rs | sk)"
```

Search with ripgrep, choose among the matches, and preview each one in bat with the matching line highlighted. This one is straight from skim's own help:

```text
rg --line-number TODO |
  sk --delimiter : \
     --preview 'bat --style=numbers --color=always --highlight-line {2} {1}' \
     --preview-window +{2}-/2
```

Live grep: skim reruns ripgrep with whatever has been typed so far, on every keystroke:

```text
sk --ansi -i -c 'rg --color=always --line-number "{}"'
```

Mark several, then act on all of them:

```text
rg -l TODO | sk -m | xargs wc -l
```

And where the disk went. Every Rust project leaves a `target/` directory of build output, and because `target/` is in `.gitignore`, fd skips it by default. `-I` turns that off, and dua sizes what it finds:

```text
fd -t d -I '^target$' ~/github | xargs dua
```

Without `-I`, under one directory of my repositories, that found nothing. With it, it found two `target/` directories holding 1.38 GB.

## How I install them

On the Mac, fd and dua came from `cargo install`, and ripgrep from Homebrew (with a second copy in `~/.cargo/bin` behind it on the PATH). skim and fzf are on the Arch machines, and on the Mac from Homebrew (`brew install sk fzf`).

Mike: TODO, cargo or Homebrew as your rule, how they get onto the Arch machines (pacman or cargo), and where skim and bat are installed.

## And similar: candidates
{: .pos-center}

<!-- Mike: trim to what you actually use. Only just is installed on this Mac; the rest are common Rust CLI tools listed as
     prompts, not claims. -->

- **just**, a command runner: a `justfile` of named recipes instead of a Makefile's build rules (installed: 1.58.0)
- **eza** for `ls`, **dust** for `du`, **zoxide** for `cd`, **hyperfine** for benchmarking, **tokei** for counting lines of code, **delta** for git diffs, **starship** for the prompt

Mike: TODO, a closing in your words: what these have in common, and how they connect back to [#1](/2026/10/28/why-i-use-rust/).
