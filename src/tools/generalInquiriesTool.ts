import { z } from "genkit";
import { ai } from "../libs/genkit.ts";
import { generalInquiries } from "../data/generalInquiries.ts";

const { faq_agencia_autos } = generalInquiries;

// Helper para calcular similitud entre dos textos ignorando mayúsculas, signos de puntuación y palabras muy cortas
function calculateSimilarity(str1: string, str2: string): number {
    const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9áéíóúñ\s]/g, '').trim().split(/\s+/).filter(w => w.length > 2 || w === 'no' || w === 'si' || w === 'sí');
    const words1 = cleanStr(str1);
    const words2 = cleanStr(str2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    let intersection = 0;
    for (const w of set1) {
        if (set2.has(w)) intersection++;
    }

    return (2.0 * intersection) / (set1.size + set2.size);
}

const buscarEnFAQTool = ai.defineTool({
    name: "buscarEnFAQTool",
    description: "Responde preguntas generales sobre la agencia de autos revisando el FAQ.",
    inputSchema: z.object({
        message: z.string().describe('El mensaje del usuario'),
    }),
    outputSchema: z.object({
        text: z.string().describe('La respuesta del tool'),
    }),

},
    async (input: { message: string }) => {
        const preguntaUsuario = input.message.toLowerCase().trim();
        let mejorRespuesta: string | null = null;
        let mayorSimilitud = 0;

        for (const categoria of faq_agencia_autos) {
            for (const item of categoria.preguntas) {
                const preguntaBase = item.pregunta.toLowerCase().trim();

                // Coincidencia exacta o si una incluye a la otra
                if (preguntaBase === preguntaUsuario || preguntaBase.includes(preguntaUsuario) || preguntaUsuario.includes(preguntaBase)) {
                    mayorSimilitud = 1;
                    mejorRespuesta = item.respuesta;
                    break;
                }

                // Similitud por intersección de palabras
                const similitud = calculateSimilarity(preguntaUsuario, preguntaBase);
                if (similitud > mayorSimilitud) {
                    mayorSimilitud = similitud;
                    mejorRespuesta = item.respuesta;
                }
            }
            if (mayorSimilitud === 1) break;
        }

        // Retornar si la similitud es lo suficientemente alta (ajustado a 0.3)
        if (mejorRespuesta && mayorSimilitud > 0.3) {
            return { text: mejorRespuesta };
        }

        return { text: "No se encontró respuesta en la base de datos." };
    }
)
export { buscarEnFAQTool };