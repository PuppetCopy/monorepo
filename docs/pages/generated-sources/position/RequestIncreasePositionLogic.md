# RequestIncreasePositionLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/position/RequestIncreasePositionLogic.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config config;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    Config memory _config
) CoreContract("RequestIncreasePositionLogic", "1", _authority, _eventEmitter);
```

### proxyIncrease


```solidity
function proxyIncrease(
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList,
    address user
) external payable auth;
```

### traderIncrease


```solidity
function traderIncrease(
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList,
    address user
) external payable auth;
```

### increase


```solidity
function increase(
    PositionStore.RequestAdjustment memory request,
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList,
    address subaccountAddress
) internal;
```

### matchUp


```solidity
function matchUp(
    PositionStore.RequestAdjustment memory request,
    MatchCallParams memory callParams,
    PositionUtils.OrderMirrorPosition calldata order,
    address[] calldata puppetList
) internal;
```

### adjust


```solidity
function adjust(
    PositionStore.RequestAdjustment memory request,
    PositionStore.MirrorPosition memory mirrorPosition,
    AdjustCallParams memory callParams,
    PositionUtils.OrderMirrorPosition calldata order
) internal;
```

### _createOrder


```solidity
function _createOrder(
    PositionStore.RequestAdjustment memory request,
    PositionUtils.OrderMirrorPosition calldata order,
    address subaccountAddress
) internal returns (bytes32 requestKey);
```

### _reducePuppetSizeDelta


```solidity
function _reducePuppetSizeDelta(
    PositionUtils.OrderMirrorPosition calldata order,
    address subaccountAddress,
    uint puppetReduceSizeDelta,
    bytes32 positionKey
) internal returns (bytes32 requestKey);
```

### setConfig


```solidity
function setConfig(Config memory _config) public auth;
```

## Errors
### RequestIncreasePositionLogic__PuppetListLimitExceeded

```solidity
error RequestIncreasePositionLogic__PuppetListLimitExceeded();
```

### RequestIncreasePositionLogic__MatchRequestPending

```solidity
error RequestIncreasePositionLogic__MatchRequestPending();
```

### RequestIncreasePositionLogic__UnsortedPuppetList

```solidity
error RequestIncreasePositionLogic__UnsortedPuppetList();
```

### RequestIncreasePositionLogic__DuplicatesInPuppetList

```solidity
error RequestIncreasePositionLogic__DuplicatesInPuppetList();
```

### RequestIncreasePositionLogic__SenderNotMatchingTrader

```solidity
error RequestIncreasePositionLogic__SenderNotMatchingTrader();
```

## Structs
### Config

```solidity
struct Config {
    IWNT wnt;
    IGmxExchangeRouter gmxExchangeRouter;
    Router router;
    SubaccountStore subaccountStore;
    PositionStore positionStore;
    PuppetStore puppetStore;
    address gmxOrderReciever;
    address gmxOrderVault;
    bytes32 referralCode;
    uint callbackGasLimit;
    uint limitPuppetList;
    uint minimumMatchAmount;
    uint tokenTransferGasLimit;
}
```

### MatchCallParams

```solidity
struct MatchCallParams {
    address subaccountAddress;
    PuppetStore.AllocationRule[] ruleList;
    uint[] activityList;
    uint[] balanceList;
    uint puppetLength;
    uint sizeDeltaMultiplier;
}
```

### AdjustCallParams

```solidity
struct AdjustCallParams {
    address subaccountAddress;
    PuppetStore.AllocationRule[] ruleList;
    uint[] activityList;
    uint[] depositList;
    uint puppetLength;
    uint sizeDeltaMultiplier;
    uint mpLeverage;
    uint mpTargetLeverage;
    uint puppetReduceSizeDelta;
}
```

