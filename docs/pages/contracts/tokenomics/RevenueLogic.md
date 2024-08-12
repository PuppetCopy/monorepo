# RevenueLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/86f5edc5c43c92874fd3cadff78422e25e3cc674/src/tokenomics/RevenueLogic.sol)

**Inherits:**
Permission, EIP712, ReentrancyGuardTransient

Includes a buyback functionality where the protocol publicly offers to buy back its own tokens using accumulated fees in different tokens.

*The contract inherits from Permission.sol to be used by permissioned contracts, EIP712, and ReentrancyGuardTransient to provide buyback
functionality with permission checks and reentrancy protection.*


## State Variables
### store

```solidity
RevenueStore public immutable store;
```


### buybackToken

```solidity
IERC20 public immutable buybackToken;
```


## Functions
### constructor

Initializes the contract with the specified authority, buyback token, and revenue store.


```solidity
constructor(IAuthority _authority, IERC20 _buybackToken, RevenueStore _store) Permission(_authority) EIP712("Revenue Logic", "1");
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_authority`|`IAuthority`|The address of the authority contract for permission checks.|
|`_buybackToken`|`IERC20`|The address of the token to be bought back.|
|`_store`|`RevenueStore`|The address of the revenue store contract.|


### getRevenueBalance

Retrieves the revenue balance of a specific token in the revenue store.


```solidity
function getRevenueBalance(IERC20 token) external view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The address of the token whose balance is to be retrieved.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance of the specified token in the revenue store.|


### buybackRevenue

Executes the buyback of revenue tokens using the protocol's accumulated fees.

*In effect permissioned contract would publicly allow this method to be called.*


```solidity
function buybackRevenue(address source, address depositor, address receiver, IERC20 revenueToken, uint amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`source`|`address`|The source address from which the buyback is initiated.|
|`depositor`|`address`|The address that deposits the buyback token.|
|`receiver`|`address`|The address that will receive the revenue token.|
|`revenueToken`|`IERC20`|The address of the revenue token to be bought back.|
|`amount`|`uint256`|The amount of revenue tokens to be bought back.|


## Events
### RewardLogic__Buyback

```solidity
event RewardLogic__Buyback(address indexed buyer, uint thresholdAmount, IERC20 indexed token, uint rewardPerContributionCursor, uint totalFee);
```

## Errors
### RewardLogic__InvalidClaimToken

```solidity
error RewardLogic__InvalidClaimToken();
```

