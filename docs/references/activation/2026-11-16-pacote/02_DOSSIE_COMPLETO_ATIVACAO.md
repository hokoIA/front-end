# DOSSIÊ DE HANDOFF — ETAPA 0: ATIVAÇÃO

**Projeto:** ho.ko AI.nalytics V2 · **Destinatário:** Codex (mesma conta, continuidade da investigação de produto/UX)  
**Data de consolidação:** 09/11/2026 · **Recorte histórico:** discussões e materiais de setembro a novembro de 2026, com antecedentes operacionais da plataforma V1.  
**Objetivo deste material:** preservar o que foi discutido, desenhado, demonstrado e testado sobre a experiência de Ativação; **não é uma especificação para o Codex implementar imediatamente**.  
**Fora do escopo por orientação expressa do usuário:** schemas de banco, payloads, endpoints, contratos técnicos e decisões de infraestrutura. Tais dados só aparecem quando necessários para distinguir experiência existente de promessa de produto.

> **Instrução ao Codex:** trate este dossiê como memória contextual e pauta de revisão UX. **Não converta propostas, diagramas ou simulações em funcionalidades prontas ou regras aprovadas.** Confira o código, exports n8n e o Figma atual antes de modificar o produto. Quando houver divergência, dê preferência à decisão explícita mais recente do usuário, mas registre o conflito em vez de ocultá-lo.

## Como ler o status de cada afirmação

- **[ACORDADO]**: decisão expressamente validada na conversa ou reunião; ainda não implica implementação.
- **[CONSTRUÍDO/TESTADO]**: há registro de implementação ou testes de simulação; **não equivale** à validação de integração ponta a ponta em produção.
- **[DESENHADO]**: visto em Figma, diagrama ou captura; aprovação do desenho não necessariamente comprovada.
- **[PROPOSTO]**: ideia, recomendação, hipótese ou arquitetura pretendida.
- **[PENDENTE]**: falta ratificação, há contradição ou falta evidência suficiente.
- **[NÃO VERIFICADO]**: o material não permite afirmar o estado presente.

## Materiais efetivamente consultados e limites

Materiais locais examinados nesta consolidação: `Fase 0 - Ativação_ho.ko Company.pdf` (21 p., em especial as seções 1–10); `Detalhamento de fases_ho.ko Company.pdf` (a seção “Fase 0 — Ativação”); reuniões `Semana 1_ Fase Ativação - 2026_09_14...pdf`, `Semana 3_ Fase Interpretação - 2026_09_28...pdf`, `Etapa 0_ Review Técnico - 2026_09_30...pdf`, `Etapa 3_ Review Técnico - 2026_10_21...pdf`, `Etapa 3_ Design Review - 2026_10_23...pdf`, `ho.ko AI.nalytics - Brainstorming - 2026_10_26...pdf`, `ho.ko AI.nalytics - Review Técnico - 2026_10_28...pdf`, `ho.ko AI.nalytics - Design Review - 2026_10_30...pdf`; `documento_teste_ativacao_cliente.pdf`; amostras de recuperação textual `Texto colado(1).txt`–`Texto colado(4).txt`; diagramas `arquitetura_ativacao_beta_final.mmd` e `fase_ativacao_simplificada.mmd`; capturas de interface de setembro/outubro, inclusive `image(10).png`, `image(20261013-151304).png` e imagem `Etapa 0 - Ativacao.png`; informações e decisões explícitas desta conversa.

**Limites:** não recebi nesta consolidação export JSON definitivo dos três workflows de Ativação; não foi possível inspecionar o Figma da Fase 0 ao nível de seus nodes no acesso atual (tentativa de acesso impedida por permissão); não existe validação demonstrada de fluxo completo Ativação→Gateway→n8n→UI em ambiente de produção. As notas de reuniões produzidas por Gemini são **registros secundários potencialmente inexatos**; decisões orais devem ser confrontadas com usuários envolvidos quando houver conflito. Não foram inventados outros links, frames ou estados.

---

# 1. Resumo executivo da Ativação

**[ACORDADO]** A **Etapa 0 — Ativação** é o processo de onboarding/contextualização inicial de cada cliente na ho.ko V2. Estrutura as condições humanas, contratuais, informacionais, operacionais e de acesso para que a inteligência possa trabalhar com contexto suficiente e limites definidos. Não se resume a “cadastrar cliente” ou “subir documentos”.

**Problema concreto:** entrada irregular de clientes, materiais faltantes, indefinição de responsáveis e aprovadores, acessos incompletos, escopo divergente e execução de demandas não contratadas. Os casos levantados em reunião motivaram a necessidade de fronteiras de escopo e de um *quality gate* antes de iniciar o processo de inteligência.

**Usuário principal na BETA:** profissional da agência que conduz o onboarding e organiza dados e acessos; o cliente fornece informações e participa de alinhamentos/aprovações, mas **não é a experiência principal** da primeira entrega. A V2 tem foco inicial no uso interno da agência, com possíveis experiências externas futuras.

**Quando começa:** na entrada de novo cliente após passagem comercial/operacional ou quando se reabre uma relação. O documento metodológico mais amplo admite reativações e grandes mudanças de escopo, mas **a jornada mais recente da BETA diz que a Ativação completa de um cliente ocorre uma vez; não é repetida a cada ciclo operacional**. Mudanças posteriores podem exigir revisão de informações.

**Quando conclui:** após reunir o contexto e os documentos críticos conforme o escopo, definir responsáveis e decisões vigentes, identificar limitações, passar no gate de prontidão e obter validação humana. Há modalidades conceituais de autorização com ressalvas; os limites de uso delas na BETA estão pendentes.

