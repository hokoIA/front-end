# Decisões recentes e pontos de confirmação — NÃO inventar implementação

Histórico: conversa de design/arquitetura e notas das reuniões 21, 23, 26 e 28/10/2026. Anotações automáticas de reuniões **não são garantia de especificação definitiva**. Em caso de divergência, buscar decisão explícita dos responsáveis antes de código irreversível.

## Alinhado para a BETA (usar como base)

- Cliente prioritário: agência. Cliente final participa de briefing/validações, mas não é a experiência principal nesta fase.
- Ativação define objetivos iniciais e coleta fontes; gates para documentos críticos. OIDEA estratégico inicial após Ativação, propostas adicionais não aprovadas automaticamente.
- Estratégico independente de ciclos rotineiros; saídas Observar, Interpretar, Decidir independentes e avaliação integrada. Propostas estratégicas aceitas tornam-se objetivos vigentes; objetivos SMART/OKRs até 3 KRs são o formato debatido nas reuniões.
- Ciclo operacional é iniciado manualmente com período e objetivos vigentes, sem exigência de cadastro de produção. Responsáveis existentes no cliente, não recadastrar todo ciclo.
- Monitoramento rotineiro frequente/diário; gerar decisão apenas se relevante. Propostas transversais para agência, não tarefas no Kanban. Deliberação com texto; sem vínculo operacional obrigatório.
- Gate de qualidade contextual ao card antes da troca de responsável.
- Aprendizagem do ciclo gera avaliação e histórico de decisões; decisões rotineiras deixam de ser ativas depois do encerramento.
- Encerramento por prazo automático como padrão, opção de encerramento manual antecipado (reunião 28/10). A criação do próximo ciclo continua manual conforme conversa posterior, salvo decisão expressa contrária.

## Questões em aberto / mudanças entre reuniões e conversa

| ID | Tópico | Tensão identificada | Regra conservadora para agentes |
|---|---|---|---|
| D01 | Postergar decisão para ciclo seguinte | Conversa: decisões rotineiras não atravessam ciclos. Reunião 23/10: opção de postergação. | **Não transportar automaticamente**. Proposta futura de reavaliação deve ser uma nova decisão com nova origem e aceite. Confirmar produto. |
| D02 | Reter descartes versus apagar | Conversa: decisões terminam e não precisam ficar ativas; reunião 23/10: descartadas necessárias à avaliação. | Registrar no relatório/histórico do ciclo, sem mantê-las como pendências vigentes. Política de retenção por privacidade pendente. |
| D03 | Gate de aprovação pelo cliente | Conversa: cliente final fora do foco BETA e objetivos iniciais já valem; reunião 28/10: validação do cliente para reiniciar ciclo estratégico. | Não bloquear o **primeiro** ciclo operacional com aprovação de novas sugestões; discutir gate para *revisão estratégica posterior*. |
| D04 | Compartilhamento externo | Reunião 23/10 sugeriu links autorizados para todas as etapas; foco atual é agência. | Deixar fora da primeira vertical de UI; quando entrar, links assinados/expiráveis/escopo estrito, nunca públicos por padrão. |
| D05 | Integrações centralizadas | Reunião 28/10 deseja inventário global; arquitetura atual conecta recursos/tokens por cliente. | Centralizar **visão/gestão** sem centralizar credenciais quebrando OAuth por cliente. |
| D06 | Criação de tarefas a partir dos OKRs | Reunião 26/10 sugere desdobrar ações no Kanban; conversa posterior estabelece ciclo criado só com período/objetivos e sem vínculo obrigatório. | Não criar cards automaticamente na BETA inicial. É proposta futura, sujeita a aprovação explícita. |
| D07 | Critério de criticidade e lembretes | Reunião 23/10 prevê notificações e inércia; conversa: não interromper/atolar profissionais. | Diferenciar prioridade/urgência, oferecer visibilidade sem modal compulsório; ajustar cadência com teste de usabilidade. |
| D08 | Qualidade de imagem/vídeo | Reunião 26/10 identificou formatos/limitações. | Começar pelo formato suportado e evidenciar limitação de confiança; não prometer leitura de .ai/Canva sem prova técnica. |
| D09 | Formato da avaliação/aprendizagem | Reunião 28/10 quer dashboard de percentuais, conversa quer renderização de saída rica sem motor visual complexo. | Primeiro relatório estruturado com indicadores simples; não criar builder automático de dashboard. |
| D10 | Calendário/frequência estratégica | Reunião 28/10 cita período de seis meses em exemplo; conversa define OIDEA estratégico sem duração fixa. | Não criar período fixo/trigger periódico obrigatório. |
| D11 | Integrações Trello/Google Workspace | Reunião 28/10 marcou como 'precisa de mais conversa'. | Fora do núcleo BETA; não começar sem aprovação, desenho e segurança. |
| D12 | Estados de aprovação | Aceitar/descartar/expirar claros; editabilidade estratégica prevista; regra para justificar descarte e aceitação precisa ficar consistente. | Mockar estados de forma explícita; validar contrato final no Gateway antes de persistir. |

**Resolução:** registrar resultado e data no PR/issue, atualizar este arquivo nos três repositórios e somente então ajustar contratos. Não deixe o agente tomar decisão de negócio ambígua por conta própria.
