# CLAUDE.md - AI Assistant Guide to Puppet Monorepo

> **Last Updated**: 2025-11-14
> **Purpose**: Comprehensive guide for AI assistants working with the Puppet copy trading platform codebase

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
10. [Testing Strategy](#testing-strategy)
11. [Web3 Integration](#web3-integration)
12. [Configuration Management](#configuration-management)
13. [Common Development Tasks](#common-development-tasks)
14. [Important Gotchas](#important-gotchas)
15. [Resources & References](#resources--references)

---

## Project Overview

**Puppet** is a decentralized copy trading platform built for perpetual futures trading on GMX V2 (Arbitrum). The platform allows traders to replicate successful trading strategies in a non-custodial manner.

### Key Capabilities
- **Copy Trading**: Automated replication of trading positions
- **Perpetual Futures**: Long/short positions on BTC, ETH, and other assets
- **On-Chain**: Fully decentralized using smart contracts on Arbitrum
- **Real-Time Indexing**: Blockchain event indexing via Ponder
- **Portfolio Management**: Track performance, leaderboards, and trader profiles

### License
Dual-licensed under:
- **BSL-1.1** (Business Source License)
- **GPL-3.0** (GNU General Public License v3)

Review `LICENSE.md` for complete terms before contributing.

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
├── services/          # Utility services
│   ├── opengraph/     # Social media preview image generation
│   └── home-tg-bot/   # Telegram bot integration
├── .github/           # GitHub Actions workflows
├── .vscode/           # VSCode workspace settings
├── biome.json         # Linting/formatting configuration
├── bunfig.toml        # Bun package manager configuration
├── tsconfig.base.json # Shared TypeScript configuration
└── package.json       # Root workspace configuration
```

### Workspace Details

| Workspace | Type | Purpose | Key Dependencies |
|-----------|------|---------|------------------|
| **website** | PWA Frontend | Trading interface, leaderboards, portfolios | Vite, aelea, wagmi, viem |
| **middleware** | Shared Library | Contract interfaces, utilities, types | viem, abitype, aelea |
| **indexer** | Submodule | Blockchain data indexing | Ponder, Drizzle ORM |
| **sequencer** | Submodule | Transaction sequencing | (External) |
| **contracts** | Submodule | Smart contracts | Solidity, Foundry |
| **docs** | Documentation | VitePress docs site | VitePress |
| **services** | Utilities | OpenGraph, Telegram bot | Satori, telegraf |

---

## Technology Stack

### Core Runtime
- **Runtime**: [Bun](https://bun.sh) v1.3.1 (NOT Node.js)
- **Package Manager**: Bun (NOT npm/yarn/pnpm)
- **Language**: TypeScript 5.9.2 (Strict mode)
- **Module System**: ES Modules (NodeNext)

### Frontend (Website)
- **Build Tool**: Vite 7.2.1
- **UI Framework**: [aelea](https://github.com/nissoh/aelea) (reactive streams)
- **Routing**: aelea router (stream-based)
- **State Management**: Reactive streams (aelea/stream)
- **PWA**: vite-plugin-pwa with Workbox
- **Charts**: [lightweight-charts](https://tradingview.github.io/lightweight-charts/) (TradingView)

### Web3 Stack
- **Ethereum Library**: [viem](https://viem.sh) 2.38.6
- **React Hooks**: [wagmi](https://wagmi.sh) 2.22.1
- **Wallet Connect**: @reown/appkit 1.8.13 (WalletConnect v2)
- **Account Abstraction**: @rhinestone/sdk 1.0.20
- **Type Safety**: abitype 1.1.1
- **Chain**: Arbitrum One (Chain ID: 42161)

### Backend/Indexer
- **Indexing Framework**: [Ponder](https://ponder.sh) 0.14.13
- **Database ORM**: [Drizzle](https://orm.drizzle.team) 0.41.0
- **Database**: PostgreSQL
- **API**: HTTP SQL endpoint via `@puppet-copy/sql/client`

### Code Quality
- **Linter/Formatter**: [Biome](https://biomejs.dev) 2.3.4 (replaces ESLint + Prettier)
- **Dependency Management**: [Sherif](https://github.com/QuiiBz/sherif) 1.8.0

### Testing
⚠️ **No testing framework currently configured**

---

## Development Environment

### Prerequisites

```bash
# Install Bun (Linux/macOS)
curl -fsSL https://bun.sh/install | bash

# Install Bun (Windows)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Initial Setup

```bash
# Clone repository with submodules
git clone --recursive https://github.com/PuppetCopy/monorepo.git
cd monorepo

# Install dependencies
bun install

# Build middleware (required before website)
bun run middleware:build

# Start website development server
cd website
bun run dev
```

### VSCode Setup

**Recommended Extensions** (see `.vscode/extensions.json`):
- `biomejs.biome` - Linting and formatting
- `NomicFoundation.hardhat-solidity` - Solidity support
- `typescriptteam.native-preview` - TypeScript previews

**Auto-configured Settings**:
- Biome as default formatter
- Format on save enabled
- Auto-organize imports on save
- 120 character line width

---

## Code Organization & Conventions

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | `$ComponentName.ts` | `$TradeForm.ts`, `$LeaderboardTable.ts` |
| **Pages** | `$PageName.ts` (in `/pages`) | `$Main.ts`, `$Leaderboard.ts` |
| **Constants** | `camelCase.ts` | `tokenList.ts`, `chainConfig.ts` |
| **Types** | `types.ts` (co-located) | `wallet/types.ts`, `logic/types.ts` |
| **Generated** | Auto-notice at top | `generated/abi/*.ts` |

**Important**: Components use `$` prefix convention. This is consistent throughout the codebase.

### Directory Structure

#### Website (`/website/src/`)
```
src/
├── pages/              # Route pages ($Main, $Leaderboard, $Profile, etc.)
├── components/         # Reusable UI components
│   ├── form/           # Form components ($GmxLabeledInput, etc.)
│   ├── portfolio/      # Portfolio-specific components
│   └── table/          # Table components ($Table, $TableRow, etc.)
├── ui-components/      # Base UI library (buttons, inputs, overlays)
├── ui-router/          # Routing utilities (stream-based router)
├── ui-storage/         # LocalStorage abstractions (type-safe)
├── common/             # Shared utilities (cache, format, etc.)
├── logic/              # Business logic (separate from UI)
├── wallet/             # Web3 wallet integration (wagmi, viem)
├── const/              # Constants (addresses, chain configs)
├── transitions/        # Animation helpers
└── utils/              # General utilities (math, date, etc.)
```

#### Middleware (`/middleware/src/`)
```
src/
├── const/              # Constants (contract addresses, enums)
├── core/               # Core utilities (math, formatting, dates)
├── gmx/                # GMX protocol integration (markets, tokens)
├── gbc/                # GBC-related logic
├── generated/          # Auto-generated files (DO NOT EDIT)
│   └── abi/            # Contract ABIs and type-safe interfaces
└── script/             # Code generation scripts
    ├── generate-gmx-contract-list.ts
    ├── generate-gmx-market-list.ts
    ├── generate-gmx-token-list.ts
    └── generate-puppet-contracts.ts
```

### Import/Export Conventions

```typescript
// ✅ CORRECT: Named exports (preferred)
export const MyComponent = component((props) => { ... })
export type MyType = { ... }

// ✅ CORRECT: Type-only imports
import type { Address } from 'viem'
import type { IStream } from '@aelea/core'

// ✅ CORRECT: Absolute paths via aliases
import { $Button } from '@/ui-components/$Button'
import { formatUsd } from '@/common/formatters'

// ✅ CORRECT: External imports first, then internal
import { map } from '@aelea/core'
import { parseUnits } from 'viem'
import { $Button } from '@/ui-components/$Button'

// ✅ CORRECT: .js extensions in imports (ESM requirement)
import { formatUsd } from './formatters.js'

// ❌ AVOID: Default exports
export default MyComponent

// ❌ AVOID: Relative imports when aliases available
import { $Button } from '../../../ui-components/$Button'
```

### TypeScript Path Aliases (Website)

```typescript
// Configured in tsconfig.json
"@/ui-components/*" → "src/ui-components/*"
"@/ui-router/*"     → "src/ui-router/*"
"@/ui-storage/*"    → "src/ui-storage/*"
```

---

## Build System & Scripts

### Root-Level Scripts

```bash
# Code quality
bun run biome:check              # Lint and format check
bun run biome:check:fix          # Auto-fix issues (safe)
bun run biome:check:fix:unsafe   # Auto-fix with unsafe transforms
bun run sherif                   # Check workspace dependency consistency
bun run sherif:fix               # Fix dependency inconsistencies

# Build individual workspaces
bun run middleware:build         # Build middleware library
bun run website:build            # Build website for production
bun run docs:build               # Build VitePress docs
bun run contracts:build          # Build contracts submodule

# Maintenance
bun audit                        # Security audit
bun audit --fix                  # Auto-fix vulnerabilities
bun outdated --recursive         # Check for outdated dependencies
```

### Middleware Build Process

```bash
cd middleware
bun run build
```

**Build Steps**:
1. Clean `/dist` directory
2. Run TypeScript compilation (`tsc -b`)
3. Generate contract lists and ABIs (if needed)
4. Output:
   - `/dist/esm/*/index.js` - ES modules
   - `/dist/types/*/index.d.ts` - Type definitions

**Generation Scripts** (run manually when contracts change):
```bash
cd middleware
bun run script/generate-gmx-contract-list.ts    # GMX contract ABIs
bun run script/generate-gmx-market-list.ts      # Market configurations
bun run script/generate-gmx-token-list.ts       # Token metadata
bun run script/generate-puppet-contracts.ts     # Puppet contract ABIs
```

### Website Build Process

```bash
cd website
bun run build
```

**Build Steps**:
1. Vite build with optimizations:
   - Code splitting (manual chunks for web3, charts, core)
   - Tree-shaking and minification
   - PWA generation (service worker, manifest, icons)
   - Environment variable replacement in `index.html`
2. Output: `/dist` directory (static assets)

**Development Server**:
```bash
cd website
bun run dev          # Start dev server (default: http://localhost:5173)
bun run preview      # Preview production build
```

### Docker Deployment

**Website Dockerfile** (multi-stage build):
```bash
# Build the Docker image
docker build -t puppet-website .

# Run container
docker run -p 80:80 \
  -e RHINESTONE_API_KEY=your_key \
  puppet-website
```

---

## Code Quality & Standards

### Biome Configuration

**File**: `biome.json`

**Key Settings**:
- **Line Width**: 120 characters
- **Indent**: 2 spaces
- **Quote Style**: Single quotes
- **Semicolons**: As needed (ASI-safe)
- **Trailing Commas**: None
- **Arrow Parens**: As needed (`x => x`, not `(x) => x`)

**Linting Rules** (highlights):
- ✅ `useImportType: warn` - Prefer type imports
- ✅ `useExportType: error` - Separate type exports
- ✅ `useConst: error` - Prefer const over let
- ✅ `useAsConstAssertion: error` - Use `as const` for literals
- ❌ `noNonNullAssertion: off` - Allow `!` operator
- ❌ `noExplicitAny: off` - Allow `any` type (use sparingly)

**Running Biome**:
```bash
# Check only (no changes)
bun run biome:check

# Auto-fix safe issues
bun run biome:check:fix

# Auto-fix including unsafe transforms
bun run biome:check:fix:unsafe
```

### TypeScript Configuration

**Base Config**: `tsconfig.base.json`

**Compiler Options**:
- **Strict Mode**: `strict: true` (all strict checks enabled)
- **Module System**: `NodeNext` (ES Modules)
- **Target**: `ES2023`
- **No Fallthrough**: Enabled
- **No Implicit Returns**: Enabled
- **Verbatim Module Syntax**: Enabled (explicit import/export)
- **Composite**: Enabled (project references)

**Important Settings**:
```json
{
  "noUnusedLocals": false,        // Disabled for functional programming
  "noUnusedParameters": false,    // Disabled for functional programming
  "allowUnreachableCode": false,  // Catch dead code
  "skipLibCheck": true            // Performance optimization
}
```

### Dependency Management (Sherif)

Sherif ensures workspace dependencies are consistent across the monorepo.

**Common Issues**:
- Mismatched versions across workspaces
- Missing dependencies in workspace package.json
- Incorrect use of `catalog:` references

**Fix Issues**:
```bash
bun run sherif:fix
```

### Catalog Dependencies

**Shared versions** defined in root `package.json`:
```json
{
  "catalog": {
    "viem": "2.38.6",
    "aelea": "2.5.31",
    "typescript": "^5.9.2",
    // etc.
  }
}
```

**Usage in workspace**:
```json
{
  "dependencies": {
    "viem": "catalog:",        // Uses version from catalog
    "aelea": "catalog:"
  }
}
```

---

## Git Workflow & Submodules

### Branching Strategy

- **Main Branch**: `main` (protected)
- **Feature Branches**: `feature/description` or `claude/session-id`
- **Hotfixes**: `hotfix/description`

### Submodule Management

**Three git submodules**:
```
contracts - https://github.com/PuppetCopy/contracts.git
indexer   - https://github.com/PuppetCopy/indexer.git
sequencer - https://github.com/PuppetCopy/sequencer.git
```

**Common Operations**:
```bash
# Clone with submodules
git clone --recursive https://github.com/PuppetCopy/monorepo.git

# Initialize submodules (if already cloned)
git submodule update --init --recursive

# Update submodules to latest
git submodule update --remote

# Update specific submodule
git submodule update --remote indexer

# Commit submodule reference update
git add indexer
git commit -m "chore: update indexer submodule to latest commit"
```

**Important**:
- Submodules are **referenced by commit SHA**, not branch
- When updating submodules, you must commit the new reference
- CI/CD workflows use `--recursive` checkout

### CI/CD Pipeline

**GitHub Actions**: `.github/workflows/indexer-release.yml`

**Trigger**: Push to `main` with changes in `middleware/**`

**Process**:
1. Checkout with submodules (`--recursive`)
2. Setup Docker Buildx
3. Build indexer Docker image
4. Push to `ghcr.io/puppetcopy/indexer:latest`
5. Use GitHub Actions cache for layers

**Note**: Website deployment workflow exists but is disabled (`website-release.yml.disabled`)

### Git Hooks

⚠️ **No git hooks configured** (no Husky, lefthook, or pre-commit)

Code quality enforcement relies on:
- Manual pre-commit checks (`bun run biome:check`)
- CI/CD pipeline checks
- VSCode auto-formatting on save

---

## Architecture Patterns

### Reactive Programming (aelea)

**Core Concept**: UI is a function of reactive streams.

```typescript
import { component } from '@aelea/core'
import { $node, $text } from '@aelea/dom'
import type { IStream, IBehavior } from '@aelea/core'

// Component signature: Array of behaviors → DOM node
const $Counter = component<[IBehavior<number>]>(([count, countTether]) => {
  const doubled = map(n => n * 2, count)

  return $node(
    $text(map(n => `Count: ${n}`, count)),
    $text(map(n => `Doubled: ${n}`, doubled))
  )
})

// Usage
const count = replayLatest<number>()
const dom = $Counter([count])
count.next(5)  // Updates UI reactively
```

**Key Types**:
- `IStream<T>` - Cold observable (lazy, multi-cast)
- `IBehavior<T>` - Hot observable with current value
- `map()`, `filter()`, `combine()` - Stream operators
- `replayLatest()` - Create behavior subject

**Component Patterns**:
```typescript
// Route page
export const $MyPage = component(() => {
  const state = replayLatest<State>()

  return $column(
    $Header(),
    $Content([state]),
    $Footer()
  )
})

// Form component
export const $TradeForm = component<[IBehavior<Trade>]>(([trade, tradeTether]) => {
  const submitClick = O(tradeTether.click, snapshot(trade))

  return $form(
    $input({ value: map(t => t.amount, trade) }),
    $button({ click: submitTether() })
  )(/* submit logic */)
})
```

### Routing (aelea router)

```typescript
import { $router } from '@/ui-router/$router'
import { Route } from '@/ui-router/types'

const routes: Route[] = [
  { path: '/', $component: $HomePage },
  { path: '/trade', $component: $TradePage },
  { path: '/profile/:address', $component: $ProfilePage }
]

export const $App = $router(routes)
```

**Route matching** is stream-based:
```typescript
// In component
const route = useRoute()  // IBehavior<RouteMatch>
const address = map(r => r.params.address, route)
```

### Component Composition

**Naming Convention**: `$` prefix for components

```typescript
// Base components (ui-components)
export const $Button = $node()
export const $Input = $node()
export const $Card = $node()

// Composite components
export const $TradeCard = component((props) => {
  return $Card(
    $Button({ label: 'Trade' }),
    $Input({ placeholder: 'Amount' })
  )
})
```

### State Management

**LocalStorage** (type-safe via ui-storage):
```typescript
import { persistentAtom } from '@/ui-storage'

// Define persistent state
export const themeStore = persistentAtom<'light' | 'dark'>(
  'app-theme',
  'dark',  // default
  { parser: JSON }
)

// Read
const currentTheme = themeStore.read()

// Write
themeStore.write('light')

// Stream-based
const theme = replayLatest(themeStore.read())
themeStore.observe(theme)  // Auto-persist changes
```

**In-Memory Cache**:
```typescript
import { cacheMap } from '@/common/cache'

const priceCache = cacheMap<string, bigint>(
  60_000,  // TTL: 60 seconds
  (key) => fetchPrice(key)
)

const price = await priceCache.get('BTC')
```

### Code Splitting (Vite)

**Manual Chunks** (website vite.config.ts):
```typescript
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'web3': ['viem', 'wagmi', '@reown/appkit'],
          'charts': ['lightweight-charts'],
          'core': ['@aelea/core', '@aelea/dom']
        }
      }
    }
  }
}
```

**Lazy Loading**:
```typescript
// Router auto-splits by route
const routes = [
  { path: '/', $component: lazy(() => import('./$Home')) },
  { path: '/trade', $component: lazy(() => import('./$Trade')) }
]
```

---

## Testing Strategy

### Current State

⚠️ **No testing framework is currently configured.**

**Missing**:
- No test files (`*.test.ts`, `*.spec.ts`)
- No test runner (Vitest, Jest, Bun test)
- No coverage reporting
- No E2E testing (Playwright, Cypress)

### Recommended Approach (If Adding Tests)

**Unit Testing** (Bun built-in):
```bash
# Add to package.json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage"
  }
}
```

**Example Test**:
```typescript
// utils/format.test.ts
import { describe, test, expect } from 'bun:test'
import { formatUsd } from './format'

describe('formatUsd', () => {
  test('formats USD correctly', () => {
    expect(formatUsd(1000n, 18)).toBe('$0.000001')
  })
})
```

**Component Testing** (Future):
- Consider `@testing-library/dom` for aelea components
- Mock Web3 interactions (viem test clients)
- Snapshot testing for complex components

**E2E Testing** (Future):
- Playwright for full user flows
- Test wallet integration (mock wallets)
- Test trading flows end-to-end

### Manual Testing Approach

**Currently Recommended**:
1. Run development server: `bun run dev`
2. Test in browser (Chrome DevTools)
3. Use Arbitrum testnet for Web3 interactions
4. Verify builds: `bun run build && bun run preview`

---

## Web3 Integration

### Chain Configuration

**Target Chain**: Arbitrum One (Chain ID: 42161)

```typescript
import { arbitrum } from 'viem/chains'

export const CHAIN = arbitrum

export const CHAIN_CONFIG = {
  id: 42161,
  name: 'Arbitrum One',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://arb1.arbitrum.io/rpc'] },
    websocket: { wss: ['wss://arb1.arbitrum.io/ws'] }
  }
}
```

### RPC Configuration

**WebSocket RPCs** (preferred):
```typescript
const RPC_WS = [
  `wss://lb.drpc.org/arbitrum/${process.env.DRPC_API_KEY}`,
  'wss://arbitrum-one-rpc.publicnode.com'
]
```

**HTTP Fallbacks**:
```typescript
const RPC_HTTP = [
  'https://arb1.arbitrum.io/rpc',
  'https://arbitrum.llamarpc.com'
]
```

**Transport Pattern** (wagmi):
```typescript
import { fallback, http, webSocket } from 'viem'

const transport = fallback([
  webSocket(RPC_WS[0]),
  webSocket(RPC_WS[1]),
  http(RPC_HTTP[0]),
  http(RPC_HTTP[1])
])
```

### Wallet Connection (Reown AppKit)

```typescript
import { createAppKit } from '@reown/appkit'
import { arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const wagmiAdapter = new WagmiAdapter({
  networks: [arbitrum],
  projectId: process.env.VITE__WC_PROJECT_ID
})

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrum],
  projectId: process.env.VITE__WC_PROJECT_ID,
  features: {
    analytics: false,
    email: false,
    socials: []
  }
})
```

**Usage**:
```typescript
// Connect wallet
await appKit.open()

// Get current account
const account = wagmiAdapter.wagmiConfig.getAccount()

// Disconnect
await appKit.disconnect()
```

### Contract Interactions (viem)

**Type-Safe Read**:
```typescript
import { readContract } from 'viem/actions'
import { PUPPET_ABI } from '@puppet-copy/middleware/generated/abi'

const balance = await readContract(client, {
  address: PUPPET_CONTRACT_ADDRESS,
  abi: PUPPET_ABI,
  functionName: 'balanceOf',
  args: [accountAddress]
})
// balance is typed as bigint
```

**Type-Safe Write**:
```typescript
import { writeContract } from 'viem/actions'
import { parseUnits } from 'viem'

const hash = await writeContract(client, {
  address: TOKEN_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [SPENDER_ADDRESS, parseUnits('100', 6)]
})

// Wait for transaction
const receipt = await waitForTransactionReceipt(client, { hash })
```

**Batch Transactions (ERC-5792)**:
```typescript
import { sendCalls } from 'viem/experimental'

const calls = [
  {
    to: TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [SPENDER, amount]
  },
  {
    to: PUPPET_ADDRESS,
    abi: PUPPET_ABI,
    functionName: 'deposit',
    args: [amount]
  }
]

const id = await sendCalls(client, { calls })
```

### GMX V2 Integration

**Key Contracts**:
```typescript
import {
  GMX_READER_ADDRESS,
  GMX_DATA_STORE_ADDRESS,
  GMX_MARKET_FACTORY_ADDRESS
} from '@puppet-copy/middleware/const'

// Market information
const markets = getGmxMarkets(CHAIN.id)
// [{ address: '0x...', indexToken: 'BTC', longToken: 'BTC', shortToken: 'USDC', ... }]

// Token information
const tokens = getGmxTokens(CHAIN.id)
// [{ symbol: 'BTC', address: '0x...', decimals: 8, ... }]
```

**Reading Market Data**:
```typescript
import { readContract } from 'viem/actions'
import { GMX_READER_ABI } from '@puppet-copy/middleware/generated/abi'

const marketInfo = await readContract(client, {
  address: GMX_READER_ADDRESS,
  abi: GMX_READER_ABI,
  functionName: 'getMarket',
  args: [GMX_DATA_STORE_ADDRESS, marketAddress]
})
```

### Account Abstraction (Rhinestone)

**Orchestrator API** (proxied via Caddy):
```typescript
const ORCHESTRATOR_ENDPOINT = '/api/orchestrator'

// Simulate batch transaction
const response = await fetch(`${ORCHESTRATOR_ENDPOINT}/simulate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    account: accountAddress,
    calls: [/* ... */]
  })
})
```

**Note**: API key is injected server-side (Caddy config) to keep it secret.

### Indexer SQL Queries

**Production Endpoint**: `https://indexer-production-1db7.up.railway.app/sql`

**Client Setup**:
```typescript
import { createClient } from '@puppet-copy/sql/client'

const sql = createClient({
  endpoint: process.env.VITE__INDEXR_ENDPOINT
})

// Type-safe queries
const candles = await sql.query.priceCandle.findMany({
  where: { symbol: 'BTC' },
  orderBy: { timestamp: 'desc' },
  limit: 100
})
```

**Common Queries**:
```typescript
// Get trader performance
const performance = await sql.query.traderStats.findFirst({
  where: { address: traderAddress }
})

// Get recent trades
const trades = await sql.query.trade.findMany({
  where: { trader: traderAddress },
  orderBy: { timestamp: 'desc' }
})

// Get price history
const prices = await sql.query.priceCandle.findMany({
  where: {
    symbol: 'BTC',
    interval: '1h',
    timestamp: { gte: startTime }
  }
})
```

---

## Configuration Management

### Environment Variables

**Naming Convention**: `VITE__` prefix (double underscore) for client-side variables.

**Client-Side** (embedded in build):
```bash
# WalletConnect
VITE__WC_PROJECT_ID=your_project_id

# Arbitrum RPC endpoints
VITE__WC_RPC_URL_42161_1=wss://lb.drpc.org/arbitrum/YOUR_KEY
VITE__WC_RPC_URL_42161_2=wss://arbitrum-one-rpc.publicnode.com

# Indexer endpoint
VITE__INDEXR_ENDPOINT=https://indexer-production-1db7.up.railway.app/sql
```

**Server-Side** (runtime only, NOT in build):
```bash
# Rhinestone API key (Caddy proxy)
RHINESTONE_API_KEY=your_api_key

# Server port (Caddy)
PORT=80
```

**Loading Env Variables**:
```typescript
// Vite auto-loads VITE_ variables
const projectId = import.meta.env.VITE__WC_PROJECT_ID

// Validate required variables
if (!projectId) {
  throw new Error('VITE__WC_PROJECT_ID is required')
}
```

**Build-Time Replacement** (index.html):
```html
<!-- These get replaced during build -->
<title>__APP_NAME__</title>
<meta property="og:url" content="__WEBSITE__" />
<meta name="theme-color" content="__THEME_PRIMARY__" />
```

### Bun Configuration (bunfig.toml)

```toml
[install]
minimumReleaseAge = 800      # Wait 7 days before using new package versions
linkBehavior = "isolated"     # Isolated node_modules per workspace

[test]
coverage = true               # Enable coverage (currently unused)

[run]
autoInstall = true            # Auto-install missing dependencies
telemetry = false             # Disable telemetry
```

### TypeScript Path Resolution

**Root tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "resolvePackageJsonExports": true,
    "resolvePackageJsonImports": true,
    "verbatimModuleSyntax": true,
    "composite": true
  }
}
```

**Workspace-specific** (website):
```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/ui-components/*": ["./src/ui-components/*"],
      "@/ui-router/*": ["./src/ui-router/*"],
      "@/ui-storage/*": ["./src/ui-storage/*"]
    }
  }
}
```

### Vite Configuration Patterns

**Key Plugins**:
```typescript
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        runtimeCaching: [/* ... */]
      }
    })
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'web3': ['viem', 'wagmi'],
          'charts': ['lightweight-charts']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

