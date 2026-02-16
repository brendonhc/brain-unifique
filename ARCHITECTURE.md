# Arquitetura Multi-Dispositivo — Executive Brain

> Como acessar seu agente executivo de qualquer lugar, qualquer hora, qualquer dispositivo.

---

## Visão geral

```
┌─────────────────────────────────────────────────┐
│              EXECUTIVE BRAIN (repo .md)          │
│         Fonte única de verdade (GitHub)          │
└──────────┬──────────┬──────────┬────────────────┘
           │          │          │
     ┌─────▼─────┐ ┌──▼──────┐ ┌▼──────────────┐
     │  Claude   │ │ Claude  │ │ Claude Code / │
     │  Projects │ │ Mobile  │ │   Cowork      │
     │ (web)     │ │ (app)   │ │ (desktop)     │
     └───────────┘ └─────────┘ └───────────────┘
      Notebook     Celular      Notebook (modo
      empresa      pessoal      avançado)
```

---

## Camada 1: GitHub como backbone (sincronização)

O repositório `executive-brain/` deve viver em um **repo Git privado**.
Isso garante:
- Versionamento de toda informação (nunca perde nada)
- Acesso de qualquer máquina com git
- Histórico de mudanças (quando algo mudou e por quê)
- Backup automático

### Setup:
```bash
cd executive-brain
git init
git remote add origin https://github.com/[seu-usuario]/executive-brain.git
git add .
git commit -m "Initial setup: executive brain v1"
git push -u origin main
```

### Regra de ouro:
Após cada sessão com Claude onde houve mudanças, faça `git add . && git commit && git push`.
Claude Code pode fazer isso automaticamente para você.

---

## Camada 2: Claude Projects (acesso web — qualquer navegador)

### Setup (uma vez):
1. Acesse https://claude.ai
2. Crie um novo **Project** chamado "Executive Brain"
3. No campo **Project Instructions**, cole o conteúdo completo do CLAUDE.md
4. Faça upload dos arquivos mais críticos como knowledge:
   - commitments/TRACKER.md
   - decisions/INDEX.md
   - Os arquivos de /team/ e /projects/ mais relevantes
5. O limite é ~500 páginas (200K tokens) — priorize os ativos

### Uso diário:
- Abra o Project "Executive Brain" no navegador
- Digite "briefing" → Claude já conhece seus playbooks
- Registre notas de reunião → Claude sabe o formato
- Pergunte "quais compromissos vencem esta semana?" → Claude busca no contexto

### Atualização:
- Toda segunda-feira: atualize os docs do Project com a versão mais recente do repo
- Ou quando houver mudança significativa (novo projeto, mudança de time)

### Vantagem: funciona de QUALQUER navegador, qualquer rede, qualquer máquina.

---

## Camada 3: Claude Mobile (celular — qualquer hora, qualquer lugar)

### Setup:
1. Instale o app Claude no celular (iOS/Android)
2. O app acessa os mesmos **Projects** da conta web
3. Abra o Project "Executive Brain" pelo celular

### Casos de uso no celular:
- **No caminho para reunião**: "prep reunião com [Fulano]"
- **Saindo de reunião**: Ditar notas por voz → Claude organiza
- **Final do dia**: "review commitments" → ver pendências
- **Ideia no trânsito**: "registra: considerar migrar serviço X para Y"

### Dica: Claude no celular + ditado por voz = captura ultrarrápida de contexto.

---

## Camada 4: Claude Code / Cowork (desktop — operações pesadas)

### Setup:
1. Clone o repo na máquina: `git clone [repo-url] ~/executive-brain`
2. Abra com Claude Code: `claude-code ~/executive-brain`
3. Ou use Cowork e selecione a pasta `executive-brain`

### Quando usar:
- **Criar documentos complexos** (apresentações, relatórios, análises)
- **Operações em massa** (reorganizar arquivos, busca profunda, gerar relatórios)
- **Integrar com MCP** (Slack, Calendar, GitHub — requer desktop)
- **Sessões de planejamento** (weekly planning com acesso total aos dados)

### Vantagem: acesso TOTAL ao filesystem + pode rodar código + MCP servers.

