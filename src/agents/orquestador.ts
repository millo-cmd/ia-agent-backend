import { ai } from '../libs/genkit.ts';

export const orquestadorAgent = async (userInput: string) => {
    return await ai.generate({
        system: `Actúa como el clasificador central de una concesionaria. 
                 Tu única función es analizar el mensaje y responder con una sola palabra:
                 - SALUDO: Si el usuario saluda, se despide o agradece.
                 - CATALOGO: Si pregunta por modelos de autos, precios o disponibilidad.
                 - AG_CITAS: Si quiere agendar una cita o prueba de manejo.
                 - GEN_CONSULTAS: Si tiene dudas generales (horarios, ubicación).`,
        prompt: userInput,
    });
};