# ExecuteIncreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/logic/ExecuteIncreasePosition.sol)


## Functions
### increase


```solidity
function increase(CallConfig memory callConfig, bytes32 key, GmxPositionUtils.Props memory order) external;
```

## Errors
### ExecuteIncreasePosition__UnauthorizedCaller

```solidity
error ExecuteIncreasePosition__UnauthorizedCaller();
```

## Structs
### CallConfig

```solidity
struct CallConfig {
    PositionStore positionStore;
    address gmxOrderHandler;
}
```

