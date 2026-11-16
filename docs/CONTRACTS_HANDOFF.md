# Contratos entre projetos — EXISTENTE x PROPOSTO

**Este arquivo é um roteiro de alinhamento, NÃO um OpenAPI implantado.** Não chamar endpoints propostos como se existissem. Antes de codificar, verificar rotas/schemas atuais e validar o contrato entre agentes.

Para a Ativação, A05 já tem uma hipótese operacional suficiente para planejamento em `ACTIVATION_N8N_ASSUMED_CONTRACT.md`. Seus envelopes internos são propostas de handoff, não payloads confirmados no n8n local.

## 1. Caminhos verificados nos ZIPs

| Camada | Caminho | Situação |
|---|---|---|
| Next → Gateway | `POST /api/analyze` | Existe em `routes/analyzeRoutes.js`, autenticado; proxy síncrono para FastAPI |
| Gateway → FastAPI | `POST /analyze/` | Existe no Python (`routers/analyzes_router.py`) |
| Gateway | `/api/goals`, `/api/kanban`, `/customer`, `/api/metrics`, `/api/auth*`, plataformas | Existem, detalhes nos arquivos `routes/` |
| Front → FastAPI | `/documents/store`, `/documents/list` etc. via base `analyze` | Existe no client `lib/api/context-base.ts`; revisar proteção antes de expor novos dados |
| n8n → FastAPI | `POST /documents/prepare` | Existe (Docling/chunks) e é citado no `docs/PROJECT.md` do Python |

O Gateway usa `ANALYZE_API_BASE_URL` e um proxy timeout (`ANALYZE_PROXY_TIMEOUT_MS`, fallback 120000 ms), portanto **não reaproveitar o request HTTP síncrono para processamento estratégico de horas/dias**. O Next possui `NEXT_PUBLIC_ANALYZE_USE_MOCK=true` para a análise atual. A existência desses caminhos não prova que o OIDEA V2 esteja conectado.

## 2. Padrão recomendado para novas integrações (proposta, a revisar)

```text
Frontend (Next) --cookie autenticado--> Gateway (Express/RDS)
                                            |
                                            +-- estado/IDs/validação de tenant
                                            +-- dispara execução --> n8n
                                            |                         |
                                            |                         +--> Python/FastAPI e fontes autorizadas
                                            |                         +--> resultados da etapa + referências
                                            |                         +--> callback seguro --> Gateway
                                            |
Frontend <-- GET estado e saídas -----------+
```

- Front não chama webhook n8n com credenciais/segredos e não confia em status gerado localmente.
- POST de início responde `202 Accepted` com `execution_id` e `status`, não mantém a conexão durante LLM longo. UI consulta status por polling moderado (SSE opcional somente se justificado).
- Webhook/callback interno autenticado com segredo próprio/mTLS/HMAC ou outro mecanismo aprovado, com `event_id` idempotente, assinatura e validação de transição de status.
- Gateway valida `account` e `customer`; n8n e Python recebem apenas dados necessários para sua tarefa.
- Guardar o estado relacional durável no banco do Gateway (ou armazenamento operacional acordado); Pinecone para documentos/recuperação de contexto, não como única fonte de verdade de aceite/status.

## 3. Endpoints CANDIDATOS V2 — todos novos, não existentes

Nomes/paths provisórios; podem mudar depois da revisão conjunta.

- `GET /api/v2/agency/attention` — propostas relevantes e resumo multi-cliente da agência autenticada.
- `GET /api/v2/customers/:id/activation`; `POST /api/v2/customers/:id/activation/validate` — progresso/gate.
- `POST /api/v2/strategic-executions` — iniciar OIDEA inicial ou sob demanda; `GET /api/v2/strategic-executions/:id` — status/etapas; `GET /api/v2/strategic-executions/:id/report` — avaliação integrada.
- `GET /api/v2/customers/:id/objectives`; `PATCH /api/v2/objectives/:id` — objetivos vigentes; aprovação/edição requer fluxos com autorização explícita.
- `POST /api/v2/cycles`; `GET /api/v2/cycles`; `GET /api/v2/cycles/:id`; `POST /api/v2/cycles/:id/close` — criação e ciclo de vida.
- `GET /api/v2/cycles/:id/decisions`; mutações de aceite e descarte a definir — propostas rotineiras limitadas ao ciclo. Na V2.0, o descarte remove a proposta sem histórico persistido; o contrato final não está definido.
- `POST /api/v2/kanban/cards/:id/quality-check` — avaliação por entrega antes da mudança de estágio.
- `GET /api/v2/cycles/:id/evaluation` — aprendizagem/diagnóstico final.

**Não criar todos esses endpoints de uma vez.** Implementar por vertical slice conforme a UI solicitar, reaproveitando rotas anteriores quando adequadas sem quebrar contrato.

## 4. Entidades conceituais (schema sujeito a revisão)

- `agency/account`, `customer`, `activation`, `strategic_execution`, `analysis_stage_output`, `strategic_objective`, `key_result`, `operational_cycle`, `routine_observation_run`, `decision_proposal`, `decision_deliberation`, `content_quality_review`, `cycle_evaluation`.
- Uma proposta a persistir requer vínculo com `account` e `customer`, escopo estratégico ou rotineiro, ciclo de origem quando rotineira e evidência. **Vigência rotineira não extrapola ciclo**. Estados conceituais na V2.0: pendente, aceita e expirada; descartar remove a proposta, sem estado/histórico persistido de descarte. Campos e nomes técnicos ainda dependem de contrato.
- Análise/etapas: `queued`, `running`, `completed`, `failed` (status finais definidos pelo contrato real); disponibilizar outputs intermediários concluídos.
- Separar **proposta da IA**, **deliberação humana**, **ação pretendida**, **evidência de execução** e **resultado observado**.
- IDs estáveis, UTC no banco e timezone explícito na UI; fontes citáveis; `schema_version` nos eventos e documentos; auditoria de ações humanas.

## 5. Exemplo ILUSTRATIVO de handoff de tela → API

```json
{
  "feature": "operational-cycle-create",
  "origin": "frontend",
  "status": "PROPOSED_NOT_IMPLEMENTED",
  "request": {"customer_id": 101, "name": "Ciclo novembro", "starts_on": "2026-11-01", "ends_on": "2026-11-28"},
  "response": {"id": "cycle_uuid", "status": "active", "objectives": []},
  "notes": "Objetivos são consultados no servidor; não exigir pauta, orçamento ou plano editorial neste cadastro."
}
```

O exemplo não é dado de produção nem substitui schema assinado por Gateway + Front.

## 6. Handoff obrigatório de cada entrega

1. **Frontend:** telas/estados, mock tipado, campos e contrato esperado, tratamento de erro, UX, rota e telas de referência.
2. **Gateway:** URL final, autenticação/permissões/tenant, migrations idempotentes e reversíveis, payloads, testes de isolamento, status da integração n8n.
3. **Análises:** workflow/prompt/endpoint de cálculo, input/output versionados, provenance, testes de factualidade e limitações.
4. **Integração:** teste ponta a ponta e remoção da simulação da tela, sem alterar fluxo antigo.
