'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { INDICATOR_LIST } from '@/lib/indicators-aps'

const ACCENT: Record<string, string> = {
  c2: 'from-sky-500/15 to-sky-500/0',
  c3: 'from-rose-500/15 to-rose-500/0',
  c4: 'from-violet-500/15 to-violet-500/0',
  c5: 'from-amber-500/15 to-amber-500/0',
  c6: 'from-emerald-500/15 to-emerald-500/0',
  c7: 'from-pink-500/15 to-pink-500/0',
}

export function IndicatorHubGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {INDICATOR_LIST.map((indicator, index) => (
        <motion.div
          key={indicator.code}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
        >
          <Link href={`/indicadores/${indicator.code}`} className="group block">
            <Card className="border-border/60 relative h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 ${ACCENT[indicator.code] ?? ''}`}
              />
              <CardHeader className="relative flex flex-row items-start justify-between gap-2 pb-3">
                <div className="space-y-1">
                  <Badge variant="secondary" className="rounded-md font-mono uppercase">
                    {indicator.shortLabel}
                  </Badge>
                  <CardTitle className="text-base font-semibold">{indicator.title}</CardTitle>
                </div>
                <ArrowUpRight className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                  {indicator.subtitle}
                </CardDescription>
                <div className="text-muted-foreground mt-4 flex items-center gap-3 text-[11px] font-medium tabular-nums">
                  <span>{indicator.criteria?.length ?? 0} boas práticas</span>
                  <span>·</span>
                  <span>100 pts</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
