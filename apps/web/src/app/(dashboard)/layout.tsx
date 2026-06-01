import { Sidebar } from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { IndicatorFiltersProvider } from '@/providers/indicator-filters-provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <IndicatorFiltersProvider>
        <div className="bg-background flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </IndicatorFiltersProvider>
    </ProtectedRoute>
  )
}
