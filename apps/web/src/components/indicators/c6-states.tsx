'use client'

import { PersonStanding, UploadCloud } from 'lucide-react'
import Link from 'next/link'

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-muted animate-pulse rounded-2xl ${className ?? ''}`} />
}

export function C6EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-24">
      <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-2xl">
        <PersonStanding className="text-muted-foreground h-6 w-6" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">Nenhum registro C6 encontrado</p>
        <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
          Importe uma planilha CSV com os dados de pessoas idosas para visualizar os indicadores de
          cuidado.
        </p>
      </div>
      <Link
        href="#importar"
        className="text-foreground bg-primary/8 hover:bg-primary/15 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
      >
        <UploadCloud className="h-3.5 w-3.5" />
        Importar planilha
      </Link>
    </div>
  )
}

export function C6SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-[88px]" />
        ))}
      </div>
      <div>
        <SkeletonBlock className="mb-4 h-4 w-36 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-60" />
          ))}
        </div>
      </div>
    </div>
  )
}
