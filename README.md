# Indicadores APS

Sistema enterprise de Gestão de Gestantes e Indicadores da Atenção Básica com isolamento multi-tenant por ESF.

## Stack

| Camada         | Tecnologia                                                     |
| -------------- | -------------------------------------------------------------- |
| Frontend       | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, TanStack Query |
| Backend        | NestJS, TypeScript, Drizzle ORM, BullMQ                        |
| Database       | PostgreSQL (Neon)                                              |
| Cache / Queues | Redis (Upstash)                                                |
| Auth           | JWT + Refresh Tokens + Argon2                                  |
| Monorepo       | Turborepo + pnpm workspaces                                    |

## Multi-tenant por ESF

Cada usuário pertence a uma única ESF. **Todos os dados são isolados por `esf_id`** no backend — o frontend nunca controla o tenant. Admins podem visualizar e gerenciar todas as ESFs.

## Setup local

### Pré-requisitos

- Node.js ≥ 20
- pnpm ≥ 9
- Docker (opcional)

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Edite `apps/api/.env` com suas credenciais Neon/Upstash.

### 3. Rodar migrations

```bash
pnpm --filter @repo/api db:migrate
```

### 4. Iniciar em desenvolvimento

```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

### Docker (alternativo)

```bash
cp .env.example .env
docker compose up -d
```

## Estrutura do monorepo

```
indicadores/
├── apps/
│   ├── api/          # NestJS — Backend
│   └── web/          # Next.js 15 — Frontend
├── packages/
│   ├── config/       # Constantes e variáveis de ambiente
│   ├── eslint-config/
│   ├── tsconfig/
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── ui/           # Design system (Radix + Tailwind)
│   └── validations/  # Schemas Zod
└── turbo.json
```

## Roles e permissões

| Role    | Gestantes          | Usuários | Importar | Dashboard | Configurações |
| ------- | ------------------ | -------- | -------- | --------- | ------------- |
| admin   | CRUD (todas ESFs)  | CRUD     | ✓        | ✓         | ✓             |
| manager | CRUD (própria ESF) | CRD      | ✓        | ✓         | —             |
| nurse   | CR + Update        | —        | ✓        | ✓         | —             |
| doctor  | CR + Update        | —        | —        | ✓         | —             |
| acs     | Read               | —        | —        | ✓         | —             |

## Fluxo de autenticação

1. Admin cria usuário via `POST /v1/users/invite`
2. Usuário recebe link com token de primeiro acesso
3. Acessa `/first-access?token=...` e cria senha
4. Login via `POST /v1/auth/login` — recebe `access_token` (15min) + `refresh_token` httpOnly (7 dias)
5. Refresh automático via interceptor axios

## Segurança

- Argon2 para hash de senhas
- JWT com rotação de refresh token
- Cookies `httpOnly`, `secure`, `sameSite: strict`
- Rate limiting por IP (auth: 10req/15min, global: 100req/min)
- Helmet, CORS restrito
- Isolamento de dados por `esf_id` em todas as queries
- Audit logs com IP + User-Agent

## Deploy

- **Frontend** → Vercel (conectar repositório, configurar `NEXT_PUBLIC_API_URL`)
- **Backend** → Railway (configurar variáveis de ambiente)
- **Database** → Neon PostgreSQL
- **Cache/Queue** → Upstash Redis
