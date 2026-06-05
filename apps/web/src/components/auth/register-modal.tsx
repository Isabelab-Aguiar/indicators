'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { RegisterForm } from './register-form'

interface RegisterModalProps {
  onClose: () => void
}

export function RegisterModal({ onClose }: RegisterModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="register-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="register-modal"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border-border w-full max-w-md rounded-2xl border shadow-2xl"
        >
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <p className="text-foreground text-sm font-semibold">Solicitar acesso</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Preencha os dados — o admin receberá sua solicitação para aprovação.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <RegisterForm onSuccess={onClose} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
