// Agrega una entrada a la bitácora de ncls.lat y (opcional) la publica.
// Uso:
//   npm run bitacora                      → pregunta los datos paso a paso
//   npm run bitacora -- --titulo "X" --texto "Y" --tipo "Web" --imagen C:\ruta\foto.jpg --enlace https://... --publicar
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { extname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { createInterface } from "node:readline/promises";

const FILE = "src/content/bitacora.json";
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith("--") ? all[i + 1] : true]);
    return acc;
  }, []),
);
const cli = typeof args.titulo === "string";
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = async (k, q, req = false) => {
  if (typeof args[k] === "string") return args[k];
  if (cli) return "";
  for (;;) { const v = (await rl.question(q)).trim(); if (v || !req) return v; }
};

const d = new Date();
const hoy = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const titulo = await ask("titulo", "Título: ", true);
const texto = await ask("texto", "Texto corto (1-2 frases): ", true);
const tipo = (await ask("tipo", "Tipo [Web / Caso de estudio / Concepto web / Fan art / Redes / Video / Proceso]: ")) || "Proceso";
const imagenSrc = (await ask("imagen", "Ruta de imagen (opcional): ")).replace(/^"|"$/g, "");
const enlace = await ask("enlace", "Enlace (opcional): ");
const fecha = typeof args.fecha === "string" ? args.fecha : hoy;

const entry = { fecha, titulo, texto, tipo };
if (imagenSrc) {
  if (!existsSync(imagenSrc)) { console.error(`No encuentro la imagen: ${imagenSrc}`); process.exit(1); }
  const slug = titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  const name = `${fecha}-${slug}${extname(imagenSrc).toLowerCase()}`;
  mkdirSync("public/assets/bitacora", { recursive: true });
  copyFileSync(imagenSrc, join("public/assets/bitacora", name));
  entry.imagen = `/assets/bitacora/${name}`;
}
if (enlace) entry.enlace = enlace;

const list = JSON.parse(readFileSync(FILE, "utf8"));
list.unshift(entry);
writeFileSync(FILE, JSON.stringify(list, null, 2) + "\n");
console.log(`✓ Entrada agregada: ${fecha} · ${titulo}`);

let publicar = args.publicar === true;
if (!publicar && !cli) publicar = /^s/i.test(await rl.question("¿Publicar ahora en ncls.lat? (s/n): "));
rl.close();
if (publicar) {
  const git = (...a) => execFileSync("git", a, { stdio: "inherit" });
  git("add", FILE, ...(entry.imagen ? ["public/assets/bitacora"] : []));
  git("commit", "-m", `bitácora: ${titulo}`);
  git("push");
  console.log("✓ Publicado. GitHub Actions actualiza ncls.lat en ~2 minutos.");
} else {
  console.log("Guardado sin publicar. Para publicar: npm run bitacora:publicar");
}