---

## Common Development Tasks

### Adding a New Component

```bash
# 1. Create component file (use $ prefix)
touch website/src/components/$MyComponent.ts

# 2. Implement component
cat > website/src/components/$MyComponent.ts << 'EOF'
import { component } from '@aelea/core'
import { $node, $text } from '@aelea/dom'
import type { IBehavior } from '@aelea/core'

export const $MyComponent = component<[IBehavior<string>]>(([data, dataTether]) => {
  return $node(
    $text(data)
  )
})
EOF

# 3. Export from index (if using barrel exports)
echo "export { $MyComponent } from './$MyComponent.js'" >> website/src/components/index.ts

# 4. Use in page
# Import and use $MyComponent in your page component
```

### Adding a New Contract ABI

```bash
# 1. Update contracts submodule (if needed)
cd contracts
git pull origin main
cd ..
git add contracts
git commit -m "chore: update contracts submodule"

# 2. Update middleware generation script
cd middleware
# Edit script/generate-puppet-contracts.ts to include new contract

# 3. Run generation
bun run script/generate-puppet-contracts.ts

# 4. Rebuild middleware
bun run build

# 5. Verify types are generated
ls -la dist/types/generated/abi/
```

### Adding a New Route/Page

```bash
# 1. Create page component
cat > website/src/pages/$NewPage.ts << 'EOF'
import { component } from '@aelea/core'
import { $column, $text } from '@aelea/dom'

export const $NewPage = component(() => {
  return $column(
    $text('New Page Content')
  )
})
EOF

# 2. Add route to router configuration
# Edit website/src/router.ts
# Add: { path: '/new-page', $component: $NewPage }

# 3. Test route
bun run dev
# Navigate to http://localhost:5173/new-page
```

