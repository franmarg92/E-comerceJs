const multer = require("multer");
const path = require("path");

// 📦 Configuración para guardar archivos en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rutaDestino = path.join(__dirname, "../../storage");
    cb(null, rutaDestino);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  }
});

// 🎯 Validación de tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)."));
  }
};

// 🧱 Configuración con almacenamiento y filtros para subida de imagen
const uploadWithFile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5MB
    files: 12 // Máximo total de archivos (principal, galería, etc.)
  },
  fileFilter
});

// ✨ Configuración simple para recibir solo campos sin imagen
const uploadNoFile = multer(); // Usa memoria para parsear campos tipo FormData sin archivo

module.exports = {
  uploadWithFile,
  uploadNoFile
};
