import { GoogleGenAI, Type } from "@google/genai";
import { api } from "./api";

// Helper para obtener la API Key de manera segura (Local o Config Backend)
const getApiKey = async (): Promise<string | null> => {
  try {
    // 1. Prioridad: Configuración guardada por el usuario
    try {
        const config = await api.getBackupConfig();
        if (config.geminiApiKey) return config.geminiApiKey;
    } catch (e) {
        console.warn("No se pudo leer config del backend para AI Key");
    }

    // 2. Variables de entorno (Desarrollo)
    if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    return null;
  }
  return null;
};

// Initialize the client safely (Async now)
const getAiClient = async () => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.warn("Gemini API Key no encontrada. Las funciones de IA estarán deshabilitadas.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Error inicializando cliente de IA:", error);
    return null;
  }
};

export const suggestSectors = async (description: string): Promise<string[]> => {
  // Si no hay descripción válida, retorna vacío rápido
  if (!description || typeof description !== 'string') return [];

  const ai = await getAiClient();
  // Si no hay cliente (sin API key), retorna simulación o vacío
  if (!ai) return ["Servicios Generales"]; 

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following supplier description and suggest 3 to 5 short, professional business sectors or tags (e.g., "Logistics", "Cloud Computing", "Office Supplies"). Description: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sectors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text() || '{"sectors": []}');
    return json.sectors || [];
  } catch (error) {
    console.warn("Aviso: No se pudo conectar con la IA para sugerir sectores (probablemente sin API Key).", error);
    return ["Servicios Generales"];
  }
};

export const analyzeDocument = async (fileName: string, content: string): Promise<string> => {
  const ai = await getAiClient();
  if (!ai) return "Análisis de IA no disponible (Falta API Key). Ve a Configuración para añadirla.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert procurement assistant. Analyze the following document content named "${fileName}". Provide a concise 2-sentence summary of what this document contains and its importance (e.g., "This is a service agreement valid until 2025...").
      
      Document Content:
      ${content.substring(0, 10000)} // Limit characters for prototype safety
      `,
    });

    return response.text() || "No summary generated.";
  } catch (error) {
    console.warn("Error analizando documento con IA:", error);
    return "No se pudo analizar el documento. Verifique su API Key.";
  }
};
