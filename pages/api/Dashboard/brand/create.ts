import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import Brand from '@/models/Brand';
import type { BrandType } from '@/types/brand';

type Data =
  | { success: boolean; data: BrandType }
  | { success: boolean; message: string };

function normalizeBrand(str: string) {
  return str.replace(/\s+/g, '').toLowerCase();
}

function formatBrand(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Brand name is required' });
  }

  const normalizedName = normalizeBrand(name);
  const formattedName = formatBrand(name);

  try {
    const allBrands = await Brand.find();
    const exists = allBrands.find(
      (b) => normalizeBrand(b.name) === normalizedName
    );

    if (exists) {
      return res.status(409).json({ success: false, message: 'Brand already exists' });
    }

    const newBrand = await Brand.create({
      name: formattedName,
      description,
    });

    const responseBrand: BrandType = {
      _id: newBrand._id.toString(),
      name: newBrand.name,
      description: newBrand.description,
    };

    return res.status(201).json({ success: true, data: responseBrand });
  } catch (error: unknown) {
  const err = error as Error;
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

}
