
'use client'

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-sky-500 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo / Brand */}
        <Link href="/Dashboard">
          <span className="text-xl font-bold">Vitara</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/Dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/Dashboard/product" className="hover:underline">Products</Link>
          <Link href="/Dashboard/inventory" className="hover:underline">Inventory</Link>
          <Link href="/Dashboard/sales" className="hover:underline">Sales</Link>
          <Link href="/Dashboard/dailyExpance" className="hover:underline">Daiy Expance</Link>
          <Link href="/Dashboard/settings" className="hover:underline">Settings</Link>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="text-black  hover:bg-white hover:text-sky-500">
            Logout
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="text-white" />
          </Button>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-sky-500 text-white px-4 pb-4 space-y-2">
          <Link href="/Dashboard" className="block">Dashboard</Link>
          <Link href="/Dashboard/product" className="block">Products</Link>
          <Link href="/Dashboard/inventory" className="block">Inventory</Link>
          <Link href="/Dashboard/sales" className="block">Sales</Link>
           <Link href="/Dashboard/dailyExpance" className="block">Daiy Expance</Link>
          <Link href="/Dashboard/settings" className="block">Settings</Link>
          <Button variant="outline" className="w-full border-white text-black hover:bg-white hover:text-sky-500">
            Logout
          </Button>
        </div>
      )}
    </header>
  )
}
