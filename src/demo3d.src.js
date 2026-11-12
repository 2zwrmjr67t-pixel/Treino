/* Demo 3D de execução — Protocolo Guilherme.
   Fonte (ES module). Build: npx esbuild src/demo3d.src.js --bundle --minify --format=esm --outfile=demo3d.js
   Esquema ilustrativo do padrão de movimento: não substitui orientação profissional. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const D2R = Math.PI / 180;
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
scene.fog = new THREE.Fog(0x141311, 5, 11);

const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 50);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 1.3;
controls.maxDistance = 5;
controls.maxPolarAngle = 88 * D2R;

/* ---------- luz ---------- */
scene.add(new THREE.HemisphereLight(0xf3ead8, 0x1a1715, 0.85));
const key = new THREE.DirectionalLight(0xfff1dc, 2.4);
key.position.set(1.8, 4.2, 2.6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 1.6, bottom: -1.6, near: 0.5, far: 10 });
key.shadow.bias = -0.0004;
key.shadow.radius = 4;
scene.add(key);
const rim = new THREE.DirectionalLight(0xc9d6e8, 0.9);
rim.position.set(-3, 2.5, -2);
scene.add(rim);

/* ---------- materiais ---------- */
const M = {
  skin: new THREE.MeshStandardMaterial({ color: 0xc9cbcd, roughness: 0.48, metalness: 0.0 }),
  pad: new THREE.MeshStandardMaterial({ color: 0x3b2a2c, roughness: 0.75 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.45, metalness: 0.55 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x9a968f, roughness: 0.3, metalness: 0.85 }),
  plate: new THREE.MeshStandardMaterial({ color: 0x232120, roughness: 0.55, metalness: 0.35 }),
  trap: new THREE.MeshStandardMaterial({ color: 0xd9472b, emissive: 0xff4a1f, emissiveIntensity: 0.2, roughness: 0.42 }),
  trap2: new THREE.MeshStandardMaterial({ color: 0xb8705c, emissive: 0xd0603a, emissiveIntensity: 0.04, roughness: 0.5, transparent: true, opacity: 0.6 }),
  glow: new THREE.MeshBasicMaterial({ color: 0xff6a35, transparent: true, opacity: 0.15, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  spine: new THREE.MeshBasicMaterial({ color: 0x7fb27f, transparent: true, opacity: 0.7 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x1d1b19, roughness: 1 })
};
/* contorno luminoso (fresnel) no manequim, como nas referências de estúdio */
M.skin.onBeforeCompile = sh => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\n  float frs = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), 3.0);\n  totalEmissiveRadiance += vec3(0.62, 0.7, 0.9) * frs * 0.42;');
};
M.trap.onBeforeCompile = sh => {
  sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>',
    '#include <emissivemap_fragment>\n  float frt = pow(1.0 - clamp(abs(dot(normalize(vViewPosition), normal)), 0.0, 1.0), 2.0);\n  totalEmissiveRadiance += vec3(1.0, 0.55, 0.25) * frt * 0.6;');
};

function shade(m) { m.castShadow = true; m.receiveShadow = true; return m; }
function sphere(r, mat) { return shade(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat)); }
function ellipsoid(sx, sy, sz, mat) { const m = sphere(1, mat); m.scale.set(sx, sy, sz); return m; }
function capsule(r, len, mat) { return shade(new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 10, 20), mat)); }
function cyl(r, len, mat) { return shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), mat)); }
function beam(a, b, r, mat) { // cilindro entre dois pontos (mundo)
  const d = new THREE.Vector3().subVectors(b, a); const m = cyl(r, d.length(), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  scene.add(m); return m;
}

/* ---------- piso ---------- */
const floor = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), M.floor);
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
const ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.262, 96), new THREE.MeshBasicMaterial({ color: 0x3a3632 }));
ring.rotation.x = -Math.PI / 2; ring.position.set(0.25, 0.002, 0); scene.add(ring);

