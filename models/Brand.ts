import mongoose, { Schema, model, models, Document } from 'mongoose';
import type { BrandType } from '@/types/brand'; // adjust path as needed

interface BrandDocument extends Document, Omit<BrandType, '_id'> {}

const BrandSchema = new Schema<BrandDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
});

const Brand = models.Brand || model<BrandDocument>('Brand', BrandSchema);

export default Brand;
export type { BrandType };
