import { ai } from '../libs/genkit.ts';
import { validadorPreguntasGeneralesInputSchema } from '../schemas/validatorGeneralCuestionsSchemas.ts';

export const consultasGeneralesValidatorAgent = async (userInput: string, perfilActual: any) => {
    return await ai.generate({
        system: `Eres el validador de información general del cliente, asegurate que la información sea correcta y completa. 
                 Tu objetivo es completar esta ficha técnica: ${JSON.stringify(perfilActual)}.
                 
                 REGLAS:
                 1. Analiza el mensaje: "${userInput}".
                 2. Si el usuario proporcionó su edad, ocupación o tipo de cliente (nuevo/existente), extrae esa información.
                 3. Si faltan datos en la ficha técnica (Tipo de Cliente, Ocupación y Edad), pon "datosCompletos": false y genera en "preguntaAlUsuario" una pregunta amable para solicitar los datos que faltan al usuario.
                 4. Solo si la ficha técnica ya tiene los 3 datos (Tipo de Cliente, Ocupación y Edad), pon "datosCompletos": true.`,
        prompt: userInput,
        output: { schema: validadorPreguntasGeneralesInputSchema }
    });
};