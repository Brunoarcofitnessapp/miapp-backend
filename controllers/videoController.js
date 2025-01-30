const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const multer = require("../util/multer");
const cloudinary = require("../util/cloudinary");
const Video = require("../models/videoModel");
const fs = require("fs");

// Middleware para manejar la carga de videos
exports.uploadvideomiddleware = multer.multervideouploadmiddleware.single(
  "video"
);

// Crear un video
exports.createVideo = catchAsync(async (req, res, next) => {
  const { title, type } = req.body;

  if (!req.file) {
    return next(new AppError("Video file is required", 400));
  }

  if (!title || !type) {
    return next(new AppError("Please provide title and type", 400));
  }

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.file.path,
        { resource_type: "video" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    const video = await Video.create({
      title,
      video: uploadResult.secure_url,
      publicid: uploadResult.public_id,
      type,
    });

    // Eliminar el archivo del servidor después de subirlo
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: "success",
      data: video,
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Obtener todos los videos
exports.getAllVideos = catchAsync(async (req, res, next) => {
  const videos = await Video.find({});
  res.status(200).json({
    status: "success",
    data: videos,
  });
});
