// src/app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar puerto (sin requerirlo de .env)
app.set('port', process.env.PORT || 5000);

// Rutas
const userRoutes = require('./routes/userRoutes');
 

// Usar rutas
app.use('/api', userRoutes);
 

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Servidor funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

module.exports = app;