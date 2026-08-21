import type { MetadataRoute } from "next";

/**
 * Robots generado con la convención de Next 16 (app/robots.ts).
 *
 * Permite el indexado completo por motores de búsqueda tradicionales
 * (Google, Bing, DuckDuckGo, Yandex) y por los crawlers de los principales
 * modelos y agentes de IA (ChatGPT, Claude, Gemini, Perplexity, Cohere, Meta, Apple),
 * optimizando el posicionamiento en motores de búsqueda generativos (GEO / Generative Engine Optimization).
 */

const BASE_URL = "https://ncls.lat";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Traditional Search Engine Crawlers
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "YandexBot", allow: "/" },
      { userAgent: "Baiduspider", allow: "/" },

      // AI & LLM Search Crawlers (Generative Engine Optimization)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GoogleOther", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "Bytespider", allow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

