# Fonte de verdade do produto — ho.ko AI.nalytics V2

**Status:** baseline aprovada em 2026-11-09; decisões adicionais aprovadas em 2026-11-16
**Escopo:** produto, arquitetura de informação, design e responsabilidades de interface do frontend  
**Autoridade:** decisões validadas pelo responsável do produto prevalecem sobre atas automáticas, explorações de Figma, mocks e implementações legadas.

## 1. Controle de mudanças

Este documento é a fonte de verdade aprovada do produto. **Nenhum agente pode alterá-lo sem aprovação explícita e validação do responsável do produto.** Discussões, reuniões, sugestões, atas automáticas e implementações não atualizam este documento implicitamente.

Fluxo obrigatório para mudanças de produto, navegação, jornada ou design:

1. Inspecionar o produto e o código existentes.
2. Apresentar problema, intenção do usuário, alternativas, impactos e recomendação.
3. Discutir tecnicamente design, usabilidade, acessibilidade e coerência com a V2.
4. Obter aprovação explícita do responsável do produto.
5. Atualizar este documento e, depois, implementar a mudança aprovada.
6. Registrar dependências, mocks, contratos e riscos restantes.

Propostas ainda não aprovadas devem ser registradas em `docs/DECISIONS_OPEN.md`, sem modificar esta fonte de verdade.

## 2. Princípios do produto

- A agência é o usuário prioritário da BETA e trabalha com vários clientes.
- `account` representa a agência/tenant; `customer` representa o cliente atendido.
- A interface deve refletir as intenções e tarefas do usuário. O método OIDEA estrutura o produto, mas não deve virar obrigatoriamente itens `Observar`, `Interpretar`, `Decidir`, `Executar` e `Aprender` no menu.
- A V2 evolui a V1 incrementalmente e preserva autenticação, assinatura, RBAC, isolamento, integrações, métricas, documentos, análises, metas e Kanban funcionais.
- A IA propõe e fundamenta; a pessoa delibera. Proposta não equivale a decisão aprovada.
- Qualidade de uma entrega no Kanban é diferente de uma proposta de decisão do ciclo.
- Dados simulados devem ser identificados como mock. Nenhum resultado inventado pode parecer dado real.

## 3. Dois contextos de navegação

### Agência

Área que funciona sem cliente selecionado. Responde por saúde transversal, carteira, pessoas e configuração da conta.

### Área do cliente

Workspace contextual que usa exclusivamente o cliente selecionado pelo `SelectedCustomerProvider`. A seleção persiste entre as páginas contextuais e nunca cria outro tenant.

Sem cliente selecionado, a interface deve oferecer seleção e explicar que o workspace depende dela. Não escolher automaticamente um cliente e não usar IDs fixos.

O seletor de cliente é único e pertence à navegação da **Área do cliente** na sidebar. Ele permanece disponível no menu mobile e na sidebar recolhida. A topbar e a página Clientes & Integrações não renderizam um segundo seletor, evitando duplicidade e a interpretação incorreta de que o cliente é um filtro local da página atual.

## 4. Navegação aprovada

### Tratamento visual

A navegação lateral utiliza fundo azul-marinho ho.ko, com textos e ícones claros e estado ativo em azul de maior contraste. Sua densidade é compacta e a barra visual de rolagem permanece oculta, sem impedir rolagem por mouse, touchpad, toque ou teclado. O mesmo tratamento é aplicado ao menu mobile compartilhado. Topbar, conteúdo e superfícies principais permanecem claros; essa decisão altera o contraste e a densidade do menu, não sua arquitetura ou hierarquia.

```text
AGÊNCIA

Visão da agência
  Início

Administração
  Clientes & Integrações
  Equipe
  Configurações


ÁREA DO CLIENTE
  [Seletor de cliente]

Visão do cliente
  Visão Geral

Inteligência & Estratégia
  Base de Contexto
  Análises Estratégicas
  Planejamento Estratégico

Operação
  Ciclos Operacionais
  Central de Decisões
  Kanban

Resultados
  Aprendizagem & Histórico
```

Ativação entra pela gestão de Clientes & Integrações e não é item global permanente. Observar, Interpretar e Decidir são artefatos ou subvisões do processo. Aprovação, publicação e gate de qualidade não são itens independentes do menu nesta baseline.

## 5. Objetivo de cada área

### Início

Responde: **“Como está minha plataforma e minha operação?”**