**Resultado visível:** cliente ativado, base documental contextualizada, objetivos e compromissos iniciais, mapa das fontes disponíveis, responsáveis, pendências e restrições registradas, prontidão e próximo passo claro.

**Jornada sucessora mais recente [ACORDADO na conversa]:** **Ativação → primeira execução do OIDEA estratégico → agência examina propostas complementares → criação manual do primeiro ciclo operacional com período e objetivos já vigentes.** A primeira análise estratégica não deve exigir reinformar dados da Ativação; aceitar suas propostas não é um novo gate obrigatório, pois já existem objetivos humanos iniciais.

**Fora da Ativação:** diagnóstico profundo do desempenho, validação causal de hipóteses, decisões estratégicas novas geradas pela IA, operação diária do ciclo, produção de conteúdo no Kanban, planejamento de quantidade de posts e relatório de aprendizagem. **Report Zero/primeira Observação** começa depois do gate, não durante a coleta de entrada.

# 2. Jornada completa discutida — sem forçar um wizard linear

O documento metodológico `Fase 0 - Ativação_ho.ko Company.pdf`, seção 7, nomeia os passos **0.1 a 0.7**. Eles são uma **jornada de referência**, não comprovação de sete telas prontas. Na experiência BETA, várias ações podem ser paralelas e retomadas.

| Etapa metodológica | Pessoa / intenção | Informações e ações | Resultado / situação |
|---|---|---|---|
| **0.1 Passagem de bastão** | Comercial + líder da operação: compreender o que foi vendido | Contrato, escopo, expectativa, riscos, patrocinador, contato principal | [ACORDADO como método] Confirma contexto anterior ao cadastro; UI específica não comprovada |
| **0.2 Abertura do ambiente** | Operação: criar/selecionar o cliente e iniciar o onboarding | Identificação do cliente, participantes iniciais, estrutura de acesso e checklist | [DESENHADO] Novo cliente wizard e visão do cliente no Figma; reaproveitar cliente existente quando aplicável |
| **0.3 Coleta inteligente de contexto** | Agência solicita; cliente fornece; agente organiza | Empresa, marca, produtos, objetivos, restrições, documentos, reuniões, plataformas | [DESENHADO + workflows parciais testados] Entradas de Documentos, Configuração e Conexões; coleta progressiva, não lista universal |
| **0.4 Triagem de prontidão** | Operação/estratégia: entender o que falta | Itens bloqueadores, críticos, administráveis, aceitos; fontes e documentos ausentes | [ACORDADO] Pendências sinalizadas, próximas ações claras; status de integração real não verificado |
| **0.5 Workshop de Ativação** | Estrategista + decisor + participantes essenciais: alinhar decisões humanas | Por que começar, contribuição da comunicação, escopo, exclusões, papéis, critérios de sucesso, riscos | [ACORDADO como método] Conteúdo de reunião pode alimentar contexto; tela/automação do workshop ainda não confirmada |
| **0.6 Formalização** | Agência: registrar aquilo que foi efetivamente acordado | Objetivos iniciais, escopo, regras, responsáveis, autorizações e pendências | [ACORDADO como intenção] Charter e outros instrumentos metodológicos; experiência final de emissão na BETA pendente |
| **0.7 Gate de autorização** | Decisor humano competente: permitir ou não o avanço | Revisar cobertura de informações críticas, exceções e restrições | [ACORDADO] Bloquear avanço sem condições mínimas e autorização humana; critérios finos sujeitos a confirmação |

**Caminhos recorrentes do usuário:**

1. **Cliente novo:** cadastrar → acessar entrada de contexto → solicitar/completar materiais → configurar pessoas e objetivos → conectar as fontes pertinentes → acompanhar processamento e lacunas → revisão humana → ativar.
2. **Cliente já cadastrado na V1:** aproveitar cadastro, documentos e conexões comprovadamente úteis → conferir o que está desatualizado ou ausente → **não duplicar** a conta só para iniciar a V2. Estratégia de migração visual e critérios de reaproveitamento ainda pendentes.
3. **Cliente com fontes conectadas:** mostrar o que já está disponível, sem pedir OAuth desnecessariamente; confirmar se há autorização/recurso pertinente ao cliente.
4. **Cliente sem fontes conectadas:** avaliar se uma fonte é indispensável para a investigação **desse** escopo; não impor conexão universal de todas as redes.
5. **Documento ausente ou inválido:** sinalizar o item e sua relevância, permitir complementar/substituir; bloqueio depende de ser requisito crítico.
6. **Documento em processamento:** diferenciar arquivo **recebido** de conteúdo **processado** e **utilizável**; não marcar requisito completo prematuramente.
7. **Integração expirada:** indicar que existe credencial/conexão anteriormente configurada, mas indisponível no momento; oferecer renovação pelo fluxo existente.
8. **Usuário sem permissão:** mostrar mensagem coerente e preservar informações visíveis permitidas; quem pode concluir a Ativação ainda requer regras de RBAC específicas.
9. **Ativação com pendências:** a metodologia admite “autorizado com pendências”; não há ratificação inequívoca da combinação exata de pendências aceitas na BETA.

# 3. Estrutura de UX / informações organizadas na Ativação

**[ACORDADO na reunião de 28/09]** A divisão informacional evita misturar tudo em um formulário genérico:

- **Contexto:** documentos, fontes, acessos, materiais de marca, APIs e base de conhecimento.
- **Operação:** canais de trabalho, stakeholders, governança, kickoff e responsabilidades.

