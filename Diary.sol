// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Diary {
    enum Mood { Good, Normal, Bad }
    
    struct DiaryEntry {
        string title;
        string content;
        Mood mood;
        uint timestamp;
    }

    mapping(address => DiaryEntry[]) private diaries;

    function WriteDiary(string memory _title, string memory _content, string memory __mood) public {
        Mood _mood;
        if (keccak256(bytes(__mood)) == keccak256(bytes("Good"))) {
            _mood = Mood.Good;
        } else if (keccak256(bytes(__mood)) == keccak256(bytes("Normal"))) {
            _mood = Mood.Normal;
        } else {
            _mood = Mood.Bad;
        }
        diaries[msg.sender].push(
            DiaryEntry({
                title: _title,
                content: _content,
                mood: _mood,
                timestamp: block.timestamp
            })
        );
    }

    function getMyDiariesByMood(string memory __mood) public view returns (DiaryEntry[] memory) {
        Mood _mood;
        if (keccak256(bytes(__mood)) == keccak256(bytes("Good"))) {
            _mood = Mood.Good;
        } else if (keccak256(bytes(__mood)) == keccak256(bytes("Normal"))) {
            _mood = Mood.Normal;
        } else {
            _mood = Mood.Bad;
        }

        DiaryEntry[] memory all = diaries[msg.sender];
        uint count = 0;

        for (uint i = 0; i < all.length; i++) {
            if (all[i].mood == _mood) count++;
        }

        DiaryEntry[] memory result = new DiaryEntry[](count);
        uint j = 0;
        for (uint i = 0; i < all.length; i++) {
            if (all[i].mood == _mood) {
                result[j] = all[i];
                j++;
            }
        }
        return result;
    }

    function getMyDiaryCount() public view returns (uint) {
        return diaries[msg.sender].length;
    }


}
