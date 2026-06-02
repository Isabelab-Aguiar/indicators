'use client'

import { useState } from 'react'
import { useAccessRequests, useApproveRequest, useRejectRequest } from '@/hooks/admin/use-admin'
import { toast } from '@/hooks/use-toast'
import { AccessRequestsTable } from '@/components/admin/access-requests-table'
import type { AccessRequestStatus } from '@repo/types'

export default function AdminSolicitacoesPage() {
  const [statusFilter, setStatusFilter] = useState<AccessRequestStatus | ''>('')
  const { data: requests, isLoading } = useAccessRequests(statusFilter || undefined)
  const approve = useApproveRequest()
  const reject = useRejectRequest()

  function handleApprove(id: string) {
    approve.mutate(id, {
      onSuccess: () => toast({ title: 'Solicitação aprovada com sucesso.' }),
      onError: () => toast({ title: 'Erro ao aprovar solicitação.', variant: 'destructive' }),
    })
  }

  function handleReject(id: string) {
    reject.mutate(id, {
      onSuccess: () => toast({ title: 'Solicitação rejeitada.' }),
      onError: () => toast({ title: 'Erro ao rejeitar solicitação.', variant: 'destructive' }),
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-border bg-background border-b px-6 py-4">
        <h1 className="text-foreground text-sm font-semibold">Solicitações de acesso</h1>
        <p className="text-muted-foreground text-xs">
          Revise e gerencie as solicitações de acesso ao sistema
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="border-border bg-card mb-5 flex gap-3 rounded-lg border p-4">
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AccessRequestStatus | '')}
              className="border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
            Carregando...
          </div>
        )}

        {!isLoading && (
          <AccessRequestsTable
            requests={requests ?? []}
            approvePending={approve.isPending}
            rejectPending={reject.isPending}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  )
}
