const express = require("express");
const pool = require("../config/db");


const app = express();
app.set("port", 3000);

// Ruta para ver los datos de la tabla
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows); // devuelve los registros
  } catch (err) {
    console.error(err);
    res.status(500).send("Error consultando la base de datos");
  }
});

app.listen(app.get("port"), () => {
  console.log("Servidor escuchando en el puerto", app.get("port"));
});
