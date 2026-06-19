// Gemeinsames Verhalten der gesamten Website:
//  - Header- und Footer-Partials laden und einsetzen
//  - aktiven Menüpunkt anhand der URL markieren
//  - mobiles Menü (Burger) schalten
//  - Demo-Handling des Kontaktformulars
//  - Animationen: Scroll-Reveal, Count-up der Kennzahlen, Header-Schatten
//
// Hinweis: Die Partials werden per fetch() geladen. Das funktioniert nur über
// einen Webserver (Live Server / Hosting), nicht per Doppelklick (file://).

// Respektiert die System-Einstellung „Bewegung reduzieren" (Barrierefreiheit).
const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const PARTIALS = Object.freeze({
  'site-header': '/partials/header.html',
  'site-footer': '/partials/footer.html',
});

const FORM_DEMO_MESSAGE =
  'Danke für Ihre Anfrage! (Demo – das Formular ist noch nicht mit einem ' +
  'Versanddienst verbunden. Anleitung in der README.)';

// Lädt ein Partial und setzt es in das Element mit der übergebenen ID ein.
async function injectPartial(mountId, url) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} für ${url}`);
    }
    mount.innerHTML = await response.text();
  } catch (error) {
    console.error(`Partial konnte nicht geladen werden (${url}):`, error);
  }
}

// Markiert den zur aktuellen Seite passenden Menüpunkt mit der Klasse "active".
function setActiveNav() {
  const path = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');

  links.forEach((link) => {
    if (link.classList.contains('nav-cta')) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const isHome = href === '/' && (path === '/' || path === '/index.html');
    const isSection = href !== '/' && path.startsWith(href);

    if (isHome || isSection) {
      link.classList.add('active');
    }
  });
}

// Schaltet das mobile Menü auf/zu.
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// Klappt das Services-Untermenü auf Mobilgeräten per Tippen auf/zu.
// Auf Desktop übernimmt das CSS (:hover) – dort bleibt der Link normal klickbar.
function initDropdowns() {
  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  document.querySelectorAll('.has-dropdown > a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!isMobile()) return;
      event.preventDefault();
      link.parentElement.classList.toggle('open');
    });
  });
}

// Demo-Versand des Kontaktformulars (verhindert echtes Absenden).
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.alert(FORM_DEMO_MESSAGE);
  });
}

// Blendet Inhalte beim Scrollen sanft und gestaffelt ein.
// Die .reveal-Klasse wird hier per JS gesetzt – ohne JS bleibt alles sichtbar.
function initScrollReveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;

  const selector =
    '.section-head, .segment, .feature, .service-block, .band, .cta, .split, ' +
    '.founder, .step, .testimonial, .insight, .job, .compare, .quote-block, .logos, .legal';
  const targets = Array.from(document.querySelectorAll(selector));
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  // Kinder innerhalb von Rastern leicht versetzt einblenden (Staffel-Effekt).
  document
    .querySelectorAll('.grid-2, .grid-3, .values, .steps, .logos')
    .forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (child.classList.contains('reveal')) {
          child.style.transitionDelay = Math.min(index * 0.08, 0.4) + 's';
        }
      });
    });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}

// Zählt eine Kennzahl von 0 auf ihren Zielwert hoch (Prefix/Suffix bleiben erhalten).
function countUp(el) {
  const parts = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/);
  if (!parts) return;

  const [, prefix, digits, suffix] = parts;
  const target = parseInt(digits, 10);
  if (!target) return;

  const duration = 1100;
  let startTime;

  const tick = (now) => {
    if (!startTime) startTime = now;
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  el.textContent = prefix + '0' + suffix;
  requestAnimationFrame(tick);
}

// Startet die Count-up-Animation, sobald die Kennzahl sichtbar wird.
function initCounters() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;

  const numbers = document.querySelectorAll(
    '.hero-meta strong, .band .stat strong, .stats .stat strong',
  );
  if (!numbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.9 },
  );

  numbers.forEach((n) => observer.observe(n));
}

// Zeichnet ein schlichtes, einliniges Concierge-Symbol (Gold) an Position (x, y).
// Größe s ≈ Radius. Bewusst reduziert, damit es bei ~12px noch erkennbar bleibt.
const CONCIERGE_ICONS = ['key', 'bell', 'envelope', 'box', 'shield', 'clock', 'door'];

function drawConciergeIcon(ctx, type, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();

  switch (type) {
    case 'key': // Schlüssel
      ctx.arc(-s * 0.45, 0, s * 0.4, 0, Math.PI * 2);
      ctx.moveTo(-s * 0.05, 0);
      ctx.lineTo(s * 0.8, 0);
      ctx.moveTo(s * 0.5, 0);
      ctx.lineTo(s * 0.5, s * 0.3);
      ctx.moveTo(s * 0.8, 0);
      ctx.lineTo(s * 0.8, s * 0.34);
      break;
    case 'bell': // Empfangsglocke
      ctx.arc(0, s * 0.25, s * 0.62, Math.PI, 0);
      ctx.moveTo(-s * 0.8, s * 0.25);
      ctx.lineTo(s * 0.8, s * 0.25);
      ctx.moveTo(0, s * 0.25 - s * 0.62);
      ctx.lineTo(0, s * 0.25 - s * 0.82);
      ctx.moveTo(s * 0.13, s * 0.25 - s * 0.92);
      ctx.arc(0, s * 0.25 - s * 0.92, s * 0.13, 0, Math.PI * 2);
      break;
    case 'envelope': // Brief
      ctx.rect(-s * 0.75, -s * 0.5, s * 1.5, s);
      ctx.moveTo(-s * 0.75, -s * 0.5);
      ctx.lineTo(0, s * 0.12);
      ctx.lineTo(s * 0.75, -s * 0.5);
      break;
    case 'box': // Paket
      ctx.rect(-s * 0.6, -s * 0.6, s * 1.2, s * 1.2);
      ctx.moveTo(0, -s * 0.6);
      ctx.lineTo(0, s * 0.6);
      ctx.moveTo(-s * 0.6, 0);
      ctx.lineTo(s * 0.6, 0);
      break;
    case 'shield': // Sicherheit
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(s * 0.7, -s * 0.45);
      ctx.lineTo(s * 0.7, s * 0.2);
      ctx.quadraticCurveTo(s * 0.7, s * 0.78, 0, s * 0.98);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.78, -s * 0.7, s * 0.2);
      ctx.lineTo(-s * 0.7, -s * 0.45);
      ctx.closePath();
      break;
    case 'clock': // Erreichbarkeit / 24-7
      ctx.arc(0, 0, s * 0.72, 0, Math.PI * 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s * 0.45);
      ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.34, s * 0.06);
      break;
    case 'door': // Empfang / Eingang
      ctx.rect(-s * 0.5, -s * 0.7, s, s * 1.4);
      ctx.moveTo(s * 0.22, s * 0.05);
      ctx.arc(s * 0.18, s * 0.05, s * 0.06, 0, Math.PI * 2);
      break;
    default:
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
  }

  ctx.stroke();
  ctx.restore();
}

// Interaktives Symbol-Netzwerk ("Verknüpfungen") im Hero – wie auf smyagency.de,
// aber zum Thema passend: feine Gold-Punkte, durchsetzt mit Concierge-Symbolen
// (Schlüssel, Empfangsglocke, Paket …). Sie schweben, verbinden sich mit Linien
// und reagieren auf die Maus. Das Canvas wird per JS in den Hero eingesetzt.
function createHeroNetwork(hero) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const GOLD = [192, 160, 98];
  const LINK_DIST = 152;   // max. Abstand für Verbindungslinien
  const MOUSE_DIST = 200;  // Reichweite des Cursors
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mouse = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let nodes = [];

  const build = () => {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    nodes = [];

    // Feine Punkte als Grundnetz
    const dotCount = clamp(Math.round((width * height) / 22000), 12, 34);
    for (let i = 0; i < dotCount; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.7,
        kind: 'dot',
      });
    }

    // Concierge-Symbole als Akzente (nur, wenn genug Platz ist)
    const iconList = width < 620 ? CONCIERGE_ICONS.slice(0, 4) : CONCIERGE_ICONS;
    iconList.forEach((icon) => {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        s: Math.random() * 3 + 9,
        kind: 'icon',
        icon,
      });
    });
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      if (mouse.active) {
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST && md > 0.5) {
          const pull = (1 - md / MOUSE_DIST) * 0.5;
          n.x += (mdx / md) * pull;
          n.y += (mdy / md) * pull;
        }
      }

      if (n.kind === 'icon') {
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = 'rgba(212, 188, 128, 0.7)';
        drawConciergeIcon(ctx, n.icon, n.x, n.y, n.s);
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(208, 182, 120, 0.85)';
        ctx.fill();
      }
    }

    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const op = (1 - dist / LINK_DIST) * 0.28;
          ctx.strokeStyle = `rgba(${GOLD[0]}, ${GOLD[1]}, ${GOLD[2]}, ${op})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      for (const n of nodes) {
        const ddx = n.x - mouse.x;
        const ddy = n.y - mouse.y;
        const dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(212, 188, 128, ${(1 - dd / MOUSE_DIST) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener('mouseleave', () => { mouse.active = false; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });

  build();
  draw();
}

// Setzt das Netzwerk in den Haupt-Hero der Seite (Start- oder Unterseiten-Hero).
function initHeroNetwork() {
  if (reducedMotion()) return;
  const hero = document.querySelector('.hero') || document.querySelector('.page-hero');
  if (hero) createHeroNetwork(hero);
}

// Magnetische Buttons: folgen leicht dem Cursor (nur auf Zeigegeräten).
function initMagneticButtons() {
  if (reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousemove', (event) => {
      const r = btn.getBoundingClientRect();
      const mx = event.clientX - r.left - r.width / 2;
      const my = event.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.22}px, ${my * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// Weicher, mausverfolgender Gold-Schein als Cursor-Begleiter.
function initCursorGlow() {
  if (reducedMotion() || !window.matchMedia('(hover: hover)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.body.classList.add('cursor-active');

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  }, { passive: true });

  const render = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();
}

// Legt beim Scrollen einen dezenten Schatten unter den (klebenden) Header.
function initHeaderShadow() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

async function init() {
  await Promise.all(
    Object.entries(PARTIALS).map(([mountId, url]) => injectPartial(mountId, url)),
  );

  // Erst nach dem Einsetzen der Partials sind Header/Footer im DOM.
  setActiveNav();
  initMobileNav();
  initDropdowns();
  initContactForm();

  // Animationen aktivieren (respektieren „Bewegung reduzieren").
  initHeaderShadow();
  initHeroNetwork();
  initMagneticButtons();
  initCursorGlow();
  initScrollReveal();
  initCounters();
}

document.addEventListener('DOMContentLoaded', init);
