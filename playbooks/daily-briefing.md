# Playbook: Daily Briefing

> Quando Brendon digitar "briefing", execute este playbook.

## Procedimento

### 1. Compromissos do dia
- Leia /commitments/TRACKER.md
- Liste compromissos com prazo hoje ou vencidos
- Destaque vencidos com ⚠️

### 2. Reuniões do dia
- Se houver notas de prep em /meetings/, traga o resumo
- Liste reuniões conhecidas e material de preparação

### 3. Follow-ups pendentes
- Busque action items em aberto nos últimos 5 arquivos de /meetings/
- Liste os que ainda não foram marcados como concluídos

### 4. Compromissos delegados
- Verifique /commitments/TRACKER.md seção "delegados"
- Liste os que vencem nos próximos 3 dias

### 5. Alertas
- Projetos com status 🔴 em CLAUDE.md
- Compromissos vencidos sem follow-up
- Sinais de atenção com pessoas

## Formato de saída

```
📋 BRIEFING — [Data]

⚠️ VENCIDOS:
- [compromisso] — com [quem] — venceu em [data]

📅 HOJE:
- [HH:MM] [Reunião] — prep: [status]
- Compromisso: [desc] — prazo: hoje

📌 FOLLOW-UPS PENDENTES:
- [ação] — de [reunião em data] — @[responsável]

👥 DELEGADOS (próximos 3 dias):
- [compromisso] — @[pessoa] — vence [data]

🚨 ALERTAS:
- [alerta se houver]
```
