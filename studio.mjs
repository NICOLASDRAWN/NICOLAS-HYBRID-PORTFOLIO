import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = __dirname;
const DESKTOP_DIR = path.join('C:', 'Users', 'nicol', 'Desktop', 'NICOLAS_SOCIAL');
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/studio`;

// Configuración de FFmpeg portátil
const FFMPEG_PATH = `C:\\Users\\nicol\\.gemini\\antigravity\\scratch\\ffmpeg_extracted\\ffmpeg-8.1-essentials_build\\bin\\ffmpeg.exe`;

async function generateAssets() {
  if (!fs.existsSync(DESKTOP_DIR)) {
    fs.mkdirSync(DESKTOP_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  const formats = [
    { name: 'post', suffix: 'POST_SQ', w: 1080, h: 1080 },
    { name: 'story', suffix: 'STORY_916', w: 1080, h: 1920 }
  ];

  for (const format of formats) {
    const page = await context.newPage();
    const url = `${BASE_URL}?format=${format.name}`;
    
    console.log(`\n[${format.name.toUpperCase()}] Iniciando exportación técnica...`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      
      // 1. Exportar PNG estático (High-Res)
      const pngPath = path.resolve(DESKTOP_DIR, `N_${format.suffix}.png`);
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: pngPath,
        clip: { x: 0, y: 0, width: format.w, height: format.h }
      });
      console.log(`[PNG] Guardado en: ${pngPath}`);

      // 2. Exportar VIDEO (Frame-by-frame)
      console.log(`[VIDEO] Capturando frames (60 FPS)...`);
      const tempFramesDir = path.join(ROOT, 'temp_frames');
      if (!fs.existsSync(tempFramesDir)) fs.mkdirSync(tempFramesDir);

      const totalFrames = 120; // 2 segundos a 60fps
      for (let i = 0; i < totalFrames; i++) {
        const framePath = path.join(tempFramesDir, `frame_${i.toString().padStart(3, '0')}.png`);
        await page.screenshot({
          path: framePath,
          clip: { x: 0, y: 0, width: format.w, height: format.h }
        });
        // Aquí podrías usar page.evaluate para avanzar la animación si fuera manual,
        // pero Framer Motion corre por tiempo real, así que capturamos en ráfaga.
      }

      const videoPath = path.resolve(DESKTOP_DIR, `N_${format.suffix}.mp4`);
      const gifPath = path.resolve(DESKTOP_DIR, `N_${format.suffix}.gif`);

      // Comando FFmpeg para MP4
      const ffmpegCmd = `"${FFMPEG_PATH}" -y -framerate 60 -i "${path.join(tempFramesDir, 'frame_%03d.png')}" -c:v libx264 -pix_fmt yuv420p "${videoPath}"`;
      
      // Comando FFmpeg para GIF de alta calidad
      const gifCmd = `"${FFMPEG_PATH}" -y -i "${videoPath}" -vf "fps=30,scale=${format.w}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${gifPath}"`;

      console.log(`[FFMPEG] Procesando MP4...`);
      execSync(ffmpegCmd);
      console.log(`[FFMPEG] Procesando GIF...`);
      execSync(gifCmd);

      // Limpieza
      fs.rmSync(tempFramesDir, { recursive: true, force: true });
      
    } catch (err) {
      console.error(`[ERROR]`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n✅ ESTUDIO FINALIZADO: Revisa la carpeta NICOLAS_SOCIAL en tu escritorio.');
}

generateAssets();
