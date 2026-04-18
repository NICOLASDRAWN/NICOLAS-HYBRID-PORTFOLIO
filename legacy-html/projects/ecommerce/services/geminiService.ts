
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateMachineryInsight(name: string, brand: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Proporciona un resumen breve y profesional (en español) sobre las ventajas de comprar una ${brand} ${name} de segunda mano para una flota industrial.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Obtén el máximo rendimiento con maquinaria de confianza líder en el sector.";
  }
}
