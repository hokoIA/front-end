# Decisões recentes e pontos de confirmação — NÃO inventar implementação

Histórico: conversa de design/arquitetura e notas das reuniões 21, 23, 26 e 28/10/2026. Anotações automáticas de reuniões **não são garantia de especificação definitiva**. Em caso de divergência, buscar decisão explícita dos responsáveis antes de código irreversível.

## Alinhado para a BETA (usar como base)

- Cliente prioritário: agência. Cliente final participa de briefing/validações, mas não é a experiência principal nesta fase.
- Ativação define objetivos iniciais e coleta fontes; gates para documentos críticos. OIDEA estratégico inicial após Ativação, propostas adicionais não aprovadas automaticamente.
- Estratégico independente de ciclos rotineiros; saídas Observar, Interpretar, Decidir independentes e avaliação integrada. Propostas estratégicas aceitas tornam-se objetivos vigentes; objetivos SMART/OKRs até 3 KRs são o formato debatido nas reuniões.
- Ciclo operacional é iniciado manualmente com período e objetivos vigentes, sem exigência de cadastro de produção. Responsáveis existentes no cliente, não recadastrar todo ciclo.
- Monitoramento rotineiro frequente/diário; gerar decisão apenas se relevante. Propostas transversais para agência, não tarefas no Kanban. Deliberação com texto; sem vínculo operacional obrigatório.
- Gate de qualidade contextual ao card antes da troca de responsável.
- Aprendizagem do ciclo gera avaliação e histórico dos ciclos; decisões rotineiras deixam de ser ativas depois do encerramento. A retenção de propostas descartadas segue D02 abaixo.
- Encerramento por prazo automático como padrão, opção de encerramento manual antecipado (reunião 28/10). A criação do próximo ciclo continua manual conforme conversa posterior, salvo decisão expressa contrária.

## D01–D12 — decisões do responsável do produto em 2026-11-16

As regras abaixo estão aprovadas para a V2.0 e incorporadas em `PRODUCT_SOURCE_OF_TRUTH.md`. Onde houver adiamento, ele não autoriza implementação antecipada. Contratos e nomes técnicos ainda dependem de desenho com os serviços responsáveis.

| ID | Decisão para a V2.0 | Trabalho posterior |
|---|---|---|
| D01 | Decisões rotineiras são correções pontuais e rápidas, limitadas ao ciclo de origem; apenas direcionamentos estratégicos aprovados, como OKR/KPI, podem atravessar ciclos. | Definir vigência técnica no contrato de ciclos. |
| D02 | Descartar uma proposta a remove; não persistir o descarte ou seu histórico na V2.0. | Reavaliar retenção somente se houver nova decisão de produto. |
| D03 | Manter regra conservadora: não bloquear o primeiro ciclo operacional por aprovação adicional do cliente final. | Discutir eventual gate de revisões estratégicas posteriores. |
| D04 | Não oferecer links externos ou públicos na V2.0. | Novo desenho e autorização se o compartilhamento entrar depois. |
| D05 | Manter a organização atual de Clientes & Integrações e Equipe. | Reavaliar a estrutura dessas telas em discussão UX/UI da V2.1. |
| D06 | Não implementar produção autônoma de agentes ou geração automática de tarefas no Kanban a partir de OKRs. | Escopo posterior mediante decisão explícita. |
| D07 | Sinais de relevância e urgência não devem interromper o trabalho com modal obrigatório; manter visibilidade conservadora. | Ajustar cadência em teste de usabilidade. |
| D08 | Aplicar o limite de D06 ao escopo avançado de produção criativa por agentes. | Avaliar formatos e capacidades técnicas somente quando esse escopo entrar. |
| D09 | Não fixar formato de avaliação ou dashboard agora. | Discutir após testes iniciais de produção interna da agência, com saídas reais. |
| D10 | Não definir período ou frequência estratégica fixa. | Gatilhos futuros exigem decisão própria. |
| D11 | Trello e Google Workspace ficam fora da V2.0. | Eventual integração requer desenho e contrato próprios. |
| D12 | Adotar estados conceituais simples para propostas rotineiras: pendente, aceita e expirada. Descartar remove a proposta, conforme D02. | Fixar nomes técnicos e transições no contrato Gateway antes de persistir. |

## Ativação — decisões para o plano entre projetos (2026-11-16)

O fluxo visual atual foi considerado suficiente para avançar, sem transformar os mocks em dados de produção. A01, a direção de A02 e a política de A04 foram resolvidas para o teste interno da V2.0. A03 foi adotada como modelo inicial de trabalho para 0B; nomes técnicos finais ainda serão conferidos pelo Gateway. O pacote histórico recebido em 2026-11-16 foi preservado em `references/activation/2026-11-16-pacote/`. A05 foi resolvida para planejamento por modelo assumido, sem depender agora dos exports JSON.

**A01 — resolvida em 2026-11-16:** clientes legados conservam status e informações atuais, sem backfill. A cobrança extra permanece baseada apenas em clientes com `customer.status = 'active'`; clientes novos em Ativação passam a contar somente após a transição para ativo. Essa regra ainda precisa ser verificada em contrato e testes integrados antes da implementação.

**A02 — direção aprovada em 2026-11-16:** usar um conjunto pequeno e ajustável de informações básicas para estruturar e testar a Ativação com a própria agência ho.ko. Clientes ainda Em Ativação podem acompanhar mudanças nessa lista durante o teste interno. Os dois assuntos de conteúdo em `ACTIVATION_INITIAL_MODEL_DRAFT.md` são uma **proposta inicial**, não uma lista definitiva aprovada de documentos obrigatórios.

**A03 — modelo inicial de trabalho adotado em 2026-11-16:** usar `activating` para novos clientes em coleta, preservar `active`/`inactive` legados e introduzir `activation:manage` para Admin no Gateway, sem conceder à Equipe. A avaliação terá estado próprio, separado de `customer.status`. O handoff `ACTIVATION_0B_GATEWAY_HANDOFF.md` fixa a primeira fatia; o Gateway deve validar compatibilidade técnica antes da migration, sem tratar os nomes como API já implantada.

**A04 — resolvida como política de produto em 2026-11-16:** na V2.0 de teste interno, permitir exclusão definitiva, simples e controlada de **um cliente Em Ativação** e seus artefatos relacionados em PostgreSQL, OAuth, n8n e Pinecone, sem política adicional de retenção. O desenho técnico precisa impedir exclusão de outro cliente ou de cliente já ativo e tratar falha parcial antes da implementação.

**A05 — resolvida para planejamento em 2026-11-16:** adotar a sequência e os envelopes internos de `ACTIVATION_N8N_ASSUMED_CONTRACT.md` como hipótese operacional. `documentos_obrigatorios: []` é saída válida de uma execução concluída; o relato de cinco documentos adicionais pode corresponder a outra execução e não é requisito mínimo universal. A inspeção dos nodes e o teste real ficam na fatia de integração.

O inventário está em `SCHEMA_USAGE_AUDIT_2026-11-16.md`, o plano técnico em `ACTIVATION_CROSS_STACK_PLAN.md` e a proposta de governança em `PLATFORM_GOVERNANCE_DRAFT.md`. Nenhuma linha acima autoriza DDL ou remoção.
