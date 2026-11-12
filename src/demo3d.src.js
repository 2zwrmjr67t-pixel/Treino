/* Demos 3D de execução — Protocolo Guilherme.
   Motor genérico: manequim anatômico procedural + cinemática inversa (mãos/pés vão a alvos,
   cotovelos/joelhos se resolvem por IK de 2 ossos). Cada exercício é uma configuração em exercises.js.
   Build: npx esbuild src/demo3d.src.js --bundle --minify --format=esm --outfile=demo3d.js
   Esquema ilustrativo do padrão de movimento: não substitui orientação profissional. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EX, MUSCLE_NAMES } from './exercises.js';

const D2R = Math.PI / 180;
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const params = new URLSearchParams(location.search);
const KEY = EX[params.get('ex')] ? params.get('ex') : 'shr';
const C = EX[KEY];

/* ================= cena ================= */
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151514);
scene.fog = new THREE.Fog(0x151514, 6, 13);
const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 60);
const controls = new OrbitControls(camera, canvas);
Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false, minDistance: 1.2, maxPolarAngle: 88 * D2R });

scene.add(new THREE.HemisphereLight(0xf3ead8, 0x1a1715, 0.85));
const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
key.position.set(1.8, 4.2, 2.6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2, near: 0.5, far: 12 });
key.shadow.bias = -0.0004; key.shadow.radius = 4; scene.add(key);
const rim = new THREE.DirectionalLight(0xc9d6e8, 0.9); rim.position.set(-3, 2.5, -2); scene.add(rim);

/* ================= materiais ================= */
const fresnel = (mat, col, k, p) => {
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n float frs = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), ' + p.toFixed(1) + ');\n totalEmissiveRadiance += vec3(' + col.join(',') + ') * frs * ' + k.toFixed(2) + ';');
  };
  return mat;
};
const M = {
  skin: fresnel(new THREE.MeshStandardMaterial({ color: 0xc9cbcd, roughness: 0.48 }), [0.62, 0.7, 0.9], 0.42, 3),
  hl: fresnel(new THREE.MeshStandardMaterial({ color: 0xd9472b, emissive: 0xff4a1f, emissiveIntensity: 0.2, roughness: 0.42 }), [1, 0.55, 0.25], 0.6, 2),
  hl2: new THREE.MeshStandardMaterial({ color: 0xc98a6e, emissive: 0xd0603a, emissiveIntensity: 0.05, roughness: 0.5 }),
  glow: new THREE.MeshBasicMaterial({ color: 0xff6a35, transparent: true, opacity: 0.15, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  pad: new THREE.MeshStandardMaterial({ color: 0x3b2a2c, roughness: 0.75 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.45, metalness: 0.55 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x9a968f, roughness: 0.3, metalness: 0.85 }),
  plate: new THREE.MeshStandardMaterial({ color: 0x232120, roughness: 0.55, metalness: 0.35 }),
  cable: new THREE.MeshStandardMaterial({ color: 0x77736c, roughness: 0.4, metalness: 0.6 }),
  rope: new THREE.MeshStandardMaterial({ color: 0x2b2b2e, roughness: 0.9 }),
  matf: new THREE.MeshStandardMaterial({ color: 0x2a2624, roughness: 0.95 }),
  spine: new THREE.MeshBasicMaterial({ color: 0x7fb27f, transparent: true, opacity: 0.7 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x1d1b19, roughness: 1 })
};

/* ================= primitivas ================= */
const shade = m => { m.castShadow = true; m.receiveShadow = true; return m; };
const sphere = (r, mat) => shade(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat));
const cyl = (r, len, mat, seg = 24) => shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat));
const rbox = (sx, sy, sz, mat, rad = 0.02) => shade(new THREE.Mesh(new RoundedBoxGeometry(sx, sy, sz, 3, Math.min(rad, sx / 2.1, sy / 2.1, sz / 2.1)), mat));
const UP = V(0, 1, 0);
function orientBetween(m, a, b) {
  const d = V().subVectors(b, a); const L = d.length() || 1e-6;
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, d.divideScalar(L));
  m.scale.set(1, L, 1);
}
function stick(r, mat) { const m = cyl(r, 1, mat, 14); scene.add(m); return m; }

