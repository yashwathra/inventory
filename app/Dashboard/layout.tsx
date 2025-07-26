// app/dashboard/layout.tsx

import Navbar from '@/components/Dashboard/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex-1 overflow-auto p-4 pt-15">
       
        {children}
      </main>
    </div>
  );
}
