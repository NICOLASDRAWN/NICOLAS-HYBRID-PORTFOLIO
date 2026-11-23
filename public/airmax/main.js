(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body, RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  body.classList.add("loading");

  /* loader */
  const gFill = $("#gFill"), psi = $("#psi");
  let t0 = performance.now();
  (function load(t) {
    const p = Math.min(1, (t - t0) / (RM ? 300 : 1700)), e = 1 - Math.pow(1 - p, 3);
    gFill.style.strokeDashoffset = 252 * (1 - e); psi.textContent = String(Math.round(e * 25)).padStart(2, "0");
    if (p < 1) return requestAnimationFrame(load);
    setTimeout(() => { $("#loader").classList.add("out"); body.classList.remove("loading"); setTimeout(() => $(".hero").classList.add("ready"), 1100); }, 250);
  })(t0);

  /* colorways */
  const CW = [
    { k: "white", name: "Air Max Classic", price: "$129.99", n: "01" },
    { k: "black", name: "Air Max Pulse", price: "$139.99", n: "02" },
    { k: "red", name: "Air Max 270", price: "$129.99", n: "03" }
  ];
  let ci = 0;
  const shoe = $("#shoe");
  function setCw(i, from) {
    ci = (i + CW.length) % CW.length; const c = CW[ci];
    body.className = body.className.replace(/cw-\w+/, "cw-" + c.k);
    $("#cwN").textContent = c.n; $("#bName").textContent = c.name; $("#bPrice").textContent = c.price;
    $$(".card").forEach(b => b.classList.toggle("on", b.dataset.cw === c.k));
    const r = $(`input[name=cw][value=${c.k}]`); if (r && from !== "form") r.checked = true;
    if (from !== "init") { shoe.classList.remove("swap"); void shoe.offsetWidth; shoe.classList.add("swap"); }
  }
  $("#prev").onclick = () => setCw(ci - 1); $("#next").onclick = () => setCw(ci + 1);
  $$(".card").forEach(b => b.onclick = () => setCw(CW.findIndex(c => c.k === b.dataset.cw)));
  $$(".nav-a").forEach(b => b.onclick = () => setCw(ci + +b.dataset.d));
  $$("input[name=cw]").forEach(r => r.onchange = () => setCw(CW.findIndex(c => c.k === r.value), "form"));
  addEventListener("keydown", e => { if (e.target.closest("input,button,textarea")) return; if (e.key === "ArrowDown" && scrollY < 50) { e.preventDefault(); setCw(ci + 1); } if (e.key === "ArrowUp" && scrollY < 50) { e.preventDefault(); setCw(ci - 1); } });
  setCw(0, "init");

  /* cursor + tilt + parallax */
  const cross = $("#cross"), hero = $(".hero"), ghost = $("#ghost"), shadow = $("#shadow"), rock = $("#rock");
  let mx = innerWidth / 2, my = innerHeight / 2, tx = 0, ty = 0;
  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY; cross.style.opacity = 1;
    cross.style.left = mx + "px"; cross.style.top = my + "px";
    cross.classList.toggle("big", !!e.target.closest("a,button,label,.press"));
    cross.classList.toggle("inv", !!e.target.closest(".tech,.author,.foot,.marquee,.loader,.modal"));
  }, { passive: true });
  function frame(t) {
    const nx = mx / innerWidth - .5, ny = my / innerHeight - .5;
    tx += (nx - tx) * .08; ty += (ny - ty) * .08;
    if (!RM && scrollY < innerHeight * 1.2) {
      const fy = Math.sin(t / 900) * 12;
      shoe.style.setProperty("--ry", tx * 22 + "deg"); shoe.style.setProperty("--rx", -ty * 14 + "deg"); shoe.style.setProperty("--fy", fy + "px");
      shadow.style.setProperty("--ss", 1 - fy / 60);
      ghost.style.setProperty("--gx", -tx * 60 - scrollY * .25 + "px");
      hero.style.setProperty("--bx", tx * 24 + "px");
      rock.style.setProperty("--ry2", scrollY * .12 + "px");
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* nav + pill + heel */
  const nav = $("#nav"), pf = $("#pf"), heel = $(".heel img"), tech = $("#tech");
  function onScroll() {
    nav.classList.toggle("solid", scrollY > 40);
    pf.classList.toggle("show", scrollY > innerHeight * .7);
    const r = tech.getBoundingClientRect(), p = 1 - (r.top + r.height) / (innerHeight + r.height);
    heel.style.setProperty("--hs", 1.25 - Math.max(0, Math.min(1, p)) * .2);
    spinUpdate();
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* spin section */
  const spin = $("#spin"), spinShoe = $("#spinShoe"), specs = $$("#specs li"), big = $(".spin-big"), pin = $(".spin-pin");
  function spinUpdate() {
    const r = spin.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
    if (r.top > innerHeight || r.bottom < 0) return;
    spinShoe.style.setProperty("--sr", (-18 + p * 30) + "deg");
    spinShoe.style.setProperty("--sc", .7 + Math.sin(p * Math.PI) * .45);
    spinShoe.style.transform = `perspective(1400px) rotateY(${(p - .5) * 50}deg) rotate(var(--sr)) scale(var(--sc)) translateX(${(p - .5) * -10}vw)`;
    big.style.setProperty("--sx", (.5 - p) * 40 + "vw");
    pin.style.setProperty("--sp", p);
    const k = Math.min(specs.length - 1, Math.floor(p * specs.length));
    specs.forEach((li, i) => li.classList.toggle("on", i === k));
  }
  $(".spin-bar i").style.transform = "scaleX(var(--sp))";

  /* sizes + add to bag (4 states) */
  const sizes = $("#sizes"), sold = [38, 45.5];
  [38, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5].forEach(s => {
    const b = document.createElement("button"); b.type = "button"; b.textContent = s; b.setAttribute("aria-pressed", "false");
    if (sold.includes(s)) { b.disabled = true; b.title = "Agotada"; }
    b.onclick = () => { $$("button", sizes).forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); sizes.classList.remove("need"); };
    sizes.append(b);
  });
  const add = $("#add"), addTxt = $("#addTxt"), msg = $("#addMsg"), bagN = $("#bagN"), bag = $(".bag");
  let n = 0;
  $("#bForm").onsubmit = e => {
    e.preventDefault();
    const sel = $("button[aria-pressed=true]", sizes);
    if (!sel) { add.dataset.s = "error"; addTxt.textContent = "Elige una talla"; msg.textContent = "Falta la talla."; sizes.classList.remove("need"); void sizes.offsetWidth; sizes.classList.add("need"); setTimeout(() => { add.dataset.s = ""; addTxt.textContent = "Añadir a la bolsa"; }, 1600); return; }
    add.dataset.s = "loading"; addTxt.textContent = "Añadiendo…"; add.querySelector("i").textContent = "◌";
    setTimeout(() => {
      add.dataset.s = "success"; addTxt.textContent = "En tu bolsa ✓"; add.querySelector("i").textContent = "→";
      bagN.textContent = ++n; bagN.classList.add("on"); bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump");
      msg.textContent = `${CW[ci].name} · EU ${sel.textContent} · demo, sin pago.`;
      setTimeout(() => { add.dataset.s = ""; addTxt.textContent = "Añadir a la bolsa"; }, 2200);
    }, 900);
  };

  /* air chamber */
  const cv = $("#air"), ctx = cv.getContext("2d"), press = $("#press"), pPsi = $("#pressPsi"), pTxt = $("#pressTxt");
  let down = false, c = 0, v = 0, parts = [];
  function size() { const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio); cv.width = r.width * d; cv.height = r.height * d; }
  size(); addEventListener("resize", size);
  const on = () => { down = true; press.classList.add("on"); pTxt.textContent = "Comprimiendo"; };
  const off = () => { if (!down) return; down = false; press.classList.remove("on"); pTxt.textContent = "¡Retorno de energía!";
    for (let i = 0; i < 40; i++) parts.push({ x: .5, y: .5, vx: (Math.random() - .5) * .03, vy: (Math.random() - .5) * .03, l: 1 });
    setTimeout(() => pTxt.textContent = "Mantén presionado", 1400); };
  press.addEventListener("pointerdown", e => { press.setPointerCapture(e.pointerId); on(); });
  press.addEventListener("pointerup", off); press.addEventListener("pointercancel", off);
  press.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); on(); } });
  press.addEventListener("keyup", off); press.tabIndex = 0;
  function air() {
    const target = down ? 1 : 0; v += (target - c) * .08; v *= .82; c += v;
    const W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.62);
    const sq = Math.max(-.3, c);
    for (let i = -1; i <= 1; i++) {
      const x = i * W * .2, rx = W * .075 * (1 + sq * .55), ry = W * .1 * (1 - sq * .45);
      const g = ctx.createRadialGradient(x - rx * .3, -ry * .3, 2, x, 0, Math.max(rx, ry));
      g.addColorStop(0, `rgba(255,255,255,${.35 + c * .3})`); g.addColorStop(.6, `rgba(255,${120 - c * 90},${120 - c * 90},${.12 + c * .35})`); g.addColorStop(1, "rgba(211,18,27,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, 0, rx, ry, 0, 0, 7); ctx.fill();
    }
    ctx.restore();
    parts = parts.filter(p => (p.l -= .02) > 0);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; ctx.fillStyle = `rgba(255,70,70,${p.l})`; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 3 * Math.min(2, devicePixelRatio), 0, 7); ctx.fill(); });
    pPsi.textContent = Math.round(25 + Math.max(0, c) * 35);
    requestAnimationFrame(air);
  }
  air();

  /* story modal */
  const modal = $("#modal"), mLine = $("#mLine"), mFill = $("#mFill"), LINES = ["Air you can see.", "1987.", "Una ventana en el talón.", "Una revolución.", "The icon of air.", "Now in a new era."];
  let mT;
  $("#story").onclick = () => {
    modal.showModal(); let i = 0, t = performance.now();
    const step = () => { mLine.classList.add("out"); setTimeout(() => { mLine.textContent = LINES[i]; mLine.classList.remove("out"); }, 350); };
    step(); clearInterval(mT); mT = setInterval(() => { i = (i + 1) % LINES.length; step(); }, 1800);
    (function bar(n) { if (!modal.open) return; mFill.style.width = ((n - t) / (LINES.length * 1800) * 100) % 100 + "%"; requestAnimationFrame(bar); })(t);
  };
  $("#close").onclick = () => modal.close(); modal.addEventListener("close", () => clearInterval(mT));
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  $$(".t-copy,.press,.b-form,.b-view,.author>*").forEach(el => { el.classList.add("rv"); io.observe(el); });
  onScroll();
})();
