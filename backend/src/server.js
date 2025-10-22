// src/server.js
const express = require('express');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

//  Middleware para leer JSON en el body
app.use(express.json());

// Configurar puerto
app.set('port', 5000);

// Rutas
app.use('/api', categoryRoutes);

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`  Servidor escuchando en el puerto ${app.get('port')}`);
});
