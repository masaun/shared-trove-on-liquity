// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { IBorrowerOperations } from "./IBorrowerOperations.sol";
import { SharedPool } from "./SharedPool.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedTrove is SharedPool {

    IBorrowerOperations public borrowerOperations;

    constructor(IBorrowerOperations _borrowerOperations) public SharedPool() {
        borrowerOperations = _borrowerOperations;
    }

    /**
     * @notice - This pool contract execute openTrove() 
     */
    function openTroveWithMultipleUsers(uint _maxFee, uint _LUSDAmount, address _upperHint, address _lowerHint) public returns (bool) {
        /// [Note]: Pooled-ETH is deposited for opening a new trove.
        borrowerOperations.openTrove(_maxFee, _LUSDAmount, _upperHint, _lowerHint);
    }

}