**[DESENHADO / explorado]** Os três modos de entrada citados literalmente no documento metodológico são **Documentos**, **Configuração** e **Conexões**. Podem ser seções/abas de uma experiência unificada; não há evidência que exija três páginas independentes. O usuário quer um fluxo que possa ser retomado e que evite repetição.

Inventário visual recuperável das iterações do Figma da Fase 0 (nomes preservados a partir do histórico, não de inspeção atual de nodes):

| Tela ou área | Finalidade e conteúdo | Estado evidenciado |
|---|---|---|
| **Clientes & Integrações** | Selecionar/gerir clientes e encontrar caminho para Ativação | [DESENHADO], também há funcionalidades correspondentes na V1; não comprova implementação do wizard V2 |
| **Novo cliente Wizard** | Início estruturado do onboarding | [DESENHADO], versão inicial de 29/09 |
| **Cliente Visão Geral** | Consultar contexto, prontidão, pendências e entrada para etapas | [DESENHADO], não validado integralmente |
| **Dados iniciais** | Informações preliminares de empresa/escopo/objetivos | [DESENHADO] |
| **Documentos e Contexto** | Coleta e organização de materiais com estados de recebimento/qualidade | [DESENHADO]; processamento n8n testado separadamente |
| **Quality Gate** | Mostrar prontidão, bloqueios, pendências e ação humana de autorização | [DESENHADO]; regra de gate aprovada em conceito |
| **02B Entrada operacional** | Separar operação/participantes do contexto documental | [DESENHADO] como atualização posterior; conteúdo exato dos controles não recuperável |
| **04B Configuração** | Responsáveis e informações de governança | [DESENHADO] como atualização posterior |
| **04C Conexões e Acessos** | Disponibilidade e autorização de fontes relevantes | [DESENHADO] como atualização posterior |
| **Fluxo de navegação Fase 0** | Encadeamento da experiência e seus caminhos | [DESENHADO] |
| **Central de Controle / saúde da conta** | Resumo de prontidão/pendências, possivelmente usado na agência | [PROPOSTO/DISCUTIDO]; percentuais e faixas não foram confirmados como regra definitiva |

**Estados a garantir na revisão UX, mas não presumir que já existem:** cliente não iniciado; etapa incompleta; documento recebido; processando; classificação disponível; revisão necessária; documento aceito; falha com reenvio; integração conectada/expirada/ausente; prontidão insuficiente; pendências com responsável; autorizado; autorização com ressalvas; usuário não autorizado. **Não inventar** nomes internos de estados da aplicação a partir dessa lista descritiva.

**Divergência importante:** um indicador “75% completo” pode orientar a atenção, mas **não autoriza** dizer que o cliente está pronto. O método mede **suficiência e clareza**, não proporção bruta de campos preenchidos.

# 4. Links e artefatos visuais

| Artefato | Link completo, quando confirmado | Conteúdo conhecido | Estado e limitação |
|---|---|---|---|
| **Figma Fase 0 — Ativação** | https://www.figma.com/design/xtp1DrfdUcuFUCZyDruaLt?utm_source=chatgpt.com | 6 telas iniciais citadas em 29/09; atualização posterior com 02B, 04B, 04C e fluxo | [DESENHADO]; conteúdo inferido do registro histórico; acesso atual ao arquivo não permitiu verificar nodes nem aprovação final |
| **Figma Fase 1 — Observação** | https://www.figma.com/design/eZUK5Jv9jXgUPRyOifSA4D?utm_source=chatgpt.com | Central de análises e estados de execução de Observação | [EXPLORATÓRIO/SUBSTITUÍDO para decisões de UX posteriores]; **não é** o Figma da Ativação |
| **Redesenho V2 em página do mesmo arquivo de Fase 1** | https://www.figma.com/design/eZUK5Jv9jXgUPRyOifSA4D?node-id=14-453 | Jornada mais ampla de estratégia e operação; uma tela de transição da Ativação | [DESENHADO] primeira proposta visual, **não** validação da Fase 0 |
| **`Etapa 0 - Ativacao.png`** | Anexo desta conversa, sem URL pública | Diagrama de fontes → ingresso/organização → conhecimento → prontidão | [ARQUITETURA DESENHADA], não UI concluída |
| **`arquitetura_da_plataforma_v2_fase_0.png`** | Anexo desta conversa | Diagrama ampliado da Fase 0 | [ARQUITETURA DESENHADA] |
| **`arquitetura_ativacao_beta_final.mmd`**, **`fase_ativacao_simplificada.mmd`** | Anexos desta conversa | Propostas de fluxos de entrada/controle/prontidão | [DIAGRAMAS], parte da arquitetura possui passos não testados |

**Não foram recuperados IDs de frames verificáveis para a Fase 0**, nem um FigJam público, nem um protótipo clicável diferente dos links acima. O Codex deve pedir acesso ao arquivo ou inspecioná-lo diretamente antes de fixar os nomes/números finais dos frames.

# 5. Workflows n8n da Ativação — visão funcional, não descrição de nodes

Há **três nomes de workflow efetivamente mencionados como entregas da BETA**, conforme o histórico da construção. O registro de testes anteriores e desta conversa indica que foram construídos/testados em simulações, mas **não prova integração integral com o frontend ou produção**.

