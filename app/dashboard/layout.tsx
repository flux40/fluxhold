// app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function DashboardLayout({
  children,
  title = 'Dashboard'
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060B14] via-[#0B1C2D] to-[#0B1C2D]">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/80" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72">
            <Sidebar 
              isOpen={true} 
              onToggle={() => setMobileSidebarOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Topbar */}
      <Topbar 
        title={title}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      {/* Main Content */}
      <main className={`py-6 transition-all duration-300 ${
        sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
      }`}>
        <div className="">
          {children}
        </div>
      </main>
    </div>
  )
}