const axios = require('axios');
const { erc20Abi } = require('../abi/erc20');
const { config } = require('../web3');
require('dotenv').config()
const Web3 = require("web3");


async function getCurrentGasPrices(mode) {
  console.log("mode", mode)
  let response = await axios.get(`${process.env.ETHER_SCAN_URL}`);
  switch (mode) {
    case "low":
      return response.data.data.slow;
    case "medium":
      return response.data.data.standard;
    case "fast":
      return response.data.data.rapid;
    default:
      return null;
  }
}


function getCurrentGasMultiplier(mode) {
  console.log("mode", mode)
  switch (mode) {
    case "low":
      return 3;
    case "medium":
      return 3.5;
    case "fast":
      return 5;
    default:
      return null;
  }
}



const getPublicKey = async (web3, private_key) => {
  let publicKeyAccount = await web3.eth.accounts.privateKeyToAccount(private_key);
  if (publicKeyAccount == null) throw "invalid private key";
  const publicKey = publicKeyAccount.address;
  return publicKey;
}


const sendSignedTransaction = async (
  web3,
  to_address,
  private_key,
  gasPrice,
  data,
) => {
  try {
    const publicKey = await getPublicKey(web3, private_key);
    let txCount = await web3.eth.getTransactionCount(publicKey);

    let txObject;
    txObject = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(2000000),
      gasPrice: web3.utils.toHex(gasPrice),
      to: to_address,
      data: data,
    };



    const signTransaction = await web3.eth.accounts.signTransaction(
      txObject,
      private_key
    );

    const tranasctionReceipt = await web3.eth.sendSignedTransaction(
      signTransaction.rawTransaction
    );
    console.log("tranasctionReceipt", tranasctionReceipt);
    return tranasctionReceipt;
  } catch (error) {
    console.log(error);
    if (error.receipt !== undefined) return error.receipt;
    return error;
  }
};

const getDecimals = async (tokenAddress) => {
  try {
    const web3 = new Web3(process.env.RPC_URL);
    const contract = new web3.eth.Contract(
      erc20Abi,
      tokenAddress
    );
    const decimals = await contract.methods.decimals().call();
    return +decimals;
  } catch (error) {
    console.log('error in decimals func', error);
  }
}

const userBalance = async (tokenAddress, userAdddress) => {
  try {
    const web3 = new Web3(process.env.RPC_URL);
    const contract = new web3.eth.Contract(
      erc20Abi,
      tokenAddress
    );
    const balance = await contract.methods.balanceOf(userAdddress).call();
    return +balance;
  } catch (error) {
    console.log('error in balance of func', error);
  }
}

module.exports = {
  sendSignedTransaction,
  getPublicKey,
  getCurrentGasPrices,
  getCurrentGasMultiplier,
  getDecimals,
  userBalance
};
