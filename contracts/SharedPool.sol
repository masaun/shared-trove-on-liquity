// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedPool {
    using SafeMath for uint;

    uint currentUserId;

    /// [Note]: User is also "Shared-member" 
    struct User {
        address walletAddress;
        uint depositAmount;
    }
    User[] users;

    constructor() public {}

    /**
     * @notice - Users deposit this shared-pool
     * @notice - Deposited-amount of this pool is used for openTrove.
     */
    function depositToSharedPool() public payable returns (bool) {
        /// User transfer ETH into this pool contract
        uint newUserId = getNextUserId();
        currentUserId++;

        User memory user = User({
            walletAddress: msg.sender,
            depositAmount: msg.value
        });
        users.push(user);
    }


    function getNextUserId() private returns (uint _nextUserId) {
        currentUserId.add(1);
    }
    

}
