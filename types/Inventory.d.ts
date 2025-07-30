export interface PopulatedProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  modelNumber: string;
}

export interface InventoryWithProduct {
  _id: string;
  stockQuantity: number;
  costPrice: number;
  purchaseDate: Date;
  remark?: string;
  specifications?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  product: PopulatedProduct;
}
