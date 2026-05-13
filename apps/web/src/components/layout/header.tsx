'use client'

import { Bell, Moon, Sun, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { cn } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const user = useAuthStore((s) => s.user)
  const { theme, setTheme } = useTheme()

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="border-border bg-background flex h-14 items-center justify-between border-b px-6">
      <div>
        <h1 className="text-foreground text-sm font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label="Pesquisar"
          className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>

        <button
          aria-label="Notificações"
          className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          aria-label="Alternar tema"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
        >
          <Sun className={cn('h-4 w-4 transition-all', theme === 'dark' ? 'hidden' : 'block')} />
          <Moon className={cn('h-4 w-4 transition-all', theme === 'dark' ? 'block' : 'hidden')} />
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
  )
}
