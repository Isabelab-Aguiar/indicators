'use client'

import { INDICATOR_LIST } from '@/lib/indicators-aps'

export function PracticeToc() {
  return (
    <nav
      aria-label="Sumário dos indicadores"
      className="border-border bg-card sticky top-6 rounded-xl border p-4"
    >
      <p className="text-foreground mb-3 text-[11px] font-semibold uppercase tracking-wider">
        Indicadores
      </p>
      <ol className="space-y-1">
        {INDICATOR_LIST.map((indicator) => (
          <li key={indicator.code}>
            <a
              href={`#${indicator.code}`}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/40 flex items-center gap-3 rounded-md px-2 py-1.5 text-xs transition-colors"
            >
              <span className="text-muted-foreground/70 font-mono text-[11px] uppercase">
                {indicator.shortLabel}
              </span>
              <span className="truncate">{indicator.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
