# MirrorPosition
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/5895883d384bd97e4c9ce86357488a3f0b4cf07b/src/position/MirrorPosition.sol)

**Inherits:**
CoreContract


## State Variables
### config

```solidity
Config public config;
```


### tokenDustThresholdList

```solidity
IERC20[] tokenDustThresholdList;
```


### tokenDustThresholdCapList

```solidity
uint[] tokenDustThresholdCapList;
```


### allocationStore

```solidity
AllocationStore immutable allocationStore;
```


### matchRule

```solidity
MatchRule immutable matchRule;
```


### feeMarket

```solidity
FeeMarketplace immutable feeMarket;
```


### allocationStoreImplementation

```solidity
address public immutable allocationStoreImplementation;
```


### nextAllocationId

```solidity
uint public nextAllocationId = 0;
```


### activityThrottleMap

```solidity
mapping(address => mapping(address => uint)) public activityThrottleMap;
```


### allocationPuppetMap

```solidity
mapping(bytes32 => mapping(address => uint)) public allocationPuppetMap;
```


### allocationMap

```solidity
mapping(bytes32 => uint) public allocationMap;
```


### positionMap

```solidity
mapping(bytes32 => Position) public positionMap;
```


### requestAdjustmentMap

```solidity
mapping(bytes32 => RequestAdjustment) public requestAdjustmentMap;
```


### tokenDustThresholdAmountMap

```solidity
mapping(IERC20 => uint) public tokenDustThresholdAmountMap;
```


## Functions
### getConfig


```solidity
function getConfig() external view returns (Config memory);
```

### getAllocation


```solidity
function getAllocation(
    bytes32 _allocationKey
) external view returns (uint);
```

### getPosition


```solidity
function getPosition(
    bytes32 _allocationKey
) external view returns (Position memory);
```

### getRequestAdjustment


```solidity
function getRequestAdjustment(
    bytes32 _requestKey
) external view returns (RequestAdjustment memory);
```

### constructor


```solidity
constructor(
    IAuthority _authority,
    AllocationStore _puppetStore,
    MatchRule _matchRule,
    FeeMarketplace _feeMarket
) CoreContract(_authority);
```

### initializeTraderActivityThrottle


```solidity
function initializeTraderActivityThrottle(address _trader, address _puppet) external auth;
```

### mirror

Starts copying a trader's new position opening (increase) for a selected group of followers (puppets).

*Called by an authorized Keeper (`auth`) to initiate the copy-trading process when a followed trader opens a
new position.
This function determines how much capital each eligible puppet allocates based on their individual matching rules
(`MatchRule`),
available funds (`AllocationStore`), and activity limits. It ensures the total allocated amount is sufficient to
cover the
provided keeper execution fee (`_callParams.keeperExecutionFee`).
The function orchestrates the fund movements:
1. It reserves the calculated allocation amounts from each puppet's balance in the `AllocationStore`.
2. It transfers the total collected capital from the `AllocationStore`.
3. It pays the `keeperExecutionFee` to the designated `_keeperFeeReceiver`.
4. It sends the remaining net capital (`_netAllocation`) to the GMX order vault (`config.gmxOrderVault`) to
collateralize the position.
It then calculates the appropriate size (`_sizeDelta`) for the combined puppet position, proportional to the net
capital provided,
and submits a `MarketIncrease` order to the GMX Router. The Keeper must provide `msg.value` to cover the GMX
network execution fee (`_callParams.executionFee`).
Finally, it records details about this specific mirror action, including the total capital committed
(`allocationMap`) and the GMX request details (`requestAdjustmentMap`),
which are necessary for future adjustments or settlement via the `execute` function upon GMX callback.
Emits a `Mirror` event with key details.*


```solidity
function mirror(
    CallPosition calldata _callParams,
    address[] calldata _puppetList
) external payable auth returns (uint _nextAllocationId, bytes32 _requestKey);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_callParams`|`CallPosition`|Structure containing details of the trader's initial action (must be `isIncrease=true`), market, collateral, size/collateral deltas, GMX execution fee, keeper fee, and keeper fee receiver.|
|`_puppetList`|`address[]`|An array of puppet addresses to potentially participate in mirroring this position.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`_nextAllocationId`|`uint256`|A unique ID generated for this specific allocation instance.|
|`_requestKey`|`bytes32`|The unique key returned by GMX identifying the created order request, used for callbacks.|


### adjust

Adjusts an existing mirrored position to follow a trader's action (increase/decrease).

*Called by an authorized Keeper when the trader being copied modifies their GMX position. This function
ensures the combined puppet position reflects the trader's change. It requires `msg.value` from the Keeper
to cover the GMX network fee for submitting the adjustment order.
This function handles the Keeper's execution fee (`_callParams.keeperExecutionFee`) in a way that doesn't block
the adjustment for all puppets if one cannot pay. It attempts to deduct each puppet's share of the fee from
their available balance in the `AllocationStore`. If a puppet lacks sufficient funds, their invested amount
(`allocationPuppetMap`) in *this specific position* is reduced by the unpaid fee amount. The *full* keeper fee
is paid immediately using funds from the `AllocationStore`.
The core logic calculates the trader's new target leverage based on their latest action. It compares this to the
current leverage of the mirrored position (considering any reductions due to fee insolvency). It then determines
the required size change (`_sizeDelta`) for the mirrored position to match the trader's target leverage and
submits the corresponding `MarketIncrease` or `MarketDecrease` order to GMX.
Details about the adjustment request are stored (`requestAdjustmentMap`) for processing when GMX confirms the
order execution via the `execute` function callback. If puppet allocations were reduced due to fee handling,
the total allocation (`allocationMap`) is updated. Emits an `Adjust` event.*


