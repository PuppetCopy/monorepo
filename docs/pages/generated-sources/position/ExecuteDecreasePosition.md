# ExecuteDecreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/ExecuteDecreasePosition.sol)

**Inherits:**
Permission, EIP712


## State Variables
### callConfig

```solidity
CallConfig callConfig;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, CallConfig memory _callConfig) Permission(_authority) EIP712("Position Router", "1");
```

### decrease


```solidity
function decrease(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external auth;
```

### _decrease


```solidity
function _decrease(GmxPositionUtils.Props calldata order, CallParams memory callParams, PositionStore.RequestAdjustment memory request) internal;
```

### getDistribution


```solidity
function getDistribution(uint performanceFeeRate, uint traderPerformanceFeeShare, uint totalProfit, uint amountOut, uint totalAmountOut)
    internal
    pure
    returns (uint performanceFee, uint traderPerformanceCutoffFee, uint amountOutAfterFee);
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
### ExecuteIncreasePosition__SetConfig

```solidity
event ExecuteIncreasePosition__SetConfig(uint timestamp, CallConfig callConfig);
```

### ExecuteDecreasePosition__DecreasePosition

```solidity
event ExecuteDecreasePosition__DecreasePosition(
    bytes32 requestKey, bytes32 positionKey, uint totalAmountOut, uint profit, uint totalPerformanceFee, uint traderPerformanceCutoffFee
);
```

## Errors
### ExecutePosition__InvalidRequest

```solidity
error ExecutePosition__InvalidRequest(bytes32 positionKey, bytes32 key);
```

### ExecutePosition__UnexpectedEventData

```solidity
error ExecutePosition__UnexpectedEventData();
```

## Structs
### CallConfig

```solidity
struct CallConfig {
    Router router;
    PositionStore positionStore;
    PuppetStore puppetStore;
    RevenueStore revenueStore;
    address gmxOrderReciever;
    uint performanceFeeRate;
    uint traderPerformanceFeeShare;
}
```

### CallParams

```solidity
struct CallParams {
    PositionStore.MirrorPosition mirrorPosition;
    bytes32 positionKey;
    bytes32 requestKey;
    address positionRouterAddress;
    IERC20 outputToken;
    uint puppetListLength;
    uint totalAmountOut;
    uint profit;
}
```

