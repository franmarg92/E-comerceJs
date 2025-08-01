const { Cart, Product } = require("../models");

const addToCart = async (userId, productId) => {
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return { success: false, message: 'Producto no encontrado.' };
      }

      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();
    return { success: true, cart };
  } catch (error) {
    throw error;
  }
};




const getCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return { success: false, error: "Carrito no encontrado." };
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const mergeCart = async (userId, incomingItems) => {
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: incomingItems });
    } else {
      for (const incomingItem of incomingItems) {
        const existingIndex = cart.items.findIndex(
          (item) => item.productId.toString() === incomingItem.productId
        );

        if (existingIndex > -1) {
          cart.items[existingIndex].quantity += incomingItem.quantity;
        } else {
          cart.items.push({
            productId: incomingItem.productId,
            quantity: incomingItem.quantity,
          });
        }
      }
    }

    await cart.save();
    return { success: true, cart };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const deleteItemsByProductId = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Carrito no encontrado");

  // Filtrar todos los ítems que NO correspondan al producto
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
};

const updateItemQuantity = async (userId, productId, quantityChange) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Carrito no encontrado");

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) throw new Error("Producto no encontrado en el carrito");

  cart.items[itemIndex].quantity += quantityChange;

  // Eliminar si la cantidad baja a 0
  if (cart.items[itemIndex].quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  }

  await cart.save();
  return { success: true, cart };
};

module.exports = {
  addToCart,
  getCart,
  mergeCart,
  deleteItemsByProductId,
  updateItemQuantity,
};
