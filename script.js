// script.js (fixed + click-to-enter + music)
// script.js (UPDATED — roles + links filled where available)
const projects = [
  "Run Hide Fight",
  "TDS: Legacy",
  "Slap Battles TD",
  "Stands Awakening (BOSS STUDIO)",
  "Doomspire Defense",
  "Dat Hood",
  "Block Tales Tower Defense",
  "Super Power League",
  "Forsaken Tower Defense",
  "Auruzz RNG (Huzz RNG)",
  "A Bizarre Day Modded",
  "Old A Bizarre Day",
  "Reborn As Swordsman",
  "Shuriken Simulator",
  "Critical Tower Defense",
  "Abyss Client",
  "Future Client",
  "Rusherhack",
  "Konas Client"
];

// role map — if not listed here, the UI will show "contributor"
const projectRoles = {
  "Run Hide Fight": "Programmer",
  "TDS: Legacy": "Co-Lead Developer",
  "Slap Battles TD": "Programmer",
  "Doomspire Defense": "Programmer",
  "Dat Hood": "Co-Owner",
  "Block Tales Tower Defense": "Programmer",
  "Super Power League": "Programmer",
  "Forsaken Tower Defense": "Programmer",
  "Auruzz RNG (Huzz RNG)": "Programmer",
  "Abyss Client": "Founder"
  // anything else omitted => contributor
};

// map with optional urls (filled from your provided links)
const projectLinks = {
  "Run Hide Fight": "https://www.roblox.com/games/135406051460913/Run-Hide-Fight",
  "TDS: Legacy": "https://www.roblox.com/games/13030221735/TDS-Legacy",
  "Slap Battles TD": "https://www.roblox.com/games/15076947052/Slap-Battles-Tower-Defense",
  "Stands Awakening (BOSS STUDIO)": "https://www.roblox.com/games/5780309044/2X-SPAWNS-STW-Stands-Awakening",
  "Doomspire Defense": "https://www.roblox.com/games/15549445942/Doomspire-Defense",
  "Dat Hood": "https://www.roblox.com/games/10968324786/Content-Deleted",
  "Block Tales Tower Defense": "https://www.roblox.com/games/88234448252894/Data-Restoring-Place",
  "Super Power League": "https://www.roblox.com/games/137681066791460/UPD-OUT-Super-Power-Training-League",
  "Forsaken Tower Defense": "https://www.roblox.com/games/101266069969046/Forsaken-Tower-Defense",
  "Auruzz RNG (Huzz RNG)": "https://www.roblox.com/games/75852144330025/Huzz-RNG",
  "A Bizarre Day Modded": "https://www.roblox.com/games/10797684515/5x-HUGE-UPDATE-A-Bizarre-Day-Modded",
  "Old A Bizarre Day": "https://www.roblox.com/games/6206310576/KQ-CD-REWORK-Old-A-Bizarre-Day",
  "Reborn As Swordsman": "https://www.roblox.com/games/16981421605/Reborn-As-Swordsman",
  "Critical Tower Defense": "https://www.roblox.com/games/5543622168/Critical-Tower-Defense",
  // external videos / clients you included earlier
  "Konas Client": "https://www.youtube.com/watch?v=FD0F51P7YoU",
  "Rusherhack": "https://www.youtube.com/watch?v=Dg1BoHX7bJo",
  "Abyss Client": "https://www.youtube.com/watch?v=BPdKZyQE3AE"
  // "Future Client" and "Shuriken Simulator" etc — no public link provided so they'll show "no link"
};

document.getElementById('year').textContent = new Date().getFullYear();

// populate the contributions list & quick-code links display
const list = document.getElementById('projects-list');
const codeLinks = document.getElementById('code-links');

projects.forEach(name => {
  // list entry
  const li = document.createElement('li');
  const left = document.createElement('div');

  const role = projectRoles[name] || "contributor";
  left.innerHTML = `<strong>${name}</strong><div class="meta">${role}</div>`;

  const btn = document.createElement('button');

  // if we have a link, open it; otherwise modal with placeholder
  const link = projectLinks[name];
  if (link) {
    btn.innerText = 'open';
    btn.onclick = () => window.open(link, '_blank', 'noopener');
  } else {
    btn.innerText = 'no link';
    btn.onclick = () => openModal(`<p>No public link set for <strong>${name}</strong>. Add it to <code>script.js</code> → <code>projectLinks</code>.</p>`);
  }

  li.appendChild(left);
  li.appendChild(btn);
  list.appendChild(li);

  // quick code links (for header)
  const a = document.createElement('a');
  a.href = link || '#';
  a.innerText = name.replace(/ \(.+?\)/,''); // shorten display
  if (link) a.target = '_blank';
  a.onclick = (e) => {
    if (!link) {
      e.preventDefault();
      openModal(`<p>No public link set for <strong>${name}</strong>.</p>`);
    }
  };
  codeLinks.appendChild(a);
});

