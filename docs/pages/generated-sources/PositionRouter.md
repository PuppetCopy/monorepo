# PositionRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/PositionRouter.sol)

**Inherits:**
Permission, EIP712, ReentrancyGuardTransient, IGmxOrderCallbackReceiver


## State Variables
### callConfig

```solidity
CallConfig callConfig;
```


### positionStore

```solidity
PositionStore positionStore;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, PositionStore _positionStore, CallConfig memory _callConfig)
    Permission(_authority)
    EIP712("Position Router", "1");
```

### requestTraderIncrease


```solidity
function requestTraderIncrease(PositionUtils.TraderCallParams calldata traderCallParams, address[] calldata puppetList) external nonReentrant;
```

### requestTraderDecrease


```solidity
function requestTraderDecrease(PositionUtils.TraderCallParams calldata traderCallParams) external nonReentrant;
```

### requestProxyIncrease


```solidity
function requestProxyIncrease(PositionUtils.TraderCallParams calldata traderCallParams, address[] calldata puppetList, address user)
    external
    nonReentrant
    auth;
```

### requestProxyDecrease


```solidity
function requestProxyDecrease(PositionUtils.TraderCallParams calldata traderCallParams, address user) external nonReentrant auth;
```

### afterOrderExecution


```solidity
function afterOrderExecution(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external nonReentrant auth;
```

### afterOrderCancellation


```solidity
function afterOrderCancellation(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external nonReentrant auth;
```

### afterOrderFrozen


```solidity
function afterOrderFrozen(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external nonReentrant auth;
```

### executeUnhandledExecutionCallback


```solidity
function executeUnhandledExecutionCallback(bytes32 key) external nonReentrant auth;
```

### setConfig


```solidity
function setConfig(CallConfig memory _callConfig) external auth;
```

### storeUnhandledCallback


```solidity
function storeUnhandledCallback(
    GmxPositionUtils.OrderExecutionStatus status,
    GmxPositionUtils.Props calldata order,
    bytes32 key,
    bytes calldata eventData
) internal auth;
```

### _setConfig


```solidity
function _setConfig(CallConfig memory _callConfig) internal;
```

## Events
### PositionRouter__SetConfig

```solidity
event PositionRouter__SetConfig(uint timestamp, CallConfig callConfig);
```

### PositionRouter__UnhandledCallback

```solidity
event PositionRouter__UnhandledCallback(GmxPositionUtils.OrderExecutionStatus status, bytes32 key, GmxPositionUtils.Props order, bytes eventData);
```

## Errors
### PositionRouter__InvalidOrderType

```solidity
error PositionRouter__InvalidOrderType(GmxPositionUtils.OrderType orderType);
```

### PositionRouter__SenderNotMatchingTrader

```solidity
error PositionRouter__SenderNotMatchingTrader();
```

## Structs
### CallConfig

```solidity
struct CallConfig {
    RequestIncreasePosition requestIncrease;
    ExecuteIncreasePosition executeIncrease;
    RequestDecreasePosition requestDecrease;
    ExecuteDecreasePosition executeDecrease;
    ExecuteRevertedAdjustment executeRevertedAdjustment;
}
```

