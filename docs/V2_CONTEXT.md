# ho.ko AI.nalytics V2 — Contexto compartilhado do produto

**Edição:** 2026-11-09 · **Escopo:** BETA incremental · **Fonte:** decisões desta conversa, reuniões de 21/23/26/28-10 e 04-11, e leitura dos três repositórios recebidos. **Este documento é intenção de produto, não prova de código implementado.** Decisões aprovadas de produto e navegação estão em `docs/PRODUCT_SOURCE_OF_TRUTH.md`, que prevalece em caso de divergência.

## 1. Visão de produto

A ho.ko AI.nalytics evolui de uma plataforma que reúne clientes, integrações, dashboards, análises pontuais, metas e Kanban para uma **plataforma de gestão de estratégia e inteligência para agências**, que acompanha também a operação. O cliente final não é o usuário prioritário da BETA; a agência controla a rotina. A V2 **aproveita** login, contas/agências, cadastro de clientes, integrações/OAuth, métricas, banco PostgreSQL, documentos/RAG/Pinecone, análises e metas, Kanban e estrutura de UI já existentes. **Não reescrever a V1 do zero.**

## 2. Metodologia OIDEA — regra essencial

- **Observar:** extrair registros/fatos verificáveis dos insumos disponíveis, com fonte, período e referências. Não inferir causa, avaliar qualidade, prescrever nem comparar como conclusão durante a etapa de observação.
- **Interpretar:** relacionar fatos ao contexto, objetivos, regras e histórico; explicitar hipóteses, limitações e grau de suporte. **Correlação temporal não demonstra causalidade.**
- **Decidir:** gerar propostas justificadas. A IA propõe; **a agência delibera**. Proposta não equivale a decisão aprovada.
- **Executar:** trabalho da agência / Kanban e ações no negócio, não um agente que substitui o humano.
- **Aprender/Avaliar:** consolidar evidências, interpretações, decisões humanas, justificativas e resultados ao encerrar um ciclo. Se faltam dados para provar execução/impacto, declarar isso; não inventar efeitos.

O método não deve virar obrigatoriamente cinco telas no menu. **Separar artefatos metodológicos de jornadas do usuário.**

## 3. Dois contextos de inteligência

### Estratégico (macro, independente do calendário operacional)

Execução OIDEA iniciada depois da Ativação ou quando necessária, sem período estratégico fixo; pode durar horas ou dias. Observação, Interpretação e Decisões geram **saídas independentes consultáveis**. O formato da avaliação integrada será discutido após testes iniciais de produção interna da agência, com saídas reais. Decisões estratégicas sugeridas podem complementar ou revisar objetivos iniciais. A agência pode editar e aceitar/recusar propostas. Objetivos aprovados permanecem vigentes entre vários ciclos operacionais; podem usar SMART + OKRs, até três KRs, responsáveis, prazos e custos quando aplicáveis. Não exigir aceite das propostas novas para preservar objetivos já definidos na Ativação.

### Rotineiro / operacional (limitado ao ciclo)

A agência **inicia manualmente** cada ciclo: cliente, nome/período (referência de quatro semanas) e visualização dos **objetivos vigentes**. **Não obrigar quantidade de posts/pautas/campanhas na criação do ciclo.** O planejamento de entregas ocorre no Kanban. O ciclo considera os objetivos e regras do cliente, dados de plataformas, contexto estratégico pertinente e a avaliação do ciclo anterior quando disponível.

Observação e interpretação rotineiras podem ser diárias sem gerar uma decisão todo dia. Apenas quando necessário a inteligência propõe ação **pontual/rápida dentro do próprio ciclo**, classificando relevância e urgência sem interromper ou bloquear o usuário. A agência percebe situações relevantes **entre clientes** no Início, abre o workspace do cliente e delibera na Central de Decisões contextual ou no detalhe do ciclo. **Não exigir vínculo técnico a card/campanha/publicação.** Decisões rotineiras não atravessam ciclos; direcionamentos estratégicos aprovados, como OKR/KPI, podem permanecer vigentes. Na V2.0, descartar uma proposta a remove sem persistir histórico de descarte. Evidências e deliberações aceitas pertinentes ao ciclo podem fundamentar a aprendizagem.

### Verificação de qualidade da entrega (dentro do Kanban)

Pauta, arte, legenda e outras entregas passam por verificação **contextual antes da transição para o próximo responsável**. A IA usa documentação, regras de governança, restrições, público/nicho, objetivos vigentes pertinentes. Aponta correções críticas ou opcionais; humano avalia e decide como prosseguir. **Isso NÃO é a mesma coisa que uma decisão global do ciclo.** Nunca colocar automaticamente proposta global no Kanban. Considerar limitações técnicas em análise de imagens/vídeos e falso positivo; não bloquear indefinidamente uma entrega por erro da IA.

## 4. Jornada de produto da BETA

