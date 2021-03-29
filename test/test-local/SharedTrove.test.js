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

    /// Global variable for each contract addresses
    let SHARED_TROVE
    let SHARED_TROVE_FACTORY
    let BORROWER_OPERATIONS = contractAddressList["Kovan"]["Liquity"]["borrowerOperations"]

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
            SHARED_TROVE_FACTORY = sharedTroveFactory.address
        })

        // it("Retrieve event log of SharedTroveCreated in the SharedTroveFactory contract", async () => {
        //     let SharedTroveCreated = await getEvents(sharedTroveFactory, "SharedTroveCreated")
        //     console.log("=== event log of SharedTroveCreated ===", SharedTroveCreated)            
        // })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== SHARED_TROVE_FACTORY ===", SHARED_TROVE_FACTORY)
            console.log("=== BORROWER_OPERATIONS ===", BORROWER_OPERATIONS)
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

        it("0.1 ETH should be deposited into the SharedTrove1 from user1, 2, 3", async () => {
            const _depositETHAmount = web3.utils.toWei('0.1', 'ether')  /// 0.1 ETH

            let txReceipt1 = await sharedTrove1.depositToSharedPool({ from: user1, value: _depositETHAmount })
            let txReceipt2 = await sharedTrove1.depositToSharedPool({ from: user2, value: _depositETHAmount })
            let txReceipt3 = await sharedTrove1.depositToSharedPool({ from: user3, value: _depositETHAmount })
        })

        it("ETH balance of the SharedTrove1 contract (pool) should be 0.3 ETH", async () => {
            /// [Todo]:
            // let ethBalance = await 
            // assert.equal()
        })

        it("Open a new trove with multiple users", async () => {
            const _maxFee = web3.utils.toWei('0.05', 'ether') /// 5% (This percentage should be more than 5e15) 
            const _LUSDAmount = web3.utils.toWei('10', 'ether')
            const _upperHint = user1
            const _lowerHint = user2

            /// [Todo]: Deposited-ETH amount should be calculated depends on LUSD amount by using Chainlink's Price Feed
            let txReceipt1 = await sharedTrove1.openTroveWithMultipleUsers(_maxFee, _LUSDAmount, _upperHint, _lowerHint, { from: user1 })
        })
    })

})
