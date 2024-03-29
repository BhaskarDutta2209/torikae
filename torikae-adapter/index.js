/* eslint-disable */

const { Requester, Validator } = require("@chainlink/external-adapter");
require("dotenv").config();

// For web3js
const Web3 = require("web3");

// For eosjs
const { Api, JsonRpc, RpcError } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
// const fetch = require('node-fetch')
const { TextEncoder, TextDecoder } = require("util");

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === "Error") return true;
  return false;
};

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  base: ["base", "from", "coin"],
  quote: ["quote", "to", "market"],
  fchain: ["fchain", "fromchain"],
  ftoken: ["ftoken", "fromtoken"],
  tchain: ["tchain", "tochain"],
  ttoken: ["ttoken", "totoken"],
  address: ["address", "toaddress", "receiver"],
  // amount: ["amount", "baseamount"],
  endpoint: false,
};

const solidityContractABI = [{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"address","name":"_chainLinkCallerAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"_xChain","type":"string"},{"internalType":"address","name":"_sToken","type":"address"},{"internalType":"string","name":"_xToken","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"balances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chainLinkCallerAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_xChain","type":"string"},{"internalType":"address","name":"_sToken","type":"address"},{"internalType":"string","name":"_xToken","type":"string"}],"name":"createPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_xChain","type":"string"},{"internalType":"address","name":"_sToken","type":"address"},{"internalType":"string","name":"_xToken","type":"string"},{"internalType":"uint256","name":"_initialLiquidity","type":"uint256"}],"name":"createPoolWithLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_xChain","type":"string"},{"internalType":"address","name":"_sToken","type":"address"},{"internalType":"string","name":"_xToken","type":"string"}],"name":"getPoolBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_xChain","type":"string"},{"internalType":"address","name":"_sToken","type":"address"},{"internalType":"string","name":"_xToken","type":"string"}],"name":"getPoolHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolHash","type":"bytes32"},{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"receiverAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"giveout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"poolIsPresent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newCallerAddress","type":"address"}],"name":"setCaller","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee","type":"uint256"}],"name":"setFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;

  // Start the custom logic
  if (validator.validated.data.fchain === "ETH") {
    if (validator.validated.data.tchain === "EOS") {
      // EOS Chain
      const targetTokenDetails = validator.validated.data.ttoken
        .toUpperCase()
        .split("#"); // Eg: 4,EOS#eosio.code
      const targetToken = targetTokenDetails[0];
      const targetTokenContract = targetTokenDetails[1].toLowerCase();
      const targetaccount = validator.validated.data.address.toLowerCase();
      console.log(
        "Target Token: " + targetToken + " of " + targetTokenContract
      );
    } else if (validator.validated.data.tchain === "POLYGON") {
      // Polygon Chain
      const targetTokenAddress = validator.validated.data.ttoken;
      const targetAccount = validator.validated.data.address;
      console.log(
        "Target Token: " + targetTokenAddress + " to " + targetAccount
      );

      // Get from token balance

      // Get to token balance

      // Calculate rate

      // Call target blockchain

      // Provide feedback
    }
  } // ETH blockchain
  else if (validator.validated.data.fchain === "POLYGON") {
    const web3 = new Web3(`https://matic-testnet-archive-rpc.bwarelabs.com`);
    const from_contract = new web3.eth.Contract(
      solidityContractABI,
      process.env.POLYGON_CONTRACT_ADDRESS
    );

    if (validator.validated.data.tchain === "EOS") {
    } else if (validator.validated.data.tchain === "TLOS") {
      from_contract.methods
        .getPoolBalance(
          validator.validated.data.tchain,
          validator.validated.data.ftoken,
          validator.validated.data.ttoken
        )
        .call({ from: process.env.PUBLIC_KEY })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (validator.validated.data.tchain === "BSC") {
      calculateRateWeb3(
        "https://matic-testnet-archive-rpc.bwarelabs.com",
        "https://data-seed-prebsc-1-s2.binance.org:8545/",
        process.env.POLYGON_CONTRACT_ADDRESS,
        process.env.BSC_CONTRACT_ADDRESS,
        "POLYGON",
        "BSC",
        validator.validated.data.ftoken,
        validator.validated.data.ttoken
      ).then((res) => {
        console.log("rate= ", res);
        giveoutWeb3(
          "https://data-seed-prebsc-1-s2.binance.org:8545/",
          process.env.BSC_CONTRACT_ADDRESS,
          "POLYGON",
          validator.validated.data.ftoken,
          validator.validated.data.ttoken,
          validator.validated.data.address,
          0
        ).then();
      });
    }
  } // POLYGON blockchain

  const endpoint = validator.validated.data.endpoint || "price";
  const url = `https://min-api.cryptocompare.com/data/${endpoint}`;
  const fsym = validator.validated.data.base.toUpperCase();
  const tsyms = validator.validated.data.quote.toUpperCase();

  const params = {
    fsym,
    tsyms,
  };

  // This is where you would add method and headers
  // you can add method like GET or POST and add it to the config
  // The default is GET requests
  // method = 'get'
  // headers = 'headers.....'
  const config = {
    url,
    params,
  };

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then((response) => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data.result = Requester.validateResultNumber(response.data, [
        tsyms,
      ]);
      callback(response.status, Requester.success(jobRunID, response));
    })
    .catch((error) => {
      callback(500, Requester.errored(jobRunID, error));
    });
};

async function calculateRateWeb3(
  from_rpc,
  to_rpc,
  from_contract_addr,
  to_contract_addr,
  fchain,
  tchain,
  ftoken,
  ttoken
) {
  const from_web3 = new Web3(from_rpc);
  const from_contract = new from_web3.eth.Contract(
    solidityContractABI,
    from_contract_addr
  );

  const to_web3 = new Web3(to_rpc);
  const to_contract = new to_web3.eth.Contract(
    solidityContractABI,
    to_contract_addr
  );

  const from_balance = await from_contract.methods
    .getPoolBalance(tchain, ftoken, ttoken)
    .call({ from: process.env.PUBLIC_KEY });
  console.log("balance1 => ", from_balance);

  const to_balance = await to_contract.methods
    .getPoolBalance(fchain, ttoken, ftoken)
    .call({ from: process.env.PUBLIC_KEY });
  console.log("balance2 => ", to_balance);

  const rate = to_balance / from_balance;
  return rate;
}

async function getPoolHashWeb3(rpc, contract_addr, chain, stoken, xtoken) {
  const web3 = new Web3(rpc);
  const contract = new web3.eth.Contract(solidityContractABI, contract_addr);

  const poolHash = await contract.methods
    .getPoolHash(chain, stoken, xtoken)
    .call({ from: process.env.PUBLIC_KEY });

  return poolHash;
}

async function giveoutWeb3(
  to_rpc,
  to_contract_addr,
  fchain,
  ftoken,
  ttoken,
  receiver,
  amount
) {
  const to_web3 = new Web3(to_rpc);
  const to_contract = new to_web3.eth.Contract(
    solidityContractABI,
    to_contract_addr
  );
  const hash = await getPoolHashWeb3(
    to_rpc,
    to_contract_addr,
    fchain,
    ttoken,
    ftoken
  ).then(res => {
    console.log(res)
  })

  // const tx = await to_contract.methods
  //   .giveout(hash, ttoken, receiver, amount)
  //   .send({ from: process.env.PRIVATE_KEY, gas: "1000000" });
}

exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

module.exports.createRequest = createRequest;
