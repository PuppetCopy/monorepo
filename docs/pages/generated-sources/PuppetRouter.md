# PuppetRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/PuppetRouter.sol)

**Inherits:**
CoreContract, ReentrancyGuardTransient, Multicall


## State Variables
### config

```solidity
Config public config;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority
) CoreContract("PuppetRouter", "1", _authority);
```

### deposit


```solidity
function deposit(IERC20 token, uint amount) external nonReentrant;
```

### withdraw


```solidity
function withdraw(IERC20 token, address receiver, uint amount) external nonReentrant;
```

### setMatchRule


```solidity
function setMatchRule(
    IERC20 collateralToken,
    PuppetStore.MatchRule calldata ruleParams,
    address trader
) external nonReentrant;
```

### setMatchRuleList


```solidity
function setMatchRuleList(
    IERC20[] calldata collateralTokenList,
    address[] calldata traderList,
    PuppetStore.MatchRule[] calldata ruleParams
) external nonReentrant;
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
    PuppetLogic logic;
}
```

