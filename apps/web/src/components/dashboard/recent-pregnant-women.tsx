'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@repo/ui'
import { usePregnantWomen } from '@/hooks/use-pregnant-women'

const BP_VARIANT = {
  normal: 'success',
  elevated: 'warning',
  high: 'destructive',
  critical: 'critical',
} as const

export function RecentPregnantWomen() {
  const { data, isLoading } = usePregnantWomen({
    pageSize: 5,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">Gestantes Recentes</CardTitle>
          <CardDescription className="text-xs">Últimas atualizações</CardDescription>
        </div>
        <Link
          href="/gestantes"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="bg-muted h-3.5 w-36 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                </div>
                <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
              </div>
            ))
          : data?.data.map((woman) => (
              <Link
                key={woman.id}
                href={`/gestantes/${woman.id}`}
                className="hover:bg-accent flex items-center justify-between rounded-lg p-2 transition-colors"
              >
                <div>
                  <p className="text-foreground text-sm font-medium">{woman.name}</p>
                  <p className="text-muted-foreground text-xs">Microárea {woman.microarea}</p>
                </div>
                {woman.bloodPressureStatus && (
                  <Badge variant={BP_VARIANT[woman.bloodPressureStatus]}>
                    PA {woman.bloodPressure}
                  </Badge>
                )}
              </Link>
            ))}
        {!isLoading && !data?.data.length && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Nenhuma gestante cadastrada
          </p>
        )}
      </CardContent>
    </Card>
  )
}
