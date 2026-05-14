'use client'

import { useMemo } from 'react'

import { cn } from '@repo/ui'

export interface NavTarget {
  label: string
  href: string
  icon: React.ElementType
  group: 'Navegação' | 'Linhas de cuidado'
}

interface NavGroupsProps {
  targets: NavTarget[]
  onSelect: (href: string) => void
}

export function NavGroups({ targets, onSelect }: NavGroupsProps) {
  const grouped = useMemo(() => {
    const map = new Map<NavTarget['group'], NavTarget[]>()
    for (const target of targets) {
      const list = map.get(target.group) ?? []
      list.push(target)
      map.set(target.group, list)
    }
    return Array.from(map.entries())
  }, [targets])

  if (targets.length === 0) {
    return <EmptyHint text="Nenhum resultado" />
  }

  return (
    <>
      {grouped.map(([group, items]) => (
        <ResultGroup key={group} label={group}>
          {items.map((target) => (
            <ResultButton
              key={target.href}
              icon={target.icon}
              primary={target.label}
              onSelect={() => onSelect(target.href)}
            />
          ))}
        </ResultGroup>
      ))}
    </>
  )
}

export function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

interface ResultButtonProps {
  icon: React.ElementType
  primary: string
  secondary?: string
  onSelect: () => void
}

export function ResultButton({ icon: Icon, primary, secondary, onSelect }: ResultButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'hover:bg-muted/60 group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
        'focus-visible:bg-muted/60 focus-visible:outline-none',
      )}
    >
      <div className="bg-muted/40 text-muted-foreground group-hover:bg-card flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{primary}</p>
        {secondary && <p className="text-muted-foreground truncate text-[11px]">{secondary}</p>}
      </div>
    </button>
  )
}

export function EmptyHint({ text }: { text: string }) {
  return <p className="text-muted-foreground px-2.5 py-3 text-xs">{text}</p>
}
