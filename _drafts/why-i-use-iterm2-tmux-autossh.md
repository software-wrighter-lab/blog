---
layout: post
title: "Why I Use #7: iTerm2, autossh, tmux and Chrome Remote Desktop --- From the MacBook to the Machines"
categories: [tools, terminals]
tags: [why-i-use, iterm2, autossh, tmux, ssh, mosh, chrome-remote-desktop, remote-desktop, terminals, macos, arch-linux, ai-agents, remote-development]
keywords: "why I use iTerm2, autossh, tmux, Chrome Remote Desktop, remote desktop to Arch Linux, persistent terminal sessions, reconnecting ssh, mosh unreliable, laptop sleep, remote development, coding agents on a remote server, Arch Linux"
abstract: "Seventh in the series on the tools I reach for: the stack between my MacBook and the machines where my agents work. iTerm2 on the Mac, autossh to bring a dropped ssh connection back (mosh, which I used before, proved unreliable), and tmux for sessions that outlive any connection at all. When a terminal is not enough, Chrome Remote Desktop brings the whole remote desktop to the Mac, to preview graphics or browse a server running on that machine."
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
     Checked on this Mac (2026-10-30): iTerm2 3.7.4, tmux 3.6b and mosh 1.4.0 (both Homebrew). 2026-11-02, Mike: mosh proved unreliable and lately refuses to connect from his Mac; local and cloud LLMs suggested many diagnostics and wrong causes and never got it working reliably; he switched to autossh (1.4g, Homebrew). No ServerAliveInterval in ~/.ssh/config. No ~/.tmux.conf.
     iTerm2 is NOT on the TBT #13 timeline: its start year is Mike: TODO. Tool behavior described is each project's documented
     behavior, not a measurement. Lead image: Mike's block-four-panes.jpg (Dropbox), no-invert. "Mike: TODO" marks his own reasons. -->

<img src="{{ '/assets/images/posts/block-four-panes.webp' | relative_url }}" class="post-marker no-invert" alt="A block print of a monitor split into four terminal panes, with racks and cables behind it" style="width: 205px;">

The [prior post](/2026/11/02/why-i-use-coding-agents/) in this series was about coding agents. This one is about what they run inside: the terminal stack between my MacBook and the Arch Linux workstations and rack servers where the agents work. Three terminal tools, each covering a different way a session can die, and one remote desktop for when a terminal is not enough.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **iTerm2** | [iterm2.com](https://iterm2.com/) |
| **autossh** | [harding.motd.ca/autossh](https://www.harding.motd.ca/autossh/) |
| **tmux** | [github.com/tmux/tmux](https://github.com/tmux/tmux) |
| **Chrome Remote Desktop** | [remotedesktop.google.com](https://remotedesktop.google.com/) |
| **How the agents use it** | [AI Tools #4](/2026/05/16/pi-minimal-agent/), [Saw #7](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) |
| **The longer timeline** | [TBT #13: Many Decades of Learning the Next Thing](/2026/10/01/tbt-timelines-of-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Still pretending to be a VT100

[My timeline of tools](/2026/10/01/tbt-timelines-of-tools/) starts its terminals row with an IBM 2741, a typewriter, and runs through the 3270 and the VT100. Everything I use today is still pretending to be the last of those. What has changed is what sits around the terminal: the connection is now something that should come back after a closed laptop lid, and the session is something that should survive the connection.

## The setup

From the MacBook, I connect with autossh to an Arch Linux machine, log in as an unprivileged user (one per agent), and run tmux. One tmux window runs the agent; another is a shell prompt, or sometimes an Emacs shell ([AI Tools #4](/2026/05/16/pi-minimal-agent/)). The same arrangement runs every agent, so what changes between them is the agent and not the setup.

Mike: TODO, a diagram or screenshot of a real session: iTerm2 window, autossh connection, tmux windows.

## iTerm2: the Mac end

iTerm2 is the terminal on the Mac.

Mainly I use it for its watermark, which iTerm2 calls a badge: large, faint text in the corner of each session that shows what that tab is working on. With an agent in every tab, a glance tells me which is which.

Lately there is a second reason: iTerm2 3.7 added a [Claude Code integration](https://iterm2.com/claude-code-integration.html), which shows the status of every Claude session (working, waiting or idle) on its tab.

## autossh: a connection that comes back

ssh is a TCP connection: close the laptop, change Wi-Fi, or let the network drop for long enough, and it is gone. [autossh](https://www.harding.motd.ca/autossh/) starts ssh, watches it, and starts it again when it exits or stops passing traffic. It is still plain ssh, with the same keys, config and port forwards, so there is nothing new on the server.

A reconnect is not seamless: the old connection is gone and a new one takes its place. That is fine, because the work was never in the connection. It is in tmux.

I connect with a shell alias. This one is for large12:

```bash
alias mlarge12='autossh -M 0 -t large12 "tmux attach-session || tmux new-session"'
```

- `-M 0` turns off autossh's own monitoring port, so it restarts ssh whenever ssh exits.
- `-t` gives the remote command a terminal, which tmux needs.
- `tmux attach-session || tmux new-session` re-attaches to the session that is already running, or starts one if there is none.

So one command takes me from the Mac straight back into whatever was running, and a reconnect lands in the same place.

I used [mosh](https://mosh.org/), the mobile shell, before it. mosh keeps a session alive across sleep and changes of network instead of reconnecting, which is the better idea on paper. In practice it proved unreliable for me, and lately it refuses to connect from my Mac at all. Local and cloud LLMs suggested plenty of diagnostics and proposed causes that turned out to be wrong, and none of them got mosh working reliably. autossh is less clever, and it works for me, so far.

## tmux: a session that survives the connection

autossh brings the connection back; tmux keeps the work alive while it is gone. Sessions live on the server, so a reboot of the MacBook, a new client, or a different machine can re-attach to the same running agent. That is what made [multi-day agent runs](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) on the Arch host practical: the agent keeps working whether or not anything is connected to it, and it can be inspected from wherever I am.

I use tmux with a config of my own, and typically with two windows: one running a coding agent, the other a shell.

I connect this way to many different users on the target machines, not just my main one. Those other Linux logins have reduced privileges: they cannot change anything on GitHub, cannot push, and cannot edit each other's cloned repositories. Each agent works in its own login, and the worst it can do stays there.

## Before tmux

Before tmux, Emacs did most of this for me. Its windows split one frame into panes, and a long-running Emacs held my buffers and shells while I came and went: `emacsclient` connected to that running Emacs instead of starting a new one, and [TRAMP](https://www.gnu.org/software/tramp/) let it edit files and run shells on remote machines. I sometimes used GNU screen.

## Chrome Remote Desktop: more than a terminal

Some work needs the remote machine's screen, not just its prompt. For that I use [Chrome Remote Desktop](https://remotedesktop.google.com/) to reach the desktops of the Arch Linux workstations and rack servers from my MacBook.

It lets me do more than the CLI can. I can preview graphics on the machine that made them, and browse local servers in the remote desktop's own browser, where a server listening only on that machine is just a local URL.

## Three ways to lose a session

Each tool closes off one failure: iTerm2 the Mac end, autossh the network in between, tmux the connection itself.

Mike: TODO, a closing in your words. The next post is about what runs at the prompt once you are there: fd, ripgrep, skim, dua and bat.
