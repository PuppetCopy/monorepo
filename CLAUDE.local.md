# Puppet Project Memory - Root Index

This is the root CLAUDE.md file that provides an overview of the Puppet project and links to package-specific documentation.

## Project Overview

Puppet is a copy trading platform where Puppets (Investors) pick and choose top traders to copy with a single deposit. The platform features a seamless matching engine that allows traders to operate normally, and provides risk management tools for puppets(investors) to build diversified portfolios.

**Key Features:**

- **Single Deposit, Many Traders**: One vault can copy multiple traders simultaneously
- **Seamless Matching Engine**: Traders trade as usual while part of puppet deposits mirror their positions  
- **Risk Management**: Set rules per trader to protect funds with proportional copying
- **Current Integration**: Built on GMX with plans to expand to other trading platforms

## Technology Stack

Bun monorepo throughout for monorepo management

### **IMPORTNT** Code as Documentation
Let implementation speak for itself. Focus on WHY decisions were made, not WHAT the code does.

**Document only:**
- Non-obvious design decisions and their rationale
- Implementation gotchas discovered during debugging  
- Key architectural patterns that aren't apparent from code structure
- Performance constraints and optimization discoveries

### Code Quality
- **Clear naming** - Self-explanatory functions and variables
- **Visual hierarchy** - Use whitespace to group related logic
- **Minimal comments** - Only for complex business logic
- **Remove clutter** - Focus on essential logic

## Package Structure

### [/contracts/](./contracts/CLAUDE.local.md) - Smart Contract Core

**Key Design Decisions**:

- Proxy pattern via Clones for gas-efficient allocation accounts
- Separation of logic (MirrorPosition) from storage (AllocationStore) for security
- GMX callback integration for asynchronous order execution

---

### [/sequencer/](./sequencer/CLAUDE.local.md) - Automated Execution Service

**Key Design Decisions**:

- Reactive programming using @most/core streams for real-time processing
- Empirically-tested gas constants for cost optimization
- Multi-puppet batch processing with insolvency handling

---

### [/middleware/](./middleware/CLAUDE.local.md) - Shared TypeScript Library

**Key Design Decisions**:

- Decimal precision handling (30 decimals for USD, 18 for ETH) for consistency
- Type-safe contract interfaces generated from ABIs

---

### [/indexer/](./indexer/CLAUDE.local.md) - Blockchain Data Indexing

**Key Design Decisions**:

- Junction table pattern (`puppetPosition`) for many-to-many puppet-position relationships
- Central reference keys (`allocationAddress`, `traderRequestKey`) for event correlation
- Parse `CallAllocation` struct to extract individual puppet addresses

---

### [/website/](./website/CLAUDE.local.md) - Progressive Web App Frontend

**Key Design Decisions**:

- Aelea/core framework for reactive UI patterns
- Aelea/stream @most/core based reactive streams
- PWA capabilities for mobile-first experience

