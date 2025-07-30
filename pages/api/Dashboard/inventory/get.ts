import type { NextApiRequest, NextApiResponse } from 'next';
import { Types } from 'mongoose';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';

interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  brand: string;
  category: string;
  modelNumber: string;
}

interface InventoryWithProduct {
  _id: string;
  stockQuantity: number;
  costPrice: number;
  purchaseDate: Date;
  remark?: string;
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  product: {
    _id: string;
    name: string;
    brand: string;
    category: string;
    modelNumber: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await db();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const items = await Inventory.find()
      .populate('product')
      .lean();

    const formatted: InventoryWithProduct[] = items.map((inv) => {
      const product = inv.product as PopulatedProduct;

      return {
        _id: (inv._id as Types.ObjectId).toString(),
        stockQuantity: inv.stockQuantity,
        costPrice: inv.costPrice,
        purchaseDate: inv.purchaseDate,
        remark: inv.remark,
        specifications: inv.specifications || {},
        createdAt: inv.createdAt,
        updatedAt: inv.updatedAt,
        product: {
          _id: product._id.toString(),
          name: product.name || '',
          brand: product.brand || '',
          category: product.category || '',
          modelNumber: product.modelNumber || '',
        },
      };
    });

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Inventory Fetch Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch inventory' });
  }
}
