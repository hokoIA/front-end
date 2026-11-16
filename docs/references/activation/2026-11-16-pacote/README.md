# Pacote histórico de Ativação recebido em 2026-11-16

**Origem:** cópia integral, sem alterações, de `C:\Users\luiz_\Downloads\PACOTE_ATIVACAO_HOKO_V2_CODEX`. Os seis arquivos copiados têm SHA-256 idêntico aos originais. Eles são **referência documental e evidência de testes BETA**, não exports executáveis dos workflows nem especificação aprovada para implementação.

## Como usar este pacote

1. Para decisões de produto atuais, consultar primeiro `docs/PRODUCT_SOURCE_OF_TRUTH.md` e `docs/DECISIONS_OPEN.md`. A conversa posterior ao dossiê prevalece em caso de divergência.
2. Para o plano técnico atual, consultar `docs/ACTIVATION_CROSS_STACK_PLAN.md` e `docs/ACTIVATION_INITIAL_MODEL_DRAFT.md`. O segundo é proposta, não contrato implantado.
3. Usar os arquivos abaixo para reconstruir intenção, localizar evidência e preparar perguntas ao responsável pelo n8n. Não copiar payloads simulados para o Gateway como contrato de produção.

| Arquivo | Uso correto | Limite |
|---|---|---|
| `01_RESUMO_WORKFLOWS_ATIVACAO.md` | Síntese dos três workflows nomeados, nodes documentados, testes e ausências | Derivado de registros e documentação; sem export JSON nativo |
| `02_DOSSIE_COMPLETO_ATIVACAO.md` | Histórico de UX, reuniões, Figma e evolução das decisões | Consolidado em 09/11; contém propostas e acordos depois alterados |
| `03_ARQUITETURA_BETA_FASE_0.docx` | Arquitetura e contratos BETA declarados pelo projeto anterior | Descreve simulações n8n, não integração atual Gateway/Frontend |
| `04_DIAGRAMA_BETA.mmd` | Visão arquitetural desenhada | Inclui workflows planejados que não foram comprovados como implementados |
| `05_TESTE_PREPARACAO_DOCUMENTOS.txt` | Saída de preparação de PDF fictício, chunks e metadados | Uma execução de teste; não demonstra upload real, callback ou persistência relacional |
| `06_TESTES_IA_DOCUMENTOS.txt` | Entrada simulada, embedding, recuperação de contexto e saída da IA | A lista vazia é resultado válido daquela execução; o relato de cinco itens se refere a teste não incluído neste arquivo |

## Evidência técnica que o pacote sustenta

| Módulo | O que está documentado ou registrado | O que ainda não foi verificado |
|---|---|---|
| `ATV-ENT-ARQUIVO` | Cadeia documentada de recepção → preparação/classificação → embeddings → Pinecone. O teste de PDF fictício devolveu `status=success`, 3 páginas e 11 chunks, com IDs determinísticos e referências de seção/página. | Trigger real, export atual dos nodes, upload pela UI, tratamento de erro/retry, callback e estado durável no Gateway. |
| `ATV-IA-DOCUMENTOS` | Entrada de contexto simulada, recuperação de dez fontes do PDF fictício e chamada de IA para documentos **adicionais/contextuais**. A execução incluída retorna `documentos_obrigatorios: []`, saída permitida pelo próprio contrato BETA. | O arquivo não contém a outra execução relatada com cinco itens. Não há callback ou persistência comprovados. |
| `ATV-CTL-ATIVACAO` | Documento e resumo descrevem três cenários simulados: `bloqueado`, `apto_com_pendencias` e `apto`. | Arquivo bruto de execução desse workflow, export JSON, regras atuais, integração com status do cliente e autorização humana real. |

O `schema_version=1.0` da preparação e `versao_schema=2.0` dos metadados são versões **dos dados de saída**, não versões dos workflows. O PDF usado nos testes representa um cliente fictício (`id_cliente=900001`); seus nomes, objetivos, pendências e identificadores não são requisitos de clientes reais.

O resumo original chama a lista vazia de “divergência real”. Essa é uma interpretação do autor do resumo, preservada no arquivo histórico. Para o planejamento atual, a lista vazia é uma resposta válida; não há evidência de que as duas saídas pertençam à mesma execução ou às mesmas entradas.

## Divergências com decisões atuais

- O workflow `ATV-IA-DOCUMENTOS` foi desenhado para sugerir documentos **extras** segundo o contexto. A lista inicial de informações mínimas pertence ao sistema; a IA pode reconhecer cobertura em materiais processados e sugerir exigências adicionais na avaliação geral. Não usar a saída desse workflow para inventar a lista mínima.
- O controle BETA classifica pendências e pode emitir `apto_com_pendencias`. A regra atual exige que os mínimos estejam cobertos e processados antes de liberar a solicitação da avaliação geral; a autorização final é do Admin, inclusive com limitações. O mapeamento entre esses passos exige novo contrato.
- O documento Word declara `n8n-first` e simulação de API/RDS como estratégia daquela BETA. Para integração real da V2, o Gateway é a fronteira de autenticação, tenant, autorização e persistência. O frontend não deve chamar n8n diretamente.
- O dossiê contém intenções históricas sobre wizard, links externos, participação do cliente final e reativação. A V2.0 atual mantém Ativação na lista de Clientes & Integrações, operada pelo Admin, sem links externos/públicos e sem reativação completa a cada ciclo.
- Os nomes `ATV-ENT-REUNIAO`, `ATV-ENT-INTEGRACAO`, `ATV-CTL-ARTEFATO`, `ATV-PRC-CONHECIMENTO`, `ATV-IDX-CONHECIMENTO`, `ATV-VAL-PRONTIDAO` e `ATV-ORQ-ATIVACAO` aparecem no diagrama, mas o pacote não prova que existam como workflows executáveis.

## A05 — hipótese operacional adotada

O responsável do produto autorizou em 2026-11-16 assumir um modelo técnico suficiente para planejar a integração sem aguardar os exports JSON. Esse modelo está em `docs/ACTIVATION_N8N_ASSUMED_CONTRACT.md`. Os exports e testes ponta a ponta serão úteis na implementação, mas não bloqueiam o planejamento. A saída vazia acima é válida e não contradiz, por si só, o relato de outra execução com cinco itens.

## Integridade dos arquivos recebidos

| Arquivo | SHA-256 |
|---|---|
| `01_RESUMO_WORKFLOWS_ATIVACAO.md` | `D4ED91AA1EF7B940AD031B637722AD25FCCD1F6FD854BA6E1237793B7E11BCA6` |
| `02_DOSSIE_COMPLETO_ATIVACAO.md` | `EA05BC54C62086270CC2A57814418901C8081F61B27184B8DA68CBAAD427197C` |
| `03_ARQUITETURA_BETA_FASE_0.docx` | `683DD9AEAEBCCD1D19C6D4DDE9571AAA43CB127CB0E899FC255CF52B51BA6920` |
| `04_DIAGRAMA_BETA.mmd` | `DA4D1C24D8460E8AB594261A8B932592E76A7C31AE9C53C6E474721E218A36D5` |
| `05_TESTE_PREPARACAO_DOCUMENTOS.txt` | `2108B60F891B93160A5E9FE23E9AF782D92AFCB4FD92687CCEE23474C1FE81E1` |
| `06_TESTES_IA_DOCUMENTOS.txt` | `1C714F2C656B36EB61CF0590D6553C0722F4ED195A564241C9E03AEF71022C31` |
