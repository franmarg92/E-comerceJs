const {Product} = require('../models')
const {Order} = require('../models')


const createOrder = async ({ userId, items, shippingAddressId, paymentDetails }) => {
  const processedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error('Producto no encontrado');

    const unitPrice = product.price;
    const subtotal = unitPrice * item.quantity;

    processedItems.push({
      product: product._id,
      quantity: item.quantity,
      variant: item.variant || {}, 
      unitPrice,
      subtotal
    });

    totalAmount += subtotal;
  }

  const newOrder = new Order({
    userId,
    items: processedItems,
    totalAmount,
    shippingAddress: shippingAddressId,
    paymentDetails,
    status: 'pending'
  });

  await newOrder.save();
  return newOrder;
};


const getAllOrders = async () => {
  return await Order.find()
    .populate('userId', 'name email dni lastName')
    .populate('items.product', 'name image price')
    .populate('shippingAddress');
};

const updateOrder = async (orderId, updates) => {
  const updatePayload = {};

  if (updates.status) updatePayload.status = updates.status;
  if (updates.paymentDetails) updatePayload.paymentDetails = updates.paymentDetails;

  return await Order.findByIdAndUpdate(orderId, updatePayload, { new: true });
};

const getOrdersByUserId = async (userId) => {
  return await Order.find({ userId })
    .populate('items.product', 'name image price')
    .populate('shippingAddress')
    .sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  return await Order.findById(orderId)
    .populate('userId', 'name email')
    .populate('items.product', 'name image price')
    .populate('shippingAddress');
}

module.exports = {createOrder, getAllOrders, updateOrder, getOrderById, getOrdersByUserId}