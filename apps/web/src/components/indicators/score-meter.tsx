'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

import type { ClassificationInfo } from '@/lib/indicators-aps'

interface ScoreMeterProps {
  score: number
  classification: ClassificationInfo
}

const SIZE = 200
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const STROKE_COLOR: Record<ClassificationInfo['badge'], string> = {
  success: 'stroke-emerald-500',
  info: 'stroke-blue-500',
  warning: 'stroke-amber-500',
  destructive: 'stroke-red-500',
}

const TEXT_COLOR: Record<ClassificationInfo['badge'], string> = {
  success: 'text-emerald-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
  destructive: 'text-red-500',
}

export function ScoreMeter({ score, classification }: ScoreMeterProps) {
  const animated = useSpring(0, { stiffness: 120, damping: 24 })
  const dashOffset = useTransform(animated, (v) => CIRCUMFERENCE * (1 - v / 100))
  const counter = useMotionValue(0)
  const display = useTransform(counter, (v) => Math.round(v))

  useEffect(() => {
    animated.set(score)
    const start = performance.now()
    counter.set(0)
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / 600, 1)
      counter.set(elapsed * score)
      if (elapsed < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score, animated, counter])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-muted/40"
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          className={STROKE_COLOR[classification.badge]}
          strokeDasharray={CIRCUMFERENCE}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-5xl font-bold tabular-nums ${TEXT_COLOR[classification.badge]}`}
        >
          {display}
        </motion.span>
        <span className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-wider">
          de 100
        </span>
        <span className={`mt-2 text-sm font-semibold ${TEXT_COLOR[classification.badge]}`}>
          {classification.label}
        </span>
      </div>
    </div>
  )
}
