'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

import AgGridTable from '@/components/common/AgGridTable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface InventoryItem {
  _id?: string;
  category: string;
  brand: string;
  product: string;
  modelNumber: string;
  stockQuantity: number;
  costPrice: number;
  purchaseDate: string;
  remark: string;
  specifications: Record<string, string>;
}

interface OptionType {
  _id: string;
  name: string;
}

type FormInventoryItem = {
  category: string;
  brand: string;
  product: string;
  modelNumber: string;
  stockQuantity: string;
  costPrice: string
  remark: string;
};

// 📦 Dynamic Spec Fields per Category
const CATEGORY_FIELDS: Record<string, string[]> = {
  Mobile: ['RAM', 'ROM', 'IMEI', 'Color'],
  Tablet: ['RAM', 'ROM', 'IMEI', 'Color'],  
  Tv: ['Screen Size', 'Resolution', 'Smart'],
  Laptop: ['RAM', 'SSD', 'Processor', 'OS'],
};

const columnDefs = [
  { headerName: "Category", field: "category", flex: 1 },
  { headerName: "Brand", field: "brand", flex: 1 },
  { headerName: "Product", field: "product", flex: 1 },
  { headerName: "Model Number", field: "modelNumber", flex: 1 },
  { headerName: "Stock Quantity", field: "stockQuantity", flex: 1 },
  { headerName: "Cost Price", field: "costPrice", flex: 1 },
  { headerName: "Purchase Date", field: "purchaseDate", flex: 1 },
  { headerName: "Remark", field: "remark", flex: 1 }
];

export default function InventoryPage() {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [rowData, setRowData] = useState<InventoryItem[]>([]);
  const [brands, setBrands] = useState<OptionType[]>([]);
  const [categories, setCategories] = useState<OptionType[]>([]);

  const [form, setForm] = useState<FormInventoryItem>({
    category: '',
    brand: '',
    product: '',
    modelNumber: '',
    stockQuantity: '',
    costPrice: '',
    remark: ''
  });

  const [specifications, setSpecifications] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/Dashboard/category/get')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(() => toast.error('Failed to fetch categories'));

    fetch('/api/Dashboard/brand/get')
      .then(res => res.json())
      .then(data => setBrands(data.data || []))
      .catch(() => toast.error('Failed to fetch brands'));

    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/Dashboard/inventory/get');
      const data = await res.json();
      setRowData(data.data || []);
    } catch {
      toast.error('Failed to load inventory');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setSpecifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category || !form.brand || !form.product || !selectedDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const newItem: InventoryItem = {
      category: form.category,
      brand: form.brand,
      product: form.product,
      modelNumber: form.modelNumber,
      stockQuantity: Number(form.stockQuantity),
      costPrice: Number(form.costPrice),
      purchaseDate: format(selectedDate, "dd-MM-yyyy"),
      remark: form.remark,
      specifications
    };

    try {
      const res = await fetch('/api/Dashboard/inventory/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Product added');
        setForm({
          category: '',
          brand: '',
          product: '',
          modelNumber: '',
          stockQuantity: '',
          costPrice: '',
          remark: ''
        });
        setSelectedDate(undefined);
        setSpecifications({});
        setOpen(false);
        fetchInventory();
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
        <h1 className="text-xl font-semibold">Inventory</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a product to the inventory.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              
              {/* Category Dropdown */}
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {form.category || "Select Category"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((cat) => (
                        <CommandItem
                          key={cat._id}
                          onSelect={() => {
                            setForm((prev) => ({ ...prev, category: cat.name }));
                            setSpecifications({});
                            setCategoryOpen(false);
                          }}
                        >
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Brand Dropdown */}
              <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {form.brand || "Select Brand"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search brand..." />
                    <CommandEmpty>No brand found.</CommandEmpty>
                    <CommandGroup>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand._id}
                          onSelect={() => {
                            setForm((prev) => ({ ...prev, brand: brand.name }));
                            setBrandOpen(false);
                          }}
                        >
                          {brand.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Input name="product" placeholder="Product" value={form.product} onChange={handleChange} />
              <Input name="modelNumber" placeholder="Model Number" value={form.modelNumber} onChange={handleChange} />
              <Input name="stockQuantity" type="number" placeholder="Stock Quantity" value={form.stockQuantity} onChange={handleChange} />
              <Input name="costPrice" type="number" placeholder="Cost Price" value={form.costPrice} onChange={handleChange} />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!selectedDate}
                    className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate} 
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Input name="remark" placeholder="Remark" value={form.remark} onChange={handleChange} />

              {/* 👇 Dynamic Spec Fields */}
              {CATEGORY_FIELDS[form.category]?.map((field) => (
                <Input
                  key={field}
                  placeholder={field}
                  value={specifications[field] || ''}
                  onChange={(e) => handleSpecChange(field, e.target.value)}
                />
              ))}

              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <AgGridTable columnDefs={columnDefs} rowData={rowData}
          
          />
        </div>
      </div>
    </div>
  );
}
