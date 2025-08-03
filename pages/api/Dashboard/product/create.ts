import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, brand, category, modelNumber, specifications } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const existing = await Product.findOne({ name, brand, modelNumber });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Product already exists with the same name, brand, and model number',
      });
    }

    const product = new Product({
      name,
      brand,
      category,
      modelNumber,
      specifications,
    });

    await product.save();

    return res.status(201).json({ success: true, data: product });
  } catch (error: unknown) {
    let message = 'Something went wrong';

    if (error instanceof Error) {
      message = error.message;
    }

    return res.status(500).json({ success: false, message });
  }
}
