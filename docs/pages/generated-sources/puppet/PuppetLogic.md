# PuppetLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/puppet/PuppetLogic.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config config;
```


### store

```solidity
PuppetStore store;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    PuppetStore _store,
    Config memory _config
) CoreContract("PuppetLogic", "1", _authority, _eventEmitter);
```

### deposit


```solidity
function deposit(IERC20 token, address user, uint amount) external auth;
```

### withdraw


```solidity
function withdraw(IERC20 token, address user, address receiver, uint amount) external auth;
```

### setRule


```solidity
function setRule(
    IERC20 collateralToken,
    address puppet,
    address trader,
    PuppetStore.Rule calldata ruleParams
) external auth;
```

### setRuleList


```solidity
function setRuleList(
    address puppet,
    address[] calldata traderList,
    IERC20[] calldata collateralTokenList,
    PuppetStore.Rule[] calldata ruleParams
) external auth;
```

### _setRule


```solidity
function _setRule(
    PuppetStore.Rule memory storedRule,
    PuppetStore.Rule calldata ruleParams
) internal view returns (PuppetStore.Rule memory);
```

### isArrayContains


```solidity
function isArrayContains(IERC20[] memory array, IERC20 value) internal pure returns (bool);
```

### _validatePuppetTokenAllowanceList


```solidity
function _validatePuppetTokenAllowanceList(IERC20[] memory tokenList, address puppet) internal view;
```

### _validatePuppetTokenAllowance


```solidity
function _validatePuppetTokenAllowance(IERC20 token, address puppet) internal view returns (uint);
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
### PuppetLogic__InvalidAllowanceRate

```solidity
error PuppetLogic__InvalidAllowanceRate(uint min, uint max);
```

### PuppetLogic__ExpiredDate

```solidity
error PuppetLogic__ExpiredDate();
```

### PuppetLogic__NotFound

```solidity
error PuppetLogic__NotFound();
```

### PuppetLogic__TokenNotAllowed

```solidity
error PuppetLogic__TokenNotAllowed();
```

### PuppetLogic__AllowanceAboveLimit

```solidity
error PuppetLogic__AllowanceAboveLimit(uint allowanceCap);
```

### PuppetLogic__InvalidAmount

```solidity
error PuppetLogic__InvalidAmount();
```

### PuppetLogic__InsufficientBalance

```solidity
error PuppetLogic__InsufficientBalance();
```

## Structs
### Config

```solidity
struct Config {
    uint minExpiryDuration;
    uint minAllowanceRate;
    uint maxAllowanceRate;
}
```

