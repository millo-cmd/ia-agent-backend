import { ai } from '../libs/genkit.ts';

import { buscarEnFAQTool } from '../tools/generalInquiriesTool.ts';

const generalInquiriesSpecialistAgent = async (userInput: string) => {
    const response = await ai.generate({
        system: `Eres el asistente de cortesía de la concesionaria. 
                 Tu función es responder las dudas generales de los clientes.
                 - Si te preguntan algo que no esté en la base de datos, responde: "No tengo información sobre eso, pero puedo ayudarte con otra cosa."`,
        prompt: userInput,
        tools: [buscarEnFAQTool],
    });

    return response;
};

export { generalInquiriesSpecialistAgent };