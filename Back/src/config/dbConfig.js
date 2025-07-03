const mongoose = require('mongoose')
require('dotenv').config()


const initDB = async () => {
    const {connection} = await mongoose.connect(process.env.MONGO_URL)
    const url = `${connection.host} :${connection.port}`
    console.log(` MongoDB conectado ${url}` ) 
}


module.exports = {initDB}