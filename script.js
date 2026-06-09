// ── NAVBAR SHADOW ON SCROLL ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MOBILE HAMBURGER MENU ────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── LOAD PROJECTS FROM API ───────────────────
const API = window.location.origin;

// Fallback projects shown if the API is unreachable
const fallbackProjects = [
  {
    title: "Project One",
    description: "A full-stack web app built with Node.js, Express, and MongoDB.",
    tags: ["Node.js", "MongoDB", "Express"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Project Two",
    description: "A responsive portfolio website built with HTML, CSS, and JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Project Three",
    description: "A REST API for a task manager app with JWT authentication.",
    tags: ["Node.js", "JWT", "REST API"],
    liveUrl: "#",
    githubUrl: "#"
  }
];

// Builds one project card and returns it as HTML string
function createProjectCard(project) {
  // Pick a tag color based on index
  const tagColors = ['tag-blue', 'tag-green', 'tag-purple', 'tag-amber'];

  const tagsHTML = (project.tags || [])
    .map((tag, i) => `<span class="tag ${tagColors[i % tagColors.length]}">${tag}</span>`)
    .join('');

  // Get initials from title for the card image placeholder
  const initials = project.title
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return `
    <div class="project-card">
      <div class="project-img">${initials}</div>
      <div class="project-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${tagsHTML}</div>
        <div class="project-links">
          <a href="${project.liveUrl || '#'}" target="_blank" class="btn btn-sm">Live Demo</a>
          <a href="${project.githubUrl || '#'}" target="_blank" class="btn btn-sm btn-outline">GitHub</a>
        </div>
      </div>
    </div>
  `;
}

// Renders an array of projects into the grid
function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects || projects.length === 0) {
    grid.innerHTML = '<p style="text-align:center; color:#888;">No projects yet.</p>';
    return;
  }
  grid.innerHTML = projects.map(createProjectCard).join('');
}

// Shows a loading spinner while fetching
function showLoading() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:40px; color:#888;">
      <div class="spinner"></div>
      <p style="margin-top:12px;">Loading projects...</p>
    </div>
  `;
}

// Fetches projects from the backend API
async function loadProjects() {
  showLoading();
  try {
    const response = await fetch(`${API}/api/projects`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    renderProjects(result.data);

  } catch (error) {
    console.warn('API unreachable, showing fallback projects:', error.message);
    // If server is off or MongoDB not connected, show fallback data
    renderProjects(fallbackProjects);
  }
}

// Run when page loads
loadProjects();

// ── CONTACT FORM ─────────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    status.style.color = '#ef4444';
    status.textContent = 'Please fill in all fields.';
    return;
  }

  // Change button text while sending
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (response.ok) {
      status.style.color = '#22c55e';
      status.textContent = result.message || 'Message sent successfully!';
      form.reset();
    } else {
      throw new Error(result.message || 'Something went wrong');
    }

  } catch (error) {
    status.style.color = '#ef4444';
    status.textContent = error.message || 'Could not send message. Try again later.';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }
});