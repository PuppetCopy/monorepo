# GmxExecutionCallback
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e5748352ed9f301367f1ad7b3c58fa7a54733d2c/src/position/GmxExecutionCallback.sol)

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

### afterOrderExecution

Called after an order is executed.


```solidity
function afterOrderExecution(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata) external auth;
```

### afterOrderCancellation

Called after an order is cancelled.


```solidity
function afterOrderCancellation(bytes32 key, GmxPositionUtils.Props calldata, bytes calldata) external auth;
```

### afterOrderFrozen

Called after an order is frozen.


```solidity
function afterOrderFrozen(bytes32 key, GmxPositionUtils.Props calldata, bytes calldata) external auth;
```

### _storeUnhandledCallback


```solidity
function _storeUnhandledCallback(bytes32 _key, bytes memory error) internal;
```

## Structs
### UnhandledCallback

```solidity
struct UnhandledCallback {
    address operator;
    bytes32 key;
    bytes error;
}
```

