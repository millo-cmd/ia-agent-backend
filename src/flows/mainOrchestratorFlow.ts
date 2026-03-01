import { ai } from "../libs/genkit.ts";
import { z } from "genkit";
import { getSession, saveChatMessage, updateSession } from "../libs/memory.ts";
import { db } from "../libs/firebase.ts";
import { doc, setDoc } from "firebase/firestore";

// Agentes
import { simpleMessageAgent } from "../agents/simpleMessageAgent.ts";
import { orquestadorAgent } from "../agents/orquestador.ts";
import { generalInquiriesSpecialistAgent } from "../agents/generalInquiriesSpecialistAgent.ts";
import { consultasGeneralesValidatorAgent } from "../agents/generalInquiriesValidatorAgent.ts";
import { catalogEspecialistAgent } from "../agents/catalogEspecialist.ts";
import { consultasCatalogosValidatorAgent } from "../agents/catalogInquiriesValidatorAgent.ts";
import { consultasAgendaValidatorAgent } from "../agents/agendaInquiriesValidatorAgent.ts";
import { appointmentSpecialistAgent } from "../agents/appointmentSpecialist.ts";

const MainInputSchema = z.object({
    message: z.string(),
    userId: z.string()
});

export const mainOrchestratorFlow = ai.defineFlow(
    {
        name: 'mainOrchestratorFlow',
        inputSchema: MainInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        // A. GUARDAR MENSAJE DE ENTRADA EN EL HISTORIAL
        await saveChatMessage(input.userId, 'user', input.message);

        // 1. Recuperar la memoria del usuario
        const session = await getSession(input.userId);

        // 2. Clasificar la intención (Lógica de contexto mantenida)
        let category = 'SALUDO';
        if (session.contextoActual === 'PEDIENDO_DATOS_CONSULTA') {
            category = 'GEN_CONSULTAS';
        } else if (session.contextoActual === 'PEDIENDO_DATOS_CATALOGO') {
            category = 'CATALOGO';
        } else if (session.contextoActual === 'PEDIENDO_DATOS_AGENDA') {
            category = 'AG_CITAS';
        } else {
            const classification = await orquestadorAgent(input.message);
            category = classification.text.trim().toUpperCase();
        }

        let finalResponse = ""; // Variable para capturar la respuesta y guardarla

        // 3. Ruteo Dinámico
        switch (category) {
            case 'SALUDO':
                const resSaludo = await simpleMessageAgent(input.message);
                finalResponse = resSaludo.text;
                break;

            case 'CATALOGO':
                if (session.contextoActual !== 'PEDIENDO_DATOS_CATALOGO') {
                    await updateSession(input.userId, { originalQuery: input.message });
                }

                const catValidationResponse = await consultasCatalogosValidatorAgent(input.message, session);
                const perfCat = catValidationResponse.output;

                if (perfCat) {
                    await updateSession(input.userId, {
                        presupuestoAproximado: perfCat.presupuestoAproximado ?? session.presupuestoAproximado,
                        nuevoOUsado: perfCat.nuevoOUsado ?? session.nuevoOUsado,
                        preferenciaTipoCarro: perfCat.preferenciaTipoCarro ?? session.preferenciaTipoCarro,
                    });
                }

                const updSessCat = await getSession(input.userId);
                const isCatComplete = updSessCat.presupuestoAproximado && updSessCat.preferenciaTipoCarro !== 'otro';

                if (!isCatComplete) {
                    await updateSession(input.userId, { contextoActual: 'PEDIENDO_DATOS_CATALOGO' });
                    finalResponse = perfCat?.preguntaAlUsuario || "Para ayudarte, ¿qué presupuesto tienes y qué tipo de auto buscas?";
                } else {
                    await updateSession(input.userId, { contextoActual: 'SALUDO', originalQuery: null });
                    const reqCatalogo = await catalogEspecialistAgent(updSessCat.originalQuery || input.message);
                    finalResponse = reqCatalogo.text;
                }
                break;

            case 'GEN_CONSULTAS':
                if (session.contextoActual !== 'PEDIENDO_DATOS_CONSULTA') {
                    await updateSession(input.userId, { originalQuery: input.message });
                }

                const validationResponseGen = await consultasGeneralesValidatorAgent(input.message, session);
                const perfilActualizadoGen = validationResponseGen.output;

                if (perfilActualizadoGen) {
                    await updateSession(input.userId, {
                        tipoCliente: perfilActualizadoGen.tipoCliente ?? session.tipoCliente,
                        ocupacion: perfilActualizadoGen.ocupacion ?? session.ocupacion,
                        edad: perfilActualizadoGen.edad ?? session.edad,
                    });
                }

                const updatedSessionGen = await getSession(input.userId);
                const isGenComplete = updatedSessionGen.tipoCliente !== 'DESCONOCIDO' && updatedSessionGen.edad;

                if (!isGenComplete) {
                    await updateSession(input.userId, { contextoActual: 'PEDIENDO_DATOS_CONSULTA' });
                    finalResponse = perfilActualizadoGen?.preguntaAlUsuario || "¿Podrías indicarme tu edad y si ya eres cliente?";
                } else {
                    await setDoc(doc(db, 'users', input.userId), {
                        tipoCliente: updatedSessionGen.tipoCliente ?? 'DESCONOCIDO',
                        ocupacion: updatedSessionGen.ocupacion ?? 'DESCONOCIDO',
                        edad: updatedSessionGen.edad ?? null,
                        updatedAt: new Date().toISOString()
                    }, { merge: true }).catch(err => console.error("Error saving to Firebase:", err));

                    await updateSession(input.userId, { contextoActual: 'SALUDO', originalQuery: null });
                    const consultasGenerales = await generalInquiriesSpecialistAgent(updatedSessionGen.originalQuery || input.message);
                    finalResponse = consultasGenerales.text;
                }
                break;

            case 'AG_CITAS':
                if (session.contextoActual !== 'PEDIENDO_DATOS_AGENDA') {
                    await updateSession(input.userId, { originalQuery: input.message });
                }

                const validationResponseAg = await consultasAgendaValidatorAgent(input.message, session);
                const perfilActualizadoAg = validationResponseAg.output;

                if (perfilActualizadoAg) {
                    await updateSession(input.userId, {
                        nombreCompleto: perfilActualizadoAg.nombreCliente ?? session.nombreCompleto,
                        fechaCita: perfilActualizadoAg.fecha ?? session.fechaCita,
                        horaCita: perfilActualizadoAg.hora ?? session.horaCita,
                        motivoCita: perfilActualizadoAg.motivo ?? session.motivoCita,
                        vehiculoDeInteres: perfilActualizadoAg.vehiculoInteres ?? session.vehiculoDeInteres
                    });
                }

                const updatedSessionAg = await getSession(input.userId);
                const isAgComplete = updatedSessionAg.nombreCompleto &&
                    updatedSessionAg.fechaCita &&
                    updatedSessionAg.horaCita &&
                    updatedSessionAg.motivoCita &&
                    perfilActualizadoAg?.datosCompletos === true;

                if (!isAgComplete) {
                    await updateSession(input.userId, { contextoActual: 'PEDIENDO_DATOS_AGENDA' });
                    finalResponse = perfilActualizadoAg?.preguntaAlUsuario || "Para poder agendar tu cita, ¿podrías indicarme tu nombre, la fecha, hora y el motivo (prueba de manejo, reparación, otro)?";
                } else {
                    await setDoc(doc(db, 'users', input.userId), {
                        nombreCompleto: updatedSessionAg.nombreCompleto,
                        fechaCita: updatedSessionAg.fechaCita,
                        horaCita: updatedSessionAg.horaCita,
                        motivoCita: updatedSessionAg.motivoCita,
                        vehiculoDeInteres: updatedSessionAg.vehiculoDeInteres ?? null,
                        updatedAt: new Date().toISOString()
                    }, { merge: true }).catch(err => console.error("Error saving to Firebase:", err));

                    await updateSession(input.userId, { contextoActual: 'SALUDO', originalQuery: null });
                    const citaResponse = await appointmentSpecialistAgent(updatedSessionAg.originalQuery || input.message);
                    finalResponse = citaResponse.text;
                }
                break;

            default:
                finalResponse = "No estoy seguro de cómo ayudarte con eso, ¿podrías repetir tu duda?";
        }

        // B. GUARDAR RESPUESTA DEL AGENTE EN EL HISTORIAL
        await saveChatMessage(input.userId, 'model', finalResponse);

        return finalResponse;
    },
);