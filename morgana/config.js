/* Configuração do app — Morgana. O código fica em ../app/; aqui só o que é dela.
   Fonte: projeto "Morgana - Healthy Life" · Plano v2 · Definição (12 semanas a partir de 23/11/2026). */
window.CFG={
  id:'morgana',
  titulo:'Protocolo <strong>Morgana</strong>',
  lsPrefix:'mg_',                    /* separa os dados locais dos do João no mesmo celular */
  dbKey:'protocoloMorgana',
  raiz:'../',
  ntfy:'mg-2007bb48a1686974',
  sexo:'F',
  nascimento:[1991,8,9],             /* 09/08/1991 */
  metaKcalTxt:'1.600–1.700',
  metaNota:"Meta ~1.650 kcal <b>todo dia</b>, inclusive fim de semana · <b>proteína 125–135 g é o piso</b> (mínimo 120 g mesmo em dia livre) · gordura 50–60 g · carboidrato é o resto, perto do treino",
  avisoTreino:"<b>Plano v2 · Definição</b> · 5 dias de ~40 min. Prioridade: <b>costas 2×/semana</b> e core anti-extensão (postura). Carga pesada com 1–2 reps na reserva; sobe a carga ao completar todas as reps limpas em 2 sessões seguidas.",
  cardioProtocolo:"<b>Protocolo:</b> base diária de <b>8–10 mil passos</b> + Zona 2 (conversa possível, sem ofegar) na bike ou esteira inclinada. Intervalado só a partir da semana 5, se as cargas estiverem estáveis.",
  exameNota:'Consulta com médico do esporte: levar exames recentes e lista de medicações/suplementos.',
  composicaoNota:'Próxima avaliação na semana 4 (21/12): fotos padronizadas, circunferências e dobras (sem coxa, com bíceps).',
  planoTitulo:'Plano · definição 12 semanas',
  planoHtml:"<div class=\"stage\"><div class=\"st\">Bloco 1 · semanas 1–8 · até 18/01</div><h3>Calibração e déficit moderado</h3>\n<p>1.600–1.700 kcal com proteína 125–135 g todos os dias. Semanas 1–2: registro completo (voz ou foto no chat do projeto) para calibrar; depois, no mínimo 4 dias por semana, incluindo o fim de semana. Treino em 5 dias com costas 2×/semana; cardio Zona 2 + passos.</p>\n<div class=\"goal\">Meta: −0,25 a −0,35 kg/semana pela média semanal; cintura caindo; cargas mantidas.</div></div>\n<div class=\"stage\"><div class=\"st\">Bloco 2 · semanas 9–12 · até 15/02</div><h3>Ajuste fino e definição</h3>\n<p>Calorias pelos gatilhos abaixo. Intervalado curto opcional no lugar de uma Zona 2, se a recuperação permitir.</p>\n<div class=\"goal\">Meta: ~59 kg · cintura 70–71 cm · abdômen 75–76 cm · %G ~18–19%.</div></div>\n<div class=\"lbl\" style=\"margin-top:6px\">Ponto de partida · 21/11/2026</div>\n<div class=\"row\"><div class=\"d\">Corpo</div><div class=\"m\">62,4 kg · 1,60 m · cintura 74 cm · abdômen 79 cm · %G estimado ~22–23% (faixa 19–24%)</div></div>\n<div class=\"row\"><div class=\"d\">Postura</div><div class=\"m\">Provável anteversão pélvica e joelhos em hiperextensão (por foto): costelas para baixo, joelhos destravados</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Medidas</div>\n<div class=\"row\"><div class=\"d\">Peso</div><div class=\"m\">Diário em jejum; vale a <b>média semanal</b></div></div>\n<div class=\"row\"><div class=\"d\">Cintura</div><div class=\"m\">Cintura e abdômen a cada 2 semanas, mesma hora e mesmo ponto</div></div>\n<div class=\"row\"><div class=\"d\">Fotos</div><div class=\"m\">A cada 4 semanas: tripé na altura do umbigo, 2,5–3 m, braços relaxados, 4 vistas, mesma luz</div></div>\n<div class=\"row\"><div class=\"d\">Dobras</div><div class=\"m\">A cada 4 semanas, mesmo avaliador, lado direito, 3 leituras. Coxa só com pinçamento confiável. Mesma fase do ciclo</div></div>\n<div class=\"row\"><div class=\"d\">Proteína</div><div class=\"m\">Diário — indicador nº 1 de aderência</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Gatilhos de ajuste</div>\n<div class=\"trig\"><div class=\"sig\">Média de peso parada 2–3 semanas, cintura parada, com aderência real</div><div class=\"act\">↓ 150 kcal, do carboidrato</div></div>\n<div class=\"trig\"><div class=\"sig\">Perda acima de 0,6 kg/semana por 2+ semanas</div><div class=\"act\">↑ 100–150 kcal</div></div>\n<div class=\"trig\"><div class=\"sig\">Cargas caindo ou fadiga persistente</div><div class=\"act\">Subir calorias ou tirar o intervalado</div></div>\n<div class=\"trig\"><div class=\"sig\">Proteína abaixo de 120 g em 3+ dias da semana</div><div class=\"act\">Corrigir antes de mexer em calorias</div></div>\n<div class=\"trig\"><div class=\"sig\">Dor articular</div><div class=\"act\">Adaptar o exercício; dor persistente → fisioterapeuta</div></div>\n<div class=\"trig\"><div class=\"sig\">Alterações menstruais novas ou nos exames</div><div class=\"act\">Médico</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Suplementação</div>\n<div class=\"pgc\">Creatina 3–5 g/dia · whey para fechar a proteína · ômega-3 1–2 g/dia · cafeína pré-treino se tolerada. Vitamina D só com exame. Fora: termogênicos, CLA, L-carnitina, BCAA.</div>\n<div class=\"ibox warn\" style=\"margin-top:12px\"><b>Escopo:</b> material de apoio, não prescrição. Medicações e exames são decisões do médico.</div>",
  QUICK:[],                         /* favoritos da Dieta */
  TARGET:{kcal:1600,kcalMax:1700,p:130,c:170,f:55},
  PLANO:{inicio:'2026-11-23',semanas:12,marcos:[
  {sem:4,d:'2026-12-21',t:'Leitura do peso médio',o:'Caiu 0,25–0,35 kg/semana com a cintura caindo? Se não, −150 kcal. Fotos, medidas e dobras.'},
  {sem:8,d:'2027-01-18',t:'Fim do Bloco 1',o:'Avaliação completa e decisão sobre o intervalado e as calorias do Bloco 2.'},
  {sem:12,d:'2027-02-15',t:'Fechamento',o:'Avaliação final (de preferência com profissional ou bioimpedância) e plano de manutenção ou nova fase.'}]},
  MUSC:[
  {l:"Seg",n:"Inferiores A",c:"#c9a05a",
   foc:"Glúteo e posterior — hip thrust como composto principal",
   tl:[{t:"Aquec.",m:"4min",h:0},{t:"Hip thrust",m:"11min",h:1},{t:"Stiff",m:"8min",h:1},{t:"Flexora",m:"7min",h:1},{t:"Abdução",m:"4min",h:1},{t:"Dead bug",m:"4min",h:1}],
   ex:[
     {n:"Hip thrust (barra ou máquina)",dm:"ht",tg:["p"],s:"4",r:"8–10",d:"90s",nt:"Composto principal — priorize a carga. Queixo levemente para baixo e costelas fechadas no topo: o movimento é do quadril, não da lombar. Pausa de 1s na contração."},
     {n:"Stiff com halteres",dm:"",tg:[],s:"3",r:"10",d:"75s",nt:"Joelhos levemente flexionados (não travar). Quadril vai para trás, coluna neutra, halteres rentes às coxas. Desce até sentir o posterior alongar."},
     {n:"Cadeira flexora",dm:"flexs",tg:[],s:"3",r:"12",d:"60s",nt:"Amplitude total, sem impulso. Controle de 2–3s na volta."},
     {n:"Abdução de quadril na máquina",dm:"abd",tg:[],s:"2",r:"15",d:"45s",nt:"Glúteo médio — estabilidade do quadril. Pausa de 1s aberta."},
     {n:"Dead bug",dm:"deadbug",tg:[],s:"2",r:"8/lado",d:"30s",nt:"Lombar colada no chão o tempo todo. Expira ao estender braço e perna opostos. Corrige a anteversão pélvica."}
   ],
   info:"14 séries. Primeiro estímulo de glúteo e posterior da semana."},
  {l:"Ter",n:"Superiores A · Costas",c:"#4a8fa8",
   foc:"Costas em primeiro — largura e espessura, ombros completos",
   tl:[{t:"Aquec.",m:"3min",h:0},{t:"Puxada",m:"11min",h:1},{t:"Remada",m:"8min",h:1},{t:"Desenv.",m:"8min",h:1},{t:"Elev. lateral",m:"6min",h:1},{t:"Face pull",m:"4min",h:1}],
   ex:[
     {n:"Puxada frontal pegada aberta",dm:"pulldown",tg:["p"],s:"4",r:"8–10",d:"90s",nt:"Composto principal — puxe pela escápula, cotovelos descendo para os bolsos. Peito alto, sem jogar o tronco para trás."},
     {n:"Remada baixa no cabo, pegada neutra",dm:"rowlow",tg:[],s:"3",r:"10–12",d:"75s",nt:"Espessura do meio das costas. Cotovelos rentes ao corpo, pausa de 1s com as escápulas juntas."},
     {n:"Desenvolvimento com halteres sentada",dm:"",tg:[],s:"3",r:"10",d:"75s",nt:"Encosto alto, costelas fechadas — sem arquear a lombar. Controle na descida."},
     {n:"Elevação lateral no cabo",dm:"lat",tg:[],s:"3",r:"15",d:"60s",nt:"Deltoide lateral — cotovelo levemente flexionado, sobe até a altura do ombro."},
     {n:"Face pull com corda",dm:"face",tg:[],s:"2",r:"15",d:"45s",nt:"Deltoide posterior e manguito — puxe para a altura da testa, abrindo a corda. Ajuda a postura dos ombros."}
   ],
   info:"15 séries. Primeiro dos dois dias de costas da semana."},
  {l:"Qua",n:"Core & mobilidade",c:"#5a8a7a",
   foc:"Dia leve depois do cardio — core anti-extensão e quadril",
   tl:[{t:"Prancha",m:"4min",h:1},{t:"Dead bug",m:"4min",h:1},{t:"Flexor quadril",m:"4min",h:1}],
   ex:[
     {n:"Prancha frontal",dm:"",tg:[],s:"3",r:"30–40s",d:"30s",nt:"Glúteo contraído, costelas fechadas, quadril alinhado — sem deixar a lombar cair."},
     {n:"Dead bug",dm:"deadbug",tg:[],s:"2",r:"8/lado",d:"30s",nt:"Lombar colada no chão. Devagar, expirando na extensão."},
     {n:"Alongamento do flexor do quadril (meio ajoelhado)",dm:"",tg:[],s:"2",r:"45s/lado",d:"—",nt:"Joelho de trás no chão, glúteo desse lado contraído e quadril levemente para a frente. Tronco reto, sem arquear."}
   ],
   info:"Feito logo depois da Zona 2 da quarta. Curto de propósito: postura e core, não volume."},
  {l:"Qui",n:"Inferiores B",c:"#7a6bbf",
   foc:"Quadríceps e glúteo — segundo estímulo de perna",
   tl:[{t:"Aquec.",m:"4min",h:0},{t:"Agachamento",m:"11min",h:1},{t:"Búlgaro",m:"10min",h:1},{t:"Extensora",m:"7min",h:1},{t:"Panturrilha",m:"4min",h:1},{t:"Prancha lat.",m:"4min",h:1}],
   ex:[
     {n:"Agachamento no smith ou leg press",dm:"",tg:["p"],s:"4",r:"8–10",d:"90s",nt:"Composto principal — amplitude completa e controlada, joelhos na linha dos pés. No topo, não travar os joelhos."},
     {n:"Afundo búlgaro com halteres",dm:"",tg:[],s:"3",r:"10/lado",d:"75s",nt:"Tronco levemente à frente para mais glúteo. Joelho da frente alinhado ao pé."},
     {n:"Cadeira extensora",dm:"ext",tg:[],s:"3",r:"12–15",d:"60s",nt:"Pausa de 1s no topo, descida em 3s."},
     {n:"Panturrilha",dm:"pant",tg:[],s:"2",r:"15",d:"45s",nt:"Amplitude total, pausa de 1s no alongamento."},
     {n:"Prancha lateral",dm:"plank",tg:[],s:"2",r:"30s/lado",d:"30s",nt:"Quadril alto, corpo em linha reta. Oblíquos e glúteo médio."}
   ],
   info:"14 séries. Fecha a frequência de 2×/semana em glúteo e pernas."},
  {l:"Sex",n:"Superiores B · Costas",c:"#c07070",
   foc:"Segundo dia de costas + empurrar e posterior de ombro",
   tl:[{t:"Aquec.",m:"3min",h:0},{t:"Remada unilat.",m:"11min",h:1},{t:"Puxada neutra",m:"8min",h:1},{t:"Supino incl.",m:"8min",h:1},{t:"Elev. lateral",m:"6min",h:1},{t:"Crucifixo inv.",m:"4min",h:1}],
   ex:[
     {n:"Remada unilateral com halter",dm:"",tg:["p"],s:"4",r:"10",d:"75s",nt:"Composto principal do dia. Apoio no banco, coluna neutra; puxe o cotovelo em direção ao quadril, sem girar o tronco."},
     {n:"Puxada pegada neutra fechada",dm:"",tg:[],s:"3",r:"10",d:"75s",nt:"Cotovelos à frente do corpo, desce até o peito. Foco no grande dorsal."},
     {n:"Supino inclinado com halteres",dm:"",tg:[],s:"3",r:"10",d:"75s",nt:"Banco a 30°, escápulas encaixadas no banco. Cotovelos a ~45°."},
     {n:"Elevação lateral com halteres",dm:"",tg:[],s:"3",r:"12–15",d:"60s",nt:"Sobe até a altura do ombro, sem balançar o tronco."},
     {n:"Crucifixo inverso (posterior de ombro)",dm:"",tg:[],s:"2",r:"15",d:"45s",nt:"Na máquina peck deck invertida ou com halteres inclinada. Carga leve, foco em abrir as escápulas."}
   ],
   info:"15 séries. Costas fecham ~14 séries diretas na semana."}
  ],
  CARD:[
  {l:"Qua",n:"Zona 2 — Base",badge:"Antes do core",c:"#5a8a7a",
   foc:"Dia sem musculação pesada — gasto e condicionamento sem competir com a recuperação",
   dur:"30 min",equip:"Bike ou esteira inclinada",obj:"Base aeróbica: conversa possível, sem ofegar",
   phases:[
     {n:"Fase 1",t:"Aquecimento",dur:"3 min",zona:"Zona 1–2",int:"Bem leve",c:"#6a9a6a",note:"Resistência ou inclinação baixa, só soltando o corpo."},
     {n:"Fase 2",t:"Bloco contínuo",dur:"25 min",zona:"Zona 2",int:"Moderado, conversa possível",c:"#5a8a7a",note:"Ritmo constante. Se não conseguir falar uma frase inteira, alivie."},
     {n:"Fase 3",t:"Desaceleração",dur:"2 min",zona:"Zona 1",int:"Bem leve",c:"#6a9a6a",note:"Reduza aos poucos, sem parar de repente."}
   ],
   info:"Progressão: 30 → 40 min ao longo do Bloco 1, se a recuperação estiver boa."},
  {l:"Sáb",n:"Zona 2 — Opcional",badge:"Opcional",c:"#6a9a6a",
   foc:"Dia livre — caminhada longa ao ar livre ou Zona 2 na academia",
   dur:"30–40 min",equip:"Caminhada, bike ou esteira inclinada",obj:"Somar gasto e passos sem fadiga",
   phases:[
     {n:"Fase 1",t:"Entrada",dur:"5 min",zona:"Zona 1",int:"Leve",c:"#6a9a6a",note:"Comece devagar."},
     {n:"Fase 2",t:"Bloco contínuo",dur:"25–35 min",zona:"Zona 2",int:"Moderado, conversa possível",c:"#5a8a7a",note:"Caminhada em ritmo firme ou subida conta."},
     {n:"Fase 3",t:"Descida",dur:"—",zona:"Zona 1",int:"Leve",c:"#6a9a6a",note:"Termine leve."}
   ],
   info:"A partir da semana 5, se as cargas estiverem estáveis, esta sessão pode virar intervalado curto na bike: 6–8 × (1 min forte / 2 min leve). Se as cargas caírem, volta para Zona 2."}
  ]
};
