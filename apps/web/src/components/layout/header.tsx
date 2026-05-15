'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { GlobalSearch } from './global-search'
import { MobileNav } from './mobile-nav'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const { theme, setTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
      const isSearch = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (isSearch) {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
      <header className="border-border bg-background relative z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="min-w-0">
            <h1 className="text-foreground truncate text-sm font-semibold">{title}</h1>
            {description && (
              <p className="text-muted-foreground hidden truncate text-xs sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Pesquisar"
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
          >
            <Search className="h-4 w-4" />
            <kbd className="border-border bg-muted/50 hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline">
              Ctrl K
            </kbd>
          </button>

          <button
            aria-label="Notificações"
            className="text-muted-foreground hover:bg-accent hover:text-foreground hidden h-8 w-8 items-center justify-center rounded-md transition-colors sm:flex"
          >
            <Bell className="h-4 w-4" />
          </button>

          <button
            aria-label="Alternar tema"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          >
            <Sun className={cn('h-4 w-4', theme === 'dark' ? 'hidden' : 'block')} />
            <Moon className={cn('h-4 w-4', theme === 'dark' ? 'block' : 'hidden')} />
          </button>

          <div className="ml-1 flex items-center gap-2">
            <Avatar className="border-border h-7 w-7 overflow-hidden rounded-full border">
              <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-foreground text-xs font-medium leading-none">{user?.name}</p>
              <p className="text-muted-foreground text-[10px] capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} pathname={pathname} onClose={() => setMobileOpen(false)} />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
