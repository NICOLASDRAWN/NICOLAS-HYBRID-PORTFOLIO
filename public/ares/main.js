(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FRAMES = 120;
  const frames = [];

  /* ---------- carga ---------- */
  const knightImg = $("#knight");
  let loaded = 0;
  const need = 1 + 24; // caballero + primeros cuadros
  const bump = () => { loaded++; const p = Math.min(100, Math.round(loaded / need * 100)); $("#loadBar").style.width = p + "%"; $("#loadN").textContent = String(p).padStart(3, "0"); if (loaded === need) finish(); };
  const done = () => { if (knightImg.complete) bump(); else knightImg.addEventListener("load", bump, { once: true }); };
  for (let i = 0; i < FRAMES; i++) {
    const im = new Image();
    im.decoding = "async";
    if (i < 24) im.onload = bump; else im.onload = () => { if (i === FRAMES - 1) drawRise(); };
    im.src = `assets/rise/f${String(i + 1).padStart(3, "0")}.webp`;
    frames.push(im);
  }
  done();
  let finished = false;
  function finish() { if (finished) return; finished = true; setTimeout(() => { $("#loader").classList.add("out"); const cr = $("#credits"); if (reduce) { go(); return; } cr.classList.add("play"); setTimeout(go, 2900); }, 300); }
  function go() { document.body.classList.add("ready"); setTimeout(startHero, 600); }
  setTimeout(finish, 4000);

  /* ---------- nav ---------- */
  const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); menu.classList.toggle("open", o); menu.setAttribute("aria-hidden", !o); });
  $$("a", menu).forEach(a => a.addEventListener("click", () => burger.click()));

  /* ---------- brasas ---------- */
  const ec = $("#embers"), ex = ec.getContext("2d");
  let W = 0, H = 0, sparks = [];
  const resize = () => { W = ec.width = innerWidth * devicePixelRatio; H = ec.height = innerHeight * devicePixelRatio; };
  resize(); addEventListener("resize", () => { resize(); sizeRise(); });
  const spawn = () => ({ x: Math.random() * W, y: H + Math.random() * H * .3, r: (Math.random() * 1.8 + .6) * devicePixelRatio, vy: -(Math.random() * .9 + .35) * devicePixelRatio, vx: (Math.random() - .5) * .4 * devicePixelRatio, life: Math.random() * .5 + .5, ph: Math.random() * 6 });
  for (let i = 0; i < 90; i++) { const s = spawn(); s.y = Math.random() * H; sparks.push(s); }
  const burst = [];
  window.__burst = (x, y) => { for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (Math.random() - .5) * 2.4, v = (Math.random() * 4 + 1.5) * devicePixelRatio; burst.push({ x: x * devicePixelRatio, y: y * devicePixelRatio, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, r: (Math.random() * 1.6 + .6) * devicePixelRatio }); } };
  let t = 0;
  (function loop() {
    t += .016; ex.clearRect(0, 0, W, H);
    if (!reduce) for (const s of sparks) {
      s.x += s.vx + Math.sin(t * 1.3 + s.ph) * .35 * devicePixelRatio; s.y += s.vy;
      if (s.y < -20) Object.assign(s, spawn());
      const a = Math.max(0, Math.min(1, s.y / H)) * s.life;
      ex.fillStyle = `rgba(255,${150 + (s.ph * 15 | 0)},70,${a})`; ex.shadowColor = "rgba(255,120,40,.9)"; ex.shadowBlur = 8 * devicePixelRatio;
      ex.beginPath(); ex.arc(s.x, s.y, s.r, 0, 7); ex.fill();
    }
    for (let i = burst.length - 1; i >= 0; i--) { const b = burst[i]; b.x += b.vx; b.y += b.vy; b.vy += .12 * devicePixelRatio; b.l -= .025; if (b.l <= 0) { burst.splice(i, 1); continue; } ex.fillStyle = `rgba(255,190,110,${b.l})`; ex.shadowColor = "rgba(255,120,40,1)"; ex.shadowBlur = 10 * devicePixelRatio; ex.beginPath(); ex.arc(b.x, b.y, b.r, 0, 7); ex.fill(); }
    requestAnimationFrame(loop);
  })();

  /* ---------- hero: flechas, parallax, votos ---------- */
  function startHero() {
    const box = $("#arrows");
    // posiciones relativas al centro (en % del hero) y ángulos, como en el mockup
    const A = [[-15, 40, -38, 1.0], [-8, 33, -22, .9], [4, 30, 14, 1.05], [12, 36, 30, .95], [18, 44, 50, .85], [22, 55, 66, .8], [-20, 50, -54, .8]];
    A.forEach(([dx, y, ang, sc], i) => {
      const a = document.createElement("div"); a.className = "arrow";
      a.innerHTML = '<span class="shaft"></span><span class="fl"></span>';
      a.style.left = `calc(50% + ${dx}vw)`; a.style.top = `${y - 12}%`;
      const rad = ang * Math.PI / 180, dist = 900;
      a.animate([
        { transform: `translate(${Math.sin(rad) * dist}px, ${-Math.cos(rad) * dist}px) rotate(${ang}deg) scale(${sc})`, opacity: 0 },
        { opacity: 1, offset: .2 },
        { transform: `translate(0,0) rotate(${ang}deg) scale(${sc})`, opacity: 1, offset: .92 },
        { transform: `translate(0,0) rotate(${ang + (i % 2 ? 1.5 : -1.5)}deg) scale(${sc})`, opacity: 1 }
      ], { duration: reduce ? 1 : 700, delay: reduce ? 0 : 900 + i * 140, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
      a.style.opacity = 0; box.appendChild(a);
      a.getAnimations()[0]?.finished.then(() => { const r = a.getBoundingClientRect(); window.__burst(r.left + r.width / 2, r.bottom); const st = $("#stage"); st.classList.remove("shake"); void st.offsetWidth; st.classList.add("shake"); });
    });
    // votos: tachar y encender
    const no = $$("#vows .no"), yes = $$("#vows .yes");
    no.forEach((li, i) => setTimeout(() => li.classList.add("cut"), 1800 + i * 450));
    yes.forEach((li, i) => setTimeout(() => li.classList.add("lit"), 3300 + i * 380));
  }
  const kn = $("#knight"), sun = $("#sun"), title = $("#title"), left = $(".hero-left");
  let px = 0, py = 0;
  function camera() {
    if (reduce) return; const y = Math.min(scrollY, innerHeight * 1.2);
    kn.style.translate = `calc(-50% + ${px * -16}px) ${py * -8 + y * .12}px`;
    sun.style.translate = `calc(-50% + ${px * 24}px) calc(-50% + ${py * 14 + y * .3}px)`;
    title.style.translate = `calc(-50% + ${px * 10}px) ${py * 6 + y * .5}px`;
    title.style.opacity = Math.max(0, 1 - y / (innerHeight * .7));
    left.style.translate = `0 ${y * -.2}px`;
  }
  addEventListener("pointermove", e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; camera(); }, { passive: true });
  addEventListener("scroll", camera, { passive: true });

  /* ---------- secuencia RISE ---------- */
  const rise = $("#rise"), cv = $("#riseCanvas"), cx = cv.getContext("2d");
  const chs = $$(".ch"); let cur = -1, frameIdx = 0;
  function sizeRise() { cv.width = cv.clientWidth * devicePixelRatio; cv.height = cv.clientHeight * devicePixelRatio; drawRise(); }
  function drawRise() {
    const im = frames[frameIdx]; if (!im || !im.complete || !im.naturalWidth) return;
    const cw = cv.width, ch = cv.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    const shift = innerWidth > 900 ? cw * .12 : 0; // el caballero a la derecha del texto
    cx.clearRect(0, 0, cw, ch); cx.drawImage(im, (cw - w) / 2 + shift, (ch - h) / 2, w, h);
  }
  function riseProgress() { const r = rise.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); }
  function onScroll() {
    nav.classList.toggle("solid", scrollY > 40);
    const pf = $("#pf"); if (pf) pf.classList.toggle("show", scrollY > innerHeight * .6);
    const p = riseProgress();
    const f = Math.min(FRAMES - 1, Math.floor(p * FRAMES));
    if (f !== frameIdx) { frameIdx = f; drawRise(); }
    const c = Math.min(3, Math.floor(p * 4));
    if (c !== cur) { cur = c; chs.forEach((el, i) => el.classList.toggle("on", i === c)); $("#riseN").textContent = String(c + 1).padStart(2, "0"); }
    $("#riseFill").style.width = (p * 100) + "%";
    if (!reduce) { cv.style.transform = `scale(${1 + p * .14})`; $("#flash").style.opacity = Math.max(0, 1 - Math.abs(p - .9) / .06).toFixed(3); }
    const total = document.documentElement.scrollHeight - innerHeight;
    $("#railFill").style.height = (scrollY / total * 100) + "%";
    $$(".nav nav a").forEach(a => { const s = $(a.getAttribute("href")); if (!s) return; const r = s.getBoundingClientRect(); a.classList.toggle("on", r.top <= innerHeight * .4 && r.bottom > innerHeight * .4); });
  }
  addEventListener("scroll", onScroll, { passive: true });
  sizeRise(); onScroll();

  // reproducir la secuencia con sonido
  const play = $("#play"), audio = $("#audio"); let raf = 0, playing = false;
  play.addEventListener("click", () => {
    if (playing) { stop(); return; }
    playing = true; play.classList.add("on"); $("#playTxt").textContent = "Stop";
    const start = rise.offsetTop, end = rise.offsetTop + rise.offsetHeight - innerHeight, t0 = performance.now(), D = 10000;
    scrollTo({ top: start, behavior: "instant" });
    audio.currentTime = 0; audio.play().catch(() => {});
    const step = now => { const k = Math.min(1, (now - t0) / D); scrollTo({ top: start + (end - start) * k, behavior: "instant" }); if (k < 1 && playing) raf = requestAnimationFrame(step); else stop(); };
    raf = requestAnimationFrame(step);
  });
  function stop() { playing = false; cancelAnimationFrame(raf); audio.pause(); play.classList.remove("on"); $("#playTxt").textContent = "Watch the rise · sound on"; }
  addEventListener("wheel", () => playing && stop(), { passive: true });
  addEventListener("touchstart", () => playing && stop(), { passive: true });

  /* ---------- montaña generativa ---------- */
  const mc = $("#mountain");
  function drawMountain() {
    const r = mc.getBoundingClientRect(); mc.width = r.width * devicePixelRatio; mc.height = r.height * devicePixelRatio;
    const g = mc.getContext("2d"), w = mc.width, h = mc.height;
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, "#5b5450"); sky.addColorStop(1, "#1a1716"); g.fillStyle = sky; g.fillRect(0, 0, w, h);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const ridge = (base, amp, peakX, col, rough) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, h);
      for (let x = 0; x <= w; x += 2) { const d = Math.abs(x - peakX) / w; const y = base - amp * Math.max(0, 1 - d * 2.2) - (rnd() - .5) * rough * h * .03 - Math.sin(x * .05) * h * .01; g.lineTo(x, y); }
      g.lineTo(w, h); g.fill();
    };
    ridge(h * .78, h * .62, w * .55, "#2d2826", 1.2);
    // nieve
    g.save(); g.globalCompositeOperation = "source-atop"; const snow = g.createLinearGradient(0, h * .15, 0, h * .55); snow.addColorStop(0, "rgba(235,228,218,.9)"); snow.addColorStop(1, "rgba(235,228,218,0)");
    for (let i = 0; i < 60; i++) { g.strokeStyle = snow; g.lineWidth = rnd() * 3 * devicePixelRatio + 1; const x = w * .55 + (rnd() - .5) * w * .5; g.beginPath(); g.moveTo(w * .55, h * .17); g.lineTo(x, h * (.3 + rnd() * .35)); g.stroke(); }
    g.restore();
    ridge(h * .95, h * .35, w * .2, "#151211", 2);
  }
  drawMountain();

  /* ---------- bandera ondeando ---------- */
  const fp = $("#flagPath"); let ft = 0;
  (function wave() {
    ft += .05; const top = [], bot = [];
    for (let i = 0; i <= 20; i++) { const x = 24 + i * 8.5, k = i / 20, a = Math.sin(ft + i * .45) * 9 * k; top.push(`${x},${18 + a}`); bot.push(`${x},${108 + a + Math.sin(ft * .7 + i * .3) * 3 * k}`); }
    fp.setAttribute("d", `M${top.join(" L")} L${bot.reverse().join(" L")} Z`);
    if (!reduce) requestAnimationFrame(wave);
  })();

  /* ---------- manifiesto ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .6 });
  $$(".ln").forEach((el, i) => { el.style.transitionDelay = (i * .12) + "s"; io.observe(el); });

  /* ---------- formulario (4 estados) ---------- */
  const form = $("#form"), email = $("#email"), msg = $("#msg"), send = $("#send"), sendTxt = $("#sendTxt");
  form.addEventListener("submit", e => {
    e.preventDefault(); msg.className = "msg mono";
    if (!email.checkValidity() || !email.value) { email.setAttribute("aria-invalid", "true"); msg.classList.add("err"); msg.textContent = "Write a valid email, like you@order.com"; return; }
    email.removeAttribute("aria-invalid"); send.disabled = true; sendTxt.textContent = "Rising…"; msg.textContent = "";
    setTimeout(() => { send.disabled = false; sendTxt.textContent = "Joined"; msg.classList.add("ok"); msg.textContent = "Welcome to the order. (Demo, nothing was sent.)"; email.value = ""; setTimeout(() => sendTxt.textContent = "Rise again", 2600); }, 1200);
  });
})();