| Nome preservado | Função percebida no produto | Estado que se pode sustentar | O que o Codex não deve presumir |
|---|---|---|---|
| **`ATV-ENT-ARQUIVO` — Entrada de Arquivos** | Receber material do cliente para compor o contexto e servir à triagem | [CONSTRUÍDO/TESTADO em cenário simulado] | Que todo formato e upload real do frontend estejam ligados, ou que a aceitação documental esteja finalizada |
| **`ATV-IA-DOCUMENTOS` — Definir Documentos Obrigatórios** | Ajudar a identificar o que deve ser solicitado e o que falta conforme o escopo/contexto | [CONSTRUÍDO/TESTADO em simulação, relatado] | Que a definição de obrigatoriedade por cliente e o gate humano estejam homologados |
| **`ATV-CTL-ATIVACAO` — Controle da Ativação** | Acompanhar condições de prontidão e pendências para liberar o próximo passo | [CONSTRUÍDO/TESTADO em simulação, relatado] | Que o status exibido na UI, aprovação humana e eventual callback estejam funcionando ponta a ponta |

O diagrama **`arquitetura_ativacao_beta_final.mmd`** registra ainda nomes como **`ATV-ENT-REUNIAO`**, **`ATV-ENT-INTEGRACAO`**, **`ATV-CTL-ARTEFATO`**, **`ATV-PRC-CONHECIMENTO`**, **`ATV-IDX-CONHECIMENTO`**, **`ATV-VAL-PRONTIDAO`** e **`ATV-ORQ-ATIVACAO`**. **[PROPOSTO/DESENHADO]** Esses nomes pertencem a uma decomposição da arquitetura beta e **não podem ser promovidos a workflows implementados** sem exports/testes correspondentes. A existência de um *diagrama de fluxo* não é comprovante de execução.

**Testes funcionais encontrados:** há documento fictício **`documento_teste_ativacao_cliente.pdf`** com seções sobre objetivos, posicionamento, fontes, riscos e pendências; saídas em `Texto colado(1).txt` a `(4).txt` mostram recuperação de trechos sobre decisões declaradas, hipóteses, disponibilidade de fontes e pendências com referência às seções. **Isso demonstra experimentação de ingestão/recuperação**, não certifica que o sistema já aplica automaticamente o gate de autorização real. As informações do cliente fictício não são requisitos aplicáveis a clientes reais.

**Estados e exceções relevantes à pessoa usuária:** recebendo, analisando, precisando revisão, fonte indisponível, processamento com erro, pendência bloqueadora, conclusão liberada. A nomenclatura aqui é descritiva de UX; não representa payload ou enum técnico recuperado.

# 6. Briefing, documentos e Base de Contexto

**[ACORDADO]** Os documentos não devem ser coletados por meio de checklist universal que ignora a atividade do cliente. A coleta deve partir do escopo e das lacunas. A agência deve poder complementar informações posteriormente e entender quais itens realmente impedem o início.

**Grupos de informações previstos no método (não necessariamente todos obrigatórios):**

- **Mandato e escopo:** contrato, proposta, objetivos contratados, exclusões e riscos da entrega.
- **Empresa e posicionamento:** produtos/serviços, modelo de negócio, prioridades, marcas, território, concorrência, proposta de valor e histórico.
- **Marca e expressão:** manual de identidade visual/brand book, tom de voz, palavras proibidas, cores, ativos, políticas de uso.
- **Públicos e públicos internos:** público atual e desejado, influenciadores, decisores, stakeholders e evidências de pesquisas existentes.
- **Comunicação e operação:** canais, campanhas, calendário editorial, frequência, fornecedores, fluxo de aprovação.
- **Dados e aprendizado anterior:** relatórios, métricas existentes, CRM, decisões anteriores, aprendizados.
- **Riscos e governança:** compliance, restrições jurídicas, mensagens sensíveis, regras de autorização, canais oficiais e SLA.

**Exemplo de obrigatoriedade contextual:** notas de 21/10 e 23/10 citam **briefing e manual de marca** como documentos críticos para a operação de comunicação; o documento metodológico classifica como obrigatórios para *Observar* os insumos indispensáveis à investigação e separa outros que só são indispensáveis antes de *Executar*. Portanto, **não considerar absolutamente todo documento de marca, toda rede social ou toda licença obrigatória para concluir a Ativação em qualquer contrato**.

**Distinção de qualidade que deve aparecer na UX:**

1. **Enviado/recebido:** arquivo chegou; ainda pode não estar legível.
2. **Processado:** o conteúdo foi extraído/analisado; não significa correto.
3. **Classificado/contextualizado:** conteúdo identificado quanto ao tipo, origem, assunto e cliente; classificação pode exigir revisão.
4. **Aprovado/adequado ao uso:** material aceito pela pessoa competente ou por regra validada; confidencialidade respeitada.
5. **Requisito obrigatório atendido:** o conteúdo aprovado realmente cobre uma exigência específica do escopo.

Na reunião de 28/09, foi defendida **conferência humana de classificação documental**, especialmente para materiais coletados automaticamente. A autonomia total de agentes foi colocada como objetivo futuro; não tratar como estado implementado. A distinção entre **percepção/hipótese interna** e **fato comprovado** também precisa permanecer explícita no material (ex.: “o público considera caro” sem pesquisa = hipótese, não diagnóstico).

# 7. Pessoas, responsabilidades, governança e acesso

**Distinção central:** papel no cliente/contrato (patrocinador, decisor, ponto focal, aprovador, responsável por arte/legenda) **não equivale automaticamente** ao papel de acesso no SaaS (`admin`/`team`).

