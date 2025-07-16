const express = require("express");
const router = express.Router();
const { productController } = require("../controllers");

router.get("/", productController.getAllProductsController);
router.post("/create", productController.createProductController);
router.post("/edit", productController.editProductController);
router.get('/:id', productController.getProductByIdController)

module.exports = router;