/* ================= manequim ================= */
const MUS = {};
const reg = (name, m) => { (MUS[name] = MUS[name] || []).push(m); return m; };
function blob(parent, sx, sy, sz, x, y, z, rx = 0, ry = 0, rz = 0, name) {
  const m = sphere(1, M.skin); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m);
  if (name) reg(name, m); return m;
}
function smoothProfile(pts, n) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n; let k = 0;
    while (k < pts.length - 2 && t > pts[k + 1][0]) k++;
    const [t0, r0] = pts[k], [t1, r1] = pts[k + 1];
    const f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))), s = f * f * (3 - 2 * f);
    out.push([t, r0 + (r1 - r0) * s]);
  }
  return out;
}
function bone(len, prof) {
  const g = new THREE.Group(); scene.add(g);
  const pts = smoothProfile(prof, 48).map(([t, r]) => new THREE.Vector2(r, -t * len)).reverse();
  g.add(shade(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), M.skin)));
  g.add(sphere(prof[0][1], M.skin));
  const e = sphere(prof[prof.length - 1][1], M.skin); e.position.y = -len; g.add(e);
  return { g, len };
}
const _m4 = new THREE.Matrix4();
function setBone(b, A, B, front) {
  const Y = V().subVectors(A, B).normalize();
  const X = front.clone().sub(Y.clone().multiplyScalar(front.dot(Y)));
  if (X.lengthSq() < 1e-8) X.copy(Math.abs(Y.x) < 0.9 ? V(1, 0, 0) : V(0, 0, 1)).sub(Y.clone().multiplyScalar(Y.x));
  X.normalize();
  const Z = V().crossVectors(X, Y);
  b.g.position.copy(A); b.g.quaternion.setFromRotationMatrix(_m4.makeBasis(X, Y, Z));
  return { X, Y, Z };
}

const pelvisG = new THREE.Group(); scene.add(pelvisG);
blob(pelvisG, 0.112, 0.095, 0.155, -0.01, -0.005, 0);
[1, -1].forEach(s => {
  blob(pelvisG, 0.06, 0.078, 0.07, -0.058, -0.03, 0.066 * s, 0, 0, 0.3, 'glute');
  blob(pelvisG, 0.035, 0.055, 0.04, -0.02, 0.025, 0.128 * s, 0, 0, 0, 'gmed');
});
const torsoG = new THREE.Group(); scene.add(torsoG);
blob(torsoG, 0.088, 0.15, 0.13, -0.005, 0.15, 0);
blob(torsoG, 0.114, 0.195, 0.168, 0.0, 0.37, 0);
[0.1, 0.17, 0.24].forEach((y, i) => [1, -1].forEach(s => blob(torsoG, 0.022, 0.03, 0.03, 0.082 - i * 0.004, y, 0.033 * s, 0, 0, 0, 'abs')));
[1, -1].forEach(s => {
  blob(torsoG, 0.055, 0.11, 0.032, 0.012, 0.17, 0.1 * s, 0, 0, 0.1, 'obl');
  blob(torsoG, 0.045, 0.085, 0.092, 0.075, 0.43, 0.082 * s, 0.25 * s, 0, 0.12, 'pec');
  blob(torsoG, 0.042, 0.16, 0.07, -0.04, 0.32, 0.115 * s, -0.22 * s, 0, 0, 'lat');
  blob(torsoG, 0.024, 0.19, 0.03, -0.078, 0.2, 0.034 * s, 0, 0, 0, 'erector');
  blob(torsoG, 0.02, 0.07, 0.058, -0.098, 0.42, 0.09 * s, 0.15 * s, 0, 0, 'scap');
});
blob(torsoG, 0.012, 0.115, 0.06, -0.112, 0.43, 0, 0, 0, 0, 'trapm');
const spineParts = [];
{ const l = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.9, 8), M.spine); l.position.set(-0.155, 0.42, 0); torsoG.add(l); spineParts.push(l); }
[0, 0.84].forEach(y => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), M.spine); d.position.set(-0.155, y, 0); torsoG.add(d); spineParts.push(d); });
if (C.noSpine) spineParts.forEach(p => p.visible = false);

