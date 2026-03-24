# Executive Brain v2 — Handoff para Continuidade

> Use este arquivo como prompt numa nova sessao do Claude Code.
> Ele contem TODO o contexto necessario para retomar o desenvolvimento sem perda de informacao.
> Data: 2026-03-24

---

## 1. O QUE E O PROJETO

**Executive Brain** e uma aplicacao web para gestao executiva com foco em:
- Upload de transcricoes de reunioes do Microsoft Teams (VTT/DOCX/TXT)
- Processamento com IA (OpenAI gpt-4o-mini) para gerar atas, tarefas, decisoes e compromissos automaticamente
- Gestao de Pessoas com vinculacao automatica a transcricoes/atas/tarefas
- Filtro por pessoa para visualizar historico completo de envolvimento
- Dashboard executivo com status de projetos, compromissos e metricas

---

## 2. TECH STACK DEFINIDA

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Framework | Next.js 16 (App Router) | ✅ Instalado |
| UI | shadcn/ui + Tailwind CSS v4 | ✅ Instalado (19 componentes) |
| Database | Supabase PostgreSQL | 🔲 Schema SQL pronto, falta criar projeto |
| ORM | Drizzle ORM | ✅ Schema TS pronto |
| Auth | Supabase Auth | 🔲 Nao iniciado |
| AI | OpenAI via Vercel AI SDK (`ai` + `@ai-sdk/openai`) | ✅ Instalado + code pronto |
| Background Jobs | Inngest | ✅ Instalado, falta pipeline |
| File Storage | Supabase Storage | 🔲 Nao iniciado |
| Search | PostgreSQL FTS + pgvector | 🔲 Schema SQL pronto, falta code |
| Embeddings | OpenAI `text-embedding-3-small` | 🔲 Nao iniciado |
| Deploy | Vercel | 🔲 CLI autenticado, falta deploy |
| Package Manager | pnpm | ✅ |

---

## 3. O QUE JA FOI IMPLEMENTADO

### Arquivos criados (source code):

```
src/
├── app/
│   ├── layout.tsx              # Next.js default (PRECISA ser refeito com sidebar)
│   ├── page.tsx                # Next.js default (PRECISA ser refeito como dashboard)
│   └── globals.css             # Tailwind + shadcn/ui CSS vars
│
├── components/
│   └── ui/                     # 19 componentes shadcn/ui instalados:
│       ├── avatar.tsx, badge.tsx, button.tsx, card.tsx, command.tsx,
│       ├── dialog.tsx, dropdown-menu.tsx, input.tsx, progress.tsx,
│       ├── scroll-area.tsx, select.tsx, separator.tsx, sheet.tsx,
│       ├── table.tsx, tabs.tsx, textarea.tsx, tooltip.tsx
│
├── lib/
│   ├── utils.ts                # ✅ cn() helper (clsx + tailwind-merge)
│   ├── supabase/
│   │   ├── client.ts           # ✅ Browser client (createBrowserClient)
│   │   ├── server.ts           # ✅ Server client para RSC/Server Actions
│   │   └── admin.ts            # ✅ Service role client para background jobs
│   ├── db/
│   │   └── schema.ts           # ✅ COMPLETO — Drizzle schema com 8 tabelas + relations
│   ├── ai/
│   │   ├── schemas.ts          # ✅ Zod schema para structured output (meetingAnalysisSchema)
│   │   └── process-transcript.ts # ✅ OpenAI gpt-4o-mini com generateObject()
│   ├── parsers/
│   │   └── vtt-parser.ts       # ✅ Parser de WebVTT do Teams + plain text fallback
│   └── people/
│       └── resolver.ts         # ✅ Fuzzy matching com Fuse.js (exact + alias + fuzzy)
```

### Diretórios criados (vazios, prontos para implementar):

```
src/components/layout/           # sidebar, header, command-palette
src/components/transcriptions/   # upload-form, transcript-viewer, minutes-panel, participant-resolver
src/components/people/           # person-card, person-timeline, person-merge-dialog
src/components/tasks/            # task-list, task-card
src/components/dashboard/        # stats-cards, recent-meetings, overdue-tasks
src/app/transcriptions/          # /transcriptions, /transcriptions/new, /transcriptions/[id]
src/app/people/                  # /people, /people/[id]
src/app/tasks/                   # /tasks
src/app/projects/                # /projects, /projects/[id]
src/app/commitments/             # /commitments
src/app/search/                  # /search
src/app/api/inngest/             # Inngest webhook handler
src/app/api/transcriptions/      # Upload + reprocess endpoints
src/app/api/search/              # Hybrid search endpoint
src/inngest/                     # Inngest client + functions
src/lib/search/                  # Hybrid search logic
```

### Schema SQL (Supabase migration):