| Papel funcional | Responsabilidade discutida | Status |
|---|---|---|
| **Patrocinador** | Legitimidade, patrocínio e prioridade | [MÉTODO] |
| **Decisor executivo do cliente/mandato** | Aprovar escopo, objetivos e autorização de início | [ACORDADO como governança] |
| **Estrategista da agência** | Alinhar contexto, perguntas, expectativas, objetivos e evidências | [ACORDADO como método] |
| **Atendimento/operação** | Reunir materiais, participantes, acessos, prazos e pendências | [ACORDADO como método] |
| **Responsáveis de produção** | Futuramente trabalhar no Kanban; não precisam ser redefinidos a cada ciclo | [ACORDADO] |
| **Agente de Ativação / IA** | Coletar, organizar, sinalizar lacunas e preparar revisão | [PROPOSTO/TESTES PARCIAIS]; não assume aprovação humana |
| **Admin/Equipe da plataforma** | Permissões de conta e acesso às telas | [REAPROVEITAMENTO da V1]; regras finas da Ativação ainda pendentes |

**Limite inegociável na metodologia:** um agente não deve, por conta própria, aceitar contrato, alterar escopo, autorizar gastos, nomear decisores, assumir risco em nome do cliente ou emitir a autorização executiva. A etapa precisa demonstrar **quem aprovou o quê**, e não apenas que o sistema considerou a conta “100%”.

**Comportamento dos clientes na BETA:** o principal percurso é operado pela agência; links autorizados para compartilhamento externo foram discutidos na reunião de 23/10, mas o mecanismo de acesso direto e as permissões para cada etapa não foram demonstrados como implementados.

# 8. Objetivos iniciais — contexto já vigente, não decisão automática da IA

**[ACORDADO explicitamente na conversa mais recente]** Durante a Ativação a agência já configura os **objetivos iniciais**, definidos com base no cliente/contrato. Não deve chegar à primeira execução estratégica sem qualquer direção.

Preservar a distinção entre:

- **Objetivo humano existente/vigente:** já registrado/acordado na Ativação; continua sendo referência mesmo que a IA não gere sugestões úteis.
- **Objetivo ou OKR sugerido pelo OIDEA estratégico:** proposta adicional, revisável, ainda **não** vinculante; só passa a vigente após deliberação humana.
- **Indicador ou resultado-chave:** forma de acompanhar progresso; não equivale a uma entrega de produção (“fazer cinco posts”).

**[ACORDADO em discussões estratégicas]** As propostas de decisão estratégica podem tomar a forma de objetivos SMART/OKRs com número limitado de resultados-chave (nas discussões anteriores, até três por objetivo), responsáveis e prazos, e podem ser editadas. **Não afirmar** que a Ativação necessariamente precisa gerar OKRs completos com três KRs para ficar pronta; ela recolhe objetivos preliminares/vigentes e critérios de sucesso. Valores de investimento de mídia e orçamentos foram abordados, mas seus campos obrigatórios ainda não foram fechados para toda a BETA.

**Transição:** contexto e objetivos da Ativação devem aparecer no Planejamento Estratégico e na criação manual do ciclo. O usuário não deve recadastrá-los.

# 9. Conexões e fontes — experiência esperada

**[ACORDADO]** Conectar **as fontes relevantes ao cliente e ao escopo**, respeitando permissões. Categorias citadas:

- Redes e publicação: Instagram, Facebook, LinkedIn, YouTube; também TikTok, Pinterest, X, Google Business Profile como opções de universo mais amplo.
- Dados e mídia: Google Analytics 4, Meta Ads; menções a Google Ads, Search Console, Tag Manager, CRM, ferramentas de e-mail e sistemas do cliente.
- Documentos/colaboração: arquivos e reuniões, inclusive proposta de Workspace/Google Meet/Gemini, porém a automação completa dessa fonte ainda não foi homologada.

**Reaproveitamento da V1:** o projeto já possuía fluxos de integração por cliente e autenticação/renovação para algumas plataformas, mas disponibilidade exata de cada conector deve ser confirmada na versão do código e ambiente usado pelo Codex. A UI precisa distinguir **não conectado**, **conectado ao recurso correto**, **expirado**, **sem permissão**, **indisponível** e **não aplicável**. O recorte histórico existente não deve ser confundido com “todos os dados que existem na plataforma de origem”.

**Divergência de organização:** na V1 recente, conexões estavam dentro do cliente; em 28/10 foi defendida uma **página centralizada de Integrações**, e em 30/10 houve alinhamento sobre separação de navegação global da agência e contextual do cliente. Isso **não** implica que as credenciais de diferentes clientes devam ser misturadas. É uma decisão sobre **local de gestão no menu**, não propriedade da conexão.

# 10. Gate de prontidão e autorização

**[ACORDADO conceitualmente]** Ativação deve impedir avanço quando faltam condições realmente críticas. A avaliação não é apenas um cálculo de percentual de preenchimento.

**Requisitos centrais documentados:** mandato e escopo claros; objetivo empresarial e contribuição esperada da comunicação identificados; decisor/ponto focal; responsabilidades; decisões já vigentes; restrições; regras de aprovação; fontes essenciais acessíveis; riscos materiais visíveis; registro oficial; permissão humana para iniciar. O método distingue itens obrigatórios para **Observar** de acessos necessários apenas para **Executar**.

**Classificações de pendência encontradas no método:**

| Categoria | Consequência conceitual |
|---|---|
| **Bloqueadora** | Impede a autorização de avanço enquanto não resolvida |
| **Crítica** | Exige dono e prazo; pode ser administrada com ressalva se autorizada |
| **Administrável** | Pode ser resolvida durante o trabalho posterior |
| **Aceita** | Limitação explicitamente assumida por quem tem autoridade |

**Estados do gate previstos no documento `Fase 0 - Ativação_ho.ko Company.pdf`, seção 7:** **autorizado**, **autorizado com pendências**, **devolvido para ajustes**, **bloqueado**, **cancelado**. Esses estados são **referência metodológica**; não declarar que todos estão efetivamente presentes no frontend.

