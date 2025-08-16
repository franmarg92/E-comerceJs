const { Cart, Product } = require("../models");
const mongoose = require("mongoose");
const { Types } = mongoose;
const compareProductIds = require('../helpers/compareIdHelper')

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
        return { success: false, message: "Producto no encontrado." };
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
    if (!userId || !Array.isArray(incomingItems)) {
      throw new Error('Datos inválidos para la fusión del carrito');
    }

    

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      
      cart = new Cart({ userId, items: incomingItems });
    } else {
      

      for (const incomingItem of incomingItems) {
       

        const existingIndex = cart.items.findIndex((item) =>
          compareProductIds.compareProductIds(item.productId, incomingItem.productId)
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
    console.error('❌ Error en mergeCartService:', error);
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
  if (!cart) throw new Error("🛒 Carrito no encontrado");

  const product = await Product.findById(productId);
  if (!product) throw new Error("❌ Producto no existe en la base de datos");

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  const currentQuantity = itemIndex !== -1 ? cart.items[itemIndex].quantity : 0;
  const newQuantity = currentQuantity + quantityChange;

  // 🔒 Control de stock
  if (newQuantity > product.stock) {
    throw new Error(`🚫 Stock insuficiente. Máximo permitido: ${product.stock}`);
  }

  if (newQuantity <= 0) {
    // 🧹 Eliminar si la cantidad baja a 0
    if (itemIndex !== -1) cart.items.splice(itemIndex, 1);
  } else {
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // 🆕 Agregar nuevo ítem si no existe
      cart.items.push({
        productId,
        quantity: newQuantity
      });
    }
  }

  await cart.save();
  return {
    success: true,
    message: itemIndex === -1
      ? "🆕 Producto agregado al carrito"
      : newQuantity <= 0
        ? "🧹 Producto eliminado del carrito"
        : "✅ Cantidad actualizada correctamente",
    cart
  };
};


const deleteCart = async (userId) => {
  try {
    const result = await Cart.findOneAndDelete({ userId });
    if (!result) return { success: false, message: "Carrito no encontrado" };
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  addToCart,
  getCart,
  mergeCart,
  deleteItemsByProductId,
  updateItemQuantity,
  deleteCart,
};
