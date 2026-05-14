'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@repo/ui'
import { useAuditLogs } from '@/hooks/use-audit-logs'
import type { AuditEntity, AuditLog } from '@repo/types'

import { AuditActionBadge } from './audit-action-badge'

const ENTITY_LABEL: Record<AuditEntity, string> = {
  pregnant_women: 'Gestante',
  users: 'Usuário',
  imports: 'Importação',
  auth: 'Autenticação',
  settings: 'Configurações',
}

export function AuditLogList() {
  const { data, isLoading } = useAuditLogs()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    const term = search.trim().toLowerCase()
    if (!term) return data
    return data.filter((log) => {
      const haystack = [
        log.user?.name ?? '',
        log.user?.email ?? '',
        log.action,
        ENTITY_LABEL[log.entity],
        log.entityId ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [data, search])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Registros recentes</CardTitle>
          <CardDescription className="text-xs">
            Até 200 últimas ações realizadas na sua ESF
          </CardDescription>
        </div>
        <Input
          placeholder="Buscar por usuário, ação ou entidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-3.5 w-3.5" />}
          className="sm:max-w-xs"
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          <EmptyState searching={!!search.trim()} />
        ) : (
          <ul className="divide-border/60 divide-y">
            {filtered.map((log, index) => (
              <LogRow key={log.id} log={log} index={index} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

interface LogRowProps {
  log: AuditLog
  index: number
}

function LogRow({ log, index }: LogRowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.4) }}
      className="flex items-start gap-3 py-3"
    >
      <Avatar name={log.user?.name ?? null} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-foreground text-sm font-semibold">
            {log.user?.name ?? 'Sistema'}
          </span>
          <AuditActionBadge action={log.action} />
          <span className="text-muted-foreground text-xs">{ENTITY_LABEL[log.entity]}</span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {new Date(log.createdAt).toLocaleString('pt-BR')} · IP {log.ipAddress}
        </p>
      </div>
    </motion.li>
  )
}

function Avatar({ name }: { name: string | null }) {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'SY'
  return (
    <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
      {initials}
    </div>
  )
}

function SkeletonRows() {
  return (
    <ul className="divide-border/60 divide-y">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex items-start gap-3 py-3">
          <div className="bg-muted h-8 w-8 shrink-0 animate-pulse rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="bg-muted h-3 w-48 animate-pulse rounded" />
            <div className="bg-muted h-3 w-32 animate-pulse rounded" />
          </div>
        </li>
      ))}
    </ul>
  )
}

function EmptyState({ searching }: { searching: boolean }) {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
      <p className="text-muted-foreground text-sm font-medium">
        {searching ? 'Nenhum registro encontrado para essa busca' : 'Nenhum registro disponível'}
      </p>
    </div>
  )
}
