const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
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
        variant: {
          size: String,
          color: String,
        },
         
      },
    ],
    totalAmount: { type: Number, required: true, min: 0},
    status: {
      type: String,
      enum: ['Pendiente', 'Pagado', 'Entregado', 'En camino', 'Cancelado'],
      default: 'Pendiente',
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentDetails: {
      method: String,
      transactionId: String,
    },
    notes: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
