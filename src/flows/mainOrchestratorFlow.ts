import { SimpleMessageInputSchema } from "../schemas/welcoMessageSchemas.ts";
import { simpleMessageAgent } from "../agents/simpleMessageAgent.ts";
import { orquestadorAgent } from "../agents/orquestador.ts";
import { getSession, updateSession } from "../libs/memory.ts";
import { ai } from "../libs/genkit.ts";
import { z } from "genkit";

// Nuevo esquema que incluya el userId de Telegram
const MainInputSchema = z.object({
    message: z.string(),
    userId: z.string()
});

const mainOrchestratorFlow = ai.defineFlow(
    {
        name: 'mainOrchestratorFlow',
        inputSchema: MainInputSchema,
        outputSchema: z.string(), // Devolvemos el texto final para Telegram
    },
    async (input) => {
        // 1. Recuperar la memoria del usuario
        const session = getSession(input.userId);

        // 2. Clasificar la intención
        const classification = await orquestadorAgent(input.message);
        const category = classification.text.trim().toUpperCase();

        console.log(`Usuario ${input.userId} clasificado como: ${category}`);

        // 3. Ruteo Dinámico (El Switch)
        switch (category) {
            case 'SALUDO':
                const resSaludo = await simpleMessageAgent(input.message);
                return resSaludo.text;

            case 'AG_CITAS':
                // Aquí llamarías a tu validador de citas pasando la session
                return "Entendido, vamos a agendar tu cita. ¿Cuál es tu nombre?";

            case 'CATALOGO':
                return "Con gusto te muestro los modelos disponibles. ¿Buscas nuevo o usado?";

            default:
                return "No estoy seguro de cómo ayudarte con eso, ¿podrías repetir tu duda?";
        }
    },
);

export { mainOrchestratorFlow };