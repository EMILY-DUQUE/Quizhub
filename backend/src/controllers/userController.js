// src/controllers/userController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    console.log("regis")
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({
      message: "✅ Usuario registrado correctamente",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
    
  } catch (error) {
    console.error("❌ Error registrando usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}
  exports.getUser=async(req,res)=>{
    try{
        const users=await User.findAll();
        res.status(200).json(users);
    }catch(error){
        console.error("❌ Error obteniendo usuarios:", error);
        res.status(500).json({message:"Error en el servidor"});
    }


  }

