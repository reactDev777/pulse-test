const mongoose = require("mongoose");

let orderSchema = mongoose.Schema(
  {
    userAdddress: {
      type: String,
      lowercase: true,
      required: true,
    },
    tokenAddress: {
      type: String,
      lowercase: true,
      required: true,
    },
    decimals: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Created", "Filled", "Cancelled"],
      default: "Created",
    },
    tokenAmount: {
      type: String,
      required: true,
    },
    ethAmount: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
    },
    type: {
        type: String,
        enum: ["Buy", "Sell"],
      },
  },
  {
    timestamps: true,
  }
);

const OrderBook = mongoose.model("orderBook", orderSchema);
module.exports = { OrderBook };
