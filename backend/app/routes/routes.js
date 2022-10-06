const koaRouter = require("koa-router");

const {
  getUserOrders,
  saveOrder,
  cancelOrder,
  getPrice,
  platformConfig,
} = require("../controllers");

const router = new koaRouter();

router.post("/save-order", saveOrder);
router.put("/get-user-orders/:user_address", getUserOrders);
router.put("/cancel-order/:id", cancelOrder);
router.get("/get-cmc-price", getPrice);
router.get("/get-config", platformConfig);

module.exports = {
  router,
};
