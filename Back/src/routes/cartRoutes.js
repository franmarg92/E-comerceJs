const express = require("express");
const router = express.Router();
const { cartController } = require("../controllers");

router.post("/add", cartController.addToCartController);
router.get("/:userId", cartController.getCartController);
router.post("/merge", cartController.mergeCartController);
router.delete(
  "/:userId/product/:productId",
  cartController.deleteItemsByProductId
);
router.patch('/:userId/product/:productId', cartController.updateItemQuantity);


module.exports = router;
