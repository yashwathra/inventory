import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Bill from '@/models/Bill';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const bills = await Bill.find().sort({ createdAt: -1 }); 

    return res.status(200).json({ success: true, data: bills });
  } catch (error) {
    console.error('Fetch Bills Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch bills' });
  }
}
