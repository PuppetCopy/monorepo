# MatchingRule
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e5748352ed9f301367f1ad7b3c58fa7a54733d2c/src/position/MatchingRule.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config config;
```


### tokenAllowanceCapMap

```solidity
mapping(IERC20 token => uint) tokenAllowanceCapMap;
```


### matchingRuleMap

```solidity
mapping(bytes32 matchingKey => mapping(address puppet => Rule)) public matchingRuleMap;
```


### mirrorPosition

```solidity
MirrorPosition public immutable mirrorPosition;
```


### allocationStore

```solidity
AllocationStore public immutable allocationStore;
```


## Functions
### getRuleList


```solidity
function getRuleList(
    bytes32 _matchingKey,
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

