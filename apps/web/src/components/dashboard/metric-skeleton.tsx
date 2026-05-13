import { Card, CardContent, CardHeader } from '@repo/ui'
import { cn } from '@repo/ui'

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('bg-muted animate-pulse rounded-md', className)} />
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-1 h-8 w-16" />
            <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
