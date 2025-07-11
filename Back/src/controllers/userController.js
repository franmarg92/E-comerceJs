const { userService } = require("../services");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userService.getALlUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);

    res.status(500).json({
      error: "Ocurrió un error al obtener los usuarios",
      details: error.message,
    });
  }
};

const editUserController = async (req, res) => {
  try {
    const editedUser = req.body.user;
    const updated = await userService.editUser(editedUser.userId, editedUser);
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user: updated,
    });
  } catch (error) {
    console.error("Error al editar usuario:", error.message);

    res.status(500).json({
      error: "No se pudo editar el usuario",
      details: error.message,
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const response = await userService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error al cambiar contraseña:", error.message);

    res.status(500).json({
      error: "No se pudo cambiar la contraseña",
      details: error.message,
    });
  }
};

module.exports = {
  getAllUsersController,
  editUserController,
  changePasswordController,
};
