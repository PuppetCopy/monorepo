# CLAUDE.md - AI Assistant Guide to Puppet Monorepo

> **Purpose**: Guide for AI assistants working with the Puppet copy trading platform codebase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Technology Stack](#technology-stack)
4. [Development Environment](#development-environment)
5. [Code Organization & Conventions](#code-organization--conventions)
6. [Build System & Scripts](#build-system--scripts)
7. [Code Quality & Standards](#code-quality--standards)
8. [Git Workflow & Submodules](#git-workflow--submodules)
9. [Architecture Patterns](#architecture-patterns)
10. [Configuration Management](#configuration-management)
11. [Important Gotchas](#important-gotchas)
12. [AI Assistant Best Practices](#ai-assistant-best-practices)

---

## Project Overview

**Puppet** is a decentralized copy trading platform built for perpetual futures trading on GMX V2 (Arbitrum). The platform allows traders to replicate successful trading strategies in a non-custodial manner.

### Key Capabilities
- **Copy Trading**: Automated replication of trading positions
- **Perpetual Futures**: Long/short positions on crypto assets
- **On-Chain**: Fully decentralized using smart contracts on Arbitrum
- **Real-Time Indexing**: Blockchain event indexing via Ponder
- **Portfolio Management**: Track performance, leaderboards, and trader profiles

### License
Dual-licensed under BSL-1.1 and GPL-3.0. Review `LICENSE.md` for complete terms before contributing.

---

## Repository Structure

This is a **Bun-based monorepo** with multiple workspaces:

```
monorepo/
├── website/           # Progressive Web App (PWA) frontend
├── middleware/        # Shared TypeScript library (@puppet-copy/middleware)
├── indexer/           # Git submodule - Ponder-based blockchain indexer
├── sequencer/         # Git submodule - Transaction sequencing service
├── contracts/         # Git submodule - Solidity smart contracts
├── docs/              # VitePress documentation site
├── services/          # Utility services (opengraph, telegram bot)
├── .github/           # GitHub Actions workflows
├── .vscode/           # VSCode workspace settings
├── biome.json         # Linting/formatting configuration
├── bunfig.toml        # Bun package manager configuration
├── tsconfig.base.json # Shared TypeScript configuration
└── package.json       # Root workspace configuration
```

### Workspace Purposes

- **website**: PWA frontend for trading interface, leaderboards, portfolios
- **middleware**: Shared library with contract interfaces, utilities, types
- **indexer**: Blockchain data indexing (Ponder + Drizzle ORM)
- **sequencer**: Transaction sequencing service
- **contracts**: Smart contracts (Solidity)
- **docs**: VitePress documentation
- **services**: Utility services (OpenGraph, Telegram bot)

---

## Technology Stack

### Core Runtime
- **Runtime**: Bun (NOT Node.js)
- **Package Manager**: Bun (NOT npm/yarn/pnpm)
- **Language**: TypeScript (Strict mode)
- **Module System**: ES Modules (NodeNext)

### Frontend Stack
- **Build Tool**: Vite
- **UI Framework**: aelea (reactive streams framework)
- **Routing**: aelea router (stream-based)
- **State Management**: Reactive streams
- **PWA**: vite-plugin-pwa with Workbox
- **Charts**: lightweight-charts (TradingView)

### Web3 Stack
- **Ethereum Library**: viem
- **React Hooks**: wagmi
- **Wallet Connect**: @reown/appkit (WalletConnect v2)
- **Account Abstraction**: @rhinestone/sdk
- **Type Safety**: abitype
- **Target Chain**: Arbitrum One (Chain ID: 42161)

### Backend/Indexer
- **Indexing**: Ponder framework
- **Database ORM**: Drizzle
- **Database**: PostgreSQL
- **API**: HTTP SQL endpoint

### Code Quality
- **Linter/Formatter**: Biome (replaces ESLint + Prettier)
- **Dependency Management**: Sherif (monorepo consistency)
- **Testing**: No testing framework currently configured

---

## Development Environment

### Initial Setup

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash  # Linux/macOS
# or
powershell -c "irm bun.sh/install.ps1 | iex"  # Windows

# Clone with submodules
git clone --recursive https://github.com/PuppetCopy/monorepo.git
cd monorepo

# Install dependencies
bun install

# Build middleware (required before website)
bun run middleware:build

# Start development
cd website
bun run dev
```

### VSCode Extensions
Check `.vscode/extensions.json` for recommended extensions:
- Biome for linting/formatting
- Solidity support
- TypeScript previews

---

## Code Organization & Conventions

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | `$ComponentName.ts` | `$TradeForm.ts`, `$LeaderboardTable.ts` |
| **Pages** | `$PageName.ts` | `$Main.ts`, `$Leaderboard.ts` |
| **Constants** | `camelCase.ts` | `tokenList.ts`, `chainConfig.ts` |
| **Types** | `types.ts` | Co-located with implementation |
| **Generated** | Auto-notice at top | `generated/abi/*.ts` |

**Critical Convention**: Components use `$` prefix throughout the codebase.

### Directory Structure

#### Website (`/website/src/`)
```
src/
├── pages/              # Route pages
├── components/         # Reusable UI components
│   ├── form/           # Form components
│   ├── portfolio/      # Portfolio-specific
│   └── table/          # Table components
├── ui-components/      # Base UI library
├── ui-router/          # Routing utilities
├── ui-storage/         # LocalStorage abstractions
├── common/             # Shared utilities
├── logic/              # Business logic
├── wallet/             # Web3 wallet integration
├── const/              # Constants
└── utils/              # General utilities
```

#### Middleware (`/middleware/src/`)
```
src/
├── const/              # Constants (addresses, enums)
├── core/               # Core utilities (math, formatting, dates)
├── gmx/                # GMX protocol integration
├── gbc/                # GBC-related logic
├── generated/          # Auto-generated (DO NOT EDIT)
│   └── abi/            # Contract ABIs
└── script/             # Code generation scripts
```

### Import/Export Conventions

```typescript
// ✅ CORRECT: Named exports (preferred)
export const MyComponent = component((props) => { ... })
export type MyType = { ... }

// ✅ CORRECT: Type-only imports
import type { Address } from 'viem'

// ✅ CORRECT: .js extensions (ESM requirement)
import { formatUsd } from './formatters.js'

// ✅ CORRECT: External imports first
import { map } from '@aelea/core'
import { parseUnits } from 'viem'
import { $Button } from '@/ui-components/$Button'

// ❌ AVOID: Default exports
export default MyComponent

// ❌ AVOID: Missing .js extension
import { formatUsd } from './formatters'
```

### TypeScript Path Aliases

Check `tsconfig.json` in each workspace for configured path aliases:
- `@/ui-components/*`
- `@/ui-router/*`
- `@/ui-storage/*`

---

## Build System & Scripts

### Root-Level Commands

```bash
# Code quality
bun run biome:check              # Lint and format check
bun run biome:check:fix          # Auto-fix issues
bun run sherif                   # Check dependency consistency
bun run sherif:fix               # Fix dependency issues

# Build workspaces
bun run middleware:build         # Build middleware library
bun run website:build            # Build website
bun run docs:build               # Build documentation
bun run contracts:build          # Build contracts

# Maintenance
bun audit                        # Security audit
bun outdated --recursive         # Check outdated dependencies
```

### Build Order Dependency

**Critical**: Middleware must be built before website, as website depends on middleware artifacts.

```bash
# Correct order
bun run middleware:build
bun run website:build
```

### Generation Scripts

Middleware includes code generation scripts for contracts and market data. These are run manually when contracts change. Check `middleware/src/script/` for available generators.

---

## Code Quality & Standards

### Biome Configuration

See `biome.json` for complete configuration:
- **Line Width**: 120 characters
- **Indent**: 2 spaces
- **Quote Style**: Single quotes
- **Semicolons**: As needed (ASI-safe)
- **Trailing Commas**: None
- **Arrow Parens**: As needed

Key linting rules:
- Prefer type imports (`useImportType`)
- Separate type exports (`useExportType`)
- Prefer const over let (`useConst`)
- Use const assertions (`useAsConstAssertion`)
- Allow non-null assertions (`noNonNullAssertion: off`)

### TypeScript Configuration

See `tsconfig.base.json`:
- **Strict Mode**: Enabled
- **Module**: NodeNext (ES Modules)
- **Target**: ES2023
- **Verbatim Module Syntax**: Enabled (explicit imports/exports)
- **Composite**: Enabled (project references)
- **noUnusedLocals/Parameters**: Disabled (functional programming style)

### Dependency Management

**Catalog Dependencies**: Shared versions defined in root `package.json` under `catalog` key. Workspaces reference these with `"package": "catalog:"`.

**Sherif**: Ensures workspace dependency consistency. Run `bun run sherif:fix` to resolve version mismatches.

---

## Git Workflow & Submodules

### Submodules

Three git submodules:
- `contracts` - Smart contracts repository
- `indexer` - Ponder indexer repository
- `sequencer` - Transaction sequencing repository

**Important**: Submodules are referenced by commit SHA. When updating:

```bash
# Initialize submodules
git submodule update --init --recursive

# Update to latest
git submodule update --remote

# Commit the updated reference
git add <submodule>
git commit -m "chore: update <submodule> submodule"
```

### CI/CD

GitHub Actions workflows in `.github/workflows/`. Check for:
- Indexer Docker builds
- Deployment pipelines
- Automated checks

### Git Hooks

No git hooks configured. Code quality relies on:
- Manual checks (`bun run biome:check`)
- CI/CD pipeline enforcement
- VSCode auto-formatting

---

## Architecture Patterns

### Reactive Programming (aelea)

**TLDR**: UI is built with reactive streams. Components receive data as streams (`IStream`/`IBehavior`), transform them with operators (`map`, `filter`, `combine`), and return DOM + exposed behaviors as tuples `[DOMNode, { streams }]`.

**Key Patterns**:
- Components use `$` prefix convention
- Stream-based routing and state management
- Type-safe behavior tethering: `[stream, tether]: IBehavior<Input, Output>`
- LocalStorage abstractions in `ui-storage/`
- In-memory caching with TTL support

**⚠️ Important**: For detailed guidance on writing aelea components, understanding reactive streams, and proper typing patterns, refer to:

**https://github.com/nissoh/aelea/blob/master/CLAUDE.md**

This official guide covers:
- Component function signatures and typing
- Behavior streams and tethering patterns
- State management approaches
- Stream composition and operators
- Common patterns and gotchas

---

## Configuration Management

### Environment Variables

**Convention**: `VITE__` prefix (double underscore) for client-side variables.

Client-side variables are embedded in build via Vite. Server-side variables remain private.

Check `.env.example` or documentation for required variables:
- WalletConnect project ID
- RPC endpoints
- Indexer endpoint
- API keys (server-side only)

### Bun Configuration

See `bunfig.toml`:
- `minimumReleaseAge`: Safety delay for new package versions
- `linkBehavior`: Workspace dependency isolation
- `autoInstall`: Automatic dependency installation

### TypeScript Paths

Each workspace configures its own path aliases in `tsconfig.json`. Extends from `tsconfig.base.json`.

---

## Important Gotchas

### 1. Always Use Bun

```bash
# ❌ WRONG
npm install
yarn add package

# ✅ CORRECT
bun install
bun add package
```

### 2. Build Middleware First

Website depends on middleware build artifacts. Always build middleware before website.

### 3. .js Extensions Required

```typescript
// ❌ WRONG
import { foo } from './bar'

// ✅ CORRECT
import { foo } from './bar.js'
```

ES Modules require explicit file extensions. TypeScript's `verbatimModuleSyntax` enforces this.

### 4. Component $ Prefix

```typescript
// ❌ WRONG
export const TradeButton = component(...)

// ✅ CORRECT
export const $TradeButton = component(...)
```

### 5. Type Imports

```typescript
// ❌ WRONG
import { Address } from 'viem'

// ✅ CORRECT (when used only as type)
import type { Address } from 'viem'
```

Biome enforces `useImportType` for better tree-shaking.

### 6. Environment Variable Prefix

```bash
# ❌ WRONG - Not accessible in client
WC_PROJECT_ID=abc

# ✅ CORRECT - Accessible via import.meta.env
VITE__WC_PROJECT_ID=abc
```

### 7. Generated Files

Files in `middleware/src/generated/` have auto-generated warnings. Edit the generation script, not the output.

### 8. Submodule Changes

Don't commit changes inside submodules from the monorepo. Work in the submodule's own repository, then update the reference.

### 9. Catalog Dependency Versions

After changing catalog versions in root `package.json`, run:
```bash
bun install
bun run sherif:fix
```

### 10. No Testing Framework

Currently no automated tests. Manual testing required:
- Browser testing
- DevTools inspection
- Testnet verification before mainnet

---

## AI Assistant Best Practices

### Working with This Codebase

1. **Check current state first**: Read relevant files before making changes
2. **Follow conventions**: Use `$` prefix for components, `.js` extensions, type imports
3. **Build order matters**: Always build middleware before website
4. **Use Biome**: Run `bun run biome:check:fix` before committing
5. **Respect submodules**: Don't edit submodule contents from monorepo
6. **Manual testing**: No automated tests exist, so test changes manually
7. **Ask for clarification**: When requirements are ambiguous
8. **Match existing patterns**: Use similar files as templates
9. **Document complex logic**: Add comments for Web3 interactions
10. **Avoid creating new files unnecessarily**: Prefer editing existing files

### Useful Search Patterns

```bash
# Find components
rg '^\s*export const \$\w+' --type ts

# Find constants/addresses
rg 'export const.*=' middleware/src/const/

# Find contract interactions
rg 'writeContract|readContract' --type ts

# Find environment variable usage
rg 'import\.meta\.env\.' --type ts
```

### Code Generation Guidelines

- Match existing patterns and file structure
- Use reactive streams for state management
- Type everything (avoid `any`)
- Export types separately from values
- Add JSDoc for complex functions
- Use const assertions for literals
- Follow aelea component patterns

### Common Development Tasks

**Adding a component**: Create file with `$` prefix, implement using aelea patterns, export from barrel file if applicable.

**Updating contracts**: Update submodule, run generation scripts, rebuild middleware.

**Adding a route**: Create page component, add to router configuration.

**Updating dependencies**: Modify catalog in root `package.json`, run `bun install`, verify with `sherif`.

### Pre-commit Checklist

```bash
# Quality checks
bun run biome:check:fix
bun run sherif

# Build verification
cd middleware && bun run build
cd ../website && bun run build

# Manual testing in browser
cd website && bun run dev
```

---

## Quick Reference

### Essential Commands

```bash
# Setup
bun install
git submodule update --init --recursive

# Development
cd website && bun run dev

# Build
bun run middleware:build
bun run website:build

# Quality
bun run biome:check:fix
bun run sherif:fix

# Maintenance
bun outdated --recursive
bun audit
git submodule update --remote
```

### Commit Message Conventions

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `perf:` - Performance improvements

---

## Resources

### Official Documentation
- **Bun**: https://bun.sh/docs
- **Vite**: https://vitejs.dev/
- **Biome**: https://biomejs.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/

### Web3 Libraries
- **viem**: https://viem.sh/
- **wagmi**: https://wagmi.sh/
- **Reown AppKit**: https://docs.reown.com/appkit/overview

### Frameworks
- **aelea**: https://github.com/nissoh/aelea
- **Ponder**: https://ponder.sh/
- **Drizzle ORM**: https://orm.drizzle.team/

### Project Resources
Check repository README and docs for:
- Indexer repository
- Contracts repository
- Sequencer repository
- API endpoints
- Deployment information

---

**End of CLAUDE.md**

> This document focuses on stable patterns and conventions. For specific implementation details, version numbers, and current configurations, refer to the actual source code and configuration files.
