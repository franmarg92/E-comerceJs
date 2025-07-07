const { registerUserService } = require('../services/registerService');

const registerUser = async (req, res) => {
  const { name, lastName, dni, date_if_birth, email, password } = req.body;
  try {
    const newUser = await registerUserService  (
      name,
      lastName,
      dni,
      date_if_birth,
      email,
      password
    );
    return res.status(201).json({
      message: "Usuario Creado exitosamente",
      newUser,
    });
  } catch (error) {
    console.error("❌ Error en registerController:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {registerUser}
