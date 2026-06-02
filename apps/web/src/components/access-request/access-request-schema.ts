import { z } from 'zod'

export const accessRequestSchema = z.object({
  name: z.string().min(2, 'Informe o nome completo'),
  email: z.string().email('E-mail inválido'),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(11, 'CPF deve ter 11 dígitos')),
  role: z.enum(['admin', 'manager', 'nurse', 'doctor', 'acs'], {
    required_error: 'Selecione uma função',
  }),
  esfId: z.string().min(1, 'Selecione uma ESF'),
  message: z.string().optional(),
})

export type AccessRequestFormData = z.infer<typeof accessRequestSchema>

export const ROLE_OPTIONS = [
  { value: 'manager', label: 'Gestor' },
  { value: 'nurse', label: 'Enfermeiro' },
  { value: 'doctor', label: 'Médico' },
  { value: 'acs', label: 'Agente Comunitário de Saúde (ACS)' },
]

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
