---
layout: post
title: "Saw #9: Espanso, Kate, ShareX, and Pluggable I2C Devices on COR24"
date: 2026-05-03 09:30:00 -0700
categories: [tools, productivity, embedded, emulators, languages, language-design]
tags: [sharpen-the-saw, espanso, kate-editor, sharex, gh-cli, gist, language-design, collaboration, pal, apl, tuplet, syntax-highlighting, ksyntaxhighlighting, cor24, i2c, spi, emulator, pluggable-devices, tmp101, ds3231, eeprom]
keywords: "Espanso text expander, Kate editor syntax highlighting, KSyntaxHighlighting XML, gh gist create, GitHub CLI gist, language design collaboration, PAL language, APL glyphs, Tuplet glyphs, COR24 emulator, I2C pluggable devices, bit-banged GPIO emulation, TMP101 simulator, DS3231 RTC, EEPROM simulator, SPI emulator, three-layer architecture, language I/O examples, sharing language snippets, cross-platform editor"
author: Software Wrighter
abstract: "Three tools that turn out to be the same problem in disguise---Espanso for shared glyph input, Kate for one-XML-file syntax highlighting, and `gh gist create` standing in for ShareX---all earning their slot because they make collaborating on a new in-development language (PAL) cheap. Plus a deeper cut on the COR24 emulator: a three-layer I2C design (guest C apps / bit-banged bus state machine / pluggable device trait) that lets every COR24 language share the same I/O example library, with SPI sketched as a parallel phase 2."
series: "Sharpen the Saw Sundays"
series_part: 9
---

<img src="{{ '/assets/images/posts/block-eight-saws.webp' | relative_url }}" class="post-marker no-invert" alt="Eight different saws---rip, crosscut, coping, keyhole, two-handed, pruning---rendered as a woodcut" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

Ninth Sharpen the Saw update. [Last time](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/) the theme was *forcing functions*: writing real programs in a new language exposes the missing language features, and outgrowing a single laptop exposes the missing project structure. This week the theme is *collaborating on language design*---the small editor-and-OS-level pieces that decide whether two people working on a new language can actually share work without friction. Plus one platform piece: turning the COR24 emulator's I2C bus into a *pluggable* device socket so the language-side I/O examples can grow without the emulator growing.

The first three tools---Espanso, Kate's syntax-highlighting config, and the GitHub CLI standing in for ShareX---all earn their slot for the same reason: they let me share glyph input, editor support, and snippets back and forth with a colleague who's designing **PAL**, an in-development language with its own non-ASCII surface syntax. The fourth thread (pluggable I2C devices on the COR24 emulator) is unrelated infrastructure for the COR24 language stack, but it's the same shape of work: build the platform piece so the language-side experiments cost less.

</div>

