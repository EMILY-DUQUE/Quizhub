// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar puerto
app.set('port', process.env.PORT || 5000);

// Rutas
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');  
const answerRoutes = require('./routes/answerRoutes'); 
const sessionRoutes = require('./routes/sessionRoutes');
const rankingRoutes = require('./routes/rankingRoutes');
 
// Usar rutas
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', questionRoutes);  
app.use('/api', answerRoutes);
app.use('/api', sessionRoutes);
app.use('/api', rankingRoutes);
  

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: ' Servidor funcionando correctamente' });
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