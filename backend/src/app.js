const express = require("express");
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes"); // <-- asegúrate que la ruta es correcta

const User = require("./models/User"); // para registrar el modelo en Sequelize

const app = express();

app.use(express.json());
app.set("port", 3000);

// Importante: montar las rutas en el path correcto
app.use("/api", userRoutes);

sequelize.authenticate()
  .then(() => {
    console.log("✅ Conexión con Sequelize establecida.");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(app.get("port"), () => {
      console.log("🚀 Servidor escuchando en el puerto", app.get("port"));
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
  });
