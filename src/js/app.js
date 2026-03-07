/* ── ANIMATED GRAPH BACKGROUND ── */
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

let nodes = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 22000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1,
    });
  }
}

const GOLD_RGB = '201,151,58';
const EDGE_DIST = 160;

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Update positions
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  // Draw edges
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < EDGE_DIST) {
        const alpha = (1 - d / EDGE_DIST) * 0.5;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(${GOLD_RGB},${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GOLD_RGB},0.7)`;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

resize();
initNodes();
draw();
window.addEventListener('resize', () => { resize(); initNodes(); });


/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.tl-item, .project-card, .reveal').forEach(el => {
  observer.observe(el);
});

// Stagger project cards
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});


/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '48px';
    ring.style.height = '48px';
    ring.style.borderColor = 'rgba(201,151,58,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '28px';
    ring.style.height = '28px';
    ring.style.borderColor = 'rgba(201,151,58,0.4)';
  });
});


/* ── NAV ACTIVE STATE ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
});
