// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedPool {
    using SafeMath for uint;

    uint currentSharedMemberId;

    struct SharedMember {
        address walletAddress;
        uint depositAmount;
    }
    SharedMember[] sharedMembers;

    constructor() public {}

    /**
     * @notice - SharedMembers deposit this shared-pool
     * @notice - Deposited-amount of this pool is used for openTrove.
     */
    function depositToSharedPool() public payable returns (bool) {
        /// SharedMember transfer ETH into this pool contract
        //uint newSharedMemberId = getNextSharedMemberId();
        currentSharedMemberId++;

        SharedMember memory sharedMember = SharedMember({
            walletAddress: msg.sender,
            depositAmount: msg.value
        });
        sharedMembers.push(sharedMember);
    }

    function getSharedMember(uint sharedMemberId) private returns (SharedMember memory _sharedMember) {
        uint index = sharedMemberId.sub(1);
        SharedMember memory sharedMember = sharedMembers[index];
        return sharedMember;
    }

    function getNextSharedMemberId() private returns (uint _nextSharedMemberId) {
        return currentSharedMemberId.add(1);
    }

}
