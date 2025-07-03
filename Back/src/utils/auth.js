const bcrypt = require('bcrypt')

const hashPassword = async (password) => {

    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
    
}

const checkPassword = async (enterPassword, hash) => {
    const result = await bcrypt.compare(enterPassword, hash)
    return result
    
}

module.exports = {hashPassword, checkPassword}