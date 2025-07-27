import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';

type InventoryItem = {
  _id: string;
  category: string;
  brand: string;
  product: string;
  modelNumber?: string;
  stockQuantity?: number;
  costPrice?: number;
  purchaseDate?: Date;
  remark?: string;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
};

type ResponseData =
  | { success: true; data: InventoryItem[] }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await db();

  if (req.method === 'GET') {
    try {
      const { category } = req.query;

      // If you want to filter by category
      const query = category ? { category } : {};

      const items = await Inventory.find(query);

      return res.status(200).json({ success: true, data: items });
    } catch (error: unknown) {
      console.error('Error fetching inventory:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch items' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
