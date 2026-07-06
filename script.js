const API = window.location.origin;

// ── PARTICLES ─────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({length: 80}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.2,
  vy: (Math.random() - 0.5) * 0.2,
  size: Math.random() * 1.2 + 0.3,
  opacity: Math.random() * 0.25 + 0.05,
  color: Math.random() > 0.5 ? '124,58,237' : '167,139,250'
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
  particles.forEach((a, i) => {
    particles.slice(i+1).forEach(b => {
      const d = Math.hypot(a.x-b.x, a.y-b.y);
      if (d < 100) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(124,58,237,${0.08*(1-d/100)})`;
        ctx.lineWidth = 0.4; ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAVBAR ────────────────────────────────
window.addEventListener('scroll', () => document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20));
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// ── SCROLL ANIMATIONS ─────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// ── PROJECTS ──────────────────────────────
const icons = ['⚡','🛰️','🔬','🌐','🎯','🚀'];
const grads = [
  'linear-gradient(135deg,#1a0a2e,#3b1873,#7c3aed)',
  'linear-gradient(135deg,#0f1f4a,#1d4ed8,#3b82f6)',
  'linear-gradient(135deg,#1a0a0a,#7f1d1d,#ef4444)',
  'linear-gradient(135deg,#052e16,#15803d,#22c55e)',
  'linear-gradient(135deg,#1a0f00,#92400e,#f59e0b)',
  'linear-gradient(135deg,#082f3f,#0e7490,#06b6d4)'
];

const fallbackProjects = [
  { title: "My Portfolio", description: "A full-stack personal portfolio built with Node.js, Express, MongoDB and vanilla JS. Deployed live on Render.", tags: ["Node.js","MongoDB","CSS"], liveUrl: "https://my-portfolio-uwn2.onrender.com", githubUrl: "https://github.com/RiyashDebbarma/my-portfolio" },
  { title: "Accident Identification System", description: "Real-time vehicle accident detection using ADXL335 accelerometer, GPS NEO-6M and SIM800L GSM module. Sends SMS alert with GPS location to emergency contacts.", tags: ["Arduino","GPS","GSM","IoT","C++"], liveUrl: "#", githubUrl: "https://github.com/RiyashDebbarma/Accident-Identification-ECE-Project" }
];

function createCard(p, i) {
  const tags = (p.tags||[]).map(t => `<span class="proj-tag">${t}</span>`).join('');
  const initials = p.title.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const data = encodeURIComponent(JSON.stringify(p));
  return `
    <div class="proj-card-new reveal">
      <div class="proj-thumb" style="background:${grads[i%grads.length]}">${initials}</div>
      <div class="proj-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="proj-tags">${tags}</div>
        <div class="proj-actions">
          <button class="proj-view-btn" onclick="openProject('${data}',${i})">View Details</button>
          <a href="${p.liveUrl||'#'}" target="_blank" class="proj-icon-btn" title="Live">🔗</a>
          <a href="${p.githubUrl||'#'}" target="_blank" class="proj-icon-btn" title="GitHub">🐙</a>
        </div>
      </div>
    </div>`;
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.length
    ? projects.map((p,i) => createCard(p,i)).join('')
    : '<p style="text-align:center;color:#1e293b;padding:40px;grid-column:1/-1;">No projects yet.</p>';
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = `<div style="grid-column:1/-1;padding:60px;text-align:center;color:#1e293b;"><div class="spinner"></div><p style="margin-top:12px;">Loading projects...</p></div>`;
  try {
    const res = await fetch(`${API}/api/projects`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderProjects(data.data.length ? data.data : fallbackProjects);
  } catch { renderProjects(fallbackProjects); }
}
loadProjects();

// ── OVERLAY ───────────────────────────────
window.openProject = function(data, i) {
  const p = JSON.parse(decodeURIComponent(data));
  document.getElementById('proj-detail-header').style.background = grads[i % grads.length];
  document.getElementById('detail-num').textContent   = String(i+1).padStart(2,'0');
  document.getElementById('detail-icon').textContent  = icons[i % icons.length];
  document.getElementById('detail-title').textContent = p.title;
  document.getElementById('detail-desc').textContent  = p.description;
  document.getElementById('detail-tags').innerHTML    = (p.tags||[]).map(t=>`<span class="proj-detail-tag">${t}</span>`).join('');
  document.getElementById('detail-live').href   = p.liveUrl   || '#';
  document.getElementById('detail-github').href = p.githubUrl || '#';
  document.getElementById('proj-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
};

function closeOverlay() {
  document.getElementById('proj-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('proj-close').addEventListener('click', closeOverlay);
document.getElementById('proj-overlay-bg').addEventListener('click', closeOverlay);
document.addEventListener('keydown', e => { if(e.key==='Escape') closeOverlay(); });

// ── CONTACT FORM ──────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  if (!name||!email||!message) { status.style.color='#f87171'; status.textContent='Please fill in all fields.'; return; }
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...'; btn.disabled = true;
  try {
    const res = await fetch(`${API}/api/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,message}) });
    const result = await res.json();
    if (res.ok) { status.style.color='#4ade80'; status.textContent='Message sent successfully!'; form.reset(); }
    else throw new Error(result.message);
  } catch(err) { status.style.color='#f87171'; status.textContent=err.message||'Could not send. Try again.'; }
  finally { btn.textContent='Send Message'; btn.disabled=false; }
});