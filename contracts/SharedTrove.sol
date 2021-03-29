// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { IBorrowerOperations } from "./liquity/interfaces/IBorrowerOperations.sol";
import { SharedPool } from "./SharedPool.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedTrove is SharedPool {

    IBorrowerOperations public borrowerOperations;

    address BORROWER_OPERATIONS;

    constructor(IBorrowerOperations _borrowerOperations) public SharedPool() {
        borrowerOperations = _borrowerOperations;
        BORROWER_OPERATIONS = address(_borrowerOperations);
    }

    /**
     * @notice - This pool contract execute openTrove() 
     */
    function openTroveWithMultipleUsers(uint _depositETHAmount, uint _maxFee, uint _LUSDAmount, address _upperHint, address _lowerHint) public returns (bool) {
        /// [Note]: Pooled-ETH is deposited for opening a new trove.
        BORROWER_OPERATIONS.transfer(_depositETHAmount);
        borrowerOperations.openTrove(_maxFee, _LUSDAmount, _upperHint, _lowerHint);
    }


    /**
     * @notice - Get ETH balance of this contract (Shared-Trove pool)
     */
    function getETHBalance() public returns (uint _ethBalance) {
        return address(this).balance;
    }
    
}
