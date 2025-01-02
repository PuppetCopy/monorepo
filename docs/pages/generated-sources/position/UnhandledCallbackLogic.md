# UnhandledCallbackLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/position/UnhandledCallbackLogic.sol)

**Inherits:**
CoreContract


## State Variables
### positionStore

```solidity
PositionStore immutable positionStore;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    PositionStore _positionStore
) CoreContract("UnhandledCallbackLogic", "1", _authority);
```

### storeUnhandledCallback


```solidity
function storeUnhandledCallback(
    GmxPositionUtils.Props calldata order,
    bytes32 key,
    bytes calldata eventData
) external auth;
```

