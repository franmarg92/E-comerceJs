const {Address} = require ('../models')

const createAddress = async (userId, addressData) => {

  const existingAddresses = await Address.countDocuments({ user_id: userId });

  if (existingAddresses >= 4) {
    throw new Error('Máximo de 4 direcciones alcanzado');
  }

    const newAddress = new Address({
        userId: userId,
        ...addressData
    })
   return await newAddress.save(); 
}

const getUserAddresses = async (userId) => {
    const address = await Address.find({userId : userId})
    return address
}

const setDefaultAddress = async (userId, addressId) => {
  // Asegurate que la dirección pertenezca al usuario
  const address = await Address.findOne({ _id: addressId, user_id: userId });
  if (!address) throw new Error('Dirección no encontrada para este usuario');

  // Desactivar todas las direcciones del usuario
  await Address.updateMany({ user_id: userId }, { isDefault: false });

  // Activar la seleccionada
  address.isDefault = true;
  await address.save();

  return { message: 'Dirección predeterminada actualizada', address };
};


module.exports = {createAddress, getUserAddresses, setDefaultAddress }