/* Configuração do app — João Guilherme. O código fica em app/; aqui só o que é dele. */
window.CFG={
  id:'joao',
  titulo:'Protocolo <strong>Guilherme</strong>',
  lsPrefix:'',                       /* mantém os dados locais já salvos no celular */
  dbKey:'protocoloGuilherme',
  raiz:'',                           /* caminho até a raiz do site (demo3d.html) */
  ntfy:'pg-ca2a704c401a6f81',        /* tópico de envio — exclusivo desta pessoa */
  sexo:'M',
  nascimento:[1989,6,12],
  metaKcalTxt:'3.550–3.700',
  metaNota:"Meta operacional ~3.600 kcal <b>todo dia</b>, sem dia baixo (manutenção real medida ≈ 3.150–3.300) · proteína ~160 g e gordura ≤95 g fixas · carboidrato é a variável de ajuste",
  avisoTreino:"<b>Versão de proteção</b> · ajustes conservadores de coluna aplicados em 09/06/2026, enquanto o quadro está em avaliação. Direcionamentos definitivos após a consulta.",
  cardioProtocolo:"<b>Protocolo:</b> Bike ergométrica ou esteira inclinada — <b>nunca corrida</b> (menor impacto lombar, menor interferência na hipertrofia). 12–15 min, <b>logo depois da musculação</b> nos dias de membro superior (Seg, Qui, Sáb) — nenhum dia a mais na academia e nada colado nas pernas (Ter/Sex).",
  exameNota:'Fazer painel novo antes da Deca.',
  composicaoNota:'Próxima prevista na semana 8.',
  planoTitulo:'Plano · lean bulk 16 semanas',
  planoHtml:"<div class=\"stage\"><div class=\"st\">Bloco 1 · semanas 1–8 · até 19/01</div><h3>Superávit consistente</h3>\n<p>3.550–3.700 kcal todos os dias, inclusive fim de semana e dia sem treino (set–out a média foi ~3.160 kcal com peso parado: era manutenção). Perna: adução 2× por semana e carga registrada em toda sessão. Cardio curto depois da musculação: tiros (seg), Zona 2 (qui), capacidade (sáb).</p>\n<div class=\"goal\">Meta: +0,25–0,35 kg/semana pela média semanal (≈ 80 kg na semana 8).</div>\n<p style=\"margin-top:8px;font-size:11px;color:var(--ac)\"><b>Deca:</b> se entrar neste bloco, retém água e infla o peso. Durante ela, leia o peso junto com a cintura: peso subindo com cintura estável está ok.</p></div>\n<div class=\"stage\"><div class=\"st\">Bloco 2 · semanas 9–16 · até 16/03</div><h3>Ajuste e composto de perna</h3>\n<p>Calorias pelos gatilhos abaixo. Se o especialista liberar, entra o belt squat (carga no quadril, sem compressão na coluna).</p>\n<div class=\"goal\">Meta: ≈ 82 kg com cintura até +2 cm, com ganho de massa livre confirmado em avaliação profissional.</div></div>\n<div class=\"lbl\" style=\"margin-top:6px\">Pendências médicas</div>\n<div class=\"row\"><div class=\"d\">Sangue</div><div class=\"m\">Painel novo <b>antes da Deca</b>: hemograma (hematócrito 54,6% em out/25), TGO/TGP, lipídios, estradiol, prolactina, vitamina D</div></div>\n<div class=\"row\"><div class=\"d\">Esforço</div><div class=\"m\">Teste ergoespirométrico: FC máxima real e zonas de treino</div></div>\n<div class=\"row\"><div class=\"d\">Coluna</div><div class=\"m\">Liberação do especialista para o Bloco 2</div></div>\n<div class=\"row\"><div class=\"d\">Nariz/sono</div><div class=\"m\">Otorrino (septo, 2 recidivas) e polissonografia</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Medidas</div>\n<div class=\"row\"><div class=\"d\">Peso</div><div class=\"m\">Diário em jejum; vale a <b>média semanal</b></div></div>\n<div class=\"row\"><div class=\"d\">Cintura</div><div class=\"m\">Semanal, no umbigo, mesma condição</div></div>\n<div class=\"row\"><div class=\"d\">Cargas</div><div class=\"m\">Toda sessão — o sinal mais direto de progresso</div></div>\n<div class=\"row\"><div class=\"d\">Composição</div><div class=\"m\">7 dobras com o profissional de sempre (ou DEXA) nas semanas 8 e 16. Caseiras só como direção (*)</div></div>\n<div class=\"row\"><div class=\"d\">Cardio</div><div class=\"m\">Pico e FC após 1 min nos tiros — mande no chat</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Gatilhos de ajuste</div>\n<div class=\"trig\"><div class=\"sig\">Média de peso parada 2 semanas com ≥3.550 kcal registradas</div><div class=\"act\">↑ calorias +150</div></div>\n<div class=\"trig\"><div class=\"sig\">Cintura +2 cm antes de o peso subir 2 kg</div><div class=\"act\">↓ calorias −150</div></div>\n<div class=\"trig\"><div class=\"sig\">Carga trava + fadiga/dor lombar</div><div class=\"act\">Deload, revisar exercícios</div></div>\n<div class=\"trig\"><div class=\"sig\">Recuperação ≤12 bpm em 1 min, tontura ou dor no peito</div><div class=\"act\">Parar e médico</div></div>\n<div class=\"trig\"><div class=\"sig\">Hematócrito ≥52% ou PA subindo</div><div class=\"act\">Manejo médico</div></div>\n<div class=\"trig\"><div class=\"sig\">Libido/ereção em queda</div><div class=\"act\">Médico — prolactina e estradiol</div></div>\n<div class=\"lbl\" style=\"margin-top:12px\">Suplementação em uso</div>\n<div class=\"pgc\">Whey · creatina 3–5 g/dia · pré-treino Growth. Vitamina D (18 ng/mL em out/25): discutir reposição com o médico.</div>\n<div class=\"ibox warn\" style=\"margin-top:12px\"><b>Escopo:</b> material de apoio, não prescrição. Ciclo androgênico, hematócrito, PA e lipídios são decisões do médico.</div>",
  QUICK:[
    {l:"Shake pré",n:"Shake pré (água de coco 200 ml, banana, whey 1 scoop, aveia 1 scoop, creatina 3 g)",k:364,p:29,c:52,f:4,slot:"cafe"},
    {l:"Shake 2 aveias",n:"Shake (água de coco 200 ml, banana, whey 1 scoop, aveia 2 scoops)",k:481,p:33,c:69,f:6,slot:null},
    {l:"Pão, presunto e queijo",n:"Pão de forma 1 fatia + presunto 2 fatias + queijo 1 fatia",k:160,p:11,c:12,f:7,slot:null}
  ],
  TARGET:{kcal:3550,kcalMax:3700,p:160,c:525,f:95},
  PLANO:{inicio:'2026-11-24',semanas:16,marcos:[
  {sem:4,d:'2026-12-22',t:'Leitura do peso médio',o:'Subiu 0,25–0,35 kg/semana? Se não, +150 kcal.'},
  {sem:8,d:'2027-01-19',t:'Fim do Bloco 1',o:'Avaliação de composição e decisão do Bloco 2 com o especialista.'},
  {sem:16,d:'2027-03-16',t:'Fechamento',o:'Avaliação 7 dobras com profissional (ou DEXA) e novo plano.'}]},
  MUSC:[
  {l:"Seg",n:"Peito",c:"#c9a05a",
   foc:"Volume horizontal — peitoral e tríceps com 5 exercícios",
   tl:[{t:"Aquec.",m:"3min",h:0},{t:"Supino incl.",m:"13min",h:1},{t:"Supino máq.",m:"11min",h:1},{t:"Crossover",m:"9min",h:1},{t:"Tríceps corda",m:"7min",h:1},{t:"Tríceps V",m:"7min",h:1}],
   ex:[
     {n:"Supino inclinado articulado (anilhas)",dm:"supinc",tg:["p"],s:"4",r:"8–10",d:"90s",nt:"Composto principal — priorize a carga aqui. Banco com as pegadas na linha da parte alta do peito (alto demais vira deltoide). Escápulas afundadas no encosto, cabeça apoiada, queixo neutro. Siga o arco da máquina e deixe a pegada girar junto, punho alinhado ao antebraço. Carga = anilhas por lado + posição do banco."},
     {n:"Supino reto articulado deitado (anilhas)",dm:"supmaq",tg:[],s:"3",r:"10–12",d:"75s",nt:"Deitado, pegadas na linha do meio do peito. Escápulas afundadas no banco, pés no chão e arco lombar leve (lombar reclamou → pés no banco). Cabeça sempre apoiada. A 1ª rep sai do ponto mais alongado: carga conservadora. Cotovelos 45–60°, sem travar no topo. Braços independentes: se o direito atrasar ou formigar, reduza e anote. Carga = anilhas por lado."},
     {n:"Crossover cabo alto",dm:"cross",tg:[],s:"3",r:"12–15",d:"60s",nt:"Peitoral inferior — expire na contração, pausa de 1s no pico."},
     {n:"Tríceps corda no cabo",dm:"tricorda",tg:[],s:"3",r:"12–15",d:"60s",nt:"Cotovelos fixos ao lado do corpo. Foco na contração: embaixo, abra a corda e segure 1s. Carga moderada — a carga alta fica no pushdown com barra V."},
     {n:"Tríceps pushdown barra V",dm:"triv",tg:[],s:"3",r:"8–10",d:"75s",nt:"Substitui o testa EZ: menos estresse no cotovelo, sem carga sobre o rosto. Carga mais alta que a corda. Cotovelos colados, tronco levemente à frente, pescoço neutro. Extensão total com 1s de pausa; volta até os antebraços passarem um pouco da horizontal. Punho segue o ângulo da barra. Contrapartida: menos estímulo à cabeça longa do tríceps."}
   ],
   info:"16 séries totais. Peitoral recebe 10 séries diretas. Tríceps fecha com 6 séries de qualidade."},
  {l:"Ter",n:"Pernas",c:"#7a6bbf",
   foc:"Quadríceps + glúteo — sem padrão de agachamento (proteção D11-D12)",
   tl:[{t:"Aquec.",m:"4min",h:0},{t:"Extensora",m:"11min",h:1},{t:"Ext. unilat.",m:"8min",h:1},{t:"Kickback",m:"9min",h:1},{t:"Abdução incl.",m:"7min",h:1},{t:"Flexora sent.",m:"9min",h:1},{t:"Panturrilha",m:"6min",h:1},{t:"Adução",m:"4min",h:1}],
   ex:[
     {n:"Extensora",dm:"ext",tg:["p"],s:"4",r:"10–12",d:"90s",nt:"Principal do dia. Excêntrico de 3s, pausa de 1s no topo, séries perto da falha. Sem carga axial na coluna."},
     {n:"Extensora unilateral alternada",dm:"extu",tg:[],s:"3",r:"12–15/lado",d:"60s",nt:"Tronco apoiado na máquina, sem assimetria de carga. Perto da falha."},
     {n:"Kickback de glúteo na máquina (apoio de peito)",dm:"kick",tg:["f","c"],s:"4",r:"12–15/lado",d:"60s",nt:"Máquina Technogym Rear Kick. Peito no apoio, mãos nas empunhaduras, costelas para baixo, perna de apoio firme na plataforma. Perna de trabalho: sola inteira (do calcanhar ao antepé) encostada na placa do braço, joelho a ~90°, tornozelo neutro. Empurre a placa para trás e para cima estendendo o quadril; o joelho acompanha, mas quem move a carga é o glúteo. Amplitude curta (coxa quase alinhada ao tronco), sem arquear a lombar nem girar o quadril. Pausa de 1s no pico, volta em 3s sem soltar a carga. Um lado de cada vez; alterne o lado que começa. Se a lombar assumir, reduza carga e amplitude."},
     {n:"Abdução de quadril com tronco inclinado",dm:"abdi",tg:["f"],s:"3",r:"12–15",d:"60s",nt:"Mesma máquina da abdução de sexta, mas com o tronco inclinado à frente (~30°) e as mãos nas empunhaduras: desloca a tensão para o glúteo máximo e o médio posterior. Costas retas, sem arredondar a lombar. Abra até onde o quadril permite, pausa de 1s e volta em 3s. Substitui o hip thrust (sem extensão lombar no topo)."},
     {n:"Flexora sentada",dm:"flexs",tg:[],s:"4",r:"12",d:"60s",nt:"Isquiotibial alongado, costas apoiadas. Bilateral, sem assimetria."},
     {n:"Panturrilha na Rotary Calf (Technogym)",dm:"pant",tg:[],s:"4",r:"20",d:"45s",nt:"Sentado com costas no encosto, antepé na plataforma, joelhos levemente flexionados e fixos — nunca travados. Só o tornozelo trabalha, acompanhando o giro da plataforma. Pausa de 1s no alongamento e no pico, volta em 2s sem encostar as placas. Pernas quase estendidas priorizam o gastrocnêmio. Sem carga axial."},
     {n:"Adução quadril na máquina",dm:"adu",tg:[],s:"2",r:"15",d:"60s",nt:"2ª frequência semanal de adutor (a outra é sexta). Adutores são grande parte do volume da coxa e ficaram descobertos sem agachamento/leg press. Amplitude confortável, sem forçar o alongamento; pausa de 1s fechado, volta em 3s. Pode ir em bi-set com a panturrilha."}
   ],
   info:"Versão de proteção: leg press e agachamentos suspensos (desconforto torácico recorrente após carga; D11-D12 em aberto). Quadríceps via extensora em 3 frequências (terça + quinta + sexta, ~14 séries/semana); glúteo ~10 séries/semana com kickback, abdução inclinada e abdução (hip thrust removido); adutor 5 séries/semana (terça + sexta); sessão de ~58 min (teto de 45 min suspenso nas sessões de perna enquanto o volume da inferior é recuperado). Reintrodução de padrões de agachamento só após definição com o especialista."},
  {l:"Qui",n:"Ombros",c:"#6a9a6a",
   foc:"Ombros 3D + trapézio superior (shrug apoiado) + core + finalização de perna (extensora e panturrilha)",
   tl:[{t:"Aquec.",m:"3min",h:0},{t:"Elev. lateral",m:"10min",h:1},{t:"Face pull",m:"8min",h:1},{t:"Shrug incl.",m:"8min",h:1},{t:"Core",m:"8min",h:1},{t:"Extensora",m:"7min",h:1},{t:"Panturrilha",m:"6min",h:1}],
   ex:[
     {n:"Elevação lateral no cabo baixo bilateral",dm:"lat",tg:["p"],s:"4",r:"15",d:"60s",nt:"Dois cabos baixos simultâneos — trajetória guiada, mais seguro que haltere. Cotovelo levemente dobrado, sobe até a altura do ombro, sem encolher o trapézio. Desça em ~3s."},
     {n:"Face pull com corda",dm:"face",tg:[],s:"4",r:"15",d:"60s",nt:"Rotação externa do ombro. Puxe para a testa, não para o queixo. Cobre deltoide posterior, trapézio médio/inferior e manguito rotador."},
     {n:"Shrug inclinado apoiado no peito (halteres)",dm:"shr",tg:["p","c"],s:"3",r:"12–15",d:"75s",nt:"Banco a 45°, peito apoiado, halteres moderados. Braços retos: eleve os ombros em direção às orelhas, segure 2s no topo, desça em ~3s. Pescoço neutro — olhe para o chão, sem projetar a cabeça. Teste de 2 semanas: 2 séries a 3 reps da falha; se surgir irradiação para o braço direito, dormência ou choque, suspenda."},
     {n:"Dead bug + Pallof press alternados",dm:"deadbug",tg:["f","c"],s:"3",r:"10/lado · 12/lado",d:"45s",nt:"Assoalho pélvico e anti-rotação. Base para controle pélvico e performance sexual."},
     {n:"Extensora",dm:"ext",tg:[],s:"3",r:"12–15",d:"60s",nt:"3ª frequência semanal de quadríceps, ao final da sessão. Perto da falha, excêntrico de 3s, pausa de 1s no topo. Pode ir em bi-set com a panturrilha para poupar tempo."},
     {n:"Panturrilha na Rotary Calf (Technogym)",dm:"pant",tg:[],s:"4",r:"15–20",d:"45s",nt:"Sentado com costas no encosto, antepé na plataforma, joelhos levemente flexionados e fixos — nunca travados. Só o tornozelo trabalha, acompanhando o giro da plataforma. Pausa de 1s no alongamento e no pico, volta em 2s sem encostar as placas. Pernas quase estendidas priorizam o gastrocnêmio. Sem carga axial. 2ª frequência semanal (a outra é terça)."}
   ],
   info:"Versão de proteção: desenvolvimento overhead suspenso enquanto a cervical está ativa. Deltoide via cabo, sem carga acima da cabeça: lateral e posterior diretos; o anterior já é coberto pelos supinos (elevação frontal removida para abrir espaço à perna). Fecha com extensora e panturrilha. Trapézio superior via shrug apoiado no peito (sem carga axial, pescoço neutro) no lugar da remada alta no cabo — em fase de teste de 2 semanas. Reintrodução de pressão overhead a definir com o especialista."},
  {l:"Sex",n:"Posterior",c:"#5a8a7a",
   foc:"Cadeia posterior + extensora + estabilização lombar ativa — 2x por semana no core",
   tl:[{t:"Aquec.",m:"4min",h:0},{t:"Flexora",m:"12min",h:1},{t:"Extensora",m:"9min",h:1},{t:"Abdução",m:"6min",h:1},{t:"Adução",m:"6min",h:1},{t:"Core lombar",m:"10min",h:1}],
   ex:[
     {n:"Flexora deitada bilateral",dm:"flexd",tg:["p"],s:"5",r:"10–12",d:"90s",nt:"Isquiotibial — bilateral, sem assimetria. Amplitude total, quadril colado no apoio. Composto principal do dia."},
     {n:"Extensora",dm:"ext",tg:[],s:"4",r:"12–15",d:"60s",nt:"Terceira frequência semanal de quadríceps. Perto da falha, pausa de 1s no topo."},
     {n:"Abdução quadril na máquina",dm:"abd",tg:["f"],s:"3",r:"15",d:"60s",nt:"Glúteo médio — estabilidade lateral do quadril. Direto na performance sexual e saúde do ciático."},
     {n:"Adução quadril na máquina",dm:"adu",tg:[],s:"3",r:"15",d:"60s",nt:"Adutor magno — cobre o que o agachamento recrutava. Amplitude confortável, sem forçar o alongamento."},
     {n:"Bird dog",dm:"bird",tg:["c"],s:"3",r:"10/lado",d:"45s",nt:"Braço e perna opostos em extensão simultânea. Lombar neutra — não deixe o quadril rotar. O exercício mais eficaz para reabilitar e fortalecer multífidos e extensores lombares."},
     {n:"Prancha lateral",dm:"plank",tg:["c"],s:"3",r:"30–40s/lado",d:"30s",nt:"Quadrado lombar e oblíquos — estabilidade lateral que o dead bug não cobre. Corpo alinhado, quadril não cai."}
   ],
   info:"Posterior + quadríceps (3ª frequência) + core lombar específico. Leg press 90° removido: pés altos aumentam a flexão de quadril e favorecem a báscula pélvica posterior no fundo do movimento. Flexora sentada fica na terça para distribuir o volume (sessões de perna de ~55 min)."},
  {l:"Sáb",n:"Costas",c:"#4a8fa8",
   foc:"Largura, espessura e bíceps — puxadas, remadas e curl",
   tl:[{t:"Aquec.",m:"3min",h:0},{t:"Puxada",m:"13min",h:1},{t:"Rem. apoiada",m:"11min",h:1},{t:"Polia baixa",m:"9min",h:1},{t:"Rosca direta",m:"8min",h:1},{t:"Rosca martelo",m:"7min",h:1}],
   ex:[
     {n:"Puxada articulada pegada aberta (anilhas)",dm:"pulldown",tg:["p"],s:"4",r:"8–10",d:"90s",nt:"Cotovelos apontam para o chão na descida. Puxe pela escápula, não pelo braço. Pescoço neutro — não projete a cabeça à frente nem puxe atrás da nuca. Braços independentes: se um lado chega antes ou o braço direito formiga, reduza a carga e anote. Carga = anilhas por lado."},
     {n:"Remada articulada com apoio peitoral (anilhas)",dm:"row",tg:["c"],s:"4",r:"10–12",d:"75s",nt:"Tronco totalmente apoiado — zera a variável lombar e cervical. Carga progressiva aqui. Peito colado no apoio a série toda. Pegada da máquina (pronada ou neutra): registre qual — pronada puxa mais trapézio médio/deltoide posterior. Carga = anilhas por lado + altura do banco."},
     {n:"Remada polia baixa pegada neutra",dm:"rowlow",tg:[],s:"3",r:"12–15",d:"60s",nt:"Espessura do meio das costas. Cotovelos colados ao corpo na chegada."},
     {n:"Rosca direta barra EZ",dm:"rosca",tg:["p"],s:"3",r:"10–12",d:"75s",nt:"Sem balanço de tronco — isola bíceps com qualidade."},
     {n:"Rosca martelo simultânea",dm:"martelo",tg:[],s:"3",r:"12",d:"60s",nt:"Braquiorradial e bíceps — volume de braço completo. Simultânea, não alternada."}
   ],
   info:"17 séries totais. Costas recebem 11 séries com variação de ângulo. Bíceps fecha com 6 séries. Sábado fecha a semana sem conflito com nenhum grupo anterior."}
],
  CARD:[
  {l:"Seg",n:"Tiros curtos",badge:"Após Peito",c:"#c9a05a",
   foc:"Logo depois da musculação de peito — dia de membro superior, sem interferir nas pernas",
   dur:"~12 min",equip:"Bike",obj:"Repetir esforço forte curto e recuperar a FC entre os tiros",
   phases:[
     {n:"Fase 1",t:"Aquecimento",dur:"3 min",zona:"até ~110 bpm",int:"Resistência crescente",c:"#6a9a6a",note:"Comece leve e suba aos poucos."},
     {n:"Fase 2",t:"Tiros",dur:"5 × (20s forte / 40s leve)",zona:"pico até ~140 → volta < 120",int:"Forte, não máximo",c:"#c9a05a",note:"Ponto de partida = o teste de 26/11. Só comece o próximo tiro com a FC abaixo de 120; se não descer em 40s, descanse mais. Progressão semanal (só avance se a FC voltar < 120 dentro dos 40s em todos os tiros): 6×20/40 → 8×20/40 → 6×30/30 → 8×30/30."},
     {n:"Fase 3",t:"Recuperação cardíaca",dur:"1 min + 2 min",zona:"—",int:"Medida",c:"#5a8a7a",note:"Fim do último tiro: anote a FC (pico). Pare de pedalar, fique sentado e anote a FC após 1 minuto. Recuperação = pico − FC de 1 min. Depois pedale leve 2 min."}
   ],
   info:"Indicador de evolução: a recuperação de 1 minuto. Me mande pico e FC de 1 min no chat que eu registro."},
  {l:"Qui",n:"Base Zona 2",badge:"Após Ombros",c:"#c07070",
   foc:"Logo depois da musculação de ombros — base aeróbica curta para acelerar a recuperação entre esforços",
   dur:"15 min",equip:"Bike ou esteira inclinada",obj:"Base aeróbica guiada por FC: 110–125 bpm",
   phases:[
     {n:"Fase 1",t:"Entrada",dur:"2 min",zona:"FC < 110",int:"Leve",c:"#6a9a6a",note:"Cadência moderada, resistência baixa."},
     {n:"Fase 2",t:"Bloco contínuo",dur:"12 min",zona:"110–125 bpm",int:"Moderado, conversa possível",c:"#c07070",note:"Fique entre 110 e 125 bpm. Passou de 125, alivie a resistência. Respire pelo nariz enquanto der; se obstruir, use a boca sem forçar."},
     {n:"Fase 3",t:"Descida",dur:"1 min",zona:"FC < 110",int:"Mínima",c:"#5a8a7a",note:"Reduza aos poucos, sem parar de repente."}
   ],
   info:"Curto de propósito: o que mais transfere para esforços de ~1 min são os tiros. Esta sessão é manutenção da base, não o foco."},
  {l:"Sáb",n:"Capacidade (rumo aos 60s)",badge:"Após Costas",c:"#6a9a6a",
   foc:"Logo depois da musculação de costas — dia de membro superior",
   dur:"~15 min",equip:"Bike",obj:"Alongar o esforço forte até ~1 min, com recuperação completa",
   phases:[
     {n:"Fase 1",t:"Aquecimento",dur:"3 min",zona:"até ~110 bpm",int:"Resistência crescente",c:"#6a9a6a",note:"Comece leve; nos últimos 30s suba um pouco."},
     {n:"Fase 2",t:"Esforços longos",dur:"4 × (30s forte / ~2 min leve)",zona:"pico ~140 → volta < 110",int:"Forte e sustentável",c:"#c9a05a",note:"Ritmo que você sustenta até o fim sem desmoronar. Só comece o próximo com a FC abaixo de 110. Progressão (a cada 2 semanas, se a FC voltar < 110 em até 2 min): 4×30s → 4×45s → 4×60s."},
     {n:"Fase 3",t:"Recuperação cardíaca",dur:"1 min + 2 min",zona:"—",int:"Medida",c:"#5a8a7a",note:"Mesma medida da segunda: FC no fim do último esforço, parado, e FC após 1 minuto. Depois pedale leve 2 min."}
   ],
   info:"Se escurecer a visão, vier tontura forte, dor no peito, falta de ar desproporcional ou palpitação: pare e leve ao médico antes de repetir."}
]
};
