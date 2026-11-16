# Etapa 0 — plano de execução entre Frontend, Gateway, PostgreSQL, n8n e Analyze

**Estado:** plano executável em andamento; nenhum item documental equivale a migration aplicada ou API implantada. Governança comum proposta em `PLATFORM_GOVERNANCE_DRAFT.md`. Estrutura atual do banco: `D:\hoko\Hoko-Backend\schema.sql`. Experiência visual: `ACTIVATION_FRONTEND_EXECUTION_PLAN.md`. Evidência histórica de n8n: `references/activation/2026-11-16-pacote/README.md`. Hipótese operacional A05: `ACTIVATION_N8N_ASSUMED_CONTRACT.md`.

## Resultado esperado

O Admin cria um registro básico que permanece **Em Ativação** por dias ou semanas, reúne documentos/atas/textos e conecta fontes, vê cobertura dos mínimos definidos pelo sistema, solicita avaliação geral somente após processamento e cobertura, atende solicitações ou autoriza mesmo com limitações, e então libera o cliente para a primeira análise estratégica. A autorização não cria ciclo operacional. Equipe não opera cliente em Ativação na BETA. Atribuição de equipe não bloqueia a Ativação, mas deve ser resolvida antes do primeiro ciclo operacional.

## Entregas integradas e ordem de construção

Cada entrega termina com uma jornada testável, não com uma camada isolada. O frontend não antecipa chamadas a endpoints ainda inexistentes. **O mesmo agente executa o trabalho nos repositórios Frontend, Gateway, Analyze e n8n durante a V2**; os handoffs são contratos técnicos entre serviços, não repasses de responsabilidade. A lista detalhada abaixo é o checklist de execução, e o registro ao fim deste documento informa o que de fato foi entregue.

| Entrega | Resultado verificável | Construção conjunta | Saída para a próxima |
|---|---|---|---|
| **E0 — contrato 0B** | Contrato de cadastro, listagem, retomada, RBAC, cobrança e isolamento suficientemente preciso para implementar | Inventário do código e `schema.sql`; handoff `ACTIVATION_0B_GATEWAY_HANDOFF.md`; mapa das mudanças frontend | Gateway/DB pode preparar a primeira migration e a rota, sem depender de n8n |
| **E1 — cliente Em Ativação durável** | Admin cria e retoma cliente real na lista atual; Equipe não opera Ativação; legados, workspace e cobrança preservados | Migration aditiva + Gateway + frontend conectado; retirar linhas mockadas da lista de produção | Cliente e `activation_id` reais para receber materiais |
| **E2 — materiais e cobertura** | Arquivo/ata/texto chega, processa, cobre um ou mais mínimos e aparece com estado persistido; OAuth existente funciona para o cliente autorizado da Ativação | Gateway/DB + adaptação de `ATV-ENT-ARQUIVO`/Analyze + UI; verificação por material e erro/retry | Mínimos cobertos para pedir avaliação geral |
| **E3 — avaliação e autorização** | Admin solicita, sai e volta, lê parecer, complementa ou autoriza com limitações; cliente passa a ativo sem criar ciclo | Execução n8n assíncrona + Gateway/DB + UI; usar hipótese A05 e conferir nodes na integração | Primeira análise estratégica pode ser iniciada manualmente |
| **E4 — exclusão e homologação** | Cliente Em Ativação é removido com artefatos relacionados; fluxos V1 e isolamento continuam funcionando | Limpeza PostgreSQL/OAuth/n8n/Pinecone, regressão e retirada dos mocks restantes | Etapa 0 integrada para teste interno da agência |

- [x] E0 — contrato 0B e correção do formulário atual concluídos; nenhuma API de Ativação foi chamada.
- [ ] E1 — cliente Em Ativação durável e UI conectada; Gateway validado por HTTP, revisão no navegador pendente.
- [ ] E2 — materiais e cobertura reais.
- [ ] E3 — avaliação e autorização reais.
- [ ] E4 — exclusão e homologação.

