// pages/api/Dashboard/brand/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Brand, { BrandType } from '@/models/Brand'; // Ensure BrandType is exported from the model

type Data = 
  | { success: boolean; data: BrandType }
  | { success: boolean; message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db();

  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }

  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: 'Brand name is required' });
  }

  try {
    const existing = await Brand.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Brand already exists' });
    }

    const newBrand = await Brand.create({ name, description });
    return res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json({ success: false, message: err.message || 'Internal server error' });
  }
}