const headG = new THREE.Group(); scene.add(headG);
{ const n = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.054, 0.16, 28), M.skin)); n.position.set(-0.008, -0.07, 0); headG.add(n); }
blob(headG, 0.085, 0.102, 0.078, -0.008, 0.147, 0);
blob(headG, 0.06, 0.06, 0.06, 0.035, 0.09, 0, 0, 0, -0.3);
blob(headG, 0.025, 0.03, 0.04, 0.08, 0.13, 0);
[1, -1].forEach(s => blob(headG, 0.012, 0.022, 0.01, -0.005, 0.135, 0.078 * s));

const SIDES = [1, -1];
const shG = SIDES.map(s => { const g = new THREE.Group(); torsoG.add(g); blob(g, 0.068, 0.085, 0.07, 0.0, -0.022, 0.018 * s, 0, 0, 0, 'delt'); return g; });
const trapU = SIDES.map(() => { const m = sphere(1, M.skin); m.castShadow = false; torsoG.add(m); reg('trap', m); return m; });
const BACK = V(-1, 0.25, 0).normalize();
function placeBetween(mesh, a, b, thick, width) {
  const d = V().subVectors(b, a); const len = d.length(); d.normalize();
  const x = BACK.clone().sub(d.clone().multiplyScalar(BACK.dot(d))).normalize();
  const z = V().crossVectors(x, d);
  mesh.quaternion.setFromRotationMatrix(_m4.makeBasis(x, d, z));
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(thick, len / 2 + 0.02, width);
}

const LEN = { ua: 0.29, fa: 0.26, th: 0.45, sh: 0.45 };
const limbs = SIDES.map(s => {
  const ua = bone(LEN.ua, [[0, 0.046], [0.12, 0.05], [0.45, 0.047], [0.8, 0.038], [1, 0.034]]);
  blob(ua.g, 0.032, 0.085, 0.036, 0.024, -0.15, 0, 0, 0, 0, 'bic');
  blob(ua.g, 0.036, 0.1, 0.038, -0.024, -0.12, 0, 0, 0, 0, 'tri');
  const fa = bone(LEN.fa, [[0, 0.036], [0.18, 0.043], [0.5, 0.033], [0.85, 0.024], [1, 0.022]]);
  blob(fa.g, 0.03, 0.07, 0.03, 0.015, -0.06, 0.01 * s, 0, 0, 0, 'fore');
  const hand = rbox(0.05, 0.085, 0.036, M.skin, 0.016); hand.position.y = -LEN.fa - 0.045; fa.g.add(hand);
  const th = bone(LEN.th, [[0, 0.074], [0.2, 0.078], [0.55, 0.066], [0.85, 0.052], [1, 0.046]]);
  blob(th.g, 0.032, 0.16, 0.042, 0.04, -0.2, 0, 0, 0, 0, 'quad');
  blob(th.g, 0.028, 0.075, 0.034, 0.03, -0.35, -0.026 * s, 0, 0, 0, 'quad');
  blob(th.g, 0.03, 0.13, 0.03, 0.016, -0.24, 0.042 * s, 0, 0, 0, 'quad');
  blob(th.g, 0.03, 0.15, 0.042, -0.038, -0.22, 0, 0, 0, 0, 'ham');
  blob(th.g, 0.026, 0.12, 0.028, 0.0, -0.14, -0.05 * s, 0, 0, 0, 'add');
  const sn = bone(LEN.sh, [[0, 0.046], [0.25, 0.05], [0.6, 0.034], [0.88, 0.025], [1, 0.027]]);
  blob(sn.g, 0.03, 0.1, 0.038, -0.026, -0.14, 0.01 * s, 0, 0, 0, 'calf');
  blob(sn.g, 0.018, 0.12, 0.02, 0.03, -0.17, 0.012 * s);
  const footG = new THREE.Group(); scene.add(footG);
  const foot = rbox(0.22, 0.055, 0.085, M.skin, 0.026); foot.position.set(0.06, -0.014, 0); footG.add(foot);
  return { s, ua, fa, th, sn, footG };
});