### Updating Dependencies

```bash
# 1. Check for outdated dependencies
bun outdated --recursive

# 2. Update specific package in catalog
# Edit package.json catalog section
{
  "catalog": {
    "viem": "2.39.0"  # Update version
  }
}

# 3. Update all workspaces
bun install

# 4. Verify consistency
bun run sherif

# 5. Test builds
bun run middleware:build
bun run website:build

# 6. Commit lockfile
git add bun.lock
git commit -m "chore: update viem to 2.39.0"
```

### Running Code Quality Checks

```bash
# Full quality check pipeline
bun run biome:check              # Check linting/formatting
bun run sherif                   # Check dependency consistency
cd middleware && bun run build   # Verify middleware builds
cd ../website && bun run build   # Verify website builds

# Auto-fix issues
bun run biome:check:fix          # Fix safe issues
bun run sherif:fix               # Fix dependency issues

# Pre-commit checklist
bun run biome:check:fix && \
bun run sherif && \
cd middleware && bun run build && \
cd ../website && bun run build
```

### Debugging Web3 Issues

```typescript
// Enable viem debug logging
import { createPublicClient, http } from 'viem'

const client = createPublicClient({
  chain: arbitrum,
  transport: http('https://arb1.arbitrum.io/rpc', {
    onFetchRequest: (req) => console.log('Request:', req),
    onFetchResponse: (res) => console.log('Response:', res)
  })
})

// Test RPC connectivity
const blockNumber = await client.getBlockNumber()
console.log('Current block:', blockNumber)

// Simulate transaction
import { simulateContract } from 'viem/actions'

const { request } = await simulateContract(client, {
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'transfer',
  args: [recipient, amount],
  account: userAddress
})
// If this succeeds, the transaction should work
```

