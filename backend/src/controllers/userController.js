// src/controllers/userController.js
const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
  // POST /api/auth/register
  // Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validaciones
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      // Verificar si el email ya existe
      const existingEmail = await UserModel.getByEmail(email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }

      // Verificar si el username ya existe
      const existingUsername = await UserModel.getByUsername(username);
      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: 'El nombre de usuario ya está en uso'
        });
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await UserModel.create(username, email, hashedPassword);

      res.status(201).json({
        success: true,
        message: ' Usuario registrado correctamente',
        data: { user: newUser }
      });

    } catch (error) {
      console.error(' Error en register:', error);
      res.status(500).json({
        success: false,
        message: 'Error registrando usuario',
        error: error.message
      });
    }
  },

  // POST /api/auth/login
  // Login de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son obligatorios'
        });
      }

      // Buscar usuario
      const user = await UserModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Comparar contraseñas
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Generar JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'tu_clave_secreta',
        { expiresIn: '24h' }
      );

      // Eliminar password del response
      delete user.password_hash;

      res.json({
        success: true,
        message: '✅ Login exitoso',
        data: { 
          user,
          token
        }
      });

    } catch (error) {
      console.error(' Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en login',
        error: error.message
      });
    }
  },

  // GET /api/users
  // Obtener todos los usuarios
  getAll: async (req, res) => {
    try {
      const users = await UserModel.getAll();
      
      res.json({
        success: true,
        data: {
          users,
          count: users.length
        }
      });
    } catch (error) {
      console.error(' Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando usuarios',
        error: error.message
      });
    }
  },

  // GET /api/users/:id
  // Obtener usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserModel.getById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error(' Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando usuario',
        error: error.message
      });
    }
  }
};

module.exports = UserController;