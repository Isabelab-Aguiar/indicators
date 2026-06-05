'use client'

import { Input } from '@repo/ui'
import type { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form'
import type { RegisterFormData } from './register-form-schema'

interface RegisterEsfOtherFieldsProps {
  register: UseFormRegister<RegisterFormData>
  setValue: UseFormSetValue<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
}

export function RegisterEsfOtherFields({
  register,
  setValue,
  errors,
}: RegisterEsfOtherFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">Nome da ESF</label>
        <Input
          placeholder="ESF NILDA BARROS"
          error={!!errors.esfName}
          {...register('esfName')}
          onChange={(e) =>
            setValue('esfName', e.target.value.toUpperCase(), { shouldValidate: true })
          }
        />
        {errors.esfName && <p className="text-destructive text-xs">{errors.esfName.message}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-foreground text-xs font-medium">INE</label>
        <Input
          placeholder="0000000000"
          inputMode="numeric"
          maxLength={10}
          error={!!errors.ine}
          {...register('ine')}
          onChange={(e) =>
            setValue('ine', e.target.value.replace(/\D/g, '').slice(0, 10), {
              shouldValidate: true,
            })
          }
        />
        {errors.ine && <p className="text-destructive text-xs">{errors.ine.message}</p>}
      </div>
    </div>
  )
}
