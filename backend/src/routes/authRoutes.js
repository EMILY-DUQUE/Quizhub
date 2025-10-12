// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUsers } = require("../controllers/authController");

router.post("/register", registerUsers);

module.exports = router;
