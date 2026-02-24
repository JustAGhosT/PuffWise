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

# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Run tests
pnpm test

# Type-check and lint
pnpm typecheck
pnpm lint

# Production build
pnpm build
```

### AgentKit Tooling

```bash
cd .agentkit
pnpm install
pnpm test
```

## Project Structure

```text
PuffWise/
├── src/
│   ├── app/             # Next.js pages (dashboard, history, challenges, settings)
│   ├── components/      # UI components (log form, daily summary, streak, etc.)
│   └── lib/             # DB (Dexie/IndexedDB), hooks, crypto, export utils
├── public/              # PWA manifest, icons
├── docs/                # Product documentation (PRD, specs, architecture)
├── .agentkit/           # AgentKit Forge engine + CLI
│   ├── bin/             # Cross-platform CLI scripts
│   ├── engines/node/    # Sync engine, orchestrator, runners
│   └── spec/            # YAML spec files (agents, commands, teams)
├── .github/workflows/   # CI pipelines
└── .claude/             # Orchestrator state + command files
```

## Documentation

- [Product Requirements Document](docs/01_product/01_product_requirements.md)
- [AgentKit Architecture](.agentkit/docs/ARCHITECTURE.md)
- [CLI Installation](.agentkit/docs/CLI_INSTALLATION.md)

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript 5.9 + Tailwind CSS 4
- **Storage:** Dexie.js (IndexedDB) — offline-first, no backend
- **Runtime:** PWA with service worker (offline caching)
- **Testing:** Vitest 4 + Testing Library + fake-indexeddb
- **Tooling:** AgentKit Forge, pnpm, GitHub Actions

## Contributing

1. Fork the repo and create a feature branch
2. Make changes and ensure `pnpm test` passes in `.agentkit/`
3. Open a PR against `main`

## License

See [LICENSE](LICENSE) for details.
