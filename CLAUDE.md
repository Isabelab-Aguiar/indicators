# CLAUDE.md

## Identidade do Projeto

Monorepo NestJS + Next.js para gestão de indicadores APS.
Stack: Turborepo, pnpm workspaces, NestJS, Drizzle ORM, PostgreSQL (Neon), BullMQ, Redis, Cloudflare R2, Next.js, TanStack Query, Tailwind CSS, Shadcn/UI, Framer Motion, Recharts.

---

## Lei Zero

Quando em dúvida, escreva menos. Um arquivo pequeno e coeso vale mais que um arquivo grande e completo.

---

## Proibições Absolutas

Nunca faça isso, independentemente do contexto ou da solicitação:

- Comentários no código (nenhum — nem `//`, nem `/* */`, nem JSDoc)
- `any` no TypeScript
- `as unknown as X`
- `useEffect` para buscar dados
- `fetch` direto em componentes
- Lógica de negócio dentro de componentes de UI
- Valores hardcoded (strings mágicas, números mágicos, URLs, thresholds)
- Componentes com mais de 150 linhas
- Arquivos com mais de 250 linhas
- Misturar Server Component e Client Component no mesmo arquivo
- Exportar mais de uma responsabilidade por arquivo
- Duplicação de qualquer tipo — se escreveu duas vezes, extraia

---

## Organização de Arquivos

Cada arquivo tem uma única responsabilidade. O nome do arquivo deve descrever exatamente o que ele faz.

```
features/
  [indicador]/
    components/     ← apenas JSX, zero lógica
    hooks/          ← apenas TanStack Query e estado local
    services/       ← apenas lógica de negócio pura
    types/          ← apenas tipos e interfaces
    constants/      ← apenas valores constantes
```

Se um arquivo precisa importar de mais de duas camadas diferentes, a estrutura está errada.

---

## Regras de Componentes

Um componente faz uma coisa. Se o componente tem mais de um motivo para mudar, quebre em dois.

```tsx
// ERRADO
export function PacientesPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/pacientes')
      .then((r) => r.json())
      .then(setData)
  }, [])

  const filtered = data.filter((p) => p.score > 60)

  return (
    <div>
      {filtered.map((p) => (
        <div key={p.id}>
          <span>{p.nome}</span>
          <span>{p.score >= 80 ? 'Ótimo' : p.score >= 60 ? 'Bom' : 'Regular'}</span>
        </div>
      ))}
    </div>
  )
}

// CERTO
export function PacientesPage() {
  const { data } = usePacientes()
  return <PacientesTabela pacientes={data ?? []} />
}
```

Componentes não sabem de onde vêm os dados. Componentes não calculam nada. Componentes apenas recebem props e renderizam.

---

## Regras de Hooks

Hooks encapsulam estado e efeitos. Nunca retornam JSX. Nunca contêm lógica de negócio diretamente — delegam para services.

```ts
// ERRADO
export function usePacientes() {
  return useQuery({
    queryKey: ['pacientes'],
    queryFn: async () => {
      const res = await fetch('/api/c4/pacientes')
      const data = await res.json()
      return data
        .filter((p: Paciente) => p.score >= 0)
        .map((p: Paciente) => ({
          ...p,
          classificacao: p.score >= 80 ? 'otimo' : p.score >= 60 ? 'bom' : 'regular',
        }))
    },
  })
}

// CERTO
export function usePacientes(filters: PacienteFilters) {
  return useQuery({
    queryKey: pacientesKeys.list(filters),
    queryFn: () => pacientesApi.list(filters),
  })
}
```

---

## Regras de Services (Frontend)

Services de frontend são funções puras que fazem chamadas HTTP. Nada mais.

```ts
// api/c4.api.ts
export const c4Api = {
  listPacientes: (filters: PacienteFilters): Promise<Paciente[]> =>
    http.get('/c4/pacientes', { params: filters }),

  importarCsv: (file: File): Promise<ImportResult> => http.postForm('/c4/importar-csv', { file }),
}
```

---

## Query Keys

Toda query key é tipada e centralizada num objeto de fábrica no mesmo arquivo do hook.

