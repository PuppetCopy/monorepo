# PuppetStore
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/e958c407aafad0b6c3aeaa6893e84ba9f1b97fb1/src/puppet/store/PuppetStore.sol)

**Inherits:**
BankStore


## State Variables
### tokenAllowanceCapMap

```solidity
mapping(IERC20 token => uint) tokenAllowanceCapMap;
```


### userBalanceMap

```solidity
mapping(IERC20 token => mapping(address user => uint)) userBalanceMap;
```


### requestId

```solidity
uint requestId = 0;
```


### activityThrottleMap

```solidity
mapping(bytes32 matchKey => mapping(address puppet => uint)) activityThrottleMap;
```


### matchRuleMap

```solidity
mapping(bytes32 matchKey => mapping(address puppet => MatchRule)) matchRuleMap;
```


### settledAllocationHashMap

```solidity
mapping(bytes32 listHash => bytes32 allocationKey) settledAllocationHashMap;
```


### userAllocationMap

```solidity
mapping(bytes32 allocationKey => mapping(address puppet => uint amount)) userAllocationMap;
```


### allocationMap

```solidity
mapping(bytes32 allocationKey => Allocation) allocationMap;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, Router _router) BankStore(_authority, _router);
```

### getSettledAllocationHash


```solidity
function getSettledAllocationHash(
    bytes32 _hash
) external view returns (bytes32);
```

### setSettledAllocationHash


```solidity
function setSettledAllocationHash(bytes32 _hash, bytes32 _key) external auth;
```

### getTokenAllowanceCap


```solidity
function getTokenAllowanceCap(
    IERC20 _token
) external view returns (uint);
```

### setTokenAllowanceCap


```solidity
function setTokenAllowanceCap(IERC20 _token, uint _value) external auth;
```

### getUserBalance


```solidity
function getUserBalance(IERC20 _token, address _account) external view returns (uint);
```

### getBalanceList


```solidity
function getBalanceList(IERC20 _token, address[] calldata _userList) external view returns (uint[] memory);
```

### getBalanceAndAllocationList


```solidity
function getBalanceAndAllocationList(
    IERC20 _token,
    bytes32 _key,
    address[] calldata _puppetList
) external view returns (uint[] memory _balanceList, uint[] memory _allocationList);
```

### setBalanceList


```solidity
function setBalanceList(IERC20 _token, address[] calldata _accountList, uint[] calldata _balanceList) external auth;
```

### getRequestId


```solidity
function getRequestId() external view returns (uint);
```

### incrementRequestId


```solidity
function incrementRequestId() external auth returns (uint);
```

### getUserAllocation


```solidity
function getUserAllocation(bytes32 _key, address _puppet) external view returns (uint);
```

### setUserAllocation


```solidity
function setUserAllocation(bytes32 _key, address _puppet, uint _value) external auth;
```

### getUserAllocationList


```solidity
function getUserAllocationList(
    bytes32 _key,
    address[] calldata _puppetList
) external view returns (uint[] memory _allocationList);
```

### allocate


```solidity
function allocate(
    IERC20 _token,
    bytes32 _matchKey,
    bytes32 _allocationKey,
    address _puppet,
    uint _allocationAmount
) external auth;
```

### getAllocation


```solidity
function getAllocation(bytes32 _matchKey, address _puppet) public view auth returns (uint);
```

### allocatePuppetList


```solidity
function allocatePuppetList(
    IERC20 _token,
    bytes32 _matchKey,
    bytes32 _allocationKey,
    address[] calldata _puppetList,
    uint[] calldata _allocationList
) external auth returns (uint);
```

### setBalance


```solidity
function setBalance(IERC20 _token, address _user, uint _value) public auth returns (uint);
```

### getMatchRuleList


```solidity
function getMatchRuleList(
    address _puppet,
    bytes32[] calldata _matchKeyList
) external view returns (MatchRule[] memory);
```

### getMatchRule


```solidity
function getMatchRule(bytes32 _key, address _puppet) external view returns (MatchRule memory);
```

### setMatchRule


```solidity
function setMatchRule(bytes32 _key, address _puppet, MatchRule calldata _rule) external auth;
```

### setMatchRuleList


```solidity
function setMatchRuleList(
    address _puppet,
    bytes32[] calldata _matchKeyList,
    MatchRule[] calldata _rules
) external auth;
```

### getPuppetMatchRuleList


```solidity
function getPuppetMatchRuleList(
    address _puppet,
    bytes32[] calldata _matchKeyList
) external view returns (MatchRule[] memory);
```

### getActivityThrottleList


```solidity
function getActivityThrottleList(bytes32 _key, address[] calldata puppetList) external view returns (uint[] memory);
```

### setActivityThrottle


```solidity
function setActivityThrottle(address _puppet, bytes32 _key, uint _time) external auth;
```

### getActivityThrottle


```solidity
function getActivityThrottle(address _puppet, bytes32 _key) external view returns (uint);
```

### getBalanceAndActivityThrottle


```solidity
function getBalanceAndActivityThrottle(
    IERC20 _token,
    bytes32 _matchKey,
    address _puppet
) external view returns (MatchRule memory _rule, uint _allocationActivity, uint _balance);
```

### getBalanceAndActivityThrottleList


```solidity
function getBalanceAndActivityThrottleList(
    IERC20 _token,
    bytes32 _matchKey,
    address[] calldata _puppetList
) external view returns (MatchRule[] memory _ruleList, uint[] memory _activityList, uint[] memory _balanceList);
```

### getAllocation


```solidity
function getAllocation(
    bytes32 _key
) external view returns (Allocation memory);
```

### setAllocation


```solidity
function setAllocation(bytes32 _key, Allocation calldata _settlement) external auth;
```

### removeAllocation


```solidity
function removeAllocation(
    bytes32 _key
) external auth;
```

### settle


```solidity
function settle(IERC20 _token, address _puppet, uint _settleAmount) external auth;
```

## Structs
### MatchRule

```solidity
struct MatchRule {
    uint allowanceRate;
    uint throttleActivity;
    uint expiry;
}
```

### Allocation

```solidity
struct Allocation {
    bytes32 matchKey;
    IERC20 collateralToken;
    uint allocated;
    uint collateral;
    uint size;
    uint settled;
    uint profit;
}
```

