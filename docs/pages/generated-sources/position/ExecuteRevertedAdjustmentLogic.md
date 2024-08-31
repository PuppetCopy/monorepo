# ExecuteRevertedAdjustmentLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/position/ExecuteRevertedAdjustmentLogic.sol)

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
) CoreContract("ExecuteRevertedAdjustmentLogic", "1", _authority, _eventEmitter);
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

Set the mint rate limit for the token.


```solidity
function setConfig(Config calldata _config) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_config`|`Config`|The new rate limit configuration.|


### _setConfig

*Internal function to set the configuration.*


```solidity
function _setConfig(Config memory _config) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_config`|`Config`|The configuration to set.|


## Structs
### Config

```solidity
struct Config {
    string handlehandle;
}
```

