(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body, cl = v => Math.max(0, Math.min(1, v));
  const P = [
    { s: "airmax", t: "AIR MAX", k: "E-commerce · colores en vivo", u: "https://ncls.lat/airmax/" },
    { s: "ares", t: "ARES", k: "Scroll cinematográfico", u: "https://ncls.lat/ares/" },
    { s: "s91-detailing", t: "S91 Detailing", k: "Servicios · WhatsApp", u: "https://www.behance.net/gallery/258873305" },
    { s: "travelia", t: "Travelia", k: "Turismo · reservas", u: "https://www.behance.net/gallery/258867125" },
    { s: "struktura", t: "Struktura", k: "Arquitectura", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "sotanocapital", t: "Sótano Capital", k: "Restaurante", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "huilahome", t: "HuilaHome", k: "Inmobiliaria", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "bogostudio", t: "BogoStudio", k: "Apartaestudios", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "tesla-concept", t: "Tesla", k: "Concepto automotriz", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "mercedes-concept", t: "Mercedes-Benz", k: "Concepto automotriz", u: "https://www.behance.net/nicolasmonroy3" },
    { s: "royal-oak-fanart", t: "Royal Oak", k: "Vista explotada en scroll", u: "https://www.behance.net/gallery/258843327" },
    { s: "doom-fanart", t: "DOOM", k: "Narrativa en scroll", u: "https://www.behance.net/gallery/258842157" }
  ];

  const tog = $("#tog");
  const setTheme = lime => { body.classList.toggle("lime", lime); tog.setAttribute("aria-pressed", lime); tog.setAttribute("aria-label", lime ? "Cambiar color de acento a rojo" : "Cambiar color de acento a lima"); try { localStorage.setItem("nm-theme", lime ? "lime" : "red"); } catch (e) {} };
  try { if (localStorage.getItem("nm-theme") === "lime") setTheme(true); } catch (e) {}
  tog.addEventListener("click", () => setTheme(!body.classList.contains("lime")));

  const intro = $("#intro");
  let done = false;
  function go() { if (done) return; done = true; body.classList.add("go"); body.classList.remove("lock"); intro.classList.add("p1", "p2"); setTimeout(() => intro.style.display = "none", 1400); }
  if (RM) { body.classList.add("go"); intro.style.display = "none"; done = true; }
  else {
    body.classList.add("lock");
    setTimeout(() => intro.classList.add("p1"), 200);
    setTimeout(go, 1100);
    ["keydown", "wheel", "touchmove", "pointerdown"].forEach(e => addEventListener(e, go, { once: true, passive: true }));
  }

  const nav = $("#nav"), me = $(".me"), title = $(".title");
  let mx = 0, cx = 0;
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; }, { passive: true });

  const ring = $("#ring"), N = P.length, step = 360 / N;
  ring.innerHTML = P.map((p, i) => `<div class="scr"><img src="assets/shots/${p.s}.webp" alt="${p.t}" loading="${i < 4 ? "eager" : "lazy"}" draggable="false"></div>`).join("");
  const scrs = $$(".scr");
  let RAD = 0;
  function place() { RAD = Math.round(ring.offsetWidth / 2 / Math.tan(Math.PI / N) + 60); scrs.forEach((e, i) => e.style.transform = `rotateY(${i * step}deg) translateZ(${RAD}px)`); }
  place(); addEventListener("resize", place);
  let rot = 0, tgt = 0, drag = false, lx = 0, hover = false, cur = -1;
  const vit = $("#vitrina");
  vit.addEventListener("pointerdown", e => { if (e.target.closest(".vcap")) return; drag = true; lx = e.clientX; vit.setPointerCapture(e.pointerId); });
  vit.addEventListener("pointermove", e => { if (!drag) return; rot += (e.clientX - lx) * .2; lx = e.clientX; tgt = rot; });
  const snap = () => { drag = false; tgt = Math.round(rot / step) * step; };
  vit.addEventListener("pointerup", snap); vit.addEventListener("pointercancel", snap);
  vit.addEventListener("pointerenter", () => hover = true); vit.addEventListener("pointerleave", () => hover = false);
  if (!RM) setInterval(() => { if (!drag && !hover) tgt -= step; }, 3600);
  const vcap = $("#vcap"), vIdx = $("#vIdx"), vName = $("#vName"), vKind = $("#vKind");
  function caption(i) { vcap.classList.add("sw"); setTimeout(() => { vIdx.textContent = String(i + 1).padStart(2, "0") + " / " + N; vName.textContent = P[i].t; vKind.textContent = P[i].k; vcap.href = P[i].u; vcap.classList.remove("sw"); }, 260); }

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".w-head, .vitrina, .contact .big, .contact .btn").forEach(e => { e.classList.add("rv"); io.observe(e); });


  const sayT = $("#sayT"), say = $("#sobre");
  const HL = ["Neiva,", "Bogotá.", "vivas."];
  sayT.innerHTML = sayT.textContent.split(" ").map(w => `<span class="w${HL.includes(w) ? " hl" : ""}">${w}</span> `).join("");
  const ws = $$(".say-t .w");
  const route = $("#ruta"), rLine = $("#rLine"), rKm = $("#rKm"), cBog = $("#cBog"), steps = $$(".r-step");
  const LEN = rLine.getTotalLength(); rLine.style.strokeDasharray = LEN; rLine.style.strokeDashoffset = LEN;
  const prog = el => { const r = el.getBoundingClientRect(); return cl(-r.top / (r.height - innerHeight)); };
  let lastStep = -1;
  function about() {
    const sp = RM ? 1 : prog(say), n = Math.round(sp * 1.15 * ws.length);
    ws.forEach((w, i) => w.classList.toggle("on", i < n));
    const rp = RM ? 1 : prog(route), lp = cl((rp - .15) / .7);
    rLine.style.strokeDashoffset = LEN * (1 - lp); rKm.textContent = Math.round(lp * 300);
    cBog.style.setProperty("--bo", lp > .97 ? 1 : 0);
    const st = rp < .36 ? 0 : rp < .7 ? 1 : 2;
    if (st !== lastStep) { lastStep = st; steps.forEach((s, i) => { s.classList.toggle("on", i === st); s.classList.toggle("past", i < st); }); }
  }
  $$(".b").forEach((b, i) => { b.style.transitionDelay = (i % 3 * .08) + "s"; io.observe(b); });
  function loop() {
    cx += (mx - cx) * .06;
    const hp = cl(scrollY / innerHeight);
    nav.classList.toggle("solid", scrollY > 40);
    if (!RM && hp < 1) {
      me.style.setProperty("--px", (cx * 22) + "px"); me.style.setProperty("--py", (hp * 140) + "px");
      title.style.setProperty("--ty", (hp * -120) + "px");
    }
    about();
    if (!drag) rot += (tgt - rot) * .045;
    ring.style.transform = `translateZ(${-RAD}px) rotateY(${rot}deg)`;
    scrs.forEach((e, i) => { const a = (((i * step + rot) % 360) + 360) % 360, d = Math.min(a, 360 - a) / 180; e.style.filter = RM ? "" : `blur(${(d * 7).toFixed(1)}px) brightness(${(1 - d * .65).toFixed(2)})`; });
    const fi = ((-Math.round(rot / step)) % N + N) % N; if (fi !== cur) { cur = fi; caption(fi); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
