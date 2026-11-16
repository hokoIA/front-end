# Governança compartilhada da plataforma — proposta para validação

**Estado:** proposta de 2026-11-16. Este texto ainda não é norma aprovada, exceto a regra de comunicação da seção 7, solicitada expressamente pelo responsável do produto em 2026-11-16. Nenhum agente deve alterar o restante ou promovê-lo a fonte de verdade sem aprovação explícita do responsável do produto. A aprovação deve identificar a versão do texto e as eventuais ressalvas.

## 1. Fontes e limites de autoridade

| Artefato | O que comprova | O que não comprova |
|---|---|---|
| `docs/PRODUCT_SOURCE_OF_TRUTH.md` do frontend | Decisões de produto e design já aprovadas no escopo declarado | Contrato HTTP implantado ou estrutura física do banco |
| `D:\hoko\Hoko-Backend\schema.sql` | Estrutura relacional fotografada em 2026-11-09; é a referência canônica **do estado do banco naquele snapshot** | Uso das tabelas, presença de dados, migrações aplicadas depois do snapshot ou fluxos n8n |
| Código, rotas e testes de cada serviço | Comportamento implementado naquele checkout | Decisão de produto aprovada ou ausência de consumidores externos |
| Migrations aplicadas e registro de execução | Histórico de mudança do banco | Estado atual sem comparação com o catálogo PostgreSQL |
| `docs/CONTRACTS_HANDOFF.md` | Propostas e contratos ali identificados como existentes | Implementação automática dos endpoints candidatos |
| Exportações versionadas do n8n | Nodes, gatilhos e payloads daquele workflow exportado | Integração de produção enquanto não houver teste ponta a ponta |

Se fontes divergirem, parar a alteração dependente, registrar a divergência e pedir decisão. `schema.sql` permanece a referência absoluta da estrutura **atual verificada**, mas deve ser reconciliado com o catálogo real após cada migração aplicada; uma proposta de DDL não pode ser incorporada ao snapshot como se já existisse no banco.

## 2. Regra de mudança proposta

1. Inspecionar o estado real e registrar evidências sem copiar dados privados ou segredos.
2. Explicitar intenção do usuário, impacto em frontend, Gateway, PostgreSQL, Python, n8n, Pinecone, OAuth, RBAC, tenant e cobrança quando pertinentes.
3. Preparar contrato e plano da fatia, com estados de erro, testes, migração de dados e reversão.
4. Obter aprovação explícita do responsável do produto para alterar regras, jornadas, contratos compartilhados, governança ou estrutura destrutiva. Aprovação de uma tela não autoriza automaticamente DDL ou mudança de cobrança.
5. Executar por fatias, na ordem: migração aditiva → Gateway → automações/serviços → frontend conectado → teste ponta a ponta → retirada de mock.
6. Atualizar as fontes aprovadas **após** validar o resultado. Registrar versão, data, decisão e evidência. Checkboxes de execução podem mudar para refletir trabalho concluído; textos normativos exigem nova aprovação.

## 3. Responsabilidades propostas

- **Frontend:** jornada, estados, acessibilidade, contratos tipados, chamada autenticada ao Gateway e isolamento dos mocks. Não expõe credenciais nem chama diretamente n8n em fluxos novos.
- **Gateway:** autenticação, RBAC, tenant, escrita relacional, status durável, contratos HTTP, início e callback seguro das execuções, idempotência e auditoria.
- **PostgreSQL/RDS:** estrutura, integridade, versionamento de migrations e histórico operacional. `schema.sql` acompanha o catálogo real depois da aplicação.
- **n8n:** orquestra entradas e tarefas demoradas a partir de contratos versionados; não é a fonte única de status ou de autorização humana.
- **Python/Pinecone:** preparação e análise especializadas, proveniência documental e armazenamento vetorial. `/documents/prepare` e `/documents/store` mantêm os limites documentados no projeto Analyze.

## 4. Regras para migrations e retirada de legado

