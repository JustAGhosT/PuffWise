# Puffwise

Track. Reduce. Upcycle. Challenge Yourself.

A privacy-first, browser-based nicotine usage tracking platform that empowers users to track, analyze, and reduce all forms of nicotine use—including vapes, cigarettes, and pouches—with unified multi-product logging, challenge-driven harm reduction analytics, milestone celebrations, and streak tracking.

## Features

- **Multi-product tracking** — vapes, cigarettes, pouches in one place
- **Challenge-driven reduction** — goals with streak tracking and milestones
- **Disassembly guides** — stepwise device teardown instructions
- **Upcycling gallery** — creative reuse project ideas
- **Collection tracking** — community impact metrics
- **Offline-first** — full local storage support, no account required
- **Data export** — CSV export for personal records

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 10

## Getting Started

```bash
# Clone the repo
git clone https://github.com/JustAGhosT/PuffWise.git
cd PuffWise

# AgentKit tooling (the app scaffold is not yet created)
cd .agentkit
pnpm install
pnpm test
```

> **Note:** The application source code does not exist yet. The repo currently
> contains AgentKit Forge tooling, documentation, and agent configuration.
> See the [PRD](docs/01_product/01_product_requirements.md) for the planned
> tech stack and feature set.

## Project Structure

```text
PuffWise/
├── .agentkit/           # AgentKit Forge engine + CLI
│   ├── bin/             # Cross-platform CLI scripts
│   ├── engines/node/    # Sync engine, orchestrator, runners
│   └── spec/            # YAML spec files (agents, commands, teams)
├── docs/                # Product documentation (PRD, specs, architecture)
├── .github/workflows/   # CI pipelines
└── .claude/commands/    # Orchestrator command files
```

## Documentation

- [Product Requirements Document](docs/01_product/01_product_requirements.md)
- [AgentKit Architecture](.agentkit/docs/ARCHITECTURE.md)
- [CLI Installation](.agentkit/docs/CLI_INSTALLATION.md)

## Tech Stack (Planned)

- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Runtime:** PWA-ready, offline-first
- **Tooling:** AgentKit Forge, pnpm, Vitest, GitHub Actions

## Contributing

1. Fork the repo and create a feature branch
2. Make changes and ensure `pnpm test` passes in `.agentkit/`
3. Open a PR against `main`

## License

See [LICENSE](LICENSE) for details.
