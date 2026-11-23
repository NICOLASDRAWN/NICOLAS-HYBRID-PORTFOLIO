import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('portfolio-site');
const output = resolve('out');
if (!existsSync(resolve(output, 'cv.html')) && !existsSync(resolve(output, 'cv/index.html'))) {
  throw new Error('Build Next.js before composing the portfolio export.');
}
for (const file of ['styles.css', 'main.js', 'assets', 'en']) {
  cpSync(resolve(source, file), resolve(output, file), { recursive: true });
}
writeFileSync(resolve(output, '.nojekyll'), '');
const html = readFileSync(resolve(output, 'en/index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="((?:assets\/)[^"]+)"/g)) {
  if (!existsSync(resolve(output, match[1]))) throw new Error(`Missing asset: ${match[1]}`);
}
console.log('Portfolio homepage exported; existing CV, letters and service routes preserved.');

const decode = text => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
for (const page of ['index.html', 'en/index.html']) {
  const url = new URL(page === 'index.html' ? '/' : '/en/', 'https://ncls.lat');
  let content = readFileSync(resolve(output, page), 'utf8').match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!content) throw new Error(`Missing main content: ${page}`);
  content = content.replace(/<form[\s\S]*?<\/form>/gi, '').replace(/<button[\s\S]*?<\/button>/gi, '');
  content = content.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => `[${text.replace(/<[^>]*>/g, ' ').trim()}](${new URL(decode(href), url).href})`);
  content = content.replace(/<h([1-6])[^>]*>/gi, (_, n) => '\n\n' + '#'.repeat(Number(n)) + ' ').replace(/<\/h[1-6]>/gi, '\n\n');
  content = content.replace(/<li[^>]*>/gi, '\n- ').replace(/<br\s*\/?>/gi, ' ').replace(/<\/(?:p|div|section|ul|ol|dl|dt|dd|footer|nav)>/gi, '\n\n');
  content = decode(content.replace(/<[^>]*>/g, ' ')).split('\n').map(line => line.replace(/\s+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  writeFileSync(resolve(output, page.replace('.html', '.md')), content + '\n');
}
