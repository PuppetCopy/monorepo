# VotingEscrowStore
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/tokenomics/store/VotingEscrowStore.sol)

**Inherits:**
BankStore


## State Variables
### userBalanceMap

```solidity
mapping(address => uint) public userBalanceMap;
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
constructor(IAuthority _authority, Router _router) BankStore(_authority, _router);
```

### getLockDuration


```solidity
function getLockDuration(
    address _user
) external view returns (uint);
```

### setLockDuration


```solidity
function setLockDuration(address _user, uint _duration) external auth;
```

### getVested


```solidity
function getVested(
    address _user
) external view returns (Vested memory);
```

### setVested


```solidity
function setVested(address _user, Vested memory _vest) external auth;
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

