# VotingEscrowLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/VotingEscrowLogic.sol)

**Inherits:**
CoreContract

Manages the locking of tokens to provide users with governance voting power and time-based rewards.
This contract handles the logic for token vesting and voting power accrual based on the duration of token locks.

*Inherits from CoreContract and utilizes a separate VotingEscrowStore for state management.
It implements a weighted average mechanism for lock durations and vesting periods to calculate rewards.*


## State Variables
### MAXTIME

```solidity
uint constant MAXTIME = 63120000;
```


### config
The configuration parameters for the RewardLogic


```solidity
Config public config;
```


### token

```solidity
PuppetToken public immutable token;
```


### vToken

```solidity
PuppetVoteToken public immutable vToken;
```


### store

```solidity
VotingEscrowStore public immutable store;
```


## Functions
### getVestingCursor

Computes the current vesting state for a user, updating the amount and remaining duration.

*Returns a Vested struct reflecting the state after accounting for the time elapsed since the last accrual.*


```solidity
function getVestingCursor(address user) public view returns (VotingEscrowStore.Vested memory vested);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user whose vesting state is to be calculated.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`vested`|`VotingEscrowStore.Vested`|The updated vesting state for the user.|


### getClaimable

Retrieves the claimable token amount for a given user, considering their vested tokens and time elapsed.

*The claimable amount is a sum of already accrued tokens and a portion of the locked tokens based on time
elapsed.*


```solidity
function getClaimable(address user) external view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user whose claimable amount is to be calculated.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of tokens that can be claimed by the user.|


### calcDurationMultiplier

Calculates the multiplier for rewards based on the lock duration.

*The multiplier follows an exponential scale to incentivize longer lock durations.*


```solidity
function calcDurationMultiplier(uint duration) public view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`duration`|`uint256`|The lock duration in seconds.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The calculated duration multiplier.|


### getVestedBonus

Determines the bonus amount of tokens to be minted based on the amount locked and the duration.

*Applies the duration multiplier to the locked amount to calculate the bonus.*


```solidity
function getVestedBonus(uint amount, uint duration) public view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`amount`|`uint256`|The amount of tokens locked.|
|`duration`|`uint256`|The duration for which the tokens are locked.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The bonus amount of tokens.|


### constructor

Initializes the contract with the specified authority, router, and token.


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    VotingEscrowStore _store,
    PuppetToken _token,
    PuppetVoteToken _vToken,
    Config memory _config
) CoreContract("VotingEscrowLogic", "1", _authority, _eventEmitter);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_authority`|`IAuthority`|The address of the authority contract for permission checks.|
|`_eventEmitter`|`EventEmitter`||
|`_store`|`VotingEscrowStore`||
|`_token`|`PuppetToken`|The address of the ERC20 token to be locked.|
|`_vToken`|`PuppetVoteToken`||
|`_config`|`Config`||


### lock

Locks tokens on behalf of a user, granting them voting power and bonus rewards.
the bonus reward are minted to enter the vesting schedule.

*Locks the tokens, mints bonus tokens, and updates the user's vesting schedule.
Emits a lock event upon successful execution.*


```solidity
function lock(address depositor, address user, uint amount, uint duration) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`depositor`|`address`|The address providing the tokens to be locked.|
|`user`|`address`|The address for whom the tokens are locked.|
|`amount`|`uint256`|The amount of tokens to be locked.|
|`duration`|`uint256`|The duration for which the tokens are to be locked.|


### vest

Initiates the vesting process for a user's locked tokens.

*Updates the user's vesting schedule and burns the corresponding voting tokens.*


```solidity
function vest(address user, address receiver, uint amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user whose tokens are to begin vesting.|
|`receiver`|`address`|The address that will receive the vested tokens.|
|`amount`|`uint256`|The amount of tokens to begin vesting.|


### claim

Allows a user to claim their vested tokens.

*Transfers the claimed tokens to the receiver and updates the user's vesting schedule.*


```solidity
function claim(address user, address receiver, uint amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user`|`address`|The address of the user claiming their tokens.|
|`receiver`|`address`|The address that will receive the claimed tokens.|
|`amount`|`uint256`|The amount of tokens to be claimed.|


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

Sets the configuration parameters for the contract.

*Can only be called by an authorized entity. Updates the contract's configuration.*


```solidity
function _setConfig(Config memory _config) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_config`|`Config`|The new configuration parameters.|


### _vest


```solidity
function _vest(address user, address receiver, uint amount, uint duration) internal;
```

## Errors
### VotingEscrowLogic__ZeroAmount

```solidity
error VotingEscrowLogic__ZeroAmount();
```

### VotingEscrowLogic__ExceedMaxTime

```solidity
error VotingEscrowLogic__ExceedMaxTime();
```

### VotingEscrowLogic__ExceedingAccruedAmount

```solidity
error VotingEscrowLogic__ExceedingAccruedAmount(uint accrued);
```

## Structs
### Config
Struct to hold configuration parameters.


```solidity
struct Config {
    uint baseMultiplier;
}
```

