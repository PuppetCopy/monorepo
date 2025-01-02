# PuppetLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/puppet/PuppetLogic.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config public config;
```


### store

```solidity
PuppetStore immutable store;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, PuppetStore _store) CoreContract("PuppetLogic", "1", _authority);
```

### deposit


```solidity
function deposit(IERC20 collateralToken, address user, uint amount) external auth;
```

### withdraw


```solidity
function withdraw(IERC20 collateralToken, address user, address receiver, uint amount) external auth;
```

### setMatchRule


```solidity
function setMatchRule(
    IERC20 collateralToken,
    PuppetStore.MatchRule calldata ruleParams,
    address puppet,
    address trader
) external auth;
```

### setMatchRuleList


```solidity
function setMatchRuleList(
    IERC20[] calldata collateralTokenList,
    address[] calldata traderList,
    PuppetStore.MatchRule[] calldata ruleParamList,
    address puppet
) external auth;
```

### validatePuppetTokenAllowance


```solidity
function validatePuppetTokenAllowance(IERC20 token, address puppet, uint deltaAmount) internal view returns (uint);
```

### _validateRuleParams


```solidity
function _validateRuleParams(
    PuppetStore.MatchRule memory ruleParams
) internal view;
```

### _setConfig

Sets the configuration parameters for the PuppetLogic contract.

*Emits a SetConfig event upon successful execution*


```solidity
function _setConfig(
    bytes calldata data
) internal override;
```

## Structs
### Config

```solidity
struct Config {
    uint minExpiryDuration;
    uint minAllowanceRate;
    uint maxAllowanceRate;
    uint minAllocationActivity;
    uint maxAllocationActivity;
    IERC20[] tokenAllowanceList;
    uint[] tokenAllowanceAmountList;
}
```

