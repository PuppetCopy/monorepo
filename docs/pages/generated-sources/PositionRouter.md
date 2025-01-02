# PositionRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/PositionRouter.sol)

**Inherits:**
CoreContract, ReentrancyGuardTransient, IGmxOrderCallbackReceiver, Multicall


## State Variables
### positionStore

```solidity
PositionStore immutable positionStore;
```


### config

```solidity
Config public config;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, PositionStore _positionStore) CoreContract("PositionRouter", "1", _authority);
```

### afterOrderExecution


```solidity
function afterOrderExecution(
    bytes32 key,
    GmxPositionUtils.Props calldata order,
    bytes calldata eventData
) external nonReentrant auth;
```

### afterOrderCancellation


```solidity
function afterOrderCancellation(
    bytes32 key,
    GmxPositionUtils.Props calldata order,
    bytes calldata eventData
) external nonReentrant auth;
```

### afterOrderFrozen


```solidity
function afterOrderFrozen(
    bytes32 key,
    GmxPositionUtils.Props calldata order,
    bytes calldata eventData
) external nonReentrant auth;
```

### allocate


```solidity
function allocate(
    IERC20 collateralToken,
    bytes32 sourceRequestKey,
    bytes32 positionKey,
    bytes32 matchKey,
    address[] calldata puppetList
) external nonReentrant auth returns (bytes32 allocationKey);
```

### mirror


```solidity
function mirror(
    RequestLogic.MirrorPositionParams calldata params
) external payable nonReentrant auth returns (bytes32 requestKey);
```

### settle


```solidity
function settle(bytes32 key, address[] calldata puppetList) external nonReentrant auth;
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
    RequestLogic requestLogic;
    AllocationLogic allocationLogic;
    ExecutionLogic executionLogic;
    UnhandledCallbackLogic unhandledCallbackLogic;
}
```

