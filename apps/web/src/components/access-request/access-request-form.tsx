'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Esf } from '@repo/types'
import {
  accessRequestSchema,
  type AccessRequestFormData,
  ROLE_OPTIONS,
  formatCpf,
} from './access-request-schema'

const INPUT_CLASS =
  'border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring h-9 w-full rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-1'

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-xs font-medium">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}

interface AccessRequestFormProps {
  esfs: Esf[]
  serverError: string
  onSubmit: (data: AccessRequestFormData) => Promise<void>
}

export function AccessRequestForm({ esfs, serverError, onSubmit }: AccessRequestFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AccessRequestFormData>({ resolver: zodResolver(accessRequestSchema) })

  const cpfValue = watch('cpf') ?? ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Nome completo" error={errors.name?.message}>
        <input
          type="text"
          placeholder="Seu nome completo"
          className={INPUT_CLASS}
          {...register('name')}
        />
      </Field>

      <Field label="E-mail" error={errors.email?.message}>
        <input
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          className={INPUT_CLASS}
          {...register('email')}
        />
      </Field>

      <Field label="CPF" error={errors.cpf?.message}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={cpfValue}
          className={INPUT_CLASS}
          {...register('cpf')}
          onChange={(e) => setValue('cpf', formatCpf(e.target.value), { shouldValidate: true })}
        />
      </Field>

      <Field label="Função" error={errors.role?.message}>
        <select
          className="border-input bg-background text-foreground focus:ring-ring h-9 w-full rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-1"
          {...register('role')}
        >
          <option value="">Selecione uma função</option>
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="ESF" error={errors.esfId?.message}>
        <select
          className="border-input bg-background text-foreground focus:ring-ring h-9 w-full rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-1"
          {...register('esfId')}
        >
          <option value="">Selecione uma ESF</option>
          {esfs.map((esf) => (
            <option key={esf.id} value={esf.id}>
              {esf.name} — {esf.code}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensagem (opcional)" error={errors.message?.message}>
        <textarea
          rows={3}
          placeholder="Informações adicionais para o administrador..."
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
          {...register('message')}
        />
      </Field>

      {serverError && (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-xs">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
      </button>
    </form>
  )
}
