# MVP Todo List

## 1. Rhinestone Wallet Creation
- When user visits wallet on website, create Rhinestone wallet in background
- Include TraderSubaccountHook module to be installed with wallet
- First transaction (router.allocate()) triggers wallet creation
- Ref: https://docs.rhinestone.dev/smart-wallet/core/create-first-transaction

## 2. Puppet Matching on Website
- Puppet deposits via `contracts/src/position/Account.sol`
- Matchmaking done through SDK
- Port functionality from `matchmaker/src/source/subscribeRule.ts` to website
- Website stores matched puppets for trader display in wallet
- Stored list used later for trader to call allocate

## 3. E2E Testing (Later)
- Full e2e live test after refining all components
- Not needed yet

---

## Current Focus: Indexer
- Update indexer to index and aggregate positions
