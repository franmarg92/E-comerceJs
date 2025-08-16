const express = require("express");
const router = express.Router();
const { addressController } = require("../controllers");

router.post("/create-address", addressController.createAddressController);
router.get("/:userId", addressController.getUserAddressesByUserIdController);
router.patch("/defautl/:id", addressController.setDefaultAddressController);
router.delete('/delete/:addressId', addressController.deleteAddressController)
router.patch('/edit/:id', addressController.editAddressController)

module.exports = router;
