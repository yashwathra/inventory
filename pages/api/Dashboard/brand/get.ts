// pages/api/Dashboard/brand/get.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Brand from '@/models/Brand';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const brands = await Brand.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: brands });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}
