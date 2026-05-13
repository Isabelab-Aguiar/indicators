'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Input } from '@repo/ui'
import { loginSchema, type LoginInput } from '@repo/validations'
import { useLogin } from '@/hooks/use-auth'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-foreground text-xs font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.gov.br"
                autoComplete="email"
                leftIcon={<Mail className="h-3.5 w-3.5" />}
                error={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-foreground text-xs font-medium">
                Senha
              </label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                error={!!errors.password}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                }
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            {login.isError && (
              <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-xs">
                E-mail ou senha incorretos. Verifique suas credenciais.
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={login.isPending}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
