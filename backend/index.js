/*********** import starts ***********/

"use strict";
const koa = require("koa");
var bodyParser = require("koa-bodyparser");
const PORT = "8080";
const { connectDB } = require("./app/db/index");
const { router } = require("./app/routes/routes");
const cors = require("@koa/cors");
const cron = require("node-cron");
const { loadWeb3, eventWatcher, config } = require("./app/web3");
loadWeb3();
connectDB();

const app = new koa();
app.use(cors());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

/**
 * index port
 */
cron.schedule("*/20 * * * * *", async function () {
  // every 3 min
  console.log(`----------- cron job ----------`);
  if (config.transactionStatus) {
    eventWatcher();
  }
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
