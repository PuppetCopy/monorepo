# GmxExecutionCallback
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/position/GmxExecutionCallback.sol)

**Inherits:**
CoreContract, IGmxOrderCallbackReceiver


## State Variables
### position

```solidity
MirrorPosition immutable position;
```


### unhandledCallbackListId

```solidity
uint public unhandledCallbackListId = 0;
```


### unhandledCallbackMap

```solidity
mapping(uint unhandledCallbackListSequenceId => UnhandledCallback) public unhandledCallbackMap;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, MirrorPosition _position) CoreContract(_authority);
```

### storeUnhandledCallback


```solidity
function storeUnhandledCallback(
    GmxPositionUtils.Props calldata _order,
    bytes32 _key,
    bytes calldata _eventData
) public auth;
```

### afterOrderExecution

Called after an order is executed.


```solidity
function afterOrderExecution(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata) external auth;
```

### afterOrderCancellation

Called after an order is cancelled.


```solidity
function afterOrderCancellation(
    bytes32 key,
    GmxPositionUtils.Props calldata order,
    bytes calldata eventData
) external auth;
```

### afterOrderFrozen

Called after an order is frozen.


```solidity
function afterOrderFrozen(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external auth;
```

## Structs
### UnhandledCallback

```solidity
struct UnhandledCallback {
    GmxPositionUtils.Props order;
    address operator;
    bytes eventData;
    bytes32 key;
}
```