- Migrations novas devem ter nome ordenável, pré-condições, efeito esperado, validação, estratégia de rollback e registro de aplicação. Não reutilizar scripts históricos como se fossem reaplicáveis; `migration_kanban_novo.sql` contém `DROP TABLE ... CASCADE`.
- Preferir mudança aditiva e período de coexistência. Separar criação de estrutura, eventual backfill aprovado, mudança de leitura/escrita e eventual remoção. Na Ativação, clientes legados mantêm status e informações atuais, sem backfill.
- Antes de `DROP` de tabela/coluna: verificar referências nos três repositórios, n8n e jobs externos; dependências do catálogo; volume e retenção dos dados; backup/restauração; teste em cópia; plano de reversão. A ausência de referência no frontend ou Gateway **não** aprova exclusão.
- Não aplicar DDL nem apagar dados por instrução genérica de planejamento. A autorização operacional para alterações no banco foi concedida pelo responsável em 2026-11-16; revisar efeitos concretos, escopo e reversão antes de cada execução. A exigência proposta de aprovação separada para cada migration permanece pendente de validação desta governança.
- Não registrar tokens, `.env`, payloads privados ou conteúdo de documentos em documentação, migrations, logs de teste ou respostas.

## 5. Critérios de passagem de etapa

Cada etapa usa `docs/PLATFORM_STAGE_ROADMAP.md` e um plano específico com: objetivo, experiência aprovada, inventário real, contratos, DDL proposto/aprovado, n8n/Python afetados, regras de tenant/RBAC/billing, estados de UI, migração e eventual backfill, testes, rollback e pendências. A etapa só é considerada integrada quando a interface usa o Gateway real, as automações respondem ao contrato e o teste ponta a ponta confirma isolamento e estados de falha. Um mock visual concluído não equivale à etapa concluída.

## 6. Versionamento de entregas

- Separar **marco de produto** (por exemplo, V2.0 em construção) de **versão publicada de cada serviço**. Um marco não muda automaticamente `package.json`, imagem de deploy ou tag Git. Hoje o frontend declara `0.1.0` em `package.json`/`package-lock.json`; não há uma release V2.0 identificada por tag neste repositório.
- Para releases estáveis, usar `MAJOR.MINOR.PATCH`: `MAJOR` quando um contrato público exige migração coordenada ou há quebra de compatibilidade; `MINOR` para capacidade compatível; `PATCH` para correção compatível. Antes da release estável, usar sufixo de pré-lançamento, como `2.0.0-alpha.1` para integração interna e `2.0.0-rc.1` para candidata validada. Não chamar um mock visual de release integrada.
- Cada serviço mantém sua versão e changelog próprios; o plano transversal registra a combinação de versões efetivamente testada. Alterar `package.json` e `package-lock.json` juntos quando a versão do frontend mudar. Uma alteração documental isolada não dispara incremento da versão do aplicativo.
- Contratos entre serviços têm revisão explícita no handoff; migrations têm identificador ordenável e registro de aplicação; exportações n8n têm versão ou hash; mudanças do conjunto de informações mínimas da Ativação têm revisão própria. Esses números não são substitutos da versão da aplicação.
- Para cada release, registrar versão anterior/nova, data, mudanças visíveis, contratos e migrations exigidos, compatibilidade e evidência de validação. O incremento técnico de versão pode acompanhar uma entrega aprovada; não aprova por si só mudanças de produto, jornada ou governança.

**Aprovação pendente:** confirmar este modelo completo de autoridade, o tratamento de `schema.sql` após migrations e a exigência de aprovação separada para remoções. O responsável autorizou em 2026-11-16 o controle profissional de versões e a atualização das configurações quando houver mudança real de versão; esta seção propõe a convenção detalhada. A regra específica de cobrança extra para a Ativação também foi aprovada; isso não aprova uma mudança geral de faturamento. Até validação do texto integral, este documento continua sendo proposta.

## 7. Formato de cada entrega — regra aprovada

Toda resposta final ao responsável do produto deve seguir esta ordem:

1. **O QUE FOI FEITO:** alterações concretas, arquivos relevantes, testes e limites observados.
2. **MIGRATIONS/STATUS DO BANCO:** migration aplicada ou preparada, resultado verificado e estado de `schema.sql`. Omitir esta seção se não houver atualização relevante de banco na entrega.
3. **PRÓXIMAS ETAPAS:** etapa exata do plano, próximo trabalho do agente e ação, validação ou aprovação exigida do responsável. Se não houver ação necessária, dizer isso explicitamente.

O agente não deve apresentar uma fatia parcialmente validada como concluída. Esta regra de comunicação foi solicitada e aprovada em 2026-11-16; não aprova as demais propostas deste documento.
