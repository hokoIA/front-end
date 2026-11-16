# Etapa 0 — plano executável do frontend

**Nota de transição (2026-11-16):** os checkboxes abaixo registram a prévia visual aprovada, não o estado integrado atual. Com a preparação da E1 em `ACTIVATION_CROSS_STACK_PLAN.md`, as linhas mockadas saíram da lista de produção e a rota numérica passou a abrir o detalhe básico real. Os arquivos de protótipo permanecem como referência de design, sem rota pública para seus IDs fictícios. O checklist de execução vigente está no plano integrado; o mesmo agente executa Frontend, Gateway, Analyze e n8n.

**Status:** checklist de execução visual em andamento. **Escopo:** somente o repositório Next.js. Este documento organiza os acordos da conversa de design; não define contratos, schemas ou comportamento já integrado. A fonte de verdade aprovada permanece em `PRODUCT_SOURCE_OF_TRUTH.md`. Uma caixa marcada indica implementação visual no código, não aprovação de produto nem integração real.

## Resultado da entrega

Uma jornada navegável em que o Admin encontra clientes **Em Ativação na lista existente de `/clientes`**, abre diretamente o detalhe de um cliente, consulta o andamento, visualiza entradas de materiais e conexões e percorre a avaliação até a autorização visual. Os estados sem integração são mocks locais, tipados e identificados na interface; nenhuma ação simulada promete persistência real.

O menu principal não muda. Clientes em Ativação são tratados fora do seletor do workspace operacional no protótipo. A restrição real de acesso e a separação dos clientes dependerão de suporte posterior do Gateway; o frontend não inferirá status de Ativação a partir de quantidade de documentos ou conexões e não tratará um cliente real da V1 como ativando por padrão.

## Percurso que deve funcionar no protótipo

1. Admin abre **Clientes & Integrações** e vê clientes mockados **Em Ativação** na própria lista, com nome, situação e conexões próprias. As linhas mockadas têm identificação discreta; os indicadores acima consideram somente clientes reais. Busca e filtro de status alcançam os mocks. A carteira real e seus fluxos permanecem funcionais.
2. **Novo cliente** mantém o cadastro básico e curto do modal real da V1. O encaminhamento do novo registro à Ativação ainda depende de status e contrato no Gateway; não fingir que a API atual atribuiu status V2.
3. Ao abrir o cliente em Ativação, o Admin vê primeiro uma síntese: mínimos cobertos, indicados manualmente, pendentes e em processamento; materiais e conexões; último resultado da avaliação; ações **Adicionar material** e **Conectar plataforma**.
4. **Materiais** mostra o acervo de arquivos, atas e textos. Um envio pode cobrir vários mínimos e cada mínimo mostra o material que o sustenta. A prévia mostra estados de processamento, falha e cobertura identificada. A entrada rápida pede o conteúdo, sem tornar autor, setor ou tags obrigatórios na experiência proposta. Envio e classificação reais aguardam integração.
5. Uma indicação manual de cobertura exige um material já enviado e processado, com referência ao trecho ou motivo. A interface distingue essa indicação da identificação automática e da conferência posterior.
6. **Conexões** apresenta conectores e estados fictícios, com ações desabilitadas. A falta de conexão aparece como limitação possível, não como bloqueio universal da Ativação. Os fluxos OAuth reais permanecem na carteira existente.
7. **Avaliação** explica por que o botão está indisponível enquanto algum mínimo não está coberto ou seu material não terminou de processar. Clientes mockados distintos mostram avaliação em andamento, falha técnica, solicitações e parecer. Nova rodada após complementação permanece como refinamento visual.
8. O Admin pode consultar a entrada de materiais ou autorizar localmente no detalhe mockado. Se houver limitações apontadas, a confirmação mostra quais são e oferece **Autorizar mesmo assim**, sem justificativa obrigatória. A mudança não é persistida e não modifica a lista real; a transição durável para **Ativo** depende de contrato futuro.

## Superfícies e hierarquia visual

