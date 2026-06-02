'use client'

import { useState } from 'react'
import { useAdminUsers, useAdminEsfs, useDeactivateUser } from '@/hooks/admin/use-admin'
import { toast } from '@/hooks/use-toast'
import type { UserRole, UserStatus } from '@repo/types'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  nurse: 'Enfermeiro',
  doctor: 'Médico',
  acs: 'ACS',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending_first_access: 'Aguardando 1º acesso',
}

const STATUS_CLASSES: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  pending_first_access: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export default function AdminUsuariosPage() {
  const [esfId, setEsfId] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const filters = {
    ...(esfId && { esfId }),
    ...(role && { role }),
    ...(status && { status }),
  }

  const { data: users, isLoading } = useAdminUsers(filters)
  const { data: esfs } = useAdminEsfs()
  const deactivate = useDeactivateUser()

  function handleDeactivate(id: string, name: string) {
    deactivate.mutate(id, {
      onSuccess: () => toast({ title: `${name} desativado com sucesso.` }),
      onError: () => toast({ title: 'Erro ao desativar usuário.', variant: 'destructive' }),
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-border bg-background border-b px-6 py-4">
        <h1 className="text-foreground text-sm font-semibold">Usuários</h1>
        <p className="text-muted-foreground text-xs">Gerencie os usuários do sistema</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="border-border bg-card mb-5 flex flex-wrap gap-3 rounded-lg border p-4">
          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
              ESF
            </label>
            <select
              value={esfId}
              onChange={(e) => setEsfId(e.target.value)}
              className="border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs focus:outline-none"
            >
              <option value="">Todas</option>
              {esfs?.map((esf) => (
                <option key={esf.id} value={esf.id}>
                  {esf.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
              Função
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs focus:outline-none"
            >
              <option value="">Todas</option>
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-input bg-background text-foreground h-8 rounded-md border px-2 text-xs focus:outline-none"
            >
              <option value="">Todos</option>
              {(Object.keys(STATUS_LABELS) as UserStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
            Carregando...
          </div>
        )}

        {!isLoading && (
          <div className="border-border rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-border border-b">
                  <tr>
                    {['Nome', 'E-mail', 'ESF', 'Função', 'Status', ''].map((col) => (
                      <th
                        key={col}
                        className="text-muted-foreground px-4 py-3 text-left text-xs font-medium"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!users?.length && (
                    <tr>
                      <td colSpan={6} className="text-muted-foreground py-10 text-center text-xs">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                  {users?.map((user) => (
                    <tr
                      key={user.id}
                      className="border-border hover:bg-muted/30 border-b last:border-0"
                    >
                      <td className="text-foreground px-4 py-3 text-xs font-medium">{user.name}</td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {user.email ?? '—'}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">{user.esfId}</td>
                      <td className="text-foreground px-4 py-3 text-xs">
                        {ROLE_LABELS[user.role]}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASSES[user.status]}`}
                        >
                          {STATUS_LABELS[user.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(user.id, user.name)}
                            disabled={deactivate.isPending}
                            className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            Desativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
