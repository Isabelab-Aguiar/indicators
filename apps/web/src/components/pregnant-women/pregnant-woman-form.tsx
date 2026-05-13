'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@repo/ui'
import { pregnantWomanSchema, type PregnantWomanInput } from '@repo/validations'
import { useCreatePregnantWoman } from '@/hooks/use-pregnant-women'

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3').replace(/^(\d{2})(\d)/, '($1) $2')
  }
  return digits.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3').replace(/^(\d{2})(\d)/, '($1) $2')
}

export function PregnantWomanForm() {
  const router = useRouter()
  const create = useCreatePregnantWoman()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PregnantWomanInput>({
    resolver: zodResolver(pregnantWomanSchema),
    defaultValues: {
      name: '',
      cpf: '',
      birthDate: '',
      address: '',
      phone: '',
      microarea: '',
    },
  })

  const cpfValue = watch('cpf')
  const phoneValue = watch('phone')

  function onSubmit(data: PregnantWomanInput) {
    create.mutate(data, {
      onSuccess: (res) => router.push(`/gestantes/${res.data.data.id}`),
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Dados da gestante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nome completo" error={errors.name?.message}>
                <Input placeholder="Maria da Silva" error={!!errors.name} {...register('name')} />
              </Field>

              <Field label="CPF" error={errors.cpf?.message}>
                <Input
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  value={cpfValue}
                  error={!!errors.cpf}
                  onChange={(e) =>
                    setValue('cpf', maskCpf(e.target.value), { shouldValidate: true })
                  }
                />
              </Field>

              <Field label="Data de nascimento" error={errors.birthDate?.message}>
                <Input type="date" error={!!errors.birthDate} {...register('birthDate')} />
              </Field>

              <Field label="Telefone" error={errors.phone?.message}>
                <Input
                  placeholder="(00) 00000-0000"
                  inputMode="numeric"
                  value={phoneValue}
                  error={!!errors.phone}
                  onChange={(e) =>
                    setValue('phone', maskPhone(e.target.value), { shouldValidate: true })
                  }
                />
              </Field>

              <Field label="Microárea" error={errors.microarea?.message}>
                <Input placeholder="1" error={!!errors.microarea} {...register('microarea')} />
              </Field>

              <Field label="Endereço" error={errors.address?.message} className="sm:col-span-2">
                <Input
                  placeholder="Rua, número, bairro"
                  error={!!errors.address}
                  {...register('address')}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" loading={create.isPending}>
                Cadastrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface FieldProps {
  label: string
  error?: string
  className?: string
  children: React.ReactNode
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label className="text-foreground text-xs font-medium">{label}</label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