### Working with Submodules

```bash
# Initialize all submodules
git submodule update --init --recursive

# Update specific submodule
cd indexer
git checkout main
git pull origin main
cd ..
git add indexer
git commit -m "chore: update indexer submodule to latest"

# Update all submodules to latest
git submodule update --remote --recursive
git add -A
git commit -m "chore: update all submodules to latest"

# Clone with submodules (for new developers)
git clone --recursive https://github.com/PuppetCopy/monorepo.git

# Fix detached HEAD in submodule
cd indexer
git checkout main
cd ..
```

---

## Important Gotchas

### 1. **Always Use Bun, Not npm/yarn/pnpm**

```bash
# ❌ WRONG
npm install
yarn add viem

# ✅ CORRECT
bun install
bun add viem
```

**Why**: The project is configured for Bun's package manager. Using npm/yarn will create incompatible lockfiles.

### 2. **Build Middleware Before Website**

The website depends on built middleware artifacts:

```bash
# ❌ WRONG - Website build will fail
cd website && bun run build

# ✅ CORRECT
cd middleware && bun run build
cd ../website && bun run build
```

### 3. **Always Use .js Extensions in Imports**

```typescript
// ❌ WRONG - May break in production
import { formatUsd } from './formatters'

// ✅ CORRECT
import { formatUsd } from './formatters.js'
```

