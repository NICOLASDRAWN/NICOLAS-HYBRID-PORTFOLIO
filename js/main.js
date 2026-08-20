/**
 * NICOLAS-HYBRID-PORTFOLIO — Brand OS v2.0 Client Engine
 * Spotlight Mouse Tracking, 3D Holographic Tilt, Magnetic Physics, Web Audio & Command Palette
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSpotlightSystem();
  initMagneticElements();
  initHolographicCardTilt();
  initNfcPhoneSimulator();
  initRemoteDiagnostics();
  initCommandPalette();
  initAudioSystem();
  initScrollAnimations();
  initCookieBanner();
});

/* ==========================================================================
   1. Dynamic Mouse Spotlight System
   ========================================================================== */
function initSpotlightSystem() {
  const cards = document.querySelectorAll('.bento-card, .browser-frame, .diag-card');
  const spotlightOrb = document.createElement('div');
  spotlightOrb.className = 'cursor-spotlight';
  document.body.appendChild(spotlightOrb);

  window.addEventListener('mousemove', (e) => {
    spotlightOrb.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, { passive: true });
}

/* ==========================================================================
   2. Magnetic Physics for Buttons & Badges (Snellenberg Style)
   ========================================================================== */
function initMagneticElements() {
  const magneticEls = document.querySelectorAll('[data-magnetic]');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/* ==========================================================================
   3. 3D Holographic Card Tilt Effect with Rainbow Shimmer
   ========================================================================== */
function initHolographicCardTilt() {
  const card = document.getElementById('holoCard');
  if (!card) return;

  const container = card.parentElement;

  container.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
  });

  container.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   4. Web Audio API Cyber Synthesizer (Micro-FX)
   ========================================================================== */
let audioCtx = null;
let audioEnabled = false;

function initAudioSystem() {
  const audioBtn = document.getElementById('audioToggleBtn');

  function playCyberBlip(freq = 880, type = 'sine', duration = 0.06) {
    if (!audioEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio FX not supported or blocked:', e);
    }
  }

  audioBtn?.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    audioBtn.classList.toggle('is-active', audioEnabled);
    audioBtn.setAttribute('title', audioEnabled ? 'Efectos de audio activados' : 'Activar efectos de audio');
    
    if (audioEnabled) {
      playCyberBlip(1200, 'triangle', 0.1);
      showToast('Efectos de sonido táctiles activados', 'success');
    }
  });

  document.querySelectorAll('.btn, .nfc-touch-sensor, .diag-card, .menu-tab, .browser-frame').forEach(el => {
    el.addEventListener('mouseenter', () => playCyberBlip(520, 'sine', 0.04));
    el.addEventListener('click', () => playCyberBlip(980, 'triangle', 0.08));
  });
}

/* ==========================================================================
   5. Command Palette (Ctrl + K / Cmd + K HUD)
   ========================================================================== */
function initCommandPalette() {
  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('commandInput');
  const items = document.querySelectorAll('.command-item');
  const triggerBtn = document.getElementById('openPaletteBtn');

  if (!palette || !input) return;

  const openPalette = () => {
    palette.classList.add('is-open');
    input.value = '';
    filterItems('');
    setTimeout(() => input.focus(), 80);
  };

  const closePalette = () => {
    palette.classList.remove('is-open');
  };

  triggerBtn?.addEventListener('click', openPalette);

  // Keyboard shortcut Ctrl+K / Cmd+K / Esc
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('is-open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape' && palette.classList.contains('is-open')) {
      closePalette();
    }
  });

  palette.addEventListener('click', (e) => {
    if (e.target === palette) closePalette();
  });

  input.addEventListener('input', () => {
    filterItems(input.value.trim().toLowerCase());
  });

  function filterItems(query) {
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const href = item.getAttribute('data-href');

      if (href) {
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          target?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
      }

      if (action === 'toggle-audio') {
        document.getElementById('audioToggleBtn')?.click();
      }

      closePalette();
    });
  });
}

/* ==========================================================================
   6. NFC Smartphone Simulator & Dynamic State Machine
   ========================================================================== */
