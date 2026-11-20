import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('portfolio-site');
const output = resolve('out');
if (!existsSync(resolve(output, 'cv.html')) && !existsSync(resolve(output, 'cv/index.html'))) {
  throw new Error('Build Next.js before composing the portfolio export.');
}
for (const file of ['index.html', 'styles.css', 'main.js', 'assets', 'en']) {
  cpSync(resolve(source, file), resolve(output, file), { recursive: true });
}
writeFileSync(resolve(output, '.nojekyll'), '');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="((?:assets\/)[^"]+)"/g)) {
  if (!existsSync(resolve(output, match[1]))) throw new Error(`Missing asset: ${match[1]}`);
}
console.log('Portfolio homepage exported; existing CV, letters and service routes preserved.');
