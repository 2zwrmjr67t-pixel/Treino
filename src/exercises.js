/* Configurações dos exercícios (demos 3D).
   Convenções: corpo de frente para +x, y para cima. Alvos de mão/pé: [x,y,z] mundo (z espelhado por lado),
   {t:[…]} no referencial do tronco, {p:[…]} no da pelve. Campos armR/armL/legR/legL/epR… são absolutos.
   Fases: k = r (repouso) | u (concêntrica) | h (sustentação) | d (excêntrica); p = caminho de keyframes. */

export const MUSCLE_NAMES = {
  trap: 'trapézio superior', trapm: 'trapézio médio', scap: 'romboides / infraespinal', delt: 'deltoide', pec: 'peitoral',
  lat: 'dorsal', erector: 'eretores da coluna', abs: 'abdômen', obl: 'oblíquos', glute: 'glúteo máximo', gmed: 'glúteo médio',
  add: 'adutores', quad: 'quadríceps', ham: 'isquiotibiais', calf: 'panturrilha', bic: 'bíceps', tri: 'tríceps', fore: 'antebraço'
};

/* fases padrão: início · concêntrica · topo · excêntrica */
function std(o) {
  const path = o.path || [0, 1], last = path[path.length - 1];
  return [
    { n: o.n0 || 'Início', d: o.r || 0.8, p: [path[0]], k: 'r', t: o.t[0] },
    { n: (o.n1 || 'Subida') + ' · ' + o.up + 's', d: o.up, p: path, k: 'u', t: o.t[1] },
    { n: (o.n2 || 'Topo') + ' · ' + (o.holdTxt || o.hold + 's'), d: o.hold, p: [last], k: 'h', t: o.t[2] },
    { n: (o.n3 || 'Descida') + ' · ' + o.down + 's', d: o.down, p: path.slice().reverse(), k: 'd', t: o.t[3] }
  ];
}
/* fases alternadas (direita, depois esquerda) */
function alt(o) {
  return [
    { n: 'Início', d: 0.8, p: [0], k: 'r', t: o.t[0] },
    { n: 'Dir. · ' + o.up + 's', d: o.up, p: [0, 1], k: 'u', t: o.t[1] },
    { n: 'Segura', d: o.hold, p: [1], k: 'h', t: o.t[2] },
    { n: 'Volta · ' + o.down + 's', d: o.down, p: [1, 0], k: 'd', t: o.t[3] },
    { n: 'Esq. · ' + o.up + 's', d: o.up, p: [0, 2], k: 'u', t: o.t[4] },
    { n: 'Segura', d: o.hold, p: [2], k: 'h', t: o.t[2] },
    { n: 'Volta · ' + o.down + 's', d: o.down, p: [2, 0], k: 'd', t: o.t[3] }
  ];
}

/* ---------- peças de equipamento recorrentes ---------- */
function seat(k, o = {}) {
  const { x0 = -0.17, x1 = 0.4, top = 0.5, w = 0.36, back = true, backLen = 0.62 } = o;
  const M = k.M;
  k.box([(x0 + x1) / 2, top - 0.04, 0], [x1 - x0, 0.08, w], M.pad, null, 0.03);
  k.beam([(x0 + x1) / 2, 0.03, 0], [(x0 + x1) / 2, top - 0.08, 0], 0.032);
  k.rails(x0 - 0.12, x1 + 0.12);
  if (back) {
    const F = k.frame(0);
    k.boxF(F, 't', [-0.155, backLen / 2 - 0.02, 0], [0.07, backLen, 0.34]);
    const a = k.ptF(F, 't', [-0.2, 0.2, 0]);
    k.beam(a, [a.x - 0.04, 0.03, 0], 0.028);
  }
}
const handlesSide = (k, x = 0.08, y = 0.5) => [-1, 1].forEach(s => { k.beam([x - 0.02, y - 0.12, 0.25 * s], [x + 0.02, y + 0.02, 0.27 * s], 0.018, k.M.steel); });

