// SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

contract BuyMeACoffee {
    struct memo {
        string name;
        string message;
        address from;
        uint256 timestamp;
    }

    event newMemo(string name, string message, address from, uint256 timestamp);

    memo[] memos;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory name, string memory message)
        public
        payable
    {
        require(msg.value > 0, "must greatter than 0");
        memos.push(memo(name, message, msg.sender, block.timestamp));

        // emit
        emit newMemo(name, message, msg.sender, block.timestamp);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
