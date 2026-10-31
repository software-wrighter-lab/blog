---
layout: post
title: "Why I Use #5: GNU Tools, From Emacs to Arch Linux"
categories: [tools, editors]
tags: [why-i-use, gnu, emacs, elisp, coreutils, homebrew, arch-linux, bash, zsh, shell-history, gcc, gnu-apl, org-mode, free-software]
keywords: "why I use GNU tools, Emacs since 1989, GNU coreutils on macOS, Homebrew coreutils, Arch Linux base-devel, bash, zsh on macOS, shell history, HISTSIZE SAVEHIST, histappend, SHARE_HISTORY, gcc, GNU APL, Emacs packages for CLI tools, Emacs glyph input"
abstract: "Fifth in the series on the tools I reach for, and the first about tools I did not write: GNU's. Emacs, which I have used since 1989 as an editor, for a while as an IDE, as a shell, and as the place my own command-line tools plug in; GNU coreutils installed on the Mac with Homebrew, so its commands behave as they do on Linux; Arch Linux, where my agents now work, with gcc and the rest of the GNU toolchain; bash, and why the Mac runs zsh instead, with a shell history worth keeping; and GNU APL."
series: "Why I Use"
series_part: 5
date: 2026-11-01 00:15:00 -0700
---

<!-- DRAFT (2026-10-30), Mike: split from coding agents ("Why I Use ... GNU tools like Emacs (and go into the brew install to get
     coreutils on Mac, and other ways I use GNU, like Arch Linux, and other tools under a GNU license"). Coding agents (Claude,
     Codex, Gemini/Antigravity, opencode with Z.ai GLM-5.x) move to the #6 draft. Mike: gcc and the build tools on Arch.
     Facts: TBT #13 timelines (Emacs 1989-, vi 1991-, Emacs as IDE 1998-2003, Emacs shell 2015-); Saw #4 (Emacs packages for
     pjmai-rs, reg-rs); Saw #8 (Emacs glyph entry); AL #19 (X_eTaL's Emacs mode, Org Babel); TBT #1 (GNU APL); Saw #7 and AI Tools
     #4 (agents on Arch Linux, reached with mosh). Checked on this Mac (2026-10-30): Homebrew has coreutils 9.12, gcc, gnu-apl,
     gnupg, m4, libtool, readline, ncurses, gmp, mpfr; Emacs.app is GNU Emacs 30.2. "Mike: TODO" marks his own reasons.
     bash section moved here from #7 at Mike's request (2026-10-30: "a discussion of bash and history goes somewhere, but note
     that I use zsh on Mac"; "isn't bash gnu? seems to fit better there than tmux"). Checked on this Mac (2026-10-30): login
     shell /bin/zsh, zsh 5.9; /bin/bash is 3.2.57; no Homebrew bash; ~/.zshrc sets no HIST* options, so /etc/zshrc's
     HISTSIZE=2000 / SAVEHIST=1000 apply (~/.zsh_history: 1054 lines, at the cap). Mike (2026-10-31): "I use bash on Arch. default size, no
     sharing. mac history is fine as is." So the sharing settings are shown as an option, not as his setup. No claim about why Apple switched, only the facts (3.2 is the last GPLv2 bash).
     The GNU list section is a candidate list for Mike to trim. Lead image: Mike's block-gnu.jpg (Dropbox), white background
     made transparent, color, no-invert. -->

<img src="{{ '/assets/images/posts/block-gnu.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 230px;">