<!--more-->

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---editors, snippet expanders, screenshot pipelines, emulators, peripheral simulators---so the feature work on top goes faster.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Espanso** | [espanso.org](https://espanso.org/) |
| **Kate Editor** | [kate-editor.org](https://kate-editor.org/) |
| **ShareX** | [getsharex.com](https://getsharex.com/) |
| **COR24 Emulator** | [github.com/sw-embed/sw-cor24-emulator](https://github.com/sw-embed/sw-cor24-emulator) |
| **Prior Post** | [Saw #8: Tuplet, Smalltalk, Forth-from-Forth, sw-MLPL Split, and I2C on COR24](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Espanso: Shared Glyph Input for Collaborating on a New Language

[Espanso](https://espanso.org/) is a cross-platform text expander written in Rust. Type a short trigger, get a replacement string anywhere your OS accepts text input---editor, terminal, browser address bar, chat window, IDE. It runs as a background service, the configuration is plain YAML in a known directory, and packages can be shared the same way other tooling shares plugins.

The reason Espanso earned a Sharpen the Saw slot of its own (it was already mentioned in [Part 8](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/) as the Tuplet glyph-entry layer) is the **collaboration angle**: a glyph language is unusable if your collaborator can't type the glyphs. Sharing a checked-in YAML file means both sides of the design conversation type the same triggers and produce the same source. There is no "it works on my keyboard layout" problem when the layout is a YAML file in the repo.

The use cases keep stacking up beyond glyphs:

- **APL, Tuplet, and PAL glyphs** --- the original reason. Three Espanso config files now ship alongside the language repos: one for [APL](https://www.gnu.org/software/apl/) glyphs (`⍳⍴⍵⌽`...), one for [Tuplet](https://github.com/sw-vibe-coding/tuplet) (`▪→←ℤ⎧⎨⎩`...), and one for **PAL**, a colleague's in-development language with its own non-ASCII surface syntax. Same trigger discipline across all three; the same muscle memory works in any editor or terminal that accepts text---and the colleague designing PAL gets a working glyph-entry layer by cloning a config, not by hand-rolling AltGr maps.
- **Date and timestamp snippets** --- ISO dates, blog post front-matter date strings (`2026-05-03 00:15:00 -0800`), git commit subject prefixes. Anything I type more than three times a week is a candidate.
- **Boilerplate scaffolds** --- front matter blocks for new posts, the standard Sharpen the Saw resource box, the standard "Why Sharpen the Saw?" aside. Every one of those used to be a copy-paste from the previous post; now they expand from a trigger.
- **Shell one-liners** --- the long-but-forgettable invocations: `git log --oneline --decorate --graph --all -n 30`, the `ffmpeg` call I always forget the flag order for, the `find . -name '*.md' -exec grep -l ...` pattern.

The leverage is in the *aggregation*: each individual snippet saves a few seconds, but the union covers a non-trivial fraction of daily typing, and the muscle memory is the same trigger set everywhere.

The cost to add a new snippet is small enough (one YAML entry, no restart) that the friction curve flips: instead of "is it worth automating?", the question becomes "is there any reason *not* to?". The fact that adding PAL took roughly an afternoon---read the language's glyph list, write the YAML, install on each machine---is the demonstration: the third language is dramatically cheaper than the first.

<!-- TODO: link the three Espanso configs once they're published / pointable. Decide whether they live in their respective language repos or in a shared dotfiles repo. -->

## Kate: An Editor Where a New Language Is a Config File, Not a Plugin

[Kate](https://kate-editor.org/) is the KDE project's text editor---a serious general-purpose editor that runs on Linux, macOS, and Windows. It is not a replacement for Emacs (where the language and config story is years deep) or for the IDE-of-the-week, but it earns its slot here for one specific reason: **giving a collaborator's in-development language editor support is a single XML file, not a plugin or an LSP project.** That cost ratio matters a lot when the language changes weekly.

Beyond that, the usual fast-editor virtues:

- **Instant startup**, even on a cold launch. Useful for quick edits where a full IDE is overkill.
- **Real syntax highlighting and code folding** for hundreds of languages out of the box, including the obscure ones (Forth, BASIC, Smalltalk, APL) that most "lightweight" editors treat as plain text.
- **Built-in terminal pane** and a tabbed multi-document view, so it scales up from "open one file" to "open a whole directory tree" without ceremony.
- **Same UX on all three OSes** --- when I am bouncing between a Linux GPU box, a Mac laptop, and a Windows machine for screen-recording, having one editor with the same keybindings everywhere reduces context-switch tax.

Kate's role in the toolbox is the editor-equivalent of `cat` or `less`: not the place where the heavy work happens, but the place I open *first* when I just need to look at a file or a directory and see it formatted correctly. It has gradually displaced "open this in TextEdit / Notepad / Gedit and squint" for everything except where Emacs already wins.

The Sharpen the Saw value is portability: the cost of adding a new platform to the workflow drops if the editor moves with you.

### Custom syntax highlighting for PAL

Kate's syntax highlighting is driven by [KSyntaxHighlighting XML files](https://docs.kde.org/stable5/en/kate/katepart/highlight.html)---one file per language, declarative keyword lists, region rules, and reference styles. There's no compiled extension, no language-server dance, no marketplace round-trip. For a language whose grammar is changing week-over-week between two collaborators, that round-trip cost is what would otherwise kill editor support entirely.

For **PAL**---a colleague's in-development language with its own keyword set and surface syntax---the recipe is:

<!-- TODO: actually walk through the steps once the PAL highlighter is working. Anchor: where does the .xml live (system path vs `~/.local/share/org.kde.syntax-highlighting/syntax/`), how to test reload, how to map file extensions, how to handle the language's specific gotchas (string escapes, comment shapes, glyphs). -->

1. Drop a `pal.xml` (KSyntaxHighlighting format) into Kate's user syntax directory.
2. Bind the `.pal` extension and any associated glob patterns to the new highlighter.
3. Reload (or restart Kate) and verify on a representative source file.
4. Iterate: keyword list, comment delimiters, string and number rules, any glyph-specific tokens that overlap with the Espanso input layer.

That gives PAL a real editing experience on every machine that has Kate installed---no fork, no plugin maintenance, just a single XML file to ship alongside the language. Both collaborators get the same highlighter from the same checked-in file; a grammar change is one PR away from showing up in everyone's editor. Same pattern would work for Tuplet and for the COR24 Forth/BASIC/OCaml dialects where Kate's stock highlighters need a few project-specific tweaks.

The point is the same one that drives the Espanso config story: when two people are designing a language together, *editor support and input methods are part of the language*---not a downstream nice-to-have that ships after v1.0. Cheap, version-controlled, single-file editor support changes the cadence of language design itself.

## ShareX: Screenshot, Annotate, Share

[ShareX](https://getsharex.com/) is a Windows screenshot-and-screen-capture tool with the entire post-capture pipeline built in: region select, scrolling capture, annotation, color picker, OCR, GIF/video record, and a configurable upload step (S3, imgur, custom HTTP, save-to-disk-with-filename-template). Open source, no account required, and the configuration is local.

Why it matters for a blog/video workflow:

- **Region capture with annotation in one keystroke** --- highlight, arrow, blur (for sensitive screen content), text overlay. The result is ready to paste into a post or video frame without bouncing through a separate image editor.
- **Filename templates** --- captures land as `2026-05-03_kate-syntax-highlighting_01.png` automatically, in the right directory, ready to be moved into `sw-lab/assets/images/posts/` with no rename step.
- **GIF and short MP4 capture** --- for the cases where a screenshot can't show the interaction (dropdowns, hover states, animations). The same hotkey, the same output directory, the same naming convention.
- **OCR built in** --- when a screenshot of code or a terminal needs to become text for inclusion in a post, no need to retype.

ShareX's value is the same as Espanso's, in a different domain: it collapses what used to be a five-tool pipeline (capture → crop → annotate → rename → upload) into a single hotkey with sensible defaults. The blog post images for the COR24 demos and the Sharpen the Saw series go through this pipeline.

### On Mac: `gh gist create` for sharing language snippets

ShareX itself is Windows-only. The Mac-side search for an equivalent went through the usual suspects (Shottr, CleanShot, Skitch, the built-in `Cmd-Shift-5`) and ended somewhere unexpected: **`gh gist create`**, the GitHub CLI's gist subcommand, doing the *share* half of the workflow even though it has nothing to do with screenshots.

The realization was that for **language-design collaboration**---which is what most of the day's "I want to share this with my collaborator" moments actually are---the artifact is almost always *text*: a PAL snippet that exposes a parser ambiguity, a Tuplet expression that doesn't lower the way I expected, a YAML excerpt from one of the Espanso configs, an error message I want a second opinion on. None of those need a screenshot. They need a URL my collaborator can open, comment on, and clone.

`gh gist create` is exactly that:

```
gh gist create --public --desc "PAL syntax sketch" pal-snippet.txt
gh gist create --secret config.yml          # private gist
echo "$(pbpaste)" | gh gist create --filename note.md -
```

The result is a gist URL on `stdout`, ready to paste into a chat or an email. The collaborator opens it, comments inline, or forks it with their own version of the snippet---which is a much higher-bandwidth conversation than a screenshot would be, because the *text is editable on the other side*.

ShareX's "take a screenshot, get back a URL" muscle memory turned out to be the *wrong* shape for this use case. What I actually wanted was "take this code-shaped thing, get back a URL", and `gh gist create` does that natively without going through an image at all. For the rare times an actual screenshot is needed (UI bug, terminal output that won't paste cleanly), `Cmd-Shift-4` plus dropping the image into the relevant blog or language repo and letting `git push` carry it covers it.

<!-- TODO: revisit if a real Mac-native ShareX equivalent (CleanShot X, Shottr) becomes worth the install. The gh-gist landing point is honest about what was actually missed (sharing language artifacts, not capture)---don't dress it up as a perfect substitute. -->

The takeaway: when "share with my collaborator" is the actual goal, the right tool depends on the artifact's shape. For images, ShareX's pattern is correct. For language design, the artifact is text, and the screenshot detour is friction the gist tool removes.

## Pluggable I2C Devices on the COR24 Emulator

[Part 8](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/) introduced I2C support on the [COR24 emulator](https://github.com/sw-embed/sw-cor24-emulator). This week's work is the design that lets it scale: a three-layer architecture where the bus is emulated *once* at the MMIO level, and devices plug in via a trait so adding a new chip is one file plus one registry line. SPI is sketched in parallel as phase 2.

The motivation is the goal that justifies the bus work in the first place: **adding I/O examples to the COR24 languages.** BASIC, Forth, OCaml, Tuplet, and Smalltalk all benefit from the same demo library---read a temperature sensor, persist a value to an EEPROM, read the wall clock, drive a display. If the emulator hard-codes its device list, every new demo means an emulator change. If the device list is pluggable, adding a new simulated peripheral is a separate, scoped piece of work that the language demos consume as data.

### Three layers

```
Layer 1: Guest applications
  C programs + libi2c / libspi running on the COR24
  (i2cspi/tmp101 and i2cspi/tmp125 already exist)
        │  MMIO writes/reads to GPIO-style addresses
        ▼
Layer 2: Bus MMIO emulation (in CPU emulator core)
  Models the FPGA's I2C/SPI line registers exactly. Reconstructs
  logical bus events from line transitions. Routes events to
  whatever device(s) are currently attached.
        │  Bus event API: on_start / on_write_byte / on_read_byte / on_stop
        ▼
Layer 3: Pluggable virtual devices
  Implementations of an I2cSlave / SpiSlave trait for each chip
  to be modeled. New devices = new files.
```

Layers 1 and 3 grow independently---more demos, more chip models. Layer 2 is small, central, and ideally written once.

### Why this is harder than UART

Both I2C and SPI on the COR24-TB FPGA are **bit-banged GPIO**, not register-driven peripherals. The CPU pokes individual line states (SCL=0, SDA=1, ...) and clocks the bus itself. This is materially different from the existing UART, where the CPU writes one byte to `IO_UARTDATA` and the emulator reacts to that byte.

The emulator can't just "respond when the CPU writes a byte." It sees individual line transitions and has to **reconstruct logical bus events** (START, address+RW, byte-in, byte-out, ACK, STOP for I2C; bit-shift on SCLK edge for SPI) from the physical transitions, then route those events to a virtual device. Open-drain wired-AND for I2C means tracking master and slave drivers separately:

```
scl_line = master_scl  & !slave_scl_pull
sda_line = master_sda  & !slave_sda_pull
```

The bus state machine---`Idle → Started → RxByte → AckMasterToSlave → TxByte → AckSlaveToMaster → Stopped`---is driven by `(scl_line, sda_line)` *transitions*, not by writes. This is the price of MMIO-accurate emulation, but the payoff is that the same C source (`libi2c.c`, the bit-bang loop) runs unmodified on the FPGA and the emulator. If a demo ever needs different code on emulator vs. FPGA, the abstraction has leaked and the emulator should be fixed.

### The device trait

The pluggable extension surface is a small Rust trait:

```rust
pub trait I2cDevice: Send {
    fn address(&self) -> u8;
    fn name(&self) -> &str { "i2c-device" }

    fn on_start(&mut self) {}
    fn on_write_byte(&mut self, byte: u8) -> Ack { Ack::Nak }
    fn on_read_byte(&mut self) -> u8 { 0xFF }
    fn on_master_ack(&mut self) {}
    fn on_master_nak(&mut self) {}
    fn on_stop(&mut self) {}

    fn on_tick(&mut self) {}                    // for time-based behaviour
    fn stretching_scl(&self) -> bool { false }  // optional clock stretching
}
```

Adding a new chip is three things: a file at `src/peripherals/i2c/devices/<chip>.rs` implementing the trait, one line in `src/peripherals/i2c/registry.rs` mapping a string key to a constructor, and unit tests. No edits to the bus core, no edits to the CPU, no fork.

Construction is string-keyed so the CLI and config files share one parser:

```
--i2c-device tmp101@0x4A
--i2c-device 'tmp101@0x4A?temp=23.5'
--i2c-device 'ds3231@0x68?epoch=2026-05-03T12:00:00Z'
--i2c-device logger@*          # passive logger on every address
--dump-i2c                     # transaction log on exit
```

### First device set

| Phase | Device     | Why |
|-------|------------|-----|
| 1     | `tmp101`   | Validates the existing `tmp101.lgo` demo end-to-end |
| 1     | `logger`   | Bit-bucket device; records every event for tests + UI |
| 1     | `eeprom`   | Read/write semantics---exercises a different shape |
| 1     | `ds3231`   | RTC; multi-byte register file, common in real projects |
| 2 SPI | `tmp125`   | Validates the existing `tmp125.lgo` SPI demo |
| 2 SPI | `mcp23s17` | Generic SPI GPIO expander, useful in many demos |

The TMP101 is the integration anchor: load the existing `tmp101.lgo` binary (already built by the FPGA-side toolchain), attach a `Tmp101` device at `0x4A`, run for N instructions, and assert the UART output matches the `"%.2f\n"` line for the configured temperature. If that single test passes, the whole stack works---libi2c bit-banging, bus state machine, device model, UART output, printf formatter.

The EEPROM and DS3231 are the gate before the trait is declared "public": two devices with the same shape proves nothing; four devices with three different shapes (sensor / storage / clock / passive logger) proves the trait is general.

### SPI as phase 2

The SPI design is the same shape, simpler. No addressing, no START/STOP, no open-drain---just a shift register clocked by SCLK while SELN is low:

```rust
pub trait SpiDevice: Send {
    fn name(&self) -> &str { "spi-device" }
    fn on_select(&mut self) {}
    fn on_byte(&mut self, mosi: u8) -> u8;  // simultaneous shift
    fn on_deselect(&mut self) {}
    fn on_tick(&mut self) {}
}
```

Mode 0 only (CPOL=0, CPHA=0)---which is what `spixchg.s` already implements. Once the I2C plumbing is in place, the SPI side is mostly mechanical: replace the bus state machine with the simpler shift register, re-use the device-attachment plumbing nearly verbatim.

### Why this is Sharpen the Saw

Doing the bus work once at Layer 2 means *every COR24 language gets the same I/O library out of it*. The BASIC tutorial, the Forth tutorial, the OCaml tutorial, and the Tuplet tutorial all share an example set instead of each one inventing its own. The pluggable device trait means the demo library can grow without the emulator growing---same compartmentalization pattern that drove the [sw-MLPL split](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/#sw-mlpl-35-gb-forces-a-split-into-parallelizable-pieces), applied to peripherals.

## Possible Next Steps

Not commitments---just directions any of these threads could grow if the slot opens up:

**Espanso** --- Bundle the per-language glyph configs (APL, Tuplet, PAL) into something installable in one step on a fresh machine, instead of three separate `cp`s. Possibly a shared dotfiles repo, possibly a per-language file that ships with each language's repo.

**Kate** --- Get the PAL syntax highlighter past the "renders something" stage and confirm it survives a Kate update. A Tuplet highlighter is the obvious second one if the PAL one shakes out cleanly.

**ShareX / gh-gist** --- Possibly revisit a Mac-native ShareX equivalent (CleanShot X, Shottr) if the gist-as-share workflow runs out of road. For now it's good enough that there's no urgency.

**COR24 I2C Pluggable Devices** --- The plan walks an order: stub MMIO at `0xFF0020/0xFF0021`, master-line state, bus state machine, device trait, the `tmp101.lgo` end-to-end test as the gate, then `--i2c-device` CLI, a registry, a second device shape (EEPROM or DS3231) to prove the trait is general, and `docs/extending-i2c.md` before declaring the API public. SPI follows in the same shape with a simpler bus. How much of that lands and in what order is a function of how much time the I2C work earns relative to everything else competing for it.

---

*Glyph input, syntax highlighting, snippet sharing---three tools and one job: making a new language cheap to collaborate on. Plus a peripheral bus that does the same favor for the COR24 language stack. Follow for more Sharpen the Saw updates.*
