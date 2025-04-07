# VotingEscrow
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/tokenomics/VotingEscrow.sol)

**Inherits:**
CoreContract


## State Variables
### MAXTIME

```solidity
uint public constant MAXTIME = 106 weeks;
```


### store

```solidity
VotingEscrowStore public immutable store;
```


### token

```solidity
PuppetToken public immutable token;
```


### vToken

```solidity
PuppetVoteToken public immutable vToken;
```


### config

```solidity
Config public config;
```


### lockDurationMap

```solidity
mapping(address => uint) public lockDurationMap;
```


### vestMap

```solidity
mapping(address => Vested) public vestMap;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    VotingEscrowStore _store,
    PuppetToken _token,
    PuppetVoteToken _vToken
) CoreContract(_authority);
```

### getVestingCursor


```solidity
function getVestingCursor(
    address user
) public view returns (Vested memory vested);
```

### getClaimable


```solidity
function getClaimable(
    address user
) external view returns (uint);
```

### calcDurationMultiplier


```solidity
function calcDurationMultiplier(
    uint duration
) public view returns (uint);
```

### getVestedBonus


```solidity
function getVestedBonus(uint amount, uint duration) public view returns (uint);
```

### lock


```solidity
function lock(address depositor, address user, uint amount, uint duration) external auth;
```

### vest


```solidity
function vest(address user, address receiver, uint amount) external auth;
```

### claim


```solidity
function claim(address user, address receiver, uint amount) external auth;
```

### _setConfig


```solidity
function _setConfig(
    bytes calldata data
) internal override;
```

### _vest


```solidity
function _vest(address user, address receiver, uint amount, uint duration) internal;
```

## Structs
### Vested

```solidity
struct Vested {
    uint amount;
    uint remainingDuration;
    uint lastAccruedTime;
    uint accrued;
}
```

### Config

```solidity
struct Config {
    uint baseMultiplier;
}
```

