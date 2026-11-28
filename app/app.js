/* Configuração da pessoa (config.js) e armazenamento local separado por pessoa */
var C=window.CFG;
var LS={getItem:function(k){return localStorage.getItem(C.lsPrefix+k)},setItem:function(k,v){return localStorage.setItem(C.lsPrefix+k,v)},removeItem:function(k){return localStorage.removeItem(C.lsPrefix+k)}};
document.body.insertAdjacentHTML('afterbegin',`

<div class="hdr">
  <div class="hdr-eyebrow">Programa de treino</div>
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
    <div style="min-width:0">
      <div class="hdr-title" id="hTitle">${C.titulo}</div>
      <div class="hdr-sub" id="hSub">Musculação · Nutrição · Cardio · Performance</div>
    </div>
    <button id="syncBtn" onclick="syncNow()" aria-label="Sincronizar" style="flex:none;width:32px;height:32px;border-radius:9px;background:var(--s1);border:1px solid var(--br);color:var(--mt);font-size:15px;line-height:1;margin-top:1px">↻</button>
  </div>
  <div class="hdr-sub" id="syncStatus" style="margin-top:5px;font-size:10px"></div>
</div>

<div class="scrollwrap">

<section id="s-dash" class="on"><div class="pad">
  <div class="card" id="dToday"></div>
  <div class="card">
    <div class="lbl">Esta semana</div>
    <div class="wk7" id="dWeek"></div>
    <div class="legend"><span><b style="background:var(--ac)"></b>treino</span><span><b style="background:var(--rd)"></b>cardio</span><span><b style="background:var(--gn)"></b>dieta</span></div>
    <div class="kpis" id="dKpis"></div>
  </div>
  <div class="card" id="dAlerts"></div>
  <div class="card"><details class="plan" id="dPlan">
    <summary><div class="lbl" style="margin-bottom:6px">${C.planoTitulo}</div><div class="psum"><b id="dPlanTxt">—</b><span class="tog"><span class="a">ver plano ▾</span><span class="b">recolher ▴</span></span></div>
      <div class="pbar"><i id="dPlanBar" style="width:0"></i></div><div class="note" id="dPlanNext" style="margin:0"></div></summary>
    <div id="dMarcos" style="margin-top:10px"></div>
    <div id="dPlanBody" style="margin-top:12px">${C.planoHtml}</div>
  </details></div>
</div></section>

<section id="s-diet"><div class="pad">
  <div class="card dit">
    <div class="lbl">Comi agora — ditado</div>
    <textarea id="ditTxt" placeholder="Toque no microfone do teclado e fale: o que comeu e quanto. Ex.: almoço, arroz 200 g, feijão uma concha, frango 150 g, salada."></textarea>
    <button class="gobtn" id="ditBtn" onclick="enviarDitado()">Enviar refeição</button>
    <div class="note" style="margin:8px 0 0">Sai com data e hora de agora. O Claude calcula kcal e macros no fechamento do dia.</div>
    <div id="ditList"></div>
  </div>
  <div class="datebar">
    <button onclick="shiftDay(-1)">‹</button>
    <div class="dt"><b id="dLabel">Hoje</b><span id="dFull"></span></div>
    <button onclick="shiftDay(1)">›</button>
  </div>
  <div class="card">
    <div class="lbl">Total do dia</div>
    <div style="font-size:24px;font-weight:600;color:#fff" id="dietKcal">0 <span style="font-size:12px;color:var(--mt);font-weight:400">/ ${C.metaKcalTxt} kcal</span></div>
    <div class="note" style="margin:4px 0 0">${C.metaNota}</div>
    <div class="macros">
      <div class="macro p"><div class="mvv" id="dietP">0</div><div class="mt2">Prot g</div><div class="bar"><i id="barP"></i></div></div>
      <div class="macro c"><div class="mvv" id="dietC">0</div><div class="mt2">Carb g</div><div class="bar"><i id="barC"></i></div></div>
      <div class="macro f"><div class="mvv" id="dietF">0</div><div class="mt2">Gord g</div><div class="bar"><i id="barF"></i></div></div>
    </div>
  </div>

  <div class="card">
    <div class="lbl">Registrar refeição</div>
    <div class="slots" id="slotBar"></div>
    <div class="chips" id="chipBar"></div>
    <div class="form2"><input id="mName" placeholder="Alimento / refeição" autocomplete="off"></div>
    <div class="form3">
      <input id="mK" inputmode="numeric" placeholder="kcal">
      <input id="mP" inputmode="numeric" placeholder="P g">
      <input id="mC" inputmode="numeric" placeholder="C g">
      <input id="mF" inputmode="numeric" placeholder="G g">
    </div>
    <button class="addbtn" onclick="addMeal()">Adicionar</button>
    <div id="mealGroups"></div>
  </div>
</div></section>

<section id="s-train"><div class="pad">
  <div class="trsticky" id="trSticky">
  <div class="slots" style="margin-bottom:10px">
    <button id="trTabMusc" class="on" onclick="setTrainTab('musc')" style="flex:1;text-align:center">Musculação</button>
    <button id="trTabCard" onclick="setTrainTab('card')" style="flex:1;text-align:center">Cardio <span id="trCardBadge" style="opacity:.75"></span></button>
  </div>
  </div>
  <div id="trPanelCard" style="display:none">
  <div class="ibox" style="margin-top:0">${C.cardioProtocolo}</div>
  <div class="day-tabs" id="ctabs"></div>
  <div class="card" id="hrrHist"></div>
  <div id="cpanels"></div>
  <div class="card">
    <div class="lbl">Checklist da semana</div>
    <div id="cardioChecks"></div>
    <button class="reset2" onclick="resetCardioWeek()">Zerar semana</button>
  </div>
</div>
  <div id="trPanelMusc">
  <div class="ibox warn" style="margin-top:0">${C.avisoTreino}</div>
  <div class="day-tabs" id="dtabs"></div>
  <div id="dpanels"></div>
  </div>
</div></section>

<section id="s-meas"><div class="pad">
  <div class="slots" style="margin-bottom:14px">
    <button id="measTabPeso" class="on" onclick="setMeasTab('peso')" style="flex:1;text-align:center">Peso</button>
    <button id="measTabDobras" onclick="setMeasTab('dobras')" style="flex:1;text-align:center">Dobras (7 pontos)</button>
  </div>

  <div id="measPanelPeso">
    <div class="stat">
      <div class="s"><div class="v" id="wNow">—</div><div class="t">Peso kg</div><div class="dv" id="wDelta"></div></div>
      <div class="s"><div class="v" id="waNow">—</div><div class="t">Cintura cm</div><div class="dv" id="waDelta"></div></div>
    </div>
    <div class="card">
      <div class="lbl">Tendência de peso</div>
      <canvas id="wChart"></canvas>
      <div class="note" style="text-align:center;margin-top:6px">Registre diário em jejum. O que importa é a média, não o número isolado.</div>
    </div>
    <div class="card">
      <div class="lbl">Novo registro — diário</div>
      <div class="meas-add">
        <div class="fld"><label>Peso (kg)</label><input id="mW" inputmode="decimal" placeholder="77"></div>
        <div class="fld"><label>Cintura (cm)</label><input id="mWa" inputmode="decimal" placeholder="—"></div>
      </div>
      <button class="addbtn" onclick="saveMeas()">Salvar medida de hoje</button>
      <div class="hist" id="measHist" style="margin-top:10px"></div>
    </div>
    <div class="card">
      <div class="lbl">Circunferências — última avaliação</div>
      <div id="circBox" class="hist"><div class="empty2">Nenhuma avaliação com fita registrada.</div></div>
    </div>
  </div>

  <div id="measPanelDobras" style="display:none">
    <div class="card">
      <div class="lbl">Histórico de composição corporal — o norte</div>
      <div class="note" style="margin-bottom:6px">2018: antropometria · 2021–22: nutricionista · 2023–26: 7 dobras com profissional. <b>*</b> = dobras caseiras: referência aproximada, não medida.</div>
      <div id="profBox" class="hist"></div>
    </div>
    <div class="stat">
      <div class="s"><div class="v" id="dbNow">—</div><div class="t">Soma 7 dobras (mm)</div><div class="dv" id="dbDelta"></div></div>
      <div class="s"><div class="v" id="dbBf">—</div><div class="t">%BF estimado</div><div class="dv" id="dbBfDelta"></div></div>
    </div>
    <div class="card">
      <div class="note" style="margin-bottom:8px">Protocolo Jackson-Pollock, 7 pontos (fórmula ${C.sexo==="F"?"feminina":"masculina"}). Registre os milímetros brutos de cada dobra — a soma bruta continua sendo o indicador de tendência principal, o mais confiável. O %BF estimado é calculado a partir da soma e da idade e serve como leitura de contexto: é sensível à padronização do avaliador (mesma pessoa, mesmo local, mesma pressão) — compare sempre dentro do mesmo protocolo de medição.</div>
      <div class="meas-add">
        <div class="fld"><label>Peitoral</label><input id="dbChest" inputmode="decimal" placeholder="mm"></div>
        <div class="fld"><label>Abdominal</label><input id="dbAbd" inputmode="decimal" placeholder="mm"></div>
        <div class="fld"><label>Coxa</label><input id="dbThigh" inputmode="decimal" placeholder="mm"></div>
      </div>
      <div class="meas-add">
        <div class="fld"><label>Tríceps</label><input id="dbTri" inputmode="decimal" placeholder="mm"></div>
        <div class="fld"><label>Subescapular</label><input id="dbSub" inputmode="decimal" placeholder="mm"></div>
        <div class="fld"><label>Suprailíaca</label><input id="dbSupra" inputmode="decimal" placeholder="mm"></div>
      </div>
      <div class="meas-add">
        <div class="fld" style="max-width:33%"><label>Axilar média</label><input id="dbAx" inputmode="decimal" placeholder="mm"></div>
      </div>
      <button class="addbtn" onclick="saveDobras()">Salvar teste de hoje</button>
      <div class="ibox" id="dobrasCompare" style="margin-top:12px"></div>
      <div class="hist" id="dobrasHist" style="margin-top:10px"></div>
    </div>
  </div>
</div></section>

</div>

<nav class="bn">
  <button class="on" data-tab="dash" onclick="go('dash')"><span class="ic">◔</span>Dashboard</button>
  <button data-tab="diet" onclick="go('diet')"><span class="ic">▤</span>Dieta</button>
  <button data-tab="train" onclick="go('train')"><span class="ic">▦</span>Treino</button>
  <button data-tab="meas" onclick="go('meas')"><span class="ic">↧</span>Medidas</button>
</nav>

`);
/* ============================================================
   TABS
============================================================ */
var TITLES={
  dash:[C.titulo,"Musculação · Nutrição · Cardio · Performance"],
  diet:["Nutrição","Registro de refeições e macros"],
  train:["Treino","Musculação + cardio · versão de proteção"],
  cardio:["Cardio","Condicionamento e saúde vascular"],
  meas:["Medidas","Peso, cintura e tendência"],
  plan:["Plano","Timeline · 12 semanas · gatilhos"]
};
function go(t){
  document.querySelectorAll("section").forEach(function(s){s.classList.remove("on")});
  document.getElementById("s-"+t).classList.add("on");
  document.querySelectorAll("nav.bn button").forEach(function(b){b.classList.toggle("on",b.dataset.tab===t)});
  document.getElementById("hTitle").innerHTML=TITLES[t][0];
  document.getElementById("hSub").textContent=TITLES[t][1];
  document.querySelector(".scrollwrap").scrollTop=0;
  if(t==="meas")drawChart();
  if(t==="dash")renderDash();
  if(t==="train")setTimeout(setTrH,0);

}

