'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { queryKeys } from '@/lib/query-keys'
import { useAuthStore } from '@/store/auth.store'
import type { C3PatientRow } from '@repo/types'
import { EditFormFields, buildInitialForm } from './c3-patient-edit-fields'
import type { EditForm } from './c3-patient-edit-fields'

interface C3PatientEditModalProps {
  patient: C3PatientRow
  onClose: () => void
  onSaved: () => void
}

export function C3PatientEditModal({ patient, onClose, onSaved }: C3PatientEditModalProps) {
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<EditForm>(() => buildInitialForm(patient))

  function set<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await apiClient.patch(`/pregnant-women/${patient.id}`, form)
      await queryClient.invalidateQueries({ queryKey: queryKeys.c3.all(esfId) })
      onSaved()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="edit-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="edit-content"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-border relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border shadow-2xl sm:max-w-md sm:rounded-2xl"
        >
          <div className="border-border flex items-center justify-between gap-4 border-b px-5 py-4">
            <div>
              <p className="text-foreground text-sm font-semibold">Editar dados</p>
              <p className="text-muted-foreground text-xs">{patient.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <EditFormFields form={form} set={set} />
            {error && (
              <p className="mx-5 mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-xs text-red-500">
                {error}
              </p>
            )}
          </div>

          <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