| Superfície | Conteúdo prioritário | Ações | Regra de desenho |
|---|---|---|---|
| Lista em `/clientes` | Linhas Em Ativação identificadas no mesmo contêiner da lista atual; carteira real abaixo | Novo cliente V1; continuar Ativação mockada | Preservar filtros, edição e conexões atuais para clientes reais; indicadores reais não incluem mocks |
| Visão geral da Ativação | O que já existe, o que falta, o que está processando e o próximo passo | Adicionar material; conectar plataforma; abrir avaliação | Síntese qualitativa; contagens auxiliam orientação, não simulam prontidão |
| Materiais | Mínimos e suas fontes primeiro; acervo completo em seguida | Enviar arquivo/texto; revisar indicação; consultar material | Não exigir um arquivo por mínimo nem metadados manuais desnecessários |
| Conexões | Plataformas, recursos e estado | Conectar/renovar via fluxo existente quando houver cliente real autorizado | Sem inventar conector ou OAuth funcional no mock |
| Avaliação | Solicitações com motivo e gravidade; parecer detalhado; histórico de rodadas | Complementar; solicitar/repetir avaliação; autorizar | Processamento assíncrono sem porcentagem fictícia |

A navegação entre as quatro áreas é local à Ativação. No protótipo, o estado da área é local e volta à Visão geral ao recarregar; navegação retomável por URL é uma melhoria pendente. Sidebar, topbar, menu mobile, Montserrat, tokens `--hk-*`, Radix e componentes `components/ui` seguem o padrão atual. A página deve manter ação primária visível no mobile sem esconder conteúdo. Não criar uma segunda sidebar.

### Organização sugerida para a implementação visual

- `app/(app)/clientes/ativacao/[customerId]/page.tsx`: detalhe direto de um cliente mockado; IDs de mock nunca são enviados à API real.
- `features/activation/`: linhas da lista, Visão geral, Materiais, Conexões e Avaliação. Os clientes e estados ficam em `mock-customers.ts`, separados das queries reais.
- `/clientes`: exibir linhas mockadas no contêiner da lista atual com identificação discreta; não mudar a criação da V1.
- Depois da aprovação visual e da existência de status real, adaptar a composição à rota contextual do cliente e à lista real. Essa ligação não faz parte desta entrega.

Essa fronteira permite revisar a jornada inteira com cliques e estados coerentes, sem que um botão demonstrativo chame a API V1 ou altere um cliente real. A prévia não deve ser apresentada como fluxo funcional de produção.

## Marcos de construção dentro de uma entrega visual

### A. Isolar os dados visuais

- [x] Criar tipos de apresentação para cliente em Ativação, mínimos, materiais, cobertura, conexões e avaliação.
- [x] Criar clientes mockados distintos: recém-iniciado; coleta parcial; arquivo processando; falha; indicação manual; pronto para avaliação; avaliação em andamento e solicitações. A autorização pode ser percorrida localmente no detalhe.
- [x] Identificar a área com um aviso discreto de dados de exemplo. Não misturar respostas reais de clientes com status ou pareceres fictícios.
- [x] Acessar cada estado abrindo o cliente correspondente na lista, sem seletor de cenários, `fakeAPI` ou timers simulando execução.
- [x] Manter as transições de avaliação somente no estado local do detalhe mockado.
- [ ] Encaminhar o cadastro básico real para a Ativação somente quando existir status e contrato no Gateway.

### B. Montar o percurso completo

- [x] Inserir linhas de clientes mockados na lista existente de `/clientes`, com o mesmo alinhamento visual e status próprio, preservando a listagem real.
- [x] Aplicar busca e filtro de status às linhas mockadas; manter indicadores reais separados.
- [x] Preservar o modal real de cadastro curto da V1 sem novos campos.
- [x] Criar a rota e a composição dedicada de Ativação sob `app/(app)/clientes/`, com retorno claro à lista.
- [x] Criar Visão geral, Materiais, Conexões e Avaliação como subvisões da mesma jornada, com navegação local e títulos compreensíveis.
- [x] Criar objetivo inicial declarado como campo curto na experiência visual; ele não exige OKRs/KRs completos.
- [x] Representar indicação manual de um mínimo vinculada a material processado e trecho/motivo, apenas no estado local da prévia.
- [x] Reusar componentes de UI, tokens e shell existentes sem disparar chamadas novas a n8n ou Python.
- [x] Abrir o detalhe mockado diretamente por URL individual e voltar à lista de `/clientes`.
- [ ] Revisar o percurso de nova avaliação após complementação.
- [ ] Integrar as superfícies aos componentes funcionais de documentos e OAuth para um cliente real, quando houver contrato e status V2.

