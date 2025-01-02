# PuppetToken
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/tokenomics/PuppetToken.sol)

**Inherits:**
CoreContract, ERC20, IERC20Mintable

An ERC20 token with a mint rate limit designed to mitigate and provide feedback of a
potential critical faults or bugs in the minting process.

*The limit restricts the quantity of new tokens that can be minted within a given timeframe, proportional to the
existing supply. The mintCore function in the contract is designed to allocate tokens to the core contributors over
time, with the allocation amount decreasing as more time passes from the deployment of the contract. This is
intended to gradually transfer governance power and incentivises broader ownership.*


## State Variables
### CORE_RELEASE_DURATION_DIVISOR
*Constant representing the divisor for calculating core release duration.*


```solidity
uint private constant CORE_RELEASE_DURATION_DIVISOR = 31_536_000;
```


### GENESIS_MINT_AMOUNT
*Constant representing the amount of tokens minted at genesis.*


```solidity
uint private constant GENESIS_MINT_AMOUNT = 100_000e18;
```


### lastMintTime
*The timestamp of the last mint operation.*


```solidity
uint lastMintTime = block.timestamp;
```


### emissionRate
*The current mint capacity.*


```solidity
uint emissionRate;
```


### mintedCoreAmount
The amount of tokens minted to the core.


```solidity
uint public mintedCoreAmount;
```


### deployTimestamp
The timestamp when the contract was deployed.


```solidity
uint public immutable deployTimestamp = block.timestamp;
```


### config
The current configuration.


```solidity
Config public config;
```


## Functions
### constructor

Initializes the contract with authority, configuration, and initial receiver of
genesis mint.


```solidity
constructor(
    IAuthority _authority,
    address receiver
) ERC20("Puppet Test", "PUPPET-TEST") CoreContract("PuppetToken", "1", _authority);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_authority`|`IAuthority`|The authority contract for permission checks.|
|`receiver`|`address`|The address to receive the genesis mint amount.|


### getCoreShare

Returns the core share based on the last mint time.


```solidity
function getCoreShare() public view returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The core share.|


### getMintableCoreAmount

Returns the amount of core tokens that can be minted based on the last mint time.


```solidity
function getMintableCoreAmount() public view returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The mintable core amount.|


### getEmissionRateLimit

Returns the limit amount based on the current configuration.


```solidity
function getEmissionRateLimit() public view returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The limit amount.|


### mint

Mints new tokens with a governance-configured rate limit.


```solidity
function mint(address _receiver, uint _amount) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The address to mint tokens to.|
|`_amount`|`uint256`|The amount of tokens to mint.|


### mintCore

Mints new tokens to the core with a time-based reduction release schedule.


```solidity
function mintCore(
    address _receiver
) external auth returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The address to mint tokens to.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of tokens minted.|


### _setConfig


```solidity
function _setConfig(
    bytes calldata data
) internal override;
```

## Structs
### Config
The configuration for the mint rate limit.


```solidity
struct Config {
    uint limitFactor;
    uint durationWindow;
}
```

