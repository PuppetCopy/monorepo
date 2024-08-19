# RequestDecreasePosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/9c0e4bd812e2fadc24247bdb9759d2c34c92a190/src/position/RequestDecreasePosition.sol)

**Inherits:**
Permission, EIP712


## State Variables
### callConfig

```solidity
CallConfig callConfig;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, CallConfig memory _callConfig) Permission(_authority) EIP712("Position Router", "1");
```

### traderDecrease


```solidity
function traderDecrease(PositionUtils.TraderCallParams calldata traderCallParams, address user) external auth;
```

### proxyDecrease


```solidity
function proxyDecrease(PositionUtils.TraderCallParams calldata traderCallParams, address user) external auth;
```

### decrease


```solidity
function decrease(
    PositionStore.RequestAdjustment memory request,
    PositionStore.MirrorPosition memory mirrorPosition,
    PositionUtils.TraderCallParams calldata traderCallParams,
    Subaccount subaccount,
    address subaccountAddress
) internal;
```

### setConfig


```solidity
function setConfig(CallConfig memory _callConfig) external auth;
```

### _setConfig


```solidity
function _setConfig(CallConfig memory _callConfig) internal;
```

## Events
### RequestDecreasePosition__SetConfig

```solidity
event RequestDecreasePosition__SetConfig(uint timestamp, CallConfig callConfig);
```

### RequestDecreasePosition__Request

```solidity
event RequestDecreasePosition__Request(address trader, address subaccount, bytes32 positionKey, bytes32 requestKey, uint traderCollateralDelta);
```

## Errors
### RequestDecreasePosition__SubaccountNotFound

```solidity
error RequestDecreasePosition__SubaccountNotFound(address user);
```

## Structs
### CallConfig

```solidity
struct CallConfig {
    IGmxExchangeRouter gmxExchangeRouter;
    PositionStore positionStore;
    SubaccountStore subaccountStore;
    address gmxOrderReciever;
    address gmxOrderVault;
    bytes32 referralCode;
    uint callbackGasLimit;
}
```