/* ============================================================
   STORAGE
============================================================ */
var DB=load();
function load(){try{return JSON.parse(LS.getItem(C.dbKey)||"{}")}catch(e){return{}}}
function save(){try{LS.setItem(C.dbKey,JSON.stringify(DB))}catch(e){}}
function pad(n){return String(n).padStart(2,"0")}
function keyOf(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function weekKeyOf(d){var on=new Date(d.getFullYear(),0,1);var w=Math.ceil((((d-on)/86400000)+on.getDay()+1)/7);return d.getFullYear()+"W"+w}
function dietDay(k){DB.diet=DB.diet||{};DB.diet[k]=DB.diet[k]||{};return DB.diet[k]}

/* Fonte de verdade remota (data.json no repo). Roda antes do init.
   Se falhar (offline, deploy fora do ar), segue com o que já está no LS. */
async function loadRemoteData(){
  try{
    var res=await fetch('data.json',{cache:'no-store'});
    if(!res.ok)return false;
    var remote=await res.json();
    if(remote.diet)DB.diet=remote.diet;
    if(remote.dobras)DB.dobras=remote.dobras;
    if(remote.avaliacoesProf)DB.avaliacoesProf=remote.avaliacoesProf;
    if(remote.treinos)DB.treinos=remote.treinos;
    try{var r2=await fetch('treinos.json',{cache:'no-store'});if(r2.ok)DB.recebidos=await r2.json()}catch(e){}
    aplicarRecebidos();
    if(remote.planoRevisoes)DB.planoRevisoes=remote.planoRevisoes;
    if(remote.exames)DB.exames=remote.exames;
    DB.processados=remote.processados||{};
    if(remote.cardioWeek)DB.cardioWeek=remote.cardioWeek;
    if(remote.health)DB.health=remote.health;
    if(remote.healthWeekly)DB.healthWeekly=remote.healthWeekly;
    if(remote.cargas){
      Object.keys(remote.cargas).forEach(function(k){LS.setItem(k,remote.cargas[k])});
    }
    save();
    return true;
  }catch(e){
    /* offline ou data.json indisponível — segue com o cache local */
    return false;
  }
}

/* Botão Sincronizar — re-busca data.json e re-renderiza as abas com dados, sem reload */
async function syncNow(){
  var btn=document.getElementById('syncBtn');var st=document.getElementById('syncStatus');
  btn.disabled=true;btn.style.opacity='.5';
  var ok=await loadRemoteData();
  renderDash();renderDiet();renderMeas();renderDobras();renderCardioChecks();
  processarFila().then(renderEnvios);
  if(document.getElementById('s-meas').classList.contains('on'))drawChart();
  var now=new Date();var hm=pad(now.getHours())+':'+pad(now.getMinutes());
  if(ok){st.textContent='Sincronizado às '+hm;st.style.color='var(--mt)'}
  else{st.textContent='Falha ao sincronizar (offline?) · '+hm;st.style.color='var(--rd)'}
  btn.disabled=false;btn.style.opacity='1';
}

var TARGET=C.TARGET;

/* ============================================================
   MUSCULAÇÃO — preservado do app original (versão de proteção)
============================================================ */
var MUSC=C.MUSC;
var TM={p:['ep','◆ principal'],c:['ec2','⚠ coluna'],f:['ef','⚡ perf']};

function getKey(dayIdx,exIdx){return'pg_d'+dayIdx+'_e'+exIdx}
function salvarCarga(dayIdx,exIdx){
  var inp=document.getElementById('inp_'+dayIdx+'_'+exIdx);
  var lbl=document.getElementById('lbl_'+dayIdx+'_'+exIdx);
  var val=parseFloat(inp.value);
  if(!val||val<=0)return;
  LS.setItem(getKey(dayIdx,exIdx),val);
  lbl.innerHTML='Atual: <b>'+val+' kg</b>';
  inp.value='';inp.placeholder='kg';
}
function toggleCheck(dayIdx,exIdx){
  var btn=document.getElementById('chk_'+dayIdx+'_'+exIdx);
  var card=document.getElementById('card_'+dayIdx+'_'+exIdx);
  var on=btn.classList.toggle('on');
  if(on){card.classList.add('done')}else{card.classList.remove('done')}
}

function buildMusc(){
  var tabs=document.getElementById('dtabs');var panels=document.getElementById('dpanels');
  MUSC.forEach(function(d,i){
    var tb=document.createElement('button');
    tb.className='day-tab'+(i===0?' on':'');
    tb.style.borderBottomColor=i===0?d.c:'transparent';
    tb.style.color=i===0?'var(--tx)':'var(--mt)';
    tb.innerHTML='<span class="dtd">'+d.l+'</span><span class="dtn">'+d.n+'</span>';
    tb.addEventListener('click',function(){
      document.querySelectorAll('#dtabs .day-tab').forEach(function(t){t.classList.remove('on');t.style.borderBottomColor='transparent';t.style.color='var(--mt)'});
      document.querySelectorAll('#dpanels .panel').forEach(function(p){p.classList.remove('on')});
      tb.classList.add('on');tb.style.borderBottomColor=d.c;tb.style.color='var(--tx)';
      document.getElementById('dp'+i).classList.add('on');
    });
    tabs.appendChild(tb);
    var pnl=document.createElement('div');pnl.className='panel'+(i===0?' on':'');pnl.id='dp'+i;
    var tl='<div class="tl">',xi=0;d.tl.forEach(function(s){var tgt=s.h?xi++:-1;tl+='<div class="ts'+(s.h?' hi':'')+'"'+(tgt>=0?' onclick="jumpEx('+i+','+tgt+')"':'')+'>'+s.t+'<div class="tm">'+s.m+'</div></div>'});tl+='</div>';
    var ex='';
    d.ex.forEach(function(e,ei){
      var tgs='';if(e.tg.length){tgs='<div class="etgs">';e.tg.forEach(function(t){var m=TM[t];tgs+='<span class="etg '+m[0]+'">'+m[1]+'</span>'});tgs+='</div>'}
      var saved=LS.getItem(getKey(i,ei));
      var lblHtml=saved?'Atual: <b>'+saved+' kg</b>':'<span style="font-style:italic;color:var(--mt)">Sem registro</span>';
      ex+='<div class="ec" id="card_'+i+'_'+ei+'"><div class="ea" style="background:'+d.c+'"></div>'
        +'<div class="ec-top"><div class="ec-body">'
        +'<div class="en">Exercício '+(ei+1)+' / '+d.ex.length+'</div>'
        +'<div class="enm">'+e.n+'</div>'+tgs
        +'<div class="ests"><div class="est"><span class="esl">Séries</span><span class="esv">'+e.s+'</span></div>'
        +'<div class="est"><span class="esl">Reps</span><span class="esv sm">'+e.r+'</span></div>'
        +'<div class="est"><span class="esl">Descanso</span><span class="esv">'+e.d+'</span></div></div>'
        +'<div class="enote">'+e.nt+'</div>'+(e.dm?'<button class="demo-btn" onclick="open3D(\''+e.dm+'\')">◆ Ver execução em 3D</button>':'')+'</div>'
        +'<button class="chk-btn" id="chk_'+i+'_'+ei+'" onclick="toggleCheck('+i+','+ei+')" aria-label="Concluído"><svg viewBox="0 0 14 14"><polyline points="2,7 5.5,11 12,3"/></svg></button></div>'
        +'<div class="reg"><div class="reg-last" id="lbl_'+i+'_'+ei+'">'+lblHtml+'</div>'
        +'<div class="reg-right"><input class="reg-inp" type="number" id="inp_'+i+'_'+ei+'" placeholder="kg" min="0" max="300" step="1" inputmode="decimal"/>'
        +'<span class="reg-unit">kg</span><button class="reg-btn" onclick="salvarCarga('+i+','+ei+')">Salvar</button></div></div></div>';
    });
    var runb='<div class="sendbar"><button class="gobtn" id="runbtn_'+i+'" onclick="iniciarOuConcluir('+i+')"></button><span class="tmr" id="runtmr_'+i+'"></span></div><div class="sendst"></div>';
    pnl.innerHTML='<span class="bdg" style="background:'+d.c+'22;color:'+d.c+'">'+d.n+'</span>'
      +'<div class="ptl">'+d.n+'</div><div class="pfoc">'+d.foc+'</div>'+tl+runb+ex
      +'<div class="ibox"><b>Nota:</b> '+d.info+'</div>'
      +'<div class="ftr"><div class="ftrtl">Diretrizes</div>'
      +'Aquecimento: 3–4 min + 1 série leve (50%) no composto principal.<br>'
      +'Progressão: sobe a carga ao completar todas as reps com técnica limpa por 2 sessões seguidas. Mantenha 1–2 reps na reserva enquanto o quadro estiver em avaliação.<br>'
      +'Cervical: pescoço neutro e sem pressão acima da cabeça enquanto a cervical estiver ativa.<br>'
      +'Lombar: posição neutra sempre; sem flexão lombar carregada até esclarecer o D11-D12.<br>'
      +'Todos os movimentos são bilaterais ou em máquina, com tronco apoiado.</div>';
    panels.appendChild(pnl);
  });
}

/* ============================================================
   CARDIO — reposicionado: sessão 3 movida de Sexta (dia de perna)
   para Domingo (descanso real), conforme etapa 5 do projeto.
============================================================ */
var CARD=C.CARD;
function buildCard(){
  var tabs=document.getElementById('ctabs');var panels=document.getElementById('cpanels');
  CARD.forEach(function(d,i){
    var tb=document.createElement('button');
    tb.className='day-tab'+(i===0?' on':'');
    tb.style.borderBottomColor=i===0?d.c:'transparent';
    tb.style.color=i===0?'var(--tx)':'var(--mt)';
    tb.innerHTML='<span class="dtd">'+d.l+'</span><span class="dtn">'+d.n+'</span>';
    tb.addEventListener('click',function(){
      document.querySelectorAll('#ctabs .day-tab').forEach(function(t){t.classList.remove('on');t.style.borderBottomColor='transparent';t.style.color='var(--mt)'});
      document.querySelectorAll('#cpanels .panel').forEach(function(p){p.classList.remove('on')});
      tb.classList.add('on');tb.style.borderBottomColor=d.c;tb.style.color='var(--tx)';
      document.getElementById('cp'+i).classList.add('on');
    });
    tabs.appendChild(tb);
    var pnl=document.createElement('div');pnl.className='panel'+(i===0?' on':'');pnl.id='cp'+i;
    var meta='<div class="meta"><div class="mc"><div class="ml">Duração</div><div class="mv">'+d.dur+'</div></div>'
      +'<div class="mc"><div class="ml">Equipamento</div><div class="mv">'+d.equip+'</div></div></div>'
      +'<div class="ibox"><b>Objetivo:</b> '+d.obj+'</div>';
    var phases='<div class="slbl">Estrutura da sessão</div>';
    d.phases.forEach(function(p){
      phases+='<div class="pc"><div class="pa" style="background:'+p.c+'"></div>'
        +'<div class="pn">'+p.n+'</div><div class="pt">'+p.t+'</div>'
        +'<div class="psts"><div class="pst"><span class="psl">Duração</span><span class="psv">'+p.dur+'</span></div>'
        +'<div class="pst"><span class="psl">Zona</span><span class="psv">'+p.zona+'</span></div>'
        +'<div class="pst"><span class="psl">Intensidade</span><span class="psv">'+p.int+'</span></div></div>'
        +'<div class="pnote">'+p.note+'</div></div>';
    });
    pnl.innerHTML='<span class="bdg" style="background:'+d.c+'22;color:'+d.c+'">'+d.badge+'</span>'
      +'<div class="ptl">'+d.n+'</div><div class="pfoc">'+d.foc+'</div>'+meta+phases
      +'<div class="ibox"><b>Nota:</b> '+d.info+'</div>'
      +'<div class="card"><div class="lbl">Fechar a sessão</div><div class="note" style="margin:0 0 8px">No fim do último tiro, anote a FC (pico). Pare, fique sentado e anote a FC 1 minuto depois.</div>'
      +'<div class="cfin"><input id="cpk_'+i+'" inputmode="numeric" placeholder="FC pico (bpm)" oninput="hrrCalc('+i+')"><input id="cf1_'+i+'" inputmode="numeric" placeholder="FC após 1 min" oninput="hrrCalc('+i+')"></div>'
      +'<div class="hrr-res" id="hrr_'+i+'"></div>'+hrrTable()
      +'<button class="gobtn" id="cbtn_'+i+'" onclick="concluirCardio('+i+')">Concluir e enviar cardio</button><div class="sendst" style="margin:8px 0 0"></div></div>';
    panels.appendChild(pnl);
  });
}
function renderCardioChecks(){
  DB.cardioWeek=DB.cardioWeek||{};var wk=weekKeyOf(new Date());DB.cardioWeek[wk]=DB.cardioWeek[wk]||{};
  var c=DB.cardioWeek[wk];var el=document.getElementById('cardioChecks');el.innerHTML='';cardioBadge();
  CARD.forEach(function(d,i){
    var done=!!c[i];
    var row=document.createElement('div');row.className='chk'+(done?' done':'');
    row.innerHTML='<div class="box2">'+(done?'✓':'')+'</div><div class="cn">'+d.l+' — '+d.n+'<small>'+d.dur+' · '+d.foc+'</small></div>';
    row.onclick=function(){c[i]=!c[i];save();renderCardioChecks();if(document.getElementById('s-dash').classList.contains('on'))renderDash()};
    el.appendChild(row);
  });
}
function jumpEx(i,ei){var el=document.getElementById('card_'+i+'_'+ei);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
function setTrH(){var st=document.getElementById('trSticky'),dt=document.getElementById('dtabs');if(!st)return;
  var sec=document.getElementById('s-train');sec.style.setProperty('--trh',st.offsetHeight+'px');
  var vis=document.getElementById('trPanelMusc').style.display==='none'?document.getElementById('ctabs'):dt;if(vis&&vis.offsetHeight)sec.style.setProperty('--dth',vis.offsetHeight+'px')}
function setTrainTab(t){
  document.getElementById('trTabMusc').classList.toggle('on',t==='musc');
  document.getElementById('trTabCard').classList.toggle('on',t==='card');
  document.getElementById('trPanelMusc').style.display=t==='musc'?'block':'none';
  document.getElementById('trPanelCard').style.display=t==='card'?'block':'none';
  setTimeout(setTrH,0);
}
function cardioBadge(){
  var n=0;weekDatesFrom(mondayOf(new Date())).forEach(function(d){var t=(DB.treinos||{})[keyOf(d)];if(t&&t.cardio)n++});
  var el=document.getElementById('trCardBadge');if(el)el.textContent='· '+n+'/'+CARD.length;
}
function resetCardioWeek(){var wk=weekKeyOf(new Date());DB.cardioWeek=DB.cardioWeek||{};DB.cardioWeek[wk]={};save();renderCardioChecks()}


/* ============================================================
   ENVIO PELO APP — app -> ntfy.sh (anônimo) -> GitHub Actions -> treinos.json
   Fila local guarda tudo até aparecer no treinos.json.
============================================================ */
var NTFY_TOPIC=C.ntfy;
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function nowTs(){var n=new Date();return keyOf(n)+'T'+pad(n.getHours())+':'+pad(n.getMinutes())}
function fila(){try{return JSON.parse(LS.getItem('pgFila')||'[]')}catch(e){return[]}}
function setFila(f){try{LS.setItem('pgFila',JSON.stringify(f.slice(-60)))}catch(e){}}
async function postNtfy(p){
  var r=await fetch('https://ntfy.sh/'+NTFY_TOPIC,{method:'POST',body:JSON.stringify(p)});
  if(!r.ok)throw new Error('ntfy '+r.status);
}
async function enviar(p){
  var f=fila();f.push({p:p,st:'pendente',em:nowTs()});setFila(f);
  await processarFila();renderEnvios();
}
async function processarFila(){
  var f=fila(),ok=recebidosIds();
  for(var i=0;i<f.length;i++){
    if(ok[f[i].p.id])f[i].st='gravado';
    else if(f[i].st==='pendente'){try{await postNtfy(f[i].p);f[i].st='enviado';f[i].env=Date.now()}catch(e){}}
    /* rede de segurança: o GitHub às vezes atrasa horas; se ainda não gravou após 2 h, reenvia (o id evita duplicar) */
    else if(f[i].st==='enviado'&&Date.now()-(f[i].env||0)>2*3600000){try{await postNtfy(f[i].p);f[i].env=Date.now()}catch(e){}}
  }
  setFila(f);
}
function recebidosIds(){var m={};((DB.recebidos||{}).registros||[]).forEach(function(r){m[r.id]=1});return m}
function stTxt(st){if(st&&st.k!=null)return 'calculado · '+Math.round(st.k).toLocaleString('pt-BR')+' kcal';return st==='gravado'?'✓ gravado':st==='enviado'?'enviado · aguardando GitHub':'sem conexão · vai reenviar'}
/* --- Treino --- */
var TREINO_RUN=null;try{TREINO_RUN=JSON.parse(LS.getItem('pgRun')||'null')}catch(e){}
function iniciarOuConcluir(i){
  var b=document.getElementById('runbtn_'+i);
  if(!TREINO_RUN||TREINO_RUN.i!==i){
    TREINO_RUN={i:i,ini:Date.now()};LS.setItem('pgRun',JSON.stringify(TREINO_RUN));renderRunBars();return;
  }
  if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Toque de novo para confirmar';setTimeout(function(){b.dataset.c='';renderRunBars()},3500);return}
  var d=MUSC[i],ex=d.ex.map(function(e,ei){
    var c=LS.getItem(getKey(i,ei)),on=document.getElementById('chk_'+i+'_'+ei).classList.contains('on');
    return[e.n.slice(0,40),c?parseFloat(c):null,on?1:0]});
  var ini=new Date(TREINO_RUN.ini),dur=Math.round((Date.now()-TREINO_RUN.ini)/60000);
  var p={v:1,t:'treino',id:uid(),d:keyOf(new Date()),dia:d.n,ini:pad(ini.getHours())+':'+pad(ini.getMinutes()),dur:dur,ex:ex};
  TREINO_RUN=null;LS.removeItem('pgRun');
  d.ex.forEach(function(e,ei){var c=document.getElementById('chk_'+i+'_'+ei);c.classList.remove('on');document.getElementById('card_'+i+'_'+ei).classList.remove('done')});
  enviar(p).then(function(){renderRunBars();renderDash()});
}
function renderRunBars(){
  MUSC.forEach(function(d,i){
    var b=document.getElementById('runbtn_'+i),t=document.getElementById('runtmr_'+i);if(!b)return;
    var run=TREINO_RUN&&TREINO_RUN.i===i;b.dataset.c='';
    b.textContent=run?'Concluir e enviar treino':'▶ Iniciar treino de '+d.n.toLowerCase();
    b.classList.toggle('run',!!run);
    t.textContent=run?Math.floor((Date.now()-TREINO_RUN.ini)/60000)+' min':'';
  });
}
setInterval(function(){if(TREINO_RUN)renderRunBars()},30000);
/* --- Cardio --- */
function concluirCardio(i){
  var b=document.getElementById('cbtn_'+i);
  if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='Toque de novo para confirmar';setTimeout(function(){b.dataset.c='';b.textContent='Concluir e enviar cardio'},3500);return}
  var pk=parseFloat((document.getElementById('cpk_'+i).value||'').replace(',','.')),f1=parseFloat((document.getElementById('cf1_'+i).value||'').replace(',','.'));
  var p={v:1,t:'cardio',id:uid(),d:keyOf(new Date()),sess:CARD[i].n,pico:isNaN(pk)?null:pk,fc1:isNaN(f1)?null:f1};
  document.getElementById('cpk_'+i).value='';document.getElementById('cf1_'+i).value='';
  b.dataset.c='';b.textContent='Enviado ✓';setTimeout(function(){b.textContent='Concluir e enviar cardio'},3000);
  enviar(p).then(function(){renderDash()});
}
/* --- Recuperação cardíaca: queda da FC em 1 min após o esforço --- */
var HRR=[[0,12,'Ruim — leve ao médico','r'],[13,20,'Aceitável','a'],[21,30,'Bom','g'],[31,999,'Muito bom','g']];
function hrrTable(){
  return '<div class="hrr-t"><div class="lbl" style="margin:12px 0 4px">Queda em 1 min — referência</div>'
   +HRR.map(function(h){return '<div class="hrr-row '+h[3]+'"><span>'+(h[1]>=999?'mais de 30 bpm':h[0]===0?'até 12 bpm':h[0]+'–'+h[1]+' bpm')+'</span><span>'+h[2]+'</span></div>'}).join('')
   +'<div class="note" style="margin:6px 0 0">Exemplo: pico 160 → 1 min depois 148 ou mais = ruim · 140–147 aceitável · 130–139 bom · abaixo de 130 muito bom. Compare sempre o mesmo tiro final, medindo do mesmo jeito. Evoluir = pico mais baixo e queda maior.</div></div>';
}
function hrrCalc(i){
  var pk=parseFloat((document.getElementById('cpk_'+i).value||'').replace(',','.')),f1=parseFloat((document.getElementById('cf1_'+i).value||'').replace(',','.'));
  var el=document.getElementById('hrr_'+i);if(isNaN(pk)||isNaN(f1)){el.textContent='';el.className='hrr-res';return}
  var q=pk-f1,h=HRR.filter(function(x){return q>=x[0]&&q<=x[1]})[0]||HRR[0];
  el.className='hrr-res '+h[3];el.textContent='Queda de '+q+' bpm · '+h[2];
}
/* Histórico de recuperação: registros de cardio gravados + envios ainda pendentes */
function renderHrrHist(){
  var el=document.getElementById('hrrHist');if(!el)return;
  var vistos={},rows=[];
  var regs=((DB.recebidos||{}).registros||[]).filter(function(r){return r.t==='cardio'&&!r.ignorar});
  var pend=fila().filter(function(x){return x.p.t==='cardio'}).map(function(x){return x.p});
  regs.concat(pend).forEach(function(r){if(vistos[r.id]||r.pico==null||r.fc1==null)return;vistos[r.id]=1;rows.push(r)});
  rows.sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:0});
  var h='<div class="lbl">Histórico de recuperação · queda em 1 min</div>';
  if(!rows.length){el.innerHTML=h+'<div class="empty2">Nenhuma sessão com pico e FC de 1 min ainda. Preencha no fim do cardio.</div>';return}
  var qs=rows.map(function(r){return r.pico-r.fc1}),med=qs.reduce(function(a,b){return a+b},0)/qs.length;
  h+='<div class="kpis" style="margin:4px 0 8px"><div class="kpi"><div class="v">'+qs[0]+'<small> bpm</small></div><div class="t">última queda</div></div><div class="kpi"><div class="v">'+Math.round(med)+'<small> bpm</small></div><div class="t">média · '+rows.length+' sessões</div></div></div>';
  rows.slice(0,12).forEach(function(r){
    var q=r.pico-r.fc1,f=HRR.filter(function(x){return q>=x[0]&&q<=x[1]})[0]||HRR[0];
    h+='<div class="hrr-row '+f[3]+'"><span>'+fmtD(r.d)+' · '+escH(r.sess||'Cardio')+'</span><span>'+Math.round(r.pico)+' → '+Math.round(r.fc1)+' · <b style="color:var(--tx)">−'+Math.round(q)+'</b> '+f[2].split(' —')[0]+'</span></div>';
  });
  h+='<div class="note" style="margin:6px 0 0">Compare sessões do mesmo tipo (tiros com tiros). Evoluir = pico mais baixo e queda maior.</div>';
  el.innerHTML=h;
}
function escH(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
/* --- Dieta (ditado) --- */
function enviarDitado(){
  var el=document.getElementById('ditTxt'),tx=(el.value||'').trim();if(!tx)return;
  el.value='';enviar({v:1,t:'dieta',id:uid(),ts:nowTs(),texto:tx.slice(0,1500)});
}
function renderEnvios(){
  renderHrrHist();
  var box=document.getElementById('ditList');if(!box)return;
  var hoje=keyOf(new Date()),ok=recebidosIds(),rows=[];
  fila().forEach(function(x){if(x.p.t==='dieta'&&x.p.ts&&x.p.ts.slice(0,10)===hoje){var pr=(DB.processados||{})[x.p.id];rows.push([x.p.ts.slice(11),x.p.texto,pr?pr:(ok[x.p.id]?'gravado':x.st)])}});
  box.innerHTML=rows.length?'<div class="lbl" style="margin:12px 0 2px">Enviados hoje</div>':'';
  rows.reverse().forEach(function(r){var d=document.createElement('div');d.className='qrow';
    var a=document.createElement('span');a.textContent=r[0]+' · '+r[1];var b=document.createElement('span');b.textContent=stTxt(r[2]);
    d.appendChild(a);d.appendChild(b);box.appendChild(d)});
  var st=document.getElementById('sendSt');
  var pend=fila().filter(function(x){return !ok[x.p.id]}).length;
  document.querySelectorAll('.sendst').forEach(function(e){e.textContent=pend?pend+' envio(s) aguardando o GitHub (até ~15 min)':''});
}
/* registros recebidos -> treinos do Dashboard e cargas */
function aplicarRecebidos(){
  DB.treinos=DB.treinos||{};
  ((DB.recebidos||{}).registros||[]).forEach(function(r){
    if(r.ignorar)return;
    var t=DB.treinos[r.d]=DB.treinos[r.d]||{};
    if(r.t==='treino'){t.musc=t.musc||r.dia;
      var di=-1;MUSC.forEach(function(m,ix){if(m.n===r.dia)di=ix});
      if(di>=0)(r.ex||[]).forEach(function(e,ei){if(e[1]!=null&&MUSC[di].ex[ei]&&MUSC[di].ex[ei].n.slice(0,40)===e[0])LS.setItem(getKey(di,ei),e[1])});}
    if(r.t==='cardio')t.cardio=t.cardio||r.sess;
  });
  mesclarRefeicoes();
  renderHrrHist();
  cardioBadge();
}
/* Refeições lançadas no app: aparecem na Dieta mesmo antes do fechamento da noite */
function mesclarRefeicoes(){
  var regs=((DB.recebidos||{}).registros||[]).filter(function(r){return !r.ignorar}),proc=DB.processados||{},rem={};
  var fl=fila().filter(function(x){return x.st!=='gravado'}).map(function(x){return x.p});
  regs.concat(fl).forEach(function(r){if(r.t==='remover')rem[r.ref]=1});
  Object.keys(DB.diet||{}).forEach(function(k){SLOTS.forEach(function(s){var a=DB.diet[k][s[0]];if(a)DB.diet[k][s[0]]=a.filter(function(x){return !(x.src&&rem[x.src])})})});
  regs.concat(fl).forEach(function(r){
    if(r.t!=='refeicao'||proc[r.id]||rem[r.id])return;
    var d=dietDay(r.d);d[r.slot]=d[r.slot]||[];
    if(!d[r.slot].some(function(x){return x.src===r.id}))d[r.slot].push({n:r.n,k:r.k,p:r.p,c:r.c,f:r.f,src:r.id});
  });
}

/* ============================================================
   DIETA
============================================================ */
var SLOTS=[["cafe","Café da Manhã"],["lm","Lanche Manhã"],["almoco","Almoço"],["lt","Lanche Tarde"],["janta","Janta"],["ceia","Ceia"]];
var QUICK=C.QUICK||[];
var curSlot="cafe";
var curDate=new Date();

function shiftDay(n){curDate.setDate(curDate.getDate()+n);renderDateBar();renderDiet()}
function renderDateBar(){
  var t=new Date();var yd=new Date();yd.setDate(t.getDate()-1);
  var isToday=keyOf(curDate)===keyOf(t);var isYd=keyOf(curDate)===keyOf(yd);
  document.getElementById('dLabel').textContent=isToday?'Hoje':(isYd?'Ontem':curDate.toLocaleDateString('pt-BR',{weekday:'long'}));
  document.getElementById('dFull').textContent=curDate.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
}
function renderSlotBar(){
  var el=document.getElementById('slotBar');el.innerHTML='';
  SLOTS.forEach(function(s){
    var b=document.createElement('button');b.textContent=s[1];b.className=s[0]===curSlot?'on':'';
    b.onclick=function(){curSlot=s[0];renderSlotBar()};el.appendChild(b);
  });
}
function renderChips(){
  var el=document.getElementById('chipBar');el.innerHTML='';
  QUICK.forEach(function(q){
    var b=document.createElement('button');b.textContent=q.l||q.n;
    b.onclick=function(){
      document.getElementById('mName').value=q.n;
      document.getElementById('mK').value=q.k;
      document.getElementById('mP').value=q.p;
      document.getElementById('mC').value=q.c;
      document.getElementById('mF').value=q.f;
      if(q.slot){curSlot=q.slot;renderSlotBar()}
    };
    el.appendChild(b);
  });
}
function numv(id){var v=parseFloat((document.getElementById(id).value||'').replace(',','.'));return isNaN(v)?0:Math.round(v)}
function addMeal(){
  var n=document.getElementById('mName').value.trim();
  var k=numv('mK');
  if(!n||!k){var e=document.getElementById('mName');e.style.borderColor='#c07070';setTimeout(function(){e.style.borderColor=''},600);return}
  var p=numv('mP'),c=numv('mC'),f=numv('mF');
  var d=dietDay(keyOf(curDate));d[curSlot]=d[curSlot]||[];
  var id=uid();
  d[curSlot].push({n:n,k:k,p:p,c:c,f:f,src:id});
  save();
  enviar({v:1,t:'refeicao',id:id,d:keyOf(curDate),slot:curSlot,n:n.slice(0,80),k:k,p:p,c:c,f:f});
  ['mName','mK','mP','mC','mF'].forEach(function(id){document.getElementById(id).value=''});
  renderDiet();
}
function delMeal(slot,idx){var d=dietDay(keyOf(curDate)),it=d[slot][idx];d[slot].splice(idx,1);save();renderDiet();
  if(it&&it.src)enviar({v:1,t:'remover',id:uid(),ref:it.src})}
function dayTotals(k){
  var d=dietDay(k);var t={k:0,p:0,c:0,f:0};
  SLOTS.forEach(function(s){(d[s[0]]||[]).forEach(function(x){t.k+=x.k;t.p+=x.p;t.c+=x.c;t.f+=x.f})});
  return t;
}
function renderDiet(){
  renderDateBar();
  var k=keyOf(curDate);var t=dayTotals(k);
  document.getElementById('dietKcal').innerHTML=t.k.toLocaleString('pt-BR')+' <span style="font-size:12px;color:var(--mt);font-weight:400">/ '+C.metaKcalTxt+' kcal</span>';
  document.getElementById('dietP').textContent=t.p;
  document.getElementById('dietC').textContent=t.c;
  document.getElementById('dietF').textContent=t.f;
  setw('barP',t.p/TARGET.p);setw('barC',t.c/TARGET.c);setw('barF',t.f/TARGET.f);
  var d=dietDay(k);var groups=document.getElementById('mealGroups');groups.innerHTML='';
  var any=false;
  SLOTS.forEach(function(s){
    var items=d[s[0]]||[];if(!items.length)return;any=true;
    var sub=items.reduce(function(a,x){return a+x.k},0);
    var g=document.createElement('div');g.className='mealgrp';
    var body='<div class="gh"><b>'+s[1]+'</b><span>'+sub+' kcal</span></div>';
    items.forEach(function(x,i){
      var mv=(x.p||x.c||x.f)?'<span class="mv2">'+x.p+'/'+x.c+'/'+x.f+'</span>':'';
      body+='<div class="mitem"><span class="nm">'+esc(x.n)+'</span>'+mv+'<span class="kv">'+x.k+' kcal</span><button class="del" onclick="delMeal(\''+s[0]+'\','+i+')">×</button></div>';
    });
    g.innerHTML=body;groups.appendChild(g);
  });
  if(!any)groups.innerHTML='<div class="empty2">Nenhuma refeição registrada neste dia.</div>';
}
function setw(id,r){document.getElementById(id).style.width=Math.min(r*100,100)+'%'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ============================================================
   DASHBOARD
============================================================ */
var DELTA_BAND=10; // % — dentro disso, tratado como estável

function mondayOf(d){
  var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  var day=x.getDay();var diff=(day===0?-6:1-day);
  x.setDate(x.getDate()+diff);return x;
}
function weekDatesFrom(monday){
  var arr=[];for(var i=0;i<7;i++){var d=new Date(monday);d.setDate(d.getDate()+i);arr.push(d)}return arr;
}
function weekAvgMacros(monday){
  var dates=weekDatesFrom(monday);var sum={k:0,p:0,c:0,f:0};var n=0;
  dates.forEach(function(d){var t=dayTotals(keyOf(d));if(t.k>0){sum.k+=t.k;sum.p+=t.p;sum.c+=t.c;sum.f+=t.f;n++}});
  if(!n)return null;
  return{avgK:sum.k/n,avgP:sum.p/n,avgC:sum.c/n,avgF:sum.f/n,n:n};
}
function deltaPct(cur,prev){if(!prev)return null;return((cur-prev)/prev)*100}
function deltaHtml(cur,prev,color){
  var pct=deltaPct(cur,prev);
  if(pct===null)return '<span class="dd" style="color:var(--mt)">— 1ª semana</span>';
  if(Math.abs(pct)<DELTA_BAND)return '<span class="dd" style="color:var(--mt)">→ estável ('+(pct>0?'+':'')+Math.round(pct)+'%)</span>';
  var arrow=pct>0?'↑':'↓';
  return '<span class="dd" style="color:'+color+'">'+arrow+' '+Math.round(Math.abs(pct))+'% vs. sem. passada</span>';
}
function metricBox(label,value,unit,deltaHtmlStr,color,full){
  return '<div class="d'+(full?' full':'')+'"><div class="dl">'+label+'</div>'
    +'<div class="dvv" style="color:'+color+'">'+value+unit+'</div>'+deltaHtmlStr+'</div>';
}

var PLANO=C.PLANO;
var DOWS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function dParse(k){return new Date(k+'T12:00:00')}
function daysBetween(a,b){return Math.round((dParse(keyOf(b))-dParse(keyOf(a)))/86400000)}
function fmtD(k){return dParse(k).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}
function muscOf(d){var l=DOWS[d.getDay()];for(var i=0;i<MUSC.length;i++)if(MUSC[i].l===l)return{i:i,d:MUSC[i]};return null}
function cardOf(d){var l=DOWS[d.getDay()];for(var i=0;i<CARD.length;i++)if(CARD[i].l===l)return{i:i,d:CARD[i]};return null}
function treinoDia(k){return(DB.treinos||{})[k]||null}
function openTreino(i,card){go('train');setTrainTab(card?'card':'musc');
  var tabs=document.querySelectorAll(card?'#ctabs .day-tab':'#dtabs .day-tab');if(tabs[i])tabs[i].click()}
function renderDash(){
  var now=new Date(),kHoje=keyOf(now);
  /* --- Hoje --- */
  var m=muscOf(now),c=cardOf(now),t=treinoDia(kHoje)||{},kc=dayTotals(kHoje).k;
  var h='<div class="lbl">Hoje · '+now.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit'})+'</div>';
  h+='<div class="today-t">'+(m?m.d.n:'Descanso')+(c?' <span style="color:var(--mt);font-weight:400">+ cardio</span>':'')+'</div>';
  h+='<div class="today-s">'+(m?m.d.foc:'Sem musculação programada. Dia de recuperação — a dieta continua em '+C.metaKcalTxt+' kcal.')+(c?'<br>Cardio: '+c.d.n+' · '+c.d.dur:'')+'</div>';
  h+='<div class="chips">';
  if(m||t.musc)h+='<span class="chip '+(t.musc?'ok':'')+'">'+(t.musc?'✓ treino registrado · '+escH(t.musc):'treino não registrado')+'</span>';
  if(c||t.cardio)h+='<span class="chip '+(t.cardio?'ok':'')+'">'+(t.cardio?'✓ cardio registrado · '+escH(t.cardio):'cardio não registrado')+'</span>';
  var nd=fila().filter(function(x){return x.p.t==='dieta'&&x.p.ts.slice(0,10)===kHoje&&!(DB.processados||{})[x.p.id]}).length;
  h+='<span class="chip '+(kc>=TARGET.kcal?'ok':'')+'">dieta '+(kc>0?Math.round(kc).toLocaleString('pt-BR'):'0')+' / '+TARGET.kcal.toLocaleString('pt-BR')+' kcal</span>'+(nd?'<span class="chip">'+nd+' refeição(ões) ditada(s) · aguardando cálculo</span>':'')+'</div>';
  if(m)h+='<button class="gobtn" onclick="openTreino('+m.i+',false)">Abrir treino de hoje →</button>';
  else if(c)h+='<button class="gobtn" onclick="openTreino('+c.i+',true)">Abrir cardio de hoje →</button>';
  document.getElementById('dToday').innerHTML=h;
  /* --- Semana --- */
  var mon=mondayOf(now),days=weekDatesFrom(mon),w='',nT=0,pT=0,nC=0,pC=0,nD=0,sumK=0;
  days.forEach(function(d){
    var k=keyOf(d),tm=muscOf(d),tc=cardOf(d),tr=treinoDia(k)||{},dk=dayTotals(k).k,past=k<=kHoje;
    if(tm)pT++; if(tr.musc)nT++; if(tc)pC++; if(tr.cardio)nC++;
    if(dk>0){nD++;sumK+=dk}
    w+='<div class="c'+(k===kHoje?' now':'')+'"><div class="dn">'+DOWS[d.getDay()].charAt(0)+'</div><div class="mk">'
      +'<i class="t '+(tr.musc?'on':(tm?'':'off'))+'"></i><i class="k '+(tr.cardio?'on':(tc?'':'off'))+'"></i><i class="d '+(dk>0?'on':'')+'"></i></div></div>';
  });
  document.getElementById('dWeek').innerHTML=w;
  var ws=healthSorted('peso').filter(function(e){return daysBetween(dParse(e.d),now)<=7});
  var pm=ws.length?ws.reduce(function(a,e){return a+e.v},0)/ws.length:null;
  document.getElementById('dKpis').innerHTML=
    '<div class="kpi"><div class="v">'+nT+'<small>/'+pT+'</small> · '+nC+'<small>/'+pC+'</small></div><div class="t">treinos · cardios</div></div>'
   +'<div class="kpi"><div class="v">'+nD+'<small>/7</small></div><div class="t">dias com dieta</div></div>'
   +'<div class="kpi"><div class="v">'+(nD?Math.round(sumK/nD).toLocaleString('pt-BR'):'—')+'<small> kcal</small></div><div class="t">média · meta '+C.metaKcalTxt+'</div></div>'
   +'<div class="kpi"><div class="v">'+(pm!=null?pm.toFixed(1).replace('.',','):'—')+'<small> kg</small></div><div class="t">peso médio 7 dias</div></div>';
  /* --- Plano --- */
  if(!PLANO||!PLANO.inicio){document.getElementById('dPlanTxt').textContent='Plano a definir';document.getElementById('dPlanBar').style.width='0';document.getElementById('dMarcos').innerHTML='';document.getElementById('dPlanNext').textContent='';var late=[];}
  else{
  var ini=dParse(PLANO.inicio),dd=daysBetween(ini,now),sem=Math.min(PLANO.semanas,Math.max(1,Math.floor(dd/7)+1));
  var bloco=sem<=8?1:2,rev=DB.planoRevisoes||[];
  document.getElementById('dPlanTxt').textContent='Bloco '+bloco+' · semana '+sem+' de '+PLANO.semanas;
  document.getElementById('dPlanBar').style.width=Math.min(100,Math.max(0,dd/(PLANO.semanas*7)*100))+'%';
  var prox=null,late=[];
  var mh='';PLANO.marcos.forEach(function(x){
    var done=rev.indexOf(x.d)>=0,lt=!done&&x.d<kHoje;if(lt)late.push(x);if(!done&&!lt&&!prox)prox=x;
    mh+='<div class="mrk'+(done?' done':'')+(lt?' late':'')+'"><div class="md">Sem '+x.sem+'<br>'+fmtD(x.d)+'</div><div><div class="mt3">'+x.t+(done?' ✓':'')+(lt?' — vencida':'')+'</div><div class="mo">'+x.o+'</div></div></div>';
  });
  document.getElementById('dMarcos').innerHTML='<div class="lbl" style="margin-bottom:2px">Revisões</div>'+mh;
  var nx=document.getElementById('dPlanNext');
  if(late.length){nx.innerHTML='<span style="color:var(--rd)">Revisão vencida: '+late[0].t+' ('+fmtD(late[0].d)+'). Hora de rever o plano.</span>'}
  else if(prox){var fd=daysBetween(now,dParse(prox.d));nx.textContent='Próxima revisão: '+prox.t+' · '+fmtD(prox.d)+' ('+(fd===0?'hoje':'em '+fd+' dia'+(fd>1?'s':''))+')'}
  else nx.textContent='Plano concluído — hora de montar o próximo.';
  }
  /* --- Alertas --- */
  var al=[];
  late.forEach(function(x){al.push(['r','Revisão do plano vencida: '+x.t,'Era em '+fmtD(x.d)+'. Me chame no chat para rever.'])});
  var dk=Object.keys(DB.diet||{}).filter(function(k){return dayTotals(k).k>0&&k<=kHoje}).sort(),lastD=dk.length?dk[dk.length-1]:null;
  var gapD=lastD?daysBetween(dParse(lastD),now):null;
  if(lastD===null||gapD>=2)al.push(['r','Dieta sem registro '+(lastD?'há '+gapD+' dias':'ainda'),lastD?'Último dia registrado: '+fmtD(lastD)+'. Mande as refeições no chat.':'Mande as refeições no chat.']);
  var ont=new Date(now);ont.setDate(ont.getDate()-1);var ko=keyOf(ont),mo=muscOf(ont),to=treinoDia(ko)||{};
  if(mo&&!to.musc)al.push(['a','Treino de ontem ('+mo.d.n+') sem registro','Me diga no chat se treinou.']);
  var pw=healthSorted('peso'),lastP=pw.length?pw[pw.length-1].d:null,gp=lastP?daysBetween(dParse(lastP),now):null;
  if(gp===null||gp>=4)al.push(['a','Peso sem registro há '+(gp===null?'—':gp+' dias'),'No bulk vale a média semanal: pese 3–4× por semana em jejum.']);
  var ex=(DB.exames||[]).filter(function(e){return e.tipo==='sangue'}).sort(function(a,b){return a.d<b.d?-1:1}),le=ex.length?ex[ex.length-1]:null;
  if(le){var me=Math.floor(daysBetween(dParse(le.d),now)/30.4);if(me>=6)al.push(['r','Exame de sangue com '+me+' meses','Último: '+le.d.split('-').reverse().join('/')+'. '+(C.exameNota||'Fazer painel novo.')+''])}
  var ap=(DB.avaliacoesProf||[]).filter(function(x){return !x.caseira}).sort(function(a,b){return a.d<b.d?-1:1}),la=ap.length?ap[ap.length-1]:null;
  if(la){var ma=Math.floor(daysBetween(dParse(la.d),now)/30.4);if(ma>=4)al.push(['a','Avaliação profissional de composição há '+ma+' meses','Última: '+la.d.split('-').reverse().join('/')+' ('+String(la.bf).replace('.',',')+'%). '+(C.composicaoNota||'')+''])}
  var ah='<div class="lbl">Alertas</div>';
  if(!al.length)ah+='<div class="alrt g"><div class="ic2"></div><div>Nada pendente.</div></div>';
  al.forEach(function(x){ah+='<div class="alrt '+x[0]+'"><div class="ic2"></div><div>'+x[1]+'<small>'+x[2]+'</small></div></div>'});
  document.getElementById('dAlerts').innerHTML=ah;
}

/* ------------------------------------------------------------
   Semana · atividade — agregado on-the-fly a partir de DB.health
   (sem resumo semanal manual — Claude escreve os dias direto no chat)
------------------------------------------------------------ */
function lastNDates(n,end){
  end=end||new Date();var arr=[];
  for(var i=n-1;i>=0;i--){var d=new Date(end);d.setDate(d.getDate()-i);arr.push(keyOf(d))}
  return arr;
}
/* Chave de semana ISO 8601 ("YYYY-Www") — semana começa na segunda, semana 1 contém a 1ª quinta do ano */
function getISOWeekKey(date){
  var d=new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
  var dayNum=d.getUTCDay()||7;
  d.setUTCDate(d.getUTCDate()+4-dayNum);
  var yearStart=new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo=Math.ceil((((d-yearStart)/86400000)+1)/7);
  return d.getUTCFullYear()+'-W'+String(weekNo).padStart(2,'0');
}
function healthAvg(dates,field){
  var vals=dates.map(function(k){return(DB.health&&DB.health[k]&&DB.health[k][field]!=null)?DB.health[k][field]:null}).filter(function(v){return v!=null});
  if(!vals.length)return null;
  return vals.reduce(function(a,b){return a+b},0)/vals.length;
}
function healthLatest(dates,field){
  for(var i=dates.length-1;i>=0;i--){
    var k=dates[i];
    if(DB.health&&DB.health[k]&&DB.health[k][field]!=null)return DB.health[k][field];
  }
  return null;
}
function renderHealthWeek(){
  DB.health=DB.health||{};
  DB.healthWeekly=DB.healthWeekly||{};
  var hGrid=document.getElementById('healthWeekGrid');
  var warnEl=document.getElementById('healthWeekWarn');
  var currentWeekKey=getISOWeekKey(new Date());
  var wk=DB.healthWeekly[currentWeekKey];
  if(!Object.keys(DB.health).length&&!wk){
    hGrid.innerHTML='<div class="d full" style="color:var(--mt);font-size:12.5px">Sem dados de saúde ainda — descreva no chat (ou cole do app Saúde) pra o Claude registrar.</div>';
    warnEl.innerHTML='';
    return;
  }
  var last7=lastNDates(7);

  /* Passos: prefere o total semanal agregado (healthWeekly) da semana atual — evita o
     bug de outlier de escrever a soma da semana como se fosse o valor de um único dia. */
  var passosAvg=(wk&&wk.passos!=null)?wk.passos/7:healthAvg(last7,'passos');
  /* Sem equivalente diário confiável — só vêm do resumo semanal agregado (healthWeekly) */
  var calAtivasAvg=(wk&&wk.calAtivas!=null)?wk.calAtivas/7:null;
  var calRepousoAvg=(wk&&wk.calRepouso!=null)?wk.calRepouso/7:null;
  var exercicioAvg=(wk&&wk.exercicioMin!=null)?wk.exercicioMin/7:null;

  hGrid.innerHTML=
    metricBox('Passos méd./dia',passosAvg!=null?Math.round(passosAvg).toLocaleString('pt-BR'):'—','','',
      'var(--tx)')
    +metricBox('Cal. ativas méd./dia',calAtivasAvg!=null?Math.round(calAtivasAvg).toLocaleString('pt-BR'):'—',' kcal','','var(--tx)')
    +metricBox('Cal. repouso méd./dia',calRepousoAvg!=null?Math.round(calRepousoAvg).toLocaleString('pt-BR'):'—',' kcal','','var(--tx)')
    +metricBox('Exercício méd./dia',exercicioAvg!=null?Math.round(exercicioAvg):'—',' min','','var(--tx)');

  warnEl.innerHTML='';
}

/* ============================================================
   MEDIDAS
============================================================ */
function saveMeas(){
  var w=parseFloat((document.getElementById('mW').value||'').replace(',','.'));
  var wa=parseFloat((document.getElementById('mWa').value||'').replace(',','.'));
  if(isNaN(w)&&isNaN(wa))return;
  DB.health=DB.health||{};var k=keyOf(new Date());
  var entry=DB.health[k]=DB.health[k]||{};
  if(!isNaN(w))entry.peso=w;
  if(!isNaN(wa))entry.cintura=wa;
  if(!entry.fonte)entry.fonte='manual';
  save();document.getElementById('mW').value='';document.getElementById('mWa').value='';
  renderMeas();drawChart();
}
/* Lista ordenada {d,v} das datas de DB.health que têm o campo informado */
function healthSorted(field){
  return Object.keys(DB.health||{})
    .filter(function(k){return DB.health[k][field]!=null})
    .sort()
    .map(function(k){return{d:k,v:DB.health[k][field]}});
}
function renderMeas(){
  var ws=healthSorted('peso');var was=healthSorted('cintura');
  document.getElementById('wNow').textContent=ws.length?ws[ws.length-1].v.toFixed(1):'—';
  document.getElementById('waNow').textContent=was.length?was[was.length-1].v.toFixed(0):'—';
  deltaEl('wDelta',ws,' kg');deltaEl('waDelta',was,' cm');
  var dates=Object.keys(DB.health||{}).filter(function(k){return DB.health[k].peso!=null||DB.health[k].cintura!=null}).sort();
  var h=document.getElementById('measHist');h.innerHTML='';
  dates.slice().reverse().slice(0,8).forEach(function(k){
    var x=DB.health[k];var parts=[];
    if(x.peso!=null)parts.push(x.peso.toFixed(1)+' kg');
    if(x.cintura!=null)parts.push(x.cintura.toFixed(0)+' cm');
    var dt=new Date(k+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
    var row=document.createElement('div');row.className='h';
    row.innerHTML='<span>'+dt+'</span><b>'+parts.join(' · ')+'</b>';h.appendChild(row);
  });
  renderCirc();
}
var CIRC_FIELDS=[['cintura','Cintura'],['abdomen','Abdômen (umbigo)'],['quadril','Quadril'],['peitoC','Peito'],['ombros','Ombros'],['pescoco','Pescoço'],['bracoR','Braço relaxado'],['bracoC','Braço contraído'],['antebraco','Antebraço'],['coxaC','Coxa (meio)'],['panturrilha','Panturrilha']];
function circVal(v,side){if(v==null)return null;if(typeof v==='number')return side==='esq'?null:v;return v[side]!=null?v[side]:null}
function renderCirc(){
  var box=document.getElementById('circBox');if(!box)return;
  var ds=Object.keys(DB.health||{}).filter(function(k){return DB.health[k].circ}).sort();
  if(!ds.length){box.innerHTML='<div class="empty2">Nenhuma avaliação com fita registrada.</div>';return}
  var L=ds[ds.length-1],P=ds.length>1?ds[ds.length-2]:null,cl=DB.health[L].circ,cp=P?DB.health[P].circ:{};
  var fd=function(k){return new Date(k+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'2-digit'})};
  var f1=function(n){return n==null?'—':(Math.round(n*10)/10).toString().replace('.',',')};
  var dl=function(a,b){if(a==null||b==null)return '';var d=a-b;if(Math.abs(d)<0.05)return ' <span style="color:var(--mt)">(=)</span>';return ' <span style="color:var(--mt)">('+(d>0?'+':'')+f1(d)+')</span>'};
  var html='<div class="note" style="margin-bottom:6px">'+fd(L)+(P?' · entre parênteses, a diferença para '+fd(P):'')+'. Membros: D / E.</div>';
  CIRC_FIELDS.forEach(function(f){
    var v=cl[f[0]];if(v==null)return;var pv=cp[f[0]];var txt;
    if(typeof v==='number')txt=f1(v)+dl(v,circVal(pv,'dir'));
    else txt='D '+f1(v.dir)+dl(v.dir,circVal(pv,'dir'))+' / E '+f1(v.esq)+dl(v.esq,circVal(pv,'esq'));
    html+='<div class="h"><span>'+f[1]+'</span><b style="font-weight:500">'+txt+'</b></div>';
  });
  if(cl.cintura&&cl.quadril)html+='<div class="h"><span>Cintura / quadril</span><b style="font-weight:500">'+(cl.cintura/cl.quadril).toFixed(2).replace('.',',')+'</b></div>';
  box.innerHTML=html;
}
function deltaEl(id,arr,unit){
  var el=document.getElementById(id);if(arr.length<2){el.textContent='';return}
  var d=arr[arr.length-1].v-arr[0].v;
  el.className='dv '+(Math.abs(d)<0.05?'flat':(d>0?'up':'down'));
  el.textContent=(d>0?'+':'')+d.toFixed(1)+unit;
}
function setMeasTab(t){
  document.getElementById('measTabPeso').classList.toggle('on',t==='peso');
  document.getElementById('measTabDobras').classList.toggle('on',t==='dobras');
  document.getElementById('measPanelPeso').style.display=t==='peso'?'block':'none';
  document.getElementById('measPanelDobras').style.display=t==='dobras'?'block':'none';
  if(t==='peso')drawChart();
}
var DOBRA_FIELDS=[['dbChest','peito','Peitoral'],['dbAbd','abd','Abdominal'],['dbThigh','coxa','Coxa'],['dbTri','tri','Tríceps'],['dbSub','sub','Subescapular'],['dbSupra','supra','Suprailíaca'],['dbAx','ax','Axilar média']];
function saveDobras(){
  var vals={};var any=false;
  DOBRA_FIELDS.forEach(function(f){
    var v=parseFloat((document.getElementById(f[0]).value||'').replace(',','.'));
    if(!isNaN(v)){vals[f[1]]=v;any=true}
  });
  if(!any)return;
  DB.dobras=DB.dobras||[];var k=keyOf(new Date());
  var ex=DB.dobras.find(function(m){return m.d===k});
  if(ex)Object.assign(ex,vals);else DB.dobras.push(Object.assign({d:k},vals));
  DB.dobras.sort(function(a,b){return a.d<b.d?-1:1});
  save();
  DOBRA_FIELDS.forEach(function(f){document.getElementById(f[0]).value=''});
  renderDobras();
}
function sumDobra(x){return DOBRA_FIELDS.reduce(function(a,f){return a+(x[f[1]]||0)},0)}
/* Jackson-Pollock 7 dobras, fórmula masculina. Idade calculada a partir do nascimento (12/06/1989) e da data do registro. */
var BIRTHDATE=C.nascimento?new Date(C.nascimento[0],C.nascimento[1]-1,C.nascimento[2]):null;
function ageAt(dateStr){
  if(!BIRTHDATE)return null;
  var d=new Date(dateStr+'T12:00:00');
  var age=d.getFullYear()-BIRTHDATE.getFullYear();
  var m=d.getMonth()-BIRTHDATE.getMonth();
  if(m<0||(m===0&&d.getDate()<BIRTHDATE.getDate()))age--;
  return age;
}
function pctBF(x){
  var soma=sumDobra(x);if(!soma)return null;
  var idade=ageAt(x.d);if(idade==null)return null;
  var bd=C.sexo==='F'?1.097-0.00046971*soma+0.00000056*soma*soma-0.00012828*idade:1.112-0.00043499*soma+0.00000055*soma*soma-0.00028826*idade;
  return(495/bd)-450;
}
function renderProf(){
  var el=document.getElementById('profBox');if(!el)return;var a=(DB.avaliacoesProf||[]).slice().sort(function(x,y){return x.d<y.d?1:-1});
  if(!a.length){el.innerHTML='<div class="empty2">Nenhuma avaliação profissional registrada.</div>';return}
  el.innerHTML=a.map(function(x){
    var dt=new Date(x.d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});
    var f=function(n){return String(n).replace('.',',')};
    var det=[];if(x.peso!=null)det.push(f(x.peso)+' kg');if(x.mlg!=null)det.push('MLG '+f(x.mlg)+' kg');if(x.mg!=null)det.push('gordura '+f(x.mg)+' kg');
    return '<div class="h" style="flex-direction:column;align-items:flex-start;gap:2px'+(x.caseira?';opacity:.7':'')+'"><div style="display:flex;justify-content:space-between;width:100%"><span>'+dt+'</span><b>'+f(x.bf)+'%'+(x.caseira?'*':'')+'</b></div>'
      +'<div style="font-size:10.5px;color:var(--mt)">'+(det.length?det.join(' · ')+' · ':'')+x.fonte+'</div></div>';
  }).join('');
}
function renderDobras(){
  renderProf();
  var m=DB.dobras||[];
  if(!m.length){document.getElementById('dbNow').textContent='—';document.getElementById('dbDelta').textContent='';document.getElementById('dbBf').textContent='—';document.getElementById('dbBfDelta').textContent='';document.getElementById('dobrasCompare').innerHTML='';document.getElementById('dobrasHist').innerHTML='<div class="empty2">Nenhum teste registrado ainda.</div>';return}
  var last=m[m.length-1];
  document.getElementById('dbNow').textContent=sumDobra(last).toFixed(1);
  var bfLast=pctBF(last);
  document.getElementById('dbBf').textContent=bfLast!=null?bfLast.toFixed(1).replace('.',',')+'%':'—';
  if(m.length>=2){
    var d=sumDobra(last)-sumDobra(m[0]);
    var dv=document.getElementById('dbDelta');
    dv.className='dv '+(Math.abs(d)<0.5?'flat':(d>0?'up':'down'));
    dv.textContent=(d>0?'+':'')+d.toFixed(1)+' mm desde o 1º registro';
    var bfFirst=pctBF(m[0]);var dbfEl=document.getElementById('dbBfDelta');
    if(bfLast!=null&&bfFirst!=null){
      var dbf=bfLast-bfFirst;
      dbfEl.className='dv '+(Math.abs(dbf)<0.1?'flat':(dbf>0?'up':'down'));
      dbfEl.textContent=(dbf>0?'+':'')+dbf.toFixed(1).replace('.',',')+'% desde o 1º registro';
    } else dbfEl.textContent='';
  } else {document.getElementById('dbDelta').textContent='';document.getElementById('dbBfDelta').textContent=''}

  var cmp=document.getElementById('dobrasCompare');
  if(m.length>=2){
    var prev=m[m.length-2];
    var dtL=new Date(last.d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
    var dtP=new Date(prev.d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
    var rows='<b>Comparação — '+dtL+' vs '+dtP+'</b><br><br>';
    DOBRA_FIELDS.forEach(function(f){
      var cv=last[f[1]],pv=prev[f[1]];
      if(cv==null&&pv==null)return;
      var line=f[2]+': ';
      if(cv==null)line+='sem registro';
      else if(pv==null)line+=cv+'mm (sem base anterior)';
      else{
        var dd=cv-pv;
        var sign=dd>0?'+':'';var color=Math.abs(dd)<0.5?'var(--mt)':(dd>0?'var(--rd)':'var(--gn)');
        line+=cv+'mm <span style="color:'+color+'">('+sign+dd.toFixed(1)+'mm)</span>';
      }
      rows+=line+'<br>';
    });
    cmp.innerHTML=rows;
  } else {
    cmp.innerHTML='<b>Primeiro registro salvo.</b><br>A comparação por ponto aparece a partir do 2º teste.';
  }

  var h=document.getElementById('dobrasHist');h.innerHTML='';
  m.slice().reverse().slice(0,8).forEach(function(x){
    var dt=new Date(x.d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'});
    var bf=pctBF(x);
    var detail=DOBRA_FIELDS.map(function(f,idx){return x[f[1]]!=null?(idx+1)+' '+x[f[1]]:null}).filter(Boolean).join(' · ');
    var row=document.createElement('div');row.className='h';row.style.flexDirection='column';row.style.alignItems='flex-start';row.style.gap='2px';
    row.innerHTML='<div style="display:flex;justify-content:space-between;width:100%"><span>'+dt+'</span><b>'+(bf!=null?bf.toFixed(1).replace('.',',')+'%':'—')+'</b></div>'
      +'<div style="font-size:10.5px;color:var(--mt)">soma '+sumDobra(x).toFixed(1)+' mm'+(detail?' · '+detail:'')+'</div>'
      +((x.nv||x.confiavel===false)?'<div style="font-size:10.5px;color:var(--rd)">não confiável'+(x.obs?' — '+x.obs:'')+'</div>':'');
    h.appendChild(row);
  });
}
function drawChart(){
  var cv=document.getElementById('wChart');if(!cv)return;
  var dpr=window.devicePixelRatio||1;var W=cv.clientWidth,H=120;
  cv.width=W*dpr;cv.height=H*dpr;var x=cv.getContext('2d');x.scale(dpr,dpr);x.clearRect(0,0,W,H);
  var pts=healthSorted('peso').map(function(e){return e.v});
  if(pts.length<2){x.fillStyle='#6b6760';x.font='12px -apple-system';x.textAlign='center';x.fillText('Registre 2+ pesos para ver a tendência',W/2,H/2);return}
  var mn=Math.min.apply(null,pts),mx=Math.max.apply(null,pts);var pad=Math.max((mx-mn)*0.25,0.4);mn-=pad;mx+=pad;
  var px=8,py=12,pw=W-16,ph=H-26;
  function X(i){return px+pw*(i/(pts.length-1))}
  function Y(v){return py+ph*(1-(v-mn)/(mx-mn))}
  var grad=x.createLinearGradient(0,py,0,py+ph);grad.addColorStop(0,'rgba(201,160,90,.3)');grad.addColorStop(1,'rgba(201,160,90,0)');
  x.beginPath();x.moveTo(X(0),Y(pts[0]));pts.forEach(function(v,i){x.lineTo(X(i),Y(v))});
  x.lineTo(X(pts.length-1),py+ph);x.lineTo(X(0),py+ph);x.closePath();x.fillStyle=grad;x.fill();
  x.beginPath();x.moveTo(X(0),Y(pts[0]));pts.forEach(function(v,i){x.lineTo(X(i),Y(v))});
  x.strokeStyle='#c9a05a';x.lineWidth=2;x.lineJoin='round';x.stroke();
  var li=pts.length-1;x.beginPath();x.arc(X(li),Y(pts[li]),3.5,0,7);x.fillStyle='#6a9a6a';x.fill();
}


/* Demos 3D de execução (demo3d.html?ex=…, carregado só quando aberto) */
function open3D(k){var o=document.getElementById('d3ov');if(!o){o=document.createElement('div');o.id='d3ov';o.innerHTML='<button onclick="close3D()" aria-label="Fechar">✕</button><iframe title="Execução 3D"></iframe>';document.body.appendChild(o)}
  o.querySelector('iframe').src=C.raiz+'demo3d.html?ex='+k+'&v=1794909509';o.style.display='block'}
function close3D(){var o=document.getElementById('d3ov');if(o){o.style.display='none';o.querySelector('iframe').src='about:blank'}}

/* ============================================================
   INIT
============================================================ */
async function initApp(){
  await loadRemoteData();
  buildMusc();
  buildCard();
  renderRunBars();
  renderCardioChecks();
  renderSlotBar();
  renderChips();
  renderDiet();
  renderMeas();
  renderDobras();
  renderDash();
  processarFila().then(renderEnvios);
}
initApp();
