"use client"

import type React from "react"

import { Home, Users, Eye, FileText, LogOut, Utensils } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="min-h-screen bg-[#fef7ff]">
      {/* Header */}
      <header className="border-b border-[#cac4d0] bg-[#fef7ff] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-[#1d1b20]">
            Comedor el Buen Rugroso
            <br />
          </div>
          <div className="flex items-center">
            <span className="mr-6 text-[#1d1b20]">{title}</span>
            <div className="ml-auto flex items-center gap-4">
              <span className="font-medium text-[#1d1b20]">Admin</span>
              <Link href="#" className="text-[#1d1b20]">
                <LogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#cac4d0] bg-[#fef7ff]">
          <nav className="flex flex-col">
            <Link
              href="/"
              className={`flex items-center gap-3 p-4 ${
                isActive("/") ? "bg-[#e8def8] text-[#1d1b20]" : "text-[#49454f] hover:bg-[#f3edf7]"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/registro-consumo"
              className={`flex items-center gap-3 p-4 ${
                isActive("/registro-consumo") ? "bg-[#e8def8] text-[#1d1b20]" : "text-[#49454f] hover:bg-[#f3edf7]"
              }`}
            >
              <Utensils className="h-5 w-5" />
              <span>Registro consumo</span>
            </Link>
            <Link
              href="/registro-empleados"
              className={`flex items-center gap-3 p-4 ${
                isActive("/registro-empleados") ? "bg-[#e8def8] text-[#1d1b20]" : "text-[#49454f] hover:bg-[#f3edf7]"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Registro empleados</span>
            </Link>
            <Link
              href="/visualizacion"
              className={`flex items-center gap-3 p-4 ${
                isActive("/visualizacion") ? "bg-[#e8def8] text-[#1d1b20]" : "text-[#49454f] hover:bg-[#f3edf7]"
              }`}
            >
              <Eye className="h-5 w-5" />
              <span>Visualización</span>
            </Link>
            <Link
              href="/reportes"
              className={`flex items-center gap-3 p-4 ${
                isActive("/reportes") ? "bg-[#e8def8] text-[#1d1b20]" : "text-[#49454f] hover:bg-[#f3edf7]"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Reportes</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
