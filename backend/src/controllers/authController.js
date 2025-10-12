// src/controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuario registrado", user: result.rows[0] });
  } catch (err) {
    console.error("Error registrando usuario:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { registerUsers };
