// ---------------- YEAR ----------------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------------- PROJECT DATA ----------------
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
};

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
  "Konas Client": "https://www.youtube.com/watch?v=FD0F51P7YoU",
  "Rusherhack": "https://www.youtube.com/watch?v=Dg1BoHX7bJo",
  "Abyss Client": "https://www.youtube.com/watch?v=BPdKZyQE3AE"
};

// ---------------- BUILD UI ----------------
const list = document.getElementById('projects-list');
const codeLinks = document.getElementById('code-links');

projects.forEach(name => {
  const li = document.createElement('li');
  const left = document.createElement('div');

  const role = projectRoles[name] || "contributor";
  left.innerHTML = `<strong>${name}</strong><div class="meta">${role}</div>`;

  const btn = document.createElement('button');
  const link = projectLinks[name];

  if (link) {
    btn.textContent = 'open';
    btn.onclick = () => window.open(link, '_blank', 'noopener');
  } else {
    btn.textContent = 'no link';
    btn.onclick = () => openModal(`<p>No public link for <strong>${name}</strong>.</p>`);
  }

  li.append(left, btn);
  list.appendChild(li);

  const a = document.createElement('a');
  a.textContent = name.replace(/ \(.+?\)/,'');
  if (link) {
    a.href = link;
    a.target = '_blank';
  } else {
    a.href = '#';
    a.onclick = e => { e.preventDefault(); openModal(`<p>No public link for <strong>${name}</strong>.</p>`); };
  }
  codeLinks.appendChild(a);
});

// ---------------- MODAL ----------------
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(html){
  modalContent.innerHTML = html;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
}
modalClose.onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };

// ---------------- ASCII CANVAS ----------------
const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');

function resize(){
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.font = '14px monospace';
}
window.addEventListener('resize', resize);
resize();

function tick(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if (started) requestAnimationFrame(tick);
}

// ---------------- CLICK TO ENTER ----------------
const overlay = document.getElementById('enter-overlay');
const music = document.getElementById('bg-music');
let started = false;

function enterSite(){
  if (started) return;
  started = true;

  overlay.classList.add('hidden');
  document.getElementById('page').removeAttribute('aria-hidden');

  music.volume = 0.6;
  music.play().catch(()=>{});

  requestAnimationFrame(tick);
}

overlay.addEventListener('click', enterSite);
overlay.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') enterSite();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
