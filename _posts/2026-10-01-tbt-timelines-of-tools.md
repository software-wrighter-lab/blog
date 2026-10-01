---
layout: post
title: "TBT #13: Many Decades of Learning the Next Thing --- Timelines of the Tools"
categories: [tbt, programming-history, retrocomputing, tools, languages]
tags: [throwback-thursday, timeline, career, learning, editors, version-control, operating-systems, programming-languages, ides, terminals, build-tools, debuggers, documentation, ai-tools, apl, ibm-mainframe, trs-80, emacs, git, rust, claude-code]
keywords: "software engineering career timeline, tools I have used, learning new things, editors timeline, version control timeline, operating systems timeline, programming languages timeline, IDE timeline, many decades, APL, IBM mainframe, TSO, ISPF, TRS-80, Emacs, vi, git, Rust, Claude Code"
abstract: "To be a career software engineer, one skill is paramount: the ability to learn new things. Over many decades I have had to learn a new way to do something so many times that the list is the career. This Throwback Thursday draws it as timelines --- machines, operating systems, languages, editors, IDEs, version control, terminals, build tools, debuggers, documentation, collaboration and, lately, AI --- one bar per tool, mainframe to cloud, with a note on what each hand-over cost to learn."
series: "Throwback Thursday"
series_part: 13
date: 2026-10-01 00:15:00 -0700
---

<!-- DRAFT NOTE: every bar below is a mainstream guess pending Mike's corrections. Edit years in the data-spans attributes; "1985-1990,2019-2026" gives two bars. -->

<img src="{{ '/assets/images/posts/tbt-tools-color-wordcloud.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 250px;">

<div style="overflow: hidden;" markdown="1">

