# RewardLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/tokenomics/RewardLogic.sol)

**Inherits:**
Permission, EIP712, ReentrancyGuardTransient

Manages the distribution of rewards within the protocol, including locking mechanisms and bonus multipliers for token holders.

*This contract handles the logic for reward emissions, locking tokens for voting power, and distributing rewards to token holders.
It integrates with VotingEscrow for locking mechanisms, PuppetToken for minting rewards, RewardStore for tracking reward accruals, and
RevenueStore for managing revenue balances.*


## State Variables
### config
The configuration parameters for the RewardLogic.


```solidity
Config public config;
```


### votingEscrow
The VotingEscrow contract used for locking tokens.


```solidity
VotingEscrow public immutable votingEscrow;
```


### puppetToken
The PuppetToken contract used for minting rewards.


```solidity
PuppetToken public immutable puppetToken;
```


### store
The RewardStore contract used for tracking reward accruals.


```solidity
RewardStore public immutable store;
```


### revenueStore
The RevenueStore contract used for managing revenue balances.


```solidity
RevenueStore public immutable revenueStore;
```


## Functions
### getClaimableEmission


```solidity
function getClaimableEmission(IERC20 token, address user) public view returns (uint);
```

### getBonusReward


```solidity
function getBonusReward(uint durationBonusMultiplier, uint reward, uint duration) public view returns (uint);
```

### constructor


```solidity
constructor(
    IAuthority _authority,
    VotingEscrow _votingEscrow,
    PuppetToken _puppetToken,
    RewardStore _store,
    RevenueStore _revenueStore,
    Config memory _callConfig
) Permission(_authority) EIP712("Reward Logic", "1");
```

### lock

Locks tokens to participate in reward distribution and increases voting power in the VotingEscrow.

*Mints reward tokens based on the user's contribution balance and the specified duration, then locks these tokens.
Emits a `RewardLogic__Lock` event upon successful locking of tokens.*


```solidity
function lock(IERC20 token, uint duration) public nonReentrant returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token to be locked.|
|`duration`|`uint256`|The duration for which the tokens should be locked.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|rewardInToken The amount of reward tokens minted and locked for the user.|


### exit

Allows a user to exit their locked position and claim rewards.

*This function calculates the user's pending reward based on the baseline emission rate and their contribution balance.
It then resets the user's contribution balance and updates the token per contribution cursor for the user.
Finally, it mints the reward tokens to the contract itself and emits an event.*


```solidity
function exit(IERC20 token) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token that the user is exiting from.|


### lockToken

Locks liquid tokens for a user for a given duration, applying a bonus multiplier.

*Mints the specified amount of tokens to this contract and then locks them in the VotingEscrow contract.
The reward after applying the bonus multiplier is returned but not minted or distributed.*


