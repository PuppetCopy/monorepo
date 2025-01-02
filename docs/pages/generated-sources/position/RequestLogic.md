# RequestLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/position/RequestLogic.sol)

**Inherits:**
CoreContract


## State Variables
### puppetStore

```solidity
PuppetStore immutable puppetStore;
```


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
constructor(
    IAuthority _authority,
    PuppetStore _puppetStore,
    PositionStore _positionStore
) CoreContract("RequestLogic", "1", _authority);
```

### submitOrder


```solidity
function submitOrder(
    MirrorPositionParams calldata order,
    Subaccount subaccount,
    PositionStore.RequestAdjustment memory request,
    GmxPositionUtils.OrderType orderType,
    uint collateralDelta,
    uint callbackGasLimit
) internal returns (bytes32 requestKey);
```

### getTargetLeverage


```solidity
function getTargetLeverage(
    uint size,
    uint collateral,
    uint sizeDeltaInUsd,
    uint collateralDelta,
    bool isIncrease
) internal pure returns (uint);
```

### adjust


```solidity
function adjust(
    MirrorPositionParams calldata params,
    PositionStore.RequestAdjustment memory request,
    PuppetStore.Allocation memory allocation,
    Subaccount subaccount
) internal returns (bytes32 requestKey);
```

### mirror


```solidity
function mirror(
    MirrorPositionParams calldata params
) external payable auth returns (bytes32 requestKey);
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
    IGmxExchangeRouter gmxExchangeRouter;
    IGmxDatastore gmxDatastore;
    address callbackHandler;
    address gmxFundsReciever;
    address gmxOrderVault;
    bytes32 referralCode;
    uint increaseCallbackGasLimit;
    uint decreaseCallbackGasLimit;
}
```

### MirrorPositionParams

```solidity
struct MirrorPositionParams {
    IERC20 collateralToken;
    bytes32 sourceRequestKey;
    bytes32 allocationKey;
    address trader;
    address market;
    bool isIncrease;
    bool isLong;
    uint executionFee;
    uint collateralDelta;
    uint sizeDeltaInUsd;
    uint acceptablePrice;
    uint triggerPrice;
}
```

