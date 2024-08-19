# ExecuteIncreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/ExecuteIncreasePosition.sol)

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

### increase


```solidity
function increase(bytes32 key, GmxPositionUtils.Props memory order) external auth;
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
}
```

