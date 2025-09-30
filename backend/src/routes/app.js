const express = require("express");
const app = express();

app.use(express.json());

// ✅ Importar y ejecutar la conexión a la base de datos
require("./db");

// ✅ Importar configuración del puerto
const { app: appConfig } = require("./config");

// ✅ Ruta de prueba (para ver algo en localhost:4000)
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente en localhost:4000");
});

// ✅ Ruta para probar la base de datos (opcional)
const pool = require("./db");
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Conectado a la base de datos",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Asignar puerto
app.set("port", appConfig.port);

// ✅ Exportar app
module.exports = app;
