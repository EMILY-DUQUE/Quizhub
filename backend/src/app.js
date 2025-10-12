const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a QuizHub API',
    version: '1.0.0'
  });
});

// Montar rutas
app.use("/api/auth", authRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;