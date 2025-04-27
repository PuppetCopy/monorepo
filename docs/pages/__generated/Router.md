# Router
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e5748352ed9f301367f1ad7b3c58fa7a54733d2c/src/Router.sol)

**Inherits:**
ReentrancyGuardTransient


## State Variables
### matchingRule

```solidity
MatchingRule public immutable matchingRule;
```


### feeMarketplace

```solidity
FeeMarketplace public immutable feeMarketplace;
```


## Functions
### constructor


```solidity
constructor(MatchingRule _matchingRule, FeeMarketplace _feeMarketplace);
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


### setMatchingRule

Sets or updates the matching rule for the caller (puppet) regarding a specific trader.


```solidity
function setMatchingRule(
    IERC20 collateralToken,
    address trader,
    MatchingRule.Rule calldata ruleParams
) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`collateralToken`|`IERC20`|The token context for this rule.|
|`trader`|`address`|The trader the caller wishes to potentially mirror.|
|`ruleParams`|`MatchingRule.Rule`|The parameters for the rule (allowance rate, throttle, expiry).|


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


