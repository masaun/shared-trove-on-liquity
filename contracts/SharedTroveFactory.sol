// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { IBorrowerOperations } from "./liquity/interfaces/IBorrowerOperations.sol";
//import { ITroveManager } from "./liquity/interfaces/ITroveManager.sol";
import { SharedTrove } from "./SharedTrove.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedTroveFactory {

    event SharedTroveCreated(address sharedTrove);

    IBorrowerOperations public borrowerOperations;
    //ITroveManager public troveManager;

    constructor(IBorrowerOperations _borrowerOperations) public {
    //constructor(IBorrowerOperations _borrowerOperations, ITroveManager _troveManager) public {
        borrowerOperations = _borrowerOperations;
        //troveManager = _troveManager;
    }

    /**
     * @notice - Create a new shared-trove
     */
    function createSharedTrove() public returns (bool) {
        SharedTrove sharedTrove = new SharedTrove(borrowerOperations);
        //SharedTrove sharedTrove = new SharedTrove(borrowerOperations, troveManager);
        address SHARED_TROVE = address(sharedTrove);

        emit SharedTroveCreated(SHARED_TROVE);
    }

}