/* ================= poses ================= */
const Qz = a => new THREE.Quaternion().setFromAxisAngle(V(0, 0, 1), a);
function frameOf(root, up, fwd, tf) {
  const Y = V(...up).normalize();
  const X = V(...fwd); X.sub(Y.clone().multiplyScalar(X.dot(Y))).normalize();
  const Z = V().crossVectors(X, Y);
  const qp = new THREE.Quaternion().setFromRotationMatrix(_m4.makeBasis(X, Y, Z));
  const qt = qp.clone().multiply(Qz(-tf * D2R));
  return { o: V(...root), qp, qt };
}
const DEF = { root: [0, 0.985, 0], up: [0, 1, 0], fwd: [1, 0, 0], tf: 0, neck: 0, shE: 0, shR: 0, ank: 0,
  arm: { t: [0.03, -0.08, 0.21] }, leg: { p: [0.02, -0.93, 0.1] }, ep: [-1, -0.2, 0.2], kp: [1, 0.2, 0] };
const mir = (a, s) => [a[0], a[1], a[2] * s];
function toWorldPt(spec, F, s) {
  if (Array.isArray(spec)) return V(...mir(spec, s));
  if (spec.w) return V(...mir(spec.w, s));
  const a = mir(spec.t || spec.p, s);
  return V(...a).applyQuaternion(spec.t ? F.qt : F.qp).add(F.o);
}
function toWorldDir(spec, F, s) {
  if (Array.isArray(spec)) return V(...mir(spec, s)).normalize();
  if (spec.w) return V(...mir(spec.w, s)).normalize();
  return V(...mir(spec.t || spec.p, s)).applyQuaternion(spec.t ? F.qt : F.qp).normalize();
}
const fullKey = k => Object.assign({}, DEF, C.base || {}, k);
function resolveKey(k) {
  const P = fullKey(k);
  const F = frameOf(P.root, P.up, P.fwd, P.tf);
  // campos por lado (armR/armL, legR/legL, epR...) são absolutos; o campo comum é espelhado em z
  const side = (field, s, fn) => { const sp = s > 0 ? P[field + 'R'] : P[field + 'L']; return sp ? fn(sp, F, 1) : fn(P[field], F, s); };
  const ank = s => { const a = s > 0 ? P.ankR : P.ankL; return a != null ? a : P.ank; };
  return {
    root: V(...P.root), up: V(...P.up).normalize(), fwd: V(...P.fwd).normalize(), tf: P.tf, neck: P.neck, shE: P.shE, shR: P.shR,
    hand: SIDES.map(s => side('arm', s, toWorldPt)), ep: SIDES.map(s => side('ep', s, toWorldDir)),
    foot: SIDES.map(s => side('leg', s, toWorldPt)), kp: SIDES.map(s => side('kp', s, toWorldDir)),
    ank: SIDES.map(ank)
  };
}
const KF = C.keys.map(resolveKey);
function lerpPose(A, B, f) {
  const L = (a, b) => a.clone().lerp(b, f), n = (a, b) => a + (b - a) * f;
  return { root: L(A.root, B.root), up: L(A.up, B.up), fwd: L(A.fwd, B.fwd), tf: n(A.tf, B.tf), neck: n(A.neck, B.neck), shE: n(A.shE, B.shE), shR: n(A.shR, B.shR),
    hand: A.hand.map((h, i) => L(h, B.hand[i])), ep: A.ep.map((h, i) => L(h, B.ep[i])), foot: A.foot.map((h, i) => L(h, B.foot[i])), kp: A.kp.map((h, i) => L(h, B.kp[i])), ank: A.ank.map((a, i) => n(a, B.ank[i])) };
}
function pathPose(path, f) {
  if (path.length === 1) return KF[path[0]];
  const x = f * (path.length - 1); const i = Math.min(path.length - 2, Math.floor(x));
  return lerpPose(KF[path[i]], KF[path[i + 1]], x - i);
}

