---
layout: post
title: "Why I Use #7: iTerm2, tmux and mosh --- Sessions That Survive"
categories: [tools, terminals]
tags: [why-i-use, iterm2, tmux, mosh, ssh, terminals, macos, arch-linux, ai-agents, remote-development]
keywords: "why I use iTerm2, tmux, mosh, mobile shell, persistent terminal sessions, ssh alternative, roaming, laptop sleep, remote development, coding agents on a remote server, Arch Linux"
abstract: "Seventh in the series on the tools I reach for: the terminal stack between my MacBook and the machines where my agents work. iTerm2 on the Mac, mosh for a connection that survives sleep and changing networks, and tmux for sessions that outlive any connection at all."
series: "Why I Use"
series_part: 7
date: 2026-11-03 00:15:00 -0800
---

<!-- DRAFT (2026-10-30), Mike: "next draft in why i use series: iTerm2, tmux, mosh, fd, rg, dua, (and similar). Might split
     this into Rust-based (fd, rg, dua) as a follow-on." Split as suggested: fd, rg and dua are #8 (why-i-use-rust-cli-tools).
     Facts from published posts: TBT #13 (terminals timeline: xterm/VT100 1991-2010, sh/ksh/bash 1991-, "ssh, mosh, tmux"
     2005- as one row, Emacs shell 2015-; "mosh into an Arch box, tmux, a shell inside Emacs"); AI Tools #4 (mosh from the
     MacBook to an Arch Linux server, an unprivileged user, tmux windows for the agent, a shell, an Emacs shell; mosh "survives
     network hiccups better than plain ssh"); AI Tools #5 (Lucy, the local AI cluster); Saw #7 (mosh for roaming, sleep/wake and
     dropped Wi-Fi; tmux so agent sessions survive disconnects and re-attach from any client; multi-day runs).
     Checked on this Mac (2026-10-30): iTerm2 3.7.4, tmux 3.6b and mosh 1.4.0 (both Homebrew). No ~/.tmux.conf.
     iTerm2 is NOT on the TBT #13 timeline: its start year is Mike: TODO. Tool behavior described is each project's documented
     behavior, not a measurement. Lead image: placeholder, due 2026-11-03. "Mike: TODO" marks his own reasons. -->

<img src="{{ '/assets/images/posts/placeholder-why-i-use-iterm2-tmux-mosh.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

The [prior post](/2026/11/02/why-i-use-coding-agents/) in this series was about coding agents. This one is about what they run inside: the terminal stack between my MacBook and the Arch Linux machines where the agents work. Three tools, each covering a different way a session can die.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **iTerm2** | [iterm2.com](https://iterm2.com/) |
| **tmux** | [github.com/tmux/tmux](https://github.com/tmux/tmux) |
| **mosh** | [mosh.org](https://mosh.org/) |
| **How the agents use it** | [AI Tools #4](/2026/05/16/pi-minimal-agent/), [Saw #7](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) |
| **The longer timeline** | [TBT #13: Many Decades of Learning the Next Thing](/2026/10/01/tbt-timelines-of-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Still pretending to be a VT100

[My timeline of tools](/2026/10/01/tbt-timelines-of-tools/) starts its terminals row with an IBM 2741, a typewriter, and runs through the 3270 and the VT100. Everything I use today is still pretending to be the last of those. What has changed is what sits around the terminal: the connection is now something that should survive a closed laptop lid, and the session is something that should survive the connection.

## The setup

From the MacBook, I connect with mosh to an Arch Linux machine, log in as an unprivileged user (one per agent), and run tmux. One tmux window runs the agent; another is a shell prompt, or sometimes an Emacs shell ([AI Tools #4](/2026/05/16/pi-minimal-agent/)). The same arrangement runs every agent, so what changes between them is the agent and not the setup.

Mike: TODO, a diagram or screenshot of a real session: iTerm2 window, mosh connection, tmux windows.

## iTerm2: the Mac end

iTerm2 is the terminal on the Mac.

Mike: TODO, why iTerm2 rather than Terminal.app (or Ghostty, WezTerm, Alacritty), since when, and which features you actually use. Candidates to confirm or cut: split panes, profiles per host, search and scrollback, and its tmux integration (`tmux -CC`), which shows tmux windows as native iTerm2 tabs.

## mosh: a connection that survives

ssh is a TCP connection: close the laptop, change Wi-Fi, or let the network drop for long enough, and it is gone. [mosh](https://mosh.org/), the mobile shell, logs in with ssh and then switches to its own protocol over UDP, keeping the screen in sync rather than streaming bytes. Sleep and wake, a dropped Wi-Fi network, and a change of address no longer end the session, and its local echo keeps typing responsive on a slow link ([Saw #7](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/)).

What mosh does not do is keep scrollback, which is one reason it pairs with tmux.

Mike: TODO, the moment that made you switch from plain ssh.

## tmux: a session that survives the connection

mosh keeps the connection alive; tmux keeps the work alive when the connection is gone anyway. Sessions live on the server, so a reboot of the MacBook, a new client, or a different machine can re-attach to the same running agent. That is what made [multi-day agent runs](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) on the Arch host practical: the agent keeps working whether or not anything is connected to it, and it can be inspected from wherever I am.

Mike: TODO, how you lay out sessions and windows (one session per agent user? per project?), and whether you have any tmux configuration worth showing. There is no `~/.tmux.conf` on the Mac, so it may live on the Arch side or not exist.

## Before tmux

Mike: TODO, optional: GNU screen, if you used it before tmux ([#5](/2026/11/01/why-i-use-gnu-tools/) lists it as a candidate).

## Three ways to lose a session
{: .pos-center}

Each tool closes off one failure: iTerm2 the Mac end, mosh the network in between, tmux the connection itself.

Mike: TODO, a closing in your words. The [next post](/2026/11/04/why-i-use-rust-cli-tools/) is about what runs at the prompt once you are there: fd, ripgrep, skim, dua and bat.