**Why**: ES Modules require explicit file extensions. TypeScript's `verbatimModuleSyntax` enforces this.

### 4. **Components Must Use $ Prefix**

```typescript
// ❌ WRONG - Breaks convention
export const TradeButton = component(...)

// ✅ CORRECT
export const $TradeButton = component(...)
```

**Why**: Consistent codebase convention for identifying aelea components.

### 5. **Use Type Imports for Types**

```typescript
// ❌ WRONG - Biome will warn
import { Address } from 'viem'
const addr: Address = '0x...'

// ✅ CORRECT
import type { Address } from 'viem'
const addr: Address = '0x...'
```

**Why**: `useImportType` rule enforces this for better tree-shaking and clarity.

### 6. **Environment Variables Need VITE__ Prefix**

```bash
# ❌ WRONG - Won't be available in client
WC_PROJECT_ID=abc123

# ✅ CORRECT
VITE__WC_PROJECT_ID=abc123
```

**Why**: Vite only exposes variables with `VITE_` prefix to client code. Note the **double underscore** convention used in this project.

### 7. **Don't Edit Generated Files**

Files in `middleware/src/generated/` have auto-generated notices:

```typescript
// ⚠️ DO NOT EDIT - This file is auto-generated
// Run: bun run script/generate-puppet-contracts.ts
```

