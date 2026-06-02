import { AdminRoute } from '@/components/auth/admin-route'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <div className="bg-background flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </AdminRoute>
  )
}
