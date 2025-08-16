const { addressService } = require("../services");

const createAddressController = async (req, res) => {
  try {
    const { userId, ...data } = req.body;
    const address = await addressService.createAddress(userId, data);

    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getUserAddressesByUserIdController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addresses = await addressService.getUserAddressesByUserId(userId);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const setDefaultAddressController = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    const result = await addressService.setDefaultAddress(userId, addressId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const editAddressController = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { userId, ...updates } = req.body;

    const updated = await addressService.editAddress(
      addressId,
      userId,
      updates
    );
    res.status(200).json({
      message: "Dirección editada correctamente",
      data: updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al editar la dirección", error: err.message });
  }
};

const deleteAddressController = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { userId } = req.body;

    const deleted = await deleteAddress(addressId, userId);
    res.status(200).json({ message: "Dirección eliminada", address: deleted });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar la dirección", error: err.message });
  }
};

module.exports = {
  createAddressController,
  getUserAddressesByUserIdController,
  setDefaultAddressController,
  editAddressController,
  deleteAddressController,
};
