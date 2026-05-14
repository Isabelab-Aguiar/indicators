'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '@repo/ui'
import { C1_BANDS, classifyC1, type C1Band } from '@/lib/indicators-aps/c1-data'

interface C1GaugeProps {
  percent: number
}

const SIZE = 320
const RADIUS = 130
const STROKE = 22
const CENTER = SIZE / 2

function polarToCartesian(angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 180) * Math.PI) / 180
  return { x: CENTER + RADIUS * Math.cos(rad), y: CENTER + RADIUS * Math.sin(rad) }
}

function arcPath(startPct: number, endPct: number): string {
  const start = polarToCartesian(startPct * 1.8)
  const end = polarToCartesian(endPct * 1.8)
  const largeArc = endPct - startPct > 50 ? 1 : 0
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function C1Gauge({ percent }: C1GaugeProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const classification = classifyC1(clamped)
  const angle = useSpring(clamped * 1.8 - 90, { stiffness: 90, damping: 18 })
  const counter = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    angle.set(clamped * 1.8 - 90)
    const start = performance.now()
    const from = counter.get()
    const tick = (now: number) => {
      const t = Math.min((now - start) / 700, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = from + (clamped - from) * eased
      counter.set(next)
      setDisplay(next)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [clamped, angle, counter])

  const rotation = useTransform(angle, (a) => `rotate(${a}deg)`)

  return (
    <div className="relative flex flex-col items-center" style={{ width: SIZE }}>
      <svg width={SIZE} height={SIZE / 2 + 24} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 24}`}>
        <path d={arcPath(0, 100)} fill="none" strokeWidth={STROKE} className="stroke-muted/40" />
        {C1_BANDS.map((band, i) => (
          <BandArc key={`${band.key}-${i}`} band={band} />
        ))}
        <line
          x1={CENTER}
          y1={CENTER + STROKE / 2 + 8}
          x2={CENTER}
          y2={CENTER + STROKE / 2 + 8 - 6}
          strokeWidth={1.5}
          className="stroke-muted-foreground/60"
        />
      </svg>
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0"
        style={{
          width: 0,
          height: SIZE / 2,
          translateX: '-50%',
          rotate: rotation,
          transformOrigin: '50% 100%',
        }}
      >
        <div className="bg-foreground absolute -top-1 left-1/2 h-[calc(100%-22px)] w-[3px] -translate-x-1/2 rounded-full" />
        <div className="bg-background border-foreground absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1 rounded-full border-[2.5px]" />
      </motion.div>
      <div className="mt-2 flex flex-col items-center">
        <span className={cn('text-5xl font-bold tabular-nums', classification.band.text)}>
          {display.toFixed(1)}
          <span className="text-2xl">%</span>
        </span>
        <span className="text-muted-foreground mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
          C1 simulado
        </span>
      </div>
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
