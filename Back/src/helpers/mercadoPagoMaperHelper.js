const { User } = require("../models");
const { Product } = require("../models");
const compareProductIds = require('../helpers/compareIdHelper')

const mercadoPagoMaperHelper = async (order) => {
  const { userId, items } = order;

  // Obtener usuario
  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  // Obtener productos
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  // Mapear items
  const cart = items.map((item) => {
    const product = products.find(p => compareProductIds.compareProductIds(p._id, item.productId));


    if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
    return {
      name: product.name,
      quantity: item.quantity,
      price: product.price,
    };
  });

  return {
    cart,
    email: user.email,
  };
};
module.exports = { mercadoPagoMaperHelper };
