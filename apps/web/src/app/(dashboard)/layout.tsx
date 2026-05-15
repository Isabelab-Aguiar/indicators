import { Sidebar } from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="bg-background flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
