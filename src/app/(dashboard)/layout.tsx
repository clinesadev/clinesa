import type { ReactNode } from 'react'

import Sidebar from '@/components/nav/Sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <Sidebar />
      <main className="p-6">{children}</main>
    </div>
  )
}