```solidity
function adjust(
    CallPosition calldata _callParams,
    address[] calldata _puppetList,
    uint _allocationId
) external payable auth returns (bytes32 _requestKey);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_callParams`|`CallPosition`|Structure containing details of the trader's adjustment action (deltas must be > 0), market, collateral, GMX execution fee, keeper fee, and keeper fee receiver.|
|`_puppetList`|`address[]`|The list of puppet addresses associated with this specific allocation instance.|
|`_allocationId`|`uint256`|The unique ID identifying the allocation instance being adjusted.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`_requestKey`|`bytes32`|The unique key returned by GMX identifying the created adjustment order request.|


### execute

Finalizes the state update after a GMX order execution.

*This function is called by the `GmxExecutionCallback` contract via its `afterOrderExecution` function,
which is triggered by GMX's callback mechanism upon successful order execution (increase or decrease).
It uses the GMX request key (`_requestKey`) to retrieve the details of the intended adjustment stored
during the `mirror` or `adjust` call. It updates the internal position state (`positionMap`) to reflect
the executed changes in size and collateral, based on the stored `RequestAdjustment` data.
If the adjustment results in closing the position (target leverage becomes zero or size becomes zero),
it cleans up the position data. Finally, it removes the processed `RequestAdjustment` record and emits
an `Execute` event.*


```solidity
function execute(
    bytes32 _requestKey
) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_requestKey`|`bytes32`|The unique key provided by GMX identifying the executed order request.|


### settle

Settles and distributes funds received for a specific allocation instance.

*This function is called by a Keeper when funds related to a closed or partially closed
GMX position (identified by the allocation instance) are available in the AllocationAccount.
It retrieves the specified `distributeToken` balance from the account, transfers it to the
central `AllocationStore`, deducts a Keeper fee (paid to msg.sender) and a platform fee
(sent to FeeMarketplace), and distributes the remaining amount to the participating Puppets'
balances within the `AllocationStore` based on their original contribution ratios (`allocationPuppetMap`).
IMPORTANT: Settlement on GMX might occur in stages or involve multiple token types (e.g.,
collateral returned separately from PnL or fees). This function processes only the currently
available balance of the specified `distributeToken`. Multiple calls to `settle` (potentially
with different `distributeToken` parameters) may be required for the same `allocationKey`
to fully distribute all proceeds.
Consequently, this function SHOULD NOT perform cleanup of the allocation state (`allocationMap`,
`allocationPuppetMap`). This state must persist to correctly attribute any future funds
arriving for this allocation instance. A separate mechanism or function call, triggered
once a Keeper confirms no further funds are expected, should be used for final cleanup.*


```solidity
function settle(CallSettle calldata _callParams, address[] calldata _puppetList) external auth;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_callParams`|`CallSettle`|Structure containing settlement details (tokens, trader, allocationId, keeperFee).|
|`_puppetList`|`address[]`|The list of puppet addresses involved in this specific allocation instance.|


### collectDust


```solidity
function collectDust(AllocationAccount _allocationAccount, IERC20 _dustToken, address _receiver) external auth;
```

### _submitOrder


```solidity
function _submitOrder(
    CallPosition calldata _order,
    address _allocationAddress,
    GmxPositionUtils.OrderType _orderType,
    uint _callbackGasLimit,
    uint _sizeDeltaUsd,
    uint _initialCollateralDeltaAmount
) internal returns (bytes32 gmxRequestKey);
```

### _setConfig

Sets the configuration parameters via governance

*Emits a SetConfig event upon successful execution*


```solidity
function _setConfig(
    bytes calldata _data
) internal override;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_data`|`bytes`|The encoded configuration data|


### setTokenDustThreshold


```solidity
function setTokenDustThreshold(
    IERC20[] calldata _tokenDustThresholdList,
    uint[] calldata _tokenDustThresholdCapList
) external auth;
```

## Structs
### Config

```solidity
struct Config {
    IGmxExchangeRouter gmxExchangeRouter;
    address callbackHandler;
    address gmxOrderVault;
    bytes32 referralCode;
    uint increaseCallbackGasLimit;
    uint decreaseCallbackGasLimit;
    uint platformSettleFeeFactor;
    uint maxPuppetList;
    uint maxKeeperFeeToAllocationRatio;
    uint maxKeeperFeeToAdjustmentRatio;
    uint maxKeeperFeeToCollectDustRatio;
}
```

### Position

```solidity
struct Position {
    uint size;
    uint traderSize;
    uint traderCollateral;
}
```

### CallPosition

```solidity
struct CallPosition {
    IERC20 collateralToken;
    address trader;
    address market;
    address keeperExecutionFeeReceiver;
    bool isIncrease;
    bool isLong;
    uint executionFee;
    uint collateralDelta;
    uint sizeDeltaInUsd;
    uint acceptablePrice;
    uint triggerPrice;
    uint keeperExecutionFee;
}
```

### CallSettle

```solidity
struct CallSettle {
    IERC20 allocationToken;
    IERC20 distributeToken;
    address keeperExecutionFeeReceiver;
    address trader;
    uint allocationId;
    uint keeperExecutionFee;
}
```

### RequestAdjustment

```solidity
struct RequestAdjustment {
    bytes32 allocationKey;
    bool traderIsIncrease;
    uint traderTargetLeverage;
    uint traderCollateralDelta;
    uint traderSizeDelta;
    uint sizeDelta;
}
```

