(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let calm = motionQuery.matches;
  const en = document.documentElement.lang === 'en';

  const stage = $('.stage'), word = $('.stage__word'), kanji = $('.stage__kanji');
  const hudN = $('.hud__n'), hudT = $('.hud__t');
  const poses = $$('.pose'), chapters = $$('.ch'), chLinks = $$('.chapters a'), navLinks = $$('.nav__links a');

  /* ---------- preparar revelados ---------- */
  if (!calm) {
    root.classList.add('js');
    $$('.stg').forEach(c => [...c.children].forEach((k, i) => k.style.setProperty('--i', i)));
    $$('.h2').forEach(h => {
      h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((l, i) => `<span class="ln"><span style="--i:${i}">${l}</span></span>`).join('');
    });
    const bust = $('.pose--bust');
    Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : 0, bust.decode ? bust.decode().catch(() => 0) : 0]),
      new Promise(r => setTimeout(r, 1800))
    ]).then(() => requestAnimationFrame(() => root.classList.add('ready')));
  } else {
    root.classList.add('ready');
  }

  let pose = 'bust';
  let poseTimer;
  const setPose = p => {
    if (p === pose) return;
    const old = poses.find(x => x.dataset.pose === pose), next = poses.find(x => x.dataset.pose === p);
    if (!next) return;
    clearTimeout(poseTimer);
    poses.forEach(img => img.classList.remove('is-out'));
    old?.classList.remove('is-on');
    old?.classList.add('is-out');
    next.classList.add('is-on');
    poseTimer = setTimeout(() => old?.classList.remove('is-out'), calm ? 0 : 320);
    pose = p;
  };

  /* ---------- capítulo activo ---------- */
  let ch = -1;
  const swapText = (el, txt) => {
    if (el.textContent === txt) return;
    el.classList.add('swap');
    setTimeout(() => { el.textContent = txt; el.classList.remove('swap'); }, 260);
  };
  const setChapter = i => {
    if (i === ch) return;
    ch = i;
    const s = chapters[i];
    stage.dataset.ch = i;
    setPose(s.dataset.pose);
    swapText(word, s.dataset.word);
    swapText(kanji, s.dataset.kanji);
    hudN.textContent = String(i).padStart(2, '0');
    hudT.textContent = s.dataset.title;
    chLinks.forEach((a, k) => { a.classList.toggle('is-on', k === i); if (k === i) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    navLinks.forEach(a => { const active = a.hash === '#' + s.id; a.classList.toggle('is-active', active); if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  };
  setChapter(0);

  /* ---------- revelado de tarjetas ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const c = e.target.querySelector('.card') || e.target;
    c.classList.add('is-in');
    $$('[data-count]', c).forEach(el => {
      if (calm) return;
      const end = +el.dataset.count, pre = el.textContent.trim().startsWith('+') ? '+' : '', t0 = performance.now();
      const step = t => {
        const p = Math.min((t - t0) / 1300, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = pre + ('sep' in el.dataset ? v.toLocaleString('es-CO') : v);
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 350);
    });
    io.unobserve(e.target);
  }), { threshold: .12 });
  $$('.ch').forEach(c => { if (c.querySelector('.card')) io.observe(c); });

  const fine = matchMedia('(pointer: fine)');
  let tops = [], heights = [], frame = 0;
  const measure = () => {
    tops = chapters.map(section => section.getBoundingClientRect().top + scrollY);
    heights = chapters.map(section => section.offsetHeight);
    queue();
  };
  const update = () => {
    frame = 0;
    if (document.hidden) return;
    const y = scrollY, vh = innerHeight;
    let active = 0;
    for (let i = 0; i < tops.length; i++) if (tops[i] <= y + vh * .42) active = i;
    if (y + vh >= root.scrollHeight - 4) active = chapters.length - 1;
    const progress = Math.min(1, Math.max(0, (y + vh - tops[active]) / (heights[active] + vh)));
    setChapter(active);
    root.style.setProperty('--sp', (y / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    const ambient = !calm && fine.matches && innerWidth > 860;
    stage.style.setProperty('--figY', ambient ? ((progress - .5) * 14).toFixed(2) : '0');
    stage.style.setProperty('--sunY', ambient ? ((progress - .5) * -24).toFixed(2) : '0');
  };
  function queue() { if (!frame && !document.hidden) frame = requestAnimationFrame(update); }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure, { once: true });
  new ResizeObserver(measure).observe($('.story'));
  document.fonts?.ready.then(measure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else measure();
  });
  motionQuery.addEventListener('change', e => {
    calm = e.matches;
    if (calm) { $$('.card').forEach(c => c.classList.add('is-in')); root.classList.add('ready'); }
    queue();
  });
  measure();

  const nav = $('.nav'), burger = $('.burger');
  const closeMenu = () => {
    nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', en ? 'Open menu' : 'Abrir menú');
  };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? (en ? 'Close menu' : 'Cerrar menú') : (en ? 'Open menu' : 'Abrir menú'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); burger.focus(); }
  });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });
  $$('.nav a').forEach(a => a.addEventListener('click', closeMenu));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = document.getElementById(a.hash.slice(1));
    if (!target) return;
    e.preventDefault();
    history.pushState(null, '', a.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: calm ? 'instant' : 'smooth', block: 'start' });
  }));

  /* ---------- filtros de proyectos ---------- */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $$('.pcard').forEach(c => c.classList.toggle('is-hidden', b.dataset.f !== 'all' && c.dataset.t !== b.dataset.f));
  }));

  /* ---------- servicios ---------- */
  const services = [
    ['Nombres, logos y sistemas visuales que se reconocen en un segundo y escalan a cualquier pieza.', ['Logo', 'Sistema visual', 'Manual de marca', 'Papelería']],
    ['Interfaces claras para web, apps y software interno, pensadas desde el usuario y listas para desarrollo.', ['Investigación', 'Wireframes', 'Prototipos', 'Design system']],
    ['Sitios y aplicaciones rápidas con Next.js, React y Node, desde landing pages hasta productos completos.', ['Next.js', 'React', 'Node.js', 'Electron']],
    ['Piezas para redes, video y fotografía que cuentan la historia de la marca con intención.', ['Redes sociales', 'Video', 'Motion', 'Copy']],
    ['Automatización de procesos: scripts, integraciones y modelos de IA locales o en la nube.', ['Python', 'IA local', 'Integraciones', 'Bots']]
  ];
  const det = $('.svc-detail'), items = $$('.svc__item');
  const showSvc = i => {
    items.forEach((p, k) => { p.classList.toggle('is-on', k === i); p.setAttribute('aria-pressed', String(k === i)); });
    $('p', det).textContent = services[i][0];
    $('.chips', det).innerHTML = services[i][1].map(x => `<li>${x}</li>`).join('');
  };
  items.forEach((p, i) => { p.addEventListener('click', () => showSvc(i)); p.addEventListener('mouseenter', () => showSvc(i)); });
  if (det && items.length) showSvc(0);

  /* ---------- formulario ---------- */
  const form = $('.form'), btn = form ? $('button[type=submit]', form) : null, lbl = btn ? $('.lbl', btn) : null, msg = form ? $('.form__msg', form) : null;
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const req = $$('[required]', form), bad = req.filter(i => !i.checkValidity());
    req.forEach(i => i.setAttribute('aria-invalid', bad.includes(i)));
    if (bad.length) {
      btn.dataset.state = 'error'; lbl.textContent = 'REVISA LOS CAMPOS';
      msg.textContent = 'Escribe tu nombre y un correo válido.'; bad[0].focus(); return;
    }
    if (btn.disabled) return;
    btn.disabled = true; btn.dataset.state = 'loading'; lbl.textContent = 'ABRIENDO WHATSAPP…';
    const values = new FormData(form);
    const text = `Hola Nicolás, soy ${values.get('nombre')}.\nCorreo: ${values.get('correo')}\nServicio: ${values.get('servicio')}\n\n${values.get('msg') || ''}`;
    const url = 'https://wa.me/573150135016?text=' + encodeURIComponent(text);
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    if (!opened) {
      btn.dataset.state = 'error';
      msg.textContent = 'Tu navegador bloqueó la ventana. Usa el botón WhatsApp de arriba para contactarme.';
    } else {
      btn.dataset.state = 'success';
      msg.textContent = 'Mensaje preparado. Confirma el envío en WhatsApp.';
    }
    btn.disabled = false; lbl.textContent = 'CONTINUAR EN WHATSAPP';
  });
})();
