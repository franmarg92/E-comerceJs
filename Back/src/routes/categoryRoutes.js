const express = require("express");
const router = express.Router();
const { categoryController } = require("../controllers");

router.get("/", categoryController.getAllCategoriesController);
router.post("/create", categoryController.createCategoryController);
router.get('/:parentId/subcategories', categoryController.getSubcategoriesController);


module.exports = router;
