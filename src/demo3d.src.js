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
scene.background = new THREE.Color(0x141311);
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
  skin: new THREE.MeshStandardMaterial({ color: 0xd8cebf, roughness: 0.6 }),
  joint: new THREE.MeshStandardMaterial({ color: 0xc2b7a6, roughness: 0.6 }),
  pad: new THREE.MeshStandardMaterial({ color: 0x4d2830, roughness: 0.75 }),
  frame: new THREE.MeshStandardMaterial({ color: 0x2c2a27, roughness: 0.45, metalness: 0.55 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x9a968f, roughness: 0.3, metalness: 0.85 }),
  plate: new THREE.MeshStandardMaterial({ color: 0x232120, roughness: 0.55, metalness: 0.35 }),
  trap: new THREE.MeshStandardMaterial({ color: 0xc9a05a, emissive: 0xc9a05a, emissiveIntensity: 0.15, roughness: 0.45 }),
  trap2: new THREE.MeshStandardMaterial({ color: 0xa8854a, emissive: 0xa8854a, emissiveIntensity: 0.05, roughness: 0.5, transparent: true, opacity: 0.75 }),
  spine: new THREE.MeshBasicMaterial({ color: 0x7fb27f, transparent: true, opacity: 0.7 }),
  floor: new THREE.MeshStandardMaterial({ color: 0x1d1b19, roughness: 1 })
};

function shade(m) { m.castShadow = true; m.receiveShadow = true; return m; }
function sphere(r, mat) { return shade(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat)); }
function ellipsoid(sx, sy, sz, mat) { const m = sphere(1, mat); m.scale.set(sx, sy, sz); return m; }
function capsule(r, len, mat) { return shade(new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 10, 20), mat)); }
function cyl(r, len, mat) { return shade(new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), mat)); }
/* membro: articulação na origem, segmento ao longo de -y local; rotação em z (plano sagital) */
function limb(parent, len, r, rz, r2) {
  const j = new THREE.Group(); j.rotation.z = rz || 0; parent.add(j);
  const geo = new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 10, 20);
  if (r2) { // afunilamento leve
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const t = (p.getY(i) + len / 2) / len; const k = r2 / r + (1 - r2 / r) * t; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
    geo.computeVertexNormals();
  }
  const m = shade(new THREE.Mesh(geo, M.skin)); m.position.y = -len / 2; j.add(m);
  const end = new THREE.Group(); end.position.y = -len; j.add(end);
  end.add(sphere(Math.min(r, r2 || r) * 1.02, M.joint));
  return { j, end };
}
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

/* ---------- corpo ---------- */
const body = new THREE.Group(); scene.add(body);
const pelvis = new THREE.Group(); pelvis.position.set(0, 0.985, 0); body.add(pelvis);
pelvis.add(ellipsoid(0.11, 0.095, 0.155, M.skin));

const torso = new THREE.Group(); torso.rotation.z = -45 * D2R; pelvis.add(torso);
const abd = ellipsoid(0.095, 0.16, 0.14, M.skin); abd.position.set(0.0, 0.16, 0); torso.add(abd);
const chest = ellipsoid(0.112, 0.17, 0.185, M.skin); chest.position.set(0.012, 0.385, 0); torso.add(chest);
const lats = ellipsoid(0.085, 0.14, 0.165, M.skin); lats.position.set(-0.025, 0.3, 0); torso.add(lats);
const neck = cyl(0.048, 0.14, M.skin); neck.position.set(-0.005, 0.6, 0); torso.add(neck);
const head = new THREE.Group(); head.position.set(0, 0.73, 0); torso.add(head);
head.add(ellipsoid(0.092, 0.112, 0.085, M.skin));
const nose = sphere(0.02, M.joint); nose.position.set(0.09, 0.0, 0); head.add(nose);
const brow = ellipsoid(0.02, 0.012, 0.06, M.joint); brow.position.set(0.082, 0.03, 0); head.add(brow);

/* linha neutra da coluna (pelve → topo da cabeça) */
const spineLine = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.9, 8), M.spine);
spineLine.position.set(-0.15, 0.42, 0); torso.add(spineLine);
[0, 0.84].forEach(y => { const d = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), M.spine); d.position.set(-0.15, y, 0); torso.add(d); });

/* ombros, braços e halteres */
const SH_Y0 = 0.47, SH_DY = 0.075;
const shoulders = [];
const handWorld = [];
[1, -1].forEach(s => {
  const sh = new THREE.Group(); sh.position.set(0.0, SH_Y0, 0.205 * s); torso.add(sh);
  const delt = ellipsoid(0.07, 0.075, 0.068, M.skin); delt.position.set(0.0, 0.0, 0.01 * s); sh.add(delt);
  const upper = limb(sh, 0.29, 0.05, 45 * D2R, 0.04);
  const fore = limb(upper.end, 0.26, 0.04, 0, 0.03);
  const hand = ellipsoid(0.035, 0.045, 0.03, M.joint); hand.position.y = -0.03; fore.end.add(hand);
  const db = new THREE.Group(); db.position.y = -0.045; fore.end.add(db);
  const handle = cyl(0.016, 0.17, M.steel); handle.rotation.z = Math.PI / 2; db.add(handle);
  [-1, 1].forEach(k => {
    const p = cyl(0.068, 0.045, M.plate); p.rotation.z = Math.PI / 2; p.position.x = 0.1 * k; db.add(p);
    const c = cyl(0.02, 0.05, M.steel); c.rotation.z = Math.PI / 2; c.position.x = 0.1 * k; db.add(c);
  });
  shoulders.push({ s, sh });
  handWorld.push(fore.end);
});

/* trapézio: superior (2 feixes pescoço → acrômio) + médio */
const trapU = [1, -1].map(s => { const m = sphere(1, M.trap); m.castShadow = false; torso.add(m); return { s, m }; });
const trapM = ellipsoid(0.022, 0.11, 0.075, M.trap2); trapM.position.set(-0.098, 0.44, 0); trapM.castShadow = false; torso.add(trapM);
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
  const hip = new THREE.Group(); hip.position.set(0, -0.04, 0.095 * s); pelvis.add(hip);
  const thigh = limb(hip, 0.45, 0.072, -10 * D2R, 0.05);
  const shin = limb(thigh.end, 0.45, 0.052, 15 * D2R, 0.036);
  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.06, 0.09, 3, 0.025), M.joint); shade(foot);
  const fg = new THREE.Group(); fg.rotation.z = -5 * D2R; shin.end.add(fg);
  foot.position.set(0.06, -0.012, 0); fg.add(foot);
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
    const a = new THREE.Vector3(-0.035, 0.6, 0.02 * o.s);
    const b = new THREE.Vector3(-0.03, y + 0.035, 0.17 * o.s);
    placeBetween(o.m, a, b, 0.032 + 0.012 * e, 0.042 + 0.01 * e);
  });
  const pulse = e > 0.99 ? 0.12 * (0.5 + 0.5 * Math.sin(t * 7)) : 0;
  M.trap.emissiveIntensity = 0.12 + 0.75 * e + pulse;
  M.trap2.emissiveIntensity = 0.04 + 0.2 * e;
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
