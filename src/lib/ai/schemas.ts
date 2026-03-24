import { z } from "zod/v4"

export const meetingAnalysisSchema = z.object({
  summary: z.string().describe("Resumo executivo da reuniao em 3-5 paragrafos, em portugues"),
  key_topics: z.array(z.object({
    topic: z.string().describe("Nome do topico discutido"),
    description: z.string().describe("Breve descricao do que foi discutido sobre este topico"),
  })).describe("Principais topicos discutidos na reuniao"),
  action_items: z.array(z.object({
    title: z.string().describe("Titulo curto da tarefa/acao"),
    description: z.string().describe("Descricao detalhada do que precisa ser feito"),
    assignee_name: z.string().describe("Nome da pessoa responsavel, como aparece na transcricao"),
    due_date: z.string().optional().describe("Data limite mencionada, formato YYYY-MM-DD, ou vazio"),
    priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  })).describe("Tarefas e acoes identificadas na reuniao"),
  decisions: z.array(z.object({
    title: z.string().describe("Titulo curto da decisao"),
    description: z.string().describe("Descricao da decisao tomada"),
    decided_by_name: z.string().describe("Nome de quem tomou ou anunciou a decisao"),
    impact: z.string().optional().describe("Impacto esperado da decisao"),
  })).describe("Decisoes tomadas durante a reuniao"),
  commitments: z.array(z.object({
    title: z.string().describe("O que foi comprometido"),
    with_whom: z.string().describe("Nome da pessoa envolvida no compromisso"),
    deadline: z.string().optional().describe("Prazo mencionado, formato YYYY-MM-DD"),
    type: z.enum(["eu_prometi", "me_prometeram", "delegado"]).describe("Tipo do compromisso do ponto de vista de Brendon"),
  })).describe("Compromissos firmados durante a reuniao"),
})

export type MeetingAnalysis = z.infer<typeof meetingAnalysisSchema>
