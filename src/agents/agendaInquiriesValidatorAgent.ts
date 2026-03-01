import { ai } from '../libs/genkit.ts';
import { validadorAgendaInputSchema } from '../schemas/validatorAgendaSchemas.ts';

export const consultasAgendaValidatorAgent = async (userInput: string, perfilActual: any) => {
    return await ai.generate({
        system: `Eres el validador de información general del cliente, asegurate que la información sea correcta y completa. 
                 Tu objetivo es completar esta ficha técnica: ${JSON.stringify(perfilActual)}.
                 
                 REGLAS:
                 1. Analiza el mensaje: "${userInput}".
                 2. Si el usuario dio su nombre, motivo, fecha y hora para la cita, actualiza la ficha.
                 3. Si faltan datos, pon "datosCompletos": false.
                 4. Solo si ya tienes (nombre, motivo, fecha y hora para la cita), pon "datosCompletos": true.`,
        prompt: userInput,
        output: { schema: validadorAgendaInputSchema }
    });
};