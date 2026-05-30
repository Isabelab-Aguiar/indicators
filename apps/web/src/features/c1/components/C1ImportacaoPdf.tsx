'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, Upload, X } from 'lucide-react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@repo/ui'

import { cn } from '@repo/ui'
import { toast } from '@/hooks/use-toast'
import { UPLOAD } from '@repo/config'
import { useC1ImportarPdf } from '../hooks/useC1ImportarPdf'
import { C1StatusPoll } from './C1StatusPoll'
import { C1_PERIODO_PADRAO } from '../constants/c1.constants'

interface PendingFile {
  file: File
  importacaoId: string | null
  fileName: string
}

function validatePdfFile(file: File): string | null {
  if (file.size > UPLOAD.MAX_FILE_SIZE_BYTES) return `${file.name}: muito grande (máx. 10MB)`
  if (file.type !== 'application/pdf') return `${file.name}: apenas PDFs são aceitos`
  return null
}

export function C1ImportacaoPdf() {
  const [dragOver, setDragOver] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [periodo, setPeriodo] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const importar = useC1ImportarPdf()

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    for (const file of Array.from(fileList)) {
      const error = validatePdfFile(file)
      if (error) {
        toast({ title: error, variant: 'destructive' })
        continue
      }
      setPendingFiles((prev) => [...prev, { file, importacaoId: null, fileName: file.name }])
    }
  }

  function removeFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    const unqueued = pendingFiles.filter((f) => f.importacaoId === null)
    for (const pending of unqueued) {
      try {
        const result = await importar.mutateAsync({
          file: pending.file,
          periodo: periodo || C1_PERIODO_PADRAO,
        })
        setPendingFiles((prev) =>
          prev.map((f) =>
            f.fileName === pending.fileName ? { ...f, importacaoId: result.importacaoId } : f,
          ),
        )
      } catch {
        toast({ title: `Falha ao enviar ${pending.fileName}`, variant: 'destructive' })
      }
    }
  }

  const unqueued = pendingFiles.filter((f) => !f.importacaoId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Importar PDF e-SUS</CardTitle>
        <CardDescription className="text-xs">
          Relatório de Atendimento Individual. Máximo 10MB por arquivo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-foreground mb-1.5 block text-xs font-semibold">
              Período (ex: 2024-Q1)
            </label>
            <Input
              placeholder="2024-Q1"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
        <div
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            handleFiles(e.dataTransfer.files)
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer select-none flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground hover:bg-muted/30',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Upload className="text-muted-foreground mb-2 h-7 w-7" />
          <p className="text-foreground text-sm font-medium">Arraste ou clique para selecionar</p>
          <p className="text-muted-foreground mt-1 text-xs">PDFs até 10MB (múltiplos aceitos)</p>
        </div>
        <AnimatePresence>
          {pendingFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {pendingFiles.map((f, i) =>
                f.importacaoId ? (
                  <C1StatusPoll
                    key={f.fileName}
                    importacaoId={f.importacaoId}
                    fileName={f.fileName}
                  />
                ) : (
                  <div
                    key={f.fileName}
                    className="border-border flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">{f.fileName}</p>
                      <p className="text-muted-foreground text-xs">
                        {(f.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(i)
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {unqueued.length > 0 && (
          <Button className="w-full" loading={importar.isPending} onClick={handleUpload}>
            Importar {unqueued.length} arquivo(s)
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
