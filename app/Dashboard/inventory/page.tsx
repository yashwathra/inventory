'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import AgGridTable from '@/components/common/AgGridTable';

interface ProductType {
  _id: string;
  name: string;
  brand: string;
  category: string;
  modelNumber: string;
  specifications?: Record<string, string>;
}

interface InventoryType {
  _id?: string;
  product: ProductType;
  stockQuantity: number;
  costPrice: number;
  purchaseDate: string;
  remark: string;
  specifications: Record<string, string>;
}

const columnDefs = [
  { headerName: 'Product', field: 'product.name', flex: 1 },
  { headerName: 'Brand', field: 'product.brand', flex: 1 },
  { headerName: 'Category', field: 'product.category', flex: 1 },
  { headerName: 'Model', field: 'product.modelNumber', flex: 1 },
  { headerName: 'Stock', field: 'stockQuantity', flex: 1 },
  { headerName: 'Cost Price', field: 'costPrice', flex: 1 },
  { headerName: 'Purchase Date', field: 'purchaseDate', flex: 1 },
  { headerName: 'Remark', field: 'remark', flex: 1 },
];

export default function InventoryPage() {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [remark, setRemark] = useState('');
  const [inventoryData, setInventoryData] = useState<InventoryType[]>([]);

  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    fetch('/api/Dashboard/product/get')
      .then((res) => res.json())
      .then((data) => setProducts(data.data || []))
      .catch(() => toast.error('Failed to fetch products'));

    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await fetch('/api/Dashboard/inventory/get');
    const data = await res.json();
    setInventoryData(data.data || []);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !costPrice || !purchaseDate) {
      toast.error('Please fill required fields');
      return;
    }

    const finalSpecifications = { ...specifications };
    if (newSpecKey && newSpecValue) {
      finalSpecifications[newSpecKey] = newSpecValue;
    }

    const payload = {
      product: selectedProduct._id,
      costPrice: Number(costPrice),
      stockQuantity: Number(stockQuantity),
      purchaseDate,
      remark,
      specifications: finalSpecifications,
    };

    try {
      const res = await fetch('/api/Dashboard/inventory/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Inventory added');
        setOpen(false);
        setSelectedProduct(null);
        setCostPrice('');
        setStockQuantity('');
        setPurchaseDate(new Date());
        setRemark('');
        setSpecifications({});
        setNewSpecKey('');
        setNewSpecValue('');
        fetchInventory();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to add inventory');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };


  const handleSpecChange = (key: string, value: string) => {
    setSpecifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddNewSpec = () => {
    if (newSpecKey && newSpecValue) {
      setSpecifications((prev) => ({
        ...prev,
        [newSpecKey]: newSpecValue,
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Inventory</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Inventory
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory</DialogTitle>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              {/* Product Dropdown */}
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedProduct
                      ? `${selectedProduct.brand} - ${selectedProduct.name} (${selectedProduct.modelNumber})`
                      : 'Select Product'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup>
                      {products.map((prod) => (
                        <CommandItem
                          key={prod._id}
                          onSelect={() => {
                            setSelectedProduct(prod);
                            setProductOpen(false);
                            setSpecifications({});
                          }}

                        >
                          {prod.brand} - {prod.name} ({prod.modelNumber})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Editable Specifications */}
              {selectedProduct && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Specifications</h4>
                  {Object.entries(specifications).map(([key, value], i) => (
                    <div key={i} className="flex gap-2">
                      <Input disabled value={key} className="w-1/3" />
                      <Input
                        value={value}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        className="w-2/3"
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="New Spec Key"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                    />
                    <Input
                      placeholder="New Spec Value"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddNewSpec}>
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <Input
                placeholder="Stock Quantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />
              <Input
                placeholder="Cost Price"
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left', !purchaseDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                placeholder="Remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />

              <Button type="submit">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto min-w-[1200px]">
        <AgGridTable columnDefs={columnDefs} rowData={inventoryData} />
      </div>
    </div>
  );
}
