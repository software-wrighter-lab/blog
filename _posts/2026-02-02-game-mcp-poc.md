---
layout: post
title: "MCP: Teaching Claude to Play (and Trash Talk)"
date: 2026-02-02 15:00:00 -0800
categories: [ai, rust, mcp]
tags: [mcp, model-context-protocol, rust, claude, game-dev, wasm, yew]
keywords: "tic-tac-toe, trash talk, JSON-RPC, game server"
author: Software Wrighter
abstract: "Teaching Claude to play tic-tac-toe and trash talk using Model Context Protocol (MCP). A Rust server exposes 6 tools via JSON-RPC over stdio, proving MCP standardizes AI tool integration across any compatible language model."
video_url: "https://www.youtube.com/shorts/n_NFFLCtj_M"
video_title: "Trash Talkin' Tic Tac Toe"
repo_url: "https://github.com/sw-game-dev/game-mcp-poc"
series: "General Technology"
series_part: 1
---

<img src="{{ '/assets/images/posts/game-mcp-poc/tic-tac-toe.webp' | relative_url }}" class="post-marker" alt="">

Claude learned to play tic-tac-toe. And trash talk. Using one protocol that works with any language model.

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Code** | [game-mcp-poc](https://github.com/sw-game-dev/game-mcp-poc) |
| **MCP Spec** | [modelcontextprotocol.io](https://modelcontextprotocol.io/) |
| **Video** | [Claude Plays Tic-Tac-Toe](https://www.youtube.com/shorts/n_NFFLCtj_M)<br>[![Video](https://img.youtube.com/vi/n_NFFLCtj_M/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/shorts/n_NFFLCtj_M) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |


</div>

## The Problem

Language models are stuck in text. They can't click buttons, make moves, or interact with real systems. Every integration is custom---different for Claude, GPT, Gemini.

## The Solution: MCP

**Model Context Protocol** is a standard way for models to use tools. Define your tools once, they work with Claude, GPT, or any MCP-compatible agent.

The protocol is simple:
- **JSON-RPC 2.0** over stdio
- No HTTP needed
- Clean request/response cycle

## The Demo: Trash Talkin' Tic Tac Toe

This proof-of-concept implements 6 MCP tools:

| Tool | Purpose |
|------|---------|
| `view_game_state` | See the board, players, status |
| `get_turn` | Whose turn is it? |
| `make_move` | Play a square (row, col) |
| `taunt_player` | Send trash talk to opponent |
| `restart_game` | Start a new game |
| `get_game_history` | All moves with timestamps |

The AI calls tools, the server responds. Claude can play a full game AND talk trash---all through the same protocol.

## Architecture

```
┌─────────────────────────────────────────────┐
│            Claude Code (AI)                 │
│              (MCP Client)                   │
└──────────────────┬──────────────────────────┘
                   │ JSON-RPC 2.0 via stdio
                   ▼
┌─────────────────────────────────────────────┐
│         MCP Server (Rust Binary)            │
│  ┌───────────────────────────────────────┐  │
│  │  6 Tools: view, turn, move, taunt,   │  │
│  │           restart, history            │  │
│  └───────────────────────────────────────┘  │
│                   ▼                         │
│  ┌───────────────────────────────────────┐  │
│  │      SQLite (game.db)                 │  │
│  │  • Games • Moves • Taunts             │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
         ▲                           ▲
         │ REST API                  │ MCP
         │                           │
    Browser (UI)              AI Agent
    (Yew/WASM)              (Claude Code)
```

## Running It

```bash
git clone https://github.com/sw-game-dev/game-mcp-poc
cd game-mcp-poc

# Development mode (with hot-reload)
./scripts/dev.sh

# Or production build
./scripts/build.sh
./scripts/serve.sh
```

The server runs on `http://localhost:7397` serving:
- REST API for UI interactions
- MCP endpoint for AI agents
- SSE for real-time updates
- Yew/WASM frontend

## Configuring Claude Code

Add to `~/.config/claude-code/mcp.json`:

```json
{
  "mcpServers": {
    "tic-tac-toe": {
      "command": "/path/to/game-mcp-poc/target/release/game-mcp-server",
      "args": [],
      "env": {
        "GAME_DB_PATH": "/path/to/game.db"
      }
    }
  }
}
```

Restart Claude Code, then:

```
You: "Let's play tic-tac-toe! Show me the board."
You: "I'll take the center."
You: "Your turn!"
You: "Can you taunt me?"
```

## Implementation Details

| Metric | Value |
|--------|-------|
| **Language** | Rust 2024 Edition |
| **Frontend** | Yew + WebAssembly |
| **Database** | SQLite |
| **Tests** | 175+ passing |
| **LOC** | ~2,500 (backend) + ~1,500 (tests) |
| **Binary Size** | ~8 MB |

**Good for you if:** You want to learn MCP, build AI-tool integrations, or see a production-quality Rust game server.

**Complexity:** Moderate. Clean architecture with TDD. Requires Rust toolchain and understanding of JSON-RPC.

## Key Takeaways

1. **MCP standardizes AI tools.** Define once, works with any compatible model.

2. **JSON-RPC over stdio is elegant.** No HTTP complexity for local tools.

3. **Rust + WASM = fast everywhere.** Same language for server and (via Yew) frontend.

4. **Trash talk is essential.** Games without taunting are just... exercises.

## Resources

- [game-mcp-poc Repository](https://github.com/sw-game-dev/game-mcp-poc)
- [MCP Specification](https://modelcontextprotocol.io/)
- [JSON-RPC 2.0 Spec](https://www.jsonrpc.org/specification)
- [Video: Claude Plays Tic-Tac-Toe](https://www.youtube.com/shorts/n_NFFLCtj_M)

---

*MCP turns language models into tool users. This demo proves it works---and that AI can talk trash.*
