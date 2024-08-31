# PuppetVoteToken
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/PuppetVoteToken.sol)

**Inherits:**
Permission, ERC20Votes


## Functions
### constructor


```solidity
constructor(IAuthority _authority)
    Permission(_authority)
    ERC20("Puppet Voting Power", "vPUPPET")
    EIP712("PuppetVoteToken", "1");
```

### burn


```solidity
function burn(address user, uint amount) external auth;
```

### mint


```solidity
function mint(address user, uint amount) external auth;
```

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

## Errors
### VotingEscrow__Unsupported

```solidity
error VotingEscrow__Unsupported();
```

