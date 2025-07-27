import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';
import { parse } from 'date-fns';

const CATEGORY_FIELDS: Record<string, string[]> = {
  Mobile: ['RAM', 'ROM', 'IMEI', 'Color'],
  Tablet: ['RAM', 'ROM', 'IMEI', 'Color'],
  Tv: ['Screen Size', 'Resolution', 'Smart'],
  Laptop: ['RAM', 'SSD', 'Processor', 'OS'],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      category,
      brand,
      product,
      modelNumber,
      stockQuantity,
      costPrice,
      purchaseDate,
      remark,
      specifications,
    } = req.body;

    if (!category || !brand || !product) {
      return res.status(400).json({ success: false, error: 'Category, brand, and product are required.' });
    }

    const allowedFields = CATEGORY_FIELDS[category];
    if (allowedFields && specifications) {
      for (const key of Object.keys(specifications)) {
        if (!allowedFields.includes(key)) {
          return res.status(400).json({
            success: false,
            error: `Invalid specification field "${key}" for category "${category}".`,
          });
        }
      }
    }

    const parsedDate = purchaseDate
      ? parse(purchaseDate, 'dd-MM-yyyy', new Date())
      : undefined;

    const newItem = await Inventory.create({
      category,
      brand,
      product,
      modelNumber,
      stockQuantity: Number(stockQuantity),
      costPrice: Number(costPrice),
      purchaseDate: parsedDate,
      remark,
      specifications: specifications || {},
    });

    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Inventory Create Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add item' });
  }
}
