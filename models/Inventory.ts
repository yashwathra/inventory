import mongoose, { Schema, model, models } from 'mongoose';

const InventorySchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    remark: {
      type: String,
    },
    specifications: {
  type: Schema.Types.Mixed, // or: Object
  default: {},
},
  },
  { timestamps: true }
);

const Inventory = models.Inventory || model('Inventory', InventorySchema);
export default Inventory;