**Bloqueios exemplificados:** nenhum decisor legitimado; pedido reduzido a “produzir peças” sem resultado/objetivo; incompatibilidade entre escopo, prazo e capacidade; falta das fontes indispensáveis; dados sensíveis sem regra de acesso; interpretações divergentes sobre o que foi vendido; autonomia de agente superior à autorizada.

**Atenção UX:** “Ativação autorizada” e “sem pendências” não são sinônimos. A interface deve evidenciar quem autorizou, quais limitações foram assumidas e o que segue pendente. O mecanismo exato de revisão, reabertura e alteração posterior da prontidão **não está fechado**.

# 11. Informações que o usuário deve reconhecer ao abrir o cliente

Este é um mapa **informacional**, não um modelo de dados:

- Identidade do cliente, empresa, marcas/unidades e contrato/escopo pertinente.
- Situação da Ativação e último passo realizado, sem mascarar falhas.
- Objetivos **vigentes** e origem humana; propostas futuras de IA claramente separadas.
- Pessoas e papéis relevantes para o trabalho; fonte de autorização.
- Documentos disponíveis, sua utilidade, validade e eventuais problemas.
- Conexões e fontes relevantes com situação atual.
- Pendências por importância, efeito sobre o gate e próximo responsável.
- Riscos, restrições, exclusões e regras de aprovação.
- Próxima ação clara: continuar a coleta, revisar, pedir aprovação ou iniciar OIDEA estratégico.

**Não sugerir ao Codex que todas essas informações exijam um card, widget ou tela nova.** A hierarquia e densidade serão examinadas no design.

# 12. Relação entre módulos e experiência de navegação

A reunião de 30/10 estabeleceu **páginas de gestão da agência no nível superior** e **contexto por cliente no nível inferior**; o usuário posteriormente pediu reorganização do menu mantendo a linguagem visual atual.

A Ativação vive dentro da jornada do cliente; **Base de Contexto**, **Clientes & Integrações**, **Equipe** e painéis globais são ferramentas relacionadas, mas não sinônimos da Ativação. A experiência deve usar pontos de entrada existentes sem repetir o mesmo documento/cliente em dois cadastros.

A conclusão da Ativação não deve lançar automaticamente um ciclo operacional: primeiro há a execução estratégica inicial; a **agência cria manualmente o ciclo com período e objetivos vigentes**. Quantidades de posts, pauta e calendário de produção não são exigidos ao criar esse ciclo.

# 13. Qual parte já foi demonstrada e qual ainda precisa ser vista

| Tipo de evidência | O que há | O que não prova |
|---|---|---|
| **Figma de 29/09 e atualização** | Páginas da Fase 0 e subdivisão de entrada | Experiência final validada ou conectada |
| **Reuniões de 14/09 a 30/10** | Diretrizes funcionais de escopo, pessoas, documentos, gate, objetivos e menu | Implementação técnica integral |
| **Três workflows n8n citados como BETA** | Ingestão documental, definição de documentos, controle de Ativação em simulação | UX real com estado persistido e autorização final |
| **Documento fictício e saídas de recuperação** | Evidência de processamento e recuperação de informações contextualizadas | Avaliação factual de cliente real ou gate de produção |
| **V1 com clientes, documentos e conexões** | Partes reaproveitáveis | Onboarding V2 pronto |
| **Diagramas da arquitetura beta** | Visão da cadeia de informação e prontidão | Que todos os blocos existam como serviços operando |

# 14. Decisões acordadas — com fonte e grau de certeza

| ID | Acordo | Origem resumida | Impacto em UX |
|---|---|---|---|
| A01 | Foco inicial da V2 na operação interna da agência | Semana 1, 14/09 | Funcionário da agência é o usuário primário |
| A02 | Ativação padronizada antes da primeira investigação, com gate | Semana 3, 28/09 | Não avançar ignorando lacunas críticas |
| A03 | Dividir informações entre Contexto e Operação, com entradas Documentos/Configuração/Conexões | Semana 3, 28/09 e documento Fase 0 | Organização informacional clara, não formulário único desordenado |
| A04 | Combinar orientação/checklist humano com validação assistida por IA | Semana 3, 28/09 | IA ajuda, pessoa conduz e aprova |
| A05 | O que é obrigatório depende do escopo e da etapa | Documento Fase 0, seções 5–8 | Não exigir universalmente toda integração |
| A06 | Ativação não é diagnóstico nem produção de estratégia pela IA | Documentos metodológicos Fase 0 / Detalhamento | Observar e Decidir vêm depois |
| A07 | A Ativação reúne objetivos humanos iniciais | Decisão explícita da conversa subsequente ao Figma | Não começar do zero nem exigir reaprovação automática |
| A08 | Depois da Ativação, executar análise estratégica inicial antes de começar ciclo rotineiro | Conversa UX recente | Transição orientada, reaproveitando contexto |
| A09 | Propostas da análise estratégica inicial são complementares, não obrigatórias | Conversa UX recente | Sem gate extra para aceitar sugestão |
| A10 | O primeiro ciclo operacional é criado manualmente com período e objetivos | Conversa UX recente | Não automatizar criação; não exigir plano de produção |
| A11 | A navegação precisa separar visão da agência de trabalho contextual por cliente | Reuniões de 30/09 e 30/10 + conversa recente | Não misturar telas administrativas e operacionais |
| A12 | Configurar responsáveis de cliente uma vez e reutilizá-los nos ciclos | Brainstorming 26/10 | Evitar duplicação de setup |

# 15. Propostas e ideias que NÃO estão validadas como parte pronta da Ativação

