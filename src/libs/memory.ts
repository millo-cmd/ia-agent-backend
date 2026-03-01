import { db } from "./firebase.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    serverTimestamp
} from "firebase/firestore";

// const getSession = async (userId: string) => {
//     try {
//         const userRef = doc(db, "sessions", userId);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//             return userSnap.data();
//         } else {
//             const initialState = {
//                 tipoCliente: 'DESCONOCIDO',
//                 contextoActual: 'SALUDO',
//                 fechaCreacion: new Date()
//             };
//             await setDoc(userRef, initialState);
//             return initialState;
//         }
//     } catch (error) {
//         console.error("Error detallado en Firebase:", error);
//         throw error;
//     }
// };

const getSession = async (userId: string) => {
    try {
        const userRef = doc(db, "sessions", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            // DEBES incluir todas las propiedades aquí para que TS no se queje
            const initialState = {
                tipoCliente: 'DESCONOCIDO',
                ocupacion: 'DESCONOCIDO',
                edad: null,
                presupuestoAproximado: null,
                nuevoOUsado: 'DESCONOCIDO',
                preferenciaTipoCarro: 'otro',
                contextoActual: 'SALUDO',
                originalQuery: null,
                fechaCreacion: new Date(),
                fechaCita: null,
                horaCita: null,
                motivoCita: null,
                vehiculoDeInteres: null,
                nombreCompleto: null
            };
            await setDoc(userRef, initialState);
            return initialState;
        }
    } catch (error) {
        console.error("Error al obtener sesión de Firebase:", error);
        throw error;
    }
};

const saveChatMessage = async (userId: string, role: 'user' | 'model', text: string) => {
    try {
        const historyRef = collection(db, "sessions", userId, "chat_history");
        await addDoc(historyRef, {
            role: role,
            text: text,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error("Error guardando mensaje en Firebase:", error);
    }
};

export const updateSession = async (userId: string, newData: any) => {
    try {
        const userRef = doc(db, "sessions", userId);
        await updateDoc(userRef, newData);
    } catch (error) {
        console.error("Error al actualizar sesión en Firebase:", error);
    }
};

export { getSession, saveChatMessage };