**Regra de schema:** o agente único prepara a migration no Backend. A autorização prévia para o banco foi **somente leitura**; a execução de DDL exige autorização específica do responsável. Depois de uma migration autorizada e aplicada, o agente registra a execução, extrai `schema.sql` do catálogo, compara o diff e entrega migration + snapshot atualizado juntos. Não escrever estruturas futuras no snapshot. Se nenhuma migration foi executada, declarar isso e não modificar `schema.sql`.

## Decisões já alinhadas e pontos ainda dependentes

- **Alinhado:** Admin conduz Ativação; cliente pode ser iniciado antes de contrato; cadastro curto; mínimo é definido pelo sistema; automação classifica cada material, que pode cobrir vários mínimos; indicação manual exige material processado e será conferida; conexões não bloqueiam universalmente; avaliação geral assíncrona; Admin pode autorizar apesar de exigência da IA, sem justificativa obrigatória; cliente ativo pode iniciar análise estratégica manualmente.
- **Aprovado para 0B:** clientes legados conservam seus status e informações, sem backfill; cobrança extra continua contando somente `customer.status = 'active'`. Novo cliente Em Ativação só entra na contagem quando for ativo.
- **Direção aprovada para teste interno:** começar com informações básicas ajustáveis para clientes ainda Em Ativação; excluir definitivamente cliente Em Ativação e seus artefatos, sem retenção adicional na V2.0. O modelo concreto está proposto em `ACTIVATION_INITIAL_MODEL_DRAFT.md`; ele ainda exige contrato técnico.
- **Modelo inicial adotado para 0B:** `activating` e `activation:manage` para Admin, com estado de avaliação separado, conforme A03 e `ACTIVATION_0B_GATEWAY_HANDOFF.md`. O Gateway valida o encaixe técnico antes da migration. Para 0C, os assuntos mínimos e a classificação serão ajustados na própria entrega; para 0E, a coordenação e recuperação da exclusão. Não inventar valores em DDL ou API como se já existissem.
- **A05 resolvida para planejamento:** o pacote recebido em 2026-11-16 documenta os três workflows e testes parciais. A lista vazia de `ATV-IA-DOCUMENTOS` é saída válida da execução mostrada. O modelo de integração assumido está em `ACTIVATION_N8N_ASSUMED_CONTRACT.md`: mínimos definidos pelo sistema, classificação de cobertura por material, sugestões extras contextuais, parecer de prontidão e autorização humana persistida no Gateway. Exports JSON e verificação dos nodes são tarefas da integração, não pré-condições do plano.

## Fatias executáveis e checkboxes

### 0A. Baseline e segurança da mudança

- [x] Inventariar o schema do snapshot e localizar tabelas centrais/candidatas de investigação (`SCHEMA_USAGE_AUDIT_2026-11-16.md`; análise estática).
- [x] Preservar e indexar o pacote documental/técnico de Ativação de 2026-11-16, distinguindo simulações, diagrama e testes (`references/activation/2026-11-16-pacote/README.md`).
- [x] Fechar A05 para planejamento com responsabilidades, sequência, envelopes, estados de falha e testes assumidos (`ACTIVATION_N8N_ASSUMED_CONTRACT.md`).
- [ ] Gateway/DB: reconciliar `schema.sql` com o catálogo atual, mapear scripts aplicados, registrar contagens/dependências sem extrair conteúdo privado e confirmar backup/restauração.
- [ ] Gateway/DB: versionar o `schema.sql` hoje não rastreado no repositório Backend, depois de conferir o snapshot; não incluir dados nem segredos.
- [x] Responsável do produto: manter status/informações dos clientes legados e cobrança extra apenas dos clientes ativos (decisão de 2026-11-16).
- [x] Responsável do produto: aprovar início com informações básicas ajustáveis e exclusão definitiva controlada de cliente Em Ativação no teste interno.
- [x] Responsável do produto: adotar o modelo inicial de A03 para planejamento 0B (`activating`, `activation:manage`, avaliação separada).
- [x] Gateway/DB: validar encaixe técnico de status e permissão no catálogo antes da primeira migration; mínimos de teste serão fechados em 0C.
- [x] Responsável autorizou explicitamente em 2026-11-16 a aplicação da migration 0B e revogou a restrição anterior de somente leitura ao banco.

### 0B. Registro durável e listagem

