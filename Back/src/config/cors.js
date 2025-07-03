const cors = require('cors')

const corsConfig = {
    origin: function (origin, callback) {
        if (!origin || origin === process.env.FRONT_URL) {
            callback(null, true);
        } else {
            console.log("Bloqueado por CORS:", origin);
            callback(new Error('Error de cors'));
        }
    }
}

module.exports = corsConfig