import type { AnalyzeStrategicResponse } from "@/lib/types/analyze";

/** Markdown de exemplo para desenvolvimento (`NEXT_PUBLIC_ANALYZE_USE_MOCK=true`). */
export const MOCK_STRATEGIC_ANALYSIS_MARKDOWN = `## Panorama do período

O intervalo analisado sugere **consolidação de presença** nas plataformas selecionadas, com leitura que deve cruzar volume, qualidade de alcance e coerência narrativa com os objetivos de marca.

### O que parece ter acontecido

- Picos de alcance costumam coincidir com **picos de frequência** ou com conteúdos de maior ressonância emocional.
- Quedas recorrentes podem indicar **fadiga de formato**, mudança de algoritmo ou desalinhamento com a conversa que a marca quer liderar.

### Por que isso importa para branding e negócio

| Dimensão | Leitura |
| --- | --- |
| Marca | A percepção não é só “número alto”, é **consistência** entre promessa, tom e evidências no período. |
| Comunicação | O que performou costuma revelar **o que a audiência está validando** — não apenas o que a equipe preferiu produzir. |
| Negócio | Resultados digitais sustentam **hipóteses de investimento** quando há narrativa causal e comparativo honesto. |

### O que manter, ajustar ou revisar

1. **Manter** formatos e mensagens que sustentaram engajamento *e* alinhamento com posicionamento.
2. **Ajustar** cadência e mix quando o alcance cresce mas a conversão narrativa (leads, intenção, consideração) não acompanha.
3. **Revisar** criativos ou canais onde a queda é estrutural — não pontual.

### Narrativa segura para o cliente

> “No período, priorizamos entender *o que mudou no comportamento da audiência* e *o que isso significa para a estratégia*. Os dados apontam para [hipótese principal]; as próximas ações focam em [decisão], com indicadores de acompanhamento [X, Y].”

---

*Esta é uma resposta simulada para desenvolvimento do front-end.*`;

export function mockStrategicAnalyzeResponse(): AnalyzeStrategicResponse {
  return { result: MOCK_STRATEGIC_ANALYSIS_MARKDOWN };
}
