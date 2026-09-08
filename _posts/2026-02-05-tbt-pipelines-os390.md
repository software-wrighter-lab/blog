---
layout: post
title: "TBT #2: Pipelines on OS/390"
date: 2026-02-05 12:00:00 -0800
categories: [tbt, programming-history]
tags: [pipelines, throwback-thursday, retrocomputing, ibm, mainframe, rust, os390, mvs, cms, vibe-coding]
keywords: "CMS Pipelines, TSO Pipelines, OS/390, MVS, mainframe, IBM S/390, record-at-a-time, dataflow, Rust, 1996 Olympics, vibe coding"
author: Software Wrighter
abstract: "Unix invented pipes. Mainframes reinvented them for records, not bytes. This Throwback Thursday recreates CMS/TSO Pipelines in Rust with a visual debugger, demonstrating record-oriented dataflow from the 1996 Olympics web server era."
series: "Throwback Thursday"
series_part: 2
video_url: "https://youtu.be/872RLMBzC_8"
video_title: "90s Pipelines Rust/WASM homage #TBT"
repo_url: "https://github.com/sw-comp-history/pipelines-rs"
---

<img src="{{ '/assets/images/posts/pipes-bw.webp' | relative_url }}" class="post-marker" alt="">

Unix invented pipes. Mainframes reinvented them---for records, not bytes.

