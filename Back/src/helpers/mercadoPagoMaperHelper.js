const { User } = require("../models");
const { Product } = require("../models");
const compareProductIds = require('../helpers/compareIdHelper')

const mercadoPagoMaperHelper = async (order) => {
  const { userId, items, shippingAddressId, notes = "" } = order;

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const cart = items.map((item) => {
    const product = products.find(p =>
      compareProductIds.compareProductIds(p._id, item.productId)
    );
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
    return {
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      productId: item.productId, // necesario para external_reference
    };
  });

  return {
    cart,
    email: user.email,
    userId,
    shippingAddressId,
    notes,
  };
};

module.exports = { mercadoPagoMaperHelper };
