import { z } from "zod";

const validadorPreguntasGeneralesInputSchema = z.object({
    tipoCliente: z.enum(['NUEVO', 'EXISTENTE', 'DESCONOCIDO']).default('DESCONOCIDO'),
    ocupacion: z.enum(['ASALARIADO', 'INDEPENDIENTE', 'DESCONOCIDO']).default('DESCONOCIDO'),
    edad: z.number().optional().describe('Edad aproximada del cliente'),
    datosCompletos: z.boolean().describe('Indica si ya tenemos las 3 respuestas')
});

export { validadorPreguntasGeneralesInputSchema };