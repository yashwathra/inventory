import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  switch (req.method) {
    case 'POST':
      try {
        const { category, brand, product, modelNumber, stockQuantity, costPrice, purchaseDate, remark } = req.body;

        if (!category || !brand || !product) {
          return res.status(400).json({ success: false, error: 'Category, brand, and product are required.' });
        }

        const newItem = await Inventory.create({
          category,
          brand,
          product,
          modelNumber,
          stockQuantity,
          costPrice,
          purchaseDate,
          remark
        });

        return res.status(201).json({ success: true, data: newItem });
      } catch (error) {
        console.error('Inventory Create Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to add item' });
      }

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
