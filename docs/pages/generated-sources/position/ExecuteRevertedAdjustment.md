# ExecuteRevertedAdjustment
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/ExecuteRevertedAdjustment.sol)

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

### handleCancelled


```solidity
function handleCancelled(bytes32 key, GmxPositionUtils.Props memory order) external auth;
```

### handleFrozen


```solidity
function handleFrozen(bytes32 key, GmxPositionUtils.Props memory order) external auth;
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
### ExecuteRevertedAdjustment__SetConfig

```solidity
event ExecuteRevertedAdjustment__SetConfig(uint timestamp, CallConfig callConfig);
```

## Structs
### CallConfig

```solidity
struct CallConfig {
    string handlehandle;
}
```

