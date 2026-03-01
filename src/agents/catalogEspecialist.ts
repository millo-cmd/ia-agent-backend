import { ai } from '../libs/genkit.ts';

import { buscarVehiculosTool } from '../tools/catalogVehiculosTool.ts';

const catalogEspecialistAgent = async (userInput: string) => {
    const response = await ai.generate({
        system: `Eres el especialista de catálogo de la concesionaria. 
                 Tu función es responder con el catálogo de vehículos que tenemos disponibles buscando en nuestra base de datos.
                 - Extrae la marca, modelo o año de la pregunta del usuario y usa tu herramienta buscarVehiculosTool.
                 - Responde amigablemente detallando el vehículo encontrado o indicando si no hay 100% de coincidencia en el inventario actual.`,
        prompt: userInput,
        tools: [buscarVehiculosTool],
    });

    return response;
};

export { catalogEspecialistAgent };