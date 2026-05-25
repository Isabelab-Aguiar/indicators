'use client'

import { useState, useMemo } from 'react'
import type { C1SimuladorState, C1SimuladorResult } from '../types/c1.types'
import { simularC1 } from '../services/c1-calculator'

export function useC1Simulador() {
  const [state, setState] = useState<C1SimuladorState>({ programada: 200, espontanea: 300 })

  const result = useMemo<C1SimuladorResult>(
    () => simularC1(state.programada, state.espontanea),
    [state.programada, state.espontanea],
  )

  function setField(field: keyof C1SimuladorState, value: number) {
    setState((prev) => ({ ...prev, [field]: Math.max(0, value) }))
  }

  return { state, result, setField }
}
