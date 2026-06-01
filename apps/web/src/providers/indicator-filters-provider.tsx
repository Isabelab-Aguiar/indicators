'use client'

import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { getQuadrimestre, type Quadrimestre } from '@/lib/quadrimestre'

export interface IndicatorFilters {
  quad: Quadrimestre
  year: number
  microarea: string
}

interface IndicatorFiltersContextValue {
  filters: IndicatorFilters
  microareaOptions: string[]
  setFilters: (f: IndicatorFilters) => void
  setMicroareaOptions: (opts: string[]) => void
}

const IndicatorFiltersContext = createContext<IndicatorFiltersContextValue | null>(null)

export function IndicatorFiltersProvider({ children }: { children: React.ReactNode }) {
  const now = new Date()
  const [filters, setFilters] = useState<IndicatorFilters>({
    quad: getQuadrimestre(now),
    year: now.getFullYear(),
    microarea: '',
  })
  const [microareaOptions, setMicroareaOptions] = useState<string[]>([])

  const handleSetMicroareaOptions = useCallback((opts: string[]) => {
    setMicroareaOptions(opts)
  }, [])

  const value = useMemo(
    () => ({
      filters,
      microareaOptions,
      setFilters,
      setMicroareaOptions: handleSetMicroareaOptions,
    }),
    [filters, microareaOptions, handleSetMicroareaOptions],
  )

  return (
    <IndicatorFiltersContext.Provider value={value}>{children}</IndicatorFiltersContext.Provider>
  )
}

export function useIndicatorFilters() {
  const ctx = useContext(IndicatorFiltersContext)
  if (!ctx) throw new Error('useIndicatorFilters must be used within IndicatorFiltersProvider')
  return ctx
}
