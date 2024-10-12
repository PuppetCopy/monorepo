# PuppetRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/PuppetRouter.sol)

**Inherits:**
CoreContract, ReentrancyGuardTransient


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
) CoreContract("PuppetRouter", "1", _authority, _eventEmitter);
```

### deposit


```solidity
function deposit(IERC20 token, uint amount) external nonReentrant;
```

### withdraw


```solidity
function withdraw(IERC20 token, address receiver, uint amount) external nonReentrant;
```

### setRule


```solidity
function setRule(IERC20 collateralToken, address trader, PuppetStore.AllocationRoundRule calldata ruleParams) external nonReentrant;
```

### setRuleList


```solidity
function setRuleList(
    PuppetStore.AllocationRoundRule[] calldata ruleParams,
    address[] calldata traderList,
    IERC20[] calldata collateralTokenList
) external nonReentrant;
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
### PuppetRouter__InvalidPuppet

```solidity
error PuppetRouter__InvalidPuppet();
```

### PuppetRouter__InvalidAllowance

```solidity
error PuppetRouter__InvalidAllowance();
```

## Structs
### Config

```solidity
struct Config {
    PuppetLogic logic;
}
```

