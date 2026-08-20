/**
 * NICOLAS-HYBRID-PORTFOLIO — Brand OS Client Engine
 * Smooth Navigation, Scroll Observers, NFC Simulator & Remote Diagnostics
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNfcSimulator();
  initRemoteDiagnostics();
  initScrollAnimations();
  initCookieBanner();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Interaction
   ========================================================================== */
function initNavbar() {
  const topbar = document.querySelector('.topbar');
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navList = document.getElementById('topbarNav');
  const links = document.querySelectorAll('.topbar-link');

  // Sticky Topbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      topbar?.classList.add('is-scrolled');
    } else {
      topbar?.classList.remove('is-scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile Menu
  mobileToggle?.addEventListener('click', () => {
    navList?.classList.toggle('is-open');
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      navList?.classList.remove('is-open');
    });
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navTarget = document.querySelector(`.topbar-nav a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => l.classList.remove('active'));
        navTarget?.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. NFC Interactive Simulator
   ========================================================================== */
function initNfcSimulator() {
  const touchTarget = document.getElementById('nfcTouchTarget');
  const resultDisplay = document.getElementById('nfcResultDisplay');
  const modeButtons = document.querySelectorAll('[data-nfc-mode]');
  const featureCards = document.querySelectorAll('[data-nfc-trigger]');

  if (!touchTarget || !resultDisplay) return;

  let currentMode = 'menu';

  const nfcData = {
    menu: {
      title: 'Menú Digital Gourmet Bistro',
      payload: 'https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO/demos/gastronomia/',
      tag: 'NTAG213 // 144 BYTES',
      speed: '0.18s de lectura instantánea',
      actionText: 'Abriendo comanda digital de mesa #07...'
    },
    review: {
      title: 'Google Business Reviews Boost',
      payload: 'https://g.page/r/nicolas-tech-reviews/review',
      tag: 'NTAG215 // 504 BYTES',
      speed: '0.12s a formulario 5 estrellas',
      actionText: 'Redirigiendo a calificación en Google Maps...'
    },
    vcard: {
      title: 'Tarjeta de Contacto Inteligente (vCard)',
      payload: 'BEGIN:VCARD\nVERSION:3.0\nN:Monroy;Nicolás\nTEL:+573150135016\nEND:VCARD',
      tag: 'NTAG216 // 888 BYTES',
      speed: 'Contacto guardado en libreta',
      actionText: 'Descargando tarjeta de contacto...'
    }
  };

  function setMode(modeKey) {
    currentMode = modeKey;
    modeButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-nfc-mode') === modeKey);
    });
    featureCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-nfc-trigger') === modeKey);
    });
    renderNfcOutput(false);
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.getAttribute('data-nfc-mode') || 'menu');
    });
  });

  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      setMode(card.getAttribute('data-nfc-trigger') || 'menu');
    });
  });

  touchTarget.addEventListener('click', () => {
    renderNfcOutput(true);
  });

  function renderNfcOutput(isTriggered) {
    const data = nfcData[currentMode];
    if (isTriggered) {
      if ('vibrate' in navigator) navigator.vibrate([25, 40, 25]);
      
      resultDisplay.innerHTML = `
        <div class="mono" style="color: var(--color-acid); font-weight: 700; margin-bottom: 0.4rem;">
          [✔] NFC TAG DETECTADO — ${data.tag}
        </div>
        <p style="color: var(--color-ink); margin-bottom: 0.2rem;"><strong>Destino:</strong> ${data.title}</p>
        <p class="mono" style="color: var(--color-ink-dim); font-size: 0.75rem; word-break: break-all;"><strong>Payload:</strong> ${data.payload}</p>
        <div class="mono" style="margin-top: 0.6rem; color: var(--color-acid); font-size: 0.8rem;">
          ⚡ ${data.speed} — ${data.actionText}
        </div>
      `;
      showToast(`¡Tag NFC leído con éxito! (${data.title})`, 'success');
    } else {
      resultDisplay.innerHTML = `
        <div style="color: var(--color-ink-dim);">
          MODO ACTIVO: <strong style="color: var(--color-ink);">${data.title}</strong>.<br />
          <em>Haz clic en el disco para simular la transmisión inalámbrica.</em>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   3. Remote Diagnostics Interactive Matrix
   ========================================================================== */
function initRemoteDiagnostics() {
  const cards = document.querySelectorAll('.triage-option-card');
  const estimateOutput = document.getElementById('diagEstimateOutput');
  const whatsappCta = document.getElementById('diagWhatsappBtn');

  if (!cards.length || !estimateOutput) return;

  const diagnosticsMap = {
    'lento': { title: 'Optimización de Rendimiento SSD & Limpieza', time: '45 - 60 min', cost: '$25 USD', level: 'NIVEL MEDIO' },
    'malware': { title: 'Eliminación de Virus, Spyware & Adware', time: '60 - 90 min', cost: '$30 USD', level: 'CRÍTICO' },
    'formato': { title: 'Mantenimiento Preventivo & Backups', time: '90 - 120 min', cost: '$40 USD', level: 'COMPLETO' },
    'software': { title: 'Instalación de Software & Configuración', time: '30 - 45 min', cost: '$20 USD', level: 'RÁPIDO' }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const issueKey = card.getAttribute('data-issue') || 'lento';
      const info = diagnosticsMap[issueKey];

      estimateOutput.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="mono" style="color: var(--color-acid); font-weight: 700;">${info.title}</span>
          <span class="stack-pill highlight" style="font-size: 0.7rem;">${info.level}</span>
        </div>
        <p style="color: var(--color-ink); font-size: 0.9rem; margin-bottom: 0.25rem;">
          ⏱ <strong>Tiempo estimado:</strong> ${info.time} | 🏷 <strong>Tarifa base:</strong> ${info.cost}
        </p>
        <p style="color: var(--color-ink-dim); font-size: 0.8rem;">
          Supervisas en vivo cada acción en tu pantalla mediante AnyDesk con total control.
        </p>
      `;

      if (whatsappCta) {
        const msg = encodeURIComponent(`Hola Nicolás, requiero soporte técnico remoto para: ${info.title}.`);
        whatsappCta.href = `https://wa.me/573150135016?text=${msg}`;
      }
    });
  });
}

/* ==========================================================================
   4. Scroll & Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Cookie Consent Banner
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');
  const rejectBtn = document.getElementById('rejectCookiesBtn');

  if (!banner) return;

  const consent = localStorage.getItem('nicolas_cookies_consent');
  if (!consent) {
    setTimeout(() => banner.classList.add('is-active'), 1200);
  }

  acceptBtn?.addEventListener('click', () => {
    localStorage.setItem('nicolas_cookies_consent', 'accepted');
    banner.classList.remove('is-active');
    showToast('Preferencias de privacidad guardadas.', 'success');
  });

  rejectBtn?.addEventListener('click', () => {
    localStorage.setItem('nicolas_cookies_consent', 'essential_only');
    banner.classList.remove('is-active');
  });
}

window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span class="mono">${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
};
