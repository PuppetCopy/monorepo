# VotingEscrow
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/tokenomics/VotingEscrow.sol)

**Inherits:**
Permission, ERC20Votes

lock tokens for a certain period to obtain governance voting power.
The lock duration is subject to a weighted average adjustment when additional tokens are locked for a new duration. Upon unlocking, tokens enter a
vesting period, the duration of which is determined by the weighted average of the lock durations. The vesting period is recalculated whenever
additional tokens are locked, incorporating the new amount and duration into the weighted average.

*The contract inherits from Permission and ERC20Votes to provide token locking and voting features.
It uses a weighted average mechanism to adjust lock durations and vesting periods.*


## State Variables
### lockMap

```solidity
mapping(address => Lock) public lockMap;
```


### vestMap

```solidity
mapping(address => Vest) public vestMap;
```


### router

```solidity
Router public immutable router;
```


### token

```solidity
IERC20 public immutable token;
```


## Functions
### getLock

Retrieves the lock information for a given user.


```solidity
function getLock(address _user) external view returns (Lock memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user whose lock information is to be retrieved.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`Lock`|The lock information of the specified user.|


### getVest

Retrieves the vesting information for a given user.


```solidity
function getVest(address _user) external view returns (Vest memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user whose vesting information is to be retrieved.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`Vest`|The vesting information of the specified user.|


### constructor

Initializes the contract with the specified authority, router, and token.


```solidity
constructor(IAuthority _authority, Router _router, IERC20 _token)
    Permission(_authority)
    ERC20("Puppet Voting Power", "vePUPPET")
    EIP712("Voting Escrow", "1");
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_authority`|`IAuthority`|The address of the authority contract for permission checks.|
|`_router`|`Router`|The address of the router contract for token transfers.|
|`_token`|`IERC20`|The address of the ERC20 token to be locked.|


### getClaimable

Calculates the amount of tokens that can be claimed by the user.


```solidity
function getClaimable(address _user) external view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user whose claimable amount is to be calculated.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of tokens that can be claimed by the user.|


### getVestingCursor

Calculates the current vesting state for a given user.


```solidity
function getVestingCursor(address _user) public view returns (Vest memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user whose vesting state is to be calculated.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`Vest`|The current vesting state of the specified user.|


### lock

Locks tokens for a user, granting them voting power.

*Emits a VotingEscrow__Lock event on successful lock.*


```solidity
function lock(address _depositor, address _user, uint _amount, uint _duration) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_depositor`|`address`|The address that provides the tokens to be locked.|
|`_user`|`address`|The address for whom the tokens are locked.|
|`_amount`|`uint256`|The amount of tokens to be locked.|
|`_duration`|`uint256`|The duration for which the tokens are to be locked.|


### vest

Begins the vesting process for a user's locked tokens.

*Emits a VotingEscrow__Vest event on successful vesting initiation.*


```solidity
function vest(address _user, address _receiver, uint _amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user whose tokens are to begin vesting.|
|`_receiver`|`address`|The address that will receive the vested tokens.|
|`_amount`|`uint256`|The amount of tokens to begin vesting.|


### claim

Allows a user to claim their vested tokens.

*Emits a VotingEscrow__Claim event on successful claim.*


```solidity
function claim(address _user, address _receiver, uint _amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user claiming their tokens.|
|`_receiver`|`address`|The address that will receive the claimed tokens.|
|`_amount`|`uint256`|The amount of tokens to be claimed.|


### transfer

Transfers are unsupported in this contract.


```solidity
function transfer(address, uint) public pure override returns (bool);
```

### transferFrom

TransferFrom is unsupported in this contract.


```solidity
function transferFrom(address, address, uint) public pure override returns (bool);
```

## Events
### VotingEscrow__Lock

```solidity
event VotingEscrow__Lock(address indexed depositor, address indexed user, Lock lock);
```

### VotingEscrow__Vest

```solidity
event VotingEscrow__Vest(address indexed user, address indexed receiver, Vest vest);
```

### VotingEscrow__Claim

```solidity
event VotingEscrow__Claim(address indexed user, address indexed receiver, uint amount);
```

## Errors
### VotingEscrow__ZeroAmount

```solidity
error VotingEscrow__ZeroAmount();
```

### VotingEscrow__Unsupported

```solidity
error VotingEscrow__Unsupported();
```

### VotingEscrow__ExceedMaxTime

```solidity
error VotingEscrow__ExceedMaxTime();
```

### VotingEscrow__ExceedingAccruedAmount

```solidity
error VotingEscrow__ExceedingAccruedAmount(uint accrued);
```

### VotingEscrow__ExceedingLockAmount

```solidity
error VotingEscrow__ExceedingLockAmount(uint amount);
```

## Structs
### Lock

```solidity
struct Lock {
    uint amount;
    uint duration;
}
```

### Vest

```solidity
struct Vest {
    uint amount;
    uint remainingDuration;
    uint lastAccruedTime;
    uint accrued;
}
```