/* ================= IK ================= */
function ik(S, T, a, b, pole) {
  const d = V().subVectors(T, S); let L = d.length(); const dir = d.divideScalar(L || 1);
  L = Math.min(Math.max(L, Math.abs(a - b) + 1e-4), a + b - 1e-4);
  const cosA = (a * a + L * L - b * b) / (2 * a * L), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
  const p = pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir)));
  if (p.lengthSq() < 1e-8) p.set(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y));
  p.normalize();
  return { M: S.clone().addScaledVector(dir, a * cosA).addScaledVector(p, a * sinA), E: S.clone().addScaledVector(dir, L), p };
}
const R = { sh: [V(), V()], el: [V(), V()], wr: [V(), V()], grip: [V(), V()], fore: [V(), V()], hip: [V(), V()], kn: [V(), V()], an: [V(), V()], toe: [V(), V()], shinX: [V(), V()], shinY: [V(), V()], F: null };
const SH_Y0 = 0.47, SH_DY = 0.075;
function applyPose(P) {
  const F = frameOf(P.root.toArray(), P.up.toArray(), P.fwd.toArray(), P.tf); R.F = F;
  pelvisG.position.copy(F.o); pelvisG.quaternion.copy(F.qp);
  torsoG.position.copy(F.o); torsoG.quaternion.copy(F.qt);
  const shY = SH_Y0 + SH_DY * P.shE;
  SIDES.forEach((s, i) => {
    shG[i].position.set(-0.035 * P.shR, shY, 0.2 * s);
    placeBetween(trapU[i], V(-0.045, 0.645, 0.012 * s), V(-0.035 - 0.02 * P.shR, shY + 0.03, 0.175 * s), 0.026 + 0.012 * P.shE, 0.058 + 0.008 * P.shE);
  });
  headG.position.copy(V(-0.008, 0.6, 0).applyQuaternion(F.qt).add(F.o));
  headG.quaternion.copy(F.qt).multiply(Qz(-P.neck * D2R));
  limbs.forEach((L, i) => {
    const s = L.s;
    torsoG.updateMatrixWorld();
    const S = V(-0.035 * P.shR, shY, 0.2 * s).applyQuaternion(F.qt).add(F.o); R.sh[i].copy(S);
    const a = ik(S, P.hand[i], LEN.ua, LEN.fa, P.ep[i]);
    setBone(L.ua, S, a.M, a.p.clone().negate()); setBone(L.fa, a.M, a.E, a.p.clone().negate());
    R.el[i].copy(a.M); R.wr[i].copy(a.E);
    R.fore[i].subVectors(a.E, a.M).normalize(); R.grip[i].copy(a.E).addScaledVector(R.fore[i], 0.05);
    const H = V(0, -0.04, 0.092 * s).applyQuaternion(F.qp).add(F.o); R.hip[i].copy(H);
    const l = ik(H, P.foot[i], LEN.th, LEN.sh, P.kp[i]);
    setBone(L.th, H, l.M, l.p); const fr = setBone(L.sn, l.M, l.E, l.p);
    R.kn[i].copy(l.M); R.an[i].copy(l.E); R.shinX[i].copy(fr.X); R.shinY[i].copy(fr.Y);
    L.footG.position.copy(l.E);
    L.footG.quaternion.setFromRotationMatrix(_m4.makeBasis(fr.X, fr.Y, fr.Z)).multiply(Qz(-P.ank[i] * D2R));
    R.toe[i].copy(V(0.17, -0.02, 0).applyQuaternion(L.footG.quaternion).add(l.E));
  });
}

