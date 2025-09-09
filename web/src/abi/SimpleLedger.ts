export const SimpleLedgerABI = [
  {
    "type": "function",
    "name": "addIncome",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "memo", "type": "string" },
      { "name": "category", "type": "string" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "addExpense",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "amount", "type": "uint256" },
      { "name": "memo", "type": "string" },
      { "name": "category", "type": "string" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "entryCount",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "entriesOf",
    "stateMutability": "view",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "offset", "type": "uint256" },
      { "name": "limit", "type": "uint256" }
    ],
    "outputs": [
      {
        "type": "tuple[]",
        "components": [
          { "name": "amount", "type": "int256" },
          { "name": "memo", "type": "string" },
          { "name": "category", "type": "string" },
          { "name": "timestamp", "type": "uint64" }
        ]
      }
    ]
  },
  {
    "type": "function",
    "name": "balanceOf",
    "stateMutability": "view",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "type": "int256" }]
  },
  {
    "type": "event",
    "name": "EntryAdded",
    "inputs": [
      { "name": "owner", "type": "address", "indexed": true },
      { "name": "index", "type": "uint256", "indexed": false },
      { "name": "amount", "type": "int256", "indexed": false },
      { "name": "memo", "type": "string", "indexed": false },
      { "name": "category", "type": "string", "indexed": false },
      { "name": "timestamp", "type": "uint64", "indexed": false }
    ],
    "anonymous": false
  }
] as const;