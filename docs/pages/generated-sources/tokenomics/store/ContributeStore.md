# ContributeStore
[Git Source](https://github.com/GMX-Blueberry-Club/puppet-contracts/blob/474b8277cbb576730f09bb3ba6a3b6396a451789/src/tokenomics/store/ContributeStore.sol)

**Inherits:**
BankStore


## State Variables
### buybackQuoteMap

```solidity
mapping(IERC20 => uint) buybackQuoteMap;
```


### cursorMap

```solidity
mapping(IERC20 => uint) cursorMap;
```


### cursorBalanceMap

```solidity
mapping(IERC20 => uint) cursorBalanceMap;
```


### cursorRateMap

```solidity
mapping(IERC20 => mapping(uint => uint)) cursorRateMap;
```


### userCursorMap

```solidity
mapping(IERC20 => mapping(address => uint)) userCursorMap;
```


### userContributionBalanceMap

```solidity
mapping(IERC20 => mapping(address => uint)) userContributionBalanceMap;
```


### userAccruedRewardMap

```solidity
mapping(address => uint) userAccruedRewardMap;
```


## Functions
### constructor


```solidity
constructor(IAuthority _authority, Router _router) BankStore(_authority, _router);
```

### getBuybackQuote


```solidity
function getBuybackQuote(IERC20 _token) external view returns (uint);
```

### setBuybackQuote


```solidity
function setBuybackQuote(IERC20 _token, uint _value) external auth;
```

### getCursor


```solidity
function getCursor(IERC20 _token) external view returns (uint);
```

### setCursor


```solidity
function setCursor(IERC20 _token, uint _value) external auth;
```

### getCursorBalance


```solidity
function getCursorBalance(IERC20 _token) external view returns (uint);
```

### setCursorBalance


```solidity
function setCursorBalance(IERC20 _token, uint _value) external auth;
```

### getCursorRate


```solidity
function getCursorRate(IERC20 _token, uint _cursor) external view returns (uint);
```

### setCursorRate


```solidity
function setCursorRate(IERC20 _token, uint _cursor, uint _value) external auth;
```

### getUserCursor


```solidity
function getUserCursor(IERC20 _token, address _user) external view returns (uint);
```

### setUserCursor


```solidity
function setUserCursor(IERC20 _token, address _user, uint _value) external auth;
```

### getUserContributionBalanceMap


```solidity
function getUserContributionBalanceMap(IERC20 _token, address _user) external view returns (uint);
```

### setUserContributionBalanceMap


```solidity
function setUserContributionBalanceMap(IERC20 _token, address _user, uint _value) external auth;
```

### contribute


```solidity
function contribute(IERC20 _token, address _depositor, address _user, uint _amount) external auth;
```

### contributeMany


```solidity
function contributeMany(
    IERC20 _token,
    address _depositor,
    address[] calldata _userList,
    uint[] calldata _valueList
) external auth;
```

### getUserAccruedReward


```solidity
function getUserAccruedReward(address _user) external view returns (uint);
```

### setUserAccruedReward


```solidity
function setUserAccruedReward(address _user, uint _value) external auth;
```

### updateAccruedReward


```solidity
function updateAccruedReward(address _user, uint _value) external auth;
```

### getPendingCursorReward


```solidity
function getPendingCursorReward(IERC20 _token, address _user) public view returns (uint);
```

### getPendingCursorRewardList


```solidity
function getPendingCursorRewardList(
    IERC20[] calldata _tokenList,
    address _user
) external view returns (uint[] memory);
```

### _updateCursorReward


```solidity
function _updateCursorReward(IERC20 _token, address _user, uint _cursor, uint _userCursor) internal;
```

### _updateCursorReward


```solidity
function _updateCursorReward(IERC20 _token, address _user) internal;
```

### updateCursorRewardList


```solidity
function updateCursorRewardList(IERC20[] calldata _tokenList, address _user) external auth;
```

### updateCursorReward


```solidity
function updateCursorReward(IERC20 _token, address _user) public auth;
```

## Errors
### RewardStore__InvalidLength

```solidity
error RewardStore__InvalidLength();
```

