'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'
import { usePublicEsfs, useCreateAccessRequest } from '@/hooks/use-access-request'
import { toast } from '@/hooks/use-toast'

const ROLE_OPTIONS = [
  { value: 'manager', label: 'Coordenador / Gerente' },
  { value: 'nurse', label: 'Enfermeiro(a)' },
  { value: 'doctor', label: 'Médico(a)' },
  { value: 'acs', label: 'Agente Comunitário de Saúde' },
]

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  role: z.enum(['manager', 'nurse', 'doctor', 'acs'], { required_error: 'Selecione uma função' }),
  esfId: z.string().uuid('Selecione uma ESF'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { data: esfs = [] } = usePublicEsfs()
  const create = useCreateAccessRequest()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    create.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Solicitação enviada! Aguarde a aprovação do administrador.' })
        onSuccess()
      },
      onError: () => toast({ title: 'Erro ao enviar solicitação.', variant: 'destructive' }),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">Nome completo</label>
        <Input placeholder="Seu nome" error={!!errors.name} {...register('name')} />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">E-mail</label>
        <Input
          type="email"
          placeholder="seu@email.com"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">CPF</label>
        <Input
          placeholder="000.000.000-00"
          inputMode="numeric"
          error={!!errors.cpf}
          {...register('cpf')}
          onChange={(e) => setValue('cpf', formatCpf(e.target.value), { shouldValidate: true })}
        />
        {errors.cpf && <p className="text-destructive text-xs">{errors.cpf.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-foreground text-xs font-medium">Função</label>
          <Select
            onValueChange={(v) => setValue('role', v as FormData['role'], { shouldValidate: true })}
          >
            <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value} className="text-xs">
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-foreground text-xs font-medium">ESF</label>
          <Select onValueChange={(v) => setValue('esfId', v, { shouldValidate: true })}>
            <SelectTrigger className={errors.esfId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {esfs
                .filter((e) => e.code !== 'SISTEMA')
                .map((esf) => (
                  <SelectItem key={esf.id} value={esf.id} className="text-xs">
                    {esf.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.esfId && <p className="text-destructive text-xs">{errors.esfId.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">
          Mensagem <span className="text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          placeholder="Informações adicionais para o administrador..."
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-offset-0"
          rows={2}
          {...register('message')}
        />
      </div>

      <Button type="submit" className="w-full" loading={create.isPending}>
        Enviar solicitação
      </Button>
    </form>
  )
}
