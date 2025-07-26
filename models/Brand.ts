import mongoose, { Schema, Document } from 'mongoose';

export interface BrandType extends Document {
  name: string;
  description?: string;
}

const BrandSchema = new Schema<BrandType>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Brand || mongoose.model<BrandType>('Brand', BrandSchema);
