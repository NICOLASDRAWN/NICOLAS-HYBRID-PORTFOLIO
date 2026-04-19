import type { MetadataRoute } from "next";

/**
 * Sitemap generado con la convención de Next 16 (app/sitemap.ts).
 *
 * Con `output: 'export'` en next.config.ts, este archivo se pre-renderiza
 * a `out/sitemap.xml` en build time y queda servido estáticamente
 * en GitHub Pages bajo:
 *
 *     https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO/sitemap.xml
 */

const BASE_URL = "https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cv`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/carta`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
