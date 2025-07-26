// pages/api/category/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Category from '@/models/Category';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Optional sorting by latest
    return res.status(200).json({ success: true, data: categories });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}
