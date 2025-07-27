import mongoose, { Schema, model, models } from 'mongoose';

const InventorySchema = new Schema(
  {
    category: { type: String, required: true },
    brand: { type: String, required: true },
    product: { type: String, required: true },
    modelNumber: { type: String },
    stockQuantity: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    purchaseDate: { type: Date, default: Date.now },
    remark: { type: String },

    specifications: {
      type: Map,
      of: String,
      default: {}
    }
  },
  { timestamps: true }
);

const Inventory = models.Inventory || model('Inventory', InventorySchema);
export default Inventory;
