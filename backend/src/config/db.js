// src/config/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "postgres",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log(" Conectado a la base de datos"))
  .catch((err) => console.error("  Error al conectar:", err));

module.exports = pool;
