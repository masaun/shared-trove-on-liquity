// SPDX-License-Identifier: MIT
pragma solidity 0.6.11;

import { IBorrowerOperations } from "./liquity/interfaces/IBorrowerOperations.sol";
import { ITroveManager } from "./liquity/interfaces/ITroveManager.sol";

import { SharedPool } from "./SharedPool.sol";


/**
 * @notice - This is a smart contract that 
 */
contract SharedTrove is SharedPool {

    IBorrowerOperations public borrowerOperations;
    //ITroveManager public troveManager;

    address payable BORROWER_OPERATIONS;
    address payable TROVE_MANAGER;

    constructor(IBorrowerOperations _borrowerOperations) public SharedPool() {
    //constructor(IBorrowerOperations _borrowerOperations, ITroveManager _troveManager) public SharedPool() {
        borrowerOperations = _borrowerOperations;
        //troveManager = _troveManager;
        BORROWER_OPERATIONS = address(uint160(address(_borrowerOperations)));  /// Payable
        //TROVE_MANAGER = address(uint160(address(_troveManager)));              /// Payable
    }

    /**
     * @notice - This pool contract execute openTrove() 
     */
    function openTroveWithMultipleUsers(uint _collateralETHAmount, uint _maxFee, uint _LUSDAmount, address _upperHint, address _lowerHint) public payable returns (bool) {
        /// [Note]: Pooled-ETH is deposited for opening a new trove.
        borrowerOperations.openTrove{ value: _collateralETHAmount }(_maxFee, _LUSDAmount, _upperHint, _lowerHint);
        //borrowerOperations.openTrove{ value: 3e18 }(_maxFee, _LUSDAmount, _upperHint, _lowerHint);  /// [Note]: collateralETHAmount is 3 ETH
    }


    /**
     * @notice - Get ETH balance of this contract (Shared-Trove pool)
     */
    function getETHBalance() public view returns (uint _ethBalance) {
        return address(this).balance;
    }
    
}