/* ---------- corpo (manequim anatômico procedural) ---------- */
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
/* membro com perfil muscular (torno): articulação na origem, segmento em -y local */
function mLimb(parent, len, prof, rz, sx = 1, sz = 1) {
  const j = new THREE.Group(); j.rotation.z = rz || 0; parent.add(j);
  const pts = smoothProfile(prof, 48).map(([t, r]) => new THREE.Vector2(r, -t * len)).reverse();
  const g = new THREE.LatheGeometry(pts, 40);
  const m = shade(new THREE.Mesh(g, M.skin)); m.scale.set(sx, 1, sz); j.add(m);
  const r0 = prof[0][1], r1 = prof[prof.length - 1][1];
  const c0 = sphere(r0, M.skin); c0.scale.set(sx, 1, sz); j.add(c0);
  const end = new THREE.Group(); end.position.y = -len; j.add(end);
  const c1 = sphere(r1, M.skin); c1.scale.set(sx, 1, sz); end.add(c1);
  return { j, end };
}
function blob(parent, sx, sy, sz, x, y, z, rx = 0, ry = 0, rz = 0, mat = M.skin) {
  const m = ellipsoid(sx, sy, sz, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m); return m;
}

const body = new THREE.Group(); scene.add(body);
const pelvis = new THREE.Group(); pelvis.position.set(0, 0.985, 0); body.add(pelvis);
blob(pelvis, 0.112, 0.095, 0.155, -0.01, -0.005, 0);
[1, -1].forEach(s => blob(pelvis, 0.06, 0.078, 0.07, -0.058, -0.03, 0.066 * s, 0, 0, 0.3)); // glúteos

const torso = new THREE.Group(); torso.rotation.z = -45 * D2R; pelvis.add(torso);
/* núcleo: cintura → caixa torácica */
blob(torso, 0.088, 0.15, 0.13, -0.005, 0.15, 0);
blob(torso, 0.114, 0.195, 0.168, 0.0, 0.37, 0);
/* abdômen (6 blocos discretos) e oblíquos */
[0.1, 0.17, 0.24].forEach((y, i) => [1, -1].forEach(s => blob(torso, 0.022, 0.03, 0.03, 0.078 - i * 0.004 + 0.008, y, 0.033 * s)));
[1, -1].forEach(s => blob(torso, 0.055, 0.11, 0.032, 0.012, 0.17, 0.1 * s, 0, 0, 0.1));
/* peitoral */
[1, -1].forEach(s => blob(torso, 0.045, 0.085, 0.092, 0.075, 0.43, 0.082 * s, 0.25 * s, 0, 0.12));
/* dorsal (asas), eretores, escápulas */
[1, -1].forEach(s => blob(torso, 0.042, 0.16, 0.07, -0.04, 0.32, 0.115 * s, -0.22 * s, 0, 0));
[1, -1].forEach(s => blob(torso, 0.024, 0.19, 0.03, -0.078, 0.2, 0.034 * s));
[1, -1].forEach(s => blob(torso, 0.02, 0.07, 0.058, -0.098, 0.42, 0.09 * s, 0.15 * s, 0, 0));
/* pescoço e cabeça (sem feições, como manequim de referência) */
const neckG = new THREE.CylinderGeometry(0.043, 0.054, 0.15, 28); const neckM = shade(new THREE.Mesh(neckG, M.skin));
neckM.position.set(-0.008, 0.6, 0); torso.add(neckM);
const head = new THREE.Group(); head.position.set(0, 0.735, 0); torso.add(head);
blob(head, 0.085, 0.102, 0.078, -0.008, 0.012, 0);
blob(head, 0.06, 0.06, 0.06, 0.035, -0.045, 0, 0, 0, -0.3);       // mandíbula / face
blob(head, 0.025, 0.03, 0.04, 0.08, -0.005, 0);                    // plano facial
[1, -1].forEach(s => blob(head, 0.012, 0.022, 0.01, -0.005, 0.0, 0.078 * s));

/* linha neutra da coluna (pelve → topo da cabeça) */
const spineLine = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.9, 8), M.spine);
spineLine.position.set(-0.155, 0.42, 0); torso.add(spineLine);
[0, 0.84].forEach(y => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), M.spine); d.position.set(-0.155, y, 0); torso.add(d); });