**What to do instead**: Edit the generation script, then re-run it.

### 8. **Submodules Are Read-Only in This Repo**

```bash
# ❌ WRONG - Don't commit changes inside submodules from monorepo
cd indexer
git commit -m "fix: something"
git push

# ✅ CORRECT - Work in submodule's own repository
cd /path/to/separate/indexer-repo
git commit -m "fix: something"
git push

# Then update reference in monorepo
cd /path/to/monorepo/indexer
git pull origin main
cd ..
git add indexer
git commit -m "chore: update indexer submodule"
```

### 9. **Catalog Dependencies Must Match**

```bash
# After changing catalog version
bun install
bun run sherif:fix
```

**Why**: Sherif enforces that all workspaces using a catalog dependency use the same version.

### 10. **No Testing Framework = Manual Testing Required**

Since there's no automated testing:
- Test manually in browser after changes
- Use browser DevTools extensively
- Test on Arbitrum testnet before mainnet
- Run full build before pushing: `bun run website:build`

---

## Resources & References

### Official Documentation

- **Bun**: https://bun.sh/docs
- **Vite**: https://vitejs.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Biome**: https://biomejs.dev/

### Web3 Libraries

- **viem**: https://viem.sh/
- **wagmi**: https://wagmi.sh/
- **Reown AppKit**: https://docs.reown.com/appkit/overview
- **Rhinestone**: https://docs.rhinestone.wtf/

