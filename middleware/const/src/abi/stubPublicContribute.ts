export default [{ "inputs": [{ "internalType": "contract IERC20", "name": "_token", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "contribute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "store", "outputs": [{ "internalType": "contract ContributeStore", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }] as const