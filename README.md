GRUPO NUMERO 6

- Carlos Gonzalez (Backend)
- Estuardo Wyss (Frontend)


Desafio: 
Desarrollo de un agente de IA para una concesionaria de autos, que pueda responder preguntas generales, agendar citas y mostrar el catalogo de autos.

El proyecto fue desarrollado utilizando las siguientes tecnologías:
- Genkit
- Firebase
- TypeScript
- Express
- Zod
- Tailwind CSS
- Vite
- Node.js
- npm

toda la logica del proyecto frontend se encuentra en el siguiente repositorio: https://github.com/ikcDevelopment/aiAgentAngular

En el proyeecto (backend) se encuentra la logica del flujo principal del multi agente, los agentes especializados y las herramientas.
Se hizo una concexión a la api de google genkit para poder utilizar los modelos de ia.
se hizo una concexión a la api de firebase para poder almacenar los datos de los usuarios.
se hizo una conexión a la api de telegram para el envío de mensajes y la interacción con el usuario.

con genkit se implemento un flujo principal que se encarga de gestionar la conversación con el usuario.
con firebase se implemento una base de datos para almacenar los datos de los usuarios.
con telegram se implemento una interfaz para la interacción con el usuario.

se utilizó una organización de carpetas por tipo:
- agents: contiene los agentes especializados, agentes de validación, un agente simple y un orquestador.
- tools: contiene las herramientas que utilizan los agentes.
- schemas: contiene los esquemas que utilizan los agentes.
- data: contiene los datos que utilizan los agentes para evitar alucinaciones.
- libs: contiene las librerías que utilizan los agentes.

esto se utilizó de esta forma para tener un control de errores y una mejor organización del código, pensado en el acceso facil a cada
parte del proyecto por tipo.

Flujo de trabajo: 
1. El usuario envía un mensaje a través de Telegram.
2. El orquestador recibe el mensaje y lo envía al agente especializado correspondiente.
3. El agente especializado procesa el mensaje y envía una respuesta al usuario.
4. El usuario recibe la respuesta a través de Telegram.

Errores:
- se implementaron agentes de validación, uno por flujo para asegurar que la información que se pide por flujo siempre sea ingresada,
tratando de evitar alucinaciones y que el agente especializado se "confunda" con la información que se le da.

- se implemento un agente simple para manejar los saludos y despedidas, ya que son muy comunes y no requieren de un agente especializado.

- se implemento un agente orquestador que se encarga de gestionar la conversación con el usuario y enviarlo al agente especializado correspondiente.

- se implemento un agente especializado para cada flujo, uno para el catalogo de autos, uno para las citas y uno para las consultas generales.

- se implemento un agente especializado para cada flujo, uno para el catalogo de autos, uno para las citas y uno para las consultas generales.

- se implementaron esquemas para que el agente siempre sepa que es lo que tiene que recibir por parte del usuario, esto sumado al agente de validación se asegura de que la información sea correcta y completa.

Guardado de información:
- se implemento firebase para guardar los datos de los usuarios, esto se hace cuando el usuario proporciona la información solicitada por el agente de validación.
- se implemento firebase para guardar los datos de las citas, esto se hace cuando el usuario proporciona la información solicitada por el agente de validación.

