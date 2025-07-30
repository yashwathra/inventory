import type { NextApiRequest, NextApiResponse } from 'next';
import {db} from '@/lib/db';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (error: unknown) {
  let message = 'Something went wrong';

  if (error instanceof Error) {
    message = error.message;
  }

  return res.status(500).json({ success: false, message });
}
}
