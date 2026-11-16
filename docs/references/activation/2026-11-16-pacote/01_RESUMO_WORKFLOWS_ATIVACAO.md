# Resumo dos workflows de Ativação — ho.ko AI.nalytics V2

Consolidação: 16/11/2026. Estado dos testes: BETA de setembro de 2026.

**Limite de verificação:** os exports JSON nativos dos três workflows n8n não estavam disponíveis. A sequência de nodes e os testes abaixo são derivados da documentação técnica e dos registros de execução. Números de schema de resposta e datas de testes não equivalem a datas ou versões dos exports.

## ATV-ENT-ARQUIVO | Entrada de Arquivos

- **Objetivo:** transformar arquivos em conteúdo classificado, dividido em chunks e recuperável por cliente no Pinecone.
- **Gatilho conhecido:** node `Receber Conteúdo`; o mecanismo definitivo de acionamento (Webhook, outro workflow ou outro trigger) não foi verificado.
- **Entradas demonstradas:** PDF fictício `documento_teste_ativacao_cliente.pdf`; `id_cliente=900001`, `id_ativacao=ativacao-teste-20260918-001`, `namespace=cliente_900001`. O `id_documento` deriva de checksum SHA-256.
- **Nodes documentados:** `Receber Conteúdo` → `Preparar Artefato` → `Analisar e Classificar` → `Validar Conteúdo` → `Gerar Metadados` → `Preparar para Indexação` → `Validar Indexação` → `Gerar Embeddings` → `Montar Vetores` → `Pinecone`.
- **Serviços:** n8n; Python/FastAPI `POST /documents/prepare` (Docling + HybridChunker); OpenAI (classificação e embeddings); Pinecone (vetores e recuperação).
- **Saída observada:** preparação `status=success`, `schema_version=1.0`; 3 páginas, 11 chunks com referências de seções e páginas; vetores `doc_<hash>#v<versao>#c<indice>`; metadados de índice `versao_schema=2.0`.
- **Testes:** processamento de PDF fictício, indexação e recuperação RAG com evidências e abstenção quando faltavam dados.
- **Callbacks:** nenhum callback de atualização Gateway/frontend confirmado.
- **Falhas e limites:** não há teste comprovado de PDF corrompido, serviço Python/Pinecone indisponível, timeout, reprocessamento duplicado ou retomada de erro. Recepção pela interface V2, persistência operacional e atualização do status ao usuário não foram comprovadas.

## ATV-IA-DOCUMENTOS | Definir Documentos Obrigatórios

- **Objetivo:** identificar documentos adicionais obrigatórios com base em escopo, objetivos e lacunas, sem repetir materiais já atendidos.
- **Gatilho conhecido:** `Iniciar Teste`; não foi confirmado disparo automático real.
- **Entradas:** `id_cliente`, `id_ativacao`, `namespace`, `escopo`, `objetivos`, `dores_e_lacunas_iniciais`, `documentos_base_processados`, `top_k` (10 no exemplo); contexto simulado e trechos recuperados do RAG.
- **Nodes documentados:** `Iniciar Teste` → `Simular API da Ativação` → `Montar Consulta de Contexto` → `Gerar Embedding da Consulta` → `Recuperar Contexto do Cliente` → `Preparar Evidências` → `Definir Documentos Obrigatórios` → `Validar Documentos Obrigatórios` → `Emitir Documentos Obrigatórios`.
- **Serviços:** OpenAI; Pinecone; n8n. O node de API era simulação, não chamada real comprovada ao Gateway.
- **Saída contratada BETA:** `id_cliente`, `id_ativacao`, `documentos_obrigatorios` com código, nome, categoria, criticidade, justificativa, evidências e confiança; `total_documentos_obrigatorios`, `necessita_revisao_humana`, `resultado_valido`.
- **Testes:** documentação consolidada registra identificação de cinco documentos adicionais: política de comunicação/compliance, tabela oficial de produtos/preços, matriz de responsáveis/aprovação, manual de identidade visual atualizado, calendário comercial. Porém há resposta intermediária com lista vazia mesmo havendo lacunas. É uma divergência real do registro, e não se conhece a execução exata que a resolveu.
- **Callbacks:** nenhum callback comprovado para atualizar o checklist no Gateway/frontend.
- **Falhas e limites:** saída vazia intermediária; sem evidência suficiente de testes com RAG indisponível, erro de modelo, evidências contraditórias ou persistência real das pendências.

## ATV-CTL-ATIVACAO | Controle da Ativação

- **Objetivo:** avaliar requisitos de contexto mínimo e bloquear/liberar avanço da Ativação.
- **Gatilho conhecido:** `Iniciar Teste`; estado simulado pelo fluxo.
- **Entradas:** cenário de teste, requisitos, pendências e criticidade. Não há payload completo auditável de todos os cenários.
- **Nodes documentados:** `Iniciar Teste` → `Definir Cenário` → `Simular API de Controle` → `Avaliar Requisitos da Ativação` → `Classificar Pendências` → `Contexto Mínimo Disponível?` → `Ativação Pendente ou Cliente Ativado` → `Emitir Estado da Ativação`.
- **Serviços:** n8n; API de controle simulada. Não há integração de persistência real comprovada.
- **Saídas e testes:** cenário `bloqueado` => `status_gate=bloqueado`, `contexto_minimo_disponivel=false`; `com_pendencias` => `apto_com_pendencias`, `true`; `pronto` => `apto`, `true`.
- **Regra:** pendência `bloqueador` impede avanço; `critico` e `administravel` não bloqueiam automaticamente. Porcentagem de preenchimento sozinha não decide o gate.
- **Callbacks:** não foi comprovado retorno automático de atualização de status ao Gateway/frontend nem disparo automático da primeira análise estratégica.
- **Falhas e limites:** sem evidências de testes de dados ausentes/contraditórios, concorrência, falha de API ou reabertura de Ativação. Atualização operacional permaneceu simulada.

## Outros workflows e decisões pendentes

`TESTE-RAG | Retrieval` e `TESTE-RAG | Chat` eram laboratórios, não parte da sequência operacional. Nomes do diagrama arquitetural expandido (`ATV-ENT-REUNIAO`, `ATV-ENT-INTEGRACAO`, `ATV-CTL-ARTEFATO`, `ATV-PRC-CONHECIMENTO`, `ATV-IDX-CONHECIMENTO`, `ATV-VAL-PRONTIDAO` e `ATV-ORQ-ATIVACAO`) não estão comprovados como implementados.

Ainda sem comprovação de implementação ponta a ponta: upload com estados de interface; checklist persistente e revisão humana; controle de documentos exigidos; callbacks; gestão de objetivos/responsáveis iniciais; integrações reais da Ativação; transição Ativação → execução estratégica inicial → criação manual do primeiro ciclo operacional. Esta última é a direção de produto mais recente.

**Versão/data dos exports n8n:** não verificáveis sem os JSONs exportados. `schema_version=1.0` e `versao_schema=2.0` são versões de dados, não versões dos workflows.
