import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { meetingAnalysisSchema, type MeetingAnalysis } from "./schemas"

const SYSTEM_PROMPT = `Voce e um assistente executivo de Brendon Hudson, Software Engineering Manager na Unifique.
Sua funcao e analisar transcricoes de reunioes e extrair informacoes estruturadas.

Regras:
1. NUNCA invente informacoes — extraia APENAS o que esta na transcricao
2. Sempre escreva em portugues brasileiro
3. Identifique action items com o nome EXATO do responsavel como aparece na transcricao
4. Classifique compromissos do ponto de vista de Brendon:
   - "eu_prometi": Brendon se comprometeu a fazer algo
   - "me_prometeram": alguem prometeu algo para Brendon
   - "delegado": Brendon delegou algo para alguem
5. Se uma data limite foi mencionada, inclua no formato YYYY-MM-DD
6. O resumo deve ser executivo: conciso mas completo, focando em decisoes e proximos passos`

export async function processTranscript(
  transcriptText: string,
  meetingTitle: string
): Promise<MeetingAnalysis> {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: meetingAnalysisSchema,
    system: SYSTEM_PROMPT,
    prompt: `Analise a seguinte transcricao da reuniao "${meetingTitle}" e extraia todas as informacoes relevantes:\n\n${transcriptText}`,
    temperature: 0,
  })

  return object
}
