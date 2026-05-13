import type { Metadata } from 'next'
import { FirstAccessForm } from '@/components/auth/first-access-form'

export const metadata: Metadata = { title: 'Primeiro Acesso' }

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function FirstAccessPage({ searchParams }: Props) {
  const { token } = await searchParams

  return (
    <div className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Criar senha</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Configure sua senha para acessar o sistema.
          </p>
        </div>
        <FirstAccessForm token={token ?? ''} />
      </div>
    </div>
  )
}
