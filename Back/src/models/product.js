const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    color: { type: String },  
    size: { type: String },
    stock: { type: Number, default: 0 },
  },
  { _id: false } 
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: [String],
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
