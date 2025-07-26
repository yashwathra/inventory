// models/Bill.ts

import mongoose, { Schema, model, models } from 'mongoose';

const BillSchema = new Schema(
  {
    customer: {
      name: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
        product: { type: String, required: true },
        modelNumber: { type: String },
        brand: { type: String },
        costPrice: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        date: { type: Date, default: Date.now },
        
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    
     paymentMode: {
      type: String,
    },
    billDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default models.Bill || model('Bill', BillSchema);
