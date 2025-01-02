# RewardLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/tokenomics/RewardLogic.sol)

**Inherits:**
CoreContract

Manages the distribution of rewards based VotingEscrow Voting Power for token holders.

*This contract handles the logic for reward emissions based on voting power RewardStore for tracking reward
tracking and accruals*


## State Variables
### rewardToken
The contract used for minting rewards.


```solidity
IERC20 public immutable rewardToken;
```


### vToken
The token contract used for voting power


```solidity
IERC20 public immutable vToken;
```


### store
The RewardStore contract used for tracking reward accruals


```solidity
RewardStore immutable store;
```


### config
The configuration parameters for the RewardLogic


```solidity
Config public config;
```


## Functions
### getPendingEmission


```solidity
function getPendingEmission() public view returns (uint reward);
```

### getClaimable


```solidity
function getClaimable(
    address user
) external view returns (uint);
```

### constructor


```solidity
constructor(
    IAuthority _authority,
    IERC20 _rewardToken,
    IERC20 _vToken,
    RewardStore _store
) CoreContract("RewardLogic", "1", _authority);
```

### claim

Claims the accrued rewards for a user based on their voting power


```solidity
function claim(address user, address receiver, uint amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user to claim the rewards for|
|`receiver`|`address`|The address to receive the claimed rewards|
|`amount`|`uint256`|The amount of rewards to claim|


### userDistribute

Distributes the rewards to the users based on the current token emission rate and the time elapsed


```solidity
function userDistribute(
    address user
) public auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user to distribute the rewards for|


### distribute

Distributes the rewards to the users based on the current token emission rate and the time elapsed


```solidity
function distribute() public auth returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The updated cumulative reward per contribution state|


### getPendingReward


```solidity
function getPendingReward(
    uint cumulativeRewardPerToken,
    uint userCursor,
    uint userBalance
) internal pure returns (uint);
```

### transferReferralOwnership


```solidity
function transferReferralOwnership(
    IGmxReferralStorage _referralStorage,
    bytes32 _code,
    address _newOwner
) external auth;
```

### _setConfig

Set the mint rate limit for the token.


```solidity
function _setConfig(
    bytes calldata data
) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data`|`bytes`|The new rate limit configuration.|


## Structs
### Config
Struct to hold configuration parameters.


```solidity
struct Config {
    uint distributionTimeframe;
    BankStore distributionStore;
}
```

