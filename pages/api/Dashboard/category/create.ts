// pages/api/Dashboard/bill/create.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Bill from '@/models/Bill';
import Inventory from '@/models/Inventory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { customerName, customerPhone, items } = req.body;

  if (!customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid request. Provide customer details and at least one item.' });
  }

  try {
    let totalAmount = 0;
    const populatedItems = [];

    for (const item of items) {
      const product = await Inventory.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found for ID: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      const amount = product.price * quantity;

      totalAmount += amount;

      populatedItems.push({
        productId: product._id,
        productName: product.name,
        quantity,
        price: product.price,
        amount,
      });
    }

    const newBill = await Bill.create({
      customerName,
      customerPhone,
      items: populatedItems,
      totalAmount,
    });

    return res.status(201).json({ success: true, data: newBill });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
}
