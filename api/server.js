const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ── ESQUEMAS ──────────────────────────────────────────
const EventoSchema = new mongoose.Schema({
  tipo: String,
  descripcion: String,
  datos: Object,
  fecha: { type: Date, default: Date.now }
});

const InstruccionSchema = new mongoose.Schema({
  comando: String,
  parametros: Object,
  estado: { type: String, default: 'pendiente' }, // pendiente / ejecutada
  fecha: { type: Date, default: Date.now }
});

const Evento = mongoose.model('Evento', EventoSchema);
const Instruccion = mongoose.model('Instruccion', InstruccionSchema);

// ── RUTAS DE LOGS (robot → servidor) ─────────────────
app.post('/evento', async (req, res) => {
  try {
    const evento = new Evento(req.body);
    await evento.save();
    console.log('📝 Evento guardado:', req.body.tipo);
    res.json({ ok: true, mensaje: 'Evento registrado' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/logs', async (req, res) => {
  const eventos = await Evento.find().sort({ fecha: -1 }).limit(50);
  res.json(eventos);
});

// ── RUTAS DE INSTRUCCIONES (tú → robot) ──────────────
// Tú mandas una instrucción desde el panel
app.post('/instruccion', async (req, res) => {
  try {
    const instruccion = new Instruccion(req.body);
    await instruccion.save();
    console.log('📡 Instrucción enviada:', req.body.comando);
    res.json({ ok: true, mensaje: 'Instrucción guardada' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// El ESP32 consulta si hay instrucciones pendientes
app.get('/instruccion/pendiente', async (req, res) => {
  try {
    const instruccion = await Instruccion.findOne({ estado: 'pendiente' }).sort({ fecha: 1 });
    if (!instruccion) {
      return res.json({ ok: true, comando: null });
    }
    instruccion.estado = 'ejecutada';
    await instruccion.save();
    res.json({ ok: true, comando: instruccion.comando, parametros: instruccion.parametros });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message});
     }
});