### Frameworks

- **aelea**: https://github.com/nissoh/aelea
- **Ponder**: https://ponder.sh/
- **Drizzle ORM**: https://orm.drizzle.team/

### GMX Protocol

- **GMX Docs**: https://docs.gmx.io/
- **GMX V2 Contracts**: https://github.com/gmx-io/gmx-synthetics

### Internal Resources

- **Indexer Repo**: https://github.com/PuppetCopy/indexer
- **Contracts Repo**: https://github.com/PuppetCopy/contracts
- **Sequencer Repo**: https://github.com/PuppetCopy/sequencer

### Project-Specific Endpoints

- **Production Indexer**: https://indexer-production-1db7.up.railway.app/sql
- **Production Website**: https://puppet.house
- **Orchestrator (proxied)**: /api/orchestrator/*

---

## Quick Reference Commands

```bash
# Setup
bun install                          # Install dependencies
git submodule update --init --recursive  # Initialize submodules

# Development
cd website && bun run dev            # Start dev server
cd docs && bun run dev               # Start docs dev server

# Build
bun run middleware:build             # Build middleware
bun run website:build                # Build website
bun run docs:build                   # Build docs

# Code Quality
bun run biome:check                  # Check code quality
bun run biome:check:fix              # Auto-fix issues
bun run sherif                       # Check dependencies
bun run sherif:fix                   # Fix dependencies

# Maintenance
bun outdated --recursive             # Check outdated packages
bun audit                            # Security audit
git submodule update --remote        # Update submodules

# Docker
docker build -t puppet-website .     # Build website image
docker run -p 80:80 puppet-website   # Run container
```

---

## Contributing Guidelines

### Before Making Changes

1. **Pull latest changes** including submodules:
   ```bash
   git pull --recurse-submodules
   git submodule update --remote
   ```

2. **Run code quality checks**:
   ```bash
   bun run biome:check
   bun run sherif
   ```

3. **Ensure builds work**:
   ```bash
   bun run middleware:build
   bun run website:build
   ```

### Making Changes

1. **Follow naming conventions** ($ prefix for components)
2. **Use type imports** for types
3. **Add .js extensions** to relative imports
4. **Run Biome** before committing:
   ```bash
   bun run biome:check:fix
   ```

### Committing Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new trading feature"
git commit -m "fix: resolve wallet connection issue"
git commit -m "chore: update dependencies"

# Push to branch
git push origin your-branch-name
```

**Commit Message Conventions**:
- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance (deps, config, etc.)
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `style:` - Code style changes (formatting)
- `perf:` - Performance improvements

### License Compliance

Remember this project is dual-licensed (BSL-1.1 and GPL-3.0). Review `LICENSE.md` before contributing.

---

## Troubleshooting

### Build Failures

**Problem**: `Cannot find module '@puppet-copy/middleware'`

**Solution**: Build middleware first
```bash
cd middleware && bun run build
```

---

**Problem**: `Module not found: Can't resolve '@/ui-components'`

**Solution**: Check path aliases in `tsconfig.json` and restart TypeScript server

---

### Submodule Issues

**Problem**: `Submodule 'indexer' has modified content`

**Solution**: Decide if you want to keep or discard changes
```bash
# Discard changes (reset to committed reference)
git submodule update --force

# Or commit the new reference
git add indexer
git commit -m "chore: update indexer submodule"
```

---

**Problem**: Submodule is in detached HEAD state

**Solution**: This is normal for submodules. To update:
```bash
cd indexer
git checkout main
git pull origin main
cd ..
git add indexer
git commit -m "chore: update indexer submodule"
```

---

### Web3 Connection Issues

**Problem**: "User rejected the request"

**Solution**: User canceled wallet interaction. Ensure error handling:
```typescript
try {
  await writeContract(...)
} catch (error) {
  if (error.name === 'UserRejectedRequestError') {
    // Handle cancellation gracefully
  }
}
```

---

**Problem**: "Chain mismatch"

**Solution**: Prompt user to switch to Arbitrum:
```typescript
import { switchChain } from 'wagmi/actions'

await switchChain(config, { chainId: arbitrum.id })
```

---

### Dependency Issues

**Problem**: Sherif reports version mismatches

**Solution**: Fix automatically
```bash
bun run sherif:fix
bun install
```

---

**Problem**: `bun install` fails with "minimumReleaseAge" error

**Solution**: Package is too new (< 7 days old). Either:
1. Wait for release to mature
2. Override in `bunfig.toml`:
   ```toml
   [install]
   minimumReleaseAge = 0  # Disable protection temporarily
   ```

---

## Performance Tips

### 1. **Use Code Splitting for Large Imports**

```typescript
// ✅ GOOD - Lazy load heavy libraries
const $TradingView = lazy(() => import('./$TradingView'))

// ❌ BAD - Loads 500KB library upfront
import { $TradingView } from './$TradingView'
```

### 2. **Memoize Expensive Computations**

```typescript
import { memoize } from '@/utils/memoize'

const calculatePnL = memoize((position, price) => {
  // Expensive calculation
  return pnl
})
```

### 3. **Use WebSocket for Real-Time Data**

```typescript
// ✅ GOOD - WebSocket for subscriptions
const transport = webSocket('wss://arb1.arbitrum.io/ws')

// ❌ BAD - Polling with HTTP
setInterval(() => fetchData(), 1000)
```

### 4. **Batch Contract Reads**

```typescript
import { multicall } from 'viem/actions'

// ✅ GOOD - Single RPC call
const results = await multicall(client, {
  contracts: [
    { address: token1, abi: ERC20_ABI, functionName: 'balanceOf', args: [user] },
    { address: token2, abi: ERC20_ABI, functionName: 'balanceOf', args: [user] }
  ]
})

// ❌ BAD - Multiple RPC calls
const balance1 = await readContract(client, { ... })
const balance2 = await readContract(client, { ... })
```

---

## Security Considerations

### 1. **Never Commit Secrets**

```bash
# .gitignore includes:
.env
.env*.*
```

**Always use environment variables** for:
- API keys
- Private keys (NEVER in code)
- RPC endpoints with authentication
- Database credentials

### 2. **Validate User Input**

```typescript
import { isAddress } from 'viem'

// ✅ GOOD
if (!isAddress(userInput)) {
  throw new Error('Invalid address')
}

// ❌ BAD - Blindly trust user input
const balance = await getBalance(userInput)
```

### 3. **Use Type-Safe Contract Interactions**

```typescript
// ✅ GOOD - Type errors caught at compile time
await writeContract(client, {
  address: TOKEN_ADDRESS,
  abi: ERC20_ABI,
  functionName: 'transfer',  // Autocomplete works
  args: [recipient, amount]   // Type-checked
})

// ❌ BAD - No type safety
await client.request({
  method: 'eth_sendTransaction',
  params: [{ data: '0x...' }]  // Error-prone
})
```

### 4. **Sanitize Displayed Data**

```typescript
// ✅ GOOD - Validate before display
const displayAddress = isAddress(addr) ? addr : 'Invalid'

// ❌ BAD - XSS potential
innerHTML = userProvidedData
```

### 5. **Rate Limit API Calls**

```typescript
import { rateLimit } from '@/utils/rate-limit'

const fetchPrice = rateLimit(
  async (token) => fetch(`/api/price/${token}`),
  { maxCalls: 10, perMs: 1000 }
)
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run full build: `bun run middleware:build && bun run website:build`
- [ ] Check code quality: `bun run biome:check`
- [ ] Verify dependencies: `bun run sherif`
- [ ] Test in production mode: `bun run preview`
- [ ] Review environment variables (production values)
- [ ] Update submodule references if needed
- [ ] Test on Arbitrum testnet
- [ ] Verify PWA manifest and icons
- [ ] Check service worker caching strategy
- [ ] Review Docker image size
- [ ] Test wallet connections (multiple wallets)
- [ ] Verify API endpoints are reachable
- [ ] Check CORS configuration (if applicable)

### Post-Deployment

- [ ] Verify website loads correctly
- [ ] Test wallet connection
- [ ] Check indexer endpoint connectivity
- [ ] Monitor error logs
- [ ] Test critical user flows
- [ ] Verify PWA installation works
- [ ] Check performance metrics (Lighthouse)
- [ ] Test on mobile devices
- [ ] Verify social media previews (OpenGraph)

---

## AI Assistant Best Practices

### When Working with This Codebase

1. **Always check if middleware needs rebuilding** after contract changes
2. **Use the TodoWrite tool** for multi-step tasks
3. **Prefer editing existing files** over creating new ones
4. **Follow the $ naming convention** for components
5. **Use type imports** (`import type { ... }`) for types
6. **Add .js extensions** to relative imports
7. **Run Biome** before committing changes
8. **Test manually** (no automated tests exist)
9. **Ask user for clarification** on ambiguous requirements
10. **Document complex Web3 interactions** with comments

### Useful Search Patterns

```bash
# Find component definitions
rg '^\s*export const \$\w+' --type ts

# Find contract addresses
rg 'export const.*ADDRESS.*=' middleware/src/const/

# Find Web3 contract calls
rg 'writeContract|readContract' --type ts

# Find environment variable usage
rg 'import\.meta\.env\.' --type ts

# Find route definitions
rg 'path:.*\$component:' --type ts
```

### Code Generation Tips

When generating new code:
- **Match existing patterns** (use similar files as templates)
- **Use reactive streams** for state management
- **Type everything** (avoid `any`)
- **Export types separately** from values
- **Add JSDoc comments** for complex functions
- **Use const assertions** for literal objects

---

**End of CLAUDE.md**

> This document should be updated whenever significant architectural changes occur, new workspaces are added, or development workflows change.
