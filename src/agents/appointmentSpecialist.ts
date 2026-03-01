import { ai } from '../libs/genkit.ts';

import { buscarVehiculosTool } from '../tools/catalogVehiculosTool.ts';

const appointmentSpecialistAgent = async (userInput: string) => {
    const response = await ai.generate({
        system: `Eres el especialista en agendar citas de la concesionaria. 
                 Tu función es agendar citas para pruebas de manejo o servicios de mantenimiento, siempre y cuando el usuario te de la información necesaria para agendar la cita.
                 - Debes extraer la fecha y validar que no sea menor al día actual.
                 - Debes extraer la fecha y validar que solo se puedan en fechas dadas en el archivo datesAgend.ts
                 - Debes extraer los "slots" disponibles para la cita.
                 - Responde amablemente con la fecha y hora disponibles para la cita.`,
        prompt: userInput,
        tools: [buscarVehiculosTool],
    });

    return response;
};

export { appointmentSpecialistAgent };