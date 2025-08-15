const {Order} = require("../models");

const orderExists = async (paymentId) => {
  if (!paymentId) return false;
  const existing = await Order.findOne({ paymentId });
  return !!existing;
};

module.exports = orderExists;