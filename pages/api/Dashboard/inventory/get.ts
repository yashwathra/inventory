import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';

type ResponseData =
  | { success: true; data: typeof Inventory[] }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await db();

  if (req.method === 'GET') {
    try {
      const items = await Inventory.find();
      return res.status(200).json({ success: true, data: items });
    } catch (error: unknown) {
      console.error('Error fetching inventory:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch items' });
    }
  } else {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
