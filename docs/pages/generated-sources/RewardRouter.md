# RewardRouter
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/RewardRouter.sol)

**Inherits:**
CoreContract, ReentrancyGuardTransient, Multicall


## State Variables
### config

```solidity
Config config;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    Config memory _config
) CoreContract("RewardRouter", "1", _authority, _eventEmitter);
```

### buyback

Executes the buyback of revenue tokens using the protocol's accumulated fees.


```solidity
function buyback(IERC20 token, address receiver, uint amount) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The address of the revenue token to be bought back.|
|`receiver`|`address`|The address that will receive the revenue token.|
|`amount`|`uint256`|The amount of revenue tokens to be bought back.|


### claimContribution

Claims the rewards for a specific token contribution.


```solidity
function claimContribution(
    IERC20[] calldata tokenList,
    address receiver,
    uint amount
) public nonReentrant returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenList`|`IERC20[]`||
|`receiver`|`address`|The address where the claimed tokens should be sent.|
|`amount`|`uint256`|The amount of rewards to be claimed.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of rewards claimed.|


### lock

Locks tokens, granting them voting power.


```solidity
function lock(uint amount, uint duration) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of tokens to be locked.|
|`duration`|`uint256`|The duration for which the tokens are to be locked.|


### vest

Allows a user to vest their tokens.


```solidity
function vest(uint amount, address receiver) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of tokens to be vested by the caller.|
|`receiver`|`address`|The address where the vested tokens should be sent.|


### claimEmission

Allows a user to claim vested tokens.


```solidity
function claimEmission(address receiver, uint amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address where the claimed tokens should be sent.|
|`amount`|`uint256`|The amount of tokens to claim.|


### claimVested

Allows a user to claim vested tokens on behalf of another user.


```solidity
function claimVested(address receiver, uint amount) public nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address where the claimed tokens should be sent.|
|`amount`|`uint256`|The amount of tokens to claim.|


### setConfig

Set the mint rate limit for the token.


```solidity
function setConfig(Config calldata _config) external auth nonReentrant;
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
### PuppetRouter__InvalidPuppet

```solidity
error PuppetRouter__InvalidPuppet();
```

### PuppetRouter__InvalidAllowance

```solidity
error PuppetRouter__InvalidAllowance();
```

## Structs
### Config

```solidity
struct Config {
    RewardLogic rewardLogic;
    VotingEscrowLogic veLogic;
    ContributeLogic contributeLogic;
}
```

