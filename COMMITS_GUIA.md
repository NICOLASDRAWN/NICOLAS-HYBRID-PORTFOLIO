# Guía de commits para `git push`

Todo está validado y listo. Sugiero **3 commits limpios y descriptivos** para que el historial de la mejora quede claro en GitHub:

---

## Commit 1 · Hero, case studies y modalidades de trabajo

```bash
git add index.html index.css
git commit -m "feat(home): hero rediseñado + case studies cualitativos + modalidades

- Badge 'DISPONIBLE INMEDIATAMENTE · Respuesta en <24h' con dot pulsante
- 3 CTAs jerárquicos (Calendly / Descargar CV / Ver proyectos)
- Meta disponibilidad: Full-time / Contract / Freelance · GMT-5 · ES/EN B2
- Case studies con estructura Problema → Solución → Impacto (sin métricas inventadas)
- Nueva sección #06 Modalidades de trabajo (3 tarjetas, Contract destacada)
- Renumeración: Hobbies #07, Contacto #08
- CTAs XL en sección contacto + link a GitHub"
```

---

## Commit 2 · Animaciones premium y motion design

```bash
git add backgrounds.js
git commit -m "feat(motion): constellation particles + text scramble + parallax

- Canvas particles con conexiones dinámicas (constelación)
- Repulsión sutil con el mouse (radio 140px)
- TextScramble class para headings con atributo data-scramble
- Parallax scroll en hero code background
- Respeta prefers-reduced-motion"
```

---

## Commit 3 · SEO, Analytics y assets descargables

```bash
git add sitemap.xml robots.txt assets/Nicolas_Monroy_CV.pdf assets/Carta_Presentacion_Template.docx README.md .gitignore
git commit -m "feat(seo): sitemap + robots + JSON-LD + analytics + CV/carta

- sitemap.xml con 4 URLs (home + 3 proyectos)
- robots.txt permite Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot
- JSON-LD @graph con schema.org/CreativeWork por proyecto (embebido en index.html)
- Plausible Analytics (privacy-first, sin cookies)
- CV PDF profesional (2 páginas, Clean & Efficient)
- Carta de presentación .docx editable con placeholders [EMPRESA], [ROL], etc."
```

---

## Push final

```bash
git push origin main
```

---

## Notas

- Los cambios dentro de `projects/ecommerce/` y `projects/gestor-compras/` ya existían antes, no son parte de esta iteración. Puedes decidir si los commits aparte o junto con este push según tu flujo habitual.
- Si prefieres **un solo commit grande**, puedes usar:

  ```bash
  git add index.html index.css backgrounds.js sitemap.xml robots.txt assets/Nicolas_Monroy_CV.pdf assets/Carta_Presentacion_Template.docx README.md .gitignore
  git commit -m "feat: rediseño portfolio — hero premium, SEO, CV y modalidades"
  git push origin main
  ```

- La carta `.docx` es tu plantilla personal para enviar por correo. **No es necesario que la publiques en el sitio**, pero si quieres un link de descarga se puede agregar después.
