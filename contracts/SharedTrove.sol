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

    address payable BORROWER_OPERATIONS;
    address payable TROVE_MANAGER;

    constructor(IBorrowerOperations _borrowerOperations) public SharedPool() {
        borrowerOperations = _borrowerOperations;
        BORROWER_OPERATIONS = address(uint160(address(_borrowerOperations)));  /// Payable
    }

    /**
     * @notice - Open a new trove with multiple users 
     */
    function openTroveWithMultipleUsers(uint _collateralETHAmount, uint _maxFee, uint _LUSDAmount, address _upperHint, address _lowerHint) public payable returns (bool) {
        /// [Note]: Pooled-ETH is deposited for opening a new trove.
        borrowerOperations.openTrove{ value: _collateralETHAmount }(_maxFee, _LUSDAmount, _upperHint, _lowerHint);
        //borrowerOperations.openTrove{ value: 3e18 }(_maxFee, _LUSDAmount, _upperHint, _lowerHint);  /// [Note]: collateralETHAmount is 3 ETH
    }

    /**
     * @notice - Adjust a trove with multiple users
     * @notice - Alongside a debt change, this function can perform either a collateral top-up or a collateral withdrawal. 
     * @notice - It therefore expects either a positive msg.value, or a positive _collWithdrawal argument.
     * @notice - If both are positive, it will revert.
     */
    function adjustTroveWithMultipleUsers(uint _collateralETHAmount, uint _maxFee, uint _collWithdrawal, uint _debtChange, bool isDebtIncrease, address _upperHint, address _lowerHint) public payable returns (bool) {
        borrowerOperations.adjustTrove{ value: _collateralETHAmount }(_maxFee, _collWithdrawal, _debtChange, isDebtIncrease, _upperHint, _lowerHint);
    }


    /**
     * @notice - Get ETH balance of this contract (Shared-Trove pool)
     */
    function getETHBalance() public view returns (uint _ethBalance) {
        return address(this).balance;
    }
    
}
