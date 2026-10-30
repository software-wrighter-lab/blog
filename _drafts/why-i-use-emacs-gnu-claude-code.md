---
layout: post
title: "Why I Use #5: Emacs, GNU and Claude Code"
categories: [tools, editors]
tags: [why-i-use, emacs, elisp, gnu, gnu-apl, org-mode, claude-code, ai-agents, skills, editors]
keywords: "why I use Emacs, Emacs since 1989, Emacs packages for CLI tools, Emacs glyph input, Quail input method, Org Babel, GNU APL, why I use Claude Code, Claude Code skills, cloud agents"
abstract: "Fifth in the series on the tools I reach for, and the first about tools I did not write. Emacs, which I have used since 1989 as an editor, for a while as an IDE, as a shell, and as the place my own command-line tools plug in; the GNU tools around it, among them GNU APL; and Claude Code, with skills and agents working in the cloud."
series: "Why I Use"
series_part: 5
date: 2026-11-01 00:15:00 -0700
---

<!-- DRAFT (2026-10-30), Mike: "start a draft for the next why i use series, with the other topics, like Emacs, you suggested.
     Draft it so I can decide if it will be one or more posts." Topics are the ones suggested on 2026-10-30 (Emacs, Claude Code)
     plus GNU, which the lead image suggests. Each part is written to stand alone, so the post can split at the "SPLIT POINT"
     markers into #5 Emacs (with GNU) and #6 Claude Code, or keep one post. Facts are from published posts only: TBT #13's
     timelines (Emacs 1989-, vi 1991-, Emacs as IDE 1998-2003, Emacs shell 2015-), Saw #4 (Emacs packages for pjmai-rs and reg-rs),
     Saw #8 (Emacs glyph entry: TeX-style, Agda-style, a custom Quail method), AL #19 (X_eTaL's Emacs mode, Org Babel), TBT #1 (GNU
     APL), AI Tools #8 (the domain-expert skill), Saw #16 (Claude in the cloud on several repos). Mike's own reasons are marked
     "Mike: TODO". Lead image: Mike's block-gnu.jpg (Dropbox), white background made transparent, color, no-invert.
     Date 11/01 is a placeholder after #4 (10/31). repo_urls: none yet (add if a section links Mike's repos). -->

<img src="{{ '/assets/images/posts/block-gnu.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 230px;">

The [last post](/2026/10/31/why-i-use-my-tools/) in this series was about tools I wrote. This one is about tools I did not write but have built a working life around: Emacs, the GNU tools around it, and, much more recently, Claude Code.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Emacs** | [gnu.org/software/emacs](https://www.gnu.org/software/emacs/) |
| **GNU APL** | [gnu.org/software/apl](https://www.gnu.org/software/apl/) |
| **Claude Code** | [claude.com/claude-code](https://claude.com/claude-code) |
| **The longer timeline** | [TBT #13: Many Decades of Learning the Next Thing](/2026/10/01/tbt-timelines-of-tools/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Emacs, since 1989

Emacs is one of the few bars on [my career timeline](/2026/10/01/tbt-timelines-of-tools/) that never ends: I have used it since 1989, vi since 1991 beside it, and for a few years around 2000 Emacs was my IDE as well as my editor.

Mike: TODO, why Emacs and not something newer, in your words (what keeps you in it: the keyboard, Lisp, the shell, buffers, that it outlasts every IDE?).

## Emacs as the place my tools plug in

Emacs is where my own command-line tools meet. [pjmai-rs and reg-rs both have Emacs packages](/2026/03/29/saw-pjmai-reg-emacs-all-together-now/), so switching projects and running regression tests happen in the editor as well as the terminal. X_eTaL has an Emacs mode that highlights and draws its notation, with Org Babel support so X_eTaL runs inside literate documents ([Array Languages #19](/2026/10/27/array-languages-xetal-tooling/)). And when my languages need glyphs, for APL, Tuplet and X_eTaL, Emacs has its own input methods for them: TeX-style and Agda-style mappings and a custom Quail input method ([Saw #8](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/)).

## Emacs as a shell

Since 2015 I have also used Emacs as a shell.

Mike: TODO, what Emacs's shell gives you over a terminal (and where you still use mosh, tmux and a plain terminal, as TBT #13 shows).

## The GNU tools around it

Emacs is a GNU program, and it is not the only one I lean on. When I recreated [my first program](/2026/01/29/tbt-apl-horse-race/), a 1972 horse race in APL, it was GNU APL that ran it.

Mike: TODO, which other GNU tools matter to you, and whether this section stays (it could fold into the Emacs part).

<!-- SPLIT POINT: everything above can be "Why I Use #5: Emacs (and GNU)"; everything below "Why I Use #6: Claude Code". -->

## Claude Code

The newest tool here. Claude Code was the agent behind the second, successful attempt at the sound-effects project in [AI Tools #8](/2026/10/29/ai-tools-domain-expert-skill/), and behind the cloud agents that worked on the Reva and CoSy forks.

Mike: TODO, why Claude Code rather than the other agents you have tried (opencode with GLM in February, Pi, the local models in AI Tools #6), in your words.

## Skills and agents in the cloud

Two things have changed how I use it lately. Skills: a skill is a set of instructions an agent loads for one kind of task, and the one I wrote about in [AI Tools #8](/2026/10/29/ai-tools-domain-expert-skill/), domain-expert, began as a Gemini skill someone sent me that I converted for Claude Code. It made the agent research a field from its primary sources before writing code, and restarted a project I had considered stuck. And agents in the cloud: Claude working on several repositories at once, which is [how two forks moved as fast as they did](/2026/10/25/saw-reva-fork-cosy/) over one weekend.

## How they fit together
{: .pos-center}

Mike: TODO, a closing in your words, or keep the split and give each post its own.
