const multer = require("multer");
const AppError = require("./appError");

// Configuración de almacenamiento para imágenes
const imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, "public/photos");
    } else {
      cb(new AppError("Only jpeg and png images are supported", 400), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.imageuploadmiddleware = multer({ storage: imagestorage });

// Configuración de almacenamiento para videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, "public/videos");
    } else {
      cb(new AppError("Only video files are supported", 400), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.multervideouploadmiddleware = multer({ storage: videoStorage });
