const { Product } = require("../models");
const { Order } = require("../models");
const cartService = require("../services/cartService");

const createOrder = async ({
  userId,
  items,
  shippingAddressId,
  paymentId,
  paymentStatus = "pending",
  notes,
}) => {
  const processedItems = [];
  let totalAmount = 0;

    for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

    if (product.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto ${product.name}`);
    }

    const price = product.price;
    totalAmount += price * item.quantity;

    // Descontar stock
    product.stock -= item.quantity;
    await product.save();

    processedItems.push({
      product: product._id,
      quantity: item.quantity,
      variant: item.variant || {},
      price,
    });
  }

  const newOrder = new Order({
    userId: userId,
    items: processedItems,
    totalAmount,
    shippingAddress: shippingAddressId,
    paymentId: paymentId,
    paymentStatus:paymentStatus,
    notes,
  });

  await newOrder.save();

  if (paymentStatus === "pending") {
    await cartService.deleteCart(userId);
  }
  return newOrder;
};

const getAllOrders = async () => {
  return await Order.find()
    .populate("userId", "name email dni lastName")
    .populate("items.product", "name image price articleCode ")
    .populate("shippingAddress")
    .populate("notes")
    
};

const updateOrder = async (orderId, updates) => {
  const updatePayload = {};

  if (updates.orderStatus) updatePayload.orderStatus = updates.orderStatus;
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
    .populate("shippingAddress")
    
};




module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrderById,
  getOrdersByUserId,
  
};
