'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@repo/ui'
import { useAuthStore } from '@/store/auth.store'
import { TenantBadge } from '@/components/layout/tenant-badge'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  nurse: 'Enfermeira',
  doctor: 'Médico',
  acs: 'ACS',
}

export function ProfileForm() {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Informações Pessoais</CardTitle>
          <CardDescription className="text-xs">Dados da conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="border-border bg-muted text-foreground flex h-14 w-14 items-center justify-center rounded-full border text-lg font-semibold">
              {user.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <p className="text-foreground font-semibold">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-muted-foreground text-xs">Função</p>
              <Badge variant="secondary" className="mt-1">
                {ROLE_LABEL[user.role] ?? user.role}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="mt-1">
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Unidade de Saúde</CardTitle>
          <CardDescription className="text-xs">ESF vinculada à sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <TenantBadge esfName={user.esfName} esfCode={user.esfCode} />
        </CardContent>
      </Card>
    </div>
  )
}
