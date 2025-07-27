// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vote_System {

    string[5] private candidates;
    uint[2] private timelock;
    uint private regitime;

    constructor(string memory _candi1, string memory _candi2, string memory _candi3, string memory _candi4, string memory _candi5, uint _startDelay, uint _votetime) {
        candidates[0] = _candi1;
        candidates[1] = _candi2;
        candidates[2] = _candi3;
        candidates[3] = _candi4;
        candidates[4] = _candi5;
        timelock[0] = _startDelay;
        timelock[1] = _votetime;
        regitime = block.timestamp;
    }

    mapping(string => int) private votes;
    mapping(address => bool) private voted;

    function vote(string memory _candidate) public {
        require(block.timestamp >= (regitime+timelock[0]) && block.timestamp <= (regitime+timelock[0]+timelock[1]), "Voting is not open");
        require(!voted[msg.sender], "Already voted");
        votes[_candidate] += 1;
        voted[msg.sender] = true;
    }

    function result() public view returns (string memory winner) {
        require((block.timestamp >= (regitime+timelock[0])), "Voting is not started");
        require(block.timestamp > (regitime+timelock[0]+timelock[1]), "Voting is not end");
        winner = candidates[0];
        for(uint i=0; i<5; i++) {
            if(votes[candidates[i]] > votes[winner]) {
                winner = candidates[i];
            }
        }
        return winner;
    }
}
