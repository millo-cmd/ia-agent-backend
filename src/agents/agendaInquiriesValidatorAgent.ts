import { ai } from '../libs/genkit.ts';
import { validadorAgendaInputSchema } from '../schemas/validatorAgendaSchemas.ts';

export const consultasAgendaValidatorAgent = async (userInput: string, perfilActual: any) => {
    return await ai.generate({
        system: `Eres el validador de información general del cliente, asegurate que la información sea correcta y completa. 
                 Tu objetivo es completar esta ficha técnica: ${JSON.stringify(perfilActual)}.
                 
                 REGLAS:
                 1. Analiza el mensaje: "${userInput}".
                 2. Si el usuario dio su nombre, motivo, fecha y hora para la cita, actualiza la ficha.
                 3. Si faltan datos, pon "datosCompletos": false y formula una pregunta amable en "preguntaAlUsuario" para solicitarlos.
                 4. Solo si ya tienes (nombre, motivo, fecha y hora para la cita), pon "datosCompletos": true.
                 5. Si da una fecha mayor a 1 año, responde con: 'Lo siento, no puedo agendar citas con tanta anticipación, ¿podrías darme una fecha más cercana?'.
                 6. Si da una fecha menor a la actual, responde con: 'Lo siento, no puedo agendar citas en fechas pasadas, ¿podrías darme una fecha más cercana?'.`,
        prompt: userInput,
        output: { schema: validadorAgendaInputSchema }
    });
};