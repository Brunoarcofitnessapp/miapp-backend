const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Ingredient = require("../models/ingredientModel");
const cloudinary = require("../util/cloudinary");
const multer = require("../util/multer");
const fs = require("fs");
const APIfeatures = require("../util/apifeatures");

// Middleware para subir imagen con Multer
exports.ingridentimageuploadmiddleware = multer.imageuploadmiddleware.single("image");

// Crear un ingrediente con imagen subida a Cloudinary
exports.createIngredient = catchAsync(async (req, res, next) => {
  const { name, unit } = req.body;

  if (!name || !unit || !req.file) {
    return next(new AppError("Please provide all the required fields, including an image", 400));
  }

  // Subir la imagen a Cloudinary
  const photo = await cloudinary.uploader.upload(req.file.path);

  if (photo.secure_url) {
    const ingredient = await Ingredient.create({
      name,
      unit,
      image: photo.secure_url,
    });

    // Eliminar el archivo local después de subirlo
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      status: "success",
      data: ingredient,
    });
  }
});

// Obtener todos los ingredientes con paginación y filtros
exports.getIngredients = catchAsync(async (req, res, next) => {
  const total = await Ingredient.find({}).countDocuments();

  const features = new APIfeatures(Ingredient.find({}), req.query)
    .filter()
    .sorting()
    .fieldslimiting()
    .pagination();

  const ingredients = await features.query;

  res.status(200).json({
    status: "success",
    data: ingredients,
    total,
  });
});
