// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleLedger
 * @notice Per-address ledger: each user can add income/expense entries and read their own history.
 * @dev Not optimized for gas; suitable for demos and small personal ledgers.
 */
contract SimpleLedger {
    struct Entry {
        int256 amount;       // income: +, expense: -
        string memo;
        string category;     // e.g. "Food", "Salary"
        uint64 timestamp;    // block timestamp casted
    }

    mapping(address => Entry[]) private _entries;
    mapping(address => int256) private _balance;

    event EntryAdded(
        address indexed owner,
        uint256 index,
        int256 amount,
        string memo,
        string category,
        uint64 timestamp
    );

    function addIncome(uint256 amount, string calldata memo, string calldata category) external {
        _addEntry(int256(amount), memo, category);
    }

    function addExpense(uint256 amount, string calldata memo, string calldata category) external {
        _addEntry(-int256(amount), memo, category);
    }

    function _addEntry(int256 amount, string calldata memo, string calldata category) internal {
        uint64 ts = uint64(block.timestamp);
        _entries[msg.sender].push(Entry({
            amount: amount,
            memo: memo,
            category: category,
            timestamp: ts
        }));
        _balance[msg.sender] += amount;
        emit EntryAdded(msg.sender, _entries[msg.sender].length - 1, amount, memo, category, ts);
    }

    function entryCount(address owner) external view returns (uint256) {
        return _entries[owner].length;
    }

    function entriesOf(address owner, uint256 offset, uint256 limit) external view returns (Entry[] memory) {
        uint256 n = _entries[owner].length;
        if (offset >= n) return new Entry[](0);
        uint256 end = offset + limit;
        if (end > n) end = n;
        uint256 size = end - offset;
        Entry[] memory out = new Entry[](size);
        for (uint256 i = 0; i < size; i++) {
            out[i] = _entries[owner][offset + i];
        }
        return out;
    }

    function balanceOf(address owner) external view returns (int256) {
        return _balance[owner];
    }
}
