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
        price: { type: Number, required: true }, // necesario para calcular total
        variant: {
          size: String,
          color: String,
        },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
     paymentStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'in_process'],
      default: 'pending',
    },

    
    orderStatus: {
      type: String,
      enum: ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'],
      default: 'pendiente',
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
   
    notes: {
      type: String,
      trim: true,
    },
       // Datos de envío
    shippingId: { type: String, default: null }, // ej: número de seguimiento
    shippingProvider: { type: String, default: null }, // Correo Argentino, OCA, etc.
    shippingDate: { type: Date, default: null },
  },
  
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
