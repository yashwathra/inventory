    // pages/api/brand/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Brand from '@/models/Brand';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Brand name is required' });
  }

  try {
    const existing = await Brand.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Brand already exists' });
    }

    const newBrand = await Brand.create({ name, description });
    return res.status(201).json({ success: true, data: newBrand });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