- [x] Gateway/DB: preparar e aplicar migration **aditiva** para estado Em Ativação e vínculo durável à conta/cliente. Clientes legados mantiveram seus status: 9 ativos antes e depois, sem backfill; nenhum cliente Em Ativação foi criado pela migration. A cobrança extra segue baseada apenas em `customer.status = 'active'` no código existente.
- [x] Gateway: cadastro, listagem e detalhe de Ativação reais; autorização por permissão e conta; bloqueio nas rotas operacionais verificadas. Teste HTTP com Admin, Equipe e segunda conta executado em 2026-11-16.
- [x] Frontend em código: linhas de produção passam a vir da API real; cliente Em Ativação é excluído do `SelectedCustomerProvider`, mantendo as chaves legadas. **Revisão no navegador pendente** conforme preferência do responsável de não compilar agora.
- [ ] Teste conjunto: criação, listagem, retomada, RBAC e tenant passaram no Gateway local; falta conferir interface, fluxos legados e efeito de cobrança no percurso integrado.

### 0C. Materiais, mínimos e cobertura

- [ ] DB/Gateway: modelar o conjunto inicial ajustável de informações mínimas, material recebido/processado/falho, referência documental/RAG e cobertura identificada ou indicada manualmente. Definir chaves, FKs, unicidade e trilha de processamento antes do DDL. Registrar revisão do conjunto sem congelar os requisitos de cada cliente Em Ativação no teste interno. Não guardar conteúdo/segredos no registro de cobertura.
- [ ] Gateway: contrato para entrada de arquivo/ata/texto, consulta de acervo/cobertura e indicação manual vinculada a material processado, sempre com tenant/RBAC e estados explícitos.
- [ ] n8n/Analyze: conferir os nodes locais e adaptar os três workflows ao contrato assumido; preservar proveniência `id_documento`, checksum, versão e referência do trecho. Gateway recebe resultado/callback idempotente e guarda estado relacional; Pinecone não é fonte única de cobertura.
- [ ] Frontend: conectar Material e Visão geral aos contratos reais, retirar os mocks correspondentes e mostrar falha/reprocessamento sem porcentagem fictícia.

### 0D. Avaliação geral e autorização

- [ ] DB/Gateway: modelar execução assíncrona, parecer, solicitações, rodadas e transição de autorização com autor/data; sem exigir campo de justificativa nem cadastro separado de ressalvas.
- [ ] Gateway ↔ n8n: início autenticado, resposta imediata com identificador, consulta de status, callback seguro, idempotência e reconciliação após falhas/timeout. Nenhum webhook/segredo no navegador.
- [ ] Gateway: só permitir solicitar avaliação quando os mínimos estiverem cobertos por material processado ou indicação manual válida. A IA confere as indicações; o Admin mantém decisão final. Autorizar não inicia automaticamente OIDEA/ciclo.
- [ ] Frontend: ligar Avaliação e confirmação ao Gateway, permitir sair e retornar dias depois, manter parecer e solicitações legíveis, remover simulações locais.
- [ ] Teste conjunto: pendência, processamento, falha, solicitação extra, complementação, reavaliação, autorização com limitação e tentativa sem permissão.

### 0E. Descarte, regressão e liberação

- [ ] Gateway/DB + n8n/Analyze: especificar exclusão definitiva e controlada de **um cliente Em Ativação** e todos os seus registros relacionais, conexões OAuth, trabalhos pendentes e vetores Pinecone; testar escopo por conta/cliente, falha parcial e reexecução segura. Sem retenção adicional nesta versão de teste. Não reutilizar a desativação V1 como se ela já fizesse essa limpeza.
- [ ] Verificar autenticação, assinatura/Stripe, RBAC, isolamento de conta, integrações, documentos, análises, metas e Kanban existentes.
- [ ] Atualizar `schema.sql` **a partir do banco após aplicar migrations aprovadas** e anexar registro de aplicação; não antecipar tabelas propostas no snapshot.
- [ ] Homologar a jornada ponta a ponta e aprovar retirada dos mocks. Só então considerar Etapa 0 integrada.

## Contrato mínimo a fechar antes da primeira migration

