import mongoose, { Schema, models, model, Document } from 'mongoose';
import { ICategory } from '@/types/Category';

interface CategoryDocument extends ICategory, Document {}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Category = models.Category || model<CategoryDocument>('Category', CategorySchema);
export default Category;
