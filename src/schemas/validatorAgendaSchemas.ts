import { z } from "zod";

const validadorAgendaInputSchema = z.object({
    nombreCliente: z.string().describe('Nombre del cliente'),
    fecha: z.string().describe('Fecha del evento'),
    hora: z.string().describe('Hora del evento'),
    motivo: z.enum(['prueba de manejo', 'reparación', 'otro']).default('otro'),
    vehiculoInteres: z.string().optional().describe('Vehículo de interés del cliente'),
    datosCompletos: z.boolean().describe('Indica si ya tenemos las 5 respuestas')
});

export { validadorAgendaInputSchema };