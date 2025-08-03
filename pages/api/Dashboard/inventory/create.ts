//FILE: pages/api/Dashboard/inventory/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';
import Product from '@/models/Product';
import { parseISO } from 'date-fns';
import { Types } from 'mongoose';

// Define the expected structure of a Product document
interface LeanProduct {
  _id: Types.ObjectId;
  name: string;
  brand?: string;
  category?: string;
  modelNumber?: string;
  specifications?: Record<string, string>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      product: productId,
      stockQuantity,
      costPrice,
      purchaseDate,
      remark,
      specifications, // ✅ This comes from frontend, must be extracted
    } = req.body;

    if (!productId || !costPrice || !purchaseDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productId, costPrice, or purchaseDate',
      });
    }

    const product = await Product.findById(productId).lean<LeanProduct>();
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const parsedDate = purchaseDate ? parseISO(purchaseDate) : undefined;

    console.log('Saving Specs:', specifications);

    const newInventory = await Inventory.create({
  product: product._id,
  stockQuantity: Number(stockQuantity),
  costPrice: Number(costPrice),
  purchaseDate: parsedDate,
  remark,
  specifications: new Map(Object.entries(specifications || {})), 
  specificationsSnapshot: new Map(Object.entries(product.specifications || {})), 
});


    return res.status(201).json({ success: true, data: newInventory });
  } catch (error) {
    console.error('Inventory Create Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to add item' });
  }
}