1. Agência cria/seleciona cliente e conclui **Ativação** (briefing, documentos críticos, governança, responsáveis, objetivos iniciais, integrações), com gate de prontidão.
2. Ativação concluída disponibiliza o **OIDEA estratégico inicial**, aproveitando tudo o que já foi informado (sem repetir onboarding). Objetivos iniciais continuam válidos; propostas estratégicas são um adicional sujeito a deliberação.
3. Agência **cria e inicia** manualmente o ciclo operacional com período e objetivos vigentes (sem planejar produção nesta etapa).
4. Agência executa o Kanban, com gate de qualidade nas transições; OIDEA rotineiro acompanha resultados e sinais no período.
5. Situações relevantes aparecem no **Início transversal da agência**, e o profissional abre a Central de Decisões ou o ciclo do cliente para consultar fundamentos e deliberar. Nenhuma notificação deve bloquear o trabalho normal.
6. Encerramento do ciclo produz **avaliação/aprendizagem** com evidências, entregas, métricas, deliberações aceitas pertinentes, alcance dos objetivos e limites de evidência. O formato definitivo será decidido após testes internos; propostas descartadas não são retidas na V2.0.
7. A avaliação alimenta o próximo ciclo e pode ser insumo de futura análise estratégica, **sem obrigar rodar uma análise macro em todo encerramento**.

## 5. Distribuição de responsabilidades de interface

- **Início / agência:** saúde operacional e percepção transversal, com encaminhamento para o cliente correspondente sem deliberar fora de contexto.
- **Clientes / Ativação:** onboarding e prontidão dos dados; integrações e documentos.
- **Visão geral / cliente:** evolução do Dashboard atual, com dados, sinais e andamento do cliente selecionado.
- **Base de contexto / cliente:** documentos, regras, referências, validade e governança do cliente selecionado.
- **Análises estratégicas:** executar/acompanhar OIDEA assíncrono e consultar saídas independentes e relatório integrado.
- **Planejamento estratégico:** objetivos de Ativação e diretrizes aceitas da IA, metas/KRs editáveis e histórico de decisões.
- **Ciclos operacionais:** iniciar e acompanhar período, objetivos e OIDEA rotineiro.
- **Central de decisões / cliente:** propostas pontuais do ciclo, fundamentos, vigência e deliberação contextual.
- **Kanban:** produção, responsáveis, movimentação, revisão de qualidade no próprio card.
- **Aprendizagem / cliente:** avaliação consolidada e histórico de ciclos encerrados.

## 6. Estratégia de desenvolvimento acordada

**UI primeiro, integração vertical depois:** preservar o Next existente, construir telas visuais V2 com mocks isolados e tipados, documentar contrato em handoff, adaptar o Gateway apenas quando a tela necessitar de API real, integrar os workflows n8n e serviços Python, testar ponta a ponta e retirar mocks da produção. Criar módulos pequenos/entregas verificáveis; não iniciar migração geral de infraestrutura ou reconstrução completa dos três backends.

**Padrão visual:** minimalista corporativo, Montserrat, azul-marinho/cobalto/branco/cinza claro, sem estilo Bootstrap. O Figma anterior é referência de exploração, não contrato técnico definitivo; valide com o desenho mais recente da equipe.

## 7. Estado do n8n (histórico informado; exports JSON ainda não recebidos)

**Construídos/testados com simulações:** `ATV-ENT-ARQUIVO | Entrada de Arquivos`; `ATV-IA-DOCUMENTOS | Definir Documentos Obrigatórios`; `ATV-CTL-ATIVACAO | Controle da Ativação`; `OBS-IA-OBSERVAR | Observação de Fonte` e `TESTE-OBS | Observação`. O workflow OBS normaliza fonte/referências, chama modelo para extrair observações atômicas, organiza/valida referências e emite observações. Cenários testados: fatos de posts, períodos distintos sem comparação indevida, causalidade não inventada e separação de opinião/fato.

**Não confirmado como implementado/testado:** integrações reais de fontes em todos esses workflows, orquestrador OIDEA completo, Interpretação, Decisão, acompanhamento diário, gate de qualidade, aprendizagem de ciclos, contratos de callbacks. Para planejar a integração da Ativação, usar o modelo assumido em `docs/ACTIVATION_N8N_ASSUMED_CONTRACT.md`; conferir nodes e payloads atuais durante a implementação. O n8n é um projeto/serviço externo aos três ZIPs.

Em 2026-11-16 foi recebido um pacote de documentação, diagrama e testes parciais de Ativação, preservado em `docs/references/activation/2026-11-16-pacote/`. Ele não inclui os exports JSON nativos. A lista vazia do teste bruto de documentos adicionais é uma resposta válida daquela execução; o resumo relata outra saída com cinco itens, cuja execução não consta no arquivo. Não usar o pacote como comprovação de integração ponta a ponta.

## 8. Regras operacionais para todos os agentes

- Investigar o código antes de tocar: `git status`, estrutura, rotas, schemas e testes. Não presumir que algo existe porque está no Figma ou neste documento.
- Não quebrar autenticação, isolamento entre `account`/`customer`, integração OAuth por cliente, cobrança Stripe ou páginas legadas; mudanças de contrato são coordenadas.
- `account` é o tenant/agência; `customer` é o cliente atendido. Nunca confiar em `id_customer` vindo do browser ou do n8n sem autorização.
- O Gateway é a entrada de confiança para autenticação, autorização e persistência operacional. FastAPI não recebe autorização automaticamente porque Gateway chamou; proteger chamadas internas/callbacks.
- Não enviar tokens OAuth, dados confidenciais e segredos ao prompt sem política de minimização. Usar Secrets/env, observabilidade sem conteúdo sensível.
- Dados simulados devem ficar claramente marcados e substituíveis; nunca aparentar resultados reais de IA ou métricas quando mockados.
- Entregar um incremento funcional por vez com mudança, arquivos, teste, risco, dependência e handoff aos outros agentes.
