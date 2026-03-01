import { z } from "zod";

const validadorCatalogoInputSchema = z.object({
    presupuestoAproximado: z.number().describe('Presupuesto aproximado del cliente'),
    nuevoOUsado: z.enum(['nuevo', 'usado', 'DESCONOCIDO']).default('DESCONOCIDO'),
    descuentoEmpleado: z.boolean().describe('Indica si cuenta con descuento de empleado'),
    preferenciaTipoCarro: z.string().describe('Preferencia del tipo de carro del cliente'),
    datosCompletos: z.boolean().describe('Indica si ya tenemos las 4 respuestas'),
    preguntaAlUsuario: z.string().optional().describe('Si datosCompletos es false, formula la pregunta para obtener los datos faltantes de manera amable.')
});

export { validadorCatalogoInputSchema };