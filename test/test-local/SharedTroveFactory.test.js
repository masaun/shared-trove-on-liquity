/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const SharedTroveFactory = artifacts.require("SharedTroveFactory")
const IBorrowerOperations = artifacts.require("IBorrowerOperations")


/**
 * @notice - This is the test of SharedTroveFactory.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/SharedTroveFactory.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("SharedTroveFactory", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sharedTroveFactory
    let borrowerOperations

    /// Global variable for each contract addresses
    let SHARED_TROVE_FACTORY
    let BORROWER_OPERATIONS = contractAddressList["Kovan"]["Liquity"]["borrowerOperations"]

    async function getEvents(contractInstance, eventName) {
        const _latestBlock = await time.latestBlock()
        const LATEST_BLOCK = Number(String(_latestBlock))

        /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
        let events = await contractInstance.getPastEvents(eventName, {
            filter: {},
            fromBlock: LATEST_BLOCK, /// [Note]: The latest block on Kovan testnet
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
            let SharedTroveCreated = await getEvents(sharedTroveFactory, "SharedTroveCreated")
            console.log("=== event log of SharedTroveCreated ===", SharedTroveCreated)            
        })
    })

})