### C. Ajustar estados e acessibilidade

- [x] Representar vazio, carregando autenticação, falha de material, sem permissão, processamento e avaliação demorada nos cenários da prévia.
- [x] Mostrar o motivo das principais ações indisponíveis em texto.
- [ ] Revisar foco, rótulos, navegação por teclado e leitura mobile no navegador.
- [ ] Conferir contraste e densidade com a sidebar azul-marinho atual em desktop e mobile.

### D. Revisão conjunta da jornada

- [x] Responsável revisou o fluxo visual atual e autorizou prosseguir com a etapa de dados/integração em 2026-11-16.
- [ ] Conferir o percurso inteiro no mobile: cliente novo sem materiais; cliente retomado com ata, arquivo e conexão; cliente com avaliação que pede complementação.
- [ ] Registrar e aplicar correções aprovadas de hierarquia, texto e cliques antes do handoff técnico.

## Reuso e cuidados no código atual

- `features/customers/components/create-customer-flow.tsx`: o modal básico cria hoje um cliente real via API. Não fazer a confirmação atual fingir que recebeu status V2.
- `features/customers/views/customers-hub-view.tsx` e `customer-list-item.tsx`: preservar lista, filtros, ações e estados atuais. A nova lista de Ativação exige dados próprios; mock isolado no protótipo.
- `features/customers/utils/compute-readiness.ts`: sua prontidão conta integrações com total padrão. Não utilizá-la para o gate da Ativação.
- `features/context-base/context-base-view.tsx`: contém entrada de arquivo e texto, mas exige metadados e possui integração/mode mock próprios. Extrair somente peças de UI reutilizáveis ou criar composição fina; não alterar o contrato V1 para parecer que a classificação V2 existe.
- `features/integrations/components/platform-connect-flow.tsx` e cards: preservar OAuth e seleção de recurso por cliente. Em cenário fictício, mostrar estados de apresentação sem acionar conexão real.
- `components/providers/selected-customer-provider.tsx`: não inserir cliente fictício no provider nem trocar a seleção atual para montar o protótipo.

## Critérios de aceite visual

- O Admin encontra um processo em andamento e consegue explicar, em poucos segundos, o que já foi coletado, o que falta e o que fazer em seguida.
- O cadastro permanece curto; a coleta ocorre em página dedicada e pode ser retomada.
- O protótipo demonstra cobertura de vários mínimos por um material, indicação manual vinculada e diferença entre recebido, processado e conferido.
- O botão de avaliação só aparece disponível no cenário em que todos os mínimos estão cobertos por materiais processados.
- A ausência de uma plataforma não impede, por si só, o cenário de autorização; as limitações são visíveis.
- Solicitações e parecer são legíveis; o Admin pode visualizar complementação e autorização sem justificativa obrigatória.
- Cliente em Ativação não aparece como cliente operacional no cenário V2; cliente ativo não perde seus fluxos existentes.
- Nenhum dado inventado parece produção e nenhuma ação demonstrativa afirma ter salvo, processado ou autorizado no servidor.

## Fora desta entrega

Lista definitiva de mínimos, regras automáticas de classificação, persistência de status, migrações, exclusão coordenada, permissões novas, workflow n8n, avaliação real, integração do Gateway, início real do OIDEA estratégico e alteração da gestão de usuários/equipe ou do menu principal. Essas frentes vêm depois da validação visual da jornada.

## Validação

Antes de entregar o código visual, revisar o diff para preservar auth, RBAC, seleção, clientes, documentos e OAuth. Inspecionar manualmente desktop, sidebar recolhida e mobile, além dos cenários acima. Executar `npm run lint` e `npm run build` quando o responsável do projeto solicitar ou o ambiente permitir; registrar o resultado real sem presumir sucesso. Nesta fase de planejamento, não executar compilação.
