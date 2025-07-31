const express = require("express");
const router = express.Router();
const { orderController } = require("../controllers");

router.post("/create-order", orderController.createOrderController);
router.get("/all-order", orderController.getAllOrdersController);
router.patch("/update-order/:id", orderController.updateOrderController);
router.get("/:id", orderController.getOrderById);
router.get("/orderbyuser/:userId", orderController.getOrdersByUserId);

module.exports = router;
