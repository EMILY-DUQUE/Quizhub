// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/authController");

router.post("/register", registerUsers);

module.exports = router;