/* ================= kit de equipamentos ================= */
const dyn = [];
const VV = a => Array.isArray(a) ? V(...a) : a;
const kit = {
  M, V, KF, R, D2R,
  frame(k = 0) { const P = fullKey(C.keys[k]); return frameOf(P.root, P.up, P.fwd, P.tf); },
  box(c, s, mat = M.frame, q, rad = 0.02) { const m = rbox(s[0], s[1], s[2], mat, rad); m.position.copy(VV(c)); if (q) m.quaternion.copy(q); scene.add(m); return m; },
  boxF(fr, which, lp, s, mat = M.pad) { const q = which === 't' ? fr.qt : fr.qp; return kit.box(V(...lp).applyQuaternion(q).add(fr.o), s, mat, q, 0.03); },
  ptF(fr, which, lp) { return V(...lp).applyQuaternion(which === 't' ? fr.qt : fr.qp).add(fr.o); },
  beam(a, b, r = 0.025, mat = M.frame) { const m = stick(r, mat); orientBetween(m, VV(a), VV(b)); return m; },
  rails(x0, x1, z = 0.26, y = 0.03) { kit.beam([x0, y, 0], [x1, y, 0], 0.025); [x0, x1].forEach(x => kit.beam([x, y, -z], [x, y, z], 0.022)); },
  pulley(p) { const m = cyl(0.045, 0.03, M.steel); m.rotation.x = Math.PI / 2; m.position.copy(VV(p)); scene.add(m); return m; },
  stack(x, z, h = 2.1, w = 0.32) {
    [-1, 1].forEach(k => kit.beam([x, 0, z + k * w / 2], [x, h, z + k * w / 2], 0.022));
    kit.beam([x, h, z - w / 2], [x, h, z + w / 2], 0.022);
    kit.box([x, 0.22, z], [0.2, 0.36, w - 0.07], M.plate, null, 0.01);
    kit.box([x, 0.02, z], [0.36, 0.04, w + 0.16], M.frame);
  },
  matFloor(x0, x1, w = 0.62) { kit.box([(x0 + x1) / 2, 0.006, 0], [x1 - x0, 0.012, w], M.matf, null, 0.004); },
  dyn(fn) { dyn.push(fn); },
  cable(getA, B) { const m = stick(0.006, M.cable); dyn.push(() => orientBetween(m, getA(), typeof B === 'function' ? B() : VV(B))); return m; },
  link(getA, getB, r = 0.022, mat = M.frame) { const m = stick(r, mat); dyn.push(() => orientBetween(m, getA(), getB())); return m; },
  padAt(getP, getAxis, len = 0.3, r = 0.05) { const m = cyl(r, len, M.pad); scene.add(m); dyn.push(() => { m.position.copy(getP()); m.quaternion.setFromUnitVectors(UP, getAxis()); }); return m; },
  dumbbell(i, axisFn, size = 1) {
    const g = new THREE.Group(); scene.add(g);
    g.add(cyl(0.016, 0.17 * size, M.steel));
    [-1, 1].forEach(k => { const p = cyl(0.066 * size, 0.045, M.plate); p.position.y = 0.1 * k * size; g.add(p); });
    dyn.push(() => { g.position.copy(R.grip[i]); g.quaternion.setFromUnitVectors(UP, axisFn(i)); });
  },
  bar(len = 1.2, plates = 0, ez = false) {
    const g = new THREE.Group(); scene.add(g);
    g.add(cyl(0.014, len, M.steel));
    if (ez) [-1, 1].forEach(k => { const w = cyl(0.016, 0.1, M.steel); w.position.set(0.012, 0.1 * k, 0); w.rotation.z = 0.4 * k; g.add(w); });
    if (plates) [-1, 1].forEach(k => { const p = cyl(plates, 0.035, M.plate); p.position.y = (len / 2 - 0.07) * k; g.add(p); });
    dyn.push(() => { g.position.copy(kit.gripMid()); g.quaternion.setFromUnitVectors(UP, V().subVectors(R.grip[0], R.grip[1]).normalize()); });
    return g;
  },
  handle(i, axisFn, len = 0.14) { const m = cyl(0.016, len, M.steel); scene.add(m); dyn.push(() => { m.position.copy(R.grip[i]); m.quaternion.setFromUnitVectors(UP, axisFn(i)); }); return m; },
  gripMid: () => R.grip[0].clone().add(R.grip[1]).multiplyScalar(0.5),
  axis: {
    hammer: i => { const v = V().crossVectors(R.fore[i], V(0, 0, 1)); if (v.lengthSq() < 0.04) v.crossVectors(R.fore[i], V(1, 0, 0)); return v.normalize(); },
    lat: () => V(0, 0, 1),
    fwdT: () => V(1, 0, 0).applyQuaternion(R.F.qt),
    latT: () => V(0, 0, 1).applyQuaternion(R.F.qt),
    upT: () => V(0, 1, 0).applyQuaternion(R.F.qt),
    x: () => V(1, 0, 0), y: () => V(0, 1, 0)
  }
};

