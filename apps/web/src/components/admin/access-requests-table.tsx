'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui'
import type { AccessRequest } from '@repo/types'
import { ROLE_LABELS, STATUS_LABELS, STATUS_CLASSES, formatDate } from './access-requests-utils'

interface AccessRequestsTableProps {
  requests: AccessRequest[]
  approvePending: boolean
  rejectPending: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function AccessRequestsTable({
  requests,
  approvePending,
  rejectPending,
  onApprove,
  onReject,
}: AccessRequestsTableProps) {
  return (
    <div className="border-border rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-border border-b">
            <tr>
              {['Nome', 'E-mail', 'ESF', 'Função solicitada', 'Data', 'Status', 'Ações'].map(
                (col) => (
                  <th
                    key={col}
                    className="text-muted-foreground px-4 py-3 text-left text-xs font-medium"
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {!requests.length && (
              <tr>
                <td colSpan={7} className="text-muted-foreground py-10 text-center text-xs">
                  Nenhuma solicitação encontrada.
                </td>
              </tr>
            )}
            {requests.map((req) => (
              <tr key={req.id} className="border-border hover:bg-muted/30 border-b last:border-0">
                <td className="text-foreground px-4 py-3 text-xs font-medium">{req.name}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">{req.email}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">{req.esf.name}</td>
                <td className="text-foreground px-4 py-3 text-xs">{ROLE_LABELS[req.role]}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">
                  {formatDate(req.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASSES[req.status]}`}
                  >
                    {STATUS_LABELS[req.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {req.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400">
                            Aprovar
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Aprovar solicitação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Confirma a aprovação de <strong>{req.name}</strong> como{' '}
                              <strong>{ROLE_LABELS[req.role]}</strong> na ESF{' '}
                              <strong>{req.esf.name}</strong>? Um convite será enviado para{' '}
                              {req.email}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onApprove(req.id)}
                              disabled={approvePending}
                            >
                              Confirmar aprovação
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">
                            Rejeitar
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Rejeitar solicitação</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja rejeitar a solicitação de{' '}
                              <strong>{req.name}</strong>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onReject(req.id)}
                              disabled={rejectPending}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirmar rejeição
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
