'use client'

import { useState, useEffect } from 'react'
import { Activity, CheckCircle2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { AccessRequestForm } from '@/components/access-request/access-request-form'
import type { AccessRequestFormData } from '@/components/access-request/access-request-schema'
import type { Esf } from '@repo/types'

export default function SolicitarAcessoPage() {
  const [esfs, setEsfs] = useState<Esf[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    apiClient
      .get<{ data: Esf[] }>('/esfs')
      .then((res) => setEsfs(res.data.data))
      .catch(() => setEsfs([]))
  }, [])

  async function handleSubmit(data: AccessRequestFormData) {
    setServerError('')
    try {
      await apiClient.post('/access-requests', data)
      setSubmitted(true)
    } catch {
      setServerError('Erro ao enviar solicitação. Tente novamente.')
    }
  }

  if (submitted) {
    return (
      <div className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <div>
            <h2 className="text-foreground text-lg font-semibold">Solicitação enviada!</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Sua solicitação foi enviada. Aguarde a aprovação do administrador.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="border-border bg-background mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm">
            <Activity className="text-foreground h-6 w-6" />
          </div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            Solicitar acesso
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Preencha os dados abaixo para solicitar acesso ao sistema
          </p>
        </div>

        <div className="border-border bg-card rounded-lg border p-6 shadow-sm">
          <AccessRequestForm esfs={esfs} serverError={serverError} onSubmit={handleSubmit} />
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Já tem acesso?{' '}
          <a href="/login" className="text-foreground font-medium underline underline-offset-4">
            Entrar
          </a>
        </p>
      </div>
    </div>
  )
}
