import { z } from "genkit";

const SimpleMessageInputSchema = z.object({
    message: z.string().describe('El saludo o mensaje inicial enviado por el cliente'),
});

// Define output schema
const SimpleMessageSchema = z.object({
    text: z.string().describe('La respuesta cordial generada por el asistente'),
});

export { SimpleMessageInputSchema, SimpleMessageSchema };

