// ── IMPORTS Y CONFIGURACIÓN DEL SERVIDOR ─────────────────────────────────────
// Importa el framework Express para la creación de rutas e interfaces API REST
const express = require('express');
// Importa Mongoose para gestionar el modelado y la conexión a la base de datos MongoDB
const mongoose = require('mongoose');
// Módulo nativo de Node.js para normalizar y manejar rutas de archivos y directorios
const path = require('path');

// Inicializa la aplicación del servidor Express
const app = express();

// Middleware para transformar automáticamente las solicitudes entrantes que contienen formato JSON
app.use(express.json());

// Middleware para servir los archivos estáticos de la interfaz web (como panel.html o index.html)
app.use(express.static(path.join(__dirname)));

// ── CONEXIÓN A BASE DE DATOS MONGODB ─────────────────────────────────────────
// Realiza la conexión utilizando la variable de entorno que contiene la URI segura (MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Conectado exitosamente a la base de datos MongoDB'))
  .catch(err => console.error('❌ Error crítico al conectar con MongoDB:', err));

// ── ESQUEMAS Y MODELOS DE DATOS (MONGODB) ────────────────────────────────────

/**
 * Esquema para registrar el Historial de Eventos (Logs) del robot.
 * Almacena los movimientos detectados e inicializaciones que envía el ESP32.
 */
const EventoSchema = new mongoose.Schema({
  tipo: String,        // Categoría del evento (ej: 'movimiento', 'sensor', 'error')
  descripcion: String, // Mensaje explicativo detallado de la acción del robot
  datos: Object,       // Objeto flexible para almacenar datos técnicos adicionales en el futuro
  fecha: { type: Date, default: Date.now } // Registra de forma automática la marca de tiempo exacta
});

/**
 * Esquema para gestionar las Órdenes e Instrucciones de control de movimientos.
 * Funciona como una cola de mensajes en tiempo real entre el panel web y el hardware.
 */
const InstruccionSchema = new mongoose.Schema({
  comando: String,     // El comando de acción (ej: 'adelante', 'atras', 'sentar', 'stop')
  parametros: Object,  // Parámetros específicos adjuntos al comando si fuesen necesarios
  estado: { type: String, default: 'pendiente' }, // Control de ciclo de vida: 'pendiente' o 'ejecutada'
  fecha: { type: Date, default: Date.now } // Almacena el momento exacto en el que el usuario mandó la orden
});

// Compilación de los esquemas creados en modelos interactivos de Mongoose
const Evento = mongoose.model('Evento', EventoSchema);
const Instruccion = mongoose.model('Instruccion', InstruccionSchema);

// ── RUTAS DE RECOLECCIÓN DE LOGS (Dirección: Robot ──> Servidor) ─────────────

/**
 * RUTA POST: /evento
 * Invocada directamente por el código del ESP32 mediante peticiones HTTP cada vez que cambia su estado.
 * Guarda en la base de datos registros como "Caminando adelante" o "Robot sentado".
 */
app.post('/evento', async (req, res) => {
  try {
    // Instancia un nuevo documento del modelo Evento con los datos crudos del cuerpo de la petición (req.body)
    const evento = new Evento(req.body);
    // Guarda de forma asíncrona la información en el clúster de MongoDB
    await evento.save();
    console.log('📝 Registro Almacenado - Evento Guardado:', req.body.tipo);
    // Responde con un estatus exitoso al cliente emisor (ESP32)
    res.json({ ok: true, mensaje: 'Evento registrado con éxito en la base de datos' });
  } catch (err) {
    // En caso de falla en el guardado, devuelve un estatus de error de servidor
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * RUTA GET: /logs
 * Consultada por la interfaz web para renderizar dinámicamente la tabla de monitorización.
 * Recupera los últimos 50 eventos ordenados de forma descendente (del más nuevo al más antiguo).
 */
app.get('/logs', async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fecha: -1 }).limit(50);
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── RUTAS DE GESTIÓN DE INSTRUCCIONES (Dirección: Usuario ──> Servidor ──> Robot) ──

/**
 * RUTA POST: /instruccion
 * Invocada por los botones de control de la interfaz web del Panel del usuario.
 * Agrega una nueva orden a la base de datos con el estado inicial predeterminado 'pendiente'.
 */
app.post('/instruccion', async (req, res) => {
  try {
    const instruccion = new Instruccion(req.body);
    await instruccion.save();
    console.log('📡 Nueva Orden en Cola - Instrucción Recibida:', req.body.comando);
    res.json({ ok: true, mensaje: 'Instrucción agregada exitosamente a la cola de pendientes' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * RUTA GET: /instruccion/pendiente
 * Consultada de manera cíclica por el ESP32 en intervalos continuos para saber qué hacer.
 * Aplica lógica de cola FIFO (First In, First Out): busca la orden pendiente más antigua,
 * cambia de inmediato su estado a 'ejecutada' para evitar repeticiones y la despacha al hardware.
 */
app.get('/instruccion/pendiente', async (req, res) => {
  try {
    // Busca la instrucción en estado 'pendiente' ordenada cronológicamente (de la más vieja a la más reciente)
    const instruccion = await Instruccion.findOne({ estado: 'pendiente' }).sort({ fecha: 1 });
    
    // Si no existen órdenes en cola, responde indicando al hardware que permanezca en espera
    if (!instruccion) {
      return res.json({ ok: true, comando: null });
    }
    
    // Cambio preventivo de estado: evita que el ESP32 vuelva a capturar la misma orden en su próximo ciclo de consulta
    instruccion.estado = 'ejecutada';
    // Aplica la actualización de estado en la base de datos de manera definitiva
    await instruccion.save();
    
    // Retorna los datos limpios del comando al microcontrolador para su procesamiento motriz final
    res.json({ 
      ok: true, 
      comando: instruccion.comando, 
      parametros: instruccion.parametros 
      });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── EXPORTACIÓN O ESCUCHA DEL PUERTO DEL SERVIDOR ────────────────────────────
// El servidor queda configurado dinámicamente o por defecto en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en ejecución ejecutándose correctamente en el puerto: ${PORT}`);
});
