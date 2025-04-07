# MatchRule
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/position/MatchRule.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config public config;
```


### tokenAllowanceCapMap

```solidity
mapping(IERC20 token => uint) tokenAllowanceCapMap;
```


### matchRuleMap

```solidity
mapping(bytes32 matchKey => mapping(address puppet => Rule)) public matchRuleMap;
```


### mirrorPosition

```solidity
MirrorPosition immutable mirrorPosition;
```


### allocationStore

```solidity
AllocationStore immutable allocationStore;
```


## Functions
### getRuleList


```solidity
function getRuleList(
    bytes32 _matchKey,
    address[] calldata _puppetList
) external view returns (Rule[] memory _ruleList);
```

### constructor


```solidity
constructor(IAuthority _authority, AllocationStore _store, MirrorPosition _mirrorPosition) CoreContract(_authority);
```

### deposit


```solidity
function deposit(IERC20 _collateralToken, address _user, uint _amount) external auth;
```

### withdraw


```solidity
function withdraw(IERC20 _collateralToken, address _user, address _receiver, uint _amount) external auth;
```

### setRule


```solidity
function setRule(IERC20 _collateralToken, address _user, address _trader, Rule calldata _ruleParams) external auth;
```

### _setConfig

Sets the configuration parameters via governance

*Emits a SetConfig event upon successful execution*


```solidity
function _setConfig(
    bytes calldata _data
) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_data`|`bytes`|The encoded configuration data|


## Structs
### Rule

```solidity
struct Rule {
    uint allowanceRate;
    uint throttleActivity;
    uint expiry;
}
```

### Config

```solidity
struct Config {
    IERC20[] tokenAllowanceList;
    uint[] tokenAllowanceCapList;
    uint minExpiryDuration;
    uint minAllowanceRate;
    uint maxAllowanceRate;
    uint minActivityThrottle;
    uint maxActivityThrottle;
}
```

