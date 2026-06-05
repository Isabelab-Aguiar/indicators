'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  registerSchema,
  type RegisterFormData,
  ROLE_OPTIONS,
  OTHER_ESF,
  formatCpf,
} from './register-form-schema'
import { RegisterEsfOtherFields } from './register-esf-other-fields'

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { data: esfs = [] } = usePublicEsfs()
  const create = useCreateAccessRequest()
  const [esfSelection, setEsfSelection] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  function onSubmit(data: RegisterFormData) {
    const payload = {
      name: data.name,
      email: data.email,
      cpf: data.cpf.replace(/\D/g, ''),
      role: data.role,
      esfId: data.esfId !== OTHER_ESF ? data.esfId : undefined,
      esfName: data.esfId === OTHER_ESF ? data.esfName : undefined,
      cnes: data.cnes || undefined,
      ine: data.esfId === OTHER_ESF ? data.ine || undefined : undefined,
      message: data.message,
    }
    create.mutate(payload, {
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
            onValueChange={(v) =>
              setValue('role', v as RegisterFormData['role'], { shouldValidate: true })
            }
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
          <label className="text-foreground text-xs font-medium">CNES</label>
          <Input
            placeholder="0000000"
            inputMode="numeric"
            maxLength={7}
            error={!!errors.cnes}
            {...register('cnes')}
            onChange={(e) =>
              setValue('cnes', e.target.value.replace(/\D/g, '').slice(0, 7), {
                shouldValidate: true,
              })
            }
          />
          {errors.cnes && <p className="text-destructive text-xs">{errors.cnes.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">ESF</label>
        <Select
          onValueChange={(v) => {
            setEsfSelection(v)
            setValue('esfId', v, { shouldValidate: true })
            if (v !== OTHER_ESF) setValue('esfName', '')
          }}
        >
          <SelectTrigger className={errors.esfId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selecione a ESF" />
          </SelectTrigger>
          <SelectContent>
            {esfs
              .filter((e) => e.code !== 'SISTEMA')
              .map((esf) => (
                <SelectItem key={esf.id} value={esf.id} className="text-xs">
                  {esf.name}
                </SelectItem>
              ))}
            <SelectItem value={OTHER_ESF} className="text-xs">
              Outra ESF (não listada)
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.esfId && <p className="text-destructive text-xs">{errors.esfId.message}</p>}
      </div>

      {esfSelection === OTHER_ESF && (
        <RegisterEsfOtherFields register={register} setValue={setValue} errors={errors} />
      )}

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
