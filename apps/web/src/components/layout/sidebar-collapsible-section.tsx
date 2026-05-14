'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@repo/ui'

export interface CollapsibleNavEntry {
  code: string
  shortLabel: string
  title: string
}

interface CollapsibleSectionProps {
  label: string
  icon: React.ElementType
  baseHref: string
  pathname: string
  items: CollapsibleNavEntry[]
}

export function CollapsibleSection({
  label,
  icon: Icon,
  baseHref,
  pathname,
  items,
}: CollapsibleSectionProps) {
  const sectionActive = pathname.startsWith(baseHref)
  const [open, setOpen] = useState(sectionActive)

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          sectionActive
            ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
        )}
        aria-expanded={open}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden pl-7"
          >
            <li>
              <SubItem href={baseHref} active={pathname === baseHref}>
                Visão geral
              </SubItem>
            </li>
            {items.map((item) => {
              const href = `${baseHref}/${item.code}`
              return (
                <li key={item.code}>
                  <SubItem href={href} active={pathname === href}>
                    <span className="text-muted-foreground/70 mr-2 font-mono text-[11px] uppercase">
                      {item.shortLabel}
                    </span>
                    {item.title}
                  </SubItem>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SubItemProps {
  href: string
  active: boolean
  children: React.ReactNode
}

function SubItem({ href, active, children }: SubItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center rounded-md px-3 py-1.5 text-xs transition-colors',
        active
          ? 'text-sidebar-foreground bg-sidebar-accent font-medium'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
      )}
    >
      {children}
    </Link>
  )
}
