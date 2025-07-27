

import Navbar from '@/components/Dashboard/Navbar';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background text-text">
      <Navbar />

      <main className="flex-1 overflow-auto p-4 pt-15">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        {children}
      </main>
    </div>
  );
}
