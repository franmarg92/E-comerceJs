const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       
        const rutaDestino = path.join(__dirname, "storage");  
        console.log("Guardando archivo en:", rutaDestino);
        cb(null, rutaDestino);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // ⬅️ máximo 5MB por archivo
        files: 12 // ⬅️ máximo total de archivos (imagenPrincipal + imagenMiniatura + galeria)
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)."));
        }
    },
});


module.exports = {upload};