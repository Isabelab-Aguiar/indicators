import { z } from 'zod'

export const OTHER_ESF = '__other__'

export const ROLE_OPTIONS = [
  { value: 'manager', label: 'Coordenador / Gerente' },
  { value: 'nurse', label: 'Enfermeiro(a)' },
  { value: 'doctor', label: 'Médico(a)' },
  { value: 'acs', label: 'Agente Comunitário de Saúde' },
]

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
    role: z.enum(['manager', 'nurse', 'doctor', 'acs'], {
      required_error: 'Selecione uma função',
    }),
    esfId: z.string().min(1, 'Selecione uma ESF'),
    esfName: z.string().optional(),
    cnes: z
      .string()
      .regex(/^\d{7}$/, 'CNES deve ter 7 dígitos')
      .optional()
      .or(z.literal('')),
    ine: z
      .string()
      .regex(/^\d{10}$/, 'INE deve ter 10 dígitos')
      .optional()
      .or(z.literal('')),
    message: z.string().optional(),
  })
  .refine((d) => d.esfId !== OTHER_ESF || (d.esfName && d.esfName.trim().length >= 2), {
    message: 'Informe o nome da ESF',
    path: ['esfName'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}
