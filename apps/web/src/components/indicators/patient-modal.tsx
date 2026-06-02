'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@repo/ui'

interface PatientModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  badge?: string
  badgeClass?: string
  children: React.ReactNode
}

export function PatientModal({
  open,
  onClose,
  title,
  subtitle,
  badge,
  badgeClass,
  children,
}: PatientModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="bg-card border-border fixed inset-x-4 top-[50%] z-[70] max-h-[85vh] w-auto max-w-lg -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-auto sm:left-[50%] sm:w-full sm:-translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-foreground truncate text-sm font-semibold">{title}</h2>
                    {badge && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          badgeClass,
                        )}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  {subtitle && <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-accent mt-0.5 shrink-0 rounded-lg p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 73px)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface DetailSectionProps {
  title: string
  children: React.ReactNode
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="border-border border-b px-5 py-4 last:border-0">
      <p className="text-muted-foreground mb-3 text-[10px] font-semibold uppercase tracking-widest">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: React.ReactNode
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground shrink-0 text-xs">{label}</span>
      <span className="text-foreground text-right text-xs font-medium">{value}</span>
    </div>
  )
}

interface CriterionBadgeProps {
  label: string
  achieved: boolean
}

export function CriterionBadge({ label, achieved }: CriterionBadgeProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-2',
        achieved
          ? 'bg-emerald-500/8 border border-emerald-500/20'
          : 'bg-red-500/8 border border-red-500/20',
      )}
    >
      <span className="text-foreground text-xs font-medium">{label}</span>
      <span
        className={cn(
          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold',
          achieved
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-500/15 text-red-600 dark:text-red-400',
        )}
      >
        {achieved ? 'Atingido' : 'Pendente'}
      </span>
    </div>
  )
}
