const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // necesario para calcular total
        variant: {
          size: String,
          color: String,
        },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pendiente', 'Pagado', 'En camino', 'Entregado', 'Cancelado', 'paid'],
      default: 'Pendiente',
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDetails: {
      method: String,
      transactionAmount: Number,
      status: String,
      raw: Object,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
