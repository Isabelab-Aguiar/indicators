'use client'

import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  BookOpen,
  FileUp,
  History,
  LayoutDashboard,
  Search,
  Stethoscope,
  User,
  Users,
} from 'lucide-react'

import { usePregnantWomen } from '@/hooks/use-pregnant-women'
import { INDICATOR_LIST } from '@/lib/indicators-aps'
import { C1_DEFINITION } from '@/lib/indicators-aps/c1-data'

import {
  EmptyHint,
  NavGroups,
  ResultButton,
  ResultGroup,
  type NavTarget,
} from './global-search-results'

const STATIC_TARGETS: NavTarget[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Navegação' },
  { label: 'Gestantes', href: '/gestantes', icon: Users, group: 'Navegação' },
  { label: 'Importar', href: '/importar', icon: FileUp, group: 'Navegação' },
  { label: 'Histórico', href: '/historico', icon: History, group: 'Navegação' },
  { label: 'Boas Práticas', href: '/boas-praticas', icon: BookOpen, group: 'Navegação' },
  { label: 'Perfil', href: '/perfil', icon: User, group: 'Navegação' },
]

function indicatorTargets(): NavTarget[] {
  const c1: NavTarget = {
    label: `${C1_DEFINITION.shortLabel} · ${C1_DEFINITION.title}`,
    href: `/indicadores/${C1_DEFINITION.code}`,
    icon: Stethoscope,
    group: 'Linhas de cuidado',
  }
  const others: NavTarget[] = INDICATOR_LIST.map((indicator) => ({
    label: `${indicator.shortLabel} · ${indicator.title}`,
    href: `/indicadores/${indicator.code}`,
    icon: Stethoscope,
    group: 'Linhas de cuidado',
  }))
  return [c1, ...others]
}

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const trimmed = query.trim()
  const womenQuery = usePregnantWomen(
    trimmed.length >= 2 ? { search: trimmed, page: 1, pageSize: 6 } : {},
  )

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const navTargets = useMemo(() => [...STATIC_TARGETS, ...indicatorTargets()], [])
  const filteredNav = useMemo(() => {
    if (!trimmed) return navTargets
    const term = trimmed.toLowerCase()
    return navTargets.filter((target) => target.label.toLowerCase().includes(term))
  }, [navTargets, trimmed])

  const womenResults = trimmed.length >= 2 ? (womenQuery.data?.data ?? []) : []

  function navigate(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          asChild
          className="fixed left-1/2 top-[18%] z-50 w-[min(580px,calc(100vw-32px))] -translate-x-1/2"
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.16 }}
            className="border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-2xl"
          >
            <Dialog.Title className="sr-only">Buscar</Dialog.Title>
            <div className="border-border/60 flex items-center gap-3 border-b px-4 py-3">
              <Search className="text-muted-foreground h-4 w-4 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar gestantes, indicadores, páginas..."
                className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              />
              <kbd className="text-muted-foreground border-border hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                ESC
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {trimmed.length >= 2 && (
                <ResultGroup label="Gestantes">
                  {womenResults.length === 0 ? (
                    <EmptyHint
                      text={womenQuery.isLoading ? 'Buscando...' : 'Nenhuma gestante encontrada'}
                    />
                  ) : (
                    womenResults.map((w) => (
                      <ResultButton
                        key={w.id}
                        icon={Users}
                        primary={w.name}
                        secondary={`CPF ${w.cpf} · Microárea ${w.microarea}`}
                        onSelect={() => navigate(`/gestantes/${w.id}`)}
                      />
                    ))
                  )}
                </ResultGroup>
              )}
              <NavGroups targets={filteredNav} onSelect={navigate} />
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
