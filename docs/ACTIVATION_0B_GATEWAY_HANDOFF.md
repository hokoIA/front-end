# Handoff Gateway e banco — 0B cliente Em Ativação durável

**Revisão:** 0.1.2 · **Estado:** contrato implementado em código, migration aplicada e Gateway validado por HTTP no banco interno em 2026-11-16; revisão do frontend no navegador ainda pendente. **Destino técnico:** `D:\hoko\Hoko-Backend`, implementado pelo mesmo agente que executa a V2 nos demais repositórios. Fonte estrutural: `D:\hoko\Hoko-Backend\schema.sql` regenerado do catálogo após o DDL. Produto: `PRODUCT_SOURCE_OF_TRUTH.md`; sequência: `ACTIVATION_CROSS_STACK_PLAN.md`.

**Estado do checkout em 2026-11-16:** a migration `scripts/migration_activation_0b.sql` foi aplicada com autorização explícita no banco interno configurado no Backend. `schema.sql` foi regenerado do catálogo após a aplicação. O frontend já contém o client e a lista para esse contrato. Com as dependências instaladas pelo responsável, o Gateway local respondeu aos testes HTTP de criação, listagem, detalhe, RBAC e isolamento entre contas. Um cliente sintético foi removido ao fim; 0 linhas fictícias restaram. **A E1 segue pendente da revisão visual e de regressão no navegador.**

## Resultado da 0B

Um Admin da conta cria um cliente com cadastro curto, recebe um registro `activating` e consegue encontrá-lo novamente na lista **Clientes & Integrações** e abrir seu detalhe básico dias depois. Esse cliente não entra no workspace operacional nem na contagem de clientes extras. Nenhum cliente legado muda de status ou informação. Esta entrega ainda não envia materiais, avalia prontidão, autoriza o cliente ou exclui seus artefatos.

## Evidência da baseline anterior à E1

- `customer.status` é `text NOT NULL DEFAULT 'active'` no snapshot. `customer.id_user` determina a `account` por `user.id_account`; não há tabela de Ativação.
- `POST /customer/add` usa `customers:manage`, chama `createCustomer` sem status explícito e retorna `{ success, message, customer }`. Na criação de conta, a Equipe também recebe `customers:manage`.
- `GET /customer/list` já devolve `status` e integrações por cliente, filtrando por conta; atualmente não distingue quem pode ver clientes Em Ativação.
- `GET /customer/get/:id_customer` usa leitura ampla de `customer`; não reaproveitar esse payload para o detalhe de Ativação porque a tabela contém campos de credencial/`agent_data`.
- `stripeService.js` conta somente `status='active'`. O frontend usa `/customer/list` no `SelectedCustomerProvider` e ainda não exclui `activating`.
- Antes da E0, o formulário frontend enviava `empresa` e `telefone`, enquanto o controller lê `company` e `phone`; também aceitava e-mail vazio, embora o controller exija `name` e `email`. **A E0 corrigiu esses campos, a validação e a leitura do ID criado.** A transição para `activating` ainda depende do Gateway.

## Migration aditiva aplicada no banco interno

1. Conferir `schema.sql` contra o catálogo real e registrar migrations já aplicadas. Não extrair conteúdo privado; não remover tabela nesta entrega.
2. Criar tabela `customer_activation` com `id_activation UUID` como chave, `id_customer INTEGER NOT NULL UNIQUE` referenciando `customer(id_customer)` e timestamps. Um registro de Ativação por novo cliente; nenhum backfill para legados. O vínculo à conta é verificado por `customer.id_user → user.id_account`, sem copiar `id_account` para outra tabela nesta fatia.
3. Inserir permissão `activation:manage` no RBAC existente e concedê-la aos papéis Admin **das contas atuais**. Garantir concessão aos Admins de contas futuras. Não concedê-la à Equipe por padrão.
4. Manter `customer.status` como texto e os valores legados intactos. O Gateway passa a inserir explicitamente `status='activating'` para o novo fluxo. Manter o default `active` nesta migration aditiva para evitar mudança silenciosa em consumidores ainda não migrados; a rota pública de criação deve ser alterada de forma coordenada para não contornar o novo fluxo.
5. **Executado em 2026-11-16:** migration aplicada no banco interno com `BEGIN`/`COMMIT`; `schema.sql` extraído do catálogo **depois da aplicação**. O snapshot contém apenas estrutura. Migration e snapshot estão no checkout do Backend, ainda sem commit nesta sessão.

Não incluir ainda tabelas de mínimos, materiais, avaliação ou parecer: pertencem às entregas E2/E3. A tabela de Ativação precisa apenas de identidade durável para retomada e futuros vínculos.

## Contrato HTTP implementado e validado no Gateway local para 0B

