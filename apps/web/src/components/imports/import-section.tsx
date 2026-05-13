'use client'

import { useRef, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui'
import { cn } from '@repo/ui'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/auth.store'
import { queryKeys } from '@/lib/query-keys'
import { UPLOAD } from '@repo/config'

export function ImportSection() {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const esfId = useAuthStore((s) => s.user?.esfId ?? '')

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const endpoint = file.type === 'application/pdf' ? '/imports/pdf' : '/imports/csv'
      const response = await apiClient.post<{ data: { importId: string } }>(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.imports.all(esfId) })
      setSelectedFile(null)
      toast({ title: 'Arquivo enviado! Importação em andamento.' })
    },
    onError: () => toast({ title: 'Falha ao enviar arquivo', variant: 'destructive' }),
  })

  function handleFileSelect(file: File) {
    if (file.size > UPLOAD.MAX_FILE_SIZE_BYTES) {
      toast({ title: 'Arquivo muito grande (máx. 10MB)', variant: 'destructive' })
      return
    }
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Enviar Arquivo</CardTitle>
        <CardDescription className="text-xs">
          Suporta CSV e PDF. Máximo 10MB. Os dados serão vinculados automaticamente à sua ESF.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative flex cursor-pointer select-none flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors',
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground hover:bg-muted/30',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".csv,.pdf,text/csv,application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFileSelect(f)
            }}
          />
          <Upload className="text-muted-foreground mb-3 h-8 w-8" />
          <p className="text-foreground text-sm font-medium">Arraste ou clique para selecionar</p>
          <p className="text-muted-foreground mt-1 text-xs">CSV ou PDF até 10MB</p>
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="border-border bg-muted/30 mt-4 flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-foreground text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  loading={importMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation()
                    importMutation.mutate(selectedFile)
                  }}
                >
                  Importar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
