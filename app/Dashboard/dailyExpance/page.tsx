'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AgGridTable from '@/components/common/AgGridTable';

export default function DailyIncomeTracker() {
  const [open, setOpen] = useState(false);
  const [sales, setSales] = useState('');
  const [expense, setExpense] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [rowData, setRowData] = useState<any[]>([]);

  const handleAddRecord = () => {
    if (!selectedDate || !sales || !expense) return;

    const newEntry = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      sales: parseFloat(sales),
      expense: parseFloat(expense),
      income: parseFloat(sales) - parseFloat(expense),
    };

    setRowData((prev) => [...prev, newEntry]);
    setSales('');
    setExpense('');
    setSelectedDate(undefined);
    setOpen(false);
  };

  const columnDefs = [
    { headerName: "Date", field: "date", flex: 1 },
    { headerName: "Sales (₹)", field: "sales", flex: 1 },
    { headerName: "Expense (₹)", field: "expense", flex: 1 },
    {
      headerName: "Net Income (₹)",
      field: "income",
      flex: 1,
      cellStyle: (params: any) => ({
        color: params.value < 0 ? 'red' : 'green',
        fontWeight: 'bold',
      }),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Daily Sales & Expense</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"
            >Add Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Daily Record</DialogTitle>
              <DialogDescription>Fill the form to log daily sales and expense</DialogDescription>
            </DialogHeader>

            <form className="grid gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!selectedDate}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
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
              </div>

              {/* Sales Input */}
              <div>
                <Label>Sales Amount (₹)</Label>
                <Input
                  type="number"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  placeholder="Enter sales amount"
                />
              </div>

              {/* Expense Input */}
              <div>
                <Label>Expense Amount (₹)</Label>
                <Input
                  type="number"
                  value={expense}
                  onChange={(e) => setExpense(e.target.value)}
                  placeholder="Enter expense amount"
                />
              </div>

              <Button type="button" onClick={handleAddRecord}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* AG Grid Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <AgGridTable columnDefs={columnDefs} rowData={rowData} />
        </div>
      </div>
    </div>
  );
}
