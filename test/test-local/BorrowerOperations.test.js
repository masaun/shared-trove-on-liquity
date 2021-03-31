/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const IBorrowerOperations = artifacts.require("IBorrowerOperations")
const ILUSDToken = artifacts.require("ILUSDToken")


/**
 * @notice - This is the test of BorrowerOperations.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/BorrowerOperations.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("BorrowerOperations", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sharedTrove
    let sharedTroveFactory
    let borrowerOperations
    let lusdToken

    /// Global variable for each contract addresses
    let SHARED_TROVE
    let SHARED_TROVE_FACTORY
    //let BORROWER_OPERATIONS
    let BORROWER_OPERATIONS = contractAddressList["Kovan"]["Liquity"]["borrowerOperations"]
    let TROVE_MANAGER = contractAddressList["Kovan"]["Liquity"]["troveManager"]
    let ACTIVE_POOL = contractAddressList["Kovan"]["Liquity"]["activePool"]
    let DEFAULT_POOL = contractAddressList["Kovan"]["Liquity"]["defaultPool"]
    let STABILITY_POOL = contractAddressList["Kovan"]["Liquity"]["stabilityPool"]
    let GAS_POOL = contractAddressList["Kovan"]["Liquity"]["gasPool"]
    let COLL_SURPLUS_POOL = contractAddressList["Kovan"]["Liquity"]["collSurplusPool"]
    let PRICE_FEED = contractAddressList["Kovan"]["Liquity"]["priceFeed"]
    let SORTED_TROVES = contractAddressList["Kovan"]["Liquity"]["sortedTroves"]
    let LUSD_TOKEN = tokenAddressList["Kovan"]["Liquity"]["lusdToken"]
    let LQTY_STAKING = contractAddressList["Kovan"]["Liquity"]["lqtyStaking"]

    /// Global variable for each shared-trove
    let sharedTrove1
    let sharedTrove2
    let sharedTrove3
    let SHARED_TROVE_1
    let SHARED_TROVE_2
    let SHARED_TROVE_3

    async function getEvents(contractInstance, eventName) {
        const _latestBlock = await time.latestBlock()
        const LATEST_BLOCK = Number(String(_latestBlock))

        /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
        let events = await contractInstance.getPastEvents(eventName, {
            filter: {},
            fromBlock: LATEST_BLOCK,  /// [Note]: The latest block on Kovan testnet
            //fromBlock: 0,
            toBlock: 'latest'
        })
        //console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
        return events[0].returnValues
    } 

    describe("Setup smart-contracts", () => {
        it("Create the LUSDToken contract instance", async () => {
            lusdToken = await ILUSDToken.at(LUSD_TOKEN)
        })

        it("Create the BorrowerOperations contract instance", async () => {
            borrowerOperations = await IBorrowerOperations.at(BORROWER_OPERATIONS)
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== SHARED_TROVE_FACTORY ===", SHARED_TROVE_FACTORY)
            console.log("=== BORROWER_OPERATIONS ===", BORROWER_OPERATIONS)
            console.log("=== LUSD_TOKEN ===", LUSD_TOKEN)
        })
    })

    describe("BorrowerOperations", () => {
        it("Open a new trove", async () => {
            /// [Note]: 1e18 == 100%
            /// [Note]: 5e15 == minimum 0.5% (This percentage should be more than 0.5% == 5e15) 
            const _maxFee = web3.utils.toWei('0.05', 'ether')     /// 5% == 5e16
            const _LUSDAmount = web3.utils.toWei('2000', 'ether') /// MIN_NET_DEBT = 1950e18 (Therefore, _LUSDAmount should be more than 1950 LUSD)
            const _upperHint = user2
            const _lowerHint = user3

            const _collateralETH = web3.utils.toWei('3', 'ether')

            /// [Test]: Execute openTrove() method by using the BorrowerOperations.sol
            /// [Note]: Transfer 2 ETH as a collateral
            let txReceipt = await borrowerOperations.openTrove(_maxFee, _LUSDAmount, _upperHint, _lowerHint, { from: user1, value: _collateralETH })  /// [Result]: Successful. (Be able to retrieve 3 events)
        })

        it("LUSD Token balance of user1 should be 2000 LUSD", async () => {
            let _LUSDBalance = await lusdToken.balanceOf(user1)
            let LUSDBalance = String(_LUSDBalance)
            let LUSD_BALANCE = web3.utils.fromWei(LUSDBalance, 'ether')
            console.log('=== LUSD Token Balance of user1 ===', web3.utils.fromWei(LUSDBalance, 'ether'))
            assert.equal(LUSD_BALANCE, "2000", "LUSD Token balance of user1 should be 2000 LUSD")
        })        

        // it("Close a existing trove", async () => {
        //     /// [Note]: Caller of closeTrove() method must be the BorrowerOperations contract
        //     let txReceipt = await borrowerOperations.closeTrove({ from: user1 })  /// [Result]: 
        // })
    })

})