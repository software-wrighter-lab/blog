---
layout: post
title: "JSON et al: A Deep Dive into Data Serialization Formats"
date: 2026-02-21 14:00:00 -0800
categories: [data-formats, fundamentals]
tags: [json, jsonb, jsonl, protobuf, yaml, toml, serialization]
keywords: "JSON, JSONL, JSONB, NDJSON, Protocol Buffers, Protobuf, ASN.1, YAML, TOML, TOON, MessagePack, CBOR, Avro, Parquet, data serialization, binary formats"
author: Software Wrighter
video_url: "https://www.youtube.com/shorts/3ezjk1CnZEU"
video_title: "JSON or Something Better?"
abstract: "JSON is everywhere, but it's not the only option. This post explores data formats beyond basic JSON—JSONL for streaming, JSONB for fast queries, Protocol Buffers for compact wire formats, YAML/TOML for human editing, and TOON for LLM efficiency. Each has trade-offs: pick two of readability, compactness, or speed."
series: "General Technology"
series_part: 2
---

<img src="{{ '/assets/images/posts/block-brackets.webp' | relative_url }}" class="post-marker no-invert" alt="">

JSON is everywhere. APIs. Logs. Databases. Configuration files. But it's not alone. A whole ecosystem of formats exists---each optimizing for different tradeoffs.

This post expands on the [JSON et al]({{ page.video_url }}) short, providing technical depth on each format: when it was created, where it's specified, and what problems it solves.

---

## The Tradeoff Triangle

Before diving in, understand the fundamental constraint. Data formats balance three competing goals:

| Goal | Description |
|------|-------------|
| **Human Readability** | Can a developer read and edit it directly? |
| **Compactness** | How many bytes does it take to represent data? |
| **Query Performance** | How fast can you access specific fields? |

You usually only get two. JSON optimizes readability. Protobuf optimizes compactness. JSONB optimizes query performance. No format wins everywhere.

---

## JSON: The Ubiquitous Baseline

**Created:** 2001 (discovered/formalized by Douglas Crockford)
**Specification:** [ECMA-404](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/) (2013), [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) (2017)
**File Extension:** `.json`

JSON (JavaScript Object Notation) emerged from JavaScript's object literal syntax but became language-agnostic. Crockford didn't invent it---he "discovered" it already existing in JavaScript and formalized the specification.

### Technical Details

- **Encoding:** UTF-8 text (UTF-16/32 allowed but rare)
- **Data Types:** Objects `{}`, arrays `[]`, strings, numbers, booleans, `null`
- **Schema:** None required
- **Comments:** Not allowed in strict JSON

### Strengths

- Universal parser support (every language has one)
- Human readable without tools
- Web-native (JavaScript parses it natively)
- Simple specification (fits on a business card)

### Weaknesses

- Verbose (field names repeated for every object)
- No binary data type (must base64-encode)
- No comments (frustrating for config files)
- Parsing overhead (tokenization + string decoding every time)

### ELI5

Like typing a long email instead of sending a terse text. Every message spells everything out---clear, but verbose.

### When to Use

