'use client';

import AgGridTable from "@/components/common/AgGridTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import axios from "axios";

// Type definitions
interface InventoryItem {
  _id: string;
  product: string;
  brand: string;
  costPrice: number;
}

interface Bill {
  billNo: string;
  customer: string;
  phone: string;
  products: string;
  stock: number;
  total: string;
  billDate: string;
  paymentMode: string;
}

const columnDefs = [
  { headerName: "Bill No", field: "billNo", flex: 1 },
  { headerName: "Customer", field: "customer", flex: 1 },
  { headerName: "Phone", field: "phone", flex: 1 },
  { headerName: "Products", field: "products", flex: 1 },
  { headerName: "Quantity", field: "stock", flex: 1 },
  { headerName: "Total Amount", field: "total", flex: 1 },
  { headerName: "Date", field: "billDate", flex: 1 },
  { headerName: "Payment Mode", field: "paymentMode", flex: 1 },
];

export default function SalesPage() {
  const [open, setOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/api/Dashboard/inventory/get");
        setInventory(res.data.data || []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchInventory();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get("/api/Dashboard/bills/get");

    const formatted: Bill[] = res.data.data.map((bill: {
  _id: string;
  customer: { name: string; phone: string };
  products: { product: string; quantity: number }[];
  totalAmount: number;
  billDate: string;
  paymentMode: string;
}) => ({

        billNo: bill._id.slice(-6).toUpperCase(),
        customer: bill.customer?.name,
        phone: bill.customer?.phone,
        products: bill.products.map((p: { product: string }) => p.product).join(", "),
stock: bill.products.reduce((sum: number, p: { quantity: number }) => sum + (p.quantity || 1), 0),

        total: `₹${bill.totalAmount}`,
        billDate: bill.billDate ? new Date(bill.billDate).toISOString().split("T")[0] : "",
        paymentMode: bill.paymentMode || "N/A",
      }));

      setBills(formatted);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const selectedProduct = inventory.find((item) => item._id === selectedProductId);
    if (selectedProduct) {
      setTotalAmount(selectedProduct.costPrice * quantity);
    }
  }, [selectedProductId, quantity, inventory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      selectedProductIds: [selectedProductId],
      quantity,
      paymentMode,
      billDate: new Date().toISOString(),
    };

    try {
      await axios.post("/api/Dashboard/bills/create", payload);
      await fetchBills();
      setOpen(false);
    } catch (err) {
      console.error("Error creating bill:", err);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Sales / Billing</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Bill</DialogTitle>
              <DialogDescription>Fill in the details to generate a new bill.</DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />

              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Select Product</option>
                {inventory.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.product} - {item.brand} ({item.costPrice}₹)
                  </option>
                ))}
              </select>

              <Input
                placeholder="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />

              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="border rounded p-2"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>

              <div>Total: ₹{totalAmount}</div>

              <Button type="submit">Save Bill</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <AgGridTable columnDefs={columnDefs} rowData={bills} />
        </div>
      </div>
    </div>
  );
}
