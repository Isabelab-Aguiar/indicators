import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function SectionHeader({ title, description, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-foreground text-sm font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          {actionLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}