REST APIs, configuration (when comments aren't needed), data interchange between systems, anywhere human readability matters more than efficiency.

---

## JSONL / NDJSON: Streaming JSON

**Created:** ~2013 (formalized)
**Specification:** [JSON Lines](https://jsonlines.org/), [NDJSON](http://ndjsonspec.org/)
**File Extension:** `.jsonl`, `.ndjson`

JSONL (JSON Lines) and NDJSON (Newline-Delimited JSON) are the same concept: one valid JSON object per line, separated by newlines.

### Technical Details

```
{"name": "Alice", "score": 95}
{"name": "Bob", "score": 87}
{"name": "Carol", "score": 92}
```

No wrapping array. Each line is independently parseable.

### Strengths

- **Streaming:** Process line-by-line without loading entire file
- **Append-only:** Add records without rewriting the file
- **Parallel processing:** Split by line, distribute to workers
- **Fault-tolerant:** One corrupt line doesn't invalidate the file

### Weaknesses

- Not valid JSON (can't parse with standard JSON parser)
- Still text-based (same verbosity as JSON)
- No random access by index

### ELI5

Like removing one comma per line to save some typing. Each line is self-contained, so you can grab and process them one at a time.

### When to Use

Log files, big data pipelines (Spark, Pandas), ML datasets, event streams, anywhere you need to process records incrementally.

---

## JSONB: Binary JSON for Databases

**Created:** 2014 (PostgreSQL 9.4)
**Specification:** Implementation-specific (no universal standard)
**Storage:** Database column type

JSONB isn't a file format---it's a database storage optimization. PostgreSQL's JSONB differs from MongoDB's BSON, which differs from other implementations.

### PostgreSQL JSONB Details

- **Parsed once:** Text converted to binary on INSERT
- **Keys sorted:** Deterministic ordering for indexing
- **Duplicates removed:** Last value wins
- **Offset table:** O(log n) field lookup instead of O(n) text scanning

### MongoDB BSON

**Specification:** [bsonspec.org](https://bsonspec.org/)

BSON (Binary JSON) is MongoDB's serialization format. Unlike PostgreSQL's JSONB, BSON is a standalone binary format:

- Type-prefixed values
- Supports additional types (Date, Binary, ObjectId)
- Length-prefixed for fast skipping
- ~10-15% smaller than JSON typically

### Strengths

- Fast queries without re-parsing
- Indexable (GIN indexes on JSONB in PostgreSQL)
- Type coercion at storage time

### Weaknesses

- Not portable (implementation-specific)
- Not human-readable
- INSERT overhead (parsing cost upfront)

### ELI5

Instead of cooking from scratch every time, you heat a pre-made meal. The prep work happens once (on INSERT), so serving (queries) is fast.

### When to Use

Database storage where you query into JSON structures. PostgreSQL JSONB + GIN indexes enable fast `@>` containment queries.

---

## Protocol Buffers: Google's Schema-First Format

**Created:** 2001 (internal Google), 2008 (open-sourced)
**Specification:** [developers.google.com/protocol-buffers](https://developers.google.com/protocol-buffers/docs/proto3)
**File Extension:** `.proto` (schema), binary wire format

Protocol Buffers (Protobuf) is Google's language-neutral, schema-required serialization format. It powers gRPC.

### Technical Details

Schema definition:
```protobuf
message Sensor {
  int32 temperature = 1;
  int32 humidity = 2;
}
```

Wire format uses field numbers, not names:
```
Field 1: 72
Field 2: 40
```

### Key Features

- **Varint encoding:** Small integers use fewer bytes
- **Field numbers:** Enable backward compatibility
- **Code generation:** `.proto` → language-specific classes
- **No self-description:** Receiver must know schema

### Strengths

- Extremely compact (3-10x smaller than JSON typically)
- Fast serialization/deserialization
- Strong versioning semantics
- gRPC integration

### Weaknesses

- Requires schema agreement
- Not human-readable
- Tooling required for debugging
- Schema evolution has rules

### ELI5

Everyone agrees upfront what "field 1" means. You don't waste space spelling out "temperature"---you just send the number 1 and the value. Both sides know the code.

### When to Use

Microservices (gRPC), internal APIs, anywhere bandwidth and latency matter more than debuggability.

---

## ASN.1: The Telecom Veteran

**Created:** 1984 (ITU-T X.208)
**Specification:** [ITU-T X.680-X.683](https://www.itu.int/rec/T-REC-X.680-X.683)
**Encoding Rules:** BER, DER, PER, XER, and more

ASN.1 (Abstract Syntax Notation One) predates all modern formats. It defines both schema and encoding, with multiple encoding rules for different use cases.

### Encoding Rules Comparison

| Rule | Use Case |
|------|----------|
| **BER** (Basic Encoding Rules) | Flexible, general purpose |
| **DER** (Distinguished Encoding Rules) | Deterministic, for cryptography |
| **PER** (Packed Encoding Rules) | Most compact, for bandwidth-constrained |
| **XER** (XML Encoding Rules) | XML-based, for interop |

### Where You See ASN.1

- **X.509 certificates** (SSL/TLS certs are DER-encoded ASN.1)
- **LDAP** (directory services)
- **SNMP** (network management)
- **Telecom protocols** (SS7, GSM, LTE)

### Strengths

- Bit-level precision
- Proven over 40 years
- Multiple encoding options
- Formal verification possible

### Weaknesses

- Complex specification
- Steep learning curve
- Tooling can be expensive
- Security vulnerabilities in parsers (historically)

### ELI5

Same idea as Protobuf---everyone agrees upfront what each field number means. ASN.1 just got there 20 years earlier and handles even more edge cases.

### When to Use

You probably won't choose ASN.1 for new projects. You'll encounter it in cryptography, certificates, and legacy telecom systems.

---

## YAML: Human-Friendly Configuration

**Created:** 2001 (Clark Evans, Ingy döt Net, Oren Ben-Kiki)
**Specification:** [yaml.org/spec/1.2.2](https://yaml.org/spec/1.2.2/)
**File Extension:** `.yaml`, `.yml`

YAML (YAML Ain't Markup Language) prioritizes human readability. It's a superset of JSON---any valid JSON is valid YAML.

### Technical Details

```yaml
# Comments allowed!
server:
  host: localhost
  port: 8080
  features:
    - auth
    - logging
```

### Key Features

- **Indentation-based:** Whitespace matters
- **Comments:** `#` for single-line
- **Anchors/aliases:** `&name` and `*name` for references
- **Multiple documents:** `---` separator

### Strengths

- Highly readable
- Comments supported
- Multi-line strings without escaping
- Complex data structures

### Weaknesses

- **"Norway problem":** `NO` parses as boolean `false`
- Whitespace sensitivity causes errors
- Multiple ways to express same data
- Security concerns (arbitrary code execution in some parsers)

### ELI5

Optimized for clarity, not bandwidth. YAML is for humans editing config files---not for machines exchanging data over networks.

### When to Use

Configuration files (Kubernetes, Docker Compose, CI/CD), anywhere humans edit data directly and comments help.

---

## TOML: Minimal Configuration

**Created:** 2013 (Tom Preston-Werner)
**Specification:** [toml.io](https://toml.io/en/v1.0.0)
**File Extension:** `.toml`

TOML (Tom's Obvious Minimal Language) emerged as a reaction to YAML's complexity. It's used by Rust (Cargo.toml), Python (pyproject.toml), and others.

### Technical Details

```toml
[server]
host = "localhost"
port = 8080

[server.features]
auth = true
logging = true
```

### Key Features

- **Explicit typing:** Dates, times, arrays have clear syntax
- **Sections:** `[section]` and `[section.subsection]`
- **No anchors:** Intentionally simpler than YAML
- **Deterministic:** Same data = same representation

### Strengths

- Easy to read and write
- Unambiguous parsing
- Clear error messages
- Growing ecosystem support

### Weaknesses

- Less expressive than YAML
- Nested structures can be verbose
- Smaller ecosystem than JSON/YAML

### ELI5

Same goal as YAML---clarity for humans, not bandwidth for machines---but with stricter rules so you make fewer mistakes.

### When to Use

Configuration files where YAML's complexity isn't needed. Rust projects (mandatory). Python packaging (pyproject.toml).

---

## TOON: Token-Optimized for LLMs

**Created:** October 2025 (toon-format organization)
**Specification:** [github.com/toon-format/toon](https://github.com/toon-format/toon) (v3.0)
**File Extension:** `.toon`
**Media Type:** `text/toon` (provisional)

TOON (Token Oriented Object Notation) is the newest format in this list, designed specifically for LLM input. It's a lossless representation of JSON that minimizes tokens.

### Technical Details

TOON combines YAML-style indentation for nested objects with CSV-like tabular layouts for uniform arrays:

```
users[2]{name,age}:
Alice,25
Bob,30
```

Equivalent JSON:
```json
{"users": [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]}
```

### Key Features

- **Header-based:** Field names declared once, values follow
- **40% fewer tokens:** Than equivalent JSON typically
- **Lossless:** Round-trips to JSON perfectly
- **UTF-8 always:** No encoding ambiguity

### Performance

| Metric | JSON | TOON |
|--------|------|------|
| Accuracy | 69.7% | 73.9% |
| Efficiency (acc/1K tokens) | 15.3 | 26.9 |

### Strengths

- Significant token savings at scale
- Better context window utilization
- Lower API costs for LLM applications
- Human-readable (unlike binary formats)

### Weaknesses

- New format (October 2025)
- Limited tooling compared to JSON
- Requires conversion layer for existing systems
- Not yet widely adopted

### ELI5

Like having one header row for each column in a table instead of repeating the column name for every single row. You declare field names once, then just list the values.

### When to Use

LLM prompts with structured data, RAG applications, anywhere token efficiency matters. Especially useful for large datasets with uniform object arrays.

### Implementations

- **TypeScript:** Reference implementation
- **Python:** [toons](https://pypi.org/project/toons/) (Rust-based, fast)
- **Go, Rust, .NET:** Available via toon-format org

---

## Alternatives Not in the Video

### MessagePack

**Created:** 2008 (Sadayuki Furuhashi)
**Specification:** [msgpack.org](https://msgpack.org/)

Binary JSON without schema. Type-prefixed values, efficient numeric encoding.

**Use when:** You want JSON semantics but smaller/faster.

### CBOR

**Created:** 2013 (IETF)
**Specification:** [RFC 8949](https://datatracker.ietf.org/doc/html/rfc8949)

Concise Binary Object Representation. Designed for constrained environments (IoT).

**Use when:** Resource-constrained devices, need a standard binary format.

### Apache Avro

**Created:** 2009 (Apache, Doug Cutting)
**Specification:** [avro.apache.org](https://avro.apache.org/docs/current/spec.html)

Schema-based, row-oriented binary format. Schema embedded or stored separately. Strong schema evolution support.

**Use when:** Big data pipelines (Hadoop, Kafka), schema evolution is critical.

### Apache Parquet

**Created:** 2013 (Twitter + Cloudera)
**Specification:** [parquet.apache.org](https://parquet.apache.org/docs/file-format/)

Columnar storage format. Not for serialization---for analytics storage.

**Use when:** Large-scale analytics, data warehousing, Spark/Pandas workflows.

### Cap'n Proto

**Created:** 2013 (Kenton Varda, ex-Protobuf author)
**Specification:** [capnproto.org](https://capnproto.org/)

Zero-copy serialization. The serialized form *is* the in-memory form.

**Use when:** Extreme performance requirements, inter-process communication.

### FlatBuffers

**Created:** 2014 (Google)
**Specification:** [google.github.io/flatbuffers](https://google.github.io/flatbuffers/)

Zero-copy like Cap'n Proto but with better tooling. Used in games, mobile.

**Use when:** Games, mobile apps, anywhere memory allocation matters.

---

## Quick Reference

| Format | Year | Schema | Binary | Human-Readable | Best For |
|--------|------|--------|--------|----------------|----------|
| JSON | 2001 | No | No | Yes | APIs, interchange |
| JSONL | 2013 | No | No | Yes | Logs, streaming |
| JSONB | 2014 | No | Yes | No | Database queries |
| Protobuf | 2008 | Yes | Yes | No | Microservices |
| ASN.1 | 1984 | Yes | Yes | No | Crypto, telecom |
| YAML | 2001 | No | No | Yes | Config files |
| TOML | 2013 | No | No | Yes | Simple config |
| TOON | 2025 | No | No | Yes | LLM prompts |
| MessagePack | 2008 | No | Yes | No | Fast JSON |
| CBOR | 2013 | Optional | Yes | No | IoT |
| Avro | 2009 | Yes | Yes | No | Big data |

---

## Key Takeaways

1. **No "best" format exists.** Each optimizes for different constraints.

2. **Text formats favor humans.** JSON, YAML, TOML prioritize readability over efficiency.

3. **Binary formats favor machines.** Protobuf, MessagePack, CBOR prioritize compactness and speed.

4. **Schema formats favor correctness.** Protobuf, Avro, ASN.1 catch errors at compile time.

5. **The tradeoff triangle is real.** Readability, compactness, query performance---pick two.

The question isn't "which format wins?" The question is: what problem are you solving?

---

## Resources

- [ECMA-404 JSON Specification](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
- [RFC 8259 JSON](https://datatracker.ietf.org/doc/html/rfc8259)
- [JSON Lines Specification](https://jsonlines.org/)
- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [Protocol Buffers Documentation](https://developers.google.com/protocol-buffers)
- [YAML 1.2.2 Specification](https://yaml.org/spec/1.2.2/)
- [TOML v1.0.0 Specification](https://toml.io/en/v1.0.0)
- [RFC 8949 CBOR](https://datatracker.ietf.org/doc/html/rfc8949)
- [MessagePack Specification](https://github.com/msgpack/msgpack/blob/master/spec.md)
- [Apache Avro Specification](https://avro.apache.org/docs/current/spec.html)

---

*Data formats are design decisions. Choose based on your constraints, not trends.*
