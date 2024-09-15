# PositionRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/PositionRouter.sol)

**Inherits:**
CoreContract, ReentrancyGuardTransient, IGmxOrderCallbackReceiver


## State Variables
### config

```solidity
Config config;
```


### positionStore

```solidity
PositionStore positionStore;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    PositionStore _positionStore,
    Config memory _config
) CoreContract("PositionRouter", "1", _authority, _eventEmitter);
```

### requestTraderIncrease


```solidity
function requestTraderIncrease(
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList
) external nonReentrant;
```

### requestTraderDecrease


```solidity
function requestTraderDecrease(PositionUtils.OrderMirrorPosition calldata order) external nonReentrant;
```

### requestProxyIncrease


```solidity
function requestProxyIncrease(
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList,
    address user
) external nonReentrant auth;
```

### requestProxyDecrease


```solidity
function requestProxyDecrease(
    PositionUtils.OrderMirrorPosition calldata order,
    address user
) external nonReentrant auth;
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

### executeUnhandledExecutionCallback


```solidity
function executeUnhandledExecutionCallback(bytes32 key) external nonReentrant auth;
```

### setConfig

Set the mint rate limit for the token.


```solidity
function setConfig(Config calldata _config) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_config`|`Config`|The new rate limit configuration.|


### _setConfig

*Internal function to set the configuration.*


```solidity
function _setConfig(Config memory _config) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_config`|`Config`|The configuration to set.|


### storeUnhandledCallback


```solidity
function storeUnhandledCallback(
    GmxPositionUtils.OrderExecutionStatus status,
    GmxPositionUtils.Props calldata order,
    bytes32 key,
    bytes calldata eventData
) internal auth;
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
### Config

```solidity
struct Config {
    RequestIncreasePositionLogic requestIncrease;
    ExecuteIncreasePositionLogic executeIncrease;
    RequestDecreasePositionLogic requestDecrease;
    ExecuteDecreasePositionLogic executeDecrease;
    ExecuteRevertedAdjustmentLogic executeRevertedAdjustment;
}
```

