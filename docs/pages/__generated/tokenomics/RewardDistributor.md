# RewardDistributor
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e5748352ed9f301367f1ad7b3c58fa7a54733d2c/src/tokenomics/RewardDistributor.sol)

**Inherits:**
CoreContract


## State Variables
### rewardToken

```solidity
IERC20 public immutable rewardToken;
```


### vToken

```solidity
IERC20 public immutable vToken;
```


### store

```solidity
RewardStore public immutable store;
```


### config

```solidity
Config public config;
```


### cumulativeRewardPerToken

```solidity
uint public cumulativeRewardPerToken;
```


### totalUndistributed

```solidity
uint public totalUndistributed;
```


### lastDistributionTime

```solidity
uint public lastDistributionTime;
```


### userRewardMap

```solidity
mapping(address => UserRewards) public userRewardMap;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, IERC20 _rewardToken, IERC20 _vToken, RewardStore _store) CoreContract(_authority);
```

### pendingDistribution

Calculate currently available rewards for distribution.


```solidity
function pendingDistribution() public view returns (uint);
```

### claimable

Get claimable rewards for a user.


```solidity
function claimable(
    address _user
) external view returns (uint);
```

### deposit

Deposit new rewards into the system.


```solidity
function deposit(address _depositor, uint _amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_depositor`|`address`|The address depositing rewards.|
|`_amount`|`uint256`|Amount of reward tokens to deposit.|


### claim

Claim accrued rewards.


```solidity
function claim(address _user, address _receiver, uint _amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address whose rewards are claimed.|
|`_receiver`|`address`|The address receiving the rewards.|
|`_amount`|`uint256`|The amount of rewards to claim.|


### _distribute

*Internal distribution handler.*


```solidity
function _distribute() internal returns (uint);
```

### _calculatePendingRewardPerToken

*Calculate pending rewards between two checkpoints.*


```solidity
function _calculatePendingRewardPerToken(
    uint _userCheckpoint,
    uint _currentCumulative,
    uint _userBalance
) internal pure returns (uint);
```

### transferReferralOwnership

Update referral code ownership.


```solidity
function transferReferralOwnership(
    IGmxReferralStorage _referralStorage,
    bytes32 _code,
    address _newOwner
) external auth;
```

### _setConfig

Update contract configuration.

*Expects ABI-encoded data that decodes to a `Config` struct.*


```solidity
function _setConfig(
    bytes calldata _data
) internal override;
```

## Structs
### Config
Configuration parameters


```solidity
struct Config {
    uint distributionWindow;
}
```

### UserRewards
Reward tracking structure per user


```solidity
struct UserRewards {
    uint cumulativeRewardCheckpoint;
    uint accrued;
}
```