O handoff Gateway/Front deve fixar: endpoints e verbos de criar/listar/detalhar cliente Em Ativação; payloads e erros; status e transições; autorização por permissão e conta; regra de visibilidade no workspace; faturamento; identificadores e versionamento dos mínimos; estado do material e referência RAG; execução/consulta da avaliação; autorização humana; descarte. Os caminhos em `CONTRACTS_HANDOFF.md` são candidatos, não endpoints existentes.

## Registro de entregas

| Entrega | Feito | Migration executada | `schema.sql` | Próximo passo e responsável |
|---|---|---|---|---|
| **E0 — 2026-11-16** | Plano integrado e `ACTIVATION_0B_GATEWAY_HANDOFF.md`; correção do cadastro V1 em `create-customer-flow.tsx` para exigir e-mail, enviar `company`/`phone` e ler o ID retornado | **Nenhuma** | **Não alterado** | Agente único: reconciliar catálogo vivo, preparar migration/rotas 0B e integrar o frontend ao contrato real. Aplicar DDL somente após autorização específica; então atualizar `schema.sql`. |
| **E1, preparação — 2026-11-16** | Migration aditiva preparada no Backend; cadastro, listagem, detalhe, RBAC e barreiras iniciais de status no Gateway; lista e detalhe básico reais preparados no Frontend. A lista não mistura mais os clientes mockados. A listagem mantém fallback de leitura enquanto a tabela nova não existir; o cadastro retorna indisponível em vez de criar cliente ativo. Consulta **somente leitura** confirmou no catálogo `customer.status` como texto com default `active`, `pgcrypto` e índice único de permissões presentes, sem tabela nem permissão de Ativação. Ainda **não é uma entrega integrada**. | **Nenhuma** | **Não alterado**; snapshot preexistente ainda não rastreado no Backend | Aplicar migration somente com autorização específica para escrita no banco; então gerar `schema.sql` do catálogo real e validar criação, RBAC, isolamento, cobrança e fluxos legados antes de marcar E1. O cliente `psql` local foi usado fora do sandbox para a consulta autorizada. |
| **E1, banco — 2026-11-16** | Migration aplicada em transação: tabela `customer_activation`, permissão `activation:manage` e vínculo aos 5 papéis Admin existentes; 0 concessões a outros papéis. 9 clientes ativos antes/depois. Inserção de teste com `ROLLBACK`: vínculo criado e 0 linhas fictícias persistidas. Lista agregada SQL consultada com sucesso. | **`migration_activation_0b.sql` aplicada** | **Regenerado do catálogo real** via `pg_dump --schema-only`, sem dados, owners ou grants; contém a nova tabela, unicidade e FK | Validar endpoints por HTTP com Admin/Equipe e contas diferentes quando o Backend estiver executável; conferir fluxo da UI e regressões antes de marcar E1 concluída. Não iniciar E2 como integrada sem essa verificação. |
| **E1, HTTP — 2026-11-16** | Gateway local iniciou em `:4000` com banco conectado. Cliente sintético criado com `201/activating` e `id_activation`; Admin listou e retomou (`200`), Equipe recebeu `403` na criação/detalhe e não viu o cliente na lista, segunda conta recebeu `404`, detalhe operacional recebeu `404` e Kanban não listou o cliente. Remoção controlada confirmou 0 linhas de cliente e Ativação restantes. | **Nenhuma nova** | **Sem nova alteração** | Agente único: revisar a UI no navegador e os fluxos legados; depois marcar E1 concluída ou corrigir regressões. Nenhuma ação de banco é necessária para esse teste. |

Ao concluir E1–E4, acrescentar uma linha com arquivos alterados, comportamento observado, testes, migration aplicada ou não, estado de `schema.sql`, pontos ainda mockados, riscos e a próxima ação humana necessária. Não marcar checkbox de implementação com base apenas no plano.

## Limites desta entrega documental

Na E0, nenhum SQL foi escrito ou executado no Backend, nenhum banco foi alterado e nenhum workflow n8n foi conectado. O mesmo agente usará este plano para executar as fatias seguintes em seus repositórios, observando os limites de autorização para o banco.
