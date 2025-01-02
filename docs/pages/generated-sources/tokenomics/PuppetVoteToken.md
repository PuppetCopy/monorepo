# PuppetVoteToken
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/tokenomics/PuppetVoteToken.sol)

**Inherits:**
Permission, ERC20Votes, ERC165


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority
) Permission(_authority) ERC20("Puppet Voting Power", "vPUPPET") EIP712("PuppetVoteToken", "1");
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

### supportsInterface


```solidity
function supportsInterface(
    bytes4 interfaceId
) public view virtual override(ERC165) returns (bool);
```

