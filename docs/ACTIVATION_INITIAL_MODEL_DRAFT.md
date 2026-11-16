# Ativação — modelo inicial para teste interno

**Estado:** modelo inicial de trabalho de 2026-11-16. A03 (`activating`, `activation:manage` para Admin e avaliação separada) foi adotada para planejar 0B; a lista concreta de mínimos abaixo ainda é proposta para 0C. Nenhum nome, regra de cobertura ou contrato está implantado no Gateway ou aprovado como schema.

## 1. Informações mínimas de teste

O cadastro curto continua com **nome e e-mail obrigatórios**; empresa e telefone seguem opcionais no endpoint atual. Para exercitar o fluxo documental, proponho inicialmente dois assuntos mínimos de conteúdo: **contexto do negócio** (o que o cliente faz e para quem) e **objetivo inicial** (o que pretende alcançar). São assuntos, não dois arquivos obrigatórios: uma ata, briefing, PDF ou texto processado pode cobrir ambos. A lista concreta deve ser confrontada com os workflows existentes antes de implementar o gate real.

O pacote histórico em `references/activation/2026-11-16-pacote/` descreve `ATV-IA-DOCUMENTOS` como sugestão de **documentos adicionais segundo o contexto**. Esse workflow não substitui os mínimos definidos pelo sistema. A lista vazia do teste bruto é resposta válida para aquela execução; o relato de cinco itens pode representar outro cenário. Nenhuma das duas saídas transforma esses itens em mínimos universais. A hipótese de integração está em `ACTIVATION_N8N_ASSUMED_CONTRACT.md`.

Cada requisito exibe `não atendido`, `em processamento` ou `atendido`, com referência ao material que o cobre. A automação pode identificar cobertura; o Admin pode indicá-la manualmente com vínculo a um material processado. O botão de solicitar avaliação geral só fica disponível após processamento e cobertura de todos os requisitos mínimos em vigor. A avaliação geral pode solicitar outros materiais específicos; o Admin pode autorizar com limitações, sem justificativa obrigatória.

Na validação interna, o conjunto de mínimos pode ser alterado e os clientes ainda Em Ativação passam a usar a revisão corrente. Não congelar uma lista por cliente nem migrar legados para Ativação nesta primeira fatia. A revisão do conjunto de mínimos deve ser registrada no contrato/configuração quando existir, separada da versão de release do aplicativo. Nenhuma integração OAuth é requisito universal de autorização.

## 2. Estados propostos

| Camada | Modelo inicial | Significado |
|---|---|---|
| `customer.status` | `activating` | Novo cliente em coleta e revisão; aparece em Clientes & Integrações e não entra no workspace operacional nem na contagem de cobrança extra. |
| `customer.status` | `active` | Cliente autorizado; comportamento e cobrança existentes. |
| `customer.status` | `inactive` | Estado legado de desativação; preservar registros e comportamento existentes. |
| Avaliação da Ativação | `not_requested`, `running`, `completed`, `failed` | Estado da execução assíncrona, separado do status do cliente. Resultado concluído pode indicar suficiência ou pedir complemento. |

O nome `activating` é a **hipótese técnica adotada para 0B**, não valor que já exista no banco. O cliente só passa a `active` por autorização humana depois da avaliação geral. Os estados de material e de cobertura são próprios; não devem ser inferidos de `customer.status`. Não criar `paused` nesta versão.

## 3. Acesso proposto

- `page:customers:view` continua governando a leitura da carteira; permissões existentes não são revogadas por este documento.
- Propor `activation:manage` no Gateway para criar, editar, solicitar avaliação, autorizar e excluir clientes **Em Ativação**. Na primeira versão, atribuí-la ao Admin da conta. O Gateway verifica a permissão, o vínculo à `account` e o status do cliente em cada operação.
- A permissão existente `customers:manage` **não basta** para a Ativação: o cadastro atual a concede também à Equipe. Não usar nome de cargo como único guard de segurança no frontend.
- Ao introduzir a permissão, concedê-la aos Admins das contas já existentes e às novas contas; não concedê-la automaticamente à Equipe. O `POST /customer/add` atual cria cliente `active` pelo default do banco e aceita `customers:manage`; o Gateway precisará impedir que esse caminho contorne o novo fluxo de Ativação antes de ligá-lo ao cadastro real.
- O Admin usa os fluxos OAuth existentes somente após o Gateway permitir o cliente Em Ativação com autorização e isolamento corretos. Não criar conexão direta do browser com n8n ou Python.

## 4. Exclusão de teste na V2.0

Permitir **exclusão definitiva do cliente Em Ativação selecionado**, incluindo registros relacionais relacionados, credenciais/conexões, materiais, trabalhos pendentes e vetores Pinecone daquele cliente. Não incluir clientes ativos ou inativos nessa operação. Não manter histórico de retenção de Ativação nesta versão de teste interno. O Gateway deve restringir por `account` e `customer`, pedir confirmação clara e devolver falha recuperável se a limpeza externa ficar incompleta; o frontend não confirma exclusão antes do resultado real.

O endpoint atual de exclusão de cliente faz desativação (`inactive`) e não comprova limpeza de Pinecone. Portanto, esta operação precisa de contrato e implementação próprios antes de aparecer como funcional. O desenho exato da coordenação PostgreSQL/OAuth/n8n/Pinecone e da recuperação de falhas pertence ao handoff técnico, não a este modelo de experiência.

## 5. Para validar antes de codificar a integração

1. Usar `ACTIVATION_N8N_ASSUMED_CONTRACT.md` para planejar a integração; conferir os três workflows locais e ajustar os dois assuntos mínimos de teste quando a fatia de classificação for implementada.
2. Revisar os nomes técnicos de status, resultado da avaliação e permissão proposta com o agente Gateway; então preparar migration aditiva e contrato HTTP.
3. Validar o fluxo de exclusão por cliente, inclusive falha parcial, antes de habilitar o botão.

Este documento não altera `schema.sql`, RBAC, APIs ou workflows. A fonte de verdade estrutural continua sendo o `schema.sql` do Backend atualizado após migrations aplicadas e verificadas.
