import { useMutation } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { c1Api } from '../services/c1.api'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function useC1ExportarCsv() {
  return useMutation({
    mutationFn: c1Api.exportarCsv,
    onSuccess: (blob) => triggerDownload(blob, 'c1-execucoes.csv'),
    onError: () => toast({ title: 'Falha ao exportar CSV', variant: 'destructive' }),
  })
}
