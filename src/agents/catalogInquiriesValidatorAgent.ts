import { ai } from '../libs/genkit.ts';
import { validadorCatalogoInputSchema } from '../schemas/validatorCatalogSchemas.ts';

export const consultasCatalogosValidatorAgent = async (userInput: string, perfilActual: any) => {
    return await ai.generate({
        system: `Eres el validador de información general del cliente, asegurate que la información sea correcta y completa. 
                 Tu objetivo es completar esta ficha técnica: ${JSON.stringify(perfilActual)}.
                 
                 REGLAS:
                 1. Analiza el mensaje: "${userInput}".
                 2. Si el usuario dio su presupuesto aproximado, nuevo o usado, descuento de empleado, preferencia de tipo de carro, actualiza la ficha.
                 3. Si faltan datos, pon "datosCompletos": false.
                 4. Solo si ya tienes (presupuesto aproximado, nuevo o usado, descuento de empleado, preferencia de tipo de carro), pon "datosCompletos": true.`,
        prompt: userInput,
        output: { schema: validadorCatalogoInputSchema }
    });
};