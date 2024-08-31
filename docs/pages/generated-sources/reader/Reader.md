# Reader
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/reader/Reader.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config public config;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    Config memory _config
) CoreContract("RewardLogic", "1", _authority, _eventEmitter);
```

### calculateAPR


```solidity
function calculateAPR() public view returns (uint apr);
```

### setConfig


```solidity
function setConfig(Config calldata _config) external auth;
```

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
    RewardStore rewardStore;
    PuppetToken puppetToken;
    RewardRouter rewardRouter;
    ContributeStore contributeStore;
    RewardLogic rewardLogic;
}
```

