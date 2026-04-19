# Guía de commits — iteración Next.js (abril 2026)

Todo el trabajo de esta sesión está listo para subir. Sugiero **4 commits limpios**
que cuentan la historia del refactor sin mezclar scopes.

Antes de empezar:

```bash
# 1) Build local (la sandbox de Claude no tiene acceso a registry.npmjs.org
#    para bajar @next/swc, así que este paso lo corres tú):
npm run build

# 2) Genera los PDFs frescos (CV + carta) contra el /out recién construido:
node print.js
```

Verifica que aparezcan actualizados:

- `public/assets/Nicolas_Monroy_CV.pdf`
- `public/assets/Carta_de_Presentacion_Nicolas_Monroy.pdf`

Luego procede con los commits.

---

## Commit 1 · SEO técnico + metadata global

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx \
        src/app/cv/layout.tsx src/app/carta/layout.tsx

git commit -m "feat(seo): sitemap, robots y metadata por ruta (Next 16 conventions)

- app/sitemap.ts y app/robots.ts como metadata routes (conventions v16)
- robots permite Googlebot, Bingbot, DuckDuckBot, GPTBot, ClaudeBot,
  Google-Extended, PerplexityBot (AI crawlers explícitos)
- layout raíz con metadataBase, title template, openGraph (es_CO),
  twitter card y JSON-LD Person schema
- layouts independientes para /cv y /carta con canonical + OG por ruta
- viewport export con themeColor array (dark/light)"
```

---

## Commit 2 · Carta real + código muerto limpio

```bash
git add src/app/carta/page.tsx src/components/blocks/hero-section-9.tsx

git commit -m "refactor(carta): reemplaza métricas inventadas por claims verificables

- Quita 'más de 3 años', '+70% eficiencia' y KPIs no auditables
- Sustituye por descripción honesta de roles en MIP, Cambio Radical, Districol
- KPIs ahora: Enfoque B2B · Remoto GMT-5 · Abierto a ofertas
- hero-section-9.tsx marcado @deprecated (stub) — sin imports activos"
```

---

## Commit 3 · print.js portable + CV web rediseñado

```bash
git add print.js src/app/cv/page.tsx \
        public/assets/Nicolas_Monroy_CV.pdf \
        public/assets/Carta_de_Presentacion_Nicolas_Monroy.pdf

git commit -m "feat(cv+print): CV web rediseñado + script de PDFs portable

- print.js: elimina paths hardcodeados (Windows-only), usa path.resolve
  relativo y fallback msedge → chrome → chromium bundle
- CV web con tema dark alineado al portfolio (acid #C6FF3D, JetBrains Mono)
- Sidebar 260px: stack con badges PRO/INT, barras visuales de idiomas
- Main: experiencia con timeline dots, 4 proyectos reales, formación
- Animaciones cvRise escalonadas + respeto a prefers-reduced-motion
- @media print: A4 12/14mm, paleta invertida, animaciones off
- Brand icons (LinkedIn/GitHub) inline SVG — Lucide los removió en 2024
- PDFs regenerados con los nuevos diseños y contenido honesto"
```

---

## Commit 4 · Animaciones llamativas en home

```bash
git add src/app/globals.css src/components/ui/reveal.tsx \
        src/components/blocks/topbar.tsx \
        src/components/blocks/profile.tsx \
        src/components/blocks/projects.tsx \
        src/components/blocks/experience.tsx \
        src/components/blocks/skills.tsx \
        src/components/blocks/contact.tsx

git commit -m "feat(motion): scroll-reveal system + micro-interactions en todo el home

- Nuevo componente <Reveal /> (IntersectionObserver, variants up/left/right/scale/blur)
- Sistema de delays 1..8 para secuenciar entradas dentro de cada sección
- Topbar con scroll-progress bar + backdrop que se intensifica al scrollear
- text-shine, acid-glow, acid-pulse, float-y, flicker, scanline-layer
- hover-lift con shadow acid en tiles + nav-underline animado
- Profile: 4 avatares + 3 pulse-cards animados (scanline, acid-glow)
- Projects: barra inferior que completa al hover, flecha deslizante
- Experience: timeline dots con halo acid + tags que saltan al hover
- Skills: iconos que rotan+escalan + scanline emergente en las tiles
- Contact: tarjetas con variant left/right + gradient sweep en CTA Calendly
- Footer: NCLS.DEV con dot acid-pulse + nav-underline en links
- Respeta prefers-reduced-motion en todos los efectos"
```

---

## Push final

```bash
git push origin main
```

---

## Verificación rápida post-push

- Home carga con topbar sticky + barra de progreso funcionando
- Secciones aparecen con fade/slide al scrollear (si no hay reduced-motion)
- `/sitemap.xml` y `/robots.txt` responden con el dominio correcto
- `/cv` se ve bonita online y se imprime en A4 limpio
- `/carta` sin métricas fantasma, con KPIs reales
- Assets de PDF accesibles en `/NICOLAS-HYBRID-PORTFOLIO/assets/*.pdf`

---

## Si prefieres un solo commit grande

```bash
git add src/ public/assets/ print.js COMMITS_GUIA.md
git commit -m "feat: portfolio v2 — SEO, CV rediseñado, carta real y motion design"
git push origin main
```

---

## Notas

- Los archivos dentro de `legacy-html/` y `.agent/` son ruido de ediciones previas
  que ya no afectan al build. No hace falta subirlos en este push; si quieres
  limpiarlos usa un commit separado o un `git restore` selectivo.
- El `COMMITS_GUIA.md` puedes borrarlo después del push si no quieres dejarlo
  en el repo, o moverlo a `/docs` para futuras iteraciones.
