# AllocationLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/position/AllocationLogic.sol)

**Inherits:**
CoreContract


## State Variables
### positionStore

```solidity
PositionStore immutable positionStore;
```


### puppetStore

```solidity
PuppetStore immutable puppetStore;
```


### contributeStore

```solidity
ContributeStore immutable contributeStore;
```


### config

```solidity
Config public config;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    ContributeStore _contributeStore,
    PuppetStore _puppetStore,
    PositionStore _positionStore
) CoreContract("AllocationLogic", "1", _authority);
```

### allocate


```solidity
function allocate(
    IERC20 collateralToken,
    bytes32 sourceRequestKey,
    bytes32 matchKey,
    bytes32 positionKey,
    address[] calldata puppetList
) external auth returns (bytes32 allocationKey);
```

### settle


```solidity
function settle(bytes32 allocationKey, address[] calldata puppetList) external auth;
```

### _setConfig


```solidity
function _setConfig(
    bytes calldata data
) internal override;
```

## Structs
### Config

```solidity
struct Config {
    uint limitAllocationListLength;
    uint performanceContributionRate;
    uint traderPerformanceContributionShare;
}
```

