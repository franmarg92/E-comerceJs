const { Product } = require("../models");
const { Order } = require("../models");
const orderExists = require("../helpers/orderExists");

const createOrder = async ({
  userId,
  items,
  shippingAddressId,
  paymentDetails,
  notes,
}) => {

   // 🛡️ Validación defensiva
  if (paymentDetails?.transactionId) {
    const exists = await orderExists(paymentDetails.transactionId);
    if (exists) {
      throw new Error(`Orden ya existe para paymentId ${paymentDetails.transactionId}`);
    }
  }

  const processedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

     // 🛡️ Validación de stock
  if (product.stock < item.quantity) {
    throw new Error(`Stock insuficiente para ${product.name}`);
  }

  // 🧮 Descuento de stock
  product.stock -= item.quantity;
  await product.save(); // 👈 Persistimos el cambio

    const price = product.price;
    totalAmount += price * item.quantity;

    processedItems.push({
      product: product._id,
      quantity: item.quantity,
      variant: item.variant || {},
      price,
    });
  }

  const newOrder = new Order({
    userId,
    items: processedItems,
    totalAmount,
    shippingAddress: shippingAddressId,

    // 🔑 Guardamos datos de pago pero el status lo manejamos aparte
    paymentId: paymentDetails?.transactionId || null,
    paymentDetails,
    paymentStatus: paymentDetails ? "paid" : "pending", // 👈 separado

    // 🔑 Estado de la orden
    orderStatus: "pendiente", // "pendiente", "preparando", "en_camino", "entregado"

    // 🔑 Datos de envío
    shippingId: null,
    shippingProvider: null,
    shippingDate: null,

    notes,
  });

  await newOrder.save();
  return newOrder;
};


const getAllOrders = async () => {
  return await Order.find()
    .populate("userId", "name email dni lastName")
    .populate("items.product", "name image price articleCode ")
    .populate("shippingAddress")
    .populate("notes");
};

const updateOrder = async (orderId, updates) => {
  const updatePayload = {};

  if (updates.status) updatePayload.status = updates.status;
  if (updates.paymentDetails)
    updatePayload.paymentDetails = updates.paymentDetails;

  return await Order.findByIdAndUpdate(orderId, updatePayload, { new: true });
};

const getOrdersByUserId = async (userId) => {
  return await Order.find({ userId })
    .populate("items.product", "name image price articleCode")
    .populate("shippingAddress")
    .sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate("userId", "name email")
    .populate("items.product", "name image price articleCode")
    .populate("shippingAddress");
};




module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrderById,
  getOrdersByUserId,
  
};
