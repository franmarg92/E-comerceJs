const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");

router.get("/", userController.getAllUsersController);
router.put("/edit", userController.editUserController);
router.put("/change-password", userController.changePasswordController);

module.exports = router;
