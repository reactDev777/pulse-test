const { OrderBook } = require("../schema/orderSchema");
const { objectToParams } = require("../utils/common");
const { cmcApi } = require("../utils/externalApiCalls");

const GetUserOrders = async (user) => {
  try {
    console.log("user", user);
    const res = await OrderBook.find({
      userAdddress: user,
      status: ["Created", "Filled"],
    });
    return res;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const SaveOrder = async (data) => {
  try {
    const res = await OrderBook.create(data);
    return res;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const CancelOrder = async (id) => {
  console.log("id", id);
  try {
    const obj = {
      status: "Cancelled",
    };
    const res = await OrderBook.findByIdAndUpdate(id, obj);
    return res;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};


const OrderFilled = async (id) => {
  console.log("id", id);
  try {
    const obj = {
      status: "Filled",
    };
    const res = await OrderBook.findByIdAndUpdate(id, obj);
    return res;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const GetAllActiveOrders = async () => {
  try {
    const res = await OrderBook.find({
      status: "Created",
    });
    return res;
  } catch (error) {
    console.log("Error", error);
    return error;
  }
};

const GetPrice = async ({ amount, symbol }) => {
  try {
    const url = `/v2/tools/price-conversion?${objectToParams({
      amount,
      symbol,
    })}`;

    const convertedPrice = await cmcApi(url);

    return convertedPrice.data[0];
  } catch (error) {
    console.error({
      error,
      // inputs: data,
    });
  }
};

module.exports = {
  GetUserOrders,
  SaveOrder,
  CancelOrder,
  GetAllActiveOrders,
  GetPrice,
  OrderFilled
};