É a página inicial após o login e apresenta saúde operacional transversal de forma breve e não intrusiva: clientes, conexões, documentos, ciclos, prazos e situações que merecem atenção. Pode tornar um problema de cliente perceptível sem exigir navegação cliente por cliente e encaminhar ao workspace correspondente. Não é uma fila de decisões nem um dashboard analítico completo.

### Clientes & Integrações

Administra a carteira e a prontidão dos clientes. É a entrada da Ativação, criação do cliente, responsáveis e conexões. A visão é global, mas credenciais e recursos permanecem isolados por cliente.

### Etapa 0 — Ativação

A Ativação é o onboarding e a contextualização inicial de cada cliente. Seu usuário prioritário na BETA é a agência. Ela organiza o que foi contratado, contexto, documentos críticos, fontes relevantes, pessoas e papéis funcionais, regras, restrições, riscos e objetivos humanos iniciais para que a inteligência comece com limites e direção conhecidos. Não é apenas cadastro ou upload, não produz diagnóstico profundo e não substitui a inteligência estratégica posterior.

A coleta é progressiva e retomável. Clientes e materiais já existentes devem ser reaproveitados quando forem válidos; a V2 não exige duplicar cliente, documento, conexão ou objetivo para iniciar a jornada. **Clientes legados permanecem no banco com seus status e informações atuais, sem conversão ou backfill automático.** O que é obrigatório depende do escopo e da etapa: não existe exigência universal de todas as integrações ou de um checklist documental idêntico para todos os clientes.

Na V2.0, a regra de cobrança extra continua baseada em clientes com `status = 'active'`. Um novo cliente em Ativação só passa a contar quando se tornar ativo. A nomenclatura técnica final e as transições desse novo estado ainda exigem contrato com o Gateway.

Para o primeiro teste interno com a agência ho.ko, as informações mínimas podem começar simples e ser ajustadas enquanto clientes ainda estão Em Ativação. Isso não define uma lista definitiva de documentos; os requisitos concretos devem ser validados antes do gate real. Um material processado pode atender a mais de um requisito.

Na V2.0 de teste interno, um cliente Em Ativação pode ser excluído definitivamente com seus dados e artefatos associados, sem política adicional de retenção. A exclusão deve ser específica para o cliente e a conta, cobrir armazenamento relacional e vetorial e não atingir clientes ativos ou legados. A implementação depende de contrato e recuperação de falhas entre os serviços.

A IA pode organizar entradas, classificar conteúdo e sinalizar lacunas, mas a autorização para avançar é humana. Percentual de preenchimento não substitui o gate qualitativo. A interface deve distinguir arquivo recebido, conteúdo processado, conteúdo contextualizado ou revisado, material adequado ao uso e requisito efetivamente atendido.

Papéis funcionais do cliente e do contrato — como decisor, ponto focal, aprovador e responsável — não equivalem automaticamente aos papéis de acesso `Admin` e `Equipe` do SaaS. Permissões da plataforma continuam determinadas pelo RBAC do backend.

A Ativação completa não se repete a cada ciclo operacional. Sua conclusão preserva objetivos iniciais vigentes e encaminha à primeira execução estratégica, reaproveitando o contexto informado. Propostas estratégicas posteriores são complementares e dependem de deliberação humana; a conclusão da Ativação não cria automaticamente um ciclo operacional.

### Equipe

Administra usuários e permissões conforme RBAC real. A expansão futura para capacidade, responsabilidades e desempenho precisa de desenho próprio e não pode reduzir qualidade ou contribuição a contagens simplistas.

### Configurações

Reúne conta, assinatura, segurança, ajuda e aspectos legais. A leitura do próprio perfil deve continuar disponível; funções administrativas dependem das permissões fornecidas pelo backend.

### Visão Geral

É a evolução contextual do Dashboard existente. Responde: **“Como está este cliente?”**

Mostra dados, sinais e andamento pertinentes ao cliente selecionado. Não representa indicadores gerais da agência nem comparação da carteira. O conteúdo definitivo será desenhado em entrega própria; a rota atual `/dashboard` e seu comportamento funcional devem ser preservados até essa evolução.

### Base de Contexto

É contextual ao cliente. Reúne documentos, briefing, regras, referências, validade e governança usados pela inteligência e pela operação. Participa da Ativação, mas continua acessível para manutenção pontual posterior. Não é gestão documental global da agência.

### Análises Estratégicas

Inicia e consulta inteligência estratégica de horizonte macro, independente do calendário de ciclos operacionais. O fluxo futuro é assíncrono e deve preservar saídas consultáveis e suas evidências.

### Planejamento Estratégico