/* ombros, braços e halteres */
const SH_Y0 = 0.47, SH_DY = 0.075;
const shoulders = [];
[1, -1].forEach(s => {
  const sh = new THREE.Group(); sh.position.set(0.0, SH_Y0, 0.2 * s); torso.add(sh);
  blob(sh, 0.068, 0.085, 0.07, 0.0, -0.022, 0.018 * s);               // deltoide
  const upper = mLimb(sh, 0.29, [[0, 0.046], [0.12, 0.05], [0.45, 0.047], [0.8, 0.038], [1, 0.034]], 45 * D2R);
  blob(upper.j, 0.032, 0.085, 0.036, 0.024, -0.15, 0);                  // bíceps
  blob(upper.j, 0.036, 0.1, 0.038, -0.024, -0.12, 0);                   // tríceps
  const fore = mLimb(upper.end, 0.26, [[0, 0.036], [0.18, 0.043], [0.5, 0.033], [0.85, 0.024], [1, 0.022]], 0);
  blob(fore.j, 0.03, 0.07, 0.03, 0.015, -0.06, 0.01 * s);               // braquiorradial
  const hand = shade(new THREE.Mesh(new RoundedBoxGeometry(0.05, 0.085, 0.036, 3, 0.016), M.skin)); hand.position.y = -0.045; fore.end.add(hand);
  const db = new THREE.Group(); db.position.y = -0.06; fore.end.add(db);
  const handle = cyl(0.016, 0.17, M.steel); handle.rotation.z = Math.PI / 2; db.add(handle);
  [-1, 1].forEach(k => {
    const p = cyl(0.068, 0.045, M.plate); p.rotation.z = Math.PI / 2; p.position.x = 0.1 * k; db.add(p);
    const c = cyl(0.02, 0.05, M.steel); c.rotation.z = Math.PI / 2; c.position.x = 0.1 * k; db.add(c);
  });
  shoulders.push({ s, sh });
});

/* trapézio: superior (2 feixes pescoço → acrômio, alvo) + médio */
function glowShell(parent, k) {
  const g = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), M.glow); g.scale.setScalar(k); parent.add(g); return g;
}
const trapU = [1, -1].map(s => { const m = sphere(1, M.trap); m.castShadow = false; torso.add(m); glowShell(m, 1.22); return { s, m }; });
const trapM = blob(torso, 0.012, 0.115, 0.06, -0.112, 0.43, 0, 0, 0, 0, M.trap2); trapM.castShadow = false;
const BACK = new THREE.Vector3(-1, 0.25, 0).normalize();
function placeBetween(mesh, a, b, thick, width) {
  const d = new THREE.Vector3().subVectors(b, a); const len = d.length(); d.normalize();
  const x = BACK.clone().sub(d.clone().multiplyScalar(BACK.dot(d))).normalize();
  const z = new THREE.Vector3().crossVectors(x, d);
  mesh.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, d, z));
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.scale.set(thick, len / 2 + 0.02, width);
}

/* pernas */
[1, -1].forEach(s => {
  const hip = new THREE.Group(); hip.position.set(0, -0.04, 0.092 * s); pelvis.add(hip);
  const thigh = mLimb(hip, 0.45, [[0, 0.074], [0.2, 0.078], [0.55, 0.066], [0.85, 0.052], [1, 0.046]], -10 * D2R);
  blob(thigh.j, 0.032, 0.16, 0.042, 0.04, -0.2, 0);                      // reto femoral
  blob(thigh.j, 0.028, 0.075, 0.034, 0.03, -0.35, -0.026 * s, 0, 0, 0);   // vasto medial (gota)
  blob(thigh.j, 0.03, 0.13, 0.03, 0.016, -0.24, 0.042 * s);              // vasto lateral
  blob(thigh.j, 0.03, 0.15, 0.042, -0.038, -0.22, 0);                     // isquiotibiais
  const shin = mLimb(thigh.end, 0.45, [[0, 0.046], [0.25, 0.05], [0.6, 0.034], [0.88, 0.025], [1, 0.027]], 15 * D2R);
  blob(shin.j, 0.03, 0.1, 0.038, -0.026, -0.14, 0.01 * s);               // gastrocnêmio
  blob(shin.j, 0.018, 0.12, 0.02, 0.03, -0.17, 0.012 * s);               // tibial anterior
  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.055, 0.085, 4, 0.026), M.skin); shade(foot);
  const fg = new THREE.Group(); fg.rotation.z = -5 * D2R; shin.end.add(fg);
  foot.position.set(0.06, -0.014, 0); fg.add(foot);
});

