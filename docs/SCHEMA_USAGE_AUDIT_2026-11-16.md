# Auditoria inicial do schema e de uso — 2026-11-16

**Escopo:** leitura estática do frontend, `D:\hoko\Hoko-Backend`, `D:\hoko\Hoko-Analize` e do `schema.sql` existente. Foi tentada uma conexão com sessão configurada como somente leitura em 2026-11-16, mas ela falhou com `OperationalError` antes de qualquer consulta; portanto, não houve leitura de linhas nem comparação com o catálogo vivo. Nenhuma migration foi executada e não houve exportação de n8n. Este inventário **não autoriza `DROP`**.

## Referência estrutural

`D:\hoko\Hoko-Backend\schema.sql` tem 571 linhas, foi gerado do catálogo PostgreSQL em 2026-11-09 e descreve **33 tabelas**: 24 em `public`, 9 em `kanban`. O arquivo está **não rastreado no Git** do Backend no momento desta leitura. Não há comando de migrations no `package.json` do Gateway nem registro de execução identificado nesta inspeção. Os scripts em `scripts/migration*.sql` são históricos avulsos; `migration_kanban_novo.sql` inclui remoções com `CASCADE`.

| Domínio | Tabelas atuais |
|---|---|
| Identidade, conta e RBAC | `accounts`, `user`, `team_members`, `roles`, `permissions`, `member_roles`, `role_permissions`, `invites`, `email_verification_tokens`, `password_reset_tokens` |
| Clientes e integrações | `customer`, `customer_integrations`, `user_keys`, `oauth_states`, `general_keys` |
| Métricas e estratégia V1 | `facebook`, `instagram`, `google_analytics`, `linkedin`, `goals` |
| Cobrança | `plans`, `promotion_codes`, `stripe_events`, `subscription_invoices` |
| Kanban | `kanban.board`, `board_column`, `card`, `card_art`, `card_assignee`, `card_comment`, `card_label`, `client_profile`, `label` |

## Achados que afetam a Ativação

1. `public.customer` tem `status text NOT NULL DEFAULT 'active'`; não há estado de Ativação definido no snapshot. O vínculo à agência é indireto por `customer.id_user → user.id_account`. `POST /customer/add` insere sem status e retorna o cliente criado (`customerRepository.js`, `customerController.js`).
2. `GET /customer/list` devolve clientes da conta, status e integrações sem filtrar Ativação (`customerRepository.js`). O `SelectedCustomerProvider` do frontend usa essa mesma lista para o workspace; um novo status exigirá exclusão explícita dali e bloqueio real no Gateway para rotas operacionais.
3. `stripeService.js` conta `customer.status = 'active'` para clientes extras. Em 2026-11-16, o responsável decidiu preservar essa regra: cliente Em Ativação não conta até se tornar ativo; clientes legados mantêm status e informações. A implementação ainda precisa de contrato e teste integrado.
4. `customer_integrations` guarda estados, recursos e tokens OAuth por cliente; `user_keys` ainda tem referências no código. Não eliminar armazenamento legado sem migração completa das leituras e credenciais.
5. Não há tabelas de material, requisito mínimo, cobertura ou avaliação de Ativação nesse `schema.sql`. O pipeline RAG/Pinecone está fora desse snapshot; status de processamento e referência documental exigem contrato entre Gateway, n8n e Python.
6. A exclusão de cliente envolve FKs, métricas, Kanban, integrações e dados vetoriais. A função de deleção existente no repositório não demonstra limpeza do Pinecone. O fluxo de descarte pré-contrato requer desenho próprio antes de ser exposto.

## Candidatas a investigação, não a exclusão

| Tabela | Evidência estática limitada | Verificação necessária |
|---|---|---|
| `general_keys` | Nenhuma referência textual encontrada no código de execução do Gateway ou Analyze; colunas podem conter segredo. | Consumidores externos, contagem de linhas sem ler valores, dependências, política de armazenamento de credenciais. |
| `oauth_states` | Nenhuma referência textual encontrada fora do schema/migrations; possui FK para `customer`. | Callbacks OAuth, jobs, volume/retenção, uso fora dos repositórios. |
| `kanban.card_art` | Presente na migration atual e no schema; nenhuma referência textual encontrada no código de execução do Gateway. | Uploads/S3, dados existentes, roadmap de arte no Kanban e dependências externas. |
| `promotion_codes` | A ocorrência de `allow_promotion_codes` no Stripe é configuração de checkout, não consulta comprovada à tabela. | Uso administrativo/Stripe, linhas e retenção, eventuais jobs externos. |

As demais tabelas têm referências textuais ou relações evidentes com funcionalidades ativas. Referência textual também não prova que todo campo ainda é necessário. A revisão de colunas vem depois da revisão de tabelas e contratos.

## Próxima verificação, sob responsabilidade do Gateway/DB

- Comparar `schema.sql` com `pg_catalog` atual e confirmar migrations já aplicadas; registrar deriva antes de propor DDL.
- Levantar contagens por tabela, tamanho, datas de última escrita quando verificáveis, FKs, views, funções, jobs, permissões e backups **sem extrair dados privados**.
- Cruzar as candidatas com exportações versionadas do n8n, callbacks, tarefas agendadas e integrações externas.
- Classificar cada candidata como manter, migrar, arquivar ou propor remoção, com impacto e rollback. Nenhum `DROP` entra na primeira migration de Ativação.