**Arquivo**: `supabase/migrations/001_initial_schema.sql`
- 8 tabelas: people, projects, transcriptions, transcription_participants, minutes, tasks, decisions, commitments
- Tabela embeddings com pgvector(1536)
- FTS com tsvector em portugues (transcriptions + minutes)
- Indexes em todos os campos frequentes
- Triggers de updated_at automaticos
- Extensao pgvector habilitada

### Config files:

- `package.json` — Todas as dependencias instaladas
- `components.json` — shadcn/ui configurado
- `tsconfig.json` — paths @/* configurado
- `postcss.config.mjs` — Tailwind v4
- `next.config.ts` — Default
- `.gitignore` — .env*, node_modules, .next, .vercel

---

## 4. O QUE FALTA IMPLEMENTAR (em ordem de prioridade)

### Fase 1 — Fundacao (INCOMPLETA)

- [ ] **Criar projeto Supabase** — Usar `npx supabase init` + dashboard para criar projeto cloud
- [ ] **Rodar migration** — Aplicar `001_initial_schema.sql` no Supabase
- [ ] **Configurar `.env.local`** com:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  SUPABASE_SERVICE_ROLE_KEY=eyJ...
  OPENAI_API_KEY=<pedir ao Brendon>
  INNGEST_EVENT_KEY=xxx
  INNGEST_SIGNING_KEY=xxx
  ```
- [ ] **Drizzle config** — Criar `drizzle.config.ts` apontando para Supabase
- [ ] **Layout base** — Refazer `src/app/layout.tsx` com sidebar navigation:
  - Sidebar com links: Dashboard, Transcricoes, Pessoas, Tarefas, Projetos, Compromissos
  - Header com busca global (Cmd+K)
  - Dark mode toggle
  - Mobile responsive (Sheet para sidebar em mobile)
- [ ] **`.claude/launch.json`** para dev server:
  ```json
  {
    "version": "0.0.1",
    "configurations": [
      { "name": "nextjs", "runtimeExecutable": "pnpm", "runtimeArgs": ["dev"], "port": 3000 }
    ]
  }
  ```

### Fase 2 — Transcricoes + AI

- [ ] **Upload page** (`/transcriptions/new`) — Drag & drop VTT/DOCX/TXT
- [ ] **Upload API** (`/api/transcriptions/upload`) — Receber arquivo, parsear, salvar, trigger Inngest
- [ ] **Inngest pipeline** (`src/inngest/functions/process-transcription.ts`):
  - Step 1: Parse VTT (ja tem o parser pronto em `src/lib/parsers/vtt-parser.ts`)
  - Step 2: Resolve people (ja tem resolver em `src/lib/people/resolver.ts`)
  - Step 3: AI processing (ja tem em `src/lib/ai/process-transcript.ts`)
  - Step 4: Store results no Supabase (minutes, tasks, decisions, commitments)
  - Step 5: Generate embeddings (falta implementar `src/lib/ai/embeddings.ts`)
  - Step 6: Update status para 'completed'
- [ ] **Inngest client** (`src/inngest/client.ts`)
- [ ] **Inngest route handler** (`/api/inngest/route.ts`)
- [ ] **Transcription list page** (`/transcriptions`) — Lista com status, data, participantes
- [ ] **Transcription detail page** (`/transcriptions/[id]`) — Split-pane:
  - Esquerda: transcricao com speaker colors e timestamps
  - Direita: ata gerada + tarefas + decisoes
  - Participant resolver UI (vincular speakers a pessoas)

### Fase 3 — Pessoas + Vinculacao

- [ ] **People list page** (`/people`) — Lista com busca, filtros por area/relationship
- [ ] **People detail page** (`/people/[id]`) — Timeline com todas transcricoes, tarefas, decisoes
- [ ] **CRUD de pessoas** — Server Actions para criar/editar/deletar
- [ ] **Participant resolver component** — UI no detalhe da transcricao para:
  - Confirmar match automatico
  - Buscar pessoa existente (autocomplete)
  - Criar nova pessoa
  - Rejeitar match
- [ ] **Seed data** — Migrar contatos dos arquivos .md existentes (contacts/*.md) para Supabase

### Fase 4 — Dashboard + Busca

- [ ] **Dashboard** (`/`) — Stats cards + recent meetings + overdue tasks + project status
- [ ] **Full-text search** — Implementar `src/lib/search/hybrid.ts` com:
  - FTS via tsvector (portugues)
  - Semantic search via pgvector
  - SQL exact filters
  - RRF (Reciprocal Rank Fusion) para combinar resultados
- [ ] **Command palette** (Cmd+K) — Busca global em todos os tipos de conteudo
- [ ] **Search page** (`/search`) — Resultados agrupados por tipo

### Fase 5 — Projetos + Compromissos

- [ ] **Projects list** (`/projects`) — Cards com status, owner, deadline
- [ ] **Project detail** (`/projects/[id]`) — Tarefas + decisoes vinculadas
- [ ] **Commitments tracker** (`/commitments`) — Agrupado por: vencidos, esta semana, futuro
- [ ] **Seed data** — Migrar projetos dos arquivos .md existentes (projects/*.md)

### Fase 6 — Polish + Deploy

- [ ] **Auth** — Supabase Auth com magic link (single user)
- [ ] **RLS** — Row Level Security policies basicas
- [ ] **Responsividade** — Testar e ajustar para mobile
- [ ] **Error handling** — Error boundaries, toast notifications
- [ ] **Deploy** — `vercel --prod`
- [ ] **Embeddings** — `src/lib/ai/embeddings.ts` com OpenAI text-embedding-3-small

---

## 5. DATABASE SCHEMA RESUMIDO

```
people ─────┐
  │         │
  │    transcription_participants ── transcriptions
  │         │                            │
  │         │                       minutes
  │         │                        │   │
  ├── tasks ──────────────────────────┘   │
  │         │                             │
  ├── decisions ──────────────────────────┘
  │
  ├── commitments
  │
  └── projects ── tasks, decisions, commitments
```

Relacoes chave:
- **people** <-> **transcription_participants** <-> **transcriptions** (many-to-many via join table)
- **transcriptions** -> **minutes** (1:1)
- **transcriptions** -> **tasks**, **decisions**, **commitments** (1:many)
- **people** -> **tasks** (via assignee_id)
- **people** -> **commitments** (via with_whom_id)
- **projects** -> **tasks**, **decisions**, **commitments** (via project_id)

---

## 6. DESIGN PATTERNS E DECISOES TECNICAS

### AI Processing
- Usa `generateObject()` do Vercel AI SDK com Zod schema para structured output
- Modelo: `gpt-4o-mini` (barato, ~$0.004 por reuniao de 1h)
- Temperature 0 para determinismo
- System prompt em portugues com regras de extracao

### VTT Parser
- Regex `/<v\s+([^>]+)>([^<]*)<\/v>/` para voice tags do Teams
- Fallback para formato `Speaker: text` (colon-separated)
- Extrai: speakers, timestamps, texto, duracao

### People Resolver
- 3 niveis de matching: exact -> alias -> fuzzy (Fuse.js threshold 0.3)
- Confidence >= 0.85 = auto-confirm
- Abaixo disso = marcar para review manual

### File Structure
- Server Components por padrao (RSC)
- Server Actions para mutacoes
- API Routes apenas para webhooks (Inngest) e upload
- shadcn/ui para todos os componentes UI

---

## 7. DOCUMENTACAO ORIGINAL PRESERVADA

Os arquivos markdown originais do Executive Brain (contatos, projetos, templates, playbooks) estao preservados em:
- `contacts/` — 8 arquivos de contatos
- `projects/` — 5 arquivos de projetos
- `templates/` — 7 templates
- `playbooks/` — 3 playbooks
- `commitments/TRACKER.md` — Tracker de compromissos
- `CLAUDE.md` — Contexto executivo completo
- `ARCHITECTURE.md` — Arquitetura multi-device

Esses arquivos devem ser usados como **seed data** para popular o Supabase nas Fases 3 e 5.

---

## 8. COMO RODAR

```bash
# Instalar deps (ja feito)
pnpm install

# Dev server
pnpm dev

# Build
pnpm build
```

Falta:
1. Criar projeto no Supabase (dashboard ou CLI)
2. Configurar `.env.local` com as chaves
3. Rodar a migration SQL no Supabase
4. Criar `.claude/launch.json`

---

## 9. PLANO COMPLETO DETALHADO

O plano completo com analise de tecnologias, comparativo Firebase vs Supabase, schema SQL detalhado, pipeline de processamento, e todas as 6 fases esta em:

**`.claude/plans/mutable-sparking-fox.md`**

Consulte esse arquivo para qualquer detalhe adicional sobre decisoes de arquitetura.

---

## 10. INSTRUCOES PARA O CLAUDE CODE

Ao retomar o desenvolvimento:

1. Leia este arquivo HANDOFF.md primeiro
2. Leia `.claude/plans/mutable-sparking-fox.md` para o plano completo
3. Leia `CLAUDE.md` para contexto executivo do usuario
4. Continue a partir do item pendente mais prioritario na Fase 1
5. Use `pnpm dev` para testar (porta 3000)
6. O Vercel CLI esta autenticado — use `vercel` para deploy
7. A chave OpenAI esta neste arquivo (seção .env.local acima)
8. Priorize: Layout > Upload > Pipeline AI > Pessoas > Dashboard
