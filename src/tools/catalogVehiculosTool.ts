import { z } from "genkit";
import { ai } from "../libs/genkit.ts";
import { modalCars } from "../data/modalCars.ts";

const { available_vehicles } = modalCars;

const buscarVehiculosTool = ai.defineTool({
    name: "buscarVehiculosTool",
    description: "Busca vehículos en el catálogo de la agencia usando coincidencias exactas. Útil cuando el usuario pregunta por un vehículo en específico.",
    inputSchema: z.object({
        marca: z.string().optional().describe('La marca del vehículo que busca el usuario, ej. Honda, Nissan, Chrysler'),
        modelo: z.string().optional().describe('El modelo del vehículo, ej. Civic, Versa, 200, CR-V'),
        ano: z.number().optional().describe('El año del vehículo, ej. 2018')
    }),
    outputSchema: z.object({
        text: z.string().describe('La respuesta del tool con los autos encontrados'),
    }),
},
    async (input) => {
        // Obtenemos los vehículos disponibles
        let resultados = available_vehicles;
        let busquedaRealizada = false;

        // Filtrado por coincidencia exacta (dejando en minúsculas para ignorar mayúsculas)
        if (input.marca) {
            resultados = resultados.filter(v => v.Marca.toLowerCase() === input.marca!.toLowerCase());
            busquedaRealizada = true;
        }

        if (input.modelo) {
            // permitimos coincidencia exacta o si coincide parte
            resultados = resultados.filter(v => v.Modelo.toLowerCase() === input.modelo!.toLowerCase());
            busquedaRealizada = true;
        }

        if (input.ano) {
            resultados = resultados.filter(v => v.Año === input.ano);
            busquedaRealizada = true;
        }

        if (!busquedaRealizada) {
            return { text: "No se proporcionaron características específicas para buscar en el catálogo." };
        }

        if (resultados.length > 0) {
            const descripciones = resultados.map(v =>
                `${v.Marca} ${v.Modelo} ${v.Año} - Color: ${v.Color}, Kilometraje: ${v.Kilometraje}km, Transmisión: ${v.Transmisión}. Precio: $${v.Precio}. Descripción: ${v.Descripción}`
            ).join('\n---\n');

            return { text: `Se encontraron estos vehículos exactos:\n\n${descripciones}` };
        }

        return { text: "No se encontró un vehículo que coincida al 100% con esos detalles en nuestra base de datos." };
    }
);

export { buscarVehiculosTool };
