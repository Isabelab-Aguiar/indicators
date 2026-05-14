'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Badge } from '@repo/ui'
import { usePregnantWomen } from '@/hooks/use-pregnant-women'
import { BloodPressureBadge } from './blood-pressure-badge'
import { PregnantWomenFilters } from './pregnant-women-filters'
import type { PregnantWomanFilters } from '@repo/types'

export function PregnantWomenTable() {
  const [filters, setFilters] = useState<PregnantWomanFilters>({ page: 1, pageSize: 20 })
  const [search, setSearch] = useState('')
  const { data, isLoading } = usePregnantWomen(filters)

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={handleSearchChange}
            leftIcon={<Search className="h-3.5 w-3.5" />}
            className="w-72"
          />
          <PregnantWomenFilters filters={filters} onChange={setFilters} />
        </div>
        <Link href="/gestantes/novo">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nova gestante
          </Button>
        </Link>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border bg-muted/30 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  Nome
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  CPF
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  Microárea
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  Pressão Arterial
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  Consultas
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  Última Medição
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-border/50 border-b">
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="bg-muted h-3.5 w-24 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : data?.data.map((woman) => (
                      <motion.tr
                        key={woman.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-border/50 hover:bg-accent/50 border-b transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/gestantes/${woman.id}`}
                            className="text-foreground font-medium hover:underline"
                          >
                            {woman.name}
                          </Link>
                        </td>
                        <td className="text-muted-foreground px-4 py-3 font-mono">{woman.cpf}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{woman.microarea}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <BloodPressureBadge
                            value={woman.bloodPressure}
                            status={woman.bloodPressureStatus}
                          />
                        </td>
                        <td className="text-muted-foreground px-4 py-3">
                          {woman.prenatalConsultations}
                        </td>
                        <td className="text-muted-foreground px-4 py-3">
                          {woman.lastMeasurementDate
                            ? new Date(woman.lastMeasurementDate).toLocaleDateString('pt-BR')
                            : '-'}
                        </td>
                      </motion.tr>
                    ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {!isLoading && data && (
          <div className="border-border flex items-center justify-between border-t px-4 py-3">
            <p className="text-muted-foreground text-xs">
              {data.total} gestante{data.total !== 1 ? 's' : ''} encontrada
              {data.total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
              >
                Anterior
              </Button>
              <span className="text-muted-foreground text-xs">
                {filters.page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === data.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      {!isLoading && !data?.data.length && (
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <p className="text-muted-foreground text-sm font-medium">Nenhuma gestante encontrada</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Cadastre a primeira gestante ou ajuste os filtros
          </p>
        </div>
      )}
    </div>
  )
}
