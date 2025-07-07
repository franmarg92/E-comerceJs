const { User, Role } = require("../models");
const { auth } = require("../utils");

const registerUserService = async (
  name,
  lastName,
  dni,
  date_of_birth,
  email,
  password,
  roleName = 'Cliente'
) => {
  

  // Validación de formato de email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return { error: true, message: 'El formato del correo no es válido' };
  }

  // Validación de duplicados
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return { error: true, message: 'El correo ya está en uso' };
  }

  const existingDNI = await User.findOne({ dni });
  if (existingDNI) {
    return { error: true, message: 'El DNI ya está registrado' };
  }

  // Buscar rol por nombre
  const role = await Role.findOne({ name: roleName });
  if (!role) {
    return { error: true, message: 'Rol por defecto no encontrado' };
  }

  // Crear el usuario
  const hashedPassword = await auth.hashPassword(password);

  const newUser = new User({
    name,
    lastName,
    dni,
    date_of_birth,
    email,
    password: hashedPassword,
    role: role._id
  });

  const createdUser = await newUser.save();
  return { error: false, user: createdUser };
};

module.exports = { registerUserService };