// script.js
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

// map with optional urls (fill real links as you want)
const projectLinks = {
  "Konas Client": "https://www.youtube.com/watch?v=FD0F51P7YoU",
  "Rusherhack": "https://www.youtube.com/watch?v=Dg1BoHX7bJo",
  "Abyss Client": "https://www.youtube.com/watch?v=BPdKZyQE3AE",
  // add other links here:
  // "Run Hide Fight": "https://example.com"
};

document.getElementById('year').textContent = new Date().getFullYear();

// populate the contributions list & quick-code links display
const list = document.getElementById('projects-list');
const codeLinks = document.getElementById('code-links');

projects.forEach(name => {
  // list entry
  const li = document.createElement('li');
  const left = document.createElement('div');
  left.innerHTML = `<strong>${name}</strong><div class="meta">contributor</div>`;
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

// ----------------------------- ASCII Galaxy animation (updated) -----------------------------
// Place your galaxy image at: /assets/galaxy.png (or change below)
const GALAXY_PATH = "assets/galaxy.png";

const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let DPR = Math.max(1, window.devicePixelRatio || 1);

function resize() {
  DPR = Math.max(1, window.devicePixelRatio || 1);
  // keep canvas CSS size but update drawing buffer
  canvas.width = Math.floor(canvas.clientWidth * DPR);
  canvas.height = Math.floor(canvas.clientHeight * DPR);
  // keep drawing coordinates in CSS pixels
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', () => {
  resize();
  recomputeGrid();
});
resize();

// ASCII charset: prioritize digits/symbols for matrix-y feel (dark->bright)
const CHARSET = "01@#%&$9876543210*+=-:. ";

// configuration — tweak for look/perf
const CONFIG = {
  targetCols: 140,              // target sampling columns across canvas
  rotationSpeed: 0.03,          // radians per second
  brightnessGamma: 1.0,         // >1 darkens midtones
  sparkleChance: 0.008,         // chance per cell to be a bright star
  cellPadding: 0.0,             // padding inside each character cell (0-0.5)
  matrixTint: { r: 8, gMin: 50, gMax: 255, b: 10 } // tonal range for green
};

// compute sampling grid & offscreen buffer
let cols = 80, rows = 40, cellW = 8, cellH = 14;
let sampleCanvas = document.createElement('canvas');
let sampleCtx = sampleCanvas.getContext('2d');
let fontSize = 12;

function recomputeGrid() {
  // derive columns from canvas width, constrained by target
  const cssW = canvas.clientWidth || 800;
  const cssH = canvas.clientHeight || 420;
  cols = Math.max(40, Math.min(CONFIG.targetCols, Math.floor(cssW / 6)));
  // keep character aspect ratio roughly monospace-ish
  cellW = cssW / cols;
  // pick cell height to match monospace characters visually
  fontSize = Math.max(8, Math.floor(cellW * 1.2)); // px
  cellH = Math.max(10, Math.floor(fontSize * 1.15));
  rows = Math.max(12, Math.floor(cssH / cellH));

  // set offscreen sample canvas to cols x rows (1:1 sampling grid)
  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  sampleCtx.imageSmoothingEnabled = true;
  sampleCtx.imageSmoothingQuality = "high";

  // set main canvas font for drawing characters (CSS pixels)
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = "middle";
}
recomputeGrid();

// load galaxy image
const galaxyImg = new Image();
galaxyImg.src = GALAXY_PATH;
galaxyImg.crossOrigin = "anonymous"; // helpful if hosted elsewhere

// handle prefers-reduced-motion
const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducedMotion = prefersReduce.matches;
prefersReduce.addEventListener && prefersReduce.addEventListener('change', (e) => {
  reducedMotion = e.matches;
});

function sampleBrightnessAt(imgData, sx, sy) {
  // sx, sy are integer pixel positions in sampleCanvas size
  const idx = (sy * imgData.width + sx) * 4;
  const r = imgData.data[idx];
  const g = imgData.data[idx + 1];
  const b = imgData.data[idx + 2];
  // luminance
  let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // gamma correction / tweak
  lum = 255 * Math.pow(lum / 255, CONFIG.brightnessGamma);
  return lum;
}

function pickCharForBrightness(bright) {
  const t = Math.max(0, Math.min(1, bright / 255));
  const idx = Math.floor(t * (CHARSET.length - 1));
  return CHARSET[idx];
}

let lastTs = performance.now();
let angle = 0;

// animation loop
function tick(ts) {
  const dt = (ts - lastTs) / 1000;
  lastTs = ts;

  // optional: slow everything if reduced motion requested
  const speedMult = reducedMotion ? 0.04 : 1;

  if (!reducedMotion) {
    // advance rotation
    angle = (angle + CONFIG.rotationSpeed * dt * speedMult) % (Math.PI * 2);
  }

  // fade background by drawing semi-transparent rectangle (gives trails)
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // small grid overlay for Matrix vibe (low alpha)
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = '#002200';
  const gridStep = Math.max(8, Math.floor(cellW));
  for (let x = 0; x < canvas.clientWidth; x += gridStep) {
    ctx.fillRect(x, 0, 1, canvas.clientHeight);
  }
  ctx.restore();

  // if image not ready yet, draw subtle placeholder
  if (!galaxyImg.complete || galaxyImg.naturalWidth === 0) {
    drawPlaceholder();
    requestAnimationFrame(tick);
    return;
  }

  // draw rotated & scaled galaxy into the small sample canvas
  sampleCtx.clearRect(0, 0, sampleCanvas.width, sampleCanvas.height);
  // center and rotate
  sampleCtx.save();
  sampleCtx.translate(sampleCanvas.width / 2, sampleCanvas.height / 2);
  sampleCtx.rotate(angle);
  // scale image to cover sample canvas
  const scale = Math.max(sampleCanvas.width / galaxyImg.width, sampleCanvas.height / galaxyImg.height) * 1.05;
  sampleCtx.drawImage(galaxyImg, -galaxyImg.width / 2 * scale, -galaxyImg.height / 2 * scale, galaxyImg.width * scale, galaxyImg.height * scale);
  sampleCtx.restore();

  // sample pixels and draw ASCII characters to main canvas
  const imgData = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);

  // compute where to start drawing so ascii block is centered in canvas
  const totalWidth = cols * cellW;
  const totalHeight = rows * cellH;
  const startX = (canvas.clientWidth - totalWidth) / 2;
  const startY = (canvas.clientHeight - totalHeight) / 2;

  // draw each sampled cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const bright = sampleBrightnessAt(imgData, x, y);
      // occasionally add a bright sparkle
      const isSpark = (!reducedMotion && bright > 200 && Math.random() < CONFIG.sparkleChance);
      const ch = isSpark ? (Math.random() < 0.5 ? '*' : '.') : pickCharForBrightness(bright);

      // map brightness to green value for matrix look
      const gVal = Math.floor(CONFIG.matrixTint.gMin + (bright / 255) * (CONFIG.matrixTint.gMax - CONFIG.matrixTint.gMin));
      const rVal = Math.floor(CONFIG.matrixTint.r * (1 - bright / 255));
      const bVal = Math.floor(CONFIG.matrixTint.b * (1 - bright / 255));
      // alpha based on brightness (so dark areas are more transparent)
      const alpha = 0.28 + 0.72 * (bright / 255);

      // set style
      if (isSpark) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, 0.9 + Math.random()*0.1)})`;
      } else {
        ctx.fillStyle = `rgba(${rVal}, ${gVal}, ${bVal}, ${alpha})`;
      }

      // jitter for a little life
      const jitterX = (Math.random() - 0.5) * 0.6;
      const jitterY = (Math.random() - 0.5) * 0.6;

      // compute draw position (centered vertically in cell)
      const dx = startX + x * cellW + cellW * (0.5 - CONFIG.cellPadding) + jitterX;
      const dy = startY + y * cellH + cellH * 0.5 + jitterY;

      // optionally draw larger for bright spots
      const scaleFactor = 1 + (bright / 255) * 0.35;
      ctx.save();
      ctx.translate(dx, dy);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    }
  }

  // occasional comet: draw a brighter streak that rotates differently
  if (!reducedMotion && Math.random() < 0.006) {
    drawComet(angle + (Math.random() - 0.5));
  }

  requestAnimationFrame(tick);
}

function drawComet(baseAngle) {
  const len = Math.floor(Math.min(rows, cols) * (0.06 + Math.random() * 0.12));
  const midX = canvas.clientWidth / 2;
  const midY = canvas.clientHeight / 2;
  const radius = Math.max(canvas.clientWidth, canvas.clientHeight) * (0.22 + Math.random() * 0.4);
  const startX = midX + Math.cos(baseAngle) * radius;
  const startY = midY + Math.sin(baseAngle) * radius;
  ctx.save();
  ctx.strokeStyle = "rgba(180,255,200,0.9)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (let i = 1; i <= len; i++) {
    const t = i / len;
    ctx.lineTo(startX + Math.cos(baseAngle + t * 0.6) * (radius * (t * 0.15)), startY + Math.sin(baseAngle + t * 0.6) * (radius * (t * 0.15)));
  }
  ctx.stroke();
  ctx.restore();
}

function drawPlaceholder() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.fillStyle = "#003300";
  ctx.font = "14px monospace";
  ctx.fillText("Loading ASCII Galaxy...", 16, 28);
}

// init loop once image loads
galaxyImg.onload = () => {
  recomputeGrid();
  lastTs = performance.now();
  requestAnimationFrame(tick);
};

// initial draw until image loads
drawPlaceholder();

// fallback static pattern for reduced-motion users
if (reducedMotion) {
  // draw single non-animated ASCII rendering
  galaxyImg.onload = () => {
    // draw a single frame without rotation
    angle = 0;
    // force a single tick render
    lastTs = performance.now();
    tick(lastTs);
  };
}

// Accessibility: Esc closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Expose some knobs for debugging from console (optional)
window.__asciiGalaxy = {
  config: CONFIG,
  recomputeGrid,
  redrawNow: () => { lastTs = performance.now(); tick(lastTs); }
};
