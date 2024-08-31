# PuppetToken
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/PuppetToken.sol)

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
uint private constant CORE_RELEASE_DURATION_DIVISOR = 31560000;
```


### GENESIS_MINT_AMOUNT
*Constant representing the amount of tokens minted at genesis.*


```solidity
uint private constant GENESIS_MINT_AMOUNT = 100_000e18;
```


### config
The current configuration.


```solidity
Config public config;
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


### deployTimestamp
The timestamp when the contract was deployed.


```solidity
uint public immutable deployTimestamp = block.timestamp;
```


### mintedCoreAmount
The amount of tokens minted to the core.


```solidity
uint public mintedCoreAmount = 0;
```


## Functions
### constructor

Initializes the contract with authority, configuration, and initial receiver of
genesis mint.


```solidity
constructor(
    IAuthority _authority,
    EventEmitter _eventEmitter,
    Config memory _config,
    address receiver
) ERC20("Puppet Test", "PUPPET-TEST") CoreContract("PuppetToken", "1", _authority, _eventEmitter);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_authority`|`IAuthority`|The authority contract for permission checks.|
|`_eventEmitter`|`EventEmitter`||
|`_config`|`Config`|The initial configuration for mint rate limit.|
|`receiver`|`address`|The address to receive the genesis mint amount.|


### getLockedAmount

Returns the locked amount for a user.


```solidity
function getLockedAmount(address _user) public view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_user`|`address`|The address of the user.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The locked amount.|


### getCoreShare

Returns the core share based on the last mint time.


```solidity
function getCoreShare() public view returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The core share.|


### getCoreShare

Returns the core share based on a specific time.


```solidity
function getCoreShare(uint _time) public view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_time`|`uint256`|The time to calculate the core share for.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The core share.|


### getMintableCoreAmount

Returns the amount of core tokens that can be minted based on the last mint time.


```solidity
function getMintableCoreAmount(uint _lastMintTime) public view returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_lastMintTime`|`uint256`|The last mint time to calculate for.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The mintable core amount.|


### getLimitAmount

Returns the limit amount based on the current configuration.


```solidity
function getLimitAmount() public view returns (uint);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The limit amount.|


### mint

Mints new tokens with a governance-configured rate limit.


```solidity
function mint(address _receiver, uint _amount) external auth returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The address to mint tokens to.|
|`_amount`|`uint256`|The amount of tokens to mint.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of tokens minted.|


### mintCore

Mints new tokens to the core with a time-based reduction release schedule.


```solidity
function mintCore(address _receiver) external auth returns (uint);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The address to mint tokens to.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of tokens minted.|


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


## Events
### Puppet__MintCore
Emitted when tokens are minted to the core.


```solidity
event Puppet__MintCore(address operator, address indexed receiver, uint amount);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|The address that triggered the minting.|
|`receiver`|`address`|The address that received the minted tokens.|
|`amount`|`uint256`|The amount of tokens minted.|

## Errors
### Puppet__InvalidRate
*Error for when the rate is invalid (zero).*


```solidity
error Puppet__InvalidRate();
```

### Puppet__ExceededRateLimit
*Error for when the minting exceeds the rate limit.*


```solidity
error Puppet__ExceededRateLimit(uint rateLimit, uint emissionRate);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`rateLimit`|`uint256`|The rate limit.|
|`emissionRate`|`uint256`|The current emission rate.|

### Puppet__CoreShareExceedsMining
*Error for when the core share exceeds the mintable amount.*


```solidity
error Puppet__CoreShareExceedsMining();
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

