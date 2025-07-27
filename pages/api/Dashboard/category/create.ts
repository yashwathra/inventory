import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Category from '@/models/Category';

interface CategoryData {
  name: string;
  description?: string;
}

type Data =
  | { success: boolean; data: CategoryData }
  | { success: boolean; message: string };

function normalizeCategory(str: string): string {
  return str.replace(/\s+/g, '').toLowerCase(); 
}

function formatCategory(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, description }: CategoryData = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  const normalizedName = normalizeCategory(name); 
  const formattedName = formatCategory(name);     

  try {
    const allCategories = await Category.find();
    const exists = allCategories.find((cat) => normalizeCategory(cat.name) === normalizedName);

    if (exists) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }

    const newCategory = await Category.create({ name: formattedName, description });
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
}
