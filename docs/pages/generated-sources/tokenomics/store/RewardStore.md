# RewardStore
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/store/RewardStore.sol)

**Inherits:**
BankStore


## State Variables
### cumulativeRewardPerToken

```solidity
uint public cumulativeRewardPerToken;
```


### userRewardCursorMap

```solidity
mapping(address user => UserRewardCursor) userRewardCursorMap;
```


### rewardRate

```solidity
uint public rewardRate;
```


### lastDistributionTimestamp

```solidity
uint public lastDistributionTimestamp;
```


### emissionRate

```solidity
EmissionRate public emissionRate;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, Router _router) BankStore(_authority, _router);
```

### incrementCumulativePerContribution


```solidity
function incrementCumulativePerContribution(uint _value) external auth returns (uint);
```

### getUserRewardCursor


```solidity
function getUserRewardCursor(address _user) external view returns (UserRewardCursor memory);
```

### setUserRewardCursor


```solidity
function setUserRewardCursor(address _user, UserRewardCursor calldata cursor) external auth;
```

### setRewardRate


```solidity
function setRewardRate(uint _value) external auth;
```

### setLastDistributionTimestamp


```solidity
function setLastDistributionTimestamp(uint _value) external auth;
```

### setEmissionRate


```solidity
function setEmissionRate(EmissionRate calldata _value) external auth;
```

### getEmissionRate


```solidity
function getEmissionRate() external view returns (EmissionRate memory);
```

## Structs
### UserRewardCursor

```solidity
struct UserRewardCursor {
    uint rewardPerToken;
    uint accruedReward;
}
```

### EmissionRate

```solidity
struct EmissionRate {
    uint twa;
    uint timestamp;
}
```