The [prior post](/2026/10/31/why-i-use-my-tools/) in this series was about tools I wrote. This one is about tools I did not write but have built a working life around: GNU's. Emacs most of all, and with it the GNU commands I install on the Mac, the GNU toolchain on the Arch Linux machines where my agents work, and GNU APL.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **GNU** | [gnu.org](https://www.gnu.org/) |
| **Emacs** | [gnu.org/software/emacs](https://www.gnu.org/software/emacs/) |
| **coreutils** | [gnu.org/software/coreutils](https://www.gnu.org/software/coreutils/) |
| **Arch Linux** | [archlinux.org](https://archlinux.org) |
| **GNU APL** | [gnu.org/software/apl](https://www.gnu.org/software/apl/) |
| **The longer timeline** | [TBT #13: Many Decades of Learning the Next Thing](/2026/10/01/tbt-timelines-of-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Emacs, since 1989

Emacs is one of the few bars on [my career timeline](/2026/10/01/tbt-timelines-of-tools/) that never ends: I have used it since 1989, vi since 1991 beside it, and for a few years around 2000 Emacs was my IDE as well as my editor. Since 2015 I have also used it as a shell.

Mike: TODO, why Emacs and not something newer, in your words.

## Emacs as the place my tools plug in

Emacs is where my own command-line tools meet. [pjmai-rs and reg-rs both have Emacs packages](/2026/03/29/saw-pjmai-reg-emacs-all-together-now/), so switching projects and running regression tests happen in the editor as well as the terminal. X_eTaL has an Emacs mode that highlights and draws its notation, with Org Babel support so X_eTaL runs inside literate documents ([Array Languages #19](/2026/10/27/array-languages-xetal-tooling/)). And when my languages need glyphs, for APL, Tuplet and X_eTaL, Emacs has its own input methods for them: TeX-style and Agda-style mappings and a custom Quail input method ([Saw #8](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/)).

## GNU commands on the Mac

macOS ships BSD versions of the basic commands, which differ from GNU's in their options and their output. So on the Mac I install GNU's with Homebrew:

```text
brew install coreutils
```

Homebrew installs them with a `g` prefix (`gls`, `gdate`, `gsed` for its separate `gnu-sed`) so they do not replace the system's, and scripts and habits from Linux then work the same on both.

Mike: TODO, whether you put the unprefixed names first on your PATH (Homebrew's `gnubin` directories), and which differences bit you.

## Arch Linux and the GNU toolchain

My agents now work on [Arch Linux](https://archlinux.org) machines, one user per agent, reached from the MacBook with mosh and tmux ([Saw #7](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/), [AI Tools #4](/2026/05/16/pi-minimal-agent/)). There the GNU toolchain is the ordinary one: gcc and the rest of Arch's `base-devel` group for building, with GNU's userland, coreutils, bash and glibc, underneath. Arch itself is not all GNU, though. A Linux distribution is many projects under many licenses: the Linux kernel under GPLv2, GNU's tools under the GPL and LGPL, and plenty of packages under BSD, MIT, Apache and other permissive licenses. Arch records each package's license in the package itself (`pacman -Qi` shows it).

## bash, and zsh on the Mac

bash is GNU's shell, the Bourne Again SHell. With sh and ksh before it, it has been on [my timeline](/2026/10/01/tbt-timelines-of-tools/) since 1991, and it is the shell on the Arch machines. On the Mac I use zsh, which is not GNU. It has been the macOS default since Catalina in 2019, and the bash Apple still ships is version 3.2, from 2007: the last release under GPLv2. Later versions moved to GPLv3, and Apple's copy stayed where it was. Homebrew has a current one (`brew install bash`) for scripts that need it.

History is the part of a shell I would least like to lose: the long command that worked last week, recalled with Ctrl-R instead of rebuilt. [tmux](/2026/11/03/why-i-use-iterm2-tmux-mosh/) makes it trickier. Every pane runs its own shell, each keeping its own history in memory until it exits, so a command typed in one window is not in another's Ctrl-R, and in bash the last shell to exit can overwrite what the others saved.

I leave both shells at their default history sizes, with no sharing between panes. For anyone who wants it shared, both shells can do it:

```text
# bash: append rather than overwrite, and save after every command
shopt -s histappend
PROMPT_COMMAND="history -a; $PROMPT_COMMAND"

# zsh: write each command as it runs, and read the others' as they go
setopt INC_APPEND_HISTORY SHARE_HISTORY
```

On the Mac, the defaults come from `/etc/zshrc`, which sets `HISTSIZE=2000` and `SAVEHIST=1000`: zsh keeps the last thousand commands. That has been fine for me.

Mike: TODO, how you search history: plain Ctrl-R, or Ctrl-R through [skim](/2026/11/04/why-i-use-rust-cli-tools/)?

## GNU APL

When I recreated [my first program](/2026/01/29/tbt-apl-horse-race/), a 1972 horse race in APL, it was GNU APL that ran it.

## Candidate list: other GNU tools
{: .pos-center}

<!-- Mike: trim this list to the tools you actually use; it is a starting point, not a claim. -->

- **Shell and text:** sed, grep, gawk, findutils (`find`, `xargs`), diffutils (`diff`, `cmp`), patch, tar, gzip, less, readline (the line editing in many REPLs)
- **Building:** make, gcc and g++, binutils (`ld`, `as`, `objdump`), gdb, autoconf, automake, libtool, m4, bison, texinfo
- **Libraries:** glibc, gmp and mpfr (arbitrary precision, behind gcc), ncurses
- **Everything else:** GnuPG (`gpg`) for signing and keys, wget, GNU parallel, GNU screen (before tmux), Guile
- **Licenses:** the GPL itself, from the other side: my reva-fork keeps copyleft code out, so it can be used commercially

Mike: TODO, a closing in your words.
