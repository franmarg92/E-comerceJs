const { cartService } = require("../services");

const addToCartController = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?._id || req.body.userId;

  const result = await cartService.addToCart(userId, productId);
  if (!result.success) {
    return res.status(400).json({ message: result.error });
  }
  res.status(200).json(result.cart);
};

const getCartController = async (req, res) => {
  const userId = req.user?._id || req.params.userId;

  const result = await cartService.getCart(userId);
  if (!result.success) {
    return res.status(404).json({ message: result.error });
  }
  res.status(200).json(result.cart);
};

const mergeCartController = async (req, res) => {
  const userId = req.user?._id || req.body.userId;
  const incomingItems = req.body.items;

  const result = await cartService.mergeCart(userId, incomingItems);
  if (!result.success) {
    return res.status(500).json({ message: result.error });
  }
  res.status(200).json(result.cart);
};

const deleteItemsByProductId = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await cartService.deleteItemsByProductId(userId, productId);
    return res
      .status(200)
      .json({ message: "Producto eliminado por completo del carrito" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantityChange } = req.body;

    if (typeof quantityChange !== "number") {
      return res.status(400).json({ error: "Cantidad inválida" });
    }

    const result = await cartService.updateItemQuantity(
      userId,
      productId,
      quantityChange
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



module.exports = {
  addToCartController,
  getCartController,
  mergeCartController,
  deleteItemsByProductId,
  updateItemQuantity,
};
