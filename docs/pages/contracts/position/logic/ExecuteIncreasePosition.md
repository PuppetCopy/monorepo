# ExecuteIncreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/86f5edc5c43c92874fd3cadff78422e25e3cc674/src/position/logic/ExecuteIncreasePosition.sol)


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

