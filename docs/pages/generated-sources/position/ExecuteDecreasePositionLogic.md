# ExecuteDecreasePositionLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/position/ExecuteDecreasePositionLogic.sol)

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
) CoreContract("ExecuteDecreasePositionLogic", "1", _authority, _eventEmitter);
```

### execute


```solidity
function execute(bytes32 requestKey, GmxPositionUtils.Props calldata order, bytes calldata eventData) external auth;
```

### getDistribution


```solidity
function getDistribution(
    uint performanceFeeRate,
    uint traderPerformanceFeeShare,
    uint totalProfit,
    uint amountOut,
    uint totalAmountOut
) internal pure returns (uint performanceFee, uint traderPerformanceCutoffFee, uint amountOutAfterFee);
```

### setConfig


```solidity
function setConfig(Config memory _config) external auth;
```

### _setConfig


```solidity
function _setConfig(Config memory _config) internal;
```

## Errors
### ExecuteDecreasePositionLogic__InvalidRequest

```solidity
error ExecuteDecreasePositionLogic__InvalidRequest(bytes32 positionKey, bytes32 key);
```

### ExecuteDecreasePositionLogic__UnexpectedEventData

```solidity
error ExecuteDecreasePositionLogic__UnexpectedEventData();
```

## Structs
### Config

```solidity
struct Config {
    Router router;
    PositionStore positionStore;
    PuppetStore puppetStore;
    ContributeStore contributeStore;
    address gmxOrderReciever;
    uint performanceFeeRate;
    uint traderPerformanceFeeShare;
}
```

### CallParams

```solidity
struct CallParams {
    uint totalAmountOut;
    uint profit;
    uint totalPerformanceFee;
    uint traderPerformanceCutoffFee;
}
```

