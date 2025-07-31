const sharp = require('sharp');

/**
 * Transforma un buffer de imagen a formato WebP
 * @param {Buffer} buffer - Imagen original
 * @returns {Promise<Buffer>} - Imagen en WebP
 */
async function toWebP(buffer) {
  return await sharp(buffer)
    .webp({ quality: 80 }) // Ajustable según tu branding estético
    .toBuffer();
}

module.exports = { toWebP };
