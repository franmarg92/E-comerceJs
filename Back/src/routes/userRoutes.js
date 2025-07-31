const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");

router.get("/", userController.getAllUsersController);
router.patch("/edit", userController.editUserController);
router.patch("/change-password", userController.changePasswordController);
router.get("/:id", userController.getUserByIdController);

module.exports = router;
