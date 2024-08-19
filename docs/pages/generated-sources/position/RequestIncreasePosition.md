# RequestIncreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/RequestIncreasePosition.sol)

**Inherits:**
Permission, EIP712, ReentrancyGuardTransient


## State Variables
### callConfig

```solidity
CallConfig callConfig;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, CallConfig memory _callConfig) Permission(_authority) EIP712("Increase Position", "1");
```

### proxyIncrease


```solidity
function proxyIncrease(PositionUtils.TraderCallParams calldata traderCallParams, address[] calldata puppetList, address user) external payable auth;
```

### traderIncrease


```solidity
function traderIncrease(PositionUtils.TraderCallParams calldata traderCallParams, address[] calldata puppetList, address user)
    external
    payable
    auth;
```

### increase


```solidity
function increase(
    PositionStore.RequestAdjustment memory request,
    PositionUtils.TraderCallParams calldata traderCallParams,
    address[] calldata puppetList,
    address subaccountAddress
) internal;
```

### matchUp


```solidity
function matchUp(
    PositionStore.RequestAdjustment memory request,
    MatchCallParams memory callParams,
    PositionUtils.TraderCallParams calldata traderCallParams,
    address[] calldata puppetList
) internal;
```

### adjust


```solidity
function adjust(
    PositionStore.RequestAdjustment memory request,
    PositionStore.MirrorPosition memory mirrorPosition,
    AdjustCallParams memory callParams,
    PositionUtils.TraderCallParams calldata traderCallParams
) internal;
```

### _createOrder


```solidity
function _createOrder(
    PositionStore.RequestAdjustment memory request,
    PositionUtils.TraderCallParams calldata traderCallParams,
    address subaccountAddress,
    bytes32 positionKey
) internal returns (bytes32 requestKey);
```

### _reducePuppetSizeDelta


```solidity
function _reducePuppetSizeDelta(
    PositionUtils.TraderCallParams calldata traderCallParams,
    address subaccountAddress,
    uint puppetReduceSizeDelta,
    bytes32 positionKey
) internal returns (bytes32 requestKey);
```

### setConfig


```solidity
function setConfig(CallConfig memory _callConfig) external auth;
```

### _setConfig


```solidity
function _setConfig(CallConfig memory _callConfig) internal;
```

## Events
### RequestIncreasePosition__SetConfig

```solidity
event RequestIncreasePosition__SetConfig(uint timestamp, CallConfig callConfig);
```

### RequestIncreasePosition__Match

```solidity
event RequestIncreasePosition__Match(
    address trader,
    address subaccount,
    bytes32 positionKey,
    bytes32 requestKey,
    uint transactionCost,
    address[] puppetList,
    uint[] puppetCollateralDeltaList
);
```

### RequestIncreasePosition__Adjust

```solidity
event RequestIncreasePosition__Adjust(
    address trader, address subaccount, bytes32 positionKey, bytes32 requestKey, uint transactionCost, uint[] puppetCollateralDeltaList
);
```

### RequestIncreasePosition__RequestReducePuppetSize

```solidity
event RequestIncreasePosition__RequestReducePuppetSize(address trader, address subaccount, bytes32 positionKey, bytes32 requestKey, uint sizeDelta);
```

## Errors
### RequestIncreasePosition__PuppetListLimitExceeded

```solidity
error RequestIncreasePosition__PuppetListLimitExceeded();
```

### RequestIncreasePosition__MatchRequestPending

```solidity
error RequestIncreasePosition__MatchRequestPending();
```

### RequestIncreasePosition__UnsortedPuppetList

```solidity
error RequestIncreasePosition__UnsortedPuppetList();
```

### RequestIncreasePosition__DuplicatesInPuppetList

```solidity
error RequestIncreasePosition__DuplicatesInPuppetList();
```

### RequestIncreasePosition__SenderNotMatchingTrader

```solidity
error RequestIncreasePosition__SenderNotMatchingTrader();
```

## Structs
### CallConfig

```solidity
struct CallConfig {
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
    PuppetStore.Rule[] ruleList;
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
    PuppetStore.Rule[] ruleList;
    uint[] activityList;
    uint[] depositList;
    uint puppetLength;
    uint sizeDeltaMultiplier;
    uint mpLeverage;
    uint mpTargetLeverage;
    uint puppetReduceSizeDelta;
}
```

