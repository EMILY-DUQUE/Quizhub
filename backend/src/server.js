// src/server.js
const app = require('./app');

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log(`🚀 Servidor escuchando en el puerto ${app.get('port')}`);
});

