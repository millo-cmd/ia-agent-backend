import { z } from "zod";

const validadorAgendaInputSchema = z.object({
    nombreCliente: z.string().optional().describe('Nombre del cliente'),
    fecha: z.string().optional().describe('Fecha del evento'),
    hora: z.string().optional().describe('Hora del evento'),
    motivo: z.enum(['prueba de manejo', 'reparación', 'otro']).default('otro'),
    vehiculoInteres: z.string().optional().describe('Vehículo de interés del cliente'),
    datosCompletos: z.boolean().describe('Indica si ya tenemos las 4 respuestas obligatorias: nombre, fecha, hora y motivo'),
    preguntaAlUsuario: z.string().optional().describe('Pregunta al usuario para solicitar la información faltante')
});

export { validadorAgendaInputSchema };