import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(3, 'CPF ou e-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter ao menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const firstAccessSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Deve conter ao menos um número')
      .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export const inviteUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: z.enum(['admin', 'manager', 'nurse', 'doctor', 'acs']),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type FirstAccessInput = z.infer<typeof firstAccessSchema>
export type InviteUserInput = z.infer<typeof inviteUserSchema>