---

## Camada 5: MCP Servers (integrações — futuro próximo)

### Servidores recomendados para seu stack:

| Ferramenta | MCP Server | O que faz |
|------------|-----------|-----------|
| Outlook | outlook-mcp | Lê emails, agenda, cria eventos |
| Teams | teams-mcp | Lê mensagens, canais |
| GitHub | github-mcp (oficial) | PRs, issues, atividade do time |
| Slack | slack-mcp (oficial) | Mensagens, canais, resumos |

### Setup MCP (via Claude Code):
```json
// ~/.claude/mcp_servers.json
{
  "github": {
    "command": "npx",
    "args": ["@anthropic/mcp-server-github"],
    "env": { "GITHUB_TOKEN": "ghp_..." }
  }
}
```

### Roadmap de integração sugerido:
1. **Semana 1-2**: Sem MCP — apenas arquivos .md (fundação sólida primeiro)
2. **Semana 3**: Adicionar GitHub MCP (ver PRs, issues do time)
3. **Semana 4**: Adicionar Outlook MCP (emails e calendário)
4. **Mês 2**: Avaliar Slack/Teams MCP (comunicação)

---

## Fluxo diário recomendado

### Manhã (5 min) — qualquer dispositivo
```
Abrir Claude → Project "Executive Brain"
Digitar: "briefing"
→ Claude retorna: compromissos do dia, pendências, alertas
```

### Durante o dia — celular ou web
```
Após reunião:
"Registra reunião com [Nome]: decidimos X, compromisso Y até [data], action Z para [pessoa]"
→ Claude organiza nos formatos corretos
```

### Final do dia (3 min) — qualquer dispositivo
```
"review commitments"
→ Claude lista tudo pendente
"Marca compromisso X como concluído"
→ Claude atualiza tracker
```

### Sexta-feira (15 min) — desktop/Cowork
```
"weekly"
→ Claude gera review completa da semana
→ Sugere prioridades da próxima semana
→ Identifica sinais de atenção
```

---

## Garantias contra alucinação

O sistema é **determinístico** porque:

1. **Toda informação vem dos arquivos .md** — Claude não inventa dados
2. **CLAUDE.md tem instrução explícita**: "nunca alucine, se não tem a info, diga"
3. **Citação obrigatória**: Claude sempre diz de qual arquivo tirou a informação
4. **Perguntar antes de assumir**: Instrução de pedir clarificação quando falta contexto
5. **Versionamento**: Git mantém histórico — se algo mudar indevidamente, você descobre

### O que Claude PODE fazer:
- Consultar e cruzar informações dos arquivos
- Sugerir ações baseado nos dados registrados
- Gerar documentos usando templates
- Alertar sobre prazos e pendências

### O que Claude NÃO deve fazer:
- Inventar datas, nomes ou compromissos não registrados
- Assumir status de projetos sem base nos arquivos
- Tomar decisões — apenas apresentar dados e sugestões

---

## Custos e plano recomendado

### Claude Team Plan ($30/user/mês — ideal para você)
- ✅ Claude Projects com contexto estendido
- ✅ Memory persistente entre conversas
- ✅ App mobile com acesso aos Projects
- ✅ Acesso web de qualquer lugar
- ✅ Claude Code / Cowork incluído
- ✅ Dados não usados para treinamento
- ✅ Admin controls

### Alternativa: Claude Max ($100/mês)
- Tudo do Team + uso ilimitado de Opus 4.5
- Vale se você usar intensamente (muitas horas/dia)

---

## Próximos passos

1. ✅ Estrutura criada (este repo)
2. 🔲 Preencher CLAUDE.md com seus dados reais (time, projetos, contatos)
3. 🔲 Subir para repo Git privado
4. 🔲 Criar Project no claude.ai com o conteúdo
5. 🔲 Instalar app Claude no celular
6. 🔲 Testar fluxo: "briefing" → registrar reunião → "review commitments"
7. 🔲 Após 2 semanas: avaliar e ajustar playbooks
8. 🔲 Mês 2: adicionar MCP servers (GitHub, Outlook)
