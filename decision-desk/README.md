# decision-desk

Uma mesa de decisão reaproveitada do [Roast Room](https://github.com/nateherkai/roast-room), sem os conselheiros-famosos e sem os retratos. O que sobrou é a parte que funciona: **brief estruturado → lentes adversariais → três rodadas → nota calculada por script → veredito com condições, critério de morte e o teste mais barato**.

## O que veio do repo

| peça | origem | mudança |
|---|---|---|
| `scripts/fetch.mjs` | `newroaster` | copiado, caminhos neutralizados |
| `scripts/check_quotes.mjs` | `newroaster` | copiado, sem dependência de roster |
| fórmula, bandas, caps | `roast-room/references/scoring.md` | agora **executada**, não escrita em prosa |
| formato do card e das rodadas | `round-prompts.md` | sem "cérebro" de pessoa, com lente funcional |
| template do veredito | `report-template.md` | adaptado (sem "seats" como pessoas) |
| padrão de extração com citação verificada | `brain-spec` + prompts | consolidado em `references/build-lens.md` |

## O que foi corrigido

O original pedia que o "Chair" fizesse a média ponderada, o spread, a confiança e os overrides **em prosa**. Isso é onde erro aritmético entra silencioso num relatório que parece rigoroso.

Aqui isso virou `scripts/score.mjs`: média ponderada, bandas, cap de ruína, cap de porta de mão única, spread, confiança, consolidação de voto, e recusa explícita de desempatar sozinho. O veredito é auditável e reproduzível a partir de `cards.json`.

## Como rodar

```powershell
# uma decisão completa
node scripts/score.mjs exemplos\demo-cards.json

# construir uma lente a partir de fontes
node scripts/fetch.mjs lenses\_build\meu-id --list urls.txt
node scripts/check_quotes.mjs lenses\_build\meu-id lenses\meu-id
```

O `SKILL.md` é o roteiro que o agente segue (brief, rodadas, score, veredito). Os arquivos de `references/` são os contratos: brief, lentes, pontuação, prompts, template.

## Estrutura

```
decision-desk/
  SKILL.md                  roteiro do orquestrador
  scripts/
    fetch.mjs               fontes -> corpus + sources.json
    check_quotes.mjs        confere citação literal contra o corpus
    score.mjs               toda a matemática do veredito
  references/
    brief.md                o frame da decisão
    lenses.md               as 7 lentes e os pesos
    scoring.md              bandas, caps, spread, confiança
    round-prompts.md        os 4 prompts
    verdict-template.md     o relatório
    build-lens.md           montar lente a partir de fontes
  examples/demo-cards.json  fixture testada
  lenses/                   lentes construídas
```

## Testado

`exemplos/demo-cards.json` cobre o caminho normal (GO WITH CONDITIONS, ruína mitigada, pilar baixo). Os caminhos de erro também: empate sai com código 1 e pede desempate explícito; ruína sem mitigação derruba para RESHAPE.

## Relação com a `arena`

Não competem, cobrem coisas diferentes:

- **arena**: N tentativas independentes da *mesma* entrega, eliminadas em chave. Serve para *produzir* uma resposta melhor.
- **decision-desk**: uma decisão, várias *lentes* que discordam, nota auditável. Serve para *escolher* e *registrar por quê*.

Na prática: use a `arena` quando precisa do melhor texto/plano; use o `desk` quando precisa decidir se faz, e com que condições.
