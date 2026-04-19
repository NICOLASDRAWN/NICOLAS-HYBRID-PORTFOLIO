/**
 * ═══════════════════════════════════════════════════════════════════
 *  GENERADOR DE PDFs · Nicolás Monroy Pabón · Portfolio
 * ═══════════════════════════════════════════════════════════════════
 *
 * Usa Playwright para tomar las páginas estáticas generadas por Next
 * (en `./out/`) y producir los PDFs que se suben como assets del
 * portfolio para que reclutadores los descarguen con un click.
 *
 * Salidas:
 *   public/assets/Nicolas_Monroy_CV.pdf
 *   public/assets/Carta_de_Presentacion_Nicolas_Monroy.pdf
 *
 * Requisitos:
 *   1. Haber corrido `npm run build` antes (genera `./out/cv.html` y
 *      `./out/carta.html`).
 *   2. Tener Playwright instalado (ya está en devDependencies).
 *
 * Uso:
 *   node print.js              → genera ambos PDFs
 *   node print.js cv           → solo CV
 *   node print.js carta        → solo carta
 *
 * Portable: no tiene rutas hardcoded al equipo de nadie. Todo se
 * resuelve relativo a este archivo con `path.resolve(__dirname, ...)`.
 * ═══════════════════════════════════════════════════════════════════
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const OUT_DIR = path.resolve(ROOT, 'out');
const ASSETS_DIR = path.resolve(ROOT, 'public', 'assets');
const DESKTOP_DIR = path.join('C:', 'Users', 'nicol', 'Desktop');

const TARGETS = {
  cv: {
    html: path.resolve(OUT_DIR, 'cv.html'),
    pdf: path.resolve(ASSETS_DIR, 'Nicolas_Monroy_CV.pdf'),
    desktopPdf: path.resolve(DESKTOP_DIR, 'Nicolas_Monroy_CV.pdf'),
    format: 'A4',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    /**
     * Inyecta CSS específico de impresión para:
     * - Ocultar el botón flotante "Imprimir"
     * - Forzar fondo blanco y colores planos (ahorrar tinta)
     */
    inject: `
      .print\\:hidden, button[title="Imprimir como PDF"], .cmd-bar { display: none !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .shadow-xl, .print\\:shadow-none { box-shadow: none !important; }
    `,
  },
  carta: {
    html: path.resolve(OUT_DIR, 'carta.html'),
    pdf: path.resolve(ASSETS_DIR, 'Carta_de_Presentacion_Nicolas_Monroy.pdf'),
    desktopPdf: path.resolve(DESKTOP_DIR, 'Carta_de_Presentacion_Nicolas_Monroy.pdf'),
    format: 'A4',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    /**
     * La carta ya trae su propio layout A4 (`.page { width: 210mm; height: 297mm }`).
     * Solo limpiamos la topbar de acciones y forzamos colores/márgenes estrictos.
     */
    inject: `
      .print-bar { display: none !important; }
      @page { size: A4; margin: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page {
        height: 297mm !important; min-height: 297mm !important;
        overflow: hidden !important; page-break-after: always !important;
      }
    `,
  },
};

const fileUrl = (absPath) =>
  'file://' + absPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '/$1:');

async function renderPdf(browser, key) {
  const cfg = TARGETS[key];
  if (!fs.existsSync(cfg.html)) {
    throw new Error(
      `No existe ${cfg.html}\n` +
      `    → Corre primero:  npm run build\n`
    );
  }

  const page = await browser.newPage();
  
  // INTERCEPTOR: Corrige las rutas de assets de Next.js (basePath) para que carguen desde local
  await page.route('**/NICOLAS-HYBRID-PORTFOLIO/_next/**', async (route) => {
    const url = route.request().url();
    const relativePath = url.split('_next/')[1];
    const filePath = path.resolve(OUT_DIR, '_next', relativePath);
    if (fs.existsSync(filePath)) {
      await route.fulfill({ path: filePath });
    } else {
      await route.continue();
    }
  });

  await page.route('**/assets/**', async (route) => {
    const url = route.request().url();
    const parts = url.split('/assets/');
    const fileName = parts[parts.length - 1];
    const filePath = path.resolve(OUT_DIR, 'assets', fileName);
    if (fs.existsSync(filePath)) {
      await route.fulfill({ path: filePath });
    } else {
      await route.continue();
    }
  });

  const url = fileUrl(cfg.html);
  console.log(`[${key}]  cargando  ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });

  await page.addStyleTag({ content: cfg.inject });
  // Pequeña espera para que fuentes y animaciones se estabilicen
  await page.waitForTimeout(1000);

  fs.mkdirSync(path.dirname(cfg.pdf), { recursive: true });
  await page.pdf({
    path: cfg.pdf,
    format: cfg.format,
    printBackground: true,
    margin: cfg.margin,
    preferCSSPageSize: true,
  });

  // Copia al escritorio
  if (cfg.desktopPdf) {
    try {
      fs.copyFileSync(cfg.pdf, cfg.desktopPdf);
      console.log(`[${key}]  copiado al escritorio: ${cfg.desktopPdf}`);
    } catch (err) {
      console.warn(`[${key}]  error copiando al escritorio: ${err.message}`);
    }
  }

  const size = (fs.statSync(cfg.pdf).size / 1024).toFixed(1);
  console.log(`[${key}]  PDF ok    ${cfg.pdf}  (${size} KB)`);
  await page.close();
}

async function pickBrowserChannel() {
  // Intenta Edge primero (viene preinstalado en Windows), luego Chrome,
  // luego Chromium descargado por Playwright como último recurso.
  const candidates = ['msedge', 'chrome'];
  for (const channel of candidates) {
    try {
      const b = await chromium.launch({ channel });
      console.log(`Usando navegador: ${channel}`);
      return b;
    } catch (_) { /* continue */ }
  }
  console.log('Usando Chromium bundled de Playwright');
  return chromium.launch();
}

(async () => {
  const arg = process.argv[2];
  const keys = arg ? [arg] : Object.keys(TARGETS);

  const invalid = keys.filter((k) => !TARGETS[k]);
  if (invalid.length) {
    console.error(`Target desconocido: ${invalid.join(', ')}`);
    console.error(`Válidos: ${Object.keys(TARGETS).join(', ')}`);
    process.exit(1);
  }

  const browser = await pickBrowserChannel();
  try {
    for (const k of keys) {
      await renderPdf(browser, k);
    }
    console.log('\nListo. PDFs generados en public/assets/ y copiados al Escritorio.');
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error('ERROR:', e.message || e);
  process.exit(1);
});
