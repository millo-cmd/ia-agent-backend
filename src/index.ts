import 'dotenv/config'; // Vital para leer el proceso.env.TELEGRAM_TOKEN
import express from 'express';
import cors from 'cors';
import { Telegraf } from 'telegraf';
import { mainOrchestratorFlow } from './flows/mainOrchestratorFlow.ts';

// 1. Inicialización del Bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN || '');

bot.on('text', async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const userInput = ctx.message.text;

        // Llamamos al orquestador principal
        const response = await mainOrchestratorFlow({
            message: userInput,
            userId: userId
        });

        // La respuesta de Genkit suele ser un string o estar en .text
        // Asegúrate de enviar solo el texto
        await ctx.reply(response);
    } catch (error) {
        console.error('Error en Telegram Bot:', error);
        await ctx.reply('Lo siento, hubo un error al procesar tu solicitud.');
    }
});

bot.launch()
    .then(() => console.log('Bot de Telegram activo 🤖'))
    .catch((err) => console.error('Error al iniciar bot:', err));

// 2. Configuración de Express para Angular / XYFlow
const app = express();
app.use(cors());
app.use(express.json());

// Cambiamos el nombre para que sea coherente con tu proyecto de la concesionaria
app.post('/api/chat', async (req, res) => {
    try {
        // req.body debe traer { message: "hola", userId: "123" }
        const result = await mainOrchestratorFlow(req.body);
        res.json({ response: result });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.log('✅ Servidor Express en puerto 3000');
    console.log('🚀 API lista en http://localhost:3000/api/chat');
});