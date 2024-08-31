# ContributeLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/ContributeLogic.sol)

**Inherits:**
CoreContract

Contract features a token-based incentive buy-back, it has self-contained mechanism operates without relying
on external price oracles or a single liquidity pool for each token contributed
distribution of rewards
PUPPET token sold, enabling users to claim PUPPET rewards proportionate to their token contributions


## State Variables
### config
The configuration parameters for the ContributeLogic


```solidity
Config public config;
```


### rewardToken
The contract used for minting rewards.


```solidity
IERC20Mintable public immutable rewardToken;
```


### store
The RewardStore contract used for tracking reward accruals


```solidity
ContributeStore public immutable store;
```


## Functions
### getCursorRewardList


```solidity
function getCursorRewardList(IERC20[] calldata tokenList, address user) external view returns (uint[] memory);
```

### getClaimable


```solidity
function getClaimable(IERC20[] calldata tokenList, address user) external view returns (uint);
```

### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    IERC20Mintable _rewardToken,
    ContributeStore _store,
    Config memory _config
) CoreContract("ContributeLogic", "1", _authority, _eventEmitter);
```

### buyback

Executes the buyback of revenue tokens using the protocol's accumulated fees.


```solidity
function buyback(IERC20 token, address depositor, address receiver, uint revenueAmount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The address of the revenue token to be bought back.|
|`depositor`|`address`|The address that deposits the buyback token.|
|`receiver`|`address`|The address that will receive the revenue token.|
|`revenueAmount`|`uint256`|The amount of the revenue token to be bought back.|


### claim

Claims the rewards for a specific token contribution.


```solidity
function claim(IERC20[] calldata tokenList, address user, address receiver, uint amount) external auth returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenList`|`IERC20[]`|The list of token contributions that required updating the cursor.|
|`user`|`address`|The address of the contributor for whom the rewards are to be claimed.|
|`receiver`|`address`|The address that will receive the claimed rewards.|
|`amount`|`uint256`|The amount of rewards to be claimed.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of rewards claimed.|


### setBuybackQuote

Set the buyback quote for the token.


```solidity
function setBuybackQuote(IERC20 token, uint value) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token for which the buyback quote is to be set.|
|`value`|`uint256`|The value of the buyback quote.|


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
### ContributeLogic__InvalidBuybackToken
Error emitted when the claim token is invalid


```solidity
error ContributeLogic__InvalidBuybackToken();
```

### ContributeLogic__InsufficientClaimableReward
Error emitted when the claimable reward is insufficient


```solidity
error ContributeLogic__InsufficientClaimableReward(uint accruedReward);
```

## Structs
### Config
Struct to hold configuration parameters.


```solidity
struct Config {
    uint baselineEmissionRate;
}
```