/* ================= piso + equipamento + destaque ================= */
const floor = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), M.floor);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
applyPose(KF[0]);
if (C.eq) C.eq(kit);
dyn.forEach(f => f());

const prim = C.mus[0], sec = C.mus[1] || [];
prim.forEach(n => (MUS[n] || []).forEach(m => {
  m.material = M.hl;
  const g = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), M.glow); g.scale.setScalar(1.22); m.add(g);
}));
sec.forEach(n => (MUS[n] || []).forEach(m => { if (m.material === M.skin) m.material = M.hl2; }));

/* ================= linha do tempo ================= */
const PH = C.ph;
const T = PH.reduce((a, p) => a + p.d, 0);
const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
function stateAt(t) {
  let a = 0;
  for (let i = 0; i < PH.length; i++) {
    const p = PH[i];
    if (t < a + p.d || i === PH.length - 1) {
      const f = Math.min(1, Math.max(0, (t - a) / p.d)), ef = ease(f);
      const e = p.k === 'u' ? ef : p.k === 'd' ? 1 - ef : p.k === 'h' ? 1 : 0;
      return { i, f, e, pose: pathPose(p.p, p.k === 'u' || p.k === 'd' ? ef : 1) };
    }
    a += p.d;
  }
}
const phaseStart = i => PH.slice(0, i).reduce((a, p) => a + p.d, 0);

/* ================= câmera ================= */
const bbox = new THREE.Box3();
[...new Set(PH.flatMap(p => p.p))].forEach(k => {
  applyPose(KF[k]); dyn.forEach(f => f()); scene.updateMatrixWorld(true);
  scene.children.forEach(o => { if (o !== floor && !o.isLight) bbox.expandByObject(o); });
});
const TARGET = bbox.getCenter(V()); const SIZE = bbox.getSize(V());
TARGET.y = Math.max(TARGET.y, 0.35);
const VIEWS = { tq: V(-0.56, 0.42, 0.72), lat: V(0.02, 0.12, 1), pos: V(-0.8, 0.6, 0.06), fr: V(0.93, 0.25, 0.3) };
let DIST = 3.4, curView = C.view || 'tq';
const viewPos = k => VIEWS[k].clone().normalize().multiplyScalar(DIST).add(TARGET);
let camAnim = null;
function goView(k) {
  curView = k;
  camAnim = { from: camera.position.clone(), to: viewPos(k), t: 0 };
  document.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === k));
}

