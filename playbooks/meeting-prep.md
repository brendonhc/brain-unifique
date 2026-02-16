# Playbook: Meeting Prep

> Quando Brendon digitar "prep [nome da reunião ou pessoa]", execute este playbook.

## Procedimento

### 1. Identificar o contexto
- Busque a pessoa/reunião em /contacts/ e /meetings/
- Identifique últimos encontros e o que ficou pendente

### 2. Levantar pendências
- Busque compromissos abertos com essa pessoa em /commitments/
- Busque action items pendentes das últimas reuniões com ela
- Busque decisões em andamento que envolvam essa pessoa

### 3. Contexto dos projetos
- Verifique em /projects/ quais projetos envolvem essa pessoa
- Traga status atualizado

### 4. Montar pauta sugerida
- Pendências a resolver (mais urgentes primeiro)
- Updates de projetos em comum
- Pontos que Brendon precisa abordar
- Espaço para tópicos da outra pessoa

## Formato de saída

```
🎯 PREP — [Reunião/1:1] com [Nome] — [Data]

👤 CONTEXTO:
- Último encontro: [data] — [resumo em 1 linha]
- Relação: [tipo]

⏳ PENDÊNCIAS ABERTAS:
- [compromisso/action item] — desde [data]

📊 PROJETOS EM COMUM:
- [Projeto]: [status em 1 linha]

📋 PAUTA SUGERIDA:
1. [Tópico] — motivo: [por que abordar]
2. [Tópico] — motivo: [por que abordar]
3. Espaço aberto para [Nome]

⚠️ PONTOS DE ATENÇÃO:
- [Se houver sinais, riscos, tensões]
```