Mantém objetivos vigentes, OKRs/KRs e direcionamentos estratégicos aprovados. Propostas ainda não deliberadas não se tornam objetivos automaticamente.

### Ciclos Operacionais

Organiza o período operacional do cliente e seus objetivos vigentes. A agência inicia o ciclo manualmente. A criação não exige cadastro de posts, peças ou campanhas; a produção pertence ao Kanban.

### Central de Decisões

Responde, dentro do cliente selecionado: **“O que precisa de atenção e deliberação neste cliente?”**

Reúne propostas pontuais do ciclo, sua relevância, fundamentos, vigência e deliberação humana. Propostas rotineiras pedem correções rápidas e **não atravessam ciclos**; direcionamentos estratégicos aprovados, como OKRs/KPIs, podem permanecer vigentes por mais de um ciclo. Não é lista genérica de tarefas administrativas, não substitui o Kanban e não se confunde com a verificação de qualidade de um card. O Início mantém a percepção transversal e encaminha para esta central contextual.

### Kanban

É a execução da agência: entregas, responsáveis, estágios e movimentação. A verificação de qualidade ocorre no contexto da entrega antes de transições pertinentes, preservando controle humano e tolerância a falhas da IA.

### Aprendizagem & Histórico

Consolida avaliações de ciclos encerrados, evidências, resultados, deliberações aceitas pertinentes e limites de inferência. Não afirma causalidade apenas por correlação temporal e não mantém decisões rotineiras antigas como pendências vigentes. Na V2.0, propostas descartadas são removidas sem histórico persistido de descarte; o formato final da avaliação será decidido após testes internos de produção da agência.

## 6. Limites de produto aprovados para a V2.0

- O primeiro ciclo operacional não depende de nova aprovação do cliente final sobre propostas estratégicas; eventual gate em revisões estratégicas posteriores exige desenho próprio.
- Não há links externos ou públicos de compartilhamento.
- A organização atual de Clientes & Integrações e Equipe permanece nesta versão. Uma reorganização estrutural dessas áreas será discutida como UX/UI da V2.1.
- Não há produção autônoma por agentes, criação automática de tarefas no Kanban a partir de OKRs ou escopo avançado de produção criativa por agentes.
- Sinais de relevância e urgência devem ser perceptíveis sem modal obrigatório nem bloqueio do trabalho. A cadência será ajustada em testes de usabilidade.
- A inteligência estratégica não recebe período ou frequência fixa obrigatória.
- Integrações Trello e Google Workspace ficam fora da V2.0.
- Para propostas rotineiras, os estados conceituais são **pendente**, **aceita** e **expirada**; descartar remove a proposta sem armazenar um estado/histórico de descarte. O contrato de persistência e os nomes técnicos serão definidos com o Gateway antes da integração.

## 7. Responsabilidade transversal sem Central global

A retirada da Central de Decisões do nível Agência não elimina a necessidade de perceber situações entre clientes. Essa responsabilidade pertence ao Início:

- mostrar que existe uma situação relevante;
- identificar o cliente e o contexto;
- indicar prioridade sem bloquear o trabalho;
- abrir a Central de Decisões ou o ciclo do cliente correspondente.

O Início oferece percepção e encaminhamento. A Central contextual oferece fundamento e deliberação.

## 8. Estado de implementação

- Rotas existentes preservadas: `/inicio`, `/dashboard`, `/alimentar-modelo`, `/analises`, `/metas`, `/kanban`, `/clientes`, `/equipe`, `/configuracoes`.
- Rotas visuais V2: `/ciclos`, `/decisoes`, `/aprendizagem`.
- `/dashboard` aparece como **Visão Geral** na Área do cliente.
- `/alimentar-modelo` aparece como **Base de Contexto** na Área do cliente.
- `/decisoes` é uma estrutura visual contextual e ainda não possui integração real.
- Ciclos, decisões e aprendizagem permanecem mocks explícitos até contratos e integrações aprovados.

## 9. Contratos futuros necessários

O frontend não inventa endpoints. Cada integração exige autenticação, autorização, isolamento por `account`/`customer`, request, response, estados e erros acordados com o Gateway.

Prioridades futuras relacionadas a esta navegação:

- resumo transversal de saúde e atenção para o Início;
- visão contextual do cliente;
- ciclos operacionais;
- propostas e deliberações por cliente/ciclo;
- avaliação e histórico de ciclos.

Nenhum browser chama n8n ou FastAPI diretamente para novos fluxos V2 sem contrato existente e justificativa aprovada.

