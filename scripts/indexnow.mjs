// Avisa a Bing, Yandex, Seznam y Naver (IndexNow) de todas las URL del sitemap publicado.
const HOST = "ncls.lat";
const KEY = "96bef5449df84c559e380b60dad16931";
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} · ${urlList.length} URL enviadas`);
if (res.status >= 400 && res.status !== 429) process.exitCode = 1;
