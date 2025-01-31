const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Ingredient = require("../models/ingredientModel");
const cloudinary = require("../util/cloudinary");
const multer = require("multer");
const APIfeatures = require("../util/APIfeatures");

// Configuración de Multer para la subida de imágenes
const upload = multer({ storage: multer.memoryStorage() });

exports.createIngredient = [
  upload.single("image"), // Middleware para procesar la imagen
  catchAsync(async (req, res, next) => {
    const { name, unit } = req.body;

    if (!name || !unit) {
      return next(new AppError("Please provide all the required fields", 400));
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const ingredient = await Ingredient.create({
      name,
      unit,
      image: imageUrl,
    });

    res.status(201).json({
      status: "success",
      data: ingredient,
    });
  }),
];

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
