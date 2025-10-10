// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

// Ruta POST para registrar usuario
router.post("/auth/register", userController.registerUser);
router.get("/users",userController.getUser);

module.exports = router;
