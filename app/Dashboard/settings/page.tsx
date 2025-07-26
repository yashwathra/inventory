'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import AgGridTable from '@/components/common/AgGridTable';

export default function BrandCategoryPage() {
  const [brandOpen, setBrandOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [brandData, setBrandData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/Dashboard/brand/get');
      const data = await res.json();
      if (res.ok) setBrandData(data.data);
      else toast.error(data.message || 'Failed to fetch brands');
    } catch (err) {
      toast.error('Failed to fetch brands');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/Dashboard/category/get');
      const data = await res.json();
      if (res.ok) setCategoryData(data.data);
      else toast.error(data.message || 'Failed to fetch categories');
    } catch (err) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const handleCreateBrand = async () => {
    if (!brandName.trim()) {
      toast.error('Brand name is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/Dashboard/brand/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: brandName, description: brandDesc }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Brand created successfully');
        setBrandOpen(false);
        setBrandName('');
        setBrandDesc('');
        fetchBrands(); 
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Error creating brand');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCategoryLoading(true);
    try {
      const res = await fetch('/api/Dashboard/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName, description: categoryDesc }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Category created successfully');
        setCategoryOpen(false);
        setCategoryName('');
        setCategoryDesc('');
        fetchCategories(); // reload list
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Error creating category');
    } finally {
      setCategoryLoading(false);
    }
  };

  const brandColumnDefs = [
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    
  ];

  const categoryColumnDefs = [
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {/* Create Brand Section */}
        <div className="bg-sky-500 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Brand</h2>
          <Button variant="outline" className="bg-white text-black" onClick={() => setBrandOpen(true)}>
            + Add Brand
          </Button>

          <Dialog open={brandOpen} onOpenChange={setBrandOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Brand Name</Label>
                <Input placeholder="e.g., Nike" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                <Label>Description</Label>
                <Textarea placeholder="Optional..." value={brandDesc} onChange={(e) => setBrandDesc(e.target.value)} />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="ghost" onClick={() => setBrandOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateBrand} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Brand'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Create Category Section */}
        <div className="bg-sky-500 text-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Category</h2>
          <Button variant="outline" className="bg-white text-black" onClick={() => setCategoryOpen(true)}>
            + Add Category
          </Button>

          <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Label>Category Name</Label>
                <Input placeholder="e.g., Electronics" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <Label>Description</Label>
                <Textarea placeholder="Optional..." value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="ghost" onClick={() => setCategoryOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateCategory} disabled={categoryLoading}>
                  {categoryLoading ? 'Saving...' : 'Save Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
  {/* Brand Table */}
  <div className="bg-white rounded-2xl p-4 shadow">
    <h2 className="text-xl font-semibold text-black mb-2">Brand List</h2>
    <AgGridTable columnDefs={brandColumnDefs} rowData={brandData} />
  </div>

  {/* Category Table */}
  <div className="bg-white rounded-2xl p-4 shadow">
    <h2 className="text-xl font-semibold text-black mb-2">Category List</h2>
    <AgGridTable columnDefs={categoryColumnDefs} rowData={categoryData} 
    />
  </div>
</div>

    </div>
  );
}
