# Roteiro compartilhado de etapas da ho.ko AI.nalytics

**Estado:** proposta de coordenação entre projetos. A governança comum está em `PLATFORM_GOVERNANCE_DRAFT.md` e aguarda validação. Este roteiro não substitui os planos específicos nem autoriza endpoints/migrations. A primeira etapa detalhada está em `ACTIVATION_CROSS_STACK_PLAN.md`.

| Etapa | Resultado verificável | Dependência principal | Plano específico |
|---|---|---|---|
| 0 — Ativação | Cliente em preparação com materiais, mínimos, avaliação e autorização duráveis; legados preservados | Status, documentos e n8n contratados; cobrança extra permanece ativa somente para cliente `active` | `ACTIVATION_CROSS_STACK_PLAN.md` |
| 1 — Inteligência estratégica | Execução OIDEA macro assíncrona, saídas consultáveis e propostas para deliberação | Cliente autorizado; proveniência e contratos de execução | Preparar após 0D |
| 2 — Planejamento estratégico | Objetivos iniciais vigentes e propostas aceitas/editadas sem recriação obrigatória | Saídas estratégicas e metas V1 mapeadas | Preparar junto da Etapa 1 |
| 3 — Ciclo operacional e decisões rotineiras | Criação manual com período/objetivos; observação recorrente e correção pontual que não atravessa ciclos; descarte não persistido na V2.0 | Objetivos vigentes e ciclo durável | Preparar após 2 |
| 4 — Qualidade da entrega no Kanban | Verificação contextual na passagem ao próximo responsável | Documentos vigentes, cards e transições existentes | Preparar após contratos de 0/3 |
| 5 — Aprendizagem e histórico | Avaliação de ciclo com evidências, limites e deliberações aceitas pertinentes; formato a definir após testes internos | Ciclos, resultados e deliberações disponíveis | Preparar após 3/4 |

## Pacote obrigatório de cada plano específico

- [ ] Intenção do usuário, fluxo e telas aprovados; alternativas e decisões abertas explícitas.
- [ ] Inventário de código, dados, schema e automações existentes com evidências.
- [ ] Contrato Front ↔ Gateway e Gateway ↔ n8n/Analyze, incluindo RBAC, tenant, erros, estados, versionamento e idempotência.
- [ ] Migrations aditivas, testes de isolamento, plano de rollback e atualização posterior de `schema.sql`. Preservar clientes legados sem backfill de status ou informações.
- [ ] Implementação por fatias e teste ponta a ponta antes de retirar mocks.
- [ ] Handoff e aprovação documentados para a próxima etapa.

Os checkboxes deste pacote são modelo para cada novo plano, não status global das seis etapas. Trabalhos visuais já aprovados podem avançar sem esperar toda a arquitetura futura; escrita de dados compartilhados só começa com contrato e migration da fatia correspondente.
