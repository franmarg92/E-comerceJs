const mongoose = require("mongoose");

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
    articleCode: {
      type: String,
      required: false,
      trim: true,
      unique: false,
    },
    name: { type: String },
    description: { type: String },
    image: [String],
    price: { type: Number },
    stock: { type: Number, default: 0 },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    cost: { type: Number, required: false },
    variants: [variantSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
