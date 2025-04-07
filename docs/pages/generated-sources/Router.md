# Router
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/Router.sol)

**Inherits:**
ReentrancyGuardTransient


## State Variables
### matchRule

```solidity
MatchRule public immutable matchRule;
```


### feeMarketplace

```solidity
FeeMarketplace public immutable feeMarketplace;
```


## Functions
### constructor


```solidity
constructor(MatchRule _matchRule, FeeMarketplace _feeMarketplace);
```

### deposit

Deposits tokens into the system for a user (potential puppet).


```solidity
function deposit(IERC20 token, uint amount) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token being deposited.|
|`amount`|`uint256`|The amount being deposited.|


### withdraw

Withdraws tokens from the system for a user.


```solidity
function withdraw(IERC20 token, address receiver, uint amount) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token being withdrawn.|
|`receiver`|`address`|The address to receive the withdrawn tokens.|
|`amount`|`uint256`|The amount being withdrawn.|


### setMatchRule

Sets or updates the matching rule for the caller (puppet) regarding a specific trader.


```solidity
function setMatchRule(
    IERC20 collateralToken,
    address trader,
    MatchRule.Rule calldata ruleParams
) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`collateralToken`|`IERC20`|The token context for this rule.|
|`trader`|`address`|The trader the caller wishes to potentially mirror.|
|`ruleParams`|`MatchRule.Rule`|The parameters for the rule (allowance rate, throttle, expiry).|


### acceptOffer

Executes a fee redemption offer.


```solidity
function acceptOffer(IERC20 feeToken, address receiver, uint purchaseAmount) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`feeToken`|`IERC20`|The fee token to be redeemed.|
|`receiver`|`address`|The address receiving the fee tokens.|
|`purchaseAmount`|`uint256`|The amount of fee tokens to redeem.|


