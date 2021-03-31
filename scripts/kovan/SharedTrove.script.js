require('dotenv').config();

const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${ process.env.INFURA_KEY }`);
const web3 = new Web3(provider);

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const SharedTrove = require("../../build/contracts/SharedTrove")
const SharedTroveFactory = require("../../build/contracts/SharedTroveFactory")
const IBorrowerOperations = require("../../build/contracts/IBorrowerOperations")
const ILUSDToken = require("../../build/contracts/ILUSDToken")

/// User's wallet and private-key
const walletAddress1 = process.env.USER_1_WALLET
const walletAddress2 = process.env.USER_2_WALLET
const privateKey1 = process.env.PRIVATE_KEY_OF_USER_1_WALLET
const privateKey2 = process.env.PRIVATE_KEY_OF_USER_2_WALLET


/* Global variable */

/* Set up contract */



/***
 * @notice - Execute all methods
 **/
async function main() {
    method1()
    method2()
}
main();



/*** 
 * @dev - 
 **/
async function method1() {
}

/*** 
 * @dev - Call getAuthTokenList() of NftAuthTokenManager contract
 **/
async function method2() {
}



/***
 * @notice - Sign and Broadcast the transaction
 **/
async function sendTransaction(walletAddress, privateKey, contractAddress, inputData) {
    try {
        const txCount = await web3.eth.getTransactionCount(walletAddress);
        const nonce = await web3.utils.toHex(txCount);
        console.log('=== txCount, nonce ===', txCount, nonce);

        /// Build the transaction
        const txObject = {
            nonce:    web3.utils.toHex(txCount),
            from:     walletAddress,
            to:       contractAddress,  /// Contract address which will be executed
            value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
            gasLimit: web3.utils.toHex(2100000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
            data: inputData  
        }
        console.log('=== txObject ===', txObject)

        /// Sign the transaction
        privateKey = Buffer.from(privateKey, 'hex');
        let tx = new Tx(txObject, { 'chain': 'kovan'});  /// Chain ID = kovan
        tx.sign(privateKey);

        const serializedTx = tx.serialize();
        const raw = '0x' + serializedTx.toString('hex');

        /// Broadcast the transaction
        const transaction = await web3.eth.sendSignedTransaction(raw);
        console.log('=== transaction ===', transaction)

        /// Return the result above
        return transaction;
    } catch(e) {
        console.log('=== e ===', e);
        return String(e);
    }
}