function initNfcPhoneSimulator() {
  const touchTarget = document.getElementById('nfcTouchTarget');
  const screenContent = document.getElementById('phoneScreenContent');
  const modeButtons = document.querySelectorAll('[data-nfc-mode]');

  if (!touchTarget || !screenContent) return;

  let currentMode = 'menu';

  const modesData = {
    menu: {
      tag: 'NTAG213 // 144 BYTES',
      title: 'Gourmet Bistro',
      badge: 'CARTA DIGITAL NFC',
      preview: `
        <div style="text-align: center; padding: 0.5rem 0;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🍷</div>
          <h4 style="font-size: 1.25rem; color: #FFFFFF; font-weight: 800;">Gourmet Bistro</h4>
          <span style="font-size: 0.8rem; color: var(--color-acid); font-family: var(--font-mono);">Mesa #07 • Menú Activo</span>
        </div>
        <div style="margin-top: 1rem; background: #09090D; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; text-align: left;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #FFF;">Carpaccio Trufado</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">$16.50 USD • Añadido a orden</div>
        </div>
        <a href="demos/gastronomia/" class="btn btn-acid btn-sm" style="width: 100%; margin-top: 1.25rem;">
          Ver Carta Completa
        </a>
      `
    },
    review: {
      tag: 'NTAG215 // 504 BYTES',
      title: 'Google Reviews Boost',
      badge: 'RESEÑAS EN 1-TAP',
      preview: `
        <div style="text-align: center; padding: 0.5rem 0;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⭐⭐⭐⭐⭐</div>
          <h4 style="font-size: 1.2rem; color: #FFFFFF; font-weight: 800;">¿Cómo fue tu experiencia?</h4>
          <span style="font-size: 0.8rem; color: #38BDF8; font-family: var(--font-mono);">Google Maps Business</span>
        </div>
        <div style="margin-top: 1rem; background: #09090D; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; text-align: left;">
          <div style="font-size: 0.8rem; color: var(--text-main);">"Excelente servicio y atención rápida."</div>
          <div style="font-size: 0.7rem; color: var(--color-acid); margin-top: 0.25rem;">+48% incremento de reviews</div>
        </div>
        <button class="btn btn-acid btn-sm" style="width: 100%; margin-top: 1.25rem;" onclick="showToast('¡Redirigiendo a formulario Google 5 estrellas!', 'success')">
          Publicar Reseña en Google
        </button>
      `
    },
    vcard: {
      tag: 'NTAG216 // 888 BYTES',
      title: 'Tarjeta vCard Inteligente',
      badge: 'NETWORKING DIGITAL',
      preview: `
        <div style="text-align: center; padding: 0.5rem 0;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--color-acid); color: #000; font-weight: 800; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">NM</div>
          <h4 style="font-size: 1.2rem; color: #FFFFFF; font-weight: 800;">Nicolás Monroy</h4>
          <span style="font-size: 0.8rem; color: var(--color-acid); font-family: var(--font-mono);">Creative Technologist</span>
        </div>
        <div style="margin-top: 1rem; background: #09090D; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; text-align: left; font-size: 0.75rem; color: var(--text-dim);">
          <div>📱 +57 315 013 5016</div>
          <div>✉️ nicolasmonroypabon@gmail.com</div>
        </div>
        <button class="btn btn-acid btn-sm" style="width: 100%; margin-top: 1.25rem;" onclick="showToast('Contacto vCard descargado', 'success')">
          Guardar en Contactos
        </button>
      `
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
      renderPhoneScreen(false);
    });
  });

  touchTarget.addEventListener('click', () => {
    renderPhoneScreen(true);
  });

  function renderPhoneScreen(isTriggered) {
    const data = modesData[currentMode];
    if (isTriggered) {
      if ('vibrate' in navigator) navigator.vibrate([30, 40, 30]);

      screenContent.innerHTML = `
        <div class="phone-status-hud">
          <span>● NFC TAG CONNECTED</span>
          <span style="color: var(--color-acid);">${data.tag}</span>
        </div>
        <div class="phone-live-card">
          ${data.preview}
        </div>
      `;
      showToast(`¡NFC detectado! (${data.title})`, 'success');
    } else {
      screenContent.innerHTML = `
        <div class="phone-status-hud">
          <span>NFC SCANNER READY</span>
          <span>13.56 MHz</span>
        </div>
        <div class="phone-live-card">
          <div style="font-size: 0.85rem; color: var(--text-dim); padding: 1.5rem 0;">
            Modo: <strong style="color: var(--text-main);">${data.title}</strong>.<br /><br />
            <em>Haz clic en la tarjeta o sensor NFC para simular el tap inalámbrico.</em>
          </div>
        </div>
      `;
    }
  }

  renderPhoneScreen(false);
}

/* ==========================================================================
   7. Remote Diagnostics Matrix
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
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
          <span class="mono" style="color: var(--color-acid); font-weight: 700;">${info.title}</span>
          <span class="tag-pill-acid">${info.level}</span>
        </div>
        <p style="color: var(--text-main); font-size: 0.925rem; margin-bottom: 0.35rem;">
          ⏱ <strong>Tiempo estimado:</strong> ${info.time} | 🏷 <strong>Tarifa base:</strong> ${info.cost}
        </p>
        <p style="color: var(--text-dim); font-size: 0.8rem;">
          Conexión 100% segura mediante AnyDesk / TeamViewer con cifrado TLS 1.3 de extremo a extremo.
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
   8. Navigation & Scroll Engine
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  mobileBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('is-open');
    const isExpanded = navLinks?.classList.contains('is-open');
    mobileBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('is-open');
    });
  });

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