```solidity
function lockToken(address user, uint unlockDuration, uint amount) external nonReentrant returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user for whom the tokens will be locked.|
|`unlockDuration`|`uint256`|The duration in seconds for which the tokens will be locked.|
|`amount`|`uint256`|The amount of tokens to lock.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|rewardAfterMultiplier The amount of reward after applying the lockLiquidTokensBonusMultiplier.|


### vestTokens

Allows a user to vest their tokens.

*This function calls the `vest` function on the VotingEscrow contract, vesting the specified amount of tokens for the caller.*


```solidity
function vestTokens(uint amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of tokens to be vested by the caller.|


### veClaim

Allows a user to claim vested tokens on behalf of another user.

*This function calls the `claim` function on the VotingEscrow contract, allowing the caller to claim tokens on behalf of the specified
user.*


```solidity
function veClaim(address receiver, uint amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address where the claimed tokens should be sent.|
|`amount`|`uint256`|The amount of tokens to claim.|


### claimEmission

Claims emission rewards for the caller and sends them to the specified receiver.

*Calculates the claimable rewards for the caller based on the current reward cursor and the user's balance in the VotingEscrow contract.
If the reward is non-zero, it updates the user's emission cursor, sets their accrued reward to zero, and transfers the reward to the receiver.*


```solidity
function claimEmission(IERC20 token, address receiver) public nonReentrant returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token for which rewards are being claimed.|
|`receiver`|`address`|The address where the claimed rewards should be sent.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|reward The amount of rewards claimed.|


### distributeEmission

Distributes emission rewards for a given token based on the time elapsed and the token's emission rate.

*Calculates the emission rewards since the last distribution, updates the token's emission rate if necessary, and increases the reward per
token cursor.
If the emission or token balance is zero, it returns the current reward per token cursor without making changes.*


```solidity
function distributeEmission(IERC20 token) public nonReentrant returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token for which emissions are being distributed.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|rewardPerToken The updated reward per token cursor after distribution.|


### setConfig


```solidity
function setConfig(Config memory _callConfig) external auth;
```

### transferReferralOwnership


```solidity
function transferReferralOwnership(IGmxReferralStorage _referralStorage, bytes32 _code, address _newOwner) external auth;
```

### getDurationBonusMultiplier


```solidity
function getDurationBonusMultiplier(uint durationBonusMultiplier, uint duration) internal pure returns (uint);
```

### getPendingEmission


```solidity
function getPendingEmission(IERC20 token) internal view returns (uint);
```

### getUserPendingReward


```solidity
function getUserPendingReward(uint cursor, uint userCursor, uint userBalance) internal pure returns (uint);
```

### _setConfig


```solidity
function _setConfig(Config memory _callConfig) internal;
```

## Events
### RewardLogic__SetConfig
Emitted when the configuration for the RewardLogic is set.


```solidity
event RewardLogic__SetConfig(uint timestamp, Config callConfig);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`timestamp`|`uint256`|The timestamp when the configuration was set.|
|`callConfig`|`Config`|The configuration settings that were applied.|

### RewardLogic__Lock
Emitted when a user locks tokens to receive rewards.


```solidity
event RewardLogic__Lock(IERC20 token, uint baselineEmissionRate, address user, uint accruedReward, uint duration, uint rewardInToken);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token that is being locked.|
|`baselineEmissionRate`|`uint256`|The baseline emission rate used for calculating rewards.|
|`user`|`address`|The address of the user who is locking tokens.|
|`accruedReward`|`uint256`|The amount of rewards that have been accrued by the user.|
|`duration`|`uint256`|The duration for which the tokens are locked.|
|`rewardInToken`|`uint256`|The amount of rewards in the form of the locked token.|

### RewardLogic__Exit
Emitted when a user exits their locked position and claims rewards.


```solidity
event RewardLogic__Exit(IERC20 token, uint baselineEmissionRate, address user, uint rewardInToken);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token that was locked.|
|`baselineEmissionRate`|`uint256`|The baseline emission rate used for calculating rewards.|
|`user`|`address`|The address of the user who is exiting.|
|`rewardInToken`|`uint256`|The amount of rewards in the form of the locked token.|

### RewardLogic__Claim
Emitted when a user claims their accrued emission rewards.


```solidity
event RewardLogic__Claim(address user, address receiver, uint rewardPerTokenCursor, uint amount);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user claiming rewards.|
|`receiver`|`address`|The address where the claimed rewards are sent.|
|`rewardPerTokenCursor`|`uint256`|The updated reward per token cursor after the claim.|
|`amount`|`uint256`|The amount of rewards claimed.|

### RewardLogic__Distribute
Emitted when rewards are distributed to users.


```solidity
event RewardLogic__Distribute(IERC20 token, uint distributionTimeframe, uint supply, uint nextRewardPerTokenCursor);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The ERC20 token for which rewards are being distributed.|
|`distributionTimeframe`|`uint256`|The timeframe over which the rewards are distributed.|
|`supply`|`uint256`|The total supply of locked tokens.|
|`nextRewardPerTokenCursor`|`uint256`|The updated reward per token cursor after distribution.|

### RewardLogic__Buyback
Emitted when a buyback is performed.


```solidity
event RewardLogic__Buyback(address buyer, uint thresholdAmount, IERC20 token, uint rewardPerContributionCursor, uint totalFee);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`buyer`|`address`|The address of the buyer performing the buyback.|
|`thresholdAmount`|`uint256`|The threshold amount for the buyback.|
|`token`|`IERC20`|The ERC20 token being bought back.|
|`rewardPerContributionCursor`|`uint256`|The reward per contribution cursor at the time of the buyback.|
|`totalFee`|`uint256`|The total fee associated with the buyback.|

## Errors
### RewardLogic__NoClaimableAmount
Error emitted when there is no claimable amount for a user.


```solidity
error RewardLogic__NoClaimableAmount();
```

### RewardLogic__UnacceptableTokenPrice
Error emitted when the token price is unacceptable for an operation.


```solidity
error RewardLogic__UnacceptableTokenPrice(uint tokenPrice);
```

### RewardLogic__InvalidClaimPrice
Error emitted when the claim price is invalid.


```solidity
error RewardLogic__InvalidClaimPrice();
```

### RewardLogic__InvalidDuration
Error emitted when the duration for an operation is invalid.


```solidity
error RewardLogic__InvalidDuration();
```

### RewardLogic__NotingToClaim
Error emitted when there is nothing to claim for a user.


```solidity
error RewardLogic__NotingToClaim();
```

### RewardLogic__AmountExceedsContribution
Error emitted when the amount exceeds the user's contribution.


```solidity
error RewardLogic__AmountExceedsContribution();
```

### RewardLogic__InvalidWeightFactors
Error emitted when the weight factors are invalid.


```solidity
error RewardLogic__InvalidWeightFactors();
```

## Structs
### Config
Struct to hold configuration parameters.


```solidity
struct Config {
    uint baselineEmissionRate;
    uint optionLockTokensBonusMultiplier;
    uint lockLiquidTokensBonusMultiplier;
    uint distributionTimeframe;
}
```

