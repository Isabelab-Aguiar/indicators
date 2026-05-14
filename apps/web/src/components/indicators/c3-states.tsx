'use client'

import { Baby } from 'lucide-react'

export function C3EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-20">
      <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
        <Baby className="text-muted-foreground h-5 w-5" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-medium">Nenhuma gestante cadastrada</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Cadastre gestantes para visualizar os indicadores pré-natal.
        </p>
      </div>
    </div>
  )
}

export function C3SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-border bg-card h-20 animate-pulse rounded-2xl border" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border bg-card h-52 animate-pulse rounded-2xl border" />
        ))}
      </div>
    </div>
  )
}
