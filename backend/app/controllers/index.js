const {
  GetUserOrders,
  SaveOrder,
  CancelOrder,
  GetPrice,
} = require("../models/index");
const { config } = require("../web3");

const getUserOrders = async (ctx) => {
  try {
    //fetching json from body
    const userAddress = ctx.params.user_address.toLowerCase();
    const res = await GetUserOrders(userAddress);
    //returning that json in response
    ctx.body = res;
  } catch (error) {
    console.error(error);

    ctx.body = "Error";
  }
};

const saveOrder = async (ctx) => {
  try {
    //fetching json from body
    let obj = ctx.request.body;
    console.log("obj", obj);
    const res = await SaveOrder(obj);
    //returning that json in response
    ctx.body = res;
  } catch (error) {
    console.error(error);

    ctx.body = "Error";
  }
};

const cancelOrder = async (ctx) => {
  try {
    //fetching json from body
    const id = ctx.params.id;
    const res = await CancelOrder(id);
    //returning that json in response
    ctx.body = res;
  } catch (error) {
    console.error(error);

    ctx.body = "Error";
  }
};

const getPrice = async (ctx) => {
  try {
    let symbol = "ETH";
    const price = await GetPrice({ amount: 1, symbol });

    ctx.body = price.quote.USD.price;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const platformConfig = async (ctx) => {
  try {
    const plaformConfig = {
      plateformFee: process.env.PLATFORM_FEE,
      uniswapContractAddress: config.swapContractAddress,
    };
    ctx.body = plaformConfig;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

module.exports = {
  getUserOrders,
  saveOrder,
  cancelOrder,
  getPrice,
  platformConfig,
};
