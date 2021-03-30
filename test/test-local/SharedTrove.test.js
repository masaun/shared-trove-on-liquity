/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const SharedTrove = artifacts.require("SharedTrove")
const SharedTroveFactory = artifacts.require("SharedTroveFactory")
const IBorrowerOperations = artifacts.require("IBorrowerOperations")
const ITroveManager = artifacts.require("ITroveManager")


/**
 * @notice - This is the test of SharedTrove.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/SharedTrove.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("SharedTrove", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sharedTrove
    let sharedTroveFactory
    let borrowerOperations
    let troveManager

    /// Global variable for each contract addresses
    let SHARED_TROVE
    let SHARED_TROVE_FACTORY
    let BORROWER_OPERATIONS = contractAddressList["Kovan"]["Liquity"]["borrowerOperations"]
    let TROVE_MANAGER = contractAddressList["Kovan"]["Liquity"]["troveManager"]

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
        it("Deploy the SharedTroveFactory contract instance", async () => {
            sharedTroveFactory = await SharedTroveFactory.new(BORROWER_OPERATIONS, { from: deployer })
            //sharedTroveFactory = await SharedTroveFactory.new(BORROWER_OPERATIONS, TROVE_MANAGER, { from: deployer })
            SHARED_TROVE_FACTORY = sharedTroveFactory.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== SHARED_TROVE_FACTORY ===", SHARED_TROVE_FACTORY)
            console.log("=== BORROWER_OPERATIONS ===", BORROWER_OPERATIONS)
            console.log("=== TROVE_MANAGER ===", TROVE_MANAGER)
        })
    })

    describe("SharedTroveFactory", () => {
        it("A new shared-trove should be created", async () => {
            txReceipt = await sharedTroveFactory.createSharedTrove({ from: user1 })
        })          

        it("Retrieve event log of SharedTroveCreated in the SharedTroveFactory contract", async () => {
            SharedTroveCreated = await getEvents(sharedTroveFactory, "SharedTroveCreated")
            SHARED_TROVE_1 = SharedTroveCreated.sharedTrove
            console.log("=== event log of SharedTroveCreated ===", SharedTroveCreated)            
            console.log("=== SHARED_TROVE_1 ===", SHARED_TROVE_1)
        })
    })

    describe("SharedTrove", () => {
        it("A SharedTrove contract instance should be created", async () => {
            sharedTrove1 = await SharedTrove.at(SHARED_TROVE_1, { from: deployer })
        })

        it("1 ETH should be deposited into the SharedTrove1 from user1, 2, 3", async () => {
            const _depositETHAmount = web3.utils.toWei('1', 'ether')  /// 1 ETH

            let txReceipt1 = await sharedTrove1.depositToSharedPool({ from: user1, value: _depositETHAmount })
            let txReceipt2 = await sharedTrove1.depositToSharedPool({ from: user2, value: _depositETHAmount })
            let txReceipt3 = await sharedTrove1.depositToSharedPool({ from: user3, value: _depositETHAmount })
        })

        it("ETH balance of the SharedTrove1 contract (pool) should be 3 ETH", async () => {
            /// [Note]: MCR (Minimum collateral ratio for individual troves) should be more than 110%
            ///         Therefore, ETH balance of the SharedTrove1 contract (pool) should be more than around 1.5 ETH.
            let _ethBalance = await sharedTrove1.getETHBalance()
            let ethBalance = web3.utils.fromWei(String(_ethBalance), 'ether')
            assert.equal(ethBalance, "3", "ETH balance of the SharedTrove1 contract (pool) should be 3 ETH")
            console.log('=== ETH balance of the SharedTrove1 contract (pool) ===', ethBalance)
        })

        it("Open a new trove with multiple users", async () => {
            /// [Note]: 1e18 == 100%
            /// [Note]: 5e15 == minimum 0.5% (This percentage should be more than 0.5% == 5e15) 
            const _maxFee = web3.utils.toWei('0.05', 'ether')    /// 5% == 5e16

            //const _maxFee = 1000000000000000000; // 1e18 == 100%
            //const _maxFee = "50000000000000000"; // 5e16 == 5%

            const _LUSDAmount = web3.utils.toWei('2200', 'ether') /// MIN_NET_DEBT = 1950e18 (Therefore, _LUSDAmount should be more than 1950 LUSD)
            const _upperHint = user2
            const _lowerHint = user3

            /// [Test]: Execute openTrove() method by using the BorrowerOperations.sol
            /// [Note]: Transfer 2 ETH as a collateral
            // borrowerOperations = await IBorrowerOperations.at(BORROWER_OPERATIONS)
            //let txReceipt2 = await borrowerOperations.openTrove(_maxFee, _LUSDAmount, _upperHint, _lowerHint, { from: user1, value: web3.utils.toWei('2', 'ether') })  /// [Result]: Error of "BorrowerOps: Trove is active."

            /// [Note]: MCR (Minimum collateral ratio for individual troves) should be more than 110%
            ///         Therefore, ETH balance of the SharedTrove1 contract (pool) should be more than around 1.5 ETH.
            let txReceipt1 = await sharedTrove1.openTroveWithMultipleUsers(_maxFee, _LUSDAmount, _upperHint, _lowerHint, { from: user1 })
        })
    })

})