/* ---------- banco inclinado 45° ---------- */
const pad = shade(new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.6, 0.27, 4, 0.03), M.pad));
pad.position.set(0.168, 0.15, 0); torso.add(pad);
body.updateMatrixWorld(true);
const W = (x, y, z = 0) => torso.localToWorld(new THREE.Vector3(x, y, z));
const p1 = W(0.215, -0.1), p2 = W(0.215, 0.4);
beam(p1, p2, 0.02, M.frame);
const colTop = W(0.215, 0.26); const colBot = new THREE.Vector3(colTop.x, 0.04, 0);
beam(colTop, colBot, 0.028, M.frame);
const strutTop = W(0.215, -0.08); beam(strutTop, new THREE.Vector3(strutTop.x + 0.02, 0.04, 0), 0.022, M.frame);
beam(new THREE.Vector3(-0.42, 0.03, 0), new THREE.Vector3(colBot.x + 0.32, 0.03, 0), 0.025, M.frame);
[-0.42, colBot.x + 0.32].forEach(x => beam(new THREE.Vector3(x, 0.03, -0.26), new THREE.Vector3(x, 0.03, 0.26), 0.022, M.frame));
const plat = shade(new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.025, 0.42, 2, 0.008), M.frame));
plat.position.set(-0.29, 0.05, 0); scene.add(plat);

/* ---------- linha do tempo (s): repouso · subida 1s · topo 2s · descida 3s · repouso ---------- */
const PH = [
  { k: 'ini', n: 'Início', d: 0.8, t: 'Peito firme no apoio a 45°, olhar para o chão. Braços retos e soltos, ombros relaxados para baixo.' },
  { k: 'sub', n: 'Subida · 1s', d: 1.0, t: 'Eleve os ombros em direção às orelhas — só as escápulas sobem. Cotovelos permanecem retos.' },
  { k: 'top', n: 'Topo · segure 2s', d: 2.0, t: 'Segure a contração 2s. Pescoço neutro: não projete a cabeça nem gire o pescoço.' },
  { k: 'des', n: 'Descida · 3s', d: 3.0, t: 'Desça controlando até alongar o trapézio. Se irradiar para o braço, dormência ou choque: pare.' }
];
const T = PH.reduce((a, p) => a + p.d, 0);
const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
function stateAt(t) {
  let a = 0;
  for (let i = 0; i < PH.length; i++) {
    const p = PH[i], f = (t - a) / p.d;
    if (t < a + p.d) {
      const e = p.k === 'ini' ? 0 : p.k === 'sub' ? ease(f) : p.k === 'top' ? 1 : 1 - ease(f);
      return { i, f, e };
    }
    a += p.d;
  }
  return { i: 0, f: 0, e: 0 };
}
function phaseStart(i) { let a = 0; for (let k = 0; k < i; k++) a += PH[k].d; return a; }

function applyPose(e, t) {
  const y = SH_Y0 + SH_DY * e;
  shoulders.forEach(o => { o.sh.position.y = y; o.sh.position.x = -0.012 * e; });
  trapU.forEach(o => {
    const a = new THREE.Vector3(-0.045, 0.645, 0.012 * o.s);
    const b = new THREE.Vector3(-0.035, y + 0.03, 0.175 * o.s);
    placeBetween(o.m, a, b, 0.026 + 0.012 * e, 0.058 + 0.008 * e);
  });
  const pulse = e > 0.99 ? 0.12 * (0.5 + 0.5 * Math.sin(t * 7)) : 0;
  M.trap.emissiveIntensity = 0.18 + 0.7 * e + pulse;
  M.trap2.emissiveIntensity = 0.03 + 0.15 * e;
  M.glow.opacity = 0.08 + 0.22 * e + pulse * 0.6;
}

/* ---------- câmera ---------- */
const TARGET = new THREE.Vector3(0.2, 0.86, 0);
const VIEWS = {
  tq: { d: new THREE.Vector3(-0.56, 0.42, 0.72) },
  lat: { d: new THREE.Vector3(0.02, 0.12, 1) },
  pos: { d: new THREE.Vector3(-0.8, 0.6, 0.06) },
  fr: { d: new THREE.Vector3(0.93, 0.2, 0.33) }
};
let DIST = 3.4, curView = 'tq';
const viewPos = k => VIEWS[k].d.clone().normalize().multiplyScalar(DIST).add(TARGET);
camera.position.copy(viewPos('tq')); controls.target.copy(TARGET); controls.update();
let camAnim = null;
function goView(k) {
  curView = k;
  camAnim = { from: camera.position.clone(), to: viewPos(k), t: 0 };
  document.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === k));
}

