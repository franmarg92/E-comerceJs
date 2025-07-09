const {Role} = require('../models')


const createRole = async (roleData) => {

    const newRole = new Role(roleData)
    await newRole.save();
    return{ success :true, Role : newRole}
}


module.exports= { createRole}