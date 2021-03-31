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
const BorrowerOperations = artifacts.require("BorrowerOperations")
const IBorrowerOperations = artifacts.require("IBorrowerOperations")
const ILUSDToken = artifacts.require("ILUSDToken")


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

        // it("Deploy the BorrowerOperations contract", async () => {
        //     borrowerOperations = await BorrowerOperations.new(TROVE_MANAGER,
        //                                                        ACTIVE_POOL, 
        //                                                        DEFAULT_POOL, 
        //                                                        STABILITY_POOL, 
        //                                                        GAS_POOL, 
        //                                                        COLL_SURPLUS_POOL, 
        //                                                        PRICE_FEED,
        //                                                        SORTED_TROVES,
        //                                                        LUSD_TOKEN,
        //                                                        LQTY_STAKING, 
        //                                                        { from: deployer })
        //     BORROWER_OPERATIONS = borrowerOperations.address
        // })

        it("Deploy the SharedTroveFactory contract", async () => {
            sharedTroveFactory = await SharedTroveFactory.new(BORROWER_OPERATIONS, { from: deployer })
            //sharedTroveFactory = await SharedTroveFactory.new(BORROWER_OPERATIONS, TROVE_MANAGER, { from: deployer })
            SHARED_TROVE_FACTORY = sharedTroveFactory.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== SHARED_TROVE_FACTORY ===", SHARED_TROVE_FACTORY)
            console.log("=== BORROWER_OPERATIONS ===", BORROWER_OPERATIONS)
            console.log("=== LUSD_TOKEN ===", LUSD_TOKEN)
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

        it("ETH balance of the SharedTrove1 pool contract (pool) should be 3 ETH", async () => {
            /// [Note]: MCR (Minimum collateral ratio for individual troves) should be more than 110%
            ///         Therefore, ETH balance of the SharedTrove1 contract (pool) should be more than around 1.5 ETH.
            let _ethBalance = await sharedTrove1.getETHBalance()
            let ethBalance = web3.utils.fromWei(String(_ethBalance), 'ether')
            assert.equal(ethBalance, "3", "ETH balance of the SharedTrove1 contract (pool) should be 3 ETH")
            console.log('=== ETH balance of the SharedTrove1 contract (pool) ===', ethBalance)
        })

        it("Open a new trove with multiple users. (Batched top-ups)", async () => {
            const _collateralETHAmount = web3.utils.toWei('3', 'ether') /// 3 ETH

            /// [Note]: 1e18 == 100%
            /// [Note]: 5e15 == minimum 0.5% (This percentage should be more than 0.5% == 5e15) 
            const _maxFee = web3.utils.toWei('0.05', 'ether')     /// 5% == 5e16
            const _LUSDAmount = web3.utils.toWei('2000', 'ether') /// MIN_NET_DEBT = 1950e18 (Therefore, _LUSDAmount should be more than 1950 LUSD)
            const _upperHint = "0x0224588b20e1042264F0B55687cEAA450EEfc300"
            const _lowerHint = "0xCE6339181bA6257A339C66f06FC367298b5987E3"

            /// [Note]: Open a new trove by depositing 3 ETH as a collateral
            /// [Note]: MCR (Minimum collateral ratio for individual troves) should be more than 110% (Roughly more than 1.5 ETH is needed)
            let txReceipt1 = await sharedTrove1.openTroveWithMultipleUsers(_collateralETHAmount, _maxFee, _LUSDAmount, _upperHint, _lowerHint, { from: user3 })
        })

        it("LUSD Token balance of the SharedTrove1 pool contract should be 2000 LUSD", async () => {
            let _LUSDBalance = await lusdToken.balanceOf(SHARED_TROVE_1)
            let LUSDBalance = String(_LUSDBalance)
            let LUSD_BALANCE = web3.utils.fromWei(LUSDBalance, 'ether')
            console.log('=== LUSD Token Balance of the SharedTrove1 pool contract ===', web3.utils.fromWei(LUSDBalance, 'ether'))
            assert.equal(LUSD_BALANCE, "2000", "LUSD Token balance of the SharedTrove1 pool should be 2000 LUSD")
        })

        it("Adjust a existing trove with multiple users. (Batched adjustments and top-ups)", async () => {
            const _collateralETHAmount = web3.utils.toWei('1', 'ether') /// 1 ETH as additional collateral
            const _maxFee = web3.utils.toWei('0.05', 'ether')           /// 5% == 5e16
            const _collWithdrawal = web3.utils.toWei('0', 'ether')      /// Withdrawn-ETH as a collateral is 0 ETH
            const _debtChange = web3.utils.toWei('100', 'ether')        /// Debt 100 LUSD as additional debt 
            const _isDebtIncrease = true
            const _upperHint = "0x0224588b20e1042264F0B55687cEAA450EEfc300"
            const _lowerHint = "0xCE6339181bA6257A339C66f06FC367298b5987E3"

            let txReceipt1 = await sharedTrove1.adjustTroveWithMultipleUsers(_collateralETHAmount, _maxFee, _collWithdrawal, _debtChange, _isDebtIncrease, _upperHint, _lowerHint, { from: user3 })
        })

        it("Withdraw collateral ETH from a existing trove with multiple users. (Batched withdrawals)", async () => {
            /// [Todo]:
        })
    })

})