/* ---------- UI ---------- */
const $ = id => document.getElementById(id);
const phEl = $('phases');
PH.forEach((p, i) => {
  const b = document.createElement('button'); b.className = 'ph'; b.style.flexGrow = p.d;
  b.innerHTML = '<span class="ph-n">' + p.n + '</span><span class="ph-bar"><i></i></span>';
  b.onclick = () => { playing = true; clock = phaseStart(i) + 0.001; setPlay(); };
  phEl.appendChild(b);
});
const phBtns = [...phEl.children];
let playing = true, clock = 0, speed = 1;
function setPlay() { $('play').textContent = playing ? '❚❚' : '▶'; }
$('play').onclick = () => { playing = !playing; setPlay(); };
$('slow').onclick = () => { speed = speed === 1 ? 0.5 : 1; $('slow').textContent = speed === 1 ? '1×' : '0,5×'; $('slow').classList.toggle('on', speed !== 1); };
document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => goView(b.dataset.v));
if (window.top === window) { $('back').style.display = 'flex'; }
$('back').onclick = () => { location.href = './index.html'; };
setPlay();

const tag = $('tag'), meter = $('meter'), cap = $('cap');
const tagPos = new THREE.Vector3();
let lastI = -1;

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h;
  const topH = document.querySelector('.top').getBoundingClientRect().bottom + 8;
  const botH = h - document.querySelector('.panel').getBoundingClientRect().top + 8;
  const free = Math.max(160, h - topH - botH);
  const yc = topH + free / 2; // centro da área livre
  camera.fov = 34;
  // distância para o corpo (~1,9 m de altura útil) caber na área livre
  const need = 1.7 / (2 * Math.tan(camera.fov * D2R / 2)) * (h / free);
  const needW = 1.6 / (2 * Math.tan(camera.fov * D2R / 2) * camera.aspect);
  DIST = Math.min(6.5, Math.max(2.4, need, needW));
  controls.maxDistance = DIST * 1.6;
  camera.setViewOffset(w, h, 0, -(yc - h / 2), w, h);
  camera.updateProjectionMatrix();
  if (!camAnim) { const dir = camera.position.clone().sub(controls.target).normalize(); camera.position.copy(controls.target).addScaledVector(dir, DIST); }
  document.querySelector('.hint').style.bottom = (botH + 2) + 'px';
}
window.addEventListener('resize', resize); resize();
canvas.addEventListener('pointerdown', () => { document.querySelector('.hint').style.opacity = 0; }, { once: true });

let prev = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
  if (playing) clock = (clock + dt * speed) % T;
  const st = stateAt(clock);
  applyPose(st.e, now / 1000);

  if (camAnim) {
    camAnim.t = Math.min(1, camAnim.t + dt / 0.7); const k = ease(camAnim.t);
    camera.position.lerpVectors(camAnim.from, camAnim.to, k);
    if (camAnim.t >= 1) camAnim = null;
  }
  controls.update();
  renderer.render(scene, camera);

  phBtns.forEach((b, i) => {
    b.classList.toggle('on', i === st.i);
    b.querySelector('i').style.width = (i < st.i ? 100 : i === st.i ? st.f * 100 : 0) + '%';
  });
  if (st.i !== lastI) { lastI = st.i; cap.textContent = PH[st.i].t; $('cue-up').classList.toggle('hot', st.i === 1 || st.i === 2); $('cue-head').classList.toggle('hot', st.i === 2); }
  meter.style.width = (st.e * 100).toFixed(0) + '%';
  $('pct').textContent = (st.e * 100).toFixed(0) + '%';

  trapU[0].m.getWorldPosition(tagPos); tagPos.project(camera);
  const x = (tagPos.x * 0.5 + 0.5) * window.innerWidth, y = (-tagPos.y * 0.5 + 0.5) * window.innerHeight;
  tag.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
  tag.style.opacity = tagPos.z < 1 ? 1 : 0;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.__demo = { setClock: c => { clock = c; }, pause: () => { playing = false; setPlay(); }, goView, camera };