```ts
export const pacientesKeys = {
  all: ['c4', 'pacientes'] as const,
  list: (filters: PacienteFilters) => [...pacientesKeys.all, filters] as const,
  detail: (id: string) => [...pacientesKeys.all, id] as const,
}
```

---

## Mutations

Toda mutation tem `onSuccess` que invalida as queries afetadas. Nunca atualiza estado local manualmente após mutation.

```ts
export function useImportarCsv() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: c4Api.importarCsv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.all })
    },
  })
}
```

---

## Regras de Backend — NestJS

### Controllers

Controllers fazem apenas três coisas: receber request, chamar service, retornar response. Zero lógica.

```ts
// ERRADO
@Get('pacientes')
async getPacientes(@Req() req: Request) {
  const user = req.user as JwtPayload
  const pacientes = await this.db.query.c4Registros.findMany({
    where: eq(c4Registros.esfId, user.esfId)
  })
  return pacientes.filter(p => p.score > 0).map(p => ({
    ...p,
    classificacao: p.score >= 80 ? 'otimo' : 'regular'
  }))
}

// CERTO
@Get('pacientes')
getPacientes(@CurrentUser() user: JwtPayload, @Query() filters: C4FilterDto) {
  return this.c4Service.listPacientes(user.esfId, filters)
}
```

### Services

Services contêm toda a lógica de negócio. Services não conhecem HTTP. Services não acessam o banco diretamente — delegam para repositories ou usam o Drizzle via uma camada de acesso.

```ts
@Injectable()
export class C4Service {
  constructor(
    private readonly calculator: C4CalculatorService,
    private readonly classification: C4ClassificationService,
    private readonly repository: C4Repository,
  ) {}

  async listPacientes(esfId: string, filters: C4FilterDto) {
    return this.repository.findMany(esfId, filters)
  }

  async calcularScore(criterios: C4Criterios) {
    const score = this.calculator.calculate(criterios)
    return {
      score,
      classificacao: this.classification.classify(score),
    }
  }
}
```

### Calculator Services

Lógica de cálculo 100% pura. Sem injeção de dependência de IO. Testável sem banco, sem HTTP, sem nada externo.

```ts
@Injectable()
export class C4CalculatorService {
  private readonly pontuacoes: Record<keyof C4Criterios, number> = C4_PONTUACOES

  calculate(criterios: C4Criterios): number {
    return Object.entries(criterios).reduce(
      (total, [key, cumprido]) =>
        cumprido ? total + (this.pontuacoes[key as keyof C4Criterios] ?? 0) : total,
      0,
    )
  }
}
```

### DTOs

Toda entrada é validada. Nenhum campo sem tipo. Usar `class-validator` ou Zod — não misturar os dois no mesmo módulo.

```ts
export class C4FilterDto {
  @IsOptional()
  @IsEnum(Classificacao)
  classificacao?: Classificacao

  @IsOptional()
  @IsString()
  microarea?: string

  @IsOptional()
  @IsUUID()
  acsId?: string
}
```

---

## Regras de Banco — Drizzle ORM

Schema é a fonte de verdade. Nunca duplicar a definição de uma entidade.

```ts
export const c4Registros = pgTable(
  'c4_registros',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    esfId: uuid('esf_id')
      .notNull()
      .references(() => esfs.id),
    pacienteNome: text('paciente_nome').notNull(),
    criterioA: boolean('criterio_a').notNull().default(false),
    criterioB: boolean('criterio_b').notNull().default(false),
    score: integer('score').notNull(),
    classificacao: classificacaoEnum('classificacao').notNull(),
    periodo: varchar('periodo', { length: 7 }).notNull(),
    criadoEm: timestamp('criado_em').defaultNow(),
  },
  (t) => ({
    esfPeriodoIdx: index('idx_c4_esf_periodo').on(t.esfId, t.periodo),
    classificacaoIdx: index('idx_c4_classificacao').on(t.classificacao),
  }),
)
```

Tipos inferidos do schema — nunca criar interface paralela para o que o Drizzle já tipou.

