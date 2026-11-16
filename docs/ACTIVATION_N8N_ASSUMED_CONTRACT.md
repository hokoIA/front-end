# Ativação — contrato técnico assumido para planejamento

**Revisão:** 0.1.0 · **Data:** 2026-11-16 · **Estado:** hipótese operacional elaborada por orientação do responsável do produto. Este documento fecha A05 **para desenhar as fatias da V2.0**. Ele não afirma que os gatilhos, callbacks ou payloads abaixo já estão implantados no n8n, nem aprova seus nomes como contrato final. A validação durante a integração poderá ajustar campos e transporte sem reabrir a jornada de produto.

**Fontes:** `references/activation/2026-11-16-pacote/README.md`, arquivos originais do pacote, `PRODUCT_SOURCE_OF_TRUTH.md`, `ACTIVATION_INITIAL_MODEL_DRAFT.md` e código atual dos projetos. Os três workflows BETA documentados são `ATV-ENT-ARQUIVO`, `ATV-IA-DOCUMENTOS` e `ATV-CTL-ATIVACAO`; exports nativos não foram fornecidos.

## Responsabilidades assumidas

| Responsável | Regra de trabalho para a integração |
|---|---|
| Frontend | Envia ações autenticadas ao Gateway, mostra estado durável e permite retomar a Ativação. Não chama n8n, Python ou Pinecone diretamente para o novo fluxo. |
| Gateway | Autoriza Admin e `account`/`customer`, persiste cliente, materiais, mínimos, cobertura, execuções e decisão humana; dispara jobs e recebe resultados idempotentes. É a fonte do estado exibido pela UI. |
| Sistema de mínimos | Mantém a lista inicial e sua revisão. Um documento pode atender vários mínimos; a lista não é gerada pelo workflow de documentos adicionais. |
| `ATV-ENT-ARQUIVO` | Processa material recebido, usa a preparação documental existente quando aplicável, classifica conteúdo, gera embeddings e indexa no namespace do cliente. Na adaptação V2, também retorna **candidatos de cobertura** dos mínimos com referência ao material/trecho. Essa saída de cobertura ainda não foi demonstrada no BETA. |
| `ATV-IA-DOCUMENTOS` | Examina contexto, escopo, objetivos, lacunas e evidências recuperadas para sugerir **documentos adicionais contextuais**. `documentos_obrigatorios: []` é resposta válida quando não há exigência adicional sustentada; não indica falha por si só. |
| `ATV-CTL-ATIVACAO` | Produz parecer de prontidão a partir do estado fornecido pelo Gateway. O resultado BETA `bloqueado`/`apto_com_pendencias`/`apto` é **parecer**, não alteração automática de `customer.status` nem autorização humana. |
| Analyze/Pinecone | Prepara e recupera documentos/vetores conforme contratos internos. Pinecone não guarda o estado operacional ou a autorização. |

## Sequência escolhida

1. Admin cria cliente Em Ativação pelo Gateway. O Gateway devolve `customer_id` e `activation_id` duráveis; o cliente não entra no workspace operacional nem na contagem de cobrança extra.
2. Admin envia arquivo, ata ou texto. O Gateway registra `material_id` com estado `received`, associa à conta e ao cliente e entrega referência de conteúdo ao n8n por chamada interna autenticada. O transporte inicial assumido é webhook **servidor a servidor**, nunca URL pública no navegador.
3. `ATV-ENT-ARQUIVO` processa arquivos e pode usar `POST /documents/prepare` do Analyze, já documentado. A entrada de texto/ata será adaptada ao mesmo contrato de material, sem presumir que o workflow BETA já a aceite. O processamento devolve identificador documental, checksum, classificação, referências de chunks/indexação e candidatos de cobertura. O Gateway valida o callback, guarda `processed` ou `failed` e registra a cobertura com proveniência. Reenvio do mesmo evento não duplica material/cobertura.
4. O Admin pode indicar manualmente que um mínimo foi atendido, sempre vinculado a material processado. A interface distingue cobertura automática de indicação manual; a avaliação geral confere ambas.
5. Quando **todos os mínimos vigentes** estão cobertos por materiais processados ou indicação manual válida, o Gateway libera a solicitação da avaliação geral. Integrações OAuth e atribuição de equipe não são bloqueios universais nessa transição.
6. O Gateway inicia execução assíncrona. A avaliação usa `ATV-IA-DOCUMENTOS` para possíveis exigências extras e `ATV-CTL-ATIVACAO` para parecer. Ordem técnica interna pode ser ajustada, mas o Gateway recebe um resultado consolidado com evidências, limitações e solicitações. O Admin pode complementar e repetir a avaliação.
7. O Admin autoriza o cliente, inclusive quando decide assumir limitações apontadas pela IA, sem justificativa obrigatória. Só essa ação autenticada do Gateway transforma o cliente em `active`. A primeira análise estratégica fica disponível; nenhum ciclo operacional nasce automaticamente.

