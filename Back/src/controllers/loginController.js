const {loginService} = require('../services')

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const loginResponse = await loginService.loginUserService(email, password);

    if (loginResponse.error) {
      return res.status(401).json({ message: loginResponse.message });
    }

    return res.status(200).json(loginResponse);
  } catch (error) {
    console.error('❌ Error en loginUserController:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {loginUserController}