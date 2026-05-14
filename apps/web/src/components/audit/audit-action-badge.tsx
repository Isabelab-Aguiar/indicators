import {
  Download,
  FileEdit,
  FilePlus,
  LogIn,
  LogOut,
  Mail,
  KeyRound,
  Trash2,
  Upload,
} from 'lucide-react'

import { Badge } from '@repo/ui'
import type { AuditAction } from '@repo/types'

const META: Record<
  AuditAction,
  {
    label: string
    icon: React.ElementType
    variant: 'success' | 'info' | 'warning' | 'destructive' | 'secondary'
  }
> = {
  CREATE: { label: 'Criou', icon: FilePlus, variant: 'success' },
  UPDATE: { label: 'Editou', icon: FileEdit, variant: 'info' },
  DELETE: { label: 'Removeu', icon: Trash2, variant: 'destructive' },
  LOGIN: { label: 'Login', icon: LogIn, variant: 'secondary' },
  LOGOUT: { label: 'Logout', icon: LogOut, variant: 'secondary' },
  IMPORT: { label: 'Importou', icon: Upload, variant: 'info' },
  EXPORT: { label: 'Exportou', icon: Download, variant: 'secondary' },
  PASSWORD_RESET: { label: 'Senha redefinida', icon: KeyRound, variant: 'warning' },
  INVITE_SENT: { label: 'Convite enviado', icon: Mail, variant: 'secondary' },
}

export function AuditActionBadge({ action }: { action: AuditAction }) {
  const meta = META[action]
  const Icon = meta.icon
  return (
    <Badge
      variant={meta.variant}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5"
    >
      <Icon className="h-3 w-3" />
      {meta.label}
    </Badge>
  )
}