```ts
export type C4Registro = typeof c4Registros.$inferSelect
export type NewC4Registro = typeof c4Registros.$inferInsert
```

---

## Regras de Tipos

Tipos descrevem o domínio, não a implementação.

```ts
// ERRADO
type PacienteData = {
  data: {
    id: string
    nome_paciente: string
    score_value: number
  }
}

// CERTO
type Paciente = {
  id: string
  nome: string
  score: number
  classificacao: Classificacao
}
```

Nunca use `type` onde `interface` serve. Nunca use `interface` onde `type` é necessário (unions, mapped types). Use o que o caso pede.

Enums de domínio vivem em `types/`. Nunca inline.

```ts
export type Classificacao = 'otimo' | 'bom' | 'suficiente' | 'regular'
```

---

## Regras de Constants

Nenhum valor mágico no código. Todo threshold, toda string de label, toda configuração vai em constants.

```ts
// constants/c4.constants.ts
export const C4_PONTUACOES = {
  criterioA: 20,
  criterioB: 15,
  criterioC: 15,
  criterioD: 20,
  criterioE: 15,
  criterioF: 15,
} as const

export const C4_THRESHOLDS = {
  otimo: 80,
  bom: 60,
  suficiente: 40,
} as const

export const C4_SCORE_MAXIMO = Object.values(C4_PONTUACOES).reduce((a, b) => a + b, 0)
```

---

## Regras de Multi-tenancy

Todo endpoint filtra por `esfId` extraído do JWT. Nunca confiar em `esfId` vindo do body ou query sem verificação. Admins podem passar `?esfId=all`.

```ts
@Get('pacientes')
getPacientes(@CurrentUser() user: JwtPayload, @Query() filters: C4FilterDto) {
  const esfId = user.role === 'admin' && filters.esfId === 'all'
    ? undefined
    : user.esfId
  return this.c4Service.listPacientes(esfId, filters)
}
```

---

## Nomenclatura

| Contexto            | Convenção                     | Exemplo                   |
| ------------------- | ----------------------------- | ------------------------- |
| Componentes         | PascalCase                    | `C4KpiCards.tsx`          |
| Hooks               | camelCase com `use`           | `useC4Pacientes.ts`       |
| Services (backend)  | camelCase com sufixo          | `c4Calculator.service.ts` |
| Types/Interfaces    | PascalCase                    | `Paciente`, `C4Criterios` |
| Constants           | UPPER_SNAKE_CASE              | `C4_PONTUACOES`           |
| Variáveis/funções   | camelCase                     | `calcularScore`           |
| Arquivos (frontend) | kebab-case exceto componentes | `c4.types.ts`             |
| Tabelas banco       | snake_case                    | `c4_registros`            |
| Colunas banco       | snake_case                    | `esf_id`, `criado_em`     |

---

## Estrutura de Resposta da API

Toda resposta de listagem segue o mesmo contrato:

```ts
type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

Toda resposta de erro segue:

```ts
type ErrorResponse = {
  statusCode: number
  message: string
  error: string
}
```

Nunca retornar arrays crus em endpoints paginados. Nunca retornar objetos sem tipo definido.

---

## Performance

- `useMemo` apenas quando o cálculo é comprovadamente caro — não por padrão
- `useCallback` apenas quando a função é passada como prop para componente memoizado
- Componentes de gráfico sempre com `React.lazy` + `Suspense`
- Tabelas grandes com paginação server-side — nunca filtrar no frontend o que pode filtrar no banco
- Queries do Drizzle sempre com `limit` — nunca `findMany` sem limitador em produção

---

## O Teste de Qualidade

Antes de considerar qualquer código pronto, responda:

1. Se esse arquivo mudasse de responsabilidade, quantos outros arquivos quebrariam?
2. Consigo testar a lógica de negócio sem subir banco, HTTP ou UI?
3. Um dev que nunca viu o projeto entende o que esse arquivo faz pelo nome e pela estrutura?
4. Existe alguma duplicação que eu poderia extrair?
5. Existe algum valor hardcoded que deveria ser constante?

Se alguma resposta for negativa, o código não está pronto.