## Envelope interno mínimo assumido

Os nomes abaixo são **proposta de handoff**, não campos observados no n8n. O Gateway preenche `account_id` a partir da sessão autorizada e nunca confia no cliente ou tenant enviado pelo browser.

| Mensagem | Campos mínimos | Resultado esperado |
|---|---|---|
| Processar material | `event_id`, `account_id`, `customer_id`, `activation_id`, `material_id`, `source_type` (`file`/`meeting_notes`/`text`), `content_ref`, `requirements_revision` | `event_id`, `material_id`, `status` (`processed`/`failed`), `document_id`, `checksum_sha256`, `chunk_refs`, `coverage_candidates[]`, `error_code` se falhou |
| Avaliar documentos extras | `execution_id`, `account_id`, `customer_id`, `activation_id`, escopo, objetivos, lacunas, referências processadas | `documentos_obrigatorios[]`, `necessita_revisao_humana`, `resultado_valido`, evidências; lista vazia é resultado válido |
| Avaliar prontidão | `execution_id`, `account_id`, `customer_id`, `activation_id`, revisão dos mínimos, cobertura, pendências e parecer documental | `status_gate` (`bloqueado`/`apto_com_pendencias`/`apto`), `contexto_minimo_disponivel`, pendências e evidências |
| Resultado consolidado | `event_id`, `execution_id`, `account_id`, `customer_id`, `activation_id`, `status` (`completed`/`failed`), parecer e solicitações | Gateway persiste a execução e expõe estado/resultado ao frontend; não altera cliente para ativo sem comando humano |

`content_ref` deve apontar para conteúdo acessível ao processamento interno; não carregar arquivo inteiro, token OAuth ou segredo no evento. `coverage_candidates[]` contém identificador de mínimo, referência de documento/trecho e confiança ou motivo, não marca requisito como atendido sem validação do Gateway. Os IDs e nomes finais serão alinhados ao schema real de cada serviço na fatia de integração.

## Falhas e idempotência

- O Gateway cria `execution_id`/`event_id` antes do envio e aceita callback somente para a conta, cliente, Ativação e execução esperados. Repetição do mesmo evento não duplica vetores, cobertura ou parecer.
- Timeout, falha de Analyze/Pinecone ou saída inválida produzem estado `failed` consultável; não transformam ausência de resposta em lista vazia válida. O Admin pode tentar novamente sem perder o material original.
- A lista vazia de `ATV-IA-DOCUMENTOS` é válida **quando há execução concluída com `resultado_valido=true`**. Ela não significa que os mínimos do sistema estejam atendidos ou que o cliente esteja autorizado.
- Se a IA pedir documentos extras, o Gateway guarda o parecer/solicitação. O Admin pode complementar ou autorizar com limitações depois da avaliação; não existe aprovação automática por `status_gate=apto`.
- Ao excluir um cliente Em Ativação, o Gateway coordena cancelamento/limpeza de jobs e vetores daquele cliente; callbacks tardios não recriam registros.

## Aceite da integração futura

- [ ] Um material processado cobre dois mínimos com referências verificáveis, sem exigir dois uploads.
- [ ] `documentos_obrigatorios: []` resulta em avaliação válida sem exigências extras, mas não autoriza o cliente automaticamente.
- [ ] A indicação manual só é possível com material processado e aparece para conferência na avaliação.
- [ ] Falha e retry não geram duplicatas; callbacks de outra conta/cliente são rejeitados.
- [ ] Admin pode autorizar após parecer com limitações; Equipe sem permissão não autoriza.
- [ ] Estado do frontend sobrevive a sair e voltar dias depois; cliente legado mantém status e informações.

**Limite:** A05 está resolvida como **hipótese operacional suficiente para planejamento**. A verificação dos nodes atuais e o teste ponta a ponta continuam tarefas de implementação, não uma nova decisão de produto. Este documento não autoriza criar endpoints fictícios no frontend nem mudar banco/n8n antes da fatia aprovada.
