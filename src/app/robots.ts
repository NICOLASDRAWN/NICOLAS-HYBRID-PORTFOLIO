import type { MetadataRoute } from "next";

/**
 * Robots generado con la convención de Next 16 (app/robots.ts).
 *
 * Permite el indexado por motores de búsqueda tradicionales y por
 * los crawlers de los principales asistentes de IA (ChatGPT, Claude,
 * Gemini, Perplexity), que cada vez más son la puerta de entrada
 * desde donde reclutadores y empresas descubren perfiles.
 */

const BASE_URL = "https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },

      // AI search crawlers — descubrimiento por asistentes
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
