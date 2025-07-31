const {Address} = require ('../models')

const createAddress = async (userId, addressData) => {

  const existingAddresses = await Address.countDocuments({ userId: userId });

  if (existingAddresses >= 4) {
    throw new Error('Máximo de 4 direcciones alcanzado');
  }

    const newAddress = new Address({
        userId: userId,
        ...addressData
    })
   return await newAddress.save(); 
}

const getUserAddressesByUserId = async (userId) => {
     return await Address.find({ userId });
}

const setDefaultAddress = async (userId, addressId) => {
  
  const address = await Address.findOne({ _id: addressId, user_id: userId });
  if (!address) throw new Error('Dirección no encontrada para este usuario');

  
  await Address.updateMany({ user_id: userId }, { isDefault: false });

  
  address.isDefault = true;
  await address.save();

  return { message: 'Dirección predeterminada actualizada', address };
};

const editAddress = async (addressId, userId, updates) => {
  const address = await Address.findOne({ _id: addressId, userId });

  if (!address) {
    throw new Error('No se encontró la dirección para editar');
  }

  Object.assign(address, updates); // Aplica los cambios

  return await address.save();
};

const deleteAddress = async (addressId, userId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, userId });

  if (!address) {
    throw new Error('No se encontró la dirección para eliminar');
  }

  return { message: 'Dirección eliminada exitosamente', address };
};


module.exports = {createAddress, getUserAddressesByUserId, setDefaultAddress, editAddress, deleteAddress }