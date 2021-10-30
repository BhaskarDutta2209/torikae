const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploy the smart contract", async(taskArgs, hre) => {

  const Torikae = await hre.ethers.getContractFactory("Torikae");
  const torikae = await Torikae.deploy(0, "0x0000000000000000000000000000000000000000");
  await torikae.deployed();

  console.log(torikae.address);

})

task("verifydeploy", "Deploy the smart contracts", async(taskArgs, hre) => {

  const Torikae = await hre.ethers.getContractFactory("Torikae");
  const torikae = await Torikae.deploy(0, "0x0000000000000000000000000000000000000000");
  await torikae.deployed();

  await hre.run("verify:verify", {
    address: torikae.address,
    constructorArguments: [
      0,
      "0x0000000000000000000000000000000000000000"
    ]
  })

})

task("fund-link", "Funds a contract with LINK")
  .addParam("contract", "The address of the contract that requires LINK")
  .addOptionalParam("linkAddress", "Set the LINK token address")
  .setAction(async taskArgs => {
    // console.log(linkAddress)
    const contractAddr = taskArgs.contract
    const networkId = network.name
    console.log("Funding contract ", contractAddr, " on network ", networkId)
    const LINK_TOKEN_ABI = [{ "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

    //set the LINK token contract address according to the environment
    switch (networkId) {
      case 'mainnet':
        linkContractAddr = '0x514910771af9ca656af840dff83e8264ecf986ca'
        break
      case 'kovan':
        linkContractAddr = '0xa36085F69e2889c224210F603D836748e7dC0088'
        break
      case 'rinkeby':
        linkContractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'
        break
      case 'goerli':
        linkContractAddr = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb'
        break
      case 'mumbai':
        linkContractAddr = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
        break
      case 'fuji':
        linkContractAddr = '0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846'
        break
      default: //default to kovan
        linkContractAddr = '0xa36085F69e2889c224210F603D836748e7dC0088'
    }
    //Fund with 1 LINK token
    const amount = web3.utils.toHex(1e18)

    //Get signer information
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]

    //Create connection to LINK token contract and initiate the transfer
    const linkTokenContract = new ethers.Contract(linkContractAddr, LINK_TOKEN_ABI, signer)
    var result = await linkTokenContract.transfer(contractAddr, amount).then(function (transaction) {
      console.log('Contract ', contractAddr, ' funded with 1 LINK. Transaction Hash: ', transaction.hash)
    })
  })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: "https://matic-testnet-archive-rpc.bwarelabs.com",
      accounts: [
        process.env.PRIVATE_KEY
      ]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [
        process.env.PRIVATE_KEY
      ]
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [
        process.env.PRIVATE_KEY
      ]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};
