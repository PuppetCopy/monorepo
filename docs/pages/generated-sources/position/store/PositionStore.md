# PositionStore
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/position/store/PositionStore.sol)

**Inherits:**
BankStore


## State Variables
### routeSubaccountMap

```solidity
mapping(bytes32 matchKey => Subaccount) routeSubaccountMap;
```


### routeTokenMap

```solidity
mapping(bytes32 matchKey => IERC20) routeTokenMap;
```


### requestAdjustmentMap

```solidity
mapping(bytes32 requestKey => RequestAdjustment) public requestAdjustmentMap;
```


### unhandledCallbackListId

```solidity
uint unhandledCallbackListId = 0;
```


### unhandledCallbackMap

```solidity
mapping(uint unhandledCallbackListSequenceId => UnhandledCallback) public unhandledCallbackMap;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, Router _router) BankStore(_authority, _router);
```

### getRequestAdjustment


```solidity
function getRequestAdjustment(
    bytes32 _key
) external view returns (RequestAdjustment memory);
```

### setRequestAdjustment


```solidity
function setRequestAdjustment(bytes32 _key, RequestAdjustment calldata _ra) external auth;
```

### removeRequestAdjustment


```solidity
function removeRequestAdjustment(
    bytes32 _key
) external auth;
```

### removeRequestDecrease


```solidity
function removeRequestDecrease(
    bytes32 _key
) external auth;
```

### setUnhandledCallbackList


```solidity
function setUnhandledCallbackList(
    GmxPositionUtils.Props calldata _order,
    address _operator,
    bytes32 _key,
    bytes calldata _eventData
) external auth returns (uint);
```

### getUnhandledCallback


```solidity
function getUnhandledCallback(
    uint _id
) external view returns (UnhandledCallback memory);
```

### removeUnhandledCallback


```solidity
function removeUnhandledCallback(
    uint _id
) external auth;
```

### getSubaccount


```solidity
function getSubaccount(
    bytes32 _key
) external view returns (Subaccount);
```

### createSubaccount


```solidity
function createSubaccount(bytes32 _key, address _account) external auth returns (Subaccount);
```

## Structs
### RequestAdjustment

```solidity
struct RequestAdjustment {
    bytes32 allocationKey;
    bytes32 sourceRequestKey;
    bytes32 matchKey;
    uint sizeDelta;
    uint transactionCost;
}
```

### UnhandledCallback

```solidity
struct UnhandledCallback {
    GmxPositionUtils.Props order;
    address operator;
    bytes eventData;
    bytes32 key;
}
```

