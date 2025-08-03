const express = require("express");
const router = express.Router();
const { productController } = require("../controllers");
const {multerMidleware} = require('../midleeware')


router.get("/", productController.getAllProductsController);
router.post(
  "/create",
  multerMidleware.uploadWithFile.single("image"),
  productController.createProductController
);
router.patch("/edit/:id", multerMidleware.uploadNoFile.none(), productController.editProductController);
router.patch("/edit-with-image/:id", multerMidleware.uploadWithFile.single("image"), productController.editProductController);

router.get("/:id", productController.getProductByIdController);
router.get(
  "/products/featured",
  productController.getFeaturedProductController
);

module.exports = router;
