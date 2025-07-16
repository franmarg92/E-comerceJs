const { orderService } = require("../services");

const createOrderController = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, paymentDetails } = req.body;

    const updatedOrder = await orderService.updateOrder(orderId, {
      status,
      paymentDetails,
    });

    if (!updatedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada" });

    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderService.getOrdersByUserId(userId);

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrderController,
  getAllOrdersController,
  updateOrderController,
  getOrdersByUserId,
  getOrderById
};
