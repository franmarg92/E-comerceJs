const {jwt} = require('../utils')
const { User } = require("../models");
const { auth } = require("../utils");



const loginUserService = async (email, password) => {
  const user = await User.findOne({ email }).populate({
    path: 'role',
    select: 'name',
  });

  if (!user) {
    return { error: true, message: 'Usuario no encontrado' };
  }

  const isPasswordCorrect = await auth.checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    return { error: true, message: 'Contraseña incorrecta' };
  }

  const tokenPayload = {
    user_id: user._id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role.name.toLowerCase(),
  };

 const token = jwt.generateJWT(tokenPayload)

  return {
    error: false,
    message: 'Login exitoso desde el backend',
    token,
    user: tokenPayload,
  };
};

module.exports = { loginUserService };