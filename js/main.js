/**
 * NICOLAS-HYBRID-PORTFOLIO — Brand OS Client Engine
 * Smooth Navigation, Scroll Observers, NFC Terminal Simulator & Remote Diagnostics
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initNfcSimulator();
  initRemoteDiagnostics();
  initCookieBanner();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Interaction
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile Menu Toggle
  mobileBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('is-open');
    const isExpanded = navLinks?.classList.contains('is-open');
    mobileBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });

  // Close menu when clicking link
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('is-open');
    });
  });

  // Active Link on Scroll
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 140;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navTarget = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(l => l.classList.remove('active'));
        navTarget?.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. Scroll & Reveal Animations (Intersection Observer)
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
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. NFC Cyber Terminal Simulator
   ========================================================================== */
function initNfcSimulator() {
  const touchTarget = document.getElementById('nfcTouchTarget');
  const resultDisplay = document.getElementById('nfcResultDisplay');
  const modeButtons = document.querySelectorAll('[data-nfc-mode]');

  if (!touchTarget || !resultDisplay) return;

  let currentMode = 'menu';

  const nfcData = {
    menu: {
      title: 'Menú Digital Gourmet Bistro',
      payload: 'https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO/demos/gastronomia/',
      tag: 'NTAG213 // 144 BYTES',
      speed: '0.14s de lectura instantánea',
      actionText: 'Abriendo carta digital en el dispositivo...'
    },
    review: {
      title: 'Google Business 5-Star Boost',
      payload: 'https://g.page/r/nicolas-tech-reviews/review',
      tag: 'NTAG215 // 504 BYTES',
      speed: '0.11s a formulario de reseña',
      actionText: 'Redirigiendo a calificación en Google Maps...'
    },
    vcard: {
      title: 'Tarjeta de Contacto Inteligente (vCard)',
      payload: 'BEGIN:VCARD\\nVERSION:3.0\\nN:Monroy;Nicolás\\nTEL:+573150135016\\nEND:VCARD',
      tag: 'NTAG216 // 888 BYTES',
      speed: 'Contacto guardado en libreta telefónica',
      actionText: 'Descargando credencial de contacto...'
    }
  };

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => {
        b.classList.remove('btn-acid', 'active');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-acid', 'active');
      currentMode = btn.getAttribute('data-nfc-mode') || 'menu';
      renderNfcOutput(false);
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
        <div class="mono" style="color: var(--color-acid); font-weight: 700; margin-bottom: 0.5rem;">
          [✔] NFC TAG DETECTADO — ${data.tag}
        </div>
        <p style="color: var(--color-ink); margin-bottom: 0.25rem;"><strong>Destino:</strong> ${data.title}</p>
        <p class="mono" style="color: var(--color-ink-dim); font-size: 0.75rem; word-break: break-all;"><strong>Payload:</strong> ${data.payload}</p>
        <div class="mono" style="margin-top: 0.75rem; color: var(--color-acid); font-size: 0.8rem;">
          ⚡ ${data.speed} — ${data.actionText}
        </div>
      `;
      showToast(`¡Tag NFC leído! (${data.title})`, 'success');
    } else {
      resultDisplay.innerHTML = `
        <div style="color: var(--color-ink-dim);">
          MODO ACTIVO: <strong style="color: var(--color-ink);">${data.title}</strong>.<br />
          <em>Toca el sensor interactivo arriba para recibir la trama de datos.</em>
        </div>
      `;
    }
  }
}

/* ==========================================================================
   4. Remote Diagnostics Matrix
   ========================================================================== */
function initRemoteDiagnostics() {
  const cards = document.querySelectorAll('.diag-card');
  const estimateOutput = document.getElementById('diagEstimateOutput');
  const whatsappCta = document.getElementById('diagWhatsappBtn');

  if (!cards.length || !estimateOutput) return;

  const diagnosticsMap = {
    'lento': { title: 'Optimización de Rendimiento & Limpieza SSD', time: '45 - 60 min', cost: '$25 USD', level: 'NIVEL MEDIO' },
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
          <span class="mono" style="background: rgba(198,255,61,0.1); color: var(--color-acid); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${info.level}</span>
        </div>
        <p style="color: var(--color-ink); font-size: 0.9rem; margin-bottom: 0.25rem;">
          ⏱ <strong>Tiempo estimado:</strong> ${info.time} | 🏷 <strong>Tarifa base:</strong> ${info.cost}
        </p>
        <p style="color: var(--color-ink-dim); font-size: 0.8rem;">
          Conexión 100% segura mediante AnyDesk / TeamViewer con supervisión en vivo en tu pantalla.
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
   5. Legal & Cookie Protocol
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookiesBtn');
  const rejectBtn = document.getElementById('rejectCookiesBtn');

  if (!banner) return;

  const consent = localStorage.getItem('nicolas_cookies_consent');

  if (!consent) {
    setTimeout(() => {
      banner.classList.add('is-active');
    }, 1200);
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

/* ==========================================================================
   6. Global Toast Notification Helper
   ========================================================================== */
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
