const API = window.location.origin;

// ── PARTICLES ─────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '167,139,250' : '96,165,250'
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });

  // Draw connections
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAVBAR ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

// ── TYPED TEXT ────────────────────────────
const roles = [
  'Full-Stack Developer',
  'ECE Student',
  'UI/UX Enthusiast',
  'Problem Solver'
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
type();

// ── SCROLL ANIMATIONS ─────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

// ── LOAD PROJECTS ─────────────────────────
const fallbackProjects = [
  { title: "My Portfolio", description: "A full-stack personal portfolio built with Node.js, Express and MongoDB.", tags: ["HTML", "CSS", "Node.js"], liveUrl: "#", githubUrl: "#" },
  { title: "Project Two", description: "A responsive web app with modern UI and smooth animations.", tags: ["JavaScript", "CSS", "React"], liveUrl: "#", githubUrl: "#" },
  { title: "Project Three", description: "A REST API with full CRUD operations and JWT authentication.", tags: ["Node.js", "MongoDB", "Express"], liveUrl: "#", githubUrl: "#" }
];

function createProjectCard(p) {
  const colors = ['tag-blue','tag-green','tag-purple','tag-amber'];
  const tags = (p.tags||[]).map((t,i) => `<span class="tag ${colors[i%colors.length]}">${t}</span>`).join('');
  const initials = p.title.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  return `
    <div class="project-card reveal">
      <div class="project-img">${initials}</div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-links">
          <a href="${p.liveUrl||'#'}" target="_blank" class="btn btn-sm">Live Demo</a>
          <a href="${p.githubUrl||'#'}" target="_blank" class="btn btn-sm btn-outline">GitHub</a>
        </div>
      </div>
    </div>`;
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.length
    ? projects.map(createProjectCard).join('')
    : '<p style="text-align:center;color:#475569;grid-column:1/-1;">No projects yet.</p>';
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#475569;"><div class="spinner"></div><p style="margin-top:12px;">Loading projects...</p></div>`;
  try {
    const res = await fetch(`${API}/api/projects`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    renderProjects(data.data.length ? data.data : fallbackProjects);
  } catch {
    renderProjects(fallbackProjects);
  }
}
loadProjects();

// ── CONTACT FORM ──────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    status.style.color = '#f87171';
    status.textContent = 'Please fill in all fields.';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const result = await res.json();
    if (res.ok) {
      status.style.color = '#4ade80';
      status.textContent = result.message || 'Message sent!';
      form.reset();
    } else throw new Error(result.message);
  } catch (err) {
    status.style.color = '#f87171';
    status.textContent = err.message || 'Could not send. Try again.';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
});