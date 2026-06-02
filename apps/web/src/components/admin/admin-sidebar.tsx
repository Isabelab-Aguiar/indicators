'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, Building2, LayoutDashboard, LogOut, Users } from 'lucide-react'

import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/hooks/use-auth'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/solicitacoes', label: 'Solicitações', icon: BarChart2 },
  { href: '/admin/esfs', label: 'ESFs', icon: Building2 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const logout = useLogout()
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="border-sidebar-border bg-sidebar hidden h-screen w-[220px] flex-col border-r lg:flex">
      <div className="flex items-center gap-2 px-4 py-5">
        <LayoutDashboard className="text-primary h-5 w-5" />
        <span className="text-sidebar-foreground text-sm font-semibold">Admin</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-sidebar-border border-t px-3 py-3">
        <div className="mb-2 px-3">
          <p className="text-foreground text-xs font-medium">{user?.name}</p>
          <p className="text-muted-foreground text-[10px]">{user?.email}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
