# Plano visual do Frontend — histórico e sequência de áreas

**Execução atual:** a Etapa 0 integrada é controlada por `ACTIVATION_CROSS_STACK_PLAN.md`. O mesmo agente implementa as fatias necessárias no Frontend, Gateway, Analyze e n8n; este plano continua como mapa visual, sem atribuir trabalho a outro agente. O pedido atual do responsável dispensa compilar/buildar neste momento; registrar os comandos não executados.

**Estratégia:** visual-first e slices pequenos. O agente Front entrega UI funcional/estados com mocks tipados; pede dados reais ao Gateway por um handoff específico; só remove mocks depois do contrato/teste integrado. Não refazer login/RBAC/Kanban/CSS base por gosto pessoal.

| Ordem | Entrega de Front | Reaproveitar | Handoff necessário | Aceite |
|---|---|---|---|---|
| F00 | Baseline, screenshot local e inventário das telas atuais | layouts, components/ui, CSS, Montserrat, providers | Nenhum | `npm run lint` e `npm run build`, anotar baseline real |
| F01 | Shell da agência: saúde transversal e navegação V2 com estado vazio e simulado | `lib/navigation.ts`, `components/layout/`, `/inicio` | `GET attention` candidato, contrato mínimo | Não exigir seleção de cliente para perceber situação relevante; abrir workspace contextual para deliberar |
| F02 | UX de Ativação dentro de Clientes: contexto, objetivos iniciais, documentos, integrações, gate | `features/customers`, `features/context-base`, `features/integrations` | ativação/status/documentos | Não repetir dados; gate com estados completos |
| F03 | Primeira execução estratégica: iniciar após ativação, acompanhar e voltar | `features/analises` + `hooks` | start/status/outputs do OIDEA | UI não assume resposta imediata nem porcentagem fictícia |
| F04 | Análises estratégicas: saídas independentes e avaliação rica | `AnalysisMarkdownViewer`, export PDF, UI dados | GET saídas e relatório | Observação não tem diagnóstico; relatório legível |
| F05 | Estratégia: objetivos da Ativação e propostas aceitas/editáveis, KRs | `features/goals`, meta UI | CRUD/propostas/aceite | IA proposta ≠ objetivo aprovado |
| F06 | Criar ciclo explicitamente (período + objetivos) e ver ciclo vigente | novo feature de ciclos; selected customer existente | CRUD/status ciclos | Não exigir planejamento de peças ao criar |
| F07 | Central de Decisões contextual + detalhe do ciclo + deliberação textual; percepção transversal no Início | UI de estados/alertas, auth, cliente selecionado | list/deliberate + justificativa | Urgência perceptível entre clientes; fundamento e deliberação no workspace do cliente; não interrompe Kanban |
| F08 | Gate de qualidade no modal/drawer de card ao transitar | `features/kanban`/drawer/move | quality-check por card | Pontos críticos/opcionais; usuário mantém controle |
| F09 | Aprendizagem/encerramento: avaliação e histórico, resultado da IA | análises/markdown e componentes de dados | GET report/cycle close | Decisões antigas não aparecem como pendentes no novo ciclo |
| F10 | Substituir mocks por integrações verificadas; regressão, acessibilidade, estados | hooks/api/React Query | contratos finalizados | Feature sem mock em produção e com testes |

## Convenções de implementação

- Página em `app/(app)/.../page.tsx`; composição em `features/<dominio>/`; chamadas em `lib/api/`, hooks em `hooks/api/`, tipos em `lib/types/`; navegação em `lib/navigation.ts`.
- Manter `httpJson/httpFetch` e `credentials: 'include'` com JWT cookie; não introduzir tokens em `localStorage`. API n8n só através de Backend Geral.
- Cliente selecionado é contexto de detalhe, não filtro compulsório para hub transversal. Não usar mock de outro tenant no lugar de dados reais; mocks isolados em `features/<dominio>/mocks/` e marcados.
- Reusar `components/ui` e tokens `--hk-*`; Montserrat já carregada em `app/layout.tsx`; design corporativo em azul.
- Em cada tela cobrir: sem clientes, sem integração, sem contexto, carregando, processamento demorado, erro técnico, permissão insuficiente, não há propostas, resultados parciais, ciclo encerrado.
- Não modificar contratos de análise antiga para fingir suporte a OIDEA. Criar novos tipos de execução e novos hooks quando necessário.

## Primeira missão histórica (F01)

Esta instrução descreve o escopo inicial de F01 e não deve ser reiniciada. Para a missão vigente, seguir o checklist da Etapa 0 e executar cada contrato no repositório responsável antes de integrar a UI.
