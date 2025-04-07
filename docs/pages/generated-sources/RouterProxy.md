# RouterProxy
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/RouterProxy.sol)

**Inherits:**
Proxy, Access, Multicall

An upgradeable proxy that delegates calls to a replaceable Router
contract (the implementation). This uses OpenZeppelin's ERC1967Upgrade
to manage the implementation address.


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority
) Access(_authority);
```

### update


```solidity
function update(
    address _impl
) external auth;
```

### _implementation

*Returns the current implementation address.
TIP: To get this value clients can read directly from the storage slot shown below (specified by ERC-1967) using
the https://eth.wiki/json-rpc/API#eth_getstorageat[`eth_getStorageAt`] RPC call.
`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`*


```solidity
function _implementation() internal view virtual override returns (address);
```

### receive


```solidity
receive() external payable;
```