| Proposta | Estado / benefício | O que verificar antes de adotar |
|---|---|---|
| Central de Controle com percentuais/níveis de saúde da conta (menos de 30% crítico, acima de 75% excelente) | [PROPOSTO em 30/09] Leitura rápida de lacunas | Se faixas são úteis/aceitas e se não mascaram gate qualitativo |
| Captura automática de reuniões via Gmail/Meet/Workspace e documentos | [DISCUTIDO] Menos trabalho manual | Consentimento, validação humana, qualidade de classificação e fase de lançamento |
| Acesso do cliente por links externos a todas as etapas | [ACORDADO em reunião 23/10 como intenção, NÃO VERIFICADO como produto] | O que é compartilhável na BETA e quem autoriza |
| Workshop de Ativação com experiência própria e geração automática de charter | [MÉTODO/PROPOSTO] Registro estruturado | Precisa existir uma tela? Pode continuar via documentos/reuniões? |
| Autonomia total do agente para validar tudo | [OBJETIVO FUTURO, não aprovado como substituição humana] | Contraria autorização humana exigida |
| Checklist e health score universais | [NÃO ACORDADO] Facilidade aparente | Difere por escopo, pode induzir falso positivo |
| Reabrir Ativação a cada ciclo operacional | [VERSÃO METODOLÓGICA MAIS AMPLA] | Conflita com decisão posterior de Ativação inicial única do cliente |
| Início automático de ciclos após autorização | [VERSÕES ANTIGAS de fluxo] | Contraria decisão recente de criação manual |

# 16. Contradições, versões e evolução das discussões

1. **Ativação uma vez vs. revisão recorrente.** O método completo fala de reativação/atualização quando há mudança importante ou novo OIDEA estratégico. A orientação mais recente da conversa é **Ativação completa uma vez por cliente**, e apenas atualizações de contexto quando necessário; não refazer onboarding mensal. A exceção para grande mudança contratual deve ser combinada em UX.
2. **Ativação não cria estratégia vs. objetivos iniciais.** Não é contradição se distinguirmos **registrar objetivos já declarados/acordados** de **inventar uma nova estratégia**. O OIDEA estratégico seguinte poderá sugerir novas metas.
3. **Gate após documentos críticos vs. conectividade completa.** Reuniões enfatizaram manual de marca, briefing e dados; o método diz que exigências variam com o contrato e entre Observar e Executar. Portanto, “todas as integrações conectadas” não é um gate universal.
4. **Central de Controle / score de saúde vs. critério qualitativo.** Percentual foi proposto; o método considera ambiguidades, autoridade, evidências e risco. Não permitir que um score substitua aprovação humana.
5. **Integrações dentro de cada cliente vs. gestão centralizada.** Revisão de 28/10 quis página global de Integrações; outra arquitetura mantém autorização/recurso específico de cada cliente. Diferenciar navegação de propriedade da conexão.
6. **Telas originais do Figma vs. atualizações 02B, 04B, 04C.** Usar a versão mais recente do Figma para revisão, sem assumir que a primeira versão foi formalmente rejeitada ou que a última foi homologada.
7. **Autonomia da IA na classificação vs. supervisão.** A IA foi apresentada como facilitadora; reunião de 28/09 defendeu avaliação humana inicialmente. Não fechar sozinho o momento em que a automação passa a dispensá-la.
8. **Processo de reabertura estratégica e validação pelo cliente.** O encontro de 28/10 mencionou validação do cliente antes de reiniciar ciclo estratégico; a conversa mais recente não exige aprovação extra para aceitar propostas iniciais de IA nem criação automática do ciclo operacional. Tratar como processos distintos e pendentes de desenho específico.
9. **Cronogramas de setembro/outubro vs. datas finais posteriores.** São registros históricos; não converter datas anteriores em estado atual do produto.

# 17. Lacunas UX a discutir com Codex antes do design final

Prioridade alta:

1. **Onde começa a Ativação?** Em “Novo cliente”, na visão do cliente ou numa ação específica de onboarding? Como reentrar num processo incompleto sem duplicar cliente?
2. **Quais entradas são necessárias no primeiro contato?** Distinguir dados para abrir cadastro de dados que podem ser preenchidos depois.
3. **Quem vê e edita cada parte?** Papel administrativo do SaaS vs. papel funcional no contrato; quais perfis podem concluir/autorizar.
4. **Qual item bloqueia e qual não bloqueia?** Critérios aplicáveis ao caso de comunicação e exceptions por contrato; não lista fixa universal.
5. **Como distinguir documento recebido, analisado, revisado, válido e requisito atendido?** Sem falsas mensagens de conclusão.
6. **Como mostrar pendências com dono e próxima ação?** Evitar checklist gigantesco e saúde percentual como verdade absoluta.
7. **Como exibir a revisão humana do gate?** O que a pessoa lê, confirma e como recebe a confirmação da autorização.
8. **Qual é o estado exato ao terminar?** Cliente ativado e objetivos vigentes; CTA para **iniciar análise estratégica inicial**, não para abrir um ciclo automaticamente.

Prioridade média:

9. Como reaproveitar documentos e integrações de clientes V1 sem pedir novos uploads e logins?
10. Como lidar com atualizações e perda posterior de validade de documento/conexão após uma Ativação autorizada?
11. A página global de Integrações terá filtros por cliente? Qual percurso contextual leva até ela?
12. Um item crítico pode ter autorização com pendências? Em quais condições?
13. Existe tela dedicada para workshop/charter ou basta organizar seus outputs no contexto do cliente?
14. O que um cliente externo pode fornecer/consultar por link e com qual aprovação humana?
15. Qual versão do Figma de 29/09 deve ser considerada baseline do redesign?

