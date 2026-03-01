const userSessions: Record<string, any> = {};

export const getSession = (userId: string) => {
    if (!userSessions[userId]) {
        // Estado inicial vacío para nuevos usuarios
        userSessions[userId] = {
            tipoCliente: 'DESCONOCIDO',
            ocupacion: 'DESCONOCIDO',
            edad: null,
            contextoActual: 'SALUDO' // Para saber en qué flujo está
        };
    }
    return userSessions[userId];
};

export const updateSession = (userId: string, newData: any) => {
    userSessions[userId] = { ...userSessions[userId], ...newData };
};