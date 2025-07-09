const { User } = require("../models");
const bcrypt = require("bcrypt");

const getALlUsers = async () => {
  const users = await User.find();
  return users;
};

const editUser = async (id, userData, userRole) => {
  let allowedFields;

  if (userRole === "admin") {
    allowedFields = [
      "name",
      "lastname",
      "email",
      "date_of_birth",
      "dni",
      "role_id",
    ];
  } else {
    allowedFields = ["name", "lastname", "email", "date_of_birth"];
  }

  const filteredData = {};
  for (const key of allowedFields) {
    if (userData.hasOwnProperty(key)) {
      filteredData[key] = userData[key];
    }
  }

  const result = await User.findByIdAndUpdate(id, filteredData, { new: true });

  if (!result) throw new Error("Usuario sin cambios o no encontrado");

  return { message: "Usuario actualizado correctamente", user: result };
};

const changePassword = async (user_id, oldPassword, newPassword) => {
  const user = await User.findById(user_id);

  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Contraseña actual incorrecta");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return { message: "Contraseña actualizada correctamente" };
};

module.exports = { editUser, changePassword, getALlUsers };
