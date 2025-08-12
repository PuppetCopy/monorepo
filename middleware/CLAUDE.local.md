# Middleware Package - Contextual Memory

## Key Design Decisions

**Decimal Precision Standards**: USD always 30 decimals, ETH 18 decimals - inconsistency causes calculation errors across packages

**Type Safety**: Generated contract interfaces from ABIs ensure type-safe blockchain interactions

**Functional Utilities**: Pure functions only - no side effects in shared utilities

## Critical Implementation Gotchas

**GMX Price Format**: Uses `60 - externalDecimals - tokenDecimals` decimal precision - must convert correctly

**BigInt Everywhere**: Never use JavaScript numbers for calculations - precision loss inevitable

**Contract Deployments**: Single source of truth in `deployments.json` - must sync across all packages

## Shared Constants

**Fee Limits**: Keeper fee < 10% allocation, Platform fee 1%
**Position Limits**: $10 minimum, 100x max leverage
**Decimal Standards**: USD 30, ETH 18, USDC 6 decimals
