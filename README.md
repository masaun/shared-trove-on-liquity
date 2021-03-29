# Shared-Trove on Liquity

***
## 【Introduction of the Shared-Trove on Liquity】
- This is a smart contract that: 

&nbsp;

***

## 【Workflow】
- Diagram of workflow  

&nbsp;

***

## 【Remarks】
- Version for following the `Liquity` smart contract
  - Solidity (Solc): v0.6.11
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.2.0
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
$ npm install
```

<br>

### ② Compile & migrate contracts (on local)
```
$ npm run migrate:local
```

<br>

### ③ Test (Kovan-fork approach)
- 1: Start ganache-cli with kovan-fork
```
$ ganache-cli -d --fork https://kovan.infura.io/v3/{YOUR INFURA KEY}@{BLOCK_NUMBER}
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)

<br>

- 2: Execute test of the smart-contracts (on the local)
  - Test for the SharedTroveFactory contract
    `$ npm run test:SharedTroveFactory`
    ($ truffle test ./test/test-local/SharedTroveFactory.test.js)

<br>


***

## 【References】
- Liquity
  - GR9 Prize：https://gitcoin.co/issue/liquity/beta/4/100025007
  - dApp on Kovan：https://devui.liquity.org/latest/
  - Smart contract：https://github.com/liquity/beta
  - Deployed-addresses on Kovan：https://github.com/liquity/liquity/blob/master/packages/lib-ethers/deployments/default/kovan.json

