# Nicolás Monroy Pabón — Portafolio
Sitio profesional con proyectos de diseño y desarrollo. Casos empresariales anonimizados; no incluye aplicaciones internas ni sus datos.

**Sitio:** https://ncls.lat/

## Desarrollo
Requiere Node.js 22 y npm.

```bash
npm ci
npm run dev
```

## Validación y publicación
```bash
npm run check:public
npm run typecheck
npm run lint
npm run build
```

GitHub Actions publica exclusivamente `out/` en GitHub Pages. Next.js usa exportación estática, rutas con barra final y el dominio de `public/CNAME`.

## Estructura
- `src/app/`: páginas y metadatos.
- `src/components/`: interfaz.
- `public/`: recursos públicos y demos.
- `scripts/check-public.mjs`: evita versionar carpetas internas conocidas.

El CV y la carta se imprimen desde sus páginas actualizadas.

## Privacidad
No agregar bases de datos, sesiones, documentos empresariales, credenciales ni capturas internas. Limpiar el último commit no elimina versiones anteriores del historial.
