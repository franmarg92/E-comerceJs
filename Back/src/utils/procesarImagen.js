
const fs = require('fs/promises');
const path = require('path');
const {sharpMidleware} = require('../midleeware')

const procesarImagen = async (file, req) => {
  const bufferOriginal = await fs.readFile(file.path);
  const bufferFinal = await sharpMidleware.toWebP(bufferOriginal);

  const nombreFinal = `${Date.now()}-${file.originalname.split('.')[0]}.webp`;
  const rutaFinal = path.join(__dirname, '../storage/imgs', nombreFinal);

  await fs.writeFile(rutaFinal, bufferFinal);
  await fs.unlink(file.path);

  const imagenUrl = `${req.protocol}://${req.get('host')}/imgs/${nombreFinal}`;
  return imagenUrl;
};

module.exports = { procesarImagen };