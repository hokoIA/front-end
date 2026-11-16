# AGENTS.md — Frontend da ho.ko AI.nalytics V2

Este arquivo orienta o trabalho no frontend Next.js. Durante a construção da V2, o mesmo agente desenvolvedor também executa as entregas necessárias nos repositórios Gateway, Analyze e n8n, conforme autorização do responsável do produto. Antes de alterar cada repositório, leia suas instruções e inspecione seu código. **Leia primeiro**:

1. `docs/PRODUCT_SOURCE_OF_TRUTH.md` — decisões aprovadas de produto, navegação e responsabilidades.
2. `docs/V2_CONTEXT.md` — produto, dois OIDEAs, decisões e limites.
3. `docs/CODEBASE_MAP.md` — paths e código real reutilizável.
4. `docs/IMPLEMENTATION_PLAN.md` — ordem de entregas visual-first.
5. `docs/CONTRACTS_HANDOFF.md` — o que existe versus APIs propostas.
6. `docs/DECISIONS_OPEN.md` — conflitos de reunião e decisões pendentes.
7. `docs/AGENT_START_PROMPT.md` — missão inicial pronta para colar.

**Regras inegociáveis:** inspecionar código antes de agir; reusar componentes/UI e API client; não quebrar auth/cookies/RBAC/tenancy/billing; implementar uma fatia integrada por vez; mocks tipados e explícitos; não expor n8n/segredos ao browser; definir e conferir o contrato entre serviços antes de integrar; informar validações e erros. V2 não é reescrita do zero. Montserrat e design tokens já existem. Ao final, listar arquivos alterados, testes, riscos e dependências. O responsável do produto pediu para não gastar tempo com compilação neste momento; lint/build ficam a seu cargo até nova orientação.

**Execução entre repositórios:** handoffs documentam contratos e dependências, mas não transferem a execução a outro agente durante a construção da V2. Em 2026-11-16, o responsável revogou a restrição anterior de somente leitura e autorizou alterações no banco para as etapas acordadas. Revisar cada migration concreta antes de executá-la, registrar o resultado e atualizar `D:\hoko\Hoko-Backend\schema.sql` a partir do catálogo real. Não escrever estrutura futura nesse snapshot.

**Formato obrigatório de toda resposta final ao responsável:** organizar o retorno, nesta ordem, em **O QUE FOI FEITO**, **MIGRATIONS/STATUS DO BANCO** e **PRÓXIMAS ETAPAS**. Na primeira seção, informar mudanças concretas, arquivos relevantes e validações reais. Na segunda, registrar migrations executadas, efeito verificado e situação de `schema.sql`; omitir a seção quando não houver novidade relevante no banco. Na terceira, indicar a etapa exata em andamento, o próximo trabalho do agente e qualquer ação, validação ou aprovação necessária do responsável; declarar explicitamente quando nenhuma ação dele for necessária. Não marcar como concluído o que ainda depende de teste ou integração.

**Governança de produto e design:** `docs/PRODUCT_SOURCE_OF_TRUTH.md` só pode ser alterado após aprovação explícita e validação do responsável do produto. Toda mudança de produto, jornada, navegação, design ou usabilidade deve primeiro ser discutida tecnicamente com o responsável, incluindo intenção do usuário, alternativas, impactos e recomendação. Propostas não aprovadas vão para `docs/DECISIONS_OPEN.md`; implementação ou ata de reunião não altera a fonte de verdade por si só.

Comece por `docs/AGENT_START_PROMPT.md`, mas execute apenas a missão atual aprovada, não todo o roadmap automaticamente.
