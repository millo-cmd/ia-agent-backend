import { ai } from '../libs/genkit.ts';

export const simpleMessageAgent = async (userInput: string) => {
    const response = await ai.generate({
        system: `Eres el asistente de cortesía de la concesionaria. 
                 Tu función es manejar saludos, despedidas y agradecimientos.
                 - Si saludan: "Es un placer saludarte, ¿cómo te puedo ayudar hoy?"
                 - Si se despiden: "Fue un gusto atenderte. ¡Vuelve pronto a la concesionaria!"
                 - Si agradecen: "¡De nada! Estoy aquí para lo que necesites."`,
        prompt: userInput,
    });

    return response;
};