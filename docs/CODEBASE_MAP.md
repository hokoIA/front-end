# Mapa do código atual — Frontend Next.js

**Inspecionado em `front-end-main.zip`, recebido em 2026-11-04.** Next.js 16.2.3, React 19.2.4, TypeScript, Tailwind 4, Radix, React Query, Zustand, dnd-kit; pacote disponível em `package.json`. `README.md` do ZIP está vazio: usar este documento como mapa inicial.

## Entrada e navegação

- `app/layout.tsx` — Montserrat via `next/font/google`, `AppProviders` e Analytics.
- `app/(app)/layout.tsx`, `components/layout/app-shell.tsx`, `app-chrome.tsx`, `app-sidebar.tsx`, `app-topbar.tsx`, `nav-links.tsx` — casca do aplicativo.
- `lib/navigation.ts` — menu atual: `/inicio`, `/dashboard`, `/analises`, `/alimentar-modelo`, `/metas`, `/kanban`, `/clientes`, `/equipe`, `/configuracoes`.
- `app/(auth)/...` e `components/auth/*` + `components/providers/auth-provider.tsx` — autenticação e guards; preservar.
- `components/providers/selected-customer-provider.tsx` e `hooks/use-current-customer-context.ts` — cliente selecionado; **hub da agência precisa funcionar sem seleção**.

## Funcionalidades concretas

| Área atual | Código de entrada | Estado relevante para V2 |
|---|---|---|
| Clientes | `features/customers/views/customers-hub-view.tsx`, `components/create-customer-flow.tsx` | Cria cliente por diálogo simples; não é ainda o fluxo completo de Ativação V2. |
| Conexões | `features/integrations/`, `lib/api/customers.ts` | Reaproveitar status e conexão por recurso/cliente; validar UX de gestão global. |
| Análises | `features/analises/analises-view.tsx`, `features/analises/hooks/use-strategic-analyze-mutation.ts` | Atual geração síncrona via `POST /api/analyze`; tem mock explícito `NEXT_PUBLIC_ANALYZE_USE_MOCK=true`. OIDEA assíncrono V2 é novo. |
| Base de contexto | `features/context-base/`, `lib/api/context-base.ts` | Chamadas ao FastAPI via base `analyze`; reutilizar UI mas rever auth/tenancy de acessos V2. |
| Planejamento | `features/goals/` e `/metas` | CRUD de metas, KPI builder, sugestões, análise de meta — não é ainda fluxo de aprovação OIDEA de objetivos estratégicos. |
| Kanban | `features/kanban/views/kanban-hub-view.tsx`, `board/`, `components/`, `lib/api/kanban.ts` | Quadro, colunas, cards, atribuição e movimento existentes; gate de qualidade e associação com ciclo são novos. |
| Dashboard | `features/dashboard/` e `/dashboard` | Reaproveitar gráficos/métricas/formatadores; não misturar avaliação OIDEA com gráficos de dashboard sem design. |
| Home | `features/home/` e `/inicio` | Local indicado para hub transversal; inspecionar detalhes antes de substituir UI. |
| Integração HTTP | `lib/api/http-client.ts`, `lib/api/endpoints.ts`, `hooks/api/*` | Cookies HttpOnly `jwt`, `credentials:'include'`, HTTP base `api`/`analyze`; não chamar n8n do browser. |
| Estilo | `app/globals.css`, `components/ui/*` | Já há tokens `--hk-*`, Radix e Montserrat; reutilizar em vez de novo framework visual. |

## Contratos e configuração detectados

- `NEXT_PUBLIC_API_BASE_URL` (Gateway), `NEXT_PUBLIC_ANALYZE_API_BASE_URL` (FastAPI), `BACKEND_PROXY_TARGET` (rewrites Next `/api/*` e `/customer/*`), `NEXT_PUBLIC_ANALYZE_USE_MOCK` (análise simulada). Não criar `.env` versionado.
- Os serviços em `lib/api/` usam `endpoints` com caminhos já existentes; manter compatibilidade; novos endpoints V2 em seção separada/cliente tipado.
- O repo contém componentes e mocks reais em `features/**/mocks`; **não presumir que mock é dado de produção**.

## Validação e limites

Comandos definidos: `npm ci`, `npm run dev`, `npm run lint`, `npm run build`. A análise aqui foi estrutural/estática; **não houve execução do Next nem homologação de tela**. Verificar instruções de ambiente e as chamadas concretas antes de mudar o código.
