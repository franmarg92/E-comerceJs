const { User } = require("../models");
const bcrypt = require("bcrypt");

const getALlUsers = async () => {
  const users = await User.find();
  return users;
};

const editUser = async (userId, userData) => {
  const allowedFields = ["name", "lastName", "email", "date_of_birth", "phoneNumber"];

  const filteredData = {};
  for (const key of allowedFields) {
    if (userData[key] !== undefined && userData[key] !== "") {
      filteredData[key] = userData[key];
    }
  }

  const result = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
  });

  if (!result) throw new Error("Usuario sin cambios o no encontrado");

  return { message: "Usuario actualizado correctamente", user: result };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Contraseña actual incorrecta");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return { message: "Contraseña actualizada correctamente" };
};

const getUserById = async (_id) => {
  try {
    const user = await User.findById(_id);
    return {success: true, user}
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { editUser, changePassword, getALlUsers, getUserById };
