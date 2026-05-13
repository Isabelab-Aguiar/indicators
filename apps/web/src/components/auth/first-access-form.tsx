'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, Button, Input } from '@repo/ui'
import { firstAccessSchema, type FirstAccessInput } from '@repo/validations'
import { apiClient } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'

interface Props {
  token: string
}

export function FirstAccessForm({ token }: Props) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstAccessInput>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: { token },
  })

  const mutation = useMutation({
    mutationFn: (data: FirstAccessInput) => apiClient.post('/auth/first-access', data),
    onSuccess: () => {
      toast({ title: 'Senha criada com sucesso! Faça login.' })
      router.push('/login')
    },
    onError: () => toast({ title: 'Token inválido ou expirado', variant: 'destructive' }),
  })

  if (!token) {
    return (
      <p className="text-destructive text-center text-sm">
        Link inválido. Solicite um novo convite ao administrador.
      </p>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <input type="hidden" {...register('token')} />

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium">
                Nova senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Mín. 8 caracteres"
                error={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-xs font-medium">
                Confirmar senha
              </label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repita a senha"
                error={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" loading={mutation.isPending}>
              Criar senha e acessar
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