export const EX = {
  /* ===================== TERÇA / SEXTA — PERNAS ===================== */
  ext: {
    day: 'Terça e sexta · Pernas', title: 'Extensora', sub: '4 × 10–12 · excêntrico de 3s · sem carga axial',
    mus: [['quad'], []],
    base: { root: [0, 0.6, 0], up: [-0.14, 1, 0], arm: [0.07, 0.5, 0.27], ep: [-1, -0.2, 0.3], kp: [0.5, 1, 0] },
    keys: [{ leg: [0.47, 0.12, 0.1] }, { leg: [0.77, 0.25, 0.1] }, { leg: [0.895, 0.5, 0.1], ank: -10 }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, t: [
      'Costas coladas no encosto, joelho a ~90°. Eixo da máquina alinhado ao joelho; segure as alças laterais.',
      'Estenda em ~1s, expirando. O quadril não sai do assento.',
      'Pausa de 1s com o joelho quase estendido, sem travar. Quadríceps contraído.',
      'Desça controlando em 3s até ~90°. Sem deixar a carga bater.'] }),
    cues: [['costas apoiadas', 'ok'], ['quadril no assento', 'ok'], ['não travar o joelho', 'warn', [2]]],
    eq(k) {
      const { V, R } = k; seat(k); handlesSide(k);
      k.padAt(() => R.an[0].clone().add(R.an[1]).multiplyScalar(0.5).addScaledVector(R.shinX[0], 0.065).addScaledVector(R.shinY[0], 0.04), () => V(0, 0, 1), 0.36, 0.045);
      [0, 1].forEach(i => k.link(() => R.an[i].clone().addScaledVector(R.shinX[i], 0.065).addScaledVector(R.shinY[i], 0.04).setZ(0.2 * (i ? -1 : 1)), () => V(0.45, 0.56, i ? -0.26 : 0.26), 0.02));
      [-1, 1].forEach(s => k.beam([0.45, 0.56, 0.26 * s], [0.4, 0.03, 0.26 * s], 0.025));
    }
  },
  extu: {
    day: 'Terça · Pernas', title: 'Extensora unilateral', sub: '3 × 12–15 por lado · alternada',
    mus: [['quad'], []],
    base: { root: [0, 0.6, 0], up: [-0.14, 1, 0], arm: [0.07, 0.5, 0.27], ep: [-1, -0.2, 0.3], kp: [0.5, 1, 0], leg: [0.47, 0.12, 0.1] },
    keys: [{}, { legR: [0.895, 0.5, 0.1] }, { legL: [0.895, 0.5, -0.1] }],
    ph: alt({ up: 1, hold: 1, down: 3, t: [
      'Mesmo ajuste da bilateral: costas apoiadas, joelho a ~90°.',
      'Direita: estenda em ~1s, sem compensar com o quadril.',
      'Pausa de 1s no topo, sem travar o joelho.',
      'Desça em 3s, controlando.',
      'Esquerda: mesma execução, tronco imóvel.'] }),
    cues: [['tronco imóvel', 'ok'], ['sem girar o quadril', 'ok'], ['não travar o joelho', 'warn', [2, 5]]],
    eq(k) {
      const { V, R } = k; seat(k); handlesSide(k);
      [0, 1].forEach(i => {
        const pp = () => R.an[i].clone().addScaledVector(R.shinX[i], 0.065).addScaledVector(R.shinY[i], 0.04);
        k.padAt(pp, () => V(0, 0, 1), 0.14, 0.045);
        k.link(() => pp().setZ(0.2 * (i ? -1 : 1)), () => V(0.45, 0.56, i ? -0.26 : 0.26), 0.02);
      });
      [-1, 1].forEach(s => k.beam([0.45, 0.56, 0.26 * s], [0.4, 0.03, 0.26 * s], 0.025));
    }
  },
  ht: {
    day: 'Terça · Pernas', title: 'Hip thrust na máquina', sub: '3 × 10–12 · costelas para baixo no topo',
    mus: [['glute'], ['ham', 'gmed']],
    base: { arm: { p: [0.1, -0.02, 0.26] }, ep: [0, 0.6, 1], kp: [0.3, 1, 0], leg: [0.46, 0.06, 0.13] },
    keys: [
      { root: [-0.06, 0.26, 0], up: [-0.82, 0.57, 0], fwd: [0.57, 0.82, 0], neck: 12 },
      { root: [0.0, 0.535, 0], up: [-1, 0.06, 0], fwd: [0.06, 1, 0], neck: 32 }],
    ph: std({ up: 1, hold: 1, down: 3, t: [
      'Escápulas apoiadas na borda do banco, pés firmes na largura do quadril. Queixo levemente recolhido.',
      'Suba empurrando o chão com os calcanhares, expirando. A cabeça acompanha o tronco.',
      'Pausa de 1s com o glúteo contraído, tronco e coxa alinhados. Trave com o glúteo, não com a lombar.',
      'Desça em 3s sem soltar a tensão. Se a torácica reclamar depois, troque por abdução inclinada.'] }),
    cues: [['queixo recolhido', 'ok'], ['costelas para baixo', 'hot', [2]], ['não arquear a lombar', 'warn', [2]]],
    eq(k) {
      const { V, R, M } = k;
      k.box([-0.72, 0.39, 0], [0.62, 0.07, 0.44], M.pad, null, 0.03);
      [-0.95, -0.5].forEach(x => k.beam([x, 0.03, 0], [x, 0.35, 0], 0.03));
      k.rails(-1.05, 0.75, 0.3);
      const pad = () => k.ptF({ o: R.F.o, qp: R.F.qp, qt: R.F.qt }, 'p', [0.135, -0.04, 0]);
      k.padAt(pad, () => V(0, 0, 1), 0.5, 0.055);
      [-1, 1].forEach(s => k.link(() => pad().setZ(0.27 * s), () => V(0.68, 0.22, 0.3 * s), 0.024));
      [-1, 1].forEach(s => k.beam([0.68, 0.22, 0.3 * s], [0.68, 0.03, 0.3 * s], 0.026));
    }
  },
  flexs: {
    day: 'Terça · Pernas', title: 'Flexora sentada', sub: '3 × 12 · isquiotibial alongado',
    mus: [['ham'], ['calf']],
    base: { root: [0, 0.6, 0], up: [-0.17, 1, 0], arm: [0.07, 0.5, 0.27], ep: [-1, -0.2, 0.3], kp: [0.3, 1, 0] },
    keys: [{ leg: [0.885, 0.5, 0.1], ank: -5 }, { leg: [0.79, 0.27, 0.1] }, { leg: [0.53, 0.12, 0.1] }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, n1: 'Flexão', n2: 'Contração', n3: 'Retorno', t: [
      'Costas apoiadas, joelho alinhado ao eixo, apoio travando as coxas. Pernas quase estendidas.',
      'Flexione os joelhos em ~1s, puxando o rolo para baixo.',
      'Pausa de 1s com o isquiotibial contraído. Quadril não sai do banco.',
      'Volte em 3s até quase estender, sem soltar a carga.'] }),
    cues: [['costas apoiadas', 'ok'], ['coxa travada no apoio', 'ok'], ['sem tirar o quadril do banco', 'warn', [2]]],
    eq(k) {
      const { V, R, M } = k; seat(k); handlesSide(k);
      k.box([0.32, 0.69, 0], [0.13, 0.07, 0.4], M.pad, null, 0.03);
      [-1, 1].forEach(s => k.beam([0.32, 0.69, 0.22 * s], [0.25, 0.03, 0.26 * s], 0.022));
      const rp = () => R.an[0].clone().add(R.an[1]).multiplyScalar(0.5).addScaledVector(R.shinX[0], -0.06).addScaledVector(R.shinY[0], 0.05);
      k.padAt(rp, () => V(0, 0, 1), 0.36, 0.045);
      [-1, 1].forEach(s => k.link(() => rp().setZ(0.2 * s), () => V(0.45, 0.56, 0.26 * s), 0.02));
    }
  },
  pant: {
    day: 'Terça · Pernas', title: 'Panturrilha sentada', sub: '4 × 20 · sem carga axial na coluna',
    mus: [['calf'], []],
    base: { root: [0, 0.55, 0], up: [0.05, 1, 0], arm: [0.38, 0.72, 0.2], ep: [-0.5, -1, 0.3], kp: [0.4, 1, 0] },
    keys: [{ leg: [0.46, 0.14, 0.11], ank: -18 }, { leg: [0.46, 0.215, 0.11], ank: 28 }],
    ph: [
      { n: 'Alongado · 1s', d: 1, p: [0], k: 'r', t: 'Antepé na plataforma, apoio sobre as coxas perto do joelho. Calcanhar abaixo da plataforma: pausa de 1s no alongamento.' },
      { n: 'Subida · 1s', d: 1, p: [0, 1], k: 'u', t: 'Suba na ponta dos pés, sobre o dedão, em ~1s.' },
      { n: 'Topo · 1s', d: 1, p: [1], k: 'h', t: 'Segure 1s com a panturrilha contraída.' },
      { n: 'Descida · 2s', d: 2, p: [1, 0], k: 'd', t: 'Desça em 2s até o alongamento total, sem quicar.' }],
    cues: [['amplitude total', 'ok'], ['pausa no alongamento', 'hot', [0]], ['sem quicar', 'warn', [3]]],
    eq(k) {
      const { V, R, M } = k; seat(k, { x0: -0.2, x1: 0.3, top: 0.46, back: false });
      k.box([0.6, 0.06, 0], [0.2, 0.12, 0.38], M.frame, null, 0.015);
      const pp = () => R.kn[0].clone().add(R.kn[1]).multiplyScalar(0.5).add(V(-0.03, 0.085, 0));
      k.padAt(pp, () => V(0, 0, 1), 0.42, 0.05);
      [-1, 1].forEach(s => k.link(() => pp().setZ(0.22 * s), () => V(-0.15, 0.62, 0.24 * s), 0.022));
      [-1, 1].forEach(s => k.beam([-0.15, 0.62, 0.24 * s], [-0.15, 0.03, 0.24 * s], 0.026));
    }
  },

  /* ===================== SEXTA — POSTERIOR ===================== */
  flexd: {
    day: 'Sexta · Posterior', title: 'Flexora deitada', sub: '4 × 10–12 · bilateral',
    mus: [['ham'], ['calf']],
    base: { root: [0, 0.665, 0], up: [1, 0, 0], fwd: [0, -1, 0], arm: [0.56, 0.44, 0.22], ep: [-0.3, 0, 1], kp: [-0.6, -1, 0] },
    keys: [{ leg: [-0.92, 0.6, 0.1] }, { leg: [-0.76, 0.98, 0.1] }, { leg: [-0.36, 1.02, 0.1], ank: -10 }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, n1: 'Flexão', n2: 'Contração', n3: 'Retorno', t: [
      'Deitado de bruços, joelho logo após a borda do banco, rolo acima do tornozelo. Olhar para baixo.',
      'Flexione os joelhos em ~1s, levando o rolo em direção ao glúteo.',
      'Pausa de 1s. O quadril continua colado no banco.',
      'Volte em 3s até quase estender.'] }),
    cues: [['quadril colado no banco', 'ok'], ['pescoço neutro, olhar para baixo', 'ok'], ['sem tirar o quadril', 'warn', [2]]],
    eq(k) {
      const { V, R, M } = k;
      k.box([0.04, 0.52, 0], [1.16, 0.07, 0.36], M.pad, null, 0.03);
      [-0.4, 0.45].forEach(x => k.beam([x, 0.03, 0], [x, 0.49, 0], 0.03));
      k.rails(-0.6, 0.7);
      [-1, 1].forEach(s => k.beam([0.56, 0.5, 0.22 * s], [0.56, 0.38, 0.22 * s], 0.018, M.steel));
      const rp = () => R.an[0].clone().add(R.an[1]).multiplyScalar(0.5).addScaledVector(R.shinX[0], -0.065).addScaledVector(R.shinY[0], 0.05);
      k.padAt(rp, () => V(0, 0, 1), 0.36, 0.045);
      [-1, 1].forEach(s => k.link(() => rp().setZ(0.2 * s), () => V(-0.5, 0.6, 0.26 * s), 0.02));
      [-1, 1].forEach(s => k.beam([-0.5, 0.6, 0.26 * s], [-0.5, 0.03, 0.26 * s], 0.025));
    }
  },
  abd: {
    day: 'Sexta · Posterior', title: 'Abdução de quadril na máquina', sub: '3 × 15 · glúteo médio',
    mus: [['gmed', 'glute'], []], tagM: 'gmed',
    base: { root: [0, 0.6, 0], up: [-0.08, 1, 0], arm: [0.07, 0.5, 0.27], ep: [-1, -0.2, 0.3] },
    keys: [{ leg: [0.5, 0.2, 0.1], kp: [0.4, 1, 0] }, { leg: [0.44, 0.2, 0.36], kp: [0.4, 1, 0.45] }],
    ph: std({ up: 1, hold: 1, down: 3, n1: 'Abertura', n2: 'Aberto', n3: 'Retorno', t: [
      'Costas apoiadas, pés nos apoios, almofadas por fora dos joelhos.',
      'Abra as pernas em ~1s até onde o quadril permite, sem dor.',
      'Pausa de 1s com o glúteo médio contraído.',
      'Volte em 3s, sem deixar as placas baterem.'] }),
    cues: [['costas apoiadas', 'ok'], ['abra até onde o quadril permite', 'hot', [1, 2]], ['sem impulso', 'warn', [3]]],
    eq(k) {
      const { V, R } = k; seat(k); handlesSide(k);
      [0, 1].forEach(i => {
        const s = i ? -1 : 1;
        const pp = () => R.kn[i].clone().add(V(-0.04, 0, 0.075 * s));
        k.padAt(pp, () => V(0, 1, 0), 0.16, 0.04);
        k.link(pp, () => V(0.12, 0.42, 0.06 * s), 0.02);
        k.padAt(() => R.an[i].clone().add(V(0.02, -0.06, 0)), () => V(1, 0, 0), 0.2, 0.018);
        k.link(() => R.an[i].clone().add(V(-0.08, -0.06, 0)), () => V(0.12, 0.42, 0.06 * s), 0.016);
      });
    }
  },
  adu: {
    day: 'Sexta · Posterior', title: 'Adução de quadril na máquina', sub: '3 × 15 · adutores',
    mus: [['add'], []],
    base: { root: [0, 0.6, 0], up: [-0.08, 1, 0], arm: [0.07, 0.5, 0.27], ep: [-1, -0.2, 0.3] },
    keys: [{ leg: [0.44, 0.2, 0.36], kp: [0.4, 1, 0.45] }, { leg: [0.5, 0.2, 0.1], kp: [0.4, 1, 0] }],
    ph: std({ up: 1, hold: 1, down: 3, n0: 'Aberto', n1: 'Fechamento', n2: 'Fechado', n3: 'Abertura', t: [
      'Costas apoiadas, almofadas por dentro dos joelhos, amplitude confortável.',
      'Feche as pernas em ~1s, apertando as almofadas.',
      'Pausa de 1s com os adutores contraídos.',
      'Abra em 3s, sem forçar o alongamento.'] }),
    cues: [['costas apoiadas', 'ok'], ['amplitude confortável', 'ok'], ['sem forçar o alongamento', 'warn', [0, 3]]],
    eq(k) {
      const { V, R } = k; seat(k); handlesSide(k);
      [0, 1].forEach(i => {
        const s = i ? -1 : 1;
        const pp = () => R.kn[i].clone().add(V(-0.04, 0, -0.075 * s));
        k.padAt(pp, () => V(0, 1, 0), 0.16, 0.04);
        k.link(pp, () => V(0.12, 0.42, 0.04 * s), 0.02);
        k.padAt(() => R.an[i].clone().add(V(0.02, -0.06, 0)), () => V(1, 0, 0), 0.2, 0.018);
      });
    }
  },
  bird: {
    day: 'Sexta · Posterior', title: 'Bird dog', sub: '3 × 10 por lado · lombar neutra',
    mus: [['erector', 'glute'], ['abs', 'delt']],
    base: { root: [0, 0.58, 0], up: [1, 0, 0], fwd: [0, -1, 0], arm: [0.47, 0.1, 0.2], ep: [-1, 0, 0], leg: [-0.49, 0.07, 0.1], kp: [1, -0.8, 0], ank: 80 },
    keys: [{}, { armR: [1.02, 0.62, 0.2], legL: [-0.92, 0.6, -0.1], kpL: [0, -1, 0], ankL: 60 }, { armL: [1.02, 0.62, -0.2], legR: [-0.92, 0.6, 0.1], kpR: [0, -1, 0], ankR: 60 }],
    ph: alt({ up: 1.5, hold: 2, down: 1.5, t: [
      'Quatro apoios: mãos sob os ombros, joelhos sob o quadril. Coluna neutra, olhar para o chão.',
      'Estenda braço direito e perna esquerda ao mesmo tempo, até a linha do tronco.',
      'Segure 2s. O quadril não rota nem sobe de um lado.',
      'Volte controlando aos quatro apoios.',
      'Agora braço esquerdo e perna direita.'] }),
    cues: [['lombar neutra', 'ok'], ['quadril não rota', 'hot', [1, 2, 4, 5]], ['olhar para o chão', 'ok']],
    eq(k) { k.matFloor(-1.1, 1.15, 0.7); }
  },
  plank: {
    day: 'Sexta · Posterior', title: 'Prancha lateral', sub: '3 × 30–40s por lado · isometria',
    mus: [['obl'], ['gmed', 'abs']],
    base: { fwd: [0, 0, 1], armL: [0.51, 0.07, 0.25], epL: [0, -1, -0.86], armR: [0.02, 0.6, 0.08], epR: [0.2, 1, -0.6],
      legL: [-0.878, 0.06, 0.0], legR: [-0.87, 0.15, 0.0], kp: [0, 0, 1] },
    keys: [{ root: [0.03, 0.3, 0], up: [0.985, 0.17, 0] }, { root: [0, 0.402, 0], up: [0.961, 0.276, 0] }],
    ph: [
      { n: 'Apoio', d: 1, p: [0], k: 'r', t: 'De lado, cotovelo exatamente sob o ombro, antebraço apontando para a frente, pés empilhados.' },
      { n: 'Eleva · 1,5s', d: 1.5, p: [0, 1], k: 'u', t: 'Eleve o quadril até alinhar tornozelo, quadril e ombro.' },
      { n: 'Segure · 30–40s', d: 4, p: [1], k: 'h', t: 'Sustente com o corpo em linha reta e respiração contínua. Pescoço alinhado ao tronco.' },
      { n: 'Desce · 1,5s', d: 1.5, p: [1, 0], k: 'd', t: 'Desça controlando. Repita do outro lado.' }],
    cues: [['corpo alinhado', 'ok'], ['cotovelo sob o ombro', 'ok'], ['quadril não cai', 'hot', [2]]],
    eq(k) { k.matFloor(-1.1, 0.8, 0.7); }
  },

  /* ===================== QUINTA — OMBROS ===================== */
  lat: {
    day: 'Quinta · Ombros', title: 'Elevação lateral no cabo', sub: '4 × 15 · cabos baixos bilaterais',
    mus: [['delt'], []],
    base: { ep: [-0.7, -0.1, 0.7] },
    keys: [{ arm: [0.07, 0.92, 0.18] }, { arm: [0.05, 1.08, 0.56] }, { arm: [0.04, 1.4, 0.71] }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, t: [
      'Em pé, tronco firme, joelhos destravados. Cotovelos levemente dobrados.',
      'Eleve em arco lateral, com o punho na linha do cotovelo ou abaixo.',
      'Pare na altura do ombro, sem encolher o trapézio.',
      'Desça em 3s sem soltar a tensão do cabo.'] }),
    cues: [['tronco firme', 'ok'], ['pare na linha do ombro', 'hot', [2]], ['ombros baixos, sem encolher', 'warn', [1, 2]]],
    eq(k) {
      const { R, axis } = k;
      [-1, 1].forEach(s => { k.stack(0.0, 0.62 * s, 2.0, 0.26); k.pulley([0.0, 0.1, 0.46 * s]); });
      [0, 1].forEach(i => { k.handle(i, axis.hammer, 0.12); k.cable(() => R.grip[i], [0.0, 0.1, 0.46 * (i ? -1 : 1)]); });
    }
  },
  front: {
    day: 'Quinta · Ombros', title: 'Elevação frontal no cabo', sub: '3 × 12–15 · substitui o desenvolvimento',
    mus: [['delt'], ['pec']],
    base: { ep: [-0.3, -1, 0.2] },
    keys: [{ arm: [0.1, 0.9, 0.15] }, { arm: [0.47, 1.13, 0.16] }, { arm: [0.555, 1.42, 0.16] }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, t: [
      'De costas para a polia baixa, cabo entre as pernas. Tronco imóvel.',
      'Eleve à frente com os braços quase estendidos.',
      'Pare na altura dos ombros, nunca acima. Sem carga sobre a cervical.',
      'Desça em 3s controlando.'] }),
    cues: [['tronco imóvel', 'ok'], ['pare na linha do ombro', 'hot', [2]], ['nada acima da cabeça', 'warn', [2]]],
    eq(k) {
      const { R, axis } = k;
      k.stack(-0.62, 0, 2.0, 0.3); k.pulley([-0.48, 0.1, 0]);
      k.bar(0.36, 0, false);
      k.cable(() => k.gripMid(), [-0.48, 0.1, 0]);
    }
  },
  face: {
    day: 'Quinta · Ombros', title: 'Face pull com corda', sub: '4 × 15 · deltoide posterior e escápulas',
    mus: [['delt', 'scap', 'trapm'], []], tag: 'deltoide posterior',
    base: { up: [-0.05, 1, 0] },
    keys: [{ arm: [0.62, 1.58, 0.07], ep: [0, 0.2, 1] }, { arm: [0.38, 1.66, 0.12], ep: [-0.1, 0.5, 1], shR: 0.5 }, { arm: [0.15, 1.72, 0.17], ep: [-0.2, 0.7, 1], shR: 1 }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, n1: 'Puxada', n2: 'Contração', n3: 'Retorno', t: [
      'Polia na altura da testa, corda com pegada neutra, braços estendidos à frente.',
      'Puxe em direção à testa, abrindo os cotovelos para fora e para cima.',
      'Pausa de 1s com as escápulas aproximadas e rotação externa do ombro.',
      'Volte em 3s estendendo os braços.'] }),
    cues: [['cotovelos altos e abertos', 'ok'], ['puxe para a testa', 'hot', [1, 2]], ['sem projetar a cabeça', 'warn', [2]]],
    eq(k) {
      const { R, V, M } = k;
      k.stack(1.05, 0, 2.0, 0.3); k.pulley([0.96, 1.72, 0]);
      const J = () => k.gripMid().lerp(V(0.96, 1.72, 0), 0.18);
      [0, 1].forEach(i => k.link(J, () => R.grip[i], 0.012, M.rope));
      k.cable(J, [0.96, 1.72, 0]);
    }
  },
  shr: {
    day: 'Quinta · Ombros · execução', title: 'Shrug inclinado<br>apoiado no peito', sub: '3 × 12–15 · halteres moderados · banco a 45°',
    mus: [['trap'], ['trapm']],
    base: { tf: 45, leg: { p: [-0.1, -0.93, 0.1] }, kp: [1, 0.1, 0], ep: [-1, 0, 0.3] },
    keys: [{ arm: [0.332, 0.77, 0.2] }, { arm: [0.385, 0.83, 0.2], shE: 1 }],
    ph: std({ up: 1, hold: 2, down: 3, n2: 'Topo · segure', holdTxt: '2s', t: [
      'Peito firme no apoio a 45°, olhar para o chão. Braços retos e soltos, ombros relaxados para baixo.',
      'Eleve os ombros em direção às orelhas: só as escápulas sobem. Cotovelos permanecem retos.',
      'Segure a contração 2s. Pescoço neutro: não projete a cabeça nem gire o pescoço.',
      'Desça controlando até alongar o trapézio. Se irradiar para o braço, dormência ou choque: pare.'] }),
    cues: [['pescoço neutro', 'ok'], ['cotovelos retos', 'ok'], ['ombros → orelhas', 'hot', [1, 2]], ['sem projetar a cabeça', 'warn', [2]]],
    eq(k) {
      const { V, M, axis } = k; const F = k.frame(0);
      k.boxF(F, 't', [0.168, 0.15, 0], [0.075, 0.6, 0.27]);
      const p1 = k.ptF(F, 't', [0.215, -0.1, 0]), p2 = k.ptF(F, 't', [0.215, 0.4, 0]); k.beam(p1, p2, 0.02);
      const ct = k.ptF(F, 't', [0.215, 0.26, 0]); k.beam(ct, V(ct.x, 0.04, 0), 0.028);
      const st = k.ptF(F, 't', [0.215, -0.08, 0]); k.beam(st, V(st.x + 0.02, 0.04, 0), 0.022);
      k.rails(-0.42, ct.x + 0.32);
      k.box([-0.29, 0.05, 0], [0.3, 0.025, 0.42], M.frame, null, 0.008);
      [0, 1].forEach(i => k.dumbbell(i, axis.x));
    }
  },
  deadbug: {
    day: 'Quinta · Core', title: 'Dead bug', sub: '3 × 10 por lado · alternado com Pallof', alt: [['deadbug', 'Dead bug'], ['pallof', 'Pallof press']],
    mus: [['abs'], ['obl']], view: 'tq',
    base: { root: [0.2, 0.125, 0], up: [-1, 0, 0], fwd: [0, 1, 0], arm: [-0.27, 0.66, 0.2], ep: [1, 0, 0.3], leg: [0.69, 0.57, 0.1], kp: [-1, 1, 0] },
    keys: [{}, { armR: [-0.79, 0.24, 0.2], legL: [1.1, 0.2, -0.1], kpL: [0, 1, 0], ankL: 30 }, { armL: [-0.79, 0.24, -0.2], legR: [1.1, 0.2, 0.1], kpR: [0, 1, 0], ankR: 30 }],
    ph: alt({ up: 2, hold: 1, down: 1.5, t: [
      'Deitado, braços apontando para o teto, quadril e joelhos a 90°. Lombar colada no chão.',
      'Estenda braço direito e perna esquerda devagar, expirando.',
      'Segure 1s sem deixar a lombar descolar do chão.',
      'Volte à posição inicial.',
      'Agora braço esquerdo e perna direita.'] }),
    cues: [['lombar colada no chão', 'ok'], ['expire ao estender', 'hot', [1, 4]], ['não arquear a lombar', 'warn', [2, 5]]],
    eq(k) { k.matFloor(-0.95, 1.25, 0.7); }
  },
  pallof: {
    day: 'Quinta · Core', title: 'Pallof press', sub: '3 × 12 por lado · antirrotação', alt: [['deadbug', 'Dead bug'], ['pallof', 'Pallof press']],
    mus: [['obl', 'abs'], []], view: 'fr',
    base: { root: [0, 0.96, 0], leg: { p: [0.03, -0.9, 0.13] }, kp: [1, 0.1, 0.1], ep: [-0.3, -1, 0.4] },
    keys: [{ arm: [0.2, 1.2, 0.035] }, { arm: [0.62, 1.24, 0.035] }],
    ph: std({ up: 1, hold: 2, down: 1.5, n1: 'Empurra', n2: 'Segura', n3: 'Retorna', t: [
      'De lado para a polia na altura do peito, pés na largura do quadril, joelhos destravados. Pegador junto ao esterno.',
      'Empurre à frente até estender os braços. O cabo tenta girar o tronco: não deixe.',
      'Segure 2s com quadril e ombros voltados para a frente.',
      'Volte o pegador ao peito em ~1,5s.'] }),
    cues: [['quadril e ombros alinhados', 'ok'], ['tronco não gira', 'hot', [1, 2, 3]], ['costelas para baixo', 'ok']],
    eq(k) {
      const { V, axis } = k;
      k.stack(0.2, 1.02, 2.0, 0.28); k.pulley([0.2, 1.22, 0.88]);
      k.handle(0, () => V(0, 0, 1), 0.12);
      k.cable(() => k.gripMid(), [0.2, 1.22, 0.88]);
    }
  },

  /* ===================== SEGUNDA — PEITO ===================== */
  supinc: {
    day: 'Segunda · Peito', title: 'Supino inclinado com halteres', sub: '4 × 8–10 · banco a 30°',
    mus: [['pec'], ['delt', 'tri']],
    base: { root: [0.25, 0.555, 0], up: [-0.866, 0.5, 0], fwd: [0.5, 0.866, 0], leg: [0.74, 0.06, 0.18], kp: [1, 1, 0] },
    keys: [{ arm: { t: [0.16, 0.4, 0.42] }, ep: { t: [-0.7, -0.2, 0.7] } }, { arm: { t: [0.55, 0.45, 0.15] }, ep: { t: [-0.5, 0, 1] } }],
    ph: std({ up: 1, hold: 1, down: 3, t: [
      'Banco a 30°, escápulas encaixadas, cabeça apoiada. Halteres na linha do peito, antebraços verticais.',
      'Empurre em ~1s, aproximando os halteres no alto.',
      'Pausa curta no topo, sem travar os cotovelos.',
      'Desça em 3s até a linha do peito, cotovelos a ~45–60° do tronco.'] }),
    cues: [['cabeça apoiada no banco', 'ok'], ['escápulas encaixadas', 'ok'], ['desça controlando', 'hot', [3]]],
    eq(k) {
      const { M, axis, V } = k; const F = k.frame(0);
      k.boxF(F, 't', [-0.155, 0.32, 0], [0.07, 0.82, 0.3]);
      k.box([0.32, 0.43, 0], [0.38, 0.07, 0.32], M.pad, null, 0.03);
      const a = k.ptF(F, 't', [-0.2, 0.45, 0]); k.beam(a, V(a.x, 0.03, 0), 0.03);
      k.beam([0.32, 0.03, 0], [0.32, 0.4, 0], 0.03); k.rails(-0.6, 0.6);
      [0, 1].forEach(i => k.dumbbell(i, axis.latT));
    }
  },
  supmaq: {
    view: 'fr',
    day: 'Segunda · Peito', title: 'Supino reto na máquina', sub: '3 × 10–12 · pegada neutra',
    mus: [['pec'], ['tri', 'delt']],
    base: { root: [0, 0.6, 0], up: [-0.1, 1, 0], leg: [0.47, 0.06, 0.13], kp: [0.6, 1, 0] },
    keys: [{ arm: { t: [0.13, 0.42, 0.3] }, ep: { t: [-0.7, -0.4, 0.6] } }, { arm: { t: [0.56, 0.42, 0.22] }, ep: { t: [-0.5, -0.6, 0.6] } }],
    ph: std({ up: 1, hold: 1, down: 3, n1: 'Empurra', n2: 'Topo', n3: 'Retorno', t: [
      'Costas e cabeça apoiadas, pegadores na linha do meio do peito.',
      'Empurre em ~1s, expirando, sem tirar as escápulas do encosto.',
      'Pausa curta sem travar os cotovelos.',
      'Volte em 3s até as mãos ficarem ao lado do peito.'] }),
    cues: [['costas apoiadas', 'ok'], ['punho alinhado ao cotovelo', 'ok'], ['não trave os cotovelos', 'warn', [2]]],
    eq(k) {
      const { R, axis } = k; seat(k, { backLen: 0.78 }); const F = k.frame(0);
      const pv = [1, -1].map(s => k.ptF(F, 't', [-0.05, 0.98, 0.33 * s]));
      [0, 1].forEach(i => { k.handle(i, axis.y, 0.13); k.link(() => R.grip[i].clone().setY(R.grip[i].y + 0.06), () => pv[i], 0.022); });
      pv.forEach(p => k.beam(p, [p.x - 0.1, 0.03, p.z], 0.026));
    }
  },
  cross: {
    view: 'fr',
    day: 'Segunda · Peito', title: 'Crossover no cabo alto', sub: '3 × 12–15 · contração no centro',
    mus: [['pec'], ['delt']],
    base: { up: [0.26, 1, 0], leg: { p: [0.0, -0.93, 0.13] }, ep: { t: [-0.5, 0.3, 0.8] } },
    keys: [{ arm: { t: [0.05, 0.62, 0.68] } }, { arm: { t: [0.38, 0.42, 0.48] } }, { arm: { t: [0.45, 0.2, 0.06] } }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, n1: 'Fechamento', n2: 'Contração', n3: 'Abertura', t: [
      'Polias altas, leve inclinação do tronco à frente, cotovelos levemente flexionados.',
      'Traga as mãos em arco para baixo e para o centro.',
      'Pausa de 1s com as mãos juntas à frente do abdômen.',
      'Abra em 3s até sentir o peitoral alongar, sem passar da linha dos ombros.'] }),
    cues: [['cotovelos levemente flexionados', 'ok'], ['tronco estável', 'ok'], ['contraia no centro', 'hot', [2]]],
    eq(k) {
      const { R, axis } = k;
      [-1, 1].forEach(s => { k.stack(-0.05, 0.95 * s, 2.15, 0.26); k.pulley([-0.05, 2.05, 0.82 * s]); });
      [0, 1].forEach(i => { k.handle(i, axis.hammer, 0.12); k.cable(() => R.grip[i], [-0.05, 2.05, 0.82 * (i ? -1 : 1)]); });
    }
  },
  tricorda: {
    day: 'Segunda · Peito', title: 'Tríceps na corda', sub: '3 × 12 · cotovelos fixos',
    mus: [['tri'], []],
    base: { up: [0.1, 1, 0], ep: [-1, -0.1, 0.25] },
    keys: [{ arm: [0.21, 1.3, 0.07] }, { arm: [0.13, 0.9, 0.15] }],
    ph: std({ up: 1, hold: 1, down: 3, n1: 'Extensão', n2: 'Embaixo', n3: 'Retorno', t: [
      'Polia alta, cotovelos colados ao lado do corpo, antebraços acima da linha horizontal.',
      'Estenda os cotovelos em ~1s. Só o antebraço se move.',
      'Embaixo, abra a corda para os lados e segure 1s.',
      'Volte em 3s sem tirar os cotovelos do lugar.'] }),
    cues: [['cotovelos fixos', 'ok'], ['abra a corda embaixo', 'hot', [2]], ['pescoço neutro', 'ok']],
    eq(k) {
      const { R, V, M } = k;
      k.stack(0.68, 0, 2.15, 0.3); k.pulley([0.58, 2.05, 0]);
      const J = () => k.gripMid().lerp(V(0.58, 2.05, 0), 0.12);
      [0, 1].forEach(i => k.link(J, () => R.grip[i], 0.012, M.rope));
      k.cable(J, [0.58, 2.05, 0]);
    }
  },
  tritesta: {
    day: 'Segunda · Peito', title: 'Tríceps testa com barra EZ', sub: '3 × 10–12 · cabeça apoiada',
    mus: [['tri'], []],
    base: { root: [0.25, 0.575, 0], up: [-1, 0, 0], fwd: [0, 1, 0], leg: [0.74, 0.06, 0.16], kp: [1, 1, 0], ep: [0.3, 1, 0] },
    keys: [{ arm: [-0.28, 1.11, 0.15] }, { arm: [-0.5, 0.73, 0.14] }],
    ph: [
      { n: 'Início', d: 0.8, p: [0], k: 'r', t: 'Deitado no banco, cabeça apoiada, barra acima dos ombros com braços estendidos.' },
      { n: 'Descida · 3s', d: 3, p: [0, 1], k: 'u', t: 'Flexione só os cotovelos, levando a barra para trás da testa em 3s.' },
      { n: 'Embaixo', d: 0.6, p: [1], k: 'h', t: 'Cotovelos apontando para cima, sem abrir. Cabeça permanece no banco.' },
      { n: 'Extensão · 1s', d: 1, p: [1, 0], k: 'd', t: 'Estenda em ~1s até os braços ficarem retos acima dos ombros.' }],
    cues: [['cabeça apoiada no banco', 'ok'], ['cotovelos fixos', 'ok'], ['desça controlando', 'hot', [1]]],
    eq(k) {
      const { M } = k;
      k.box([-0.05, 0.43, 0], [1.2, 0.07, 0.32], M.pad, null, 0.03);
      [-0.45, 0.35].forEach(x => k.beam([x, 0.03, 0], [x, 0.4, 0], 0.03)); k.rails(-0.6, 0.5);
      k.bar(1.2, 0.1, true);
    }
  },

  /* ===================== SÁBADO — COSTAS ===================== */
  pulldown: {
    day: 'Sábado · Costas', title: 'Puxada frontal aberta', sub: '4 × 8–10 · sempre à frente',
    mus: [['lat'], ['bic', 'trapm', 'scap']],
    base: { root: [0, 0.56, 0], up: [-0.2, 1, 0], leg: [0.47, 0.06, 0.12], kp: [0.6, 1, 0] },
    keys: [{ arm: [0.06, 1.52, 0.43], ep: [-0.3, -0.2, 1] }, { arm: [0.1, 1.33, 0.42], ep: [-0.5, -0.6, 0.8] }, { arm: [0.1, 1.12, 0.37], ep: [-0.7, -1, 0.5], shR: 0.6 }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, n1: 'Puxada', n2: 'Contração', n3: 'Retorno', t: [
      'Coxas travadas no apoio, pegada aberta, braços estendidos. Leve inclinação para trás.',
      'Puxe a barra em direção à parte alta do peito, levando os cotovelos para baixo.',
      'Pausa de 1s com o peito alto e as escápulas para baixo e para trás.',
      'Volte em 3s até estender os braços, sem soltar a carga.'] }),
    cues: [['peito alto, sem balanço', 'ok'], ['puxe até a parte alta do peito', 'hot', [1, 2]], ['nunca atrás da nuca', 'warn', [2]]],
    eq(k) {
      const { M } = k; seat(k, { back: false, x0: -0.25, x1: 0.32, top: 0.46 });
      k.box([0.3, 0.71, 0], [0.12, 0.07, 0.42], M.pad, null, 0.03);
      [-1, 1].forEach(s => k.beam([0.3, 0.71, 0.18 * s], [0.12, 0.42, 0.1 * s], 0.02));
      k.beam([-0.5, 0.03, 0], [-0.5, 2.4, 0], 0.035); k.beam([-0.5, 2.4, 0], [0.12, 2.4, 0], 0.03);
      k.pulley([0.1, 2.36, 0]); k.box([-0.62, 0.22, 0], [0.2, 0.36, 0.26], M.plate, null, 0.01);
      k.bar(1.25, 0, false);
      k.cable(() => k.gripMid(), [0.1, 2.36, 0]);
    }
  },
  row: {
    day: 'Sábado · Costas', title: 'Remada na máquina com apoio peitoral', sub: '4 × 10–12 · pegada neutra',
    mus: [['lat', 'trapm', 'scap'], ['bic', 'delt']],
    base: { root: [0, 0.56, 0], up: [0.17, 1, 0], leg: [0.47, 0.06, 0.13], kp: [0.6, 1, 0] },
    keys: [{ arm: [0.62, 1.05, 0.2], ep: [-0.6, -1, 0.4] }, { arm: [0.15, 0.98, 0.23], ep: [-1, -0.2, 0.25], shR: 1 }],
    ph: std({ up: 1, hold: 1, down: 3, n1: 'Puxada', n2: 'Contração', n3: 'Retorno', t: [
      'Peito firme no apoio, braços estendidos à frente, ombros soltos para a frente.',
      'Comece pela escápula: aproxime as escápulas antes de dobrar os cotovelos.',
      'Cotovelos atrás do tronco, escápulas juntas. Segure 1s sem arquear a lombar.',
      'Volte em 3s até estender os braços.'] }),
    cues: [['peito no apoio', 'ok'], ['escápulas primeiro', 'hot', [1]], ['sem projetar a cabeça', 'warn', [2]]],
    eq(k) {
      const { R, axis, V } = k; seat(k, { back: false, x0: -0.25, x1: 0.3, top: 0.46 }); const F = k.frame(0);
      k.boxF(F, 't', [0.165, 0.36, 0], [0.07, 0.42, 0.3]);
      const c = k.ptF(F, 't', [0.21, 0.3, 0]); k.beam(c, V(c.x + 0.05, 0.03, 0), 0.03);
      [0, 1].forEach(i => { k.handle(i, axis.y, 0.13); k.link(() => R.grip[i].clone().setY(R.grip[i].y + 0.06), () => V(0.66, 1.55, 0.25 * (i ? -1 : 1)), 0.022); });
      [-1, 1].forEach(s => k.beam([0.66, 1.55, 0.25 * s], [0.8, 0.03, 0.25 * s], 0.028));
    }
  },
  rowlow: {
    day: 'Sábado · Costas', title: 'Remada na polia baixa', sub: '3 × 12–15 · pegada neutra',
    mus: [['lat', 'trapm'], ['bic', 'scap']],
    base: { root: [0, 0.46, 0], leg: [0.8, 0.3, 0.12], kp: [0.3, 1, 0], ank: -5 },
    keys: [{ arm: [0.52, 0.82, 0.06], ep: [-1, -0.3, 0.2] }, { arm: [0.13, 0.72, 0.075], ep: [-1, -0.4, 0.2], shR: 1 }],
    ph: std({ up: 1, hold: 1, down: 3, n1: 'Puxada', n2: 'Contração', n3: 'Retorno', t: [
      'Sentado, pés na plataforma, joelhos levemente flexionados, tronco ereto e coluna neutra.',
      'Puxe o triângulo em direção ao abdômen, cotovelos rentes ao corpo.',
      'Segure 1s com as escápulas aproximadas. O tronco não balança.',
      'Volte em 3s estendendo os braços, sem flexionar a lombar para a frente.'] }),
    cues: [['coluna neutra, tronco imóvel', 'ok'], ['cotovelos rentes ao corpo', 'hot', [1, 2]], ['sem flexionar a lombar', 'warn', [0, 3]]],
    eq(k) {
      const { M } = k;
      k.box([-0.05, 0.33, 0], [0.75, 0.07, 0.34], M.pad, null, 0.03); [-0.3, 0.2].forEach(x => k.beam([x, 0.03, 0], [x, 0.3, 0], 0.03));
      k.box([0.86, 0.3, 0], [0.05, 0.32, 0.42], M.frame, null, 0.015); k.rails(-0.5, 1.15);
      k.stack(1.1, 0, 1.4, 0.28); k.pulley([0.95, 0.38, 0]);
      k.bar(0.17, 0, false);
      k.cable(() => k.gripMid(), [0.95, 0.38, 0]);
    }
  },
  rosca: {
    view: 'fr',
    day: 'Sábado · Costas', title: 'Rosca direta com barra EZ', sub: '3 × 10–12 · cotovelos fixos',
    mus: [['bic'], ['fore']],
    base: { ep: [-1, -0.05, 0.1] },
    keys: [{ arm: [0.07, 0.92, 0.19] }, { arm: [0.27, 1.16, 0.2] }, { arm: [0.14, 1.39, 0.19] }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, t: [
      'Em pé, cotovelos ao lado do corpo, barra na altura das coxas.',
      'Flexione os cotovelos em ~1s. Os cotovelos não avançam.',
      'Pausa de 1s com o bíceps contraído.',
      'Desça em 3s até estender completamente.'] }),
    cues: [['cotovelos fixos ao lado do corpo', 'ok'], ['sem balanço do tronco', 'ok'], ['estenda embaixo', 'hot', [3]]],
    eq(k) { k.bar(1.2, 0.11, true); }
  },
  martelo: {
    view: 'fr',
    day: 'Sábado · Costas', title: 'Rosca martelo simultânea', sub: '3 × 12 · pegada neutra',
    mus: [['bic', 'fore'], []], tag: 'bíceps / braquial',
    base: { ep: [-1, -0.05, 0.1] },
    keys: [{ arm: [0.05, 0.92, 0.21] }, { arm: [0.27, 1.16, 0.22] }, { arm: [0.14, 1.39, 0.21] }],
    ph: std({ path: [0, 1, 2], up: 1, hold: 1, down: 3, t: [
      'Em pé, halteres ao lado do corpo, palmas voltadas uma para a outra.',
      'Flexione os dois cotovelos juntos em ~1s, mantendo a pegada neutra.',
      'Pausa de 1s no topo.',
      'Desça em 3s até estender.'] }),
    cues: [['cotovelos fixos', 'ok'], ['punhos neutros', 'ok'], ['sem balanço do tronco', 'warn', [1]]],
    eq(k) { [0, 1].forEach(i => k.dumbbell(i, k.axis.hammer)); }
  }
};
