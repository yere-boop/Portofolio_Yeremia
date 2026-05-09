// ===== PAGE LOADER =====
document.body.classList.add('loading');
const loaderProgress = document.getElementById('loaderProgress');
const pageLoader = document.getElementById('pageLoader');

let loadPercent = 0;
const loaderInterval = setInterval(() => {
  loadPercent += Math.random() * 15 + 5;
  if (loadPercent > 100) loadPercent = 100;
  loaderProgress.style.width = loadPercent + '%';
  if (loadPercent >= 100) {
    clearInterval(loaderInterval);
    setTimeout(() => {
      pageLoader.classList.add('hidden');
      document.body.classList.remove('loading');
    }, 400);
  }
}, 200);

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => { 
  mouse.x = e.x; mouse.y = e.y;
  updateCursor(e);
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

function updateCursor(e) {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  setTimeout(() => {
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  }, 50);
}

document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.baseOpacity = Math.random() * 0.25 + 0.03;
    this.opacity = this.baseOpacity;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.glowSize = this.size * (2 + Math.random() * 2);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
    // Twinkling
    this.twinklePhase += this.twinkleSpeed;
    this.opacity = this.baseOpacity + Math.sin(this.twinklePhase) * this.baseOpacity * 0.5;
    // Mouse repel
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= dx * 0.008;
        this.y -= dy * 0.008;
      }
    }
  }
  draw() {
    // Soft glow
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowSize);
    gradient.addColorStop(0, `rgba(167, 139, 250, ${this.opacity})`);
    gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
    ctx.fill();
    // Core dot
    ctx.fillStyle = `rgba(200, 180, 255, ${this.opacity * 1.5})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.025 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.3;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== TYPING EFFECT =====
const typingEl = document.getElementById('typing-text');
const phrases = [
  'Web Developer',
  'Sports Enthusiast',
  'Lifelong Learner',
  'Problem Solver',
  'Tech Explorer'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  typingEl.textContent = isDeleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);

  let speed = isDeleting ? 40 : 80;
  if (!isDeleting && charIdx > current.length) { speed = 2000; isDeleting = true; }
  if (isDeleting && charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 400; }
  setTimeout(typeEffect, speed);
}
typeEffect();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section, .hero');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 200;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
          current += step;
          if (current < target) { counter.textContent = Math.ceil(current); requestAnimationFrame(update); }
          else counter.textContent = target;
        };
        update();
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => counterObserver.observe(el));

// ===== BACK TO TOP =====
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const btnText = btn.querySelector('span');
  const originalText = btnText.textContent;

  // Form Data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Feedback state
  btnText.textContent = 'Sending to Email...';
  btn.style.opacity = '0.7';
  btn.style.pointerEvents = 'none';

  const formData = new FormData(e.target);

  try {
    // 1. Send to Email (Formspree)
    const response = await fetch(e.target.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      btnText.textContent = 'Opening WhatsApp...';
      btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';

      // 2. Prepare WhatsApp Message
      const waNumber = "6283137435063";
      const waMessage = `*Halo Yeremia! Ada pesan baru dari Portfolio*%0A%0A` +
                        `*Nama:* ${name}%0A` +
                        `*Email:* ${email}%0A` +
                        `*Subjek:* ${subject}%0A` +
                        `*Pesan:* ${message}`;
      const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

      // Open WA in new tab
      window.open(waUrl, '_blank');
      
      e.target.reset();
      btnText.textContent = 'Sent Successfully! ✓';
    } else {
      throw new Error();
    }
  } catch (error) {
    btnText.textContent = 'Error! Try Again';
    btn.style.background = '#ef4444';
  } finally {
    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.style.background = '';
    }, 4000);
  }
});
