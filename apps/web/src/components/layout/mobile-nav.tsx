'use client'

import Link from 'next/link'
import { ChevronRight, LogOut, Stethoscope } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/hooks/use-auth'
import { INDICATOR_LIST } from '@/lib/indicators-aps'
import { C1_DEFINITION } from '@/lib/indicators-aps/c1-data'
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from '@/lib/nav-config'

const ENABLED_CODES: ReadonlySet<string> = new Set(['c1', 'c3'])

interface MobileNavProps {
  open: boolean
  pathname: string
  onClose: () => void
}

export function MobileNav({ open, pathname, onClose }: MobileNavProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const indicatorItems = [
    { code: C1_DEFINITION.code, shortLabel: C1_DEFINITION.shortLabel, title: C1_DEFINITION.title },
    ...INDICATOR_LIST.filter((i) => ENABLED_CODES.has(i.code)).map((i) => ({
      code: i.code,
      shortLabel: i.shortLabel,
      title: i.title,
    })),
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-border bg-background fixed inset-x-0 top-14 z-40 border-b shadow-xl lg:hidden"
          >
            <div className="flex max-h-[calc(100svh-56px)] flex-col overflow-y-auto">
              <nav className="space-y-0.5 p-3">
                {NAV_ITEMS.map((item) => {
                  const active = pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />}
                    </Link>
                  )
                })}

                <div className="border-border my-1.5 border-t" />

                <Link
                  href="/indicadores"
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname.startsWith('/indicadores')
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Stethoscope className="h-4 w-4 shrink-0" />
                  Linhas de Cuidado
                </Link>

                <div className="space-y-0.5 pl-7">
                  {indicatorItems.map((item) => {
                    const href = `/indicadores/${item.code}`
                    const active = pathname === href
                    return (
                      <Link
                        key={item.code}
                        href={href}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors',
                          active
                            ? 'text-foreground bg-accent font-medium'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        )}
                      >
                        <span className="text-muted-foreground/70 font-mono text-[10px] uppercase">
                          {item.shortLabel}
                        </span>
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </nav>

              <div className="border-border border-t p-3">
                <div className="mb-2 flex items-center gap-3 px-3 py-2">
                  <Avatar className="border-border h-8 w-8 overflow-hidden rounded-full border">
                    <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-[10px] font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">{user?.name}</p>
                    <p className="text-muted-foreground text-xs capitalize">{user?.role}</p>
                  </div>
                </div>

                {BOTTOM_NAV_ITEMS.map((item) => {
                  const active = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}

                <button
                  onClick={() => logout.mutate()}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sair
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-30 bg-black/20 lg:hidden"
            onClick={onClose}
          />
        </>
      )}
    </AnimatePresence>
  )
}
