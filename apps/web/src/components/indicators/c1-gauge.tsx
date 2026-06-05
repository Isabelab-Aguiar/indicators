'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '@repo/ui'
import { C1_BANDS, classifyC1, type C1Band } from '@/lib/indicators-aps/c1-data'

interface C1GaugeProps {
  percent: number
  hideValue?: boolean
}

const VW = 320
const VH = 184
const CX = VW / 2
const CY = VW / 2
const RADIUS = 130
const STROKE = 22
const NEEDLE_LEN = RADIUS - STROKE / 2 - 6

function polarToCartesian(angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return { x: CX + RADIUS * Math.cos(rad), y: CY + RADIUS * Math.sin(rad) }
}

function arcPath(startPct: number, endPct: number): string {
  const start = polarToCartesian(startPct * 1.8)
  const end = polarToCartesian(endPct * 1.8)
  const largeArc = endPct - startPct > 50 ? 1 : 0
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function C1Gauge({ percent, hideValue = false }: C1GaugeProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const classification = classifyC1(clamped)
  const angle = useSpring(clamped * 1.8 - 90, { stiffness: 90, damping: 18 })
  const needleTransform = useTransform(angle, (a) => `rotate(${a}, ${CX}, ${CY})`)
  const [display, setDisplay] = useState(clamped)

  useEffect(() => {
    angle.set(clamped * 1.8 - 90)
    const start = performance.now()
    const from = display
    const tick = (now: number) => {
      const t = Math.min((now - start) / 700, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (clamped - from) * eased)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [clamped])

  return (
    <div className="flex w-full max-w-[320px] flex-col items-center">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" aria-hidden="true">
        <path d={arcPath(0, 100)} fill="none" strokeWidth={STROKE} className="stroke-muted/40" />
        {C1_BANDS.map((band, i) => (
          <BandArc key={`${band.key}-${i}`} band={band} />
        ))}
        <motion.g transform={needleTransform}>
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - NEEDLE_LEN}
            strokeWidth={3}
            strokeLinecap="round"
            className="stroke-foreground"
          />
        </motion.g>
        <circle
          cx={CX}
          cy={CY}
          r={7}
          strokeWidth={2.5}
          className="fill-background stroke-foreground"
        />
        <line
          x1={CX}
          y1={CY + STROKE / 2 + 8}
          x2={CX}
          y2={CY + STROKE / 2 + 2}
          strokeWidth={1.5}
          className="stroke-muted-foreground/60"
        />
      </svg>
      {!hideValue && (
        <div className="mt-2 flex flex-col items-center">
          <span className={cn('text-5xl font-bold tabular-nums', classification.band.text)}>
            {display.toFixed(1)}
            <span className="text-2xl">%</span>
          </span>
          <span className="text-muted-foreground mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
            C1 simulado
          </span>
        </div>
      )}
    </div>
  )
}

function BandArc({ band }: { band: C1Band }) {
  return (
    <path
      d={arcPath(band.min, band.max)}
      fill="none"
      stroke={band.hex}
      strokeOpacity={0.9}
      strokeWidth={STROKE}
      strokeLinecap="butt"
    />
  )
}
