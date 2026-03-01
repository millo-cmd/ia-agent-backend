import { ai } from '../libs/genkit.ts';
import { validadorCatalogoInputSchema } from '../schemas/validatorCatalogSchemas.ts';

export const consultasCatalogosValidatorAgent = async (userInput: string, perfilActual: any) => {
    return await ai.generate({
        system: `Eres el validador de información general del cliente, asegurate que la información sea correcta y completa. 
                 Tu objetivo es completar esta ficha técnica: ${JSON.stringify(perfilActual)}.
                 
                 REGLAS:
                 1. Analiza el mensaje: "${userInput}".
                 2. Extrae la información si el usuario menciona presupuesto aproximado, si busca auto nuevo o usado, si tiene descuento de empleado, o su preferencia de tipo de carro.
                 3. Si faltan datos en la ficha técnica (presupuesto, nuevo/usado, descuento empleado, preferencia), pon "datosCompletos": false y genera en "preguntaAlUsuario" una pregunta amable para solicitar los datos que faltan al usuario.
                 4. Solo si ya tienes los 4 datos, pon "datosCompletos": true.
                 5. Si el usuario menciona alguna otra cosa que no tiene nada que ver con el catalogo de autos, responde, "No estoy seguro de cómo ayudarte con eso, ¿podrías repetir tu duda?
                 6. Si el usuario menciona algo sobre autos voladores, autos que no existen, etc, responde, "No estoy seguro de cómo ayudarte con eso, ¿podrías repetir tu duda?"`,
        prompt: userInput,
        output: { schema: validadorCatalogoInputSchema }
    });
};