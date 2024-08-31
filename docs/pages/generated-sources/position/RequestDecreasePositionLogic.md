# RequestDecreasePositionLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/position/RequestDecreasePositionLogic.sol)

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
) CoreContract("RequestDecreasePositionLogic", "1", _authority, _eventEmitter);
```

### traderDecrease


```solidity
function traderDecrease(PositionUtils.TraderCallParams calldata traderCallParams, address user) external auth;
```

### proxyDecrease


```solidity
function proxyDecrease(PositionUtils.TraderCallParams calldata traderCallParams, address user) external auth;
```

### decrease


```solidity
function decrease(
    PositionStore.RequestAdjustment memory request,
    PositionStore.MirrorPosition memory mirrorPosition,
    PositionUtils.TraderCallParams calldata traderCallParams,
    Subaccount subaccount,
    address subaccountAddress
) internal;
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


## Errors
### RequestDecreasePositionLogic__SubaccountNotFound

```solidity
error RequestDecreasePositionLogic__SubaccountNotFound(address user);
```

## Structs
### Config

```solidity
struct Config {
    IGmxExchangeRouter gmxExchangeRouter;
    PositionStore positionStore;
    SubaccountStore subaccountStore;
    address gmxOrderReciever;
    address gmxOrderVault;
    bytes32 referralCode;
    uint callbackGasLimit;
}
```

