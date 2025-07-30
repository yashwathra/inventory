import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    modelNumber: { type: String },
    specifications: {
      type: Map,
      of: String,
      default: {},
    }, 
  },
  { timestamps: true }
);

const Product = models.Product || model('Product', ProductSchema);
export default Product;
