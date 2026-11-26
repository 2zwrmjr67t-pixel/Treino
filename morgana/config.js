/* Configuração do app — Morgana. Esqueleto: preencher com o plano dela (ver LEIAME.md). */
window.CFG={
  id:'morgana',
  titulo:'Protocolo <strong>Morgana</strong>',
  lsPrefix:'mg_',                    /* separa os dados locais dos do João no mesmo celular */
  dbKey:'protocoloMorgana',
  raiz:'../',
  ntfy:'mg-2007bb48a1686974',
  sexo:'F',
  nascimento:null,                   /* [ano, mês, dia] — necessário para o %G das dobras */
  metaKcalTxt:'a definir',
  metaNota:'Metas de dieta a definir.',
  avisoTreino:'<b>Treino em montagem</b> · o plano da Morgana ainda vai ser preenchido.',
  cardioProtocolo:'<b>Protocolo:</b> a definir.',
  exameNota:'Fazer painel novo.',
  composicaoNota:'',
  planoTitulo:'Plano',
  planoHtml:'<div class="note">Plano ainda não definido.</div>',
  TARGET:{kcal:2000,kcalMax:2200,p:120,c:200,f:60},
  PLANO:{inicio:null,semanas:0,marcos:[]},
  MUSC:[
    {l:"—",n:"A definir",c:"#c9a05a",foc:"Treino da Morgana ainda não cadastrado.",
     tl:[{t:"A definir",m:"—",h:1}],
     ex:[{n:"Exercício a definir",dm:"",tg:[],s:"—",r:"—",d:"—",nt:"Será preenchido a partir do plano dela."}],
     info:"Esqueleto do app — aguardando o plano."}
  ],
  CARD:[]
};
