const { GetAllActiveOrders, OrderFilled } = require("../models/index");
const { ethers } = require("ethers");
const Web3 = require("web3");
const {
  sendSignedTransaction,
  getPublicKey,
  getCurrentGasPrices,
  getCurrentGasMultiplier,
  getDecimals,
  userBalance,
} = require("../helpers");
require("dotenv").config();
const { routerAbi } = require("../abi/router");
const { swapTokenAbi, swapAbi } = require("../abi/swap");
const { providerRpc, router, tokens } = require("../utils/constants");

//mainnet config
let config = {
  transactionStatus: true,
  parentAddress: null,
  web3: null,

  rpcUrl: process.env.RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  childAddress: process.env.CHILD_ADDRESS,
  gasLimit: process.env.GAS_LIMIT,
  //low, medium, fast
  gasMode: process.env.GAS_MODE,
  gasMultiplier: process.env.GAS_MULTIPLIER,
  plateformFee: process.env.PLATFORM_FEE,
  // mainnet
  // weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",

  // rinkeby
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  platformAddress: "0x011443CCccabf001BE7Ca628225a69Ea220935E1",
  swapContractAddress: "0xB8825f33531E6e7b2288128d3dd6C0546F4d7C47",
  factory: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f", //uniswap factory
  routerAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  routerAbi: routerAbi,
  swapAbi: swapAbi,
  routerContract: null,
  swapContract: null,

  deadLine: 5,
};

const loadWeb3 = async () => {
  try {
    const web3 = new Web3(config.rpcUrl);
    config.web3 = web3;
    const parentAddress = await getPublicKey(web3, config.privateKey);
    config.parentAddress = parentAddress;

    const routerContract = new web3.eth.Contract(
      config.routerAbi,
      config.routerAddress
    );
    const swapContract = new web3.eth.Contract(
      config.swapAbi,
      config.swapContractAddress
    );
    config.routerContract = routerContract;
    config.swapContract = swapContract;

    return config;
  } catch (error) {
    console.log("error", error);
  }
};

const ETHAddress = "0x0000000000000000000000000000000000000000";
const getSwapAmount = async (type, amount, chainId, tokenAddress) => {
  try {
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let routerInstance = new ethers.Contract(
      router[chainId],
      routerAbi,
      provider
    );
    let WETH =
      Number(chainId) !== 43114
        ? await routerInstance.WETH()
        : await routerInstance.WAVAX();
    console.log(WETH, "WETH");

    let inDecimals = tokens[chainId].find(
      (el) => el.address === ETHAddress
    ).decimals;
    const decimal = await getDecimals(tokenAddress);
    let outDecimals = decimal.toString();
    console.log(outDecimals, "decimallsss out");
    let path;

    switch (type) {
      case "first":
        if (amount > 0) {
          path = [WETH, tokenAddress];
          console.log("pathpath first", path);
          let amountsOut = await routerInstance.getAmountsOut(amount, path);
          console.log(
            "amountsOut",
            amountsOut,
            ethers.utils.parseUnits(amount, inDecimals)
          );
          return ethers.utils.formatUnits(amountsOut.at(-1), inDecimals);
        }
        break;
      case "second":
        if (amount > 0) {
          path = [WETH, tokenAddress];
          console.log("pathpath second", path, amount);
          let amountsIn = await routerInstance.getAmountsIn(amount, path);
          console.log(
            "amountsIn",
            ethers.utils.formatUnits(amountsIn[0], inDecimals),
            outDecimals
          );

          return ethers.utils.formatUnits(amountsIn[0], inDecimals);
        }
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error, "error in swap amount");
  }
};

const eventWatcher = async () => {
  try {
    const web3 = config.web3;
    const routerContract = config.routerContract;
    const swapContract = config.swapContract;
    // console.log("swap contract", swapContract)
    const wethAddress = config.weth.toLowerCase();
    // const deadLine = config.deadLine;
    let recipientAddress;
    if (web3) {
      config.transactionStatus = false;
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = (
        Number(gasPrice) * getCurrentGasMultiplier(config.gasMode)
      ).toFixed(0);
      let orders = await GetAllActiveOrders();

      const mapValues = orders.map(async (item) => {
        let ethAmount = (item.ethAmount * 10 ** 18).toFixed(0);
        let tokenAmount = (item.tokenAmount * 10 ** item.decimals).toFixed(0);

        if (item.type === "Sell") {
          ethAmount = await getSwapAmount(
            "second",
            tokenAmount,
            item.network,
            item.tokenAddress
          );

          ethAmount = (ethAmount * 10 ** 18).toFixed(0);
          const currentPrice = (ethAmount / item.tokenAmount).toFixed(0);
          ethAmount = (ethAmount * 0.83).toFixed(0);

          console.log(
            ethAmount,
            item.tokenAddress,
            wethAddress,
            tokenAmount,
            item.price,
            currentPrice,
            "ethAmounttt in sell"
          );
          const highEndPrice = (item.price * 4) / 100 + item.price;

          const balance = await userBalance(
            item.tokenAddress,
            item.userAddress
          );
          const fees = (tokenAmount * config.plateformFee) / 100;

          if (
            currentPrice >= item.price &&
            currentPrice <= highEndPrice &&
            balance >= tokenAmount + fees
          ) {
            let data = await swapContract.methods
              .swapSellToken(
                config.routerAddress,
                tokenAmount, //amount in
                ethAmount,
                item.tokenAddress,
                wethAddress,
                item.userAdddress,
                config.platformAddress,
                fees
              )
              .encodeABI();
            let receipt = await sendSignedTransaction(
              web3,
              config.swapContractAddress,
              config.privateKey,
              gasPrice,
              data
            );
            console.log("receipt", receipt, receipt.status);
            if (receipt.status) {
              const updatedStatus = await OrderFilled(item._id);
            }
          }
        }

        if (item.type === "Buy") {
          let currentPrice = await getSwapAmount(
            "first",
            "1000000000000000000",
            item.network,
            item.tokenAddress
          );

          tokenAmount = (tokenAmount * 0.83).toFixed(); // slipage amount
          const lowEndPrice = item.price - (item.price * 4) / 100;

          console.log(
            ethAmount,
            item.tokenAddress,
            wethAddress,
            tokenAmount,
            item.price,
            currentPrice,
            item.price / 10 ** 18,
            "ethAmounttt"
          );

          const balance = await userBalance(config.weth, item.userAddress);
          const fees = (ethAmount * config.plateformFee) / 100;

          if (
            currentPrice <= item.price &&
            currentPrice >= lowEndPrice &&
            balance >= ethAmount + fees
          ) {
            let data = await swapContract.methods
              .swapBuyToken(
                config.routerAddress,
                ethAmount, //amount in
                tokenAmount,
                wethAddress,
                item.tokenAddress,
                item.userAdddress,
                config.platformAddress,
                fees
              )
              .encodeABI();
            let receipt = await sendSignedTransaction(
              web3,
              config.swapContractAddress,
              config.privateKey,
              gasPrice,
              data
            );
            console.log("receipt", receipt, receipt.status);
            if (receipt.status) {
              const updatedStatus = await OrderFilled(item._id);
            }
          }
        }
      });
      Promise.all(mapValues).then((data) => {
        config.transactionStatus = true;
      });
    } else {
      config.transactionStatus = true;
    }
  } catch (error) {
    config.transactionStatus = true;

    console.log("error", error);
  }
};

module.exports = {
  loadWeb3,
  config,
  eventWatcher,
};