# 18. Material recomendado para o próximo agente e ordem de revisão

**Síntese para colar no início da conversa com o Codex:**

> Você trabalhará sobre a ho.ko AI.nalytics V2, cujo usuário principal inicial é a agência. A Etapa 0 — Ativação não é só cadastro: reúne contexto, documentos, acessos, objetivos humanos iniciais, escopo, responsáveis, restrições e autorização para iniciar a investigação. A coleta é progressiva e contextual; a IA ajuda a classificar e detectar lacunas, mas não substitui validação humana. Depois da Ativação, a agência inicia uma execução estratégica inicial que pode sugerir objetivos adicionais; as propostas não se tornam obrigatórias. O primeiro ciclo operacional é criado manualmente e não exige planejamento de conteúdo no ato. Este dossiê descreve a UX e os acordos; **não implemente até comparar com o Figma atual e o código existente**.

**Arquivos para o Codex consultar, por prioridade:** `Fase 0 - Ativação_ho.ko Company.pdf`, `Detalhamento de fases_ho.ko Company.pdf` (trecho Fase 0), `Semana 3_ Fase Interpretação...pdf`, `Etapa 0_ Review Técnico...pdf`, `Etapa 3_ Review Técnico...pdf` (21/10), `ho.ko AI.nalytics - Review Técnico...pdf` (28/10), `ho.ko AI.nalytics - Design Review...pdf` (30/10), prints de UX e o Figma Fase 0. `documento_teste_ativacao_cliente.pdf` é **somente cenário fictício**, não fonte da verdade de requisitos. 

**Material faltante para verificar:** exports atuais de `ATV-ENT-ARQUIVO`, `ATV-IA-DOCUMENTOS`, `ATV-CTL-ATIVACAO`; acesso de leitura aos frames concretos do Figma; confirmação de qual rota/tela V1 será usada para iniciar/retomar a Ativação; status real da conexão n8n→UI.

**Reunião UX recomendada:** (1) rever jornada de cliente novo/existente; (2) validar ordenação de Documentos, Configuração e Conexões; (3) decidir critérios de bloqueio por escopo; (4) aprovar linguagem de estados de documentos; (5) definir ação de revisão humana e gate; (6) validar transição ao OIDEA estratégico inicial; (7) decidir exceções de atualização/reativação; (8) caminhar pelo Figma e identificar ajustes antes de qualquer implementação.

# 19. Anexo factual e terminologia preservada

**Nomes de tela/etapa que apareceram:** Etapa 0 / Fase 0 — Ativação; Clientes & Integrações; Novo cliente Wizard; Cliente Visão Geral; Dados iniciais; Documentos e Contexto; Quality Gate; 02B Entrada operacional; 04B Configuração; 04C Conexões e Acessos; Fluxo de navegação Fase 0; Central de Controle; Base de Contexto; Planejamento Estratégico; primeira execução estratégica; Ciclo operacional.

**Nomes de workflows citados como BETA:** `ATV-ENT-ARQUIVO`, `ATV-IA-DOCUMENTOS`, `ATV-CTL-ATIVACAO`. **Nomes presentes somente em arquitetura planejada:** `ATV-ENT-REUNIAO`, `ATV-ENT-INTEGRACAO`, `ATV-CTL-ARTEFATO`, `ATV-PRC-CONHECIMENTO`, `ATV-IDX-CONHECIMENTO`, `ATV-VAL-PRONTIDAO`, `ATV-ORQ-ATIVACAO`.

**Termos de pendências:** bloqueadora, crítica, administrável, aceita. **Estados conceituais de autorização:** autorizado, autorizado com pendências, devolvido para ajustes, bloqueado, cancelado.

**Fontes do conceito:** reunião de 14/09 (foco interno e subagentes); reunião de 28/09 (divisão Contexto/Operação, gate e revisão humana); reunião de 30/09 (Figma Fase 0 e Central de Controle); reunião de 21/10 (documentos críticos e decisão humana); reunião de 23/10 (compartilhamento e decisões editáveis); reunião de 26/10 (responsáveis reaproveitados); reunião de 28/10 (integrações centralizadas); reunião de 30/10 (menu global/agência + contexto por cliente); conversa posterior (OIDEA estratégico inicial e criação manual do ciclo).

**Links brutos recuperados:**

- Fase 0 — Ativação: https://www.figma.com/design/xtp1DrfdUcuFUCZyDruaLt?utm_source=chatgpt.com
- Fase 1 — Observação: https://www.figma.com/design/eZUK5Jv9jXgUPRyOifSA4D?utm_source=chatgpt.com
- Redesenho V2 (página do arquivo Fase 1): https://www.figma.com/design/eZUK5Jv9jXgUPRyOifSA4D?node-id=14-453

**Termos que não devem ser misturados:** Ativação vs. Observação; “objetivo inicial aceito” vs. “meta sugerida pela IA”; papel de negócio vs. permissão de login; documento enviado vs. documento válido; conexão existente vs. fonte acessível; dado declarado vs. evidência confirmada; gate de Ativação vs. gate de qualidade de entrega no Kanban; ciclo estratégico inicial vs. ciclo operacional mensal; escopo de cliente vs. escopo da agência.

---

**Conclusão do handoff:** a decisão prioritária agora **não é desenhar APIs**; é verificar a experiência real da Fase 0 e garantir que uma pessoa da agência consiga entender **o que precisa coletar, por que precisa, o que falta, quem decide, quando está pronta e para onde vai depois**. Os passos e parâmetros que não constam das fontes não devem ser criados pelo Codex como se fossem fatos históricos.