To be a career software engineer, one skill is paramount: the ability to learn new things. Not a language, not an editor, not a methodology --- the willingness to put down the one you know and pick up the one the work now needs. I have had to learn a new way to do something so many times in this career that, laid end to end, the list *is* the career. [TBT #1](/2026/01/29/tbt-apl-horse-race/) started in 1972 with a horse race in APL on an IBM mainframe. This post draws what came after it, category by category, as timelines.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Where it started** | [TBT #1: My First Program Was a Horse Race](/2026/01/29/tbt-apl-horse-race/) --- APL, 1972 |
| **Some of the stops** | [Welcome](/2026/01/30/welcome-to-software-wrighter-lab/) · [IBM 1130](/2026/02/26/ibm-1130-system-emulator/) · [Pipelines on OS/390](/2026/02/05/tbt-pipelines-os390/) · [BASIC on the TRS-80](/2026/04/16/tbt-cor24-basic-startrek-trs80-robot-chase/) · [Mass Compile and PL/EDIT](/2026/04/30/tbt-mass-compile-pl-edit-aq-system/) · [reg-rs, four regression tools](/2026/03/19/tbt-reg-rs-regression-testing/) · [Six wikis](/2026/03/26/tbt-wiki-rs-six-wikis/) · [APL\360 Revisited](/2026/09/17/tbt-apl-360-revisited/) · [The IBM 5100's APLSV](/2026/09/24/tbt-aplsv-birds-tttml/) |
| **The newest bars** | [Saw #13: A Second Host in the Cloud](/2026/09/27/saw-second-host-word-cloud-benches/) |
| **Prior post** | [TBT #12: The IBM 5100's APLSV](/2026/09/24/tbt-aplsv-birds-tttml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<style>
.tl { margin: 0.6em 0 1.6em; font-size: 0.86em; --tl-bar: var(--link-color); }
.tl-axis, .tl-row { display: grid; grid-template-columns: 15em 1fr; align-items: center; gap: 0.6em; }
.tl-axis { margin-bottom: 0.3em; }
.tl-axis .tl-track { height: 1.2em; border-bottom: 1px solid var(--border-color); }
.tl-track { position: relative; height: 1.1em; }
.tl-row { margin: 0.22em 0; }
.tl-row .tl-track { background: repeating-linear-gradient(to right, transparent 0, transparent calc(var(--tl-decade) - 1px), var(--border-color) calc(var(--tl-decade) - 1px), var(--border-color) var(--tl-decade)); background-position: var(--tl-offset) 0; }
.tl-label { text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-color); }
.tl-bar { position: absolute; top: 0.1em; height: 0.9em; border-radius: 3px; background: var(--tl-bar); opacity: 0.85; }
.tl-bar:hover { opacity: 1; }
.tl-tick { position: absolute; top: 0; transform: translateX(-50%); font-size: 0.85em; color: var(--text-secondary); white-space: nowrap; }
.tl-now { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--text-secondary); opacity: 0.5; }
@media (max-width: 600px) {
  .tl-axis, .tl-row { grid-template-columns: 8em 1fr; gap: 0.4em; }
  .tl { font-size: 0.78em; }
}
</style>

<script>
(function () {
  function build(tl) {
    var start = +tl.dataset.start, end = +tl.dataset.end, span = end - start;
    var pct = function (y) { return ((y - start) / span * 100); };
    var firstDecade = Math.ceil(start / 10) * 10;
    var decadePct = 10 / span * 100;
    tl.style.setProperty('--tl-decade', decadePct + '%');
    tl.style.setProperty('--tl-offset', pct(firstDecade) + '%');
    var axis = document.createElement('div'); axis.className = 'tl-axis';
    axis.innerHTML = '<div class="tl-label"></div><div class="tl-track"></div>';
    var track = axis.lastElementChild;
    for (var y = firstDecade; y <= end; y += 10) {
      var t = document.createElement('span'); t.className = 'tl-tick';
      t.style.left = pct(y) + '%'; t.textContent = y; track.appendChild(t);
    }
    tl.insertBefore(axis, tl.firstChild);
    tl.querySelectorAll('.tl-row').forEach(function (row) {
      var name = row.dataset.name, spans = row.dataset.spans.split(',');
      row.innerHTML = '<div class="tl-label" title="' + name + '">' + name + '</div><div class="tl-track"></div>';
      var tr = row.lastElementChild;
      spans.forEach(function (s) {
        var ab = s.trim().split('-'), a = +ab[0], b = ab[1] === undefined || ab[1] === '' ? end : +ab[1];
        var bar = document.createElement('span'); bar.className = 'tl-bar';
        bar.style.left = pct(a) + '%'; bar.style.width = Math.max(0.6, pct(b) - pct(a)) + '%';
        bar.title = name + ': ' + a + (b === end ? '–now' : '–' + b);
        tr.appendChild(bar);
      });
    });
  }
  function all() { document.querySelectorAll('.tl').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
})();
</script>

<div class="aside-box" style="float: left; clear: left; margin: 0.3em 1.8em 1.2em 0;" markdown="1">

**How to read these.** One bar per tool, 1972 on the left, today on the right; a gap means I stopped and a second bar means I came back. The bars are drawn from memory and rounded to the year --- the point is the *number of hand-overs*, not the exact dates. Hover a bar for its years.

</div>

<div class="clearfix" style="clear: both; padding-top: 0.5em;" markdown="1">

## Where I was

The row everything else hangs from. The dates on the right half are the ones I am least sure of, and the ones that matter least: the pattern is the point, and the pattern is *a new employer meant a new stack*. The startups, in order, were LogiCoy, Likestream, Guidewire, Illumio and Signifyd.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="High school, APL self-study" data-spans="1972-1973"></div>
<div class="tl-row" data-name="College, UNIVAC 1108" data-spans="1973-1977"></div>
<div class="tl-row" data-name="IBM Customer Engineer" data-spans="1977-1981"></div>
<div class="tl-row" data-name="IBM, MVS development" data-spans="1981-1990"></div>
<div class="tl-row" data-name="IBM T.J. Watson Research" data-spans="1990-1999"></div>
<div class="tl-row" data-name="Forte Software" data-spans="2000-2002"></div>
<div class="tl-row" data-name="Sun Microsystems" data-spans="2002-2009"></div>
<div class="tl-row" data-name="Startups (five of them)" data-spans="2009-2025"></div>
<div class="tl-row" data-name="Software Wrighter Lab" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Machines

Every row here is a different idea of what a computer is: a room you reached through a typewriter, a machine you fixed with an oscilloscope, a briefcase with a CRT, a kit on the kitchen table, a box under the desk, a rack in the garage, a VM in someone else's building. Each one changed what "running a program" meant, and that was always the first thing to learn.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="IBM S/360, S/370" data-spans="1972-1990"></div>
<div class="tl-row" data-name="UNIVAC 1108" data-spans="1973-1977"></div>
<div class="tl-row" data-name="IBM 1130, 1800" data-spans="1977-1981"></div>
<div class="tl-row" data-name="IBM 2250 graphics display" data-spans="1977-1981"></div>
<div class="tl-row" data-name="IBM 5100 family" data-spans="1977-1981"></div>
<div class="tl-row" data-name="Netronics ELF II (RCA 1802)" data-spans="1978-1980"></div>
<div class="tl-row" data-name="TRS-80 Model I" data-spans="1979-1983"></div>
<div class="tl-row" data-name="IBM 3270 on MVS" data-spans="1981-1999"></div>
<div class="tl-row" data-name="IBM PC and compatibles" data-spans="1982-2026"></div>
<div class="tl-row" data-name="IBM 7437 workstation (AT)" data-spans="1987-1991"></div>
<div class="tl-row" data-name="IBM S/390" data-spans="1990-2002"></div>
<div class="tl-row" data-name="Sun workstations" data-spans="2000-2009"></div>
<div class="tl-row" data-name="Smartphones (Galaxy on)" data-spans="2009-2026"></div>
<div class="tl-row" data-name="Macs (Intel, M1, M3)" data-spans="2010-2026"></div>
<div class="tl-row" data-name="AWS" data-spans="2010-2017"></div>
<div class="tl-row" data-name="Cloud VM" data-spans="2023-2026"></div>
<div class="tl-row" data-name="Droplets, Colab, RunPod, etc." data-spans="2023-2026"></div>
<div class="tl-row" data-name="Lucy: home GPU cluster" data-spans="2024-2026"></div>
<div class="tl-row" data-name="Arduino, RPi, ESP32" data-spans="2024-2026"></div>
<div class="tl-row" data-name="COR24, Espressif, Sipeed" data-spans="2026-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Operating systems

Time-sharing on a mainframe, a single-program loader on a microcomputer, UNIX and MINIX and then Slackware on a PC --- and Linux has been one bar ever since, Slackware to Knoppix to SUSE to Debian to Ubuntu to Arch, six distributions and one kernel. This year adds two operating systems of my own.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="APL\360 (time-sharing)" data-spans="1972-1977"></div>
<div class="tl-row" data-name="UNIVAC EXEC 8" data-spans="1973-1977"></div>
<div class="tl-row" data-name="IBM 1130 DM2" data-spans="1977-1981"></div>
<div class="tl-row" data-name="TRSDOS" data-spans="1979-1983"></div>
<div class="tl-row" data-name="MVS/370, MVS/XA" data-spans="1982-1990"></div>
<div class="tl-row" data-name="VM/SP" data-spans="1982-2000"></div>
<div class="tl-row" data-name="PC-DOS, MS-DOS" data-spans="1982-1995"></div>
<div class="tl-row" data-name="OS/390 (pre-release on)" data-spans="1988-2002"></div>
<div class="tl-row" data-name="UNIX on PCs, MINIX" data-spans="1991-1994"></div>
<div class="tl-row" data-name="BSD: NetBSD, FreeBSD" data-spans="1993-1999"></div>
<div class="tl-row" data-name="Linux: Slackware … Arch" data-spans="1994-2026"></div>
<div class="tl-row" data-name="Windows" data-spans="1995-2026"></div>
<div class="tl-row" data-name="Solaris" data-spans="2000-2009"></div>
<div class="tl-row" data-name="macOS" data-spans="2010-2026"></div>
<div class="tl-row" data-name="Android" data-spans="2010-2026"></div>
<div class="tl-row" data-name="Bare metal, RTOS" data-spans="2025-2026"></div>
<div class="tl-row" data-name="Mine: sw-tos, sw-os-ml (MLOS)" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Programming languages

The longest list, and the one where "learning a new way to do something" is most literal: every hand-over here is a different way of writing the answer down. APL has a second bar fifty years after the first.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="APL" data-spans="1972-1983,2025-2026"></div>
<div class="tl-row" data-name="ALGOL 68, BASIC, COBOL, SNOBOL4" data-spans="1973-1983"></div>
<div class="tl-row" data-name="1130 machine code" data-spans="1977-1981"></div>
<div class="tl-row" data-name="1802 machine code (ELF II)" data-spans="1978-1980"></div>
<div class="tl-row" data-name="Z80 assembler (TRS-80)" data-spans="1979-1983"></div>
<div class="tl-row" data-name="Pascal" data-spans="1980-1999"></div>
<div class="tl-row" data-name="S/370, S/390 Assembler" data-spans="1981-1999"></div>
<div class="tl-row" data-name="PL/S, PL/AS, PL/X" data-spans="1981-1999"></div>
<div class="tl-row" data-name="Lisps: Scheme, Common Lisp, Racket, Elisp" data-spans="1989-2026"></div>
<div class="tl-row" data-name="CMS/TSO Pipelines" data-spans="1990-1999"></div>
<div class="tl-row" data-name="C, C++, Perl" data-spans="1991-2005"></div>
<div class="tl-row" data-name="Java" data-spans="1996-2017"></div>
<div class="tl-row" data-name="Forte 4GL" data-spans="2000-2005"></div>
<div class="tl-row" data-name="JavaScript, TypeScript" data-spans="2005-2026"></div>
<div class="tl-row" data-name="Clojure, ClojureScript" data-spans="2010-2014"></div>
<div class="tl-row" data-name="Python" data-spans="2010-2026"></div>
<div class="tl-row" data-name="Groovy, Guidewire Gosu" data-spans="2012-2018"></div>
<div class="tl-row" data-name="Go" data-spans="2015-2020"></div>
<div class="tl-row" data-name="Kotlin" data-spans="2016-2018"></div>
<div class="tl-row" data-name="Rust" data-spans="2018-2026"></div>
<div class="tl-row" data-name="WebAssembly" data-spans="2021-2026"></div>
<div class="tl-row" data-name="Mine: PL/SW, sw-MLPL, X_eTaL" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Editors

A line editor inside APL, a keypunch, the two mainframe full-screen editors, and then one editor that has now outlasted every operating system on the page but one.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="APL ∇ editor" data-spans="1972-1983"></div>
<div class="tl-row" data-name="IBM 029 keypunch" data-spans="1973-1982"></div>
<div class="tl-row" data-name="SPF / ISPF editor" data-spans="1981-1999"></div>
<div class="tl-row" data-name="XEDIT" data-spans="1987-1991"></div>
<div class="tl-row" data-name="Emacs" data-spans="1989-2026"></div>
<div class="tl-row" data-name="vi" data-spans="1991-2026"></div>
<div class="tl-row" data-name="nano" data-spans="2000-2026"></div>
<div class="tl-row" data-name="Kate, Espanso, my own" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## IDEs

In 1985 IDEs were a Macintosh and Smalltalk lab curiosity; the big Java IDEs made them an expectation; the current ones are a keystroke away from being agents. Emacs had a few years as one too.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="ISPF, PL/EDIT" data-spans="1981-1999"></div>
<div class="tl-row" data-name="SuperCede" data-spans="1996-1998"></div>
<div class="tl-row" data-name="IBM VisualAge for Java" data-spans="1998-2000"></div>
<div class="tl-row" data-name="Emacs as IDE" data-spans="1998-2003"></div>
<div class="tl-row" data-name="NetBeans" data-spans="2001-2009"></div>
<div class="tl-row" data-name="Blender (3D)" data-spans="2002-2026"></div>
<div class="tl-row" data-name="Eclipse" data-spans="2004-2012"></div>
<div class="tl-row" data-name="IntelliJ" data-spans="2012-2025"></div>
<div class="tl-row" data-name="Android Studio" data-spans="2014-2026"></div>
<div class="tl-row" data-name="VS Code" data-spans="2016-2025"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Version control

IBM had version control before most of the industry had the phrase: CLEAR through the 1980s, then CMVC, both of them change-control systems as much as source control, where a change had a number and an owner before it had a diff. Every tool after that made a different promise about who could change what, when --- CVS, RCS at Forte, Subversion, then Mercurial at Sun --- and git's promise, everyone, always, sort it out later, is the one that stuck. GitHub is where the lab now lives.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="IBM CLEAR" data-spans="1982-1989"></div>
<div class="tl-row" data-name="IBM CMVC" data-spans="1990-1995"></div>
<div class="tl-row" data-name="CVS" data-spans="1996-2000"></div>
<div class="tl-row" data-name="RCS" data-spans="2000-2002"></div>
<div class="tl-row" data-name="Subversion" data-spans="2004-2007"></div>
<div class="tl-row" data-name="Mercurial" data-spans="2007-2009"></div>
<div class="tl-row" data-name="Git" data-spans="2010-2026"></div>
<div class="tl-row" data-name="Perforce" data-spans="2012-2016"></div>
<div class="tl-row" data-name="GitHub" data-spans="2012-2026"></div>
<div class="tl-row" data-name="GitHub Wikis, gists" data-spans="2024-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Terminals and shells

The 2741 was a typewriter; the 1130 had switches and lights; the 3270 was a form; the VT100 was a glass teletype that has never gone away. Everything I use today --- mosh into an Arch box, tmux, a shell inside Emacs --- is still pretending to be the last one.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="IBM 2741" data-spans="1972-1977"></div>
<div class="tl-row" data-name="Teletype (UNIVAC)" data-spans="1973-1977"></div>
<div class="tl-row" data-name="1130 console switches" data-spans="1977-1981"></div>
<div class="tl-row" data-name="IBM 5471 on the TRS-80" data-spans="1980-1983"></div>
<div class="tl-row" data-name="IBM 3270" data-spans="1981-1999"></div>
<div class="tl-row" data-name="TSO, CLIST, REXX" data-spans="1981-1999"></div>
<div class="tl-row" data-name="xterm, VT100" data-spans="1991-2010"></div>
<div class="tl-row" data-name="sh, ksh, bash" data-spans="1991-2026"></div>
<div class="tl-row" data-name="BeanShell" data-spans="1997-2000"></div>
<div class="tl-row" data-name="Project-switch scripts" data-spans="2000-2026"></div>
<div class="tl-row" data-name="JavaScript E4X (Rhino)" data-spans="2004-2009"></div>
<div class="tl-row" data-name="ssh, mosh, tmux" data-spans="2005-2026"></div>
<div class="tl-row" data-name="Emacs shell" data-spans="2015-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Build and run

JES2 batch first: a job is a deck, a step is a program, and a dataset is a contract between them. Mass Compile sat on top of it. Everything since has been some way of saying "run these, in this order, only if needed."

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="JCL, JES2 batch" data-spans="1981-1999"></div>
<div class="tl-row" data-name="Mass Compile (MVS)" data-spans="1984-1990"></div>
<div class="tl-row" data-name="Shell scripts" data-spans="1990-2026"></div>
<div class="tl-row" data-name="make" data-spans="1991-2002"></div>
<div class="tl-row" data-name="ant, maven" data-spans="2001-2012"></div>
<div class="tl-row" data-name="Gradle, Docker" data-spans="2012-2025"></div>
<div class="tl-row" data-name="Node.js, Deno" data-spans="2013-2026"></div>
<div class="tl-row" data-name="webpack, JS bundlers" data-spans="2014-2026"></div>
<div class="tl-row" data-name="sbt" data-spans="2017-2017"></div>
<div class="tl-row" data-name="cargo" data-spans="2018-2026"></div>
<div class="tl-row" data-name="GitHub Actions" data-spans="2020-2026"></div>
<div class="tl-row" data-name="just" data-spans="2024-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Tech stacks

The tools above rarely arrived one at a time. They came as stacks --- a machine, an operating system, a language, a store, a server, a build --- and each employer or project meant learning the next bundle, from the mainframe stack through LAMP and MEAN to the one I use now, where the build runs in the cloud and an agent does half the typing.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="IBM mainframe" data-spans="1981-1999"></div>
<div class="tl-row" data-name="VM/CMS" data-spans="1982-2000"></div>
<div class="tl-row" data-name="PC-DOS / OS/2 desktop" data-spans="1982-1996"></div>
<div class="tl-row" data-name="Early web (CGI)" data-spans="1996-2001"></div>
<div class="tl-row" data-name="Forte 4GL" data-spans="2000-2005"></div>
<div class="tl-row" data-name="LAMP" data-spans="2001-2010"></div>
<div class="tl-row" data-name="Java EE" data-spans="2001-2009"></div>
<div class="tl-row" data-name="Rails era wiki stack" data-spans="2001-2008"></div>
<div class="tl-row" data-name="Open ESB / SOA" data-spans="2005-2011"></div>
<div class="tl-row" data-name="Ext JS" data-spans="2009-2011"></div>
<div class="tl-row" data-name="Clojure web" data-spans="2010-2014"></div>
<div class="tl-row" data-name="Cloud VMs" data-spans="2010-2026"></div>
<div class="tl-row" data-name="Visualization" data-spans="2012-2026"></div>
<div class="tl-row" data-name="Guidewire platform" data-spans="2012-2018"></div>
<div class="tl-row" data-name="Build & release" data-spans="2012-2020"></div>
<div class="tl-row" data-name="MEAN / MERN" data-spans="2013-2018"></div>
<div class="tl-row" data-name="Node frameworks" data-spans="2013-2018"></div>
<div class="tl-row" data-name="Android" data-spans="2014-2018"></div>
<div class="tl-row" data-name="Next.js, Meteor, Firebase" data-spans="2015-2018"></div>
<div class="tl-row" data-name="Rust + WASM" data-spans="2018-2026"></div>
<div class="tl-row" data-name="Local ML" data-spans="2023-2026"></div>
<div class="tl-row" data-name="Static site" data-spans="2024-2026"></div>
<div class="tl-row" data-name="Embedded" data-spans="2024-2026"></div>
<div class="tl-row" data-name="Agentic dev" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Debugging and testing

Dumps, an oscilloscope, a debugger, Chrome's DevTools, a regression report. I have written the same regression tool four times in four languages, and a unit-test framework for each language that arrived without one --- Forte 4GL, Gosu, sw-MLPL --- which says something about what stays constant when everything else on this page changes. Not on a bar of their own, but in use the whole way: fuzzed input, and error injection to test the recovery paths.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="Oscilloscope, console lights" data-spans="1977-1981"></div>
<div class="tl-row" data-name="Dumps, SADUMP" data-spans="1981-1999"></div>
<div class="tl-row" data-name="7437 local debugging" data-spans="1987-1991"></div>
<div class="tl-row" data-name="gdb, IDE debuggers" data-spans="1991-2020"></div>
<div class="tl-row" data-name="JUnit, TestNG, JUnit 4" data-spans="1998-2017"></div>
<div class="tl-row" data-name="regress (C/C++)" data-spans="2000-2001"></div>
<div class="tl-row" data-name="ForteUnit (mine)" data-spans="2000-2005"></div>
<div class="tl-row" data-name="jregress (Java)" data-spans="2001-2009"></div>
<div class="tl-row" data-name="Chrome DevTools" data-spans="2010-2026"></div>
<div class="tl-row" data-name="GosuUnit (mine)" data-spans="2012-2018"></div>
<div class="tl-row" data-name="Jest, Wallaby.js, Cucumber" data-spans="2014-2018"></div>
<div class="tl-row" data-name="Storybook" data-spans="2016-2018"></div>
<div class="tl-row" data-name="Playwright" data-spans="2020-2026"></div>
<div class="tl-row" data-name="rtt1 (Rust)" data-spans="2020-2024"></div>
<div class="tl-row" data-name="mlplunit (sw-MLPL, mine)" data-spans="2025-2026"></div>
<div class="tl-row" data-name="reg-rs" data-spans="2025-2026"></div>
<div class="tl-row" data-name="Emulators as debuggers" data-spans="2025-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Documentation

How the writing got done, which is its own list of hand-overs: markup that ran on the mainframe, a word processor and then its open-source successors, twice, the web, the wiki --- I read Ward's original in the late 1990s and installed my own for teams at Sun --- and finally the plain-text formats that let documentation live next to code.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="SCRIPT/GML, BookMaster" data-spans="1981-1999"></div>
<div class="tl-row" data-name="Wikis: c2, TiKi, VQWiki, Tiddly" data-spans="1995-2026"></div>
<div class="tl-row" data-name="HTML" data-spans="1996-2026"></div>
<div class="tl-row" data-name="Word" data-spans="1997-2001"></div>
<div class="tl-row" data-name="OpenOffice" data-spans="2001-2011"></div>
<div class="tl-row" data-name="Org-mode, Babel" data-spans="2010-2026"></div>
<div class="tl-row" data-name="LibreOffice" data-spans="2011-2026"></div>
<div class="tl-row" data-name="Markdown" data-spans="2012-2026"></div>
<div class="tl-row" data-name="GitHub Wikis" data-spans="2024-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## Working with other people

Memos, then office mail, then the wiki, then the video call in three generations, then the closed chat rooms --- and, this month, IRC, because that is where the people who write operating systems still are.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="PROFS, office memos" data-spans="1981-1995"></div>
<div class="tl-row" data-name="Email" data-spans="1990-2026"></div>
<div class="tl-row" data-name="Wikis" data-spans="1995-2026"></div>
<div class="tl-row" data-name="WebEx" data-spans="1997-2013"></div>
<div class="tl-row" data-name="Skype" data-spans="2005-2010"></div>
<div class="tl-row" data-name="Jitsi, Zoom" data-spans="2013-2026"></div>
<div class="tl-row" data-name="Slack" data-spans="2014-2018"></div>
<div class="tl-row" data-name="Discord, YouTube" data-spans="2025-2026"></div>
<div class="tl-row" data-name="IRC, OSDev.org" data-spans="2026-2026"></div>
</div>

</div>

<div class="clearfix" markdown="1">

## AI tools

The steepest timeline, with one early outlier: an IBM expert-system shell in the 1990s, then nothing for twenty-five years. Three years ago the row restarted; today an agent works one side of an operating system port while I work the other, and I have written tooling of my own to keep several of them on the rails at once.

<div class="tl" data-start="1972" data-end="2026">
<div class="tl-row" data-name="IBM Knowledge Tool" data-spans="1996-1997"></div>
<div class="tl-row" data-name="ChatGPT" data-spans="2023-2025"></div>
<div class="tl-row" data-name="Claude" data-spans="2024-2026"></div>
<div class="tl-row" data-name="Claude Code" data-spans="2025-2026"></div>
<div class="tl-row" data-name="Codex, Gemini, opencode" data-spans="2026-2026"></div>
<div class="tl-row" data-name="Local models on Lucy" data-spans="2026-2026"></div>
<div class="tl-row" data-name="agentrail, ATN (mine)" data-spans="2026-2026"></div>
<div class="tl-row" data-name="Cloud sessions" data-spans="2026-2026"></div>
</div>

</div>
## What the bars say

Count the hand-overs. Not the tools --- the *edges*, the places where one bar ends and another begins and there was a week, or a month, or a year of being bad at something I used to be good at. There are more of those on this page than there are years in the career, and every one of them was the job. The languages changed what I could say; the editors and version control changed how fast I could say it and how safely; the operating systems and machines changed what "it runs" meant; and the last row changed who was typing.

A few bars never end. Emacs since 1989. APL, which came back after forty years: I build APL interpreters for education, use APL to test microprocessors, and design new APL-inspired languages for problems in machine learning and embedded work. A regression tool I have rewritten in every language I have settled in. Those are not exceptions to the rule; they are what learning the next thing looks like when the old thing was worth keeping.

None of the tools was the skill. Learning the next one was.
