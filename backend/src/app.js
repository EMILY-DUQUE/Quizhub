// src/routes/app.js
const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Puerto
app.set("port", 3000);

// ✅ Endpoint GET - Obtener todos los usuarios
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, total_score FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error consultando la base de datos");
  }
});

// ✅ Endpoint POST - Registrar usuario
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en base de datos
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "✅ Usuario registrado correctamente",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error registrando usuario:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Iniciar servidor
app.listen(app.get("port"), () => {
  console.log("🚀 Servidor escuchando en el puerto", app.get("port"));
});
