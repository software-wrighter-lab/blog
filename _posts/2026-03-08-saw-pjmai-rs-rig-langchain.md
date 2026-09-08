---
layout: post
title: "Saw #1: pjmai-rs, Rig, and langchain-rust"
date: 2026-03-08 10:00:00 -0800
categories: [rust, tools, ai]
tags: [rust, pjmai, rig, langchain, ai-agents, llm, sharpen-the-saw, cli, developer-tools]
keywords: "sharpen the saw, pjmai-rs, rig framework, langchain-rust, rust ai, llm agents, project management, rust 2024 edition, type-safe agents, vector store, RAG"
author: Software Wrighter
abstract: "Sharpening the foundation: pjmai-rs gets critical Rust 2024 edition fixes and new features, plus a first look at Rig and langchain-rust---two Rust frameworks for building type-safe LLM agents and chain-based AI workflows."
series: "Sharpen the Saw Sundays"
series_part: 1
repo_url: "https://github.com/sw-cli-tools/pjmai-rs"
video_url: "https://youtu.be/CqdBxXXOeUs"
video_title: "Sharpen the Saw: Rust AI Tools"
---

<img src="{{ '/assets/images/posts/block-sharp-tools.webp' | relative_url }}" class="post-marker no-invert" alt="">

Three tools, one theme: sharpening the foundation. This week covers pjmai-rs bug fixes and new features, plus a first look at two Rust frameworks for building LLM-powered applications---Rig and langchain-rust.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repos** | [sw-cli-tools/pjmai-rs](https://github.com/sw-cli-tools/pjmai-rs), [try-rig](https://github.com/softwarewrighter/try-rig), [try-langchain-rust](https://github.com/softwarewrighter/try-langchain-rust) |
| **Video** | [Explainer](https://youtu.be/CqdBxXXOeUs) |
| **References** | [Links and Resources](#references) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## pjmai-rs: Fixing the Foundation

Before adding AI features to any tool, you need a solid foundation. Since the last update, pjmai-rs received critical fixes and practical new features.

### The Rust 2024 Edition Bug

Upgrading to Rust edition 2024 broke project removal silently. The `IndexMap::remove()` method changed semantics---it now preserves insertion order differently. The fix:

```rust
// Rust 2024 broke this
- projects.remove(name)

// shift_remove maintains expected behavior
+ projects.shift_remove(name)
```

A one-line fix, but the kind that silently corrupts data if you miss it. The 2024 edition migration guide mentions this change, but it's easy to overlook in a large codebase.

### Shell Integration Improvements

- **Help flags**: All aliases (`chpj`, `hypj`, `stpj`, etc.) now properly pass `--help` through
- **After-help messages**: Every subcommand shows examples and related commands
- **Version matching**: `--version` output now matches `Cargo.toml`
- **Argument validation**: Better error messages for invalid flag combinations

### New Capabilities

| Feature | Command | What It Does |
|---------|---------|--------------|
| Stack navigation | `stpj` | Push/pop project context with visibility |
| History tracking | `hypj` | Revisit recently-visited projects by number |
| Fuzzy completion | `chpj <TAB>` | Prefix > segment > substring, sorted by recency |
| Environment config | `evpj` | Per-project env vars with auto-detection (Python, Node, Rust) |
| Bulk operations | `rmpj --all` | Batch management with confirmation |
| Subdirectory nav | `chpj proj src/` | Tab-complete into subdirs |

These features are covered in detail in the [Personal Software post](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/).

<div class="resource-box" markdown="1">

**Sharpen the Saw** --- Habit 7 from Stephen Covey's [*The 7 Habits of Highly Effective People*](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) is about preserving and enhancing your greatest asset: yourself and your tools. In software, that means taking time to fix accumulated friction, update dependencies, and learn new frameworks---even when shipping features feels more urgent. The payoff compounds: every hour spent sharpening saves many more down the line.

</div>

## Rig: Type-Safe AI Agents in Rust

[Rig](https://rig.rs/) (`rig-core` 0.32) is a Rust library for building LLM applications with a unified API across providers. I built [try-rig](https://github.com/softwarewrighter/try-rig) to explore it hands-on with Ollama running locally---no cloud API keys needed.

### A Simple Agent

The builder pattern makes agent construction readable:

```rust
use rig::providers::ollama;
use rig::client::Nothing;
use rig::completion::Prompt;

let client = ollama::Client::new(Nothing)?;

let agent = client
    .agent("llama3.2")
    .preamble("You are a helpful assistant. Be concise.")
    .build();

let response = agent.prompt("What is Rust?").await?;
```

Swap `ollama::Client` for `openai::Client` or `anthropic::Client` and the rest stays the same.

### Tool-Equipped Agents

Where Rig gets interesting is tools. Define a tool by implementing the `Tool` trait with typed args:

```rust
#[derive(Deserialize, Serialize)]
pub struct Calculator;

impl Tool for Calculator {
    const NAME: &'static str = "calculator";
    type Error = CalcError;
    type Args = CalcArgs;
    type Output = f64;

    async fn definition(&self, _prompt: String) -> ToolDefinition {
        ToolDefinition {
            name: "calculator".to_string(),
            description: "Perform arithmetic: add, subtract, multiply, divide".to_string(),
            parameters: json!({ /* JSON Schema */ }),
        }
    }

    async fn call(&self, args: Self::Args) -> Result<Self::Output, Self::Error> {
        match args.operation.as_str() {
            "add" => Ok(args.x + args.y),
            "multiply" => Ok(args.x * args.y),
            // ...
        }
    }
}
```

Then chain tools onto the agent builder:

```rust
let agent = client
    .agent(model)
    .preamble("Use tools for math, weather, files, date/time, and text.")
    .tool(Calculator)
    .tool(WeatherLookup)
    .tool(FileSearch)
    .tool(DateTime)
    .tool(StringTool)
    .build();
```

The compiler verifies all tool types at build time. No runtime surprises from mismatched schemas.

### RAG with Embeddings

Rig has built-in vector store support. The RAG agent in try-rig uses `nomic-embed-text` via Ollama for fully local embeddings:

```rust
let embedding_model = client.embedding_model_with_ndims("nomic-embed-text", 768);

let embeddings = EmbeddingsBuilder::new(embedding_model.clone())
    .documents(knowledge_entries)?
    .build()
    .await?;

let vector_store = InMemoryVectorStore::from_documents(embeddings);
let index = vector_store.index(embedding_model);

let rag_agent = client
    .agent(model)
    .preamble("Use the provided context to answer accurately.")
    .dynamic_context(2, index)  // inject top 2 results
    .build();
```

### Multi-Agent Orchestration

Rig agents can be used as tools for other agents. The try-rig demo builds a math specialist and a weather specialist, then hands both to an orchestrator:

```rust
let calc_agent = client.agent(model)
    .preamble("You are a math specialist.")
    .name("math_agent")
    .description("Arithmetic: add, subtract, multiply, divide.")
    .tool(Calculator)
    .build();

let weather_agent = client.agent(model)
    .preamble("You are a weather specialist.")
    .name("weather_agent")
    .tool(WeatherLookup)
    .build();

let orchestrator = client.agent(model)
    .preamble("Route questions to math_agent or weather_agent.")
    .tool(calc_agent)
    .tool(weather_agent)
    .build();
```

The orchestrator decides which specialist to call based on the question. Agents as tools---composable all the way down.

### Typed Extraction

Rig can also extract structured data from unstructured text using `schemars`:

```rust
#[derive(Debug, Deserialize, Serialize, JsonSchema)]
pub struct ContactInfo {
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
}

let extractor = client
    .extractor::<ContactInfo>(model)
    .preamble("Extract contact information from text.")
    .build();

let contact = extractor.extract("Call Jane at 555-1234 or jane@example.com").await?;
```

The output is a proper Rust struct, not a string you have to parse.

### The try-rig CLI

All of these patterns are runnable from [try-rig](https://github.com/softwarewrighter/try-rig):

```bash
try-rig ask "What is Rust?"           # Simple agent
try-rig tools "What is 42 * 17?"      # Tool calling
try-rig rag "Explain Rust ownership"   # RAG with embeddings
try-rig multi "Weather in Tokyo?"      # Multi-agent routing
try-rig extract "Call Jane at 555-1234"# Typed extraction
try-rig stream "Explain TCP/IP"        # Streaming response
```

Five times less memory than equivalent Python, zero Python dependencies, and the compiler catches your mistakes before runtime.

## langchain-rust: Chain Abstractions for Rust

[langchain-rust](https://crates.io/crates/langchain-rust) (v4.6.0) brings LangChain's composable chain architecture to Rust. Where Rig focuses on type-safe agents, langchain-rust focuses on chain orchestration. The [try-langchain-rust](https://github.com/softwarewrighter/try-langchain-rust) repo has 13 runnable examples across the full feature set.

### LLM Chains and Prompt Templates

The chain builder composes prompts and LLMs into reusable pipelines:

```rust
use langchain_rust::{
    chain::{Chain, LLMChainBuilder},
    fmt_message, fmt_template, message_formatter,
    prompt::HumanMessagePromptTemplate,
    prompt_args, schemas::messages::Message, template_fstring,
};

let prompt = message_formatter![
    fmt_message!(Message::new_system_message("You are a concise technical writer.")),
    fmt_template!(HumanMessagePromptTemplate::new(template_fstring!(
        "Explain {topic} in 2-3 sentences.", "topic"
    )))
];

let chain = LLMChainBuilder::new()
    .prompt(prompt)
    .llm(llm)
    .build()?;

let result = chain.invoke(prompt_args! { "topic" => "ownership in Rust" }).await?;
```

Ollama works the same way---swap the LLM and everything else stays identical:

```rust
let ollama = Ollama::default().with_model("llama3.2");
// use ollama in place of llm above
```

### Sequential Chains

Pipe one chain's output into the next. This example generates a story concept, then a title, then an opening line:

```rust
let concept_chain = LLMChainBuilder::new()
    .prompt(/* "Create a concept about {{topic}}" */)
    .llm(llm.clone())
    .output_key("concept")
    .build()?;

let title_chain = LLMChainBuilder::new()
    .prompt(/* "Suggest a title for {{concept}}" */)
    .llm(llm.clone())
    .output_key("title")
    .build()?;

let chain = sequential_chain!(concept_chain, title_chain, opening_chain);

let output = chain.execute(prompt_args! { "topic" => "a robot that learns to paint" }).await?;
println!("Title: {}", output["title"]);
```

### Conversational Memory

Multi-turn dialogue with automatic context retention:

```rust
let chain = ConversationalChainBuilder::new()
    .llm(llm)
    .memory(SimpleMemory::new().into())
    .build()?;

chain.invoke(prompt_args! { "input" => "My name is Alice and I'm learning Rust." }).await?;
// Turn 2: chain remembers Alice and Rust
chain.invoke(prompt_args! { "input" => "What's my name?" }).await?;
```

### RAG with Vector Store

The conversational retriever chain combines memory, vector search, and LLM generation. The try-langchain-rust demo uses SQLite for the vector store:

```rust
let store = StoreBuilder::new()
    .embedder(OpenAiEmbedder::default())
    .connection_url("sqlite::memory:")
    .table("documents")
    .vector_dimensions(1536)
    .build().await?;

store.initialize().await?;
add_documents!(store, &documents).await?;

let chain = ConversationalRetrieverChainBuilder::new()
    .llm(llm)
    .rephrase_question(true)
    .memory(SimpleMemory::new().into())
    .retriever(Retriever::new(store, 3))
    .prompt(prompt)
    .build()?;
```

Multi-turn RAG conversations work out of the box---the chain rephrases follow-up questions using conversation history before searching the vector store.

### Agents and Semantic Routing

Agents select tools autonomously. The demo uses a `CommandExecutor` tool:

```rust
let agent = ConversationalAgentBuilder::new()
    .tools(&[Arc::new(CommandExecutor::default())])
    .build(llm)?;

let executor = AgentExecutor::from_agent(agent)
    .with_memory(SimpleMemory::new().into());

executor.invoke(prompt_args! { "input" => "List the files in the current directory" }).await?;
```

Semantic routing dispatches queries by meaning---define example utterances for each route and the router classifies new inputs:

```rust
let coding_route = Router::new("coding", &[
    "How do I write a function in Rust?",
    "Explain generics in programming",
]);
let devops_route = Router::new("devops", &[
    "Set up a CI/CD pipeline",
    "Configure Docker containers",
]);

let router = RouteLayerBuilder::default()
    .embedder(OpenAiEmbedder::default())
    .add_route(coding_route)
    .add_route(devops_route)
    .threshold(0.80)
    .build().await?;

let route = router.call("Explain the borrow checker").await?;
// → "coding"
```

### The try-langchain-rust Examples

All 13 examples are runnable from [try-langchain-rust](https://github.com/softwarewrighter/try-langchain-rust):

```bash
cargo run --example llm_chain         # Prompt templates + LLM chain
cargo run --example conversational    # Multi-turn memory
cargo run --example ollama            # Local LLM (no API key)
cargo run --example streaming         # Token-by-token output
cargo run --example vector_store      # SQLite similarity search
cargo run --example doc_loader        # Text/CSV loading + splitting
cargo run --example qa_chain          # Q&A over documents
cargo run --example rag_chat          # Conversational RAG
cargo run --example agent             # Agent with tools
cargo run --example sequential        # Chained pipelines
cargo run --example semantic_router   # Route by meaning
```

## Rig vs. langchain-rust

| Dimension | Rig | langchain-rust |
|-----------|-----|----------------|
| **Focus** | Agent construction | Chain orchestration |
| **Type safety** | Strong (Tool trait, typed extraction) | Moderate (macro-based prompt building) |
| **RAG** | In-memory vector store, embeddings | SQLite/Postgres/Qdrant + document loaders |
| **Multi-agent** | Agents as tools (composable) | Agent executor with tool selection |
| **Memory** | Manual history management | Built-in SimpleMemory, auto context |
| **Chains** | Single agent pipelines | Sequential chains, conversational retriever |
| **Maturity** | v0.32, active development | v4.6.0, stable API |
| **Local LLM** | Ollama native | Ollama supported |
| **Best for** | Type-safe agents, tool calling | Multi-step pipelines, RAG, document ingestion |

They're complementary more than competing. A project could use Rig for the agent layer and langchain-rust for document ingestion and retrieval.

## What's Next for pjmai-rs

The [Phase 4 roadmap](https://github.com/sw-cli-tools/pjmai-rs) for pjmai-rs includes AI integration:

- **AI context injection**: `ctpj --for-agent` already outputs project metadata as JSON for AI prompts
- **Restricted PATH mode**: Sandboxed environments for autonomous agents
- **AI-assisted discovery**: Let agents find and register projects automatically

The question isn't whether pjmai-rs will use Rig or langchain-rust---it's which patterns from each framework make sense for a CLI tool that helps AI agents navigate codebases.

<div class="references-section" markdown="1">

## References

| Resource | Link |
|----------|------|
| **Rig Framework** | [rig.rs](https://rig.rs/) |
| **Rig Docs** | [docs.rs/rig-core](https://docs.rs/rig-core) |
| **langchain-rust** | [crates.io/crates/langchain-rust](https://crates.io/crates/langchain-rust) |
| **langchain-rust Source** | [github.com/Abraxas-365/langchain-rust](https://github.com/Abraxas-365/langchain-rust) |
| **Rust 2024 Edition Guide** | [doc.rust-lang.org/edition-guide](https://doc.rust-lang.org/edition-guide/) |
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |
| **pjmai-rs Background** | [TBT: PJMAI-RS](/2026/03/05/tbt-pjmai-rs-project-manager/) |
| **pjmai-rs Features** | [Navigation History and Fuzzy Completion](/2026/03/07/pjmai-rs-navigation-history-and-fuzzy-completion/) |

</div>

---

*Habit 7: Sharpen the Saw. Fix the foundation first, then build higher.*
