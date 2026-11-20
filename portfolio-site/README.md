# Portafolio editorial de Nicolás Monroy

Diseño importado de `nicolas-monroy-portfolio` el 20 de noviembre de 2026.

La portada es HTML/CSS/JS autónomo. `npm run build` exporta las rutas existentes de Next.js y después `scripts/export-portfolio.mjs` incorpora esta portada y sus imágenes en `out/`. El workflow de Pages usa el mismo comando. No se publican las capturas de Behance ni el archivo v1.

Para revisar la portada sin compilar Next: `python -m http.server 9989 --directory portfolio-site`.
Para revisar el sitio completo compilado: `python -m http.server 9989 --directory out`.

El formulario prepara un mensaje en WhatsApp; el visitante confirma el envío allí. No hay backend de correo ni se simula una confirmación de entrega.
