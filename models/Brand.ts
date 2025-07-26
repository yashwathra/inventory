// models/Brand.ts
import mongoose, { Schema, models, model } from 'mongoose';

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Brand = models.Brand || model('Brand', BrandSchema);
export default Brand;
    