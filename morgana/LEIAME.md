# App da Morgana — o que preencher

O código é compartilhado com o app do João (pasta `app/`). Aqui ficam só os dados dela.
Endereço: https://2zwrmjr67t-pixel.github.io/Treino/morgana/

## Arquivos desta pasta
- `config.js` — tudo que é dela (preencher a partir do projeto "Morgana Health Life" no Claude).
- `data.json` — dieta, peso, medidas, avaliações e registros lançados pelo Claude.
- `treinos.json` — gravado sozinho pela automação a partir do que ela envia pelo app. Não editar à mão.

## Campos do `config.js`
| Campo | O que é |
|---|---|
| `nascimento` | `[ano, mês, dia]` — usado no %G das dobras (fórmula feminina) |
| `TARGET` | metas diárias: `kcal`, `kcalMax`, `p`, `c`, `f` (gramas) |
| `metaKcalTxt`, `metaNota` | texto da meta mostrado na Dieta e no Dashboard |
| `MUSC` | dias de musculação. Cada dia: `l` (Seg, Ter, Qua, Qui, Sex, Sáb, Dom), `n` (nome), `c` (cor), `foc`, `tl` (faixa de resumo; itens com `h:1` = um exercício, na mesma ordem de `ex`), `ex` (exercícios: `n`, `dm`, `tg`, `s`, `r`, `d`, `nt`), `info` |
| `CARD` | sessões de cardio, no mesmo formato do app do João (`l`, `n`, `badge`, `c`, `foc`, `dur`, `equip`, `obj`, `phases`, `info`) |
| `PLANO` | `inicio` (AAAA-MM-DD), `semanas`, `marcos` (`sem`, `d`, `t`, `o`) |
| `planoTitulo`, `planoHtml` | título e conteúdo do plano recolhível do Dashboard |
| `avisoTreino`, `cardioProtocolo` | avisos no topo da aba Treino e do Cardio |
| `exameNota`, `composicaoNota` | textos dos alertas de exame e de avaliação |

## Não mexer
- `ntfy`, `lsPrefix`, `dbKey`, `raiz` — garantem que os dados dela não se misturam com os do João.

## Demos 3D
O campo `dm` de cada exercício aponta para uma demo em `src/exercises.js`. Exercício que já existe no app do João reaproveita a demo; exercício novo precisa de demo nova ou fica com `dm:""` (sem botão 3D).
