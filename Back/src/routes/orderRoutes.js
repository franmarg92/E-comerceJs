const express = require("express");
const router = express.Router();
const { orderController } = require("../controllers");

router.post("/create-order", orderController.createOrderController);
router.get('/all-order', orderController.getAllOrdersController)
router.put('/order/:id', orderController.updateOrderController)

module.exports = router;
