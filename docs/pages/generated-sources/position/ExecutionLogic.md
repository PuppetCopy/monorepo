# ExecutionLogic
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/position/ExecutionLogic.sol)

**Inherits:**
CoreContract


## State Variables
### puppetStore

```solidity
PuppetStore immutable puppetStore;
```


### positionStore

```solidity
PositionStore immutable positionStore;
```


## Functions
### constructor


```solidity
constructor(
    IAuthority _authority,
    PuppetStore _puppetStore,
    PositionStore _positionStore
) CoreContract("ExecutionLogic", "1", _authority);
```

### handleCancelled


```solidity
function handleCancelled(bytes32 key, GmxPositionUtils.Props memory order, bytes calldata eventData) external auth;
```

### handleFrozen


```solidity
function handleFrozen(bytes32 key, GmxPositionUtils.Props memory order, bytes calldata eventData) external auth;
```

### handleExecution


```solidity
function handleExecution(bytes32 key, GmxPositionUtils.Props calldata order, bytes calldata eventData) external auth;
```

### increase


```solidity
function increase(bytes32 requestKey, GmxPositionUtils.Props calldata, bytes calldata) internal;
```

### decrease


```solidity
function decrease(bytes32 requestKey, GmxPositionUtils.Props calldata, bytes calldata) internal;
```

