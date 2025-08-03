import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Inventory from '@/models/Inventory';
import Bill from '@/models/Bill';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      customer,            
      selectedProductIds,   
      quantity,             
      paymentMode,
      billDate,
    } = req.body;

    if (!customer?.name || !selectedProductIds || !Array.isArray(selectedProductIds) || selectedProductIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing required customer or product data' });
    }

    
    const products = await Inventory.find({
      _id: { $in: selectedProductIds },
    });

    if (products.length !== selectedProductIds.length) {
      return res.status(400).json({ success: false, error: 'Some selected products not found in inventory' });
    }

    
    const productList = [];

    for (const product of products) {
      const productQty = typeof quantity === 'object' ? quantity[product._id.toString()] : quantity || 1;

      if (product.stockQuantity < productQty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product ID ${product._id}`,
        });
      }

      product.stockQuantity -= productQty;
      await product.save();

      productList.push({
        productId: product._id,
        product: product.product,
        modelNumber: product.modelNumber || '',
        brand: product.brand || '',
        costPrice: product.costPrice,
        quantity: productQty,
        date: billDate || new Date(),
      });
    }

    const totalAmount = productList.reduce((sum, p) => sum + p.costPrice * p.quantity, 0);

    const newBill = await Bill.create({
      customer: {
        name: customer.name,
        phone: customer.phone || '',
      },
      products: productList,
      totalAmount,
      paymentMode: paymentMode || '',
      billDate: billDate || new Date(),
    });

    return res.status(200).json({ success: true, data: newBill });
  } catch (error) {
    console.error('Create Bill Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create bill' });
  }
}
