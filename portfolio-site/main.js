(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- cambio de pose con corte de tinta ---------- */
  let pose = 'bust';
  const setPose = p => {
    if (p === pose) return;
    const old = poses.find(x => x.dataset.pose === pose), nxt = poses.find(x => x.dataset.pose === p);
    old.classList.remove('is-on'); old.classList.add('is-out');
    nxt.classList.add('no-tr'); nxt.classList.remove('is-out'); void nxt.offsetWidth; nxt.classList.remove('no-tr');
    nxt.classList.add('is-on');
    if (!calm) { stage.classList.remove('cut'); void stage.offsetWidth; stage.classList.add('cut'); }
    setTimeout(() => { old.classList.add('no-tr'); old.classList.remove('is-out'); void old.offsetWidth; old.classList.remove('no-tr'); }, 750);
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
    chLinks.forEach((a, k) => a.classList.toggle('is-on', k === i));
    navLinks.forEach(a => a.classList.toggle('is-active', a.hash === '#' + s.id));
  };
  setChapter(0);

  /* ---------- revelado de tarjetas ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const c = e.target.querySelector('.card') || e.target;
    c.classList.add('is-in');
    $$('[data-count]', c).forEach(el => {
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

  /* ---------- scroll con inercia (solo rueda de mouse en escritorio) ---------- */
  const fine = matchMedia('(pointer: fine)').matches;
  const maxY = () => root.scrollHeight - innerHeight;
  let target = scrollY, smooth = scrollY, driving = false;
  if (!calm && fine) {
    root.style.scrollBehavior = 'auto';
    addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented) return;
      if (e.target.closest && e.target.closest('textarea,select')) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      if (!driving) { target = smooth = scrollY; }
      target = Math.max(0, Math.min(maxY(), target + d));
      driving = true;
    }, { passive: false });
    const goTo = y => { if (!driving) target = smooth = scrollY; target = Math.max(0, Math.min(maxY(), y)); driving = true; };
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      goTo(el.offsetTop);
      history.replaceState(null, '', a.getAttribute('href'));
    }));
    addEventListener('keydown', e => {
      if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
      const map = { ArrowDown: 90, ArrowUp: -90, PageDown: innerHeight * .9, PageUp: -innerHeight * .9, ' ': e.shiftKey ? -innerHeight * .9 : innerHeight * .9 };
      if (e.key in map) { e.preventDefault(); goTo((driving ? target : scrollY) + map[e.key]); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End') { e.preventDefault(); goTo(maxY()); }
    });
    addEventListener('scroll', () => { if (!driving) target = smooth = scrollY; }, { passive: true });
  }

  /* ---------- posiciones cacheadas de capítulos ---------- */
  let tops = [];
  const measure = () => { tops = chapters.map(s => s.offsetTop); };
  measure();
  addEventListener('resize', measure);
  addEventListener('load', measure);
  new ResizeObserver(measure).observe($('.story'));

  /* ---------- precarga de poses para cambios sin tirones ---------- */
  poses.forEach(img => { if (img.decode) img.decode().catch(() => 0); });

  /* ---------- bucle único: inercia, capítulo, interpolación ---------- */
  const lerp = (a, b, k) => a + (b - a) * k;
  let lastY = scrollY, vel = 0, t = 0;
  const cur = { lean: 0, figY: 0, figS: 1, sunY: 0, sp: 0 };
  const torii = $('.torii img');
  let prevT = performance.now();
  const loop = now => {
    const dt = Math.min(64, now - prevT) / 16.67; prevT = now;
    if (driving) {
      smooth = lerp(smooth, target, 1 - Math.pow(1 - .085, dt));
      if (Math.abs(target - smooth) < .4) { smooth = target; driving = false; }
      window.scrollTo(0, smooth);
    }
    const y = scrollY, vh = innerHeight;
    const k = innerWidth < 860 ? .78 : .5;
    let active = 0;
    for (let i = 0; i < tops.length; i++) if (tops[i] - y < vh * k) active = i;
    if (vh + y >= root.scrollHeight - 4) active = chapters.length - 1;
    setChapter(active);

    const spT = y / Math.max(1, maxY());
    cur.sp = lerp(cur.sp, spT, .2);
    root.style.setProperty('--sp', cur.sp.toFixed(4));

    if (!calm) {
      vel = lerp(vel, y - lastY, .12); lastY = y; t += dt;
      const top = tops[active] || 0, h = chapters[active].offsetHeight;
      const prog = Math.min(Math.max((y + vh - top) / (h + vh), 0), 1);
      cur.lean = lerp(cur.lean, Math.max(-6, Math.min(6, vel * .22)), .1);
      cur.figY = lerp(cur.figY, Math.sin(t / 34) * 4 + (prog - .5) * 18, .08);
      cur.figS = lerp(cur.figS, 1 + (prog - .5) * .04, .08);
      cur.sunY = lerp(cur.sunY, (prog - .5) * -40, .06);
      stage.style.setProperty('--lean', cur.lean.toFixed(3));
      stage.style.setProperty('--figY', cur.figY.toFixed(2));
      stage.style.setProperty('--figS', cur.figS.toFixed(4));
      stage.style.setProperty('--sunY', cur.sunY.toFixed(2));
      if (torii) {
        const tr = torii.getBoundingClientRect();
        if (tr.bottom > 0 && tr.top < vh) torii.style.transform = `translate3d(0,${(((tr.top + tr.height / 2) / vh) - .5) * -24}px,0) scale(1.14)`;
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- menú móvil ---------- */
  const nav = $('.nav'), burger = $('.burger');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', nav.classList.toggle('is-open')));
  navLinks.forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

  /* ---------- filtros de proyectos ---------- */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('is-on', x === b));
    $$('.pcard').forEach(c => c.classList.toggle('is-hidden', b.dataset.f !== 'all' && c.dataset.t !== b.dataset.f));
  }));

  /* ---------- servicios ---------- */
  const services = [
    ['Nombres, logos y sistemas visuales que se reconocen en un segundo y escalan a cualquier pieza.', ['Logo', 'Sistema visual', 'Manual de marca', 'Papelería']],
    ['Interfaces claras para web, apps y software interno, pensadas desde el usuario y listas para desarrollo.', ['Investigación', 'Wireframes', 'Prototipos', 'Design system']],
    ['Sitios y aplicaciones rápidas con Next.js, React y Node, desde landing pages hasta productos completos.', ['Next.js', 'React', 'Node.js', 'Electron']],
    ['Piezas para redes, video y fotografía que cuentan la historia de la marca con intención.', ['Redes sociales', 'Video', 'Motion', 'Copy']],
    ['Flujos que ahorran horas: scripts, integraciones y modelos de IA locales o en la nube.', ['Python', 'IA local', 'Integraciones', 'Bots']]
  ];
  const det = $('.svc-detail'), items = $$('.svc__item');
  const showSvc = i => {
    items.forEach((p, k) => p.classList.toggle('is-on', k === i));
    $('p', det).textContent = services[i][0];
    $('.chips', det).innerHTML = services[i][1].map(x => `<li>${x}</li>`).join('');
  };
  items.forEach((p, i) => { p.addEventListener('click', () => showSvc(i)); p.addEventListener('mouseenter', () => showSvc(i)); });
  showSvc(0);

  /* ---------- formulario ---------- */
  const form = $('.form'), btn = $('button[type=submit]', form), lbl = $('.lbl', btn), msg = $('.form__msg', form);
  form.addEventListener('submit', e => {
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
