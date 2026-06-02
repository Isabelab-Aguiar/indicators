'use client'

import { Building2, Users, UserCheck, ClipboardList } from 'lucide-react'
import { useAdminStats } from '@/hooks/admin/use-admin'
import type { AdminStats } from '@repo/types'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  nurse: 'Enfermeiro',
  doctor: 'Médico',
  acs: 'ACS',
}

function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string
  value: number
  icon: React.ElementType
  highlight?: boolean
}) {
  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
        <Icon className="text-muted-foreground h-4 w-4" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-foreground text-2xl font-semibold">{value}</span>
        {highlight && value > 0 && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {value}
          </span>
        )}
      </div>
    </div>
  )
}

function RoleBar({ role, count, max }: { role: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-28 shrink-0 text-xs">
        {ROLE_LABELS[role] ?? role}
      </span>
      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-foreground w-6 text-right text-xs font-medium">{count}</span>
    </div>
  )
}

function DashboardContent({ stats }: { stats: AdminStats }) {
  const roleEntries = Object.entries(stats.usersByRole) as [string, number][]
  const maxRole = Math.max(...roleEntries.map(([, v]) => v), 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total de ESFs" value={stats.totalEsfs} icon={Building2} />
        <StatCard label="Total de usuários" value={stats.totalUsers} icon={Users} />
        <StatCard label="Usuários ativos" value={stats.activeUsers} icon={UserCheck} />
        <StatCard
          label="Solicitações pendentes"
          value={stats.pendingRequests}
          icon={ClipboardList}
          highlight
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border-border bg-card rounded-lg border p-5">
          <h2 className="text-foreground mb-4 text-sm font-semibold">Usuários por função</h2>
          <div className="space-y-3">
            {roleEntries.map(([role, count]) => (
              <RoleBar key={role} role={role} count={count} max={maxRole} />
            ))}
          </div>
        </div>

        <div className="border-border bg-card rounded-lg border p-5">
          <h2 className="text-foreground mb-4 text-sm font-semibold">ESFs com mais usuários</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground pb-2 text-left text-xs font-medium">ESF</th>
                  <th className="text-muted-foreground pb-2 text-left text-xs font-medium">
                    Código
                  </th>
                  <th className="text-muted-foreground pb-2 text-right text-xs font-medium">
                    Usuários
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.usersByEsf.slice(0, 8).map((row) => (
                  <tr key={row.esfId} className="border-border border-b last:border-0">
                    <td className="text-foreground py-2 text-xs">{row.esfName}</td>
                    <td className="text-muted-foreground py-2 text-xs">{row.esfCode}</td>
                    <td className="text-foreground py-2 text-right text-xs font-medium">
                      {row.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminStats()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-border bg-background border-b px-6 py-4">
        <h1 className="text-foreground text-sm font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-xs">Visão geral do sistema</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
            Carregando...
          </div>
        )}
        {isError && (
          <div className="text-destructive flex h-40 items-center justify-center text-sm">
            Erro ao carregar estatísticas.
          </div>
        )}
        {stats && <DashboardContent stats={stats} />}
      </div>
    </div>
  )
}