/* ================= UI ================= */
const $ = id => document.getElementById(id);
document.title = C.title.replace(/<[^>]+>/g, ' ') + ' · execução 3D';
$('eyebrow').textContent = C.day;
$('title').innerHTML = C.title;
$('sub').textContent = C.sub;
const nm = a => a.map(n => MUSCLE_NAMES[n]).join(', ');
$('legend').innerHTML = '<span><i style="background:var(--ac)"></i>alvo: ' + nm(prim) + '</span>' + (sec.length ? '<span><i style="background:#c98a6e"></i>apoio: ' + nm(sec) + '</span>' : '') + (C.noSpine ? '' : '<span><i style="background:var(--gn)"></i>coluna neutra</span>');
$('tag').querySelector('span').textContent = C.tag || MUSCLE_NAMES[prim[0]];
if (C.alt) {
  $('alt').innerHTML = C.alt.map(([k, n]) => '<a href="?ex=' + k + '" class="' + (k === KEY ? 'on' : '') + '">' + n + '</a>').join('');
  $('alt').style.display = 'flex';
}
const phEl = $('phases');
let playing = true, clock = 0, speed = 1;
PH.forEach((p, i) => {
  const b = document.createElement('button'); b.className = 'ph'; b.style.flexGrow = p.d;
  b.innerHTML = '<span class="ph-n">' + p.n + '</span><span class="ph-bar"><i></i></span>';
  b.onclick = () => { playing = true; clock = phaseStart(i) + 0.001; setPlay(); };
  phEl.appendChild(b);
});
const phBtns = [...phEl.children];
const cueEls = C.cues.map(([txt, kind]) => { const e = document.createElement('span'); e.className = 'cue' + (kind === 'ok' ? ' ok' : kind === 'warn' ? ' warn' : ''); e.textContent = txt; $('cues').appendChild(e); return e; });
function setPlay() { $('play').textContent = playing ? '❚❚' : '▶'; }
$('play').onclick = () => { playing = !playing; setPlay(); };
$('slow').onclick = () => { speed = speed === 1 ? 0.5 : 1; $('slow').textContent = speed === 1 ? '1×' : '0,5×'; $('slow').classList.toggle('on', speed !== 1); };
document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => goView(b.dataset.v));
if (window.top === window) $('back').style.display = 'flex';
$('back').onclick = () => { location.href = './index.html'; };
setPlay();
const tag = $('tag'), meter = $('meter'), cap = $('cap');
const tagAnchor = (MUS[C.tagM || prim[0]] || [])[0];

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h;
  const topH = document.querySelector('.top').getBoundingClientRect().bottom + 8;
  const botH = h - document.querySelector('.panel').getBoundingClientRect().top + 8;
  const free = Math.max(160, h - topH - botH), yc = topH + free / 2;
  const tanH = Math.tan(camera.fov * D2R / 2);
  const ext = Math.max(SIZE.x, SIZE.y, SIZE.z);
  const needV = (Math.max(SIZE.y, ext * 0.7) * 1.05) / (2 * tanH) * (h / free);
  const needW = ext / (2 * tanH * camera.aspect);
  DIST = Math.min(9, Math.max(2.2, needV, needW) + ext * 0.2);
  controls.maxDistance = DIST * 1.7;
  camera.setViewOffset(w, h, 0, -(yc - h / 2), w, h);
  camera.updateProjectionMatrix();
  if (!camAnim) camera.position.copy(viewPos(curView));
  document.querySelector('.hint').style.bottom = (botH + 2) + 'px';
}
controls.target.copy(TARGET);
window.addEventListener('resize', resize); resize();
document.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === curView));
canvas.addEventListener('pointerdown', () => { document.querySelector('.hint').style.opacity = 0; }, { once: true });

const tagPos = V();
let lastI = -1, prev = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  if (playing) clock = (clock + dt * speed) % T;
  const st = stateAt(clock);
  applyPose(st.pose); dyn.forEach(f => f());
  const pulse = st.e > 0.99 ? 0.12 * (0.5 + 0.5 * Math.sin(now / 1000 * 7)) : 0;
  M.hl.emissiveIntensity = 0.18 + 0.7 * st.e + pulse;
  M.hl2.emissiveIntensity = 0.03 + 0.15 * st.e;
  M.glow.opacity = 0.08 + 0.22 * st.e + pulse * 0.6;
  if (camAnim) {
    camAnim.t = Math.min(1, camAnim.t + dt / 0.7);
    camera.position.lerpVectors(camAnim.from, camAnim.to, ease(camAnim.t));
    if (camAnim.t >= 1) camAnim = null;
  }
  controls.update();
  renderer.render(scene, camera);
  phBtns.forEach((b, i) => { b.classList.toggle('on', i === st.i); b.querySelector('i').style.width = (i < st.i ? 100 : i === st.i ? st.f * 100 : 0) + '%'; });
  if (st.i !== lastI) {
    lastI = st.i; cap.textContent = PH[st.i].t;
    C.cues.forEach(([, , act], j) => { if (act) cueEls[j].classList.toggle('hot', act.includes(st.i)); });
  }
  meter.style.width = (st.e * 100).toFixed(0) + '%';
  $('pct').textContent = (st.e * 100).toFixed(0) + '%';
  if (tagAnchor) {
    tagAnchor.getWorldPosition(tagPos); tagPos.project(camera);
    tag.style.transform = 'translate(' + ((tagPos.x * 0.5 + 0.5) * window.innerWidth).toFixed(1) + 'px,' + ((-tagPos.y * 0.5 + 0.5) * window.innerHeight).toFixed(1) + 'px)';
    tag.style.opacity = tagPos.z < 1 ? 1 : 0;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__demo = { setClock: c => { clock = c; }, pause: () => { playing = false; setPlay(); }, goView, T, PH, phaseStart };
