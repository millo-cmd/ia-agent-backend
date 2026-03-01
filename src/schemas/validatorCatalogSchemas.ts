import { z } from "zod";

const validadorCatalogoInputSchema = z.object({
    presupuestoAproximado: z.number().describe('Presupuesto aproximado del cliente'),
    nuevoOUsado: z.enum(['nuevo', 'usado']).default('nuevo'),
    descuentoEmpleado: z.boolean().describe('Indica si cuenta con descuento de empleado'),
    preferenciaTipoCarro: z.enum(['sedán', 'SUV', 'hatchback', 'pickup', 'otro']).default('otro'),
    datosCompletos: z.boolean().describe('Indica si ya tenemos las 4 respuestas')
});

export { validadorCatalogoInputSchema };