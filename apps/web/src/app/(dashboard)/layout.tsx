import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/layout/sidebar'

async function validateSession() {
  const cookieStore = await cookies()
  const hasRefreshToken = cookieStore.has('refresh_token')
  return hasRefreshToken
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = await validateSession()

  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
