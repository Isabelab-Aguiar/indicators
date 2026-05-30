'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, LogOut, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/hooks/use-auth'
import { INDICATOR_LIST } from '@/lib/indicators-aps'
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/lib/nav-config'
import { TenantBadge } from './tenant-badge'
import { CollapsibleSection, type CollapsibleNavEntry } from './sidebar-collapsible-section'

const ENABLED_INDICATOR_CODES: ReadonlySet<string> = new Set(['c1', 'c3', 'c5', 'c6', 'c7'])

function indicatorNavItems(): CollapsibleNavEntry[] {
  return INDICATOR_LIST.filter((i) => ENABLED_INDICATOR_CODES.has(i.code)).map((i) => ({
    code: i.code,
    shortLabel: i.shortLabel,
    title: i.title,
  }))
}

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <aside className="border-sidebar-border bg-sidebar hidden h-screen w-[240px] flex-col border-r lg:flex">
      <div className="flex items-center gap-2 px-4 py-5">
        <Activity className="text-primary h-6 w-6" />
        <span className="text-sidebar-foreground text-sm font-semibold">Indicadores APS</span>
      </div>

      <div className="px-3 pb-2">
        <TenantBadge esfName={user?.esfName ?? ''} esfCode={user?.esfCode ?? ''} />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}
        <CollapsibleSection
          label="Linhas de Cuidado"
          icon={Stethoscope}
          baseHref="/indicadores"
          pathname={pathname}
          items={indicatorNavItems()}
        />
      </nav>

      <div className="border-sidebar-border space-y-0.5 border-t px-3 py-3">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem key={item.href} {...item} active={pathname === item.href} />
        ))}
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

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  active: boolean
}

function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-indicator"
          className="bg-primary absolute left-0 top-1 h-[calc(100%-8px)] w-0.5 rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  )
}
