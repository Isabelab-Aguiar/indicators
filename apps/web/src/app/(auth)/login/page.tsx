import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className="from-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="border-border bg-background mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="text-foreground h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Indicadores APS</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Gestão de Gestantes e Indicadores da Atenção Básica
          </p>
        </div>
        <LoginForm />
        <p className="text-muted-foreground text-center text-xs">
          Acesso restrito. Problemas? Contate o administrador.
        </p>
      </div>
    </div>
  )
}
