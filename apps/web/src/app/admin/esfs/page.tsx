'use client'

import { useAdminEsfs } from '@/hooks/admin/use-admin'

export default function AdminEsfsPage() {
  const { data: esfs, isLoading, isError } = useAdminEsfs()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-border bg-background border-b px-6 py-4">
        <h1 className="text-foreground text-sm font-semibold">ESFs</h1>
        <p className="text-muted-foreground text-xs">Equipes de Saúde da Família cadastradas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading && (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-sm">
            Carregando...
          </div>
        )}
        {isError && (
          <div className="text-destructive flex h-40 items-center justify-center text-sm">
            Erro ao carregar ESFs.
          </div>
        )}
        {!isLoading && !isError && (
          <div className="border-border rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-border border-b">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                      Nome
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                      Código
                    </th>
                    <th className="text-muted-foreground px-4 py-3 text-right text-xs font-medium">
                      Total de usuários
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!esfs?.length && (
                    <tr>
                      <td colSpan={3} className="text-muted-foreground py-10 text-center text-xs">
                        Nenhuma ESF encontrada.
                      </td>
                    </tr>
                  )}
                  {esfs?.map((esf) => (
                    <tr
                      key={esf.id}
                      className="border-border hover:bg-muted/30 border-b last:border-0"
                    >
                      <td className="text-foreground px-4 py-3 text-xs font-medium">{esf.name}</td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">{esf.code}</td>
                      <td className="text-foreground px-4 py-3 text-right text-xs">
                        {esf.userCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
