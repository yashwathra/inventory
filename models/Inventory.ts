import mongoose, { Schema, model, models } from 'mongoose';

const InventorySchema = new Schema(
  {
    category: { type: String, required: true },
    brand: { type: String, required: true },
    product: { type: String, required: true },
    modelNumber: String,
    stockQuantity: Number,
    costPrice: Number,
    purchaseDate: String,
    remark: String
  },
  { timestamps: true }
);

const Inventory = models.Inventory || model('Inventory', InventorySchema);
export default Inventory;
