'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';


import AgGridTable from '@/components/common/AgGridTable';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Product {
  _id?: string;
  name: string;
  category: string;
  brand: string;
  modelNumber: string;
  
}
interface ICategory {
  _id: string;
  name: string;
}
interface IBrand {
  _id: string;
  name: string;
}


const columnDefs = [
  { headerName: "Product Name", field: "name", flex: 1 },
  { headerName: "Category", field: "category", flex: 1 },
  { headerName: "Brand", field: "brand", flex: 1 },
  { headerName: "Model Number", field: "modelNumber", flex: 1 },
];

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [form, setForm] = useState<Omit<Product, '_id'>>({
    name: '',
    category: '',
    brand: '',
    modelNumber: '',
    
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/Dashboard/product/get');
      const data = await res.json();
      setProducts(data.data || []);
    } catch {
      toast.error('Failed to fetch products');
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch('/api/Dashboard/category/get'),
        fetch('/api/Dashboard/brand/get')
      ]);
      const catData = await catRes.json();
      const brandData = await brandRes.json();

    setCategories(catData.data?.map((c: ICategory) => c.name) || []);
setBrands(brandData.data?.map((b: IBrand) => b.name) || []);
    } catch {
      toast.error('Failed to fetch category or brand');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/Dashboard/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product added');
        setForm({ name: '', category: '', brand: '', modelNumber: '',  });
        setOpen(false);
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to add product');
      }
    } catch {
      toast.error('Server error');
    }
  };

  return (
    <div className="p-4">
      <div className='mb-6 flex justify-between items-center'>
        <h1 className="text-xl font-semibold">Product Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Product</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Enter product details below.</DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleSubmit}>

              <div className="space-y-2">
                <Label>Category</Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {form.category || 'Select Category'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search category..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map(cat => (
                          <CommandItem
                            key={cat}
                            onSelect={() => {
                              setForm(prev => ({ ...prev, category: cat }));
                              setCategoryOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', form.category === cat ? 'opacity-100' : 'opacity-0')} />
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>


              <div className="space-y-2">
                <Label>Brand</Label>
                <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {form.brand || 'Select Brand'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search brand..." />
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup>
                        {brands.map(brand => (
                          <CommandItem
                            key={brand}
                            onSelect={() => {
                              setForm(prev => ({ ...prev, brand }));
                              setBrandOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', form.brand === brand ? 'opacity-100' : 'opacity-0')} />
                            {brand}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>


              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
              </div>


              <div className="space-y-2">
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input id="modelNumber" name="modelNumber" placeholder="Model Number" value={form.modelNumber} onChange={handleChange} />
              </div>

              <Button type="submit">Save</Button>
            </form>

          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <AgGridTable columnDefs={columnDefs} rowData={products} />
        </div>
      </div>
    </div>
  );
}
