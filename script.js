/* ═══════════════════════════════════════════════
   CelebiBots — Interactive Scripts
   ═══════════════════════════════════════════════ */

// ── Progress Bar ──────────────────────────────
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

// ── Cursor Glow ────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ── Navigation ─────────────────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll Animations (Intersection Observer) ──
const animatedElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => observer.observe(el));

// ── Counter Animation ──────────────────────────
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();
  
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * ease);
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

// ── Hero Canvas (Particle Grid) ────────────────
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasMouseX = 0, canvasMouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  const spacing = 80;
  const cols = Math.ceil(canvas.width / spacing) + 1;
  const rows = Math.ceil(canvas.height / spacing) + 1;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles.push({
        x: i * spacing,
        y: j * spacing,
        baseX: i * spacing,
        baseY: j * spacing,
        size: 1.2,
        opacity: 0.15 + Math.random() * 0.1,
      });
    }
  }
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  canvasMouseX = e.clientX - rect.left;
  canvasMouseY = e.clientY - rect.top;
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    const dx = canvasMouseX - p.baseX;
    const dy = canvasMouseY - p.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 200;
    
    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist;
      p.x = p.baseX - dx * force * 0.3;
      p.y = p.baseY - dy * force * 0.3;
      p.opacity = 0.15 + force * 0.6;
      p.size = 1.2 + force * 2;
    } else {
      p.x += (p.baseX - p.x) * 0.05;
      p.y += (p.baseY - p.y) * 0.05;
      p.opacity += (0.15 - p.opacity) * 0.05;
      p.size += (1.2 - p.size) * 0.05;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
    ctx.fill();
  });
  
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 100) {
        const opacity = ((100 - dist) / 100) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener('resize', resizeCanvas);

// ── Terminal Typing Effect ─────────────────────
const terminalBody = document.getElementById('terminalBody');
const terminalCmd = document.getElementById('terminalCmd');

const terminalSequence = [
  {
    cmd: 'celebibots deploy --service telegram-bot --model gpt-4',
    output: [
      { text: '✓ Initializing project structure...', cls: 'success' },
      { text: '✓ Installing dependencies (aiogram, openai, fastapi)', cls: 'success' },
      { text: '✓ Configuring webhook endpoint', cls: 'success' },
      { text: '✓ Running test suite — 24/24 passed', cls: 'success' },
      { text: 'ℹ Deploying to production server...', cls: 'info' },
      { text: '✓ Bot @your_bot is live! Serving 0 → ∞ users', cls: 'success' },
    ]
  },
  {
    cmd: 'celebibots setup --local-ai --gpu rtx3060 --model deepseek-r1',
    output: [
      { text: '✓ Detecting GPU: NVIDIA RTX 3060 (12GB VRAM)', cls: 'success' },
      { text: '✓ Installing Ollama runtime', cls: 'success' },
      { text: '✓ Pulling deepseek-r1:8b (4.7 GB)', cls: 'success' },
      { text: '✓ Configuring Open WebUI dashboard', cls: 'success' },
      { text: '✓ RAG pipeline initialized (ChromaDB + LangChain)', cls: 'success' },
      { text: 'ℹ WebUI available at http://localhost:3000', cls: 'info' },
      { text: '✓ Local AI stack ready — your data stays yours 🔒', cls: 'success' },
    ]
  },
  {
    cmd: 'celebibots automate --workflow lead-gen --triggers email,webhook',
    output: [
      { text: '✓ Workflow engine initialized', cls: 'success' },
      { text: '✓ Email trigger configured (IMAP polling)', cls: 'success' },
      { text: '✓ Webhook endpoint: /api/v1/trigger/lead-gen', cls: 'success' },
      { text: '✓ AI classifier loaded (intent detection + routing)', cls: 'success' },
      { text: '✓ CRM integration active (HubSpot API)', cls: 'success' },
      { text: '✓ Automation running — saving you 20h/week ⚡', cls: 'success' },
    ]
  }
];

let seqIndex = 0;
let charIndex = 0;
let isTypingCmd = true;
let outputIndex = 0;
let terminalStarted = false;

const terminalObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !terminalStarted) {
    terminalStarted = true;
    typeTerminal();
  }
}, { threshold: 0.3 });

terminalObserver.observe(document.querySelector('.terminal'));

function typeTerminal() {
  const seq = terminalSequence[seqIndex];
  
  if (isTypingCmd) {
    if (charIndex < seq.cmd.length) {
      terminalCmd.textContent += seq.cmd[charIndex];
      charIndex++;
      setTimeout(typeTerminal, 20 + Math.random() * 30);
    } else {
      isTypingCmd = false;
      outputIndex = 0;
      // Hide cursor during output
      document.querySelector('.cursor').style.display = 'none';
      setTimeout(typeTerminal, 400);
    }
  } else {
    if (outputIndex < seq.output.length) {
      const line = seq.output[outputIndex];
      const div = document.createElement('div');
      div.className = 'terminal-output';
      div.innerHTML = `<span class="${line.cls}">${line.text}</span>`;
      terminalBody.appendChild(div);
      outputIndex++;
      setTimeout(typeTerminal, 150 + Math.random() * 100);
    } else {
      // Next sequence
      seqIndex = (seqIndex + 1) % terminalSequence.length;
      setTimeout(() => {
        // Clear and reset
        while (terminalBody.children.length > 1) {
          terminalBody.removeChild(terminalBody.lastChild);
        }
        terminalCmd.textContent = '';
        charIndex = 0;
        isTypingCmd = true;
        document.querySelector('.cursor').style.display = '';
        typeTerminal();
      }, 3000);
    }
  }
}

// ── FAQ Accordion ──────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    
    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ── 3D Card Tilt Effect ────────────────────────
document.querySelectorAll('.service-card, .pricing-card, .proof-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.1s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// ── Smooth scroll for anchor links ─────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