This is the second **Throwback Thursday** post---revisiting technologies that shaped how I think about programming. This time: CMS/TSO Pipelines, and a vibe coding project that brings them back to life in Rust for education, fun, and nostalgic reasons.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [pipelines-rs](https://github.com/sw-comp-history/pipelines-rs) |
| **Demo** | [Live Demo](https://sw-comp-history.github.io/pipelines-rs/) |
| **Video** | [Pipelines on OS/390 #TBT](https://youtu.be/872RLMBzC_8) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The 1996 Olympics and a Pair of Mainframes

In 1996, IBM hosted the Olympics Web Server---one of the largest public web properties at the time. Many distributed IBM systems in different regions served dynamic web pages. The logs from all of them were funneled to a pair of **IBM S/390 mainframes** I was in charge of, running **OS/390** (formerly MVS).

When you're processing millions of log records for statistics and forensics, you need tools that think in records, not lines. That's where **Pipelines for TSO/E** came in.

Pipelines for TSO/E was the MVS/ESA port of **CMS Pipelines**, which ran on VM/ESA. Both let you chain stages together to filter, transform, and aggregate record-oriented data---record-oriented pipelines that evolved in parallel with Unix's byte-stream pipes.

## Two Traditions of Piping

Unix pipes came first---Thompson and McIlroy at Bell Labs, 1969--1974. Byte streams, file descriptors, the `|` operator. Brutally simple. Explosively powerful. POSIX.1-1988 standardized `pipe(2)` and shell pipelines, though POSIX work began in the mid-1980s.

CMS Pipelines emerged on IBM mainframes in the mid-to-late 1980s. They weren't a Unix clone---they were convergent evolution under different pressures. Where Unix piped bytes between small programs, CMS piped **records** through declarative stages. Pipelines for TSO/E followed in the late 1980s and early 1990s, porting CMS concepts to the MVS multi-user environment. Unlike CMS Pipelines (which ships with z/VM), the TSO/E port is typically installed separately on z/OS.

Neither tradition was "behind." They were optimizing different dimensions:

| | Unix Pipes | CMS/TSO Pipelines |
|---------|-----------|-------------------|
| **Era** | 1969--1974 | Mid-to-late 1980s |
| **Data unit** | Byte stream | Records (fixed or variable length) |
| **Stage input** | stdin (bytes) | Record buffer |
| **Field access** | `awk`, `cut` (text parsing) | Column positions (direct) |
| **Execution** | Typically a process per stage | Stages in one address space |
| **Topology** | Linear by default; fan-out/fan-in via `tee`, FIFOs, or process substitution | Multi-stream, fan-out/fan-in built in |
| **Philosophy** | Small tools, ad hoc composition | Declarative data transformation |

Many datasets on mainframes are record-structured. Records can be fixed-length or variable-length. CMS and TSO/E Pipelines treat records as byte arrays---character-oriented stages assume EBCDIC text, while position/length stages are binary-safe. A fixed-length 80-byte record isn't arbitrary text---columns 1-8 are the name, 9-18 are the department, 19-26 are the salary. You don't parse. You just read the right columns.

Unix won culturally---cheap hardware, academic distribution, C portability. But IBM's record-oriented pipelines were better at structured dataflow, and they anticipate or parallel patterns seen in ETL frameworks like Spark and Beam.

CMS Pipelines ships with z/VM and is still used; Pipelines for TSO/E exists for z/OS but isn't universally installed. These are not historical curiosities---mainframes continue to process a significant share of high-value transactions, and pipelines remain an available tool for data transformation on those systems.

## What a Pipeline Looks Like

CMS Pipelines uses a DSL with `PIPE` as the command, `|` to chain stages, and `?` as a command terminator (it suppresses the console from being used as implicit input):

```
PIPE CONSOLE
| FILTER 18,10 = "SALES"
| SELECT 0,8,0; 8,10,8
| CONSOLE
?
```

This reads input records, keeps only those where columns 18--27 equal "SALES", extracts the name fields, and writes the result. No regex. No string splitting. Just column positions.

*Note: pipelines-rs uses 0-based offsets (e.g., `SELECT 0,8,0`). Historical CMS Pipelines uses 1-based column positions.*

Compare with the Unix equivalent:

```bash
cat input.txt | awk '$3 == "SALES" {print $1, $2}'
```

The Unix version looks simpler---until your fields contain spaces, or your records contain non-text bytes, or you need to chain 15 stages without spawning 15 processes.

## Bringing It Back in Rust (Vibe Coding)

**pipelines-rs** is a nostalgia-driven vibe coding project---my attempt to emulate Pipelines for TSO/E in Rust, not because it's practical, but because these ideas deserve to be celebrated. It supports a subset of stages and features two execution models:

### The Two Executors

**Batched** processes all records through one stage before moving to the next:

```
All records → Stage 1 → All records → Stage 2 → All records → Stage 3
```

This emulates the correct output and is faster, but doesn't demonstrate record-oriented dataflow well.

**Record-At-a-Time (RAT)** sends each record through the entire pipeline before reading the next:

```
Record 1 → Stage 1 → Stage 2 → Stage 3 → Output
Record 2 → Stage 1 → Stage 2 → Stage 3 → Output
Record 3 → Stage 1 → Stage 2 → Stage 3 → Output
```

RAT is the implementation shown in the video. It's a naive approach---more buffers, more copying---but it shows the dataflow concepts clearly and enables the visual debugger. Both run in linear time (records × stages) and produce identical output for all 23 test specifications.

A future version will aim for fewer buffers and fewer copy operations. Whether it's faster than Batched remains to be seen.

### The 80-Byte Record

The Rust implementation supports fixed-length records only. The fundamental data type is the `Record`---exactly 80 bytes, matching historical punch card width. Variable-length input lines are accepted and padded to 80 bytes:

```rust
pub const RECORD_WIDTH: usize = 80;

pub struct Record {
    data: [u8; RECORD_WIDTH],
}
```

Fields are accessed by column position and length. No parsing, no delimiters. The data is always right where you expect it.

### Supported Stages

The current implementation supports 14 stages:

| Stage | Purpose | Example |
|-------|---------|---------|
| **FILTER** | Keep/reject records by field value | `FILTER 18,10 = "SALES"` |
| **LOCATE** | Keep records containing a pattern | `LOCATE "ERROR"` |
| **NLOCATE** | Keep records NOT containing a pattern | `NLOCATE "DEBUG"` |
| **SELECT** | Extract and reposition fields | `SELECT 0,8,0; 8,10,8` |
| **CHANGE** | Text replacement | `CHANGE "SALES" "MKTG"` |
| **COUNT** | Count records | `COUNT` |
| **TAKE** | Keep first N records | `TAKE 5` |
| **SKIP** | Skip first N records | `SKIP 2` |
| **DUPLICATE** | Repeat each record N times | `DUPLICATE 3` |
| **LITERAL** | Append a literal record | `LITERAL "--- END ---"` |
| **UPPER/LOWER** | Case conversion | `UPPER` |
| **REVERSE** | Reverse record text | `REVERSE` |
| **HOLE** | Discard all input | `HOLE` |
| **CONSOLE** | Driver stage: source or sink depending on position | `CONSOLE` |

## The CLI

Both executors have identical CLIs:

```bash
# Batch executor
pipe-run specs/filter-sales.pipe specs/input-fixed-80.data -v

# Record-at-a-time executor
pipe-run-rat specs/filter-sales.pipe specs/input-fixed-80.data -v
```

Given this input data:

```
SMITH   JOHN      SALES     00050000
JONES   MARY      ENGINEER  00075000
DOE     JANE      SALES     00060000
WILSON  ROBERT    MARKETING 00055000
CHEN    LISA      ENGINEER  00080000
GARCIA  CARLOS    SALES     00045000
TAYLOR  SUSAN     MARKETING 00065000
BROWN   MICHAEL   ENGINEER  00090000
```

And this pipeline:

```
PIPE CONSOLE
| FILTER 18,10 = "SALES"
| CONSOLE
?
```

The output is:

```
SMITH   JOHN      SALES     00050000
DOE     JANE      SALES     00060000
GARCIA  CARLOS    SALES     00045000
Records:  8 in -> 3 out
```

Exactly what I'd have gotten on OS/390 in 1996, but with Web Server log data showing client IP address, OS, browser type/version, user cookies, timestamps, URLs, and more, instead of accounting data. 😊

## The Web UI for Two pipelines-rs Implementations

The web interface runs entirely in the browser via WebAssembly. It has three panels: input records with an 80-column ruler, the pipeline editor, and the output.

### Tutorial Mode

The tutorial walks through each stage with examples, running pipelines automatically to show results. You can step through manually or let it auto-advance.

### The Visual Debugger

The debugger is the reason RAT exists. It lets you:

- **Step** through execution one pipe point at a time
- **Watch** data at specific pipe points between stages
- **Set breakpoints** to pause at specific stages
- **See stage state** for stateful stages like COUNT

You load a pipeline, click Run, then Step to watch each record flow through each stage. The debugger highlights which stages have been reached with a green border. For COUNT and other aggregation stages, you can watch the flush phase where accumulated state becomes output.

## What's Next

The current RAT executor is intentionally naive---it uses a buffer at every pipe point and copies each record between them. A better implementation would minimize buffers and copy operations while preserving the record-at-a-time semantics.

Multi-pipe features are also planned---CMS Pipelines supported fan-out (one input, multiple output streams) and fan-in (multiple inputs merged), which enabled complex processing topologies beyond simple linear chains.

## How pipelines-rs Differs from IBM Pipelines

| | IBM CMS/TSO/E Pipelines | pipelines-rs |
|--|------------------------|--------------|
| **Indexing** | 1-based column positions | 0-based offsets |
| **Record format** | Fixed or variable length, EBCDIC | Fixed 80-byte ASCII only (variable-length input padded) |
| **Stages** | Hundreds of built-in stages | 14 implemented so far |
| **Topology** | Multi-stream: fan-out, fan-in, multi-pipe | Linear only (multi-pipe planned) |
| **Environment** | z/VM, z/OS mainframes | CLI (native) and browser (WASM) |
| **Character set** | EBCDIC | ASCII/UTF-8 |

This is a teaching tool and nostalgia project, not a production replacement.

## Implementation Details

| Metric | Value |
|--------|-------|
| **Language** | Rust (2024 edition) |
| **Web UI** | Yew framework, compiled to WASM |
| **Stages** | 14 implemented |
| **Test Specs** | 23 pipeline specifications |
| **Tests** | 60+ (including batch/RAT equivalence) |
| **License** | MIT |
| **Live Demo** | [sw-comp-history.github.io/pipelines-rs](https://sw-comp-history.github.io/pipelines-rs/) |

## Resources

- [pipelines-rs Repository](https://github.com/sw-comp-history/pipelines-rs)
- [Live Demo](https://sw-comp-history.github.io/pipelines-rs/)
- [CMS Pipelines Reference (IBM)](https://www.ibm.com/docs/en/zvm/7.3?topic=reference-cms-pipelines)

## Credits

| Role | Who |
|------|-----|
| **Concept & direction** | Mike Wright |
| **Content creation** | Claude (Anthropic) |
| **Editorial review** | ChatGPT (OpenAI) |

---


*Mainframe ideas, modern tools. Follow for more.*
