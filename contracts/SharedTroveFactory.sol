// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { IBorrowerOperations } from "./liquity/interfaces/IBorrowerOperations.sol";
import { SharedTrove } from "./SharedTrove.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedTroveFactory {

    event SharedTroveCreated(address sharedTrove);

    IBorrowerOperations public borrowerOperations;

    constructor(IBorrowerOperations _borrowerOperations) public {
        borrowerOperations = _borrowerOperations;        
    }

    /**
     * @notice - Create a new shared-trove
     */
    function createSharedTrove() public returns (bool) {
        SharedTrove sharedTrove = new SharedTrove(borrowerOperations);
        address SHARED_TROVE = address(sharedTrove);

        emit SharedTroveCreated(SHARED_TROVE);
    }

}