| Operação | Contrato no checkout | Acesso e efeito |
|---|---|---|
| Criar | Adaptar `POST /customer/add`; request `{ name, email, company?, phone? }`. Response `201` mantém `{ success: true, customer }` e acrescenta `activation: { id_activation }`; `customer.status='activating'`. | `activation:manage`; inserção de `customer` + `customer_activation` na **mesma transação**. Não criar um cliente ativo pela rota antiga. |
| Listar | Reutilizar `GET /customer/list`; manter `{ success: true, customers: [...] }`. Cada linha mantém campos atuais e `status`; para `activating`, acrescentar `id_activation` ou identificador equivalente. | Filtrar por `account`. Admin com `activation:manage` vê clientes Em Ativação; Equipe sem essa permissão continua vendo apenas os clientes legados permitidos. Não devolver tokens. |
| Retomar | Criar `GET /customer/activation/:id_customer`; response `{ success: true, customer: { id_customer, name, email, company, phone, status, created_at }, activation: { id_activation, created_at } }`. | `activation:manage` + tenant + `status='activating'`; resposta mínima sem campos de credencial. Retornar `404` para cliente de outra conta ou sem Ativação. |
| Editar cadastro básico | Reutilizar `PUT /customer/edit/:id_customer` com `{ name, email, company?, phone? }`, mas aplicar `activation:manage` quando o alvo estiver `activating`. | Preservar `customers:manage` para o comportamento legado de clientes ativos/inativos. Não permitir que Equipe edite Ativação por essa rota. |

IDs e nomes de campos existentes foram preservados onde possível. A rota nova escolhida no código é `GET /customer/activation/:id_customer`, usada pelo client frontend. O teste HTTP confirmou `201` na criação, `200` na lista/detalhe do Admin, `403` para Equipe e `404` entre contas e no detalhe operacional de cliente Em Ativação. Ausência de sessão, entrada inválida e falhas técnicas continuam exigindo revisão específica de respostas e mensagens. Não inventar regra de unicidade por e-mail sem decisão de produto.

## Barreiras que devem entrar na mesma entrega

- O registro `activating` só pode ser criado pelo fluxo autorizado. A rota `/customer/add` atual não pode continuar criando `active` para usuários com apenas `customers:manage`.
- `GET /customer/get`, edição, desativação e rotas de operação existentes precisam de verificação de status no Gateway. Clientes `activating` não podem ser consumidos por dashboard, análises, metas, ciclos ou Kanban por adivinhação de ID. O seletor da UI é apenas uma barreira visual.
- A conexão OAuth de cliente Em Ativação será habilitada com guard de Admin/tenant na entrega de materiais/conexões; até lá, impedir que Equipe a acione pelos endpoints existentes. Não alterar os fluxos OAuth dos clientes ativos.
- Não usar `DELETE /customer/delete/:id_customer` como exclusão da Ativação: hoje é desativação. A exclusão coordenada fica para E4.
- Criar `activating` não altera a quantidade faturável. Na futura transição para `active`, E3 deverá sincronizar a cobrança conforme a regra existente.

## Frontend acoplado ao contrato, após Gateway

- `features/customers/components/create-customer-flow.tsx`: nome/e-mail, `company`/`phone` e ID de resposta foram alinhados ao Gateway na E0. Após 0B, ajustar a mensagem de sucesso para Ativação e encaminhar ao detalhe real.
- `features/customers/views/customers-hub-view.tsx`, `customer-list.tsx` e `features/activation/`: substituir linhas mockadas na lista de produção por linhas `status='activating'` reais; manter busca/filtros e indicação de estado sem misturar dados simulados. Não consultar resumos de integração operacional para clientes Em Ativação nesta fatia.
- `app/(app)/clientes/ativacao/[customerId]/page.tsx`: usar detalhe real. Áreas de materiais/avaliação ainda sem API devem mostrar indisponibilidade honesta, não cenários fictícios para um ID real.
- `components/providers/selected-customer-provider.tsx`: excluir explicitamente `activating` da seleção, preservando as chaves de storage e o comportamento dos registros legados. O backend continua responsável pela autorização.
- `features/customers/utils/customer-fields.ts` e tipos: reconhecer `activating` sem convertê-lo em `unknown`/`active`; `isCustomerActive` hoje aceita `unknown`, portanto a exclusão de `activating` deve ser explícita.
- RBAC visual baseado em `useRbacMeQuery`/permissões devolvidas pelo Gateway; o papel exibido não substitui a permissão.

## Aceite conjunto de E1

- [ ] Criar com Admin retorna `activating` e `id_activation` durável; recarregar e retomar mostra o mesmo cliente, sem mock.
- [ ] Equipe sem `activation:manage` não cria, lê detalhe, edita ou desativa cliente Em Ativação; seu acesso legado autorizado continua funcionando.
- [ ] Conta A não vê nem acessa cliente Em Ativação da conta B, inclusive por URL/ID manual.
- [ ] Clientes legados conservam status, informações, rotas e seleção atuais; nenhum backfill foi executado.
- [ ] Cliente Em Ativação aparece na lista da carteira, mas não no seletor nem nas rotas operacionais.
- [ ] Criar Em Ativação não muda a contagem Stripe; status ativo continua sendo a única base da cobrança extra.
- [ ] Migration aplicada e registro + `schema.sql` atualizado no Backend; frontend sem dados fictícios misturados ao cliente real.

**Próxima entrega:** E2, materiais e cobertura. Este handoff não autoriza afirmar que a E1 foi concluída antes de aplicar migration, alterar Gateway/frontend e verificar os itens acima.
