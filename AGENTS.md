# AGENTS.md — Frontend da ho.ko AI.nalytics V2

Você é responsável SOMENTE por este frontend Next.js. **Leia primeiro**:

1. `docs/V2_CONTEXT.md` — produto, dois OIDEAs, decisões e limites.
2. `docs/CODEBASE_MAP.md` — paths e código real reutilizável.
3. `docs/IMPLEMENTATION_PLAN.md` — ordem de entregas visual-first.
4. `docs/CONTRACTS_HANDOFF.md` — o que existe versus APIs propostas.
5. `docs/DECISIONS_OPEN.md` — conflitos de reunião e decisões pendentes.
6. `docs/AGENT_START_PROMPT.md` — missão inicial pronta para colar.

**Regras inegociáveis:** inspecionar código antes de agir; reusar componentes/UI e API client; não quebrar auth/cookies/RBAC/tenancy/billing; implementar uma fatia visual por vez; mocks tipados e explícitos; não expor n8n/segredos ao browser; preparar handoff de API antes de tocar Gateway; `npm run lint` e `npm run build`; informar erros. V2 não é reescrita do zero. Montserrat e design tokens já existem. Ao final, listar arquivos alterados, testes, riscos e dependências.

Comece por `docs/AGENT_START_PROMPT.md`, mas execute apenas a missão atual aprovada, não todo o roadmap automaticamente.