// Modal functions
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(html) {
  modalContent.innerHTML = html;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
modalClose.onclick = closeModal;
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// ----------------------------- ASCII Galaxy animation -----------------------------
const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let DPR = Math.max(1, window.devicePixelRatio || 1);
function resize() {
  DPR = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(canvas.clientWidth * DPR);
  canvas.height = Math.floor(canvas.clientHeight * DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  // set font based on size
  ctx.font = `${Math.max(10, Math.floor(canvas.clientWidth / 40))}px "Courier New", monospace`;
}
window.addEventListener('resize', resize);
resize();

const charSet = "%&$#@*+.:,;=<>/\\|abcdefghijklmnopqrstuvwxyz0123456789";
function randChar(){ return charSet[Math.floor(Math.random()*charSet.length)]; }

class Star {
  constructor(cx, cy, maxR) {
    this.cx = cx; this.cy = cy; this.maxR = maxR;
    this.reset(true);
  }
  reset(init=false){
    this.angle = Math.random()*Math.PI*2;
    this.r = init ? Math.random()*this.maxR*0.2 : 2 + Math.random()*12;
    this.speed = 0.1 + Math.random()*0.9;
    this.char = randChar();
    this.size = 8 + Math.random()*18;
    this.hue = 110 + Math.random()*60; // greenish
    this.twist = (Math.random()-0.5)*0.02;
  }
  update() {
    // rotate slowly and move outward for starfield swirl
    this.angle += this.twist;
    this.r += this.speed;
    if (this.r > this.maxR) {
      this.reset(false);
    }
    this.x = this.cx + this.r * Math.cos(this.angle);
    this.y = this.cy + this.r * Math.sin(this.angle);
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    // size and alpha depend on distance
    const t = Math.min(1, this.r / Math.max(1,this.maxR));
    ctx.globalAlpha = 0.35 + 0.65*(1 - t);
    ctx.fillStyle = `hsl(${this.hue} 100% ${30 + 50*(1-t)}%)`;
    ctx.shadowColor = `hsl(${this.hue} 100% 60%)`;
    ctx.shadowBlur = 8;
    ctx.font = `${Math.max(8, Math.floor(this.size*(1 - t*0.6)))}px monospace`;
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
  }
}

let stars = [];
function initStars() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const area = w * h;
  const target = Math.max(60, Math.min(900, Math.floor(area / 2500))); // density tuned for perf
  const cx = w/2, cy = h/2;
  const maxR = Math.max(w,h) * 0.7;

  stars = [];
  for (let i=0;i<target;i++){
    stars.push(new Star(cx, cy, maxR));
  }
}
initStars();
window.addEventListener('resize', initStars);

// animation loop
let last = performance.now();
function tick(now){
  const dt = now - last;
  last = now;
  // fade background for trailing effect
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);

  // subtle grid/overlay for matrix vibe
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#002200';
  const step = 18;
  for (let x=0;x<canvas.clientWidth;x+=step){
    ctx.fillRect(x, 0, 1, canvas.clientHeight);
  }
  ctx.restore();

  for (let s of stars) {
    s.update(dt);
    s.draw(ctx);
  }

  // occasionally spawn a bright comet
  if (Math.random() < 0.01) {
    const i = Math.floor(Math.random()*stars.length);
    stars[i].char = ['*','@','$','%'][Math.floor(Math.random()*4)];
    stars[i].speed *= 2.2;
    stars[i].size *= 1.6;
  }

  requestAnimationFrame(tick);
}

// fallback for users who prefer reduced motion
const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function drawStatic(){
  ctx.fillStyle = "#000";
  ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);
  ctx.fillStyle = "#003300";
  ctx.font = "12px monospace";
  const cols = Math.floor(canvas.clientWidth/9);
  const rows = Math.floor(canvas.clientHeight/14);
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (Math.random()>0.96) ctx.fillText(randChar(), c*9 + 4, r*14 + 10);
    }
  }
}

// ------------------ click-to-enter gate & audio ------------------
const overlay = document.getElementById('enter-overlay');
const music = document.getElementById('bg-music');
let started = false;

function enterSite() {
  if (started) return;
  started = true;

  // hide overlay and make page accessible
  overlay.classList.add('hidden');
  document.getElementById('page').removeAttribute('aria-hidden');

  // attempt to play music (must be triggered by click or keyboard event)
  if (music) {
    music.volume = 0.6;
    music.play().catch((err) => {
      // ignore — browsers may block if not allowed; user can hit play from controls if you expose them later
      console.warn('Music playback failed:', err);
    });
  }

  // start animation unless user prefers reduced motion
  if (!prefersReduce.matches) {
    // reset timing
    last = performance.now();
    requestAnimationFrame(tick);
  } else {
    drawStatic();
  }
}

// click and keyboard (Enter/Space) support for accessibility
overlay.addEventListener('click', enterSite);
overlay.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    enterSite();
  }
});

// Accessibility improvements: keyboard close for modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
